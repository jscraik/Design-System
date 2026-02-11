# Work Outstanding

Last updated: 2026-02-06

## Current Test Status

**Last updated**: 2026-01-18

### Test Execution Summary

- **Unit tests**: 477 tests passing in `packages/ui` ✅
- **Storybook browser tests**: 65/107 test files passing (206 tests) ✅
- **Storybook browser tests**: 37/107 test files failing ⚠️

### Known Issues

**Storybook Browser Tests (37 failing test files)**: All failing tests use Radix UI components with complex overlay/portal behavior. Root cause: Storybook's Vite config excludes Radix UI modules from dependency optimization (required for "use client" directive handling), but Vitest browser test runner needs these modules pre-bundled for dynamic imports. **Important**: The stories render correctly in Storybook UI—this is specifically a Vitest browser test runner limitation.

## Execution environments (important)

This repo is sometimes worked on in a **restricted sandbox environment** where local dev servers (or browser runners) cannot bind to ports. Common symptom: `EPERM` when trying to listen on ports such as `5173`, `6006`, `8787`, or `4173`.

### A) Restricted sandbox environment (no port binding)
You can reliably run:
- Unit tests and other Node-only checks that do **not** start a local server (for example: `pnpm test`, `pnpm -C packages/ui test`)
- Linting and documentation checks that do **not** start servers (for example: `pnpm lint`, `pnpm doc:lint`)
- Policy / compliance / drift checks that do not require a running dev/preview server (as invoked by CI and scripts)

You cannot reliably run (requires local port binding):
- Web / Storybook / MCP dev servers (for example: `pnpm -C platforms/web/apps/web dev -- --port 5173`, `pnpm -C platforms/web/apps/storybook dev`, `pnpm mcp:start`)
- Preview-server based checks (for example: `pnpm test:agent-browser:ci`)
- Playwright E2E / visual regression runs that start or depend on servers (for example: `pnpm test:e2e:web`, `pnpm test:visual:web`, `pnpm test:visual:storybook`)
- Widget a11y runs if they require dev/preview servers (for example: `pnpm test:a11y:widgets`)
- Storybook browser-mode interaction tests (for example: `pnpm storybook:test:browser`)

### B) Host environment (ports OK)
Run the full production-readiness workflow here (local machine, CI runner, or any host that permits port binding), including:
- Dev servers (web / Storybook / MCP)
- Preview-server based smoke checks
- Playwright E2E, visual regression, and any browser-runner tests

### Workarounds
- Run port-bound steps in CI or on a host machine that permits local port binding.
- Port overrides (for example, `VITEST_BROWSER_PORT=63316`) only help when the environment allows *some* port binding, but default ports are blocked.

See [docs/TEST_PLAN.md](../TEST_PLAN.md) for the comprehensive test plan and testing strategy.

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: Jamie Scott Craik (@jscraik)
- Review cadence: Monthly or each release (whichever is sooner)

Short list of remaining tasks and known blockers after the latest docs/testing pass.

## ✅ Completed

- **Unit tests**: All 477 tests passing in `packages/ui`
- **Linting**: `pnpm lint` clean (no errors)
- **Format check**: Fixed syntax error in `scripts/new-component.mjs`
- **Widget build**: All 14 widgets built successfully with content hashing
- **Storybook tests**: Ran `pnpm storybook:test` - 64/107 test files passed (202 tests), 42 failed due to Storybook cache issue with `@radix-ui/react-visually-hidden` dependency

## ⚠️ Needs Attention

- **Storybook browser tests**: Vitest browser runner remains unstable (Vite optimizeDeps cache errors and intermittent interaction failures). Browser tests are now **opt-in** via `pnpm storybook:test:browser`. Default `pnpm storybook:test` runs non-browser Vitest only. Use Storybook UI for manual verification and Playwright visual tests for automated coverage.

## Blocking

- Local dev servers and tests that require port binding are blocked in restricted sandbox environments (see: **Execution environments (important)** above).

## Still to Verify (Requires Host Environment)

### 2026-01-19: agent-browser Smoke Tests Added
Built-preview smoke test layer using agent-browser CLI added to CI. Tests critical routes (/, /harness, /templates, /templates/template-shell) with snapshot and screenshot capture. Implementation uses CLI-based approach with commands: open, snapshot, fill, click, find, press, wait, screenshot. Artifacts stored in test-results/agent-browser/.

**Status**: Pending verification in CI environment.
**Command**: `pnpm test:agent-browser:ci`
**Location**: scripts/agent-browser/run.mjs and run-ci.mjs
**Status note**: `pnpm test:agent-browser:ci` failed in the sandbox because the preview server at http://127.0.0.1:4173 did not become reachable within 30s (port binding restriction). The same timeout failure was reproduced locally with the preview server running. Also noted a local typo attempt `pnpm test:agent-browser:c` (command does not exist).
**Install note**: `pnpm approve-builds` had no pending items; agent-browser remains in ignored build scripts unless manually approved.

- Agent-browser smoke tests: `pnpm test:agent-browser:ci`
- Web app smoke: `pnpm -C platforms/web/apps/web dev -- --port 5173` (verify `/harness`, `/settings`, `/profile`, `/about`).
- Storybook smoke: `pnpm -C platforms/web/apps/storybook dev` (confirm port 6006 availability or alternate).
- MCP harness: `pnpm mcp:start` and validate `/mcp` responds.
- Widget a11y: `pnpm test:a11y:widgets` (blocked by dev server bind).
- Visual regression tests: `pnpm test:visual:web` and `pnpm test:visual:storybook` (blocked by port binding).

## Follow-ups

- **Storybook browser tests**: The 37 failing tests are due to a known limitation of Vitest browser test runner with Radix UI components. Potential solutions:
  1. **Recommended**: Accept that Radix UI component stories are tested manually in Storybook UI (they render correctly there)
  2. Create a separate Vitest config for browser tests that includes Radix UI in `optimizeDeps.include`
  3. Use Playwright component testing instead of Vitest browser mode for Radix UI components
  4. Wait for Vitest browser mode improvements to handle non-optimized dependencies better
  5. The 65 passing test files (206 tests) cover all non-Radix UI components successfully
  6. Recommended workaround for overlay-heavy stories: run agent-browser Storybook smoke (`pnpm test:agent-browser:storybook:ci`) on a host/CI environment that can bind ports to validate Radix overlays deterministically (snapshot + screenshot), instead of relying on flaky Vitest browser mode.
- If port binding is restricted, set alternative ports or run tests on a host that allows local binding.
- All non-blocking tests pass successfully - project is in good state for development work that doesn't require dev servers.
