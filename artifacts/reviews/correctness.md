# Correctness Review (JSC-208 local diff)

## Findings

### 1) HIGH: `migrate --resume` accepts invalid states and can mutate from `not-started`
- Evidence:
  - Contract requires resume only from `partial` or `failed`: `docs/plans/2026-04-23-agent-design-engine-plan.md:559`, `docs/plans/2026-04-23-agent-design-engine-plan.md:568`, `docs/plans/2026-04-23-agent-design-engine-plan.md:569`.
  - Implementation allows resume unconditionally and forces `migrationState: "migrated"`: `packages/design-system-guidance/src/core.ts:819`, `packages/design-system-guidance/src/core.ts:823`.
  - Type/model omits contract states (`initialized`, `active`, `failed`) and introduces `migrated`: `packages/design-system-guidance/src/types.ts:30`.
  - Repro (current repo config is `legacy/not-started`):
    - `node packages/cli/dist/index.js design migrate --resume --dry-run --json`
    - Returned success with `"afterMode":"design-md"` and `"migrationState":"migrated"` (exit `0`).
- Why this is a correctness bug:
  - Invalid state transitions are accepted, so automation can “resume” a migration that was never started and record a non-contract state.
- Remediation:
  - Enforce state-machine guards before transition (`resume` allowed only from `partial`/`failed` with readable metadata).
  - Align state enum and emitted values to contract (`initialized|active|partial|failed|rolled-back|not-started`), removing `migrated`.

### 2) HIGH: write-gate errors in `design migrate` are misclassified as internal failures
- Evidence:
  - Contract mapping requires policy/write-required errors to be policy class exit `3`: `docs/plans/2026-04-23-agent-design-engine-plan.md:365`, `docs/plans/2026-04-23-agent-design-engine-plan.md:366`.
  - Core migration throws a generic `Error` for missing `--write`: `packages/design-system-guidance/src/core.ts:845`.
  - CLI normalization maps non-`CliError`/non-`DesignEngineError` to `E_INTERNAL` exit `1`: `packages/cli/src/commands/design.ts:68`, `packages/cli/src/commands/design.ts:70`.
  - Repro:
    - `node packages/cli/dist/index.js design migrate --to design-md --json`
    - Output: `errors[0].code = "E_INTERNAL"`; process exit `1`.
- Why this is a correctness bug:
  - Agent policy loops depending on deterministic policy exit classes will treat an operator-actionable write-gate as an internal runtime failure.
- Remediation:
  - Throw/propagate a typed `CliError` (or dedicated design error) for write-required conditions with `E_POLICY`/`E_DESIGN_WRITE_REQUIRED` and exit `3`.

### 3) MEDIUM: unknown future guidance `schemaVersion` values are silently accepted
- Evidence:
  - Contract requires unknown future schema versions to fail with schema-invalid error: `docs/plans/2026-04-23-agent-design-engine-plan.md:236`.
  - Parser coerces schema via `Number(...)` without version allowlist validation: `packages/design-system-guidance/src/core.ts:247`.
  - Repro in temp dir:
    - Set `.design-system-guidance.json` to `"schemaVersion": 999`.
    - Run `node .../packages/cli/dist/index.js design migrate --to design-md --dry-run --json`.
    - Command returned success (exit `0`) instead of schema failure.
- Why this is a correctness bug:
  - Forward-incompatible configs are treated as valid, risking split-brain behavior across wrapper versions.
- Remediation:
  - Validate `schemaVersion` strictly (supported set/range), reject unknown future versions with deterministic schema-invalid error path.

## Validation run
- `pnpm -C packages/design-system-guidance type-check` passed.
- `pnpm -C packages/cli test` passed.
- Existing tests currently do not cover the migrate error-code mapping/state-machine edge cases above.
