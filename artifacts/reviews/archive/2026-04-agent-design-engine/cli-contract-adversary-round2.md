# CLI Contract Adversary Review (Round 2)

## P0 - Agent/CI output-mode contract is self-contradictory
- Impact: The plan defines two mutually exclusive behaviors for `astudio design` in agent/CI mode, so implementers cannot produce deterministic behavior. One implementation path silently defaults to JSON, the other hard-fails with `E_POLICY` for the same caller input. This will cause flaky automation and incompatible client expectations.
- Evidence:
  - `docs/plans/2026-04-23-agent-design-engine-plan.md:446` says `--agent` and CI mode must default to `--json` for `astudio design` unless `--plain` is explicitly selected.
  - `docs/plans/2026-04-23-agent-design-engine-plan.md:447` says machine callers omitting `--json` or `--plain` must receive `E_POLICY` refusal in `--agent`/CI mode.
- Minimal fix: Pick one policy and delete the other. Recommended: keep default-to-JSON in agent/CI mode and reserve `E_POLICY` for explicitly incompatible mode combinations.
- Confidence: High

## P1 - Manifest gate scope can accidentally brick non-design commands
- Impact: The plan states startup must fail closed on missing/invalid manifest before command dispatch, but later says manifest command-schema gating is only for `astudio design *`. If implemented literally at process startup, all existing non-design commands can fail with exit `3`, causing immediate CLI regression.
- Evidence:
  - `docs/plans/2026-04-23-agent-design-engine-plan.md:585` requires startup manifest validation before command dispatch and fail-closed behavior.
  - `docs/plans/2026-04-23-agent-design-engine-plan.md:587` narrows command-schema gating to `astudio design *` only.
  - Existing CLI surface includes many non-design commands in `packages/cli/src/index.ts:230`, `packages/cli/src/index.ts:290`, `packages/cli/src/index.ts:299`, `packages/cli/src/index.ts:314`, `packages/cli/src/index.ts:352`, `packages/cli/src/index.ts:375`.
- Minimal fix: Make manifest loading/checking lazy and conditional on resolved top-level command being `design`; explicitly state that non-design commands bypass manifest validation in v1.
- Confidence: High

## P1 - Recovery payload requirements are stricter than the current error model and will force fabricated fixes
- Impact: The plan currently requires `fix_suggestion` for every non-success and `nextCommand` for policy/safety refusals. Current envelope/error model cannot represent `nextCommand`, and many errors do not have a deterministic safe retry command. If enforced as written, implementations may emit misleading recovery instructions.
- Evidence:
  - `docs/plans/2026-04-23-agent-design-engine-plan.md:419` requires `fix_suggestion` on every non-success.
  - `docs/plans/2026-04-23-agent-design-engine-plan.md:420` requires `nextCommand` for policy/safety refusals.
  - Current JSON error type in `packages/cli/src/types.ts:57`-`packages/cli/src/types.ts:64` has optional `fix_suggestion` but no `nextCommand` field.
  - Current serialization in `packages/cli/src/error.ts:54`-`packages/cli/src/error.ts:61` does not emit `fix_suggestion` by default.
  - Current fix suggestion generation is narrow and policy-message based in `packages/cli/src/index.ts:157`-`packages/cli/src/index.ts:184`.
- Minimal fix: Change contract to `fix_suggestion`/`nextCommand` required only when deterministic; otherwise require explicit `recoveryUnavailableReason`. Add a typed recovery object for design-command errors to avoid overloading base `JsonError`.
- Confidence: High

## Residual risks
- `meta.outputMode` requirement appears only in plan text and not in current envelope type (`packages/cli/src/types.ts:66`-`packages/cli/src/types.ts:75`), so implementation work still needs a compatibility decision on where to enforce it and how to test it.
