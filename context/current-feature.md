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
