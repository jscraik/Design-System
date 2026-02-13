# @design-studio/effects

React component library featuring advanced UI effects inspired by @jh3yy's 103 UI techniques.

## Overview

This package provides accessible, performant, and visually stunning UI effect components built with:

- **React 19** - Latest React features
- **Radix UI** - Accessible primitives
- **Motion** - Smooth animations
- **CSS View Timeline** - Native scroll-driven animations

## Components

### Phase 1: Core Interactive

- **LiquidToggle** - Morphing toggle with liquid effect
- **MagneticButton** - Button with cursor-follow magnetic effect

### Phase 2: Visual Effects

- **HoloCard** - Iridescent holographic card
- **GlowText** - Multi-layer text glow effect
- **GradientText** - Smooth gradient text overlay

### Phase 3: Scroll Effects

- **StickyReveal** - Scroll-driven reveal animation

## Installation

```bash
pnpm add @design-studio/effects
```

## Usage

```tsx
import { LiquidToggle, MagneticButton } from "@design-studio/effects";
// Import styles (optional - import only what you need)
import "@design-studio/effects/styles/animations.css";
import "@design-studio/effects/styles/filters.css";
import "@design-studio/effects/styles/base.css";

function App() {
  return (
    <>
      <LiquidToggle pressed={isOn} onPressedChange={setIsOn}>
        Toggle
      </LiquidToggle>

      <MagneticButton>
        Click me
      </MagneticButton>
    </>
  );
}
```

## API Reference

### LiquidToggle

Morphing toggle with liquid SVG filter effect.

```tsx
<LiquidToggle
  pressed={isOn}
  onPressedChange={setIsOn}
  variant="default" // "default" | "outline" | "ghost"
  size="default"    // "sm" | "default" | "lg"
  liquid="subtle"   // "none" | "subtle" | "full"
  ariaLabel="Toggle"
>
  Toggle Me
</LiquidToggle>
```

### MagneticButton

Button with cursor-follow magnetic spring effect.

```tsx
<MagneticButton
  variant="default"
  size="default"
  magneticStrength={0.3} // 0-1, higher = stronger pull
  stiffness={300}         // Spring stiffness
  damping={20}            // Spring damping
  disableMagnetic={false}
  onClick={handleClick}
>
  Hover Me
</MagneticButton>
```

### HoloCard

Iridescent holographic card with 3D tilt effect.

```tsx
<HoloCard
  variant="default"      // "default" | "gradient" | "glass"
  size="default"
  colors="neon"          // "neon" | "ocean" | "sunset" | "aurora"
  tiltIntensity={0.15}   // 0-1
  hoverScale={1.02}      // Scale on hover
  disableTilt={false}
>
  Card Content
</HoloCard>
```

### GlowText

Multi-layer text glow effect.

```tsx
<GlowText
  color="#00f260"
  intensity="medium"  // "subtle" | "medium" | "intense"
  animate="pulse"     // "none" | "pulse" | "breathe"
>
  Glowing Text
</GlowText>
```

### GradientText

Animated gradient text overlay.

```tsx
<GradientText
  preset="sunset"      // "sunset" | "ocean" | "forest" | "aurora" | "fire" | "cyber"
  direction="horizontal" // "horizontal" | "vertical" | "diagonal" | "radial"
  animate="flow"       // "none" | "flow" | "shimmer"
>
  Beautiful Text
</GradientText>
```

### StickyReveal

Scroll-driven reveal animation.

```tsx
<StickyReveal
  direction="up"      // "up" | "down" | "left" | "right"
  fade="subtle"       // "none" | "subtle" | "full"
  triggerAt={0.5}     // 0-1, scroll position to trigger
  sticky={false}      // Whether element sticks after revealing
>
  Revealed Content
</StickyReveal>
```

## Hooks

### useMousePosition

Track mouse position for magnetic effects.

```tsx
const { x, y, elementX, elementY, elementRef } = useMousePosition({
  relative: true,   // Track relative to element
  throttle: 16,      // Throttle in ms
});
```

### useScrollPosition

Track scroll position and direction.

```tsx
const { scrollY, scrollX, scrollProgress, direction } = useScrollPosition({
  throttle: 16,
});
```

### useReducedMotion

Detect prefers-reduced-motion setting.

```tsx
const prefersReducedMotion = useReducedMotion();
```

## Accessibility

All components support:

- ✅ Keyboard navigation (Tab, Enter, Space, Arrow keys)
- ✅ ARIA attributes (aria-pressed, aria-checked, aria-label)
- ✅ Screen reader compatibility (NVDA, VoiceOver)
- ✅ Reduced motion support (`prefers-reduced-motion`)
- ✅ Visible focus indicators
- ✅ Semantic HTML elements

```bash
# Build
pnpm build

# Watch mode
pnpm dev

# Type check
pnpm type-check

# Tests
pnpm test
pnpm test:watch
pnpm test:coverage
```

## License

MIT
