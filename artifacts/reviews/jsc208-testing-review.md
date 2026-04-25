# JSC-208 Testing Review

## Scope
- Compared uncommitted JSC-208 changes against `docs/plans/2026-04-23-agent-design-engine-plan.md` with a testing-strategy lens.
- Read-only review: no source edits made.

## Prioritized Findings

### 1) High: Compatibility-manifest and recovery-path requirements are not protected by tests
- Plan requires pre-handler compatibility-manifest gating for `astudio design *` plus explicit recovery exceptions (`doctor`, rollback dry-run): `docs/plans/2026-04-23-agent-design-engine-plan.md:626`, `docs/plans/2026-04-23-agent-design-engine-plan.md:628`, `docs/plans/2026-04-23-agent-design-engine-plan.md:633`, `docs/plans/2026-04-23-agent-design-engine-plan.md:635`, `docs/plans/2026-04-23-agent-design-engine-plan.md:932`, `docs/plans/2026-04-23-agent-design-engine-plan.md:933`.
- Current CLI design command path does not load a compatibility manifest before handler dispatch; schema gating is a static in-memory allowlist in `emitDesign(...)`: `packages/cli/src/commands/design.ts:23`, `packages/cli/src/commands/design.ts:127`, `packages/cli/src/commands/design.ts:471`.
- Current tests cover happy-path envelopes and selected migration errors, but no manifest-missing/corrupt/startup-gating scenarios: `packages/cli/tests/cli.test.mjs:108`, `packages/cli/tests/cli.test.mjs:146`, `packages/cli/tests/cli.test.mjs:252`.
- Risk: a regression in manifest handling or command-schema compatibility can ship without detection, despite Gate 4 requiring these checks.
- Remediation suggestion: add fixture-driven tests for (a) missing manifest, (b) corrupt manifest, (c) unsupported command schema, and (d) allowed read-only recovery behavior for `doctor` and rollback dry-run.

### 2) High: Migration/rollback state-machine safety is largely untested at package level
- Plan requires full migration transition-table coverage, unreadable metadata fail-closed semantics, rollback metadata authenticity/path/checksum checks, idempotence, and race tests: `docs/plans/2026-04-23-agent-design-engine-plan.md:910` through `docs/plans/2026-04-23-agent-design-engine-plan.md:919`.
- Migration logic in guidance package is substantial and stateful (`migrateGuidanceConfig`, partial marker writes, rollback path checks): `packages/design-system-guidance/src/core.ts:920`, `packages/design-system-guidance/src/core.ts:1002`, `packages/design-system-guidance/src/core.ts:1010`, `packages/design-system-guidance/src/core.ts:840`.
- The package has no test script at all (`build/type-check/check/check:ci` only), so these behaviors are not directly protected by unit/integration tests: `packages/design-system-guidance/package.json:9`.
- Risk: regressions in migration safety and rollback semantics can pass current gates unless surfaced indirectly through CLI smoke tests.
- Remediation suggestion: add a dedicated `test` script and fixture suite in `packages/design-system-guidance` covering full state table, metadata validation, repeated rollback/resume idempotence, and concurrent-writer behavior.

### 3) Medium: Discovery ambiguity and CI discovery requirements are under-covered
- Plan requires deterministic CI discovery failures and ambiguity handling: `docs/plans/2026-04-23-agent-design-engine-plan.md:261`, `docs/plans/2026-04-23-agent-design-engine-plan.md:264`, `docs/plans/2026-04-23-agent-design-engine-plan.md:934`.
- Discovery logic implements these branches in code: `packages/cli/src/commands/design.ts:202`, `packages/cli/src/commands/design.ts:220`, `packages/cli/src/commands/design.ts:229`.
- Tests currently validate successful `--file` and `--scope root` paths, but not CI-without-scope/file nor multi-candidate ambiguity: `packages/cli/tests/cli.test.mjs:130`, `packages/cli/tests/cli.test.mjs:169`, `packages/cli/tests/cli.test.mjs:189`.
- Risk: agents in monorepo CI can resolve wrong contracts or get non-deterministic behavior without test catch.
- Remediation suggestion: add temp-repo tests that create nested `DESIGN.md` files and assert exact error codes for CI missing selectors and ambiguous discovery.

### 4) Medium: Gate 4 protocol-level assertions remain partial
- Plan requires byte-level JSON protocol assertions (single object stdout, stderr empty on non-diagnostic runs), output-mode defaults in CI/agent mode, and deterministic error/recovery payload mapping: `docs/plans/2026-04-23-agent-design-engine-plan.md:936` through `docs/plans/2026-04-23-agent-design-engine-plan.md:940`.
- Some tests assert one-line stdout and empty stderr for selected success paths: `packages/cli/tests/cli.test.mjs:181`, `packages/cli/tests/cli.test.mjs:199`.
- There are no explicit tests for omitted output mode in CI/agent defaults, explicit incompatible mode combinations on design commands, or structured `recovery.nextCommand` semantics for design failures.
- Risk: machine-parsing regressions can slip in while green tests still report success.
- Remediation suggestion: add protocol fixtures and command-matrix tests for output-mode defaulting and recovery-payload contracts.

### 5) Low: CLI test entrypoint is narrowly scoped versus expanded command surface
- CLI package test script runs only `tests/cli.test.mjs`: `packages/cli/package.json:14`.
- Additional test files exist (`mask`, `trace`, `agent`, `help`) but are not part of this package test command, reducing accidental regression detection breadth during this lane.
- Risk: unrelated CLI envelope/error-path regressions can be missed when validating this feature set.
- Remediation suggestion: broaden `packages/cli` test script to `node --test tests/*.test.mjs` or equivalent stable manifest.

## Validation Commands Run (Read-only)

### Passing
- `pnpm -C packages/agent-design-engine test`
  - outcome: pass (`4/4` tests).
- `pnpm -C packages/cli test`
  - outcome: pass (`20/20` tests).
- `pnpm -C packages/cli build`
  - outcome: pass.
- `pnpm -C packages/design-system-guidance check:ci`
  - outcome: pass with warnings; exit `0`.
- `pnpm validate:tokens`
  - outcome: pass.

### Failing / Likely blocker in this environment
- `pnpm ds:matrix:check`
  - outcome: fail with `Error: listen EPERM: operation not permitted /tmp/tsx-501/9491.pipe` from `pnpm exec tsx ...`; exit `1`.
- `pnpm test:policy`
  - outcome: fail due policy sub-check failures driven by the same `pnpm exec tsx` EPERM failure path in token-truth/coverage checks.

## Overall Verdict
- Current tests prove baseline command wiring for JSC-208 but do not yet protect several high-risk behaviors explicitly required by Gate 3/Gate 4 in the plan (especially compatibility-manifest gating/recovery and migration-state-machine safety).
- Release-readiness confidence is medium-low until those missing cases are fixture-tested.

WROTE: artifacts/reviews/jsc208-testing-review.md
