# Adversarial Document Review

Scope reviewed:
- `docs/specs/2026-04-28-agent-native-design-system-spec.md`
- `docs/plans/2026-04-28-agent-native-design-system-plan.md`

Depth calibration:
- Size estimate: large (both docs combined are >6,000 words; >20 implementation requirements/units).
- Risk signals present: new command surface, policy hardening, CI gate behavior changes, and new abstraction governance.
- Review mode: Deep.

## Findings (Severity-ranked)

### 1) HIGH - Load-bearing dependency on unstable natural-language need taxonomy is unproven
Evidence:
- Spec requires routing by `need` and makes it central to safety (`...components --need <need>...`, `no route => proposal required`): `docs/specs/2026-04-28-agent-native-design-system-spec.md:183`, `docs/specs/2026-04-28-agent-native-design-system-spec.md:154`, `docs/specs/2026-04-28-agent-native-design-system-spec.md:398`.
- Plan seeds a small v1 need set (`page_shell`, `settings_panel`, `async_collection`, etc.): `docs/plans/2026-04-28-agent-native-design-system-plan.md:254`.
- No falsification criteria define when need labeling is wrong, noisy, or unstable across agents.

Why this is risky:
- The whole model assumes input need labels are canonical enough for deterministic routing. If agent phrasing drifts (`settings`, `preferences panel`, `settings_cluster`), behavior can fall into false proposal-required or wrong route selection.

Consequence if wrong:
- High reversal cost: routing table, fixtures, and remediation logic get optimized around a taxonomy that may later be replaced by intent normalization, creating broad migration churn.

Remediation:
- Add an explicit `need normalization contract` before Slice 2 exit: alias map, canonical enum, and tie-break precedence.
- Add acceptance criteria for normalization behavior (synonym coverage, unknown threshold, deterministic fallback).
- Add a falsification gate: fail if fixture corpus shows >X% unresolved normalized needs for known protected surfaces.

### 2) HIGH - “Read-only command” assumption conflicts with proposal command behavior and invites implementation drift
Evidence:
- Spec describes `propose-abstraction` as command shape but frames it as create-or-validate contract (`docs/specs/...:186`, `docs/specs/...:195`).
- Plan states all `astudio design` commands are read-only in Slice 4 (`docs/plans/...:412`, `docs/plans/...:463`) while Slice 7 permits “read-only validator or scaffold preview” and defers write gates if writing appears (`docs/plans/...:633`, `docs/plans/...:634`).

Why this is risky:
- This is a load-bearing decision boundary (query-only vs. write-capable workflow). Without a hard v1 contract, implementations can diverge silently by package or contributor.

Consequence if wrong:
- Agents could rely on side effects in one environment and fail in CI/other repos where only read-only mode exists.

Remediation:
- Freeze v1 contract now: `propose-abstraction` must be read-only and must output a canonical proposal artifact payload schema, not write files.
- Move any writing behavior to explicit v2 command (`propose-abstraction --write`) with dedicated write gate and separate acceptance IDs.

### 3) HIGH - Fail-closed policy for `prepare` lacks an operational escape hatch for routine unknown-scope surfaces
Evidence:
- Spec requires fail-closed for unknown scope and missing route (`docs/specs/...:403`, `docs/specs/...:407`, `docs/specs/...:505`).
- Plan requires unknown scope diagnostics but does not define execution policy for common repo churn (new files, renamed directories, temporary branches): `docs/plans/...:381`, `docs/plans/...:382`.

Why this is risky:
- Assumes guidance scope config stays perfectly current with file topology. At scale this is rarely true.

Consequence if wrong:
- Agent workflows degrade into proposal/clarification loops for normal development paths, reducing adoption and encouraging bypass of `prepare`.

Remediation:
- Define `unknown-scope triage mode` in spec/plan: classify as non-implementable, but return deterministic scope-resolution suggestions plus nearest matching scope candidates.
- Add acceptance gate for unknown-scope ergonomics: bounded actionable outputs (no open-ended prose), including exactly one suggested next read-only command.

### 4) MEDIUM - Hardening strategy assumes remediation determinism before proving cross-package consistency
Evidence:
- Spec wants warn->error promotion only after route + examples + remediation are ready: `docs/specs/...:173`, `docs/specs/...:399`.
- Plan distributes responsibilities across three packages and docs ownership (`agent-design-engine`, `design-system-guidance`, `cli`): `docs/plans/...:92`, `docs/plans/...:96`, `docs/plans/...:95`.
- No explicit consistency gate validates that replacement instructions produced by guidance match routing decisions emitted by engine/CLI.

