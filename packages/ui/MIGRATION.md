# Migration Guide

Last updated: 2026-01-09

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## From Previous Versions

### Breaking Changes

#### Export Structure Changes

The library now has organized exports to prevent naming conflicts:

**Before:**

```tsx
import { Button } from "@design-studio/ui"; // Could conflict with vendor Button
```

**After:**

```tsx
// Explicit imports (recommended)
import { Button } from "@design-studio/ui/base";
import { ModelSelector } from "@design-studio/ui/navigation";

// Or use main export (all components available)
import { Button, ModelSelector } from "@design-studio/ui";
```

#### Component API Changes

##### Toggle Component

**Before:**

```tsx
<Toggle checked={value} onCheckedChange={setValue} />
```

**After:**

```tsx
<Toggle checked={value} onChange={setValue} />
```

##### IconButton Component

**Before:**

```tsx
<IconButton
  icon={<Icon />}
  variant={isActive ? "solid" : "ghost"}
  className={isActive ? "bg-blue-500" : ""}
/>
```

**After:**

```tsx
<IconButton
  icon={<Icon />}
  variant="ghost"
  active={isActive}
  activeColor="var(--foundation-accent-blue)"
/>
```

### New Features

#### Organized Component Categories

Components are now organized by category for better tree-shaking:

```tsx
// Form components
import { Button, Input, Toggle } from "@design-studio/ui/base";

// Layout components
import { Card } from "@design-studio/ui/data-display";
import { Dialog } from "@design-studio/ui/feedback";
import { Tabs } from "@design-studio/ui/navigation";

// Chat-specific components
import { ModelSelector } from "@design-studio/ui/navigation";
import { ContextTag } from "@design-studio/ui/overlays";
```

#### Enhanced Development Tools

```tsx
import { logProps, measureRender, validateProps } from "@design-studio/ui";

// Debug component props in development
const MyComponent = (props) => {
  logProps("MyComponent", props);
  validateProps("MyComponent", props, ["required", "prop"]);
  // ...
};
```

#### Theme Utilities

```tsx
import { colors, spacing, getCSSVar, setCSSVar } from "@design-studio/ui";

// Use design tokens
const styles = {
  backgroundColor: colors.bg.dark1,
  padding: spacing.md,
};

// Dynamic theme changes
setCSSVar("--foundation-accent-blue", "#0066cc");
```

### Migration Steps

1. **Update Imports**

   ```bash
   # Find and replace old imports
   find src -name "*.tsx" -exec sed -i 's/onCheckedChange/onChange/g' {} \;
   ```

2. **Update Component Props**
   - Replace `onCheckedChange` with `onChange` in Toggle components
   - Replace conditional IconButton variants with `active` prop
   - Check for any custom styling that conflicts with new variants

3. **Leverage New Features**
   - Use organized imports for better bundle size
   - Add development utilities for debugging
   - Use theme utilities for consistent styling

4. **Test Components**

   ```bash
   pnpm storybook:dev                # Visual testing
   pnpm storybook:test               # Storybook interaction tests
   pnpm -C packages/ui type-check    # TypeScript validation
   ```

### Compatibility

- **React**: 18.0.0+ or 19.0.0+
- **TypeScript**: 4.9+
- **Node**: 18+

### Support

If you encounter issues during migration:

1. Check the [Storybook documentation](http://localhost:6006) for component examples
2. Review component TypeScript interfaces for prop changes
3. Use the development utilities to debug component behavior
