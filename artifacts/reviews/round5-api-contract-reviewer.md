# Round 5 API Contract Review

Scope:
- `docs/specs/2026-04-28-agent-native-design-system-spec.md`
- `docs/plans/2026-04-28-agent-native-design-system-plan.md`

## Result
No blocking findings.

## Blocker Verification

1. Proposal-required recovery for need-only callers: resolved.
- Spec defines `propose-abstraction` with optional `--surface` and explicit need-only shape (`--need <need> --json`) in the frozen CLI surface.
  - Evidence: `docs/specs/2026-04-28-agent-native-design-system-spec.md:192-194,597`
- Plan mirrors the same command shape and states `--surface` is optional for deterministic need-only proposal previews.
  - Evidence: `docs/plans/2026-04-28-agent-native-design-system-plan.md:192-195,608-609`

2. `propose-abstraction --need` command shape: resolved.
- Both docs include both forms:
  - `astudio design propose-abstraction --need <need> --surface <path> --json`
  - `astudio design propose-abstraction --need <need> --json`
- Spec and plan consistently define this command as read-only in v1.
  - Evidence: spec `:192-209,491,681`; plan `:192-200,615,879-880`

3. Recovery allowlist and safe `nextCommand`: resolved.
- Spec defines a normative read-only allowlist and explicitly allows proposal-required recovery to omit `--surface` when no trustworthy path exists.
  - Evidence: `docs/specs/2026-04-28-agent-native-design-system-spec.md:578-582,597,690`
- Plan requires fixtures that enforce allowlisted `nextCommand` values and reject unsafe aliases/shell strings/write-capable paths.
  - Evidence: `docs/plans/2026-04-28-agent-native-design-system-plan.md:629-630,693-694`

4. CLI contract consistency and selector behavior: resolved.
- Spec freezes v1 command names/flags and defines XOR selector behavior for `components --need` vs `--surface` with `E_DESIGN_SELECTOR_CONFLICT`.
  - Evidence: `docs/specs/2026-04-28-agent-native-design-system-spec.md:183-203,551,684`
- Plan carries the same freeze/XOR/error expectations and verification fixtures.
  - Evidence: `docs/plans/2026-04-28-agent-native-design-system-plan.md:180-182,202-207,622-623,681`

5. Legacy/new coexistence under one envelope: resolved.
- Spec requires legacy `astudio design` kinds to remain valid while additive agent-native kinds coexist under `astudio.command.v1`, with `*.v2` required for breaks.
  - Evidence: `docs/specs/2026-04-28-agent-native-design-system-spec.md:217-243,689`
- Plan repeats this compatibility contract and validation matrix expectations.
  - Evidence: `docs/plans/2026-04-28-agent-native-design-system-plan.md:184-190,298,619`

## Residual Risks (Non-blocking)
- Contract safety depends on fixture completeness (allowlist negatives, read-only write-deny, and legacy/new coexistence runs) being implemented exactly as specified.
- Read-only semantics for `propose-abstraction` still need robust mutation-attempt tests across failure/retry branches to prevent accidental write path regressions.

WROTE: artifacts/reviews/round5-api-contract-reviewer.md
