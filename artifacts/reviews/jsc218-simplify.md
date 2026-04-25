# JSC-218 Simplify Review

## Scope
- `packages/design-system-guidance/src/core.ts`
- `packages/cli/tests/cli.test.mjs`
- `docs/plans/2026-04-23-agent-design-engine-plan.md`
- `FORJAMIE.md`

## Findings
- None.

The JSC-218 diff replaces scattered migration-state checks with a single transition table, keeps the fault-injection hook isolated behind a named environment constant, and removes the older `assertFreshMigrationAllowed` helper. I did not find behavior-preserving dead code, duplication, or bloat worth editing further.

## Follow-up Applied
- The correctness review noted residual risk around `--to legacy` being treated as the rollback alias. Added an invalid-transition test case for `--to legacy` from `legacy/not-started`, proving the alias follows the transition table and fails closed without mutation.

## Residual Risk
- The remaining pre-GA migration risks are already tracked outside this slice: rollback metadata authenticity, path-root validation hardening, collision-safe quarantine paths, repeated rollback/remigration coverage, and concurrent-writer race expansion.

WROTE: artifacts/reviews/jsc218-simplify.md
