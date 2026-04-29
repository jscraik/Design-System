# Round 3 Adversarial Document Review

## Findings (severity-ranked)

### 1) HIGH — Validation-command safety contract is underspecified in the implementation slices, creating a likely spec-plan gap
- Evidence:
  - Spec requires every `validationCommands[]` item to include `blockedByDefault` and `reason` when commands are not safe for the default agent path ([docs/specs/2026-04-28-agent-native-design-system-spec.md:247]( /Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/specs/2026-04-28-agent-native-design-system-spec.md:247 ), [docs/specs/2026-04-28-agent-native-design-system-spec.md:254]( /Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/specs/2026-04-28-agent-native-design-system-spec.md:254 ), [docs/specs/2026-04-28-agent-native-design-system-spec.md:255]( /Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/specs/2026-04-28-agent-native-design-system-spec.md:255 )).
  - Spec also requires mutating/interactive commands to appear only as blocked diagnostic context ([docs/specs/2026-04-28-agent-native-design-system-spec.md:279]( /Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/specs/2026-04-28-agent-native-design-system-spec.md:279 )).
  - Plan tasks/exit criteria for Slice 3 mention `safetyClass` and read-only default commands, but do not explicitly require `blockedByDefault` + `reason` fixture enforcement ([docs/plans/2026-04-28-agent-native-design-system-plan.md:492]( /Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/plans/2026-04-28-agent-native-design-system-plan.md:492 ), [docs/plans/2026-04-28-agent-native-design-system-plan.md:538]( /Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/plans/2026-04-28-agent-native-design-system-plan.md:538 )).
- Why this matters:
  - The plan can pass with only `safetyClass` while silently violating the default-path safety semantics defined in the spec.
- Remediation:
  - Add explicit Slice 3 acceptance/exit language and fixtures that fail when non-read-only commands are missing `blockedByDefault: true` and a non-empty `reason`.

### 2) MEDIUM — Acceptance-to-slice traceability is incomplete for SA36 (routing JSON authority drift detection)
- Evidence:
  - Spec defines SA36: routing JSON is machine authority and drift must be detected without implicit regeneration ([docs/specs/2026-04-28-agent-native-design-system-spec.md:641]( /Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/specs/2026-04-28-agent-native-design-system-spec.md:641 )).
  - Plan Slice 2 does include implementation tasks for drift detection ([docs/plans/2026-04-28-agent-native-design-system-plan.md:385]( /Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/plans/2026-04-28-agent-native-design-system-plan.md:385 )) but SA36 is not listed in the Slice 2 acceptance coverage list ([docs/plans/2026-04-28-agent-native-design-system-plan.md:407]( /Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/plans/2026-04-28-agent-native-design-system-plan.md:407 )).
- Why this matters:
  - The work may get implemented, but the explicit acceptance gate for that requirement is untracked and easier to drop during execution.
- Remediation:
  - Add SA36 to Slice 2 acceptance coverage and include a named validation artifact in Slice 2 validation intent (for example, dedicated drift fixture output).

### 3) MEDIUM — Recovery safety boundary around `nextCommand` is partially specified in plan assertions but not stress-tested against unsafe command classes
- Evidence:
  - Spec forbids recovery payloads from suggesting unsafe command classes in read-only recovery contexts (no server starts/browser launches in read-only recovery suggestions) ([docs/specs/2026-04-28-agent-native-design-system-spec.md:539]( /Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/specs/2026-04-28-agent-native-design-system-spec.md:539 )).
  - Plan requires full error/recovery matrix coverage in Slice 4 ([docs/plans/2026-04-28-agent-native-design-system-plan.md:643]( /Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/plans/2026-04-28-agent-native-design-system-plan.md:643 )), but does not call out negative fixtures for rejecting unsafe `nextCommand` classes.
- Why this matters:
  - Without explicit negative tests, this is vulnerable to regression where recovery hints remain schema-valid but operationally unsafe.
- Remediation:
  - Add explicit negative fixture cases in Slice 4 for `errors[].details.recovery.nextCommand` that must be rejected when command class is mutating/interactive/server-start/browser-launch.

## Coverage notes requested in scope
- Internal consistency (spec vs plan): mostly aligned on `prepare` as the sole public happy-path entrypoint and no public `context` command.
- Linear mapping and slice traceability: JSC-238 to JSC-245 mapping is complete and one-to-one with seven slices.
- Examples, waiver store, routing source, and read-only command posture: directionally consistent; primary concerns are acceptance-level traceability and safety-contract enforceability.

WROTE: artifacts/reviews/round3-adversarial-document-reviewer.md
