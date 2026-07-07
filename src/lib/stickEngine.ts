// stickEngine.ts
// Pure, framework-agnostic Stick (SMAW / MMA) recommendation engine.
// All tunable values live in STICK.* — adjust these, not the UI.
// compute() takes mm thicknesses and returns display-ready strings + flags.
// Stick outputs an amperage range, a polarity note and a recommended electrode —
// no voltage, no gas, no wire-feed.

import type {
  Electrode,
  Flag,
  Joint,
  Material,
  Position,
  StickInput,
  StickResult,
} from "../types/weld";

interface MaterialSpec {
  name: string; // human-readable name, used in advisory messages
  amp: number; // amperage multiplier vs mild steel
  polarity: string; // polarity note (electrode-dependent, so it's guidance)
  clean: string | null; // optional advisory note shown as a flag
}

interface ElectrodeSpec {
  min: number; // lowest usable current for this electrode ⌀ (A)
  max: number; // highest usable current for this electrode ⌀ (A)
}

export const STICK = {
  ampsPerMM: 38, // rule of thumb for mild steel

  material: {
    steel: {
      name: "mild steel",
      amp: 1.0,
      polarity: "DCEP — most rods (E6013/6011 also AC)",
      clean: null,
    },
    stainless: {
      name: "stainless",
      amp: 0.9,
      polarity: "DCEP — matching stainless rod",
      clean:
        "Stainless rods run cooler with a fluid flux — keep a tight arc, steady travel and watch interpass temperature. Use a matching rod (e.g. 308L / 316L).",
    },
    aluminium: {
      name: "aluminium",
      amp: 1.15,
      polarity: "DCEP — last resort on aluminium",
      clean:
        "Stick on aluminium is difficult and rarely worth it below ~4 mm; TIG or MIG gives far better results. Preheat and move fast.",
    },
  } as Record<Material, MaterialSpec>,

  // Stick derates more than MIG/TIG out of position.
  position: {
    flat: 1.0,
    horizontal: 0.95,
    vertical: 0.8,
    overhead: 0.8,
  } as Record<Position, number>,

  joint: { fillet: 1.0, butt: 1.05, lap: 1.0, corner: 1.0 } as Record<
    Joint,
    number
  >, // small penetration bias

  // rated current window (A) per electrode ⌀ (mm)
  electrode: {
    "2.0": { min: 40, max: 70 },
    "2.5": { min: 60, max: 90 },
    "3.2": { min: 90, max: 140 },
    "4.0": { min: 140, max: 190 },
  } as Record<Electrode, ElectrodeSpec>,

  compute(inp: StickInput): StickResult {
    const mat = this.material[inp.material];
    const pos = this.position[inp.position];
    const jf = this.joint[inp.joint];
    const gov = Math.min(inp.thicknessA, inp.thicknessB); // governing (thinner) thickness, mm
    const sizes = Object.keys(this.electrode) as Electrode[];

    // amperage the joint wants, then the rod whose rated window carries it
    const demand = gov * this.ampsPerMM * mat.amp * pos * jf;
    const recElec =
      sizes.find(
        (d) => demand >= this.electrode[d].min && demand <= this.electrode[d].max,
      ) ??
      (demand < this.electrode[sizes[0]].min ? sizes[0] : sizes[sizes.length - 1]);

    // clamp the shown amps to the chosen rod's rated window
    const e = this.electrode[inp.electrode];
    let amps = demand;
    let multipass = false;
    let elecHot = false;
    if (demand > e.max) {
      amps = e.max;
      multipass = true; // rod can't carry the joint in a single pass
    } else if (demand < e.min) {
      amps = e.min;
      elecHot = true; // rod hotter than the job needs
    }

    const round = (n: number, s: number) => Math.round(n / s) * s;
    const ampsLo = Math.max(e.min, round(amps * 0.9, 5));
    const ampsHi = Math.min(e.max, round(amps * 1.1, 5));

    // flags — amber advice; the config is OK to run
    const flags: Flag[] = [];
    const warn = (text: string) => flags.push({ severity: "warn", text });
    const demandAmps = Math.round(demand);

    if (mat.clean) warn(mat.clean);

    if (inp.electrode !== recElec) {
      if (multipass) {
        warn(
          `${inp.electrode} mm rod is light for ${gov} mm (~${demandAmps} A) — expect several passes. ${recElec} mm carries it in fewer.`,
        );
      } else if (elecHot) {
        warn(
          `${inp.electrode} mm rod is hot for ${gov} mm — even its ${e.min} A floor risks burn-through. Drop to ${recElec} mm.`,
        );
      } else {
        warn(`${recElec} mm rod suits ~${Math.round(amps)} A better than ${inp.electrode} mm.`);
      }
    } else if (multipass) {
      warn(
        `${gov} mm is past a single pass with ${inp.electrode} mm rod — run a root plus fill/cap passes.`,
      );
    } else if (elecHot) {
      warn(
        `${gov} mm wants less than the ${e.min} A floor of even a ${inp.electrode} mm rod — run the low end, travel fast, and consider TIG for thin work.`,
      );
    }

    if (inp.position === "vertical" || inp.position === "overhead") {
      warn(
        `Out of position: amps trimmed ~20%. Use a smaller rod and a stiff, tight arc — vertical-up with a slight weave, or a fast-freeze rod for vertical-down.`,
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
      process: "stick",
      amps: `${ampsLo}–${ampsHi}`,
      polarity: mat.polarity,
      electrode: recElec, // size only — the card adds the "mm" unit
      gov,
      flags,
      recommended: true, // every thickness in range is weldable (thin rod / multipass)
    };
  },
};
