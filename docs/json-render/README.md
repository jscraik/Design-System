# JSON Render System

Last updated: 2026-01-16

## Doc requirements

- Audience: Developers (intermediate to advanced)
- Scope: AI-driven component rendering via JSON schemas
- Non-scope: Manual component development, Storybook
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Overview

The JSON Render system enables AI agents to dynamically generate UI components by outputting JSON schemas. This bridges the gap between AI-generated designs and React components, allowing ChatGPT to create functional interfaces without writing JSX code.

## Architecture

```
┌─────────────────┐
│   AI Agent      │
│  (ChatGPT)      │
└────────┬────────┘
         │ Outputs JSON Schema
         ▼
┌─────────────────┐
│  JsonRender     │
│  Component      │
└────────┬────────┘
         │ Looks up components
         ▼
┌─────────────────┐
│  Component      │
│  Registry       │
└────────┬────────┘
         │ Returns React Components
         ▼
┌─────────────────┐
│  Rendered UI    │
└─────────────────┘
```

## Key Concepts

### Component Schema

A JSON object describing a React component:

```typescript
interface ComponentSchema {
  component: string; // Component name from registry
  props?: Record<string, any>; // Component props
  children?: ComponentSchema[] | string; // Nested components or text
}
```

### Registry

A mapping of component names to React components. The default registry includes all aStudio UI components.

### JsonRender Component

The React component that interprets JSON schemas and renders them as React components.

## Quick Start

### Basic Usage

```tsx
import { JsonRender } from "@astudio/json-render";

const schema = {
  component: "Card",
  children: [
    {
      component: "CardHeader",
      children: [
        {
          component: "CardTitle",
          children: "Hello World",
        },
      ],
    },
  ],
};

function App() {
  return <JsonRender schema={schema} />;
}
```

### With Custom Registry

```tsx
import { JsonRender, createRegistry } from "@astudio/json-render";
import { MyCustomComponent } from "./components";

const registry = createRegistry();
registry.register("MyCustomComponent", MyCustomComponent);

function App() {
  return <JsonRender schema={schema} registry={registry} />;
}
```

## Use Cases

### 1. AI-Generated Dashboards

AI can generate complete dashboard layouts:

```json
{
  "component": "div",
  "props": { "className": "grid grid-cols-3 gap-4" },
  "children": [
    {
      "component": "Card",
      "children": [
        {
          "component": "CardHeader",
          "children": [{ "component": "CardTitle", "children": "Revenue" }]
        },
        {
          "component": "CardContent",
          "children": "$45,231.89"
        }
      ]
    }
  ]
}
```

### 2. Dynamic Forms

AI can create forms based on user requirements:

```json
{
  "component": "Card",
  "children": [
    {
      "component": "CardHeader",
      "children": [{ "component": "CardTitle", "children": "User Profile" }]
    },
    {
      "component": "CardContent",
      "children": [
        {
          "component": "div",
          "props": { "className": "space-y-4" },
          "children": [
            {
              "component": "div",
              "children": [
                { "component": "Label", "children": "Name" },
                { "component": "Input", "props": { "placeholder": "Enter name" } }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### 3. Interactive Widgets

AI can build interactive components:

```json
{
  "component": "Tabs",
  "props": { "defaultValue": "overview" },
  "children": [
    {
      "component": "TabsList",
      "children": [
        { "component": "TabsTrigger", "props": { "value": "overview" }, "children": "Overview" },
        { "component": "TabsTrigger", "props": { "value": "analytics" }, "children": "Analytics" }
      ]
    },
    {
      "component": "TabsContent",
      "props": { "value": "overview" },
      "children": [
        {
          "component": "Card",
          "children": [{ "component": "CardContent", "children": "Overview content" }]
        }
      ]
    }
  ]
}
```

## Integration with ChatGPT Apps SDK

### Widget Implementation

```tsx
// packages/widgets/src/widgets/ai-dashboard/main.tsx
import { mountWidget, WidgetBase, WidgetErrorBoundary } from "../../../shared/widget-base";
import { JsonRender } from "@astudio/json-render";
import { useWidgetProps } from "../../../shared/use-widget-props";
import "../../../styles.css";

function AIDashboard() {
  const props = useWidgetProps<{ schema: ComponentSchema }>();

  return (
    <WidgetErrorBoundary>
      <WidgetBase title="AI Dashboard">
        <JsonRender schema={props.schema} />
      </WidgetBase>
    </WidgetErrorBoundary>
  );
}

