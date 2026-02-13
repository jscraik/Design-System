# JSON Render Integration Guide

Last updated: 2026-01-16

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Integrating json-render for AI-generated UIs
- Non-scope: General widget development (see page-development.md)
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

This guide explains how to use json-render to let AI generate UIs using your design system components.

## Installation

```bash
pnpm add @json-render/core @json-render/react zod
```

## Quick Start

### 1. Create Component Catalog

Define which components AI can use:

```tsx
// packages/widgets/src/shared/json-render/catalog.ts
import { createCatalog } from "@json-render/core";
import { z } from "zod";

export const astudioCatalog = createCatalog({
  components: {
    // Maps to @design-studio/ui Card compound component
    Card: {
      props: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
      }),
      hasChildren: true,
    },
    // Maps to @design-studio/ui Button with actual variant names
    Button: {
      props: z.object({
        label: z.string(),
        variant: z
          .enum(["default", "destructive", "outline", "secondary", "ghost", "link"])
          .optional(),
        size: z.enum(["default", "sm", "lg", "icon"]).optional(),
        action: z.string(),
      }),
    },
    // Custom metric component (widget-specific)
    Metric: {
      props: z.object({
        label: z.string(),
        value: z.union([z.string(), z.number()]),
        change: z.string().optional(),
        format: z.enum(["currency", "percent", "number"]).optional(),
      }),
    },
    // Layout stack using Tailwind classes
    Stack: {
      props: z.object({
        direction: z.enum(["horizontal", "vertical"]).optional(),
        gap: z.enum(["sm", "md", "lg"]).optional(),
      }),
      hasChildren: true,
    },
  },
  actions: {
    refresh_data: { description: "Refresh widget data" },
    export_data: { description: "Export data to CSV" },
    send_message: { description: "Send a follow-up message" },
  },
});
```

### 2. Create Component Registry

Map catalog names to your actual React components from `@design-studio/ui`:

```tsx
// packages/widgets/src/shared/json-render/registry.tsx
import type { ComponentRegistry } from "@json-render/react";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@design-studio/ui";

export const astudioRegistry: ComponentRegistry = {
  // Card uses compound component pattern from @design-studio/ui
  Card: ({ element, children }) => {
    const { title, description } = element.props as {
      title?: string;
      description?: string;
    };

    return (
      <Card>
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent>{children}</CardContent>
      </Card>
    );
  },

  // Button uses actual @design-studio/ui Button variants
  Button: ({ element, onAction }) => {
    const { label, variant, size, action } = element.props as {
      label: string;
      variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
      size?: "default" | "sm" | "lg" | "icon";
      action: string;
    };

    return (
      <Button
        variant={variant}
        size={size}
        onClick={() => onAction?.({ type: action, params: {} })}
      >
        {label}
      </Button>
    );
  },

  // Metric matches existing dashboard widget pattern
  Metric: ({ element }) => {
    const { label, value, change, format } = element.props as {
      label: string;
      value: string | number;
      change?: string;
      format?: "currency" | "percent" | "number";
    };

    const formatValue = (val: string | number, fmt?: string) => {
      if (fmt === "currency") return `$${Number(val).toLocaleString()}`;
      if (fmt === "percent") return `${val}%`;
      return String(val);
    };

    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        <div className="text-xs text-white/60">{label}</div>
        <div className="text-base font-semibold">{formatValue(value, format)}</div>
        {change && <div className="text-xs text-white/70">{change}</div>}
      </div>
    );
  },

  // Stack uses Tailwind classes consistent with widget patterns
  Stack: ({ element, children }) => {
    const { direction = "vertical", gap = "md" } = element.props as {
      direction?: "horizontal" | "vertical";
      gap?: "sm" | "md" | "lg";
    };

    const gapClasses = { sm: "gap-2", md: "gap-3", lg: "gap-4" };
    const directionClass = direction === "horizontal" ? "flex-row" : "flex-col";

    return <div className={`flex ${directionClass} ${gapClasses[gap]}`}>{children}</div>;
  },
};
```

### 3. Create a Widget Using JSON Render

Follow the existing widget patterns with `createWidget` and `useWidgetProps`:

