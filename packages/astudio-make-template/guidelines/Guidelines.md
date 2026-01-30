# aStudio Design System Guidelines

This design system provides tokens, components, and icons for building ChatGPT-native experiences in Figma Make.

## Quick Start

```tsx
import { Stack, Text } from "@design-studio/ui";
import { Icon } from "@design-studio/icons";
import "@design-studio/tokens/tokens.css";

export function Example() {
  return (
    <Stack gap="md">
      <Text>Welcome to aStudio</Text>
      <Icon name="sparkles" size={16} />
    </Stack>
  );
}
```

## Principles

1. Apps SDK UI first: prefer `@design-studio/ui` components over custom primitives.
2. Semantic tokens only: use `@design-studio/tokens` values or CSS variables, never hardcoded colors.
3. Accessibility: components are built for WCAG 2.2 AA; preserve labels and keyboard support.
4. Theme support: light/dark and high-contrast modes are supported by tokens.

## See also

- [Component overview](./overview-components.md)
- [Icon overview](./overview-icons.md)
- [Design tokens](./design-tokens/)
