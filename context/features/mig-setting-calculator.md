# Generated Tool Integration & MIG Weld Setting Calculator

Integrate the generated tool (engine, live joint illustration, and UI) so the
MIG process is fully working end-to-end, then refine the recommendation engine
and make the illustration position-aware.

## Status

Complete — 2026-06-28

## Goals

- Integrate the five generated files (migEngine, jointGeometry, JointSection,
  WeldCalculator, weld-calculator.css) into the app.
- Convert from JS/JSX to TypeScript per coding-standards (strict, no `any`,
  typed props/data models).
- Lay files out per coding-standards: types in `src/types/`, pure logic in
  `src/lib/`, components in `src/components/weld/`.
- Render `WeldCalculator` from `App.tsx`; wire up Oswald/Space Mono/Inter fonts.
- MIG only for now — TIG/Stick chips remain "soon".
- Refine the recommendation engine's wire/thickness advice into clear severity
  tiers (OK / amber advisory / red "not advised").
- Make the joint illustration position-aware (flat, horizontal, vertical,
  overhead) and correctly reflect each member's thickness.

## Notes

- Engine and geometry are pure (framework-agnostic) — kept in `src/lib/`.
- The single `WeldCalculator.tsx` was split into focused components
  (`SegmentedControl`, `segmentOptions`, `ThicknessControl`, `ResultsCard`,
  `JointSection`) with shared constants/helpers in `src/lib/weldConfig.ts`.
- Thickness is stored canonically in mm; inch is a display-only conversion.
- Dynamic slider fill uses a CSS custom property (`--fill`) set via `style`;
  this is the one necessary inline style (a dynamic value, not styling).
- SVG `id`s are document-global; only one `JointSection` renders, so no suffixing
  needed yet (noted for future multi-instance use).

### Recommendation engine (migEngine)

- Wire table carries tunable limits per diameter: current window (`min`/`max`),
  feed factor `k`, `thickMax` (comfortable plate limit → amber) and `hardMax`
  (hard plate limit → red, not advised).
- Flags carry a `severity` (`warn` amber / `danger` red). When a config is past
  the wire's `hardMax` the engine returns `recommended: false`, withholds the
  amps/volts/wfs numbers (shown as "—"), and surfaces a single red flag pointing
  to a heavier wire or a stronger process.
- Advice distinguishes: undersized wire, normal multipass thick plate,
  oversized-wire burn-through, and out-of-position/dissimilar-thickness notes.

### Position-aware illustration (jointGeometry / JointSection)

- Flat & horizontal: the side-on cross-section (unchanged).
- Other positions use a bespoke builder when present
  (`VERTICAL_BUILDERS` / `OVERHEAD_BUILDERS`), else fall back to rotating the flat
  builder (with dimension labels counter-rotated to stay upright).
- Fillet has bespoke vertical and overhead builders:
  - **Overhead** — the T-joint flipped upside down (base on top, upright hanging).
  - **Vertical** — a "vertical rotation" weld-face view: upright (A) edge-on in
    the centre with its width scaling live, base (B) face-on either side with
    square-ended weld beads. The base's thickness runs into the page, so it can't
    be drawn to scale — it shows as a numeric callout only.

## Follow-ups (not included in this feature)

- Extend bespoke vertical/overhead builders to butt, lap, and corner (they still
  use the rotation fallback).
- Add a weld-size (fillet leg) input so pass count is driven by the weld size,
  not just plate thickness (fixes over-welding mis-flagging, e.g. a 6 mm fillet
  on 8 mm plate reading as multipass).
