# Icon Overview

Use `@design-studio/ui/icons` for iconography. Icons are organized by category and exposed through the `Icon` component and category exports.

## Categories

- Arrows
- Interface
- Settings
- Chat and Tools
- Account and User
- Platform
- Misc

## Usage

```tsx
import { Icon } from "@design-studio/ui/icons";

export function Example() {
  return <Icon name="arrow-right" size={20} />;
}
```

## Notes

- `Icon` uses semantic names that map to SVG source files.
- Use categories for filtering or bulk exports.
