# DesignStudio Quality Gates

**Status:** DRAFT - Effective 2026-01-26
**Version:** 1.0.0
**Source:** User's Radix UI design engineering analysis

---

## Overview

Quality gates ensure all components meet consistent standards for accessibility, performance, and developer experience before being merged.

---

## The 7 Quality Gates

Before merging any component to `main`, all of the following gates must pass:

### 1. ✅ Biome Check

**What:** Code formatting and linting
**Command:** `pnpm lint`
**Pass Criteria:** No errors, no warnings

**Checks:**
- Code formatting (Biome format)
- Linting rules (Biome lint)
- Import organization
- Unused imports/variables

**Why:** Consistent code quality across the codebase

---

### 2. ✅ TypeScript Typecheck

**What:** Static type checking
**Command:** `pnpm typecheck`
**Pass Criteria:** No type errors

**Checks:**
- All types are properly defined
- No `any` types without justification
- Props interfaces are complete
- Generic types are constrained

**Why:** Catch type errors at compile time, not runtime

---

### 3. ✅ Storybook Story Exists (All States)

**What:** Component documentation with all states
**Location:** `packages/design-studio-ui/src/components/*/stories.tsx`
**Pass Criteria:** Story exists for each component state

**Required States:**
- Default
- Hover
- Focus
- Disabled
- Error (if applicable)
- Loading (if applicable)
- Required (if applicable)
- Reduced motion (for animated components)

**Example:**
```tsx
// Button.stories.tsx
export default {
  title: "Components/Button",
  component: Button,
};

export const Default = {};
export const Hover = { parameters: { pseudo: { hover: true } } };
export const Focus = { parameters: { pseudo: { focus: true } } };
export const Disabled = { args: { disabled: true } };
export const Error = { args: { error: "Error message" } };
export const Loading = { args: { loading: true } };
export const Required = { args: { required: true } };
```

**Why:** Visual documentation, easy review, catch UI regressions

---

### 4. ✅ Keyboard Navigation Works

**What:** Component is fully keyboard accessible
**Pass Criteria:** All interactive actions can be performed with keyboard only

**Checks:**
- [ ] Tab order is logical
- [ ] Focus indicator is visible
- [ ] Enter/Space activate primary action
- [ ] Escape closes/dismisses (modals, dropdowns)
- [ ] Arrow keys navigate (menus, tabs)
- [ ] Home/End navigate (lists, sliders)

**Testing:**
1. Unplug mouse
2. Navigate to component with Tab
3. Perform all actions with keyboard only

**Why:** Accessibility for keyboard users (power users, screen readers)

---

### 5. ✅ Reduced-Motion Respected

**What:** Component respects `prefers-reduced-motion` setting
**Pass Criteria:** Animations are disabled or simplified when reduced motion is on

**Checks:**
```css
@media (prefers-reduced-motion: reduce) {
  /* All transitions disabled */
  *, *::before, *::after {
    transition-duration: 0.01ms !important;
  }
}
```

**Testing:**
1. Chrome DevTools → Rendering → Emulate CSS media feature → prefers-reduced-motion: reduce
2. Verify animations are disabled

**Why:** Accessibility for users with vestibular disorders

---

### 6. ✅ Contrast Ratio ≥ 4.5:1

**What:** Text meets WCAG AA contrast requirements
**Pass Criteria:** Small text (< 18pt) has contrast ratio ≥ 4.5:1

**Checks:**
- All text on backgrounds
- All icons on backgrounds
- All focus indicators
- All error messages

**Testing:**
- Chrome DevTools Lighthouse audit
- Online contrast checker: https://webaim.org/resources/contrastchecker/

**Why:** Accessibility for users with low vision

---

### 7. ✅ Tests Pass (Unit + Component)

**What:** Automated tests for component behavior
**Command:** `pnpm test`
**Pass Criteria:** All tests pass, coverage ≥ 80%

**Required Tests:**
- Unit tests for utilities
- Component tests for user interactions
- Accessibility tests (jest-axe)

**Example:**
```tsx
describe("Button", () => {
  it("renders correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("does not emit click when disabled", () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

**Why:** Catch regressions, ensure behavior correctness

---

## Pre-Merge Checklist

Before creating a PR, verify:

- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes
- [ ] Storybook story exists (all states)
- [ ] Keyboard navigation works
- [ ] Reduced motion is respected
- [ ] Contrast ratio ≥ 4.5:1
- [ ] `pnpm test` passes (coverage ≥ 80%)

---

## CI/CD Integration

These gates should be automated in CI:

```yaml
# .github/workflows/pr-check.yml
name: PR Checks

on: [pull_request]

jobs:
  quality-gates:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: pnpm install
      - run: pnpm lint         # Gate 1
      - run: pnpm typecheck    # Gate 2
      - run: pnpm test         # Gate 7
      - run: pnpm storybook    # Gate 3 (verify stories build)
```

---

## Exemptions

If a gate cannot be met for a valid reason:

1. Document the reason in the PR
2. Add a `// eslint-disable-next-line` comment with explanation
3. Create a tracking issue to address the debt
4. Get approval from a maintainer

---

**Last Updated:** 2026-01-26
**Next Review:** After Phase 3 (Component Migration) complete
