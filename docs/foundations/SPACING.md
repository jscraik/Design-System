# Spacing Tokens

Consistent spacing scale for margins, padding, and gaps.

---

## Spacing Scale

| Token | Value | Usage |
|--------|-------|--------|
| `--spacing-0` | 0px | None |
| `--spacing-1` | 4px | Tight |
| `--spacing-2` | 8px | Compact |
| `--spacing-3` | 12px | Comfortable |
| `--spacing-4` | 16px | Spacious |
| `--spacing-5` | 20px | Extra spacious |
| `--spacing-6` | 24px | Section gaps |
| `--spacing-8` | 32px | Large sections |
| `--spacing-10` | 40px | Page margins |
| `--spacing-12` | 48px | Extra large |

---

## Visual Examples

### Text Spacing
```tsx
// Tight
<p className="mb-2">Compact paragraph</p>

// Comfortable
<p className="mb-4">Normal paragraph</p>

// Spacious
<p className="mb-6">Loose paragraph</p>
```

### Component Padding
```tsx
// Compact button
<Button className="px-3 py-2">Compact</Button>

// Normal button
<Button className="px-4 py-3">Normal</Button>

// Spacious button
<Button className="px-6 py-4">Large</Button>
```

### Stack/Gap Spacing
```tsx
// Using Stack component with gap
<Stack gap={4}>  // 16px gap
  <div>Item 1</div>
  <div>Item 2</div>
</Stack>
```

---

## Tailwind Classes

```tsx
// p/m = padding horizontal/vertical
// mx/my = margin horizontal/vertical
// gap = flex/grid gap

<div className="p-4">        // padding: 16px
<div className="mx-2">       // margin-x: 8px
<div className="gap-3">       // gap: 12px
```

---

## CSS Variables

```css
.tight { margin-bottom: var(--spacing-2); }
.normal { margin-bottom: var(--spacing-4); }
.spacious { margin-bottom: var(--spacing-6); }
```
