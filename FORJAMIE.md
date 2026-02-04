# FORJAMIE.md

## TL;DR
- aStudio is a pnpm workspace monorepo for the ChatUI design system, including UI components, icons, tokens, templates, and tooling.
- The UI package (`packages/ui`) is where ChatGPT-style components, icon catalogs, and Storybook docs live.
- Design tokens in `packages/tokens` are the source of truth for colors, spacing, typography, radius, and other foundations.

## Architecture & Flow
- **Tokens ➜ UI**: `packages/tokens` generates CSS variables and a Tailwind preset. UI surfaces consume those tokens via Tailwind utilities (e.g., `bg-foundation-*`, `text-foundation-*`) or token values from the package exports.
- **Icons ➜ Catalog**: `packages/ui/src/icons` contains the ChatGPT icon sets and the catalog UI for browsing/searching icons.
- **Templates & Storybook**: `packages/ui/src/templates` and `packages/ui/src/storybook` demonstrate component usage and token references.

### High-level diagram (textual)
```
packages/tokens
  ├─ foundations.css (CSS variables)
  ├─ tailwind.preset.ts (tokenized utilities)
  └─ token exports (JS/TS)
        ↓
packages/ui
  ├─ components/ (UI primitives & composites)
  ├─ icons/ (ChatGPT icon library + catalog)
  └─ templates/storybook (docs + demos)
```

## Codebase Map (key locations)
- `packages/tokens/` — token generation, CSS variable outputs, and TS exports.
- `packages/ui/src/icons/` — icon sets, icon catalog, and icon system docs.
- `packages/ui/src/components/` — reusable UI components.
- `packages/ui/src/templates/` — demo templates (including icon catalog templates).
- `docs/` — architecture, guides, and system documentation.

## How to Run / Test
- Install: `pnpm install`
- Dev (web): `pnpm dev` or `pnpm dev:web`
- Storybook: `pnpm dev:storybook`
- Tests: `pnpm test`
- Lint/format: `pnpm lint`, `pnpm format`, `pnpm format:check`

## Lessons Learned
- Tokenized utilities and exported token values keep UI styling consistent and allow easy theming.
- For internal catalogs (icons, tokens), explicitly document required token CSS/preset assumptions so Storybook setups are predictable.

## Weaknesses & Improvements
- **Weakness**: Documentation about internal tooling can drift from implementation over time.
  - **Improvement**: Add a lightweight checklist for catalog/tooling updates in `packages/ui/src/icons/ICON_SYSTEM.md`.
- **Weakness**: Some surfaces still use non-tokenized utility classes.
  - **Improvement**: Audit and migrate remaining hard-coded spacing/typography classes to token usage.

## Recent Changes
- 2026-02-14: Replaced the placeholder ChatGPT icon catalog with a full, token-driven catalog UI and documented Storybook/internal usage requirements. (commit: d965b42)
