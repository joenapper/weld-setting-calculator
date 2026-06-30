# Tool Styling - UI/UX Improvements

## Overview

Nail down the tool's look and feel to make future scaling easier: a proper
theming system, a consistent icon set, a responsive layout, and accessibility to
a minimum WCAG AA standard. Mobile already looked good, so the work focused on
theming, the desktop layout, icons, accessibility and performance — plus some
structural cleanups to keep the codebase easy to extend.

## Requirements

1. Light / dark mode toggle — favour dark unless the user has set otherwise.
2. Relevant icons on MIG / TIG / Stick buttons, and anywhere else that helps.
3. Minimum WCAG AA rating.
4. Improve the desktop layout (mobile already looks good).
5. Improve performance.

## Delivered

### 1. Theming (light / dark)

- Every colour tokenised as a CSS custom property. The global design tokens live
  on `:root` in `index.css`, with a `[data-theme="light"]` override block; the
  dark set is the default.
- `useTheme` hook (`src/hooks/`): dark by default, falls back to the OS
  `prefers-color-scheme` only when the user hasn't made an explicit choice,
  persists any explicit choice to `localStorage`, and sets `data-theme` on
  `<html>`.
- `ThemeToggle` — keyboard-accessible sun / moon button (`aria-label`,
  `aria-pressed`, focus ring).
- Page background themed via `--page`; feature styles consume tokens only (no raw
  hex in rules).
- Material-aware plate colour in the illustration via `--plate-*` tokens (mild
  steel darkest → stainless → aluminium lightest, per theme).

### 2. Icons

- Process: MIG / TIG / Stick welding-torch silhouettes. The selector is
  display-only for now — only MIG is wired to the engine; TIG / Stick are "soon".
- Joint type (fillet, butt, lap, corner) and welding position (orientation
  arrows).
- Theme sun / moon.
- Grouped in `src/icons/` (`TorchIcons`, `JointIcons`, `PositionIcons`,
  `ThemeIcons`) over a shared `IconBase` wrapper and `IconProps` type. Size and
  colour come from the surrounding CSS so an icon adapts to where it's used.

### 3. Accessibility (WCAG AA)

- Semantic landmarks: `<main>`, `<header>`, `<footer>`, plus labelled regions for
  the input panel and the results; the illustration is `role="img"` with a label.
- Fixed orphaned form labels — group captions are headings (`field-label`), and
  each control group is named via the segmented control's `aria-label`.
- Contrast: tokens chosen for AA in both themes (removed an `opacity` rule that
  dropped the "soon" chips below 4.5:1, and darkened the light-theme accent so
  accent-on-light text clears 4.5:1).
- Minimum text size raised to 11px (cleared the "very small text" findings).
- Keyboard `:focus-visible` outlines throughout; `prefers-reduced-motion`
  respected in the illustration's animation.

### 4. Responsive layout

- Desktop (≥930px): two-column layout — inputs on the left, live illustration +
  results on the right — within a widened card.
- Narrow desktop (930–1070px): the two thickness inputs stack so they don't
  overflow the column.
- Mobile layout unchanged.

### 5. Performance

- Self-hosted the web fonts (`@fontsource`, only the weights in use): removes the
  render-blocking Google Fonts request and the font-swap layout shift (CLS).
  Served same-origin with `unicode-range` subsetting.
- Note: measure against the production build (`npm run build && npm run
  preview`), not the dev server, which is unminified/unbundled.

## Additional improvements (scaling / housekeeping)

Not in the original list, but they support the "make scaling easier" goal:

- `@/* → src/*` path alias (tsconfig + Vite) to drop `../../` import chains.
- `src/hooks/` and `src/icons/` conventions established and documented in
  coding-standards.
- Screen decomposed into focused components (`WeldHeader`, `WeldInputs`,
  `WeldFooter`), with state and behaviour extracted into a `useWeldSettings` hook.
- Global design tokens split out of the feature stylesheet into `index.css`.
- SEO: meta description + `robots.txt`.
- `NoInfer` on `SegmentedControl`'s `onChange` so the generic stays inferred from
  `options` / `value` (was collapsing to `string`).

## Follow-ups

- **Move `useWeldSettings` into a React context** (provider + consumer hook) so
  the screen's components read the shared state directly instead of via props —
  chiefly to slim `WeldInputs`' wide prop signature. Deferred for now; one hop of
  props is fine, so this is a tidy-up rather than a fix.
