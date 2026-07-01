// migEngine.ts
// Pure, framework-agnostic MIG (GMAW) recommendation engine.
// All tunable values live in MIG.* — adjust these, not the UI.
// compute() takes mm thicknesses and returns display-ready strings + flags.

import type {
  Flag,
  Joint,
  Material,
  MigInput,
  MigResult,
  Position,
  Wire,
} from "../types/weld";

interface MaterialSpec {
  name: string; // human-readable name, used in advisory messages
  amp: number; // amperage multiplier vs mild steel
  vOff: number; // voltage offset (V) added on top of the base voltage curve
  gas: string; // recommended shielding gas
  clean: string | null; // optional advisory note shown as a flag
}

interface WireSpec {
  min: number; // lowest usable current for this wire (A)
  max: number; // highest single-pass current for this wire (A)
  k: number; // wire feed speed factor: IPM of wire fed per amp
  thickMax: number; // comfortable plate limit (mm); beyond this we advise a heavier wire (amber)
  hardMax: number; // hard plate limit (mm); beyond this the wire is unsuitable (red, not advised)
}

export const MIG = {
  ampsPerMM: 36, // ~1 A per 0.001" of steel, trimmed to real fillet-chart values

  material: {
    steel: {
      name: "mild steel",
      amp: 1.0,
      vOff: 0.0,
      gas: "75/25 Ar/CO₂ (C25)",
      clean: null,
    },
    stainless: {
      name: "stainless",
      amp: 0.88,
      vOff: -0.5,
      gas: "Tri-mix (He/Ar/CO₂) or 98/2 Ar/CO₂",
      clean:
        "Stainless runs cooler and shows heat tint — keep travel brisk and steady.",
    },
    aluminium: {
      name: "aluminium",
      amp: 1.25,
      vOff: 3.0,
      gas: "100% Argon",
      clean:
        "Aluminium needs a spool gun or push-pull feeder, spray transfer and a clean, oxide-free surface. Preheat heavier sections.",
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

  // operating window (A) per wire ⌀ (mm), k = IPM of wire feed per amp
  // (~1.9·(0.9/⌀)²), thickMax = comfortable plate limit, hardMax = hard plate limit.
  wire: {
    "0.6": { min: 30, max: 110, k: 4.28, thickMax: 3, hardMax: 8 },
    "0.8": { min: 35, max: 170, k: 2.41, thickMax: 6, hardMax: 16 },
    "0.9": { min: 50, max: 200, k: 1.9, thickMax: 10, hardMax: 28 },
    "1.0": { min: 70, max: 230, k: 1.54, thickMax: 12, hardMax: 36 },
    "1.2": { min: 95, max: 280, k: 1.07, thickMax: 20, hardMax: 48 },
  } as Record<Wire, WireSpec>,

  compute(inp: MigInput): MigResult {
    const mat = this.material[inp.material];
    const pos = this.position[inp.position];
    const jf = this.joint[inp.joint];
    const w = this.wire[inp.wire];
    const gov = Math.min(inp.thicknessA, inp.thicknessB); // governing (thinner) thickness, mm
    const wires = Object.keys(this.wire) as Wire[];

    // RED zone: the plate is past this wire's hard limit, so the combination is
    // not advised. Withhold the numbers (recommending precise settings would
    // contradict the warning) and point to a heavier wire or a stronger process.
    if (gov > w.hardMax) {
      const okWire = wires.find((d) => gov <= this.wire[d].hardMax);
      const advice = okWire
        ? `Use ${okWire} mm wire or heavier, or switch to a higher-output process (FCAW, stick, submerged-arc).`
        : `It's beyond practical MIG range — use FCAW, stick, or submerged-arc.`;
      return {
        process: "mig",
        amps: "—",
        volts: "—",
        wfs: "—",
        gas: mat.gas,
        transfer: "—",
        gov,
        recommended: false,
        flags: [
          {
            severity: "danger",
            text: `${inp.wire} mm wire isn't suitable for ${gov} mm ${mat.name} — for structural welds this configuration isn't advised. ${advice}`,
          },
        ],
      };
    }

    // amperage
    const demand = gov * this.ampsPerMM * mat.amp * pos * jf;
    const demandAmps = Math.round(demand);
    let amps = demand;
    let wireHeavy = false;
    let multipass = false;
    if (demand > w.max) {
      amps = w.max;
      multipass = true;
    } // one pass can't carry it
    else if (demand < w.min) {
      amps = w.min;
      wireHeavy = true;
    } // wire hotter than the job

    // thin plate: the wire whose current window matches the (low) demand —
    // used to recommend a thinner wire when burn-through is a risk.
    const bestWire =
      wires.find((d) => demand >= this.wire[d].min && demand <= this.wire[d].max) ??
      (demand < this.wire[wires[0]].min ? wires[0] : wires[wires.length - 1]);
    // thick plate: the lightest wire still practical for this thickness —
    // used to recommend a heavier wire for productivity/penetration.
    const bestThickWire =
      wires.find((d) => gov <= this.wire[d].thickMax) ?? wires[wires.length - 1];

    // voltage (tracks current; aluminium runs hotter for spray)
    let volts = 13 + 0.045 * amps + mat.vOff;
    volts = Math.max(13, Math.min(30, volts));

    // wire feed speed (IPM, approx and machine-dependent)
    const wfs = amps * w.k;

    // transfer mode
    let transfer = "Short-circuit";
    if (inp.material === "aluminium") transfer = "Spray";
    else if (amps >= 200) transfer = "Spray / globular (needs Ar-rich gas)";

    // ranges & rounding
    const round = (n: number, s: number) => Math.round(n / s) * s;
    const ampsLo = round(amps * 0.92, 5);
    const ampsHi = round(amps * 1.08, 5);
    const vLo = round(volts - 1, 0.5);
    const vHi = round(volts + 1, 0.5);
    const wLo = round(wfs * 0.8, 10);
    const wHi = round(wfs * 1.2, 10);

    // flags — everything below is amber advice; the config itself is OK to run
    const flags: Flag[] = [];
    const warn = (text: string) => flags.push({ severity: "warn", text });
    if (multipass) {
      if (gov > w.thickMax && this.wire[bestThickWire].thickMax > w.thickMax) {
        // wire is light for this thickness — a heavier wire is more productive
        warn(
          `${inp.wire} mm wire handles ${gov} mm ${mat.name}, but it's on the light side — expect several passes and mind your heat input and interpass temperature. ${bestThickWire} mm wire fills the joint in fewer passes.`,
        );
      } else if (gov > w.thickMax) {
        // already on the heaviest common wire and still past its practical range
        warn(
          `${gov} mm is heavy for MIG — even ${inp.wire} mm wire (the largest common size) needs many passes. These are sound per-pass settings, but a higher-output process such as FCAW or submerged-arc suits plate this thick.`,
        );
      } else {
        // wire suits the thickness; it just can't carry the joint in a single pass
        warn(
          `${gov} mm is past a single MIG pass — expect multiple passes. These are sound per-pass settings; add a root and fill/cap runs.`,
        );
      }
    }
    if (wireHeavy) {
      if (this.wire[bestWire].min < w.min) {
        // selected wire is oversized for the job — a thinner one matches better
        warn(
          `${gov} mm only needs ~${demandAmps} A — below the ${w.min} A floor for ${inp.wire} mm wire, so you risk blowing through. Drop to ${bestWire} mm wire, or run the low end and keep travel fast.`,
        );
      } else {
        // already on the thinnest wire — just run cool and travel fast
        warn(
          `At ${gov} mm the job wants less current than ${inp.wire} mm wire likes — run the low end and travel fast to avoid burn-through.`,
        );
      }
    }
    if (mat.clean) warn(mat.clean);
    if (inp.position === "vertical" || inp.position === "overhead")
      warn(
        `Out-of-position: settings trimmed ~15%. Use vertical-up with a slight weave and let the puddle freeze.`,
      );
    if (
      Math.max(inp.thicknessA, inp.thicknessB) >= gov * 2.0 &&
      Math.abs(inp.thicknessA - inp.thicknessB) >= 3
    )
      warn(
        `The members differ a lot in thickness — aim the arc at the heavier plate and let heat wash into the thin side.`,
      );

    return {
      process: "mig",
      amps: `${ampsLo}–${ampsHi}`,
      volts: `${vLo}–${vHi}`,
      wfs: `${wLo}–${wHi}`,
      gas: mat.gas,
      transfer,
      gov,
      flags,
      recommended: true,
    };
  },
};
