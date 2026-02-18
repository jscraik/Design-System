# Button Component - Pre-Migration Analysis

**Component:** Button
**Location:** `/packages/ui/src/components/ui/base/Button/fallback/Button.tsx`
**Analysis Date:** 2026-01-26
**Migration Phase:** Phase 3, Step 1 (Pre-migration Analysis)
**Status:** Analysis Complete

---

## Executive Summary

The Button component is a well-structured, Radix-powered component with comprehensive testing and Storybook coverage. It uses class-variance-authority (CVA) for variant management and follows Apps SDK UI token patterns. The component is **82 lines** with clean separation of concerns.

**Migration Complexity: Medium**

### Key Findings
- ✅ Strong foundation with CVA for variants
- ✅ Comprehensive test coverage (169 lines of tests)
- ✅ Rich Storybook documentation (276 lines)
- ⚠️ Uses custom CVA patterns (may need reconciliation with design-studio)
- ⚠️ Missing `loading` and `error` states (StatefulComponentProps)
- ⚠️ No hybrid/compound pattern support yet
- ✅ Good accessibility foundation with keyboard navigation

---

## 1. Props Inventory

### Current Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "destructive" \| "outline" \| "secondary" \| "ghost" \| "link"` | `"default"` | Visual style variant |
| `size` | `"default" \| "sm" \| "lg" \| "icon"` | `"default"` | Size variant |
| `asChild` | `boolean` | `false` | Render as child element via Radix Slot |
| `className` | `string` | `undefined` | Additional CSS classes |
| `disabled` | `boolean` | `undefined` | Native button disabled state |
| `type` | `"button" \| "submit" \| "reset"` | `undefined` | Native button type |
| `onClick` | `React.MouseEventHandler` | `undefined` | Click handler |
| `children` | `React.ReactNode` | `undefined` | Button content |
| `...props` | `React.ComponentProps<"button">` | - | All native button props (aria-*, data-*, etc.) |

### Missing Props (Target for Migration)

From `StatefulComponentProps` in design-studio:

| Prop | Type | Description |
|------|------|-------------|
| `loading` | `boolean` | Show loading state with spinner |
| `error` | `string` | Error message to display |
| `required` | `boolean` | Show required indicator (*) |
| `onStateChange` | `(state) => void` | State change callback |

### Ref Forwarding

- ✅ **Current:** Uses implicit ref forwarding via `React.ComponentProps<"button">`
- ⚠️ **Issue:** Not using `React.forwardRef` explicitly
- 🎯 **Target:** Explicit `React.forwardRef` with proper TypeScript typing

---

## 2. Variant System

### Current Variants (6)

| Variant | Purpose | Base Classes | Hover State |
|---------|---------|--------------|-------------|
| **default** | Primary action | `bg-foreground text-text-inverted` | `hover:bg-foreground/90` |
| **destructive** | Dangerous actions | `bg-foundation-accent-red text-text-inverted` | `hover:bg-foundation-accent-red/90` |
| **outline** | Secondary action with border | `border border-border-strong bg-transparent text-foreground` | `hover:bg-secondary/60` |
| **secondary** | Tertiary action | `bg-muted text-foreground` | `hover:bg-secondary/70` |
| **ghost** | Minimal action | `bg-transparent text-foreground` | `hover:bg-secondary/60 hover:text-foreground` |
| **link** | Inline link-style | `text-foundation-text-dark-primary underline decoration-foundation-accent-blue underline-offset-4` | `hover:decoration-foundation-accent-blue/70` |

### Variant Analysis

**Strengths:**
- Clear semantic naming (default, destructive, outline, secondary, ghost, link)
- Consistent hover states across all variants
- Good use of Apps SDK UI tokens (`bg-foreground`, `text-text-inverted`, etc.)
- Destructive variant has custom focus ring color

**Areas for Improvement:**
- `default` variant naming is generic (consider `primary` for clarity)
- No active/pressed state for toggle behavior
- Missing `error` variant (could be destructive with error icon)
- Focus ring colors differ between variants (inconsistent)

