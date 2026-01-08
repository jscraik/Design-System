# @chatui/ui

Last updated: 2026-01-07

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Overview and essential workflows for this area
- Non-scope: Deep API reference or internal design rationale
- Owner: Design Systems Team (confirm)
- Review cadence: Each release (confirm)

A comprehensive React UI component library built for ChatGPT Apps SDK and standalone applications. Part of the aStudio cross-platform UI workbench.

## Table of contents

- [Prerequisites](#prerequisites)
- [Install](#install)
- [Quick start](#quick-start)
- [Verify](#verify)
- [What's included](#-whats-included)
- [Theming and styling](#-theming--styling)
- [Advanced usage](#-advanced-usage)
- [Troubleshooting](#troubleshooting)
- [Related docs](#related-docs)

## Prerequisites

- Node.js 18+
- React 19.x
- pnpm (recommended) or npm

## Install

```bash
pnpm add @chatui/ui
# or
npm install @chatui/ui
```

## 🚀 Quick Start

```tsx
import { ChatUIRoot, Button, ModelSelector } from "@chatui/ui";
import "@chatui/ui/styles.css";

function App() {
  return (
    <ChatUIRoot>
      <div className="p-4">
        <Button>Hello World</Button>
      </div>
    </ChatUIRoot>
  );
}
```

## Verify

- Run Storybook (`pnpm dev:storybook`) and confirm the UI stories render.
- In your app, confirm the button renders with Apps SDK UI styling.

### Dev/demo exports

Demo pages and sandbox utilities live under a separate entry to keep the production API minimal:

```tsx
import { ChatUIApp, DesignSystemPage } from "@chatui/ui/dev";
```

## 📦 What's Included

### Core Chat Components

- `ChatUIRoot` - Main app wrapper with theme and context
- `ChatHeader` - Header with model selector and controls
- `ChatSidebar` - Collapsible sidebar with navigation
- `ChatMessages` - Message display with actions
- `ChatInput` - Input area with attachments and tools
- `ComposeView` - Compose interface for new conversations
- `ChatShell` - Slot-based layout container for chat variants
- `ChatVariantSplitSidebar` - Desktop-style sidebar layout
- `ChatVariantCompact` - Compact layout for small surfaces
- `ChatVariantContextRail` - Right-rail context panel layout

### UI Components Library

Over 50+ reusable components including:

#### Form & Input

- `Button`, `IconButton` - Various button styles
- `Input`, `Textarea` - Form inputs
- `Checkbox`, `Toggle`, `Switch` - Selection controls
- `Select`, `SegmentedControl` - Dropdown and segmented controls
- `RangeSlider` - Range input with custom styling

#### Layout & Navigation

- `Card`, `Sheet`, `Dialog` - Container components
- `Tabs`, `Accordion` - Content organization
- `Breadcrumb`, `Pagination` - Navigation
- `Sidebar`, `CollapsibleSection` - Layout helpers

#### Data Display

- `Badge`, `ModelBadge` - Status indicators
- `Avatar` - User representation
- `Table` - Data tables
- `Chart` - Data visualization
- `Progress` - Progress indicators

#### Feedback & Interaction

- `Alert`, `AlertDialog` - Notifications
- `Tooltip`, `HoverCard` - Contextual info
- `ContextTag` - Removable tags
- `MessageActions` - Message interaction buttons

#### Chat-Specific

- `ModelSelector` - AI model selection
- `ModeSelector` - Chat/Canvas mode toggle
- `ViewModeToggle` - Layout width toggle
- `ContextTag` - Active context display
- `ListItem` - Sidebar list items

## 🎨 Theming & Styling

The library uses CSS custom properties for theming:

```css
:root {
  --foundation-bg-dark-1: #1a1a1a;
  --foundation-bg-dark-2: #2a2a2a;
  --foundation-text-dark-primary: #ffffff;
  --foundation-text-dark-secondary: #b3b3b3;
  --foundation-accent-blue: #0ea5e9;
  --foundation-accent-green: #10b981;
  /* ... more tokens */
}
```

### Custom Styling

Components accept `className` props and use `tailwind-merge` for style composition:

```tsx
<Button className="bg-purple-500 hover:bg-purple-600">Custom Button</Button>
```

## 🔧 Advanced Usage

### Component Composition

```tsx
import { ChatUIRoot, ChatHeader, ChatSidebar, ChatMessages, ChatInput } from "@chatui/ui";

function ChatApp() {
  return (
    <ChatUIRoot>
      <div className="flex h-screen">
        <ChatSidebar />
        <div className="flex-1 flex flex-col">
          <ChatHeader />
          <ChatMessages />
          <ChatInput />
        </div>
      </div>
    </ChatUIRoot>
  );
}
```

## Troubleshooting

### Symptom: Components render without styling

Cause: CSS not imported.
Fix:

```ts
import "@chatui/ui/styles.css";
```

### Symptom: Icons render incorrectly

Cause: Direct `lucide-react` imports instead of the adapter.
Fix: In this repo, use the icon adapter in `packages/ui/src/icons` as the source of truth.

### Symptom: Storybook tests fail

Cause: UI package not built or mismatched dependencies.
Fix:

```bash
pnpm -C packages/ui build
pnpm -C platforms/web/apps/storybook test
```

## Related docs

- `packages/runtime/README.md` for host integration.
- `packages/tokens/README.md` for token usage.
- `platforms/web/apps/storybook/README.md` for component QA.

### Custom Hooks

```tsx
import { useControllableState } from "@chatui/ui";

function CustomComponent() {
  const [value, setValue] = useControllableState({
    prop: externalValue,
    defaultProp: "default",
    onChange: onExternalChange,
  });
}
```

### Widget Development

For ChatGPT widgets, use the standalone components:

```tsx
import { ModelBadge, ContextTag, Button } from "@chatui/ui";

function ChatWidget() {
  return (
    <div className="p-4 bg-[var(--foundation-bg-dark-1)]">
      <ModelBadge name="GPT-4" variant="blue" />
      <ContextTag label="Active Context" variant="green" />
    </div>
  );
}
```

## 📖 Documentation

- **Storybook**: Run `pnpm storybook:dev` to explore all components
- **Design System**: Built-in design system pages for tokens and guidelines
- **TypeScript**: Full TypeScript support with comprehensive type definitions

## 🛠 Development

```bash
# Install dependencies
pnpm install

# Watch build output
pnpm -C packages/ui dev

# Build library
pnpm -C packages/ui build

# Run Storybook
pnpm storybook:dev
```

## 📄 License

MIT License - see LICENSE file for details.
