# Figma Variables Contract

Last updated: 2026-01-31
Source: Figma design files → DTCG export → token pipeline

## Purpose

Defines how designers and developers should author Figma variables that feed the Design Token Community Group (DTCG) pipeline in this repository. This contract ensures seamless translation from design tokens to code.

## Required Collections + Modes

### Colors

**Collections (required):**
- `background` → primary, secondary, tertiary
- `text` → primary, secondary, tertiary, inverted
- `icon` → primary, secondary, tertiary, inverted, accent, statusError, statusWarning, statusSuccess
- `border` → light, default, heavy
- `accent` → gray, red, orange, yellow, green, blue, purple, pink, foreground
- `interactive` → ring

**Modes (required):**
- Light
- Dark
- HighContrast

**Key rule:** All color tokens must exist across all three modes with matching keys.

### Foundations

**Collections (single mode currently):**
- `space` → spacing scale (s4, s8, s12, s16, etc.)
- `radius` → border radius values (r6, r8, r10, r12, r16, r18, r21, r24, r30, round)
- `size` → control heights, card header height, hit target
- `shadow` → card, pip, pill, close
- `type` → typography scales (web platform: hero, h1–h6, paragraphLg/Md/Sm, caption)

## Naming Conventions

Figma variables must use **slash-separated paths** that map directly to DTCG keys:

**Color format:**
```
color/{category}/{mode}/{token}
```
Examples:
- `color/background/light/primary`
- `color/text/dark/secondary`
- `color/icon/highContrast/statusError`
- `color/accent/light/blue`
- `color/interactive/dark/ring`

**Foundation format:**
```
{collection}/{token}
```
Examples:
- `space/s16`
- `radius/r8`
- `size/controlHeight`
- `shadow/card`
- `type/web/hero` (typography token)
- `type/web/hero/size` (typography property)

## Mapping Table

| Figma Variable Path | DTCG Path | Output Example |
|---------------------|-----------|----------------|
| `color/background/light/primary` | `color.background.light.primary` | `--foundation-bg-light-1` |
| `color/accent/light/blue` | `color.accent.light.blue` | `--foundation-accent-blue-light` (dark uses `--foundation-accent-blue`) |
| `type/web/hero/size` | `type.web.hero.size` | `--foundation-hero-size` → Tailwind `fontSize.hero` |
| `space/s16` | `space.s16` | `--foundation-space-16` → Tailwind spacing uses static `16px` |
| `radius/r8` | `radius.r8` | `--foundation-radius-8` → Tailwind `borderRadius: { 'md': 'var(--foundation-radius-8)' }` |
| `size/controlHeight` | `size.controlHeight` | `--foundation-size-control-height` |
| `shadow/card` | `shadow.card` | `--foundation-shadow-card` |

## Export Contract

### Required Data Types

- **Color** → hex values (e.g., `#FFFFFF`, `#000000`)
- **Number/Dimension** → pixel values (e.g., `16`, `8`)
- **Font Family** → string names (e.g., `"Inter"`, `"SF Pro Text"`)
- **Font Weight** → numeric weights (e.g., `400`, `500`, `700`)
- **Letter Spacing** → unitless numbers (e.g., `-0.1`, `-0.25`)

### Normalized Values

- **Colors**: Uppercase 6-digit hex (`#RRGGBB`) required; alpha allowed for borders (`#RRGGBBAA`)
- **Sizes**: Numbers in pixels (no units in Figma; units added by generator)
- **Typography**: Font weights as numbers (not names like "Regular" or "Bold")

## Change Checklist

When adding or modifying Figma variables:

1. **Update alias map** → `packages/tokens/src/alias-map.ts` (add new token paths)
2. **Update validators/tests** → `packages/tokens/tests/token-validation.test.ts` (add coverage checks)
3. **Update theme.css** → `packages/ui/src/styles/theme.css` (if new usage slot needed)
4. **Regenerate outputs** → Run `pnpm --filter @design-studio/tokens generate` to update foundations.css and Tailwind preset
5. **Verify integration** → Check that new tokens resolve through Brand → Alias → Mapped flow

## Figma Export Workflow

For detailed export instructions, see [Figma Export Guide](../../../packages/tokens/docs/FIGMA_EXPORT_GUIDE.md).

**Steps:**

1. **Author in Figma** → Create or update variables using the naming conventions in this contract (slash-separated paths).
2. **Export via plugin** → Use Tokens Studio or Design Tokens plugin to export variables as DTCG JSON.
3. **Update DTCG source** → Replace `packages/tokens/src/tokens/index.dtcg.json` with exported content.
4. **Regenerate outputs** → Run `pnpm --filter @design-studio/tokens generate` to update foundations.css and Tailwind preset.
5. **Validate changes** → Run `packages/tokens/tests/token-validation.test.ts` to verify token integrity.

## Known Gaps

1. **Audit this section regularly**: gaps tend to go stale as token generation evolves. If you fix a gap, update this list in the same change-set.

2. **Alias CSS output layer is now implemented**: semantic alias variables live in `packages/tokens/src/aliases.css` and are consumed by `packages/ui/src/styles/theme.css`. Theme switching remains via `[data-theme]` attributes + `prefers-contrast: high`.

## Related Documentation

- [Brand Collection Rules](./brand-collection-rules.md) - Raw token values sourced from design
- [Alias Collection Rules](./alias-collection-rules.md) - Semantic path mappings
- [Mapped Collection Rules](./mapped-collection-rules.md) - Usage slots for UI consumption
- [Responsive Collection Rules](./responsive-collection-rules.md) - Typography and spacing scales

## Enforcement

- Source: Figma variables (authored by designers)
- Export: DTCG JSON (`packages/tokens/src/tokens/index.dtcg.json`)
- Validation: `packages/tokens/tests/token-validation.test.ts`
- Generated outputs: `packages/tokens/src/foundations.css`, `packages/tokens/tailwind.preset.ts`
