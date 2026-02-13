# Storybook Production Completion Tasks

Last updated: 2026-02-06

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: Jamie Scott Craik (@jscraik)
- Review cadence: Monthly or each release (whichever is sooner)

This checklist captures the remaining manual steps to finish the Storybook hardening pass and validate production readiness. Run these after pulling latest changes.

## Environment note (ports)

Several items below require local port binding (Storybook server, Playwright, and browser-runner modes). If you are in a restricted sandbox environment where port binding fails (for example: `EPERM`), run those steps in CI or on a host machine that permits port binding.

## Required

- [ ] Install deps and update lockfile (needed after Storybook test dependency alignment).
  - Command: `pnpm install`
- [ ] Run Storybook interaction tests (Vitest addon).
  - Default (non-browser Vitest): `pnpm storybook:test`
  - Optional browser-mode (requires port binding): `pnpm storybook:test:browser` (root wrapper for `pnpm -C platforms/web/apps/storybook test:browser`)
  - Mitigation (only if port binding works but default ports are blocked):
    - `VITEST_BROWSER_PORT=63316 pnpm storybook:test:browser`
- [ ] Run Storybook visual regression tests (Playwright).
  - Command: `pnpm test:visual:storybook`
  - To update baselines (if needed): `pnpm test:visual:storybook:update`
- [ ] Run Storybook a11y coverage (test-storybook).
  - Command: `pnpm -C packages/ui test:a11y`

## Recommended (to validate full pipeline)

- [ ] Build Storybook for production output.
  - Command: `pnpm storybook:build`
- [ ] Run component unit tests for UI package.
  - Command: `pnpm -C packages/ui test`
- [ ] (Optional) Run Storybook smoke validation via agent-browser (stable alternative for Radix overlay validation; requires port binding).
  - Command: `pnpm test:agent-browser:storybook:ci`

## Notes

- Storybook browser-mode interaction tests require binding to a local port. If this fails in a restricted environment, run the browser-mode step in CI or on a host that allows local port binding.
