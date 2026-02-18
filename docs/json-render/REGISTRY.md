# Component Registry

Last updated: 2026-01-16

## Doc requirements

- Audience: Developers and AI agents
- Scope: Complete list of available components in the JSON Render system
- Non-scope: Implementation details, React API
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Overview

This document lists all components available in the default registry for JSON Render. Each component can be referenced by its name in JSON schemas.

## Base Components

### Button

Interactive button component.

**Props:**

- `variant`: `'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'`
- `size`: `'default' | 'sm' | 'lg' | 'icon'`
- `disabled`: `boolean`
- `className`: `string`

**Example:**

```json
{
  "component": "Button",
  "props": { "variant": "default", "size": "default" },
  "children": "Click me"
}
```

### Input

Text input field.

**Props:**

- `type`: `'text' | 'email' | 'password' | 'number' | 'tel' | 'url'`
- `placeholder`: `string`
- `disabled`: `boolean`
- `className`: `string`
- `id`: `string`

**Example:**

```json
{
  "component": "Input",
  "props": { "type": "email", "placeholder": "Enter email", "id": "email" }
}
```

### Label

Form label component.

**Props:**

- `htmlFor`: `string` - Associates label with input
- `className`: `string`

**Example:**

```json
{
  "component": "Label",
  "props": { "htmlFor": "email" },
  "children": "Email Address"
}
```

### Badge

Status or category indicator.

**Props:**

- `variant`: `'default' | 'secondary' | 'destructive' | 'outline'`
- `className`: `string`

**Example:**

```json
{
  "component": "Badge",
  "props": { "variant": "default" },
  "children": "New"
}
```

### Separator

Visual divider between content.

**Props:**

- `orientation`: `'horizontal' | 'vertical'`
- `className`: `string`

**Example:**

```json
{
  "component": "Separator",
  "props": { "orientation": "horizontal" }
}
```

## Card Components

### Card

Container for related content.

**Props:**

- `className`: `string`

**Children:** Typically contains `CardHeader`, `CardContent`, `CardFooter`

**Example:**

```json
{
  "component": "Card",
  "children": [
    { "component": "CardHeader", "children": [...] },
    { "component": "CardContent", "children": "..." }
  ]
}
```

### CardHeader

Header section of a card.

**Props:**

- `className`: `string`

**Children:** Typically contains `CardTitle` and `CardDescription`

### CardTitle

Title text in card header.

**Props:**

- `className`: `string`

**Example:**

```json
{
  "component": "CardTitle",
  "children": "Card Title"
}
```

### CardDescription

Description text in card header.

**Props:**

- `className`: `string`

**Example:**

```json
{
  "component": "CardDescription",
  "children": "Card description text"
}
```

### CardContent

Main content area of a card.

**Props:**

- `className`: `string`

### CardFooter

Footer section of a card.

**Props:**

- `className`: `string`

## Alert Components

### Alert

Notification or message display.

**Props:**

- `variant`: `'default' | 'destructive'`
- `className`: `string`

**Children:** Typically contains `AlertTitle` and `AlertDescription`

**Example:**

```json
{
  "component": "Alert",
  "props": { "variant": "default" },
  "children": [
    { "component": "AlertTitle", "children": "Success!" },
    { "component": "AlertDescription", "children": "Operation completed." }
  ]
}
```

### AlertTitle

Title of an alert.

**Props:**

- `className`: `string`

### AlertDescription

Description text of an alert.

**Props:**

- `className`: `string`

## Tabs Components

### Tabs

Tabbed content container.

**Props:**

- `defaultValue`: `string` - Initially active tab
- `className`: `string`

**Children:** Requires `TabsList` and `TabsContent` components

**Example:**

```json
{
  "component": "Tabs",
  "props": { "defaultValue": "tab1" },
  "children": [
    { "component": "TabsList", "children": [...] },
    { "component": "TabsContent", "props": { "value": "tab1" }, "children": "..." }
  ]
}
```

### TabsList

Container for tab triggers.

**Props:**

- `className`: `string`

**Children:** Contains `TabsTrigger` components

### TabsTrigger

Individual tab button.

**Props:**

- `value`: `string` - Tab identifier
- `className`: `string`

**Example:**

```json
{
  "component": "TabsTrigger",
  "props": { "value": "overview" },
  "children": "Overview"
}
```

### TabsContent

Content panel for a tab.

**Props:**

- `value`: `string` - Matches TabsTrigger value
- `className`: `string`

## Select Components

### Select

Dropdown selection component.

**Props:**

- `defaultValue`: `string`
- `className`: `string`

**Children:** Requires `SelectTrigger` and `SelectContent`

**Example:**

```json
{
  "component": "Select",
  "children": [
    { "component": "SelectTrigger", "children": [...] },
    { "component": "SelectContent", "children": [...] }
  ]
}
```

### SelectTrigger

Button that opens the select dropdown.

**Props:**

- `className`: `string`

**Children:** Typically contains `SelectValue`

### SelectValue

Displays the selected value.

**Props:**

- `placeholder`: `string`
- `className`: `string`

### SelectContent

Dropdown menu container.

**Props:**

- `className`: `string`

**Children:** Contains `SelectItem` components

### SelectItem

Individual option in select dropdown.

**Props:**

- `value`: `string` - Option value
- `className`: `string`

**Example:**

```json
{
  "component": "SelectItem",
  "props": { "value": "option1" },
  "children": "Option 1"
}
```

## Form Components

### Switch

