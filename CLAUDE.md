# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Context Files

Read the following to get the full context of the project:

- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interaction.md
- @context/current-feature.md

## Commands

- `npm run dev` — start the Vite dev server with HMR
- `npm run build` — type-check (`tsc -b`) then produce a production build (`vite build`); the build fails on type errors
- `npm run lint` — run Oxlint over the project
- `npm run preview` — serve the production build locally

There is no test runner configured yet.

## Architecture & tooling

This is a Vite + React 19 + TypeScript single-page app. The project is in an early/scaffold state — `src/App.tsx` is the root component and `src/main.tsx` mounts it into `#root` (see `index.html`).

Key non-default tooling choices to be aware of:

- **React Compiler is enabled.** `vite.config.ts` wires `@rolldown/plugin-babel` with `reactCompilerPreset()`, so components are auto-memoized at build time. Avoid hand-written `useMemo`/`useCallback`/`React.memo` unless profiling shows a need, and follow the Rules of React strictly — the compiler relies on them.
- **Oxlint, not ESLint.** Linting is configured in `.oxlintrc.json` (`react`, `typescript`, `oxc` plugins). `react/rules-of-hooks` is an error and `react/only-export-components` is a warning.
- **TypeScript project references.** `tsconfig.json` references `tsconfig.app.json` (app code under `src/`) and `tsconfig.node.json` (Vite config). Use `tsc -b` (already wired into `build`) rather than a flat `tsc`.
- Vite 8 with the Rolldown-based bundler.
