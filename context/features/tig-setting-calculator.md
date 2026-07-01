# TIG Weld Setting Calculator

Add the TIG process end-to-end — a TIG recommendation engine, TIG-specific
consumable inputs, and a TIG results view — selectable alongside MIG via the
process selector. Builds on the shared-state context so the new process-specific
state slots in without prop changes, and mirrors the patterns from the MIG
calculator. Domain rules per [project-overview](../project-overview.md).

## Status

Complete — 2026-07-01

## Goals

- Make the process selector functional for TIG (MIG ↔ TIG; Stick stays "soon").
  Add a `process` field to the shared settings.
- TIG engine (`src/lib/tigEngine.ts`) following the MIG engine's data-driven
  pattern — baselines + lookup tables + modifiers, kept tunable in `src/lib`.
  - Outputs: amperage range, polarity (AC/DC), recommended tungsten size, and
    shielding gas. **No voltage / wire-feed** for TIG.
- TIG consumable inputs: filler size (1.6 / 2.4 / 3.2 mm) and tungsten size
  (1.6 / 2.4 mm), shown in place of MIG's wire-diameter control when TIG is
  selected.
- Process-aware inputs: the right consumable control(s) per process; shared
  controls (material, joint, position, units, thickness) stay.
- Process-aware results: the TIG card shows amperage, AC/DC, tungsten and gas
  (no voltage/WFS).
- Reuse the live joint illustration unchanged (joint geometry is
  process-independent).
- Keep severity-tiered advisories where they apply (e.g. thickness vs
  tungsten/filler suitability), as the MIG engine does.

## Domain notes (TIG)

- **Polarity:** DCEN for mild steel and stainless; AC for aluminium (oxide
  cleaning).
- **Amperage:** rule of thumb ~40 A per mm on steel; aluminium runs hotter (AC);
  stainless a touch lower. Derate for vertical / overhead positions.
- **Tungsten size** scales with amperage/thickness (≈1.6 mm at lower amps/thin,
  2.4 mm higher up).
- **Gas:** Argon for steel / stainless / aluminium (TIG default). Ar/He mixes for
  thick aluminium are a possible future modifier.

## Approach / notes

- Add `process` + TIG consumables (filler, tungsten) to `useWeldSettings`;
  consumers read them via context — no prop wiring needed thanks to the context
  groundwork.
- Dispatch the engine by `process` (MIG vs TIG); type the result as a
  discriminated union (or per-process result type) so the results card can render
  the right fields.
- Results: either branch inside `ResultsCard` on `process`, or add a small
  `TigResults` alongside the MIG output — decide during build.
- Inputs: branch the consumable field(s) in `WeldInputs` by `process`.

## Out of scope

- The Stick calculator (separate feature; its chip stays "soon").
- Pulse TIG, AC balance / frequency, cup size / gas-flow specifics, and
  multi-pass — future refinements.

## References

- [mig-setting-calculator.md](mig-setting-calculator.md) — the MIG calculator
  this mirrors (engine, results and illustration patterns to follow).
- [weld-settings-context.md](weld-settings-context.md) — the shared-state context
  this builds on; new process state is added to `useWeldSettings`.
- [ui-ux.md](ui-ux.md) — the theming, icon set (incl. the TIG torch + position
  icons), accessibility and layout standards the TIG UI must keep.
