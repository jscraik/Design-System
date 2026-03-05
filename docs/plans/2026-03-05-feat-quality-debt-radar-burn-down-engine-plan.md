---
title: "feat: Add Quality Debt Radar and Burn-down Engine"
type: feat
status: completed
date: 2026-03-05
origin: docs/brainstorms/2026-03-05-quality-debt-radar-burn-down-engine-brainstorm.md
---

# feat: Add Quality Debt Radar and Burn-down Engine

## Overview
Create a repository-level quality debt radar that makes hidden quality risk visible, measurable, and reducible over time, with weekly burn-down slices for maintainers and release owners (see brainstorm: docs/brainstorms/2026-03-05-quality-debt-radar-burn-down-engine-brainstorm.md).

This plan carries forward the brainstorm’s selected direction (Approach A), including: maintainers/release owners as primary audience, weekly reporting cadence, warn-first rollout, and category-based debt tracking (lint/a11y/CSS lint gaps/integration drift) (see brainstorm: docs/brainstorms/2026-03-05-quality-debt-radar-burn-down-engine-brainstorm.md).

## Problem Statement / Motivation
Current CI and release flows can pass while meaningful debt remains latent:
- Biome currently suppresses high-signal rules and excludes CSS from lint scope (`/Users/jamiecraik/dev/design-system/biome.json:12,57,58`).
- Risk-tier gates and evidence rules exist, but they do not currently provide a unified debt trend view (`/Users/jamiecraik/dev/design-system/harness.contract.json:3-31`).
- QA gates exist across policy, drift, and coverage checks, but debt signal is fragmented across docs and scripts (`/Users/jamiecraik/dev/design-system/package.json:31,67,85`, `/Users/jamiecraik/dev/design-system/docs/operations/QA_EVIDENCE_SCHEMA.md:42-48`).

Without a single debt visibility layer, quality risk remains hard to prioritize and hard to burn down predictably.

## Proposed Solution
Introduce a **Quality Debt Radar + Burn-down Engine** with four product-level capabilities:

1. **Debt inventory model (category-first):**
   Track debt as explicit categories, not a single aggregate score (see brainstorm: docs/brainstorms/2026-03-05-quality-debt-radar-burn-down-engine-brainstorm.md).

2. **Weekly burn-down slices:**
   Publish consistent weekly trend outputs for maintainers and release owners (see brainstorm: docs/brainstorms/2026-03-05-quality-debt-radar-burn-down-engine-brainstorm.md).

3. **Warn-first rollout posture:**
   Start with visibility and guidance; defer hard-fail tightening to explicitly approved phases (see brainstorm: docs/brainstorms/2026-03-05-quality-debt-radar-burn-down-engine-brainstorm.md).

4. **Governance anchoring to existing artifacts:**
   Reuse the current evidence schema, policy checks, coverage matrix, a11y contracts, and risk-tier governance as source anchors (see brainstorm: docs/brainstorms/2026-03-05-quality-debt-radar-burn-down-engine-brainstorm.md).

## Alternative Approaches Considered
- **Approach B: Risk-tiered gate simplification** (deferred): useful, but does not first solve debt visibility/measurement.
- **Approach C: Governance compiler** (deferred): strategically valuable, but larger initial scope than needed for mid-2026 visibility goals.

Rationale for rejection is preserved from brainstorm decisions to keep YAGNI and ship the smallest high-leverage increment first (see brainstorm: docs/brainstorms/2026-03-05-quality-debt-radar-burn-down-engine-brainstorm.md).

## Technical Considerations
- **Architecture impacts:** new reporting layer should compose existing gate outputs, not replace current CI gates immediately.
- **Performance implications:** keep generation cheap enough for routine CI and/or scheduled runs; avoid broad repo rescans where incremental inputs are available.
- **Security considerations:** no secret ingestion; report only repo-local quality metadata; follow governance/privacy documentation for stored artifacts (`/Users/jamiecraik/dev/design-system/docs/operations/GOVERNANCE_SECURITY_PRIVACY.md`).

## System-Wide Impact
- **Interaction graph:** policy and gate outputs (Biome/policy/drift/coverage evidence) feed radar snapshots, which feed weekly burn-down reporting and release-owner triage.
- **Error propagation:** missing/failed source checks must surface as explicit “data unavailable” states, not silently pass as “no debt.”
- **State lifecycle risks:** stale snapshots can create false confidence; require freshness metadata and explicit stale-state labeling.
- **API surface parity:** policy/debt signals appear in CI, release prep, and documentation-facing workflows (`/Users/jamiecraik/dev/design-system/.github/workflows/ci.yml:74,90,94`, `/Users/jamiecraik/dev/design-system/docs/RELEASE.md:25-31,57`).
- **Integration test scenarios:** verify signal consistency across local runs, CI runs, and release validation contexts.

## SpecFlow Analysis (coverage + edge cases)
> `spec-flow-analyzer` agent invocation failed due model quota. Fallback analysis was completed locally using repository artifacts.

Key flow and edge-case requirements:
1. **Flow: debt source failure vs zero debt**
   Must distinguish “check failed/unavailable” from “true zero debt.”
2. **Flow: weekly trend continuity**
   Missing weeks must be represented explicitly to avoid fake improvements.
3. **Edge case: metric gaming**
   Category migration (renaming/re-bucketing) can hide debt; maintain category mapping history.
4. **Edge case: flaky signal contamination**
   Flaky test lanes must not be treated as hard debt without confidence metadata (`/Users/jamiecraik/dev/design-system/docs/work/work_outstanding.md:68,100`).
