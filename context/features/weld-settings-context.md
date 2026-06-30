# Weld Settings Context

Move the screen's shared state — currently the `useWeldSettings` hook consumed
via props — into a React context so components read it directly. This is the
deferred follow-up from [ui-ux.md](ui-ux.md), pulled forward because it makes the
next pieces of work (the TIG and Stick calculators) easier to add.

## Status

Complete — 2026-06-30

## Why this first

- Today `WeldCalculator` passes ~14 props down one hop to `WeldInputs` (plus a
  handful to `JointSection` / `ResultsCard`). That's fine for MIG alone.
- The next features add a real **process** dimension. TIG and Stick each bring
  process-specific inputs (TIG: tungsten size, filler, AC/DC, gas; Stick:
  electrode size, polarity), their own engines, and their own result shapes.
- Adding those on top of prop-passing means threading ever-wider prop lists
  through `WeldCalculator` → `WeldInputs` every time. Lifting the shared state
  into a context lets new process-specific components/state consume exactly what
  they need, so the TIG/Stick work is **additive** rather than a prop-drilling
  refactor each time.

## Goals

- Add a `WeldSettingsProvider` that calls `useWeldSettings()` **once** and
  provides the value.
- Add a `useWeldSettingsContext()` consumer hook that throws if used outside the
  provider.
- `WeldCalculator` wraps the tree in the provider and becomes pure composition.
- Convert `WeldInputs`, `JointSection` and `ResultsCard` to read from context and
  drop their now-redundant props.
- **No behaviour change** — same state flow, same rendered output.
- Decide and document the file location (proposed
  `src/context/WeldSettingsContext.tsx`) and add a `Context:` convention to
  coding-standards, as we did for `hooks/` and `icons/`.

## Notes / approach

- `useWeldSettings` stays the single source of truth; the provider calls it once
  and shares that one instance. A component calling the hook directly would get
  its **own** independent state — so it must only be called in the provider.
- Type the context value as `ReturnType<typeof useWeldSettings>` so it stays in
  sync with the hook automatically.
- Converting `JointSection`/`ResultsCard` to context (not just `WeldInputs`)
  keeps things consistent; the trade-off is they become screen-coupled, which is
  fine since they only ever render inside this screen.
- Watch the `react/only-export-components` lint warning if the provider and
  consumer hook share one file (it's a warning, acceptable — or split them).

## Out of scope

- Building the TIG/Stick engines, inputs or results — those are separate
  features. This is purely the state-sharing groundwork that precedes them.
