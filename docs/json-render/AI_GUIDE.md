# AI Agent Guide for JSON Render

Last updated: 2026-01-16

## Doc requirements

- Audience: AI agents (ChatGPT, Claude, etc.)
- Scope: Generating valid JSON schemas for UI components
- Non-scope: Manual React development
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Purpose

This guide helps AI agents generate valid JSON schemas that render as functional React components in the aStudio design system.

## Core Principles

1. **Output JSON, not JSX**: Generate JSON schemas, not React code
2. **Use registered components**: Only use components from the registry
3. **Follow component hierarchy**: Respect parent-child relationships
4. **Include accessibility**: Add ARIA attributes when appropriate
5. **Validate before output**: Ensure schema is valid JSON

## Schema Structure

### Basic Template

```json
{
  "component": "ComponentName",
  "props": {
    "propName": "value"
  },
  "children": []
}
```

### Rules

1. `component` (required): String matching a registered component name
2. `props` (optional): Object with component properties
3. `children` (optional): Array of schemas or a string

## Component Catalog

### Layout Components

#### Card

Use for contained content sections:

```json
{
  "component": "Card",
  "children": [
    {
      "component": "CardHeader",
      "children": [
        { "component": "CardTitle", "children": "Title" },
        { "component": "CardDescription", "children": "Description" }
      ]
    },
    {
      "component": "CardContent",
      "children": "Main content here"
    },
    {
      "component": "CardFooter",
      "children": [{ "component": "Button", "children": "Action" }]
    }
  ]
}
```

#### Tabs

Use for organizing content into sections:

```json
{
  "component": "Tabs",
  "props": { "defaultValue": "tab1" },
  "children": [
    {
      "component": "TabsList",
      "children": [
        { "component": "TabsTrigger", "props": { "value": "tab1" }, "children": "Tab 1" },
        { "component": "TabsTrigger", "props": { "value": "tab2" }, "children": "Tab 2" }
      ]
    },
    {
      "component": "TabsContent",
      "props": { "value": "tab1" },
      "children": "Content for tab 1"
    },
    {
      "component": "TabsContent",
      "props": { "value": "tab2" },
      "children": "Content for tab 2"
    }
  ]
}
```

### Interactive Components

#### Button

```json
{
  "component": "Button",
  "props": {
    "variant": "default",
    "size": "default"
  },
  "children": "Click me"
}
```

Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
Sizes: `default`, `sm`, `lg`, `icon`

#### Input

```json
{
  "component": "Input",
  "props": {
    "type": "text",
    "placeholder": "Enter text",
    "className": "w-full"
  }
}
```

#### Select

```json
{
  "component": "Select",
  "children": [
    {
      "component": "SelectTrigger",
      "children": [{ "component": "SelectValue", "props": { "placeholder": "Select option" } }]
    },
    {
      "component": "SelectContent",
      "children": [
        { "component": "SelectItem", "props": { "value": "1" }, "children": "Option 1" },
        { "component": "SelectItem", "props": { "value": "2" }, "children": "Option 2" }
      ]
    }
  ]
}
```

### Form Components

#### Label + Input Pattern

```json
{
  "component": "div",
  "props": { "className": "space-y-2" },
  "children": [
    { "component": "Label", "props": { "htmlFor": "email" }, "children": "Email" },
    { "component": "Input", "props": { "id": "email", "type": "email" } }
  ]
}
```

#### Switch

```json
{
  "component": "div",
  "props": { "className": "flex items-center space-x-2" },
  "children": [
    { "component": "Switch", "props": { "id": "notifications" } },
    {
      "component": "Label",
      "props": { "htmlFor": "notifications" },
      "children": "Enable notifications"
    }
  ]
}
```

#### Checkbox

```json
{
  "component": "div",
  "props": { "className": "flex items-center space-x-2" },
  "children": [
    { "component": "Checkbox", "props": { "id": "terms" } },
    { "component": "Label", "props": { "htmlFor": "terms" }, "children": "Accept terms" }
  ]
}
```

### Feedback Components

#### Alert

```json
{
  "component": "Alert",
  "props": { "variant": "default" },
  "children": [
    { "component": "AlertTitle", "children": "Heads up!" },
    { "component": "AlertDescription", "children": "You can add components to your app." }
  ]
}
```

Variants: `default`, `destructive`

#### Progress

```json
{
  "component": "Progress",
  "props": { "value": 60 }
}
```

#### Badge

```json
{
  "component": "Badge",
  "props": { "variant": "default" },
  "children": "New"
}
```

Variants: `default`, `secondary`, `destructive`, `outline`

### Display Components

#### Avatar

```json
{
  "component": "Avatar",
  "children": [
    { "component": "AvatarImage", "props": { "src": "/avatar.jpg", "alt": "User" } },
    { "component": "AvatarFallback", "children": "JD" }
  ]
}
```

