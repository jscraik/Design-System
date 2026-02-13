# StatefulComponentProps - Developer Guide

**Version:** 1.0.0
**Last Updated:** 2026-01-28

## Overview

`StatefulComponentProps` is a unified interface for component state management across the AStudio UI library. It provides consistent state handling for loading, error, disabled, and required states.

## State Priority

The state system follows a strict priority order:

```
loading > error > disabled > default
```

### State Definitions

| State | Priority | Description | Visual Indicators |
|-------|----------|-------------|-------------------|
| **loading** | 1 (highest) | Component is processing data | `animate-pulse`, reduced opacity |
| **error** | 2 | Component has an error | Red ring (`ring-foundation-accent-red/50`) |
| **disabled** | 3 | Component is disabled | `opacity-50`, `pointer-events-none` |
| **default** | 4 (lowest) | Component is in normal state | Default styling |

### State Transition Examples

```typescript
// Example 1: Loading takes priority
<Component loading={true} error="Failed" disabled={true} />
// Result: Shows loading state (pulse animation)

// Example 2: Error overrides disabled
<Component loading={false} error="Failed" disabled={true} />
// Result: Shows error state (red ring)

// Example 3: Disabled is lowest priority before default
<Component error={undefined} disabled={true} loading={false} />
// Result: Shows disabled state (reduced opacity)
```

## Props Interface

```typescript
interface StatefulComponentProps {
  /** Shows loading state with visual feedback */
  loading?: boolean;

  /** Error message to display */
  error?: string;

  /** Disables all interaction */
  disabled?: boolean;

  /** Marks field as required */
  required?: boolean;

  /** Callback when component state changes */
  onStateChange?: (state: ComponentState) => void;
}

type ComponentState =
  | "default"
  | "loading"
  | "error"
  | "disabled"
  | "checked"
  | "unchecked"
  | "indeterminate";
```

## Implementation Pattern

### Standard Component Implementation

```typescript
import * as React from "react";
import type { StatefulComponentProps, ComponentState } from "@design-studio/tokens";

interface MyComponentProps extends StatefulComponentProps {
  // ... your component-specific props
}

function MyComponent({
  loading = false,
  error,
  disabled = false,
  required,
  onStateChange,
  ...props
}: MyComponentProps) {
  // 1. Determine effective state (priority: loading > error > disabled > default)
  const effectiveState: ComponentState = loading
    ? "loading"
    : error
      ? "error"
      : disabled
        ? "disabled"
        : "default";

  // 2. Notify parent of state changes
  React.useEffect(() => {
    onStateChange?.(effectiveState);
  }, [effectiveState, onStateChange]);

  // 3. Effective disabled state (disabled if explicitly disabled OR loading)
  const isDisabled = disabled || loading;

  // 4. Render with data attributes and ARIA attributes
  return (
    <div
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
      aria-disabled={isDisabled || undefined}
      aria-invalid={error ? "true" : required ? "false" : undefined}
      aria-required={required || undefined}
      aria-busy={loading || undefined}
      tabIndex={isDisabled ? -1 : undefined}
      className={cn(
        "base-classes",
        isDisabled && "opacity-50 pointer-events-none",
        error && "ring-2 ring-foundation-accent-red/50",
        loading && "animate-pulse",
      )}
    >
      {/* component content */}
    </div>
  );
}
```

## Data Attributes

The following `data-*` attributes are automatically applied for styling hooks:

| Attribute | Values | Purpose |
|-----------|--------|---------|
| `data-state` | `"loading" \| "error" \| "disabled" \| "default"` | CSS styling hook |
| `data-error` | `"true"` or omitted | Error state indicator |
| `data-required` | `"true"` or omitted | Required field indicator |

## ARIA Attributes

The following ARIA attributes are automatically applied for accessibility:

