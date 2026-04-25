# Agent Design Workflow

## Table of Contents
- [Purpose](#purpose)
- [When To Use](#when-to-use)
- [Agent Flow](#agent-flow)
- [Migration Flow](#migration-flow)
- [Validation](#validation)
- [Known Limits](#known-limits)

## Purpose

This guide explains how coding agents should use `DESIGN.md` and `astudio design` before creating or refactoring UI in this repository.

## When To Use

Use this workflow when an agent is asked to design, redesign, restyle, or review UI. The workflow is not a replacement for component tests or visual checks; it is the semantic contract step that tells an agent which brand, hierarchy, state, motion, focus, viewport, and component-routing expectations apply.

## Agent Flow

1. Read `DESIGN.md` at the repo root.
2. Run `pnpm agent-design:lint` or `pnpm -C packages/cli run start -- design lint --file DESIGN.md --json`.
3. If lint fails, fix `DESIGN.md` or the rule sources before generating UI.
4. Export the contract for downstream tooling when needed:

```bash
pnpm -C packages/cli run start -- design export --file DESIGN.md --format json@agent-design.v1 --json
```

5. Build UI using the contract plus the existing design-system docs:

```text
docs/design-system/PROFESSIONAL_UI_CONTRACT.md
docs/design-system/AGENT_UI_ROUTING.md
docs/design-system/COMPONENT_LIFECYCLE.json
docs/design-system/COVERAGE_MATRIX.json
```

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
