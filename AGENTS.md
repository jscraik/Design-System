# Repository Guidelines

Last updated: 2026-01-31

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

---

## Operator handoff

Keep `FORJAMIE.md` accurate as the operator handoff. When an authorized change
makes its behavior, architecture, code map, setup, or validation guidance
inaccurate, update the affected sections in the same change. Record a lesson,
weakness, improvement, or recent-change entry only when supported and useful
for that handoff. Reuse accurate sections.

Infer routine documentation details from repository evidence. Ask only when an
unresolved decision materially affects correctness or authority, while
continuing independent work. Completion requires the requested result,
appropriate verification, and any affected documentation to agree.

---

## Project Structure & Module Organization

This is a pnpm workspace monorepo. Key locations:

- `platforms/mcp/` — MCP server + tool contracts for ChatGPT integration.
- `packages/` — reusable libraries (`ui`, `runtime`, `tokens`, `widgets`, `cloudflare-template`, `cli`, `astudio-icons`, `astudio-make-template`, `skill-ingestion`).
- `docs/` — architecture, guides, audits, and build pipeline docs.
- `scripts/` — build pipeline, version sync, and compliance tooling.

## Build, Test, and Development Commands

Common commands (from root `package.json`):

- `pnpm install` — install workspace dependencies.
- `pnpm dev` — run web app.
- `pnpm dev:web` / `pnpm dev:storybook` — run only one surface.
- `pnpm build` / `pnpm build:web` / `pnpm build:widgets` — build pipeline targets.
- `pnpm lint` / `pnpm format` / `pnpm format:check` — lint and formatting.
- `pnpm test` — UI unit tests.
- `pnpm test:e2e:web` / `pnpm test:a11y:widgets` / `pnpm test:visual:web` / `pnpm test:visual:storybook` — Playwright suites.

## Coding Style & Naming Conventions

- JS/TS: Biome (`biome.json`) + policy checks (`pnpm test:policy`). Keep files formatted via `pnpm format`.
- React components live in `packages/ui/src/components/**`; Storybook stories use `*.stories.tsx`.

## Testing Guidelines

- Web/UI: Vitest in `packages/ui`, Playwright for e2e/a11y/visual.

## Commit & Pull Request Guidelines

Recent history follows Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`. PRs should include a clear summary, relevant test results, and updates to docs when public APIs or workflows change. Use the checklist in `CONTRIBUTING.md` (lint, format check, build, and tests for touched areas).

## Security & Configuration

Use local `.env` only; never commit secrets. Review `SECURITY.md` for policies. For tokens and cross‑platform parity, follow `docs/architecture/` and `docs/BUILD_PIPELINE.md`.

---

## Code Quality

### JSON Validation

Always verify JSON syntax with `jq` or similar before declaring JSON fixes complete. Run: `cat <file> | jq .` to validate.

---

## Development Environment

### Mise Tool Trust

When fixing mise trust errors, run `mise trust` explicitly and verify with `mise list` or `mise doctor` before considering the task complete.

### Tool Installation Verification

After installing development tools, always verify installation with `--version` or equivalent and confirm the tool is in PATH.

## Repository preflight helper
- Use `scripts/codex-preflight.sh` before multi-step, destructive, or path-sensitive workflows.
- Source it with `source scripts/codex-preflight.sh` and run `preflight_repo` (or `preflight_js`, `preflight_py`, `preflight_rust`) as a guard before changing repo state.

## Mandatory workflow snippet
1. Read applicable instructions and relevant project sources before implementation; use a skill when required or applicable.
2. IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning for any React, Tauri, Apps-SDK-ui, Tailwind, Vite, Storybook + Chat Widget tasks.
3. Add a Table of Contents when it helps readers navigate the document.

## Documentation map
### Table of Contents
- [Instruction map](docs/agents/01-instruction-map.md)
- [Tooling and command policy](docs/agents/02-tooling-policy.md)
- [Validation and checks](docs/agents/03-validation.md)
- [Contradictions and cleanup](docs/agents/04-contradictions-and-cleanup.md)
