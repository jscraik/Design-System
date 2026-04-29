# Round 4 API Contract Review

Scope reviewed:
- `docs/specs/2026-04-28-agent-native-design-system-spec.md`
- `docs/plans/2026-04-28-agent-native-design-system-plan.md`
- Existing CLI contract truth in `packages/cli/src/commands/design.ts` and `packages/cli/tests/fixtures/design-schemas/astudio-design-command.v1.schema.json`

## Blocking findings

### 1) `E_DESIGN_PROPOSAL_REQUIRED` recovery can require an impossible `nextCommand` shape
Severity: High

Evidence:
- Spec requires `propose-abstraction` to take both `--need` and `--surface` (`docs/specs/2026-04-28-agent-native-design-system-spec.md:192`, `:384`, `:579`).
- Spec also allows `E_DESIGN_PROPOSAL_REQUIRED` to be emitted from unknown-need paths (`docs/specs/2026-04-28-agent-native-design-system-spec.md:338`, `:550`, `:594`).
- Plan keeps the same required flags and recovery allowlist (`docs/plans/2026-04-28-agent-native-design-system-plan.md:601`, `:621-622`, `:685-686`).

Why this is a blocker:
- For need-only callers (for example `astudio design components --need <need> --json`), recovery may not have a trustworthy surface path.
- The current contract can force an unavailable `nextCommand` (requires `--surface`) or tempt placeholder values, which breaks deterministic recovery semantics.

Required fix before implementation:
- Define one deterministic fallback for proposal-required recovery when `surface` is unknown:
  1. allow read-only `propose-abstraction --need <need> --json` in v1, or
  2. keep current CLI but forbid `nextCommand` for this case and require structured fields only (`allowed: false` + reason + template path), or
  3. require `surface` on the triggering query path whenever proposal preview recovery is expected.
- Update both spec and plan so recovery matrix, allowlist, and command signatures cannot disagree at runtime.

## Residual risks (non-blocking)

- Legacy/new coexistence is specified well, but implementation must enforce it with schema+fixture parity so new kinds do not regress existing kinds (`lint/diff/export/check-brand/init/migrate/doctor`) under the same `astudio.command.v1` envelope (`docs/specs/2026-04-28-agent-native-design-system-spec.md:230-241`, `:686-687`; `docs/plans/2026-04-28-agent-native-design-system-plan.md:611-613`, `:678-680`).
- Recovery allowlist/safety classes are clear in docs; risk is drift unless negative fixtures explicitly reject shell strings, root aliases, server-start, browser-launch, and write-capable commands (`docs/specs/2026-04-28-agent-native-design-system-spec.md:575-581`, `:682`, `:687`; `docs/plans/2026-04-28-agent-native-design-system-plan.md:621-623`, `:683-686`).

WROTE: artifacts/reviews/round4-api-contract-reviewer.md
