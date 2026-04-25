## Simplification Analysis

### Core Purpose
JSC-219 hardens agent-design migration rollback safety by authenticating rollback metadata, validating path/checksum integrity before mutation, and adding regression tests that prove fail-closed rollback and resume behavior.

### Unnecessary Complexity Found
- **Medium** `[packages/cli/tests/cli.test.mjs:922]`
- Four rollback rejection tests repeat the same setup/run/assert scaffolding with only one mutation step differing.
- Suggested simplification: extract a shared helper like `assertRollbackMetadataFailure({ mutate })` that performs project setup, migration, pre-state snapshot, rollback execution, and shared invariant assertions once.

- **Low** `[packages/design-system-guidance/src/core.ts:1063]`
- Rollback metadata writes multiple alias fields for the same values (`schema` + `schemaVersion`, `guidanceConfigPath` + `configPath`, `guidanceConfigChecksum` + `configChecksum`, `sourceMode` + `beforeMode`, `targetMode` + `afterMode`, `writtenAt` + `createdAt`) which expands both write-time and read-time validation surface.
- Suggested simplification: choose one canonical field set and only preserve aliases behind an explicit `legacy` sub-object (or remove aliases if no active consumer needs them).

### Code to Remove
- `[packages/cli/tests/cli.test.mjs:922]` - Duplicate rollback-failure scaffolding can be centralized into one helper.
- Estimated LOC reduction: **~45-70 LOC** (depending on helper shape).

- `[packages/design-system-guidance/src/core.ts:1063]` - Alias fields and coupled validation branches can be reduced to one canonical contract.
- Estimated LOC reduction: **~20-40 LOC** in metadata builder/validator logic.

### Simplification Recommendations
1. Consolidate rollback failure tests into one table-driven helper
   - Current: repeated test bodies for tamper/symlink/config-drift/design-drift cases.
   - Proposed: `for (const case of cases) { await assertRollbackMetadataFailure(case); }` with case-specific mutate function.
   - Impact: lower maintenance overhead, easier extension for new failure cases, fewer opportunities for assertion drift.

2. Canonicalize rollback metadata fields
   - Current: canonical + alias fields co-exist at top level.
   - Proposed: keep canonical keys only (or isolate compatibility aliases under `legacy`), then validate only canonical keys in `assertRollbackMetadata`.
   - Impact: smaller contract, fewer parser branches, reduced cognitive load.

### YAGNI Violations
- `[packages/design-system-guidance/src/core.ts:1063]` Duplicate top-level alias keys appear to preserve multiple naming eras simultaneously.
- Why it violates YAGNI: unless there is a currently required consumer for every alias, each extra key is ongoing maintenance and verification cost.
- What to do instead: define one canonical v1 contract and gate any compatibility aliasing behind an explicit migration boundary.

### Final Assessment
Total potential LOC reduction: **~4-7%** of the JSC-219 touched diff.
Complexity score: **Medium**
Recommended action: **Proceed with simplifications** (test dedupe first, metadata alias reduction second).
