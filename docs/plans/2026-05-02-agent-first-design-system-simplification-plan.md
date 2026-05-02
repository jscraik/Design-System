---
schema_version: 1
title: Agent-First Design System Simplification Plan
type: refactor
status: active
date: 2026-05-02
source_spec: docs/specs/2026-05-02-agent-first-design-system-simplification-spec.md
plan_route: fresh
plan_depth: deep
next_stage: he-work
linear_status: untracked
---

# Agent-First Design System Simplification Plan

## Table of Contents

- [Overview](#overview)
- [Planning Readiness](#planning-readiness)
- [Requirements Trace](#requirements-trace)
- [Scope Boundaries](#scope-boundaries)
- [Context and Research](#context-and-research)
- [Technical Decisions](#technical-decisions)
- [Implementation Plan](#implementation-plan)
- [Acceptance Criteria](#acceptance-criteria)
- [Execution Checkpoints](#execution-checkpoints)
- [Risks and Rollback](#risks-and-rollback)
- [Validation Ladder](#validation-ladder)
- [Machine Evidence Contract](#machine-evidence-contract)
- [First Work Packet](#first-work-packet)
- [Execution Ledger](#execution-ledger)
- [Linear Traceability](#linear-traceability)
- [References](#references)

## Overview

This plan turns the agent-first simplification spec into an executable delivery sequence.

The product spine is already good: `DESIGN.md`, `docs/design-system/*.json`, `packages/agent-design-engine`, `packages/cli`, `packages/design-system-guidance`, `packages/ui`, `packages/tokens`, `packages/widgets`, Storybook, and validation gates should remain central.

The work here is to make the repo look and behave as focused as that spine already is. The plan reduces agent confusion by clarifying active authority, quieting historical evidence, adding agent-ergonomic prepare affordances, and deciding ambiguous package/script/doc lifecycles without weakening the existing `prepare` contract.

The canonical agent command remains:

```bash
astudio design prepare --surface <path> --json
```

No phase may introduce a competing happy-path command.

## Planning Readiness

| Check               | Result    | Evidence                                                                                                                                                                                                         |
| ------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Plan route          | `fresh`   | No existing `2026-05-02` simplification plan exists under `docs/plans/`.                                                                                                                                         |
| Plan depth          | `deep`    | The work touches docs authority, archive/reference rules, public CLI output formats, engine payload fields, package taxonomy, scripts, and large-file refactors.                                                 |
| Source authority    | Ready     | `docs/specs/2026-05-02-agent-first-design-system-simplification-spec.md` defines the product spine, interface alternatives, selected Shape A, SA1-SA22, phase gates, and first planning slice.                   |
| Domain readiness    | Ready     | No repo `CONTEXT.md` or `CONTEXT-MAP.md` exists. The source spec defines canonical terms for active authority, historical evidence, archive, obsolete/deletion candidate, agent brief, PR evidence, and prepare. |
| Interface readiness | Ready     | Shape A is selected: `prepare` remains the command family, while `--format brief` and `--format pr-evidence` are derived from the typed prepare payload.                                                         |
| Linear readiness    | Untracked | No Linear issue was supplied. Jamie approved local HE heartbeat execution for this plan on 2026-05-02. Tracked project delivery should still create or link a Linear issue before external tracker closure.      |

## Requirements Trace

| Requirement                                                                                                         | Source acceptance IDs                     | Planned phases |
| ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | -------------- |
| R1: Make active authority explicit and prevent old docs/plans/reports/reviews from competing with current guidance. | SA1, SA2, SA3, SA20, SA21                 | P0             |
| R2: Preserve `prepare` as the only happy-path agent pre-edit command.                                               | SA4, SA18, SA19                           | P0, P1, P2     |
| R3: Add agent-ergonomic prepare guidance without a second data path.                                                | SA5, SA6, SA7, SA8, SA9, SA10, SA11, SA19 | P1, P2         |
| R4: Split large implementation files by responsibility without behavior drift.                                      | SA12, SA18                                | P3             |
| R5: Resolve ambiguous package taxonomy for prototypes, effects, and templates.                                      | SA13, SA14, SA15, SA22                    | P4             |
| R6: Reduce script/docs duplication and keep `FORJAMIE.md` as a current project map.                                 | SA16, SA17                                | P5             |

## Scope Boundaries

In scope:

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

Out of scope:

- `codex/**` runtime configuration.
- MCP feature behavior unless a design command consumes it.
- Visual redesign of existing product pages.
- Publishing packages externally.
- Broad cleanup of unrelated UI debt.
- Merging PRs or resolving remote review threads.
- Replacing the existing `prepare` command.
- Creating a second orchestration package.

## Context and Research

Current authority and workflow surfaces:

- `README.md` already leads agents toward `astudio design prepare --surface <path> --json`.
- `docs/guides/AGENT_DESIGN_WORKFLOW.md` already documents the direct command and the build-backed wrapper/read-only distinction.
- `FORJAMIE.md` already records that protected UI changes require safe prepare evidence or explicit manual/proposal stops.
- `docs/plans/README.md`, `reports/README.md`, and `artifacts/reviews/README.md` already provide partial authority indexes.

Current historical/noisy surfaces to classify:

- `.spec/**`
- `.kiro/**`
- `ai/prompts/**`
- `ai/sessions/**`
- older `docs/plans/**`
- older `docs/specs/**`
- `reports/archive/**`
- older `artifacts/reviews/**`

Current large files named by the spec:

- `packages/agent-design-engine/src/prepare.ts`
- `packages/agent-design-engine/src/routes.ts`
- `packages/agent-design-engine/src/proposals.ts`
- `packages/cli/src/commands/design.ts`
- `packages/design-system-guidance/src/core.ts`
- `packages/agent-design-engine/tests/engine.test.mjs`

Current taxonomy candidates:

- `packages/validation-prototype`
- `packages/effects`
- `packages/cloudflare-template`
- `packages/astudio-make-template`
- top-level `apps/**` README pointers versus active `platforms/**` app implementation

Current validation commands relevant to this plan:

```bash
pnpm docs:lint
pnpm test:policy
pnpm agent-design:test
pnpm -C packages/cli test
pnpm -C packages/design-system-guidance check:ci
pnpm build
git diff --check
```

## Technical Decisions

1. Keep `prepare` as the one happy path.

   `astudio design prepare --surface <path> --json` remains the canonical machine contract. Brief and PR evidence must be output formats of `prepare`, not new happy-path commands.

2. Do authority cleanup before payload expansion.

   The first implementation slice must make active authority explicit and classify historical surfaces before adding more prepare fields. Otherwise new behavior lands into the same noisy repo shape the spec is trying to fix.

3. Use Markdown authority maps first.

   Existing indexes can be extended before introducing a machine-readable authority manifest. A manifest is useful only if Markdown rows become hard to validate.

4. Require reference audits before moves/deletes.

   Archive, delete, or package-move work must record `rg --hidden` reference audits across active docs, packages, platforms, scripts, reports, artifacts, dot-directories, and workspace config.

5. Split large files only after behavior is pinned.

   P3 must be a responsibility split, not a behavior rewrite. Public exports and CLI payloads stay stable unless a phase explicitly includes a migration table.

6. Resolve package taxonomy with explicit lifecycle outcomes.

   Prototype, effects, and template packages must end in a named state: promoted, moved, archived/quarantined, merged, retained with rationale, or deleted.

## Implementation Plan

### P0: Authority Map and Reference Audit

Goal: make the active agent-design authority path obvious before changing behavior.

Files:

- `docs/plans/README.md`
- `reports/README.md`
- `artifacts/reviews/README.md`
- `README.md`
- `FORJAMIE.md`
- `docs/guides/AGENT_DESIGN_WORKFLOW.md`
- candidate historical surfaces under `.spec/**`, `.kiro/**`, `ai/**`, old `docs/plans/**`, old `docs/specs/**`, `reports/**`, and `artifacts/reviews/**`

Tasks:

- Create or update the agent-design authority map using the source spec's minimum row shape: `surface`, `status`, `reason`, `replacement`, `allowedUse`, and `lastReviewed`.
- Classify active, historical, archived, and obsolete/deletion-candidate surfaces.
- Name one detailed workflow authority for agent UI work. The expected authority is `docs/guides/AGENT_DESIGN_WORKFLOW.md`.
- Convert README and `FORJAMIE.md` to concise pointers where they duplicate the detailed workflow.
- Run and record hidden-path reference audits before moving or deleting any historical material:

  ```bash
  rg --hidden -n "<path-or-basename>" README.md FORJAMIE.md docs packages platforms apps scripts reports artifacts .spec .kiro ai package.json pnpm-workspace.yaml
  ```

- Do not move or delete files in P0 unless the plan ledger records audit evidence for that exact path or cluster.

Exit criteria:

- Agents can identify the current workflow authority without reading old plans/specs.
- Every P0 move/delete has reference-audit evidence.
- High-traffic docs do not present multiple equivalent agent workflow paths.

Validation:

```bash
pnpm docs:lint
pnpm test:policy
git diff --check
```

### P1: Prepare Ergonomics Payload

Goal: make `prepare` tell agents what to do next, what not to invent, why a recommendation is trusted, how to use examples, and how to triage validation failures.

Files:

- `packages/agent-design-engine/src/types.ts`
- `packages/agent-design-engine/src/prepare.ts`
- new helper modules under `packages/agent-design-engine/src/prepare/**` as needed
- `packages/agent-design-engine/tests/**`
- `packages/cli/tests/fixtures/design-schemas/astudio-design-command.v1.schema.json`
- `docs/design-system/GOLD_EXAMPLES.json`
- `docs/design-system/AGENT_UI_ROUTING.json`
- `FORJAMIE.md`

Tasks:

- Add `nextAction` to `astudio.design.prepare.v1`.
- Add `doNotInvent` guidance mapped to approved alternatives and source refs.
- Add route `confidence` with evidence.
- Add example `usageGuidance` with `copy`, `doNotCopy`, `proves`, and `maturity`.
- Add validation-command `ifFails` guidance.
- Extend schema fixtures and negative tests so new fields are typed and fail closed.
- Preserve existing read-only validation-command safety and deterministic errors.

Exit criteria:

- Known safe, blocked, missing-route, and proposal-required surfaces produce deterministic next actions.
- New payload fields are schema-covered and fixture-tested.
- No renderer or summary path is introduced in P1.

Validation:

```bash
pnpm agent-design:test
pnpm -C packages/cli test
git diff --check
```

### P2: Derived Brief and PR Evidence Formats

Goal: add agent-readable and PR-ready output without creating a second source of truth.

Files:

- `packages/cli/src/commands/design.ts`
- `packages/agent-design-engine/src/prepare/**`
- `packages/cli/tests/**`
- `packages/agent-design-engine/tests/**`
- `.github/PULL_REQUEST_TEMPLATE.md` if evidence wording needs alignment
- `README.md`
- `docs/guides/AGENT_DESIGN_WORKFLOW.md`
- `FORJAMIE.md`

Tasks:

- Add `astudio design prepare --surface <path> --format brief`.
- Add `astudio design prepare --surface <path> --format pr-evidence`.
- Generate both formats from the typed prepare payload.
- Add tests proving brief and PR-evidence output match JSON stop/proceed status.
- Add blocked-output tests proving unsafe payloads cannot render as safe-to-implement prose.
- Document that JSON remains the canonical machine contract.

Exit criteria:

- Brief and PR-evidence formats use the typed payload as their only data path.
- JSON-capturing agents still use `--json`.
- Docs do not advertise brief or PR-evidence as a replacement for JSON.

Validation:

```bash
pnpm agent-design:test
pnpm -C packages/cli test
pnpm docs:lint
git diff --check
```

### P3: Responsibility Splits With Behavior Locked

Goal: reduce future agent mistakes by splitting large files along real responsibility boundaries without behavior drift.

Files:

- `packages/agent-design-engine/src/prepare.ts`
- `packages/agent-design-engine/src/routes.ts`
- `packages/agent-design-engine/src/proposals.ts`
- `packages/cli/src/commands/design.ts`
- `packages/design-system-guidance/src/core.ts`
- `packages/agent-design-engine/tests/engine.test.mjs`
- boundary tests and package export files as needed

Tasks:

- Split prepare internals toward:
  - `prepare/payload.ts`
  - `prepare/brief.ts`
  - `prepare/pr-evidence.ts`
  - `prepare/next-action.ts`
  - `prepare/do-not-invent.ts`
  - `prepare/example-guidance.ts`
  - `prepare/validation-commands.ts`
- Split routes internals toward:
  - `routes/schema.ts`
  - `routes/matching.ts`
  - `routes/path-safety.ts`
- Split proposals internals toward:
  - `proposals/schema.ts`
  - `proposals/waivers.ts`
  - `proposals/preview.ts`
- Split CLI design subcommands by command responsibility.
- Split large test fixtures only when doing so improves behavior coverage and not merely file length.
- Preserve public exports unless the phase adds an explicit migration table.

Exit criteria:

- Public CLI payloads and prepare behavior match before/after fixtures.
- Boundary tests prevent cross-package deep imports.
- No unrelated behavior change is mixed into the split.

Validation:

```bash
pnpm agent-design:test
pnpm -C packages/cli test
pnpm -C packages/design-system-guidance check:ci
pnpm test:policy
git diff --check
```

### P4: Package Taxonomy Decisions

Goal: remove ambiguous package lifecycle states.

Files:

- `package.json`
- `pnpm-workspace.yaml`
- `packages/validation-prototype/**`
- `packages/effects/**`
- `packages/cloudflare-template/**`
- `packages/astudio-make-template/**`
- `apps/**`
- `platforms/**`
- related docs and scripts
- `FORJAMIE.md`

Tasks:

- Decide `packages/validation-prototype`: promote fixture, move fixture, archive experimental package, or delete.
- Decide `packages/effects`: fix and include in root typecheck, merge into `packages/ui`, or explicitly quarantine with owner/reason/fix path.
- Decide template package placement: first-class package, `templates/**`, or retained under `packages/` with rationale and tests.
- Decide whether top-level `apps/**` remains as README pointers or collapses into a single redirect/index.
- Update workspace config, scripts, package exports, docs, and validation together for any move.

Exit criteria:

- No package in scope has an ambiguous lifecycle status.
- Root typecheck filters are explained or removed.
- Package moves do not leave stale imports, scripts, docs, or workspace references.

Validation:

```bash
pnpm build
pnpm test:policy
pnpm docs:lint
git diff --check
```

### P5: Script Surface and FORJAMIE Compression

Goal: make command discovery and project re-entry simpler.

Files:

- `package.json`
- `README.md`
- `docs/guides/AGENT_DESIGN_WORKFLOW.md`
- `FORJAMIE.md`
- optional archive changelog under `docs/**` or `reports/archive/**`

Tasks:

- Group or document root scripts by product surface.
- Remove stale compatibility aliases only after docs stop referencing them.
- Keep canonical agent-design commands prominent:
  - `pnpm --silent agent-design:prepare --surface <path>`
  - `pnpm agent-design:prepare:changed`
  - `pnpm agent-design:lint`
  - `pnpm agent-design:test`
- Compress `FORJAMIE.md` so it foregrounds current status, architecture, commands, weaknesses, and recent changes.
- Move older chronological material into an indexed archive changelog only if it improves scanning.

Exit criteria:

- Agents see fewer equivalent commands.
- `FORJAMIE.md` reads as a current map rather than an execution transcript.
- Removed aliases have no active references.

Validation:

```bash
pnpm docs:lint
pnpm test:policy
git diff --check
```

## Acceptance Criteria

| ID   | Acceptance                                                                                                                                                               | Evidence                                    |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| AC1  | Authority map rows classify active, historical, archived, and obsolete-candidate surfaces with reason, replacement when applicable, allowed use, and last-reviewed date. | P0 diff plus docs lint.                     |
| AC2  | README, `FORJAMIE.md`, and `docs/guides/AGENT_DESIGN_WORKFLOW.md` name one detailed agent workflow authority.                                                            | P0 docs diff.                               |
| AC3  | Historical/archive/deletion work records `rg --hidden` reference audits before moves/deletes.                                                                            | P0 plan ledger evidence.                    |
| AC4  | `prepare` remains the only happy-path pre-edit command.                                                                                                                  | P0-P2 docs and CLI tests.                   |
| AC5  | `nextAction`, `doNotInvent`, route confidence, example usage guidance, and validation `ifFails` are typed and schema-covered.                                            | P1 engine and CLI fixture tests.            |
| AC6  | `--format brief` and `--format pr-evidence` are derived from typed prepare payload data.                                                                                 | P2 CLI tests comparing JSON-derived fields. |
| AC7  | Unsafe prepare payloads cannot render brief or PR evidence that says implementation is safe.                                                                             | P2 negative tests.                          |
| AC8  | Large-file responsibility splits preserve public behavior.                                                                                                               | P3 before/after fixture evidence and tests. |
| AC9  | Prototype, effects, template, and app-pointer lifecycle decisions are explicit.                                                                                          | P4 docs/package diff.                       |
| AC10 | Workspace config, scripts, docs, and package exports stay in sync after any package move.                                                                                | P4 validation evidence.                     |
| AC11 | Script surface is simpler and compatibility aliases have active references or are removed.                                                                               | P5 reference audit plus docs diff.          |
| AC12 | `FORJAMIE.md` remains current and is updated in every behavior/structure/tooling phase.                                                                                  | Phase diffs and Recent Changes entries.     |

## Execution Checkpoints

Before each phase:

- Re-read `docs/specs/2026-05-02-agent-first-design-system-simplification-spec.md`.
- Check `git status --short --branch`.
- Confirm whether a Linear issue has been linked since plan creation.
- Confirm no unrelated user changes are being overwritten.

Between phases:

- Run a simplify pass over the phase diff.
- Run an HE code-review readiness pass over the phase diff.
- Fix P0/P1/P2 actionable findings before proceeding.
- Record validation evidence before marking the phase complete.
- Update `FORJAMIE.md` when behavior, structure, tooling, workflow, or authority changes.

After each phase:

- Commit only the completed phase when requested by the user or by a heartbeat/PR workflow.
- Keep phase commits atomic.
- Do not merge unrelated cleanup into the phase.

## Risks and Rollback

| Risk                                                       | Impact                                      | Mitigation                                                                              | Rollback                                                            |
| ---------------------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Authority cleanup deletes useful historical context.       | Agents or humans lose decision evidence.    | Require indexed classification and reference audits before moves/deletes.               | Restore from git and reclassify as historical.                      |
| Brief/PR evidence becomes a second truth.                  | Agents follow stale or contradictory prose. | Generate only from typed prepare payload and compare tests against JSON.                | Remove format output and keep JSON only.                            |
| File split changes behavior.                               | Prepare/CLI/guidance regressions.           | Pin fixtures before split and keep public exports stable.                               | Revert split commit.                                                |
| Package move breaks workspace references.                  | Build/typecheck/CI failures.                | Audit imports/scripts/docs/workspace config before and after move.                      | Revert move or add compatibility wrapper with explicit deprecation. |
| Script cleanup removes used aliases.                       | CI or developer workflow breakage.          | Reference audit before removal.                                                         | Restore alias and document deprecation.                             |
| Plan proceeds without tracker when project expects Linear. | Work loses external traceability.           | Keep `linear_status: untracked` visible and link/create issue before tracked execution. | Pause after P0 and create/link Linear issue.                        |

## Validation Ladder

Use the smallest validation set that covers the current phase, then broaden before PR handoff.

Docs-only P0/P5:

```bash
pnpm docs:lint
pnpm test:policy
git diff --check
```

Prepare payload and CLI P1/P2:

```bash
pnpm agent-design:test
pnpm -C packages/cli test
pnpm docs:lint
git diff --check
```

Responsibility split P3:

```bash
pnpm agent-design:test
pnpm -C packages/cli test
pnpm -C packages/design-system-guidance check:ci
pnpm test:policy
git diff --check
```

Package taxonomy P4:

```bash
pnpm build
pnpm test:policy
pnpm docs:lint
git diff --check
```

Final handoff:

```bash
pnpm build
pnpm test:policy
pnpm docs:lint
git diff --check
```

## Machine Evidence Contract

Each phase must record:

- phase ID,
- commit SHA or working-tree diff identifier,
- files changed,
- source acceptance IDs satisfied,
- validation commands run,
- command outcomes,
- unresolved risks,
- reviewer pass/fail status,
- `FORJAMIE.md` update status.

Evidence may live in the plan ledger, PR body, or a linked review artifact, but it must use exact command text and pass/fail/blocked outcomes.

## First Work Packet

Hand this packet to `he-work` first.

Objective:

- Complete P0: authority map and reference audit.

Starting files:

- `docs/specs/2026-05-02-agent-first-design-system-simplification-spec.md`
- `docs/plans/2026-05-02-agent-first-design-system-simplification-plan.md`
- `docs/plans/README.md`
- `reports/README.md`
- `artifacts/reviews/README.md`
- `README.md`
- `FORJAMIE.md`
- `docs/guides/AGENT_DESIGN_WORKFLOW.md`

Required actions:

1. Build an authority-map table that classifies active, historical, archived, and obsolete-candidate surfaces.
2. Name `docs/guides/AGENT_DESIGN_WORKFLOW.md` as the detailed agent workflow authority unless live evidence shows a better existing authority.
3. Record `rg --hidden` reference audits for every surface cluster moved, deleted, or reclassified as obsolete-candidate.
4. Keep README and `FORJAMIE.md` concise; point to the detailed workflow instead of duplicating it.
5. Do not implement payload, CLI, package, or file-split changes in P0.
6. Update `FORJAMIE.md` Recent Changes.

Required validation:

```bash
pnpm docs:lint
pnpm test:policy
git diff --check
```

Stop conditions:

- Reference audit shows a candidate archive/delete surface is still active.
- Active authority cannot be reduced to a clear front door without a product decision.
- A Linear issue becomes required by project governance before execution continues.
- Docs lint fails for reasons outside the phase scope and cannot be isolated.

## Execution Ledger

### P0 Reference Audit

Working-tree diff identifier: P0 authority-map/reference-audit slice, before the P0 phase commit.

Files changed so far:

- `README.md`
- `FORJAMIE.md`
- `docs/guides/AGENT_DESIGN_WORKFLOW.md`
- `docs/plans/README.md`
- `reports/README.md`
- `artifacts/reviews/README.md`
- `docs/plans/2026-05-02-agent-first-design-system-simplification-plan.md`

Source acceptance IDs targeted: SA1, SA2, SA3, SA20, SA21.

Reference audits:

| surface                                                                    | command                                                                                                                                                                                                                    | outcome                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.spec/**`                                                                 | `rg --hidden -n "\\.spec" README.md FORJAMIE.md docs packages platforms apps scripts reports artifacts .spec .kiro ai package.json pnpm-workspace.yaml`                                                                    | Active references still exist in `docs/validation/README.md`, `docs/guides/StatefulComponentProps.md`, `docs/architecture/001-package-structure.md`, `docs/architecture/TOP_LEVEL_INDEX.md`, `docs/operations/SLOS.md`, scripts, and `.spec/**` itself, so P0 classifies `.spec/**` as historical evidence and performs no move/delete. `.spec/archive/diagrams/*.png` remains an obsolete-candidate cluster only; deletion is deferred until exact reference evidence is recorded. |
| `.kiro/**`                                                                 | `rg --hidden -n "\\.kiro" README.md FORJAMIE.md docs packages platforms apps scripts reports artifacts .spec .kiro ai package.json pnpm-workspace.yaml`                                                                    | Active links still point at `.kiro/steering/page-development.md` from guide and architecture docs, and link/check scripts intentionally allow `.kiro`, so P0 classifies `.kiro/**` as historical/reference material and performs no move/delete.                                                                                                                                                                                                                                    |
| `ai/prompts/**` and `ai/sessions/**`                                       | `rg --hidden -n "ai/(prompts\|sessions)\|ai/" README.md FORJAMIE.md docs packages platforms apps scripts reports artifacts .spec .kiro ai package.json pnpm-workspace.yaml`                                                | `ai/README.md` owns prompt/session provenance and the current simplification plan/spec references the cluster as historical/noisy evidence. P0 classifies it as historical provenance and performs no move/delete.                                                                                                                                                                                                                                                                  |
| `docs/plans/**`, `docs/specs/**`, `reports/**`, and `artifacts/reviews/**` | `rg --hidden -n "artifacts/reviews\|reports/\|docs/plans\|docs/specs\|AGENT_DESIGN_WORKFLOW" README.md FORJAMIE.md docs packages platforms apps scripts reports artifacts .spec .kiro ai package.json pnpm-workspace.yaml` | Existing indexes already govern plans, reports, and review artifacts; P0 updates those indexes and the agent workflow authority map instead of moving/deleting files.                                                                                                                                                                                                                                                                                                               |

Validation commands:

- `pnpm docs:lint` -> pass.
- `pnpm test:policy` -> pass; existing design-system guidance warnings remained non-blocking and policy ended `policy: ok`.
- `git diff --check` -> pass.

Reviewer status:

- Simplify pass -> pass; no behavior-changing simplification applied.
- HE code-review readiness pass -> pass after adding the execution-ledger table-of-contents entry and aligning Linear readiness with approved local execution.
- HE fix-bugs pass -> pass; no reproduced validation or review bug remained after the readiness wording and TOC fixes.

`FORJAMIE.md` update status: complete; Recent Changes includes the P0 authority-map entry.

### P1 Prepare Ergonomics Payload

Working-tree diff identifier: P1 prepare-ergonomics payload slice, before the P1 phase commit.

Files changed so far:

- `packages/agent-design-engine/src/types.ts`
- `packages/agent-design-engine/src/prepare.ts`
- `packages/agent-design-engine/tests/engine.test.mjs`
- `packages/cli/tests/cli.test.mjs`
- `packages/cli/tests/fixtures/design-schemas/astudio-design-command.v1.schema.json`
- `FORJAMIE.md`
- `docs/plans/2026-05-02-agent-first-design-system-simplification-plan.md`

Source acceptance IDs targeted: SA5, SA6, SA7, SA8, SA9, AC5, AC12.

Payload contract changes:

- Added top-level `nextAction` with stable `kind`, optional `reasonCode`, implementation/stop instruction, and evidence refs.
- Added top-level `doNotInvent` guidance that maps common agent invention risks to approved route, token, and state alternatives.
- Added `recommendedRoutes[].confidence` with level and evidence reasons.
- Added `recommendedRoutes[].usageGuidance` with `copy`, `doNotCopy`, `proves`, and `maturity`.
- Added normalized validation-command `ifFails` guidance without changing the read-only package-script trust model.
- Preserved the existing `relevantExamples: string[]` contract; example ergonomics live on the recommended route to avoid a breaking shape change.
- Added `docs/design-system/GOLD_EXAMPLES.json` to `sourceDigests` so example guidance has explicit source evidence.

Validation commands:

- `pnpm agent-design:test` -> fail, then pass after the temporary prepare fixture copied `docs/design-system/GOLD_EXAMPLES.json`; rerun after source-digest coverage -> pass.
- `pnpm -C packages/cli test` -> pass; rerun after schema/source-digest coverage -> pass.
- `git diff --check` -> pass; rerun after source-digest coverage -> pass.
- `pnpm docs:lint` -> pass after phase-ledger and `FORJAMIE.md` updates.
- `pnpm --silent agent-design:prepare --surface packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx > /tmp/prepare-p1.json && jq '{kind:.data.kind,nextAction:.data.nextAction,doNotInvent:(.data.doNotInvent|length),routeConfidence:.data.recommendedRoutes[0].confidence,usageGuidance:.data.recommendedRoutes[0].usageGuidance,ifFails:.data.validationCommands[0].ifFails,hasGoldDigest:(.data.sourceDigests|map(.path)|index("docs/design-system/GOLD_EXAMPLES.json") != null)}' /tmp/prepare-p1.json` -> pass; verified the wrapper emits the new fields inside the JSON envelope `data` payload and includes the gold examples digest.

Reviewer status:

- Simplify pass -> pass; kept the slice inside existing prepare/schema/test files and only added helper functions where repeated payload construction needed named contracts.
- HE code-review readiness pass -> pass after preserving `relevantExamples` as the compatibility field, schema-covering the new fields, and adding `GOLD_EXAMPLES.json` to source digests.
- HE fix-bugs pass -> pass; reproduced fixture failure was corrected by copying the gold examples registry into prepare fixtures and rerunning focused tests.

`FORJAMIE.md` update status: complete; Recent Changes includes the P1 prepare-ergonomics entry.

### P2 Derived Brief and PR Evidence Formats

Working-tree diff identifier: P2 prepare-derived-formats slice, before the P2 phase commit.

Files changed so far:

- `packages/agent-design-engine/src/prepare.ts`
- `packages/agent-design-engine/src/index.ts`
- `packages/agent-design-engine/tests/engine.test.mjs`
- `packages/cli/src/commands/design.ts`
- `packages/cli/tests/cli.test.mjs`
- `README.md`
- `docs/guides/AGENT_DESIGN_WORKFLOW.md`
- `FORJAMIE.md`
- `docs/plans/2026-05-02-agent-first-design-system-simplification-plan.md`

Source acceptance IDs targeted: SA10, SA11, SA12, AC6, AC7, AC12.

Format contract changes:

- Added `renderPrepareBrief(payload)` and `renderPreparePrEvidence(payload)` in the agent design engine so both text outputs are derived from `PreparePayload`.
- Exported the renderers from `@brainwav/agent-design-engine`.
- Added `astudio design prepare --surface <path> --format brief`.
- Added `astudio design prepare --surface <path> --format pr-evidence`.
- Kept `--json` as the canonical machine contract and reject `--format brief` / `--format pr-evidence` when combined with `--json` or `--agent`.
- Documented the formats as human-review and PR-handoff helpers, not replacements for JSON.

Validation commands:

- `pnpm agent-design:test` -> fail on first run because renderers used `payload.surface`; fixed to use `payload.surfacePath`; rerun -> pass.
- `pnpm -C packages/cli test` -> pass.
- `pnpm -C packages/cli build` -> pass.
- `node packages/cli/dist/index.js design prepare --surface packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx --format brief > /tmp/prepare-p2-brief.txt` -> pass.
- `rg -n "Status: SAFE_TO_IMPLEMENT|Next action: implement|Do Not Invent:|Validate:" /tmp/prepare-p2-brief.txt` -> pass.
- `node packages/cli/dist/index.js design prepare --surface packages/example/UnknownSurface.tsx --format pr-evidence > /tmp/prepare-p2-pr-evidence.md` -> expected exit 1 for blocked surface; output was written for review.
- `rg -n "Status: blocked|Open decisions:|stop_for_missing_route" /tmp/prepare-p2-pr-evidence.md` -> pass; found blocked/open-decision text.
- `rg -n "Status: safe to implement" /tmp/prepare-p2-pr-evidence.md` -> expected exit 1; confirmed blocked output does not render safe-status prose.
- `pnpm docs:lint` -> pass.
- `git diff --check` -> pass.

Reviewer status:

- Simplify pass -> pass; P2 keeps rendering in the engine and uses the existing prepare command instead of adding new CLI commands or a second payload path.
- HE code-review readiness pass -> pass; tests cover safe and blocked text outputs plus JSON-mode conflicts.
- HE fix-bugs pass -> pass; the initial `surface`/`surfacePath` renderer bug was reproduced by `pnpm agent-design:test`, fixed, and rerun.

`FORJAMIE.md` update status: complete; Recent Changes includes the P2 derived-format entry.

### P3 Responsibility Split

Working-tree diff identifier: P3 prepare-renderer responsibility split, before the P3 phase commit.

Files changed so far:

- `packages/agent-design-engine/src/prepare.ts`
- `packages/agent-design-engine/src/index.ts`
- `packages/agent-design-engine/src/prepare/brief.ts`
- `packages/agent-design-engine/src/prepare/pr-evidence.ts`
- `packages/agent-design-engine/src/prepare/text.ts`
- `packages/design-system-guidance/package.json`
- `FORJAMIE.md`
- `docs/plans/2026-05-02-agent-first-design-system-simplification-plan.md`

Source acceptance IDs targeted: SA12, SA18, AC8, AC12.

Responsibility split changes:

- Moved derived prepare brief rendering from `prepare.ts` to `prepare/brief.ts`.
- Moved derived PR-evidence rendering from `prepare.ts` to `prepare/pr-evidence.ts`.
- Added `prepare/text.ts` for shared text-list/status helpers used by the two renderers.
- Preserved public engine exports for `renderPrepareBrief`, `renderPreparePrEvidence`, `buildPreparePayload`, and `serializePreparePayload`.
- Kept the JSON payload construction and CLI format contract unchanged.
- Fixed the package-local `packages/design-system-guidance` `check` and `check:ci` scripts to scan the repository root (`../..`) when invoked with `pnpm -C packages/design-system-guidance ...`; the first P3 run proved the old package-local target could not resolve repo-root routing metadata.

Validation commands:

- `pnpm agent-design:test` -> pass.
- `pnpm -C packages/cli test` -> pass.
- `pnpm -C packages/design-system-guidance check:ci` -> fail before the package-script root fix, then pass after the script scanned `../..`; remaining guidance findings are existing warn-level findings and the command exits 0.
- `pnpm test:policy` -> pass.
- `pnpm docs:lint` -> pass.
- `pnpm lint` -> pass.
- `git diff --check` -> pass.

Reviewer status:

- Simplify pass -> pass; limited P3 to the renderer extraction and the package-script target correction found by the required validation gate.
- HE code-review readiness pass -> pass; public exports remain stable, JSON payload code is untouched, and the required package-local guidance gate now runs from a correct repository root.
- HE fix-bugs pass -> pass; reproduced the `check:ci` root-resolution failure, fixed the package script, and reran the failing command plus policy validation.

`FORJAMIE.md` update status: complete; Recent Changes includes the P3 prepare-renderer split entry.

### P4 Package Taxonomy Decisions

Working-tree diff identifier: P4 package-taxonomy decision slice, before the P4 phase commit.

Files changed so far:

- `package.json`
- `README.md`
- `docs/architecture/PACKAGE_TAXONOMY.md`
- `docs/architecture/README.md`
- `docs/architecture/repo-map.md`
- `packages/effects/src/components/card/holo-card.tsx`
- `packages/effects/src/components/scroll/scroll-progress.tsx`
- `packages/effects/src/components/scroll/toc-marker.tsx`
- `packages/effects/tests/card-tilt.test.tsx`
- `packages/effects/tests/scroll.test.tsx`
- `FORJAMIE.md`
- `docs/plans/2026-05-02-agent-first-design-system-simplification-plan.md`

Source acceptance IDs targeted: SA13, SA14, SA15, SA16, SA22, AC9, AC10, AC12.

Taxonomy decisions:

- `packages/effects` is a first-class product library. The phase fixed its focused TypeScript failures and removed the root typecheck exclusion so `pnpm typecheck` now includes it.
- `packages/cloudflare-template` remains a template package under `packages/` because generated-source freshness, version-sync, deployment docs, and Cloudflare validation scripts target that path.
- `packages/astudio-make-template` remains a template package under `packages/` because it is a workspace-packaged starter template with explicit guideline and dependency inputs.
- `packages/validation-prototype` remains a validation fixture behind `pnpm validation-prototype:build` and `pnpm validation-prototype:analyze`; production source must not import it.
- `apps/` remains a README-only navigation index. Canonical app implementation stays under `platforms/**`.
- The HE fix-bugs pass found missing direct coverage for `ScrollProgress`, `HoloCard` tilt intensity, and `TocMarker`; this phase added focused regression tests and fixed selector-target scroll handling before closing P4.

Validation commands:

- `pnpm -C packages/effects type-check` -> fail before the effects fixes, then pass.
- `pnpm -C packages/effects test` -> pass; 6 files, 40 tests.
- `pnpm typecheck` -> pass; proved the root typecheck filter can be removed.
- `pnpm validation-prototype:build` -> pass.
- `pnpm test:policy` -> pass; existing guidance warnings remain non-blocking.
- `pnpm docs:lint` -> pass.
- `git diff --check` -> pass.
- `pnpm build` -> pass; 10 successful pipeline steps, 0 failed, 0 skipped.

Reviewer status:

- Simplify pass -> pass; no behavior-preserving simplification required beyond keeping the taxonomy decision slice scoped.
- HE code-review readiness pass -> pass; residual effects coverage risk was handed to the fix-bugs pass and corrected with focused tests.
- HE fix-bugs pass -> pass after fixes; reproduced the missing coverage risk, corrected selector-target scroll behavior, and added focused effects tests.

`FORJAMIE.md` update status: complete; Recent Changes includes the P4 package-taxonomy entry.

### P5 Execution: Script Surface and FORJAMIE Compression

Status: completed.

Files changed:

- `docs/architecture/COMMAND_SURFACE.md`
- `docs/architecture/README.md`
- `docs/architecture/repo-map.md`
- `docs/guides/AGENT_DESIGN_WORKFLOW.md`
- `docs/changelog/FORJAMIE_HISTORY.md`
- `README.md`
- `FORJAMIE.md`
- `docs/plans/2026-05-02-agent-first-design-system-simplification-plan.md`

Source acceptance IDs targeted: SA16, SA17, AC11, AC12.

Command surface decisions:

- Added `docs/architecture/COMMAND_SURFACE.md` as the root command-routing authority for agents and humans.
- Kept the canonical agent-design commands prominent: `pnpm --silent agent-design:prepare --surface <path>`, `pnpm agent-design:prepare:changed`, `pnpm agent-design:lint`, and `pnpm agent-design:test`.
- Classified `pnpm doc:lint` and `pnpm tokens:validate` as compatibility aliases instead of deleting them, because reference audit still finds active historical or compatibility references.
- Shortened `FORJAMIE.md` into a current project map by moving older detailed recent-change entries to `docs/changelog/FORJAMIE_HISTORY.md`.
- Kept README and the agent workflow guide as front doors that point to the command surface instead of growing another complete script inventory.

Reference audit:

- `rg -n "pnpm doc:lint|doc:lint|tokens:validate|pnpm --silent agent-design:prepare|agent-design:prepare:changed|COMMAND_SURFACE" README.md FORJAMIE.md docs .github package.json` -> pass; confirmed compatibility aliases still have active references and canonical agent-design commands are present in front-door docs.

Validation commands:

- `pnpm docs:lint` -> pass; 0 errors, 0 warnings, 0 suggestions in 347 files, and all markdown links resolved.
- `pnpm test:policy` -> pass; existing design-system guidance warnings remain non-blocking and policy exits green.
- `git diff --check` -> pass.

Reviewer status:

- Simplify pass -> pass; no P0/P1/P2 simplification finding after centralizing command routing and archiving older FORJAMIE history.
- HE code-review readiness pass -> pass; command guidance, archive link paths, plan alignment, and FORJAMIE update requirements are satisfied.
- HE fix-bugs pass -> pass; no broken link, stale command, misleading wrapper/read-only guidance, or archive-reference issue found after validation.

`FORJAMIE.md` update status: complete; Recent Changes includes the P5 command-surface and FORJAMIE-compression entry.

## Linear Traceability

No Linear issue was supplied with this request.

Current status:

- `linear_status: untracked`
- No Linear acceptance traceability table is available.
- If this plan becomes tracked delivery work, create or link a Linear issue before starting `he-work` and update this section with the issue key, title, URL, and acceptance mapping.

Ready-to-create issue payload:

```yaml
title: Agent-first design-system simplification
description: >
  Execute the 2026-05-02 agent-first simplification plan: clarify active authority,
  archive or classify historical evidence, add prepare ergonomics, split large files
  by responsibility, resolve package taxonomy, simplify root scripts, and compress
  FORJAMIE.md while preserving the prepare contract.
labels:
  - design-system
  - agent-first
  - refactor
```

## References

- `docs/specs/2026-05-02-agent-first-design-system-simplification-spec.md`
- `docs/specs/2026-04-30-agent-design-prepare-north-star-spec.md`
- `docs/plans/2026-04-30-agent-design-prepare-north-star-plan.md`
- `docs/guides/AGENT_DESIGN_WORKFLOW.md`
- `README.md`
- `FORJAMIE.md`
- `docs/plans/README.md`
- `reports/README.md`
- `artifacts/reviews/README.md`
