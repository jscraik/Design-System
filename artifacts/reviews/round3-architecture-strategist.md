# Round 3 Architecture Review

No blocking findings.

## Findings (Severity-ranked)

### Medium - Contract source ambiguity between human routing doc and machine routing source
- Evidence:
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:144` says preparation resolves "routing docs" as an input source.
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:303` establishes `docs/design-system/AGENT_UI_ROUTING.json` as the authored machine authority.
  - `docs/plans/2026-04-28-agent-native-design-system-plan.md:87` to `:93` assigns canonical routing ownership to JSON and engine parsing ownership to `packages/agent-design-engine`.
- Architectural risk:
  - This wording can lead implementers to parse `AGENT_UI_ROUTING.md` at runtime, violating the intended boundary and recreating duplicated routing logic across consumers.
- Remediation:
  - Tighten spec language so runtime inputs are only machine-readable artifacts (`AGENT_UI_ROUTING.json`, lifecycle, coverage), while `.md` routing docs are explicitly narrative/validation companions.
  - Add one boundary assertion in plan/spec: runtime code paths must not parse `AGENT_UI_ROUTING.md`.

### Medium - Waiver and proposal-gate ownership spans multiple layers without a single control-plane statement
- Evidence:
  - `docs/plans/2026-04-28-agent-native-design-system-plan.md:241` to `:244` places waiver registry enforcement under proposal-gate policy in `packages/agent-design-engine`.
  - `docs/plans/2026-04-28-agent-native-design-system-plan.md:838` also assigns policy validation work to `scripts/policy/run.mjs`.
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:502` to `:504` says proposal-gate policy owns waiver validation and audits.
- Architectural risk:
  - If engine and policy scripts each implement validation independently, divergence is likely (different schema, expiry rules, or near-expiry behavior), weakening the contract.
- Remediation:
  - Declare one canonical waiver validator implementation (prefer engine package export), and require policy scripts/CLI to consume that implementation rather than re-encoding rules.
  - Add a parity test proving engine + policy runner produce identical waiver decisions for the same fixture set.

### Low - Sequencing permits remediation work before CLI contract checkpoint, increasing integration churn
- Evidence:
  - `docs/plans/2026-04-28-agent-native-design-system-plan.md:269` allows Slice 5 to begin after Slice 2.
  - `docs/plans/2026-04-28-agent-native-design-system-plan.md:282` sets C4 (CLI contract green) as readiness for Slice 5 consumers/external usage.
- Architectural risk:
  - This is not incorrect, but can cause rework when remediation payload fields evolve before CLI envelope fixtures stabilize.
- Remediation:
  - Keep current parallelism, but pin a lightweight interface contract test (engine remediation payload schema + envelope projection) before substantial Slice 5 expansion.
  - Gate external consumer docs/usage on C4 as already intended.

## Residual Risks
- Linear issue split is clear (`JSC-238` to `JSC-245`), but cross-ticket drift remains possible unless acceptance IDs (SA*) are used as explicit checklists in each issue.
- Route maturity and hardening promotion controls are strong, but success depends on strict enforcement that all consumers use exported engine facades (not direct JSON parsing).

WROTE: artifacts/reviews/round3-architecture-strategist.md
