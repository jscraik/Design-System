# aStudio Widget Gallery (platforms/web/apps/web)

Last updated: 2026-01-07

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Overview and essential workflows for this area
- Non-scope: Deep API reference or internal design rationale
- Owner: Web Platform Team (confirm)
- Review cadence: Each release (confirm)

## Contents

- [Doc requirements](#doc-requirements)
- [What this app is for](#what-this-app-is-for)
- [Quick Start](#quick-start)
- [Widget Gallery Features](#widget-gallery-features)
- [Build Widget for MCP](#build-widget-for-mcp)
- [Environment Variables](#environment-variables)
- [Key Files](#key-files)
- [Verify](#verify)
- [Troubleshooting](#troubleshooting)
- [Routes](#routes)

**Simplified app for visual widget testing and MCP widget build.**

## What this app is for

- **Widget Gallery**: Visual browser for all ChatGPT widgets in an iframe gallery
- **Widget Build**: Builds single-file `widget.html` used by the MCP server
- **Standalone Host**: Reference implementation for `@chatui/runtime`

## Quick Start

```bash
pnpm dev:web
```

Opens at `http://localhost:5173` showing the Widget Gallery.

## Widget Gallery Features

- **12 Widgets**: Dashboard, Chat View, Search Results, Compose, Chat Blocks, Kitchen Sink, Pizzaz Table
- **Iframe Previews**: Each widget loads in isolated iframe for accurate testing
- **Modal Testing**: Built-in controls to test modals (Settings, Icon Picker, Discovery Settings)
- **Keyboard Shortcuts**: `?` for help, `G` for next widget, `Esc` to close modals

## Build Widget for MCP

The MCP server uses the widget build:

```bash
pnpm -C platforms/web/apps/web build:widget
```

Creates `platforms/web/apps/web/dist/widget.html` — a single-file HTML bundle used by the MCP server.

Render a single template by ID:

```bash
VITE_TEMPLATE_ID=chat-input pnpm -C platforms/web/apps/web build:widget
```

## Environment Variables

- `VITE_API_BASE` (optional) — defaults to `http://localhost:8787`
- `VITE_WIDGETS_BASE` (optional) — defaults to `http://localhost:5173`
- `VITE_TEMPLATE_ID` (optional) — render a single template by ID for `build:widget`

## Key Files

- `src/app/Router.tsx` — simplified router (harness + utility routes)
- `src/pages/HarnessPage.tsx` — widget gallery UI
- `src/pages/TemplateWidgetPage.tsx` — single-template widget shell
- `scripts/inline-widget.mjs` — widget bundler for MCP

## Verify

1. Open `http://localhost:5173`
2. Widget Gallery loads automatically
3. Click different widgets to see them rendered
4. Test modal controls in sidebar

## Troubleshooting

**Port 5173 is in use**

```bash
pnpm -C platforms/web/apps/web dev -- --port 5174
```

**Widgets show blank**

- Ensure MCP server is running: `pnpm mcp:start`
- Check `VITE_WIDGETS_BASE` points to widget server

## Routes

- `/` — Widget gallery UI (HarnessPage)
