# Storybook Production Completion Tasks

This checklist captures the remaining manual steps to finish the Storybook hardening pass and validate production readiness. Run these after pulling latest changes.

## Required

- [ ] Install deps and update lockfile (needed after Storybook test dependency alignment).
  - Command: `pnpm install`
- [ ] Run Storybook interaction tests (Vitest addon).
  - Command: `pnpm storybook:test`
  - If your environment blocks local ports, override the port:
    - `VITEST_BROWSER_PORT=63316 pnpm storybook:test`
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

## Notes

- Storybook Vitest browser mode requires binding to a local port. If this fails in a restricted environment, run tests on a host that allows local port binding.
