# JSC-223 Repo Cleanup Inventory

Last updated: 2026-04-24

## Table of Contents

- [Purpose](#purpose)
- [Current Slice](#current-slice)
- [Removed From Tracking](#removed-from-tracking)
- [Removed From Source](#removed-from-source)
- [Resolved Follow-Up Decisions](#resolved-follow-up-decisions)
- [Deferred Decisions](#deferred-decisions)
- [Follow-Up Issue Candidates](#follow-up-issue-candidates)
- [Validation](#validation)

## Purpose

This inventory records the repo-wide cleanup decisions for JSC-223 so generated
artifact removal does not get mixed with higher-risk package, docs, or publish
contract changes.

## Current Slice

The current cleanup slice is intentionally conservative:

- Remove tracked files that are already ignored and are clearly local runtime,
  cache, coverage, or test-output artifacts.
- Remove accidental zero-byte root artifacts.
- Keep tracked build outputs and generated source files until the repo has an
  explicit package publish and regeneration contract for each path family.
- Capture higher-risk cleanup as follow-up issues rather than deleting broad
  surfaces without an owner decision.

JSC-225 has now resolved the build-output and Storybook screenshot portion of
that deferral. See
`docs/plans/2026-04-24-jsc225-build-artifact-contract.md`.

JSC-226 has now resolved the generated-source portion of that deferral. See
`docs/plans/2026-04-24-jsc226-generated-source-contract.md`.

## Removed From Tracking

The following tracked-ignored runtime artifacts were removed from the Git index
with `git rm --cached`; local files were left on disk:

- `.DS_Store`
- `.ralph/**`
- `**/node_modules/**`
- `**/node_modules/.vite/**`
- `**/node_modules/.tmp/**`
- `**/.cache/**`
- `**/coverage/**`
- `**/test-results/.last-run.json`
- `**/*.tsbuildinfo`

Evidence after the cleanup:

- `git diff --cached --name-only | wc -l` reported `3186` staged de-indexed
  paths.
- The removed runtime/cache/test-output pattern returned `0` remaining tracked
  ignored matches.
- `git ls-files -ci --exclude-standard | wc -l` reported `914` remaining
  tracked-ignored paths, mostly deferred build-output and policy-artifact
  families.

## Removed From Source

Three accidental zero-byte root files were deleted:

- `EOF`
- `npm`
- `{`

Each file was tracked with the empty blob hash
`e69de29bb2d1d6434b8b29ae775ad8c2e48c5391` and had no content.

## Resolved Follow-Up Decisions

JSC-225 decided that generated `dist/**` outputs and
`platforms/web/apps/storybook/screenshots/**` captures are not source-control
authority. The cleanup removed 802 tracked ignored generated files from the Git
index while leaving local files on disk.

The package publish contract is build-before-pack/publish:

- `.github/workflows/publish-astudio.yml` builds aStudio packages before
  `pnpm publish:astudio`.
- `.github/workflows/release-guidance.yml` builds
  `@brainwav/design-system-guidance` before `npm pack --dry-run` and publish.

The visual artifact contract is Playwright baselines, CI artifacts, and Argos
comparisons, not committed Storybook screenshot capture folders.

JSC-226 decided that deterministic generated runtime inputs remain tracked when
source code imports them directly, while mutable local build mirrors stay
ignored. The root freshness gate is `pnpm generated-source:check`, and
`pnpm test:policy` now runs that generated-source subcontract.

## Deferred Decisions

These path families are not removed in this slice because they need an explicit
owner or release-contract decision:

- `.spec/**`, `.agent/**`, and `.kiro/**`: ignored planning/spec surfaces that
  may be intentional project memory.
- Legacy reports under `reports/**`: duplicate historical report clusters
  contain stale absolute paths and should be consolidated rather than silently
  deleted.
- Older review rounds under `artifacts/reviews/**`: useful as historical
  evidence, but should be indexed or archived behind one canonical synthesis per
  review family.

## Follow-Up Issue Candidates

Create or link follow-up Linear issues for:

- Generated source contract: resolved by JSC-226.
- Docs/report archive: consolidate January 2026 generated report clusters and
  add a `docs/plans/README.md` authority index.
- CI hygiene guard: add a small gate that blocks newly tracked ignored runtime
  artifacts while allowing explicitly documented generated-source exceptions.
- Script/package cleanup: decide whether orphaned scripts and prototype
  packages should be wired into active commands or archived.

## Validation

Validation for this slice must prove the cleanup is behavior-preserving:

```bash
pnpm format:check
pnpm docs:lint
pnpm test:policy
pnpm -C packages/cli test
pnpm -C packages/agent-design-engine test
pnpm -C packages/design-system-guidance build
git diff --check
```
