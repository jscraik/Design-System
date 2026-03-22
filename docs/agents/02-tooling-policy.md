# Tooling and command policy

## Package-manager command map

- install: `pnpm install`
- run script: `pnpm <script>`
- exec: `pnpm exec <bin>`
- workspace filter: `pnpm -F <package-name> <script>`

## Core tooling

- Run shell commands with `zsh -lc`.
- Prefer `rg`, `fd`, `jq` over `grep`, `find`, `cat|python`.
- Linting/formatting: `pnpm lint` / `pnpm format` (Biome).
- Type checking: `pnpm -s typecheck` (or `tsc -p . --noEmit`).
- Tests: `pnpm test` (Vitest unit), `pnpm test:e2e:web` (Playwright).

## Version management

- Runtime versions via `mise` — see `mise.toml` at repo root.
- Run `mise trust` to resolve trust errors; verify with `mise list`.
