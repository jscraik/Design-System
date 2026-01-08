# Repository Guidelines

Last updated: 2026-01-07

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Project Structure & Module Organization

This is a pnpm workspace monorepo. Key locations:

- `platforms/mcp/` — MCP server + tool contracts for ChatGPT integration.
- `packages/` — reusable libraries (`ui`, `runtime`, `tokens`, `widgets`, `cloudflare-template`, `cli`).
- `platforms/apple/apps/macos/` — macOS apps (Xcode/SwiftPM).
- `platforms/apple/swift/` — Swift packages and macOS/iOS components; legacy Swift package lives in `platforms/apple/swift/ui-swift/`.
- `docs/` — architecture, guides, audits, and build pipeline docs.
- `scripts/` — build pipeline, version sync, and compliance tooling.

## Build, Test, and Development Commands

Common commands (from root `package.json`):

- `pnpm install` — install workspace dependencies.
- `pnpm dev` — run web app + Storybook.
- `pnpm dev:web` / `pnpm dev:storybook` — run only one surface.
- `pnpm build` / `pnpm build:web` / `pnpm build:widgets` / `pnpm build:macos` — build pipeline targets.
- `pnpm lint` / `pnpm format` / `pnpm format:check` — lint and formatting.
- `pnpm test` — UI unit tests.
- `pnpm test:e2e:web` / `pnpm test:a11y:widgets` / `pnpm test:visual:web` / `pnpm test:visual:storybook` — Playwright suites.
- `pnpm test:swift` (or `test:swift:*`) — Swift package + macOS app tests.

## Coding Style & Naming Conventions

- JS/TS: ESLint (`eslint.config.js`) + Prettier (`prettier.config.cjs`). Keep files formatted via `pnpm format`.
- React components live in `packages/ui/src/components/**`; Storybook stories use `*.stories.tsx`.
- Swift: follow existing patterns in `platforms/apple/swift/*`; centralize platform differences in `Platform.swift` where used.

## Testing Guidelines

- Web/UI: Vitest in `packages/ui`, Playwright for e2e/a11y/visual.
- Swift: XCTest via `swift test` in each Swift package (`platforms/apple/swift/*/Tests`).
- macOS apps: see `platforms/apple/apps/macos/SETUP_GUIDE.md` for Xcode workflow.

## Commit & Pull Request Guidelines

Recent history follows Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`. PRs should include a clear summary, relevant test results, and updates to docs when public APIs or workflows change. Use the checklist in `CONTRIBUTING.md` (lint, format check, build, and tests for touched areas).

## Security & Configuration

Use local `.env` only; never commit secrets. Review `SECURITY.md` for policies. For tokens and cross‑platform parity, follow `docs/architecture/` and `docs/BUILD_PIPELINE.md`.
