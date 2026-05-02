# Package Taxonomy

Last updated: 2026-05-02

## Doc Requirements

- Audience: Developers and AI coding agents
- Scope: Workspace package lifecycle decisions that affect imports, scripts, and validation
- Non-scope: Historical package reorganization proposals
- Owner: Jamie Scott Craik (@jscraik)
- Review cadence: Every release or when a package moves between lifecycle states

## Table Of Contents

- [Purpose](#purpose)
- [Lifecycle States](#lifecycle-states)
- [Current Decisions](#current-decisions)
- [Validation Contract](#validation-contract)
- [Change Rules](#change-rules)

## Purpose

This repo keeps reusable libraries, deployment templates, app surfaces, and validation
fixtures in one pnpm workspace. That is useful, but it can confuse agents when a
folder under `packages/` is not a publishable product library.

Use this taxonomy as the current authority before moving, deleting, importing, or
excluding any workspace package.

## Lifecycle States

| State               | Meaning                                                                               | Agent rule                                                                  |
| ------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Product library     | Reusable package consumed by apps, widgets, templates, or external package consumers. | Treat as first-class source and keep root validation green.                 |
| Template package    | Workspace package that exists to ship a deployable or generated starter surface.      | Keep under package validation, but do not treat as a shared UI abstraction. |
| App surface         | Runnable application surface owned by a platform subtree.                             | Edit through the platform app workflow and validate with app-level gates.   |
| Platform service    | Non-UI platform runtime or integration service.                                       | Keep service contracts explicit and avoid treating it as a UI package.      |
| Validation fixture  | Workspace-owned proof harness used by scripts or reports.                             | Keep scripts explicit and avoid importing it from product code.             |
| Navigation index    | README-only pointer surface.                                                          | Do not place implementation source here.                                    |
| Historical proposal | Old reorganization or audit material.                                                 | Do not execute from it unless a current plan promotes it.                   |

## Current Decisions

| Surface                          | Current state      | Decision                                                                                                                                                    |
| -------------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/ui`                    | Product library    | Canonical React UI package.                                                                                                                                 |
| `packages/runtime`               | Product library    | Shared Apps SDK and host-runtime utility package.                                                                                                           |
| `packages/tokens`                | Product library    | Token source, generated token API, and Tailwind preset package.                                                                                             |
| `packages/widgets`               | Product library    | Widget source and generated widget manifest owner.                                                                                                          |
| `packages/effects`               | Product library    | Kept as a first-class package and included in root `pnpm typecheck`.                                                                                        |
| `packages/cloudflare-template`   | Template package   | Retained under `packages/` because version-sync, generated-source freshness, deployment docs, and Cloudflare validation scripts all target this path.       |
| `packages/astudio-make-template` | Template package   | Retained under `packages/` because it is a workspace-packaged starter template with explicit guideline and dependency inputs.                               |
| `packages/validation-prototype`  | Validation fixture | Retained as a tree-shaking proof harness behind `pnpm validation-prototype:build` and `pnpm validation-prototype:analyze`; product code must not import it. |
| `apps/`                          | Navigation index   | README-only pointers to canonical app paths under `platforms/`; implementation remains under `platforms/**`.                                                |
| `platforms/web/apps/web`         | App surface        | Canonical web app and widget-gallery surface.                                                                                                               |
| `platforms/web/apps/storybook`   | App surface        | Canonical Storybook development and visual-verification surface.                                                                                            |
| `platforms/desktop/apps/desktop` | App surface        | Desktop shell scaffold.                                                                                                                                     |
| `platforms/mcp`                  | Platform service   | MCP server and tool-contract runtime surface.                                                                                                               |

## Validation Contract

Package taxonomy changes must keep these commands honest:

```bash
pnpm typecheck
pnpm build
pnpm test:policy
pnpm docs:lint
git diff --check
```

Focused package changes should also run the package-local command that proves the
decision. For example, changes to `packages/effects` should run
`pnpm -C packages/effects type-check`, and changes to the tree-shaking fixture
should run `pnpm validation-prototype:build`.

## Change Rules

- Do not move a template package out of `packages/` unless the same change updates
  workspace config, generated-source scripts, version-sync lists, deployment docs,
  package references, and validation evidence.
- Do not exclude a product library from root validation without documenting the
  owner, reason, fix path, and focused package-local validation status here.
- Do not add implementation files under `apps/`; add app source under the matching
  `platforms/**` path and update the `apps/` pointer README only if navigation
  changes.
- Do not import `packages/validation-prototype` from production source. It is a
  validation fixture, not a product dependency.
