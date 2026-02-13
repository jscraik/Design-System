# Token Mapping: ChatGPT UI Templates -> aStudio Tokens

## Context
This maps the source template tokens (`packages/ui/src/templates/_temp_import/design-tokens.ts`) to the current aStudio token sources (`packages/tokens/src/*`). It highlights overlaps, gaps, and differences to guide the merge in task 4.2.

## Source of truth
- aStudio tokens (DTCG): `packages/tokens/src/tokens/index.dtcg.json`
- Generated exports:
  - Colors: `packages/tokens/src/colors.ts`
  - Spacing: `packages/tokens/src/spacing.ts`
  - Typography (web): `packages/tokens/src/typography.ts`

## Color tokens
Source `colors` aligns 1:1 with `colorTokens` in aStudio.

- `colors.background.*` -> `colorTokens.background.*`
- `colors.text.*` -> `colorTokens.text.*`
- `colors.icon.*` -> `colorTokens.icon.*`
- `colors.accent.*` -> `colorTokens.accent.*`
- `colors.interactive.*` -> `colorTokens.interactive.*`

Border mapping differences:
- Source:
  - `colors.border.light.light` -> `colorTokens.border.light.light` (#0D0D0D0D)
  - `colors.border.light.heavy` -> `colorTokens.border.light.heavy` **or** `.default` (#0D0D0D26)
  - `colors.border.dark.light` -> `colorTokens.border.dark.light` (#FFFFFF0D)
  - `colors.border.dark.default` -> `colorTokens.border.dark.default` **or** `.heavy` (#FFFFFF26)
- aStudio adds `border.light.default` and `border.dark.heavy` (same values as heavy/default above).

## Spacing tokens
Source uses keyed values (s128..s0). aStudio exposes an ordered scale array.

Mapping (index -> value):
- `space.s128` -> `spacingScale[0]`
- `space.s64` -> `spacingScale[1]`
- `space.s48` -> `spacingScale[2]`
- `space.s40` -> `spacingScale[3]`
- `space.s32` -> `spacingScale[4]`
- `space.s24` -> `spacingScale[5]`
- `space.s16` -> `spacingScale[6]`
- `space.s12` -> `spacingScale[7]`
- `space.s8` -> `spacingScale[8]`
- `space.s4` -> `spacingScale[9]`
- `space.s2` -> `spacingScale[10]`
- `space.s0` -> `spacingScale[11]`

Recommendation: add a named spacing map in tokens or a helper in UI to avoid index lookups.

## Typography tokens
Source includes `web`, `ios`, `android` sections. aStudio exports `typographyTokens` for web only, but DTCG already contains ios/android values.

Mapping (web):
- `typography.web.heading1` -> `typographyTokens.heading1`
- `typography.web.heading2` -> `typographyTokens.heading2`
- `typography.web.heading3` -> `typographyTokens.heading3`
- `typography.web.body` -> `typographyTokens.body`
- `typography.web.bodySmall` -> `typographyTokens.bodySmall`
- `typography.web.caption` -> `typographyTokens.caption`
- `typography.fontFamily` -> `typographyTokens.fontFamily`

Additional aStudio typography tokens (no source equivalents):
- `cardTitle`, `listTitle`, `listSubtitle`, `buttonLabel`, `buttonLabelSmall`

iOS/Android typography exists in `index.dtcg.json` but is not exported in `packages/tokens/src/index.ts`.

## Utility helpers
Source `design-tokens.ts` provides helpers (`getColor`, `getBackgroundClass`, etc.). These are not present in aStudio; prefer using token exports + existing Tailwind utility classes (foundation token classes) to keep parity.

## Gaps to resolve in merge (task 4.2)
- Decide whether to export iOS/Android typography from tokens.
- Decide on a named spacing map to replace `space.s*` usage.
- Replace hex utility helpers with token-backed classes or variables.
