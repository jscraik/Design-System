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

- [ ] Import the supported consumer stylesheet in your app entry and let it pull in the required token, Apps SDK UI, theme, and accessibility layers:

```css
@import "tailwindcss";
@import "@design-studio/ui/styles.css";
```

- [ ] Do not import internal UI style subpaths such as `@design-studio/ui/styles/ui.css` or `@design-studio/ui/styles/theme.css`; those are implementation details, not supported consumer entry points.

- [ ] Ensure Tailwind v4 scans the UI package (if applicable):

  **Monorepo (workspace:\* dependencies)**

  ```css
  @source "../../node_modules/@openai/apps-sdk-ui";
  @source "../../packages/ui/src";
  ```

  **Installed packages / separate repo**

  ```css
  @source "../node_modules/@openai/apps-sdk-ui";
  @source "../node_modules/@design-studio/ui/dist";
  ```

**Widgets (standalone bundles)**

- [ ] Include the same `@design-studio/ui/styles.css` import in the widget entry stylesheet.
- [ ] Validate the bundle output includes the resolved `@design-studio/ui/styles.css` payload rather than relying on internal `ui.css` / `theme.css` subpaths.

**Tauri (desktop)**

- [ ] Import the same `@design-studio/ui/styles.css` entry in the webview stylesheet.
- [ ] Confirm the theme variables load before your app root renders.

### Supported install modes

- [ ] Use one of the supported dependency models:
  - Same pnpm workspace / monorepo with `workspace:*`
  - Published packages from npm or a private registry
- [ ] Do **not** treat raw `file:` installs of `packages/ui` or a checked-out git submodule as a supported consumer path; the source package manifests intentionally use workspace dependencies for local development.

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
