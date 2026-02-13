# Component Overview

Use `@design-studio/ui` for Apps SDK UI-first React components. The package mirrors the `@design-studio/ui` surface area and exposes:

- Core primitives: buttons, text, badges, cards, separators, stacks
- Navigation: tabs, menus, breadcrumbs
- Feedback: alerts, toast, loading
- Forms: inputs, selects, checkboxes, toggles
- Chat templates: chat views, headers, compose surfaces

## Usage

```tsx
import { Button, Stack, Text } from "@design-studio/ui";

export function Example() {
  return (
    <Stack gap="md">
      <Text>Use Apps SDK UI components first.</Text>
      <Button variant="primary">Get started</Button>
    </Stack>
  );
}
```

## Notes

- Components are designed for React 18+ and Vite.
- Do not re-implement components unless the system lacks coverage.
