# Plans Authority Index

Last updated: 2026-04-24

## Table of Contents

- [Purpose](#purpose)
- [Current Canonical Plan](#current-canonical-plan)
- [Current Cleanup Decisions](#current-cleanup-decisions)
- [Historical Plans](#historical-plans)
- [Superseded Or Reference Plans](#superseded-or-reference-plans)

## Purpose

This index is the front door for `docs/plans/**`. Use it before choosing a plan
as active execution authority. Individual plan files can remain useful as
historical evidence, but this file names the current canonical lane explicitly.

## Current Canonical Plan

- `2026-04-23-agent-design-engine-plan.md` - canonical Agent Design Engine
  implementation plan for the JSC-208 branch. It remains the primary feature
  plan unless a later dated plan explicitly replaces it.
- `2026-04-24-agent-design-engine-baseline-inventory.md` - baseline inventory
  for the current Agent Design Engine branch and migration source boundaries.

## Current Cleanup Decisions

These files are active cleanup authority for JSC-223 and its linked slices:

- `2026-04-24-jsc223-repo-cleanup-inventory.md` - repo-wide cleanup inventory
  and follow-up issue map.
- `2026-04-24-jsc225-build-artifact-contract.md` - build-output and Storybook
  screenshot tracking contract.
- `2026-04-24-jsc226-generated-source-contract.md` - generated-source
  regeneration and freshness contract.
- `2026-04-24-jsc228-tracked-ignored-guard.md` - ignored runtime, cache,
  test-output, build-output, and audit-artifact tracking guard.

## Historical Plans

These plans describe completed or older initiatives and should be treated as
history unless a current issue links back to them:

- `2026-03-05-feat-onboarding-command-center-15-minute-success-plan.md`
- `2026-03-05-feat-quality-debt-radar-burn-down-engine-plan.md`
- `2026-04-07-001-feat-cli-gold-standard-compliance-plan.md`

## Superseded Or Reference Plans

No plan has been deleted in this cleanup. When a plan is superseded, keep the
file and update this index instead of relying on filename date order or embedded
draft/status metadata alone.
