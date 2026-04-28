# Round 2 API Contract Review

## Findings

### High: `components` selector contract is ambiguous when both `--need` and `--surface` are provided
- Evidence:
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:185`
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:186`
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:575`
- Why this is a contract risk:
  - The public v1 surface exposes two selector modes for the same command (`--need` and `--surface`) but does not define mutual exclusivity, precedence, or an explicit validation error when both flags are passed.
  - Different parser implementations can silently diverge (prefer first flag, last flag, or merge behavior), creating external compatibility drift under the same `*.v1` contract.
- Remediation:
  - Freeze selector behavior explicitly in spec+plan: either
    - enforce XOR with deterministic error code and `errors[].details` keys, or
    - define stable precedence and emit a deterministic warning/diagnostic.
  - Add a required fixture in the SA matrix and CLI fixtures for the both-flags case.

### Medium: `validationCommands[]` shape is under-specified for route payloads and error recovery contexts
- Evidence:
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:251`
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:252`
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:253`
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:254`
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:255`
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:256`
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:279`
  - `docs/plans/2026-04-28-agent-native-design-system-plan.md:345`
- Why this is a contract risk:
  - The spec strongly defines `validationCommands[]` shape for `prepare`, including `safetyClass`, but route-level `validationCommands[]` is only required as a field name with no explicit subshape.
  - This allows downstream producers/consumers to diverge on command metadata and safety semantics, especially when route data is reused in remediation outputs.
- Remediation:
  - Define one canonical `validationCommands[]` item schema reused across:
    - `prepare` payload,
    - route payloads,
    - remediation payload fields.
  - Mark whether `packageScript`, `blockedByDefault`, and `reason` are required/optional per context, but keep shared fields and enum values identical.

### Medium: `errors[].details.recovery` contract is partially specified and may drift by error class
- Evidence:
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:489`
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:490`
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:503`
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:513`
  - `docs/plans/2026-04-28-agent-native-design-system-plan.md:540`
- Why this is a contract risk:
  - The docs require design-specific recovery data under `errors[].details`, but they do not define a stable shared recovery object schema (for example, required keys when `nextCommand` is allowed vs disallowed).
  - As command variants grow, each handler can emit ad hoc recovery shapes while still passing coarse envelope checks.
- Remediation:
  - Add a shared `errors[].details.recovery` schema with explicit required keys (for example `allowed`, `nextCommand`, `reason`, `safetyClass`) and per-error-class constraints.
  - Require fixture validation against this schema for each failure class in the recovery matrix.

Residual risks:
- `astudio.command.v1` top-level compatibility is described textually but not tied in these docs to an explicit compatibility test matrix for required/optional/nullability transitions across command kinds.
- `propose-abstraction` read-only semantics are clear, but a dedicated fixture should also assert no hidden write side effects under failure/retry paths.

WROTE: artifacts/reviews/round2-api-contract-reviewer.md
