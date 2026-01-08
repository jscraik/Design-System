<img src="./brand/aStudio-brand-logo.png" alt="aStudio" height="48" />

# aStudio

Cross-Platform UI Workbench

Last updated: 2026-01-07

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Overview and essential workflows for this area
- Non-scope: Deep API reference or internal design rationale
- Owner: Platform Team (confirm)
- Review cadence: Quarterly (confirm)

This repository is a **library-first monorepo** for building consistent UI across ChatGPT widgets and standalone React applications.

## What This Is

A cross-platform UI workbench for building ChatGPT-style interfaces across multiple platforms:

- **ChatGPT Widgets** - Embedded widgets via OpenAI Apps SDK
- **React Applications** - Standalone web applications using `@chatui/ui`
- **macOS Applications** - Native SwiftUI apps with aStudio Swift packages
- **MCP Integration** - Model Context Protocol server for ChatGPT tool integration

## Primary Products

- `@chatui/ui` - Reusable UI components (chat layout, header, sidebar, primitives)
- `@chatui/runtime` - Host adapters + mocks (`window.openai` wrapper, HostProvider)
- `@chatui/tokens` - Design tokens (CSS variables, Tailwind preset)
- `packages/widgets` - Standalone widget bundles for ChatGPT
- `packages/cloudflare-template` - Cloudflare Workers deployment template for MCP

## Development Surfaces

- `platforms/web/apps/web` - Widget Gallery for visual testing and MCP widget builds
- `platforms/web/apps/storybook` - Component documentation and interactive development
- `platforms/mcp` - MCP server for ChatGPT integration
- `platforms/apple/apps/macos/ChatUIApp` - Production macOS application with MCP integration
- `platforms/apple/apps/macos/ChatUIPlayground` - SwiftUI experimentation harness
- `platforms/apple/apps/macos/ComponentGallery` - Visual component browser for Swift packages

## Contents

