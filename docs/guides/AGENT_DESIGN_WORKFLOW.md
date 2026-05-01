# Agent Design Workflow

## Table of Contents
- [Purpose](#purpose)
- [When To Use](#when-to-use)
- [Agent Flow](#agent-flow)
- [Migration Flow](#migration-flow)
- [Validation](#validation)
- [Known Limits](#known-limits)

## Purpose

This guide explains the required pre-edit design-system step for coding agents creating or refactoring UI in this repository.

## When To Use

Use this workflow when an agent is asked to design, redesign, restyle, or review UI. The workflow is not a replacement for component tests or visual checks; it is the semantic contract step that tells an agent which components, token roles, states, examples, forbidden patterns, validation commands, and proposal-required stops apply.

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

1. If `safeForAutomaticImplementation` is `false`, stop and follow `openDecisions`. Do not invent components, token roles, states, examples, or proposal outcomes.
1. If implementation is safe, use the returned `recommendedRoutes`, `designTokenContract`, `requiredStates`, `relevantExamples`, `forbiddenPatterns`, and `validationCommands` as the implementation brief.
1. Edit the UI.
1. Run the returned read-only validation commands that apply to the changed surface.
1. Before PR handoff, run `pnpm agent-design:prepare:changed`. It builds the local CLI dependencies, checks changed `.tsx`/`.jsx` UI surfaces with the read-only prepare command, and fails if any surface is unsafe or missing prepare evidence. Use `pnpm agent-design:prepare:changed -- --surface <path>` for a single surface.
1. CI reruns the changed-surface gate on pull requests in the web platform lane. If it fails, treat that as a missing/unsafe prepare contract, not as a generic CI failure.
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
