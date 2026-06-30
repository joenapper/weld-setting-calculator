// WeldInputs.tsx
// The weld-parameter input panel: reads the shared settings from context and
// renders the material, joint, position, wire and thickness controls.

import { JOINT_MAX, ROLES } from "@/lib/weldConfig";
import { useWeldSettingsContext } from "@/context/WeldSettingsContext";
import SegmentedControl from "./SegmentedControl";
import {
  JOINT_OPTS,
  MATERIAL_OPTS,
  POSITION_OPTS,
  UNIT_OPTS,
  WIRE_OPTS,
} from "./segmentOptions";
import ThicknessControl from "./ThicknessControl";

export default function WeldInputs() {
  const {
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
  } = useWeldSettingsContext();

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
