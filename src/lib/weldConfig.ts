// weldConfig.ts
// UI-side domain constants and unit helpers shared across the weld components.

import type { Joint, Units } from "@/types/weld";

export const MM_MIN = 0.5; // smallest thickness the UI allows
export const MM_PER_IN = 25.4;

// Max thickness per joint. Butt is capped to the single-pass MIG range.
export const JOINT_MAX: Record<Joint, number> = {
  fillet: 25,
  butt: 6,
  lap: 25,
  corner: 25,
};

// Display labels for the two members [A, B] of each joint.
export const ROLES: Record<Joint, [string, string]> = {
  fillet: ["Upright member", "Base plate"],
  butt: ["Left plate", "Right plate"],
  lap: ["Top plate", "Bottom plate"],
  corner: ["Vertical leg", "Bottom leg"],
};

export const r1 = (n: number): number => Math.round(n * 10) / 10;
export const mmToIn = (mm: number): number => mm / MM_PER_IN;
export const inToMm = (inch: number): number => inch * MM_PER_IN;

// Format a mm thickness for display in the active units.
export const fmtThickness = (mm: number, units: Units): string =>
  units === "mm" ? `${r1(mm)} mm` : `${mmToIn(mm).toFixed(3)} in`;
