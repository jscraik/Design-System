---
schema_version: 1
title: Agent Design Prepare North Star Implementation Plan
type: feat
status: completed
date: 2026-04-30
source_spec: docs/specs/2026-04-30-agent-design-prepare-north-star-spec.md
parent_plan: docs/plans/2026-04-28-agent-native-design-system-plan.md
plan_route: fresh
plan_depth: deep
next_stage: review-green
---

# Agent Design Prepare North Star Implementation Plan

## Table of Contents

- [Overview](#overview)
- [Planning Readiness](#planning-readiness)
- [Requirements Trace](#requirements-trace)
- [Scope Boundaries](#scope-boundaries)
- [Context and Research](#context-and-research)
- [Technical Decisions](#technical-decisions)
- [Review Finding Resolution](#review-finding-resolution)
- [Implementation Plan](#implementation-plan)
- [Acceptance Criteria](#acceptance-criteria)
- [Execution Checkpoints](#execution-checkpoints)
- [Risks and Rollback](#risks-and-rollback)
- [Validation Ladder](#validation-ladder)
- [Machine Evidence Contract](#machine-evidence-contract)
- [Execution Ledger](#execution-ledger)
- [First Work Packet](#first-work-packet)
- [References](#references)

## Overview

This plan turns `astudio design prepare --surface <path> --json` into the project north-star pre-edit command for AI UI work.

The command must answer one question before an agent edits UI:

> What exact design-system context, token roles, states, examples, forbidden patterns, safe validation commands, and proposal stops apply to this surface?

The repository already has most of the ingredients: `DESIGN.md`, machine-readable routing manifests, gold examples, guidance remediation, CLI envelopes, and the `packages/agent-design-engine` prepare builder. The work here is to make `prepare` the durable public contract instead of one useful command among many.

This plan supersedes `docs/plans/2026-04-28-agent-native-design-system-plan.md` only for the focused `prepare` north-star hardening lane. The 2026-04-28 plan remains historical and broader guidance for adjacent agent-native design-system work.

## Planning Readiness

| Check                   | Result  | Evidence                                                                                                                                                                                           |
| ----------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Plan route              | `fresh` | No existing `2026-04-30` prepare north-star plan exists under `docs/plans/`.                                                                                                                       |
| Plan depth              | `deep`  | The work changes CLI payload contracts, schema validation, deterministic errors, token guidance, docs, and root wrapper semantics.                                                                 |
| Source authority        | Ready   | `docs/specs/2026-04-30-agent-design-prepare-north-star-spec.md` contains the selected interface, payload shape, acceptance list, and reviewed root alias/read-only distinction.                    |
| Domain readiness        | Ready   | No separate repo `CONTEXT.md` or `CONTEXT-MAP.md` is present. The spec defines the vocabulary for surface, route, token contract, safe validation, proposal-required stops, and wrapper semantics. |
| Interface readiness     | Ready   | Shape A is selected: harden the existing `prepare` command in place. No new top-level orchestration command is required for v1.                                                                    |
| Prior plan relationship | Ready   | The older 2026-04-28 plan is broader and already implemented through JSC-239 to JSC-245. This plan narrows the next lane to north-star contract hardening.                                         |

## Requirements Trace

| Requirement                                                                                                                                                               | Source acceptance IDs      | Planned phases |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | -------------- |
| R1: `prepare` is the canonical pre-edit UI front door and docs happy path.                                                                                                | SA1, SA9, SA13, SA16, SA22 | P5             |
| R2: The prepare payload includes complete implementation context: token contract, states, examples, forbidden patterns, validation commands, source evidence, and timing. | SA2, SA3, SA12, SA17, SA18 | P1, P2         |
| R3: The API contract is fail-closed with deterministic schema and error codes.                                                                                            | SA6, SA7, SA8, SA19, SA20  | P0, P3, P4     |
| R4: Returned validation remains safe and read-only, while proposal scaffolding remains human-governed in v1.                                                              | SA4, SA5, SA10, SA21       | P2, P4, P5     |
| R5: Deferred product gaps are explicit rather than accidentally treated as complete.                                                                                      | SA11, SA14                 | P6             |
| R6: The root convenience wrapper is reliable and correctly classified as build-backed setup, not the read-only contract itself.                                           | SA15                       | P0, P4, P5     |
| R7: Phase completion evidence, wrapper matrix behavior, and unsafe/proposal stops are machine-verifiable by future agents.                                                | SA23, SA24, SA25           | P0, P2, P4     |

## Scope Boundaries

In scope:

- Strengthen `astudio.design.prepare.v1` payload types and JSON schema.
- Add `designTokenContract` and `timing` to `PreparePayload`.
- Load token roles from deterministic repo-owned sources.
- Return only read-only validation commands by default.
- Map prepare/routing/guidance failures to deterministic `DesignEngineError` codes.
- Keep `astudio design prepare` read-only.
- Keep `pnpm --silent agent-design:prepare --surface <path> --json` as a build-backed convenience wrapper with documented local build side effects and parseable JSON stdout.
- Update the agent workflow docs so `prepare` is the only happy path before editing UI.
- Track deferred gold examples and human inspector work without implementing them in this slice.

Out of scope:

- A new package or second orchestration layer.
- A new public command name such as `preflight-ui`.
- Write-gated proposal scaffolding.
- The human Design Prepare Inspector UI.
- Promotion of all deferred gold-example categories.
- Broad cleanup of the existing guidance warn backlog.
- Static or generated context-pack artifacts as the v1 authority.

## Context and Research

Key implementation files:

- `packages/agent-design-engine/src/types.ts` owns `PreparePayload`, validation-command types, and exported engine contracts.
- `packages/agent-design-engine/src/prepare.ts` assembles the current prepare payload and filters validation commands to read-only commands.
- `packages/agent-design-engine/src/routes.ts` loads route, lifecycle, coverage, source, example, and proposal metadata.
- `packages/cli/src/commands/design.ts` exposes `astudio design prepare` and the other read-only design commands.
- `packages/cli/tests/fixtures/design-schemas/astudio-design-command.v1.schema.json` validates the public command envelope but currently needs a prepare-specific payload branch.
- `packages/ui/src/styles/theme.css`, `packages/tokens/src/alias-map.ts`, and `packages/tokens/src/tokens/index.dtcg.json` are the token source priority chain.
- `docs/design-system/GOLD_EXAMPLES.json`, `docs/design-system/AGENT_UI_ROUTING.json`, `docs/design-system/COMPONENT_LIFECYCLE.json`, and `docs/design-system/COVERAGE_MATRIX.json` are the current machine-readable design-system guidance inputs.
- `docs/guides/AGENT_DESIGN_WORKFLOW.md`, `README.md`, and `FORJAMIE.md` are the high-traffic docs that must make `prepare` the agent front door.

Known current gaps:

- `PreparePayload` does not yet expose `designTokenContract`.
- `PreparePayload` does not yet expose stable `timing.durationMs`.
- Some prepare and routing failures still throw raw `Error` values instead of deterministic engine errors.
- The CLI JSON schema fixture accepts broad `data` shapes and does not yet require the prepare-specific fields.
- The root wrapper is build-backed and can write local `dist` outputs; this is acceptable only if docs clearly distinguish it from the read-only CLI operation.

Plan status note:

- This plan is both the execution plan and the completion record for the first north-star contract slice. The frontmatter status is `completed` only when every completed phase has a machine evidence locator in the Machine Evidence Contract section. Future follow-up slices must either create a new plan or reopen a specific phase with a dated reason instead of appending ambiguous prose to this ledger.

## Technical Decisions

1. Keep `prepare` as the v1 product surface.

   `astudio design prepare --surface <path> --json` is the canonical command. Lower-level commands such as `components`, `coverage`, `lint`, `export`, and `propose-abstraction` remain support and diagnostics.

2. Split read-only operation from setup wrapper.

   `astudio design prepare` must not write files, refresh artifacts, start servers, or run validation commands. `pnpm --silent agent-design:prepare --surface <path> --json` may build workspace packages before invoking the CLI and must be documented as a convenience wrapper with possible local build outputs. Plain `pnpm` may print lifecycle banners, so JSON-capturing agents must use `--silent`.

3. Build the token contract from semantic sources first.

   The v1 token guidance should prefer mapped runtime theme slots in `packages/ui/src/styles/theme.css`, then alias maps, then DTCG primitive sources, then prose guidance. Protected UI guidance must prefer semantic roles and reject foundation/raw color patterns unless an explicit exemption exists.

4. Fail closed on missing or ambiguous design authority.

   Missing token contract, ambiguous route, missing route examples, proposal-required routes, missing digests, and malformed manifests make `safeForAutomaticImplementation` false or return deterministic engine errors. The command must not invite agents to guess.

5. Keep timing present but fixture-stable.

   The runtime payload should include `timing.durationMs`. Snapshot and schema tests should normalize or range-check timing so wall-clock variance does not create fixture churn.

6. Keep generated context artifacts out of v1 authority.

   Static context packs can be future cache artifacts, but this plan keeps the live `prepare` payload as the authority so agents get current routing, token, and validation evidence.

## Review Finding Resolution

The latest review found two P2 issues in the spec/plan boundary:

- The root alias must not be presented as a reliable one-command entrypoint unless it builds every workspace dependency imported by the CLI, including `packages/design-system-guidance`.
- The read-only guarantee must apply to `astudio design prepare` itself, not to the root wrapper when that wrapper performs local package builds.

This plan resolves those findings by making wrapper reliability and wrapper classification part of P0, before payload/schema work. The first executable gate must prove the current root script builds `packages/agent-design-engine`, `packages/design-system-guidance`, `packages/skill-ingestion`, and `packages/cli` before invoking `node packages/cli/dist/index.js design prepare --json`. If that proof fails, `he-work` must fix the script or return a deterministic setup/build precondition error such as `E_DESIGN_PREPARE_BUILD_UNAVAILABLE` before proceeding to schema or token-contract implementation. Removing wrapper docs alone is not completion evidence.

The expected current root script shape is:

```bash
pnpm agent-design:build && pnpm design-system-guidance:build && pnpm skill-ingestion:build && pnpm -C packages/cli build && node packages/cli/dist/index.js design prepare --json
```

This script is a build-backed setup wrapper. Its local `dist` output churn is acceptable only as setup behavior. It must not be used as evidence that `astudio design prepare` mutates files.

## Implementation Plan

### P0: Wrapper Classification, Dependency Baseline, and Fixture Harness

Goal: prove the root wrapper is either reliable and correctly classified, or remove it from the canonical entrypoint path before changing payload behavior.

Files:

- `package.json`
- `packages/cli/tests/fixtures/design-schemas/astudio-design-command.v1.schema.json`
- Existing CLI schema/envelope tests under `packages/cli/tests/`
- Existing engine tests under `packages/agent-design-engine/tests/`
- New negative fixtures under the closest existing fixture folder if required
- `docs/specs/2026-04-30-agent-design-prepare-north-star-spec.md`
- `docs/guides/AGENT_DESIGN_WORKFLOW.md`
- `README.md`
- `FORJAMIE.md`

Tasks:

- Verify `pnpm --silent agent-design:prepare --surface <path> --json` builds every workspace package imported by `packages/cli` through package exports before building the CLI. The minimum dependency chain is `packages/agent-design-engine`, `packages/design-system-guidance`, `packages/skill-ingestion`, then `packages/cli`.
- Run `pnpm --silent agent-design:prepare --surface packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx --json` and record whether the wrapper reaches a parseable `prepare` payload or fails with a deterministic setup/build precondition.
- Prove wrapper behavior across a multi-surface matrix before classifying it reliable:
  - success: protected settings surface with `safeForAutomaticImplementation: true`
  - warn/exempt: known configured non-error surface with explicit scope evidence
  - unknown or missing route: deterministic unsafe payload with stable open-decision code
- Prove proposal-required behavior separately through the read-only proposal preview path until `prepare` itself grows need-only proposal stops.
- Classify `pnpm --silent agent-design:prepare --surface <path> --json` as a build-backed wrapper in docs touched by this lane. The docs must say `astudio design prepare` is the read-only operation contract.
- Reject any plan or doc wording that says the root wrapper itself is read-only.
- Confirm the root alias does not include a default `--surface` that can collide with caller-provided surfaces.
- Add a prepare-specific schema branch for `data.kind === "astudio.design.prepare.v1"`.
- Add negative schema coverage for missing `safeForAutomaticImplementation`, `designTokenContract`, `timing`, `sourceDigests`, and `ruleSourceDigests`.
- Add a positive fixture path that can normalize `timing.durationMs`.
- Confirm the schema still accepts non-prepare `astudio.command.v1` envelopes through their existing branches.

Exit criteria:

- Root script inspection proves the wrapper builds every CLI workspace dependency. If the wrapper cannot run from a clean checkout, it must fail with a deterministic setup/build precondition such as `E_DESIGN_PREPARE_BUILD_UNAVAILABLE`; removing wrapper docs alone is not a valid completion path.
- Wrapper smoke reaches `prepare` on the known settings surface, or fails with a deterministic setup/build precondition that docs and tests recognize.
- Wrapper matrix covers success, warn/exempt, and unknown/missing-route prepare outcomes with parseable JSON or deterministic setup/build errors. Proposal-required behavior is evidenced separately through the read-only `propose-abstraction` preview.
- Docs in scope distinguish the read-only `astudio design prepare` operation from the build-backed `pnpm --silent agent-design:prepare --surface <path> --json` wrapper.
- Missing required prepare fields fail schema validation.
- A current valid prepare payload fixture passes after timing normalization.
- No later phase may start while wrapper classification is ambiguous.

### P1: Design Token Contract Loader

Goal: add deterministic token guidance to the engine.

Files:

- `packages/agent-design-engine/src/types.ts`
- `packages/agent-design-engine/src/prepare.ts`
- New `packages/agent-design-engine/src/token-contract.ts`
- `packages/ui/src/styles/theme.css`
- `packages/tokens/src/alias-map.ts`
- `packages/tokens/src/tokens/index.dtcg.json`
- Engine tests and fixtures

Tasks:

- Define `DesignTokenContract` and `DesignTokenRole` types.
- Load a curated semantic token role set for common protected UI needs: surface, text, border, focus, accent, destructive, success, warning, and muted states.
- Define minimum semantic role coverage per protected route family before marking the token contract complete: surface, text, border, focus, primary action, destructive/error, success, warning, muted/disabled, and overlay/elevation where the route family exposes dialogs or panels.
- Attach `cssVariable`, `useFor`, `avoidFor`, and `sourceRefs` where available.
- Include `forbiddenTokenPatterns` for raw hex colors, foundation token bypasses, and one-off color literals in protected UI.
- Return deterministic `E_DESIGN_TOKEN_CONTRACT_MISSING` or `E_DESIGN_TOKEN_CONTRACT_AMBIGUOUS` errors when token authority cannot be resolved.

Exit criteria:

- The loader returns stable output from repo sources.
- The loader meets the minimum semantic role coverage threshold for protected page, settings/panel, form/error, and dashboard-like route families or records a deterministic unsafe/open-decision reason for the missing family.
- The loader produces source refs that point at existing files.
- Token contract tests cover success, missing source, and ambiguous source cases.

### P2: Prepare Payload Assembly and Safety Rules

Goal: make the prepare response complete enough for an agent to edit UI without reading scattered docs.

Files:

- `packages/agent-design-engine/src/types.ts`
- `packages/agent-design-engine/src/prepare.ts`
- Engine tests and fixtures

Tasks:

- Add `designTokenContract` to `PreparePayload`.
- Add `timing.durationMs` to `PreparePayload`.
- Preserve current fields: routes, states, examples, forbidden patterns, validation commands, source digests, rule metadata, `safeForAutomaticImplementation`, and `openDecisions`.
- Keep validation commands filtered to `safetyClass: "read_only"` by default.
- Validate every returned `packageScript`, when present, against the `package.json` script map for the package directory targeted by the validation command, after proving that package directory stays inside the workspace by real path.
- Support deterministic `pnpm` package-directory forms such as `pnpm -C packages/ui run type-check` and `pnpm run -C packages/ui type-check`; reject unsupported `--filter` selectors until filter-aware package-script evidence exists.
- Mark payloads unsafe when token contract resolution fails, route resolution is missing or ambiguous, route examples are missing, or proposal-required decisions remain open.
- Give every unsafe/proposal-required `openDecisions[]` entry a stable `code` and a prescribed `nextAction` category so agents can stop, escalate, or run a diagnostic without interpreting prose.

Exit criteria:

- `prepare` returns all required spec fields for a known surface.
- Returned validation commands are all read-only and reference existing package scripts in the targeted package manifest when a `packageScript` is present, with symlink-escaped package directories rejected before package metadata is read.
- Unsafe scenarios are explicit in `safeForAutomaticImplementation` and `openDecisions`.
- Unsafe/proposal-required scenarios expose stable decision codes and next-action categories.

### P3: Deterministic Error Model

Goal: replace raw prepare/routing/guidance failures with stable machine-readable codes.

Files:

- `packages/agent-design-engine/src/types.ts`
- `packages/agent-design-engine/src/prepare.ts`
- `packages/agent-design-engine/src/routes.ts`
- New or existing engine error helper module
- `packages/cli/src/commands/design.ts`
- Engine and CLI tests

Tasks:

- Define or extend `DesignEngineError` with the spec's failure codes.
- Convert known raw prepare errors into deterministic errors, including invalid guidance JSON, invalid guidance schema, invalid routing schema, invalid lifecycle schema, invalid coverage schema, and missing source digests.
- Ensure CLI JSON mode reports deterministic command envelopes rather than leaking raw exception messages as the primary contract.
- Keep human-readable messages concise and actionable, with the code as the stable identifier.

Exit criteria:

- Malformed guidance, routing, lifecycle, coverage, source digest, and token-contract fixtures produce the expected codes.
- No known prepare/routing/guidance parse path returns a generic internal failure where the spec requires a code.

### P4: CLI Contract, Root Wrapper, and Smoke Coverage

Goal: keep the command working through both the read-only CLI operation and the already-classified build-backed root convenience path after payload hardening.

Files:

- `packages/cli/tests/fixtures/design-schemas/astudio-design-command.v1.schema.json`
- `packages/cli/src/commands/design.ts`
- `package.json`
- CLI tests
- Root smoke-test documentation or scripts if an existing place is available

Tasks:

- Tighten the prepare schema branch so missing `designTokenContract`, `timing`, `safeForAutomaticImplementation`, source digests, or route evidence fails validation.
- Re-run the P0 wrapper inspection after payload changes and keep `pnpm --silent agent-design:prepare --surface <path> --json` building every workspace dependency the CLI imports through package exports.
- Add or preserve a smoke path that runs `pnpm --silent agent-design:prepare --surface packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx --json`.
- If the wrapper cannot run from a clean checkout, return or document a deterministic setup/build precondition error instead of presenting the alias as fully read-only.

Exit criteria:

- `astudio design prepare --surface <path> --json` remains the read-only operation contract.
- `pnpm --silent agent-design:prepare --surface <path> --json` is tested and documented as a build-backed wrapper.
- The root alias has no baked-in default surface that can collide with caller-provided `--surface`.

### P5: Docs Front Door Flip

Goal: make the project teach one pre-edit path.

Files:

- `docs/guides/AGENT_DESIGN_WORKFLOW.md`
- `README.md`
- `FORJAMIE.md`
- CLI docs or command help tests if present
- PR or governance templates if present and already used for UI changes

Tasks:

- Rewrite the agent UI workflow around:
  1. Run `astudio design prepare --surface <path> --json`.
  2. Stop when `safeForAutomaticImplementation` is false and follow `openDecisions`.
  3. Use routes, token contract, states, examples, and forbidden patterns.
  4. Edit UI.
  5. Run the returned read-only validation commands.
  6. Escalate proposal-required gaps instead of inventing components or tokens.
- Describe `lint`, `export`, `components`, `coverage`, and `propose-abstraction` as supporting diagnostics.
- Clearly classify `pnpm --silent agent-design:prepare --surface <path> --json` as the build-backed local wrapper for JSON capture.
- Remove happy-path prose that tells agents to compose primitive commands manually before editing UI.
- Add a durability check, policy test, or documented grep gate that fails future docs drift when high-traffic docs reintroduce primitive-command composition as the pre-edit happy path.

Exit criteria:

- High-traffic docs lead with `prepare`.
- Docs distinguish `astudio design prepare` from the root wrapper.
- No docs in scope describe lower-level command composition as the normal happy path before UI edits.
- A repeatable docs-drift check proves high-traffic docs still lead with `prepare`.

### P6: Deferred Product Milestone Guardrails

Goal: keep future product gaps visible without expanding this implementation slice.

Files:

- `docs/design-system/GOLD_EXAMPLES.json`
- `docs/design-system/AGENT_UI_ROUTING.json`
- `docs/specs/2026-04-30-agent-design-prepare-north-star-spec.md`
- Follow-up plan/spec stubs only if the repo already has a suitable index

Tasks:

- Preserve deferred categories for permission denied or unavailable states, dense operational dashboards, and accessible form validation until each has source, story, test, covered states, validation command, and route linkage.
- Keep the Design Prepare Inspector as a deferred human UX milestone rather than implementing UI in this slice.
- Ensure deferred categories are not accidentally promoted into `prepare` examples without validation coverage.

Exit criteria:

- Deferred example categories remain explicit and non-promotable until fully evidenced.
- Human inspector work is named as follow-up product scope, not hidden inside the CLI contract slice.

## Acceptance Criteria

| ID   | Criteria                                                                                                                                                                                                                                                                                                | Source IDs           |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| AC1  | `astudio.design.prepare.v1` schema requires `designTokenContract`, `timing`, `safeForAutomaticImplementation`, source digests, and route evidence.                                                                                                                                                      | SA3, SA7, SA19       |
| AC2  | `PreparePayload` includes `designTokenContract` with semantic roles, forbidden token patterns, source refs, and a semantic-only mode.                                                                                                                                                                   | SA2, SA17, SA18      |
| AC3  | `PreparePayload` includes `timing.durationMs`, with tests that avoid wall-clock fixture instability.                                                                                                                                                                                                    | SA12                 |
| AC4  | Known guidance, routing, lifecycle, coverage, source-digest, token-contract, route, proposal, and schema failures map to deterministic engine error codes.                                                                                                                                              | SA6, SA8, SA20       |
| AC5  | Returned validation commands are read-only by default, and any `packageScript` maps to an existing package script in the command's targeted package manifest.                                                                                                                                           | SA4, SA5             |
| AC6  | `safeForAutomaticImplementation` is false for unknown, ambiguous, missing-token, missing-example, proposal-required, or open-decision cases, and every unsafe stop includes a stable `openDecisions[].code` plus a prescribed next-action category.                                                     | SA8, SA13            |
| AC7  | `propose-abstraction` remains read-only; write-gated scaffolding is not added in this slice.                                                                                                                                                                                                            | SA10                 |
| AC8  | Static or generated context artifacts are not treated as the v1 authority.                                                                                                                                                                                                                              | SA21                 |
| AC9  | `pnpm --silent agent-design:prepare --surface <path> --json` builds `packages/agent-design-engine`, `packages/design-system-guidance`, `packages/skill-ingestion`, and `packages/cli` before invoking prepare with parseable JSON stdout, or fails with a deterministic setup/build precondition error. | SA15                 |
| AC10 | Docs lead with `astudio design prepare --surface <path> --json` and classify lower-level commands as diagnostics.                                                                                                                                                                                       | SA1, SA9, SA16, SA22 |
| AC11 | Deferred gold-example categories and human inspector scope remain explicit follow-up work.                                                                                                                                                                                                              | SA11, SA14           |
| AC12 | Completed phases have machine evidence locators with phase, command, exit code, prepared surface or failure class, commit SHA when available, and artifact/log path or transcript anchor.                                                                                                               | SA23                 |
| AC13 | Wrapper reliability is proven across success, warn/exempt, and unknown/missing-route prepare outcomes, not only one golden surface; proposal-required behavior is proven through the read-only proposal preview.                                                                                        | SA15, SA24           |
| AC14 | Token-contract completion requires minimum semantic role coverage for protected route families or deterministic unsafe/open-decision output when a route family cannot be covered.                                                                                                                      | SA2, SA17, SA18      |

## Execution Checkpoints

| Checkpoint                  | Required evidence                                                                                                                                                                                                                                                                                                     |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C0: Baseline wrapper health | Inspect `package.json` and run `pnpm --silent agent-design:prepare --surface packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx --json` before broad behavior changes. The wrapper must build the CLI's workspace dependencies and emit parseable JSON or fail with a deterministic setup/build precondition error. |
| C1: Schema fail-closed      | Negative schema fixtures fail for missing `designTokenContract`, `timing`, `safeForAutomaticImplementation`, and digest fields.                                                                                                                                                                                       |
| C2: Token contract stable   | Token loader tests pass and source refs resolve to repo files.                                                                                                                                                                                                                                                        |
| C3: Error codes stable      | Malformed manifest and missing-source tests assert deterministic `DesignEngineError` codes.                                                                                                                                                                                                                           |
| C4: Prepare smoke           | Known settings surface returns a successful payload with token contract, read-only validation commands, timing, and `safeForAutomaticImplementation: true`.                                                                                                                                                           |
| C5: Wrapper matrix          | Success, warn/exempt, and unknown/missing-route prepare surfaces each return parseable JSON or deterministic setup/build errors; proposal-required behavior is evidenced through the read-only proposal preview.                                                                                                      |
| C6: Docs front door         | Scoped docs search shows the happy path starts with `prepare`, not manual primitive composition, and the docs-drift check is repeatable.                                                                                                                                                                              |
| C7: Evidence locators       | Every completed phase has a structured evidence locator with command, exit code, surface/failure class, commit SHA when available, and artifact/log path or transcript anchor.                                                                                                                                        |

Stop conditions:

- Token sources cannot produce a deterministic semantic contract without manual judgment.
- The command schema cannot discriminate prepare payloads without breaking existing envelope consumers.
- The root wrapper cannot be made clean-checkout reliable without adding undocumented build side effects or ambiguous workspace churn.
- Docs continue to imply the root wrapper is the read-only operation after P0.
- A requested change would make generated static context the v1 authority.
- A requested change would let agents auto-approve new abstractions without human proposal acceptance.

## Risks and Rollback

| Risk                                                    | Mitigation                                                                                          | Rollback                                                                                                                      |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Timing field creates flaky fixtures.                    | Normalize or range-check `timing.durationMs` in tests.                                              | Remove timing from snapshots while keeping schema/type coverage.                                                              |
| Token loader overfits current CSS naming.               | Start with a curated role set and source refs, not a full CSS parser ambition.                      | Revert loader to a smaller static role map backed by existing token docs.                                                     |
| Schema hardening breaks non-prepare envelopes.          | Use a discriminated branch for `data.kind === "astudio.design.prepare.v1"` only.                    | Restore the prior broad data schema for non-prepare kinds.                                                                    |
| Error-code conversion masks useful debug detail.        | Preserve human-readable messages and optional causes while making `code` stable.                    | Roll back individual conversions, not the whole schema work.                                                                  |
| Root wrapper writes local build output before UI edits. | Make P0 classify it as setup/build wrapper and keep the underlying CLI operation read-only.         | Keep the wrapper documented as build-backed setup, or replace it with a no-write source execution path that still emits JSON. |
| Root wrapper misses a CLI workspace dependency.         | P0 inspects `package.json`, runs the wrapper matrix, and requires deterministic setup/build errors. | Add the missing workspace build step or return `E_DESIGN_PREPARE_BUILD_UNAVAILABLE` with setup guidance.                      |
| Docs imply all gold-example categories are ready.       | Keep deferred categories non-promotable until source/story/test/validation exist.                   | Revert accidental promotion and restore deferred metadata.                                                                    |

## Validation Ladder

Run the smallest relevant set during each phase, then the full ladder before merge:

```bash
cat package.json | jq .
cat docs/design-system/GOLD_EXAMPLES.json | jq .
node packages/cli/dist/index.js design prepare --surface packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx --json
pnpm --silent agent-design:prepare --surface packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx --json
pnpm -C packages/agent-design-engine type-check
pnpm -C packages/agent-design-engine test
pnpm -C packages/cli build
pnpm -C packages/cli test
pnpm agent-design:lint
rg -n "astudio design prepare --surface <path> --json" README.md docs/guides/AGENT_DESIGN_WORKFLOW.md FORJAMIE.md
git diff --check
```

Broaden to `pnpm test`, `pnpm build`, or visual/browser gates only when the implementation touches shared runtime UI, Storybook, generated source, or package exports outside the prepare contract.

## Machine Evidence Contract

Every completed phase must have evidence in a structured locator form. Narrative ledger prose can explain intent, but it is not completion evidence by itself.

Required locator fields:

```json
{
  "phase": "P0",
  "status": "pass",
  "command": "pnpm --silent agent-design:prepare --surface packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx --json",
  "exitCode": 0,
  "surface": "packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx",
  "failureClass": null,
  "commitSha": "<committed-change-sha>",
  "artifact": "docs/plans/2026-04-30-agent-design-prepare-north-star-plan.md#execution-ledger",
  "checkedAt": "2026-04-30"
}
```

Rules:

- `status` is one of `pass`, `fail`, or `blocked`.
- `exitCode` is required for every command that ran.
- `surface` is required for prepare invocations; `failureClass` is required for deterministic error-path checks.
- `commitSha` is required once work is committed; use `local-uncommitted` only for an in-progress phase and never for final completion.
- `artifact` must point to a CI log, saved command log, session transcript anchor, committed fixture, or this plan's execution-ledger anchor when the ledger line includes the exact command and outcome.
- A phase cannot remain `completed` if any required locator field is missing.

Current phase evidence locators:

```jsonl
{"phase":"P0","status":"pass","command":"pnpm --silent agent-design:prepare --surface packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx --json","exitCode":0,"surface":"packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx","failureClass":null,"commitSha":"90dba4e5","artifact":"docs/plans/2026-04-30-agent-design-prepare-north-star-plan.md#execution-ledger","checkedAt":"2026-04-30"}
{"phase":"P0","status":"pass","command":"pnpm --silent agent-design:prepare --surface packages/ui/src/storybook/_holding/component-stories/AlertDialog.stories.tsx --json","exitCode":0,"surface":"packages/ui/src/storybook/_holding/component-stories/AlertDialog.stories.tsx","failureClass":null,"commitSha":"90dba4e5","artifact":"docs/plans/2026-04-30-agent-design-prepare-north-star-plan.md#machine-evidence-contract","checkedAt":"2026-05-01","matrixCase":"warn"}
{"phase":"P0","status":"pass","command":"pnpm --silent agent-design:prepare --surface docs/design-system/AGENT_UI_ROUTING.md --json","exitCode":1,"surface":"docs/design-system/AGENT_UI_ROUTING.md","failureClass":"E_DESIGN_ROUTE_MISSING","commitSha":"90dba4e5","artifact":"docs/plans/2026-04-30-agent-design-prepare-north-star-plan.md#machine-evidence-contract","checkedAt":"2026-05-01","matrixCase":"exempt-missing-route"}
{"phase":"P0","status":"pass","command":"pnpm --silent agent-design:prepare --surface packages/example/UnknownSurface.tsx --json","exitCode":1,"surface":"packages/example/UnknownSurface.tsx","failureClass":"E_DESIGN_ROUTE_MISSING,E_DESIGN_SURFACE_SCOPE_UNKNOWN","commitSha":"90dba4e5","artifact":"docs/plans/2026-04-30-agent-design-prepare-north-star-plan.md#machine-evidence-contract","checkedAt":"2026-05-01","matrixCase":"unknown-missing-route"}
{"phase":"P0","status":"pass","command":"node packages/cli/dist/index.js design propose-abstraction --need dense_operational_dashboard --surface packages/example/Dashboard.tsx --json","exitCode":0,"surface":"packages/example/Dashboard.tsx","failureClass":"E_DESIGN_PROPOSAL_REQUIRED","commitSha":"90dba4e5","artifact":"docs/plans/2026-04-30-agent-design-prepare-north-star-plan.md#machine-evidence-contract","checkedAt":"2026-05-01","matrixCase":"proposal-required-preview"}
{"phase":"P1","status":"pass","command":"pnpm -C packages/agent-design-engine test","exitCode":0,"surface":null,"failureClass":null,"commitSha":"90dba4e5","artifact":"docs/plans/2026-04-30-agent-design-prepare-north-star-plan.md#execution-ledger","checkedAt":"2026-04-30"}
{"phase":"P2","status":"pass","command":"pnpm -C packages/agent-design-engine test","exitCode":0,"surface":"packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx","failureClass":"E_DESIGN_VALIDATION_COMMAND_INVALID","commitSha":"90dba4e5","artifact":"docs/plans/2026-04-30-agent-design-prepare-north-star-plan.md#execution-ledger","checkedAt":"2026-04-30"}
{"phase":"P3","status":"pass","command":"pnpm -C packages/agent-design-engine test","exitCode":0,"surface":null,"failureClass":"E_DESIGN_GUIDANCE_JSON,E_DESIGN_GUIDANCE_SCHEMA,E_DESIGN_ROUTING_SCHEMA,E_DESIGN_LIFECYCLE_SCHEMA,E_DESIGN_COVERAGE_SCHEMA,E_DESIGN_PACKAGE_JSON,E_DESIGN_SOURCE_DIGEST_MISSING","commitSha":"90dba4e5","artifact":"docs/plans/2026-04-30-agent-design-prepare-north-star-plan.md#execution-ledger","checkedAt":"2026-04-30"}
{"phase":"P4","status":"pass","command":"pnpm -C packages/cli test","exitCode":0,"surface":"packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx","failureClass":null,"commitSha":"90dba4e5","artifact":"docs/plans/2026-04-30-agent-design-prepare-north-star-plan.md#execution-ledger","checkedAt":"2026-04-30"}
{"phase":"P5","status":"pass","command":"pnpm docs:lint","exitCode":0,"surface":null,"failureClass":null,"commitSha":"90dba4e5","artifact":"docs/plans/2026-04-30-agent-design-prepare-north-star-plan.md#execution-ledger","checkedAt":"2026-04-30"}
{"phase":"P6","status":"pass","command":"cat docs/design-system/GOLD_EXAMPLES.json | jq .","exitCode":0,"surface":null,"failureClass":null,"commitSha":"90dba4e5","artifact":"docs/plans/2026-04-30-agent-design-prepare-north-star-plan.md#execution-ledger","checkedAt":"2026-04-30"}
```

Locator coverage summary:

| Phase | Required locator coverage                                                                                                                                                        | Status |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| P0    | Wrapper dependency inspection, direct settings-surface wrapper JSON smoke, warn/exempt/unknown/proposal matrix, schema positive fixture, schema negative fixtures, command logs. | pass   |
| P1    | Token-contract success, missing-source failure, ambiguous-source failure, source-ref resolution, command logs.                                                                   | pass   |
| P2    | Known-surface payload, targeted package-script validation, symlink escape rejection, unsupported filter rejection, command logs.                                                 | pass   |
| P3    | Malformed guidance/routing/lifecycle/coverage/package/source-digest fixtures mapped to deterministic errors, command logs.                                                       | pass   |
| P4    | CLI schema branch, wrapper smoke script, direct CLI JSON parse, package-script wrapper-order assertions, command logs.                                                           | pass   |
| P5    | README/workflow/FORJAMIE prepare-first docs check, docs lint, primitive-happy-path drift check, command logs.                                                                    | pass   |
| P6    | Deferred gold-example non-promotable metadata, JSON validity check, route-promotion absence check, docs lint, command logs.                                                      | pass   |

## Execution Ledger

| Step                                                                 | Status    | Owner   | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| -------------------------------------------------------------------- | --------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0: Wrapper Classification, Dependency Baseline, and Fixture Harness | completed | he-work | `pnpm --silent agent-design:prepare --surface packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx --json` builds `packages/agent-design-engine`, `packages/design-system-guidance`, `packages/skill-ingestion`, and `packages/cli`, then returns parseable `astudio.design.prepare.v1` JSON with `safeForAutomaticImplementation: true`. CLI schema now has a prepare-specific branch and negative coverage for missing north-star fields. `pnpm -C packages/cli test`, `pnpm -C packages/agent-design-engine test`, `pnpm agent-design:lint`, and `git diff --check` pass after the simplify/code-review fixes.                                                                                                                                                                                                                                                                                                                                                                                                           |
| P1: Design Token Contract Loader                                     | completed | he-work | `packages/agent-design-engine/src/token-contract.ts` now returns semantic token roles from theme, alias-map, and DTCG source refs with fresh arrays per payload. Missing token source authority maps to `E_DESIGN_TOKEN_CONTRACT_MISSING`, ambiguous marker drift maps to `E_DESIGN_TOKEN_CONTRACT_AMBIGUOUS`, and `pnpm -C packages/agent-design-engine test` passes with 55 tests after the simplify/code-review pass.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| P2: Prepare Payload Assembly and Safety Rules                        | completed | he-work | `PreparePayload` now includes `designTokenContract`, `timing`, source evidence, states, examples, forbidden patterns, and normalized read-only validation commands. Top-level and nested route validation commands now include `packageScript`, `expectedOutcome`, and `timeoutClass`; package scripts are validated against the targeted package manifest, with missing scripts, stale `packageScript` metadata, malformed `pnpm run` commands, unsupported `--filter` selectors, and symlink-escaped package directories rejected as `E_DESIGN_VALIDATION_COMMAND_INVALID`. `pnpm -C packages/agent-design-engine test`, `pnpm -C packages/cli test`, `pnpm --silent agent-design:prepare --surface packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx --json`, `pnpm agent-design:lint`, and `git diff --check` pass after the simplify/code-review pass.                                                                                                                                                              |
| P3: Deterministic Error Model                                        | completed | he-work | Prepare/guidance/routing failures now map to deterministic `DesignEngineError` codes for malformed guidance JSON, guidance schema drift, routing schema drift, lifecycle schema drift, coverage schema drift, root package metadata drift, missing source digest evidence, and incomplete source digest assembly. Negative fixtures pin `E_DESIGN_GUIDANCE_JSON`, `E_DESIGN_GUIDANCE_SCHEMA`, `E_DESIGN_ROUTING_SCHEMA`, `E_DESIGN_LIFECYCLE_SCHEMA`, `E_DESIGN_COVERAGE_SCHEMA`, `E_DESIGN_PACKAGE_JSON`, and `E_DESIGN_SOURCE_DIGEST_MISSING`; cancellation still propagates as `AbortError`. `pnpm -C packages/agent-design-engine test`, `pnpm -C packages/cli test`, `pnpm --silent agent-design:prepare --surface packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx --json`, direct `node packages/cli/dist/index.js design prepare --surface packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx --json` JSON parse, `pnpm agent-design:lint`, and `git diff --check` pass after the simplify/code-review fixes. |
| P4: CLI Contract, Root Wrapper, and Smoke Coverage                   | completed | he-work | The CLI schema negative test now rejects prepare payloads missing route/evidence fields in addition to token, timing, safety, and digest fields, and rejects unexpected top-level prepare payload fields. `package.json` exposes `pnpm agent-design:prepare:smoke` for the canonical settings-panel prepare surface through the silent wrapper, and CLI coverage pins wrapper build order, the absence of a baked-in default `--surface`, and the smoke script command. `pnpm -C packages/cli test`, `pnpm --silent agent-design:prepare:smoke`, direct `node packages/cli/dist/index.js design prepare --surface packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx --json` JSON parse, `pnpm agent-design:lint`, and `git diff --check` pass after the simplify/code-review pass.                                                                                                                                                                                                                                       |
| P5: Docs Front Door Flip                                             | completed | he-work | `docs/guides/AGENT_DESIGN_WORKFLOW.md` now leads with `astudio design prepare --surface <path> --json`, explains the build-backed `pnpm --silent agent-design:prepare --surface <path> --json` wrapper for JSON capture, tells agents to stop on `safeForAutomaticImplementation: false`, and demotes lint/export/components/coverage/propose-abstraction to diagnostics. `README.md` now has an Agent UI Preparation section with the same prepare-first operating rule and wrapper/read-only distinction. `pnpm docs:lint` and `git diff --check` pass after the simplify/code-review fix that restored `Verify` as a top-level README section.                                                                                                                                                                                                                                                                                                                                                                           |
| P6: Deferred Product Milestone Guardrails                            | completed | he-work | `docs/design-system/GOLD_EXAMPLES.json` now keeps permission-denied/unavailable, dense operational dashboard, and accessible form-validation categories `promotable: false` until each has protected source, story, test, covered-state, read-only validation, and route-linkage evidence. `docs/design-system/GOLD_EXAMPLES.md` mirrors that non-promotable rule for humans, and the human Design Prepare Inspector remains deferred in the spec/plan rather than implemented in this CLI slice. `cat docs/design-system/GOLD_EXAMPLES.json \| jq .`, the deferred/promotable guard query, the route-promotion absence check, `pnpm docs:lint`, and `git diff --check` pass after the simplify/code-review pass.                                                                                                                                                                                                                                                                                                           |

## First Work Packet

Initial P0 packet completed by `he-work`:

1. Inspect `package.json` and verify `agent-design:prepare` builds `packages/agent-design-engine`, `packages/design-system-guidance`, `packages/skill-ingestion`, and `packages/cli` before invoking `node packages/cli/dist/index.js design prepare --json`.
2. Run `pnpm --silent agent-design:prepare --surface packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx --json`.
3. If the wrapper fails before prepare runs, fix the build chain or return a deterministic setup/build precondition error before continuing.
4. Confirm docs describe `pnpm --silent agent-design:prepare --surface <path> --json` as build-backed setup for JSON capture and `astudio design prepare` as the read-only operation contract.
5. Add a prepare-specific branch to `packages/cli/tests/fixtures/design-schemas/astudio-design-command.v1.schema.json`.
6. Add negative schema coverage proving that prepare payloads missing `designTokenContract`, `timing`, `safeForAutomaticImplementation`, source digests, or rule digests are rejected.
7. Add or update one positive prepare fixture with normalized `timing.durationMs`.
8. Run:

```bash
cat package.json | jq '.scripts["agent-design:prepare"]'
pnpm -C packages/cli test
pnpm --silent agent-design:prepare --surface packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx --json
git diff --check
```

P0 through P6 are complete with validation evidence. Before any follow-up slice begins, rerun `$simplify` and `$he-code-review` over that slice's diff, fix actionable P0/P1/P2 findings, and keep the execution ledger current.

## References

- `docs/specs/2026-04-30-agent-design-prepare-north-star-spec.md`
- `docs/plans/2026-04-28-agent-native-design-system-plan.md`
- `packages/agent-design-engine/src/types.ts`
- `packages/agent-design-engine/src/prepare.ts`
- `packages/agent-design-engine/src/routes.ts`
- `packages/cli/src/commands/design.ts`
- `packages/cli/tests/fixtures/design-schemas/astudio-design-command.v1.schema.json`
- `docs/design-system/GOLD_EXAMPLES.json`
- `docs/design-system/AGENT_UI_ROUTING.json`
- `docs/guides/AGENT_DESIGN_WORKFLOW.md`