Toggle switch component.

**Props:**

- `id`: `string`
- `checked`: `boolean`
- `disabled`: `boolean`
- `className`: `string`

**Example:**

```json
{
  "component": "Switch",
  "props": { "id": "notifications" }
}
```

### Checkbox

Checkbox input component.

**Props:**

- `id`: `string`
- `checked`: `boolean`
- `disabled`: `boolean`
- `className`: `string`

**Example:**

```json
{
  "component": "Checkbox",
  "props": { "id": "terms" }
}
```

### RadioGroup

Container for radio button options.

**Props:**

- `defaultValue`: `string`
- `className`: `string`

**Children:** Contains `RadioGroupItem` components

### RadioGroupItem

Individual radio button.

**Props:**

- `value`: `string`
- `id`: `string`
- `className`: `string`

### Slider

Range slider input.

**Props:**

- `min`: `number`
- `max`: `number`
- `step`: `number`
- `defaultValue`: `number[]`
- `className`: `string`

**Example:**

```json
{
  "component": "Slider",
  "props": { "min": 0, "max": 100, "step": 1, "defaultValue": [50] }
}
```

## Feedback Components

### Progress

Progress bar indicator.

**Props:**

- `value`: `number` - Progress percentage (0-100)
- `className`: `string`

**Example:**

```json
{
  "component": "Progress",
  "props": { "value": 65 }
}
```

## Avatar Components

### Avatar

User avatar container.

**Props:**

- `className`: `string`

**Children:** Contains `AvatarImage` and `AvatarFallback`

**Example:**

```json
{
  "component": "Avatar",
  "children": [
    { "component": "AvatarImage", "props": { "src": "/avatar.jpg", "alt": "User" } },
    { "component": "AvatarFallback", "children": "JD" }
  ]
}
```

### AvatarImage

Image element for avatar.

**Props:**

- `src`: `string` - Image URL
- `alt`: `string` - Alt text
- `className`: `string`

### AvatarFallback

Fallback content when image fails to load.

**Props:**

- `className`: `string`

**Example:**

```json
{
  "component": "AvatarFallback",
  "children": "JD"
}
```

## Dialog Components

### Dialog

Modal dialog container.

**Props:**

- `open`: `boolean`
- `className`: `string`

**Children:** Contains `DialogTrigger` and `DialogContent`

### DialogTrigger

Element that opens the dialog.

**Props:**

- `asChild`: `boolean`
- `className`: `string`

### DialogContent

Dialog content container.

**Props:**

- `className`: `string`

**Children:** Typically contains `DialogHeader` and `DialogFooter`

### DialogHeader

Header section of dialog.

**Props:**

- `className`: `string`

**Children:** Typically contains `DialogTitle` and `DialogDescription`

### DialogTitle

Title of the dialog.

**Props:**

- `className`: `string`

### DialogDescription

Description text in dialog.

**Props:**

- `className`: `string`

### DialogFooter

Footer section with action buttons.

**Props:**

- `className`: `string`

## Accordion Components

### Accordion

Collapsible content sections.

**Props:**

- `type`: `'single' | 'multiple'`
- `collapsible`: `boolean`
- `defaultValue`: `string`
- `className`: `string`

**Children:** Contains `AccordionItem` components

**Example:**

```json
{
  "component": "Accordion",
  "props": { "type": "single", "collapsible": true },
  "children": [
    { "component": "AccordionItem", "props": { "value": "item-1" }, "children": [...] }
  ]
}
```

### AccordionItem

Individual accordion section.

**Props:**

- `value`: `string` - Unique identifier
- `className`: `string`

**Children:** Contains `AccordionTrigger` and `AccordionContent`

### AccordionTrigger

Button to expand/collapse accordion item.

**Props:**

- `className`: `string`

### AccordionContent

Content shown when accordion item is expanded.

**Props:**

- `className`: `string`

## HTML Primitives

### div

Generic container element.

**Props:**

- `className`: `string`
- Any standard HTML div attributes

**Example:**

```json
{
  "component": "div",
  "props": { "className": "flex items-center gap-4" },
  "children": [...]
}
```

### span

Inline text container.

**Props:**

- `className`: `string`
- Any standard HTML span attributes

### p

Paragraph element.

**Props:**

- `className`: `string`
- Any standard HTML p attributes

### h1, h2, h3, h4, h5, h6

Heading elements.

**Props:**

- `className`: `string`
- Any standard HTML heading attributes

**Example:**

```json
{
  "component": "h2",
  "props": { "className": "text-2xl font-bold" },
  "children": "Section Title"
}
```

## Common Patterns

### Form Field Pattern

```json
{
  "component": "div",
  "props": { "className": "space-y-2" },
  "children": [
    { "component": "Label", "props": { "htmlFor": "field" }, "children": "Field Label" },
    { "component": "Input", "props": { "id": "field", "type": "text" } }
  ]
}
```

### Card with Header and Content

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
      "children": "Main content"
    }
  ]
}
```

### Switch with Label

```json
{
  "component": "div",
  "props": { "className": "flex items-center space-x-2" },
  "children": [
    { "component": "Switch", "props": { "id": "setting" } },
    { "component": "Label", "props": { "htmlFor": "setting" }, "children": "Enable feature" }
  ]
}
```

## Related Documentation

- [README.md](./README.md) - System overview
- [AI_GUIDE.md](./AI_GUIDE.md) - AI agent guide
- [EXAMPLES.md](./EXAMPLES.md) - Example schemas
