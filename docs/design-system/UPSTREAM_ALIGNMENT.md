# Apps SDK UI Upstream Alignment Log

Last updated: 2026-01-08

## Pinned Version

- Package: `@openai/apps-sdk-ui`
- Version (from `packages/ui/package.json`): `^0.2.1`

## Last Verified

- Last verified: 2026-01-24T01:28:42Z (drift suite run locally; warnings logged for non-reexported upstream components).

## Drift Test Suite

The drift suite must validate:

- Visual snapshots for upstream components used in production.
- Contract tests that token alias mappings remain valid after upgrades.
- Detection of new upstream components that can replace local Radix fallbacks.

## Delta Register Template

Use this template for any deviation from upstream:

- Rationale: Why the deviation exists.
- Scope: Which components/tokens are affected.
- Rollback plan: How to revert when upstream changes.
- Owner: Responsible team or individual.
- Expiry/review date: When to re-evaluate.

## Alignment Stamp (CI-Managed)

This section is updated by CI when drift tests pass:

- Verified at: 2026-01-24T01:28:42Z (local run; CI stamp pending)
- apps-sdk-ui version: ^0.2.1
- Drift suite commit: b85fe78bd5caa86a7bb89a5962c218832316c2ab (working tree)
