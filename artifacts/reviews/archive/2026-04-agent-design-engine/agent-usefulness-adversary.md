# Agent Usefulness Adversarial Review

## P0

### P0-1: Contract model drops existing professional UI/routing semantics, so agents can pass checks while generating low-quality or non-compliant UI
- Evidence:
  - Plan promises agents can determine canonical UI composition rules (`docs/plans/2026-04-23-agent-design-engine-plan.md:41`).
  - Required `DESIGN.md` contract fields are only `schemaVersion` and `brandProfile` (`docs/plans/2026-04-23-agent-design-engine-plan.md:145`, `docs/plans/2026-04-23-agent-design-engine-plan.md:148`).
  - Phase 2 implementation scope only commits to parsing those two frontmatter fields plus generic semantic model work, with no explicit requirement to encode routing/state/focus/motion contract semantics (`docs/plans/2026-04-23-agent-design-engine-plan.md:565`, `docs/plans/2026-04-23-agent-design-engine-plan.md:566`).
  - Existing normative contract already defines required protected-surface behavior for hierarchy, state model, focus, motion, and viewport/input defaults (`docs/design-system/PROFESSIONAL_UI_CONTRACT.md:21`, `docs/design-system/PROFESSIONAL_UI_CONTRACT.md:84`, `docs/design-system/PROFESSIONAL_UI_CONTRACT.md:118`, `docs/design-system/PROFESSIONAL_UI_CONTRACT.md:129`).
  - Existing routing contract already defines component-choice precedence for agents (`docs/design-system/AGENT_UI_ROUTING.md:22`, `docs/design-system/AGENT_UI_ROUTING.md:24`).
  - Prior audit identifies exactly this gap: hygiene checks exist, but professional composition/routing rules are not strongly encoded (`docs/audits/AGENT_UI_MARCH_2026_AUDIT.md:25`, `docs/audits/AGENT_UI_MARCH_2026_AUDIT.md:65`, `docs/audits/AGENT_UI_MARCH_2026_AUDIT.md:103`).
- Impact:
  - The new engine can become a "green" contract surface that validates syntax and tokens but not the operational UI rules agents need, recreating the same failure mode the audit flagged.
  - This is a direct trust-boundary failure: agents will treat contract pass as safe-to-ship while producing UIs that violate the repository’s own professional contract.
- Minimal fix:
  - Make v1 explicitly import or compile the existing `PROFESSIONAL_UI_CONTRACT.md` + `AGENT_UI_ROUTING.md` semantics into machine-checkable checks and fixtures, or define mandatory `DESIGN.md` sections that encode equivalent rules with deterministic finding IDs.
  - Add gate criteria that fail if routing/state/focus/motion rules are not represented in engine findings.
- Confidence: High

## P1

### P1-1: Brand guidance inheritance is underspecified, so agents cannot deterministically resolve which brand rules apply
- Evidence:
  - `brandProfile` is required in `DESIGN.md` (`docs/plans/2026-04-23-agent-design-engine-plan.md:148`).
  - Wrapper owns profile resolution (`docs/plans/2026-04-23-agent-design-engine-plan.md:102`).
  - CLI allows optional override `--profile` (`docs/plans/2026-04-23-agent-design-engine-plan.md:225`).
  - The plan does not define deterministic precedence between frontmatter profile, CLI override, wrapper defaults, or potential repo-level policy, and does not define explicit unknown-profile error codes in the deterministic mapping (`docs/plans/2026-04-23-agent-design-engine-plan.md:280`, `docs/plans/2026-04-23-agent-design-engine-plan.md:295`).
- Impact:
  - Different execution surfaces (CI, local, wrapper version) can silently evaluate different profile assumptions for the same file.
  - Agents cannot safely reason about brand inheritance or produce reproducible fixes across runs.
- Minimal fix:
  - Add a normative profile-resolution precedence table and required output fields (`resolvedProfile`, `profileSource`, `profileVersion`), with deterministic error codes for unknown/unsupported profile and profile-version mismatch.
- Confidence: High

### P1-2: Error recovery contract is too narrow for agent self-healing on safety/policy failures
- Evidence:
  - Plan requires deterministic `code/message/hint` specifically for discovery failures (`docs/plans/2026-04-23-agent-design-engine-plan.md:348`).
  - Command matrix has multiple expected refusal paths (`missing --write`, policy refusal, compatibility refusal) where agent retries are expected (`docs/plans/2026-04-23-agent-design-engine-plan.md:241`, `docs/plans/2026-04-23-agent-design-engine-plan.md:244`, `docs/plans/2026-04-23-agent-design-engine-plan.md:247`).
  - Existing CLI gold-standard requirements already call for `fix_suggestion` in error responses (`docs/plans/2026-04-07-001-feat-cli-gold-standard-compliance-plan.md:30`, `docs/plans/2026-04-07-001-feat-cli-gold-standard-compliance-plan.md:39`).
- Impact:
  - Agents can classify failure but still lack canonical remediation steps for non-discovery failures, causing retry churn and fragile automation.
  - In practice this drives trial-and-error flag mutation rather than deterministic recovery.
- Minimal fix:
  - Require structured remediation for all non-success errors (`hint` + `fix_suggestion` + optional `nextCommand`), not only discovery errors.
  - Add fixtures for each exit-3 policy/safety path proving actionable remediation payloads.
- Confidence: High

## P2

### P2-1: Machine-facing determinism claim is not enforced when output mode is unspecified
- Evidence:
  - Plan states every machine-facing command must be deterministic/parseable (`docs/plans/2026-04-23-agent-design-engine-plan.md:73`).
  - CLI responsibilities include JSON/plain output selection (`docs/plans/2026-04-23-agent-design-engine-plan.md:111`).
  - Determinism requirements are explicitly scoped to `--json` behavior (`docs/plans/2026-04-23-agent-design-engine-plan.md:298`, `docs/plans/2026-04-23-agent-design-engine-plan.md:372`).
  - No normative requirement defines agent/CI default output mode or refusal behavior when machine consumers invoke plain output.
- Impact:
  - Agent callers that omit explicit format flags can accidentally receive non-contract plain text and mis-parse runs.
- Minimal fix:
  - Define agent/CI output policy: either default to JSON in non-interactive contexts or fail closed unless `--json` is present for machine consumers.
  - Expose an explicit `outputMode` field in `meta` and add fixtures covering default-mode behavior.
- Confidence: Medium

## Residual risk if shipped as-is
- The plan is strong on package boundaries and exit-code determinism, but it still leaves core agent-usefulness behavior underdefined at the semantic contract layer. Without closing P0/P1 gaps, this likely reproduces “policy-green but UX-contract-drift” outcomes.

WROTE: artifacts/reviews/agent-usefulness-adversary.md
