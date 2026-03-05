# Onboarding Rollback Runbook

Last updated: 2026-03-05

## Doc requirements

- Audience: Maintainers
- Scope: Recovery actions if onboarding migration degrades outcomes
- Non-scope: Incident response outside onboarding documentation
- Owner: Jamie Scott Craik (@jscraik)
- Review cadence: Weekly during rollout

## Table of Contents

- [Triggers](#triggers)
- [Rollback Steps](#rollback-steps)
- [Validation After Rollback](#validation-after-rollback)

## Triggers

Execute rollback review when either trigger is hit for two consecutive weeks:

- Time-to-first-success degraded by >20% from baseline
- Clarification/support incidents increased by >25% from baseline

## Rollback Steps

1. Re-label command-center as `pilot` in `docs/guides/ONBOARDING_COMMAND_CENTER.md`.
2. Restore prior quick-start prominence in `README.md` and `docs/README.md`.
3. Keep task-route docs published but marked experimental.
4. Open a remediation issue with observed failure points.

## Validation After Rollback

```bash
pnpm onboarding:check
node scripts/check-doc-links.mjs
```

Confirm all onboarding links resolve and old/new paths are clearly labeled.
