# FORJAMIE — design-system

## Table of Contents

- [Status](#status)
- [TL;DR](#tldr)
- [Architecture & data flow](#architecture--data-flow)
- [Codebase map](#codebase-map)
- [What's done / what's not](#whats-done--whats-not)
- [How to run locally](#how-to-run-locally)
- [How to test](#how-to-test)
- [Learnings & gotchas](#learnings--gotchas)
- [Weaknesses & improvements](#weaknesses--improvements)
- [Recent changes](#recent-changes)

## Status

<!-- STATUS_START -->
**Last updated:** 2026-03-24
**Production status:** IN_PROGRESS
**Overall health:** Yellow

| Area | Status | Notes |
| --- | --- | --- |
| Build / CI | Yellow | Root design-system policy now blocks on token truth, coverage freshness, and repo-wide guidance; broader warn backlog still exists |
| Tests | Yellow | `pnpm -C packages/ui exec vitest run src/app/settings/settings-panels.exemplar.test.tsx` passes; the broader `pnpm design-system-guidance:check:ci` command currently exits on the known repo-wide warn backlog |
| Security | Clean | 13 CVEs patched; GitHub Actions SHA-pinned |
| Open PRs | 0 | |
| Blockers | None | |
<!-- STATUS_END -->

## TL;DR

This monorepo is the aStudio design system and Apps SDK UI foundation. It ships reusable token, UI, runtime, icon, and widget packages, plus example web and Storybook surfaces and an MCP integration harness so downstream apps can build consistent ChatGPT-style experiences.

## Architecture & data flow

```mermaid
flowchart LR
  Tokens["packages/tokens"] --> UI["packages/ui"]
  Runtime["packages/runtime"] --> UI
  UI --> Web["platforms/web/apps/web"]
  UI --> Storybook["platforms/web/apps/storybook"]
  Widgets["packages/widgets"] --> Web
  Web --> MCP["platforms/mcp"]
  Guidance["packages/design-system-guidance"] --> Docs["docs/"]
```

- `packages/tokens` generates the design primitives and semantic variables that feed the UI layer.
- `packages/ui` is the primary React component library consumed by the web app, Storybook, and widget surfaces.
- `packages/runtime` provides host adapters and environment wiring for embedded and standalone usage.
- `packages/widgets` packages standalone widget bundles used by the web surface and MCP integration paths.
- `platforms/mcp` contains the MCP integration harness and tool contract tests.
- `packages/design-system-guidance` packages the policy and guidance checks used to keep downstream consumers aligned, including repo-scoped protected-surface enforcement and an exemption ledger.

## Codebase map

- `packages/ui/` contains the core React components, styles, integrations, and Vitest coverage for the public UI library.
- `packages/tokens/` owns token generation, validation, and the source-of-truth design primitives.
- `packages/runtime/` contains host adapters and runtime abstractions shared by UI consumers.
- `packages/widgets/` contains embeddable widget bundles and a11y coverage for widget delivery.
- `platforms/web/apps/web/` is the primary development surface for exercising the design system in a real app shell.
- `platforms/web/apps/storybook/` is the component documentation and visual verification surface.
- `platforms/mcp/` contains the MCP server integration harness and contract tests.
- `docs/` holds architecture, adoption, rollout, and governance guidance.
- `scripts/` holds build, validation, drift-check, onboarding, and release tooling.
- Consumer projects should import `@design-studio/ui/styles.css` as the public stylesheet entry; internal style subpaths are implementation details and raw `file:` installs of `packages/ui` are not a supported external adoption path.

## What's done / what's not

| Area | State | Notes |
| --- | --- | --- |
| Core package structure | Done | Tokens, UI, runtime, widgets, icons, and MCP/web surfaces are all established |
| Adoption and guidance docs | Done | Onboarding command center, release docs, and governance docs exist |
| Guidance package | Done | `@brainwav/design-system-guidance` now supports repo-scoped `error`/`warn`/`exempt` enforcement, path specificity, and exemption-ledger validation |
| Protected settings migration | In progress | The initial settings wave is migrated onto shared shell/composition patterns, with explicit state stories and jsdom exemplar tests for the protected settings slice; broader app/storybook warn backlog remains intentionally non-blocking |
| Visual regression workflow | In progress | Root visual scripts now route through `scripts/run-playwright-suite.mjs` and `packages/ui build:visual`, and the exemplar gate now covers both the template browser shell and an isolated template-widget shell route |
| Current dependency hygiene | In progress | This change-set pins `vitest-axe` back to `1.0.0-pre.3` for deterministic installs |
| Long-term debt cleanup | In progress | Lint, icon a11y, and docs maintenance remain ongoing work |

## How to run locally

```bash
pnpm install
pnpm dev
pnpm dev:storybook
pnpm build
```

## How to test

```bash
pnpm test
pnpm lint
pnpm format:check
pnpm build
pnpm test:policy
pnpm test:exemplar-evaluation:list
pnpm test:exemplar-evaluation:update
pnpm design-system-guidance:ratchet
pnpm test:visual:web -- --list
pnpm test:visual:storybook -- --list
```

The visual suites now go through `scripts/run-playwright-suite.mjs`, which prebuilds `packages/ui` with `pnpm -C packages/ui build:visual` before handing the remaining args straight to Playwright. Use that path when you need reliable `--list`, `--grep`, or `--update-snapshots` behavior from the root scripts without leaving the package in a declaration-broken state.
The policy-owned exemplar slice now has its own root entry points. Use `pnpm test:exemplar-evaluation:list` to inspect the exact protected Storybook checks, and `pnpm test:exemplar-evaluation:update` to refresh only those baselines instead of hand-copying long `PLAYWRIGHT_STORYBOOK_*` env strings. `TemplateBrowserPage` is now part of the always-on exemplar slice, but that browser-backed check runs as an explicit exemplar gate rather than as part of the browser-free `pnpm test:policy` contract.
For template-family QA, use `/templates` for the searchable browser shell and `/template-widget/<template-id>` for the isolated single-template widget shell that mirrors widget-style rendering without needing `VITE_TEMPLATE_ID`.
Committed visual baselines live under `tests/visual/__snapshots__`. Local Playwright HTML reports, nested Vite cache outputs under `node_modules/.vite`, nested `.tmp` build scratch files, and ad hoc `reports/audit-*` outputs are now gitignored so browser runs stop polluting the branch.

## Learnings & gotchas

See also: `~/.codex/instructions/Learnings.md`

- Keep `FORJAMIE.md` detailed and current whenever behavior, structure, config, or tooling changes.
- Pre-release dependencies should stay pinned when the repo depends on exact lockfile behavior across workspaces.
- Use the repo preflight helper before path-sensitive or multi-step git workflows.
- Guidance-policy exemptions must stop applying the moment they expire; otherwise CI reports the ledger drift but still hides the real surface-level rule failure that needs cleanup.
- Local Memory preflight probes need to honor the configured `rest_api.host` for every REST smoke request, not just health checks, or valid non-loopback setups look broken.
- The exemplar-evaluation gate depends on Playwright browser binaries being installed locally; if `pnpm test:exemplar-evaluation` fails before running tests, verify Chromium is provisioned for Playwright in this environment. `pnpm test:policy` should stay browser-free so pre-Playwright CI and release workflows do not fail on unrelated changes.
- `TemplateWidgetPage` only rendered during `VITE_TEMPLATE_ID` widget builds before this slice. The stable runtime route for browser QA is now `/template-widget/<template-id>`, which gives the web visual suite a deterministic way to protect the isolated widget shell.
- Protected settings stories are inside the same repo-governed surface family as the app panels, so even Storybook-only scaffolding should avoid literal background hex values or other policy escapes that would add noisy guidance debt.
- `TemplateBrowserPage` is now part of the default exemplar gate. If `pnpm test:exemplar-evaluation` fails on the template-browser slice, treat that as a real always-on page regression rather than an opt-in baseline workflow.
- The root visual scripts are now the canonical entry point for listing or filtering Playwright coverage. They use the `packages/ui build:visual` path, which preserves declaration output while still avoiding the earlier visual-only typegen noise from internal Storybook demo code.
- The guidance CLI now supports `--json` for policy tooling, and large guidance payloads must be flushed before exit. If a future automation sees truncated JSON around 64 KB, check the CLI output path before blaming the policy consumer.
- If Storybook or web visual runs suddenly explode into dozens of identical Playwright launch failures, the likely problem is a missing local browser binary rather than dozens of broken stories. The suite wrapper now preflights Chromium for non-`--list` runs and prints the single remediation command.
- If you need to refresh the protected settings exemplar baselines, do not paste the long `PLAYWRIGHT_STORYBOOK_STORY_IDS=...` command by hand. Use `pnpm test:exemplar-evaluation:update` so the update path stays aligned with the policy runner's canonical `components-settings-*` story IDs.
- Storybook screenshot URLs must set both `globals.theme` and `backgrounds.value`, and they must derive their base URL from `PLAYWRIGHT_STORYBOOK_BASE_URL` / `PLAYWRIGHT_STORYBOOK_PORT` instead of hard-coding `localhost:6006`. Otherwise “light” screenshots can silently render the dark theme, and reused non-default Storybook servers will fail.
- Storybook visual captures now disable Agentation and Dialkit overlays by URL flag during Playwright runs. If a visual failure suddenly shows the MCP/annotation panel inside the screenshot, the preview/test URL contract has drifted and should be repaired before blessing any baseline.
- Storybook visual regression now runs single-worker with a 90s test timeout. That is intentional: the settings exemplar slice proved flaky under local parallel capture and late dark-theme sweeps, so determinism now wins over speed for this gate.
- Storybook visual captures now pin Playwright to `en-US` / `UTC`, and fullscreen exemplar stories are forced onto the exact `1280x720` capture surface inside the spec harness. If Ubuntu-only screenshot drift shows up on chat/settings fullscreen stories, check the visual harness before re-blessing baselines.
- Storybook dev must ignore Playwright artifact paths during visual runs. If the server starts reloading or dropping mid-capture, check `.storybook/main.ts` first and confirm `playwright-report`, `test-results`, and `__snapshots__` are excluded from Vite watch globs so the visual gate is not watching its own outputs.
- The touched-file ratchet must include untracked files via `git ls-files --others --exclude-standard`, not just tracked diffs. Otherwise a brand-new protected-surface file can dodge the ratchet until it is staged.
- Keep the committed visual baselines, but ignore local runtime artifacts. The repo now explicitly ignores nested `node_modules/.vite`, nested `node_modules/.tmp`, Playwright HTML reports, and `reports/audit-*` outputs so UI verification runs do not turn branch state into cache noise.

## Weaknesses & improvements

- Dependency drift can still show up as lockfile-only noise; keep package specifiers aligned with the lockfile when pre-release packages are involved.
- `FORJAMIE.md` had started drifting toward a placeholder template; keep it as a real project map, not just a status shell.
- The repo still carries known lint and accessibility debt that should be paid down incrementally as touched areas are updated.
- Cross-project adoption used to look more flexible than it really was; keep README and checklist guidance aligned with the actual exported package surface and supported install modes.
- Design-system trust is weaker than it should be because token validation and coverage freshness can fail while broader policy checks still pass; align root policy with semantic-slot and design-system integrity rules before asking agents to generate more product UI.
- The repo-wide guidance command now passes, but it still reports a large `warn` backlog across reusable UI, storybook, and showcase surfaces. That backlog is visible by design and should be ratcheted down incrementally instead of hidden.
- The web and Storybook visual suites are finally deterministic enough to build on, and the first touched-file ratchet is now in place for the initial protected surface set. The remaining work is widening that ratchet gradually without turning warning debt back into hidden drift.
- The first touched-file ratchet now covers the full settings panel/story family, the touched forms component slice, and app pages including both template pages. It should keep expanding gradually, but only after adjacent surfaces stay clean long enough that the next boundary is believable.
- `packages/ui` still carries some internal Storybook `_holding` demo code that looks like package-consumer code. Keep that material out of declaration generation, or it will reintroduce self-import type noise into otherwise healthy package builds.

## Recent changes

### 2026-03-23

- **Visual build packaging fix**: `packages/ui/package.json` no longer strips declaration generation from `build:visual`; it now uses the same safe `vite build` path as the canonical package build, and `packages/ui/tsconfig.dts.json` explicitly excludes `src/storybook/_holding/**` so internal Storybook demo pages do not leak into public declaration generation. That fixes the review regression where browser-test prebuilds could leave `@design-studio/ui` effectively untyped and also removes the non-fatal `TS7016` self-import warning from package builds.
- **Web app page-surface expansion**: `ChatShellPage` and `HarnessPage` are the next hard-error wave after the template family. `ChatShellPage` now uses the semantic `min-h-dvh bg-background text-foreground` shell, and `HarnessPage` has been rewritten away from foundation-token literals and `h-screen` into the same semantic page-shell language as the template surfaces. The exemplar runner now treats chat default, harness, and template browser/widget pages as one small web-app exemplar set.
- **Chat surface ratchet expansion**: the next enforcement wave now covers the chat surfaces that teach the shell internals: `AttachmentMenu`, `ChatInput`, and `ChatSidebar`, plus their stories. This pass replaced pixel-bound typography and size literals with semantic text roles, scale classes, or rem-based textarea sizing, and it swapped the remaining story `h-screen`/raw color wrappers for semantic shells so the touched-file ratchet can safely include this chat slice.
- **Chat sidebar sibling ratchet**: widened the hard-error and touched-file ratchet boundary one level deeper into the chat shell internals by adding `ChatSidebarHistory`, `NewProjectModal`, and `ProjectSettingsModal`. The only direct cleanup needed in this slice was replacing the history header’s raw `text-[11px]` escape with the semantic `text-caption` role; the two modal surfaces were already clean enough to ratchet in without adding more visual churn.
- **Chat sidebar exemplar coverage**: added direct Storybook states for `ChatSidebarHistory`, `NewProjectModal`, and `ProjectSettingsModal`, plus `loading` and `error` states and a modal-transition interaction flow on `ChatSidebar` itself. The exemplar runner now includes a small chat-sidebar internal slice alongside the protected settings stories, and the new story files are part of the same hard-error + touched-file ratchet boundary so the coverage path does not reintroduce story-level drift.
- **Chat content-surface ratchet**: widened the next hard-error wave to the `ChatHeader`, `ChatMessages`, and `ComposeView` slice plus their stories. This pass removed the remaining raw pixel typography and popup sizing from `ChatHeader`, replaced the assistant message bubble’s literal corner radius with a token-scale class in `ChatMessages`, and moved the chat-content story wrappers onto semantic `min-h-dvh bg-background text-muted-foreground` shells so the slice can teach the same recipe language as the cleaned sidebar and page shells.
- **Chat outer-shell ratchet**: widened the protected chat boundary to `ChatUIRoot` and `ChatShell.stories`. This pass keeps the existing `mobileBreakpointPx` API stable but converts the media-query implementation to a rem-based shell breakpoint, replaces `min-h-screen` with `min-h-dvh` in both the component and the story wrappers, and swaps the remaining raw accent-variable demo buttons for semantic `bg-accent-blue/20 text-accent-blue` story controls.
- **Chat outer-shell exemplar coverage**: added policy-owned Storybook exemplars for the cleaned outer chat shell layer. `ChatUIRoot` now exposes explicit `loading`, `error`, and full-overlay-open states alongside the default shell, `ChatShell` contributes a split-sidebar layout reference, and `scripts/policy/run-exemplar-evaluation.mjs` includes those story IDs plus a basic focus-state check on `ChatUIRoot` so the now-ratcheted shell layer is protected by the same visual gate as the settings and sidebar slices.
- **Chat view-layer ratchet**: widened the next protected chat boundary to `ChatVariants` and `ChatView`. This pass replaces the remaining literal right-rail width and composer scroll offsets with design-system scale classes (`w-80`, `pb-44`, `bottom-48`) so the cleaned outer shell and immediate content layer now share the same hard-error and touched-file ratchet path.
- **Compose internals ratchet**: widened the protected compose slice behind `ComposeView` to `ComposeInstructionsPanel`, `ProEditConfigModal`, and `PromptBuilderSection`. This pass removes the remaining pixel-locked heights, widths, and modal sizing (`187px`, `720px`, `200px`, `320px`, `120px`, `32px`) in favor of design-system scale or rem-based values so the compose path no longer drops back to legacy layout literals behind an otherwise clean chat shell.
- **Modal-family ratchet**: widened the next protected modal wave to `DiscoverySettingsModal`, `IconPickerModal`, and `SettingsModal`, plus their Storybook files. This pass removes `h-screen` wrappers, px-based modal widths/radii/title styles, and old CSS-variable story wrappers so the chat-adjacent modal path now teaches the same `min-h-dvh`, semantic text-role, and scale-based sizing language as the protected settings and chat surfaces.
- **Settings section-family ratchet**: widened the protected settings-modal internals to `packages/ui/src/app/modals/settings/**/*.tsx`. The only cleanup needed was replacing `AppSection`’s raw dropdown widths with scale classes (`min-w-50`, `min-w-36`), which confirms the rest of the main settings section family was already clean enough to promote under the hard-error and touched-file ratchet path.
- **Navigation selector ratchet**: widened the touched-file ratchet into the shared navigation selector layer by normalizing raw widths/heights in `ModeSelector` and `ModelSelector`. The selectors now use rem or scale-based sizing (`w-[60rem]`, `w-[25rem]`, `w-[22.5rem]`, `w-80`, `w-72`, `max-h-80`) and semantic `text-caption` badge text, so this reusable selector slice can move into the protected shared-UI set without reintroducing px-bound popup sizing.
- **Navigation fallback ratchet**: widened the shared reusable-UI ratchet into the fallback navigation primitives: `NavigationMenu`, `Sidebar`, and `Tabs`. This pass removes the remaining pixel-bound focus-ring widths, icon offsets, sidebar calc padding, resize-rail width, and tab shell sizing so the next reusable navigation layer can move into the protected set without carrying raw px escapes.
- **Overlay primitive ratchet**: widened the shared reusable-UI ratchet into the overlay primitive layer by normalizing the remaining pixel-bound sizes in `command`, `drawer`, `modal`, and fallback `Tooltip`. This replaces the last literal overlay list height, drawer handle width, modal default width, and tooltip arrow offset/radius with rem-based values so the overlay foundation can move into the protected shared-UI set cleanly.
- **Base + feedback primitive ratchet**: widened the shared reusable-UI ratchet into the next low-level component wave: `InputOTP`, fallback `RadioGroup`, fallback `ScrollArea`, fallback `Checkbox`, fallback `Switch`, base `table`, base `textarea`, `ErrorBoundary`, and `toast`. This pass removes the remaining pixel-bound focus-ring widths, checkbox alignment nudges, switch thumb offset, error-shell min-heights, and toast width cap so those shared primitives can ratchet upward without carrying raw px escapes.
- **Foundation-token control-surface ratchet**: widened the next shared reusable-UI ratchet to `IconButton`, fallback `Button`, base `input`, fallback `Select`, and `card`. This pass replaces the last protected-scope `foundation-size-*` control/header vars with their semantic scale equivalents (`11` and `14`), removes `Select`’s remaining `3px` focus ring, and moves the core control/card surfaces into the hard-error + touched-file ratchet path alongside the rest of the cleaned primitive layer.
- **Storybook holding-story ratchet**: widened the next bounded learning-surface ratchet to the `_holding` `Chart`, `IconButton`, `MessageActions`, and `NavigationMenu` stories. This pass removes their remaining foundation color vars and raw px story sizing in favor of semantic background/color vars and rem-based widths so these examples stop teaching the old token layer to agents and contributors.
- **Storybook holding-docs ratchet**: widened the next bounded documentation ratchet to the `_holding/docs` MDX set (`APIReference`, `DesignSystem`, `GettingStarted`, `Migration`, `Patterns`, `QuickStart`). This pass swaps foundation-token examples for semantic theme examples and moves the docs themselves into the hard-error + touched-file ratchet path so the guidance surfaces teach the same token discipline as product code.
- **PR2 settings recipe pass**: normalized the remaining settings-adjacent recipe surfaces so they teach the same composition language as the protected settings cluster. `AudioSettingsPanel` and `CheckForUpdatesPanel` now use `SettingsPanelState` for neutral empty-state scaffolding instead of raw placeholder text, `PersonalizationPanel` now uses consistent section rhythm/labels around the existing `SettingRow` / `SettingToggle` / `SettingDropdown` recipe parts, and the shared setting primitives now use cleaner `cn(...)` composition plus better focus/description wiring.
- **Template widget exemplar route**: added `/template-widget/<template-id>` to the runtime router so `TemplateWidgetPage` is no longer build-only for verification, committed a Chromium baseline for `/template-widget/educational-starter`, and widened `scripts/policy/run-exemplar-evaluation.mjs` from a single template-browser web check to a template-family web gate.
- **Storybook exemplar timeout headroom**: bumped `platforms/web/apps/storybook/playwright.visual.config.ts` from a 60-second to a 90-second test timeout after the protected dark-theme `ManageAppsPanel` states started timing out late in the sequential exemplar sweep. The targeted rerun for those loading/empty states now completes cleanly under the same gate path.
- **PR1 protected-scope expansion**: widened the hard-error settings wave to cover the remaining settings Storybook stories plus `platforms/web/apps/web/src/pages/TemplateWidgetPage.tsx`. The story wrappers now rely on semantic `bg-background` / token-backed text utilities instead of raw hex background presets and raw CSS-variable utility escapes, and `TemplateWidgetPage` now uses a semantic `min-h-dvh` shell with `bg-background`, `text-foreground`, and `text-muted-foreground` instead of foundation-token and raw-pixel fallbacks. `pnpm design-system-guidance:ratchet`, `pnpm test:policy`, and `git diff --check` all pass with the widened boundary.
- **Touched-file ratchet**: added `pnpm design-system-guidance:ratchet` and wired it into root policy as `Touched-file Ratchet`. The new `scripts/policy/run-guidance-ratchet.mjs` fails only when touched warn-scope files inside the first ratcheted surface set still carry guidance warnings. To support that, the guidance CLI now has a `--json` mode and flushes large JSON payloads before exiting, and `TagInput` dropped its raw `min-w-[120px]` utility in favor of `min-w-30` so the touched reusable-forms slice stays clean.
- **Exemplar update path**: `scripts/policy/run-exemplar-evaluation.mjs` now forwards passthrough Playwright args, and the root scripts `pnpm test:exemplar-evaluation:list` / `pnpm test:exemplar-evaluation:update` are the canonical way to inspect or refresh the policy-owned exemplar slice. This replaces the fragile manual env-string approach that drifted onto stale `app-settings-*` story IDs and shell newline breakage.
- **Exemplar runner alignment**: the exemplar runner now mirrors the current test contract exactly. It forwards Playwright passthrough args for the protected Storybook settings slice, strips pnpm's script-argument delimiter before invoking Playwright, and always includes the `TemplateBrowserPage` web visual now that the page-level baseline is committed.
- **Storybook overlay isolation**: visual regression URLs now pass `devOverlays=0` / `agentation=0`, and Storybook preview honors those flags before mounting Agentation or Dialkit. This keeps Playwright captures stable and prevents the annotation/MCP overlay from poisoning settings-panel snapshots.
- **Storybook visual stability**: `platforms/web/apps/storybook/playwright.visual.config.ts` now runs with `workers: 1`, `fullyParallel: false`, and a 60-second timeout. The visual gate had started writing correct settings snapshots and then timing out under local multi-worker pressure, so the config now prefers deterministic sequential capture.
- **Theme-correct Storybook baselines**: `platforms/web/apps/storybook/storybook-visual.spec.ts` now derives its base URL from the configured Storybook host/port and sets both `globals.theme` and `backgrounds.value` in screenshot URLs. This fixes the earlier regression where `*-light.png` captures still rendered the dark theme on a light canvas.
- **Storybook watch hardening**: `platforms/web/apps/storybook/.storybook/main.ts` now ignores `playwright-report`, `test-results`, and `__snapshots__` in Vite watch mode. The exemplar capture path was dropping the dev server mid-run because Storybook could see Playwright mutating its own artifact directories while snapshots and reports were being written.
- **Template browser always-on baseline**: `platforms/web/apps/web/tests/visual/pages.visual.spec.ts` now checks `TemplateBrowserPage` unconditionally, the corresponding snapshot has been captured, and `scripts/policy/run-exemplar-evaluation.mjs` now runs that page visual on every exemplar-policy pass instead of behind an opt-in flag.
- **Artifact tracking cleanup**: `.gitignore` now explicitly ignores local Playwright HTML reports, nested Vite cache outputs, nested `.tmp` scratch files, and `reports/audit-*` artifacts. The intended committed outputs are still the Chromium baselines under `tests/visual/__snapshots__`, so UI test runs can stay reviewable without spraying cache/report churn into git status.
- **Visual suite preflight hardening**: `scripts/run-playwright-suite.mjs` now checks for the required Playwright Chromium binary before non-`--list` runs and fails fast with `pnpm exec playwright install chromium` as the remediation. This keeps the browser-backed exemplar and visual commands readable on machines that have the package but not the browser download.
- **Visual-path stabilization**: added `packages/ui build:visual` plus `scripts/run-playwright-suite.mjs`, then moved the root `test:visual:web`, `test:visual:storybook`, `test:e2e:web`, and widget a11y prebuild path onto that visual-only build. This keeps Playwright arg forwarding clean and removes the earlier declaration-generation noise from visual-only runs.
- **Review fixes + next exemplar pass**: made the template-browser web visual opt-in behind `PLAYWRIGHT_INCLUDE_TEMPLATE_BROWSER_VISUAL` until baselines are committed, replaced the protected settings loading shell's raw pixel min-height with `min-h-60`, and swapped neutral app badges away from `bg-foreground` so GitHub/Notion/Sora/Terminal keep contrast in dark theme. I also expanded `scripts/policy/run-exemplar-evaluation.mjs` so the protected Storybook exemplar set now includes explicit loading, empty, error, and busy state stories instead of only the default variants.
- **Protected settings state exemplars**: added shared async-state coverage to the protected settings slice. `AppsPanel`, `ManageAppsPanel`, `NotificationsPanel`, `SecurityPanel`, and `DataControlsPanel` now expose explicit loading, error, empty, or busy seams where relevant; the five settings story files now include state variants; and `packages/ui/src/app/settings/settings-panels.exemplar.test.tsx` locks the slice with jsdom checks for loading/empty/error plus keyboard and busy-state behavior.
- **Exemplar evaluation wiring**: added a dedicated `pnpm test:exemplar-evaluation` runner for the protected settings exemplar visuals plus `TemplateBrowserPage`, with Storybook visual tests filterable through env-driven story ID lists. This gate now belongs in browser-aware CI after Playwright install rather than inside the browser-free `pnpm test:policy` contract.
- **Policy/CI ordering fix**: removed the Playwright-backed exemplar subcontract from `scripts/policy/run.mjs` so `pnpm test:policy` stays safe for pre-Playwright CI and release workflows, and added a dedicated `Exemplar evaluation (web platform only)` step in `.github/workflows/ci.yml` immediately after Playwright installation. That preserves the browser-backed guardrail without breaking the repo's existing workflow ordering.
- **Review follow-up fixes**: expired entries in `docs/design-system/ENFORCEMENT_EXEMPTIONS.json` no longer suppress the underlying guidance violation once `removeBy` has passed, so CI now reports both the stale-ledger problem and the real rule failure. `scripts/codex-preflight.sh` also now uses the configured `rest_api.host` for all observe smoke probes instead of hard-coding `127.0.0.1`.
- **Root design-system hardening**: landed the first execution wave of the March 2026 agent-UI plan. Token truth now uses the vendored DTCG schema path, `fontDisplay` resolves from the correct top-level alias, coverage artifacts are regenerated and freshness-checked, and `scripts/policy/run.mjs` now runs the repo-wide guidance contract rather than the package-local self-check.
- **Professional UI contract + routing docs**: added `docs/design-system/PROFESSIONAL_UI_CONTRACT.md`, `docs/design-system/AGENT_UI_ROUTING.md`, `docs/design-system/COMPONENT_LIFECYCLE.json`, and `docs/design-system/ENFORCEMENT_EXEMPTIONS.json`, and linked them from `docs/design-system/CONTRACT.md`. This is the new handoff grammar for agents and reviewers.
- **Protected settings migration**: migrated the first protected settings surfaces onto a shared `SettingsPanelShell` recipe and semantic typography/focus patterns. The main touched files are `AppsPanel`, `ManageAppsPanel`, `PersonalizationPanel`, `ArchivedChatsPanel`, `AudioSettingsPanel`, `CheckForUpdatesPanel`, `NotificationsPanel`, `SecurityPanel`, `DataControlsPanel`, `SettingToggle`, `SettingDropdown`, and `TemplateBrowserPage`.
- **Guidance scope rollout**: the root `.design-system-guidance.json` now uses an explicit product-surface allowlist for the protected settings wave plus `TemplateBrowserPage`, while broader app, storybook, and showcase surfaces stay in `warn`. This keeps the policy credible without pretending the rest of the repo is already clean.
- **Agent-facing design-system audit**: added `docs/audits/AGENT_UI_MARCH_2026_AUDIT.md` and indexed it in `docs/audits/README.md`. The audit captures March 2026 gaps that affect whether agents can consistently produce professional UI, including broken token validation, stale coverage checks, semantic-token bypasses, thin guidance rules, and missing component-routing guardrails.

### 2026-03-22

- **Gold standard uplift** (commit `db75f06a`): pinned all GitHub Actions to full commit SHAs in `ci.yml`; added `tsconfig.strict.json` with `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes` and an informational CI step tracking migration progress.
- **New components**: `Spinner` (a11y-ready, motion-reduce), `Stack`/`Flex`/`Grid` layout primitives (polymorphic `as`, typed gap/cols/align props), `DataTable` (client-side + server-side sort/pagination), `FileUpload` (drag-and-drop with size/type validation). All have test coverage.
- **ThemeProvider**: extended `Theme` type to include `high-contrast` and `system-high-contrast`; wired `prefers-contrast: more` media query; exported `EffectiveTheme` type from tokens index.
- **TypeDoc**: added `typedoc.json` + `docs:generate` scripts to `packages/tokens` and `packages/runtime`.

### 2026-03-15
- **Storybook Gold Standard Audit**: Upgraded Storybook configurations and tests. Migrated theme decorator to Storybook `globals:` API to use the toolbar switcher. Added comprehensive `@storybook/test` `play()` interaction testing to 24 critical components (forms, overlays, dropdowns). Configured `@storybook/addon-coverage` explicitly and set up an automated token drift warning script hook (`scripts/check-token-drift.mjs`).

### 2026-03-11

- Fixed GitHub Actions shell injection vulnerability (CWE-78) in `.github/workflows/release-guidance.yml`. Moved `${{ inputs.npm_tag }}` from inline `run:` interpolation to an environment variable (`NPM_TAG`), preventing potential command injection if the input contains malicious characters. Verified with Semgrep - finding now resolved.
- Added targeted root `pnpm.overrides` remediations for open GitHub Dependabot alerts (`hono`, `axios`, `svgo`, `rollup`, `ajv`, and vulnerable `minimatch` ranges), then regenerated `pnpm-lock.yaml` so resolution now lands on patched versions across workspaces.

### 2026-03-10

- Clarified the supported downstream adoption path: consumer apps should import `@design-studio/ui/styles.css`, and docs now steer people toward workspace or published-package installs instead of the previously documented raw `file:`/submodule route that does not resolve `workspace:*` dependencies outside the monorepo.
- Added a root `pnpm.overrides` pin for `express-rate-limit@8.2.2` and refreshed `pnpm-lock.yaml` so the repo no longer resolves the Trivy-flagged `8.2.1` release pulled through `@modelcontextprotocol/sdk`.
- Pinned `packages/ui` `vitest-axe` from a floating pre-release range to exact `1.0.0-pre.3` and updated `pnpm-lock.yaml` to match. This reduces install drift and keeps the repo on the previously expected pre-release build instead of silently floating to `1.0.0-pre.5`.
- Restored `FORJAMIE.md` to a detailed project map with current run/test guidance so the repo satisfies its living-document gate in the same change-set.

### 2026-03-05

- Re-enabled the `risk-policy-gate` job in `.github/workflows/pr-pipeline.yml`, corrected its docs baseline step to `node scripts/check-doc-links.mjs`, and replaced the external coding-harness gate invocations with a repo-local helper at `scripts/harness_pr_pipeline.py`. This kept PR policy enforcement local to the repo instead of relying on unavailable private tooling.

### 2026-03-24

- Fixed PR #131 CI version-sync drift by aligning `packages/ui`, `packages/widgets`, and `packages/cloudflare-template` back to the root workspace version `0.0.1`. This unblocks `pnpm sync:versions:check` in the build lanes and keeps the agent-UI hardening branch mergeable.
- Stabilized Storybook exemplar capture for PR #131 by pinning Playwright Storybook visuals to `en-US` / `UTC` and forcing fullscreen chat/settings stories onto the exact `1280x720` viewport inside `storybook-visual.spec.ts`. This is aimed at the Ubuntu-only drift seen in the `Exemplar evaluation (web platform only)` lane, where fullscreen Storybook screenshots diverged from the committed macOS-recorded baselines.

### 2026-03-05

- Added the onboarding command center, task-first onboarding routes, and automated onboarding parity checks. This established a single authoritative onboarding path and automated drift detection for docs and setup guidance.

---
<!-- MACHINE_READABLE_START
project: design-system
repo: ~/dev/design-system
status: IN_PROGRESS
health: yellow
last_updated: 2026-03-24
open_prs: 0
blockers: none
next_milestone: ChatGPT widget integration
next_milestone_date: 2026-04-01
MACHINE_READABLE_END -->
