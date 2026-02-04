# Design System Adoption Checklist

Last updated: 2026-02-15

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Integrating the design system into new projects (web, widgets, Tauri)
- Non-scope: Deep token internals or component API reference
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Checklist (web, widgets, Tauri)

### 1) Add required packages

- [ ] Install the core packages:
  - `@design-studio/ui`
  - `@design-studio/tokens`
  - `@design-studio/runtime`

Example (workspace dependency):

```json
{
  "dependencies": {
    "@design-studio/ui": "workspace:*",
    "@design-studio/tokens": "workspace:*",
    "@design-studio/runtime": "workspace:*"
  }
}
```

### 2) Wire required CSS + theme setup

**Web (React/Vite/Next)**

- [ ] Import the Apps SDK UI styles + tokens + UI theme in your global CSS:

```css
@import "tailwindcss";
@import "@openai/apps-sdk-ui/css";
@import "@design-studio/tokens/foundations.css";
@import "@design-studio/ui/styles/ui.css";
@import "@design-studio/ui/styles/theme.css";
```

- [ ] Ensure Tailwind v4 scans the UI package (if applicable):

  **Monorepo (workspace:\* dependencies)**

  ```css
  @source "../../packages/apps-sdk-ui/src";
  @source "../../packages/ui/src";
**Widgets (standalone bundles)**

- [ ] Include the same CSS imports in the widget entry stylesheet.
- [ ] Validate the bundle outputs include `tokens.css`, `ui.css`, and `theme.css`.

**Tauri (desktop)**

- [ ] Import the same CSS in the webview entry stylesheet.
- [ ] Confirm the theme variables load before your app root renders.

### 3) Use tokens correctly

- [ ] Use **semantic tokens only** (e.g., `--foreground`, `--background`, `--text-secondary`).
- [ ] Do **not** introduce raw literals (`#fff`, `12px`, `rgba(...)`) in UI code.
- [ ] If you need a new value, add a semantic token rather than inlining a literal.

Reference: [Token reference](../theming/token-reference.md).

### 4) Verify before shipping

- [ ] **Token validation:** `pnpm validate:tokens`.
- [ ] **Coverage check:** run `pnpm ds:matrix:check` and confirm new states exist in the [coverage matrix](./COVERAGE_MATRIX.md).
- [ ] **Drift suite (upstream changes):** run `pnpm test:drift` when `@openai/apps-sdk-ui` changes.

Supporting docs:
- [Design system contract](./CONTRACT.md)
- [Upstream alignment](./UPSTREAM_ALIGNMENT.md)
