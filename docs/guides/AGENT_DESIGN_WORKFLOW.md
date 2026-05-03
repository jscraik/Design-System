# Agent Design Workflow

## Table of Contents

- [Purpose](#purpose)
- [When To Use](#when-to-use)
- [Authority Map](#authority-map)
- [Agent Flow](#agent-flow)
- [Migration Flow](#migration-flow)
- [Validation](#validation)
- [Known Limits](#known-limits)

## Purpose

This guide explains the required pre-edit design-system step for coding agents creating or refactoring UI in this repository.

## When To Use

Use this workflow when an agent is asked to design, redesign, restyle, or review UI. The workflow is not a replacement for component tests or visual checks; it is the semantic contract step that tells an agent which components, token roles, states, examples, forbidden patterns, validation commands, and proposal-required stops apply.

## Authority Map

This file is the detailed workflow authority for agent UI work. README and `FORJAMIE.md` should point here instead of restating the whole workflow.

For root command routing beyond the UI prepare workflow, use `docs/architecture/COMMAND_SURFACE.md`.

| surface                                                                               | status             | reason                                                                                                                          | replacement                                                                       | allowedUse                                                                        | lastReviewed |
| ------------------------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------ |
| `docs/guides/AGENT_DESIGN_WORKFLOW.md`                                                | active             | Detailed pre-edit workflow for protected UI changes.                                                                            | n/a                                                                               | Agent and human workflow authority before UI edits.                               | 2026-05-02   |
| `README.md#agent-ui-preparation`                                                      | active             | Repo front door for the one-command rule.                                                                                       | `docs/guides/AGENT_DESIGN_WORKFLOW.md`                                            | Short orientation and command reminder only.                                      | 2026-05-02   |
| `FORJAMIE.md`                                                                         | active             | Durable project map and current operating state.                                                                                | `docs/guides/AGENT_DESIGN_WORKFLOW.md`                                            | Context, recent changes, and live caveats; not the full workflow.                 | 2026-05-02   |
| `DESIGN.md` and `docs/design-system/*.json`                                           | active             | Authored design-system source for `prepare`.                                                                                    | n/a                                                                               | Source data for routes, tokens, examples, proposals, lifecycle, and coverage.     | 2026-05-02   |
| `packages/agent-design-engine`, `packages/cli`, and `packages/design-system-guidance` | active             | Engine, transport, and guidance implementation spine.                                                                           | n/a                                                                               | Implementation source for the prepare contract and diagnostics.                   | 2026-05-02   |
| `docs/plans/README.md`                                                                | active             | Plan index names the active execution lane before individual plans are used.                                                    | n/a                                                                               | Plan selection authority.                                                         | 2026-05-02   |
| `docs/plans/2026-05-02-agent-first-design-system-simplification-plan.md`              | active             | Approved execution plan for simplifying the agent-first design-system repo shape.                                               | n/a                                                                               | Current simplification execution authority until P0-P5 complete.                  | 2026-05-02   |
| `docs/specs/2026-05-02-agent-first-design-system-simplification-spec.md`              | active             | Source spec for the current simplification plan.                                                                                | n/a                                                                               | Acceptance and scope authority for the simplification lane.                       | 2026-05-02   |
| `docs/plans/2026-04-30-agent-design-prepare-north-star-plan.md`                       | historical         | Completed north-star plan evidence still referenced by prepare payload source digests.                                          | `docs/guides/AGENT_DESIGN_WORKFLOW.md` for workflow; source digests for evidence. | Evidence only unless a current plan links back to it.                             | 2026-05-02   |
| Older `docs/plans/**` and `docs/specs/**`                                             | historical         | Past planning/spec evidence can conflict with current workflow if read as authority.                                            | `docs/plans/README.md` and current active plan/spec rows.                         | Evidence only after checking the index.                                           | 2026-05-02   |
| `.spec/**`                                                                            | historical         | Legacy ignored planning/spec material still has active references and must not be deleted in P0.                                | Current `docs/specs/**`, `docs/plans/**`, and guide pages.                        | Evidence only; no execution authority unless a current doc links a specific file. | 2026-05-02   |
| `.kiro/**`                                                                            | historical         | Legacy steering still has active page-development links.                                                                        | Current guides after a future migration.                                          | Linked page-development reference only; not agent-design authority.               | 2026-05-02   |
| `ai/prompts/**` and `ai/sessions/**`                                                  | historical         | Prompt/session provenance, not current repo workflow authority.                                                                 | Current specs, plans, and guide pages.                                            | Provenance only.                                                                  | 2026-05-02   |
| `reports/README.md`                                                                   | active             | Report index separates current evidence from archived snapshots.                                                                | n/a                                                                               | Report selection authority.                                                       | 2026-05-02   |
| `reports/archive/**`                                                                  | archived           | Historical report snapshots.                                                                                                    | Current reports listed in `reports/README.md`.                                    | Traceability only.                                                                | 2026-05-02   |
| `artifacts/reviews/README.md`                                                         | active             | Review-artifact index names current synthesis files before old rounds.                                                          | n/a                                                                               | Review evidence selection authority.                                              | 2026-05-02   |
| `artifacts/reviews/archive/**`                                                        | archived           | Older review rounds kept for traceability.                                                                                      | Current review authority rows in `artifacts/reviews/README.md`.                   | Traceability only.                                                                | 2026-05-02   |
| `.spec/archive/diagrams/*.png`                                                        | obsolete_candidate | Generated diagram images are already identified as cleanup candidates, but active reference audits must finish before deletion. | Source `.mmd` files or current architecture diagrams.                             | Do not delete until a dedicated cleanup phase records exact reference evidence.   | 2026-05-02   |

## Agent Flow

1. Run the prepare command for the exact surface before editing UI:

```bash
astudio design prepare --surface <path> --json
```

1. In this repo, the clean-checkout convenience wrapper is:

```bash
pnpm --silent agent-design:prepare --surface <path>
```

The wrapper is build-backed setup. It may build `packages/agent-design-engine`, `packages/design-system-guidance`, `packages/skill-ingestion`, and `packages/cli` before invoking the CLI. The read-only operation contract belongs to `astudio design prepare` itself once the CLI is available. Use `pnpm --silent` for JSON capture, because plain `pnpm` prints lifecycle banners before script output.

JSON remains the canonical machine contract. When a human-readable handoff is useful, derive it from the same typed payload instead of writing a second summary path:

```bash
astudio design prepare --surface <path> --format brief
astudio design prepare --surface <path> --format pr-evidence
```

1. If `safeForAutomaticImplementation` is `false`, stop and follow `openDecisions`. Do not invent components, token roles, states, examples, or proposal outcomes.
1. If implementation is safe, use the returned `nextAction`, `recommendedRoutes`, `designTokenContract`, `doNotInvent`, `requiredStates`, `relevantExamples`, `forbiddenPatterns`, and `validationCommands` as the implementation brief.
1. Edit the UI.
1. Run the returned read-only validation commands that apply to the changed surface.
1. Before PR handoff, run `pnpm agent-design:prepare:changed`. It builds the local CLI dependencies, checks changed `.tsx`/`.jsx` UI surfaces with the read-only prepare command, and fails if any surface is unsafe or missing prepare evidence. Use `pnpm agent-design:prepare:changed -- --surface <path>` for a single surface.
1. CI reruns the changed-surface gate on pull requests in the web platform lane. If it fails, treat that as a missing or unsafe prepare contract, not as a generic CI failure.
1. If validation fails or a proposal-required stop appears, fix the underlying design-system evidence or open the proposal/manual decision path.

Supporting commands such as `astudio design lint`, `astudio design export`, `astudio design components`, `astudio design coverage`, and `astudio design propose-abstraction` are diagnostics. They are not the normal happy path before UI edits.

## Migration Flow

Dry-run migration to `design-md` mode:

```bash
pnpm -C packages/cli run start -- design migrate --to design-md --dry-run --json
```

Write only after reviewing the dry-run result:

```bash
pnpm -C packages/cli run start -- design migrate --to design-md --write --yes --json
```

Rollback remains write-gated:

```bash
pnpm -C packages/cli run start -- design migrate --rollback --dry-run --json
```

## Validation

Focused validation for this workflow:

```bash
pnpm agent-design:type-check
pnpm agent-design:test
pnpm -C packages/design-system-guidance type-check
pnpm -C packages/design-system-guidance build
pnpm -C packages/cli build
pnpm -C packages/cli test
```

## Known Limits

The first engine slice validates the design contract and rule provenance. It does not inspect every JSX/CSS implementation detail. Keep using the existing guidance checks, policy tests, visual checks, and component tests for implementation-level enforcement.
