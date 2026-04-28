# Round 2 Architecture Strategist Review

## High

1. **Blocking contradiction: `prepare` failure behavior for missing examples is inconsistent between spec and plan**
- Evidence:
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:494` says missing examples "do not block the query command" and only block hard-gate promotion.
  - `docs/plans/2026-04-28-agent-native-design-system-plan.md:442-444` requires `prepare` to fail closed for missing example.
- Why this is an architectural problem:
  - This changes the caller contract and error semantics for the primary entrypoint (`prepare`), which affects CLI/API stability, rollout friction, and downstream automation assumptions.
  - It also conflicts with the warn-first hardening posture by turning content-readiness gaps into command-blocking runtime failures.
- Remediation:
  - Pick one behavior and encode it in both docs. Recommended: keep `prepare` non-blocking for `E_DESIGN_EXAMPLE_MISSING` (diagnostic + `safeForAutomaticImplementation=false`), while enforcing example presence only for route promotion/hard-gate transitions.
  - Add one explicit invariant in both docs defining whether missing examples are command-fatal vs promotion-fatal.

## Medium

2. **Routing-source model is internally ambiguous (canonical checked-in source vs generated source set)**
- Evidence:
  - `docs/plans/2026-04-28-agent-native-design-system-plan.md:87-90` defines `docs/design-system/AGENT_UI_ROUTING.json` as canonical product routing data source.
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:282` says routing table "may be generated from `AGENT_UI_ROUTING.md`, `COMPONENT_LIFECYCLE.json`, and `COVERAGE_MATRIX.json`".
- Why this is an architectural problem:
  - This introduces dual-source ownership ambiguity (authored JSON vs generated artifact), making drift and reconciliation rules unclear.
- Remediation:
  - Declare one explicit model:
    - Either authored canonical JSON with validators only, or
    - generated JSON with declared source-of-truth inputs and a required regeneration gate.
  - Add a contract section: "authoritative source", "derived artifacts", and "drift detector".

3. **Byte-stability requirement is underspecified as an implementation contract**
- Evidence:
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:460-462` and `docs/plans/2026-04-28-agent-native-design-system-plan.md:186-193` require sorted object keys and byte-stable outputs.
- Why this is an architectural problem:
  - Object-key ordering is serializer-dependent unless a canonical serialization layer is mandated. Without defining serializer/canonicalization boundary, teams can satisfy tests locally but drift across runtimes/tooling.
- Remediation:
  - Specify a canonical serialization boundary (for example, engine-level canonical JSON writer) and explicitly scope byte-stability to JSON-mode outputs produced by that path.
  - Add one acceptance check that compares byte output from two invocation environments to validate portability assumptions.

4. **Proposal-gate architecture lacks a single authoritative waiver store and lifecycle ownership**
- Evidence:
  - `docs/specs/2026-04-28-agent-native-design-system-spec.md:468-470` requires typed waivers with owner/expiry/issue/milestone.
  - `docs/plans/2026-04-28-agent-native-design-system-plan.md:759-767` requires policy checks for waiver shape.
  - Neither doc defines where waivers live, who owns updates, and how expiry enforcement is executed.
- Why this is an architectural problem:
  - Governance requirements exist, but the persistence and enforcement surface is undefined, creating implementation divergence across policy, CLI, and docs.
- Remediation:
  - Define a single waiver registry path (for example `docs/design-system/proposals/waivers.json`), schema owner package, and expiry enforcement command in the same slice as proposal gate.

## Low

5. **Sequencing overlap for `propose-abstraction` command responsibilities can create split ownership during implementation**
- Evidence:
  - `docs/plans/2026-04-28-agent-native-design-system-plan.md:528` includes `propose-abstraction` in Slice 4 CLI surface.
  - `docs/plans/2026-04-28-agent-native-design-system-plan.md:768-771` re-specifies implementation constraints for `propose-abstraction` in Slice 7.
- Why this is an architectural problem:
  - Duplicate ownership across slices can cause partial implementations (CLI contract added before policy semantics or vice versa) and temporary contract drift.
- Remediation:
  - Make Slice 4 strictly transport/envelope wiring for `propose-abstraction`, and Slice 7 the sole owner of proposal semantics + policy validation, with an explicit interim "preview-only" response contract.

Residual risks:
- Runtime budget targets (`<=2s` cached, `<=5s` cold) may be difficult to keep stable as route/example coverage grows unless cache invalidation strategy is formalized early.
- The overlap-resolution contract is strong, but edge cases around symlink-heavy monorepo paths should be backed by dedicated fixtures before broad hardening.

WROTE: artifacts/reviews/round2-architecture-strategist.md
