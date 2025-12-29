# ChatUI Web App (apps/web)

This app is the standalone React shell used to preview ChatUI components, pages, and the widget harness outside ChatGPT.

## What this app is for

- Preview the Chat UI and page routing system.
- Host the widget harness (`/harness`) for local widget testing.
- Provide a standalone host adapter for `@chatui/runtime`.

## Prerequisites

- Node.js 18+
- pnpm

## Quick start

From the repo root:

```bash
pnpm dev:web
```

Or run directly from the app:

```bash
pnpm -C apps/web dev
```

The app runs at `http://localhost:5173`.

## Environment configuration

The web app uses the MCP server as its host API:

- `VITE_API_BASE` (optional) defaults to `http://localhost:8787`.

Set it in your shell before starting the dev server:

```bash
export VITE_API_BASE="http://localhost:8787"
pnpm dev:web
```

## Common tasks

Build the app:

```bash
pnpm -C apps/web build
```

Preview the build:

```bash
pnpm -C apps/web preview
```

Build the single-file widget HTML (used by the MCP harness):

```bash
pnpm -C apps/web build:widget
```

## Key files

- `apps/web/src/Router.tsx` — top-level routing and URL parsing.
- `apps/web/src/pages/` — page implementations (Settings, Profile, About, etc.).
- `apps/web/src/WidgetHarness.tsx` — widget harness UI.

## Verify

1. Open `http://localhost:5173`.
2. Visit `http://localhost:5173/harness` to confirm the widget harness renders.
3. Check that `/settings`, `/profile`, and `/about` load without errors.

## Troubleshooting

**Port 5173 is already in use**

- Stop the conflicting process or start Vite on a new port: `pnpm -C apps/web dev -- --port 5174`.

**Widgets in the harness are blank**

- Ensure the MCP server is running: `pnpm mcp:start`.
- Confirm `VITE_API_BASE` points to the MCP server URL.

## Next steps

- Add a new page with `docs/guides/PAGES_QUICK_START.md`.
- Explore components in Storybook (`pnpm dev:storybook`).
