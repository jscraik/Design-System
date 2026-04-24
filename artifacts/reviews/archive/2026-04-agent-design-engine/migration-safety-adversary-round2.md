# Migration Safety Adversary Review (Round 2)

## P0 - `init --force` can erase migrated rollout state and reintroduce split-brain
Impact: A migrated repo can be silently pushed back toward legacy semantics by overwriting `.design-system-guidance.json` with schema v1 defaults that do not carry `designContract.mode`/`migrationState`, breaking rollback/resume invariants and potentially causing commands to execute against the wrong contract mode.
Evidence:
- Plan requires v2 additive rollout state and strict dual-read preservation (`designContract`, `mode`, `migrationState`) and lossless migration (`docs/plans/2026-04-23-agent-design-engine-plan.md:216`, `docs/plans/2026-04-23-agent-design-engine-plan.md:220`, `docs/plans/2026-04-23-agent-design-engine-plan.md:222`, `docs/plans/2026-04-23-agent-design-engine-plan.md:223`).
- Current guidance config type has no `designContract` field (`packages/design-system-guidance/src/types.ts:17`).
- Current `init` path writes a v1 baseline config unconditionally when `--force` is used (`packages/design-system-guidance/src/core.ts:68`, `packages/design-system-guidance/src/core.ts:693`, `packages/design-system-guidance/src/core.ts:695`).
Minimal fix: Block `init --force` when a v2/migrated config is present until a round-trip-preserving writer exists, then implement schema-aware read/modify/write that preserves `designContract` and unknown forward-compatible metadata.
Confidence: high.

## P1 - Rollback metadata compatibility is required but not specified enough to implement safely
Impact: The plan requires reading rollback metadata across the full legacy support window, but it does not define the minimum metadata fields needed to evaluate compatibility; implementers may guess and either reject valid rollbacks or accept incompatible payloads.
Evidence:
- Plan requires backward-read across the published support window (`docs/plans/2026-04-23-agent-design-engine-plan.md:551`) and legacy support EOL metadata (`docs/plans/2026-04-23-agent-design-engine-plan.md:603`, `docs/plans/2026-04-23-agent-design-engine-plan.md:607`).
- Rollback metadata section currently defines only schema ID-level constraints, not required compatibility fields (`docs/plans/2026-04-23-agent-design-engine-plan.md:548`, `docs/plans/2026-04-23-agent-design-engine-plan.md:550`).
Minimal fix: Extend `astudio.design.rollback.v1` with required fields (`writtenByWrapperVersion`, `writtenAt`, `sourceMode`, `targetMode`, `schemaVersion`, checksum/path metadata) and codify the compatibility decision algorithm against `legacySupportEndsAt`.
Confidence: medium-high.

## P1 - Quarantine path is deterministic but collision/retention semantics are undefined
Impact: Repeated rollback/remigrate cycles can overwrite prior quarantined `DESIGN.md` artifacts, destroying forensic state and weakening operator recovery confidence.
Evidence:
- Plan mandates deterministic quarantine path for migrated `DESIGN.md` (`docs/plans/2026-04-23-agent-design-engine-plan.md:524`).
- Plan also expects idempotent repeated rollback behavior (`docs/plans/2026-04-23-agent-design-engine-plan.md:810`), but does not define collision handling.
Minimal fix: Define deterministic-but-unique artifact naming (e.g., deterministic root plus monotonic suffix or content hash), explicit overwrite policy, and retention budget with tests for repeated rollback/resume loops.
Confidence: medium.

## P2 - Transition-table/operator contract still has an ambiguity around unreadable metadata rollback path
Impact: Automation and runbooks can diverge on whether `migrate --rollback` is an actionable recovery command when metadata is unreadable; this can create retry loops with no progress.
Evidence:
- Transition table lists `doctor` and `migrate --rollback` as allowed when metadata is missing/unreadable (`docs/plans/2026-04-23-agent-design-engine-plan.md:544`).
- Command matrix and resume section state unreadable rollback metadata exits `3` and is non-actionable without operator intervention (`docs/plans/2026-04-23-agent-design-engine-plan.md:300`, `docs/plans/2026-04-23-agent-design-engine-plan.md:531`).
Minimal fix: Make the table explicit that `migrate --rollback` is permitted only as a deterministic fail-closed no-op in this state, and require `doctor` to emit one canonical remediation command.
Confidence: medium-high.

Residual risk if shipped as-is: migration safety requirements are directionally strong, but current wrapper surfaces in `packages/design-system-guidance` still reflect v1-only state handling and can clobber rollout metadata before the strict v1/v2 decoder and manifest gates exist.

WROTE: artifacts/reviews/migration-safety-adversary-round2.md
