# Release Checklist

Last updated: 2026-04-24

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
- [ ] If `DESIGN.md`, `astudio design`, or guidance migration changed, confirm
      the compatibility manifest in `packages/design-system-guidance/src/compatibility.ts`
      records supported design schemas, command schemas, migration schemas, and
      profile definitions.
- [ ] If agent design rules changed, confirm
      `packages/agent-design-engine/rules/agent-design.rules.v1.json` maps every
      enforced rule to a source path and fixture.

## Agent design release gate

- [ ] `pnpm -C packages/agent-design-engine type-check`
- [ ] `pnpm -C packages/agent-design-engine test`
- [ ] `pnpm -C packages/design-system-guidance type-check`
- [ ] `pnpm -C packages/design-system-guidance build`
- [ ] `pnpm -C packages/design-system-guidance check:ci`
- [ ] `pnpm -C packages/cli build`
- [ ] `pnpm -C packages/cli test`

For legacy, beta, and GA rollout notes:

- Legacy mode remains valid during the published support window and keeps
  existing guidance checks operational.
- Beta `design-md` mode requires a valid `DESIGN.md`, compatibility manifest
  coverage, rollback metadata, and local validation evidence.
- GA requires the same gates as beta plus release metadata that names
  `legacySupportEndsAt`, `legacyModeAllowed`, and
  `minimumWrapperForDesignMd`.

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

- Assumptions: release automation owns npm publish through Changesets and
  GitHub Actions.
- Failure modes and blast radius: compatibility manifest drift can break
  machine consumers of `astudio design`; migration metadata drift can block
  rollback.
- Rollback or recovery guidance: restore rollback metadata, rerun
  `astudio design migrate --rollback --dry-run --json`, then write rollback only
  after the dry-run is parseable and clean.

## Verify

- Command: `pnpm docs:lint` -> expected pass before release.
- Command: `pnpm test:policy` -> expected pass before release.
- Command: `pnpm validate:tokens` -> expected pass before release.
- Command: `pnpm ds:matrix:check` -> expected pass before release.

## Troubleshooting

- `E_DESIGN_ROLLBACK_METADATA_UNREADABLE`: restore the metadata file recorded in
  `.design-system-guidance.json`.
- `E_DESIGN_MANIFEST_INVALID`: update the compatibility manifest before
  emitting a new design command schema.
- `E_DESIGN_CONTRACT_AMBIGUOUS`: pass `--file` or `--scope` in release scripts.
