# CLI Protocol Testing Review (Live)

Scope: `packages/cli/src/commands/design.ts` and `packages/cli/tests/cli.test.mjs`, evaluated against Gate 4 in `docs/plans/2026-04-23-agent-design-engine-plan.md`.

## Findings

### 1) High: Gate 4 exit-code matrix is effectively untested for `astudio design` commands
- Evidence:
  - Gate 4 requires exit-code matrix coverage: `docs/plans/2026-04-23-agent-design-engine-plan.md:927`
  - Existing design tests cover only one success path (`lint`) and one policy path (`init` without `--write`): `packages/cli/tests/cli.test.mjs:53`, `packages/cli/tests/cli.test.mjs:64`
  - Command handlers define many distinct exit branches with no direct assertions (for example `diff` regression/fail-on-regression, `check-brand --strict`, CI discovery requirements, ambiguous discovery): `packages/cli/src/commands/design.ts:304`, `packages/cli/src/commands/design.ts:359`, `packages/cli/src/commands/design.ts:157`, `packages/cli/src/commands/design.ts:186`
- Why this matters:
  - A regression in non-happy-path status-to-exit mapping can ship undetected while tests still pass.
- Repro command:
  - `zsh -lc 'rg -n "^test\\(" packages/cli/tests/cli.test.mjs && rg -n "return .*EXIT_CODES|E_DESIGN_" packages/cli/src/commands/design.ts'`
- Minimal test/fix suggestion:
  - Add table-driven per-command cases asserting `code`, `payload.status`, and `payload.errors[0].code` for required Gate 4 error classes.

### 2) High: Required error-recovery contract is not asserted
- Evidence:
  - Gate 4 requires every error-status result to include `hint` and `recovery`, structured `nextCommand`, and `recoveryUnavailableReason` when needed: `docs/plans/2026-04-23-agent-design-engine-plan.md:930`
  - Failure payload rules require deterministic recovery fields and forbid shell-string retries in JSON mode: `docs/plans/2026-04-23-agent-design-engine-plan.md:443`, `docs/plans/2026-04-23-agent-design-engine-plan.md:446`
  - Existing tests only assert `errors[0].code` for policy failure, with no `hint`/`recovery` checks: `packages/cli/tests/cli.test.mjs:45`, `packages/cli/tests/cli.test.mjs:69`
- Why this matters:
  - Agent consumers can break if retries/remediation are omitted or returned as unsafe shell strings.
- Repro command:
  - `zsh -lc 'rg -n "errors\\[0\\]\\.code|hint|recovery|nextCommand" packages/cli/tests/cli.test.mjs'`
- Minimal test/fix suggestion:
  - Add explicit JSON-shape assertions for error payloads, including `hint`, `recovery.fix_suggestion`, structured `recovery.nextCommand`, and `recoveryUnavailableReason`.

### 3) Medium: Required design envelope fields are under-asserted
- Evidence:
  - Plan requires `data.kind`, `data.command`, and `data.exitCode` for design commands: `docs/plans/2026-04-23-agent-design-engine-plan.md:439`
  - Gate 4 requires per-command JSON schema fixtures: `docs/plans/2026-04-23-agent-design-engine-plan.md:926`
  - Current design assertions check only `schema`, `data.kind`, `data.ok`, and one provenance field: `packages/cli/tests/cli.test.mjs:58`, `packages/cli/tests/cli.test.mjs:61`
- Why this matters:
  - Envelope drift can silently break downstream parsers expecting stable protocol keys.
- Repro command:
  - `zsh -lc 'rg -n "data\\.kind|data\\.command|data\\.exitCode|schema fixtures" packages/cli/tests/cli.test.mjs docs/plans/2026-04-23-agent-design-engine-plan.md'`
- Minimal test/fix suggestion:
  - Introduce strict per-command JSON fixture validation for `lint`, `diff`, `export`, `check-brand`, `init`, `migrate`, and `doctor`.

### 4) Medium: Compatibility-manifest and CI discovery gates are unverified
- Evidence:
  - Gate 4 requires compatibility-manifest gating and deterministic CI discovery failure behavior: `docs/plans/2026-04-23-agent-design-engine-plan.md:932`, `docs/plans/2026-04-23-agent-design-engine-plan.md:934`
  - `resolveDesignContract` implements CI-only `E_DESIGN_DISCOVERY_REQUIRED` logic with no direct test: `packages/cli/src/commands/design.ts:157`
  - No manifest-gating or CI-discovery assertions are present in this CLI test file: `packages/cli/tests/cli.test.mjs:1`
- Why this matters:
  - Fail-closed startup behavior can regress without detection and surface only in CI/automation.
- Repro command:
  - `zsh -lc 'rg -n "DISCOVERY_REQUIRED|manifest|CI" packages/cli/tests -g"*.mjs"'`
- Minimal test/fix suggestion:
  - Add env-scoped tests (`CI=1`) for discovery requirements plus fixtures for missing/corrupt manifest fail-closed behavior.

## Coverage Summary
- Current design-test surface is too narrow to protect Gate 4 protocol guarantees. It validates one happy path and one policy refusal, but leaves major command, envelope, and recovery contracts unguarded.

WROTE: artifacts/reviews/cli-protocol-testing-live.md
