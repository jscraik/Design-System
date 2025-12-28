# PEER Operational State

## Current Focus

- Apps SDK compliance audit completed (~95% compliance)
- Release workflow and Changesets wiring in place
- React 19 compatibility enforced across the UI library
- Visual regression + a11y guardrails in place for widgets and core UI
- Iconography system expanded with full arrow icon set
- Widgets restyled to Apps SDK UI tokens (auth-demo, shopping-cart, pizzaz-shop, search-results, pizzaz-table, pizzaz-markdown)
- Full-repo formatting run (`pnpm format`)

## Todo List

### Critical

- [x] Add Vitest unit tests for packages/ui
- [x] Update CI to run unit tests
- [x] Run `pnpm install` to update `pnpm-lock.yaml`
- [x] Add new widgets from openai-apps-sdk-examples patterns
- [x] Apps SDK compliance audit

### High

- [x] Add `openai/widgetAccessible` to widget-callable tools
- [x] Add `openai/visibility: "private"` to widget-only tools
- [x] Add fullscreen mode support to Pizzaz Shop
- [x] Add accessibility improvements to shopping-cart widget
- [x] Add bundle size budgets + vendor chunking
- [x] Run automated accessibility audit (axe/lighthouse) on all widgets
- [x] Restyle remaining widgets (pizzaz-carousel, pizzaz-gallery, solar-system) to Apps SDK UI tokens
- [x] Split Three.js vendor chunk and adjust widget build size warning threshold
- [x] Add unit tests for remaining components (Select, Tabs, Accordion, etc.)
- [x] Add Playwright integration tests for apps/web routing
- [x] Re-run widget a11y audit after fixing regressions
- [x] Add visual regression testing (Playwright screenshots or Chromatic)
- [x] Add Storybook stories for all settings components

### Medium

- [x] Add internationalization support (i18n utility created)
- [x] Implement template URI versioning for cache busting
- [x] Document `_meta.widgetSessionId` pattern in runtime package
- [x] Replace remaining foundation-token styling in core UI surfaces with Apps SDK UI utilities
- [x] Migrate MDX docs to Storybook 10 format (optional)
- [x] Confirm MIT license holder name in `LICENSE`

## Resources

| Asset               | Path                             | Purpose                                  |
| ------------------- | -------------------------------- | ---------------------------------------- |
| Repo overview       | `README.md`                      | Monorepo purpose, packages, dev commands |
| Compliance audit    | `APPS_SDK_COMPLIANCE_AUDIT.md`   | Current Apps SDK checklist               |
| Gap analysis        | `APPS_SDK_GAP_ANALYSIS.md`       | Detailed gap analysis vs Apps SDK docs   |
| Widget architecture | `WIDGET_ARCHITECTURE.md`         | Widget pipeline summary                  |
| Compliance script   | `scripts/compliance.mjs`         | Hex/radix/lucide/MUI policy checks       |
| Test setup          | `packages/ui/src/test/setup.ts`  | Vitest test configuration                |
| Test utils          | `packages/ui/src/test/utils.tsx` | Testing Library helpers                  |

## Session Notes

- 2025-12-28: Release/process + compatibility hardening
  - React 19 compatibility enforced (peers + pnpm overrides for react/react-dom/types)
  - Added/updated a11y labels for icon-only controls across settings/modals/chat sidebar
  - Added/expanded unit tests for remaining primitives (Select, Tabs, Accordion)
  - Visual regression snapshots wired via Playwright (@visual) and updated
  - Formatting pass run for CI consistency
  - Core UI surfaces now use foundation token utilities (removed raw var() classes)

- 2025-12-28: Visual regression stabilization
  - Playwright visual config runs Vite on port 5176 (strict) to avoid clashes
  - Installed Playwright browsers (firefox/webkit) for visual coverage
  - Updated visual snapshots after sidebar toggle selector fix

