// WeldInputs.tsx
// The weld-parameter input panel: material, joint, position, wire and thickness.
// State lives in the parent so the live preview and results can read it too;
// this component just renders the controls and reports changes back up.

import type { Dispatch, SetStateAction } from "react";
import { JOINT_MAX, ROLES } from "@/lib/weldConfig";
import type { Joint, Material, Position, Units, Wire } from "@/types/weld";
import SegmentedControl from "./SegmentedControl";
import {
  JOINT_OPTS,
  MATERIAL_OPTS,
  POSITION_OPTS,
  UNIT_OPTS,
  WIRE_OPTS,
} from "./segmentOptions";
import ThicknessControl from "./ThicknessControl";

interface WeldInputsProps {
  units: Units;
  setUnits: Dispatch<SetStateAction<Units>>;
  material: Material;
  setMaterial: Dispatch<SetStateAction<Material>>;
  joint: Joint;
  onJoint: (joint: Joint) => void;
  position: Position;
  setPosition: Dispatch<SetStateAction<Position>>;
  wire: Wire;
  setWire: Dispatch<SetStateAction<Wire>>;
  a: number;
  setA: Dispatch<SetStateAction<number>>;
  b: number;
  setB: Dispatch<SetStateAction<number>>;
}

export default function WeldInputs({
  units,
  setUnits,
  material,
  setMaterial,
  joint,
  onJoint,
  position,
  setPosition,
  wire,
  setWire,
  a,
  setA,
  b,
  setB,
}: WeldInputsProps) {
  const maxMM = JOINT_MAX[joint];
  const [roleA, roleB] = ROLES[joint];

  // Each control is a labelled group (SegmentedControl sets aria-label), so the
  // visible captions are headings, not <label>s — a <label> with no associated
  // form control is an accessibility error.
  return (
    <section className="body" aria-label="Weld parameters">
      <div className="field">
        <div className="units">
          <SegmentedControl options={UNIT_OPTS} value={units} onChange={setUnits} ariaLabel="Units" />
        </div>
        <span className="field-label">Material</span>
        <SegmentedControl options={MATERIAL_OPTS} value={material} onChange={setMaterial} ariaLabel="Material" />
      </div>

      <div className="field">
        <span className="field-label">Joint type</span>
        <SegmentedControl options={JOINT_OPTS} value={joint} onChange={onJoint} ariaLabel="Joint type" />
      </div>

      <div className="field">
        <span className="field-label">Position</span>
        <SegmentedControl options={POSITION_OPTS} value={position} onChange={setPosition} ariaLabel="Welding position" />
      </div>

      <div className="field">
        <span className="field-label">Wire diameter</span>
        <SegmentedControl options={WIRE_OPTS} value={wire} onChange={setWire} ariaLabel="Wire diameter" />
      </div>

      <div className="field">
        <span className="field-label">Material thickness</span>
        {joint === "butt" && (
          <div className="cap-note">
            <span className="dot" />
            <span>
              Butt joints are capped at <b>6&nbsp;mm</b> — the single-pass MIG range. Thicker plate needs
              multiple passes.
            </span>
          </div>
        )}
        <div className="grid2">
          <ThicknessControl name={roleA} valueMM={a} onChangeMM={setA} units={units} maxMM={maxMM} />
          <ThicknessControl name={roleB} valueMM={b} onChangeMM={setB} units={units} maxMM={maxMM} />
        </div>
      </div>
    </section>
  );
}
