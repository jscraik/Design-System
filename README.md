# Apps SDK UI Library Workspace

This repository is a **library-first monorepo**:

- **Primary product**: `packages/ui` + `packages/runtime`
- **Reference harnesses**: `apps/web`, `apps/storybook`, `apps/mcp`

It uses **Apps SDK UI** as the shared design system while keeping the UI package pure and host-agnostic.

## Workspace layout

- `packages/ui` – reusable UI components (chat layout, header, sidebar, etc.)
- `packages/runtime` – host adapters + mocks (`window.openai` wrapper, HostProvider)
- `packages/tokens` – Figma foundations audit tokens (CSS + TS exports)
- `apps/web` – standalone reference app (browser shell)
- `apps/storybook` – Storybook for the UI library
- `apps/mcp` – **integration harness only** (serves widget bundle + tools for ChatGPT)

## Rules of the road

- **packages/ui**  
  ✅ UI only (components, layouts, stories)  
  ✅ Depends on `@openai/apps-sdk-ui` for styling  
  ✅ Icons come from `packages/ui/src/icons` (Apps SDK UI first, Lucide fallback)  
  ❌ No `window.openai`  
  ❌ No MCP logic  
  ❌ No real network calls (only via injected host)  
  ❌ No direct `lucide-react` imports (use `packages/ui/src/icons` adapter)  
  ❌ No `@mui/*` (warn-only for now)  
  ❌ No direct `@radix-ui/*` imports outside `packages/ui/src/primitives` (warn-only)

- **packages/runtime**  
  ✅ Host interface + adapters  
  ✅ `createEmbeddedHost()` wraps `window.openai`  
  ✅ `createStandaloneHost()` uses your API/mocks  
  ❌ No UI components

- **apps/web / apps/storybook**  
  ✅ Reference shells + preview  
  ✅ Provide host adapters  
  ❌ No reusable UI source

- **apps/mcp**  
  ✅ Integration harness (widget bundle + tool definitions)  
  ❌ Not required for the library itself

## Apps SDK UI integration

This repo uses **Apps SDK UI** as the visual system. Import the CSS in both standalone and embedded builds:

```css
@import "tailwindcss";
@import "@openai/apps-sdk-ui/css";
@import "@chatui/tokens/foundations.css";

/* Tailwind v4 scanning */
@source "../node_modules/@openai/apps-sdk-ui";
@source "../../packages/ui/src";
```

See: https://developers.openai.com/apps-sdk/

## Foundation tokens (audit layer)

`@chatui/tokens` encodes the PDF “Figma foundations” as:

- `packages/tokens/src/foundations.css` (CSS variables)
- `packages/tokens/src/*.ts` (TS exports for Storybook foundations pages)

Source PDFs live in `context/foundations/`.

These tokens are **audit/extension only**. Use Apps SDK UI classes/components in UI.

## Host adapter seam

`packages/runtime` exposes a Host interface + provider, so components stay host-agnostic:

```ts
import { HostProvider, createStandaloneHost } from "@chatui/runtime";

const host = createStandaloneHost("http://localhost:8787");
```

For embedded ChatGPT apps, use `createEmbeddedHost()` which wraps `window.openai`.

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
| Icons | Icons adapter, ChatGPTIcons |
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

Dev (web + storybook):

```bash
pnpm dev
```

Standalone dev (web only):

```bash
pnpm dev:web
```

Storybook:

```bash
pnpm dev:storybook
```

Build the standalone app:

```bash
pnpm build
```

Build a single-file widget HTML (for the MCP harness):

```bash
pnpm build:widget
```

Run the MCP harness (optional):

```bash
pnpm mcp:start
```

Compliance warnings (non-blocking for now):

```bash
pnpm lint:compliance
```

Set `COMPLIANCE_STRICT=1` to turn warnings into errors.