- 2025-12-28: Bloat + dead-code cleanup
  - Removed legacy visual suite from `apps/web/tests/visual.spec.ts` and darwin-only snapshots
  - Pruned unused Figma export components under `packages/ui/src/imports/` (kept svg paths)
  - Trimmed `apps/web` dependencies to only used workspace + React deps
  - Dropped unused `@react-spring/three` from widgets
  - E2E config now ignores visual tests (`apps/web/playwright.config.ts`)
  - Visual snapshots now stored per Playwright project (config updated + baselines regenerated)
  - Restored `tw-animate-css` for apps/web (required by main.css)
  - Split ChatGPT icon bundles into per-pack modules to reduce bundle bloat
  - Added Git LFS tracking for `context/foundations/*.pdf`

- 2025-12-28: Bug-hunt fixes + validation
  - `useWidgetState` now propagates `null` to host and avoids clobbering defaults when host state is undefined
  - `createEmbeddedHost` now resolves `window.openai` lazily so late injection works
  - Chart tooltip renders zero values correctly
  - `apps/web` navigation hook is wired to Router (kept as API)
  - Dialog tests now include descriptions to eliminate Radix warnings
  - `.gitignore` updated with explicit app-level Playwright output paths
  - Tests: `pnpm test` (pass, 477 tests), `pnpm test:visual:web` (pass, 72 tests)

- 2025-12-28: Settings components Storybook stories
  - Created 12 comprehensive Storybook stories for all settings components
  - Stories include: SettingRow, SettingToggle, SettingDropdown (base components)
  - Panel stories: PersonalizationPanel, SecurityPanel, AudioSettingsPanel, AppsPanel, ArchivedChatsPanel, CheckForUpdatesPanel, DataControlsPanel, NotificationsPanel, ManageAppsPanel
  - All stories follow established patterns with proper Meta/StoryObj types
  - Include interactive examples, multiple variants, and proper documentation
  - All stories pass TypeScript diagnostics with no errors
  - Stories use proper dark theme backgrounds and fullscreen layouts for panels

- 2025-12-27: Iconography expansion
  - Added 30+ arrow/navigation icons to ChatGPTIcons.tsx from design reference SVG
  - Icons include: large arrows, curved arrows, diagonal arrows, rotate arrows, large chevrons, chevron combos, expand/collapse variants, regenerate variants, shuffle, reply
  - Updated icons/index.ts to export new icons
  - Updated IconographyShowcase with new "Actions" section
  - All icons use existing SVG paths from svg-1rwrilg7kc.ts

- 2025-12-27: Apps SDK compliance audit - Phase 2 (Medium Priority)
  - Added comprehensive accessibility to shopping-cart widget (ARIA roles, labels, focus rings)
  - Created i18n utility at `packages/widgets/src/shared/i18n.ts` with locale-aware formatting
  - Added template URI versioning with `WIDGET_VERSION` constant and `versionedUri()` helper
  - Added bundle size budgets (500KB warning) and vendor chunking in vite.config.ts
  - Updated APPS_SDK_GAP_ANALYSIS.md to reflect ~95% compliance
  - All high and medium priority gaps now addressed

- 2025-12-27: Apps SDK compliance audit - Phase 1 (High Priority)
  - Created comprehensive gap analysis (APPS_SDK_GAP_ANALYSIS.md)
  - Added `openai/widgetAccessible: true` to cart tools (add_to_cart, remove_from_cart)
  - Added `openai/visibility: "private"` to widget-only tools (auth_logout, auth_refresh)
  - Added fullscreen mode support to Pizzaz Shop with expand button

- 2025-12-27: Added new widgets from openai-apps-sdk-examples patterns
  - Shopping Cart widget: demonstrates `widgetSessionId` pattern
  - Pizzaz Shop widget: full e-commerce checkout flow with Framer Motion
  - Auth Demo widget: authenticated tool call patterns
  - Added 9 new MCP server tools

- 2025-12-27: Production-scale testing infrastructure
  - Added Vitest + Testing Library to packages/ui
  - 138 unit tests passing for core primitives
  - Updated CI workflow with unit test job and a11y job

