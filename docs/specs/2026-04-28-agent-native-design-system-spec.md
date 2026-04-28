---
title: "Agent-Native Design System Specification"
type: feat
status: draft
date: 2026-04-28
origin: "User request to specify agent-usefulness recommendations from the current design-system assessment"
risk: high
spec_depth: full
ui_required: true
---

# Agent-Native Design System Specification

Status: Draft v1

Purpose: Define the contract that turns the existing aStudio design-system guidance into an agent-native design workflow. The goal is to let a coding agent ask the repository what to do for a UI surface and receive one deterministic, machine-readable answer that includes component routing, required states, examples, validation commands, and safe next actions.

## Table of Contents

- [Problem Statement](#problem-statement)
- [Goals](#goals)
- [Non-Goals](#non-goals)
- [System Boundary](#system-boundary)
- [Core Domain Model](#core-domain-model)
- [Domain Language Decisions](#domain-language-decisions)
- [Main Flow / Lifecycle](#main-flow--lifecycle)
- [Interfaces and Dependencies](#interfaces-and-dependencies)
- [Interface Alternatives](#interface-alternatives)
- [Invariants / Safety Requirements](#invariants--safety-requirements)
- [Failure Model and Recovery](#failure-model-and-recovery)
- [Observability](#observability)
- [Accessibility and UI Contract](#accessibility-and-ui-contract)
- [Acceptance and Test Matrix](#acceptance-and-test-matrix)
- [Open Questions](#open-questions)
- [Definition of Done](#definition-of-done)
- [Planning Readiness](#planning-readiness)
- [Next Stage Handoff](#next-stage-handoff)

## Problem Statement

The repository already has strong agent-facing design-system foundations:

- `DESIGN.md` declares the repo-level agent UI contract.
- `packages/agent-design-engine` parses, lints, diffs, and exports design contracts.
- `packages/cli` exposes `astudio design ...` commands with the `astudio.command.v1` JSON envelope.
- `packages/design-system-guidance` enforces design-system usage across protected, warning, and exempt scopes.
- `docs/design-system/AGENT_UI_ROUTING.md` and `docs/design-system/PROFESSIONAL_UI_CONTRACT.md` describe the component-routing and professional UI rules agents should follow.

The remaining problem is agent ergonomics. The knowledge is still distributed across docs, JSON manifests, package READMEs, root scripts, guidance config, and exemplar components. A careful agent can assemble the answer, but first-pass UI generation still depends on manual retrieval and reconciliation.

This specification defines the next contract layer: an agent-native design-system interface that collapses the distributed guidance into deterministic commands and machine-readable payloads.

## Goals

- Provide one agent happy-path command that prepares an agent to modify or create a UI surface.
- Add a machine-readable component routing table that maps user intent to canonical primitives, import paths, lifecycle status, examples, required states, and forbidden patterns.
- Make `DESIGN.md` and `.design-system-guidance.json` feel like one wired contract by replacing placeholder-like token notes and linking guidance rollout state to the checked-in design contract.
- Turn the strongest protected-surface guidance into hard gates over time, while preserving warn-first rollout for broader debt.
- Add deterministic replacement instructions to design-system violations.
- Expand gold-standard examples that agents can copy without inventing local wrappers.
- Generate an agent context pack containing the minimum relevant design-system facts for a target surface.
- Expose lifecycle and coverage query commands so agents can ask what component or surface route is valid before writing code.
- Make new public design-system abstractions require an explicit proposal contract before implementation.

## Non-Goals

- Rewriting the visual component library.
- Replacing Apps SDK primitives when they are already sufficient.
- Removing the existing `astudio.command.v1` envelope.
- Publishing a public design-system package.
- Replacing Figma, Storybook, Playwright, or the existing exemplar gate.
- Migrating every warn-scope file to hard-error scope in one slice.
- Building a new end-user design editor.
- Allowing command output to become human-only prose for machine workflows.

## System Boundary

### In Scope

- Root `DESIGN.md` contract content and validation.
- `packages/agent-design-engine` semantic model, payload schemas, routing logic, and lint output.
- `packages/cli` `astudio design ...` command surface.
- `packages/design-system-guidance` scope policy, remediation messages, and contract linkage.
- `docs/design-system/AGENT_UI_ROUTING.md`, `PROFESSIONAL_UI_CONTRACT.md`, `COMPONENT_LIFECYCLE.json`, `COVERAGE_MATRIX.json`, and related guidance docs.
- Agent-readable examples and fixtures for protected surfaces.
- Root scripts that expose agent-design validation and query workflows.
- `FORJAMIE.md` and docs indexes when the operating model changes.

### Out of Scope

- Back-end MCP tool semantics unless a design command consumes them.
- Runtime theme rendering changes not required by the agent contract.
- New product features unrelated to the design-system authoring workflow.
- Broad visual redesign of existing pages.

## Core Domain Model

### Design Contract

The checked-in source that defines how agents should build UI in the repository. The v1 source is `DESIGN.md` with `schemaVersion: agent-design.v1` and `brandProfile: astudio-default@1`.

### Agent Preparation

A read-only operation that takes a target surface path, classifies the surface, resolves applicable rules, and returns a deterministic payload that an agent can use before editing.

### Surface

A page, panel, component, story, widget, or product UI file that may be protected, warning-only, or exempt under `.design-system-guidance.json`.

### Component Route

A machine-readable recommendation that maps a UI need to a preferred primitive or composition, including import path, lifecycle status, required states, examples, and patterns to avoid.

### Agent Context Pack

A compact payload for one target surface. It includes design contract metadata, semantic tokens, mapped theme slots, component routes, required state coverage, relevant examples, validation commands, and enforcement scope.

### Gold Example

A canonical, protected implementation that agents are expected to copy structurally. Gold examples must include default and relevant state coverage and must pass source, browser, and accessibility gates appropriate to their surface.

### New Abstraction Proposal

A required pre-implementation artifact for adding a new public or recommended design-system primitive. It records the gap, existing alternatives, lifecycle entry, coverage-matrix update, exemplar/test obligation, and validation command.

## Domain Language Decisions

- Use `agent-native design system` for the target operating model, not merely `agent-readable design system`.
- Use `agent preparation` for the happy-path pre-edit command.
- Use `agent context pack` for the generated payload that agents consume before editing.
- Use `component route` for the need-to-primitive mapping.
- Use `gold example` for protected, copyable fixtures.
- Use `new abstraction proposal` for the required contract before creating a new recommended primitive.
- Avoid the alias `design assistant` because the workflow is repository-contract driven, not a separate assistant persona.
- Avoid the alias `component registry` for the full routing table unless it only contains component metadata; the desired object includes validation, examples, forbidden patterns, and lifecycle data.

No root `CONTEXT.md` is required for this spec because the domain terms above are local to the design-system contract and are defined here. If these terms become cross-project language, add them to the repo's future context surface or Linear issue comments rather than creating an ADR.

## Main Flow / Lifecycle

### 1. Agent Prepares a Surface

1. Agent calls the preparation command with a surface path.
2. The command resolves the git root, `DESIGN.md`, `.design-system-guidance.json`, component lifecycle manifest, coverage matrix, professional UI contract, and the authored machine routing table.
3. The command classifies the surface as `protected`, `warn`, `exempt`, or `unknown`.
4. The command determines whether the surface is a page shell, panel, data view, settings cluster, form, modal, widget, story, or lower-level component.
5. The command returns the agent context pack as one JSON object under the existing `astudio.command.v1` envelope.

### 2. Agent Chooses a Component Route

1. Agent asks for a component route by `need`, `surface`, or existing component.
2. The command reads the machine-readable routing table and lifecycle manifest.
3. The command returns the preferred primitive, alternatives, import path, lifecycle status, required states, examples, forbidden patterns, and validation commands.
4. If no route exists, the command returns a deterministic "proposal required" response instead of encouraging invention.
5. If a route exists but is missing a required gold example, the command returns
   diagnostics and `safeForAutomaticImplementation: false`; the query itself is
   not command-fatal. Missing examples are promotion-fatal for route maturity and
   hard gates.

### 3. Agent Receives Actionable Violations

1. Guidance or agent-design lint detects a design-system violation.
2. Each finding includes a stable ID, severity, source reference, target file, and replacement instruction when deterministic.
3. Replacement instructions name the preferred primitive, import path, example file, and validation command.
4. If the fix is ambiguous, the finding must say why and point to the proposal workflow or a human decision.

### 4. Agent Proposes a New Abstraction

1. Agent runs a proposal command or writes a proposal artifact before adding a new recommended primitive.
2. The proposal names the unmet UI need, checked alternatives, lifecycle entry, coverage-matrix change, exemplar/test obligation, and validation lane.
3. Planning may proceed only after the proposal is accepted or the work is redirected to an existing primitive.

### 5. Contract Hardens Over Time

1. Protected scope violations remain hard failures.
2. Warn-scope surfaces continue to report evidence without blocking unrelated work.
3. Once gold examples and remediation instructions exist for a rule family, selected warn-scope rules can be promoted to protected hard gates.

## Interfaces and Dependencies

### CLI Interface Shape

The following commands define the v1 caller-facing shape. These command names and
flags are frozen for the implementation plan: breaking semantic changes require a
new `*.v2` command kind, while additive optional fields may stay under `*.v1`.

```bash
astudio design prepare --surface <path> --json
astudio design components --need <need> --json
astudio design components --surface <path> --json
astudio design coverage --component <name> --json
astudio design propose-abstraction --need <need> --surface <path> --json
astudio design propose-abstraction --need <need> --json
```

Selected shape:

- `prepare` is the primary happy-path command and must include the full agent context pack by default.
- `context` is not a public v1 command; implementation may keep internal/debug context helpers behind `prepare`, but agents should not see or choose a second entrypoint.
- `components` answers routing questions by need or surface.
- `components` selector flags are mutually exclusive. Passing both `--need` and
  `--surface` must return `E_DESIGN_SELECTOR_CONFLICT`; implementations must
  not choose one implicitly or merge selector modes.
- `coverage` answers lifecycle/coverage status for an existing component.
- `propose-abstraction` is read-only in v1. It validates an existing proposal
  draft or previews the required proposal fields for a missing route; it must not
  create, modify, or scaffold files unless a later explicit write-gated command
  is specified. `--surface` is optional because need-only routing queries can
  still need a proposal preview before a trustworthy surface path exists.

Root script aliases may wrap these commands:

```bash
pnpm agent-design:prepare --surface <path>
```

Existing `astudio design` commands remain supported in v1:

- `lint`
- `diff`
- `export`
- `check-brand`
- `init`
- `migrate`
- `doctor`

The agent-native commands are additive. Removing, renaming, or changing the
required semantics of the existing command kinds requires a later `*.v2`
contract, deprecation schedule, and compatibility fixtures that prove old and
new command kinds are not mixed accidentally.

All machine output must keep the existing `astudio.command.v1` envelope already
used by the CLI fixture schema. Command-specific data must live under `data`
with stable `kind` values such as:

- `astudio.design.prepare.v1`
- `astudio.design.components.v1`
- `astudio.design.coverage.v1`
- `astudio.design.proposeAbstraction.v1`
- the existing `astudio.design.lint.v1`, `astudio.design.diff.v1`,
  `astudio.design.export.v1`, `astudio.design.checkBrand.v1`,
  `astudio.design.init.v1`, `astudio.design.migrate.v1`, and
  `astudio.design.doctor.v1` kinds

Envelope invariants:

- Top-level fields remain compatible with the existing command schema:
  `schema`, `meta`, `summary`, `status`, `data`, and `errors`.
- `data.kind` is the only discriminator for design-command payload variants.
- Required top-level fields cannot be renamed or removed under `*.v1`.
- New optional fields must be additive and deterministic.
- Required-field additions, command renames, or changed meanings require a
  `*.v2` kind and an alias/deprecation plan.
- `errors[]` must use the existing envelope error shape and place design-specific
  recovery details under `errors[].details`.

Compatibility test matrix:

- existing required top-level fields remain required
- existing optional fields remain accepted when omitted
- nullability does not narrow under `*.v1`
- command-specific `data.kind` values remain stable
- new optional fields are ignored by old consumers in fixtures
- breaking required-field or semantic changes require `*.v2`

### Shared Validation Command Schema

Every `validationCommands[]` item, whether it appears in `prepare`, route,
remediation, or recovery context, must use this shared shape:

- `command`
- `purpose`
- `safetyClass`: `read_only`, `mutating`, `interactive`, `server_start`, or
  `browser_launch`
- `packageScript` when the command maps to `package.json`
- `blockedByDefault` when the command is not safe for the default agent path
- `reason` when `blockedByDefault` is true

### Agent Context Pack Required Fields

The `prepare` payload must include:

- `resolvedDesignFile`
- `guidanceConfigPath`
- `designContractMode`
- `surfacePath`
- `surfaceScope`: `protected`, `warn`, `exempt`, or `unknown`
- `surfaceKind`
- `recommendedRoutes[]`
- `requiredStates[]`
- `forbiddenPatterns[]`
- `relevantExamples[]`
- `validationCommands[]`
- `ruleManifestVersion`
- `rulePackVersion`
- `ruleSourceDigests`
- `coverageMatrixDigest`
- `componentLifecycleDigest`
- `openDecisions[]`

`prepare` may recommend only `read_only` validation commands in the default
agent path. Mutating or interactive commands may appear only as non-default
diagnostic context with `blockedByDefault: true` and a reason.

### Component Route Required Fields

The component routing table must be machine-readable and include:

- `need`
- `canonicalNeed`
- `aliases[]`
- `preferredComponent`
- `importPath`
- `packageName`
- `lifecycleStatus`
- `routeMaturity`: `provisional` or `enforced`
- `useWhen[]`
- `requiredStates[]`
- `examples[]`
- `avoid[]`
- `fallbacks[]`
- `validationCommands[]`
- `sourceRefs[]`

The routing table is an authored, checked-in JSON source at
`docs/design-system/AGENT_UI_ROUTING.json`. Runtime command code must not parse
`AGENT_UI_ROUTING.md`; the markdown file is a narrative companion and validation
target only. The JSON table may be validated against `AGENT_UI_ROUTING.md`,
`COMPONENT_LIFECYCLE.json`, and `COVERAGE_MATRIX.json`, but it is not a
generated artifact in v1. Drift detectors must fail if the human-readable
routing guide contradicts the JSON source.

Need normalization rules:

- `canonicalNeed` values are snake_case identifiers defined by the routing table.
- Aliases may include human wording such as `page shell`, `settings panel`, or
  `async data view`, but they must normalize to exactly one canonical need.
- If multiple aliases match, the longest exact alias wins; ties are resolved by
  `canonicalNeed` lexical order and reported in diagnostics.
- Unknown needs return `E_DESIGN_PROPOSAL_REQUIRED` with the closest checked
  alternatives; they must not fall back to a generic wrapper recommendation.
- Route maturity controls enforcement. `provisional` routes can be surfaced with
  warnings and proposal guidance; only `enforced` routes with lifecycle,
  coverage, examples, and validation references may become hard-gate targets.

### Guidance Finding Required Fields

Every actionable design-system finding should include:

- `id`
- `severity`
- `file`
- `line` when known
- `message`
- `sourceRef`
- `replacementInstruction` when deterministic
- `examplePath` when available
- `validationCommands[]`
- `proposalRequired` boolean

### Dependencies

- `DESIGN.md`
- `.design-system-guidance.json`
- `docs/design-system/AGENT_UI_ROUTING.md`
- `docs/design-system/PROFESSIONAL_UI_CONTRACT.md`
- `docs/design-system/COMPONENT_LIFECYCLE.json`
- `docs/design-system/COVERAGE_MATRIX.json`
- `packages/agent-design-engine`
- `packages/design-system-guidance`
- `packages/cli`
- root scripts in `package.json`

## Interface Alternatives

This spec introduces a new caller-facing command boundary. Planning must preserve the selected shape unless implementation discovers a stronger option that keeps the same safety properties.

### Alternative A: One Happy-Path Command With Supporting Queries

Signature:

```bash
astudio design prepare --surface <path> --json
astudio design components --need <need> --json
astudio design coverage --component <name> --json
astudio design propose-abstraction --need <need> --surface <path> --json
astudio design propose-abstraction --need <need> --json
```

Caller usage:

```bash
astudio design prepare --surface platforms/web/apps/web/src/pages/TemplateBrowserPage.tsx --json
```

What it hides:

- contract discovery
- guidance-scope resolution
- lifecycle and coverage lookups
- route selection
- relevant example selection
- validation-command selection

Tradeoffs:

- Simplicity: high, because agents get one pre-edit answer.
- Flexibility: medium, because detailed routing queries still exist but are not required for the common path.
- Implementation efficiency: medium, because `prepare` has to compose several existing sources.
- Depth: high enough for agent workflows because the payload includes provenance and validation commands.
- Ease of correct use: high, because the default command is the safe path.
- Misuse risk: low, as long as `prepare` is read-only and fails closed on missing route or ambiguous contract.

### Alternative B: Public Context Export Plus Manual Query Commands

Rejected public shape:

```text
public context export + manual components query + manual coverage query
```

Rejected caller workflow:

```text
export context for a surface, then ask separate query commands for routing and coverage
```

What it hides:

- source discovery and serialization
- some lifecycle and coverage details

Tradeoffs:

- Simplicity: low to medium, because agents must know which query to run next.
- Flexibility: high, because each command is narrower.
- Implementation efficiency: medium, because each command can be built independently.
- Depth: variable; callers can miss important constraints if they stop after the context export.
- Ease of correct use: medium to low for first-pass UI generation.
- Misuse risk: medium, because agents may treat context export as sufficient and skip component routing or proposal checks.
- Disposition: rejected for public v1 because it creates a second agent entrypoint and recreates the multi-step retrieval problem this spec is meant to remove.

### Alternative C: Static Generated Preparation Pack Only

Signature:

```bash
pnpm agent-design:prepare:generate
```

Caller usage:

```bash
jq '.surfaces["platforms/web/apps/web/src/pages/TemplateBrowserPage.tsx"]' artifacts/agent-design/context-pack.json
```

What it hides:

- runtime command composition
- repeated parsing of source docs

Tradeoffs:

- Simplicity: medium for CI, low for interactive agents.
- Flexibility: low, because stale generated data can drift from source unless tightly gated.
- Implementation efficiency: high for initial export, lower once incremental freshness is required.
- Depth: high only if generation includes every route, surface, example, and validation command.
- Ease of correct use: medium, because agents must know the artifact path and freshness contract.
- Misuse risk: medium to high if artifacts become stale or are not regenerated in the current branch.

### Selected Interface Shape

Choose Alternative A.

Rationale: the main product problem is not lack of data, it is forcing agents to assemble too much data before making a safe edit. A single `prepare` command is easiest to use correctly and hardest to skip. Supporting query commands remain useful for planning, debugging, and focused automation, but they should not be the default entrypoint.

Contract consequences:

- `prepare` must emit the full agent context pack.
- `context` must not be exposed as a public v1 command. If implementation needs context-building helpers, they stay internal or test-only behind `prepare`.
- Any command that cannot determine a safe route must return proposal-required output rather than an incomplete recommendation.
- A static generated context pack may be added later as an optimization, but it cannot replace the live `prepare` command unless freshness is enforced by a required gate.

## Invariants / Safety Requirements

- The design contract remains rooted in `DESIGN.md`; `.design-system-guidance.json` stores rollout and enforcement state.
- `designContract` in `.design-system-guidance.json` must not remain `null` once the repository is operating in `design-md` mode.
- Placeholder-like raw token notes in `DESIGN.md` must not appear as authoritative examples.
- Query commands are read-only.
- Write-capable commands require existing aStudio write gates.
- `propose-abstraction` is read-only in v1; a future writer must use a separate
  explicit write gate and cannot be implied by this command name.
- Agents must receive structured JSON, not prose-only output, for machine workflows.
- Command output must include enough provenance for a future agent to replay the decision.
- A missing lifecycle entry cannot be treated as canonical approval.
- A request with no canonical route must return "proposal required" rather than
  silently recommending a one-off wrapper.
- Hardening from warn to error must happen by explicit scope/rule promotion, not accidental broadening.
- New public primitives cannot become recommended routing targets without lifecycle, coverage, example, and validation updates.
- Existing `astudio components new <name>` must remain distinct from `astudio design components ...`; the former generates component files and requires write gates, while the latter is read-only routing/coverage intelligence.
- `prepare` must never run browser tests, generate files, edit config, or refresh generated matrices. It may only report the commands that would perform those actions.
- `prepare` must fail closed when route data, lifecycle data, coverage data, or
  selector input is invalid, but it must still include enough partial diagnostics
  for a human or planning agent to understand what source is absent. Missing
  examples are diagnostic and promotion-fatal, not command-fatal.
- Component route precedence is fixed: Apps SDK primitive when sufficient, local design-system primitive/composition when product semantics are needed, fallback primitive only for documented gaps, proposal required when no documented route exists.
- Surface scope precedence is fixed by existing guidance truth:
  `protected`/`error` wins over `warn`, `warn` wins over `exempt`, and anything
  outside configured scope is `unknown`. Overlapping glob matches must report the
  matched rules and selected winner.
- Scope classification order is fixed across every command entrypoint:
  normalize the input path, resolve symlinks to a repository-relative real path,
  compute all guidance include/warn/error/exempt matches on that normalized
  path, apply the precedence rule, then emit both `matchedScopes[]` and the
  selected winner.
- `transitional` lifecycle entries may be recommended only when the route states why no canonical primitive is better for that surface.
- `deprecated` lifecycle entries must never be recommended except as migration-from evidence.
- `unknown` surface scope must not be treated as safe for automatic implementation.
- Deterministic output uses UTF-8 text, LF newlines, POSIX repo-relative paths,
  sorted object keys, stable array sort keys documented per collection, and
  source digests calculated over inputs in a stable path-sorted order.
- Byte-stability applies to JSON-mode outputs emitted through a canonical
  engine-level JSON writer. Package consumers must not hand-roll serialization
  for design command payloads.
- Symlinked paths must resolve to their repository-relative real path before
  scope classification and digest reporting.
- `packages/design-system-guidance` must call exported
  `packages/agent-design-engine` route/remediation APIs rather than reading or
  parsing `AGENT_UI_ROUTING.json` directly.
- Proposal exceptions must be typed waivers with owner, justification, expiry,
  linked issue, cleanup milestone, and affected route or lifecycle entry. Free
  form grandfathering is not sufficient for hard-gate bypass.
- Proposal waivers live in `docs/design-system/proposals/waivers.json`. The
  canonical waiver validator is exported from `packages/agent-design-engine`;
  proposal-gate policy, CLI handlers, and policy scripts must consume that
  validator instead of reimplementing waiver rules.
- Read-only command handlers must have a command-boundary write-deny guard.
  `propose-abstraction` must return a dedicated error if any failure or retry
  path attempts to mutate the filesystem.

## Failure Model and Recovery

### Failure Classes

- `E_DESIGN_CONTRACT_MISSING`: no usable `DESIGN.md` was found.
- `E_DESIGN_CONTRACT_AMBIGUOUS`: multiple candidate contracts exist and the command lacks explicit scope.
- `E_DESIGN_GUIDANCE_UNLINKED`: guidance config does not declare the expected design contract rollout state.
- `E_DESIGN_ROUTE_MISSING`: a known route reference expected by routing,
  lifecycle, coverage, or remediation data cannot be resolved.
- `E_DESIGN_ROUTE_AMBIGUOUS`: multiple routes match and no deterministic precedence exists.
- `E_DESIGN_SELECTOR_CONFLICT`: mutually exclusive selector flags were supplied together.
- `E_DESIGN_EXAMPLE_MISSING`: a route requires a gold example but none exists.
- `E_DESIGN_PROPOSAL_REQUIRED`: no canonical route exists for the requested
  need or surface and a new abstraction decision is needed before
  implementation can proceed.
- `E_DESIGN_CONTEXT_PACK_INVALID`: generated context pack fails schema validation.
- `E_DESIGN_REMEDIATION_UNAVAILABLE`: a finding is real but no deterministic replacement instruction exists.

### Recovery Rules

- Every failure class must have a fixture that proves the envelope status,
  `errors[].code`, required `errors[].details` keys, and whether
  `errors[].details.recovery.nextCommand` is allowed.
- When `errors[].details.recovery` appears, it must include `allowed`, `reason`,
  and `safetyClass`. It may include `nextCommand` only when `allowed` is true.
- Missing or ambiguous contracts return structured recovery with a safe `nextCommand` only when the retry is read-only and complete.
- Route-missing failures identify the drifted source reference and closest
  checked alternatives, but do not suggest inventing a route.
- Ambiguous routes list candidate routes and require either a more specific `--need` or a surface path.
- Missing examples do not block the query command, but they block promotion of the route to a hard gate.
- Unavailable remediation must include `recoveryUnavailableReason` and source references.
- No recovery payload may suggest shell-string commands in JSON mode.
- Proposal-required recovery must include the exact missing decision: route missing, lifecycle missing, coverage missing, example missing, or remediation ambiguous.
- Contract-link recovery must distinguish "guidance config is legacy by design" from "guidance config should be design-md but is unlinked."
- Read-only recovery commands may be suggested only when they cannot mutate repository state, start servers, or launch browsers.
- Recovery schema fixtures must reject unsafe `nextCommand` suggestions for
  mutating, interactive, server-start, and browser-launch command classes.
- Recovery `nextCommand` is allowlisted by command kind and required flags:
  `astudio design prepare --surface <path> --json`, `astudio design components
  --need <need> --json`, `astudio design components --surface <path> --json`,
  `astudio design coverage --component <name> --json`, and `astudio design
  propose-abstraction --need <need> [--surface <path>] --json`. No root script
  alias, server command, browser command, or shell string is allowed in JSON-mode
  recovery.

Recovery detail matrix:

| Code | Required `errors[].details` keys | `nextCommand` allowed |
| --- | --- | --- |
| `E_DESIGN_CONTRACT_MISSING` | `searchedPaths`, `expectedPath`, `contractMode` | Only if retry is an explicit read-only `prepare --surface`. |
| `E_DESIGN_CONTRACT_AMBIGUOUS` | `candidates[]`, `selectionRule`, `surfacePath` | Only if a more specific read-only command fully resolves ambiguity. |
| `E_DESIGN_GUIDANCE_UNLINKED` | `guidanceConfigPath`, `expectedDesignContract`, `actualDesignContract`, `legacyAllowed` | No mutating command; report validation command only. |
| `E_DESIGN_ROUTE_MISSING` | `sourceRef`, `routeId`, `checkedAlternatives[]` | No; this is contract drift, not a user proposal path. |
| `E_DESIGN_ROUTE_AMBIGUOUS` | `requestedNeed`, `candidateRoutes[]`, `tieBreakRule` | Yes, more specific `components --need` or `prepare --surface`. |
| `E_DESIGN_SELECTOR_CONFLICT` | `command`, `conflictingFlags[]`, `allowedSelectorModes[]` | No; caller must choose one selector mode. |
| `E_DESIGN_EXAMPLE_MISSING` | `routeId`, `requiredExampleKinds[]`, `routeMaturity` | No; block hard-gate promotion. |
| `E_DESIGN_PROPOSAL_REQUIRED` | `missingDecision`, `requestedNeed`, `normalizedNeed`, `proposalTemplatePath`, `surfacePath` when known | Yes, read-only `propose-abstraction` preview; omit `--surface` when no trustworthy surface path exists. |
| `E_DESIGN_CONTEXT_PACK_INVALID` | `schemaPath`, `validationErrors[]`, `payloadKind` | No; implementation bug. |
| `E_DESIGN_REMEDIATION_UNAVAILABLE` | `findingId`, `ambiguousAlternatives[]`, `sourceRefs[]` | No; require human decision or proposal. |

## Observability

Agent-facing commands must report:

- selected contract and discovery mode
- selected guidance config and enforcement scope
- route count and selected primary route
- missing lifecycle or coverage entries
- required validation commands
- whether a new abstraction proposal is required
- whether the result is safe for automatic implementation

Validation and CI output should make the hardening state visible:

- protected violations
- warn-scope counts
- expired exemptions
- route entries without examples
- examples without browser/a11y coverage
- lifecycle entries without coverage-matrix rows
- surfaces classified as `unknown`
- proposal-required routes by need
- transitional recommendations used by `prepare`
- stale generated context-pack artifacts if a static export is later added

## Accessibility and UI Contract

This is a standard system spec with `ui_required: true` because the output controls how agents create UI. The existing UI companion contracts are:

- `docs/design-system/PROFESSIONAL_UI_CONTRACT.md`
- `docs/design-system/AGENT_UI_ROUTING.md`
- `docs/design-system/A11Y_CONTRACTS.md`
- protected exemplar Storybook and web visual gates

A separate dedicated UI spec is not required before planning the command/query layer. A dedicated UI spec is required if implementation creates a new visible design-system showcase page, interactive design browser, or gold-example gallery beyond existing Storybook/web exemplar surfaces.

Accessibility requirements for gold examples:

- Minimum WCAG target: 2.1 AA.
- Keyboard navigation and focus order must be documented for interactive examples.
- Dynamic state changes must have accessible names or announcements where applicable.
- Icon-only controls must have accessible names.
- Loading, empty, error, busy, permission-denied, and destructive confirmation states must preserve semantic structure.
- Color contrast must use existing semantic tokens and meet 4.5:1 for normal text and 3:1 for large text or non-text UI where applicable.

## Acceptance and Test Matrix

| ID | Requirement | Verification |
| --- | --- | --- |
| SA1 | `astudio design prepare --surface <path> --json` returns one `astudio.command.v1` JSON object with surface scope, surface kind, recommended routes, required states, examples, forbidden patterns, validation commands, and source digests. | CLI fixture test plus schema validation for `astudio.design.prepare.v1`. |
| SA2 | `astudio design prepare --surface <path> --json` emits the full agent context pack and does not require parsing `AGENT_UI_ROUTING.md` prose at runtime. | Snapshot test for a protected page, settings panel, warn-scope story, and exempt file. |
| SA3 | Component routing data is available as checked-in authored machine-readable JSON with preferred component, import path, lifecycle status, examples, avoid rules, fallbacks, and validation commands. | Unit test over `AGENT_UI_ROUTING.json`; `jq` validation for JSON syntax. Generated artifacts may exist only as derived validation output, not runtime authority. |
| SA4 | Missing component routes return `E_DESIGN_PROPOSAL_REQUIRED` with checked alternatives and no invented wrapper recommendation. | CLI fixture for an unknown need. |
| SA5 | `.design-system-guidance.json` declares non-null `designContract` rollout state when `DESIGN.md` is active. | Guidance config schema test and `pnpm design-system-guidance:check:ci`. |
| SA6 | `DESIGN.md` contains no placeholder-like raw token notes such as `--color-accent: #123456` as authoritative guidance. | `pnpm agent-design:lint` fixture or direct contract lint test. |
| SA7 | Protected-surface findings include deterministic replacement instructions when the replacement is known. | Guidance CLI fixture for raw wrapper, raw color, `h-screen`, and missing async-state patterns. |
| SA8 | Findings without deterministic fixes include `recoveryUnavailableReason` and do not invent a safe next command. | CLI fixture for ambiguous remediation. |
| SA9a | Gold example wave 1 covers page shell, settings panel, async data view, and destructive confirmation patterns before route hardening depends on them. | Exemplar inventory test plus Storybook/web example existence checks for wave 1. |
| SA9b | Extended gold examples cover permission-denied or unavailable state, dense dashboard, and form validation patterns before those rule families or route needs become hard gates. | Exemplar inventory test proves deferred categories are marked non-promotable until examples exist. |
| SA10 | Gold examples include default, focus, loading, empty, error, and success or recovery states where relevant. | `pnpm test:exemplar-evaluation:list` plus state-story metadata check. |
| SA11 | Component routing queries answer by need and surface path, and coverage queries answer by component name. | CLI fixtures for `components --need`, `components --surface`, and `coverage --component`. |
| SA12 | New recommended primitives require a new abstraction proposal before becoming canonical routing targets. | Policy test that rejects lifecycle promotion without proposal, coverage, example, and validation references. |
| SA13 | Hardening from warn to error is explicit and reports before/after counts. | Guidance ratchet fixture plus `pnpm design-system-guidance:ratchet`. |
| SA14 | Agent context pack payload includes canonical deterministic validation commands, and commands that declare `packageScript` map to real root `package.json` scripts. | Unit test comparing only declared `packageScript` values to `package.json` script keys while allowing canonical direct CLI commands without a script alias. |
| SA15 | Query commands are read-only and do not mutate docs, guidance config, coverage matrix, or lifecycle manifests. | CLI write-safety tests and git-status fixture harness. |
| SA16 | Every machine-facing command emits stable key order, stable finding order, normalized paths, and deterministic source digests. | CLI byte-protocol fixture test. |
| SA17 | Route decisions preserve Apps SDK first, local composition second, fallback only for documented gaps. | Routing-table fixture derived from `AGENT_UI_ROUTING.md`. |
| SA18 | Accessibility requirements for gold examples are represented in visual/a11y validation, not only prose. | `pnpm test:a11y:widgets`, Storybook a11y checks where applicable, and exemplar state tests. |
| SA19 | `prepare` is the single public happy-path command and returns the full agent context pack; no public v1 `context` command is advertised or required. | CLI help fixture, README/docs assertion, and command payload tests. |
| SA20 | `astudio design components ...` is read-only and cannot be confused with existing write-capable `astudio components new <name>`. | CLI parser tests for both command families, including missing `--write` behavior on the existing generator. |
| SA21 | Transitional lifecycle recommendations include rationale, and deprecated lifecycle entries are never recommended as preferred routes. | Routing fixture tests over `COMPONENT_LIFECYCLE.json`. |
| SA22 | `unknown` surface scope blocks automatic implementation and emits proposal or clarification guidance. | `prepare` fixture for a path outside configured include/warn/error/exempt scopes. |
| SA23 | Missing route, missing lifecycle, missing coverage, missing example, and ambiguous remediation each produce distinct deterministic recovery details. | Error fixture matrix under `packages/cli/tests/fixtures/design-command-fixtures.json` or successor fixture set. |
| SA24 | A static generated context-pack artifact, if added, has freshness validation and cannot replace live `prepare` without a required freshness gate. | Policy test or explicit non-implementation note if static export remains out of scope for the first implementation plan. |
| SA25 | Route need names normalize through canonical IDs and aliases with deterministic tie-breaks, and unknown needs return proposal-required output. | Need-normalization fixture covering aliases, ties, and unknown needs. |
| SA26 | Every new design command validates against the full `astudio.command.v1` envelope and uses `errors[].details` for design-specific recovery data. | Schema fixture against `packages/cli/tests/fixtures/design-schemas/astudio-design-command.v1.schema.json`. |
| SA27 | `validationCommands[]` entries include `safetyClass`, and default `prepare` output recommends only `read_only` commands. | Payload fixture that rejects missing safety class and default mutating, interactive, server-start, or browser-launch commands. |
| SA28 | Overlapping surface scopes resolve with protected/error over warn over exempt over unknown and report matched rules. | Scope precedence fixture using at least one protected+warn+exempt overlap and one symlink-normalization overlap. |
| SA29 | Guidance remediation obtains route decisions through exported agent-design-engine APIs, not duplicate routing-table parsing. | Boundary test or import rule that fails direct `AGENT_UI_ROUTING.json` reads from `packages/design-system-guidance`. |
| SA30 | Proposal bypasses are typed waivers with owner, justification, expiry, linked issue, cleanup milestone, and affected route or lifecycle entry. | Policy fixture rejecting free-form grandfathering. |
| SA31 | `propose-abstraction` is read-only in v1 and cannot create, modify, or scaffold files. | CLI write-safety fixture and help-output assertion. |
| SA32 | Public v1 command names, flags, and payload semantics are additive-only after approval; breaking changes require a `*.v2` kind. | CLI fixture and schema compatibility test covering deprecated aliases and required-field additions. |
| SA33 | `prepare` reports runtime budget telemetry and stays within the documented cold/cache budget for fixture-sized inputs. | Engine/CLI timing fixture with threshold documented in the plan. |
| SA34 | `components` rejects combined `--need` and `--surface` selectors with `E_DESIGN_SELECTOR_CONFLICT`. | CLI fixture for both-flags input and recovery-schema validation. |
| SA35 | `errors[].details.recovery` uses a shared schema with `allowed`, `reason`, `safetyClass`, and conditional `nextCommand`. | Schema fixture covering all failure classes. |
| SA36 | Routing JSON is the authored machine authority, and docs/lifecycle/coverage drift is detected without regenerating routing JSON implicitly. | Drift fixture between `AGENT_UI_ROUTING.json` and `AGENT_UI_ROUTING.md`. |
| SA37 | JSON-mode output uses one canonical engine serializer across command variants. | Byte fixture comparing two invocation paths. |
| SA38 | Proposal waivers live in `docs/design-system/proposals/waivers.json` and fail when expired, ownerless, or missing cleanup metadata. | Policy fixture and near-expiry audit output. |
| SA39 | Existing `astudio design lint`, `diff`, `export`, `check-brand`, `init`, `migrate`, and `doctor` command kinds remain valid while new agent-native command kinds are added. | CLI help/schema fixtures validate legacy and new kinds under `astudio.command.v1` in the same test run. |
| SA40 | Recovery `nextCommand` suggestions are restricted to the normative read-only allowlist and reject root aliases, shell strings, server starts, browser launches, and write-capable commands. | Recovery schema fixture with positive allowlist cases and negative unsafe command cases. |

## Open Questions

- Should gold examples live only in Storybook, or should the web app also expose a small route set for agent-verifiable product patterns?
- What is the first hardening wave after protected settings and template surfaces: chat, modals, shared primitives, or dashboard/data-view surfaces?
- How should the spec represent Apps SDK primitive sufficiency when coverage data says an upstream primitive exists but product semantics require a local composition wrapper?

Resolved by planning and no longer open:

- Component routing table ownership:
  `docs/design-system/AGENT_UI_ROUTING.json`.
- Linear parent and child tracking: JSC-238 through JSC-245.
- New abstraction proposal artifact format: markdown proposals under
  `docs/design-system/proposals/`.
- First gold-example implementation wave: page shell, settings panel, async data
  view, and destructive confirmation.

## Definition of Done

- The spec has been converted into an implementation plan before code changes begin.
- The plan splits work into small validated slices with explicit package ownership.
- New command schemas are fixture-tested under `packages/cli`.
- New semantic payload logic is tested under `packages/agent-design-engine`.
- Guidance remediation and hardening behavior is tested under `packages/design-system-guidance`.
- Docs and `FORJAMIE.md` explain the new agent-native workflow.
- Required validation evidence is recorded with exact commands and pass/fail outcomes.
- No machine-facing command emits prose-only output for agent workflows.

## Planning Readiness

Readiness outcome: ready for `he-work` after the implementation plan is review
hardened and no reviewer finds blocking ambiguity.

Resolved by this deepen pass:

- The primary interface shape is frozen as `prepare` with supporting read-only
  query commands, not a purely static artifact and not a manual multi-command
  sequence.
- `prepare` includes the full context pack by default.
- `context` is not a public v1 command; context-building can exist only as internal/debug implementation detail behind `prepare`.
- `astudio design components ...` is a read-only intelligence command family and must stay separate from existing `astudio components new <name>`.
- Missing route data, unknown surface scope, and deprecated lifecycle status block automatic implementation.
- `propose-abstraction` is a read-only validator/preview in v1.
- Public v1 command names and payload meanings are additive-only after plan
  approval.
- Need normalization, route maturity, deterministic output, scope precedence,
  validation-command safety classes, and typed proposal waivers are part of the
  implementation contract.

Resolved by `he-plan`:

- routing-table ownership and storage format:
  `docs/design-system/AGENT_UI_ROUTING.json`
- first implementation slice boundaries: seven validated slices
- Linear parent/child issue structure: parent plus seven child slices
- first gold-example expansion wave: page shell, settings panel, async data
  view, and destructive confirmation
- proposal artifact storage format: markdown proposals under
  `docs/design-system/proposals/`

Recommended implementation posture: start with Slice 1 only, keep each slice
small, and rerun technical review before `he-work` starts if any slice contract
changes.

## Next Stage Handoff

Recommended next stage: `he-work` on Slice 1 once the plan passes the review
swarm.

The approved implementation sequence is:

1. Contract cleanup: link guidance config to `DESIGN.md` and remove placeholder-like token notes.
2. Component routing table: create the machine-readable route source and validation.
3. Agent context pack: add `prepare` payloads and CLI fixtures.
4. Query commands: add component and coverage lookup commands.
5. Actionable remediation: enrich guidance findings with replacement instructions.
6. Gold examples: add exemplar inventory and missing state/example coverage.
7. New abstraction proposal gate: require proposal, lifecycle, coverage, example, and validation references before canonical promotion.
