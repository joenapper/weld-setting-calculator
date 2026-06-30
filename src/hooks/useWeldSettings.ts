// useWeldSettings.ts
// The weld calculator's state and behaviour: the input selections, the
// joint-change clamping rule, and the engine result derived from them. Kept
// separate from WeldCalculator so the component is pure composition.

import { useState } from "react";
import { MIG } from "@/lib/migEngine";
import { JOINT_MAX, MM_MIN } from "@/lib/weldConfig";
import type { Joint, Material, Position, Units, Wire } from "@/types/weld";

const clampMM = (mm: number, maxMM: number): number =>
  Math.max(MM_MIN, Math.min(maxMM, mm));

export function useWeldSettings() {
  const [material, setMaterial] = useState<Material>("steel");
  const [joint, setJoint] = useState<Joint>("fillet");
  const [position, setPosition] = useState<Position>("flat");
  const [wire, setWire] = useState<Wire>("0.8");
  const [units, setUnits] = useState<Units>("mm");
  const [a, setA] = useState(3); // member A thickness, mm
  const [b, setB] = useState(3); // member B thickness, mm

  // switching joint re-clamps both members into the new allowed range
  const onJoint = (j: Joint) => {
    const hi = JOINT_MAX[j];
    setA((v) => clampMM(v, hi));
    setB((v) => clampMM(v, hi));
    setJoint(j);
  };

  const result = MIG.compute({ material, joint, position, wire, thicknessA: a, thicknessB: b });

  return {
    material,
    setMaterial,
    joint,
    onJoint,
    position,
    setPosition,
    wire,
    setWire,
    units,
    setUnits,
    a,
    setA,
    b,
    setB,
    result,
  };
}

export type WeldSettings = ReturnType<typeof useWeldSettings>;
