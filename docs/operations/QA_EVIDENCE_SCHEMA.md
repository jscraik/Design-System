# QA Evidence Schema

**Owner:** Jamie Scott Craik (@jscraik)  
**Last updated:** 2026-01-24  
**Review cadence:** Every release or monthly (whichever is sooner)

## Purpose

Define the minimum evidence required for design-system changes so CI and reviewers can verify QA gates consistently.

## Evidence Bundle (Required)

Each design-system change must include an evidence bundle with:

- Change summary
- Commands run
- Pass/fail outcomes
- Artifact locations (paths or CI links)
- Exceptions or skips with reason

### Bundle Template

```
Evidence bundle
- Change summary: <1-2 sentences>
- Commands run:
  - <command>
  - <command>
- Outcomes:
  - <command>: pass/fail
- Artifacts:
  - <path or CI link>
- Exceptions:
  - <skipped check + reason>
```

## Required QA Gates

| Gate | Command | When | Required artifact |
| --- | --- | --- | --- |
| Lint | `pnpm lint` | Pre-merge | CLI output or CI log link |
| Policy | `pnpm test:policy` | Pre-merge | CI log link |
| Unit tests | `pnpm test` | Pre-merge | `test-results/` or CI log link |
| Visual regression (web) | `pnpm test:visual:web` | Pre-merge | `playwright-report/` or CI artifact |
| Storybook tests | `pnpm storybook:test` | Pre-merge | CI log link |
| A11y widgets | `pnpm test:a11y:widgets` | Pre-merge | CI log link + a11y report |
| Drift suite | `pnpm test:drift` | Pre-merge and release | `docs/design-system/UPSTREAM_ALIGNMENT.md` stamp |
| Coverage matrix check | `pnpm ds:matrix:check` | Pre-merge | CI log link |

## Storage Locations

- Local artifacts: `test-results/`, `playwright-report/`
- Evidence bundles: `reports/qa/` (recommended) or CI artifacts
- A11y audits: `docs/operations/a11y-audit-template.md`

## Exceptions

If a gate is skipped:

- Document the reason in the evidence bundle
- Record the risk and follow-up action
- Add a target date for the missing evidence

## QA Gate Reliability Expectations

- **Timeouts:** Each gate should fail with a clear timeout if it exceeds expected runtime.
- **Retries:** Allowed only for flaky tests with an issue link; max 1 retry in CI.
- **Degraded mode:** If a non-critical gate is down, document the impact and schedule a follow-up within 7 days.
