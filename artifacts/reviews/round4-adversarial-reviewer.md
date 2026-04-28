# Round 4 Adversarial Review (Blockers Only)

## Blocking findings

### 1) Acceptance criterion SA11 is internally inconsistent and currently untestable
- Severity: High
- Evidence:
  - Spec states SA11 requires lifecycle/coverage queries to answer "by component name and surface path" ([docs/specs/2026-04-28-agent-native-design-system-spec.md:658](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/specs/2026-04-28-agent-native-design-system-spec.md:658)).
  - SA11 verification only lists `components --need`, `components --surface`, and `coverage --component` (no `coverage --surface`) ([docs/specs/2026-04-28-agent-native-design-system-spec.md:658](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/specs/2026-04-28-agent-native-design-system-spec.md:658)).
  - CLI shape defines `coverage --component` only ([docs/specs/2026-04-28-agent-native-design-system-spec.md:190](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/specs/2026-04-28-agent-native-design-system-spec.md:190), [docs/specs/2026-04-28-agent-native-design-system-spec.md:191](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/specs/2026-04-28-agent-native-design-system-spec.md:191), [docs/plans/2026-04-28-agent-native-design-system-plan.md:600](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/plans/2026-04-28-agent-native-design-system-plan.md:600)).
- Why this blocks: Teams cannot determine pass/fail for SA11 without inventing extra behavior or relaxing the requirement ad hoc.
- Required fix:
  - Either change SA11 wording to "coverage by component and routing by surface".
  - Or add an explicit `coverage --surface <path>` command and fixtures in both spec and plan.

### 2) SA14 conflicts with command contract and will force brittle/non-canonical test behavior
- Severity: High
- Evidence:
  - SA14 requires emitted `validationCommands` to match root `package.json` scripts ([docs/specs/2026-04-28-agent-native-design-system-spec.md:661](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/specs/2026-04-28-agent-native-design-system-spec.md:661)).
  - The normative recovery/command allowlist in spec uses direct CLI commands (`astudio design ...`) rather than package scripts ([docs/specs/2026-04-28-agent-native-design-system-spec.md:577](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/specs/2026-04-28-agent-native-design-system-spec.md:577), [docs/specs/2026-04-28-agent-native-design-system-spec.md:578](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/specs/2026-04-28-agent-native-design-system-spec.md:578)).
  - Plan only adds a root script alias for the happy path (`agent-design:prepare`), not for all validation/recovery commands ([docs/plans/2026-04-28-agent-native-design-system-plan.md:624](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/plans/2026-04-28-agent-native-design-system-plan.md:624)).
- Why this blocks: SA14 either fails legitimate command outputs that are canonical CLI commands, or forces broad script alias proliferation that diverges from the stated CLI-first contract.
- Required fix:
  - Redefine SA14 to require: "commands are canonical, deterministic, and optionally map to package scripts via `packageScript` when applicable".
  - Keep script-key assertions only for commands that actually declare `packageScript`.

## Residual risks (non-blocking)
- Runtime budget assertions (SA33) may be CI-noisy unless fixture hardware variance bounds are codified and enforced consistently.
- The routing JSON vs markdown drift checks are strong, but long-term ownership discipline still depends on preventing ad hoc edits outside the route schema path.

WROTE: artifacts/reviews/round4-adversarial-reviewer.md
