// tigEngine.ts
// Pure, framework-agnostic TIG (GTAW) recommendation engine.
// All tunable values live in TIG.* — adjust these, not the UI.
// compute() takes mm thicknesses and returns display-ready strings + flags.
// TIG outputs amperage, polarity (AC/DC), tungsten size and gas — no voltage or
// wire-feed.

import type {
  Filler,
  Flag,
  Joint,
  Material,
  Position,
  TigInput,
  TigResult,
  Tungsten,
} from "../types/weld";

interface MaterialSpec {
  name: string; // human-readable name, used in advisory messages
  amp: number; // amperage multiplier vs mild steel
  polarity: string; // AC vs DC + electrode polarity
  gas: string; // recommended shielding gas
  clean: string | null; // optional advisory note shown as a flag
}

interface TungstenSpec {
  min: number; // lowest usable current for this tungsten ⌀ (A)
  max: number; // highest usable current for this tungsten ⌀ (A)
  thickMax: number; // comfortable single-pass plate limit (mm)
  hardMax: number; // hard plate limit (mm); beyond this it's not advised
}

export const TIG = {
  ampsPerMM: 40, // rule of thumb: ~40 A per mm on steel

  material: {
    steel: {
      name: "mild steel",
      amp: 1.0,
      polarity: "DCEN (DC, electrode −)",
      gas: "100% Argon",
      clean: null,
    },
    stainless: {
      name: "stainless",
      amp: 0.9,
      polarity: "DCEN (DC, electrode −)",
      gas: "100% Argon",
      clean:
        "Stainless runs cooler and shows heat tint — keep travel steady and mind interpass temperature. Back-purge where it matters.",
    },
    aluminium: {
      name: "aluminium",
      amp: 1.3,
      polarity: "AC (oxide cleaning)",
      gas: "100% Argon",
      clean:
        "Aluminium needs AC for oxide cleaning, a clean oxide-free surface and a balled/truncated tungsten. Preheat heavier sections.",
    },
  } as Record<Material, MaterialSpec>,

  position: {
    flat: 1.0,
    horizontal: 0.97,
    vertical: 0.85,
    overhead: 0.85,
  } as Record<Position, number>,

  joint: { fillet: 1.0, butt: 1.05, lap: 1.0, corner: 1.0 } as Record<
    Joint,
    number
  >, // small penetration bias

  // current window (A) per tungsten ⌀ (mm) + practical plate limits.
  tungsten: {
    "1.6": { min: 20, max: 150, thickMax: 4, hardMax: 8 },
    "2.4": { min: 80, max: 250, thickMax: 10, hardMax: 20 },
  } as Record<Tungsten, TungstenSpec>,

  // rule of thumb: filler ⌀ ≈ governing thickness. Used only for advisories.
  fillerMM: { "1.6": 1.6, "2.4": 2.4, "3.2": 3.2 } as Record<Filler, number>,

  compute(inp: TigInput): TigResult {
    const mat = this.material[inp.material];
    const pos = this.position[inp.position];
    const jf = this.joint[inp.joint];
    const gov = Math.min(inp.thicknessA, inp.thicknessB); // governing (thinner) thickness, mm
    const sizes = Object.keys(this.tungsten) as Tungsten[];
    const biggest = sizes[sizes.length - 1];

    // RED zone: past the largest tungsten's practical range — hand TIG isn't
    // advised this thick. Withhold the numbers and point elsewhere.
    if (gov > this.tungsten[biggest].hardMax) {
      return {
        process: "tig",
        amps: "—",
        polarity: mat.polarity,
        tungsten: "—",
        gas: mat.gas,
        gov,
        recommended: false,
        flags: [
          {
            severity: "danger",
            text: `${gov} mm ${mat.name} is beyond practical hand-TIG range — it would need many passes or mechanised/keyhole TIG. Consider MIG, FCAW or submerged-arc for plate this thick.`,
          },
        ],
      };
    }

    // amperage demand, then the tungsten whose window carries it
    const demand = gov * this.ampsPerMM * mat.amp * pos * jf;
    const recTungsten =
      sizes.find((d) => demand <= this.tungsten[d].max) ?? biggest;
    const t = this.tungsten[recTungsten];

    let amps = demand;
    let multipass = false;
    if (demand > t.max) {
      amps = t.max;
      multipass = true; // one pass can't carry it
    } else if (demand < t.min) {
      amps = t.min; // floor at the tungsten's low end
    }

    // ranges & rounding
    const round = (n: number, s: number) => Math.round(n / s) * s;
    const ampsLo = round(amps * 0.9, 5);
    const ampsHi = round(amps * 1.1, 5);

    // flags — amber advice; the config is OK to run
    const flags: Flag[] = [];
    const warn = (text: string) => flags.push({ severity: "warn", text });

    if (mat.clean) warn(mat.clean);

    // the user's tungsten vs the size the current actually wants
    if (inp.tungsten !== recTungsten) {
      if (this.tungsten[inp.tungsten].max < demand) {
        warn(
          `${inp.tungsten} mm tungsten is light for ~${Math.round(demand)} A — it'll overheat and spit. Step up to ${recTungsten} mm.`,
        );
      } else {
        warn(
          `${inp.tungsten} mm tungsten works, but ${recTungsten} mm suits ~${Math.round(amps)} A better (steadier arc, less balling).`,
        );
      }
    }

    if (multipass) {
      warn(
        `${gov} mm is past a single TIG pass at sensible current — expect a root plus fill/cap runs. These are sound per-pass amps.`,
      );
    }

    // filler vs thickness rule of thumb (filler ⌀ ≈ governing thickness)
    const fillerMM = this.fillerMM[inp.filler];
    if (fillerMM > gov + 1) {
      warn(
        `${inp.filler} mm filler is heavy for ${gov} mm — it'll chill the puddle. A thinner rod (~${gov} mm) feeds more smoothly.`,
      );
    } else if (fillerMM < gov - 1.5) {
      warn(
        `${inp.filler} mm filler is thin for ${gov} mm — you'll add a lot of dabs. A heavier rod fills faster.`,
      );
    }

    if (inp.position === "vertical" || inp.position === "overhead") {
      warn(
        `Out-of-position: amps trimmed ~15%. Drop a touch more and let the puddle freeze between dabs.`,
      );
    }

    if (
      Math.max(inp.thicknessA, inp.thicknessB) >= gov * 2.0 &&
      Math.abs(inp.thicknessA - inp.thicknessB) >= 3
    ) {
      warn(
        `The members differ a lot in thickness — bias the arc onto the heavier plate and let heat wash into the thin side.`,
      );
    }

    return {
      process: "tig",
      amps: `${ampsLo}–${ampsHi}`,
      polarity: mat.polarity,
      tungsten: recTungsten, // size only — the card adds the "mm" unit
      gas: mat.gas,
      gov,
      flags,
      recommended: true,
    };
  },
};
