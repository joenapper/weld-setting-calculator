// ThicknessControl.tsx
// A single member's thickness input: a range slider paired with a number box.
// State is always held in mm by the parent; this control converts to/from the
// active display units.

import type { ChangeEvent, CSSProperties } from "react";
import { MM_MIN, inToMm, mmToIn, r1 } from "@/lib/weldConfig";
import type { Units } from "@/types/weld";

interface ThicknessControlProps {
  name: string;
  valueMM: number;
  onChangeMM: (mm: number) => void;
  units: Units;
  maxMM: number;
}

export default function ThicknessControl({
  name,
  valueMM,
  onChangeMM,
  units,
  maxMM,
}: ThicknessControlProps) {
  const isMM = units === "mm";
  const dispVal = isMM ? r1(valueMM) : +mmToIn(valueMM).toFixed(3); // numeric value bound to the inputs, in display units
  const fmtVal = isMM ? r1(valueMM).toFixed(1) : mmToIn(valueMM).toFixed(3); // pretty string shown in the readout
  const fill = ((valueMM - MM_MIN) / (maxMM - MM_MIN)) * 100; // % of the slider track that's filled
  const range = {
    // slider/number bounds + step, expressed in display units
    min: isMM ? MM_MIN : +mmToIn(MM_MIN).toFixed(3),
    max: isMM ? maxMM : +mmToIn(maxMM).toFixed(3),
    step: isMM ? 0.5 : 0.01,
  };
  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = parseFloat(e.target.value) || 0;
    const mm = isMM ? raw : inToMm(raw); // normalise back to mm before lifting state up
    onChangeMM(Math.max(MM_MIN, Math.min(maxMM, mm)));
  };
  return (
    <div className="ctl">
      <div className="top">
        <div className="name">{name}</div>
        <div className="read">
          {fmtVal}
          <span>{isMM ? "mm" : "in"}</span>
        </div>
      </div>
      <div className="row">
        <input
          type="range"
          {...range}
          value={dispVal}
          onChange={onInput}
          // dynamic slider fill — a CSS custom property, set inline by necessity
          style={{ "--fill": `${fill}%` } as CSSProperties}
          aria-label={`${name} thickness`}
        />
        <input
          type="number"
          {...range}
          value={dispVal}
          onChange={onInput}
          aria-label={`${name} thickness value`}
        />
      </div>
    </div>
  );
}
