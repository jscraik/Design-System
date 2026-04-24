# Agent Usefulness Adversarial Review (Round 2)

## Findings

### P0 - CI/agent output-mode contract is self-contradictory, so machine callers cannot rely on one deterministic behavior
- Evidence:
  - `docs/plans/2026-04-23-agent-design-engine-plan.md:446` requires `--agent`/CI mode to default to JSON unless `--plain` is selected.
  - `docs/plans/2026-04-23-agent-design-engine-plan.md:447` requires machine callers in `--agent`/CI mode to receive `E_POLICY` refusal if they omit `--json`/`--plain`.
- Impact:
  - The same invocation path can be implemented in two incompatible ways (implicit JSON vs hard refusal).
  - Agents cannot build a stable retry strategy because omission of output flags is both valid and invalid per spec.
  - This will cause fixture churn and cross-team drift in CLI behavior.
- Minimal fix:
  - Choose exactly one contract and remove the other sentence.
  - Recommended: keep fail-closed refusal (`E_POLICY`) for machine mode and require explicit `--json`/`--plain`, because that is more predictable for automation and safer against accidental human-mode output parsing.
- Confidence: High

### P1 - Rule-evaluation provenance is missing from required machine payload, so findings are not reproducible across doc/rules drift
- Evidence:
  - Rule sources are explicitly external and mutable (`PROFESSIONAL_UI_CONTRACT.md`, `AGENT_UI_ROUTING.md`, `COMPONENT_LIFECYCLE.json`, `COVERAGE_MATRIX.json`) in `docs/plans/2026-04-23-agent-design-engine-plan.md:156-161`.
  - Required command payload fields for lint/export/check-brand/doctor include contract/profile metadata but no rulepack/source version/hash fields (`docs/plans/2026-04-23-agent-design-engine-plan.md:426-433`).
  - Source docs are versioned by freeform timestamps, not immutable schema IDs (`docs/design-system/PROFESSIONAL_UI_CONTRACT.md:3`, `docs/design-system/AGENT_UI_ROUTING.md:3`).
- Impact:
  - Two runs against the same `DESIGN.md` can produce different findings without a machine-visible explanation of which rule snapshot was applied.
  - Agents cannot confidently interpret regressions, auto-triage failures, or perform deterministic retries after repo updates.
- Minimal fix:
  - Add mandatory provenance fields to machine payloads (for contract-resolving commands): e.g. `rulePackVersion`, `ruleSourceDigests` (or commit hashes) for each required source.
  - Gate releases on fixture tests that assert provenance stability for identical inputs.
- Confidence: High

### P2 - Routing/professional rule intent is normative prose, but the plan does not define a canonical machine rule manifest, leaving room for divergent implementations
- Evidence:
  - Plan requires machine-checkable `ui.routing.*` and other rule groups compiled from markdown prose (`docs/plans/2026-04-23-agent-design-engine-plan.md:88-90`, `163-173`).
  - `AGENT_UI_ROUTING.md` expresses key constraints as natural-language guidance (e.g., routing order and "do not create these by default") without machine IDs or parameterized predicates (`docs/design-system/AGENT_UI_ROUTING.md:22-27`, `59-66`).
- Impact:
  - Different implementers can encode different semantics for the same prose, causing inconsistent findings and remediation hints.
  - Agents may receive non-comparable `ui.routing.*` results across versions/tools, reducing trust in automated review output.
- Minimal fix:
  - Introduce a canonical machine rule manifest (JSON) as the normative source for enforceable routing/professional checks, with markdown remaining explanatory.
  - Require each finding ID to map 1:1 to manifest entries and include `ruleId` + `sourceRef` in output.
- Confidence: Medium

## Residual Risks
- Migration-state safety is substantially improved in this revision (transition table coverage and idempotency checks are explicit), but these three contract gaps still threaten reliable agent automation and deterministic interpretation.

WROTE: artifacts/reviews/agent-usefulness-adversary-round2.md
