# Migration Correctness Review (JSC-208)

## CRITICAL

### 1) Rollback/resume path does not read or validate rollback metadata before mutating state
- Evidence:
  - `packages/design-system-guidance/src/core.ts:831-857` computes `rollbackMetadataPath` and target state purely from current config/defaults.
  - `packages/design-system-guidance/src/core.ts:837-850` handles `--rollback` and `--resume` without loading metadata.
  - `packages/design-system-guidance/src/core.ts:872-900` writes a new rollback artifact and mutates config even though no metadata readability/integrity check occurred.
- Why this is incorrect:
  - Plan requires rollback/resume to be metadata-gated and fail closed when unreadable (`docs/plans/2026-04-23-agent-design-engine-plan.md:315-316`, `:548-561`, `:573-585`).
  - Current behavior can advance or roll back state with missing/corrupt metadata, violating the fail-closed invariant.
- Repro command (safe in disposable temp project):
  - `node packages/cli/dist/index.js design migrate --rollback --write --yes --json`
  - Starting from a v1 config with no `designContract.rollbackMetadata`, command still mutates config instead of returning `E_DESIGN_ROLLBACK_METADATA_UNREADABLE`/exit `3`.
- Minimal fix:
  - Before any mutation for `--rollback` or `--resume`, require readable/valid rollback metadata and checksum/auth checks; on failure, return deterministic `E_DESIGN_ROLLBACK_METADATA_UNREADABLE` (exit `3`) with no side effects.

## HIGH

### 2) Migration state machine allows invalid transitions outside the transition table
- Evidence:
  - `packages/design-system-guidance/src/core.ts:827-829` only guards `--resume` source states.
  - `packages/design-system-guidance/src/core.ts:852-857` default migrate path unconditionally sets state to `active` (or `rolled-back` for `to=legacy`) regardless of current `(mode, migrationState, metadata)`.
- Why this is incorrect:
  - Plan defines strict allowed transitions and states not listed are invalid (`docs/plans/2026-04-23-agent-design-engine-plan.md:562-575`).
  - In `partial`/`failed` states, only `resume`/`rollback`/`doctor` should be valid (`:568-571`), but current code allows plain migrate to force `active`.
- Repro command (safe in disposable temp project with config preseeded to `migrationState: "failed"`):
  - `node packages/cli/dist/index.js design migrate --to design-md --write --yes --json`
  - Command can return `active` directly instead of refusing as incompatible state.
- Minimal fix:
  - Implement explicit transition-table validation (mode/state/metadata) prior to computing `afterState`; reject non-listed transitions deterministically.

### 3) CLI surfaces wrapper policy/validation errors as `E_INTERNAL` exit `1` instead of deterministic design/policy codes
- Evidence:
  - `packages/cli/src/commands/design.ts:73-89` maps only `CliError` and `DesignEngineError`; generic `Error` becomes `E_INTERNAL`/exit `1`.
  - `packages/design-system-guidance/src/core.ts:870` throws generic `Error` for missing `--write`.
  - `packages/cli/src/commands/design.ts:403-413` directly calls `migrateGuidanceConfig` without translating its known domain errors.
- Observed repro in this workspace:
  - `node packages/cli/dist/index.js design migrate --to design-md --json`
  - Output: `errors[0].code = "E_INTERNAL"`, process `EXIT:1`.
- Why this is incorrect:
  - Plan requires missing `--write` to map to policy exit `3` and deterministic design/policy codes (`docs/plans/2026-04-23-agent-design-engine-plan.md:314-316`, `:357-369`).
- Minimal fix:
  - Throw typed/domain errors from guidance migration (or map by message/code) and translate to `E_POLICY`/`E_DESIGN_WRITE_REQUIRED` with exit `3`.

## MEDIUM

### 4) Written rollback artifact schema is incompatible with the required rollback contract
- Evidence:
  - `packages/design-system-guidance/src/core.ts:874-886` writes rollback artifact with key `schemaVersion: "astudio.design.rollback.v1"` and a reduced field set.
- Why this is incorrect:
  - Plan requires schema ID and required metadata/auth fields (`schema`, wrapper version provenance, digest/signature, checksums, path-root validation inputs, etc.) (`docs/plans/2026-04-23-agent-design-engine-plan.md:577-583`).
  - Missing required fields prevents compatibility/authenticity algorithm from being executed correctly.
- Repro command (safe in disposable temp project):
  - `node packages/cli/dist/index.js design migrate --to design-md --write --yes --json`
  - Inspect generated rollback JSON under `artifacts/design-migrations/*-guidance-rollback.json`; required contract fields are absent.
- Minimal fix:
  - Emit full `astudio.design.rollback.v1` schema payload with all required fields and enforce read-time validation against that schema before rollback/resume.

WROTE: artifacts/reviews/migration-correctness-live.md
