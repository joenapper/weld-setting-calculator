// useWeldSettings.ts
// The weld calculator's state and behaviour: the input selections (including the
// chosen process and its consumables), the joint-change clamping rule, and the
// engine result derived from them. Kept separate from WeldCalculator so the
// component is pure composition.

import { useState } from "react";
import { MIG } from "@/lib/migEngine";
import { TIG } from "@/lib/tigEngine";
import { STICK } from "@/lib/stickEngine";
import { JOINT_MAX, MM_MIN } from "@/lib/weldConfig";
import type {
  Electrode,
  Filler,
  Joint,
  Material,
  Position,
  Process,
  Tungsten,
  Units,
  WeldResult,
  Wire,
} from "@/types/weld";

const clampMM = (mm: number, maxMM: number): number =>
  Math.max(MM_MIN, Math.min(maxMM, mm));

export function useWeldSettings() {
  // --- shared across every process ---
  const [process, setProcess] = useState<Process>("mig");
  const [material, setMaterial] = useState<Material>("steel");
  const [joint, setJoint] = useState<Joint>("fillet");
  const [position, setPosition] = useState<Position>("flat");
  const [units, setUnits] = useState<Units>("mm");
  const [a, setA] = useState(3); // member A thickness, mm
  const [b, setB] = useState(3); // member B thickness, mm

  // --- MIG consumable ---
  const [wire, setWire] = useState<Wire>("0.8");

  // --- TIG consumables ---
  const [filler, setFiller] = useState<Filler>("2.4");
  // 1.6 mm suits the default config (steel/fillet/flat/3 mm ≈ 120 A) so the
  // initial TIG state has no advisory
  const [tungsten, setTungsten] = useState<Tungsten>("1.6");

  // --- Stick consumable ---
  const [electrode, setElectrode] = useState<Electrode>("3.2");

  // switching joint re-clamps both members into the new allowed range
  const onJoint = (j: Joint) => {
    const hi = JOINT_MAX[j];
    setA((v) => clampMM(v, hi));
    setB((v) => clampMM(v, hi));
    setJoint(j);
  };

  // dispatch to the engine for the selected process (each takes the shared
  // inputs plus its own consumable(s))
  const resolveResult = (): WeldResult => {
    const shared = { material, joint, position, thicknessA: a, thicknessB: b };
    switch (process) {
      case "tig":
        return TIG.compute({ ...shared, filler, tungsten });
      case "stick":
        return STICK.compute({ ...shared, electrode });
      default:
        return MIG.compute({ ...shared, wire });
    }
  };
  const result = resolveResult();

  return {
    // shared
    process,
    setProcess,
    material,
    setMaterial,
    joint,
    onJoint,
    position,
    setPosition,
    units,
    setUnits,
    a,
    setA,
    b,
    setB,
    // MIG
    wire,
    setWire,
    // TIG
    filler,
    setFiller,
    tungsten,
    setTungsten,
    // Stick
    electrode,
    setElectrode,
    // engine output for the active process
    result,
  };
}

export type WeldSettings = ReturnType<typeof useWeldSettings>;
