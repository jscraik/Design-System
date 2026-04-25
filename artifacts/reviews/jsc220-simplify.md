# JSC-220 Simplify Review

Review mode: delegated simplify review plus inline fix pass.

## Findings

### Fixed P3: metadata validation returned an unnecessary path wrapper

- Evidence: `packages/design-system-guidance/src/core.ts:1193`, `packages/design-system-guidance/src/core.ts:1349`, `packages/design-system-guidance/src/core.ts:1498`
- Risk: `assertRollbackMetadata` returned `{ path, operationId }` even though callers already owned rollback metadata path resolution. That added an avoidable interface and branch in the migration flow.
- Remediation: return only the validated `operationId` from readable rollback metadata checks and keep rollback metadata path selection in the existing path-resolution flow.
- Status: fixed in this slice.

### Fixed P3: duplicate scratch-file assertion style in concurrent writer test

- Evidence: `packages/cli/tests/cli.test.mjs:184`, `packages/cli/tests/cli.test.mjs:1424`
- Risk: one test checked the same temp/lock cleanup invariant through both an inline `readdirSync` expression and `migrationScratchFiles`, creating duplicate maintenance paths.
- Remediation: added `assertNoMigrationScratchFiles` and use it consistently for migration scratch cleanup assertions.
- Status: fixed in this slice.

### Skipped P4: snapshot all recursive file discovery per test

- Evidence: `packages/cli/tests/cli.test.mjs:164`, `packages/cli/tests/cli.test.mjs:172`, `packages/cli/tests/cli.test.mjs:178`, `packages/cli/tests/cli.test.mjs:184`
- Assessment: the recursive scans are over tiny temp fixtures and are called after different mutation phases. A cached per-test snapshot would make the assertions easier to misuse because stale snapshots could hide post-mutation artifacts.
- Status: skipped intentionally.

## Validation

- `pnpm dlx @biomejs/biome@2.3.11 check --write packages/design-system-guidance/src/core.ts packages/cli/tests/cli.test.mjs`: pass.
- `pnpm -C packages/design-system-guidance type-check`: pass.
- `pnpm -C packages/cli test`: pass, 89/89 tests.

WROTE: artifacts/reviews/jsc220-simplify.md
