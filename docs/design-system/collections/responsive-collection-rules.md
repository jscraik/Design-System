# Responsive Collection Rules

Last updated: 2026-01-31
Source: DTCG type + spacing (`packages/tokens/src/tokens/index.dtcg.json`) and generated outputs.

## Purpose

Defines the typography + spacing scales that are consumed across breakpoints. In the current
codebase these are **single‑mode** values (no desktop/mobile split yet), but they are structured
to support responsive expansion later.

## Coverage (current tokens)

Provide **size**, **lineHeight**, **tracking**, and **paragraphSpacing** for:

- `hero`
- `h1`–`h6`
- `paragraphLg`, `paragraphMd`, `paragraphSm`
- `caption`

Additional usage tokens present in this repo:

- `heading1`, `heading2`, `heading3`
- `body`, `bodySmall`
- `cardTitle`, `listTitle`, `listSubtitle`
- `buttonLabel`, `buttonLabelSmall`

## Responsive Modes (future‑ready)

- There are **no desktop/mobile modes** today.
- If introducing modes, use explicit names (`desktop`, `mobile`) under `type.web`
  and update the generator + Tailwind preset accordingly.

## Responsive Application Rules

- Responsive typography tokens are emitted in `packages/tokens/src/foundations.css`
  as `--foundation-{token}-{property}` variables (e.g., `--foundation-hero-size`,
  `--foundation-body-line`).
- These are consumed via the Tailwind preset (`fontSize`, `lineHeight`, `letterSpacing`)
  **not** via `theme.css` text slots.
- Text **color** slots (`--text-*`) in `theme.css` are **separate from typography tokens**
  and map to colors, not typography metrics.
- When modes exist, the generator should emit per-mode foundation variables
  (e.g., `--foundation-hero-size-mobile`, `--foundation-hero-size-desktop`)
  and the Tailwind preset should reference them appropriately.

## Typography Usage Slots (component consumption)

- Typography **metrics** (size, line-height, tracking) are consumed via Tailwind utilities
  (`text-hero`, `text-body`, etc.) which map to `--foundation-*` variables.
- Text **color** slots in `theme.css` (`--text-hero`, `--text-body`, etc.) are for colors
  only and are separate from typography tokens.
- Components use Tailwind utilities for typography metrics and CSS variables for text colors.

## Scale Consistency

- Typography sizes and paragraph spacing should align to the spacing scale where practical.
- Line-height ratios should remain in readable bounds (1.1–1.6x).
- **Known gap:** `space.s2=4` is defined in DTCG but `--foundation-space-2` is missing from
  `foundations.css`; `--foundation-space-4` is duplicated. Generator should be updated.

## Accessibility Constraints

- Base paragraph size (`paragraphMd`) **must be 16px** (enforced in DTCG values).

## Figma Variables

Responsive tokens for **type and space are authored in Figma** as single-mode values (future-ready for desktop/mobile split). See [Figma Variables Contract](./figma-variables-contract.md) for:
- Naming conventions for typography tokens (e.g., `type/web/hero/size`)
- How foundation variables map to Tailwind preset utilities
- Export contract and change checklist when adding tokens

## Enforcement

- DTCG source: `packages/tokens/src/tokens/index.dtcg.json` (`type.web.*`, `space.*`)
- Generated outputs: `packages/tokens/src/typography.ts`, `packages/tokens/src/foundations.css`
- Tailwind mapping: `packages/tokens/tailwind.preset.ts`
- Usage slots: `packages/ui/src/styles/theme.css` (`--text-*` + `--color-text-*`)
- Validation: `packages/tokens/tests/token-validation.test.ts` (required keys + base size)
