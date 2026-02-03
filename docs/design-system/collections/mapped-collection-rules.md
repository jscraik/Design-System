# Mapped Collection Rules

Last updated: 2026-01-31
Source: Repo mapping layer (`packages/ui/src/styles/theme.css`) + Tailwind preset (`packages/tokens/tailwind.preset.ts`).

## Purpose

Mapped tokens are the **only tokens UI components may consume**. They translate the Brand/Alias
values into **usage slots** exposed via CSS variables and Tailwind theme entries.

## 3-Tier Flow (Required - Target Architecture)

Mapped slots **must** resolve through Alias (no direct Brand references):

- Brand (raw) → Alias (semantic) → Mapped (usage slots)
- UI components consume **Mapped only**.
- **Target architecture:** This flow is intended but not yet enforced in CSS.
- **Current implementation:** `theme.css` maps directly to foundation variables
  (no alias CSS output layer exists yet).
- See also: `brand-collection-rules.md` and `alias-collection-rules.md`.

## Implementation Notes (repo-specific)

- Mapped tokens are defined in `packages/ui/src/styles/theme.css`.
- `@theme inline` in `theme.css` exposes **mapped slots** as `--color-*` and `--radius-*` variables.
- Tailwind preset (`packages/tokens/tailwind.preset.ts`) is a separate layer that exposes **foundation variables**.
- `theme.css` currently references **foundation variables directly** for color mappings
  (e.g., `--background: var(--foundation-bg-light-1)`, `--foreground: var(--foundation-text-dark-primary)`).
- The **Brand → Alias → Mapped** flow is **conceptual**; CSS implementation bypasses the
  alias layer and maps directly to foundation variables because there is no alias CSS output layer.
- The **foundation utilities** (`bg-foundation-*`, `text-foundation-*`, etc.) exist for
  backward compatibility only and **must not** be used by new UI components
  (enforced by `design-system-policy.test.ts`).
- New slots should prefer alias-based mapping when implemented for consistency.

## Scope

Mapped collection includes:

- **Color usage slots** (background, text, border, accent, ring, overlay).
- **Text color usage slots** for component text color consumption (hero/heading/body/etc).
- **Radius usage slots** (`--radius-sm/md/lg/xl`) derived from foundation radius.

## Required Usage Slots (current)

**Backgrounds**
- `--background`, `--secondary`, `--muted`, `--card`, `--popover`

**Text + Icons**
- `--foreground`, `--text-secondary`, `--text-tertiary`, `--text-inverted`
- `--text-hero`, `--text-heading`, `--text-body`, `--text-placeholder`, `--text-caption`
- `--text-hero-on-color`, `--text-heading-on-color`, `--text-body-on-color`,
  `--text-placeholder-on-color`, `--text-caption-on-color`

**Borders**
- `--border`, `--border-subtle`, `--border-strong`

**Accents**
- `--accent-blue`, `--accent-red`, `--accent-orange`, `--accent-green`, `--accent-purple`
- `--accent-foreground`

**State Slots (no numeric scales)**

**Interactive (base → hover → active → disabled → focus ring)**
- `--interactive` (base)
- `--interactive-hover`
- `--interactive-active`
- `--interactive-disabled`
- `--ring` (focus)

**Status (success → success-muted → error → error-muted → warning)**
- `--status-success`
- `--status-success-muted`
- `--status-error`
- `--status-error-muted`
- `--status-warning` (optional)

**Overlay**
- `--overlay`

## Mapping Rule (No Numeric Scales)

- Each mapped state slot currently points to a **foundation variable** (e.g., `--foundation-bg-light-1`).
- The Brand → Alias → Mapped flow is **conceptual** because there is no alias CSS output layer;
  CSS implementation maps directly to foundation variables.
- Do **not** introduce numeric 500/600 ramps in Mapped. Name the intent/state explicitly instead.
- Future alias-based mappings should resolve through Alias tokens, not direct foundation
  references.

## Usage Guardrails

- UI components and templates **must** use mapped tokens or Tailwind `--color-*` utilities.
- Do **not** use foundation color utilities in component code (`bg-foundation-*`, etc.).
- Typography and spacing scales are consumed via Tailwind preset utilities, which map
  to foundation variables (`--foundation-*`), not mapped text slots.

## Responsive Application Rules

- Mapped text slots (`--text-*`) are **color slots only** and do not mirror Responsive typography tokens.
- Typography metrics (size, line-height, tracking) are consumed via Tailwind utilities
  from the Tailwind preset, which exposes foundation variables (`--foundation-*`).
- If/when responsive modes are added, the generator should emit per-mode foundation variables
  and the Tailwind preset should reference them appropriately.

## Light & Dark

- `theme.css` defines explicit values for **light** and **dark** modes using `[data-theme]`.
- Every mapped usage slot **must** be set in both themes to preserve parity.
- `highContrast` follows Alias until dedicated mapped overrides are introduced.

## Accessibility

- Text/icon slots are mapped to meet contrast expectations (validated in token tests).
- On‑color text slots are required for colored surfaces.
- Ring color must remain visible against primary backgrounds.

## Figma Variables

Mapped tokens **consume Brand tokens exported from Figma** (currently via direct foundation variable references; alias CSS layer is planned). See [Figma Variables Contract](./figma-variables-contract.md) for:
- How Figma variables map to DTCG paths and output examples (foundations.css vars, Tailwind preset keys)
- Export contract and change checklist for theme.css mappings
- Known gap: no alias CSS output layer yet (theme.css references `--foundation-*` directly)

## Enforcement

- Canonical mapping: `packages/ui/src/styles/theme.css`
- Tailwind surface mapping: `packages/tokens/tailwind.preset.ts`
- UI policy checks: `packages/ui/src/tests/design-system-policy.test.ts`
