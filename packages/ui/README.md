# @chatui/ui

A comprehensive React UI component library built for ChatGPT Apps SDK and standalone applications.

## 🚀 Quick Start

```bash
npm install @chatui/ui
# or
pnpm add @chatui/ui
```

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