#### Separator

```json
{
  "component": "Separator",
  "props": { "orientation": "horizontal" }
}
```

### Dialog Components

#### Dialog

```json
{
  "component": "Dialog",
  "children": [
    {
      "component": "DialogTrigger",
      "children": [{ "component": "Button", "children": "Open Dialog" }]
    },
    {
      "component": "DialogContent",
      "children": [
        {
          "component": "DialogHeader",
          "children": [
            { "component": "DialogTitle", "children": "Dialog Title" },
            { "component": "DialogDescription", "children": "Dialog description" }
          ]
        },
        {
          "component": "DialogFooter",
          "children": [{ "component": "Button", "children": "Confirm" }]
        }
      ]
    }
  ]
}
```

### Accordion

```json
{
  "component": "Accordion",
  "props": { "type": "single", "collapsible": true },
  "children": [
    {
      "component": "AccordionItem",
      "props": { "value": "item-1" },
      "children": [
        { "component": "AccordionTrigger", "children": "Section 1" },
        { "component": "AccordionContent", "children": "Content for section 1" }
      ]
    }
  ]
}
```

## Layout Patterns

### Grid Layout

```json
{
  "component": "div",
  "props": { "className": "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" },
  "children": [
    { "component": "Card", "children": [{ "component": "CardContent", "children": "Item 1" }] },
    { "component": "Card", "children": [{ "component": "CardContent", "children": "Item 2" }] },
    { "component": "Card", "children": [{ "component": "CardContent", "children": "Item 3" }] }
  ]
}
```

### Flex Layout

```json
{
  "component": "div",
  "props": { "className": "flex items-center justify-between" },
  "children": [
    { "component": "h2", "props": { "className": "text-2xl font-bold" }, "children": "Title" },
    { "component": "Button", "children": "Action" }
  ]
}
```

### Stack Layout

```json
{
  "component": "div",
  "props": { "className": "space-y-4" },
  "children": [
    { "component": "Card", "children": [{ "component": "CardContent", "children": "Item 1" }] },
    { "component": "Card", "children": [{ "component": "CardContent", "children": "Item 2" }] }
  ]
}
```

## Common Patterns

### Dashboard Metric Card

```json
{
  "component": "Card",
  "children": [
    {
      "component": "CardHeader",
      "props": { "className": "flex flex-row items-center justify-between space-y-0 pb-2" },
      "children": [
        {
          "component": "CardTitle",
          "props": { "className": "text-sm font-medium" },
          "children": "Total Revenue"
        },
        { "component": "span", "props": { "className": "text-2xl" }, "children": "$" }
      ]
    },
    {
      "component": "CardContent",
      "children": [
        {
          "component": "div",
          "props": { "className": "text-2xl font-bold" },
          "children": "$45,231.89"
        },
        {
          "component": "p",
          "props": { "className": "text-xs text-muted-foreground" },
          "children": "+20.1% from last month"
        }
      ]
    }
  ]
}
```

### Form Section

```json
{
  "component": "Card",
  "children": [
    {
      "component": "CardHeader",
      "children": [
        { "component": "CardTitle", "children": "Account Settings" },
        { "component": "CardDescription", "children": "Manage your account preferences" }
      ]
    },
    {
      "component": "CardContent",
      "props": { "className": "space-y-4" },
      "children": [
        {
          "component": "div",
          "props": { "className": "space-y-2" },
          "children": [
            { "component": "Label", "props": { "htmlFor": "name" }, "children": "Name" },
            { "component": "Input", "props": { "id": "name", "placeholder": "Enter your name" } }
          ]
        },
        {
          "component": "div",
          "props": { "className": "space-y-2" },
          "children": [
            { "component": "Label", "props": { "htmlFor": "email" }, "children": "Email" },
            {
              "component": "Input",
              "props": { "id": "email", "type": "email", "placeholder": "Enter your email" }
            }
          ]
        }
      ]
    },
    {
      "component": "CardFooter",
      "children": [{ "component": "Button", "children": "Save Changes" }]
    }
  ]
}
```

### Data List

