# CLAUDE.md

Last updated: 2026-03-22

## Table of Contents

- [Project overview](#project-overview)
- [Quick commands](#quick-commands)
- [Package rules (summary)](#package-rules-summary)
- [AI Assistance Governance](#ai-assistance-governance-model-a)
- [Preflight](#preflight)

> **Agent rules (FORJAMIE, definition of done, commit/PR):** see [AGENTS.md](AGENTS.md)
> **Full dev reference (library imports, styling, host adapter, public API):** see [docs/agents/05-dev-reference.md](docs/agents/05-dev-reference.md)

---

## Project overview

Library-first monorepo for building consistent UI across ChatGPT widgets (Apps SDK) and standalone React apps. Uses OpenAI Apps SDK UI as the visual foundation.

```
packages/
├── ui/          # React component library (main output)
├── runtime/     # Host adapters (embedded/standalone)
├── tokens/      # Design tokens (CSS variables, Tailwind preset)
├── cloudflare-template/ # Cloudflare Workers deployment template
└── widgets/     # Standalone widget bundles for ChatGPT

platforms/
├── web/         # Web apps (reference app + Storybook + templates gallery)
└── mcp/         # MCP server for ChatGPT integration
```

---

## Quick commands

```bash
pnpm install              # Install dependencies
pnpm dev                  # Web (localhost:5173)
pnpm dev:web              # Web only
pnpm dev:storybook        # Storybook only

pnpm build                # Build pipeline (web packages)
pnpm build:lib            # Build all library packages (ui, runtime, tokens)
pnpm build:widgets        # Build widget bundles

pnpm generate:tokens      # Regenerate design tokens

pnpm test                 # UI package tests (vitest)
pnpm test:e2e:web         # E2E tests with Playwright
pnpm test:a11y:widgets    # Accessibility tests
pnpm test:visual:web      # Visual regression tests
pnpm test:visual:update   # Update visual snapshots

pnpm lint                 # Biome
pnpm format               # Biome

pnpm new:component MyButton primitive     # Create UI primitive
pnpm changeset            # Create changeset
pnpm release              # Publish packages
```

---

## Package rules (summary)

### `packages/ui`

**Allowed:** UI components, icons from `packages/ui/src/icons`, `@openai/apps-sdk-ui`, `@radix-ui/*` primitives (in `src/primitives` only).

**Prohibited:** `window.openai`, MCP logic, real network calls, direct `lucide-react` imports, `@mui/*`, direct `@radix-ui/*` outside `src/primitives`.

### `packages/runtime`

**Allowed:** `Host` type, `createEmbeddedHost()`, `createStandaloneHost()`, `HostProvider`.

**Prohibited:** UI components.

### `platforms/web` / `platforms/mcp`

Web: reference shell only — no reusable UI source (goes in `packages/ui`).
MCP: integration harness only.

---

## AI Assistance Governance (Model A)

This project follows **Model A** AI artifact governance: prompts and session logs are committed artifacts.

When creating PRs with AI assistance, Claude must:

1. **Save artifacts to `ai/` directory**:
   - Final prompt → `ai/prompts/YYYY-MM-DD-<slug>.yaml`
   - Session summary → `ai/sessions/YYYY-MM-DD-<slug>.json`

2. **Commit both files in the PR branch.**

3. **Reference exact paths in PR body** under the AI assistance section.

4. **Do NOT** embed excerpts in the PR body, link to external logs, or skip artifact creation.

5. **Abort** if artifacts cannot be created and committed.

See `ai/prompts/.template.yaml` and `ai/sessions/.template.json` for required fields.
All PRs must use `.github/PULL_REQUEST_TEMPLATE.md`.

---

## Preflight

Use `scripts/codex-preflight.sh` before multi-step, destructive, or path-sensitive work.

```bash
bash scripts/codex-preflight.sh --mode optional
```

For stack-specific variants: `--stack js`, `--stack py`, `--stack rust`.