### CVA Configuration

```typescript
const buttonVariants = cva(
  // Base styles (common to all variants)
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-round font-foundation text-button-label font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-foundation-text-light-primary dark:focus-visible:ring-foundation-text-dark-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:focus-visible:ring-offset-background aria-invalid:ring-2 aria-invalid:ring-foundation-accent-red aria-invalid:ring-offset-2 aria-invalid:ring-offset-background",
  {
    variants: {
      variant: { /* 6 variants */ },
      size: { /* 4 sizes */ }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

---

## 3. Size System

### Current Sizes (4)

| Size | Height Classes | Padding Classes | Typography | Use Case |
|------|----------------|-----------------|-------------|----------|
| **sm** | `h-[var(--foundation-size-control-height)]` | `px-3 has-[>svg]:px-2.5` | `text-button-label-small` | Compact layouts, toolbars |
| **default** | `h-[var(--foundation-size-control-height)]` | `px-4 py-2 has-[>svg]:px-3` | `text-button-label` | Standard buttons |
| **lg** | `h-[var(--foundation-size-control-height)]` | `px-6 has-[>svg]:px-4` | `text-button-label` | Prominent CTAs |
| **icon** | `size-[var(--foundation-size-control-height)]` | (none - square) | (inherits) | Icon-only buttons |

### Token Dependencies

All sizes use `var(--foundation-size-control-height)` which resolves to `44px` from `@design-studio/tokens`.

### Size Analysis

**Strengths:**
- Consistent use of CSS custom properties for maintainability
- Smart padding adjustment when SVG icons are present (`has-[>svg]:px-*`)
- Icon size is explicitly set for icons without size classes
- Square aspect ratio for icon variant

**Areas for Improvement:**
- All sizes use the same height (44px) - only padding differs
- `sm` and `default` have same height, may cause confusion
- No `xs` size for very compact layouts
- Icon variant lacks custom padding handling

---

## 4. Dependencies

### Runtime Dependencies

| Package | Version | Purpose | Usage |
|---------|---------|---------|-------|
| `react` | `^19.0.0` | Core framework | Component definition, props, hooks |
| `@radix-ui/react-slot` | `^1.2.4` | Radix primitive | `asChild` polymorphic rendering |
| `class-variance-authority` | `^0.7.1` | Variant management | CVA for `buttonVariants` |
| `clsx` | `^2.1.1` | Class name utilities | Used by `cn()` utility |
| `tailwind-merge` | `^3.2.0` | Tailwind conflict resolution | Used by `cn()` utility |

### Internal Dependencies

| Package | Purpose | Usage |
|---------|---------|-------|
| `@design-studio/tokens` | Design tokens | `--foundation-*` CSS variables |
| `@openai/apps-sdk-ui` | UI primitives | Token classes (bg-foreground, text-text-inverted, etc.) |

### Dev Dependencies

| Package | Purpose | Usage |
|---------|---------|-------|
| `vitest` | Unit testing | Test runner |
| `@testing-library/react` | Component testing | Render, queries, user events |
| `@storybook/react-vite` | Documentation | Storybook stories |
| `typescript` | Type safety | Type definitions |

### Dependency Analysis

**Strengths:**
- Minimal runtime dependencies (all essential)
- Radix Slot for polymorphic `asChild` pattern
- CVA is lightweight and efficient
- No heavy UI framework dependencies

**Risks for Migration:**
- design-studio uses different token system (`@design-studio/tokens`)
- May need to reconcile CVA patterns between packages
- `@openai/apps-sdk-ui` token classes may not map 1:1 to design-studio tokens

---

## 5. Styling Approach

### Current Approach

**Pattern:** CVA + Tailwind Utility Classes + Apps SDK UI Tokens

**Base Styles (applied to all variants):**
```css
/* Layout */
inline-flex items-center justify-center gap-2

/* Text & Spacing */
whitespace-nowrap rounded-round font-foundation text-button-label font-medium

/* Transitions */
transition-colors

