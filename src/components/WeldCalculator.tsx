// WeldCalculator.tsx
// The weld setting calculator screen: composes the header, input panel, live
// cross-section and results. All state/behaviour lives in useWeldSettings.

import { useWeldSettings } from "@/hooks/useWeldSettings";
import WeldHeader from "./WeldHeader";
import WeldInputs from "./WeldInputs";
import JointSection from "./JointSection";
import ResultsCard from "./ResultsCard";
import WeldFooter from "./WeldFooter";
import "./weld-calculator.css";

export default function WeldCalculator() {
  const {
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
  } = useWeldSettings();

  return (
    <div className="weld-tool">
      <div className="tool">
        <WeldHeader />

        <main className="layout">
          <WeldInputs
            units={units}
            setUnits={setUnits}
            material={material}
            setMaterial={setMaterial}
            joint={joint}
            onJoint={onJoint}
            position={position}
            setPosition={setPosition}
            wire={wire}
            setWire={setWire}
            a={a}
            setA={setA}
            b={b}
            setB={setB}
          />

          <div className="preview">
            <JointSection joint={joint} units={units} position={position} material={material} a={a} b={b} />
            <ResultsCard result={result} units={units} />
          </div>
        </main>

        <WeldFooter />
      </div>
    </div>
  );
}
