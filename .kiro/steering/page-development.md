---
inclusion: always
---

# Apps SDK Widget Development Guide

Last updated: 2026-01-07

## Doc requirements

- Audience: Developers (intermediate)
- Scope: ChatGPT Apps SDK widget development
- Non-scope: Web app pages, routing, Storybook
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

This guide explains how to create standalone widgets for ChatGPT Apps SDK integration.

## Project Structure

```
packages/widgets/src/
├── sdk/
│   ├── generated/          # Auto-generated manifest
│   └── plugins/            # Build plugins
├── shared/                 # Shared utilities
│   ├── widget-base.tsx     # Base wrapper component
│   ├── openai-hooks.ts     # OpenAI SDK hooks
│   ├── use-widget-props.ts # Widget props hook
│   └── use-widget-state.ts # Widget state hook
├── styles/
│   └── widget.css          # Widget styles
└── widgets/                # Widget implementations
    ├── auth/               # Authentication widgets
    ├── chat/               # Chat-related widgets
    ├── commerce/           # E-commerce widgets
    ├── dashboard/          # Dashboard widgets
    ├── demo/               # Demo and example widgets
    ├── pizzaz/             # Visual effect widgets
    ├── science/            # Scientific visualization
    └── search/             # Search widgets
```

## Creating a Widget

1. Create folder: `packages/widgets/src/widgets/{category}/{widget-name}/`
2. Add `index.html` entry point
3. Add `main.tsx` with widget implementation
4. Widget is auto-discovered by the build system

### Widget Entry Point

```html
<!-- packages/widgets/src/widgets/{category}/{widget-name}/index.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Widget Name</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./main.tsx"></script>
  </body>
</html>
```

### Widget Implementation

```tsx
// packages/widgets/src/widgets/{category}/{widget-name}/main.tsx
import { mountWidget, WidgetBase, WidgetErrorBoundary } from "../../../shared/widget-base";
import "../../../styles.css";

function YourWidget() {
  return (
    <WidgetErrorBoundary>
      <WidgetBase title="Your Widget">
        {/* Widget content */}
      </WidgetBase>
    </WidgetErrorBoundary>
  );
}

mountWidget(<YourWidget />);
```

## Shared Utilities

### WidgetBase

Base wrapper providing consistent styling:

```tsx
import { WidgetBase } from "../../../shared/widget-base";

<WidgetBase title="Optional Title" className="custom-class">
  {children}
</WidgetBase>
```

### OpenAI Hooks

Access the OpenAI SDK context:

```tsx
import { useOpenAI } from "../../../shared/openai-hooks";

function MyWidget() {
  const openai = useOpenAI();
  // Use openai.* methods
}
```

### Widget Props & State

```tsx
import { useWidgetProps } from "../../../shared/use-widget-props";
import { useWidgetState } from "../../../shared/use-widget-state";

function MyWidget() {
  const props = useWidgetProps();
  const [state, setState] = useWidgetState(initialState);
}
```

## Build System

Widgets are auto-discovered via the `widgetManifest` Vite plugin:

- Scans `src/widgets/**/index.html`
- Generates input entries automatically
- Creates manifest at `src/sdk/generated/widget-manifest.ts`

### Build Commands

```bash
pnpm build:widgets    # Build all widgets
pnpm dev              # Dev server with hot reload
```

### Dev Server URLs

Access widgets at `http://localhost:5173/{widget-name}` during development.

## Checklist

- [ ] Created in `packages/widgets/src/widgets/{category}/`
- [ ] Has `index.html` entry point
- [ ] Has `main.tsx` implementation
- [ ] Uses `WidgetBase` wrapper
- [ ] Wrapped in `WidgetErrorBoundary`
- [ ] Imports shared styles
- [ ] Tested as standalone widget
