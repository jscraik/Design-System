# JSC-208 Testing Review (uncommitted diff vs origin/main)

## Verdict
FAIL - the current test strategy leaves key migration and contract-enforcement paths unprotected.

## Findings (severity-ranked)

### 1) HIGH - M3 migration safety gate is effectively untested in the guidance package
- Evidence:
  - `docs/plans/2026-04-23-agent-design-engine-plan.md:839` requires migration state machine, rollback metadata, and race tests for M3.
  - `packages/design-system-guidance/src/core.ts:920`-`packages/design-system-guidance/src/core.ts:1023` contains the migration state machine and write/rollback behavior.
  - `packages/design-system-guidance/package.json:32`-`packages/design-system-guidance/package.json:37` has no package test script (only build/check/check:ci).
- Why this matters:
  - The highest-risk logic (partial-write staging, resume/rollback transitions, rollback metadata path checks) can regress without direct unit coverage, despite M3 explicitly requiring those protections.
- Practical remediation:
  - Add `packages/design-system-guidance/tests/core.test.mjs` that directly exercises `migrateGuidanceConfig` and `runCheck` for:
    - state transitions (`not-started -> active`, `partial/failed -> resume`, rollback path)
    - rollback metadata unreadable/outside-root rejection
    - partial-write then final-write sequencing behavior
    - scope precedence and exemption-ledger expiration behavior in `runCheck`

### 2) MEDIUM - Critical profile-policy error paths in engine parser are not covered
- Evidence:
  - `packages/agent-design-engine/src/parser.ts:118`-`packages/agent-design-engine/src/parser.ts:133` implements CI override forbiddance and profile error code mapping.
  - `packages/agent-design-engine/tests/engine.test.mjs:15`-`packages/agent-design-engine/tests/engine.test.mjs:45` only exercises happy path + broad invalid contract lint behavior.
- Why this matters:
  - If `E_DESIGN_PROFILE_OVERRIDE_FORBIDDEN`, `E_DESIGN_PROFILE_UNKNOWN`, or `E_DESIGN_PROFILE_UNSUPPORTED` behavior drifts, CLI semantics and CI policy can silently change.
- Practical remediation:
  - Add parser-focused tests asserting exact `code` + `exitCode` for:
    - `ci: true` with `profileOverride`
    - unknown profile name
    - known profile name with unsupported version

### 3) MEDIUM - CLI design discovery/regr-fail controls required by M4 are only partially exercised
- Evidence:
  - `docs/plans/2026-04-23-agent-design-engine-plan.md:840` requires exit-code/output-mode/recovery/profile compatibility coverage for all `astudio design` commands.
  - `packages/cli/src/commands/design.ts:208`-`packages/cli/src/commands/design.ts:241` implements `E_DESIGN_DISCOVERY_REQUIRED` and `E_DESIGN_CONTRACT_AMBIGUOUS` guards.
  - `packages/cli/src/commands/design.ts:562`-`packages/cli/src/commands/design.ts:564` implements `--fail-on-regression` behavior.
  - `packages/cli/tests/cli.test.mjs` has good design-command coverage, but no assertions for the above guards/flag behavior.
- Why this matters:
  - Discovery ambiguity and regression-fail switch behavior are policy-critical in CI and automation; regressions here produce wrong file selection or false-green diff checks.
- Practical remediation:
  - Add focused CLI tests for:
    - CI mode lint/check-brand without `--file/--scope` => `E_DESIGN_DISCOVERY_REQUIRED`
    - two DESIGN.md candidates without explicit scope => `E_DESIGN_CONTRACT_AMBIGUOUS`
    - `design diff --fail-on-regression` returning failure outside CI when regression exists

## Smallest high-value validation commands after adding tests
1. `pnpm -C packages/design-system-guidance type-check`
2. `node --test packages/design-system-guidance/tests/*.test.mjs`
3. `pnpm -C packages/agent-design-engine test`
4. `pnpm -C packages/cli test -- --test-name-pattern "design"`
