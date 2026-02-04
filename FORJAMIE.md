# FORJAMIE.md

## TL;DR
- **What this is:** aStudio is a library-first pnpm monorepo for building consistent ChatGPT-style UIs across widgets, web apps, and an MCP integration surface. It centers on `@design-studio/ui`, `@design-studio/runtime`, and `@design-studio/tokens`, with platform apps for the Widget Gallery and Storybook. 【F:README.md†L1-L209】
- **What changed recently:** See “Recent Changes” for the latest doc/update entry.
- **Primary surfaces:** Widget Gallery (`platforms/web/apps/web`), Storybook (`platforms/web/apps/storybook`), MCP server (`platforms/mcp`). 【F:README.md†L41-L66】

## Architecture & Diagrams

### High-level flow
```
Your Apps / Widgets / ChatGPT
        │
        ▼
@design-studio/ui (React components)
        │
        ▼
@design-studio/runtime (host adapters)
        │
        ▼
@design-studio/tokens (design tokens, CSS vars)
```
The repo ships a shared UI library and a runtime host abstraction, then consumes those in platform apps (Widget Gallery, Storybook) and widget bundles. This mirrors the architecture diagram in the root README. 【F:README.md†L318-L382】

### Build pipeline overview
```
Version Sync (optional) → Token Generation → Token Validation → Package Builds → Tests
```
The build pipeline is orchestrated by `scripts/build-pipeline.mjs` and uses incremental builds plus token validation, with CI running build/a11y/visual suites. 【F:docs/BUILD_PIPELINE.md†L1-L141】

## Codebase Map (top-level)
- `platforms/mcp/` — MCP server and tool contracts for ChatGPT integration. 【F:AGENTS.md†L33-L40】
- `platforms/web/apps/web/` — Widget Gallery for visual testing + widget bundles. 【F:README.md†L41-L66】
- `platforms/web/apps/storybook/` — Storybook for component docs and interactive dev. 【F:README.md†L41-L66】
- `packages/ui/` — React component library (chat layout, primitives, templates). 【F:README.md†L25-L56】
- `packages/runtime/` — Host adapters and provider for embedded/standalone hosts. 【F:README.md†L25-L56】
- `packages/tokens/` — Design tokens (CSS vars + Tailwind preset). 【F:README.md†L25-L56】
- `packages/widgets/` — Widget bundles targeting ChatGPT. 【F:README.md†L25-L56】
- `packages/cloudflare-template/` — MCP deployment template for Cloudflare Workers. 【F:README.md†L25-L56】
- `docs/` — Architecture, guides, audits, and workflows. Start at `docs/README.md`. 【F:docs/README.md†L1-L120】
- `scripts/` — Build pipeline and version sync tooling. 【F:docs/BUILD_PIPELINE.md†L61-L73】

## How to Run (dev)
> From repo root, using Node.js 18+ and pnpm 10.28.0.

```bash
pnpm install
pnpm dev           # Widget Gallery http://localhost:5173
pnpm dev:storybook # Storybook http://localhost:6006
```
For MCP integration (optional):
```bash
pnpm mcp:dev
```
These commands and ports are documented in the root README. 【F:README.md†L85-L160】

## How to Build & Test

### Build
```bash
pnpm build          # full build pipeline
pnpm build:web      # web-only
pnpm build:widgets  # widget bundles
```
Build pipeline details (incremental builds, token validation) are in `docs/BUILD_PIPELINE.md`. 【F:README.md†L100-L141】【F:docs/BUILD_PIPELINE.md†L1-L141】

### Tests / QA
```bash
pnpm test
pnpm test:e2e:web
pnpm test:a11y:widgets
pnpm test:visual:web
pnpm test:visual:storybook
pnpm test:mcp-contract
```
Full test command list is in the root README. 【F:README.md†L124-L141】

## Lessons Learned
- **Keep tokens in sync**: If token validation fails, run `pnpm generate:tokens` before `pnpm validate:tokens`. 【F:docs/BUILD_PIPELINE.md†L83-L141】
- **Start from the docs index**: `docs/README.md` is the fastest path to architecture and workflow docs. 【F:docs/README.md†L1-L120】

## Weaknesses & Improvements
- **Owner + review cadence placeholders**: Multiple docs still list “TBD (confirm)” for ownership and review cadence. Confirm and update them in a future docs pass. 【F:README.md†L9-L18】【F:docs/BUILD_PIPELINE.md†L7-L15】
- **Architecture details scattered**: Key diagrams live in README and architecture docs; consider consolidating into a single “system overview” doc for faster onboarding. 【F:README.md†L318-L382】【F:docs/README.md†L45-L90】

## Recent Changes
- **docs:** Added `FORJAMIE.md` and removed its `.gitignore` entry so the project memory file is tracked in git. Commit: _pending_.
