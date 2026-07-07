// Shared domain types for the weld setting calculator.
// Thickness is always stored in mm (the canonical unit); inch is a display-only
// conversion handled in the UI layer.

export type Material = "steel" | "stainless" | "aluminium";
export type Joint = "fillet" | "butt" | "lap" | "corner";
export type Position = "flat" | "horizontal" | "vertical" | "overhead";
export type Units = "mm" | "in";

export type Process = "mig" | "tig" | "stick";

export type Wire = "0.6" | "0.8" | "0.9" | "1.0" | "1.2"; // MIG wire ⌀ (mm)
export type Filler = "1.6" | "2.4" | "3.2"; // TIG filler rod ⌀ (mm)
export type Tungsten = "1.6" | "2.4"; // TIG tungsten electrode ⌀ (mm)
export type Electrode = "2.0" | "2.5" | "3.2" | "4.0"; // Stick electrode ⌀ (mm)

export interface MigInput {
  material: Material;
  joint: Joint;
  position: Position;
  wire: Wire;
  thicknessA: number; // member A thickness, mm
  thicknessB: number; // member B thickness, mm
}

export interface TigInput {
  material: Material;
  joint: Joint;
  position: Position;
  filler: Filler;
  tungsten: Tungsten;
  thicknessA: number; // member A thickness, mm
  thicknessB: number; // member B thickness, mm
}

export interface StickInput {
  material: Material;
  joint: Joint;
  position: Position;
  electrode: Electrode;
  thicknessA: number; // member A thickness, mm
  thicknessB: number; // member B thickness, mm
}

export type Severity = "warn" | "danger"; // amber advisory vs red "not advised"

export interface Flag {
  text: string;
  severity: Severity;
}

export interface MigResult {
  process: "mig"; // discriminant for WeldResult
  amps: string; // display range, e.g. "105–125" (or "—" when not recommended)
  volts: string;
  wfs: string; // wire feed speed range, IPM
  gas: string;
  transfer: string;
  gov: number; // governing (thinner) thickness, mm
  flags: Flag[];
  recommended: boolean; // false when the config is unsafe — UI withholds the numbers
}

export interface TigResult {
  process: "tig"; // discriminant for WeldResult
  amps: string; // display range, A (or "—" when not recommended)
  polarity: string; // AC / DC + electrode polarity
  tungsten: string; // recommended tungsten ⌀ for the amperage
  gas: string;
  gov: number; // governing (thinner) thickness, mm
  flags: Flag[];
  recommended: boolean;
}

export interface StickResult {
  process: "stick"; // discriminant for WeldResult
  amps: string; // display range, A (or "—" when not recommended)
  polarity: string; // polarity note (electrode-dependent)
  electrode: string; // recommended electrode ⌀ for the thickness
  gov: number; // governing (thinner) thickness, mm
  flags: Flag[];
  recommended: boolean;
}

// Any engine's output — discriminated by `process` so the UI can narrow.
export type WeldResult = MigResult | TigResult | StickResult;
