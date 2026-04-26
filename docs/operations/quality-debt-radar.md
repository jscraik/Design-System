# Quality Debt Radar

**Owner:** Platform Team (confirm)  
**Last updated:** 2026-04-26
**Review cadence:** Weekly review, monthly rubric check

## Doc requirements

- Audience: Maintainers and release owners
- Scope: Debt visibility, burn-down semantics, rollout policy
- Non-scope: Detailed implementation internals for individual checks

## Table of Contents

- [Purpose](#purpose)
- [Primary Audience](#primary-audience)
- [Debt Categories (Canonical)](#debt-categories-canonical)
- [Category Mapping Contract](#category-mapping-contract)
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
| Lint suppressions | Lint rules intentionally disabled or broadly suppressed that hide real issues | `/biome.json`, `/FORJAMIE.md` |
| A11y debt | Accessibility-lint suppressions and uncovered contract gaps for local primitives | `/docs/design-system/A11Y_CONTRACTS.md`, `/docs/design-system/COVERAGE_MATRIX.md` |
| CSS lint coverage gap | CSS excluded from current lint surface due parser/tooling constraints | `/biome.json` |
| Integration drift | Drift between upstream/contracts and local integration seams (Apps SDK, exports, wrappers) | `/scripts/test-drift.mjs`, `/docs/design-system/UPSTREAM_ALIGNMENT.md` |
| Gate reliability debt | Known flaky/degraded quality signals that reduce confidence in passing CI | `/docs/work/work_outstanding.md`, `/docs/operations/QA_EVIDENCE_SCHEMA.md` |

## Category Mapping Contract

The executable category map lives in:

- `/docs/operations/quality-debt-radar.categories.json`

That file is the source of truth for:

- category ids and labels,
- owner handles,
- source anchors,
- source commands,
- probe names,
- green/amber/red status rules.

Validate the mapping with:

```bash
pnpm quality-debt:check
```

Generate the current weekly report with:

```bash
pnpm quality-debt:report
```

The report generator is intentionally warn-first. Amber/red category posture is written into the burn-down report for release-owner review, but the report command exits successfully when the contract and sources are readable.

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

### Failure-state semantics

Every category has two independent dimensions:

- **Risk status** answers whether the category is green, amber, or red.
- **Freshness status** answers whether the source data is current enough to trust.

The radar must preserve this distinction:

- A stale green source is not a release-ready clean bill of health.
- An unavailable source is not zero debt.
- A failed source probe raises the category to **Red** when the source cannot be read or parsed.
- A stale source raises the category to at least **Amber** until fresh evidence is recorded.
- Previous values may be cited as historical context only; they must not be used as current evidence.

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

- `/reports/qa/quality-debt-burndown-template.md`

Expected weekly report path pattern:

- `/reports/qa/quality-debt-burndown-YYYY-WW.md`

The generated current-cycle report is created by:

```bash
pnpm quality-debt:report -- --output reports/qa/quality-debt-burndown-YYYY-WW.md
```

## CI and Release Touchpoints

Radar inputs and parity surfaces:

- CI quality checks:
  - `/.github/workflows/ci.yml`
- Release validation:
  - `/.github/workflows/release.yml`
  - `/.github/workflows/release-guidance.yml`
- Evidence contract:
  - `/docs/operations/QA_EVIDENCE_SCHEMA.md`

CI and release workflows run the radar in warn-first mode. These steps generate or validate the report surface, but they use `continue-on-error: true` so radar launch does not create a new hard-fail gate before thresholds are explicitly approved.

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
pnpm quality-debt:check
pnpm quality-debt:report
```

For preflight before multi-step operations:

```bash
bash -lc "source scripts/codex-preflight.sh && preflight_repo design-system git,bash,sed,rg,fd,jq,node,pnpm AGENTS.md,docs,scripts"
```
