# Command Surface

Last updated: 2026-05-02

## Doc requirements

- Audience: Developers and AI coding agents
- Scope: Root command routing and canonical validation entry points
- Non-scope: Full package-level script reference
- Owner: Jamie Scott Craik (@jscraik)
- Review cadence: Every release or when root scripts change

This page names the commands agents and humans should reach for first. Keep it as the command map; do not make README, `FORJAMIE.md`, and workflow guides each carry their own competing script inventory.

## Table of Contents

- [Agent UI Preparation](#agent-ui-preparation)
- [Core Repo Gates](#core-repo-gates)
- [Product Surfaces](#product-surfaces)
- [Specialist Validation](#specialist-validation)
- [Compatibility Aliases](#compatibility-aliases)
- [Agent Rules](#agent-rules)

## Agent UI Preparation

Use these before or during protected UI work.

| Command                                                 | Use                                                       | Notes                                                                                                                  |
| ------------------------------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `pnpm --silent agent-design:prepare --surface <path>`   | JSON-safe local pre-edit payload for one UI surface.      | Build-backed wrapper. Use `--silent` whenever stdout is parsed as JSON.                                                |
| `pnpm agent-design:prepare:changed`                     | PR/local evidence gate for changed protected UI surfaces. | Builds the prepare stack, discovers changed `.tsx`/`.jsx` surfaces, and fails closed on unsafe or incomplete payloads. |
| `pnpm agent-design:prepare:changed -- --surface <path>` | Targeted evidence gate for one explicit surface.          | Use when preparing or debugging a single UI file.                                                                      |
| `pnpm agent-design:lint`                                | Design contract diagnostics.                              | Supporting diagnostic, not the normal pre-edit path.                                                                   |
| `pnpm agent-design:test`                                | Agent-design engine tests.                                | Focused validation for prepare/routing/contract behavior.                                                              |

The underlying read-only operation contract is `astudio design prepare`. The root `pnpm` wrapper may build workspace packages before invoking the CLI.

## Core Repo Gates

Use these for ordinary repo health and handoff evidence.

| Command            | Use                                                         |
| ------------------ | ----------------------------------------------------------- |
| `pnpm lint`        | Biome check for code style and formatting-sensitive issues. |
| `pnpm docs:lint`   | Canonical docs quality and link check.                      |
| `pnpm typecheck`   | Workspace TypeScript check.                                 |
| `pnpm test`        | Default UI unit test suite.                                 |
| `pnpm test:policy` | Browser-free policy and design-system integrity checks.     |
| `pnpm build`       | Aggregate build pipeline.                                   |
| `git diff --check` | Whitespace and patch hygiene.                               |

## Product Surfaces

Reach for these when the changed surface is narrower than the full repo.

| Surface   | Commands                                                                                                |
| --------- | ------------------------------------------------------------------------------------------------------- |
| Web app   | `pnpm dev:web`, `pnpm build:web`, `pnpm test:e2e:web`, `pnpm test:visual:web`                           |
| Storybook | `pnpm dev:storybook`, `pnpm storybook:build`, `pnpm storybook:test`, `pnpm test:visual:storybook`       |
| Widgets   | `pnpm dev:widgets`, `pnpm build:widgets`, `pnpm test:a11y:widgets`                                      |
| MCP       | `pnpm mcp:dev`, `pnpm mcp:test`, `pnpm mcp:test:contract`, `pnpm mcp:test:jsonrpc`, `pnpm mcp:test:cli` |
| Tokens    | `pnpm generate:tokens`, `pnpm validate:tokens`, `pnpm test:tokens`                                      |
| Guidance  | `pnpm design-system-guidance:check:ci`, `pnpm release:guidance:validate`                                |

## Specialist Validation

These commands are intentionally narrower than the core gates.

| Command                           | Use                                                                  |
| --------------------------------- | -------------------------------------------------------------------- |
| `pnpm validation-prototype:build` | Tree-shaking validation fixture. Keep it fixture-only.               |
| `pnpm agent-design:boundaries`    | Ownership tripwire for agent-design package boundaries.              |
| `pnpm agent-design:proposals`     | Proposal and waiver integrity gate.                                  |
| `pnpm quality-debt:check`         | Quality-debt radar contract check.                                   |
| `pnpm quality-debt:report`        | Warn-first quality-debt evidence report.                             |
| `pnpm generated-source:check`     | Tracked generated-source freshness gate.                             |
| `pnpm tracked-ignored:check`      | Guard against ignored runtime/build/test artifacts becoming tracked. |

## Compatibility Aliases

Compatibility aliases remain only when active docs or older automation still reference them.

| Alias                  | Canonical command      | Status                                                        |
| ---------------------- | ---------------------- | ------------------------------------------------------------- |
| `pnpm doc:lint`        | `pnpm docs:lint`       | Compatibility alias only. Do not add new docs that prefer it. |
| `pnpm tokens:validate` | `pnpm validate:tokens` | Compatibility alias for older token docs.                     |

Remove an alias only after an `rg` reference audit proves active docs, scripts, plans, and workflows no longer call it.

## Agent Rules

- Prefer the smallest canonical command that proves the touched surface.
- Use `pnpm --silent agent-design:prepare --surface <path>` when capturing JSON from the local wrapper.
- Do not parse JSON from plain `pnpm agent-design:prepare`; package-manager lifecycle banners can precede the payload.
- Treat compatibility aliases as old-entry support, not as new workflow choices.
- When public workflow, tooling, structure, or package taxonomy changes, update `FORJAMIE.md` in the same change-set.
