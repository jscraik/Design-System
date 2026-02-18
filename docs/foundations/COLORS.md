# Color Tokens

Visual reference for all design system color tokens.

---

## Background Colors

### Light Mode
| Token | Hex | Preview |
|--------|-----|---------|
| `--background-primary` | #FFFFFF | <div style="background:#FFFFFF;width:40px;height:40px;border:1px solid #ccc"></div> |
| `--background-secondary` | #EDEDED | <div style="background:#EDEDED;width:40px;height:40px;border:1px solid #ccc"></div> |
| `--background-tertiary` | #F3F3F3 | <div style="background:#F3F3F3;width:40px;height:40px;border:1px solid #ccc"></div> |

### Dark Mode
| Token | Hex | Preview |
|--------|-----|---------|
| `--background-primary` | #1A1A1A | <div style="background:#1A1A1A;width:40px;height:40px;border:1px solid #555"></div> |
| `--background-secondary` | #2A2A2A | <div style="background:#2A2A2A;width:40px;height:40px;border:1px solid #555"></div> |
| `--background-tertiary` | #3A3A3A | <div style="background:#3A3A3A;width:40px;height:40px;border:1px solid #555"></div> |

---

## Text Colors

### Light Mode
| Token | Hex | Preview |
|--------|-----|---------|
| `--text-primary` | #0D0D0D | <span style="color:#0D0D0D">Primary text</span> |
| `--text-secondary` | #5D5D5D | <span style="color:#5D5D5D">Secondary text</span> |
| `--text-tertiary` | #8F8F8F | <span style="color:#8F8F8F">Tertiary text</span> |

### Dark Mode
| Token | Hex | Preview |
|--------|-----|---------|
| `--text-primary` | #FFFFFF | <span style="color:#FFFFFF;background:#333">Primary text</span> |
| `--text-secondary` | #E0E0E0 | <span style="color:#E0E0E0;background:#333">Secondary text</span> |
| `--text-tertiary` | #B8B8B8 | <span style="color:#B8B8B8;background:#333">Tertiary text</span> |

---

## Icon Colors

### Light Mode
| Token | Hex | Preview |
|--------|-----|---------|
| `--icon-primary` | #0D0D0D | 🔵 |
| `--icon-accent` | #0285FF | 🔵 |
| `--icon-status-error` | #E02E2A | 🔴 |
| `--icon-status-warning` | #E25507 | 🟠 |
| `--icon-status-success` | #008635 | 🟢 |

### Dark Mode
| Token | Hex | Preview |
|--------|-----|---------|
| `--icon-primary` | #FFFFFF | ⚪ |
| `--icon-accent` | #339CFF | 🔵 |
| `--icon-status-error` | #FF8583 | 🔴 |
| `--icon-status-warning` | #FF9E6C | 🟠 |
| `--icon-status-success` | #40C977 | 🟢 |

---

## Accent Colors

| Token | Light | Dark |
|--------|--------|------|
| Gray | #8F8F8F | #AFAFAF |
| Red | #E02E2A | #FF8583 |
| Orange | #E25507 | #FF9E6C |
| Yellow | #BA8E00 | #E2B557 |
| Green | #008635 | #40C977 |
| Blue | #0285FF | #339CFF |
| Purple | #924FF7 | #B687FF |
| Pink | #E04C91 | #F878D6 |

---

## Usage

### CSS Variables
```css
.element {
  background: var(--background-primary);
  color: var(--text-primary);
}

.element-dark {
  background: var(--background-primary);
  color: var(--text-primary);
}
```

### Tailwind Classes
```tsx
<div className="bg-background-primary text-text-primary">
  Content
</div>

<button className="bg-icon-accent text-icon-inverted">
  Click me
</button>
```

### TypeScript
```ts
import { colorTokens } from '@design-studio/tokens';

const { background, text } = colorTokens;
const bgColor = background.light.primary;
```
