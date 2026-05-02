---
schema_version: 1
title: Agent-First Design System Simplification Specification
type: refactor
status: proposed
date: 2026-05-02
origin: "User request to turn the candid agent-first project critique and simplification recommendations into a Harness Engineering spec"
risk: high
spec_depth: full
ui_required: false
---

# Agent-First Design System Simplification Specification

## Table of Contents

- [Problem Statement](#problem-statement)
- [Goals](#goals)
- [Non-Goals](#non-goals)
- [System Boundary](#system-boundary)
- [Current Evidence](#current-evidence)
- [Core Domain Model](#core-domain-model)
- [Domain Consistency Pass](#domain-consistency-pass)
- [Selected Direction](#selected-direction)
- [Main Flow / Lifecycle](#main-flow--lifecycle)
- [Interface Alternatives](#interface-alternatives)
- [Selected Interface Contract](#selected-interface-contract)
- [Interface Contracts](#interface-contracts)
- [Simplification Contracts](#simplification-contracts)
- [Phase Gates](#phase-gates)
- [Invariants / Safety Requirements](#invariants--safety-requirements)
- [Failure Model and Recovery](#failure-model-and-recovery)
- [Observability](#observability)
- [Acceptance and Test Matrix](#acceptance-and-test-matrix)
- [Open Questions](#open-questions)
- [Definition of Done](#definition-of-done)
- [Planning Readiness](#planning-readiness)
- [Linear Traceability](#linear-traceability)

## Problem Statement

The project has a strong agent-first product spine:

- `DESIGN.md` defines the repository-level agent UI contract.
- `docs/design-system/*.json` provides routing, lifecycle, coverage, proposal, and example evidence.
- `packages/agent-design-engine` owns semantic parsing, route resolution, proposal logic, prepare-payload construction, and design-engine types.
- `packages/cli` transports `astudio design ...` commands.
- `packages/design-system-guidance` owns policy findings and remediation metadata.
- `packages/ui`, `packages/tokens`, `packages/widgets`, web, and Storybook provide implementation reality and examples.

The project is now useful because it turns scattered design-system guidance into a pre-edit contract for AI coding agents. The north star remains:

```bash
astudio design prepare --surface <path> --json
```

That command should be the required first step before an AI coding agent edits UI. It should tell the agent the canonical components, semantic token roles, required states, examples, forbidden patterns, safe validation commands, source evidence, and whether to proceed or stop.

The current risk is not that the architecture is wrong. The risk is that the repo still has too many adjacent authority surfaces, historical planning systems, large implementation files, prototype packages, duplicate command paths, and older review/report artifacts. Agents can use `prepare`, but they can still wander into obsolete or secondary material when the active path should be obvious.

This spec defines the next simplification lane: preserve the agent-design spine, make the active path unavoidable, add the missing agent-ergonomic payload affordances, and reduce repo bulk that makes the project harder for agents and humans to understand.

## Goals

- Keep `astudio design prepare --surface <path> --json` as the canonical agent pre-edit contract.
- Make the repository's active authority path obvious enough that agents do not need to infer which docs, plans, reports, or artifacts are current.
- Add agent-ergonomic prepare affordances that make the command easier to consume without creating a competing orchestration layer.
- Add explicit `nextAction`, `doNotInvent`, richer example metadata, recommendation confidence, validation failure guidance, and PR evidence output to the prepare contract or its companion command surface.
- Archive, index, or delete historical planning/review/report surfaces so they stop competing with active docs.
- Decide the fate of prototype or ambiguous packages, especially `packages/validation-prototype`, `packages/effects`, and template packages under `packages/`.
- Split large agent-design implementation files by real responsibility without changing behavior.
- Reduce root script and docs duplication after authority is clarified.
- Keep `FORJAMIE.md` focused on the current project map and move older chronology into archive/change-log surfaces.
- Preserve reviewability, deterministic validation, and proposal-gate safety while reducing cognitive load.

## Non-Goals

- Replacing the existing `prepare` command.
- Creating a second happy-path command that competes with `prepare`.
- Creating a new orchestration package or service.
- Rewriting the component library.
- Removing deterministic error handling, source digests, schema hardening, proposal gates, or changed-surface prepare evidence.
- Deleting historical docs without an index/link audit.
- Moving template packages or package boundaries without updating scripts, workspace configuration, docs, and tests in the same planned slice.
- Building a large governance dashboard.
- Making humans the primary consumer of the system. Humans must be able to inspect the contract, but AI coding agents are the primary product user.

## System Boundary

### In Scope

- `README.md`
- `FORJAMIE.md`
- `docs/guides/AGENT_DESIGN_WORKFLOW.md`
- `docs/specs/**`
- `docs/plans/**`
- `reports/**`
- `artifacts/reviews/**`
- `.spec/**`
- `.kiro/**`
- `ai/prompts/**`
- `ai/sessions/**`
- `packages/agent-design-engine/src/prepare.ts`
- `packages/agent-design-engine/src/routes.ts`
- `packages/agent-design-engine/src/proposals.ts`
- `packages/agent-design-engine/tests/engine.test.mjs`
- `packages/cli/src/commands/design.ts`
- `packages/design-system-guidance/src/core.ts`
- `packages/validation-prototype/**`
- `packages/effects/**`
- `packages/cloudflare-template/**`
- `packages/astudio-make-template/**`
- root `package.json` scripts that expose agent-design, docs, policy, prototype, and package-taxonomy surfaces
- authority indexes such as `docs/plans/README.md`, `reports/README.md`, and `artifacts/reviews/README.md`

### Out of Scope

- `codex/**` runtime configuration.
- MCP server feature behavior, unless a design command consumes it.
- Visual redesign of existing product pages.
- Publishing packages externally.
- Broad cleanup of unrelated UI debt.
- Merging PRs or resolving remote review threads as part of this spec.

## Current Evidence

The current repo already points the high-traffic agent path at `prepare`:

- `README.md` leads with `astudio design prepare --surface <path> --json`.
- `docs/guides/AGENT_DESIGN_WORKFLOW.md` starts with `prepare` and documents the build-backed wrapper/read-only distinction.
- `FORJAMIE.md` records that protected UI changes require safe prepare evidence or an explicit manual/proposal stop.
- `package.json` exposes focused `agent-design:*` scripts, including `agent-design:cli:prebuild`, `agent-design:prepare`, `agent-design:prepare:changed`, and `agent-design:prepare:smoke`.

The repo also still contains historical or secondary authority surfaces that need stricter classification:

- `.spec/**`
- `.kiro/**`
- `ai/prompts/**`
- `ai/sessions/**`
- `artifacts/reviews/**`
- `reports/archive/**`
- older `docs/plans/**`
- older `docs/specs/**`

Some of these surfaces already have partial authority indexes:

- `docs/plans/README.md`
- `reports/README.md`
- `artifacts/reviews/README.md`

The implementation core has grown large enough that responsibility-level splits are justified:

- `packages/agent-design-engine/src/prepare.ts`: 1333 lines at spec creation.
- `packages/agent-design-engine/src/routes.ts`: 958 lines at spec creation.
- `packages/agent-design-engine/src/proposals.ts`: 737 lines at spec creation.
- `packages/cli/src/commands/design.ts`: 1151 lines at spec creation.
- `packages/design-system-guidance/src/core.ts`: 1802 lines at spec creation.
- `packages/agent-design-engine/tests/engine.test.mjs`: 1773 lines at spec creation.

There are also package-taxonomy smells:

- `packages/validation-prototype` is retained behind `validation-prototype:*` scripts but is not a first-class product package.
- `packages/effects` is excluded from the root typecheck, which makes its lifecycle ambiguous.
- `packages/cloudflare-template` and `packages/astudio-make-template` live under `packages/` even though they read as templates rather than reusable libraries.
- `apps/**` contains README-level pointers while active app implementation lives under `platforms/**`.

## Core Domain Model

### Agent-First UI Contract

The repo-native contract that tells an AI coding agent what to do before it edits UI. The canonical operation is `astudio design prepare --surface <path> --json`.

### Product Spine

The minimum set of source surfaces that should remain central:

- `DESIGN.md`
- `docs/design-system/*.json`
- `packages/agent-design-engine`
- `packages/cli`
- `packages/design-system-guidance`
- `packages/ui`
- `packages/tokens`
- `packages/widgets`
- Storybook and validation gates

### Active Authority

A doc, command, package, or manifest that agents may treat as current guidance.

### Historical Evidence

A doc, report, review artifact, plan, or prompt/session artifact that exists for traceability but must not be treated as current authority unless an active index names it.

### Dead Wood

Tracked code, scripts, docs, packages, or artifacts that no longer influence behavior, validation, release, examples, or decision evidence. Dead wood should be deleted after a reference audit.

### Agent Brief

A concise, model-readable prepare summary generated from the same evidence as the JSON payload. The brief may be text or Markdown, but it is not the canonical machine contract.

### Next Action

A machine-readable instruction that tells the agent what to do after `prepare`:

- `implement`
- `stop_for_proposal`
- `stop_for_manual_decision`
- `stop_for_missing_route`
- `stop_for_validation_setup`

### Do Not Invent Contract

Explicit anti-invention guidance returned by `prepare`, mapping common agent failure modes to approved alternatives. Examples include raw colors, one-off panel shells, custom async wrappers, local empty/error/loading states, invented spacing conventions, and unapproved abstractions.

### PR Evidence

Prepare-derived Markdown that an agent can paste into a PR template or generated PR body without manually summarizing the payload.

## Domain Consistency Pass

No `CONTEXT.md` or `CONTEXT-MAP.md` exists in the repository at spec-deepening time, so this pass uses the repo's existing specs, plans, README, workflow guide, `FORJAMIE.md`, package names, and command names as the domain source.

Canonical terms for this lane:

| Term                        | Meaning                                                                                       | Avoided aliases                              |
| --------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Agent-first UI contract     | The product promise that agents ask the repo what to do before editing UI.                    | design dashboard, design governance suite    |
| Prepare                     | The canonical pre-edit operation exposed as `astudio design prepare --surface <path> --json`. | context command, preflight-ui, setup command |
| Active authority            | Current docs, commands, manifests, and packages that agents may rely on.                      | latest file, newest plan                     |
| Historical evidence         | Trace material that explains past decisions but is not current instruction.                   | legacy authority, old truth                  |
| Archive                     | A clearly indexed place for retained historical evidence.                                     | dumping ground                               |
| Obsolete/deletion candidate | Material that no current command, doc, package, or validation path references.                | dead unless proven                           |
| Agent brief                 | A concise human/model-readable rendering of the prepare payload.                              | alternate contract                           |
| PR evidence                 | Markdown generated from prepare evidence for PR handoff.                                      | hand-written summary                         |

Boundary clarifications:

- `prepare` is a command contract, not a docs-reading workflow.
- `pnpm --silent agent-design:prepare --surface <path>` is a build-backed local wrapper, not the read-only operation contract.
- `docs/guides/AGENT_DESIGN_WORKFLOW.md` should become the detailed workflow authority; README and `FORJAMIE.md` should summarize and point to it instead of duplicating it.
- Historical plans/specs remain useful evidence only when an active authority index names their role.
- Package taxonomy changes are structural changes, not cleanup-only changes, because workspace config, imports, docs, scripts, and validation can all depend on package paths.

## Selected Direction

The selected direction is to simplify around the existing command and package architecture:

1. Preserve `prepare` as the only happy-path pre-edit command.
2. Make active authority explicit and historical evidence quiet.
3. Add agent-ergonomic fields and output modes without adding a second orchestration layer.
4. Refactor large files by responsibility only after behavior is pinned by tests.
5. Decide ambiguous package lifecycles through explicit promote, quarantine, move, or delete outcomes.

The project should describe itself as:

> An agent-first UI contract system that makes coding agents ask the design system what to do before they touch UI.

The project should not describe itself primarily as a broad design-system repository when explaining the agent-design lane.

## Main Flow / Lifecycle

### Agent UI Edit Flow

1. Agent identifies a target UI surface.
2. Agent runs:

   ```bash
   astudio design prepare --surface <path> --json
   ```

3. If `safeForAutomaticImplementation` is `false`, the agent follows `nextAction` and stops for the required proposal/manual decision.
4. If `safeForAutomaticImplementation` is `true`, the agent uses returned routes, token contract, required states, examples, forbidden patterns, `doNotInvent`, and validation commands as the implementation brief.
5. Agent edits UI.
6. Agent runs returned validation commands.
7. Agent attaches or generates prepare evidence for PR handoff.

### Human Inspection Flow

1. Human chooses a surface.
2. Human views the same prepare contract through brief, PR-evidence, or future inspector output.
3. Human can see why an agent is allowed to proceed or why it must stop.
4. Human can inspect active authority without reading historical docs.

### Repo Simplification Flow

1. Identify active authority surfaces.
2. Mark historical evidence as historical in an index.
3. Delete only surfaces proven unreferenced and behaviorally irrelevant.
4. Split large implementation files after tests pin existing behavior.
5. Remove duplicate docs/scripts only after current docs no longer reference them.

## Interface Alternatives

### Shape A: Payload-First Prepare With Derived Formats

Call shape:

```bash
astudio design prepare --surface <path> --json
astudio design prepare --surface <path> --format brief
astudio design prepare --surface <path> --format pr-evidence
```

Caller usage:

```bash
astudio design prepare --surface packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx --json
astudio design prepare --surface packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx --format brief
```

What it hides internally:

- route matching,
- token-contract loading,
- example and lifecycle lookup,
- validation-command safety classification,
- next-action derivation,
- rendering of brief and PR-evidence output from the typed prepare payload.

Tradeoffs:

- Best for ease of correct use because one command family owns every pre-edit answer.
- Keeps JSON as canonical while allowing agent-readable summaries.
- Requires the CLI to support format-specific output without weakening schema tests.
- Risks a larger `prepare` command if renderers are not separated internally.

### Shape B: JSON-Only Prepare Plus Separate Renderer Commands

Call shape:

```bash
astudio design prepare --surface <path> --json
astudio design brief --surface <path>
astudio design pr-evidence --surface <path>
```

Caller usage:

```bash
astudio design brief --surface packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx
```

What it hides internally:

- The renderer commands call the same prepare builder and render specialized output.

Tradeoffs:

- Cleaner CLI command implementation boundaries.
- More discoverable for humans who want a named brief command.
- Worse for agents because it introduces multiple apparent happy paths.
- Higher risk that docs start advertising `brief` instead of `prepare`.

### Shape C: Static Context Pack Or Inspector First

Call shape:

```bash
astudio design export-context --surface <path>
astudio design inspector
```

Caller usage:

```bash
astudio design export-context --surface packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx
```

What it hides internally:

- Precomputed context packs or visual inspection surfaces cache prepare evidence.

Tradeoffs:

- Useful later for human inspection and performance caching.
- Weak first move because freshness becomes another contract.
- Risks turning an agent-first command into a dashboard-first product.
- Does not simplify the current attention path as directly as Shape A.

## Selected Interface Contract

Select Shape A.

`prepare` remains the public command family. JSON remains canonical. `brief` and `pr-evidence` are output formats rendered from the same typed `astudio.design.prepare.v1` payload, not separate sources of truth.

Selected call shapes:

```bash
astudio design prepare --surface <path> --json
astudio design prepare --surface <path> --format brief
astudio design prepare --surface <path> --format pr-evidence
```

The implementation may expose root wrappers later, but wrappers must preserve the existing wrapper distinction:

- direct `astudio design prepare` is the read-only operation contract,
- `pnpm --silent agent-design:prepare ...` may build local packages before invoking the CLI,
- JSON-capturing agents must use silent wrappers when using pnpm.

Internal responsibility split for Shape A:

- `prepare/payload.ts` builds the canonical payload.
- `prepare/brief.ts` renders the brief from the payload.
- `prepare/pr-evidence.ts` renders PR evidence from the payload.
- `prepare/next-action.ts` derives stop/proceed behavior.
- `prepare/do-not-invent.ts` maps failure modes to approved alternatives.
- `prepare/example-guidance.ts` enriches examples with usage guidance.
- `prepare/validation-commands.ts` owns command safety, package-script provenance, and failure triage.

Planning must block if a future plan attempts to add brief or PR-evidence output from a second data path.

## Interface Contracts

### Canonical JSON Contract

The canonical operation remains:

```bash
astudio design prepare --surface <path> --json
```

The `astudio.design.prepare.v1` payload must remain the machine contract. Any ergonomic output must be generated from the same underlying payload.

### Payload Extensions

The prepare payload should add:

```ts
nextAction: {
  kind:
    | "implement"
    | "stop_for_proposal"
    | "stop_for_manual_decision"
    | "stop_for_missing_route"
    | "stop_for_validation_setup";
  reasonCode?: string;
  instruction: string;
  evidenceRefs: string[];
}
```

```ts
doNotInvent: Array<{
  thing: string;
  instead: string;
  sourceRefs: string[];
}>;
```

Recommended routes should include specific confidence evidence:

```ts
confidence: {
  level: "high" | "medium" | "low";
  because: string[];
}
```

Relevant examples should explain how agents should use them:

```ts
usageGuidance: {
  copy: string[];
  doNotCopy: string[];
  proves: string[];
  maturity: "gold" | "acceptable" | "legacy" | "deferred";
}
```

Validation commands should include failure triage:

```ts
ifFails: string;
```

### Brief Output

A concise brief output may be added as an alternate format:

```bash
astudio design prepare --surface <path> --format brief
```

The brief must:

- be generated from the same prepare payload as JSON,
- show surface, status, next action, components/routes, token rules, required states, examples, forbidden patterns, and validation commands,
- avoid replacing JSON as the canonical contract,
- avoid hiding proposal/manual stop reasons.
- avoid adding prose that cannot be traced back to a payload field.

### PR Evidence Output

PR evidence may be added as:

```bash
astudio design prepare --surface <path> --format pr-evidence
```

The output must be Markdown suitable for PR handoff and must include:

- surface,
- safe/blocked status,
- route or stop reason,
- states required,
- examples used,
- validation commands,
- source evidence references.
- blocked status and `nextAction.reasonCode` when implementation is not safe.

## Simplification Contracts

### Authority Map

The repo must have a single active authority map for the agent-design lane. It must classify:

- active docs,
- active specs,
- active plans,
- historical evidence,
- archived evidence,
- obsolete/deletion candidates.

Existing indexes may be reused, but agents must not need to infer current authority from filename dates.

Minimum authority-map shape:

```ts
{
  surface: string;
  status: "active" | "historical" | "archived" | "obsolete_candidate";
  reason: string;
  replacement?: string;
  allowedUse: string[];
  lastReviewed: string;
}
```

The map may be implemented as Markdown tables in existing indexes for the first slice. A machine-readable manifest can be added later only if the Markdown authority becomes hard to validate.

### Historical Planning and Review Surfaces

`.spec/**`, `.kiro/**`, `ai/prompts/**`, `ai/sessions/**`, old `docs/plans/**`, old `docs/specs/**`, and older review/report artifacts must be either:

- indexed as historical,
- moved under a clearly historical archive,
- or deleted after a reference audit proves they are unused.

Reference audit minimum:

```bash
rg --hidden -n "<path-or-basename>" README.md FORJAMIE.md docs packages platforms apps scripts reports artifacts .spec .kiro ai package.json pnpm-workspace.yaml
```

For dot-directories or archive moves, the audit must include hidden paths explicitly, exclude `.git/**` when searching broadly, and record whether references are active, historical, or stale.

### Large File Refactor

Large files must be split only by stable responsibilities:

- `prepare/validation-commands.ts`
- `prepare/source-digests.ts`
- `prepare/payload.ts`
- `routes/schema.ts`
- `routes/matching.ts`
- `routes/path-safety.ts`
- `proposals/schema.ts`
- `proposals/waivers.ts`
- `proposals/preview.ts`
- CLI design subcommands by command responsibility.

Behavior must not change in the split slice unless the plan explicitly declares a behavior change with tests.

The split must keep public exports stable unless the plan explicitly includes a migration table. Internal helper modules should not be imported across package boundaries; existing agent-design boundary tests must stay green.

### Prototype Package Fate

`packages/validation-prototype` must be resolved to one of:

- promoted fixture/test package,
- moved fixture outside `packages/`,
- archived experimental package with explicit docs,
- deleted with scripts/docs removed.

It must not remain a first-class workspace package only because it once proved a point.

### Effects Package Fate

`packages/effects` must be resolved to one of:

- fixed and included in the root typecheck,
- merged into `packages/ui`,
- explicitly quarantined with docs, scripts, and a removal/fix path.

It must not remain silently excluded from the root typecheck without an active lifecycle status.

### Template Package Taxonomy

Template-like packages under `packages/` must be resolved to one of:

- first-class reusable library with import contract,
- moved under `templates/**`,
- retained under `packages/` with explicit rationale and tests.

### Script Surface

Root scripts must be grouped and documented by product surface. Compatibility aliases may remain only when:

- a current doc references them,
- a migration note explains why,
- or they are required by CI/backward compatibility.

### FORJAMIE Compression

`FORJAMIE.md` should prioritize the current project map, architecture, commands, known weaknesses, and recent changes. Older chronological material should move to an archive changelog when it no longer helps Jamie re-enter the current project quickly.

## Phase Gates

### P0: Authority and Reference Audit

- Establish the active authority map.
- Classify historical and obsolete candidates.
- Run reference audits before moving/deleting.
- Update `FORJAMIE.md`.
- Validate with `pnpm docs:lint`, `pnpm test:policy`, and `git diff --check`.

Exit criteria:

- Agents can identify the current workflow authority without reading old plans/specs.
- No file is moved or deleted without recorded reference-audit evidence.

### P1: Prepare Ergonomics

- Add `nextAction`, `doNotInvent`, route confidence, example usage guidance, and validation `ifFails`.
- Tighten types and schema fixtures.
- Preserve JSON as canonical and preserve read-only behavior.

Exit criteria:

- Known safe, blocked, missing-route, and proposal-required surfaces produce deterministic next actions.
- Fixtures prove no new payload fields are undocumented or untyped.

### P2: Derived Output Formats

- Add `--format brief`.
- Add `--format pr-evidence`.
- Generate both from the typed prepare payload.

Exit criteria:

- Brief and PR-evidence outputs match JSON stop/proceed status.
- Blocked payloads cannot render as safe-to-implement prose.

### P3: Responsibility Splits

- Split large files by responsibility with no behavior change.
- Preserve public imports and command behavior.

Exit criteria:

- Before/after payload fixtures match except for intentional ordering-free changes.
- Existing engine, CLI, guidance, and boundary tests pass.

### P4: Package Taxonomy

- Decide `packages/validation-prototype`.
- Decide `packages/effects`.
- Decide template package placement.
- Update scripts, workspace config, and docs together.

Exit criteria:

- No package has an ambiguous lifecycle status.
- Root typecheck/package filters are explained or removed.

### P5: Script and FORJAMIE Compression

- Group or document canonical scripts.
- Remove stale aliases only after docs stop referencing them.
- Move older `FORJAMIE.md` chronology to an archive/change-log surface if needed.

Exit criteria:

- Agents see fewer equivalent commands.
- `FORJAMIE.md` reads as a current map, not a long execution transcript.

## Invariants / Safety Requirements

- `prepare` remains the only happy-path pre-edit command for agents.
- `astudio design prepare --surface <path> --json` remains read-only.
- Build-backed wrappers may build local packages, but docs must keep that separate from the read-only operation contract.
- No historical archive move may break docs links without an updated index or redirect.
- No package move may leave stale workspace, script, import, or docs references.
- No large-file split may change public CLI payload shape unless the acceptance matrix says it should.
- No agent-facing output may encourage raw token usage, one-off UI shells, or unapproved abstractions.
- Any new human inspector must render the same prepare contract, not a second interpretation.
- Brief and PR-evidence outputs must be regenerated from payload data on every run; cached or hand-maintained summaries are not valid.
- Archive/deletion work must be reversible through git history and must not rely on local untracked copies.
- Package taxonomy decisions must keep pnpm workspace discovery, TypeScript project references, package exports, and docs in sync.

## Failure Model and Recovery

| Failure                                                              | Required behavior                                                 | Recovery                                                                      |
| -------------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Authority map missing or ambiguous                                   | Planning stops before cleanup/deletion work.                      | Create or update the active authority map first.                              |
| Historical surface still linked as active                            | Do not archive/delete the surface yet.                            | Update links or classify the surface in the authority map.                    |
| Prepare brief diverges from JSON                                     | Treat brief output as invalid.                                    | Generate brief directly from the typed prepare payload.                       |
| PR evidence omits stop reason                                        | Treat evidence as invalid.                                        | Include `nextAction`, reason code, and source refs.                           |
| Large-file split changes behavior                                    | Revert or isolate the behavior change into its own planned slice. | Compare fixture output before/after and run focused tests.                    |
| Prototype package has live consumers                                 | Do not delete.                                                    | Promote or move it with consumer updates.                                     |
| Effects package cannot join typecheck                                | Mark explicit quarantine with owner, reason, and validation path. | Plan a fix/merge/delete slice.                                                |
| Template move breaks workspace scripts                               | Stop before completion.                                           | Update workspace config, scripts, docs, and validation evidence together.     |
| `--format brief` or `--format pr-evidence` uses a separate data path | Treat the format as invalid.                                      | Route rendering through the typed prepare payload.                            |
| Active authority map grows too broad                                 | Treat it as an authority regression.                              | Split active versus historical rows and name one detailed workflow authority. |
| Package move leaves stale imports or scripts                         | Stop before completion.                                           | Run workspace reference audits and update scripts/config/docs together.       |

## Observability

The simplification lane must record:

- active authority map updates,
- historical/archive moves,
- deleted surfaces and reference-audit evidence,
- prepare payload fixture changes,
- brief and PR-evidence output snapshots,
- before/after file split validation,
- package-taxonomy decisions,
- root script changes,
- `FORJAMIE.md` Recent Changes entries.
- reference-audit commands and outcomes,
- selected interface-shape rationale when planning derives implementation from this spec.

Prepare payload observability should add:

- `nextAction.kind`,
- recommendation confidence levels,
- example maturity,
- validation failure guidance,
- evidence references used by brief and PR-evidence outputs.

## Acceptance and Test Matrix

| ID   | Acceptance                                                                                                                                                          | Evidence                                                         |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| SA1  | The agent-design lane has a single active authority map that classifies active, historical, archived, and obsolete surfaces.                                        | Docs diff plus link check.                                       |
| SA2  | README, `FORJAMIE.md`, and `docs/guides/AGENT_DESIGN_WORKFLOW.md` do not duplicate long workflow instructions; they point to one detailed agent workflow authority. | Docs review plus docs lint.                                      |
| SA3  | `.spec/**`, `.kiro/**`, `ai/prompts/**`, `ai/sessions/**`, and older review/report/plan surfaces are indexed, archived, or deleted according to a reference audit.  | Archive/delete diff plus `rg` reference audit.                   |
| SA4  | `astudio design prepare --surface <path> --json` remains the canonical JSON contract and no second happy-path command is introduced.                                | CLI help/schema fixture and docs assertions.                     |
| SA5  | Prepare payloads include `nextAction` with a stable kind, instruction, evidence refs, and reason code when blocked.                                                 | Engine and CLI fixture tests.                                    |
| SA6  | Prepare payloads include `doNotInvent` guidance mapped to approved alternatives and source refs.                                                                    | Engine fixture test for at least one protected surface.          |
| SA7  | Recommended routes include specific confidence evidence.                                                                                                            | Engine fixture test for high and low/blocked confidence cases.   |
| SA8  | Relevant examples include usage guidance for copy, do-not-copy, proof, and maturity.                                                                                | Gold-example fixture and schema validation.                      |
| SA9  | Validation commands include `ifFails` guidance without changing read-only safety behavior.                                                                          | Engine tests and schema fixture.                                 |
| SA10 | Brief output, if implemented, is generated from the typed prepare payload and includes the same stop/proceed decision as JSON.                                      | CLI output fixture comparing JSON-derived fields.                |
| SA11 | PR-evidence output, if implemented, includes surface, status, route/stop reason, states, examples, validation commands, and evidence refs.                          | CLI output fixture and PR-template dry run.                      |
| SA12 | Large file splits preserve public behavior for prepare, routes, proposals, CLI design commands, and guidance core.                                                  | Before/after focused tests and schema fixtures.                  |
| SA13 | `packages/validation-prototype` has an explicit promote, move, archive, or delete outcome.                                                                          | Package/script/docs diff plus validation.                        |
| SA14 | `packages/effects` is fixed, merged, or explicitly quarantined with a lifecycle decision.                                                                           | Typecheck/script/docs evidence.                                  |
| SA15 | Template-like packages under `packages/` have an explicit taxonomy decision.                                                                                        | Workspace/script/docs evidence.                                  |
| SA16 | Root scripts are grouped or documented so agents know canonical commands and compatibility aliases.                                                                 | `package.json` diff plus docs check.                             |
| SA17 | `FORJAMIE.md` foregrounds current project state and moves stale chronology out of the main scanning path when appropriate.                                          | Docs diff and Recent Changes entry.                              |
| SA18 | No simplification slice removes deterministic prepare errors, schema hardening, proposal gates, source digests, or changed-surface prepare evidence.                | Regression tests and policy checks.                              |
| SA19 | Interface Shape A is preserved: brief and PR-evidence output are formats of `prepare`, generated from the typed prepare payload.                                    | CLI tests that compare JSON-derived fields with rendered output. |
| SA20 | Authority-map rows include status, reason, replacement when applicable, allowed use, and last-reviewed evidence.                                                    | Authority-map lint or docs review plus docs lint.                |
| SA21 | Reference audits cover active docs, packages, platforms, scripts, workspace config, and root package metadata before archive/delete/package moves.                  | Recorded `rg` commands and outcomes in plan ledger.              |
| SA22 | Package taxonomy decisions update workspace config, scripts, exports, docs, and validation in the same slice when paths change.                                     | Workspace command plus focused package tests.                    |

## Open Questions

- Should package taxonomy changes move templates in one PR or first mark their lifecycle in docs and delay filesystem moves?
- Should `packages/effects` be merged into `packages/ui` or repaired as a separate first-class package?
- Should historical `.spec/**` and `.kiro/**` material be moved, indexed in place, or deleted after reference audit?
- Should `FORJAMIE.md` archive older chronology into `docs/changelog/agent-design-history.md` or an existing reports/archive surface?

## Definition of Done

- Active authority is explicit.
- Historical evidence no longer competes with active agent guidance.
- `prepare` remains the one happy path.
- The prepare contract tells agents what to do next, what not to invent, what examples prove, how confident the recommendation is, and how to triage validation failures.
- Any brief or PR-evidence output is derived from JSON, not manually reinterpreted.
- Ambiguous/prototype packages have explicit lifecycle outcomes.
- Large file splits reduce cognitive load without changing behavior accidentally.
- Scripts and docs expose fewer equivalent paths.
- `FORJAMIE.md` accurately explains the simplified repo shape.

## Planning Readiness

### Recommended First Plan Slice

Start with the authority and simplification lane, not payload expansion:

1. Create or update the agent-design authority map.
2. Classify `.spec/**`, `.kiro/**`, `ai/**`, old plans/specs, reports, and review artifacts as active, historical, archived, or obsolete.
3. Record reference audits before moving or deleting anything.
4. Update README, `FORJAMIE.md`, and `docs/guides/AGENT_DESIGN_WORKFLOW.md` so there is one detailed workflow authority.
5. Record validation evidence with `pnpm docs:lint`, `pnpm test:policy`, and `git diff --check`.

### Later Plan Slices

1. Prepare ergonomics: `nextAction`, `doNotInvent`, confidence, example usage guidance, validation `ifFails`.
2. Output ergonomics: `prepare --format brief` and `prepare --format pr-evidence` generated from JSON.
3. Large-file responsibility split with no behavior change.
4. Prototype/package taxonomy decisions.
5. Root script simplification.
6. `FORJAMIE.md` compression and archive changelog.

## Linear Traceability

No Linear work item was supplied with this spec request. This specification is untracked until a future plan links it to a Linear issue or creates one.
