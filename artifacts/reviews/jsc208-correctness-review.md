# JSC-208 Correctness Review

## High

1. `design doctor` always reports success and hardcodes `mode: "legacy"`, so it cannot surface invalid migration/config states and returns exit `0` even when state is broken.
- Evidence: `packages/cli/src/commands/design.ts:678` (hardcoded mode), `packages/cli/src/commands/design.ts:686` (always emits success), `packages/cli/src/commands/design.ts:687` (always returns success exit code).
- Why this is correctness-impacting: automation and CI callers will treat unhealthy migration/config states as healthy.
- Remediation: wire `doctor` to guidance/migration state inspection, map unhealthy states to deterministic error codes and required non-zero exits per plan.

2. `design check-brand` is effectively non-functional because `ok` compares `resolvedProfile` to the same source used to compute it, so valid inputs always pass and `--strict` cannot detect mismatches.
- Evidence: `packages/cli/src/commands/design.ts:567` (profile override passed into parse), `packages/cli/src/commands/design.ts:570` (`ok` computed as `resolvedProfile === (argv.profile ?? brandProfile)`).
- Why this is correctness-impacting: profile drift cannot be detected; policy enforcement path silently degrades.
- Remediation: compare resolved profile against an independently resolved expected profile source (frontmatter/manifest default/explicit target), and emit findings when they differ.

3. `design diff` ignores CI regression-fail behavior from the command contract and only fails when `--fail-on-regression` is set.
- Evidence: `packages/cli/src/commands/design.ts:524` (failure gated only on `argv.failOnRegression`), `packages/cli/src/commands/design.ts:525-526` (otherwise exits success).
- Why this is correctness-impacting: CI can pass despite detected regressions, violating plan-defined blocking behavior.
- Remediation: include CI mode in fail condition (for example, `if ((CI || --fail-on-regression) && hasRegression) exit 1`).

## Medium

4. `design export` does not run semantic lint before exporting, so semantically invalid contracts can still produce artifacts.
- Evidence: `packages/cli/src/commands/design.ts:538-543` (parse + export only, no lint/finding gate).
- Why this is correctness-impacting: downstream consumers receive artifacts that should have been rejected by semantic policy.
- Remediation: run lint before export and fail with `E_DESIGN_SEMANTIC_FINDING` / exit `1` when error findings exist.

5. `design init` overwrite collision is mapped to generic internal failure instead of deterministic overwrite/policy refusal.
- Evidence: `packages/cli/src/commands/design.ts:600-603` (`writeFile(..., flag: "wx")` can throw EEXIST), `packages/cli/src/commands/design.ts:400-407` + `packages/cli/src/commands/design.ts:121-124` (falls into normalized internal error mapping).
- Why this is correctness-impacting: machine callers cannot reliably branch on expected policy/overwrite error semantics.
- Remediation: catch EEXIST explicitly and emit a deterministic policy/refusal code and exit (`3`) with actionable hint.

6. Design-command error payloads do not include the required `recovery` object contract, so machine consumers expecting structured recovery metadata cannot parse contract-compliant errors.
- Evidence: `packages/cli/src/types.ts:57-64` (`JsonError` has no `recovery` field), `packages/cli/src/index.ts:405-409` (error object construction omits recovery structure).
- Why this is correctness-impacting: contract consumers that depend on deterministic remediation metadata will break or need special-case handling.
- Remediation: extend `JsonError` with structured `recovery` and populate it on all design command error paths.

7. CI detection in design command paths uses `Boolean(process.env.CI)`, so `CI=false` is treated as CI-enabled and can trigger unintended policy behavior.
- Evidence: `packages/cli/src/commands/design.ts:93` (`shouldEmitJson`), `packages/cli/src/commands/design.ts:97` (`assertDesignOutputMode`), `packages/cli/src/commands/design.ts:202` (discovery requirement gate), `packages/cli/src/commands/design.ts:486` and `packages/cli/src/commands/design.ts:568` (CI passed into engine/parser).
- Why this is correctness-impacting: local runs can be forced into CI-mode constraints and fail unexpectedly when CI env is set to the string `false`.
- Remediation: normalize CI with explicit string check (`typeof CI === "string" && CI.toLowerCase() !== "false" && CI.length > 0`).

## Residual Risk

- Existing tests cover many happy-path and some failure-path behaviors, but there is no assertion for CI-driven `design diff` failure semantics, no failing-path assertion for `check-brand --strict` mismatch behavior, and no assertion that design error payloads include structured `recovery` metadata.

WROTE: artifacts/reviews/jsc208-correctness-review.md
