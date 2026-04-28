# Agent-Native Design System Implementation Plan

Last updated: 2026-04-28

schema_version: 1
plan_route: fresh
plan_depth: deep
source_spec: `docs/specs/2026-04-28-agent-native-design-system-spec.md`
next_stage: `he-work`

## Table of Contents

- [Purpose](#purpose)
- [Planning Readiness](#planning-readiness)
- [Decisions](#decisions)
- [Execution Sequence](#execution-sequence)
- [Execution Checkpoints](#execution-checkpoints)
- [Slice 1: Contract Wiring](#slice-1-contract-wiring)
- [Slice 2: Routing Table Contract](#slice-2-routing-table-contract)
- [Slice 3: Prepare Payload Model](#slice-3-prepare-payload-model)
- [Slice 4: Read-Only CLI Commands](#slice-4-read-only-cli-commands)
- [Slice 5: Actionable Remediation](#slice-5-actionable-remediation)
- [Slice 6: Gold Example Inventory](#slice-6-gold-example-inventory)
- [Slice 7: Abstraction Proposal Gate](#slice-7-abstraction-proposal-gate)
- [Cross-Slice Validation](#cross-slice-validation)
- [Risks and Rollback](#risks-and-rollback)
- [Stop Conditions](#stop-conditions)
- [Linear Mapping](#linear-mapping)
- [First He-Work Packet](#first-he-work-packet)
- [Handoff](#handoff)

## Purpose

Turn the agent-native design-system spec into an implementation-ready sequence.
The target outcome is a deterministic command contract that lets agents prepare a
UI surface before editing, receive the relevant design-system rules, and avoid
inventing local wrappers when a canonical primitive or proposal workflow exists.

Primary source: `docs/specs/2026-04-28-agent-native-design-system-spec.md`.

Related authority:

- `DESIGN.md`
- `.design-system-guidance.json`
- `docs/design-system/AGENT_UI_ROUTING.md`
- `docs/design-system/COMPONENT_LIFECYCLE.json`
- `docs/design-system/COVERAGE_MATRIX.json`
- `docs/design-system/PROFESSIONAL_UI_CONTRACT.md`
- `packages/agent-design-engine`
- `packages/design-system-guidance`
- `packages/cli`

## Planning Readiness

Ready for implementation in small validated slices.

The previous technical review blocker is resolved in the source spec:

- `prepare` is the single blessed public v1 agent entrypoint.
- `prepare` emits the full agent context pack.
- `context` is not a public v1 command and may exist only as an internal,
  debug, or test helper behind `prepare`.

No additional `he-deepen-spec` pass is required before Slice 1.

Domain-readiness decision:

- Canonical terms are stable inside the spec: `agent preparation`, `agent
  context pack`, `component route`, `gold example`, and `new abstraction
  proposal`.
- No root `CONTEXT.md` update is required for this implementation because the
  terms are scoped to the design-system contract. Promote them later only if
  they become cross-project language.

## Decisions

### Routing Table Ownership

Create a checked-in machine-readable routing table at:

```text
docs/design-system/AGENT_UI_ROUTING.json
```

Ownership split:

- `docs/design-system/AGENT_UI_ROUTING.json` is the canonical product routing
  data source for needs, preferred primitives, alternatives, examples, avoid
  rules, and validation commands.
- `docs/design-system/AGENT_UI_ROUTING.md` remains the human-readable narrative
  companion and must link to the JSON source. It is validated against the JSON
  source but does not generate it in v1.
- `packages/agent-design-engine` owns schema validation, digest calculation,
  route resolution, lifecycle and coverage joins, and deterministic payload
  assembly.
- `packages/cli` owns read-only user-facing commands under `astudio design`.
- `packages/design-system-guidance` owns enforcement scope and remediation
  output, but must not duplicate routing-table parsing logic.

Authoritative source model:

- Authored source: `docs/design-system/AGENT_UI_ROUTING.json`.
- Derived or checked companions: `AGENT_UI_ROUTING.md`, lifecycle rows, coverage
  rows, and gold-example inventory.
- Drift detector: `packages/agent-design-engine` tests and
  `pnpm agent-design:boundaries` fail contradictions; no command silently
  regenerates the routing JSON in v1.

Rationale: routing is product design-system policy, so it belongs beside the
design-system docs and lifecycle/coverage matrices. The engine should interpret
and validate that policy, not become the hidden owner of product-specific
routes.

### Proposal Artifact Format

Use markdown proposal artifacts under:

```text
docs/design-system/proposals/
```

Each proposal must include frontmatter or a structured table for:

- need
- surface path or surface kind
- checked existing alternatives
- reason existing routes do not fit
- proposed primitive or composition
- lifecycle entry change
- coverage-matrix change
- required gold example or Storybook state
- validation commands
- decision status

Rationale: proposal records are design decisions that humans need to read during
review. JSON can be generated later if automation needs a proposal index.

### Gold Example First Wave

Start with the smallest high-signal wave:

- settings panel
- async data view with loading, empty, error, and ready states
- page shell with sidebar/main/footer
- destructive confirmation flow

Defer dense dashboard, permission-denied/unavailable, and form-validation
examples until the first command payload and remediation flow are stable.

### Hardening Posture

Keep broad warn-scope behavior warn-first. Only promote a rule or surface to
hard-error after the relevant route, remediation instruction, and gold example
are present and verified.

### Need Normalization

Use canonical snake_case need IDs in `AGENT_UI_ROUTING.json` and treat aliases
as inputs that normalize to those IDs.

Initial canonical needs:

- `page_shell`
- `settings_panel`
- `async_collection`
- `product_section`
- `product_panel`
- `destructive_confirmation`

Normalization rules:

- Exact canonical need wins.
- Exact alias match wins over fuzzy or substring matches.
- If multiple aliases match, the longest exact alias wins.
- Remaining ties sort by `canonicalNeed` and emit an ambiguity diagnostic.
- Unknown needs return `E_DESIGN_PROPOSAL_REQUIRED` with checked alternatives.

### Command Compatibility and Read-Only Semantics

The public v1 command names and flags are frozen by this plan. Required-field
additions, renamed commands, or changed meanings require a new `*.v2` command
kind and an alias/deprecation plan.

All new command outputs must validate against the existing
`astudio.command.v1` envelope with top-level `schema`, `meta`, `summary`,
`status`, `data`, and `errors` fields. Design-specific variants live under
`data.kind`; design-specific recovery details live under `errors[].details`.
Compatibility fixtures must cover required-field preservation, optional-field
omission, nullability preservation, additive optional fields, stable
`data.kind`, and `*.v2` escalation for breaking changes.

`astudio design propose-abstraction ...` is read-only in v1. It validates an
existing proposal draft or previews required proposal fields. `--surface` is
optional so need-only route misses can still return a deterministic proposal
preview without inventing a placeholder path. It must not write files, scaffold
markdown, edit manifests, or imply a future write path without a separate
explicit write gate.
All read-only design commands use a command-boundary write-deny guard; attempted
filesystem mutation returns a dedicated read-only violation instead of falling
back to a write path.

`astudio design components` selector flags are XOR:

- `--need <need>` resolves a route by canonical need or alias.
- `--surface <path>` resolves route candidates for a surface.
- Supplying both returns `E_DESIGN_SELECTOR_CONFLICT`.

### Determinism and Scope Precedence

Machine output must be byte-stable for the same inputs:

- UTF-8 text and LF newlines.
- POSIX repo-relative real paths.
- Sorted object keys.
- Stable array sort keys documented by payload type.
- Source digests computed over path-sorted inputs.
- A canonical engine-level JSON writer used by all JSON-mode design commands.

Surface scope precedence follows existing repo truth from
`.design-system-guidance.json`: protected/error beats warn, warn beats exempt,
and paths outside all configured scopes are `unknown`. Overlap fixtures must
report all matched scopes and the selected winner.

### Route Maturity and Waivers

Routes start as `provisional` unless they have lifecycle, coverage, examples,
validation commands, and accepted policy references. Only `enforced` routes can
support hard-gate promotion.

Any bypass for route or lifecycle promotion must be a typed waiver with:

- owner
- justification
- expiry
- linked issue
- cleanup milestone
- affected route or lifecycle entry

Free-form grandfathering is not an acceptable bypass.

Waiver registry:

- Path: `docs/design-system/proposals/waivers.json`
- Owner: canonical waiver validator exported from
  `packages/agent-design-engine`; proposal-gate policy, CLI handlers, and
  policy scripts consume this validator instead of reimplementing the rules.
- Enforcement: schema validation, expiry failure, owner/issue/milestone
  presence, and near-expiry audit output before hard-gate promotion.

### Runtime Budget

`prepare` must report timing metadata and stay suitable for agent preflight use.
Target budget:

- cached fixture-sized input: <= 2 seconds
- cold fixture-sized input: <= 5 seconds

Benchmark fixture corpus:

- protected page: `platforms/web/apps/web/src/pages/TemplateBrowserPage.tsx`
- settings panel: canonical settings panel fixture from Slice 6 wave 1
- warn-scope story: one Storybook story under guidance warn scope
- exempt file: one configured exempt fixture
- cache protocol: run once after process start for cold timing, then repeat the
  same command in-process for cached timing; record file count, matched source
  digests, and timing percentile in the fixture output.

If local hardware makes timing flaky, tests should assert instrumentation and use
generous thresholds while docs record measured evidence.
Slice 3 must still fail on clear threshold regressions for fixture-sized inputs;
tolerance only covers documented CI variance, not missing budget assertions.

## Execution Sequence

Implement in seven slices. Do not skip Slice 1 or Slice 2: later CLI work
depends on contract wiring and routing ownership.

Parallelization:

- Slice 1 and Slice 2 should run sequentially.
- Slice 3 and Slice 4 should run sequentially because CLI fixtures depend on
  the engine payload model.
- Slice 5 can begin after Slice 2 if guidance ownership is clear, but broad
  remediation expansion waits for a lightweight engine remediation payload
  schema and envelope projection fixture.
- Slice 6 can begin after Slice 2 and feed extra examples into Slice 3/5.
- Slice 7 should run after Slice 2 and before any new route becomes preferred.

## Execution Checkpoints

Every slice must leave an evidence trail before the next dependent slice starts.

| Checkpoint | Required Before | Evidence |
| --- | --- | --- |
| C1: contract linked | Slice 2 | `DESIGN.md` has no placeholder-like authoritative raw token examples; `.design-system-guidance.json` declares a non-null `designContract`; guidance config validates with `jq` and package checks. |
| C2: route source valid | Slice 3, Slice 5, Slice 6, Slice 7 | `AGENT_UI_ROUTING.json` exists, passes `jq`, has engine schema coverage, includes canonical need aliases and route maturity, and each preferred route joins to lifecycle and coverage data. |
| C3: prepare model green | Slice 4 | Engine tests prove the `prepare` payload shape, deterministic ordering through the canonical serializer, scope classification, runtime telemetry with threshold assertions, safety-classed validation commands, missing-example diagnostics, and fail-closed diagnostics before CLI exposure. |
| C4: CLI contract green | Slice 5 consumers and external agent usage | CLI fixtures prove `prepare` is public, `context` is absent, legacy and new command kinds validate concurrently against the full `astudio.command.v1` envelope, and all query commands are read-only. |
| C5: remediation safe | Hardening promotion | Guidance output contains deterministic replacement instructions only where known safe, calls engine route APIs instead of parsing route files directly, and emits `recoveryUnavailableReason` for ambiguous cases. |
| C6: examples usable | Route promotion and hardening promotion | Gold examples are indexed, connected to routes, and covered by exemplar/a11y/visual gates where relevant. |
| C7: proposal gate enforced | Any new preferred route | Proposed route additions either reference an accepted proposal or fail policy validation. |

Per-slice completion criteria:

- Code, docs, fixtures, and package exports are updated in the same slice.
- Focused validation for the touched packages passes or has a concrete blocker.
- `FORJAMIE.md` is updated when behavior, structure, command contracts, or
  validation flows change.
- `git diff --check` passes.

## Slice 1: Contract Wiring

Goal: make `DESIGN.md` and `.design-system-guidance.json` a visibly connected
contract before new commands depend on them.

Tasks:

1. Remove or rewrite placeholder-like raw token notes in `DESIGN.md` so
   canonical guidance does not contain fake authoritative values such as
   `--color-accent: #123456`.
2. Update `.design-system-guidance.json` to declare non-null `designContract`
   rollout state for `DESIGN.md` mode.
3. Add or update schema validation in `packages/design-system-guidance` so
   `designContract` state is preserved and invalid contract-link states fail
   deterministically.
4. Add a focused fixture covering linked design-contract state.
5. Update docs that describe the DESIGN.md/guidance relationship.

Primary files:

- `DESIGN.md`
- `.design-system-guidance.json`
- `packages/design-system-guidance/src/core.ts`
- `packages/design-system-guidance/src/types.ts`
- `packages/design-system-guidance/rules.json`
- `docs/guides/DESIGN_MD_CONTRACT.md`

Acceptance coverage:

- SA5
- SA6

Entry criteria:

- No pending edits in `DESIGN.md` or `.design-system-guidance.json` unrelated to
  this slice.
- Current `pnpm agent-design:lint` failure state is captured before editing if
  it does not already pass.

Exit criteria:

- `.design-system-guidance.json` has a schema-supported `designContract` object.
- `DESIGN.md` examples cannot be mistaken for fake canonical raw values.
- Guidance migration/check behavior still preserves existing v1 fields.
- Docs explain that `.design-system-guidance.json` is rollout state and
  `DESIGN.md` is the design contract.

Validation intent:

```bash
cat .design-system-guidance.json | jq .
pnpm -C packages/design-system-guidance type-check
pnpm -C packages/design-system-guidance build
pnpm design-system-guidance:check:ci
pnpm agent-design:lint
git diff --check
```

Rollback:

- Revert the guidance config and `DESIGN.md` edits together.
- Do not leave `.design-system-guidance.json` pointing at a contract state the
  package cannot validate.

## Slice 2: Routing Table Contract

Goal: create the machine-readable component route source that future commands
can query without parsing prose.

Tasks:

1. Add `docs/design-system/AGENT_UI_ROUTING.json` with the v1 route schema.
2. Seed routes for the first canonical needs:
   - `page_shell`
   - `settings_panel`
   - `async_collection`
   - `product_section`
   - `product_panel`
   - `destructive_confirmation`
3. Include required fields from the spec: need, canonical need, aliases,
   preferred component, import path, package name, lifecycle status, route
   maturity, use-when rules, required states, examples, avoid rules, fallbacks,
   safety-classed validation commands, and source refs.
4. Add parser/schema support in `packages/agent-design-engine`.
5. Join routing entries with `COMPONENT_LIFECYCLE.json` and
   `COVERAGE_MATRIX.json`.
6. Fail fixtures when a preferred route lacks lifecycle, coverage, or source
   refs.
7. Add need-normalization fixtures for canonical IDs, aliases, tie-breaks, and
   unknown needs.
8. Add a drift detector between `AGENT_UI_ROUTING.json`, the human routing docs,
   lifecycle rows, coverage rows, and example inventory.
9. Export route facade APIs from `packages/agent-design-engine`:
   - `resolveRouteForNeed`
   - `resolveRouteForSurface`
   - `resolveRemediationContext`
10. Add a boundary test proving consumers use those exported APIs rather than
   parsing `AGENT_UI_ROUTING.json` directly.
11. Update `AGENT_UI_ROUTING.md` to identify the JSON file as the machine
    authority.
12. Add a boundary assertion that runtime command code never parses
    `AGENT_UI_ROUTING.md`; markdown routing docs are validation companions only.
13. Treat generated routing artifacts, if any are later added, as derived
    validation outputs only; runtime command code consumes the checked-in
    authored JSON source.

Primary files:

- `docs/design-system/AGENT_UI_ROUTING.json`
- `docs/design-system/AGENT_UI_ROUTING.md`
- `docs/design-system/COMPONENT_LIFECYCLE.json`
- `docs/design-system/COVERAGE_MATRIX.json`
- `packages/agent-design-engine/src/types.ts`
- `packages/agent-design-engine/src/index.ts`
- route facade module exported from `packages/agent-design-engine`
- `packages/agent-design-engine/tests/engine.test.mjs`

Acceptance coverage:

- SA3
- SA4
- SA11
- SA12
- SA16
- SA17
- SA21
- SA36
- SA23
- SA25
- SA29

Entry criteria:

- C1 is complete.
- The first route set is agreed to stay intentionally small.

Exit criteria:

- `AGENT_UI_ROUTING.json` has stable key order and normalized repo-relative
  paths.
- Every route has `canonicalNeed`, `aliases[]`, `routeMaturity`, and
  safety-classed `validationCommands[]`.
- Every preferred route has a lifecycle entry, coverage row, source ref, and at
  least one example or a deterministic missing-example diagnostic.
- Routing JSON is authored and checked in; commands do not regenerate it
  implicitly.
- Generated routing artifacts are not accepted as substitute runtime authority.
- Drift tests fail contradictions between routing JSON and checked companions.
- Engine tests cover route lookup by need, route lookup by surface, lifecycle
  joins, coverage joins, need alias normalization, ambiguous tie-breaks, missing
  route, missing lifecycle, and deprecated lifecycle rejection.
- `packages/agent-design-engine` exports the route facade used by CLI and
  guidance consumers.
- `AGENT_UI_ROUTING.md` tells humans to treat the JSON file as machine authority.

Validation intent:

```bash
cat docs/design-system/AGENT_UI_ROUTING.json | jq .
pnpm -C packages/agent-design-engine type-check
pnpm -C packages/agent-design-engine test
pnpm agent-design:boundaries
git diff --check
```

Rollback:

- Revert the JSON route source and engine parser together.
- Keep `AGENT_UI_ROUTING.md` narrative unchanged if the JSON source is removed.

## Slice 3: Prepare Payload Model

Goal: build the semantic payload behind `astudio design prepare` without adding
the CLI command first.

Tasks:

1. Add engine types for `astudio.design.prepare.v1`.
2. Implement a read-only preparation builder in `packages/agent-design-engine`
   that accepts a surface path and repository root.
3. Resolve and digest:
   - `DESIGN.md`
   - `.design-system-guidance.json`
   - `AGENT_UI_ROUTING.json`
   - `COMPONENT_LIFECYCLE.json`
   - `COVERAGE_MATRIX.json`
   - `PROFESSIONAL_UI_CONTRACT.md`
4. Classify surface scope as `protected`, `warn`, `exempt`, or `unknown` using
   guidance scopes and precedence.
5. Classify surface kind from route data and path patterns.
6. Emit required context-pack fields from the spec.
7. Fail closed for unknown scope, missing route, missing lifecycle, missing
   coverage, selector conflict, and ambiguous route, while preserving partial
   diagnostics.
8. Treat missing examples as diagnostics with
   `safeForAutomaticImplementation: false`, not command-fatal errors.
9. Snapshot payloads for protected page, settings panel, warn-scope story, and
   exempt file.
10. Canonicalize output with UTF-8/LF assumptions, POSIX repo-relative real paths,
   sorted keys, stable collection ordering, and path-sorted source digests.
11. Route all JSON-mode payloads through a canonical engine-level JSON writer.
12. Add overlapping scope fixtures proving protected/error > warn > exempt >
    unknown, including one protected+warn+exempt overlap and one
    symlink-normalization overlap.
13. Emit `validationCommands[]` entries with `safetyClass`, and keep default
    agent-path commands `read_only`.
14. Fail fixtures when a non-read-only validation command is missing
    `blockedByDefault: true` or a non-empty `reason`.
15. For validation commands that declare `packageScript`, fail fixtures unless
    the script exists in root `package.json`; direct canonical CLI commands do
    not need package-script aliases.
16. Emit timing metadata for the `prepare` runtime budget and fail clear
    fixture-sized threshold regressions.
17. Use the benchmark fixture corpus and cache protocol from the Runtime Budget
    section for timing assertions.

Primary files:

- `packages/agent-design-engine/src/types.ts`
- `packages/agent-design-engine/src/index.ts`
- new engine module for route/preparation logic
- `packages/agent-design-engine/tests/engine.test.mjs`
- `packages/agent-design-engine/tests/fixtures/**`

Acceptance coverage:

- SA1
- SA2
- SA14
- SA16
- SA17
- SA21
- SA22
- SA23
- SA24
- SA27
- SA28
- SA33
- SA35
- SA37

Entry criteria:

- C2 is complete.
- The routing table schema is exported from `packages/agent-design-engine`
  through package exports, not deep imports.

Exit criteria:

- `prepare` model returns all required fields from the spec.
- Payloads include source digests for all contract inputs.
- Fixtures cover protected, warn, exempt, and unknown surface scopes.
- Fixtures cover overlapping scope precedence and report matched rules.
- Unknown scope and missing route return proposal/clarification diagnostics and
  are not marked safe for automatic implementation.
- Missing examples return diagnostics and block hard-gate promotion, but do not
  make the query command fail.
- Default payloads contain only `read_only` validation commands.
- Non-read-only validation commands are diagnostic-only and include
  `blockedByDefault: true` plus a non-empty `reason`.
- Declared `packageScript` values map to root `package.json`; direct CLI
  validation commands remain allowed when no script alias exists.
- Runtime telemetry is present, and fixture-sized inputs meet or explicitly
  record the cold/cache budget.
- Static context-pack generation remains out of scope unless a freshness gate is
  added in the same slice.

Validation intent:

```bash
pnpm -C packages/agent-design-engine type-check
pnpm -C packages/agent-design-engine test
pnpm agent-design:boundaries
git diff --check
```

Rollback:

- Remove the preparation builder and fixtures without changing existing
  `lint`, `diff`, or `export` command behavior.

## Slice 4: Read-Only CLI Commands

Goal: expose the engine model through the public `astudio design` interface.

Tasks:

1. Extend `packages/cli/src/commands/design.ts` command kind support with:
   - `astudio.design.prepare.v1`
   - `astudio.design.components.v1`
   - `astudio.design.coverage.v1`
   - `astudio.design.proposeAbstraction.v1`
2. Add read-only commands:
   - `astudio design prepare --surface <path> --json`
   - `astudio design components --need <need> --json`
   - `astudio design components --surface <path> --json`
   - `astudio design coverage --component <name> --json`
   - `astudio design propose-abstraction --need <need> --surface <path> --json`
   - `astudio design propose-abstraction --need <need> --json`
3. Do not add `astudio design context`.
4. Update CLI schema fixtures to include the new command kinds.
5. Add CLI tests proving:
   - `prepare` returns the full context pack.
   - `components` and `coverage` are read-only.
   - `propose-abstraction` is read-only and cannot create, modify, or scaffold
     files.
   - read-only commands reject hidden write side effects under success, failure,
     and retry paths.
   - legacy `lint`, `diff`, `export`, `check-brand`, `init`, `migrate`, and
     `doctor` command kinds remain valid under the same `astudio.command.v1`
     schema as the new command kinds.
   - `components --need` and `components --surface` are mutually exclusive and
     return `E_DESIGN_SELECTOR_CONFLICT` when combined.
   - `astudio design components ...` is distinct from `astudio components new`.
   - help output does not advertise a public `context` command.
   - JSON mode never emits prose-only machine output.
   - every new command validates against the full `astudio.command.v1` envelope.
   - design-specific failures place recovery data under `errors[].details`.
   - `nextCommand` recovery values validate against the normative read-only
     allowlist, including need-only proposal previews, and reject root aliases,
     shell strings, server starts, browser launches, and write-capable commands.
6. Add a root script alias only for the happy path:

   ```bash
   pnpm agent-design:prepare --surface <path>
   ```

Primary files:

- `packages/cli/src/commands/design.ts`
- `packages/cli/tests/cli.test.mjs`
- `packages/cli/tests/fixtures/design-command-fixtures.json`
- `packages/cli/tests/fixtures/design-schemas/astudio-design-command.v1.schema.json`
- `package.json`

Acceptance coverage:

- SA1
- SA2
- SA11
- SA15
- SA16
- SA19
- SA20
- SA22
- SA23
- SA26
- SA31
- SA32
- SA34
- SA35
- SA39
- SA40

Entry criteria:

- C3 is complete.
- Command schemas and fixture strategy are identified before editing CLI parser
  branches.

Exit criteria:

- `astudio design prepare --surface <path> --json` emits
  `astudio.design.prepare.v1`.
- `astudio design components ...`, `coverage`, and `propose-abstraction` are
  query/validation commands only and do not write files.
- Slice 4 owns only transport/envelope wiring and preview-only
  `propose-abstraction` responses; Slice 7 owns proposal semantics, waiver
  policy, and promotion enforcement.
- CLI help and tests prove no public `astudio design context` command exists.
- CLI parser tests prove `components --need` and `components --surface` are XOR.
- `astudio design components ...` remains distinct from
  `astudio components new <name>` in parser tests and help fixtures.
- CLI fixtures prove v1 compatibility is additive-only; breaking semantic
  changes require a `*.v2` payload kind.
- Existing `astudio design lint`, `diff`, `export`, `check-brand`, `init`,
  `migrate`, and `doctor` help/schema fixtures keep passing alongside the new
  agent-native commands.
- Error fixtures cover the full failure/recovery matrix and required
  `errors[].details` keys.
- Negative recovery fixtures reject unsafe `nextCommand` values for mutating,
  interactive, server-start, and browser-launch command classes.
- Positive recovery fixtures accept only allowlisted read-only command kinds and
  required flags.
- Root `pnpm agent-design:prepare --surface <path>` alias works if added.

Validation intent:

```bash
pnpm -C packages/cli build
pnpm -C packages/cli test
pnpm astudio:build
pnpm agent-design:prepare --surface platforms/web/apps/web/src/pages/TemplateBrowserPage.tsx
git diff --check
```

Rollback:

- Remove new CLI subcommands and root alias.
- Keep engine preparation model if Slice 3 remains useful and green.

## Slice 5: Actionable Remediation

Goal: make design-system findings tell agents what replacement to use when a
safe replacement exists.

Tasks:

1. Extend guidance finding types with:
   - `replacementInstruction`
   - `examplePath`
   - `validationCommands[]`
   - `proposalRequired`
   - `recoveryUnavailableReason`
2. Use exported `packages/agent-design-engine` route facade APIs to attach
   deterministic replacement instructions for known patterns.
3. Cover raw wrapper, raw color, `h-screen`, global focus selector, and missing
   async state patterns where deterministic fixes exist.
4. Emit `recoveryUnavailableReason` instead of a guessed fix when remediation is
   ambiguous.
5. Preserve current warn/error scope behavior.

Primary files:

- `packages/design-system-guidance/src/types.ts`
- `packages/design-system-guidance/src/core.ts`
- `packages/design-system-guidance/rules.json`
- `packages/design-system-guidance/README.md`
- `docs/design-system/PROFESSIONAL_UI_CONTRACT.md`

Acceptance coverage:

- SA7
- SA8
- SA13
- SA16
- SA23
- SA27
- SA29

Entry criteria:

- C2 is complete.
- Existing guidance finding shape and downstream consumers are inventoried.
- A lightweight interface fixture proves the engine remediation payload schema
  projects through the `astudio.command.v1` envelope before broad remediation
  rule expansion.

Exit criteria:

- Known safe replacements name component, import path, example path, and
  safety-classed validation commands.
- Ambiguous findings include `recoveryUnavailableReason` and do not include a
  guessed shell command.
- Boundary tests fail if `packages/design-system-guidance` reads
  `AGENT_UI_ROUTING.json` directly instead of using engine exports.
- Warn/error scope behavior is unchanged unless a rule has route, remediation,
  and example coverage.
- Ratchet output reports before/after counts for any hardening change.

Validation intent:

```bash
pnpm -C packages/design-system-guidance type-check
pnpm -C packages/design-system-guidance build
pnpm design-system-guidance:check:ci
pnpm design-system-guidance:ratchet
pnpm test:policy
git diff --check
```

Rollback:

- Revert finding-shape changes and fixtures together.
- Do not keep docs describing remediation fields until package output emits
  them.

## Slice 6: Gold Example Inventory

Goal: provide copyable examples that match the route table and validation gates.

Tasks:

1. Add an inventory of gold examples, either as a JSON/Markdown pair under
   `docs/design-system/` or as metadata consumed by the exemplar evaluation
   script.
2. Cover the first wave:
   - settings panel
   - async data view
   - page shell with sidebar/main/footer
   - destructive confirmation flow
3. Record deferred extended-wave categories as non-promotable until examples
   exist:
   - permission-denied or unavailable state
   - dense operational dashboard
   - form validation with accessible errors
4. Ensure each example records default, focus, loading, empty, error, success,
   or recovery states where relevant.
5. Add or update Storybook stories and product examples only when a missing
   state has no existing protected surface to point at.
6. Connect example paths back into `AGENT_UI_ROUTING.json`.
7. Add a11y/visual validation references for interactive examples.

Primary files:

- `docs/design-system/AGENT_UI_ROUTING.json`
- `docs/design-system/COVERAGE_MATRIX.json`
- `docs/design-system/COVERAGE_MATRIX_SURFACES.json`
- `scripts/policy/run-exemplar-evaluation.mjs`
- relevant `packages/ui/src/app/**` stories

Acceptance coverage:

- SA9a
- SA9b
- SA10
- SA18

Entry criteria:

- C2 is complete.
- Candidate examples are selected from existing protected surfaces before new
  UI/story files are added.

Exit criteria:

- The inventory names example purpose, covered states, route need, source path,
  and validation commands.
- Missing states are either added or explicitly recorded as deferred coverage.
- Deferred extended-wave categories are explicitly non-promotable and cannot
  support hard gates until example coverage is added.
- Route entries point only at existing examples.
- Visual and a11y validation is run for any touched interactive Storybook or web
  surface.

Validation intent:

```bash
pnpm test:exemplar-evaluation:list
pnpm test:exemplar-evaluation
pnpm test:a11y:widgets
pnpm test:visual:storybook
git diff --check
```

Rollback:

- Remove newly added example metadata and story updates together.
- Do not leave route entries pointing at removed examples.

## Slice 7: Abstraction Proposal Gate

Goal: make new recommended primitives expensive by default and prevent silent
promotion of one-off abstractions.

Tasks:

1. Add proposal template under `docs/design-system/proposals/`.
2. Add validation that a new preferred route or lifecycle promotion references
   an accepted proposal unless it has a typed waiver.
3. Add policy tests for:
   - preferred route without proposal
   - lifecycle promotion without coverage update
   - route without example
   - free-form grandfathering without typed waiver fields
   - expired or near-expiry waiver audit output
   - proposal-required recovery from unknown need
4. Add the waiver registry at `docs/design-system/proposals/waivers.json`.
5. Implement `astudio design propose-abstraction ...` as a read-only validator
   or proposal-field preview in v1. It must not scaffold files. If a future
   command ever writes files, require an explicit later write gate and do not mix
   it with this read-only slice.

Primary files:

- `docs/design-system/proposals/README.md`
- `docs/design-system/proposals/TEMPLATE.md`
- `docs/design-system/proposals/waivers.json`
- `packages/agent-design-engine/src/**`
- `packages/cli/src/commands/design.ts`
- `scripts/policy/run.mjs`

Acceptance coverage:

- SA4
- SA12
- SA15
- SA23
- SA30
- SA31
- SA38

Entry criteria:

- C2 is complete.
- The proposal template fields are stable enough to review without CLI support.

Exit criteria:

- Proposal template exists and is referenced by route/lifecycle validation.
- Waiver registry exists, has schema validation, and fails expired, ownerless, or
  cleanup-missing waivers.
- A preferred route addition without an accepted proposal fails policy checks
  unless a typed waiver exists.
- `propose-abstraction` remains read-only in this slice.
- Policy tests distinguish route missing, lifecycle missing, coverage missing,
  example missing, and ambiguous remediation.
- Policy scripts and CLI handlers use the canonical waiver validator exported
  by `packages/agent-design-engine`; parity fixtures prove identical waiver
  decisions for the same fixture set.

Validation intent:

```bash
pnpm -C packages/agent-design-engine test
pnpm -C packages/cli test
pnpm test:policy
pnpm agent-design:boundaries
git diff --check
```

Rollback:

- Revert proposal validation and CLI preview support together.
- Keep proposal docs only if they are explicitly marked non-enforced.

## Cross-Slice Validation

Run focused validation after each slice. Before PR handoff or merge readiness,
run:

```bash
cat .design-system-guidance.json | jq .
cat docs/design-system/AGENT_UI_ROUTING.json | jq .
pnpm -C packages/agent-design-engine type-check
pnpm -C packages/agent-design-engine test
pnpm -C packages/design-system-guidance type-check
pnpm -C packages/design-system-guidance build
pnpm -C packages/cli build
pnpm -C packages/cli test
pnpm agent-design:boundaries
pnpm agent-design:lint
pnpm design-system-guidance:check:ci
pnpm test:policy
pnpm docs:lint
git diff --check
```

Add visual/a11y gates when Slice 6 changes stories or product examples:

```bash
pnpm test:exemplar-evaluation
pnpm test:a11y:widgets
pnpm test:visual:storybook
```

If `pnpm docs:lint` is blocked by local pnpm tool bootstrap, run and record the
underlying commands separately:

```bash
vale sync
fd -t f -e md -e mdx -e adoc -e rst -E .agent -E _tools -E node_modules -E .wrangler -E .build -E .swiftpm -E AGENTS.md -E CLAUDE.md -E references -X vale
node scripts/check-doc-links.mjs
```

## Risks and Rollback

### Risk: Command Surface Drift

`astudio design components ...` can be confused with existing
`astudio components new <name>`.

Control:

- Keep command families in separate files or clearly separate parser branches.
- Add CLI help and parser tests for both command families.

### Risk: Engine and Guidance Ownership Drift

`packages/design-system-guidance` could duplicate engine parsing logic.

Control:

- Use `@brainwav/agent-design-engine` exports for semantic route resolution.
- Keep `pnpm agent-design:boundaries` in every relevant slice.

### Risk: Static Context Pack Staleness

Future static context-pack artifacts can drift.

Control:

- Do not add static generation in the first implementation.
- If added later, require digest freshness validation before agents consume it.

### Risk: Hardening Too Early

Warn-scope hardening can block unrelated UI work before replacement instructions
and examples exist.

Control:

- Promote only after route, remediation, and gold example coverage are present.
- Record before/after counts through `pnpm design-system-guidance:ratchet`.

### Risk: Need Taxonomy Drift

Different agents or packages could use different words for the same UI need.

Control:

- Keep canonical need IDs and aliases in `AGENT_UI_ROUTING.json`.
- Test alias normalization, tie-breaks, and unknown-need recovery in Slice 2.

### Risk: Envelope Compatibility Drift

New design command payloads could bypass the existing CLI envelope and become a
parallel protocol.

Control:

- Validate all command fixtures against `astudio-design-command.v1.schema.json`.
- Treat required-field or semantic breaks as `*.v2`, not silent `*.v1` changes.

### Risk: Runtime Budget Creep

`prepare` could become too slow if it crawls docs, coverage, examples, and
guidance state on every invocation.

Control:

- Emit timing metadata from the engine.
- Keep static generation out of v1 unless freshness gates are added.
- Track cached and cold fixture budgets in Slice 3/4 evidence.

### Risk: Waiver Sprawl

Proposal exceptions could become permanent undocumented bypasses.

Control:

- Require typed waivers with owner, expiry, linked issue, and cleanup milestone.
- Fail free-form grandfathering in policy tests.

## Stop Conditions

Stop implementation and return to planning or spec refinement if any of these
conditions appear:

- A later review reintroduces a public `context` command or alias. The selected
  contract is `prepare` only for the full context pack.
- Route ownership cannot stay in `docs/design-system/AGENT_UI_ROUTING.json`
  without duplicating semantics in `packages/design-system-guidance`.
- `prepare` would need to write files, run browsers, start servers, or refresh
  generated artifacts to answer a query.
- A preferred route lacks lifecycle or coverage data and no proposal is accepted.
- CLI command schemas cannot represent the required payload without changing the
  existing `astudio.command.v1` envelope.
- Hardening would move warn-scope debt to hard failures before replacement
  instructions and examples exist.
- A route need cannot be normalized deterministically.
- `prepare` cannot meet a practical runtime budget without adding a freshness
  gate or cache invalidation contract.
- A proposal exception is needed but lacks a typed waiver with expiry and owner.

## Linear Mapping

Synced issue split:

| Linear | Slice | Title |
| --- | --- | --- |
| JSC-238 | Parent | Agent-native design-system command layer |
| JSC-239 | Slice 1 | Agent-native design system: contract wiring |
| JSC-240 | Slice 2 | Agent-native design system: routing table contract |
| JSC-241 | Slice 3 | Agent-native design system: prepare payload model |
| JSC-242 | Slice 4 | Agent-native design system: read-only CLI commands |
| JSC-243 | Slice 5 | Agent-native design system: actionable remediation output |
| JSC-244 | Slice 6 | Agent-native design system: gold example inventory wave 1 |
| JSC-245 | Slice 7 | Agent-native design system: abstraction proposal gate |

Linear tracks execution state; this repo plan remains the technical source of
truth. If implementation changes the contract, update the plan first and then
sync the affected Linear issue description.

## First He-Work Packet

Start with Slice 1 only.

Working objective:

- Link `.design-system-guidance.json` to the active `DESIGN.md` contract and
  remove placeholder-like authoritative raw token guidance from `DESIGN.md`.

Implementation tasks:

1. Inspect current `DESIGN.md` lint output and guidance config parse behavior.
2. Patch `DESIGN.md` placeholder-like token examples.
3. Add `designContract` rollout state to `.design-system-guidance.json`.
4. Add or update guidance config fixtures/tests so the linked state is preserved.
5. Update `docs/guides/DESIGN_MD_CONTRACT.md` only if command or config
   behavior changed.
6. Update `FORJAMIE.md`.

Required evidence:

```bash
cat .design-system-guidance.json | jq .
pnpm -C packages/design-system-guidance type-check
pnpm -C packages/design-system-guidance build
pnpm design-system-guidance:check:ci
pnpm agent-design:lint
git diff --check
```

Do not start Slice 2 in the same `he-work` packet unless Slice 1 is green and
the user explicitly asks to continue.

## Handoff

Recommended next action: start `he-work` on Slice 1 only.

Slice 1 is deliberately small and establishes the contract state that every
later slice consumes. Do not begin CLI command expansion until Slice 2 and Slice
3 are green.

Implementation should keep commits atomic by slice. Each slice should update
`FORJAMIE.md` when it changes behavior, structure, command contracts, validation
flows, or design-system operating guidance.
