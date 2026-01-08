# Widget Architecture Summary

Last updated: 2026-01-04

## Doc requirements
- Audience: Engineers and technical leads
- Scope: System architecture and component relationships
- Non-scope: Step-by-step operational procedures
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Contents

- [Doc requirements](#doc-requirements)
- [Overview](#overview)
- [Architecture Components](#architecture-components)
  - [1. Shared Design System ✅](#1-shared-design-system)
  - [2. Host Abstraction ✅](#2-host-abstraction)
  - [3. Widget Gallery ✅](#3-widget-gallery)
  - [4. Development Tools ✅](#4-development-tools)
- [Current Widgets](#current-widgets)
- [Build Commands](#build-commands)
- [Key Benefits Achieved](#key-benefits-achieved)
  - [✅ Visual Consistency](#visual-consistency)
  - [✅ Behavioral Consistency](#behavioral-consistency)
  - [✅ Development Efficiency](#development-efficiency)
  - [✅ ChatGPT Integration Ready](#chatgpt-integration-ready)
- [Usage Patterns](#usage-patterns)
  - [For Standalone Apps](#for-standalone-apps)
  - [For ChatGPT Widgets](#for-chatgpt-widgets)
- [Next Steps](#next-steps)
- [Verify](#verify)


## Overview

Your codebase now supports both **standalone React apps** and **ChatGPT widget integration** with complete visual and behavioral consistency using Apps SDK UI as the shared design system.

## Architecture Components

### 1. Shared Design System ✅

- **Apps SDK UI** as the foundation (`@openai/apps-sdk-ui`)
- **Consistent styling** across all deployment targets
- **Component adapter layer** in `packages/ui/src/integrations/apps-sdk/index.ts`

### 2. Host Abstraction ✅

- **`packages/runtime`** - Host adapter interface
- **`createEmbeddedHost()`** - Wraps `window.openai` for ChatGPT
- **`createStandaloneHost()`** - API calls for standalone mode
- **`HostProvider`** - Keeps UI components host-agnostic

### 3. Widget Gallery ✅

- **`packages/widgets`** - Standalone widget bundles
- **Multi-entry Vite build** - Each widget compiles to standalone HTML
- **Same components** as main app, different deployment target

### 4. Development Tools ✅

- **Widget harness** (`platforms/web/apps/web/harness`) - Preview widgets in iframe
- **MCP server** - Serves widgets to ChatGPT
- **Storybook** - Component development

## Current Widgets

Widget IDs are defined by the leaf folder names under `packages/widgets/src/widgets/**`:

- `auth-demo`
- `chat-view`
- `chat-template`
- `chat-header`
- `chat-sidebar`
- `chat-messages`
- `chat-input`
- `compose-view`
- `dashboard-widget`
- `enhanced-example-widget`
- `example-widget`
- `kitchen-sink-lite`
- `pizzaz-carousel`
- `pizzaz-gallery`
- `pizzaz-markdown`
- `pizzaz-shop`
- `pizzaz-table`
- `search-results`
- `shopping-cart`
- `solar-system`

## Build Commands

```bash
# Build all widgets
pnpm build:widgets

# Start MCP server (serves widgets to ChatGPT)
pnpm mcp:start

# Preview widgets in harness
pnpm dev:web
# Visit http://localhost:5173/harness

# Component development
pnpm dev:storybook
```

## Key Benefits Achieved

### ✅ Visual Consistency

- Same Apps SDK UI components everywhere
- Identical styling between standalone app and ChatGPT widgets
- Shared CSS and design tokens

### ✅ Behavioral Consistency

- Same React components in both contexts
- Host abstraction handles ChatGPT vs standalone differences
- Consistent user interactions and flows

### ✅ Development Efficiency

- Single codebase for multiple deployment targets
- Widget harness for rapid iteration
- Storybook for component development
- TypeScript throughout

### ✅ ChatGPT Integration Ready

- MCP server serves widget bundles
- Proper `window.openai` integration
- Tool output rendering
- Widget state management

## Usage Patterns

### For Standalone Apps

```tsx
const host = createStandaloneHost("http://localhost:8787");
<HostProvider host={host}>
  <AppsSDKUIProvider linkComponent="a">
    <ChatUIRoot />
  </AppsSDKUIProvider>
</HostProvider>;
```

### For ChatGPT Widgets

```tsx
const host = createEmbeddedHost(); // Uses window.openai
<HostProvider host={host}>
  <AppsSDKUIProvider linkComponent="a">
    <SearchResultsWidget />
  </AppsSDKUIProvider>
</HostProvider>;
```

## Next Steps

1. **Create domain-specific widgets** based on your use cases
2. **Add widget-specific tools** to MCP server
3. **Test in ChatGPT** using the MCP integration
4. **Expand component library** in `packages/ui`

## Verify

1. Build widgets: `pnpm build:widgets`.
2. Run the MCP server: `pnpm mcp:start`.
3. Start the harness: `pnpm dev:web` and visit `http://localhost:5173/harness`.

Your architecture perfectly matches the Apps SDK examples approach while maintaining the flexibility to work both inside and outside ChatGPT.
