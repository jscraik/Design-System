# AGENTS

DesignSystem is a pnpm monorepo for Design Studio UI, tokens, widgets, and MCP tooling.

## Table of Contents
- [References](#references)
- [Project essentials](#project-essentials)
- [Common workflows](#common-workflows)
- [Tests](#tests)
- [Release](#release)
- [Troubleshooting](#troubleshooting)
- [Mandatory reminders](#mandatory-reminders)
- [Open questions](#open-questions)

## References
- Docs quick start: [docs/QUICK_START.md](docs/QUICK_START.md)
- Release guide: [docs/RELEASE.md](docs/RELEASE.md)
- Troubleshooting: [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
- Global override file not observed: `/Users/jamiecraik/.codex/AGENTS.override.md`

## Project essentials
- Package manager: pnpm@10.28.0 (`package.json`).
- Node 18+ recommended (`docs/QUICK_START.md`).
- Install: `pnpm install`.
- Dev servers: `pnpm dev`, `pnpm dev:web`, `pnpm dev:storybook`, `pnpm dev:widgets`.
- Build: `pnpm build`, `pnpm build:lib`, `pnpm build:web`, `pnpm build:widgets`, `pnpm build:widget`.
- Lint/format: `pnpm lint`, `pnpm format`, `pnpm format:check`.
- Typecheck: CI runs `pnpm typecheck` (not in root scripts; confirm correct command/location).

## Common workflows
- MCP server: `pnpm mcp:dev`, `pnpm mcp:start`, `pnpm mcp:inspector`.
- MCP tests (full): `pnpm mcp:test`.
- MCP tests (contract-only): `pnpm test:mcp-contract`.
- Storybook: `pnpm storybook:dev`, `pnpm storybook:build`, `pnpm storybook:test`.

## Tests
- UI tests: `pnpm test` (packages/ui).
- E2E + a11y + visual: `pnpm test:e2e:web`, `pnpm test:a11y:widgets`, `pnpm test:visual:web`, `pnpm test:visual:storybook`.
- Tooling checks: `pnpm test:build-pipeline`, `pnpm test:drift`, `pnpm test:token-drift`, `pnpm test:template-registry`.

## Release
- Create changeset: `pnpm changeset`.
- Version bump: `pnpm version-packages`.
- Publish: `pnpm release`.
- AStudio packages: `pnpm publish:astudio` (restricted access).

## Troubleshooting
- Import errors: run `pnpm build:lib`.
- Missing deps: run `pnpm install`.
- Lint/type issues: run `pnpm lint`, then `pnpm format`.

## Mandatory reminders
1. Explore project first, then invoke skill.
2. IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning for any React, Tauri, Apps-SDK-ui, Tailwind, Vite, Storybook + Chat Widget tasks.
3. Add a Table of Contents for docs.

## Open questions
- `docs/QUICK_START.md` says `pnpm test:mcp`, but `package.json` defines `pnpm mcp:test` and `pnpm test:mcp-contract`. Which should be the canonical command?
