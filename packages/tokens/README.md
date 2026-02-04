# @design-studio/tokens

Last updated: 2026-01-09

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Overview and essential workflows for this area
- Non-scope: Deep API reference or internal design rationale
- Owner: Jamie Scott Craik (@jscraik)
- Review cadence: Each release

Design tokens for aStudio. This package provides CSS variables, a Tailwind preset, and TypeScript exports used by Storybook and audits.

Note: For production UI code, prefer Apps SDK UI components and tokens. Use these foundations as an audit/extension layer.

## Table of contents

- [Prerequisites](#prerequisites)
- [Install](#install)
- [Quick start](#quick-start)
- [Generate tokens](#generate-tokens)
- [Export to Figma](#export-to-figma)
- [Validate tokens](#validate-tokens)
- [Docs](#docs)
- [Verify](#verify)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js 18+
- pnpm 10.27.0 (for repo scripts)

## What this package contains

- `src/tokens/index.dtcg.json` - Canonical DTCG 2025.10 compliant token source of truth
- `src/foundations.css` - Foundation tokens (audit/extension only)
- `src/tokens.css` - App-level tokens
- `tailwind.preset.ts` - Tailwind preset for consuming apps
- `dist/` - TypeScript exports for tooling and docs

## Docs

- `packages/tokens/docs/FIGMA_EXPORT_GUIDE.md` - Figma export workflow and handoff
- `packages/tokens/docs/outputs/manifest.json` - Generated validation manifest (token build output)

## Export to Figma

Generate Figma-compatible DTCG format:

```bash
pnpm -C packages/tokens export:figma
```

This creates four files in `packages/tokens/dist/`:

| File | Purpose |
|------|---------|
| `figma-tokens.json` | Flat format (easiest import) |
| `figma-tokens-combined.json` | Organized by collection (recommended) |
| `figma-tokens-light.json` | Color tokens (light mode only) |
| `figma-tokens-dark.json` | Color tokens (dark mode only) |

### Import into Figma

1. Open Figma → **Local variables** → **Import**
2. Select `figma-tokens-combined.json`
3. Figma creates collections: `colors`, `spacing`, `radius`, `size`, `shadow`, `typography`
4. For color tokens, manually create **Light** and **Dark** modes
5. Copy dark values from `__dark` tokens into the Dark mode column

### Supported Token Types in Figma

| Our Token | Figma Variable | Notes |
|-----------|----------------|-------|
| `color` | Color | Import as color variables |
| `dimension` | Number | Converted to px values |
| `fontFamily` | String | Font names as strings |
| `fontWeight` | Number | Numeric weights |
| `shadow` | String | CSS shadow format |
| `letterSpacing` | Number | Tracking values |

## Install

```bash
pnpm add @design-studio/tokens
```

## Quick start

### CSS

```css
@import "@design-studio/tokens/foundations.css";
@import "@design-studio/tokens/tokens.css";
```

### Tailwind preset

```ts
// tailwind.config.ts
import preset from "@design-studio/tokens/tailwind.preset";

export default {
  presets: [preset],
};
```

## Generate tokens

From the repo root:

```bash
pnpm generate:tokens
```

To regenerate TypeScript token exports from the canonical DTCG bundle:

```bash
pnpm -C packages/tokens tokens:sync
```

Watch for changes:

```bash
pnpm -C packages/tokens generate:watch
```

## Validate tokens

```bash
pnpm validate:tokens
```

## Verify

After generation:

- `packages/tokens/src/foundations.css` updates
- `packages/tokens/docs/outputs/manifest.json` updates

## Troubleshooting

**Token generation fails**

- Check `packages/tokens/src/colors.ts` for invalid values.
- Run `pnpm validate:tokens` for details.

**CSS updates not reflected**

- Restart your Vite/Storybook dev server so it reloads updated CSS.