| Attribute | Values | Purpose |
|-----------|--------|---------|
| `aria-disabled` | `"true"` or omitted | Indicates component is disabled |
| `aria-invalid` | `"true"`, `"false"`, or omitted | Indicates validation state |
| `aria-required` | `"true"` or omitted | Indicates field is required |
| `aria-busy` | `"true"` or omitted | Indicates loading state |
| `tabIndex` | `-1` (when disabled) or omitted | Prevents keyboard focus when disabled |

## Best Practices

### DO ✅

- **Always determine `effectiveState`** using the priority pattern
- **Use `isDisabled`** for internal logic: `const isDisabled = disabled || loading`
- **Apply `tabIndex={-1}`** when component is disabled
- **Call `onStateChange`** in a `useEffect` with proper dependencies
- **Provide visual feedback** for all states (loading, error, disabled)

### DON'T ❌

- **Don't** skip the state priority logic - always use the ternary chain
- **Don't** use `disabled` directly in conditional logic - use `isDisabled`
- **Don't** add `loading` as a permanent state - it should be temporary
- **Don't** call `onStateChange` synchronously during render
- **Don't** override `data-state` with Radix's open/closed state (see Toast component)

## Edge Cases

### Conflicting States

When multiple state props are `true`, the priority determines behavior:

```typescript
// Multiple states true - loading wins
<Component loading={true} error="Failed" disabled={true} />
// effectiveState = "loading" ✅

// Error and disabled - error wins
<Component loading={false} error="Failed" disabled={true} />
// effectiveState = "error" ✅

// Only disabled - disabled state
<Component disabled={true} />
// effectiveState = "disabled" ✅
```

### Native Attribute Collisions

Some HTML elements have native attributes that conflict with `StatefulComponentProps`:

**Example: `<img>` loading attribute**

```typescript
// ❌ DON'T - Direct extension causes type error
export interface ImageProps extends ImgHTMLAttributes, StatefulComponentProps {}

// ✅ DO - Omit conflicting attribute
export interface ImageProps extends Omit<ImgHTMLAttributes, "loading">, StatefulComponentProps {}
```

Components affected:
- `Image` - HTML `loading` attribute is `"eager" | "lazy"`, our prop is `boolean`

## Component-Specific Patterns

### Toast (Special Case)

Toast already uses `data-state` for Radix's animation system (open/closed), so it doesn't set `data-state` for StatefulComponentProps. Instead, it applies visual feedback directly via className:

```typescript
<Toast
  // No data-state for StatefulComponentProps (would conflict with Radix)
  className={cn(toastVariants({ variant }), isDisabled && "opacity-50", error && "ring-2 ring-foundation-accent-red/50")}
/>
```

### Form Inputs

Form inputs should use `tabIndex` to prevent keyboard focus during disabled state:

```typescript
<input
  disabled={isDisabled}
  tabIndex={isDisabled ? -1 : undefined}
  // ... other props
/>
```

### Compound Components

Compound components (like Button) should apply `tabIndex` and `aria-disabled` to wrapper elements:

```typescript
// Compound container
<div
  tabIndex={isDisabled ? -1 : undefined}
  aria-disabled={isDisabled || undefined}
  className={cn(isDisabled && "opacity-50")}
>
  {children}
</div>
```

## Migration Checklist

When migrating a component to `StatefulComponentProps`, ensure:

- [ ] Added `StatefulComponentProps` to props interface
- [ ] Implemented state priority logic
- [ ] Added `useEffect` for `onStateChange` with correct dependencies
- [ ] Created `isDisabled` derived state
- [ ] Applied `data-state`, `data-error`, `data-required` attributes
- [ ] Applied ARIA attributes (`aria-disabled`, `aria-invalid`, `aria-required`, `aria-busy`)
- [ ] Added `tabIndex={isDisabled ? -1 : undefined}` for keyboard accessibility
- [ ] Added visual feedback classes (opacity, ring, pulse)
- [ ] Tested all state transitions
- [ ] Updated JSDoc comments with stateful examples

## Related Documentation

- [Phase 3 Migration Plan](../.spec/phase-3-component-migration.md)
- [Adversarial Review](./phase-3-adversarial-review.md)
- [Design Tokens Specification](../../packages/tokens/docs/)
