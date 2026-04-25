# Migration Safety Adversarial Review

## P0

### 1) Crash window can produce an unrecoverable mixed state that `doctor` will not route
- Impact: A crash between content mutation and final `migrationState` update can leave `mode=design-md` with a non-terminal state (`not-started`/`initialized`). `resume` and `doctor` are only specified for `partial|failed`, so operators can be stranded in a state that is neither healthy nor resumable. This is a high-probability failure path in CI/agent automation where interruptions are normal.
- Evidence:
  - Plan mandates write ordering: rollback metadata first, then mutation, then `migrationState` last (`docs/plans/2026-04-23-agent-design-engine-plan.md:438-441`).
  - `resume` is only defined for `partial|failed` (`docs/plans/2026-04-23-agent-design-engine-plan.md:454-456`).
  - `doctor` routing requirement only names `partial|failed` (`docs/plans/2026-04-23-agent-design-engine-plan.md:462-463`).
  - Current package has no state-machine enforcement type for `designContract` and no transactional write helper today (`packages/design-system-guidance/src/types.ts:17-25`, `packages/design-system-guidance/src/core.ts:682-708`).
- Minimal fix: Define and test an explicit transition table with mandatory crash-safe intermediate state (`partial`) written before any irreversible mutation, plus recovery rules for every non-terminal combination (`mode`, `migrationState`, metadata presence). `doctor` must route all non-healthy combinations, not just `partial|failed`.
- Confidence: High.

### 2) Rollback readability guarantee conflicts with the declared legacy support window
- Impact: The plan guarantees rollback metadata readability for only the previous two minor versions, but legacy support is time-based and can outlast two minors. If releases are frequent, still-supported installs may be unable to read rollback metadata and cannot safely rollback during the official support window.
- Evidence:
  - Rollback metadata backward-read guarantee: previous two minor versions (`docs/plans/2026-04-23-agent-design-engine-plan.md:460-461`).
  - Legacy support window: later of 90 days or two minor releases (`docs/plans/2026-04-23-agent-design-engine-plan.md:501-505`).
- Minimal fix: Couple rollback metadata compatibility to the published support window (not minor-count only), and enforce it in release gates.
- Confidence: High.

## P1

### 3) Rollback can leave `DESIGN.md` behind, causing post-rollback behavior drift via discovery
- Impact: Rollback is specified to leave `DESIGN.md` in place unless generated and unmodified. After rollback to legacy mode, contract-discovery commands can still auto-resolve that file, so behavior does not fully return to pre-migration semantics. This creates false confidence in rollback and can reintroduce design-md validation effects unintentionally.
- Evidence:
  - Rollback leaves `DESIGN.md` in most cases (`docs/plans/2026-04-23-agent-design-engine-plan.md:448-451`).
  - Discovery auto-selects a single candidate `DESIGN.md` (`docs/plans/2026-04-23-agent-design-engine-plan.md:198-201`).
  - Legacy-mode command matrix still allows/uses discovered `DESIGN.md` for lint/export/check-brand (`docs/plans/2026-04-23-agent-design-engine-plan.md:239-243`).
- Minimal fix: Add a rollback policy switch that can quarantine or rename migrated `DESIGN.md` on rollback, or force legacy commands to ignore discovered contracts unless explicitly requested.
- Confidence: Medium-high.

### 4) Dual-read migration is underspecified against the current permissive parser, enabling silent split-brain
- Impact: Existing parser accepts arbitrary numeric `schemaVersion` and ignores unknown fields. During phased rollout, an older wrapper can parse v2 config but silently ignore `designContract` state, while newer tooling treats design-md as active. Different agents then enforce different policy on the same repo.
- Evidence:
  - Plan requires additive dual-read v1/v2 migration (`docs/plans/2026-04-23-agent-design-engine-plan.md:167-173`).
  - Current config type does not define `designContract` (`packages/design-system-guidance/src/types.ts:17-25`).
  - Current parse accepts unknown fields and only checks base arrays (`packages/design-system-guidance/src/core.ts:163-203`).
- Minimal fix: Specify strict versioned decoding with explicit v1/v2 discriminators, deterministic downgrade behavior, and a hard compatibility refusal when active mode cannot be represented by the running wrapper.
- Confidence: High.

## P2

### 5) Compatibility-manifest preflight sequencing is not tied to manifest integrity/fallback behavior
- Impact: The plan requires pre-handler schema compatibility checks before mutations, but does not define fail-closed behavior for missing/corrupt/unreadable manifest at startup. In practice, this gap often regresses into “best effort” checks that run too late.
- Evidence:
  - Pre-handler check requirement before writes/migration/external execution (`docs/plans/2026-04-23-agent-design-engine-plan.md:495-497`).
  - No explicit missing/corrupt manifest error contract in the same section.
- Minimal fix: Add explicit startup contract: manifest load/validation must occur before command dispatch; if missing/corrupt/unparseable, exit `3` with deterministic error code and no side effects.
- Confidence: Medium.

Residual risk if unaddressed: migration reliability will depend on process luck and release cadence, not a provable state machine. The highest operational risk is non-recoverable partial migration under interruption.

WROTE: artifacts/reviews/migration-safety-adversary.md
