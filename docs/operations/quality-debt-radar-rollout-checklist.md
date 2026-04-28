# Quality Debt Radar Rollout Checklist

**Owner:** Platform Team (confirm)  
**Last updated:** 2026-04-26
**Related plan:** `/docs/plans/2026-03-05-feat-quality-debt-radar-burn-down-engine-plan.md`

## Table of Contents

- [Preflight](#preflight)
- [Source Signal Validation](#source-signal-validation)
- [Executable Contract Validation](#executable-contract-validation)
- [First Weekly Report](#first-weekly-report)
- [Warn-First Governance Validation](#warn-first-governance-validation)
- [Release Touchpoint Validation](#release-touchpoint-validation)
- [Completion Criteria](#completion-criteria)

## Preflight

- [ ] Confirm repo preflight passes:
  - Command: `bash -lc "source scripts/codex-preflight.sh && preflight_repo design-system git,bash,sed,rg,fd,jq,node,pnpm AGENTS.md,docs,scripts"`
  - Expected: `✅ preflight passed`
- [ ] Confirm baseline docs exist:
  - `/docs/operations/quality-debt-radar.md`
  - `/docs/operations/quality-debt-radar.categories.json`
  - `/reports/qa/quality-debt-burndown-template.md`

## Executable Contract Validation

- [ ] Validate the category contract:
  - Command: `pnpm quality-debt:check`
  - Expected: contract validates all categories, source anchors, and template coverage
- [ ] Validate the radar generator self-test:
  - Command: `pnpm quality-debt:test`
  - Expected: generator writes a temporary weekly report containing statuses and freshness

## Source Signal Validation

- [ ] Validate policy signal:
  - Command: `pnpm test:policy`
  - Expected: command completes and output can be linked in evidence bundle
- [ ] Validate drift signal:
  - Command: `pnpm test:drift`
  - Expected: drift result produced; status can be categorized
- [ ] Validate coverage signal:
  - Command: `pnpm ds:matrix:check`
  - Expected: check passes or clear failure output available for classification
- [ ] Validate lint signal:
  - Command: `pnpm lint`
  - Expected: lint output available for debt-category interpretation

## First Weekly Report

- [ ] Create first weekly report from template:
  - Output path: `/reports/qa/quality-debt-burndown-YYYY-WW.md`
  - Command: `pnpm quality-debt:report`
- [ ] Populate all canonical categories from radar spec.
- [ ] Assign status and freshness for each category.
- [ ] Record at least one top action and owner per non-green category.

## Warn-First Governance Validation

- [ ] Verify no new hard-fail gate was introduced solely for radar launch.
- [ ] Verify red/amber categories have explicit owner acknowledgment.
- [ ] Verify stale/unavailable sources are not reported as “clean”.

## Release Touchpoint Validation

- [ ] Confirm CI touchpoint references are accurate:
  - `/.github/workflows/ci.yml`
- [ ] Confirm release touchpoint references are accurate:
  - `/.github/workflows/release.yml`
  - `/.github/workflows/release-guidance.yml`
- [ ] Confirm evidence contract alignment:
  - `/docs/operations/QA_EVIDENCE_SCHEMA.md`

## Completion Criteria

- [ ] Weekly burn-down report produced for the current cycle.
- [ ] All category statuses include freshness.
- [ ] Follow-up actions exist for all amber/red categories.
- [ ] Maintainer/release-owner review completed and recorded.
