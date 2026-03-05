# Quality Debt Radar

**Owner:** Platform Team (confirm)  
**Last updated:** 2026-03-05  
**Review cadence:** Weekly review, monthly rubric check

## Doc requirements

- Audience: Maintainers and release owners
- Scope: Debt visibility, burn-down semantics, rollout policy
- Non-scope: Detailed implementation internals for individual checks

## Table of Contents

- [Purpose](#purpose)
- [Primary Audience](#primary-audience)
- [Debt Categories (Canonical)](#debt-categories-canonical)
- [Status and Freshness Semantics](#status-and-freshness-semantics)
- [Warn-First Rollout Policy](#warn-first-rollout-policy)
- [Weekly Burn-down Artifact Contract](#weekly-burn-down-artifact-contract)
- [CI and Release Touchpoints](#ci-and-release-touchpoints)
- [Failure-State Handling](#failure-state-handling)
- [Validation Commands](#validation-commands)

## Purpose

Make latent quality debt explicit, trendable, and actionable via weekly category-level reporting, without immediately expanding hard-fail gates.

This document is the canonical contract for how debt is counted, reported, and interpreted for release decisions.

## Primary Audience

- Release owners
- Repository maintainers
- Code owners for policy/quality surfaces

## Debt Categories (Canonical)

Debt is tracked by category. Do not collapse to a single score.

| Category | Description | Source Anchors |
| --- | --- | --- |
| Lint suppressions | Lint rules intentionally disabled or broadly suppressed that hide real issues | `/Users/jamiecraik/dev/design-system/biome.json`, `/Users/jamiecraik/dev/design-system/FORJAMIE.md` |
| A11y debt | Accessibility-lint suppressions and uncovered contract gaps for local primitives | `/Users/jamiecraik/dev/design-system/docs/design-system/A11Y_CONTRACTS.md`, `/Users/jamiecraik/dev/design-system/docs/design-system/COVERAGE_MATRIX.md` |
| CSS lint coverage gap | CSS excluded from current lint surface due parser/tooling constraints | `/Users/jamiecraik/dev/design-system/biome.json` |
| Integration drift | Drift between upstream/contracts and local integration seams (Apps SDK, exports, wrappers) | `/Users/jamiecraik/dev/design-system/scripts/test-drift.mjs`, `/Users/jamiecraik/dev/design-system/docs/design-system/UPSTREAM_ALIGNMENT.md` |
| Gate reliability debt | Known flaky/degraded quality signals that reduce confidence in passing CI | `/Users/jamiecraik/dev/design-system/docs/work/work_outstanding.md`, `/Users/jamiecraik/dev/design-system/docs/operations/QA_EVIDENCE_SCHEMA.md` |

## Status and Freshness Semantics

Each category has both a risk status and freshness status.

### Risk status

- **Green**: net improving trend and no blocking unknowns
- **Amber**: flat/regressing trend or significant unresolved debt
- **Red**: severe regression, missing critical source signal, or release-impacting unknown

### Freshness status

- **Fresh**: snapshot updated during the current weekly cycle
- **Stale**: no update in current weekly cycle
- **Unavailable**: source command/check failed or did not produce data

Freshness is mandatory. Never interpret stale/unavailable data as “no debt.”

## Warn-First Rollout Policy

Phase policy for this initiative:

1. **Phase 1 — Visibility only (warn-first):**
   - Publish debt radar weekly
   - Require owner acknowledgment for red categories
   - No new fail gates yet
2. **Phase 2 — Guardrail tightening:**
   - Add explicit thresholds for selected categories
   - Fail only when agreed threshold is exceeded
3. **Phase 3 — Sustained enforcement:**
   - Promote matured category thresholds to standard release checks

## Weekly Burn-down Artifact Contract

Weekly output format is defined in:

- `/Users/jamiecraik/dev/design-system/reports/qa/quality-debt-burndown-template.md`

Expected weekly report path pattern:

- `/Users/jamiecraik/dev/design-system/reports/qa/quality-debt-burndown-YYYY-WW.md`

## CI and Release Touchpoints

Radar inputs and parity surfaces:

- CI quality checks:
  - `/Users/jamiecraik/dev/design-system/.github/workflows/ci.yml`
- Release validation:
  - `/Users/jamiecraik/dev/design-system/.github/workflows/release.yml`
  - `/Users/jamiecraik/dev/design-system/.github/workflows/release-guidance.yml`
- Evidence contract:
  - `/Users/jamiecraik/dev/design-system/docs/operations/QA_EVIDENCE_SCHEMA.md`

## Failure-State Handling

If a source signal fails or is unavailable:

1. Mark category freshness as **Unavailable**
2. Preserve previous value as historical reference only
3. Raise category to at least **Amber** unless explicit override rationale is recorded
4. Add follow-up action with owner and due date

If a source is stale:

1. Mark freshness as **Stale**
2. Do not claim trend improvement for that category
3. Require refresh in next cycle before release readiness sign-off

## Validation Commands

Baseline commands that back category inputs:

```bash
pnpm test:policy
pnpm test:drift
pnpm ds:matrix:check
pnpm lint
```

For preflight before multi-step operations:

```bash
bash -lc "source scripts/codex-preflight.sh && preflight_repo design-system git,bash,sed,rg,fd,jq,node,pnpm AGENTS.md,docs,scripts"
```