mountWidget(<AIDashboard />);
```

### ChatGPT Prompt Example

```
Create a dashboard for monitoring system health with:
- 3 metric cards showing CPU, Memory, and Disk usage
- A chart showing trends over time
- A table of recent alerts

Output as JSON schema using aStudio components.
```

## Available Components

See [REGISTRY.md](./REGISTRY.md) for the complete list of available components and their props.

## Best Practices

### For AI Agents

1. **Use semantic component names**: Prefer `Card`, `Button` over generic `div`
2. **Nest components properly**: Follow component hierarchy (e.g., `Card` → `CardHeader` → `CardTitle`)
3. **Include accessibility props**: Add `aria-label`, `role` when appropriate
4. **Use layout utilities**: Leverage Tailwind classes in `className` props
5. **Validate schemas**: Ensure all component names exist in registry

### For Developers

1. **Extend the registry**: Add custom components for domain-specific needs
2. **Provide fallbacks**: Use the `fallback` prop for error handling
3. **Type safety**: Use TypeScript interfaces for schema validation
4. **Test schemas**: Validate JSON schemas before rendering
5. **Document components**: Keep registry documentation up-to-date

## Advanced Usage

### Schema Validation

```tsx
import { z } from "zod";

const ComponentSchemaValidator = z.object({
  component: z.string(),
  props: z.record(z.any()).optional(),
  children: z.union([z.array(z.lazy(() => ComponentSchemaValidator)), z.string()]).optional(),
});

function validateSchema(schema: unknown) {
  return ComponentSchemaValidator.parse(schema);
}
```

### Custom Registry with Domain Components

```tsx
import { createRegistry, defaultRegistry } from "@astudio/json-render";
import { MetricCard, ChartWidget, DataTable } from "./domain-components";

const customRegistry = createRegistry();

// Copy default components
defaultRegistry.list().forEach((name) => {
  const component = defaultRegistry.get(name);
  if (component) {
    customRegistry.register(name, component);
  }
});

// Add domain-specific components
customRegistry.register("MetricCard", MetricCard);
customRegistry.register("ChartWidget", ChartWidget);
customRegistry.register("DataTable", DataTable);
```

### Error Handling

```tsx
function SafeJsonRender({ schema }: { schema: ComponentSchema }) {
  return (
    <JsonRender
      schema={schema}
      fallback={
        <Alert variant="destructive">
          <AlertTitle>Rendering Error</AlertTitle>
          <AlertDescription>
            Failed to render the component. Please check the schema.
          </AlertDescription>
        </Alert>
      }
    />
  );
}
```

## Troubleshooting

### Component Not Found

**Problem**: Console warning "Component 'X' not found in registry"

**Solution**:

- Check component name spelling
- Verify component is registered in the registry
- Use `registry.list()` to see available components

### Props Not Working

**Problem**: Component renders but props don't apply

**Solution**:

- Verify prop names match component API
- Check prop types (strings, numbers, booleans)
- Review component documentation in REGISTRY.md

### Children Not Rendering

**Problem**: Nested components don't appear

**Solution**:

- Ensure `children` is an array of schemas or a string
- Check for circular references in schema
- Verify parent component accepts children

## Performance Considerations

1. **Schema size**: Large schemas may impact initial render time
2. **Registry size**: Keep registry focused on needed components
3. **Memoization**: Consider memoizing schemas that don't change
4. **Lazy loading**: Load domain-specific registries on demand

## Security

⚠️ **Important**: Never render untrusted JSON schemas without validation. Always:

1. Validate schema structure
2. Sanitize user input in props
3. Whitelist allowed components
4. Limit schema depth to prevent stack overflow

## Related Documentation

- [REGISTRY.md](./REGISTRY.md) - Complete component registry
- [AI_GUIDE.md](./AI_GUIDE.md) - Guide for AI agents
- [EXAMPLES.md](./EXAMPLES.md) - Example schemas and patterns
- [Widget Development Guide](../page-development.md) - Creating widgets

## Contributing

To add new components to the default registry:

1. Import component from `@astudio/ui`
2. Register in `packages/json-render/src/default-registry.ts`
3. Document in `docs/json-render/REGISTRY.md`
4. Add examples in `docs/json-render/EXAMPLES.md`
5. Update tests

## Support

For issues or questions:

- Check [EXAMPLES.md](./EXAMPLES.md) for common patterns
- Review [REGISTRY.md](./REGISTRY.md) for component APIs
- See [AI_GUIDE.md](./AI_GUIDE.md) for AI-specific guidance