5. **Edge case: release mismatch**
   Release guidance and CI gate views must not disagree on debt state (`/Users/jamiecraik/dev/design-system/.github/workflows/release-guidance.yml`, `/Users/jamiecraik/dev/design-system/.github/workflows/release.yml`).

## Acceptance Criteria
- [x] A canonical debt-radar specification exists at `/Users/jamiecraik/dev/design-system/docs/operations/quality-debt-radar.md` covering categories, ownership, freshness, and status semantics.
- [x] Weekly burn-down artifact format is defined and documented at `/Users/jamiecraik/dev/design-system/reports/qa/quality-debt-burndown-template.md`.
- [x] Debt categories are explicitly mapped to current evidence/gate sources with file-level references (policy, drift, coverage, lint, a11y).
- [x] Warn-first behavior is documented with objective criteria for when to tighten to fail gates.
- [x] CI/release touchpoints are listed with expected parity behavior (`.github/workflows/ci.yml`, `.github/workflows/release.yml`, `.github/workflows/release-guidance.yml`).
- [x] Failure-state handling is specified for: unavailable checks, stale snapshots, and partial evidence.
- [x] A rollout checklist exists at `/Users/jamiecraik/dev/design-system/docs/operations/quality-debt-radar-rollout-checklist.md` with named verification commands and expected outputs.

## Success Metrics
- **Visibility KPI:** 100% of tracked debt categories publish weekly status (green/amber/red + freshness).
- **Reduction KPI:** measurable net debt reduction trend over the first 8 weeks after launch.
- **Reliability KPI:** no “silent success” cases where source checks fail but radar reports clean state.
- **Adoption KPI:** release-owner review uses radar output in release readiness checks.

## Dependencies & Risks
### Dependencies
- Existing gates and docs remain authoritative inputs:
  - `/Users/jamiecraik/dev/design-system/scripts/policy/run.mjs`
  - `/Users/jamiecraik/dev/design-system/scripts/generate-coverage-matrix.ts`
  - `/Users/jamiecraik/dev/design-system/docs/operations/QA_EVIDENCE_SCHEMA.md`
  - `/Users/jamiecraik/dev/design-system/harness.contract.json`

### Risks
- **Signal fragmentation persists:** if category mapping is incomplete.
- **Process fatigue:** if output is verbose and not decision-oriented.
- **False confidence:** if stale/failed sources are not clearly labeled.

### Mitigations
- Start with limited high-signal categories.
- Keep weekly output concise and action-ranked.
- Enforce freshness/error semantics in acceptance criteria.

## Research Consolidation
### AGENTS and repo conventions carried forward
- Use existing policy and validation commands as anchors (`pnpm test:policy`, `pnpm test:drift`, `pnpm ds:matrix:check`).
- Keep command and doc guidance aligned to prevent drift.
- Preserve deterministic preflight patterns where applicable (`/Users/jamiecraik/dev/design-system/scripts/codex-preflight.sh`, `/Users/jamiecraik/dev/design-system/docs/guides/ONBOARDING_COMMAND_CENTER.md:50`).

### Institutional learnings
- `docs/solutions/` has no entries currently; learnings were sourced from FORJAMIE and operational docs.
- Prior regressions emphasize drift visibility, deterministic checks, and avoiding hidden “green CI” debt (`/Users/jamiecraik/dev/design-system/FORJAMIE.md`).

### Research decision
External research was skipped. Local repository context is strong, this initiative is internal-process/product quality infrastructure, and existing in-repo conventions are sufficient for initial planning.

## Sources & References
- **Origin brainstorm:** [`/Users/jamiecraik/dev/design-system/docs/brainstorms/2026-03-05-quality-debt-radar-burn-down-engine-brainstorm.md`](../brainstorms/2026-03-05-quality-debt-radar-burn-down-engine-brainstorm.md)
  - Key carried-forward decisions: maintainers/release-owner audience, weekly cadence, warn-first rollout, category-based debt tracking, reuse of existing governance anchors.
- **Core policy and gate surface:**
  - `/Users/jamiecraik/dev/design-system/biome.json:12,57,58`
  - `/Users/jamiecraik/dev/design-system/package.json:31,67,85`
  - `/Users/jamiecraik/dev/design-system/harness.contract.json:3-31`
  - `/Users/jamiecraik/dev/design-system/docs/operations/QA_EVIDENCE_SCHEMA.md:42-48`
  - `/Users/jamiecraik/dev/design-system/.github/workflows/ci.yml:74,90,94`
  - `/Users/jamiecraik/dev/design-system/.github/workflows/release-guidance.yml`
- **Related docs/plans:**
  - `/Users/jamiecraik/dev/design-system/docs/design-system/CONTRACT.md`
  - `/Users/jamiecraik/dev/design-system/docs/design-system/ADOPTION_CHECKLIST.md:76-77`
  - `/Users/jamiecraik/dev/design-system/docs/work/work_outstanding.md:68,100`
  - `/Users/jamiecraik/dev/design-system/docs/plans/2026-03-05-feat-onboarding-command-center-15-minute-success-plan.md`

## Validation Notes
- `repo-research-analyst`, `learnings-researcher`, and `spec-flow-analyzer` subagent calls failed with the same quota error: "You've hit your usage limit for GPT-5.3-Codex-Spark."
- Smallest safe fix: completed local repository research directly via `rg`/`fd` and carried findings into this plan.