- 2025-12-27: Widget styling + build updates
  - Added dashboard-widget to Vite build inputs and MCP resource list
  - Restyled widgets to Apps SDK UI tokens (auth-demo, shopping-cart, pizzaz-shop, search-results, pizzaz-table, pizzaz-markdown)
  - Updated DashboardPage to use Apps SDK UI token utilities
  - Added duplicate-widget ID guard in MCP server
  - Ran `pnpm format` across the repo

- 2025-12-27: Remaining widget restyle + dashboard tool
  - Restyled pizzaz-carousel, pizzaz-gallery, and solar-system widgets to Apps SDK UI tokens
  - Added `display_dashboard` tool pointing to `ui://widget/dashboard-widget.html`
  - Dashboard widget now reads tool output for stats/recent chats
  - `pnpm lint` clean
  - Split Three.js dependencies into dedicated chunks and raised warning limit to 800KB
  - `pnpm -C packages/widgets build` succeeded without warnings

- 2025-12-27: Dashboard tooling + Storybook demo
  - Added DashboardPage story with tool-output sample data
  - Updated golden prompt set with `display_dashboard`
  - Reworked Three.js chunking via manualChunks (react, motion, three core/react/post)
  - `pnpm -C packages/widgets build` clean with new chunking

- 2025-12-27: Storybook + widget harness polish
  - Added Tool Output guidance to `packages/ui/STORYBOOK_GUIDE.md`
  - Added dashboard widget to `apps/web` widget harness
  - Exported UI icons from `packages/ui/src/index.ts` to fix `IconGrid3x3` import in `apps/web`
  - Ran full-repo formatting (`pnpm format`) with no changes
  - Verified `apps/web` dev server boots (Vite ready at `http://localhost:5173/`)

- 2025-12-27: E2E, a11y, and MCP contract testing
  - Added Playwright e2e routing tests for `apps/web` with `apps/web/playwright.config.ts`
  - Added widget a11y audit (axe + Playwright) with CI enforcement (`A11Y_STRICT=1`)
  - Added MCP tool contracts + golden prompt coverage tests (`apps/mcp/tool-contracts.json`)
  - Updated MCP server to export `createChatUiServer` and guard direct-run startup

- 2025-12-27: A11y fixes for chat-view, dashboard, kitchen-sink-lite
  - Added aria labels for icon-only ChatHeader actions and IconButton accessibility
  - Converted ChatSidebar Popover trigger to a button element for proper ARIA attributes
  - Added aria labels to DashboardPage progress bars
  - Replaced kitchen-sink-lite CodeBlock with accessible local version and removed duplicate mock setup
  - Updated widget a11y test script to build UI first, and re-ran `pnpm test:a11y:widgets` (12 passed)
  - Ran `pnpm test:mcp-contract` (2/2 passed)

## Decisions Made

- Keep demo/Docs exports out of the root UI barrel; expose via `@chatui/ui/dev`
- Require React 19 for `@chatui/ui` to align with Apps SDK UI usage
- Release workflow standardized via Changesets + CI action
- CI runs lint, format check, compliance, type-checks, unit tests, and builds
- Unit tests use jsdom environment with mocked Radix dependencies
- Tests focus on invariants (render, ref, disabled, keyboard, ARIA) not visual appearance
- New widgets demonstrate key Apps SDK patterns: widgetSessionId, multi-view navigation, auth flows
- Widget-only tools (auth_logout, auth_refresh) use `visibility: "private"` to hide from model
- i18n uses lightweight custom utility instead of react-intl (simpler, smaller bundle)
- Template URIs versioned via query param for cache busting without filename changes
- Bundle size budget set at 500KB warning (not hard fail) to allow flexibility
- Widgets should prefer Apps SDK UI token utilities over manual light/dark branching

## User Preferences

- Wants deeper review across all areas and guidance aligned to industry best practice/standards as of Dec 2025
- Production-scale testing: unit tests, a11y enforcement, visual regression, bundle budgets
