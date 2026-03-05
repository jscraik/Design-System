# Quick Start (5 minutes)

> **Status: Redirecting to Onboarding Command Center**
>
> This page is a legacy quick-start.  
> Use the canonical onboarding routes at [`docs/guides/ONBOARDING_COMMAND_CENTER.md`](./guides/ONBOARDING_COMMAND_CENTER.md).

Get up and running with the Design System in under 5 minutes.

---

## Prerequisites

- **Node.js** 18+ (use `mise` to manage versions)
- **pnpm** package manager
- Git clone of this repository

---

## Step 1: Install Dependencies (1 min)

```bash
pnpm install
```

This installs all monorepo packages and their dependencies.

---

## Step 2: Start Development Server (30 sec)

```bash
pnpm dev
```

Opens the web app at `http://localhost:5173` with:
- Full Chat UI implementation
- All design tokens and components
- Live reload

---

## Step 3: View Component Examples (1 min)

```bash
pnpm dev:storybook
```

Opens Storybook at `http://localhost:6006` with:
- Interactive component demos
- Props documentation
- Design tokens reference

---

## Step 4: Build a Widget (1 min)

```bash
pnpm build:widget
```

Creates single-file widget HTML in `platforms/web/apps/web/dist/widget.html` for ChatGPT embedding.

---

## Step 5: Run Tests (30 sec)

```bash
pnpm test           # UI package tests
pnpm test:mcp-contract  # MCP server contract tests
```

---

## Essential Commands

| Command | Purpose |
|----------|---------|
| `pnpm dev` | Start web dev server |
| `pnpm dev:storybook` | Start Storybook |
| `pnpm build` | Build all packages |
| `pnpm build:lib` | Build library packages only |
| `pnpm build:widgets` | Build widget bundles |
| `pnpm test` | Run tests |
| `pnpm lint` | Run Biome linter |
| `pnpm format` | Format code with Biome |

---

## Next Steps

- Read [Architecture](./architecture/README.md) for system overview
- Browse [Components](../packages/ui/src/components/README.md) for available UI elements
- See [Pages Quick Start](./guides/PAGES_QUICK_START.md) for ready-to-use layout workflows
- Check [Widget Bundling](./architecture/WIDGET_BUNDLING.md) for embedding info

---

**Troubleshooting**:

- **Port already in use?** Change it in `vite.config.ts` or kill the process
- **Type errors?** Run `pnpm typecheck` to see details
- **Linting fails?** Run `pnpm format` to auto-fix, then `pnpm lint`

---

Need more? See [full documentation](./README.md) or open an issue.
