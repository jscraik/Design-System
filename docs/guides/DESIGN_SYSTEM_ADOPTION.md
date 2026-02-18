# Design System Adoption Guide

Last updated: 2026-02-14

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Choosing the right UI layer + minimal consumption setup
- Non-scope: Full component API reference or exhaustive theming recipes
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

This guide explains when to use Apps SDK UI, when to use `@design-studio/ui`, and when tokens-only is appropriate. It also includes the minimal setup for a consuming app and a short “golden path” checklist.

## Decision guide: which layer to use

**Start with the charter and design guidelines**:

- Charter (non-negotiable rules): `docs/design-system/CHARTER.md`
- Design guidelines (usage expectations): `docs/guides/DESIGN_GUIDELINES.md`

### Use Apps SDK UI directly (`@openai/apps-sdk-ui`)

Use Apps SDK UI when you are building:

- ChatGPT-embedded widgets or SDK surfaces.
- UI that must match upstream OpenAI interaction, accessibility, and visual conventions exactly.
- New features that already exist in Apps SDK UI (don’t rebuild them).

**Why:** The charter defines Apps SDK UI as the canonical foundation for embedded surfaces and the baseline contract for web foundations.

### Use `@design-studio/ui` (preferred for internal apps)

Use `@design-studio/ui` when you are building:

- First-party aStudio web apps or Tauri shells that need the aStudio component wrappers.
- UI that should align with Apps SDK UI but benefit from aStudio adapters, icons, and utilities.
- Features that already exist as wrappers in `@design-studio/ui` (use those instead of re-implementing).

**Why:** `@design-studio/ui` is the local adapter layer that keeps Apps SDK UI alignment while adding platform-ready defaults.

### Use tokens-only (`@design-studio/tokens`)

Use tokens-only when you are:

- Building audits, diagnostics, or design tooling.
- Extending the system with carefully-scoped styles that must stay inside the mapped token layer.
- Working in non-production experiments where components are unavailable.

**Avoid tokens-only for production UI** unless the charter allows a documented exception (for example, Apps SDK UI coverage gaps with a tracked migration plan).

## Minimal install steps for a consumer app

> This is the smallest repeatable setup for a consuming app that uses Apps SDK UI, `@design-studio/ui`, and tokens.

### 1) Install packages

```bash
pnpm add @openai/apps-sdk-ui @design-studio/ui @design-studio/tokens
```

### 2) Import CSS (tokens + Apps SDK UI)

Add these imports once in your app entry (for example, `src/main.tsx`):

```ts
import "@openai/apps-sdk-ui/css";
import "@design-studio/tokens/foundations.css";
import "@design-studio/tokens/tokens.css";
```

### 3) Tailwind preset

```ts
// tailwind.config.ts
import preset from "@design-studio/tokens/tailwind.preset";

export default {
  presets: [preset],
};
```

### 4) Required theme attribute

Ensure your root element sets the theme mode via `[data-theme]` (the design system reads from this attribute):

```html
<html data-theme="light">
  <body>
    <div id="root"></div>
  </body>
</html>
```

Switch to `data-theme="dark"` for dark mode. Embedded surfaces may receive this from the host, but standalone apps must set it explicitly.

## Golden path checklist (keep this short)

- **Use mapped tokens only.** No raw hex values; no direct brand/alias tokens in UI code. (See the charter token tiering rule.)
- **Tag Storybook stories.** Follow the taxonomy tags in `docs/guides/STORYBOOK_TAXONOMY.md`.
- **Run relevant QA gates.** At minimum:
  - `pnpm lint:compliance` (token + import policies)
  - `pnpm test:a11y:widgets` (a11y coverage for widgets)
  - `pnpm test:visual:web` or `pnpm test:visual:storybook` (visual drift detection)

## Related docs

- Charter: `docs/design-system/CHARTER.md`
- Design guidelines: `docs/guides/DESIGN_GUIDELINES.md`
- Token API mapping: `docs/theming/TOKEN_API_MAPPING.md`
- Storybook taxonomy: `docs/guides/STORYBOOK_TAXONOMY.md`
