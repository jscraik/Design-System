# API Contract Review - Agent-Native Design System Plan/Spec

## Severity-ranked Findings

### 1) HIGH - `astudio.command.v1` envelope compatibility is underspecified for new command kinds
- Evidence:
  - Spec only mandates envelope + `data.kind`, but not the other required envelope fields and error-shape invariants: [docs/specs/2026-04-28-agent-native-design-system-spec.md:203](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/specs/2026-04-28-agent-native-design-system-spec.md:203)
  - Plan slice 4 focuses on adding new kinds and fixtures, but does not require envelope-level compat assertions (`schema/meta/summary/status/errors` behavior): [docs/plans/2026-04-28-agent-native-design-system-plan.md:407](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/plans/2026-04-28-agent-native-design-system-plan.md:407), [docs/plans/2026-04-28-agent-native-design-system-plan.md:419](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/plans/2026-04-28-agent-native-design-system-plan.md:419)
  - Current live schema requires `schema`, `meta`, `summary`, `status`, `data`, `errors`, and constrains success/warn vs error branches: [packages/cli/tests/fixtures/design-schemas/astudio-design-command.v1.schema.json:20](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/cli/tests/fixtures/design-schemas/astudio-design-command.v1.schema.json:20), [packages/cli/tests/fixtures/design-schemas/astudio-design-command.v1.schema.json:148](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/cli/tests/fixtures/design-schemas/astudio-design-command.v1.schema.json:148)
- Why this is a contract risk:
  - Implementers can satisfy spec/plan text while still producing envelope-incompatible payloads for existing consumers that validate the full v1 schema.
- Remediation:
  - Add explicit spec requirement that all new `astudio.design.*.v1` responses must satisfy full `astudio.command.v1` envelope invariants.
  - Add an acceptance row + fixture that validates each new command kind against the existing envelope schema (not only kind-specific payload assertions).

### 2) HIGH - Read-only guarantee conflicts with `propose-abstraction` behavior
- Evidence:
  - Spec says `propose-abstraction` "creates or validates" proposal contract: [docs/specs/2026-04-28-agent-native-design-system-spec.md:195](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/specs/2026-04-28-agent-native-design-system-spec.md:195)
  - Main flow also permits proposal command or writing proposal artifact: [docs/specs/2026-04-28-agent-native-design-system-spec.md:165](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/specs/2026-04-28-agent-native-design-system-spec.md:165)
  - Plan defines Slice 4 as read-only commands and explicitly includes `propose-abstraction` in that set: [docs/plans/2026-04-28-agent-native-design-system-plan.md:412](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/plans/2026-04-28-agent-native-design-system-plan.md:412), [docs/plans/2026-04-28-agent-native-design-system-plan.md:462](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/plans/2026-04-28-agent-native-design-system-plan.md:462)
- Why this is a contract risk:
  - Callers cannot reliably predict mutability semantics. Existing automation treating `astudio design *` as read-only may accidentally invoke write behavior if "create" is implemented literally.
- Remediation:
  - Split into explicit commands/contracts:
    - `propose-abstraction` (read-only validator/preview only in v1), and
    - a separate future write-gated command (for artifact creation) under explicit write policy.
  - Encode this in spec invariants and CLI fixtures (assert no file writes for all v1 query commands).

### 3) MEDIUM - Field-name drift risk (`validationCommand` vs `validationCommands[]`) across payload surfaces
- Evidence:
  - Context pack uses `validationCommands[]`: [docs/specs/2026-04-28-agent-native-design-system-spec.md:224](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/specs/2026-04-28-agent-native-design-system-spec.md:224)
  - Component route uses `validationCommands[]`: [docs/specs/2026-04-28-agent-native-design-system-spec.md:246](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/specs/2026-04-28-agent-native-design-system-spec.md:246)
  - Guidance finding requires singular `validationCommand`: [docs/specs/2026-04-28-agent-native-design-system-spec.md:263](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/specs/2026-04-28-agent-native-design-system-spec.md:263)
  - Plan Slice 5 repeats singular remediation field: [docs/plans/2026-04-28-agent-native-design-system-plan.md:494](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/plans/2026-04-28-agent-native-design-system-plan.md:494)
- Why this is a contract risk:
  - Consumers that normalize shared structures across prepare/routes/findings can break on singular/plural drift or silently drop secondary commands.
- Remediation:
  - Standardize on one shape (`validationCommands[]` strongly preferred for forward compatibility).
  - If singular is required for findings, document deterministic derivation rule and add schema fixtures proving conversion behavior.

### 4) MEDIUM - Error/recovery contract is not linked to fixture schema obligations
- Evidence:
  - Spec defines detailed failure classes and recovery rules: [docs/specs/2026-04-28-agent-native-design-system-spec.md:413](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/specs/2026-04-28-agent-native-design-system-spec.md:413), [docs/specs/2026-04-28-agent-native-design-system-spec.md:425](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/specs/2026-04-28-agent-native-design-system-spec.md:425)
  - Plan references distinct error matrix outcomes but does not require explicit mapping to envelope `errors[].code` + `recovery` schema fixtures per class: [docs/plans/2026-04-28-agent-native-design-system-plan.md:170](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/plans/2026-04-28-agent-native-design-system-plan.md:170), [docs/plans/2026-04-28-agent-native-design-system-plan.md:663](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/plans/2026-04-28-agent-native-design-system-plan.md:663)
- Why this is a contract risk:
  - Implementations may emit ad hoc error bodies that are semantically correct but structurally inconsistent for downstream automation.
- Remediation:
  - Add a normative error-code matrix appendix (error code -> required `errors[].details` keys -> whether `recovery.nextCommand` is allowed).
  - Require one fixture per failure class validating against the existing envelope schema.

### 5) MEDIUM - Backward-compatibility guardrail for command names/options is too weak
- Evidence:
  - Spec says "Exact names may change during planning": [docs/specs/2026-04-28-agent-native-design-system-spec.md:179](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/specs/2026-04-28-agent-native-design-system-spec.md:179)
  - Yet acceptance criteria treat concrete commands/options as stable callable interface (`--surface`, `--need`, `--component`, `--json`): [docs/specs/2026-04-28-agent-native-design-system-spec.md:484](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/specs/2026-04-28-agent-native-design-system-spec.md:484), [docs/specs/2026-04-28-agent-native-design-system-spec.md:494](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/specs/2026-04-28-agent-native-design-system-spec.md:494)
- Why this is a contract risk:
  - Downstream scripts can integrate against the documented flags before implementation; later rename churn becomes silent API drift.
- Remediation:
  - Add explicit compatibility policy in spec: once this spec is approved, command names/flags are frozen for v1; any rename requires alias period + deprecation signal + fixture updates.

## Coverage Notes
- Reviewed focus areas requested: envelope compatibility, command names/options, payload required fields, error/recovery schema, read-only guarantees, and backward compatibility.
- No blocker found on "`context` must not be public v1"; both plan and spec are consistent on that point.

WROTE: artifacts/reviews/api-contract-reviewer.md
