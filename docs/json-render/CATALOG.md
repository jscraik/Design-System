# JSON Render Component Catalog

Last updated: 2026-01-16

Complete reference for all components available in the aStudio json-render system.

## Table of Contents

- [Layout Components](#layout-components)
- [Data Display Components](#data-display-components)
- [Interactive Components](#interactive-components)
- [Content Components](#content-components)
- [Specialized Components](#specialized-components)
- [Actions](#actions)

---

## Layout Components

### Card

Container with optional header for grouping related content.

**Props:**

- `title` (string, optional) - Card title
- `description` (string, optional) - Card description
- `variant` (enum, optional) - Visual style: `"default"` | `"outline"` | `"ghost"`

**Has Children:** Yes

**Example:**

```json
{
  "key": "card-1",
  "type": "Card",
  "props": {
    "title": "Dashboard",
    "description": "System overview",
    "variant": "default"
  },
  "children": ["content-1"]
}
```

---

### Stack

Flexbox layout for arranging children vertically or horizontally.

**Props:**

- `direction` (enum, optional) - Layout direction: `"horizontal"` | `"vertical"` (default: `"vertical"`)
- `gap` (enum, optional) - Space between items: `"xs"` | `"sm"` | `"md"` | `"lg"` | `"xl"` (default: `"md"`)
- `align` (enum, optional) - Cross-axis alignment: `"start"` | `"center"` | `"end"` | `"stretch"` (default: `"stretch"`)
- `justify` (enum, optional) - Main-axis alignment: `"start"` | `"center"` | `"end"` | `"between"` | `"around"` (default: `"start"`)

**Has Children:** Yes

**Example:**

```json
{
  "key": "stack-1",
  "type": "Stack",
  "props": {
    "direction": "vertical",
    "gap": "lg",
    "align": "stretch"
  },
  "children": ["item-1", "item-2"]
}
```

---

### Grid

CSS Grid layout for responsive column-based layouts.

**Props:**

- `columns` (enum, optional) - Number of columns: `"1"` | `"2"` | `"3"` | `"4"` | `"auto"` (default: `"2"`)
- `gap` (enum, optional) - Space between items: `"xs"` | `"sm"` | `"md"` | `"lg"` | `"xl"` (default: `"md"`)
- `responsive` (boolean, optional) - Enable responsive breakpoints (default: `true`)

**Has Children:** Yes

**Example:**

```json
{
  "key": "grid-1",
  "type": "Grid",
  "props": {
    "columns": "3",
    "gap": "md",
    "responsive": true
  },
  "children": ["metric-1", "metric-2", "metric-3"]
}
```

---

### Tabs

Tabbed interface for organizing content into switchable panels.

**Props:**

- `defaultTab` (string, optional) - ID of initially active tab
- `tabs` (array, required) - Tab definitions:
  - `id` (string, required) - Unique tab identifier
  - `label` (string, required) - Tab label text
  - `icon` (string, optional) - Icon character/emoji

**Has Children:** Yes (TabsContent components)

**Example:**

```json
{
  "key": "tabs-1",
  "type": "Tabs",
  "props": {
    "defaultTab": "overview",
    "tabs": [
      { "id": "overview", "label": "Overview", "icon": "📊" },
      { "id": "details", "label": "Details", "icon": "📋" }
    ]
  },
  "children": ["panel-1", "panel-2"]
}
```

---

### Accordion

Collapsible section with title and expandable content.

**Props:**

- `title` (string, required) - Accordion title
- `defaultOpen` (boolean, optional) - Initially expanded state (default: `false`)

**Has Children:** Yes

**Example:**

```json
{
  "key": "accordion-1",
  "type": "Accordion",
  "props": {
    "title": "Advanced Settings",
    "defaultOpen": false
  },
  "children": ["settings-1"]
}
```

---

## Data Display Components

### Metric

Display a single metric value with optional change indicator.

**Props:**

- `label` (string, required) - Metric label
- `value` (string | number, required) - Metric value
- `change` (string, optional) - Change indicator text (e.g., "+12%")
- `trend` (enum, optional) - Trend direction: `"up"` | `"down"` | `"neutral"`
- `format` (enum, optional) - Value format: `"currency"` | `"percent"` | `"number"` | `"duration"`
- `icon` (string, optional) - Icon character/emoji

**Has Children:** No

**Example:**

```json
{
  "key": "metric-1",
  "type": "Metric",
  "props": {
    "label": "Revenue",
    "value": 125000,
    "format": "currency",
    "change": "+12% from last month",
    "trend": "up",
    "icon": "💰"
  }
}
```

---

### StatusBadge

Status indicator with color coding.

**Props:**

- `status` (enum, required) - Status type: `"success"` | `"warning"` | `"error"` | `"info"` | `"neutral"`
- `label` (string, required) - Badge text
- `size` (enum, optional) - Badge size: `"sm"` | `"md"` | `"lg"` (default: `"md"`)

**Has Children:** No

**Example:**

```json
{
  "key": "badge-1",
  "type": "StatusBadge",
  "props": {
    "status": "success",
    "label": "Healthy",
    "size": "md"
  }
}
```

---

### ProgressBar

Progress indicator with optional label and value display.

**Props:**

- `value` (number, required) - Progress value (0-100)
- `label` (string, optional) - Progress label
- `showValue` (boolean, optional) - Show percentage value (default: `true`)
- `variant` (enum, optional) - Color variant: `"default"` | `"success"` | `"warning"` | `"error"` (default: `"default"`)

**Has Children:** No

**Example:**

```json
{
  "key": "progress-1",
  "type": "ProgressBar",
  "props": {
    "value": 75,
    "label": "Upload Progress",
    "showValue": true,
    "variant": "success"
  }
}
```

---

### Table

Data table with sortable columns.

**Props:**

- `columns` (array, required) - Column definitions:
  - `key` (string, required) - Column key matching row data
  - `label` (string, required) - Column header label
  - `sortable` (boolean, optional) - Enable sorting
- `rows` (array, required) - Row data objects
- `striped` (boolean, optional) - Alternate row colors (default: `false`)

**Has Children:** No

**Example:**

```json
{
  "key": "table-1",
  "type": "Table",
  "props": {
    "columns": [
      { "key": "name", "label": "Name", "sortable": true },
      { "key": "status", "label": "Status" },
      { "key": "value", "label": "Value" }
    ],
    "rows": [
      { "name": "Item 1", "status": "Active", "value": 100 },
      { "name": "Item 2", "status": "Pending", "value": 50 }
    ],
    "striped": true
  }
}
```

---

### List

Simple list with optional icons and descriptions.

**Props:**

- `items` (array, required) - List items:
  - `id` (string, required) - Unique item identifier
  - `label` (string, required) - Item label
  - `icon` (string, optional) - Icon character/emoji
  - `description` (string, optional) - Item description
- `variant` (enum, optional) - Display style: `"default"` | `"compact"` | `"detailed"` (default: `"default"`)

**Has Children:** No

**Example:**

```json
{
  "key": "list-1",
  "type": "List",
  "props": {
    "items": [
      { "id": "1", "label": "Dashboard", "icon": "📊", "description": "Main overview" },
      { "id": "2", "label": "Settings", "icon": "⚙️", "description": "Configuration" }
    ],
    "variant": "detailed"
  }
}
```

---

### KeyValue

Key-value pair display in horizontal or vertical layout.

**Props:**

- `label` (string, required) - Key label
- `value` (string, required) - Value text
- `variant` (enum, optional) - Layout: `"horizontal"` | `"vertical"` (default: `"horizontal"`)

**Has Children:** No

**Example:**

```json
{
  "key": "kv-1",
  "type": "KeyValue",
  "props": {
    "label": "Status",
    "value": "Active",
    "variant": "horizontal"
  }
}
```

---

## Interactive Components

### Button

Action button with variants and sizes.

**Props:**

- `label` (string, required) - Button text
- `variant` (enum, optional) - Visual style: `"default"` | `"destructive"` | `"outline"` | `"secondary"` | `"ghost"` | `"link"` (default: `"secondary"`)
- `size` (enum, optional) - Button size: `"default"` | `"sm"` | `"lg"` | `"icon"` (default: `"default"`)
- `action` (string, required) - Action name to trigger
- `icon` (string, optional) - Icon character/emoji
- `disabled` (boolean, optional) - Disabled state (default: `false`)

**Has Children:** No

**Example:**

```json
{
  "key": "button-1",
  "type": "Button",
  "props": {
    "label": "Refresh Data",
    "variant": "secondary",
    "size": "default",
    "action": "refresh_data",
    "icon": "🔄",
    "disabled": false
  }
}
```

---

### ButtonGroup

Group of related buttons in horizontal or vertical layout.

**Props:**

- `orientation` (enum, optional) - Layout direction: `"horizontal"` | `"vertical"` (default: `"horizontal"`)

**Has Children:** Yes (Button components)

**Example:**

```json
{
  "key": "button-group-1",
  "type": "ButtonGroup",
  "props": {
    "orientation": "horizontal"
  },
  "children": ["button-1", "button-2"]
}
```

---

### Link

Hyperlink with optional external indicator.

**Props:**

- `label` (string, required) - Link text
- `href` (string, required) - URL
- `external` (boolean, optional) - Opens in new tab (default: `false`)

**Has Children:** No

**Example:**

```json
{
  "key": "link-1",
  "type": "Link",
  "props": {
    "label": "Documentation",
    "href": "https://docs.example.com",
    "external": true
  }
}
```

---

## Content Components

### Text

Text display with semantic variants and alignment.

**Props:**

- `content` (string, required) - Text content
- `variant` (enum, optional) - Text style: `"heading"` | `"subheading"` | `"body"` | `"caption"` | `"code"` | `"muted"` (default: `"body"`)
- `align` (enum, optional) - Text alignment: `"left"` | `"center"` | `"right"` (default: `"left"`)

**Has Children:** No

**Example:**

```json
{
  "key": "text-1",
  "type": "Text",
  "props": {
    "content": "Welcome to the dashboard",
    "variant": "heading",
    "align": "center"
  }
}
```

---

### Alert

Alert/notification message with variants.

**Props:**

- `title` (string, optional) - Alert title
- `message` (string, required) - Alert message
- `variant` (enum, optional) - Alert type: `"info"` | `"success"` | `"warning"` | `"error"` (default: `"info"`)
- `dismissible` (boolean, optional) - Show dismiss button (default: `false`)

**Has Children:** No

**Example:**

```json
{
  "key": "alert-1",
  "type": "Alert",
  "props": {
    "title": "System Update",
    "message": "A new version is available",
    "variant": "info",
    "dismissible": true
  }
}
```

---

### Code

Code block with optional syntax highlighting and line numbers.

**Props:**

- `code` (string, required) - Code content
- `language` (string, optional) - Programming language
- `showLineNumbers` (boolean, optional) - Display line numbers (default: `false`)

**Has Children:** No

**Example:**

```json
{
  "key": "code-1",
  "type": "Code",
  "props": {
    "code": "const x = 42;\nconsole.log(x);",
    "language": "javascript",
    "showLineNumbers": true
  }
}
```

---

### Image

Image display with optional sizing and rounding.

**Props:**

- `src` (string, required) - Image URL
- `alt` (string, required) - Alt text for accessibility
- `width` (string, optional) - Image width (CSS value)
- `height` (string, optional) - Image height (CSS value)
- `rounded` (boolean, optional) - Rounded corners (default: `false`)

**Has Children:** No

**Example:**

```json
{
  "key": "image-1",
  "type": "Image",
  "props": {
    "src": "https://example.com/image.jpg",
    "alt": "Dashboard screenshot",
    "width": "400px",
    "rounded": true
  }
}
```

---

### Divider

Visual separator with optional label.

**Props:**

- `orientation` (enum, optional) - Direction: `"horizontal"` | `"vertical"` (default: `"horizontal"`)
- `label` (string, optional) - Divider label text

**Has Children:** No

**Example:**

```json
{
  "key": "divider-1",
  "type": "Divider",
  "props": {
    "orientation": "horizontal",
    "label": "or"
  }
}
```

---

### Spacer

Empty space for layout control.

**Props:**

- `size` (enum, optional) - Space size: `"xs"` | `"sm"` | `"md"` | `"lg"` | `"xl"` (default: `"md"`)

**Has Children:** No

**Example:**

```json
{
  "key": "spacer-1",
  "type": "Spacer",
  "props": {
    "size": "lg"
  }
}
```

---

## Specialized Components

### LogEntry

Single log entry display for system logs.

**Props:**

- `level` (enum, required) - Log level: `"debug"` | `"info"` | `"warn"` | `"error"`
- `timestamp` (string, required) - ISO 8601 timestamp
- `message` (string, required) - Log message
- `metadata` (object, optional) - Additional log metadata

**Has Children:** No

**Example:**

```json
{
  "key": "log-1",
  "type": "LogEntry",
  "props": {
    "level": "info",
    "timestamp": "2026-01-16T10:30:00Z",
    "message": "User logged in successfully",
    "metadata": { "userId": "123" }
  }
}
```

---

### TraceSpan

Distributed trace span display.

**Props:**

- `name` (string, required) - Span name
- `traceId` (string, required) - Trace identifier
- `spanId` (string, required) - Span identifier
- `duration` (number, optional) - Duration in milliseconds
- `status` (enum, optional) - Span status: `"ok"` | `"error"` (default: `"ok"`)

**Has Children:** No

**Example:**

```json
{
  "key": "trace-1",
  "type": "TraceSpan",
  "props": {
    "name": "database.query",
    "traceId": "abc123def456",
    "spanId": "span789",
    "duration": 45,
    "status": "ok"
  }
}
```

---

### AgentRunCard

Agent execution run display card.

**Props:**

- `runId` (string, required) - Run identifier
- `workflow` (string, required) - Workflow name
- `status` (enum, required) - Run status: `"running"` | `"paused"` | `"completed"` | `"failed"`
- `progress` (number, optional) - Progress percentage (0-100)
- `startTime` (string, required) - ISO 8601 start timestamp

**Has Children:** No

**Example:**

```json
{
  "key": "run-1",
  "type": "AgentRunCard",
  "props": {
    "runId": "run-abc-123",
    "workflow": "data-processing",
    "status": "running",
    "progress": 65,
    "startTime": "2026-01-16T10:00:00Z"
  }
}
```

---

### HealthIndicator

System component health indicator.

**Props:**

- `component` (string, required) - Component name
- `status` (enum, required) - Health status: `"healthy"` | `"degraded"` | `"unhealthy"`
- `message` (string, optional) - Status message
- `lastCheck` (string, optional) - ISO 8601 last check timestamp

**Has Children:** No

**Example:**

```json
{
  "key": "health-1",
  "type": "HealthIndicator",
  "props": {
    "component": "Database",
    "status": "healthy",
    "message": "All connections active",
    "lastCheck": "2026-01-16T10:35:00Z"
  }
}
```

---

## Actions

Actions are triggered by interactive components (primarily Button).

### Data Actions

- `refresh_data` - Refresh the widget data
- `export_data` - Export data to CSV or JSON
- `load_more` - Load more items

### Navigation Actions

- `view_details` - View detailed information
- `go_back` - Navigate back
- `open_link` - Open external link

### Communication Actions

- `send_message` - Send a follow-up message to ChatGPT
- `share` - Share content

### Control Actions (CortexDx)

- `pause_run` - Pause an agent run
- `resume_run` - Resume a paused agent run
- `cancel_run` - Cancel an agent run
- `restart_component` - Restart a system component

### Filter/Search Actions

- `apply_filter` - Apply filter criteria
- `clear_filter` - Clear all filters
- `search` - Perform search

### CRUD Actions

- `create` - Create new item
- `update` - Update existing item
- `delete` - Delete item

---

## Notes

- All elements **must** include a `key` property for React rendering
- Use semantic IDs (e.g., `metric-1`, `card-dashboard`) not generic ones
- Validate all props against the Zod schemas in `catalog.ts`
- Test components in the json-render-demo widget before production use
