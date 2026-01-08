# Token reference (canonical -> web -> swift)

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

| Token                   | Type  | Value (light) | Value (dark) | CSS var                   | Tailwind usage                            | React consumption                                     | Swift API                       | Notes                         |
| ----------------------- | ----- | ------------: | -----------: | ------------------------- | ----------------------------------------- | ----------------------------------------------------- | ------------------------------- | ----------------------------- |
| `color.text.primary`    | color |     `#0D0D0D` |    `#FFFFFF` | `--color-text-primary`    | `text-[color:var(--color-text-primary)]`  | `className="text-token-text-primary"` (or direct var) | `Tokens.color(.textPrimary)`    | Ensure contrast across states |
| `color.surface.default` | color |     `#FFFFFF` |    `#212121` | `--color-surface-default` | `bg-[color:var(--color-surface-default)]` | `className="bg-token-surface-default"`                | `Tokens.color(.surfaceDefault)` | Respect reduce transparency   |

## Spacing

| Token                    | Type      |  px |  rem | CSS var                    | Tailwind usage                                                                | Swift API                 | Notes                              |
| ------------------------ | --------- | --: | ---: | -------------------------- | ----------------------------------------------------------------------------- | ------------------------- | ---------------------------------- |
| `space.3`                | dimension |  12 | 0.75 | `--space-3`                | `p-[var(--space-3)]`                                                          | `Spacing.s3`              | Use scale only; no ad-hoc spacing  |
| `size.control.hitTarget` | dimension |  44 | 2.75 | `--size-control-hitTarget` | `min-h-[var(--size-control-hitTarget)] min-w-[var(--size-control-hitTarget)]` | `Sizing.controlHitTarget` | Hard requirement for touch targets |

## Motion

| Token                   | Type     | Value | CSS var                   | Web usage                                 | Swift API      | Reduced motion                             |
| ----------------------- | -------- | ----- | ------------------------- | ----------------------------------------- | -------------- | ------------------------------------------ |
| `motion.duration.short` | duration | 150ms | `--motion-duration-short` | `duration-[var(--motion-duration-short)]` | `Motion.short` | Replace movement with instant/opacity-only |

<!-- GENERATED:tokens:end -->

## Consumption rules

- Components MUST reference semantic tokens (not palette primitives).
- Any new interaction state requires token coverage and docs row updates.

## Drift prevention checklist

- Token bundle compiles
- Web + Swift outputs regenerated
- Docs regenerated (this file)
- No disallowed literals in components

## Risks and assumptions
- Assumptions: TBD (confirm)
- Failure modes and blast radius: TBD (confirm)
- Rollback or recovery guidance: TBD (confirm)

## Verify
- TBD: Add concrete verification steps and expected results.

## Troubleshooting
- TBD: Add the top 3 failure modes and fixes.

