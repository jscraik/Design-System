# Apps SDK UI Library Workspace

Last updated: 2026-01-02

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
- `packages/cloudflare-template` - Cloudflare Workers deployment template for MCP

## Reference Harnesses

- `platforms/web/apps/web` - Standalone reference app with page routing system
- `platforms/web/apps/storybook` - Component documentation and development
- `platforms/mcp` - MCP server for ChatGPT integration
- `packages/widgets` - Standalone widget bundles for ChatGPT

## Contents

- [Prerequisites](#prerequisites)
- [Compatibility matrix](#compatibility-matrix)
- [Quick Start](#quick-start)
- [Verify](#verify)
- [Common tasks](#common-tasks)
- [Pages & Navigation](#pages--navigation)
- [Documentation](#documentation)
- [Troubleshooting](#troubleshooting)
- [Rules of the road](#rules-of-the-road)
- [Apps SDK UI integration](#apps-sdk-ui-integration)
- [Foundation tokens (audit layer)](#foundation-tokens-audit-layer)
- [Host adapter seam](#host-adapter-seam)
- [Library exports](#library-exports)
- [Public API surface](#public-api-surface)
- [Public API policy](#public-api-policy)
- [Storybook navigation](#storybook-navigation)
- [Release & versioning](#release--versioning)
- [Using in Other Projects](#using-in-other-projects)
- [Creating New Components](#creating-new-components)
- [Development Workflow](#development-workflow)
- [Architecture](#architecture)

## Prerequisites

- Node.js 18+
- pnpm 9.15.0 (see `packageManager` in `package.json`)
- macOS app work (optional): macOS 13+ + Xcode 15+

## Compatibility matrix

- **React**: 19.x (required by `@chatui/ui` peerDependencies)
- **TypeScript**: 5.9+ (workspace devDependency)
- **Node.js**: 18+ (runtime baseline)
- **Apps SDK UI**: ^0.2.1 (from `@chatui/ui` dependencies)

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev                    # Web app at http://localhost:5173 + Storybook at http://localhost:6006
pnpm dev:web                # Web app only (http://localhost:5173)
pnpm dev:storybook          # Storybook only (http://localhost:6006)

# Build for production
pnpm build                 # Build pipeline (web + macOS packages)
pnpm build:web             # Web-only build
pnpm build:widgets         # Widget bundles
pnpm build:widget          # Single-file widget HTML (for MCP harness)
```

### Verify

- Web app: open <http://localhost:5173/>
- Storybook: open <http://localhost:6006/>

## Common tasks

Core scripts you will use often:

```bash
# Run MCP server (local dev)
pnpm mcp:dev

# Run unit tests (UI package)
pnpm test

# Run lint and formatting
pnpm lint
pnpm format

# Build a single-file widget HTML (for MCP harness)
pnpm build:widget
```

## 📄 Pages & Navigation

The web app includes a flexible page system with URL-based routing:

- **Chat**: <http://localhost:5173/> (default)
- **Settings**: <http://localhost:5173/settings>
- **Profile**: <http://localhost:5173/profile>
- **About**: <http://localhost:5173/about>
- **Widget Harness**: <http://localhost:5173/harness>

### Adding New Pages

See [PAGES_QUICK_START.md](./docs/guides/PAGES_QUICK_START.md) for a 5-minute guide, or check `.kiro/steering/page-development.md` for comprehensive patterns.

## 📚 Documentation

Use this table to jump to the canonical doc surface. For more detail, see
[`docs/README.md`](./docs/README.md).

| Area                    | Doc                              |
| ----------------------- | -------------------------------- |
| Project overview        | `README.md`                      |
| Docs index              | `docs/README.md`                 |
| Guides index            | `docs/guides/README.md`          |
| Architecture            | `docs/architecture/README.md`    |
| Repo map                | `docs/architecture/repo-map.md`  |
| Build pipeline          | `docs/BUILD_PIPELINE.md`         |
| Swift integration       | `docs/SWIFT_INTEGRATION.md`      |
| Restructure migration   | `docs/guides/repo-structure-migration.md` |
| Swift packages overview | `platforms/apple/swift/README.md`                |
| macOS app               | `platforms/apple/apps/macos/ChatUIApp/README.md` |
| Web app                 | `platforms/web/apps/web/README.md`             |
| Storybook               | `platforms/web/apps/storybook/README.md`       |
| MCP server              | `platforms/mcp/README.md`             |
| Tokens                  | `packages/tokens/README.md`      |
| UI components (React)   | `packages/ui/README.md`          |
| Runtime host            | `packages/runtime/README.md`     |
| Widgets                 | `packages/widgets/README.md`     |

## Troubleshooting

### Symptom: `pnpm: command not found`

Cause: pnpm is not installed.
Fix:

```bash
npm install -g pnpm
```

### Symptom: MCP tools fail to load in the app

Cause: MCP server is not running or the URL is wrong.
Fix:

```bash
pnpm mcp:start
```

Then confirm the MCP URL in the macOS app Settings (default `http://localhost:8787`).

### Symptom: Storybook or web app doesn’t start

Cause: Dependencies not installed or Node version mismatch.
Fix:

```bash
pnpm install
node -v
```

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

- **platforms/web/apps/web / platforms/web/apps/storybook**  
  ✅ Reference shells + preview  
  ✅ Provide host adapters  
  ❌ No reusable UI source

- **platforms/mcp**  
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

Source PDFs live in `docs/foundations/chatgpt-apps/`.

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
import { Button } from "@chatui/ui/base";
import { ModelSelector } from "@chatui/ui/navigation";
import { ChatSidebar } from "@chatui/ui/chat";
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

- **Stable**: `@chatui/ui` root exports and the `@chatui/ui/app`, `@chatui/ui/chat`, `@chatui/ui/modals`,
  `@chatui/ui/settings`, `@chatui/ui/base`, `@chatui/ui/data-display`, `@chatui/ui/feedback`,
  `@chatui/ui/navigation`, `@chatui/ui/overlays`, and `@chatui/ui/icons` subpaths.
- **Experimental**: `@chatui/ui/experimental` and `@chatui/ui/templates` (subject to breaking changes).
- **Dev-only**: `@chatui/ui/dev` is for Storybook, docs, and local harnesses — not production.

## Storybook navigation

- Overview – onboarding, galleries, and page previews
- Documentation – system docs + design system
- Components – UI primitives, chat surfaces, templates, icons, integrations

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
pnpm changeset
pnpm version-packages
pnpm release
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

1. **Design in Storybook** - `pnpm dev:storybook`
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
