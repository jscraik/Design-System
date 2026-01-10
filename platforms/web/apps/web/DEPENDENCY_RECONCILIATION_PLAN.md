# Dependency Reconciliation Plan: ChatGPT UI Templates Port

## Overview

This document outlines the dependency reconciliation strategy for porting ChatGPT UI Templates into the web platform, following the Apps SDK UI-first approach.

## Dependency Analysis

### Source App Dependencies vs Platform Dependencies

| Package | Source App | Platform (@astudio/ui) | Action Required |
|---------|------------|----------------------|-----------------|
| **Radix UI Components** | ✅ Direct imports | ✅ Already included | Use platform wrappers |
| `@radix-ui/react-accordion` | ^1.2.3 | ^1.1.2 | Use platform version |
| `@radix-ui/react-alert-dialog` | ^1.1.6 | ^1.1.2 | Use platform version |
| `@radix-ui/react-aspect-ratio` | ^1.1.2 | ^1.1.0 | Use platform version |
| `@radix-ui/react-avatar` | ^1.1.3 | ^1.1.1 | Use platform version |
| `@radix-ui/react-checkbox` | ^1.1.4 | ^1.1.2 | Use platform version |
| `@radix-ui/react-collapsible` | ^1.1.3 | ^1.1.2 | Use platform version |
| `@radix-ui/react-context-menu` | ^2.2.6 | ^2.2.2 | Use platform version |
| `@radix-ui/react-dialog` | ^1.1.6 | ^1.1.2 | Use platform version |
| `@radix-ui/react-dropdown-menu` | ^2.1.6 | ^2.1.2 | Use platform version |
| `@radix-ui/react-hover-card` | ^1.1.6 | ^1.1.2 | Use platform version |
| `@radix-ui/react-label` | ^2.1.2 | ^2.1.0 | Use platform version |
| `@radix-ui/react-menubar` | ^1.1.6 | ^1.1.2 | Use platform version |
| `@radix-ui/react-navigation-menu` | ^1.2.5 | ^1.2.1 | Use platform version |
| `@radix-ui/react-popover` | ^1.1.6 | ^1.1.6 | Use platform version |
| `@radix-ui/react-progress` | ^1.1.2 | ^1.1.0 | Use platform version |
| `@radix-ui/react-radio-group` | ^1.2.3 | ^1.2.1 | Use platform version |
| `@radix-ui/react-scroll-area` | ^1.2.3 | ^1.2.1 | Use platform version |
| `@radix-ui/react-select` | ^2.1.6 | ^2.1.2 | Use platform version |
| `@radix-ui/react-separator` | ^1.1.2 | ^1.1.0 | Use platform version |
| `@radix-ui/react-slider` | ^1.2.3 | ^1.2.1 | Use platform version |
| `@radix-ui/react-slot` | ^1.1.2 | ^1.1.0 | Use platform version |
| `@radix-ui/react-switch` | ^1.1.3 | ^1.1.1 | Use platform version |
| `@radix-ui/react-tabs` | ^1.1.3 | ^1.1.1 | Use platform version |
| `@radix-ui/react-toggle` | ^1.1.2 | ^1.1.0 | Use platform version |
| `@radix-ui/react-toggle-group` | ^1.1.2 | ^1.1.0 | Use platform version |
| `@radix-ui/react-tooltip` | ^1.1.8 | ^1.1.2 | Use platform version |

### Supporting Libraries

| Package | Source App | Platform (@astudio/ui) | Action Required |
|---------|------------|----------------------|-----------------|
| `class-variance-authority` | ^0.7.1 | ^0.7.1 | ✅ Already compatible |
| `clsx` | * | ^2.1.1 | ✅ Already compatible |
| `cmdk` | ^1.1.1 | 1.1.1 | ✅ Already compatible |
| `date-fns` | * | ^4.1.0 | ✅ Already compatible |
| `embla-carousel-react` | ^8.6.0 | 8.6.0 | ✅ Already compatible |
| `input-otp` | ^1.4.2 | 1.4.2 | ✅ Already compatible |
| `lucide-react` | ^0.487.0 | ^0.487.0 | ✅ Already compatible |
| `motion` | * | ^11.0.0 | ✅ Already compatible |
| `next-themes` | ^0.4.6 | 0.4.6 | ✅ Already compatible |
| `re-resizable` | * | ^6.9.11 | ✅ Already compatible |
| `react-day-picker` | ^8.10.1 | ^9.13.0 | Use platform version (newer) |
| `react-hook-form` | ^7.55.0 | ^7.54.2 | ✅ Already compatible |
| `react-resizable-panels` | ^2.1.7 | 2.1.7 | ✅ Already compatible |
| `recharts` | ^2.15.2 | 2.15.2 | ✅ Already compatible |
| `sonner` | ^2.0.3 | 2.0.3 | ✅ Already compatible |
| `tailwind-merge` | * | ^3.2.0 | ✅ Already compatible |
| `vaul` | ^1.1.2 | ^1.1.0 | Use platform version |

### New Dependencies Needed

The following dependencies are needed in the web app but not currently present:

| Package | Version | Purpose | Justification |
|---------|---------|---------|---------------|
| None | - | - | All required dependencies already available via @astudio/ui |

## Design Token Analysis

### Token Compatibility

✅ **Excellent compatibility**: Source app tokens and platform tokens are nearly identical

- Both use the same DTCG structure
- Same color values and naming conventions
- Same spacing scale
- Same typography hierarchy

### Token Differences

| Category | Source App | Platform | Resolution |
|----------|------------|----------|------------|
| Colors | Basic set | Extended with border, additional accents | Use platform tokens (superset) |
| Typography | Web/iOS/Android variants | Web/iOS/Android + additional styles | Use platform tokens (more comprehensive) |
| Radius | Not present | Full radius scale | Use platform tokens |
| Shadows | Not present | Card, pip, pill, close shadows | Use platform tokens |
| Sizes | Not present | Control heights, hit targets | Use platform tokens |

## Implementation Strategy

### Phase 1: No Additional Dependencies Required

- All Radix UI components are already available via @astudio/ui
- All supporting libraries are already available via @astudio/ui
- Templates will import from @astudio/ui instead of direct Radix imports

### Phase 2: Component Mapping Strategy

Templates will be updated to use platform components:

```typescript
// Source app (BEFORE)
import { Button } from "@radix-ui/react-button"
import { Dialog } from "@radix-ui/react-dialog"

// Platform (AFTER)
import { Button } from "@astudio/ui/base"
import { Dialog } from "@astudio/ui/feedback"
```

### Phase 3: Token Integration Strategy

Templates will use platform tokens:

```typescript
// Source app (BEFORE)
import { colors, space } from "../design-tokens"

// Platform (AFTER)
import { tokens } from "@astudio/tokens"
// Or use CSS custom properties generated by the token system
```

## Conclusion

**No additional dependencies are required** for the web platform. The existing @astudio/ui package already includes all necessary Radix UI components and supporting libraries. The port will focus on:

1. Updating import statements to use @astudio/ui
2. Updating token usage to use @astudio/tokens
3. Ensuring Apps SDK UI components are preferred over Radix fallbacks where available

This approach maintains the Apps SDK UI-first principle while providing all necessary functionality for the template library.
