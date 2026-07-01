// SegmentedControl.tsx
// Generic segmented control — a row of mutually-exclusive toggle buttons.

import type { ReactNode } from "react";

export interface SegmentOption<T extends string> {
  val: T;
  label: string;
  unit?: string; // small unit annotation shown tight after the label (e.g. "mm")
  icon?: ReactNode;
  sub?: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  // NoInfer: T is inferred only from `options`/`value`, not from the handler —
  // passing a setState (Dispatch<SetStateAction<T>>) here would otherwise poison
  // inference and collapse T to `string`.
  onChange: (val: NoInfer<T>) => void;
  ariaLabel: string;
}

export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <div className="seg" role="group" aria-label={ariaLabel}>
      {options.map((o) => (
        <button
          key={o.val}
          type="button"
          aria-pressed={value === o.val}
          onClick={() => onChange(o.val)}
        >
          {o.icon}
          {o.unit ? (
            <span className="lbl">
              {o.label}
              <span className="unit">{o.unit}</span>
            </span>
          ) : (
            o.label
          )}
          {o.sub && <span className="sub">{o.sub}</span>}
        </button>
      ))}
    </div>
  );
}
