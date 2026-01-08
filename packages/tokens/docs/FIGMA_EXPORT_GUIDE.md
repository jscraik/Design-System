# Design Tokens for Figma Export

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (beginner to intermediate)
- Scope: Task-focused instructions for this topic
- Non-scope: Comprehensive architecture reference
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


This guide explains which files to copy from the codebase to Figma for design token synchronization.

## Files to Copy

### 1. Primary Source (Recommended)

**File**: `packages/tokens/src/tokens/index.dtcg.json`

This is the single source of truth for all design tokens in DTCG (Design Tokens Community Group) format.

**Contains**:

- Color tokens (light/dark modes, accents, interactive states)
- Spacing scale (0-128px)
- Typography system (web, iOS, Android platforms)
- Proper semantic naming and metadata

**How to use**:
Import this file into Figma using a plugin like:

- [Tokens Studio for Figma](https://tokens.studio/)
- [Design Tokens](https://www.figma.com/community/plugin/888356646278934516/design-tokens)

### 2. CSS Custom Properties (Alternative)

**File**: `packages/tokens/src/foundations.css`

Contains all tokens as CSS variables with accessibility features.

**Includes**:

- All color, spacing, and typography tokens as CSS custom properties
- High contrast mode support
- Reduced motion support
- Focus ring utilities

### 3. TypeScript Token Objects (For Reference)

**Files**:

- `packages/tokens/src/colors.ts` - Color values
- `packages/tokens/src/typography.ts` - Typography scale
- `packages/tokens/src/spacing.ts` - Spacing scale

These are generated from the DTCG JSON and provide type-safe access in TypeScript.

### 4. Tailwind Configuration (For Context)

**File**: `packages/tokens/tailwind.preset.ts`

Shows how tokens map to Tailwind utilities.

## Typography Platform Differences

The typography system includes platform-specific values:

### Web (Default)

- heading1: 36px / 600 / 40px line / -0.1px tracking
- heading2: 24px / 600 / 28px line / -0.25px tracking
- heading3: 18px / 600 / 26px line / -0.45px tracking
- body: 16px / 400-600 / 26px line / -0.4px tracking
- bodySmall: 14px / 400-600 / 18px line / -0.3px tracking
- caption: 12px / 400-600 / 16px line / -0.1px tracking

### iOS & Android

- heading1: 32px (smaller than web)
- heading3: 16px (smaller than web)
- body/bodySmall/caption: 0px tracking (no negative tracking)

The DTCG JSON file includes all platform variants. The generated TypeScript uses web values as the default.

## Token Structure

### Colors

```
color.background.{light|dark}.{primary|secondary|tertiary}
color.text.{light|dark}.{primary|secondary|tertiary|inverted}
color.icon.{light|dark}.{primary|secondary|tertiary|inverted}
color.accent.{light|dark}.{blue|red|orange|green|purple|foreground}
color.interactive.{light|dark}.ring
```

### Spacing

```
space.{s0|s2|s4|s8|s12|s16|s24|s32|s40|s48|s64|s128}
```

### Typography

```
type.fontFamily
type.{web|ios|android}.{heading1|heading2|heading3|body|bodySmall|caption}.{size|lineHeight|weight|tracking}
```

## Regenerating Tokens

If you update the DTCG JSON file, regenerate the TypeScript and CSS files:

```bash
pnpm --filter @chatui/tokens generate
```

This will:

1. Sync the DTCG JSON to TypeScript token objects
2. Generate CSS custom properties
3. Generate Swift design tokens
4. Generate Xcode asset catalogs
5. Update the manifest

## Notes

- The DTCG format is the industry standard for design tokens
- All tokens use semantic naming (not hardcoded values)
- Platform-specific values are documented in the DTCG JSON
- The web platform values are used as defaults in the codebase
