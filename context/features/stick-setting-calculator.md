# Stick Weld Setting Calculator

Add the Stick (SMAW / MMA) process end-to-end — a Stick recommendation engine, an
electrode input, and a Stick results view — selectable alongside MIG and TIG.
This completes the three-process MVP. Builds on the shared-state context and
mirrors the MIG/TIG patterns. Domain rules per
[project-overview](../project-overview.md).

## Status

Complete — 2026-07-07

## Goals

- Make the Stick chip selectable (remove the disabled / "soon" state); add
  `electrode` to the shared settings.
- Stick engine (`src/lib/stickEngine.ts`) mirroring MIG/TIG — amperage range from
  electrode ⌀ + thickness/material/position, polarity note, recommended
  electrode. **No voltage, no gas, no wire-feed.**
- Electrode input (2.0 / 2.5 / 3.2 / 4.0 mm) in place of the MIG wire / TIG
  filler + tungsten controls.
- Process-aware inputs and results (Stick: amperage + recommended electrode,
  polarity note, governing thickness — no gas/transfer/voltage).
- Reuse the live joint illustration unchanged.

## Domain notes (Stick / SMAW)

- **Amperage** tracks electrode ⌀ and thickness. Typical rated ranges: 2.0 mm
  40–70 A, 2.5 mm 60–90 A, 3.2 mm 90–140 A, 4.0 mm 140–190 A.
- **No shielding gas** (flux-shielded) and **no wire feed** — outputs are
  amperage + polarity only.
- **Polarity** depends on the electrode *type* (not captured here), so present a
  note: DCEP (electrode +) suits most general rods; E6013 / 6011 also run AC.
- Stick **derates more out of position** than MIG/TIG.
- Aluminium stick is impractical below ~4 mm — advise TIG/MIG instead.

## Approach / notes

- Add `electrode` + `process === "stick"` handling to `useWeldSettings`; dispatch
  `STICK.compute`.
- Extend the `WeldResult` discriminated union with `StickResult`
  (`process: "stick"`) so `ResultsCard` narrows.
- Branch the consumable field in `WeldInputs` three ways: wire (MIG) /
  filler + tungsten (TIG) / electrode (Stick).
- Flip the Stick chip in `WeldHeader` from disabled to selectable and drop the
  now-unused "soon" affordance.

## Out of scope

- FCAW, pulse, electrode-type selection (E6013 vs E7018, etc.), and multi-pass
  sequencing — future refinements.

## References

- [mig-setting-calculator.md](mig-setting-calculator.md) — the original engine /
  results / illustration patterns.
- [tig-setting-calculator.md](tig-setting-calculator.md) — the process selector +
  discriminated-union result approach this extends.
- [weld-settings-context.md](weld-settings-context.md) — the shared-state context
  the new process state is added to.
- [ui-ux.md](ui-ux.md) — the theming, icon and accessibility standards to keep.
