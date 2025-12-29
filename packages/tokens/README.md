# @chatui/tokens

Design tokens for ChatUI. This package provides CSS variables, a Tailwind preset, and TypeScript exports used by Storybook and audits.

Note: For production UI code, prefer Apps SDK UI components and tokens. Use these foundations as an audit/extension layer.

## What this package contains

- `src/foundations.css` - Foundation tokens (audit/extension only)
- `src/tokens.css` - App-level tokens
- `tailwind.preset.ts` - Tailwind preset for consuming apps
- `dist/` - TypeScript exports for tooling and docs

## Install

```bash
pnpm add @chatui/tokens
```

## Usage

### CSS

```css
@import "@chatui/tokens/foundations.css";
@import "@chatui/tokens/tokens.css";
```

### Tailwind preset

```ts
// tailwind.config.ts
import preset from "@chatui/tokens/tailwind.preset";

export default {
  presets: [preset],
};
```

## Generate tokens

From the repo root:

```bash
pnpm generate:tokens
```

Watch for changes:

```bash
pnpm -C packages/tokens tokens:watch
```

## Validate tokens

```bash
pnpm validate:tokens
```

## Verify

After generation:

- `packages/tokens/src/foundations.css` updates
- `swift/ChatUIFoundation/Sources/ChatUIFoundation/Resources/Colors.xcassets/` updates

## Troubleshooting

**Token generation fails**

- Check `packages/tokens/src/colors.ts` for invalid values.
- Run `pnpm validate:tokens` for details.

**Swift colors not updating**

- Ensure the Asset Catalog is committed.
- Restart Xcode previews if changes are not reflected.
