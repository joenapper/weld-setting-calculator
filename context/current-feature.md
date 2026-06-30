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
