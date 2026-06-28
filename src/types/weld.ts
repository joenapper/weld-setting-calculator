// Shared domain types for the weld setting calculator.
// Thickness is always stored in mm (the canonical unit); inch is a display-only
// conversion handled in the UI layer.

export type Material = "steel" | "stainless" | "aluminium";
export type Joint = "fillet" | "butt" | "lap" | "corner";
export type Position = "flat" | "horizontal" | "vertical" | "overhead";
export type Wire = "0.6" | "0.8" | "0.9" | "1.0" | "1.2";
export type Units = "mm" | "in";

export interface MigInput {
  material: Material;
  joint: Joint;
  position: Position;
  wire: Wire;
  thicknessA: number; // member A thickness, mm
  thicknessB: number; // member B thickness, mm
}

export type Severity = "warn" | "danger"; // amber advisory vs red "not advised"

export interface Flag {
  text: string;
  severity: Severity;
}

export interface MigResult {
  amps: string; // display range, e.g. "105–125" (or "—" when not recommended)
  volts: string;
  wfs: string; // wire feed speed range, IPM
  gas: string;
  transfer: string;
  gov: number; // governing (thinner) thickness, mm
  flags: Flag[];
  recommended: boolean; // false when the config is unsafe — UI withholds the numbers
}
