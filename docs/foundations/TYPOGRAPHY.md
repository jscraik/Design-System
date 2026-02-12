# Typography Tokens

Font sizes, line heights, and font weights for consistent text hierarchy.

---

## Font Families

| Token | Value | Usage |
|--------|-------|--------|
| `--font-sans` | System sans-serif | Body text, UI elements |
| `--font-mono` | 'SF Mono', Consolas, monospace | Code, data |

---

## Font Sizes

| Token | Value | Usage |
|--------|-------|--------|
| `--text-xs` | 12px | Captions, labels |
| `--text-sm` | 14px | Secondary text, helper text |
| `--text-base` | 16px | Body text, default |
| `--text-lg` | 18px | Subheadings |
| `--text-xl` | 20px | Headings |
| `--text-2xl` | 24px | Large headings |
| `--text-3xl` | 30px | Display headings |

---

## Visual Examples

### Heading Hierarchy
```tsx
<h1 className="text-2xl font-bold">Page Title</h1>
<h2 className="text-xl font-semibold">Section Title</h2>
<h3 className="text-lg font-medium">Subsection</h3>
<p className="text-base">Body paragraph with regular text.</p>
<span className="text-sm text-secondary">Helper or caption text</span>
```

### Text Sizes Preview
| Size | Preview |
|-------|---------|
| XS (12px) | <span style="font-size:12px">Extra small text</span> |
| SM (14px) | <span style="font-size:14px">Small text</span> |
| Base (16px) | <span style="font-size:16px">Base size text</span> |
| LG (18px) | <span style="font-size:18px">Large text</span> |
| XL (20px) | <span style="font-size:20px">Extra large text</span> |

---

## Line Heights

| Token | Value | Usage |
|--------|-------|--------|
| `--leading-tight` | 1.25 | Headlines, compact text |
| `--leading-normal` | 1.5 | Body text default |
| `--leading-relaxed` | 1.75 | Comfortable reading |

---

## Font Weights

| Token | Value | Usage |
|--------|-------|--------|
| `--font-normal` | 400 | Body text |
| `--font-medium` | 500 | Emphasized text |
| `--font-semibold` | 600 | Subheadings |
| `--font-bold` | 700 | Headings, strong emphasis |

---

## Usage Examples

### Tailwind Classes
```tsx
<h1 className="text-2xl font-bold leading-tight">
  Heading
</h1>

<p className="text-base leading-normal">
  Body text with comfortable line height for reading.
</p>

<code className="text-sm font-mono">
  code@example.com
</code>
```

### CSS Variables
```css
.heading {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-tight);
}

.body {
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
}
```
