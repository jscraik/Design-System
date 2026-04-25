# CLI Contract Adversarial Review

## P0 - Exit-code determinism will break if design commands reuse existing run helpers
- Impact: The plan mandates deterministic semantic classes (`E_EXEC`/runtime => exit `1`) but the current CLI plumbing returns the child process exit code verbatim. Any design command wired through `handleRun` can leak child exits like `2`, `3`, or `130`, causing automation to misclassify failures as usage/policy/abort and making the new contract unreliable.
- Evidence:
  - Plan deterministic mapping and precedence: `docs/plans/2026-04-23-agent-design-engine-plan.md:264`, `docs/plans/2026-04-23-agent-design-engine-plan.md:273`, `docs/plans/2026-04-23-agent-design-engine-plan.md:294`
  - Current helper returns raw child code: `packages/cli/src/utils/exec.ts:57`, `packages/cli/src/utils/exec.ts:172`
  - Current JSON error code says `E_EXEC` while process exit can still be non-`1`: `packages/cli/src/utils/exec.ts:116`, `packages/cli/src/utils/exec.ts:119`
- Minimal fix: Introduce a dedicated exit-mapping layer for design commands (or a generalized mapper in `handleRun`) that converts raw child exits into the contract classes before returning/serializing.
- Confidence: High

## P1 - Compatibility-manifest pre-handler gate is scoped ambiguously and can brick existing commands
- Impact: The plan requires pre-handler rejection based on `data.kind` manifest membership before any handler runs. In the live CLI, standard command envelopes do not emit `data.kind`, so a global implementation of this gate would reject legacy commands or force a breaking refactor of all command payloads.
- Evidence:
  - Pre-handler gate requirement: `docs/plans/2026-04-23-agent-design-engine-plan.md:495`
  - Post-run assertion requirement: `docs/plans/2026-04-23-agent-design-engine-plan.md:497`
  - Current run envelope payload lacks `data.kind`: `packages/cli/src/utils/exec.ts:99`
  - Current doctor envelope payload lacks `data.kind`: `packages/cli/src/utils/health.ts:81`
- Minimal fix: Scope manifest gating explicitly to `astudio design *` only in v1, or first add versioned `data.kind` to all existing command payloads and stage migration with compatibility tests.
- Confidence: High

## P1 - Internal plan contradiction on validation exit class creates non-deterministic implementation target
- Impact: The plan says schema/validation failures map to exit `2`, but the command matrix sets `export` validation failure to exit `1`. That contradiction makes compliance tests impossible to write unambiguously and guarantees drift between implementation and docs.
- Evidence:
  - Global mapping says schema validation failure => `2`: `docs/plans/2026-04-23-agent-design-engine-plan.md:265`
  - `export` row says validation failure => `1`: `docs/plans/2026-04-23-agent-design-engine-plan.md:241`
- Minimal fix: Normalize all validation/input/schema failures to exit `2` in both the matrix and deterministic mapping section; reserve exit `1` for semantic/runtime/execution failures only.
- Confidence: High

Residual risks:
- `design doctor` introduces `--active --exec` semantics not present in current command parser, so parser-level validation details (usage vs policy) remain underspecified until concrete yargs wiring and tests are added.

WROTE: artifacts/reviews/cli-contract-adversary.md
