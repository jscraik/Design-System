# FORJAMIE.md

## TL;DR

AStudio is a pnpm workspace monorepo for the Design Studio ecosystem. It ships web apps (main web app + Storybook), reusable UI/runtime libraries, MCP tooling, and build/test automation. Desktop is **intentionally deferred** today, with placeholders that fail fast to avoid being treated as runnable until a Tauri + Vite scaffold is added.

## Architecture (high-level)

- **Platforms**
  - `platforms/web/`: browser experiences (main web app + Storybook).
  - `platforms/mcp/`: MCP server + tool contracts for ChatGPT integration.
  - `platforms/desktop/`: reserved for a future desktop shell (Tauri).
- **Packages**
  - `packages/ui`: core React UI components and styles.
  - `packages/runtime`: runtime utilities and host adapters.
  - `packages/tokens`: design tokens build + validation.
  - `packages/widgets`: embeddable widgets.
  - `packages/cli`: developer tooling.
  - `packages/astudio-icons`, `packages/json-render`, etc.
- **Tooling**
  - `scripts/`: build pipeline, compliance checks, version sync, and automation.
  - `docs/`: architecture and build pipeline docs.

**Data/flow (conceptual):**
1. Design tokens and UI packages build first (`packages/tokens`, `packages/ui`).
2. Web apps consume built packages for runtime + UI.
3. MCP tools expose integration surfaces for external agents.

## Codebase map

- Root
  - `platforms/`
    - `web/` (primary app + Storybook)
    - `mcp/` (tooling + server)
    - `desktop/` (future desktop shell; currently deferred)
  - `packages/` (shared libraries)
  - `scripts/` (build/test/automation)
  - `docs/` (architecture + build pipeline docs)
  - `tools/`, `bin/`, `_tools/` (support tooling)

## How to run / test

From repo root (pnpm workspace):

- Install deps: `pnpm install`
- Dev web app: `pnpm dev` or `pnpm dev:web`
- Dev Storybook: `pnpm dev:storybook`
- Build pipeline: `pnpm build` (see `scripts/build-pipeline.mjs`)
- Lint/format: `pnpm lint`, `pnpm format`, `pnpm format:check`
- Tests:
  - UI unit tests: `pnpm test`
  - Web e2e: `pnpm test:e2e:web`
  - Widgets a11y: `pnpm test:a11y:widgets`
  - Visual regression: `pnpm test:visual:web` / `pnpm test:visual:storybook`

**Desktop:** The desktop package is intentionally deferred. Its scripts exit non-zero with a message until the Tauri + Vite scaffold is created.

## Lessons learned

- Keep placeholder app packages explicitly non-runnable to avoid accidental CI failures or confusion.

## Weaknesses & improvements

- Desktop support is not yet scaffolded. When ready, add Tauri + Vite scaffolding and wire root scripts for `dev:desktop`/`build:desktop`.

## Recent changes

- Deferred `@design-studio/desktop` intentionally; scripts now fail fast with guidance and the local README clarifies next steps.
