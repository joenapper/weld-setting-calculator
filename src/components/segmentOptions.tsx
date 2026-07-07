// segmentOptions.tsx
// The option lists for each SegmentedControl.

import type { SegmentOption } from "./SegmentedControl";
import type {
  Electrode,
  Filler,
  Joint,
  Material,
  Position,
  Tungsten,
  Units,
  Wire,
} from "@/types/weld";
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

// MIG consumable — label is the metric ⌀, unit "mm", sub the imperial equivalent.
export const WIRE_OPTS: SegmentOption<Wire>[] = [
  { val: "0.6", label: "0.6", unit: "mm", sub: ".023″" },
  { val: "0.8", label: "0.8", unit: "mm", sub: ".030″" },
  { val: "0.9", label: "0.9", unit: "mm", sub: ".035″" },
  { val: "1.0", label: "1.0", unit: "mm", sub: ".040″" },
  { val: "1.2", label: "1.2", unit: "mm", sub: ".045″" },
];

// TIG consumables — label is the metric ⌀, unit "mm", sub the imperial equivalent.
export const FILLER_OPTS: SegmentOption<Filler>[] = [
  { val: "1.6", label: "1.6", unit: "mm", sub: "1/16″" },
  { val: "2.4", label: "2.4", unit: "mm", sub: "3/32″" },
  { val: "3.2", label: "3.2", unit: "mm", sub: "1/8″" },
];

export const TUNGSTEN_OPTS: SegmentOption<Tungsten>[] = [
  { val: "1.6", label: "1.6", unit: "mm", sub: "1/16″" },
  { val: "2.4", label: "2.4", unit: "mm", sub: "3/32″" },
];

// Stick consumable — label is the metric ⌀, unit "mm", sub the imperial equivalent.
export const ELECTRODE_OPTS: SegmentOption<Electrode>[] = [
  { val: "2.0", label: "2.0", unit: "mm", sub: "5/64″" },
  { val: "2.5", label: "2.5", unit: "mm", sub: "3/32″" },
  { val: "3.2", label: "3.2", unit: "mm", sub: "1/8″" },
  { val: "4.0", label: "4.0", unit: "mm", sub: "5/32″" },
];

export const UNIT_OPTS: SegmentOption<Units>[] = [
  { val: "mm", label: "mm" },
  { val: "in", label: "inch" },
];
