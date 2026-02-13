# Design Foundations

Core design tokens and visual foundations for the design system.

---

## Foundations

- **[Colors](./COLORS.md)** - Color palette for light/dark modes, semantic tokens
- **[Spacing](./SPACING.md)** - Spacing scale for consistent gaps and padding
- **[Typography](./TYPOGRAPHY.md)** - Font sizes, weights, line heights
- [Shadows](./SHADOWS.md) - Elevation and depth
- [Radius](./RADIUS.md) - Border radius values
- [Sizes](./SIZES.md) - Component size scales

---

## Usage Patterns

### CSS Variables

All tokens are available as CSS custom properties:

```css
:root {
  /* Colors */
  --background-primary: #FFFFFF;
  --text-primary: #0D0D0D;
  
  /* Spacing */
  --spacing-4: 16px;
  
  /* Typography */
  --text-base: 16px;
  --font-normal: 400;
}
```

### Tailwind Integration

Tokens are integrated into Tailwind preset:

```tsx
// Colors
<div className="bg-background-primary text-text-primary">

// Spacing
<div className="p-4 m-2 gap-3">

// Typography
<h1 className="text-2xl font-bold leading-tight">
```

### TypeScript

```ts
import { colorTokens, spacingTokens, typeTokens } from '@design-studio/tokens';

const primaryBg = colorTokens.background.light.primary;
const comfortableSpacing = spacingTokens[4];
```

---

## Theme Switching

Light/dark mode tokens are grouped for easy theming:

```tsx
import { useTheme } from 'next-themes';

function Component() {
  const { theme } = useTheme();
  return (
    <div className={theme === 'dark' ? 'dark' : 'light'}>
      {/* Tokens automatically swap based on theme class */}
    </div>
  );
}
```
