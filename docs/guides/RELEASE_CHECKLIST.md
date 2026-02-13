# Release Checklist

Last updated: 2026-01-04

## Doc requirements

- Audience: Operators and maintainers
- Scope: Operational steps and verification
- Non-scope: Long-form design history
- Owner: Jamie Scott Craik (@jscraik)
- Review cadence: Every release or monthly (whichever is sooner)

This repo uses Changesets + GitHub Actions for versioning and publishing.
The `release` workflow runs on merges to `main` and will either open a
Changesets release PR or publish to npm when ready.

## Before you release

- [ ] Ensure the branch is up to date with `main`.
- [ ] Run the local test suite you expect to be green in CI:
  - [ ] `pnpm lint`
  - [ ] `pnpm format:check`
  - [ ] `pnpm test`
  - [ ] `pnpm test:a11y:widgets`
  - [ ] `pnpm test:visual:web`
- [ ] Confirm any breaking changes are reflected in tool contracts and docs.
- [ ] Confirm DoD checklist complete (coverage matrix updated or gap recorded).
- [ ] Confirm a11y audit artifact exists in `docs/operations/` using `docs/operations/a11y-audit-template.md`.

## Create a changeset

- [ ] Run `pnpm changeset`.
- [ ] Choose the affected packages and the correct semver bump.
- [ ] Write a concise summary in the changeset.

## Version and review

- [ ] Run `pnpm version-packages` to apply the changeset.
- [ ] Review the generated changelog and version bumps.
- [ ] Commit the changeset + version updates.

## Publish (via CI)

- [ ] Merge to `main`.
- [ ] The `release` workflow will open a release PR if there are pending changesets.
- [ ] Merge the release PR to publish to npm.

## Manual publish (fallback)

If CI publishing is unavailable, publish manually after versioning:

- [ ] `pnpm release`

## Risks and assumptions

- Assumptions: TBD (confirm)
- Failure modes and blast radius: TBD (confirm)
- Rollback or recovery guidance: TBD (confirm)

## Verify

- TBD: Add concrete verification steps and expected results.

## Troubleshooting

- TBD: Add the top 3 failure modes and fixes.