/* Disabled State */
disabled:pointer-events-none disabled:opacity-50

/* Icon Handling */
[&_svg]:pointer-events-none
[&_svg:not([class*='size-'])]:size-4
[&_svg]:shrink-0

/* Focus Ring */
outline-none
focus-visible:ring-2
focus-visible:ring-foundation-text-light-primary
dark:focus-visible:ring-foundation-text-dark-primary
focus-visible:ring-offset-2
focus-visible:ring-offset-background
dark:focus-visible:ring-offset-background

/* Invalid State */
aria-invalid:ring-2
aria-invalid:ring-foundation-accent-red
aria-invalid:ring-offset-2
aria-invalid:ring-offset-background
```

**Styling Strategy:**
1. **Layout:** Flexbox with `gap-2` for spacing between icon and text
2. **Icons:** Automatic sizing via `[&_svg]:size-4` selector
3. **Focus:** Dual-theme focus ring (light/dark modes)
4. **States:** Native disabled + ARIA invalid states
5. **Polymorphism:** Radix Slot for `asChild` pattern

### Tailwind Configuration

The component relies on:
- **Tailwind v4** (modern, CSS-first approach)
- **Custom CSS properties** from `@design-studio/tokens`
- **Apps SDK UI classes** from `@openai/apps-sdk-ui`
- **`@source` directives** for Tailwind v4 scanning

### CSS Class Merging

Uses `cn()` utility for intelligent class merging:
```typescript
import { cn } from "../../../utils";

// Usage
className={cn(buttonVariants({ variant, size, className }))}
```

The `cn()` utility combines:
1. `clsx` for conditional class names
2. `tailwind-merge` for conflict resolution
3. Proper type safety with `ClassValue[]`

### Styling Analysis

**Strengths:**
- Clean separation between base styles and variants
- Comprehensive focus ring support (light/dark modes)
- Smart icon sizing with fallback selectors
- Good disabled state handling
- ARIA invalid state for form integration

**Areas for Improvement:**
- Long base class string (hard to parse)
- No loading state styling
- No error state styling (beyond ARIA invalid)
- Focus ring colors inconsistent across variants
- No active/pressed state for toggle behavior

---

## 6. Token Dependencies

### Apps SDK UI Tokens (Used)

| Token Category | Token Name | CSS Variable | Usage |
|----------------|------------|--------------|-------|
| **Background** | `bg-foreground` | (Apps SDK class) | Default variant background |
| **Background** | `bg-muted` | (Apps SDK class) | Secondary variant background |
| **Background** | `bg-secondary` | (Apps SDK class) | Hover states |
| **Background** | `bg-transparent` | (CSS keyword) | Ghost/link variants |
| **Text** | `text-text-inverted` | (Apps SDK class) | High contrast text |
| **Text** | `text-foreground` | (Apps SDK class) | Standard text color |
| **Border** | `border-border-strong` | (Apps SDK class) | Outline variant border |
| **Focus Ring** | `ring-offset-background` | (Apps SDK class) | Focus ring offset |

### Foundation Tokens (Used)

| Token Category | Token Name | CSS Variable | Value | Usage |
|----------------|------------|--------------|-------|-------|
| **Size** | `control-height` | `--foundation-size-control-height` | `44px` | All button heights |
| **Typography** | `button-label` | `--foundation-button-label-*` | `16px / 500 weight` | Default text |
| **Typography** | `button-label-small` | `--foundation-button-label-small-*` | `14px / 600 weight` | Small text |
| **Color** | `accent-red` | `--foundation-accent-red` | `#FF8583` | Destructive variant |
| **Color** | `accent-blue` | `--foundation-accent-blue` | `#66B5FF` | Link underline |
| **Color** | `text-dark-primary` | `--foundation-text-dark-primary` | `#FFFFFF` | Dark mode focus |
| **Color** | `text-light-primary` | `--foundation-text-light-primary` | `#0D0D0D` | Light mode focus |
| **Radius** | `radius-round` | `--foundation-radius-round` | `9999px` | Fully rounded corners |

