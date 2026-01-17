# JSON Render Examples

Last updated: 2026-01-16

Practical examples of using json-render with your design system, following existing widget patterns.

## Example 1: Simple Metric Dashboard

Prompt: "Show me revenue and customer count"

```json
{
  "root": "stack-1",
  "elements": {
    "stack-1": {
      "type": "Stack",
      "props": { "direction": "horizontal", "gap": "lg" },
      "children": ["metric-1", "metric-2"]
    },
    "metric-1": {
      "type": "Metric",
      "props": { "label": "Revenue", "value": 125000, "format": "currency" }
    },
    "metric-2": {
      "type": "Metric",
      "props": { "label": "Customers", "value": 1234, "format": "number" }
    }
  }
}
```

## Example 2: Card with Actions

Prompt: "Create a revenue card with a refresh button"

```json
{
  "root": "card-1",
  "elements": {
    "card-1": {
      "type": "Card",
      "props": { "title": "Revenue Overview", "description": "Monthly metrics" },
      "children": ["stack-1"]
    },
    "stack-1": {
      "type": "Stack",
      "props": { "direction": "vertical", "gap": "md" },
      "children": ["metric-1", "button-1"]
    },
    "metric-1": {
      "type": "Metric",
      "props": {
        "label": "Total Revenue",
        "value": 125000,
        "format": "currency",
        "change": "+12% from last month"
      }
    },
    "button-1": {
      "type": "Button",
      "props": { "label": "Refresh Data", "variant": "secondary", "action": "refresh_data" }
    }
  }
}
```

## Example 3: Widget with Tool Input Data

Following the `dashboard-widget` pattern with `createWidget` and `useWidgetProps`:

```tsx
// packages/widgets/src/widgets/ai-generated/data-dashboard/main.tsx
import "../../../styles/widget.css";
import { mountWidget, createWidget } from "../../../shared/widget-base";
import { useWidgetProps } from "../../../shared/use-widget-props";
import { useToolInput, useWidgetState, useCallTool } from "../../../shared/openai-hooks";
import { useState, useEffect } from "react";
import { JSONUIProvider, Renderer, type UITree } from "@json-render/react";
import { astudioRegistry } from "../../../shared/json-render/registry";

export type DataDashboardProps = {
  autoGenerate?: boolean;
};

function DataDashboardBody({ autoGenerate }: DataDashboardProps) {
  const toolInput = useToolInput<{
    prompt?: string;
    data?: Record<string, unknown>;
  }>();

  const [widgetState, setWidgetState] = useWidgetState<{ tree: UITree | null }>();
  const [loading, setLoading] = useState(false);
  const callTool = useCallTool();

  useEffect(() => {
    if (autoGenerate && toolInput?.prompt && !widgetState?.tree) {
      generateUI(toolInput.prompt);
    }
  }, [autoGenerate, toolInput?.prompt]);

  const generateUI = async (prompt: string) => {
    if (!callTool) return;
    setLoading(true);
    try {
      const response = await callTool("generate_ui", {
        prompt,
        data: toolInput?.data,
      });
      if (!response.isError && response.structuredContent) {
        setWidgetState({ tree: response.structuredContent as UITree });
      }
    } catch (error) {
      console.error("Failed to generate UI:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 text-sm text-white/90">
      {loading && <div className="text-center text-white/60">Generating...</div>}
      {widgetState?.tree && (
        <JSONUIProvider registry={astudioRegistry} initialData={toolInput?.data}>
          <Renderer tree={widgetState.tree} registry={astudioRegistry} loading={loading} />
        </JSONUIProvider>
      )}
    </div>
  );
}

export const DataDashboardWidget = createWidget(DataDashboardBody, {
  title: "Data Dashboard",
  className: "max-h-[70vh]",
});

function DataDashboardContainer() {
  const props = useWidgetProps<DataDashboardProps>({ autoGenerate: true });
  return <DataDashboardWidget {...props} />;
}

mountWidget(<DataDashboardContainer />);
```

## Example 4: Error Handling with WidgetErrorBoundary

```tsx
// packages/widgets/src/widgets/ai-generated/safe-dashboard/main.tsx
import "../../../styles/widget.css";
import { mountWidget, createWidget, WidgetErrorBoundary } from "../../../shared/widget-base";
import { useWidgetProps } from "../../../shared/use-widget-props";
import { useCallTool } from "../../../shared/openai-hooks";
import { useState } from "react";
import { JSONUIProvider, Renderer, type UITree } from "@json-render/react";
import { astudioRegistry } from "../../../shared/json-render/registry";

function SafeDashboardBody() {
  const [tree, setTree] = useState<UITree | null>(null);
  const [error, setError] = useState<string | null>(null);
  const callTool = useCallTool();

  const generateUI = async (prompt: string) => {
    if (!callTool) return;
    setError(null);

    try {
      const response = await callTool("generate_ui", { prompt });

      if (response.isError) {
        throw new Error(response.result);
      }

      if (response.structuredContent) {
        setTree(response.structuredContent as UITree);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("UI generation failed:", err);
    }
  };

  return (
    <WidgetErrorBoundary>
      <div className="space-y-4 text-sm text-white/90">
        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-red-400">
            Error: {error}
          </div>
        )}

        {tree && (
          <JSONUIProvider registry={astudioRegistry}>
            <Renderer tree={tree} registry={astudioRegistry} />
          </JSONUIProvider>
        )}
      </div>
    </WidgetErrorBoundary>
  );
}

export const SafeDashboardWidget = createWidget(SafeDashboardBody, {
  title: "Safe Dashboard",
});
```

## Example 5: Testing Generated UIs

```tsx
// packages/widgets/src/widgets/ai-generated/__tests__/json-render.test.ts
import { describe, it, expect } from "vitest";
import { astudioCatalog } from "../../../shared/json-render/catalog";

describe("AI UI Generation", () => {
  it("validates generated JSON structure", () => {
    const json = {
      root: "card-1",
      elements: {
        "card-1": {
          type: "Card",
          props: { title: "Test" },
          children: [],
        },
      },
    };

    expect(json).toHaveProperty("root");
    expect(json).toHaveProperty("elements");
    expect(json.elements[json.root]).toBeDefined();
  });

  it("uses only catalog components", () => {
    const json = {
      root: "metric-1",
      elements: {
        "metric-1": {
          type: "Metric",
          props: { label: "Revenue", value: 1000, format: "currency" },
        },
      },
    };

    Object.values(json.elements).forEach((element) => {
      expect(Object.keys(astudioCatalog.components)).toContain(element.type);
    });
  });
});
```

## Related Docs

- Integration guide: `docs/guides/JSON_RENDER_INTEGRATION.md`
- Widget development: `.kiro/steering/page-development.md`
- OpenAI hooks: `packages/widgets/src/shared/openai-hooks.ts`