Why this is risky:
- Environmental assumption: package outputs remain aligned without a single cross-package contract test.

Consequence if wrong:
- “Deterministic replacement” in guidance can drift from routing truth, producing contradictory machine instructions.

Remediation:
- Add a cross-package golden fixture suite before C5: same input violation must produce identical preferred component/import path in engine route lookup and guidance remediation.
- Add digest pinning between route table version and guidance remediation rulepack version in emitted payload.

### 5) MEDIUM - Gold example rollout defers key safety states while policy depends on them for promotion
Evidence:
- Spec requires broad gold coverage including permission-denied/unavailable and form validation patterns: `docs/specs/...:492`, `docs/specs/...:477`.
- Plan first wave explicitly defers permission-denied/unavailable and form-validation examples: `docs/plans/...:137`.

Why this is risky:
- Decision-scope mismatch: promotion logic depends on examples, but rollout sequencing defers examples tied to common high-friction UI flows.

Consequence if wrong:
- Hardening decisions may be made with incomplete safety evidence, or promotion stalls indefinitely.

Remediation:
- Add an explicit “non-promotable rule families” list until deferred examples land.
- Bind promotion checks to example capability tags, not generic “example exists.”

### 6) MEDIUM - Proposal governance can become ceremonial without decision SLA and acceptance authority
Evidence:
- Spec requires accepted proposal before new abstraction implementation proceeds: `docs/specs/...:167`, `docs/specs/...:124`.
- Plan adds template and policy checks but no explicit authority/SLA/decision lifecycle beyond “accepted proposal”: `docs/plans/...:625`, `docs/plans/...:660`.

Why this is risky:
- Temporal assumption: proposals are reviewed quickly and consistently. Without owner/SLA, proposal-required becomes a queue bottleneck.

Consequence if wrong:
- Teams route around policy with local wrappers or excessive fallback use.

Remediation:
- Add proposal decision contract: required approver role(s), maximum decision latency target, and deterministic stale-state handling.
- Add CLI/probe output field for proposal status (`missing`, `submitted`, `accepted`, `rejected`, `stale`) with timestamps.

### 7) MEDIUM - Determinism claim is strong, but byte-stability assumptions are under-specified for path/digest normalization
Evidence:
- Spec requires stable key order, stable finding order, normalized paths, deterministic digests: `docs/specs/...:499`.
- Plan references this requirement but does not specify canonicalization rules (path separators, symlink resolution, line-ending normalization): `docs/plans/...:300`, `docs/plans/...:168`.

Why this is risky:
- Environmental assumption: local/macOS/Linux differences will not affect digest or ordering outputs.

Consequence if wrong:
- Flaky fixtures and non-reproducible agent decisions across environments.

Remediation:
- Add a canonicalization appendix in Slice 3 entry criteria: path normalization format, JSON canonicalization method, digest input ordering, and line-ending handling.
- Add cross-platform fixture replay test (at least one non-macOS CI runner).

### 8) LOW - Build-vs-use alternative analysis is narrow around existing internal system only
Evidence:
- Spec alternatives compare command boundary styles (A/B/C) but not reuse options beyond current internal surfaces: `docs/specs/...:283`, `docs/specs/...:318`, `docs/specs/...:347`.

Why this is risky:
- Alternative blindness: decision may be path-dependent if external schema/tooling patterns for route registries/proposal workflows were not evaluated.

Consequence if wrong:
- Reinvention of governance mechanisms already solved by existing ecosystem conventions.

Remediation:
- Add a brief pre-Slice-2 “reuse scan” checklist (existing repo or tool patterns) and record explicit rejections in plan appendix.

## Coverage gaps likely to cause planner/agent divergence

- No explicit normalization contract for `need` inputs.
- No explicit global consistency test tying engine route resolution to guidance replacement instructions.
- No explicit proposal decision authority/SLA.
- No explicit cross-platform canonicalization rules for deterministic output guarantees.

## Overall adversarial judgment

The spec and plan are directionally strong and unusually explicit, but the most load-bearing assumptions (need normalization, read-only vs write boundary, deterministic cross-package consistency, and proposal governance latency) remain under-constrained. Without tightening those, implementation can still “pass tests” while producing divergent real-world agent behavior.

WROTE: artifacts/reviews/adversarial-document-reviewer.md
