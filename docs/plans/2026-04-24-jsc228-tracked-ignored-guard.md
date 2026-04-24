# JSC-228 Tracked Ignored Artifact Guard

Last updated: 2026-04-24

## Table of Contents

- [Purpose](#purpose)
- [Guard Contract](#guard-contract)
- [Documented Exceptions](#documented-exceptions)
- [Validation](#validation)

## Purpose

JSC-228 prevents the JSC-223 and JSC-225 cleanup from regressing. The repo has
intentional tracked files that match ignore rules, such as local planning
surfaces and vendored Vale styles, so the guard is not a blanket ban on
`git ls-files -ci --exclude-standard`.

Instead, `pnpm tracked-ignored:check` fails only when ignored runtime, cache,
test-output, mutable build-output, or ad hoc audit artifacts become tracked
again.

## Guard Contract

The guard lives at `scripts/check-tracked-ignored-artifacts.mjs` and is wired
into root policy through `pnpm test:policy`.

Blocked families:

- OS metadata such as `.DS_Store`.
- dependency installs under `node_modules/**`.
- runtime cache and local-report directories such as `.cache/**`,
  `.build-cache/**`, `.wrangler/**`, and `playwright-report/**`.
- scratch and test-output directories such as `.tmp/**`, `tmp/**`, and
  `test-results/**`.
- coverage outputs under `coverage/**`.
- TypeScript incremental build state through `*.tsbuildinfo`.
- mutable build and screenshot outputs under `**/dist/**` and
  `platforms/web/apps/storybook/screenshots/**`.
- ad hoc audit artifacts under `reports/audit-*`.

## Documented Exceptions

The following tracked-ignored families are currently allowed because they are
project memory, local config, or documented generated-source mirrors rather
than runtime output:

- `.agent/**`
- `.changeset/**`
- `.claude/**`
- `.codex/environments/**`
- `.figma/**`
- `.kiro/**`
- `.spec/**`
- `.vale/styles/**`
- `packages/widgets/src/sdk/generated/widget-manifest.ts`

If a future cleanup changes ownership for one of these families, update this
plan and the script classifier in the same change-set.

## Validation

```bash
pnpm tracked-ignored:check:self-test
pnpm tracked-ignored:check
pnpm test:policy
pnpm format:check
git diff --check
```
