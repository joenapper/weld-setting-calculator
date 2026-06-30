// segmentOptions.tsx
// The option lists for each SegmentedControl.

import type { SegmentOption } from "./SegmentedControl";
import type { Joint, Material, Position, Units, Wire } from "@/types/weld";
import { ButtJoint, CornerJoint, FilletJoint, LapJoint } from "@/icons/JointIcons";
import {
  FlatPosition,
  HorizontalPosition,
  OverheadPosition,
  VerticalPosition,
} from "@/icons/PositionIcons";

export const JOINT_OPTS: SegmentOption<Joint>[] = [
  { val: "fillet", label: "Fillet", icon: <FilletJoint /> },
  { val: "butt", label: "Butt", icon: <ButtJoint /> },
  { val: "lap", label: "Lap", icon: <LapJoint /> },
  { val: "corner", label: "Corner", icon: <CornerJoint /> },
];

export const MATERIAL_OPTS: SegmentOption<Material>[] = [
  { val: "steel", label: "Mild steel" },
  { val: "stainless", label: "Stainless" },
  { val: "aluminium", label: "Aluminium" },
];

export const POSITION_OPTS: SegmentOption<Position>[] = [
  { val: "flat", label: "Flat", icon: <FlatPosition /> },
  { val: "horizontal", label: "Horizontal", icon: <HorizontalPosition /> },
  { val: "vertical", label: "Vertical", icon: <VerticalPosition /> },
  { val: "overhead", label: "Overhead", icon: <OverheadPosition /> },
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
