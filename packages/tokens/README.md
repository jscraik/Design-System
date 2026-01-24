# @astudio/tokens

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
- [Validate tokens](#validate-tokens)
- [Docs](#docs)
- [Verify](#verify)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js 18+
- pnpm 10.27.0 (for repo scripts)

## What this package contains

- `src/tokens/index.dtcg.json` - Canonical DTCG token source of truth
- `src/foundations.css` - Foundation tokens (audit/extension only)
- `src/tokens.css` - App-level tokens
- `tailwind.preset.ts` - Tailwind preset for consuming apps
- `dist/` - TypeScript exports for tooling and docs

## Docs

- `packages/tokens/docs/FIGMA_EXPORT_GUIDE.md` - Figma export workflow and handoff
- `packages/tokens/docs/outputs/manifest.json` - Generated validation manifest (token build output)

## Install

```bash
pnpm add @astudio/tokens
```

## Quick start

### CSS

```css
@import "@astudio/tokens/foundations.css";
@import "@astudio/tokens/tokens.css";
```

### Tailwind preset

```ts
// tailwind.config.ts
import preset from "@astudio/tokens/tailwind.preset";

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
