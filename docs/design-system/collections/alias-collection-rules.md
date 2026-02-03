# Alias Collection Rules

Last updated: 2026-01-31
Source: Repo alias map (`packages/tokens/src/alias-map.ts`) + validator (`packages/tokens/src/validation/token-validator.ts`).

## Purpose

Alias tokens provide **stable, semantic paths** to the Brand (raw) tokens so downstream tooling
can resolve values consistently. In this repo, aliasing covers **colors + foundational scales**
that are later exposed to mapped tokens.

## 3-Tier Flow (Required)

All token usage must resolve through **Brand → Alias → Mapped**:

- Alias is the **only** semantic layer between Brand and Mapped.
- UI components **must not** reference Brand or Alias directly; they consume Mapped slots.
- See also: `brand-collection-rules.md` and `mapped-collection-rules.md`.

## Alias Integrity

- Color aliases **must reference Brand paths** (no raw hex values).
- Non-color aliases **should** reference Brand paths where possible.
- Raw timing values are allowed for motion tokens (`motion.standard|fast|slow|reduced`).
- Validator enforces raw-value prohibition for **color aliases only**; non-color categories
  (space, radius, shadow, size, type) currently mix Brand paths with computed values
  without strict validation.

## Color Aliases (modeled categories)

Color aliasing mirrors the Brand categories and modes:

- Categories: `background`, `text`, `icon`, `border`, `accent`, `interactive`
- Modes: `light`, `dark`, `highContrast`

**Key rule:** Every light-mode Brand key must have a matching alias entry (coverage enforced in
`token-validator.ts`).

## Status + Interactive Coverage

- Status/interactive semantic mappings are defined in the **Mapped layer** (`theme.css`),
  not in Alias. Alias provides stable Brand paths; Mapped resolves specific usage slots.
- Until dedicated status surfaces exist in Brand, map status to **accent colors**:
  `statusSuccess → accent.green`, `statusError → accent.red`, `statusWarning → accent.orange`.
- Interactive slots (base/hover/active/disabled) must resolve to **accent or text** tokens
  (current default uses accent blue + text tertiary for disabled).
- Icon status must resolve to `icon.statusError|statusWarning|statusSuccess`.

## Scope Guardrails

- Alias is **not** a usage-slot layer. It mirrors Brand tokens and keeps names stable.
- Do not introduce component‑specific states (hover/active/etc.) here.
- This repo enforces **Brand → Alias → Mapped** token flow.

## Non‑Color Alias Coverage (repo-specific)

Alias includes these additional groups (paths resolve into DTCG source):

- `space` → `space.s{value}`
- `radius` → `radius.{token}`
- `shadow` → `shadow.{token}`
- `size` → `size.{token}`
- `type` → `type.fontFamily` + `type.web.{token}`
- `motion` → raw timing values (seconds)

## Modes

- Alias defines **light**, **dark**, and **highContrast** in all color categories.
- `highContrast` currently **defaults to dark tokens** until explicit HC tokens exist.
- Every color alias key **must** exist across light/dark/highContrast to preserve parity.

## Figma Variables

The alias layer **consumes Brand tokens exported from Figma** and provides stable semantic paths. See [Figma Variables Contract](./figma-variables-contract.md) for:
- How Figma slash-paths map to DTCG keys (e.g., `color/background/light/primary` → `color.background.light.primary`)
- Required data types and normalized values (hex uppercase, sizes in px)
- Change checklist for updating alias-map when adding tokens

## Other Instructions

- If new non-color categories are introduced in DTCG, they **must** be added to the alias map.
- Automated validation of non-color raw-value constraints is not currently implemented;
  update `token-validator.ts` if strict validation is desired for new categories.

## Enforcement

- Canonical map: `packages/tokens/src/alias-map.ts`
- Validation: `packages/tokens/src/validation/token-validator.ts` (alias coverage + path resolution)
