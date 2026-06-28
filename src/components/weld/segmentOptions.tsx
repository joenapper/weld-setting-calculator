// segmentOptions.tsx
// The option lists for each SegmentedControl, plus a small icon helper.

import type { ReactNode } from "react";
import type { SegmentOption } from "./SegmentedControl";
import type { Joint, Material, Position, Units, Wire } from "../../types/weld";

// Wraps raw SVG <path> children in a 24x24 stroked icon (styled via CSS .ic).
const icon = (paths: ReactNode): ReactNode => (
  <svg viewBox="0 0 24 24">
    <g className="ic">{paths}</g>
  </svg>
);

export const JOINT_OPTS: SegmentOption<Joint>[] = [
  { val: "fillet", label: "Fillet", icon: icon(<><path d="M4 19h16" /><path d="M11 19V5" /><path d="M11 19l4-4" /></>) },
  { val: "butt", label: "Butt", icon: icon(<><path d="M3 12h7" /><path d="M14 12h7" /><path d="M12 8v8" /></>) },
  { val: "lap", label: "Lap", icon: icon(<><path d="M3 14h12" /><path d="M9 10h12" /></>) },
  { val: "corner", label: "Corner", icon: icon(<path d="M6 4v16h14" />) },
];

export const MATERIAL_OPTS: SegmentOption<Material>[] = [
  { val: "steel", label: "Mild steel" },
  { val: "stainless", label: "Stainless" },
  { val: "aluminium", label: "Aluminium" },
];

export const POSITION_OPTS: SegmentOption<Position>[] = [
  { val: "flat", label: "Flat" },
  { val: "horizontal", label: "Horizontal" },
  { val: "vertical", label: "Vertical" },
  { val: "overhead", label: "Overhead" },
];

// sub = the imperial equivalent of each metric wire diameter.
export const WIRE_OPTS: SegmentOption<Wire>[] = [
  { val: "0.6", label: "0.6", sub: ".023″" },
  { val: "0.8", label: "0.8", sub: ".030″" },
  { val: "0.9", label: "0.9", sub: ".035″" },
  { val: "1.0", label: "1.0", sub: ".040″" },
  { val: "1.2", label: "1.2", sub: ".045″" },
];

export const UNIT_OPTS: SegmentOption<Units>[] = [
  { val: "mm", label: "mm" },
  { val: "in", label: "inch" },
];
