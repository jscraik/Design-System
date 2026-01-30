# xKit Code Snippets - Extractable Patterns for aStudio

**Date:** 2026-01-30
**Source:** /Users/jamiecraik/dev/xKit/artifacts/

---

## Summary

This document extracts reusable patterns from CSS/animation experts on X (Twitter) that could be integrated into the `@design-studio/effects` and `@design-studio/ui` packages.

---

## 1. @jh3yy - CSS Animation & Scroll-Driven Patterns

### Scroll-Driven TOC Marker
```css
.toc {
  scroll-target-group: auto;
}
a:target-current {
  anchor-name: --active;
}
.toc::after {
  position-anchor: --active;
  top: anchor(top);
}
```
**Use Case:** Table of contents highlighting, scroll-linked indicators
**Package:** `@design-studio/effects`

### Animation with Timeline
```css
/* Uses animation-timeline with CSS scroll-driven animation */
/* Scales active indicator based on scroll position */
```
**Use Case:** Scroll-linked animations, reading progress indicators

### Liquid Glass Effect
```css
/* CSS + SVG combination for glass morphism */
```
**Use Case:** Glass morphism backgrounds, frosted glass panels

### Gooey Filter with Range Input
```css
input[type=range] {
  /* Controls SVG with gooey filter */
}
```
**Use Case:** Interactive sliders, liquid deformation effects

### View Transitions
```css
/* View transitions API for smooth page transitions */
```
**Use Case:** Page transitions, SPA navigation effects

### Quantity Picker with Invalid State
```css
quantity-picker:has(input:invalid):not(:focus-within) {
  background: hsl(0 100% 50% / 0.14);
}
```
**Use Case:** Form validation states, error indicators

### Collapsible Grid Rows
```css
li > div[inert] {
  grid-template-rows: 0fr;
}
```
**Use Case:** Accordion collapse, collapsible content

---

## 2. @emilkowalski - Animation Best Practices

### Hover State Anti-Flicker Pattern
```text
"The fix is to separate the trigger from the effect.
Listen for hovers on the parent, but animate a child element instead."
```
**Implementation:**
```css
.parent:hover .child {
  /* Animate child, not parent */
}
```
**Use Case:** Buttons, cards with hover effects

### Animation Patterns
- `scale(0)` - Initial hidden state
- `scale(0.93)` - Subtle press effect
- `rotateX()` - 3D flip animations

**Use Case:** Button press states, card flip effects, 3D transforms

---

## 3. @kubadesign - UI/UX Design Patterns

### Component Design Patterns
- Observer patterns for reactive features
- Grainy aesthetic overlays
- Video-first design with smooth transitions

**Note:** Most valuable content is in image form requiring vision analysis

---

## Recommended Integration Points

### For `@design-studio/effects`

| Pattern | Priority | Component |
|---------|----------|-----------|
| Scroll-driven animations | High | `ScrollProgress`, `ScrollTrigger` |
| TOC marker pattern | Medium | `TableOfContents` indicator |
| Liquid glass | Medium | `GlassPanel` |
| Gooey effects | Low | `LiquidDeformation` |
| View transitions | High | `PageTransition` |

### For `@design-studio/ui`

| Pattern | Priority | Component |
|---------|----------|-----------|
| Hover anti-flicker | Critical | All interactive components |
| Form validation states | High | `Input`, `Select`, forms |
| Collapsible grids | Medium | `Accordion`, `Collapsible` |

---

## Implementation Notes

1. **CSS Anchor Positioning** - Modern alternative to JavaScript-based positioning
2. **`scroll-target-group`** - Native scroll-linked animations without JS
3. **`:has()` selector** - Powerful parent selection for validation states
4. **`transition-behavior: allow-discrete`** - Enables transitions on discrete properties
5. **View Transitions API** - Browser-native page transitions

---

## Next Steps

1. [ ] Analyze kubadesign images for UI patterns
2. [ ] Create Storybook stories for scroll-driven animations
3. [ ] Add hover anti-flicker pattern to base components
4. [ ] Implement TOC marker pattern
5. [ ] Experiment with liquid glass effect

---

## References

- **@jh3yy:** https://x.com/jh3yy - CSS animation expert
- **@emilkowalski:** https://x.com/emilkowalski - Animation best practices
- **@kubadesign:** https://x.com/kubadesign - UI/UX design patterns