```json
{
  "component": "Card",
  "children": [
    {
      "component": "CardHeader",
      "children": [{ "component": "CardTitle", "children": "Recent Activity" }]
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
              "props": { "className": "flex items-center justify-between" },
              "children": [
                {
                  "component": "div",
                  "children": [
                    {
                      "component": "p",
                      "props": { "className": "font-medium" },
                      "children": "User logged in"
                    },
                    {
                      "component": "p",
                      "props": { "className": "text-sm text-muted-foreground" },
                      "children": "2 minutes ago"
                    }
                  ]
                },
                { "component": "Badge", "children": "Success" }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## Styling with Tailwind

Use `className` prop for styling:

```json
{
  "component": "div",
  "props": {
    "className": "flex items-center justify-between p-4 bg-background rounded-lg border"
  },
  "children": "Styled content"
}
```

### Common Utility Classes

- **Spacing**: `p-4`, `m-2`, `space-y-4`, `gap-4`
- **Layout**: `flex`, `grid`, `items-center`, `justify-between`
- **Typography**: `text-sm`, `text-lg`, `font-bold`, `text-muted-foreground`
- **Colors**: `bg-background`, `text-foreground`, `border`
- **Sizing**: `w-full`, `h-screen`, `max-w-md`
- **Responsive**: `md:grid-cols-2`, `lg:flex-row`

## Accessibility Guidelines

### Always Include

1. **Labels for inputs**: Use `Label` component with `htmlFor`
2. **Alt text for images**: Add `alt` prop to images
3. **ARIA labels**: Add `aria-label` for icon-only buttons
4. **Keyboard navigation**: Ensure interactive elements are focusable

### Example

```json
{
  "component": "Button",
  "props": {
    "aria-label": "Close dialog",
    "variant": "ghost",
    "size": "icon"
  },
  "children": "×"
}
```

## Validation Checklist

Before outputting a schema, verify:

- [ ] Valid JSON syntax
- [ ] All `component` names exist in registry
- [ ] Props match component API
- [ ] Children structure is correct (array or string)
- [ ] No circular references
- [ ] Accessibility attributes included
- [ ] Tailwind classes are valid

## Error Prevention

### Common Mistakes

❌ **Wrong**: Using JSX syntax

```json
{
  "component": "<Button>Click</Button>"
}
```

✅ **Correct**: Using component name

```json
{
  "component": "Button",
  "children": "Click"
}
```

❌ **Wrong**: Invalid component name

```json
{
  "component": "MyCustomButton"
}
```

✅ **Correct**: Using registered component

```json
{
  "component": "Button"
}
```

❌ **Wrong**: Props as array

```json
{
  "component": "Button",
  "props": ["variant", "default"]
}
```

✅ **Correct**: Props as object

```json
{
  "component": "Button",
  "props": { "variant": "default" }
}
```

## Response Format

When asked to create a UI, respond with:

1. **Brief description** of what you're creating
2. **JSON schema** in a code block
3. **Explanation** of key design decisions

### Example Response

```
I'll create a dashboard with three metric cards showing key performance indicators.

\`\`\`json
{
  "component": "div",
  "props": { "className": "grid grid-cols-3 gap-4" },
  "children": [
    {
      "component": "Card",
      "children": [
        {
          "component": "CardHeader",
          "children": [
            { "component": "CardTitle", "children": "Total Users" }
          ]
        },
        {
          "component": "CardContent",
          "children": [
            { "component": "div", "props": { "className": "text-2xl font-bold" }, "children": "1,234" }
          ]
        }
      ]
    }
  ]
}
\`\`\`

This layout uses a responsive grid that will stack on mobile devices and display three columns on larger screens. Each metric card follows the Card → CardHeader → CardTitle → CardContent hierarchy for proper semantic structure.
```

## Testing Your Schemas

To test a schema:

1. Validate JSON syntax
2. Check component names against registry
3. Verify prop types
4. Ensure children structure is correct
5. Test accessibility with screen readers

## Advanced Techniques

### Conditional Rendering

Use arrays to conditionally include components:

```json
{
  "component": "div",
  "children": [{ "component": "h1", "children": "Title" }]
}
```

### Dynamic Content

Use props to pass dynamic values:

```json
{
  "component": "Progress",
  "props": { "value": 75 }
}
```

### Composition

Build complex UIs by composing simple components:

```json
{
  "component": "Card",
  "children": [
    {
      "component": "CardHeader",
      "children": [
        {
          "component": "div",
          "props": { "className": "flex items-center justify-between" },
          "children": [
            { "component": "CardTitle", "children": "Settings" },
            {
              "component": "Button",
              "props": { "variant": "ghost", "size": "icon" },
              "children": "⚙"
            }
          ]
        }
      ]
    }
  ]
}
```

## Quick Reference

### Most Used Components

1. `Card` - Container for content
2. `Button` - Interactive actions
3. `Input` - Text input
4. `Label` - Form labels
5. `div` - Generic container
6. `Badge` - Status indicators
7. `Alert` - Notifications
8. `Tabs` - Content organization
9. `Select` - Dropdown selection
10. `Progress` - Progress indicators

### Most Used Props

- `className` - Tailwind CSS classes
- `variant` - Component style variant
- `size` - Component size
- `value` - Input/control value
- `placeholder` - Input placeholder
- `id` - Element ID
- `htmlFor` - Label association
- `aria-label` - Accessibility label

## Support

For questions or issues:

- Review [REGISTRY.md](./REGISTRY.md) for complete component list
- Check [EXAMPLES.md](./EXAMPLES.md) for more patterns
- See [README.md](./README.md) for system overview
