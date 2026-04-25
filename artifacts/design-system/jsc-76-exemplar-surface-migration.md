# JSC-76 Exemplar Surface Migration

## Summary

JSC-76 migrates the issue-listed exemplar surfaces onto the JSC-75 product composition primitives so agents see semantic product structure instead of hand-rolled page shells, panel chrome, and section heading chains.

## Changed

- `platforms/web/apps/web/src/pages/HarnessPage.tsx`
  - Replaced the custom viewport wrapper with `ProductPageShell`.
  - Replaced sidebar and iframe chrome with `ProductPanel`.
  - Replaced repeated sidebar groups with `ProductSection`.
- `platforms/web/apps/web/src/pages/TemplateBrowserPage.tsx`
  - Replaced the custom page header/wrapper with `ProductPageShell`.
- `packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx`
  - Replaced manual section headings with `ProductSection`.
- `packages/ui/src/app/settings/ManageAppsPanel/ManageAppsPanel.tsx`
  - Replaced nested manual section headings with `ProductSection`.
- `packages/ui/src/components/ui/layout/ProductComposition/ProductComposition.tsx`
  - Added shell slot class overrides for real app page sidebars and main regions.
  - Added `ProductPanel` body slot class override for full-height preview regions.

## Layer Impact

- Brand tokens: no changes.
- Alias tokens: no changes.
- Mapped semantic usage: exemplar surfaces continue to use mapped utilities such as `bg-background`, `bg-muted`, `text-foreground`, `text-text-secondary`, `text-muted-foreground`, `border-border`, `ring-ring`, and `text-interactive`.
- Composition layer: product pages and settings panels now route through `ProductPageShell`, `ProductPanel`, and `ProductSection`.

## Literal Escape Scan

Focused scan target:

- `platforms/web/apps/web/src/pages/HarnessPage.tsx`
- `platforms/web/apps/web/src/pages/TemplateBrowserPage.tsx`
- `packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx`
- `packages/ui/src/app/settings/ManageAppsPanel/ManageAppsPanel.tsx`

Patterns checked:

- `foundation-*`
- raw hex colors
- `rgb()` / `rgba()`
- arbitrary Tailwind layout or typography escapes such as `text-[...]`, `leading-[...]`, `tracking-[...]`, `p-[...]`, `m-[...]`, `gap-[...]`, `w-[...]`, `h-[...]`, and `max-w-[...]`

Result: no matches in the issue-listed exemplar surfaces after migration.

## Validation

- Command: `pnpm -C packages/ui test ProductComposition settings-panels.exemplar` -> pass (2 files, 16 tests).
- Command: `pnpm -C packages/ui type-check` -> pass.
- Command: `rg -n "foundation-|#[0-9A-Fa-f]{3,8}|rgba?\(|text-\[[^]]+\]|leading-\[[^]]+\]|tracking-\[[^]]+\]|p-\[[^]]+\]|m-\[[^]]+\]|gap-\[[^]]+\]|w-\[[^]]+\]|h-\[[^]]+\]|max-w-\[[^]]+\]" platforms/web/apps/web/src/pages/HarnessPage.tsx platforms/web/apps/web/src/pages/TemplateBrowserPage.tsx packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx packages/ui/src/app/settings/ManageAppsPanel/ManageAppsPanel.tsx packages/ui/src/components/ui/layout/ProductComposition/ProductComposition.tsx` -> pass (no matches; `rg` exit 1).
- Command: `pnpm design-system-guidance:ratchet` -> pass.
- Command: `pnpm design-system-guidance:check:ci` -> pass (exit 0 with existing warning backlog outside the migrated exemplar files).
- Command: `pnpm -C packages/ui build` -> pass.
- Command: `pnpm ds:matrix:generate` -> pass.
- Command: `pnpm generated-source:check` -> pass.
- Command: `pnpm test:policy` -> pass.
- Command: `pnpm test:e2e:web` -> pass (49 passed; required unsandboxed browser launch after sandboxed Chromium Mach-port denial).
- Command: `pnpm test:a11y:widgets` -> pass (12 passed; required unsandboxed browser launch after sandboxed Chromium Mach-port denial).
- Command: `git diff --check` -> pass.

Blocked/remediated attempts:

- Command: `pnpm build:web` -> blocked in the default sandbox by local server bind failures: `listen EPERM: operation not permitted ::1:5174` and `::1:5175`.
- Command: `pnpm build:web` with network permission -> blocked by Chromium launch denial: `bootstrap_check_in ... MachPortRendezvousServer ... Permission denied (1100)`.
- Command: `pnpm test:policy` initially failed after the UI bundle change because generated widget manifests were stale; `pnpm generated-source:check` regenerated them and the final `pnpm test:policy` passed.
