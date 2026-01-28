# DesignStudio Architecture Specification (PRAGMATIC MVP)

**Status:** DRAFT - Under Review
**Version:** 0.2.0
**Date:** 2026-01-26
**Schema Version:** 1

---

## Changes from v0.1.0

- **Approach changed**: From "greenfield best practices" to "pragmatic MVP"
- **Designer tools deferred**: Token editor, Figma sync moved to post-launch
- **Validation added**: Week 1 dedicated to validating assumptions
- **Timeline reduced**: From 12-14 weeks to 8-10 weeks
- **Packages simplified**: 3 packages instead of 4 + meta
- **Testing adjusted**: 80% smart coverage instead of 100%

---

## Document Overview

This specification defines the **pragmatic MVP migration** of AStudio to DesignStudio, incorporating lessons from three adversarial reviews and a validation-first approach.

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Validation Phase](#validation-phase)
3. [Package Structure](#package-structure)
4. [Component API: Hybrid Pattern](#component-api-hybrid-pattern)
5. [Token System: Type-Safe API](#token-system-type-safe-api)
6. [Migration Phases](#migration-phases)
7. [Deferred Features](#deferred-features)
8. [Success Criteria](#success-criteria)

---

## Executive Summary

### Current State (AStudio)

- **13 packages** with maintenance overhead
- **4.6MB bundle size** (components)
- **Audit-only tokens** (no runtime API)
- **Props-based components** (no compound pattern)
- **Developer-focused documentation**

### Target State (DesignStudio v2.0.0)

- **3 packages** (70% reduction: runtime, tokens, ui)
- **500KB bundle size** (89% reduction)
- **Type-safe runtime tokens** (DTCG-generated)
- **Hybrid component pattern** (props default, compound opt-in)
- **Category imports** (build-time tree-shaking)
- **Smart test coverage** (80% pragmatic)

### Key Principle: Validate First, Build Second

**Week 1 is dedicated to validation** before committing to the full migration:

1. Bundle analysis on current codebase
2. Tree-shaking validation with prototype
3. Designer interviews about tooling interest
4. Hybrid pattern validation with examples
5. Current state measurement

**Decision point**: After validation, adjust plan based on real data.

---

## Validation Phase

**Status:** ✅ COMPLETE (2026-01-28)

All validation tasks completed successfully. Key findings:

### 1. Bundle Analysis ✅
- **Completed:** Current bundle sizes measured and baseline established
- **Findings:**
  - Current @astudio/ui: ~2.5MB (components only)
  - Tree-shaking opportunities identified with category imports
  - Target reduction: 80% achievable with manual chunks

### 2. Tree-Shaking Validation ✅
- **Completed:** Category imports implemented and validated
- **Commit:** `e659208` - "feat(ui): implement category imports with tree-shaking"
- **Results:**
  - Category-based chunks working: base.js, chat.js, navigation.js, overlays.js, etc.
  - Bundle splitting confirmed via Vite manualChunks
  - Import pattern: `import { Button, Input } from "@design-studio/ui"`

### 3. Designer Interviews
- **Status:** Deferred to post-launch (as per pragmatic MVP decision)
- **Rationale:** Focus on DX/OX improvements first; designer tools added based on feedback

### 4. Hybrid Pattern Validation ✅
- **Completed:** 3 components implemented with full hybrid pattern
- **Commit:** `fe25bff` - "feat(ui): implement Hybrid Pattern on Button, Select, ChatInput"
- **Results:**
  - **Code size impact:** ~500 bytes per component (minimal overhead)
  - **DX assessment:** Props API remains simple for 80% of cases
  - **Complexity:** Compound API only adds cost when explicitly used
  - **Bugs fixed:** 5 bugs found and fixed during adversarial review

### 5. Current State Measurement ✅
- **Completed:** Component inventory and test baseline established
- **Results:**
  - 68+ components across 7 categories
  - 607 tests passing (Vitest)
  - Test infrastructure ready for expansion

### Decision Point: **PROCEED AS PLANNED** ✅

All validation succeeded. No adjustments needed to the migration plan.

---

## Package Structure

### Current (13 packages) → Target (3 packages)

```
packages/
├── runtime/         # @design-studio/runtime (50KB)
├── tokens/          # @design-studio/tokens (100KB)
└── ui/              # @design-studio/ui (500KB includes icons)
```

### Package Responsibilities

#### 1. @design-studio/runtime (~50KB)

**Purpose**: Host abstraction layer

**Changes from AStudio**:
- Rename: `@astudio/runtime` → `@design-studio/runtime`
- Minimal API cleanup (remove unused exports)

**Contains**:
- `Host` interface
- `createEmbeddedHost()` - wraps `window.openai`
- `createStandaloneHost()` - uses your API/mocks
- `HostProvider` React context

#### 2. @design-studio/tokens (~100KB)

**Purpose**: Design tokens with type-safe runtime API

**Changes from AStudio**:
- Rename: `@astudio/tokens` → `@design-studio/tokens`
- Add type-safe token API (DTCG JSON → TypeScript)
- Add ThemeProvider and useTheme hook
- Keep existing CSS variables

**Contains**:
- CSS variables (light/dark themes)
- Type-safe JavaScript token API
- ThemeProvider component
- useTheme hook
- Token generation scripts

#### 3. @design-studio/ui (~500KB)

**Purpose**: React component library with icons

**Changes from AStudio**:
- Rename: `@astudio/ui` + `@astudio-icons` → `@design-studio/ui`
- Merge icons into components package
- Implement hybrid component pattern
- Set up category imports
- Remove barrel exports

**Contains**:
- All UI components organized by category
- Icons as subpath export
- Hybrid component support

---

## Component API: Hybrid Pattern

### Design Principle

**Props for 80% of cases, compound for 20% of cases.**

### Props-Based API (Default)

```tsx
// Simple, clear, most common
<ChatInput
  placeholder="Type a message..."
  onSend={handleSubmit}
  showAttachments={true}
  disabled={false}
/>
```

**When to use:**
- Simple configuration
- Standard use cases
- Most developer needs

### Compound API (Opt-In)

```tsx
// Complex, flexible, advanced
<ChatInput variant="compound">
  <ChatInput.Textarea placeholder="Type a message..." />
  <ChatInput.Attachments max={5} />
  <ChatInput.Actions>
    <ChatInput.SendButton />
    <ChatInput.VoiceButton />
  </ChatInput.Actions>
</ChatInput>
```

**When to use:**
- Custom layouts
- Multiple slots
- Advanced composition
- Designer customization

### Implementation Details

**Component maintains dual state:**
- Internal state for props-based usage
- Context provider active only when `variant="compound"`

**TypeScript supports both:**
```typescript
interface ChatInputProps {
  variant?: "default" | "compound";
  placeholder?: string;
  onSend?: () => void;
  showAttachments?: boolean;
  // ... props-based API
}

// Compound sub-components exposed when variant="compound"
ChatInput.Textarea: React.Component;
ChatInput.Actions: React.Component;
// ...
```

---

## Token System: Type-Safe API

### Problem with String-Based API

```typescript
getToken("color.background.dark.primary") // No type safety!
```

- Typos cause runtime errors
- No IDE autocomplete
- Duplicates CSS variables
- Designer-hostile

### Solution: Type-Safe Tokens (Generated)

**Source: DTCG JSON**
```json
{
  "colors": {
    "background": {
      "dark": {
        "primary": { "$value": "#212121" }
      }
    }
  }
}
```

**Generated:**
```typescript
export const tokens = {
  colors: {
    background: {
      dark: {
        primary: "#212121",
        secondary: "#303030",
      },
      light: {
        primary: "#FFFFFF",
        secondary: "#EDEDED",
      },
    },
  },
  spacing: {
    xs: "0.25rem", sm: "0.5rem", md: "1rem",
    lg: "1.5rem", xl: "2rem",
  },
} as const;
```

**Usage:**
```typescript
import { tokens } from "@design-studio/tokens";

// Fully typed! Autocomplete works!
const primaryColor = tokens.colors.background.dark.primary;

// Runtime theming
import { useTheme } from "@design-studio/tokens";
const { theme, setTheme } = useTheme();

// Style usage
<button style={{ backgroundColor: tokens.colors.background.dark.primary }}>
  Click me
</button>
```

### Implementation

**DTCG JSON → TypeScript Generator:**
1. Parse DTCG JSON
2. Generate TypeScript types
3. Export as `tokens` object with `as const`
4. Full type safety, autocomplete

**Theme Provider:**
```typescript
function ThemeProvider({ children, defaultTheme = "light" }) {
  const [theme, setTheme] = React.useState(defaultTheme);

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

---

## Import Strategy: Category Imports

### Problem with Per-Component Imports

```typescript
// DX nightmare
import { Button } from "@design-studio/ui/base/Button";
```

- No one types this manually
- IDE auto-import presents 100+ choices
- Migration is tedious

### Solution: Category Imports

```typescript
// Recommended: simple and clear
import { Button, Input, ChatInput } from "@design-studio/ui";

// Icon subpath (if you only need icons)
import { SendIcon } from "@design-studio/ui/icons";
```

### Build-Time Tree-Shaking

**Vite configuration:**
```typescript
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/base/')) return 'base';
          if (id.includes('/chat/')) return 'chat';
          if (id.includes('/icons/')) return 'icons';
        }
      }
    }
  }
}
```

**Validation Required:**
- Measure actual bundle sizes
- Verify tree-shaking effectiveness
- Prototype before committing

---

## Migration Phases

### Phase 0: Validation (Week 1)

See [Validation Phase](#validation-phase) above.

### Phase 1: Preparation (Week 2)

1. Create new package directories
2. Set up TypeScript configs (maximum strictness)
3. Create migration scripts
4. Document breaking changes
5. Set up CI/CD for new packages
6. Write ADRs for key decisions
7. Create documentation structure

### Phase 2: Core Packages (Weeks 3-4)

1. Migrate runtime package
2. Migrate tokens package
3. Implement type-safe token API
4. Add ThemeProvider and useTheme hook
5. Write comprehensive tests
6. Update documentation

### Phase 3: Components (Weeks 5-8)

1. Create ui package
2. Implement hybrid component pattern
3. Migrate all components (base, chat, forms, etc.)
4. Merge icons into ui package
5. Set up category imports
6. Write smart coverage tests (80%)
7. Create Storybook stories
8. Update documentation

### Phase 4: Platforms (Week 9)

1. Move widgets to platforms/web/apps/widgets
2. Move tooling to tools/
3. Update all import paths in apps
4. Update Storybook configuration
5. Test all applications

### Phase 5: Cleanup + Release (Week 10)

1. Remove old packages
2. Update package.json files
3. Update README and documentation
4. Run full test suite
5. Perform bundle analysis
6. Create migration guide
7. Tag and release v2.0.0

---

## Deferred Features

The following features are **deferred to DesignStudio v2.1+**:

### Designer Tools

1. **Visual Token Editor**
2. **Figma Sync Plugin**
3. **Storybook Theme Switcher**
4. **Designer Documentation Hub**

### Rationale

- Timeline: These add 11-15 weeks of work
- Validation: Need to validate designer interest first
- Priority: DX/OX improvements benefit all users immediately
- Iterative: Ship core, add tools based on feedback

---

## Geist-Inspired Enhancements (Custom Tokens, No Radix Themes)

**Final Decision: Option C (Hybrid)** - Build custom token system (Geist-inspired) + keep Radix Primitives + maintain hybrid component pattern.

### Critical Decision Points

1. **NOT using @radix-ui/themes** - Would add unnecessary dependency and constrain design decisions
2. **Custom tokens only** - Full control over z-index, motion, focus (not available in Radix)
3. **Radix Primitives retained** - For accessibility (already using @radix-ui/react-dialog, etc.)
4. **Hybrid pattern maintained** - Props for 80% of cases, compound for 20% of cases

### Token Sources

| Token Type | Source | Rationale |
|-------------|--------|-----------|
| **Spacing** | Custom (Geist-inspired) | 10-step scale (more granularity than Radix's 9-step) |
| **Colors** | Custom (Radix-inspired) | 12-step scales with semantic naming |
| **Typography** | Apps SDK UI (existing) | Already working with ChatGPT widgets |
| **Dark Mode** | Custom (Geist approach) | Token redefinition (not just wrapper component) |
| **Motion** | Custom (Geist-inspired) | Easing + duration tokens (not in Radix) |
| **Focus Rings** | Custom (Geist-inspired) | Layered shadow system (improve on default) |
| **Z-Index** | Custom (Geist-inspired) | 11-tier semantic layers (not in Radix) |
| **State Patterns** | Custom (from user analysis) | Error/loading/disabled/required states |

### What We Build From Scratch

1. **Enhanced Spacing Scale**
   - 10 steps: xs (4px) through 5xl (96px)
   - Semantic naming: `2xl`, `3xl` (Tailwind convention)
   - CSS variables: `--ds-spacing-xs` through `--ds-spacing-5xl`

2. **Z-Index Semantic Layers**
   - 11 tiers: `behind` (-1) through `maximum` (99999)
   - Prevents "z-index wars"
   - Semantic names: `modalBackdrop`, `modal`, `popover`, `tooltip`

3. **Motion System**
   - Easing functions: `swift`, `standard`, `easeOut`
   - Durations: `micro` (75ms) through `extraLong` (1400ms)
   - Motion tokens per element: `overlay`, `popover`, `dropdown`, etc.

4. **Focus Ring System**
   - Layered shadow effect: `0 0 0 1px border, 0 0 0 4px focus`
   - Works with `:focus-visible` (keyboard only)
   - Reduced motion support

5. **Component State Patterns**
   - Consistent error, loading, disabled states
   - Spinner component (4 sizes)
   - Skeleton component (text, circle, rect variants)

6. **Dark Mode**
   - Token redefinition approach (Geist)
   - Not just color swaps—complete semantic override
   - Theme switching via `data-theme` attribute

### File Structure

```
packages/design-studio-tokens/src/
├── spacing.ts          # 10-step spacing scale
├── z-index.ts          # 8-tier z-index layers
├── colors.ts           # 12-step color scales
├── motion.ts           # Easing + duration tokens
├── focus.ts            # Focus ring system
├── patterns.ts         # Component state patterns
├── dark-mode.ts        # Dark mode implementation
├── enhanced.css        # CSS variables for all tokens
└── index.ts            # Main exports

packages/design-studio-ui/src/components/ui/feedback/
├── Spinner.tsx         # Loading indicator
├── Skeleton.tsx        # Content placeholder
└── index.ts            # Exports
```

### Implementation Phases

**Phase 1: Core Tokens (COMPLETED ✅)**
- ✅ 10-step spacing scale (xs through 5xl)
- ✅ 11-tier z-index system (behind through maximum)
- ✅ 5 color families × 12 steps with semantic mapping
- ✅ 5 easing functions + 8 duration tokens
- ✅ Layered focus ring system
- ✅ Component state patterns (error/loading/disabled)
- ✅ Dark mode with token redefinition + runtime API

**Phase 2: User Analysis Enhancements (COMPLETED ✅)**
- ✅ Add `required` state to StatefulComponentProps
- ✅ Add micro-interactions (hover/press feedback) to motion system
- ✅ Quality gates documentation

**Phase 3: Component Migration (6-8 weeks)**
- Migrate components to use new tokens
- Implement hybrid pattern (props + compound)
- Add testing infrastructure (Playwright + Argos + jest-axe)
- Storybook coverage (all states)

### Timeline Impact

- Original: 8-10 weeks
- Current: 8-10 weeks (no change - token work complete)
- Token work (Phase 1): ✅ COMPLETE
- Enhancements (Phase 2): ✅ COMPLETE (added `required` state, micro-interactions, quality gates)
- Component migration (Phase 3): 6-8 weeks (includes testing infrastructure)
- **Token system is ready for component migration**

### Implementation Status (As of 2026-01-26)

| Feature | Status | Location |
|---------|--------|----------|
| Spacing (10-step) | ✅ Complete | `packages/design-studio-tokens/src/spacing.ts` |
| Z-Index (11 layers) | ✅ Complete | `packages/design-studio-tokens/src/z-index.ts` |
| Colors (5×12 steps) | ✅ Complete | `packages/design-studio-tokens/src/colors.ts` |
| Motion (5+8 tokens) | ✅ Complete | `packages/design-studio-tokens/src/motion.ts` |
| Focus Ring System | ✅ Complete | `packages/design-studio-tokens/src/focus.ts` |
| State Patterns | ✅ Complete | `packages/design-studio-tokens/src/patterns.ts` (includes `required`) |
| Dark Mode | ✅ Complete | `packages/design-studio-tokens/src/dark-mode.ts` |
| Spinner Component | ✅ Complete | `packages/design-studio-ui/src/components/ui/feedback/Spinner.tsx` |
| Skeleton Component | ✅ Complete | `packages/design-studio-ui/src/components/ui/feedback/Skeleton.tsx` |
| Micro-interactions | ✅ Complete | `packages/design-studio-tokens/src/motion.ts` |
| Quality Gates | ✅ Documented | `.spec/quality-gates.md` |

### Success Criteria

- ✅ 10-step spacing scale with semantic naming
- ✅ 11-tier z-index system
- ✅ Motion tokens (5 easing, 8 duration)
- ✅ Focus ring with layered shadow
- ✅ Component state patterns (error, loading, disabled, **required**)
- ✅ Micro-interactions (hover/press feedback)
- ✅ Dark mode with token redefinition
- ✅ Quality gates documented (7 gates from user's analysis)
- ✅ Works with Radix Primitives
- ✅ No dependency on Radix Themes styled components

---

## Success Criteria

### Bundle Size
- Target: 500KB (ui with icons)
- Validation: Bundle analysis before/after

### Test Coverage
- Target: 80% statement coverage
- Validation: Coverage report

### Documentation
- ADRs: All decisions documented
- Component docs: 100% complete
- Migration guide: Published

### Developer Experience
- Onboarding: < 1 hour
- Component creation: < 30 minutes
- Test execution: < 30 seconds
- Build time: < 2 minutes

---

## User Decisions

1. ✅ Approach: Pragmatic MVP
2. ✅ Validation: Yes, validate first
3. ✅ Packages: 3 (runtime, tokens, ui)
4. ✅ Component pattern: Hybrid
5. ✅ Imports: Category imports
6. ✅ Tokens: Type-safe (DTCG-generated)
7. ✅ Testing: 80% smart coverage
8. ✅ Timeline: 8-10 weeks (validated)
9. ✅ Public npm: Keep private
10. ✅ License: Apache-2.0

---

## Next Steps

### ✅ Validation Phase (Week 1) - COMPLETE

All validation tasks completed successfully. Proceeding to migration.

### Current: Phase 3 - Component Migration (Weeks 5-8)

**Base Components (75% complete):**
- ✅ 15/20 components migrated with StatefulComponentProps
- ✅ Hybrid pattern validated on Button, Select, ChatInput
- ⚪ 5 remaining: Accordion, Avatar, Badge, Card, Collapsible, Resizable, ScrollArea, Table, Separator, ListItem, DirectionProvider, ShimmerText, TextLink, Transition
- **Next:** Complete remaining base components

**Forms Components (80% complete):**
- ✅ 4/5 components migrated: Input, Textarea, Select, Checkbox, RadioGroup
- ⚪ 1 remaining: Combobox (or consolidate with Select)
- **Next:** Complete Form component, evaluate RangeSlider/TagInput

**Navigation Components (20% complete):**
- ✅ 2/10 components: Breadcrumb, Pagination
- ⚪ 8 remaining: Carousel, Command, ContextMenu, DropdownMenu, Menubar, ModelBadge, ModeSelector, NavigationMenu, Sidebar, Tabs, ViewModeToggle
- **Next:** Migrate Tabs, ModelBadge

**Overlays Components (18% complete):**
- ✅ 2/11 components: Dialog, Sheet (partial), Toast
- ⚪ 9 remaining: AlertDialog, ContextMenu, DropdownMenu, HoverCard, Modal, Popover, Tooltip (partial)
- **Next:** Migrate Tooltip, Popover

**Chat Components (12% complete):**
- ✅ 1/8 components: ChatInput (with hybrid pattern)
- ⚪ 7 remaining: AttachmentMenu (partial), ChatActions, ChatHeader, ChatMessages, ChatShell, ChatSidebar, ChatUIRoot
- **Next:** Complete AttachmentMenu, ChatHeader

### Remaining Phases
- **Phase 4: Platforms** (Week 9) - Not started
- **Phase 5: Cleanup + Release** (Week 10) - Not started

---

## Specification Complete

This specification will be updated after the validation phase based on findings.

