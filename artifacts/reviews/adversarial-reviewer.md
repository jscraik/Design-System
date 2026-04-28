# Adversarial Review Findings

## Severity: High

### 1) Read-only contract can be bypassed by delegated `validationCommands[]` execution
- Evidence:
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:402` says `prepare` must never run mutating actions.
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:224` and `:497` require emitting `validationCommands[]` tied to root scripts.
  - `docs/plans/2026-04-28-agent-native-design-system-plan.md:475` includes `pnpm agent-design:prepare --surface ...` in validation intent without an explicit contract that emitted commands are read-only.
- Break path:
  - If `prepare` emits script aliases that are not pre-classified for mutability, downstream agents can execute suggested commands under the assumption they are safe/read-only, causing state mutations (build artifacts, regenerated files, server starts, etc.).
- Remediation:
  - Add a required field per emitted command: `safetyClass: read_only|mutating|interactive`.
  - Enforce in tests that `prepare` may emit only `read_only` commands by default.
  - Reject/strip commands whose mutability cannot be proven.

### 2) Proposal-gate grandfathering creates an unbounded policy bypass
- Evidence:
  - `docs/plans/2026-04-28-agent-native-design-system-plan.md:627` and `:661` allow preferred-route promotion without proposal when “explicitly grandfathered.”
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:400` requires new public primitives cannot become recommended without lifecycle, coverage, example, and validation updates.
- Break path:
  - “Grandfathered” can become a permanent bypass class with no expiry, no owner, and no migration obligations, allowing undocumented primitives to become canonical and silently erode contract integrity.
- Remediation:
  - Replace free-form grandfathering with a typed waiver object: owner, justification, expiry, linked issue, and mandatory cleanup milestone.
  - Fail policy when waiver expiry passes or required fields are missing.

### 3) Determinism requirements are under-specified for digest generation
- Evidence:
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:499` requires stable key order and deterministic source digests.
  - `docs/plans/2026-04-28-agent-native-design-system-plan.md:300` requires stable key order in routing JSON.
- Break path:
  - Without canonical normalization rules (line endings, whitespace, JSON canonicalization, path separators, sort order for arrays), digests can vary across OS/toolchains, causing false failures and non-reproducible outputs.
- Remediation:
  - Define canonicalization algorithm in-spec (UTF-8, LF line endings, sorted object keys, stable array sort keys, POSIX-style repo-relative paths).
  - Add cross-platform fixture asserting byte-identical digests for identical semantic input.

## Severity: Medium

### 4) Route/example acceptance criteria conflict causes rollout deadlock
- Evidence:
  - `docs/plans/2026-04-28-agent-native-design-system-plan.md:303` allows route entries with deterministic missing-example diagnostics.
  - `docs/plans/2026-04-28-agent-native-design-system-plan.md:599` requires route entries point only at existing examples.
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:492` requires permission-denied/dense-dashboard/form-validation in gold examples, while `docs/plans/2026-04-28-agent-native-design-system-plan.md:137` explicitly defers some of these.
- Break path:
  - Teams cannot tell whether routes without examples are valid transitional states or failures, leading to either premature blocking or unchecked drift.
- Remediation:
  - Introduce explicit route maturity levels (`provisional`, `enforced`) and bind hard-gate eligibility to maturity + example coverage.
  - Align SA9 with slice deferral by marking deferred examples as phase-2 acceptance criteria.

### 5) Ambiguous command semantics for `propose-abstraction` increases accidental write risk
- Evidence:
  - `docs/plans/2026-04-28-agent-native-design-system-plan.md:633` defines `propose-abstraction` as “read-only validator or scaffold preview in v1.”
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:186` lists it as a command, while other sections emphasize read-only query boundaries.
- Break path:
  - “Scaffold preview” is ambiguous and may be implemented as file scaffolding by one team and non-mutating preview by another, violating read-only guarantees and causing unexpected repo changes in automation lanes.
- Remediation:
  - Split modes explicitly:
    - v1 required: `--validate` (read-only)
    - future gated mode: `--write` (explicit gate + approval)
  - Add parser tests that reject write-like flags in v1.

### 6) Surface classification precedence is referenced but not contract-defined
- Evidence:
  - `docs/plans/2026-04-28-agent-native-design-system-plan.md:342` says classify scope using “guidance scopes and precedence.”
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:145` and `:407` make scope critical for safety decisions.
- Break path:
  - Different implementations can classify the same path differently (e.g., overlapping include/exempt patterns), producing divergent gate behavior and inconsistent auto-implementation safety decisions.
- Remediation:
  - Define deterministic precedence order in spec (e.g., exempt > protected > warn > unknown or the inverse, with tie-break rules).
  - Add fixtures for overlapping-glob cases and ensure consistent output in CLI and engine tests.

## Coverage Gap Notes
- No explicit anti-regression check is specified for preserving existing CLI envelope compatibility across historical fixtures when adding new command kinds.
- No explicit runtime budget/SLO is set for `prepare`; large monorepo scans could degrade agent loops.

WROTE: artifacts/reviews/adversarial-reviewer.md