### Token Mapping Strategy (for Migration)

**Current (AStudio) → Target (DesignStudio):**

| AStudio Token | DesignStudio Token | Notes |
|---------------|-------------------|-------|
| `bg-foreground` | `bg-[var(--ds-color-background-light-primary)]` | May need mapping |
| `text-text-inverted` | `text-[var(--ds-color-text-inverse)]` | Semantic naming |
| `--foundation-size-control-height` | `--ds-spacing-10` | Height: 44px |
| `--foundation-button-label-*` | `--ds-typography-button-*` | Typography tokens |
| `--foundation-accent-red` | `--ds-color-error-default` | Error color |
| `--foundation-accent-blue` | `--ds-color-link-default` | Link color |

**Migration Considerations:**
1. Apps SDK UI classes may not have direct design-studio equivalents
2. May need to use CSS variables directly instead of classes
3. Token naming convention differs (foundation-* vs ds-*)
4. Some tokens may need to be added to design-studio token system

---

## 7. Test Coverage

### Test File: `button.test.tsx` (169 lines)

### Test Structure

**Test Suites:**
1. **Rendering** (3 tests)
   - Renders with default props
   - Renders with data-slot attribute
   - Applies custom className

2. **Variants** (6 tests)
   - Each variant tested for correct class application
   - Uses `it.each` for data-driven testing
   - Validates specific class per variant

3. **Sizes** (4 tests)
   - Each size tested for correct height/padding
   - Uses `it.each` for data-driven testing
   - Validates CSS custom property usage

4. **Ref Forwarding** (1 test)
   - Forwards ref to button element
   - Validates ref.current is HTMLButtonElement
   - Checks textContent is preserved

5. **Disabled State** (3 tests)
   - Renders as disabled when disabled prop is true
   - Does not trigger onClick when disabled
   - Has correct disabled styles

6. **Interactions** (4 tests)
   - Calls onClick when clicked
   - Can be focused via keyboard (Tab)
   - Triggers onClick on Enter key
   - Triggers onClick on Space key

7. **asChild** (1 test)
   - Renders as child element when asChild is true
   - Validates link rendering with href
   - Tests Radix Slot polymorphism

8. **Accessibility** (4 tests)
   - Has correct button role
   - Supports aria-label
   - Supports aria-disabled
   - Has visible focus indicator styles

9. **Type Attribute** (3 tests)
   - Defaults to button type
   - Accepts submit type
   - Accepts reset type

### Test Coverage Summary

| Category | Tests | Coverage | Quality |
|----------|-------|----------|---------|
| **Rendering** | 3 | ✅ Basic | Good |
| **Variants** | 6 | ✅ Complete | Excellent (data-driven) |
| **Sizes** | 4 | ✅ Complete | Excellent (data-driven) |
| **Ref Forwarding** | 1 | ✅ Basic | Good |
| **Disabled State** | 3 | ✅ Complete | Good |
| **Interactions** | 4 | ✅ Good | Good (keyboard) |
| **asChild** | 1 | ✅ Basic | Good |
| **Accessibility** | 4 | ✅ Good | Excellent |
| **Type Attribute** | 3 | ✅ Complete | Good |

**Total Tests:** 29 test cases

### Test Quality Analysis

**Strengths:**
- Comprehensive variant and size testing with `it.each`
- Good keyboard navigation coverage (Tab, Enter, Space)
- Accessibility testing includes ARIA attributes
- Tests both render props and native attributes
- Validates focus ring styles for accessibility

