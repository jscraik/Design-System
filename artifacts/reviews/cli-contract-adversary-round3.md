# CLI Contract Adversary Review (Round 3)

## Findings (severity-ranked)

### 1. High: CI discovery contract contradicts command matrix fallback behavior
- Evidence:
  - `docs/plans/2026-04-23-agent-design-engine-plan.md:259` requires CI runs to provide `--file` or `--scope`, else `E_DESIGN_DISCOVERY_REQUIRED`.
  - `docs/plans/2026-04-23-agent-design-engine-plan.md:307` (and similarly `:309`, `:310`) says `lint`/`export`/`check-brand` may proceed from "one discoverable `DESIGN.md`" and otherwise fail with `E_DESIGN_CONTRACT_MISSING`.
- Breakage path:
  - Same CI invocation without explicit scope can map to either discovery-required (`E_DESIGN_DISCOVERY_REQUIRED`, exit 2) or contract-missing (`E_DESIGN_CONTRACT_MISSING`, exit 2) depending on which section implementers follow.
  - This creates unstable machine contracts and brittle fixture expectations.
- Remediation:
  - Add an explicit CI override clause in the command matrix rows: in CI, these commands must require `--file|--scope` and return `E_DESIGN_DISCOVERY_REQUIRED`.
  - Keep local-only discoverable fallback behavior as a separate non-CI condition.

### 2. High: Doctor payload schema contradicts global contract-resolving field requirements
- Evidence:
  - `docs/plans/2026-04-23-agent-design-engine-plan.md:265-278` requires contract-resolving payloads to include profile and rule provenance fields (`resolvedProfile`, `profileSource`, `profileVersion`, `ruleManifestVersion`, `rulePackVersion`, `ruleSourceDigests`).
  - `docs/plans/2026-04-23-agent-design-engine-plan.md:457` defines required `doctor` payload fields without those profile/rule provenance fields.
- Breakage path:
  - Implementers can legally ship `doctor` JSON that passes the per-command table but fails the global contract field requirement.
  - Gate/fixture authors will split into incompatible expectations for `doctor` output shape.
- Remediation:
  - Decide whether `doctor` is fully contract-resolving when a contract is found.
  - If yes, add the missing profile/rule fields to the `doctor` required payload row (nullable where resolution fails).
  - If no, explicitly carve `doctor` out of the global required field list with clear normative wording.

### 3. Medium: Recovery-object requirement is ambiguous for warning-status outputs
- Evidence:
  - `docs/plans/2026-04-23-agent-design-engine-plan.md:391` keeps top-level status enum including `warn`.
  - `docs/plans/2026-04-23-agent-design-engine-plan.md:307` allows warning-only lint outcomes with exit `0`.
  - `docs/plans/2026-04-23-agent-design-engine-plan.md:441-444` requires `errors[]` with `code`, `message`, `hint`, and `recovery` for every "non-success result."
- Breakage path:
  - "Non-success" can be read as including status `warn`, forcing warning-only runs (exit 0) to emit `errors[]` and recovery payloads.
  - That conflicts with common semantics where warnings are non-fatal advisories, not error objects needing remediation envelopes.
- Remediation:
  - Replace "non-success result" with "error-status result" if warnings should remain advisory.
  - Alternatively, define a separate `warnings[]` contract and keep `errors[]`+`recovery` mandatory only for status `error`.

## Residual Risks
- Exit-code classes are mostly deterministic, but unresolved wording conflicts above will still cause fixture churn and branch-specific behavior drift even if all tests pass locally.
- The matrix line "Do not redefine command behavior in later sections" (`:303`) remains brittle unless the doc clearly marks which section is the single source of truth for command-level payload/behavior details.

WROTE: artifacts/reviews/cli-contract-adversary-round3.md
