// WeldCalculator.tsx
// The MIG weld setting calculator: holds the input state, runs the engine on
// every render, and lays out the controls, live cross-section, and results.

import { useState } from "react";
import { MIG } from "../../lib/migEngine";
import { JOINT_MAX, MM_MIN, ROLES } from "../../lib/weldConfig";
import type { Joint, Material, Position, Units, Wire } from "../../types/weld";
import SegmentedControl from "./SegmentedControl";
import {
  JOINT_OPTS,
  MATERIAL_OPTS,
  POSITION_OPTS,
  UNIT_OPTS,
  WIRE_OPTS,
} from "./segmentOptions";
import ThicknessControl from "./ThicknessControl";
import JointSection from "./JointSection";
import ResultsCard from "./ResultsCard";
import "./weld-calculator.css";

const clampMM = (mm: number, maxMM: number): number =>
  Math.max(MM_MIN, Math.min(maxMM, mm));

export default function WeldCalculator() {
  const [material, setMaterial] = useState<Material>("steel");
  const [joint, setJoint] = useState<Joint>("fillet");
  const [position, setPosition] = useState<Position>("flat");
  const [wire, setWire] = useState<Wire>("0.8");
  const [units, setUnits] = useState<Units>("mm");
  const [a, setA] = useState(3); // member A thickness, mm
  const [b, setB] = useState(3); // member B thickness, mm

  const maxMM = JOINT_MAX[joint];

  // switching joint re-clamps both members into the new allowed range
  const onJoint = (j: Joint) => {
    const hi = JOINT_MAX[j];
    setA((v) => clampMM(v, hi));
    setB((v) => clampMM(v, hi));
    setJoint(j);
  };

  const result = MIG.compute({ material, joint, position, wire, thicknessA: a, thicknessB: b });
  const [roleA, roleB] = ROLES[joint];

  return (
    <div className="weld-tool">
      <div className="tool">
        <div className="head">
          <h1>Setting Calculator</h1>
          <div className="proc">
            <span className="chip on">MIG</span>
            <span className="chip soon">TIG</span>
            <span className="chip soon">Stick</span>
          </div>
        </div>

        <div className="body">
          <div className="field">
            <div className="units">
              <SegmentedControl options={UNIT_OPTS} value={units} onChange={setUnits} ariaLabel="Units" />
            </div>
            <label>Material</label>
            <SegmentedControl options={MATERIAL_OPTS} value={material} onChange={setMaterial} ariaLabel="Material" />
          </div>

          <div className="field">
            <label>Joint type</label>
            <SegmentedControl options={JOINT_OPTS} value={joint} onChange={onJoint} ariaLabel="Joint type" />
          </div>

          <div className="field">
            <label>Position</label>
            <SegmentedControl options={POSITION_OPTS} value={position} onChange={setPosition} ariaLabel="Welding position" />
          </div>

          <div className="field">
            <label>Wire diameter</label>
            <SegmentedControl options={WIRE_OPTS} value={wire} onChange={setWire} ariaLabel="Wire diameter" />
          </div>

          <div className="field">
            <label>Material thickness</label>
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

            <JointSection joint={joint} units={units} position={position} a={a} b={b} />
          </div>
        </div>

        <ResultsCard result={result} units={units} />

        <div className="note">
          Solid-wire (GMAW) starting points for short-circuit / spray transfer, modelled on common manufacturer
          chart values — <b>not a substitute for a WPS</b>. Every machine, wire and gas combination runs a little
          differently: set these, weld a test bead on scrap of the same thickness <b>in the position you'll weld</b>,
          then fine-tune by arc sound and bead shape. Mismatched thicknesses are calculated on the thinner
          (governing) member, which burns through first.
        </div>
      </div>
    </div>
  );
}
