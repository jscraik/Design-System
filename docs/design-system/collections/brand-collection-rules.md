# Brand Collection Rules

Last updated: 2026-01-31
Source: Repo token pipeline (`packages/tokens/src/tokens/index.dtcg.json` → `packages/tokens/src/foundations.css`).

## Purpose

The Brand collection is the **raw-value source of truth** for this repo. It holds the
foundation tokens derived from Apps SDK UI (and any future brand sources) and is used to
generate the audit/compatibility outputs (for example, `foundations.css`). UI components
**must not** consume these values directly.

## 3-Tier Flow (Required)

Brand tokens are **never** consumed by UI code directly. All consumption must go through
Alias → Mapped:

- Brand (raw) → Alias (semantic) → Mapped (usage slots)
- Brand tokens **must not** be referenced in UI components, templates, or stories.
- See also: `alias-collection-rules.md` and `mapped-collection-rules.md`.

## Color Model (this repo)

Color tokens are grouped by **category + mode**, not by 100–1200 scales.

**Categories (required):**

- `background` → `primary`, `secondary`, `tertiary`
- `text` → `primary`, `secondary`, `tertiary`, `inverted`
- `icon` → `primary`, `secondary`, `tertiary`, `inverted`, `accent`, `statusError`, `statusWarning`, `statusSuccess`
- `border` → `light`, `default`, `heavy`
- `accent` → `gray`, `red`, `orange`, `yellow`, `green`, `blue`, `purple`, `pink`, `foreground`
- `interactive` → `ring`

**Modes (required):**

- `light` and `dark` for every category.
- Keys **must match** across modes (enforced in `token-validation.test.ts`).

## Status + Interactive Token Sources

- Status usage slots in Mapped are **backed by Brand accent colors** until dedicated status
  surface tokens exist.
- Interactive usage slots in Mapped are **backed by Brand accent colors** until dedicated
  interactive scales exist.
- Icon status colors **must** come from `icon.statusError|statusWarning|statusSuccess`.
- If new Brand status/interactive categories are added, update Alias coverage and validators
  so mapped slots continue to resolve through Alias.

**Value rules:**

- Background/text/icon/accent tokens must be **6‑digit hex** (`#RRGGBB`).
- Border values may include alpha (e.g., `#RRGGBBAA`) because borders are semi‑transparent.
- Interactive ring must meet contrast checks (validated in tests).

## Scale Structure (future-ready)

If numeric scales are ever introduced, they must follow:

- 100–1200 scale, lower = lighter, higher = darker.
- 100-step increments by default.
- 50-step increments when intermediate values are needed.
- 25-step increments only if further refinement is required.

## Other token groups in Brand

These live in the same DTCG source and are **raw values**:

- `space` (spacing scale)
- `type.web` (typography scale + metrics)
- `radius` (r6, r8, r10, r12, r16, r18, r21, r24, r30, round)
- `size` (controlHeight, cardHeaderHeight, hitTarget)
- `shadow` (card, pip, pill, close)

All values here are **inputs** to generation and should not be consumed directly by UI components.

**Known gap:** `space.s2=4` is defined in DTCG but `--foundation-space-2` is missing from
`foundations.css`; `--foundation-space-4` is duplicated. Generator should be updated.

## Figma Variables

Brand collection tokens are **authored in Figma** and exported to DTCG format. See [Figma Variables Contract](./figma-variables-contract.md) for:
- Required collections and modes (colors: background/text/icon/border/accent/interactive; foundations: space/radius/size/shadow/type)
- Naming conventions using slash-separated paths (e.g., `color/background/light/primary`)
- Export contract and data type requirements
- Change checklist when adding tokens

## Enforcement

- Source of truth: `packages/tokens/src/tokens/index.dtcg.json`
- Generated outputs: `packages/tokens/src/foundations.css`, `packages/tokens/src/colors.ts`
- Validation:
  - `packages/tokens/tests/token-validation.test.ts` (background/text/icon/accent hex + mode parity + focus ring contrast)
  - `packages/tokens/src/validation/token-validator.ts` (color parity for all categories including border/interactive)
