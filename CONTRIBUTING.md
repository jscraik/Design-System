# Contributing

Last updated: 2026-01-07

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: Every release or monthly (whichever is sooner)

Thanks for helping improve aStudio. This repo is a library-first monorepo with Apps SDK UI as the design system.

## Prerequisites

- Node.js 18+
- pnpm 10.28.0 (see `packageManager` in `package.json`)

## Development setup

```bash
pnpm install
pnpm dev
```

### Verify

- Web app: <http://localhost:5173/>
- Storybook: <http://localhost:6006/>

## Project structure

- `packages/ui`: UI components and layouts
- `packages/runtime`: host adapters + mocks
- `packages/tokens`: design tokens (CSS + TS)
- `packages/widgets`: standalone widget bundles
- `platforms/web/apps/web`: reference app
- `platforms/web/apps/storybook`: component docs
- `platforms/mcp`: MCP integration harness

## Code style

- Run `pnpm lint` (Biome) before pushing.
- Run `pnpm format` (Biome) to auto-format if needed.

## Tests

- `pnpm test` (UI unit tests)
- `pnpm test:agent-browser` (Built-preview smoke tests - local)
- `pnpm test:agent-browser:ci` (Built-preview smoke tests - CI)
- `pnpm test:mcp-contract` (MCP tool contract test)
- `pnpm test:visual:web` (Playwright visual tests for web)

## Commit conventions (recommended)

Use Conventional Commits where possible:

- `feat:` new features
- `fix:` bug fixes
- `chore:` tooling, deps
- `docs:` documentation

## PR checklist

- [ ] Lint passes (`pnpm lint` - Biome)
- [ ] Format check passes (`pnpm format:check` - Biome)
- [ ] Build succeeds (`pnpm build`)
- [ ] Tests run for the area you changed
- [ ] Smoke tests pass (`pnpm test:agent-browser:ci`)
- [ ] Docs updated if the public API or workflows changed
- [ ] Coverage matrix updated or gap recorded (`docs/design-system/COVERAGE_MATRIX.md`)
- [ ] A11y audit artifact saved (use `docs/operations/a11y-audit-template.md`) when UI changes
- [ ] RFC created for design-system changes (`docs/workflows/RFC_TEMPLATE.md`)
