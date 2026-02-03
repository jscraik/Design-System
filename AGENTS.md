# Repository Guidelines

Last updated: 2026-01-31

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

---

# Jamie's "Living Map" Rule (put this in every CLAUDE.md + AGENTS.md)

When you work in this repo, you're not just changing code — you're also keeping the **map** up to date.

## The one file that matters: `FORJAMIE.md`

For **every project**, maintain a detailed `FORJAMIE.md` at the repo root that explains the whole project in plain language — like you're explaining it to future-me after I've been away for a while.

**Hard rule:** if a commit changes behavior, structure, data flow, config, or tooling, then `FORJAMIE.md` must be updated **in the same change-set**. If a commit already happened without the doc update, immediately follow with a doc-fix commit.

Think of `FORJAMIE.md` as the "project memory" that never forgets.

## The "after every commit" update ritual (Doc Update Gate)

Before you call the work "done", update `FORJAMIE.md` so it's true again.

Checklist:

1. **TL;DR still matches reality** (what this is + what changed).
2. **Architecture & diagrams** updated if any connections/flows changed.
3. **Codebase map** updated if files/dirs/modules moved/appeared/disappeared.
4. **How to run/test** updated if commands, env, config, or setup changed.
5. **Lessons learned** recorded (bugs hit, root cause, fix, prevention).
6. **Weaknesses & improvements** updated.
7. Add a short **Recent Changes** entry: *what changed, why, impact* (include commit hash if available).

If you can't do one of these because something is unclear, stop and ask **one** yes/no question.

## Definition of done (for any task/commit)

Not done until:

- The code works, **and**
- `FORJAMIE.md` matches reality, **and**
- Diagrams are accurate, **and**
- Weak spots + improvements are updated, **and**
- Recent change entry is added.

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
