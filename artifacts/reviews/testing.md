# Testing Review: JSC-208 Agent Design Engine

## Verdict
Current tests demonstrate basic smoke coverage but do not protect the highest-risk behavior introduced by JSC-208. The strategy is under-covered against the project's own Gate 2/3/4 acceptance contract.

## Validation Evidence Run
- `pnpm -C packages/agent-design-engine test` (pass: 4 tests)
- `pnpm -C packages/cli test` (pass: 6 tests)
- `pnpm -C packages/design-system-guidance type-check` (pass)
- Read-only smoke checks:
  - `node packages/cli/dist/index.js design diff --before DESIGN.md --after DESIGN.md --json` (success envelope emitted)
  - `node packages/cli/dist/index.js design migrate --dry-run --json` (success envelope emitted)

## Findings (Severity-ranked)

### HIGH: Migration state machine changed without any package-level tests
- Evidence of new mutation logic and branchy state transitions lives in `packages/design-system-guidance/src/core.ts:800`, `packages/design-system-guidance/src/core.ts:812`, `packages/design-system-guidance/src/core.ts:819`, `packages/design-system-guidance/src/core.ts:843`, `packages/design-system-guidance/src/core.ts:849`.
- There are no tests in `packages/design-system-guidance` (`fd -a "test|spec" packages/design-system-guidance` returned nothing).
- Risk: rollback metadata creation, write-gating (`--write` vs `--dry-run`), and resume/rollback transitions can regress silently.
- Why this matters: Gate 3 explicitly requires rollback, transition-table, idempotency, and unreadable-metadata failure coverage (`docs/plans/2026-04-23-agent-design-engine-plan.md:909-922`).

### HIGH: New CLI command surface is mostly untested (diff/export/check-brand/migrate/doctor)
- Command branches were added across `packages/cli/src/commands/design.ts:164-318`.
- CLI tests only cover two design paths: lint happy path and init policy guard (`packages/cli/tests/cli.test.mjs:53-70`).
- Missing tests for command-specific contracts include:
  - `diff` regression exit behavior and two-input provenance payload (`packages/cli/src/commands/design.ts:165-184`)
  - `export` write gating and format matrix (`packages/cli/src/commands/design.ts:187-214`)
  - `check-brand` strict/profile override error paths (`packages/cli/src/commands/design.ts:216-237`)
  - `migrate` branch behavior and error mapping (`packages/cli/src/commands/design.ts:265-289`)
  - `doctor` diagnostics and candidate discovery behavior (`packages/cli/src/commands/design.ts:291-317`)
- Why this matters: Gate 4 requires fixture-backed schema and exit-code matrix coverage for every design command (`docs/plans/2026-04-23-agent-design-engine-plan.md:926-939`).

### MEDIUM: Engine tests are too coarse to guarantee deterministic contract outputs
- Existing engine tests assert limited fields only (`packages/agent-design-engine/tests/engine.test.mjs:15-45`).
- They do not snapshot full schemas or stable ordering for findings/export payloads, despite deterministic-contract requirements.
- Why this matters: Gate 2 demands snapshot-tested schema/diff/provenance determinism and manifest mapping coverage (`docs/plans/2026-04-23-agent-design-engine-plan.md:895-901`).

### MEDIUM: Critical error paths in parser/manifest are unverified
- High-impact failure branches exist but are not directly tested:
  - frontmatter/schema validation failures (`packages/agent-design-engine/src/parser.ts:20-25`, `packages/agent-design-engine/src/parser.ts:88-93`)
  - CI profile override refusal (`packages/agent-design-engine/src/parser.ts:107-112`)
  - missing/unreadable rule source failure (`packages/agent-design-engine/src/manifest.ts:58-61`)
- Risk: error-code mapping and exit-code behavior can drift while happy-path tests stay green.

### LOW: CLI lint test is coupled to mutable repo root content
- `packages/cli/tests/cli.test.mjs:54` uses `--file ../../DESIGN.md` and assumes a stable root DESIGN contract.
- This is brittle and can fail from unrelated root-doc edits, while still not proving contract-discovery behavior.

## Smallest Relevant Command Set (for this change)
Based on touched code and the milestone plan, the smallest high-signal validation lane is:
1. `pnpm -C packages/agent-design-engine test`
2. `pnpm -C packages/design-system-guidance build`
3. `pnpm -C packages/design-system-guidance check:ci` (in a fixture-controlled target)
4. `pnpm -C packages/cli test`

Current run executed (1) and (4), plus guidance type-check, but did not execute guidance behavioral checks with migration fixtures.

WROTE: artifacts/reviews/testing.md
