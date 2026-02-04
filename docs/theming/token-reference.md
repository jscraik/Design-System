# Token reference (canonical -> web)

Last updated: 2026-01-04

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Contents

- [Doc requirements](#doc-requirements)
- [Overview](#overview)
- [Modes](#modes)
- [Color (semantic)](#color-semantic)
- [Spacing](#spacing)
- [Motion](#motion)
- [Consumption rules](#consumption-rules)
- [Drift prevention checklist](#drift-prevention-checklist)

## Overview

This document is generated from `packages/tokens/src/tokens/index.dtcg.json`. Do not manually edit generated sections.

## Modes

- Theme: `light | dark`
- Contrast: `default | more` (if supported)
- Density: `comfortable | compact`

<!-- GENERATED:tokens:start -->

## Color (semantic)

| Token                   | Type  | Value (light) | Value (dark) | CSS var                   | Tailwind usage                            | React consumption                                     | Notes                         |
| ----------------------- | ----- | ------------: | -----------: | ------------------------- | ----------------------------------------- | ----------------------------------------------------- | ----------------------------- |
| `color.text.primary`    | color |     `#0D0D0D` |    `#FFFFFF` | `--color-text-primary`    | `text-[color:var(--color-text-primary)]`  | `className="text-token-text-primary"` (or direct var) | Ensure contrast across states |
| `color.surface.default` | color |     `#FFFFFF` |    `#212121` | `--color-surface-default` | `bg-[color:var(--color-surface-default)]` | `className="bg-token-surface-default"`                | Respect reduce transparency   |

## Spacing

| Token                    | Type      |  px |  rem | CSS var                    | Tailwind usage                                                                | Notes                              |
| ------------------------ | --------- | --: | ---: | -------------------------- | ----------------------------------------------------------------------------- | ---------------------------------- |
| `space.3`                | dimension |  12 | 0.75 | `--space-3`                | `p-[var(--space-3)]`                                                          | Use scale only; no ad-hoc spacing  |
| `size.control.hitTarget` | dimension |  44 | 2.75 | `--size-control-hitTarget` | `min-h-[var(--size-control-hitTarget)] min-w-[var(--size-control-hitTarget)]` | Hard requirement for touch targets |

## Motion

| Token                   | Type     | Value | CSS var                   | Web usage                                 | Reduced motion                             |
| ----------------------- | -------- | ----- | ------------------------- | ----------------------------------------- | ------------------------------------------ |
| `motion.duration.short` | duration | 150ms | `--motion-duration-short` | `duration-[var(--motion-duration-short)]` | Replace movement with instant/opacity-only |

<!-- GENERATED:tokens:end -->

## Consumption rules

- Components MUST reference semantic tokens (not palette primitives).
- Any new interaction state requires token coverage and docs row updates.

## Drift prevention checklist

- Token bundle compiles
- Web outputs regenerated
- Docs regenerated (this file)
- No disallowed literals in components

## Risks and assumptions

- **Assumptions (Brand → Alias → Mapped):**
  - Brand primitives are the single source of truth; aliases must only reference brand tokens and never raw literals.
  - Mapped tokens cover all brand/alias values required by web outputs (light/dark + density), with no mode gaps.
  - Responsive tokens (e.g., space/size) are derived from the mapped layer and stay consistent across breakpoints.
- **Risks (pipeline + responsive tokens):**
  - A missing alias or mapped entry can silently remove a CSS var, causing runtime fallbacks to literals or invalid styles.
  - Responsive token sets can drift if breakpoint-specific values are updated in one layer but not propagated, leading to mixed scales across layouts.
  - Mode parity mistakes (light/dark/compact) can produce inaccessible contrast or inconsistent spacing between themes.
- **Recovery guidance:**
  - Re-run token validation + generation to rehydrate outputs, then diff the generated CSS files before/after to confirm parity.
  - Roll back to the last known-good token generation commit if validation fails and you cannot resolve parity within the same change-set.

## Verify

- **Validate token sources:** `pnpm validate:tokens`
  - **Expected:** exits 0 with no validation errors; reports no missing modes or alias-map mismatches.
- **Regenerate web outputs:** `pnpm generate:tokens`
  - **Expected:** exits 0 and updates token outputs without uncommitted drift beyond the intended change.
- **Check generated outputs:** open and confirm changes in:
  - `packages/tokens/src/foundations.css` (brand + base layer outputs)
  - `packages/ui/src/styles/theme.css` (mapped + web-ready theme vars)
  - **Expected:** CSS vars exist for every token row in this doc, with light/dark + density modes present where defined.
- **Optional sanity check:** `rg "--color-|--space-|--motion-" packages/ui/src/styles/theme.css`
  - **Expected:** token variables resolve to mapped names (no raw literals or missing vars for changed tokens).

## Troubleshooting

- **1) Missing mode parity (light/dark/compact)**
  - **Symptom:** validation errors or missing CSS vars for a mode in `theme.css`.
  - **Fix:** add the missing mode values in the mapped token definitions, then re-run `pnpm validate:tokens` and `pnpm generate:tokens`.
- **2) Alias-map mismatch**
  - **Symptom:** `validate:tokens` reports alias references that do not exist in brand tokens.
  - **Fix:** correct the alias target to an existing brand token (or add the missing brand primitive), then regenerate outputs.
- **3) Outdated generated outputs**
  - **Symptom:** doc rows or CSS vars appear correct in source JSON, but `foundations.css`/`theme.css` are stale.
  - **Fix:** run `pnpm generate:tokens`, ensure no git-ignored outputs are blocking updates, then commit regenerated files alongside the doc changes.