```tsx
// packages/widgets/src/widgets/ai-generated/dashboard/main.tsx
import "../../../styles/widget.css";
import { mountWidget, createWidget } from "../../../shared/widget-base";
import { useWidgetProps } from "../../../shared/use-widget-props";
import { useSendMessage, useCallTool } from "../../../shared/openai-hooks";
import { useState } from "react";
import { JSONUIProvider, Renderer, type UITree } from "@json-render/react";
import { astudioRegistry } from "../../../shared/json-render/registry";
import { astudioCatalog } from "../../../shared/json-render/catalog";

export type AIDashboardProps = {
  initialPrompt?: string;
  data?: Record<string, unknown>;
};

function AIDashboardBody({ initialPrompt, data }: AIDashboardProps) {
  const [tree, setTree] = useState<UITree | null>(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState(initialPrompt ?? "");
  const sendMessage = useSendMessage();
  const callTool = useCallTool();

  const generateUI = async () => {
    if (!prompt.trim() || !callTool) return;

    setLoading(true);
    try {
      // Use the MCP tool to generate UI
      const response = await callTool("generate_ui", {
        prompt,
        catalog: astudioCatalog,
        data,
      });

      if (!response.isError && response.structuredContent) {
        setTree(response.structuredContent as UITree);
      }
    } catch (error) {
      console.error("Failed to generate UI:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: { type: string; params: Record<string, unknown> }) => {
    if (action.type === "refresh_data") {
      await generateUI();
    } else if (action.type === "send_message" && sendMessage) {
      await sendMessage(String(action.params.message ?? ""));
    }
  };

  return (
    <div className="space-y-4 text-sm text-white/90">
      <div className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your dashboard..."
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40"
          onKeyDown={(e) => {
            if (e.key === "Enter") generateUI();
          }}
        />
        <button
          onClick={generateUI}
          disabled={loading || !prompt.trim()}
          className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {tree && (
        <JSONUIProvider
          registry={astudioRegistry}
          actionHandlers={{
            refresh_data: () => handleAction({ type: "refresh_data", params: {} }),
            export_data: () => handleAction({ type: "export_data", params: {} }),
            send_message: (params) => handleAction({ type: "send_message", params }),
          }}
        >
          <Renderer tree={tree} registry={astudioRegistry} loading={loading} />
        </JSONUIProvider>
      )}

      {tree && (
        <details className="text-xs">
          <summary className="cursor-pointer text-white/40">View JSON</summary>
          <pre className="mt-2 overflow-auto rounded-lg bg-white/5 p-2 text-white/60">
            {JSON.stringify(tree, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}

export const AIDashboardWidget = createWidget(AIDashboardBody, {
  title: "AI Dashboard Generator",
  className: "max-h-[70vh]",
});

function AIDashboardContainer() {
  const props = useWidgetProps<AIDashboardProps>({
    initialPrompt: "",
    data: {},
  });
  return <AIDashboardWidget {...props} />;
}

mountWidget(<AIDashboardContainer />);
```

### 4. Create the HTML Entry Point

```html
<!-- packages/widgets/src/widgets/ai-generated/dashboard/index.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI Dashboard Generator</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./main.tsx"></script>
  </body>
</html>
```

## How It Works

1. **User enters prompt**: "Show revenue and customer metrics"
2. **AI generates JSON**: Constrained to your catalog
3. **json-render validates**: Ensures JSON matches schemas
4. **Renderer maps to components**: Uses your registry
5. **Your components render**: Using @design-studio/ui

## Example AI-Generated JSON

```json
{
  "root": "card-1",
  "elements": {
    "card-1": {
      "type": "Card",
      "props": {
        "title": "Revenue Dashboard",
        "variant": "elevated"
      },
      "children": ["stack-1"]
    },
    "stack-1": {
      "type": "Stack",
      "props": {
        "direction": "horizontal",
        "gap": "lg"
      },
      "children": ["metric-1", "metric-2"]
    },
    "metric-1": {
      "type": "Metric",
      "props": {
        "label": "Total Revenue",
        "value": 125000,
        "format": "currency"
      }
    },
    "metric-2": {
      "type": "Metric",
      "props": {
        "label": "Customers",
        "value": 1234,
        "format": "number"
      }
    }
  }
}
```

## Adding More Components

To add a new component from `@design-studio/ui`:

1. **Add to catalog** (`packages/widgets/src/shared/json-render/catalog.ts`):

```tsx
// Add Chart component using @design-studio/ui Chart
Chart: {
  props: z.object({
    type: z.enum(["line", "bar", "area", "pie"]),
    data: z.array(z.object({
      label: z.string(),
      value: z.number(),
    })),
    title: z.string().optional(),
  }),
},
```

1. **Add to registry** (`packages/widgets/src/shared/json-render/registry.tsx`):

```tsx
import { Chart } from "@design-studio/ui";

// In registry:
Chart: ({ element }) => {
  const { type, data, title } = element.props as {
    type: "line" | "bar" | "area" | "pie";
    data: Array<{ label: string; value: number }>;
    title?: string;
  };

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      {title && <div className="mb-2 text-xs text-white/60">{title}</div>}
      <Chart type={type} data={data} />
    </div>
  );
},
```

## Best Practices

- **Use existing patterns**: Follow `dashboard-widget` structure with `createWidget` and `useWidgetProps`
- **Import styles correctly**: Use `../../../styles/widget.css` not `../../../styles.css`
- **Use Tailwind classes**: Match existing widget styling (`text-white/90`, `border-white/10`, etc.)
- **Leverage hooks**: Use `useCallTool`, `useSendMessage` from `openai-hooks.ts`
- **Validate props**: Use Zod schemas strictly
- **Handle errors**: Use `WidgetErrorBoundary` from `widget-base.tsx`

## Testing

```bash
# Build widgets
pnpm build:widgets

# Run widget dev server
pnpm dev:widgets

# Access at http://localhost:5173/ai-generated-dashboard

# Run accessibility tests
pnpm test:a11y:widgets
```

## Security Notes

- AI generates **data**, not **code**
- All components are pre-approved in your registry
- Props are validated by Zod schemas
- Actions are handled by your code via `useCallTool`
- No dynamic imports or eval()

## Related Docs

- Widget development: `.kiro/steering/page-development.md`
- Component library: `packages/ui/README.md`
- Design system: `docs/guides/DESIGN_GUIDELINES.md`
- OpenAI hooks: `packages/widgets/src/shared/openai-hooks.ts`
