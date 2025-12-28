# Apps SDK UI Library Workspace

This repository is a **library-first monorepo** for building consistent UI across ChatGPT widgets and standalone React applications.

## What This Is

A shared design system library that you can use across all your projects:

- **ChatGPT Widgets** - Embedded in ChatGPT via Apps SDK
- **Standalone React Apps** - Any React application
- **Internal Tools** - Dashboards, admin panels, etc.

## Primary Products

- `@chatui/ui` - Reusable UI components (chat layout, header, sidebar, primitives)
- `@chatui/runtime` - Host adapters + mocks (`window.openai` wrapper, HostProvider)
- `@chatui/tokens` - Design tokens (CSS variables, Tailwind preset)

## Reference Harnesses

- `apps/web` - Standalone reference app with page routing system
- `apps/storybook` - Component documentation and development
- `apps/mcp` - MCP server for ChatGPT integration
- `packages/widgets` - Standalone widget bundles for ChatGPT

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev                    # Web app at http://localhost:5176
pnpm storybook:dev         # Storybook at http://localhost:6006

# Build for production
pnpm build                 # Build web app
pnpm build:widget         # Build standalone widgets
```

## 📄 Pages & Navigation

The web app includes a flexible page system with URL-based routing:

- **Chat**: <http://localhost:5176/> (default)
- **Settings**: <http://localhost:5176/settings>
- **Profile**: <http://localhost:5176/profile>
- **About**: <http://localhost:5176/about>
- **Widget Harness**: <http://localhost:5176/harness>

### Adding New Pages

See [PAGES_QUICK_START.md](./docs/guides/PAGES_QUICK_START.md) for a 5-minute guide, or check `.kiro/steering/page-development.md` for comprehensive patterns.

## 📚 Documentation

Comprehensive documentation is organized in the [`docs/`](./docs) directory:

- **[Architecture](./docs/architecture)** - System design and technical architecture
- **[Audits](./docs/audits)** - Design system compliance and color audits
- **[Guides](./docs/guides)** - How-to guides and quick starts

See [docs/README.md](./docs/README.md) for the complete documentation index.

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

See: <https://developers.openai.com/apps-sdk/>

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

Runtime details and widgetSessionId guidance live in `packages/runtime/README.md`.

## Library exports

The UI package re-exports chat components and UI primitives from a single entry point.

```ts
import { Button, ChatHeader, ChatSidebar } from "@chatui/ui";
```

For production code, prefer subpath exports for better tree-shaking:

```ts
import { Button } from "@chatui/ui/forms";
import { ChatSidebar } from "@chatui/ui/chat";
import { SectionHeader } from "@chatui/ui/layout";
```

### Dev/demo exports

Demo pages and sandbox utilities are exposed from a separate entry to keep the production surface clean:

```ts
import { ChatUIApp, DesignSystemPage } from "@chatui/ui/dev";
```

### Experimental exports

Experimental or fast-evolving APIs are exposed separately:

```ts
import { ChatFullWidthTemplate } from "@chatui/ui/experimental";
```

## Public API surface

| Category           | Exports (examples)                                                           |
| ------------------ | ---------------------------------------------------------------------------- |
| Chat UI components | ChatUIRoot, ChatHeader, ChatSidebar, ChatMessages, ChatInput, ComposeView    |
| UI primitives      | Button, Dialog, Tabs, Tooltip, and more                                      |
| Icons              | Icons adapter, ChatGPTIcons                                                  |
| Pages              | DesignSystemPage, TypographyPage, SpacingPage (via `@chatui/ui/dev`)         |
| Templates          | ChatFullWidthTemplate, ChatTwoPaneTemplate, DashboardTemplate (experimental) |
| Utilities          | useControllableState                                                         |

## Public API policy

- **Stable**: `@chatui/ui` root exports and the `@chatui/ui/forms`, `@chatui/ui/chat`, `@chatui/ui/layout` subpaths.
- **Experimental**: `@chatui/ui/experimental` and `@chatui/ui/templates` (subject to breaking changes).
- **Dev-only**: `@chatui/ui/dev` is for Storybook, docs, and local harnesses — not production.

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

## Compatibility matrix

- **React**: 19.x (required by `@chatui/ui` via Apps SDK UI)
- **TypeScript**: 5.9+
- **Node.js**: 18+
- **Apps SDK UI**: ^0.2.1

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

## Release & versioning

This repo uses Changesets for versioning and release automation:

```bash
pnpm changeset
pnpm version-packages
pnpm release
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

## Using in Other Projects

### Option 1: Workspace Reference (Monorepo)

If your other projects are in the same monorepo:

```json
{
  "dependencies": {
    "@chatui/ui": "workspace:*",
    "@chatui/runtime": "workspace:*",
    "@chatui/tokens": "workspace:*"
  }
}
```

### Option 2: Git Submodule

Add this repo as a submodule in your project:

```bash
git submodule add <repo-url> packages/chatui
```

Then reference in your package.json:

```json
{
  "dependencies": {
    "@chatui/ui": "file:./packages/chatui/packages/ui"
  }
}
```

### Option 3: Published Package (npm/GitHub Packages)

Publish to npm or GitHub Packages:

```bash
pnpm build:lib
pnpm publish --access public
```

Then install normally:

```bash
pnpm add @chatui/ui @chatui/runtime @chatui/tokens
```

## Creating New Components

Use the component generator:

```bash
# Create a primitive component (Button, Input, etc.)
pnpm new:component MyButton primitive

# Create a chat component
pnpm new:component ChatToolbar chat

# Create a template
pnpm new:component AdminTemplate template

# Create a page
pnpm new:component SettingsPage page
```

This creates the component file and a Storybook story.

## Development Workflow

1. **Design in Storybook** - `pnpm storybook:dev`
2. **Test in Web App** - `pnpm dev:web`
3. **Build Widgets** - `pnpm build:widgets`
4. **Test in ChatGPT** - `pnpm mcp:start`

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Your Projects                            │
├─────────────────────────────────────────────────────────────┤
│  Project A    │  Project B    │  ChatGPT Widget  │  ...     │
│  (React App)  │  (Dashboard)  │  (Embedded)      │          │
└───────┬───────┴───────┬───────┴────────┬─────────┴──────────┘
        │               │                │
        └───────────────┼────────────────┘
                        │
        ┌───────────────▼───────────────┐
        │      @chatui/ui               │
        │  (Shared Component Library)   │
        ├───────────────────────────────┤
        │  • Chat Components            │
        │  • UI Primitives              │
        │  • Templates                  │
        │  • Pages                      │
        └───────────────┬───────────────┘
                        │
        ┌───────────────▼───────────────┐
        │      @chatui/runtime          │
        │  (Host Abstraction)           │
        ├───────────────────────────────┤
        │  • createEmbeddedHost()       │
        │  • createStandaloneHost()     │
        │  • HostProvider               │
        └───────────────┬───────────────┘
                        │
        ┌───────────────▼───────────────┐
        │      @chatui/tokens           │
        │  (Design Tokens)              │
        ├───────────────────────────────┤
        │  • CSS Variables              │
        │  • Tailwind Preset            │
        │  • Theme Configuration        │
        └───────────────────────────────┘
```