- [Prerequisites](#prerequisites)
- [Compatibility matrix](#compatibility-matrix)
- [Quick Start](#quick-start)
- [Verify](#verify)
- [Common tasks](#common-tasks)
- [Widget Gallery & Development](#widget-gallery--development)
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
- pnpm 10.27.0 (see `packageManager` in `package.json`)
- **For macOS app development** (optional): macOS 13+ with Xcode 15+

> Note: Web and widget development works on all platforms. macOS/Xcode is only required for Swift package and native macOS app work.

## Compatibility matrix

- **React**: 19.x (required by `@chatui/ui` peerDependencies)
- **TypeScript**: 5.9+ (workspace devDependency)
- **Node.js**: 18+ (runtime baseline)
- **Apps SDK UI**: ^0.2.1 (from `@chatui/ui` dependencies)
- **Swift**: 5.9+ with Xcode 15+ (for macOS/iOS development)
- **macOS**: 13+ (deployment target for macOS apps)
- **iOS**: 15+ (deployment target for Swift packages)

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev                    # Widget Gallery at http://localhost:5173 + Storybook at http://localhost:6006
pnpm dev:web                # Widget Gallery only (http://localhost:5173)
pnpm dev:storybook          # Storybook only (http://localhost:6006)

# Build for production
pnpm build                 # Build pipeline (web + macOS packages)
pnpm build:web             # Web-only build
pnpm build:widgets         # Widget bundles
pnpm build:widget          # Single-file widget HTML (for MCP harness)
```

### Verify

- Widget Gallery: open <http://localhost:5173/>
- Storybook: open <http://localhost:6006/>

## Common tasks

Core scripts you'll use frequently:

```bash
# Development
pnpm dev                    # Widget Gallery + Storybook concurrently
pnpm dev:web                # Widget Gallery only
pnpm dev:storybook          # Storybook only
pnpm dev:widgets            # Widget development mode

# MCP Server
pnpm mcp:dev                # MCP server in development mode
pnpm mcp:start              # MCP server in production mode

# Testing
pnpm test                   # UI unit tests (Vitest)
pnpm test:e2e:web           # End-to-end tests (Playwright)
pnpm test:a11y:widgets      # Accessibility tests for widgets
pnpm test:visual:web        # Visual regression tests (web)
pnpm test:visual:storybook  # Visual regression tests (Storybook)
pnpm test:swift             # Run all Swift package tests
pnpm test:mcp-contract      # MCP tool contract tests

# Code Quality
pnpm lint                   # ESLint
pnpm format                 # Prettier (write)
pnpm format:check           # Prettier (check only)
pnpm lint:compliance        # Check compliance rules
pnpm doc:lint               # Vale sync + markdown linting + link check

# Building
pnpm build                  # Full build pipeline
pnpm build:web              # Web-only build
pnpm build:widgets          # Widget bundles for production
pnpm build:widget           # Single-file widget HTML for MCP
pnpm build:lib              # Build @chatui packages only
pnpm build:macos            # macOS app build

# Utilities
pnpm new:component          # Component generator
pnpm sync:versions          # Sync package versions across workspace
pnpm validate:tokens        # Validate design token consistency
```

### aStudio CLI

The repo includes a unified CLI wrapper for common dev/build/test/MCP tasks:

```bash
pnpm astudio --help
pnpm astudio dev
pnpm astudio build web
pnpm astudio test e2e-web
pnpm astudio mcp tools list
pnpm astudio doctor
```

## 📄 Widget Gallery & Development

The web app (`platforms/web/apps/web`) is a **Widget Gallery** for visual testing and MCP widget builds:

- **Widget Gallery**: <http://localhost:5173/> (default) - Browse and test all aStudio widgets in iframe previews
- **Widget Harness**: <http://localhost:5173/harness> - Test individual widgets with modal controls

### Key Features

- 12+ widgets including Dashboard, Chat View, Search Results, Compose, and Kitchen Sink
- Iframe-based widget isolation for accurate testing
- Built-in modal testing (Settings, Icon Picker, Discovery Settings)
- Keyboard shortcuts (`?` for help, `G` for next widget)

### Building Single-File Widgets for MCP

```bash
pnpm build:widget
```

This creates `platforms/web/apps/web/dist/widget.html` — a single-file HTML bundle used by the MCP server.

### Adding Pages (for custom apps)

If you're building a custom application with page routing, see [PAGES_QUICK_START.md](./docs/guides/PAGES_QUICK_START.md) for guidance on adding new pages to your application.

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
| macOS aStudio app       | `platforms/apple/apps/macos/ChatUIApp/README.md` |
| macOS Playground        | `platforms/apple/apps/macos/ChatUIPlayground/README.md` |
| macOS Component Gallery | `platforms/apple/apps/macos/ComponentGallery/README.md` |
| Web Widget Gallery      | `platforms/web/apps/web/README.md`             |
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

Then confirm the MCP URL in the aStudio macOS app Settings panel (default `http://localhost:8787`).

### Symptom: Storybook or Widget Gallery doesn't start

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

- **platforms/web/apps/web**  
  ✅ Widget Gallery for visual testing  
  ✅ Builds single-file widget HTML for MCP  
  ✅ Standalone host adapter implementation  
  ❌ No reusable UI source

- **platforms/web/apps/storybook**  
  ✅ Component documentation and interactive development  
  ✅ Design system showcase  
  ❌ No reusable UI source

- **platforms/mcp**  
  ✅ MCP server (serves widgets and defines tool contracts)  
  ✅ ChatGPT integration layer  
  ❌ Not required for library usage (only for ChatGPT integration)

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
  `@chatui/ui/forms`, `@chatui/ui/layout`, `@chatui/ui/navigation`, `@chatui/ui/overlays`,
  `@chatui/ui/icons`, and `@chatui/ui/showcase` subpaths.
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

1. **Design in Storybook** - `pnpm dev:storybook` - Interactive component development and documentation
2. **Test in Widget Gallery** - `pnpm dev:web` - Visual testing of widget bundles in isolation
3. **Build Widgets** - `pnpm build:widgets` - Create production widget bundles
4. **Test in ChatGPT** - `pnpm mcp:start` - Run MCP server for ChatGPT integration
5. **Test in macOS** - Open `platforms/apple/apps/macos/ChatUIApp` in Xcode for native app testing

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Your Projects                            │
├─────────────────────────────────────────────────────────────┤
│  React App    │  ChatGPT Widget  │  macOS App    │  ...     │
│  (Standalone) │  (Embedded)      │  (Native)     │          │
└───────┬───────┴────────┬─────────┴────────┬──────┴──────────┘
        │                │                  │
        ├────────────────┘                  │
        │                                   │
┌───────▼──────────────────┐    ┌───────────▼────────────────┐
│   @chatui/ui (React)     │    │  ChatUI Swift Packages     │
│  Component Library       │    │  (SwiftUI)                 │
├──────────────────────────┤    ├────────────────────────────┤
│  • Chat Components       │    │  • ChatUIFoundation        │
│  • UI Primitives         │    │  • ChatUIComponents        │
│  • Templates             │    │  • ChatUIThemes            │
│  • Pages                 │    │  • ChatUIShellChatGPT      │
└───────┬──────────────────┘    │  • ChatUIMCP               │
        │                       │  • ChatUISystemIntegration │
┌───────▼──────────────────┐    └────────────────────────────┘
│   @chatui/runtime        │
│  (Host Abstraction)      │
├──────────────────────────┤
│  • createEmbeddedHost()  │
│  • createStandaloneHost()│
│  • HostProvider          │
└───────┬──────────────────┘
        │
┌───────▼──────────────────┐
│   @chatui/tokens         │
│  (Design Tokens)         │
├──────────────────────────┤
│  • CSS Variables         │
│  • Tailwind Preset       │
│  • Theme Configuration   │
└──────────────────────────┘
```

### Cross-Platform Architecture

The repository supports both **React** (web/ChatGPT widgets) and **Swift** (macOS/iOS) implementations:

- **React**: Uses `@chatui/ui`, `@chatui/runtime`, and `@chatui/tokens` packages
- **Swift**: Uses modular Swift packages (`ChatUIFoundation`, `ChatUIComponents`, `ChatUIThemes`, etc.)
- **Design Parity**: Both platforms share the same design tokens and visual language from Apps SDK UI

---

<img
  src="./brand/brand-mark.webp"
  srcset="./brand/brand-mark.webp 1x, ./brand/brand-mark@2x.webp 2x"
  alt="brAInwav"
  height="28"
  align="left"
/>

<br clear="left" />

**brAInwav**  
_from demo to duty_