**Areas for Improvement:**
- No test for loading state (doesn't exist yet)
- No test for error state (doesn't exist yet)
- No test for required state (doesn't exist yet)
- No visual regression tests (pixels)
- No accessibility audit (jest-axe)
- No test for icon button behavior (children with SVG)
- No test for compound/hybrid pattern (doesn't exist yet)

### Test Migration Strategy

**Keep (100% compatible):**
- All rendering tests
- All variant tests (update class names if needed)
- All size tests (update class names if needed)
- All accessibility tests
- All interaction tests

**Add (new functionality):**
- Loading state tests (spinner display, disabled behavior)
- Error state tests (error message rendering, aria-invalid)
- Required state tests (asterisk display, aria-required)
- jest-axe accessibility audit
- Visual regression tests (Argos/Chromatic)

**Refactor (improve quality):**
- Add data-driven test for disabled state
- Add test for focus ring in all variants
- Add test for icon button rendering
- Add test for compound pattern (if implemented)

---

## 8. Storybook Coverage

### Storybook File: `button.stories.tsx` (276 lines)

### Story Structure

**Meta Configuration:**
```typescript
const meta: Meta<typeof Button> = {
  title: "Components/UI/Base/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A versatile button component with multiple variants and sizes.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: [...], description: "..." },
    size: { control: "select", options: [...], description: "..." },
    disabled: { control: "boolean", description: "..." },
    asChild: { control: "boolean", description: "..." },
  },
  args: {
    onClick: fn(),
  },
};
```

### Stories (14 total)

#### Basic Variant Stories (6)

| Story | Props | Purpose |
|-------|-------|---------|
| **Default** | `variant="default"` | Primary button example |
| **Secondary** | `variant="secondary"` | Secondary button example |
| **Outline** | `variant="outline"` | Outlined button example |
| **Ghost** | `variant="ghost"` | Ghost button example |
| **Destructive** | `variant="destructive"` | Dangerous action example |
| **Link** | `variant="link"` | Link-style button example |

#### Size Variation Stories (2)

| Story | Props | Purpose |
|-------|-------|---------|
| **Small** | `size="sm"` | Small size example |
| **Large** | `size="lg"` | Large size example |

#### State Stories (2)

| Story | Props | Purpose |
|-------|-------|---------|
| **Disabled** | `disabled=true` | Disabled state example |
| **Loading** | `disabled=true`, `children=<IconRefresh spin>` | Loading state example (manual) |

#### Icon Stories (3)

| Story | Props | Purpose |
|-------|-------|---------|
| **WithIcon** | `children={<IconEmail />}Text` | Leading icon example |
| **IconOnly** | `size="icon"`, `children={<IconPlusLg />}` | Icon-only example |
| **WithTrailingIcon** | `children=Text<IconChevronRightMd />` | Trailing icon example |

#### Showcase Stories (2)

| Story | Purpose | Content |
|-------|---------|---------|
| **AllVariants** | Show all variants in one story | Grid of 6 variants |
| **AllSizes** | Show all sizes in one story | Row of 4 sizes |

#### Interaction Test Stories (3)

| Story | Purpose | Tests |
|-------|---------|-------|
| **ClickInteraction** | Test click handler | Renders, enabled, click, accessible name |
| **KeyboardNavigation** | Test keyboard | Tab focus, Enter activation |
| **DisabledState** | Test disabled | Disabled attribute, no interaction |

### Storybook Analysis

**Strengths:**
- Comprehensive variant coverage (all 6 variants)
- Good size coverage (all 4 sizes)
- Icon usage examples (leading, trailing, icon-only)
- Loading state example (manual implementation)
- Interaction tests with play function
- autodocs tag for automatic documentation
- Good argTypes configuration

**Areas for Improvement:**
- Loading story uses manual icon (should use built-in loading prop)
- No error state story
- No required state story
- No compound pattern story
- No dark mode examples
- No responsive examples
- Missing accessibility story (a11y plugin)
- No visual regression examples

### Storybook Migration Strategy

**Keep (100% compatible):**
- All basic variant stories
- All size variation stories
- All icon stories
- All showcase stories
- All interaction test stories

**Add (new functionality):**
- Loading state story (built-in prop)
- Error state story (error message display)
- Required state story (asterisk indicator)
- Compound pattern story (hybrid API)
- Accessibility story (jest-axe integration)
- Dark mode story (theme switching)

**Refactor (improve quality):**
- Add story parameters for layout consistency
- Add visual regression snapshots
- Add responsive viewport stories
- Add accessibility audit to interaction tests

---

## 9. Migration Complexity Assessment

### Complexity Rating: **Medium**

### Complexity Breakdown

| Aspect | Complexity | Reason |
|--------|------------|--------|
| **Component Logic** | Low | Simple component with CVA, no complex state |
| **Variant System** | Low | Well-structured CVA variants, easy to map |
| **Size System** | Low | Consistent sizes using CSS variables |
| **Token Migration** | **Medium** | Apps SDK UI classes → design-studio variables |
| **State Management** | **Medium** | Need to add loading/error/required states |
| **Hybrid Pattern** | **Medium** | Need to add compound sub-components |
| **Test Migration** | Low | Most tests compatible, need additions |
| **Storybook Migration** | Low | Most stories compatible, need additions |
| **Accessibility** | Low | Good foundation, need additions |
| **Bundle Impact** | Low | Small component, minimal bundle impact |

### Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Token Mapping Issues** | Medium | Medium | Create token mapping table, test visually |
| **Breaking Changes** | Low | High | Maintain backward compatibility, deprecate old API |
| **Missing Tokens** | Low | Medium | Add missing tokens to design-studio |
| **Test Failures** | Low | Low | Update test expectations incrementally |
| **Storybook Build** | Low | Low | Update stories incrementally |
| **Bundle Size Increase** | Low | Low | Monitor bundle size, optimize if needed |

### Migration Effort Estimate

| Task | Effort | Notes |
|------|--------|-------|
| **Pre-migration Analysis** | ✅ 2h | Complete (this document) |
| **Token Migration** | 2h | Map Apps SDK UI to design-studio |
| **Add StatefulComponentProps** | 2h | Add loading/error/required |
| **Implement Hybrid Pattern** | 3h | Add compound sub-components |
| **Update Tests** | 2h | Add new test cases, update existing |
| **Update Stories** | 2h | Add new stories, update existing |
| **Accessibility Audit** | 1h | Run jest-axe, fix violations |
| **Visual Regression** | 1h | Set up Argos/Chromatic |
| **Documentation** | 1h | Update README, add examples |
| **Integration Testing** | 2h | Test in real app context |

**Total Effort:** ~18 hours (2-3 days)

### Migration Complexity Factors

**Low Complexity Factors:**
- Well-structured component with CVA
- Comprehensive test coverage
- Rich Storybook documentation
- Simple component logic
- No complex state management
- No external dependencies beyond Radix

**Medium Complexity Factors:**
- Token system changes (Apps SDK UI → design-studio)
- Need to add new props (loading, error, required)
- Need to add hybrid/compound pattern
- Need to add ref forwarding explicitly
- Need to maintain backward compatibility

**High Complexity Factors:**
- None identified

---

## 10. Hybrid Pattern Considerations

### Current Pattern: Props-Based API

```typescript
<Button variant="default" size="default" loading={true}>
  Save Changes
</Button>
```

### Target Pattern: Hybrid API (Props + Compound)

#### Option A: Full Compound Pattern (Radix-style)

```typescript
// Compound API
<Button.Group>
  <Button.Primary>Save</Button.Primary>
  <Button.Secondary>Cancel</Button.Secondary>
</Button.Group>

// Props API (backward compatible)
<Button variant="primary">Save</Button>
```

**Pros:**
- Explicit control over sub-components
- Can add more slots (Icon, Label, Description)
- Matches Radix UI patterns
- Good for complex button groups

**Cons:**
- More verbose for simple cases
- Requires more components to maintain
- May confuse users (two APIs)

#### Option B: Limited Compound Pattern (Slots only)

```typescript
// Compound API for icon/label
<Button>
  <Button.Icon><IconSave /></Button.Icon>
  <Button.Label>Save</Button.Label>
</Button>

// Props API (backward compatible)
<Button variant="primary">Save</Button>
<Button variant="primary" icon={<IconSave />}>Save</Button>
```

**Pros:**
- Fine-grained control over icon/label
- Can add individual styling to slots
- Simpler than full compound pattern
- Backward compatible

**Cons:**
- Limited to icon/label slots
- Still more verbose than props
- May not justify complexity

#### Option C: No Compound Pattern (Props Only)

```typescript
// Keep current props-based API
<Button variant="primary" icon={<IconSave />}>
  Save
</Button>
```

**Pros:**
- Simple, familiar API
- Less code to maintain
- No confusion from multiple APIs
- Good enough for most use cases

**Cons:**
- Limited flexibility
- Can't style icon/label independently
- Doesn't demonstrate hybrid pattern

### Recommendation: **Option B (Limited Compound Pattern)**

**Rationale:**
1. Button is a simple component (not complex like Dialog/Modal)
2. Icon/Label slots are genuinely useful (icon styling, label wrapping)
3. Demonstrates hybrid pattern without over-engineering
4. Backward compatible (props API still works)
5. Good balance of flexibility and simplicity

### Proposed Compound Sub-Components

```typescript
// Main Button component
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(...);

// Compound sub-components
Button.Icon = ({ icon, position }: { icon: ReactNode; position: 'leading' | 'trailing' }) => {
  // Renders icon with proper styling
};

Button.Label = ({ children, truncate }: { children: ReactNode; truncate?: boolean }) => {
  // Renders label with optional truncation
};

Button.Spinner = ({ size }: { size?: 'sm' | 'md' | 'lg' }) => {
  // Renders loading spinner
};

// Usage examples
<Button>
  <Button.Spinner />
  <Button.Icon icon={<IconSave />} position="leading" />
  <Button.Label truncate>Save Changes</Button.Label>
</.Button>

// Props API (backward compatible)
<Button variant="primary" icon={<IconSave />} loading>
  Save Changes
</Button>
```

### Hybrid Pattern Decision Matrix

| Factor | Option A (Full) | Option B (Limited) | Option C (None) | Winner |
|--------|----------------|-------------------|-----------------|--------|
| **Simplicity** | ❌ Complex | ✅ Balanced | ✅ Simplest | Option C |
| **Flexibility** | ✅ High | ✅ Medium | ❌ Low | Option A |
| **Backward Compatibility** | ✅ Yes | ✅ Yes | ✅ Yes | Tie |
| **Maintenance** | ❌ High | ✅ Medium | ✅ Low | Option C |
| **User Confusion** | ❌ High | ✅ Low | ✅ None | Option C |
| **Pattern Demonstration** | ✅ Yes | ✅ Yes | ❌ No | Tie |
| **Real-World Use Case** | ❌ Rare | ✅ Common | ✅ Common | Tie |

**Overall Winner:** Option B (Limited Compound Pattern)

**Final Decision:** Implement limited compound pattern with Icon/Label/Spinner slots, while maintaining full backward compatibility with props-based API.

---

## Migration Checklist

### Pre-Migration (Step 1) ✅

- [x] Read existing component code
- [x] Analyze props and variants
- [x] Document dependencies
- [x] Review test coverage
- [x] Review Storybook stories
- [x] Assess migration complexity
- [x] Consider hybrid pattern approach
- [x] Create this analysis document

### Migration (Step 2-7) - TODO

- [ ] **Step 2:** Create token mapping table
- [ ] **Step 3:** Implement StatefulComponentProps (loading, error, required)
- [ ] **Step 4:** Implement hybrid pattern (Icon, Label, Spinner)
- [ ] **Step 5:** Update tests (add new test cases)
- [ ] **Step 6:** Update Storybook stories
- [ ] **Step 7:** Accessibility audit (jest-axe)
- [ ] **Step 8:** Visual regression setup (Argos/Chromatic)
- [ ] **Step 9:** Integration testing
- [ ] **Step 10:** Documentation updates

### Post-Migration (Step 8) - TODO

- [ ] Verify all tests pass
- [ ] Verify Storybook builds
- [ ] Verify accessibility audit passes
- [ ] Verify visual regression baseline
- [ ] Verify bundle size impact
- [ ] Verify backward compatibility
- [ ] Create migration guide
- [ ] Update CHANGELOG

---

## Appendix A: Token Mapping Table

### Apps SDK UI → DesignStudio Tokens

| AStudio Token | DesignStudio Token | Value | Category |
|---------------|-------------------|-------|----------|
| `bg-foreground` | `bg-[var(--ds-color-background-light-primary)]` | TBD | Background |
| `text-text-inverted` | `text-[var(--ds-color-text-inverse)]` | TBD | Text |
| `bg-muted` | `bg-[var(--ds-color-background-light-secondary)]` | TBD | Background |
| `bg-secondary` | `bg-[var(--ds-color-background-light-accent)]` | TBD | Background |
| `text-foreground` | `text-[var(--ds-color-text-primary)]` | TBD | Text |
| `border-border-strong` | `border-[var(--ds-color-border-heavy)]` | TBD | Border |
| `bg-foundation-accent-red` | `bg-[var(--ds-color-error-default)]` | `#FF8583` | Color |
| `text-foundation-text-dark-primary` | `text-[var(--ds-color-text-primary)]` | `#0D0D0D` | Text |
| `text-foundation-text-light-primary` | `text-[var(--ds-color-text-primary)]` | `#FFFFFF` | Text |
| `--foundation-size-control-height` | `--ds-spacing-10` | `44px` | Size |
| `--foundation-button-label-*` | `--ds-typography-button-*` | TBD | Typography |
| `--foundation-button-label-small-*` | `--ds-typography-button-small-*` | TBD | Typography |

### Missing Tokens (Need to Add)

These tokens may need to be added to `@design-studio/tokens`:

- `--ds-color-background-light-primary`
- `--ds-color-text-inverse`
- `--ds-color-background-light-secondary`
- `--ds-color-background-light-accent`
- `--ds-color-text-primary`
- `--ds-color-border-heavy`
- `--ds-color-error-default`
- `--ds-typography-button-*`
- `--ds-typography-button-small-*`

---

## Appendix B: File Structure

### Current Structure

```
packages/ui/src/components/ui/base/Button/
├── fallback/
│   └── Button.tsx              (82 lines) - Main component
├── button.test.tsx             (169 lines) - Tests
├── button.stories.tsx          (276 lines) - Storybook stories
└── index.ts                    (2 lines) - Export
```

### Target Structure (After Migration)

```
packages/design-studio-ui/src/components/ui/base/Button/
├── Button.tsx                  (~200 lines) - Main component + hybrid
├── Button.test.tsx             (~250 lines) - Tests (enhanced)
├── Button.stories.tsx          (~350 lines) - Stories (enhanced)
├── Button.spec.ts              (~50 lines) - Component spec
├── index.ts                    (2 lines) - Export
└── README.md                   (~100 lines) - Usage docs
```

---

## Appendix C: References

### Related Documentation

- **Phase 3 Migration Plan:** `/.spec/phase-3-component-migration.md`
- **Architecture Spec:** `/.spec/architecture-2026-01-26-design-studio.md`
- **Keyboard Navigation Tests:** `/docs/KEYBOARD_NAVIGATION_TESTS.md`
- **Design Studio Tokens:** `/packages/design-studio-tokens/`
- **Migration Guide:** `/docs/MIGRATION.md`

### Related Components

- **IconButton:** `/packages/ui/src/components/ui/base/IconButton/IconButton.tsx`
- **Toggle:** `/packages/ui/src/components/ui/base/Toggle/`
- **Switch:** `/packages/ui/src/components/ui/base/Switch/`

### External References

- [Radix UI Slot](https://www.radix-ui.com/primitives/docs/utilities/slot)
- [class-variance-authority](https://cva.style/)
- [Tailwind v4](https://tailwindcss.com/blog/tailwindcss-v4-alpha)
- [Apps SDK UI](https://github.com/openai/apps-sdk-ui)

---

**Analysis Complete**

**Next Step:** Step 2 - Import Update & Token Mapping
