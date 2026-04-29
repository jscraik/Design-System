# Architecture Review - Agent-Native Design System Plan/Spec

## Severity-Ranked Findings

### 1) High - Acceptance contract is inconsistent with planned slice scope
- Evidence:
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:492` requires SA9 coverage for `permission-denied or unavailable`, `dense dashboard`, and `form validation` patterns.
  - `docs/plans/2026-04-28-agent-native-design-system-plan.md:130`-`docs/plans/2026-04-28-agent-native-design-system-plan.md:138` explicitly defers those examples from the first wave.
  - `docs/plans/2026-04-28-agent-native-design-system-plan.md:553`-`docs/plans/2026-04-28-agent-native-design-system-plan.md:587` scopes Slice 6 to the smaller first wave.
- Why this is an architectural issue:
  - The plan cannot satisfy the current spec acceptance matrix in its stated rollout shape, so the architecture lacks a coherent definition of "done" and creates governance ambiguity.
- Remediation:
  - Either (a) split SA9 into phased acceptance criteria (`SA9a` first-wave, `SA9b` extended-wave), or (b) add an explicit Slice 8 that closes the deferred SA9 coverage before declaring spec-complete.

### 2) Medium - Package boundary is declared but not enforced through a single route-resolution interface
- Evidence:
  - `docs/plans/2026-04-28-agent-native-design-system-plan.md:96`-`docs/plans/2026-04-28-agent-native-design-system-plan.md:97` says guidance must not duplicate routing-table parsing logic.
  - `docs/plans/2026-04-28-agent-native-design-system-plan.md:497`-`docs/plans/2026-04-28-agent-native-design-system-plan.md:503` requires guidance to consume routing-derived remediation.
  - `docs/plans/2026-04-28-agent-native-design-system-plan.md:734`-`docs/plans/2026-04-28-agent-native-design-system-plan.md:739` identifies ownership drift risk but only as process control.
- Why this is an architectural issue:
  - Without a hard technical seam (single engine API/facade), the guidance package can still drift into direct doc/JSON parsing and re-implement semantic joins.
- Remediation:
  - Define one exported engine boundary (e.g., `resolveRouteForNeed`, `resolveRouteForSurface`, `resolveRemediationContext`) and ban direct routing-doc reads from `packages/design-system-guidance` via boundary tests.

### 3) Medium - Command contract evolution lacks an explicit compatibility/versioning policy
- Evidence:
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:203`-`docs/specs/2026-04-28-agent-native-design-system-spec.md:209` adds new `kind` values.
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:210`-`docs/specs/2026-04-28-agent-native-design-system-spec.md:230` introduces a large required field set for `prepare` payloads.
  - `docs/plans/2026-04-28-agent-native-design-system-plan.md:407`-`docs/plans/2026-04-28-agent-native-design-system-plan.md:419` wires these kinds into CLI contracts.
- Why this is an architectural issue:
  - External or downstream automation consuming `astudio.command.v1` may break if required field sets or `kind` semantics shift without a declared backward/forward compatibility contract.
- Remediation:
  - Add a versioning rule section: additive-only within `*.v1`, introduce `*.v2` for required-field/semantic breaks, and require fixture coverage for both previous and current schemas during migration windows.

### 4) Medium - Rollout sequencing allows remediation slice to start before the preparation domain model is stabilized
- Evidence:
  - `docs/plans/2026-04-28-agent-native-design-system-plan.md:156` says Slice 5 may begin after Slice 2.
  - `docs/plans/2026-04-28-agent-native-design-system-plan.md:331`-`docs/plans/2026-04-28-agent-native-design-system-plan.md:347` defines core scope/kind/diagnostic semantics in Slice 3.
  - `docs/plans/2026-04-28-agent-native-design-system-plan.md:491`-`docs/plans/2026-04-28-agent-native-design-system-plan.md:503` requires deterministic remediation semantics in Slice 5.
- Why this is an architectural issue:
  - Remediation output and preparation diagnostics share semantic primitives (route, scope, ambiguity classes). Starting Slice 5 early increases risk of duplicate or divergent failure taxonomies.
- Remediation:
  - Gate Slice 5 on a minimal Slice 3 semantic-contract milestone (error taxonomy + scope classification + route identity model), not only on Slice 2 route data availability.

## Positive Compliance Notes
- Clear command/query separation intent is present and mostly strong (`prepare/components/coverage` read-only posture and no public `context` command).
- Data authority placement is directionally sound: policy in docs, interpretation in engine, presentation in CLI.
- Slice-level rollback sections are present and practical for local reversibility.

## Overall Architecture Verdict
- **Conditional pass**: the design is coherent and implementable, but should address the four findings above before execution to avoid contract drift and boundary erosion during rollout.

WROTE: artifacts/reviews/architecture-strategist.md
