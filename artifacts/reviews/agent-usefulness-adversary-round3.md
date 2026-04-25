# Agent Usefulness Adversarial Review (Round 3)

## Findings

### HIGH: Contract-resolving payload invariants are internally contradictory for `doctor`, `init`, and `migrate`
- Evidence: `docs/plans/2026-04-23-agent-design-engine-plan.md:265` says every contract-resolving command JSON result must include `resolvedProfile`, `profileSource`, `profileVersion`, `ruleManifestVersion`, `rulePackVersion`, and `ruleSourceDigests`.
- Evidence: `docs/plans/2026-04-23-agent-design-engine-plan.md:455`, `:456`, and `:457` define per-command payloads for `init`, `migrate`, and `doctor` that omit those fields.
- Why this breaks agents: machine callers cannot reliably depend on one deterministic payload contract across design commands, so profile inheritance and rule provenance become command-dependent guesswork.
- Remediation: define one explicit applicability matrix for the “singular contract fields” (required/nullable/omitted per command + per phase), then align the per-command table and gate checks to that matrix.

### HIGH: `diff` findings have no required rule-manifest provenance
- Evidence: `docs/plans/2026-04-23-agent-design-engine-plan.md:440` and `:452` exempt `diff` from singular contract fields and only require `before/after` schema + `brandProfileDelta`, `findings`, and `diff`.
- Evidence: plan requires machine-checkable professional UI rules and source provenance elsewhere (`:163`, `:175`, `:177-180`), but `diff` has no required `ruleManifestVersion`, `rulePackVersion`, or `ruleSourceDigests` fields.
- Why this breaks agents: agents cannot determine whether a regression delta came from content changes or a changed rule pack/manifest, making automated triage and replay nondeterministic.
- Remediation: require `beforeRuleManifestVersion`, `afterRuleManifestVersion`, `beforeRulePackVersion`, `afterRulePackVersion`, and dual source digests (or an explicit `ruleContextDelta`) in `astudio.design.diff.v1`.

### MEDIUM: Recovery payload is required but lacks a machine-safe command schema
- Evidence: `docs/plans/2026-04-23-agent-design-engine-plan.md:441-445` requires `recovery.nextCommand` in deterministic retry cases, but does not define whether it is shell text, argv array, or structured command object.
- Why this breaks agents: command execution can diverge across shells/OS quoting rules and wrappers, so two agents may execute different actions from the same recovery payload.
- Remediation: define `recovery.nextCommand` as a structured object (for example `{ "argv": ["astudio", "design", ...], "cwd": "...", "env": {...optional...} }`) and explicitly forbid shell-interpreted free text in machine mode.

## Residual Risk
- Even after these fixes, deterministic behavior still depends on byte-level fixture enforcement for both normal and failure paths; keep Gate 4 protocol tests as hard blockers.

WROTE: artifacts/reviews/agent-usefulness-adversary-round3.md
