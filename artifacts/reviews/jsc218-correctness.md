# JSC-218 Correctness Review

## Scope
- Uncommitted diff review for migration transition-table correctness.
- Crash-safe `partial` marker semantics.
- Rollback/resume behavior.
- Test adequacy for edge-path execution.

## Findings
- None.

I traced the modified migration code paths and validated behavior with targeted CLI migration tests. I did not find a concrete correctness bug in the current uncommitted JSC-218 diff.

## Evidence Notes
- Transition routing and guard:
  - `packages/design-system-guidance/src/core.ts:1008`
  - `packages/design-system-guidance/src/core.ts:1014`
  - `packages/design-system-guidance/src/core.ts:1174`
- Transition table entries and allowed operations:
  - `packages/design-system-guidance/src/core.ts:77`
- Metadata-readability ordering via transition rule:
  - `packages/design-system-guidance/src/core.ts:1182`
  - `packages/design-system-guidance/src/core.ts:1038`
- Crash-safe partial marker + fault injection behavior:
  - `packages/design-system-guidance/src/core.ts:1259`
  - `packages/design-system-guidance/src/core.ts:1267`
  - `packages/design-system-guidance/src/core.ts:1268`
- New CLI tests covering failed resume, injected partial failure, and invalid transition no-op:
  - `packages/cli/tests/cli.test.mjs:906`
  - `packages/cli/tests/cli.test.mjs:932`
  - `packages/cli/tests/cli.test.mjs:961`

## Residual Risk
- No regression found. The initial review noted missing direct coverage for `--to legacy` as a rollback alias; the simplify follow-up added that case to the invalid-transition table test so the residual risk is now the broader pre-GA migration backlog tracked outside JSC-218.

WROTE: artifacts/reviews/jsc218-correctness.md
