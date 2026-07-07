# Current Feature

<!-- Feature name and short description -->

## Status

<!-- Not Started | In Progress | Completed -->

## Goals

<!-- Goals and requirements -->

## Notes

<!-- Any extra notes -->

## History

<!-- Keep this updated. Earliest to latest -->

- **Initial Setup** — Initial project scaffold (Vite 8 + React 19 + TypeScript, React Compiler, Oxlint). Cleaned up the Vite boilerplate so `src/App.tsx` renders a bare `Hello World!`, reset global CSS, and removed unused assets. Added `CLAUDE.md` and the `context/` documentation files.

- **Generated Tool Integration & MIG Weld Setting Calculator** — Integrated the generated MIG tool into the app as TypeScript (engine, geometry, UI) per coding-standards. Split the UI into focused components, added severity-tiered wire/thickness advice (OK / amber / red "not advised") in the engine, and made the joint illustration position-aware (flat, horizontal, vertical weld-face, overhead). Full record: [features/mig-setting-calculator.md](features/mig-setting-calculator.md).

- **Tool Styling — UI/UX Improvements** — Tokenised light/dark theming with a `useTheme` hook and keyboard-accessible `ThemeToggle`; a grouped icon set (process/joint/position/theme) in `src/icons/`; WCAG AA accessibility (semantic landmarks, contrast fixes in both themes, ≥11px text, focus states, reduced-motion); a two-column desktop layout; and self-hosted fonts to cut render-blocking and layout shift. Also tidied structure for scaling: `@/` path alias, `src/hooks/`, component decomposition with a `useWeldSettings` hook, global design-token split into `index.css`, and SEO basics (meta description, robots.txt). Full record: [features/ui-ux.md](features/ui-ux.md).

- **Weld Settings Context** — Moved the screen's shared state from prop-passing into a React context: a `WeldSettingsProvider` (calls `useWeldSettings` once) split from the `useWeldSettingsContext` consumer hook so the provider file exports only a component (clean Fast Refresh). `WeldCalculator` is now a stateless composition wrapped in the provider, and `WeldInputs`, `JointSection` and `ResultsCard` read from context with their props dropped — no behaviour change. Groundwork for the upcoming TIG/Stick calculators. Full record: [features/weld-settings-context.md](features/weld-settings-context.md).

- **TIG Weld Setting Calculator** — Added the TIG process end-to-end: a data-driven `tigEngine` (amperage from ~40 A/mm × material/position/joint factors, AC/DC polarity, recommended tungsten size, Argon gas, severity advisories) mirroring the MIG engine; a `WeldResult` discriminated union (`process` field) so `ResultsCard` narrows per process; a functional process selector (MIG/TIG selectable, Stick disabled); process-aware inputs (wire for MIG, filler + tungsten for TIG) and results, with the live illustration reused unchanged. Also added a small metric-unit annotation to the consumable labels. Full record: [features/tig-setting-calculator.md](features/tig-setting-calculator.md).

- **Codebase Audit Fixes** — Acted on the code-scanner audit: made the footer disclaimer process-aware (the GMAW/wire wording was wrong under TIG); stopped the `JointSection` rAF loop rebuilding + writing the SVG every frame once the tween settles (no idle CPU/layout work) and made it read `prefers-reduced-motion` live; guarded `ThicknessControl` against non-finite input (clearing the box no longer snaps to the floor); keyed the results flags on content rather than array index; and removed a dead rotation branch. Deliberately skipped: a context `useMemo` (no benefit — `result` recreates each render) and splitting `jointGeometry.ts` (deferred until it grows).

- **Stick Weld Setting Calculator** — Added the Stick (SMAW) process end-to-end, completing the three-process MVP: a `stickEngine` (amperage from ~38 A/mm × material/position/joint, clamped to the chosen electrode's rated window; recommends the electrode whose amp window fits the demand; polarity note; rod-too-hot / multipass / out-of-position advisories) mirroring the MIG/TIG engines; extended the `WeldResult` union with `StickResult`; made all three process chips selectable (dropped the disabled/"soon" state and its dead CSS); an electrode input (2.0 / 2.5 / 3.2 / 4.0 mm) in a three-way consumable branch; and process-aware results (amperage + recommended electrode, polarity, no gas/transfer). Also refactored the engine dispatch to a `switch` with direct returns. Full record: [features/stick-setting-calculator.md](features/stick-setting-calculator.md).

- **Audit Follow-up Fixes** — Acted on a code-scanner audit of the three-process MVP (1 Medium, 3 Low; Security/Performance clean). Fixed the footer disclaimer showing GMAW/solid-wire wording under Stick — added a dedicated SMAW branch (electrode/polarity/arc-length/slag, no gas) and converted the two-way ternary to a `switch` helper. Added `aria-hidden="true"` to the joint/position icon `<svg>` (`IconBase`) so the decorative icons match `TorchIcons`/`ThemeIcons` and don't announce a redundant graphic next to each button's label. Removed dead `:disabled` process-chip CSS. Extracted the label-rotation transform out of the `JointSection` rAF effect into a pure `rotateLabels()` in `jointGeometry.ts` (with a shared `CY` const), behaviour-preserving. Also retargeted the `code-scanner` agent definition from Next.js to this Vite + React SPA and made accessibility (WCAG AA) a first-class audit category.
