# Component Catalog

Complete list of all components in `@design-studio/ui` with their import paths.

---

## Quick Reference

| Category | Export Path | Component Count |
|-----------|--------------|-----------------|
| Base | `@design-studio/ui/base` | 15+ |
| Forms | `@design-studio/ui/forms` | 8 |
| Chat | `@design-studio/ui/chat` | 5+ |
| Data Display | `@design-studio/ui/data-display` | 8 |
| Feedback | `@design-studio/ui/feedback` | 8 |
| Layout | `@design-studio/ui/layout` | 3 |
| Navigation | `@design-studio/ui/navigation` | 12 |
| Overlays | `@design-studio/ui/overlays` | 15 |
| Icons | `@design-studio/ui/icons` | 286 icons |

---

## Base Components

`@design-studio/ui/base`

| Component | Description |
|-----------|-------------|
| Button | Primary action button |
| Checkbox | Boolean toggle input |
| Input | Text input field |
| RadioGroup | Single-select radio buttons |
| Switch | Toggle switch |
| Slider | Numeric range slider |
| Select | Dropdown select |
| Textarea | Multi-line text input |
| Calendar | Date picker calendar |
| Label | Form label with semantic tokens |
| Badge | Status/label badge |
| Avatar | User profile image |
| Separator | Visual divider |
| CodeBlock | Syntax-highlighted code |
| SectionHeader | Section title with actions |
| TextLink | Styled link component |

---

## Form Components

`@design-studio/ui/forms`

| Component | Description |
|-----------|-------------|
| Form | Form wrapper with context |
| DatePicker | Date selection input |
| RangeSlider | Dual-handle range slider |
| Combobox | Searchable select |
| TagInput | Tag/chip input field |

---

## Chat Components

`@design-studio/ui/chat`

| Component | Description |
|-----------|-------------|
| Message | Chat message container |
| MessageActions | Message action buttons |
| MessageInput | Chat input with send |
| MessageList | Virtualized message list |
| TypingIndicator | "Typing..." status |

---

## Data Display Components

`@design-studio/ui/data-display`

| Component | Description |
|-----------|-------------|
| Card | Elevation card container |
| Chart | Recharts wrapper |
| Progress | Progress indicator |
| Indicator | Status indicator |
| CodeBlock | Syntax-highlighted code |
| Markdown | Markdown renderer |
| EmptyMessage | Empty state placeholder |
| Image | Optimized image component |

---

## Feedback Components

`@design-studio/ui/feedback`

| Component | Description |
|-----------|-------------|
| Toast | Notification toast (via sonner) |
| Dialog | Modal dialog wrapper |
| AlertDialog | Alert-style dialog |
| ErrorBoundary | Error catch boundary |
| Sonner | Toast container |

---

## Layout Components

`@design-studio/ui/layout`

| Component | Description |
|-----------|-------------|
| Container | Max-width container |
| Grid | Responsive grid |
| Stack | Flex stack with gap |
| Transition | Animation wrapper |

---

## Navigation Components

`@design-studio/ui/navigation`

| Component | Description |
|-----------|-------------|
| Tabs | Tab navigation |
| Sidebar | Collapsible sidebar |
| Breadcrumb | Navigation breadcrumbs |
| Pagination | List pagination |
| Carousel | Embla carousel |
| NavigationMenu | Radix nav menu |
| Menubar | Application menu bar |
| Command | Cmd+k command palette |
| ModelSelector | AI model selector |
| ModeSelector | View mode toggle |
| ViewModeToggle | View switcher |
| ModelBadge | Model indicator badge |

---

## Overlay Components

`@design-studio/ui/overlays`

| Component | Description |
|-----------|-------------|
| Modal | Modal overlay |
| Dialog | Dialog overlay |
| Popover | Hover/click popover |
| Tooltip | Hover tooltip |
| DropdownMenu | Dropdown menu |
| ContextMenu | Right-click menu |
| Sheet | Side drawer sheet |
| Drawer | Slide-out drawer |
| HoverCard | Hover card popover |
| Command | Command palette overlay |

---

## Icons

`@design-studio/ui/icons`

286 icons organized into categories:
- `account-user/` - Avatar, User, Group
- `arrows/` - Directional icons, chevrons
- `brands/` - GitHub, Figma, Notion, etc.
- `chat-tools/` - Copy, Download, Mic, Camera
- `settings/` - Settings, Info, Warning, Moon
- `misc/` - Calendar, Clock, Globe

```tsx
import { IconName } from '@design-studio/ui/icons';
```

---

## Usage Examples

```tsx
// Base components
import { Button, Input, Checkbox } from '@design-studio/ui/base';

// Form components
import { Form, DatePicker } from '@design-studio/ui/forms';

// Data display
import { Card, Chart } from '@design-studio/ui/data-display';

// Overlays
import { Modal, Tooltip, Dialog } from '@design-studio/ui/overlays';

// Navigation
import { Tabs, Sidebar, Pagination } from '@design-studio/ui/navigation';

// Feedback
import { Toast, AlertDialog } from '@design-studio/ui/feedback';

// Icons
import { IconName } from '@design-studio/ui/icons';
```

---

## Component Variants

### How Variants Work

Components are wrappers around `@openai/apps-sdk-ui`. Variant support depends on the underlying Apps SDK component.

**Common variant patterns** (verify in Storybook):

| Variant | Typical Values | Components Supporting |
|---------|-----------------|----------------------|
| **Size** | sm, md, lg | Button, Input, Select |
| **Variant** | primary, secondary, ghost, outline | Button |
| **State** | hover, active, disabled | All interactive components |
| **Intent** | success, warning, error, info | Badge, Toast, Alert |
| **Color** | auto, light, dark | Icon, CodeBlock |

### Customization Strategy

Since components are wrapped, use these approaches for customization:

**1. className prop** (preferred):
```tsx
<Button className="bg-accent-text-white px-6 py-3">
  Custom styled button
</Button>
```

**2. Tailwind classes**:
```tsx
<Button variant="secondary" className="border-2 font-bold">
  Modified secondary button
</Button>
```

**3. style prop** (for dynamic styles):
```tsx
<Button style={{ backgroundColor: customColor }}>
  Dynamically styled
</Button>
```

### Variants by Component

| Component | Sizes | Variants | Notes |
|-----------|--------|----------|--------|
| Button | sm, md, lg | primary, secondary, ghost, outline |
| Input | - | - | Uses parent size context |
| Checkbox | - | - | Regular only |
| Select | sm, md, lg | - | From Radix Select |
| Modal | sm, md, lg | - | Size affects padding |
| Toast | - | default, error, success, warning | From sonner |
| Tabs | - | - | From Radix Tabs |

---

**Note**: Run `pnpm dev:storybook` to see interactive examples of all components.
