# Component Source Architecture

## How Components Work in This Design System

### TL;DR

**Components are NOT generated during build.** They are thin wrapper functions around `@openai/apps-sdk-ui` components.

### Source Structure

```
packages/ui/src/
├── icons/              # 286 consolidated icons (REAL source)
└── integrations/        # Apps SDK wrapper layer (REAL source)
    └── apps-sdk-wrapper/
        ├── index.ts     # Wrapper functions
        ├── types.ts     # Re-exported types
        └── vendor.ts    # Fallback components
```

### Wrapper Architecture

The `@design-studio/ui` package wraps `@openai/apps-sdk-ui` components through:

**`@design-studio/ui/integrations`**

```ts
// Each component is a simple wrapper with version safety:
export function Button(props: AppsSDKButtonProps) {
  assertVersion();  // Checks @openai/apps-sdk-ui version >= 0.2.1
  return <AppsSDKButton {...props} />;
}
```

**Wrapped Components:**
- Badge, Button, Checkbox, CodeBlock
- Download (Icon), Image, Input, Popover, Textarea

### Why This Architecture?

| Pro | Con |
|-----|------|
| **Version safety** - Prevents breaking changes from upstream | **Brittleness** - Apps SDK changes break everything |
| **Consistent API** - Single source of truth for components | **No customization** - Can't modify component behavior |
| **Small codebase** - Don't maintain 1000s of lines of component code | **Opaque** - Can't see how components work internally |

### Component Distribution

The `dist/src/components/ui/` files are the **built wrapper code**, not source. When you import:

```tsx
import { Button } from '@design-studio/ui/base';
```

You're getting:
1. Wrapper function from `src/integrations/apps-sdk-wrapper/index.ts`
2. Which wraps `@openai/apps-sdk-ui/components/Button`
3. After build, this becomes `dist/base.js`

### Customizing Components

**Option 1: Style via className/props**
```tsx
<Button className="custom-class" variant="secondary" />
```

**Option 2: Fork Apps SDK UI**
- Fork `@openai/apps-sdk-ui` locally
- Update import in wrapper
- Maintain your fork

**Option 3: Build new components**
- Create components directly in your app
- Use design tokens for consistency

### Category Mappings

| Export Path | Source | Components |
|-------------|---------|-------------|
| `./base` | apps-sdk-wrapper + Radix direct | Button, Input, Checkbox, Switch, etc. |
| `./forms` | apps-sdk-wrapper | Form, DatePicker, Combobox, TagInput |
| `./chat` | Local source | Message, MessageActions, etc. |
| `./overlays` | Radix direct + wrapper | Modal, Dialog, Popover, Tooltip, Sheet, Drawer |
| `./navigation` | Radix direct + local | Tabs, Sidebar, Breadcrumb, Pagination, etc. |
| `./feedback` | apps-sdk-wrapper + Sonner | Toast, AlertDialog, ErrorBoundary |
| `./data-display` | Local + wrapper | Card, Chart, CodeBlock, Markdown, Image |
| `./layout` | Local + Radix | Container, Grid, Stack, Transition |

### Key Insight

**Most components are maintained by OpenAI**, not this design system. This design system provides:
1. **Icon consolidation** (286 icons in one place)
2. **Version safety checks** (prevents breaking changes)
3. **Re-exports** (organized import paths)
4. **Design tokens** (consistent theming)

**This is a strategic choice** for stability, not a missing source issue.
