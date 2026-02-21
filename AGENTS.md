# AGENTS.md (DesignSystem)

One-line: a pnpm workspace monorepo for the aStudio cross-platform UI workbench (widgets, web apps, MCP).

## Table of Contents
- [Quick orientation](#quick-orientation)
- [Tooling essentials](#tooling-essentials)
- [Core commands](#core-commands)
- [CI parity checks](#ci-parity-checks)
- [References](#references)
- [Open questions](#open-questions)

## Quick orientation
- Repo map: `packages/`, `platforms/`, `docs/`, `scripts/`.
- Global instruction order: this file -> `docs/README.md` -> `README.md` (deeper detail).

Mandatory snippet (verbatim):
1. Explore project first, then invoke skill.
2. IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning for any React, Tauri, Apps-SDK-ui, Tailwind, Vite, Storybook + Chat Widget tasks.
3. Add a Table of Contents for docs.

## Tooling essentials
- Node.js 18+ and pnpm 10.28.0 (see `package.json`/README).
- Use Biome for lint/format: `pnpm lint`, `pnpm format`, `pnpm format:check`.

## Core commands
- Dev surfaces:
  - `pnpm dev` (Widget Gallery)
  - `pnpm dev:web`
  - `pnpm dev:storybook`
- Builds:
  - `pnpm build` / `pnpm build:web` / `pnpm build:widgets`
  - `pnpm build:widget` (single-file widget HTML)
- Tests:
  - `pnpm test` (UI unit tests)
  - `pnpm storybook:test`
  - `pnpm test:e2e:web`
  - `pnpm test:a11y:widgets:ci`
  - `pnpm test:visual:web`
  - `pnpm test:visual:storybook`
  - `pnpm test:mcp-contract`
- MCP server:
  - `pnpm mcp:dev`
  - `pnpm mcp:start`

## CI parity checks
- Version sync guard: `pnpm sync:versions:check`.
- Type checks (web CI):
  - `pnpm -C packages/ui type-check`
  - `pnpm -C packages/runtime type-check`
  - `pnpm -C packages/tokens type-check`
- Policy/compliance: `pnpm test:policy`, `pnpm lint:compliance`.
- Governance gate (if editing GOVERNANCE/COMPLIANCE/SECURITY/EVALUATION or listed files):
  - `python3 .github/scripts/gov_security_gates.py`

## References
- Quick start: `docs/QUICK_START.md`
- Build pipeline: `docs/BUILD_PIPELINE.md`
- Test strategy: `docs/TEST_PLAN.md`
- CI workflow: `.github/workflows/ci.yml`
- Governance gate workflow: `.github/workflows/gov-security-gates.yml`

## Open questions
- `docs/QUICK_START.md` says `pnpm test:mcp` and `pnpm typecheck`, but `package.json` uses `pnpm mcp:test` and has no root `typecheck`. Which should AGENTS.md recommend?
- `docs/QUICK_START.md` says `pnpm build:widget` outputs `packages/widgets/dist/`; README and scripts imply `platforms/web/apps/web/dist/widget.html`. Which is correct?
