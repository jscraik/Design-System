---
schema_version: 1
title: Agent Design Prepare North Star Specification
type: feat
status: approved
date: 2026-04-30
origin: "North-star synthesis from architecture, API-contract, and agent-native review: astudio design prepare as the required pre-edit UI contract"
risk: high
spec_depth: full
ui_required: true
---

# Agent Design Prepare North Star Specification

## Table of Contents

- [Problem Statement](#problem-statement)
- [Goals](#goals)
- [Non-Goals](#non-goals)
- [System Boundary](#system-boundary)
- [Core Domain Model](#core-domain-model)
- [Domain Consistency Pass](#domain-consistency-pass)
- [Main Flow / Lifecycle](#main-flow--lifecycle)
- [Interface Alternatives](#interface-alternatives)
- [Selected Interface Contract](#selected-interface-contract)
- [Interfaces and Dependencies](#interfaces-and-dependencies)
- [Invariants / Safety Requirements](#invariants--safety-requirements)
- [Failure Model and Recovery](#failure-model-and-recovery)
- [Observability](#observability)
- [Acceptance and Test Matrix](#acceptance-and-test-matrix)
- [Open Questions](#open-questions)
- [Definition of Done](#definition-of-done)
- [Planning Readiness](#planning-readiness)

## Problem Statement

The project already has the pieces of an agent-native design system:

- `DESIGN.md` declares the repository-level agent UI contract.
- `packages/agent-design-engine` parses the contract, resolves routes, builds prepare payloads, validates proposals, and owns design-engine types.
- `packages/cli` exposes `astudio design prepare`, `components`, `coverage`, and `propose-abstraction` through the existing `astudio.command.v1` envelope.
- `packages/design-system-guidance` owns guidance policy and remediation metadata.
- `docs/design-system/AGENT_UI_ROUTING.json`, `COMPONENT_LIFECYCLE.json`, `COVERAGE_MATRIX.json`, `GOLD_EXAMPLES.json`, and proposal waivers provide machine-readable design-system evidence.

The gap is that agents still need too much judgment to know which surface is authoritative. `prepare` exists, but the repo has not yet made it the one required public pre-edit contract. The current payload also omits explicit semantic token guidance, has incomplete deterministic error classification, and is not yet protected by a strict per-payload schema.

The north star is:

> Before an AI coding agent edits UI, it must run `astudio design prepare --surface <path> --json`. The command returns the complete implementation context: canonical components, semantic token roles, required states, examples, forbidden patterns, safe validation commands, source evidence, and proposal-required stops.

This spec defines the contract that makes that sentence true.

## Goals

- Make `astudio design prepare --surface <path> --json` the canonical happy-path command before any protected UI edit.
- Keep the existing package architecture: engine owns semantics, CLI owns transport, guidance owns policy/remediation, UI packages own examples.
- Extend `astudio.design.prepare.v1` so the payload includes semantic token guidance, not only source digests.
- Make `prepare` return enough information that agents do not need to manually parse `AGENT_UI_ROUTING.md`, `PROFESSIONAL_UI_CONTRACT.md`, token docs, lifecycle JSON, coverage JSON, or gold-example JSON before editing.
- Add deterministic error codes for malformed/missing guidance, routing, token-contract, coverage, lifecycle, source-digest, and proposal-gate inputs.
- Tighten command schema tests so payload drift for `astudio.design.prepare.v1` fails in CI.
- Keep validation commands safe by default: `prepare` returns only commands that are read-only unless a future explicit opt-in contract is specified.
- Update high-traffic docs so humans and agents see `prepare` as the front door, not as one optional diagnostic command.
- Preserve lower-level commands (`lint`, `export`, `components`, `coverage`, `propose-abstraction`) as supporting primitives rather than competing happy paths.
- Define the companion human inspector requirement without forcing it into the first implementation slice.

## Non-Goals

- Creating a new package or orchestration service.
- Replacing the `astudio.command.v1` envelope.
- Renaming `prepare` to `preflight-ui`, `context`, or another new public command in v1.
- Rewriting the component library or token system.
- Hardening every existing warn-scope UI file in the same change.
- Making `propose-abstraction` write files in the first implementation slice.
- Approving new abstractions automatically; acceptance remains a human governance decision.
- Running browser, server-start, mutating, interactive, or network commands from `prepare`.
- Building the visual human inspector in the same slice as the machine contract.

## System Boundary

### In Scope

- `packages/agent-design-engine/src/prepare.ts`
- `packages/agent-design-engine/src/types.ts`
- `packages/agent-design-engine/src/routes.ts`
- `packages/agent-design-engine/src/proposals.ts`
- token-contract loader or helper modules inside `packages/agent-design-engine`
- `packages/cli/src/commands/design.ts`
- design command schema fixtures under `packages/cli/tests/fixtures/design-schemas`
- CLI fixture tests for `prepare`, `components`, `coverage`, and design error handling
- `docs/design-system/AGENT_UI_ROUTING.json`
- `docs/design-system/GOLD_EXAMPLES.json`
- `docs/design-system/COMPONENT_LIFECYCLE.json`
- `docs/design-system/COVERAGE_MATRIX.json`
- `docs/design-system/proposals/**`
- `docs/guides/AGENT_DESIGN_WORKFLOW.md`
- `README.md`, `FORJAMIE.md`, and CLI docs that explain the design command front door
- root script aliases in `package.json` only when needed to make the public command ergonomic

### Out of Scope

- `codex/` runtime configuration.
- MCP tool behavior unless a design command directly depends on it.
- Visual redesign of app, Storybook, or widget surfaces.
- Publishing packages externally.
- Creating a standalone design editor.
- Broad cleanup of existing guidance warn backlog.

## Core Domain Model

### Prepare Command

The public read-only command that an agent runs before editing UI:

```bash
astudio design prepare --surface <path> --json
```

It returns one `astudio.command.v1` envelope whose `data.kind` is `astudio.design.prepare.v1`.

### Surface

A repo-relative UI file path. Examples include a page, panel, component, story, or widget file. The surface must be classified against `.design-system-guidance.json` as `protected`, `warn`, `exempt`, or `unknown`.

### Surface Kind

The canonical design need resolved for the surface, such as `page_shell`, `settings_panel`, `async_collection`, `destructive_confirmation`, or another route in `AGENT_UI_ROUTING.json`.

### Recommended Route

A resolved route from `AGENT_UI_ROUTING.json` enriched with lifecycle, coverage, example, avoid, fallback, and validation-command evidence.

### Design Token Contract

A required `prepare` payload section that tells an agent which semantic token roles and CSS variables are allowed for the surface and which token patterns are forbidden.

Minimum shape:

```ts
designTokenContract: {
  mode: "semantic-only";
  allowedRoles: Array<{
    role: string;
    cssVariable?: string;
    useFor: string[];
    avoidFor?: string[];
  }>;
  forbiddenTokenPatterns: string[];
  sourceRefs: string[];
}
```

The contract must be derived from repo-owned sources such as `DESIGN.md`, token package metadata, mapped theme slots, and professional UI rule sources. The first implementation may start with a small curated semantic-role set, but it must be machine-readable and schema-required.

### Required States

The state coverage an agent must account for before implementation is considered complete. Examples include `ready`, `loading`, `empty`, `error`, `busy`, `confirming`, `submitting`, `permission_denied`, and `unavailable`.

### Gold Example

A promotable example from `GOLD_EXAMPLES.json` that includes source path, story path, test path, covered states, and validation commands. Gold examples are copyable evidence, not prose suggestions.

### Forbidden Pattern

A route-specific or token-specific pattern that agents must avoid, such as ad hoc page shells, raw hex colors, foundation-token usage in component code, unscoped global focus styles, one-off async wrappers, or nested card framing.

### Validation Command

A safe command the agent may run after editing. Default `prepare` output includes only commands with `safetyClass: "read_only"`.

Extended command shape:

```ts
{
  command: string;
  safetyClass: "read_only";
  reason: string;
  packageScript?: string;
  expectedOutcome?: string;
  timeoutClass?: "short" | "medium" | "long";
}
```

### Open Decision

A machine-readable stop, warning, or info item. Error-severity open decisions make `safeForAutomaticImplementation` false.
Each decision includes a stable `code`, human `message`, `severity`, and machine `nextAction` category of `stop`, `escalate`, or `diagnose`.

### Proposal-Required Stop

A deterministic stop when no canonical route, lifecycle, coverage, example, or unambiguous remediation path exists. Agents must not invent abstractions past this stop.

## Domain Consistency Pass

This spec introduces a public agent contract, so terms must stay stable across docs, CLI help, payload fields, and implementation plans.

No repo `CONTEXT.md` or `CONTEXT-MAP.md` exists today. The durable learned-context surface is `.harness/memory/LEARNINGS.md`, while the live source boundaries for this spec are `DESIGN.md`, `.design-system-guidance.json`, `packages/agent-design-engine`, `packages/cli`, token/theme files, and `docs/design-system/*.json`.

Use these canonical terms:

- `prepare command`: the public command `astudio design prepare --surface <path> --json`.
- `agent context pack`: the prepare payload returned for one surface.
- `design token contract`: the semantic-token section of the context pack.
- `surface`: the repo-relative UI path supplied by the caller.
- `surface kind`: the canonical need resolved from routing, such as `page_shell` or `settings_panel`.
- `recommended route`: the route from `AGENT_UI_ROUTING.json` enriched with lifecycle, coverage, examples, and validation evidence.
- `open decision`: a machine-readable decision item that can be info, warning, or blocking error.
- `proposal-required stop`: an open decision that tells the agent not to invent an abstraction.
- `Design Prepare Inspector`: the later human UI for inspecting the same context pack.

Avoid these as primary public names:

- `preflight-ui`, because it creates a second product word for the same moment.
- `context command`, because it hides the design-system responsibility.
- `component registry`, because routing is broader than component lookup and includes states, validation, examples, and proposal gates.
- `token hints`, because the token section must be a schema-required contract, not advice.

## Main Flow / Lifecycle

### 1. Agent Requests Preparation

1. Agent receives a task to create, redesign, restyle, or refactor a UI surface.
2. Agent runs `astudio design prepare --surface <path> --json` before editing.
3. CLI resolves the project root and calls the engine. The CLI does not parse docs or duplicate route logic.
4. Engine loads `DESIGN.md`, `.design-system-guidance.json`, routing JSON, lifecycle JSON, coverage JSON, gold examples, proposal data, token contract sources, and professional UI rule sources.
5. Engine normalizes paths and source digests.

### 2. Engine Classifies the Surface

1. Engine classifies the surface scope as `protected`, `warn`, `exempt`, or `unknown`.
2. Engine resolves the best route by surface pattern.
3. Engine validates the route has acceptable lifecycle, coverage, examples, source refs, and validation commands.
4. If route resolution is ambiguous or missing, engine emits deterministic open decisions and marks automatic implementation unsafe.

### 3. Engine Builds the Context Pack

The payload must include:

- `kind`
- `ok`
- `safeForAutomaticImplementation`
- `resolvedDesignFile`
- `guidanceConfigPath`
- `designContractMode`
- `surfacePath`
- `surfaceScope`
- `surfaceKind`
- `recommendedRoutes`
- `designTokenContract`
- `requiredStates`
- `forbiddenPatterns`
- `relevantExamples`
- `validationCommands`
- `ruleManifestVersion`
- `rulePackVersion`
- `ruleSourceDigests`
- `sourceDigests`
- `coverageMatrixDigest`
- `componentLifecycleDigest`
- `openDecisions`
- `timing`

The payload must be deterministic except for timing fields. If timing is included, it must live in a documented `timing` object so byte-stable fixtures can normalize or omit it.

### 4. Agent Decides Whether To Edit

1. If `safeForAutomaticImplementation` is true, the agent may edit within the task scope using the returned routes, token contract, examples, forbidden patterns, and validation commands.
2. If false, the agent stops and follows `openDecisions`.
3. If a proposal is required, the agent may run the read-only proposal preview command but must not invent a new abstraction.

### 5. Agent Validates After Editing

1. Agent runs the returned `validationCommands` that match the touched surface and risk.
2. Agent records exact command outcomes.
3. If validation fails, the agent uses deterministic remediation details where available.
4. If remediation is ambiguous, the agent stops for a human decision or proposal.

### 6. Human Inspects The Same Contract

A later UI inspector uses the same payload to show:

- chosen surface
- scope and surface kind
- recommended components
- semantic token roles
- required states
- examples
- forbidden patterns
- validation commands
- proposal-required stops

The inspector is a companion UI requirement, not part of the first machine-contract slice.

## Interface Alternatives

### Shape A: Harden Existing `prepare`

Call shape:

```bash
astudio design prepare --surface <path> --json
```

Usage example:

```bash
pnpm --silent agent-design:prepare --surface platforms/web/apps/web/src/pages/TemplateBrowserPage.tsx --json
```

Hidden complexity:

- The existing `PreparePayload` type must become the strict public contract.
- Token roles must be loaded and normalized inside `packages/agent-design-engine`.
- The existing command schema fixture must discriminate `data.kind === "astudio.design.prepare.v1"` and reject missing required prepare fields.
- Known raw engine errors in prepare/routing/guidance paths must be mapped to `DesignEngineError`.

Tradeoffs:

- Best matches the current architecture and the north-star wording.
- Keeps one public command for the pre-edit moment.
- Requires sharper tests because the command becomes a product contract, not a diagnostic helper.

### Shape B: Add A New `preflight-ui` Command

Call shape:

```bash
astudio design preflight-ui --surface <path> --json
```

Usage example:

```bash
astudio design preflight-ui --surface packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx --json
```

Hidden complexity:

- A new command must either duplicate prepare semantics or wrap prepare, lint, coverage, and components.
- Docs must explain why agents run `preflight-ui` rather than `prepare`.
- Error handling and schemas need another payload kind.

Tradeoffs:

- The name signals "before editing" clearly.
- It creates avoidable vocabulary drift and makes the existing `prepare` command feel deprecated without a real behavior difference.
- It increases the chance that agents choose the wrong entrypoint.

### Shape C: Keep Primitive Commands And Require Agent Composition

Call shape:

```bash
astudio design lint --json
astudio design components --surface <path> --json
astudio design coverage --component <name> --json
astudio design export --json
```

Usage example:

```bash
astudio design components --surface platforms/web/apps/web/src/pages/TemplateBrowserPage.tsx --json
```

Hidden complexity:

- Every agent must know the ordering, join keys, missing-data behavior, and stop conditions.
- Token guidance still has to be inferred from prose or exported contract details.
- Validation command safety and proposal-required stops are spread across multiple outputs.

Tradeoffs:

- Flexible for humans and advanced diagnostics.
- Fails the product promise because the agent has to compose the context pack itself.

### Shape D: Generate A Static Context Artifact

Call shape:

```bash
astudio design export-context --surface <path> --out artifacts/design-prepare/<surface>.json
```

Usage example:

```bash
astudio design export-context --surface packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx --out artifacts/design-prepare/apps-panel.json
```

Hidden complexity:

- The artifact needs freshness tracking against routing, lifecycle, coverage, examples, token sources, guidance config, and `DESIGN.md`.
- Agents need to know whether to trust the artifact or regenerate it.
- Generated files can drift in branches and reviews.

Tradeoffs:

- Useful later for audit trails, inspector caching, or PR attachments.
- Wrong as the canonical pre-edit interface because freshness becomes another decision agents can get wrong.

### Selected Shape

Select Shape A. `prepare` is already the right word and the right command boundary. The implementation should harden that command rather than introduce a second orchestration layer.

Shapes B, C, and D remain useful as contrast:

- B shows why a new name is unnecessary.
- C shows why the project currently feels more manual than the north star.
- D may become a reporting/cache feature after the live contract is stable.

## Selected Interface Contract

### Request

The canonical request is:

```bash
astudio design prepare --surface <repo-relative-or-absolute-path> --json
```

The root alias may wrap it for clean-checkout ergonomics:

```bash
pnpm --silent agent-design:prepare --surface <path> --json
```

The CLI must normalize the surface path and delegate semantic work to `packages/agent-design-engine`.

### Response Envelope

`prepare` emits the existing `astudio.command.v1` envelope. For success and warning statuses, `data.kind` must be `astudio.design.prepare.v1`.

Minimum required `data` fields:

```ts
{
  kind: "astudio.design.prepare.v1";
  ok: boolean;
  safeForAutomaticImplementation: boolean;
  resolvedDesignFile: string;
  guidanceConfigPath: string;
  designContractMode: "legacy" | "design-md";
  surfacePath: string;
  surfaceScope: "protected" | "warn" | "exempt" | "unknown";
  surfaceKind: string;
  recommendedRoutes: ResolvedAgentUiRoute[];
  designTokenContract: DesignTokenContract;
  requiredStates: string[];
  forbiddenPatterns: string[];
  relevantExamples: string[];
  validationCommands: AgentUiRouteValidationCommand[];
  ruleManifestVersion: string;
  rulePackVersion: string;
  ruleSourceDigests: RuleSourceDigest[];
  sourceDigests: PrepareSourceDigest[];
  coverageMatrixDigest: PrepareSourceDigest;
  componentLifecycleDigest: PrepareSourceDigest;
  openDecisions: PrepareOpenDecision[];
  timing: PrepareTiming;
}
```

### Token Contract Source Priority

The first implementation must be explicit about where semantic roles come from. Source priority is:

1. Mapped runtime theme slots in `packages/ui/src/styles/theme.css`, especially `--background`, `--foreground`, `--text-*`, `--border-*`, `--accent-*`, `--interactive-*`, `--status-*`, `--ring`, and `--overlay`.
2. Semantic aliases from `packages/tokens/src/alias-map.ts` and generated alias CSS.
3. DTCG token package metadata from `packages/tokens/src/tokens/index.dtcg.json`.
4. `DESIGN.md` and `docs/design-system/PROFESSIONAL_UI_CONTRACT.md` as policy/prose source refs.

The token contract must not direct component code to foundation tokens or raw color values. Foundation variables may remain present for backward compatibility, but the prepare contract must mark them forbidden for new protected UI work unless an explicit exemption exists.

Minimum token contract type:

```ts
export interface DesignTokenContract {
  mode: "semantic-only";
  allowedRoles: Array<{
    role: string;
    cssVariable?: string;
    useFor: string[];
    avoidFor?: string[];
  }>;
  forbiddenTokenPatterns: string[];
  sourceRefs: string[];
}
```

If the engine cannot produce this section with source refs, `safeForAutomaticImplementation` must be false and the command must return a deterministic token-contract error.

## Interfaces and Dependencies

### Public CLI Contract

Primary command:

```bash
astudio design prepare --surface <path> --json
```

Build-backed root convenience wrapper:

```bash
pnpm --silent agent-design:prepare --surface <path> --json
```

The wrapper is allowed to build local workspace packages needed by the CLI before invoking `astudio design prepare`. It must build every workspace package imported by the CLI, including `packages/agent-design-engine`, `packages/design-system-guidance`, and `packages/skill-ingestion`, so the command works after dependencies are installed. The wrapper must not bake in a default surface that collides with caller-provided `--surface`; callers provide the surface explicitly. Documentation must not describe the wrapper as the read-only contract itself; the read-only contract belongs to the underlying `astudio design prepare` operation after the CLI is available.

Supporting read-only commands:

```bash
astudio design components --need <need> --json
astudio design components --surface <path> --json
astudio design coverage --component <name> --json
astudio design propose-abstraction --need <need> --surface <path> --json
```

The `components`, `coverage`, and `propose-abstraction` commands are diagnostic/support commands. Documentation must not present them as required happy-path steps before ordinary UI edits.

### Output Contract

`prepare` emits one `astudio.command.v1` JSON object. The schema must discriminate on `data.kind` and enforce required fields for `astudio.design.prepare.v1`.

Breaking semantic changes require `astudio.design.prepare.v2`. Optional additive fields may remain in v1 when they do not change existing meaning.

### Engine Boundary

`packages/agent-design-engine` owns:

- `PreparePayload` type
- route loading and validation
- token contract loading
- proposal-required decisions
- source digest construction
- deterministic sorting and path normalization
- typed engine errors

### CLI Boundary

`packages/cli` owns:

- command parsing
- project-root discovery
- output envelope
- error normalization into the command schema
- exit codes
- help text and docs inventory

The CLI must not duplicate routing-table parsing, token-contract interpretation, or proposal decision logic.

### Guidance Boundary

`packages/design-system-guidance` owns:

- guidance policy checks
- violation detection
- remediation metadata
- proposal-required remediation when the fix cannot be deterministic

When `prepare` needs remediation context, it must consume exported engine/guidance APIs rather than re-reading policy docs independently.

### Source Dependencies

Required sources:

- `DESIGN.md`
- `.design-system-guidance.json`
- `docs/design-system/AGENT_UI_ROUTING.json`
- `docs/design-system/COMPONENT_LIFECYCLE.json`
- `docs/design-system/COVERAGE_MATRIX.json`
- `docs/design-system/GOLD_EXAMPLES.json`
- `docs/design-system/PROFESSIONAL_UI_CONTRACT.md`
- token package source needed for semantic roles
- proposal template and waiver registry

If any required source is missing or malformed, `prepare` must return a deterministic design error, not a generic internal error.

## Invariants / Safety Requirements

- `astudio design prepare` is read-only once the CLI is available.
- `astudio design prepare` must never edit files, refresh generated artifacts, start servers, open browsers, install dependencies, call networks, or run validation commands itself.
- `pnpm agent-design:prepare` is a repo convenience wrapper and may build local workspace packages before invoking the CLI. It must not be used as evidence that the underlying `prepare` operation mutates files.
- JSON consumers must invoke the wrapper through `pnpm --silent agent-design:prepare --surface <path> --json` because plain `pnpm` prints lifecycle banners to stdout before script output.
- Default `validationCommands` must include only `safetyClass: "read_only"`.
- `safeForAutomaticImplementation` must be false when the surface scope is `unknown`, route resolution is missing or ambiguous, a required source is malformed, token guidance cannot be produced, or a proposal-required stop exists.
- Missing route examples may be warning-severity for lookup, but they must block route promotion and hard-gate maturity.
- The engine must normalize all surface paths repo-relative with POSIX separators.
- The payload must sort arrays deterministically where order is not semantically meaningful.
- The command schema must fail on missing required fields in `astudio.design.prepare.v1`.
- Agents must not be required to parse human prose docs to perform the standard pre-edit flow.
- Lower-level commands must remain compatible but subordinate to `prepare` in docs and operating guidance.
- New public recommended primitives require proposal, lifecycle, coverage, example, and validation evidence before promotion.
- Docs must state that no protected UI change is ready until `prepare` returns `safeForAutomaticImplementation: true` or the PR explains the required manual/proposal decision.

## Failure Model and Recovery

| Failure Class                    | Code                                                         | Recovery Contract                                                                                              |
| -------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| Invalid guidance JSON            | `E_DESIGN_GUIDANCE_JSON`                                     | Return structured error with `guidanceConfigPath`; agent must stop until JSON is fixed.                        |
| Invalid guidance schema          | `E_DESIGN_GUIDANCE_SCHEMA`                                   | Return field-level detail when available; agent must stop.                                                     |
| Invalid routing schema           | `E_DESIGN_ROUTING_SCHEMA`                                    | Return route source path and failing field; agent must stop.                                                   |
| Invalid lifecycle schema         | `E_DESIGN_LIFECYCLE_SCHEMA`                                  | Return lifecycle path and failing component when available; agent must stop.                                   |
| Invalid coverage schema          | `E_DESIGN_COVERAGE_SCHEMA`                                   | Return coverage path and failing row when available; agent must stop.                                          |
| Invalid root package metadata    | `E_DESIGN_PACKAGE_JSON`                                      | Return root `package.json` path; agent must stop because validation-command package scripts cannot be trusted. |
| Missing source digest            | `E_DESIGN_SOURCE_DIGEST_MISSING`                             | Return missing source path; agent must stop because provenance is incomplete.                                  |
| Token contract unavailable       | `E_DESIGN_TOKEN_CONTRACT_MISSING`                            | Return token source refs checked; agent must stop or use proposal/manual decision.                             |
| Route missing                    | `E_DESIGN_ROUTE_MISSING`                                     | Return checked alternatives; recommend read-only `propose-abstraction`.                                        |
| Route ambiguous                  | `E_DESIGN_ROUTE_AMBIGUOUS`                                   | Return candidate routes and tie-break data; agent must ask for a narrower surface or need.                     |
| Example missing                  | `E_DESIGN_ROUTE_EXAMPLE_MISSING`                             | Stop automatic implementation until the missing example evidence is added.                                     |
| Proposal required                | `E_DESIGN_PROPOSAL_REQUIRED`                                 | Return proposal template path, need, surface when known, and missing decision.                                 |
| Selector misuse                  | `E_DESIGN_SELECTOR_CONFLICT` or `E_DESIGN_SELECTOR_REQUIRED` | Return retry-safe read-only command shape.                                                                     |
| Schema drift                     | `E_DESIGN_SCHEMA_DRIFT`                                      | Fail fixture validation when `data.kind` payload fields drift; update schema and fixtures intentionally.       |
| Clean-checkout build unavailable | `E_DESIGN_PREPARE_BUILD_UNAVAILABLE`                         | Return setup/build guidance when root alias cannot reach a built CLI or engine artifact.                       |
| Invalid validation command       | `E_DESIGN_VALIDATION_COMMAND_INVALID`                        | Return route id, command, and missing package script; exclude unsafe commands from payload.                    |
| Ambiguous token contract         | `E_DESIGN_TOKEN_CONTRACT_AMBIGUOUS`                          | Return conflicting token sources and keep automatic implementation unsafe.                                     |
| Remediation unavailable          | `E_DESIGN_REMEDIATION_UNAVAILABLE`                           | Return guidance finding and proposal/manual-decision requirement instead of guessing a fix.                    |

Raw `Error` escapes from engine prepare/routing/guidance paths are not acceptable for known design contract failures.

Failure handling rules:

- JSON parse and schema failures should be wrapped at the closest source boundary, with the source path in error details.
- Open decisions are for usable payloads with known stops; thrown `DesignEngineError` is for cases where a trustworthy payload cannot be produced.
- CLI error output must still conform to `astudio.command.v1` and include stable `code`, `message`, optional `hint`, and optional `recovery`.
- Proposal-required errors must provide a read-only next command when possible, usually `astudio design propose-abstraction --need <need> --surface <path> --json`.

## Observability

`prepare` output must include enough evidence for humans and agents to audit why a recommendation was made:

- `ruleManifestVersion`
- `rulePackVersion`
- `ruleSourceDigests`
- `sourceDigests`
- `coverageMatrixDigest`
- `componentLifecycleDigest`
- route source refs
- example source/test/story paths
- validation command reasons
- open decision codes and messages
- `timing.durationMs`

CLI output must preserve the existing envelope status and exit-code behavior:

- success exit when `ok` is true
- failure exit when error-severity open decisions make the payload unsafe
- stable machine-readable error objects for thrown engine/CLI failures

Performance telemetry is required to support future cold/cache budget tests. It must not make the default payload impossible to snapshot; fixtures may normalize the timing object.

Minimum telemetry fields:

- `meta.tool`
- `meta.version`
- `meta.outputMode`
- `data.kind`
- `data.surfacePath`
- `data.surfaceScope`
- `data.surfaceKind`
- `data.safeForAutomaticImplementation`
- `data.sourceDigests[].path`
- `data.sourceDigests[].sha256`
- `data.openDecisions[].code`
- `data.openDecisions[].severity`
- `data.openDecisions[].nextAction`
- `data.timing.durationMs`

The CLI envelope timestamp may remain wall-clock based. Engine payload timing must be isolated under `data.timing` so schema fixtures can normalize it without weakening the rest of the contract.

## Acceptance and Test Matrix

| ID   | Acceptance Criteria                                                                                                                                                                                                        | Verification                                                                                                                                                                                                 |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SA1  | `astudio design prepare --surface <path> --json` is documented as the required pre-edit command for protected UI work.                                                                                                     | README, `FORJAMIE.md`, `docs/guides/AGENT_DESIGN_WORKFLOW.md`, and CLI docs all lead with `prepare`.                                                                                                         |
| SA2  | `astudio.design.prepare.v1` includes `designTokenContract` with semantic roles, forbidden token patterns, and source refs.                                                                                                 | Engine unit test and schema fixture assert the field exists and rejects missing token contract.                                                                                                              |
| SA3  | `prepare` payload includes canonical components/routes, required states, relevant examples, forbidden patterns, validation commands, source digests, open decisions, and `safeForAutomaticImplementation`.                 | CLI fixture test for at least one page shell and one settings panel.                                                                                                                                         |
| SA4  | Default `validationCommands` returned by `prepare` include only `safetyClass: "read_only"`.                                                                                                                                | Engine unit test with mixed safety classes proves non-read-only commands are excluded.                                                                                                                       |
| SA5  | Every returned validation command with `packageScript` maps to a real script in the command's targeted workspace package manifest, after the target package directory is proven to stay inside the workspace by real path. | Tests compare `packageScript` values against the targeted package manifest, cover root scripts, package-scoped scripts, and reject symlink-escaped package directories.                                      |
| SA6  | Known malformed guidance/routing/lifecycle/coverage/token inputs return deterministic design error codes instead of generic internal errors.                                                                               | Error fixture matrix covers `E_DESIGN_GUIDANCE_JSON`, `E_DESIGN_GUIDANCE_SCHEMA`, `E_DESIGN_ROUTING_SCHEMA`, `E_DESIGN_LIFECYCLE_SCHEMA`, `E_DESIGN_COVERAGE_SCHEMA`, and `E_DESIGN_TOKEN_CONTRACT_MISSING`. |
| SA7  | `astudio.command.v1` schema discriminates by `data.kind` and enforces required fields for `astudio.design.prepare.v1`.                                                                                                     | Schema fixture fails when required prepare fields are removed or renamed.                                                                                                                                    |
| SA8  | `prepare` marks unknown, missing-route, ambiguous-route, missing-token-contract, and proposal-required cases unsafe for automatic implementation.                                                                          | Engine/CLI fixtures assert `safeForAutomaticImplementation: false` and specific open decision codes.                                                                                                         |
| SA9  | Lower-level commands remain available but docs present them as support/diagnostic paths, not the main pre-edit flow.                                                                                                       | Docs assertion or review check over workflow/README/CLI docs.                                                                                                                                                |
| SA10 | `propose-abstraction` remains read-only in v1 and does not scaffold files.                                                                                                                                                 | CLI write-safety fixture verifies no working-tree changes.                                                                                                                                                   |
| SA11 | The three currently deferred gold-example categories are tracked as explicit product milestones before hard-gating those route families.                                                                                   | `GOLD_EXAMPLES.json` keeps non-promotable categories or promotes them only with source/story/test paths and validation commands.                                                                             |
| SA12 | The payload contains `timing.durationMs` without destabilizing deterministic fixture comparison.                                                                                                                           | Fixture normalizes timing and asserts field shape.                                                                                                                                                           |
| SA13 | `safeForAutomaticImplementation: true` is required or a proposal/manual-decision explanation is recorded before protected UI work is considered ready.                                                                     | PR template, workflow docs, or policy docs include the operating rule.                                                                                                                                       |
| SA14 | A companion human inspector is specified but not required for the first machine-contract implementation slice.                                                                                                             | Planning readiness names the inspector as deferred UI scope and recommends a dedicated UI spec before implementation.                                                                                        |
| SA15 | The command can run from a clean checkout through the documented root alias or returns a deterministic setup/build precondition error.                                                                                     | CLI/root script smoke test covers `pnpm --silent agent-design:prepare --surface <path> --json`.                                                                                                              |
| SA16 | The spec records interface alternatives and selects the existing `prepare` command as the public contract.                                                                                                                 | Spec review confirms Shape A is selected and Shapes B-D are rejected/deferred with tradeoffs.                                                                                                                |
| SA17 | Token contract source priority is deterministic and source-ref backed.                                                                                                                                                     | Unit test proves roles are produced from mapped theme slots/aliases and include source refs.                                                                                                                 |
| SA18 | Foundation tokens and raw color values are forbidden for new protected UI work unless explicitly exempted.                                                                                                                 | Token-contract fixture includes forbidden token patterns and protected-surface test rejects missing patterns.                                                                                                |
| SA19 | Schema validation rejects a prepare payload missing `designTokenContract`, `timing`, `safeForAutomaticImplementation`, or source digests.                                                                                  | `astudio-design-command.v1.schema.json` fixture has a prepare-specific branch and negative fixtures.                                                                                                         |
| SA20 | Known raw prepare/routing/guidance failures are mapped to `DesignEngineError` codes.                                                                                                                                       | Error tests cover invalid JSON, invalid schemas, missing digests, missing token contract, and invalid validation command script references.                                                                  |
| SA21 | A static/generated context artifact is not treated as authority in v1.                                                                                                                                                     | Docs and tests keep the live `prepare` command as the required front door; any artifact output is deferred or freshness-gated.                                                                               |
| SA22 | Docs do not describe primitive command composition as the required pre-edit happy path.                                                                                                                                    | Docs check or review confirms `lint`, `components`, `coverage`, and `export` are support commands after `prepare`.                                                                                           |
| SA23 | Completed plan phases have machine-verifiable evidence locators.                                                                                                                                                           | Each completed phase records command, exit code, surface or failure class, commit SHA when available, and artifact/log path or transcript anchor.                                                            |
| SA24 | Wrapper reliability is proven across success, warn/exempt, and unknown/missing-route prepare outcomes; proposal-required behavior is proven through a read-only proposal preview.                                          | Wrapper matrix covers one successful protected surface plus deterministic unsafe/failure examples for non-happy prepare paths; proposal preview covers `E_DESIGN_PROPOSAL_REQUIRED`.                         |
| SA25 | Proposal and unsafe stops use stable decision codes with prescribed next-action categories.                                                                                                                                | Engine/CLI fixtures assert `openDecisions[].code`, severity, and next-action mapping for unknown, ambiguous, missing-example, and proposal-required stops.                                                   |

## Resolved Decisions and Follow-Ups

Resolved for this v1 machine-contract slice:

- `designTokenContract.allowedRoles` starts from mapped semantic slots and token aliases only; generated token package metadata may enrich a later inspector or export surface, but it is not the first-slice authority.
- `timing` is included by default in every `astudio.design.prepare.v1` payload. Fixture tests normalize wall-clock fields instead of making timing debug-only.
- `prepare` may include read-only guidance diagnostics when they are already available, but remediation composition is not required for the first slice. Remediation enrichment is a follow-up after the token, schema, and stop-code contract is stable.

## Open Questions

Deferred follow-up questions:

- Which UI surface should become the first human Design Prepare Inspector: web app page, Storybook page, or CLI-rendered markdown artifact?
- Should proposal scaffolding get a separate future command such as `astudio design propose-abstraction --write`, or should write-gated proposal creation live outside `astudio design`?

## Definition of Done

- `astudio design prepare --surface <path> --json` is the documented pre-edit UI command in high-traffic docs.
- `PreparePayload` includes `designTokenContract` and `timing`.
- Known prepare/routing/guidance/token failure classes have deterministic design error codes.
- Schema fixtures enforce `astudio.design.prepare.v1` fields.
- The root alias is verified or fails with deterministic setup guidance.
- Validation commands are read-only by default and package-script references are checked.
- Deferred gold-example categories remain explicit and cannot be silently promoted.
- `FORJAMIE.md` records the operating model.
- Planning can reference SA IDs directly without inventing interface semantics.

## Planning Readiness

Spec mode: `standard-spec`.

Spec depth: `full`, because this changes agent behavior, CLI/API contracts, schema validation, failure handling, docs routing, and future UI inspection.

UI companion: required. The machine-contract slice can proceed first, but the human Design Prepare Inspector needs a dedicated UI spec before implementation.

First recommended `he-plan` slice:

1. Prove wrapper reliability and classification: verify `pnpm --silent agent-design:prepare --surface <path> --json` builds every CLI workspace dependency before invoking prepare and emits parseable JSON, or returns a deterministic setup/build precondition error such as `E_DESIGN_PREPARE_BUILD_UNAVAILABLE`; classify it as build-backed setup while keeping `astudio design prepare` as the read-only operation contract.
2. Harden schema and error contracts: add prepare-specific schema enforcement, negative fixtures, and deterministic `DesignEngineError` wrapping for known prepare/routing/guidance failures.
3. Add token contract loading: produce `designTokenContract` from mapped semantic theme slots and token aliases, include source refs, and forbid foundation/raw-token patterns for protected UI.
4. Wire payload fixtures and root alias smoke: assert `timing`, token contract, read-only validation commands, source digests, and clean-checkout behavior through `pnpm --silent agent-design:prepare --surface <path> --json`.
5. Flip high-traffic docs: make `prepare` the first happy-path step in README, `FORJAMIE.md`, workflow docs, and CLI docs while demoting primitive commands to diagnostics.

Deferred scope for the first plan:

- human inspector UI
- write-gated proposal scaffolding
- promotion of all deferred gold examples
- broad warn-backlog cleanup
- v2 command naming or envelope changes

Planning constraint:

- Do not create a new package or competing public command. Keep `prepare` as the north-star command and improve the existing engine/CLI/guidance boundaries.
