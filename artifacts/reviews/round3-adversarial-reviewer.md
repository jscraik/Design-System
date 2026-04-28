# Round 3 Adversarial Review

## High

### 1) Missing-route failure taxonomy is internally conflicting and can produce non-deterministic client handling
- Evidence:
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:519` defines `E_DESIGN_ROUTE_MISSING` for no route.
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:523` defines `E_DESIGN_PROPOSAL_REQUIRED` for abstraction-needed flow.
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:613` expects SA4 for unknown need as `E_DESIGN_PROPOSAL_REQUIRED`.
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:633` requires distinct recovery for missing route vs proposal-required.
- Breakage path: two error codes describe the same trigger class (route absent), while acceptance requires distinct recovery classes. Implementers across engine/CLI can diverge on which code to emit for identical input, breaking fixture parity and downstream automation branching.
- Remediation: define one canonical mapping table in spec text: either (a) unknown need/surface route miss always emits `E_DESIGN_PROPOSAL_REQUIRED` and reserve `E_DESIGN_ROUTE_MISSING` for internal diagnostics only, or (b) keep both but add strict trigger boundaries and required discriminator fields for each.

### 2) Machine-authority decision conflicts with acceptance language that still allows generated routing source
- Evidence:
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:303-309` declares `AGENT_UI_ROUTING.json` as authored checked-in source and not generated in v1.
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:612` says verification may use a "generated or checked-in routing table".
  - `docs/plans/2026-04-28-agent-native-design-system-plan.md:440-442` says commands do not regenerate routing JSON implicitly and drift must fail.
- Breakage path: SA3 allows generated-table interpretation that directly contradicts the authored-source contract. A team can pass SA3 while reintroducing generator ownership drift the plan is explicitly trying to prevent.
- Remediation: update SA3 wording to require checked-in authored routing JSON as the source of truth; allow generated artifacts only as derived validation outputs that cannot be consumed as runtime authority.

### 3) Recovery schema permits unsafe UX suggestions despite read-only contract intent
- Evidence:
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:542-544` bans `nextCommand` suggestions for mutating/interactive/server-start/browser-launch classes.
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:550-555` still allows `nextCommand` for some failures when read-only.
  - `docs/plans/2026-04-28-agent-native-design-system-plan.md:656-657` relies on negative fixtures to reject unsafe next commands.
- Breakage path: no normative allowlist of exact command IDs/verbs is specified, only class-level prose. Implementations can disagree on command classification and accidentally emit commands that are technically read-only wrappers but operationally unsafe (for example indirect server launch aliases), causing policy drift.
- Remediation: add a normative recovery `nextCommand` allowlist (command kind + required flags) and require schema-level validation against that allowlist in both engine and CLI fixtures.

## Medium

### 4) Scope-precedence contract lacks explicit canonicalization order relative to symlink resolution and glob matching
- Evidence:
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:483-487` defines precedence ordering.
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:496-497` requires symlink real-path resolution before classification.
  - `docs/plans/2026-04-28-agent-native-design-system-plan.md:496-499` requires overlap + symlink fixtures.
- Breakage path: the spec does not explicitly define whether normalization happens before include/exempt pattern evaluation across all command entrypoints. Different packages may apply precedence on pre-normalized vs normalized paths, yielding mismatched scopes for the same surface.
- Remediation: add a strict algorithm section: normalize path -> ensure repo-relative real path -> compute all matches -> apply precedence -> emit matched scopes + winner. Require byte-fixture parity for this pipeline.

### 5) Runtime budget requirement is not testable as written because fixture-size envelope is undefined
- Evidence:
  - `docs/plans/2026-04-28-agent-native-design-system-plan.md:253-259` defines <=2s cached and <=5s cold target for "fixture-sized input".
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:643` requires timing fixture validation.
- Breakage path: without a fixed fixture corpus and run protocol, teams can tune datasets or warmup behavior to pass locally while regressing real workloads; CI flakes also become untriageable because the benchmark contract is underspecified.
- Remediation: pin one benchmark fixture set (paths + file counts + cache state protocol), record the timing harness command, and define pass/fail using percentile or capped retries.

Residual risks if unaddressed:
- Engine/CLI/guidance may each satisfy local fixtures but disagree on emitted failure semantics.
- Route-authority drift can reappear through generated artifacts.
- Read-only recovery UX can leak unsafe operational suggestions.

WROTE: artifacts/reviews/round3-adversarial-reviewer.md
