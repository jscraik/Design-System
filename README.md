# ChatUI + Apps SDK UI workspace

This repository is a starter workspace that:

- Runs as a standalone React app (Vite)
- Can be embedded as a ChatGPT app UI (Apps SDK) via an MCP server
- Exposes a reusable UI/component package + runtime helpers
- Includes Storybook for component development

## Workspace layout

- `apps/web` – React+Vite app that renders the UI
- `apps/mcp` – Node MCP server that exposes a tool + the widget resource
- `apps/storybook` – Storybook configured for the shared UI package
- `packages/ui` – reusable UI components (chat layout, header, sidebar, etc.)
- `packages/runtime` – Apps SDK runtime helpers (`window.openai` typings + hooks + mock)

## Library exports

The UI package re-exports chat components and UI primitives from a single entry point.

```ts
import { Button, ChatHeader, ChatSidebar } from "@chatui/ui";
```

## Public API surface

| Category | Exports (examples) |
| --- | --- |
| Chat UI components | ChatUIRoot, ChatHeader, ChatSidebar, ChatMessages, ChatInput, ComposeView |
| UI primitives | Button, Dialog, Tabs, Tooltip, and more |
| Icons | ChatGPTIcons |
| Pages | DesignSystemPage, TypographyPage, SpacingPage |
| Templates | ChatFullWidthTemplate, ChatTwoPaneTemplate, DashboardTemplate |
| Utilities | useControllableState |

## Storybook navigation

- ChatUI – chat app components
- UI – primitives and overlays
- DesignSystem – docs and showcases
- Icons – icon sets
- Figma – figma utilities
- Pages – full pages
- Templates – application templates

## Prerequisites

- Node.js 18+
- pnpm

## Commands

Install deps:

```bash
pnpm install
```

Standalone dev (Vite):

```bash
pnpm dev
```

Build a single-file widget HTML for ChatGPT (Apps SDK):

```bash
pnpm build:widget
```

Run the MCP server (serves `/mcp`):

```bash
pnpm mcp:start
```

Storybook:

```bash
pnpm storybook:dev
```

## ChatGPT (Apps SDK) notes

- The Apps SDK renders your UI in an iframe and injects `window.openai` as a bridge.
- This workspace mocks `window.openai` automatically in standalone/Storybook so the same UI can run outside ChatGPT.

See OpenAI Apps SDK docs for connecting your MCP server to ChatGPT (developer mode) and for best practices.
