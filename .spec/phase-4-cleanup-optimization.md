# Phase 4: Cleanup & Optimization

**Status:** Planning Phase
**Timeline:** Week 9 (3-5 days estimated)
**Start Date:** 2026-01-28
**Dependencies:** Phase 3 Component Migration (Complete)

## Overview

Phase 4 focuses on completing the technical debt items from Phase 3, optimizing performance, and preparing the design system for production release. This phase ensures quality standards are met across all components.

## 1. Success Criteria

| Criterion | Target | Measurement Method |
|-----------|--------|-------------------|
| **Test Coverage** | ≥80% overall | Vitest coverage report |
| **Manual Quality Gates** | 100% pass | Keyboard, reduced motion, contrast checks |
| **Performance Benchmarks** | All met | Lighthouse audit (FCP <1s, LCP <1.5s, INP <100ms, CLS <0.05) |
| **Deprecated Code** | Removed | Code audit and git diff |
| **Documentation** | Complete | Updated README, CHANGELOG, migration guide |
| **Release Ready** | Yes | All packages build and test successfully |

## 2. Epics & Stories

### Epic 1: Test Coverage Expansion

**Priority:** P0 (Critical)
**Estimated:** 8-12 hours
**Owner:** TBD

#### Story 1.1: Add Tests for Low-Coverage Base Components

**Components:** Calendar, InputOTP, ListItem, Resizable, ScrollArea, Separator, ShimmerText, Skeleton, TextLink

**Acceptance Criteria:**
- [ ] Each component has ≥80% statement coverage
- [ ] All stateful props tested (loading, error, disabled, required)
- [ ] User interactions covered (click, focus, keyboard)
- [ ] Accessibility assertions included (aria attributes)

**Implementation Tasks:**
```bash
# Per component:
1. Read existing test file: packages/ui/src/components/ui/[category]/[Component]/[Component].test.tsx
2. Identify uncovered lines from coverage report
3. Add test cases for:
   - StatefulComponentProps states (loading, error, disabled, required)
   - User interactions (onClick, onChange, onSubmit)
   - Keyboard navigation (Tab, Enter, Space, Arrow keys)
   - ARIA attributes (role, aria-label, aria-disabled, etc.)
4. Run: mise exec node@24 -- pnpm test [Component].test.tsx
5. Run: mise exec node@24 -- pnpm test:coverage
6. Verify coverage ≥80% for component
```

**Test Template (per component):**
```typescript
describe("[ComponentName]", () => {
  // Rendering
  it("renders correctly", () => {
    render(<[ComponentName] {...defaultProps} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  // Stateful states
  it("shows loading state when loading=true", () => {
    render(<[ComponentName] loading {...defaultProps} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
  });

  it("shows error message when error prop provided", () => {
    render(<[ComponentName] error="Test error" {...defaultProps} />);
    expect(screen.getByText("Test error")).toBeInTheDocument();
  });

  it("disables interactions when disabled=true", () => {
    const handleClick = vi.fn();
    render(<[ComponentName] disabled onClick={handleClick} {...defaultProps} />);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  // Accessibility
  it("has no accessibility violations", async () => {
    const { container } = render(<[ComponentName] {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // Keyboard navigation (if applicable)
  it("can be activated with Enter key", () => {
    const handleClick = vi.fn();
    render(<[ComponentName] onClick={handleClick} {...defaultProps} />);
    const element = screen.getByRole("button");
    element.focus();
    fireEvent.keyDown(element, { key: "Enter" });
    expect(handleClick).toHaveBeenCalled();
  });
});
```

**Definition of Done:**
- All listed components have ≥80% coverage
- Tests pass: `mise exec node@24 -- pnpm test`
- Coverage report shows improvement

---

#### Story 1.2: Add Tests for Chat Components

**Components:** ChatInput, ChatMessages, ChatShell, ChatSidebar, ChatUIRoot, AttachmentMenu, ChatHeader, MessageActions

**Acceptance Criteria:**
- [ ] Each component has ≥70% statement coverage (complex components)
- [ ] State management tested (loading, error, disabled states)
- [ ] Message rendering tested
- [ ] User interactions covered (send, attach, navigate)

**Implementation Tasks:**
1. Review existing tests in `packages/ui/src/app/chat/`
2. Add tests for StatefulComponentProps integration
3. Test message rendering with various states
4. Test user interactions (send message, toggle sidebar, etc.)
5. Verify accessibility (keyboard nav, ARIA attributes)

**Definition of Done:**
- All chat components have ≥70% coverage
- Chat UI test suite passes
- No accessibility violations

---

#### Story 1.3: Add Tests for Overlay Components

**Components:** Command, ContextMenu, Drawer, DropdownMenu, HoverCard, Modal, Popover, Sheet, Tooltip

**Acceptance Criteria:**
- [ ] Each component has ≥70% statement coverage
- [ ] Open/close states tested
- [ ] Focus management verified
- [ ] Escape key behavior tested
- [ ] Click outside to close tested

**Implementation Tasks:**
1. Test trigger interactions (click, hover, keyboard)
2. Test overlay rendering and positioning
3. Test focus trapping (Modal, Dialog)
4. Test focus return on close
5. Test escape key dismissal
6. Test click-outside behavior

**Definition of Done:**
- All overlay components have ≥70% coverage
- Focus management tests pass
- Escape/click-outside behavior verified

---

#### Story 1.4: Add Tests for Form Components

**Components:** Combobox, DatePicker, TagInput, RangeSlider

**Acceptance Criteria:**
- [ ] Each component has ≥75% statement coverage
- [ ] Form integration tested
- [ ] Validation states tested
- [ ] User input handling verified

**Definition of Done:**
- All form components have ≥75% coverage
- Form integration tests pass
- Validation behavior verified

---

#### Story 1.5: Add Tests for Data Display Components

**Components:** Chart, CodeBlock, EmptyMessage, Image, Indicator, Markdown

**Acceptance Criteria:**
- [ ] Each component has ≥70% statement coverage
- [ ] Data rendering tested
- [ ] Loading/error states verified
- [ ] User interactions tested (copy code, zoom image, etc.)

**Definition of Done:**
- All data display components have ≥70% coverage
- Interaction tests pass
- State management verified

---

### Epic 2: Manual Quality Gates

**Priority:** P0 (Critical)
**Estimated:** 4-6 hours
**Owner:** TBD

#### Story 2.1: Keyboard Navigation Testing

**Scope:** All interactive components

**Test Methodology:**
```bash
1. Start Storybook: mise exec node@24 -- pnpm dev:storybook
2. For each component category:
   - Navigate to component story
   - Unplug mouse (simulate keyboard-only user)
   - Test Tab order (logical progression)
   - Test Enter/Space activation
   - Test Arrow keys (menus, lists, sliders)
   - Test Escape dismissal (modals, dropdowns)
   - Test Home/End (lists, sliders)
3. Document issues in GitHub
```

**Component-Specific Tests:**

| Component | Keyboard Tests |
|-----------|---------------|
| **Button** | Tab to focus, Enter/Space to activate |
| **Input** | Tab to focus, type, Tab to exit |
| **Select** | Tab to focus, Space/Enter to open, Arrow to navigate, Enter to select, Escape to close |
| **Checkbox/Switch** | Tab to focus, Space to toggle |
| **RadioGroup** | Tab to group, Arrow to navigate, Space to select |
| **Slider** | Tab to focus, Arrow to adjust, Home/End for min/max |
| **Tabs** | Tab to tabs, Arrow to navigate, Enter to activate |
| **Modal/Dialog** | Escape to close, focus trap, focus return |
| **Dropdown Menu** | Space/Enter to open, Arrow to navigate, Enter to select, Escape to close |
| **Tooltip** | Tab/hover to show, Escape to hide |
| **Carousel** | Arrow keys to navigate |

**Acceptance Criteria:**
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical and predictable
- [ ] Focus indicators are visible
- [ ] Escape key closes/dismisses overlays
- [ ] Arrow keys navigate lists/menus/tabs
- [ ] Home/End work on sliders/lists

**Evidence:**
- Screenshot documentation of focus states
- Test checklist per component
- Bug tickets for any issues found

---

#### Story 2.2: Reduced Motion Testing

**Scope:** All animated components

**Test Methodology:**
```bash
1. Chrome DevTools → Rendering → Emulate CSS media feature
2. Set prefers-reduced-motion: reduce
3. For each animated component:
   - Navigate to story
   - Verify animations are disabled or simplified
   - Verify transitions are instant (≤0.01ms)
4. Document components that don't respect reduced motion
```

**Components to Test:**

| Component | Animation | Expected Behavior |
|-----------|-----------|-------------------|
| **Toast** | Slide in/out | No animation, instant appear |
| **Modal** | Fade/scale in | Instant appear, no fade |
| **Drawer** | Slide in/out | No slide, instant appear |
| **Dropdown** | Fade in | Instant appear |
| **Tooltip** | Fade in | Instant appear |
| **Skeleton** | Pulse shimmer | Static or no shimmer |
| **Spinner** | Rotation | Static or simple indicator |
| **Transition** | All transitions | Instant state change |

**Acceptance Criteria:**
- [ ] All animated components respect `prefers-reduced-motion`
- [ ] No unintended motion when reduced motion is on
- [ ] Instant state changes (≤0.01s transition)
- [ ] Core functionality remains accessible without animation

**Implementation Fix (if needed):**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Evidence:**
- Screenshots of components with reduced motion on
- List of components that pass/fail
- Bug tickets for non-compliant components

---

#### Story 2.3: Contrast Ratio Testing

**Scope:** All UI components with text/icons

**Test Methodology:**
```bash
1. Run Lighthouse audit on Storybook
2. Use axe DevTools or WAVE browser extension
3. For each component:
   - Check all text against backgrounds
   - Check all icons against backgrounds
   - Check focus indicators
   - Check error messages
   - Check disabled states
4. Document any failures with color values
```

**WCAG AA Requirements:**
- **Normal text (<18pt):** ≥4.5:1 contrast ratio
- **Large text (≥18pt or ≥14pt bold):** ≥3:1 contrast ratio
- **UI components/icons:** ≥3:1 contrast ratio
- **Focus indicators:** ≥3:1 contrast ratio against adjacent colors

**Acceptance Criteria:**
- [ ] All text meets ≥4.5:1 contrast ratio
- [ ] All icons meet ≥3:1 contrast ratio
- [ ] Focus indicators are visible (≥3:1)
- [ ] Error messages meet contrast requirements
- [ ] Disabled states remain readable
- [ ] Dark mode variants pass contrast checks

**Components Requiring Extra Attention:**
- Links (especially in body text)
- Secondary/muted text
- Error/success messages
- Toast notifications
- Form helper text
- Disabled button text

**Evidence:**
- Lighthouse accessibility score ≥90
- Axe DevTools scan with 0 violations
- Screenshots of contrast failures (if any)
- Bug tickets for non-compliant components

---

### Epic 3: Performance Benchmarks

**Priority:** P1 (High)
**Estimated:** 2-4 hours
**Owner:** TBD

#### Story 3.1: Lighthouse Audit

**Target Application:** Web app (platforms/web/apps/web)

**Benchmark Targets:**

| Metric | Target | Current (baseline) |
|--------|--------|-------------------|
| **First Contentful Paint (FCP)** | <1.0s | TBD |
| **Largest Contentful Paint (LCP)** | <1.5s | TBD |
| **Interaction to Next Paint (INP)** | <100ms | TBD |
| **Cumulative Layout Shift (CLS)** | <0.05 | TBD |
| **Speed Index** | <2.0s | TBD |
| **Time to Interactive (TTI)** | <3.0s | TBD |

**Test Methodology:**
```bash
1. Build production app: mise exec node@24 -- pnpm build:web
2. Serve app locally or deploy to preview
3. Run Lighthouse CI:
   npx lighthouse http://localhost:4173 --view --output html --output-path ./lighthouse-report.html
4. Review report and identify opportunities
5. Document baseline metrics
6. Create optimization tasks for any failing metrics
```

**Acceptance Criteria:**
- [ ] Lighthouse performance score ≥90
- [ ] All core web vitals pass (green)
- [ ] Performance budget established
- [ ] Optimization plan documented (if needed)

---

#### Story 3.2: Bundle Size Optimization

**Current State:** ~440KB gzipped (within target)

**Optimization Opportunities:**

| Chunk | Current Size | Opportunity |
|-------|-------------|-------------|
| `templates-CXoo0m1z.js` | 627KB / 82KB gz | Review template dependencies |
| `app-3orS3Nrk.js` | 839KB / 179KB gz | Lazy load app components |
| `base-Di3GrhBC.js` | 236KB / 83KB gz | Review base dependencies |

**Implementation Tasks:**
1. Analyze bundle with `rollup-plugin-visualizer`
2. Identify large dependencies
3. Consider code splitting strategies:
   - Lazy load heavy components
   - Dynamic imports for less-used features
   - Tree-shake unused exports
4. Re-run bundle analysis
5. Verify no breaking changes

**Acceptance Criteria:**
- [ ] Bundle analysis report generated
- [ ] Large dependencies identified
- [ ] Optimization opportunities documented
- [ ] No regression in functionality

---

### Epic 4: Cleanup & Release Preparation

**Priority:** P1 (High)
**Estimated:** 8-10 hours
**Owner:** TBD

#### Story 4.1: Remove Deprecated Code

**Scope:** Search for and remove deprecated patterns, components, and imports.

**Implementation Tasks:**
```bash
# 1. Search for deprecated imports
rg "from ['\"]@astudio" packages/ui/src --type ts --type tsx -l
rg "from ['\"]@astudio" packages/runtime/src --type ts -l

# 2. Search for old component patterns
rg "AS[TR]Studio[A-Z]" packages/ui/src --type tsx -l
rg "AppsSDK[A-Z]" packages/ui/src --type tsx -l

# 3. Search for TODO/FIXME comments related to migration
rg "TODO.*migrat" packages/ui/src --type ts --type tsx -l
rg "FIXME.*migrat" packages/ui/src --type ts --type tsx -l

# 4. Check for unused exports
rg "export.*from" packages/ui/src --type ts -l
```

**Acceptance Criteria:**
- [ ] All deprecated imports removed
- [ ] Old component naming removed
- [ ] Migration TODOs resolved or documented
- [ ] No unused exports remain
- [ ] Build succeeds with no warnings

---

#### Story 4.2: Update Documentation

**Documentation Files to Update:**

1. **README.md** (root and packages/ui)
   - Update component list
   - Add StatefulComponentProps documentation
   - Update examples

2. **CHANGELOG.md**
   - Add Phase 3 release notes
   - List all migrated components
   - Document breaking changes (none expected)
   - Add migration guide

3. **Migration Guide** (docs/MIGRATION.md if exists)
   - How to use StatefulComponentProps
   - Component API changes
   - Before/after examples

**Acceptance Criteria:**
- [ ] README updated with current API
- [ ] CHANGELOG documents Phase 3 changes
- [ ] Migration guide available
- [ ] Storybook docs updated

---

#### Story 4.3: Version Bump & Release Prep

**Implementation Tasks:**
1. Update package versions:
   - `@design-studio/ui`: 2.0.0 (major breaking change via StatefulComponentProps)
   - `@design-studio/tokens`: 2.0.0
   - `@design-studio/runtime`: 2.0.0

2. Verify package.json exports are correct

3. Run full build and test suite:
   ```bash
   mise exec node@24 -- pnpm lint
   mise exec node@24 -- pnpm -C packages/ui type-check
   mise exec node@24 -- pnpm test
   mise exec node@24 -- pnpm build:lib
   ```

4. Create release branch/tag

**Acceptance Criteria:**
- [ ] All packages versioned correctly
- [ ] Exports verified
- [ ] Full test suite passes
- [ ] All packages build successfully
- [ ] Release notes drafted

---

## 3. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Test coverage takes longer** | Medium | Medium | Focus on critical paths first, accept lower coverage for complex UI-only components |
| **Manual testing finds issues** | High | Medium | Budget extra time for fixes, prioritize critical accessibility issues |
| **Performance regressions** | Low | High | Establish baseline before optimizations, monitor continuously |
| **Breaking changes discovered** | Low | High | Comprehensive testing before release, rollback plan ready |
| **Documentation incomplete** | Medium | Low | Use template-based docs, generate from code comments |

---

## 4. Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| Phase 3 completion | External | ✅ Complete |
| Node.js 24 upgrade | External | ✅ Complete |
| Storybook build | External | ✅ Complete |
| Playwright setup | Internal | ⚠️ Needs browser install |
| Lighthouse CI | Internal | ⚠️ Needs setup |

---

## 5. Definition of Done

Phase 4 is complete when:

- [ ] Test coverage ≥80% overall (with justification for any exclusions)
- [ ] All manual quality gates pass (keyboard, reduced motion, contrast)
- [ ] Lighthouse performance score ≥90
- [ ] All deprecated code removed
- [ ] Documentation updated (README, CHANGELOG, migration guide)
- [ ] All packages build and test successfully
- [ ] Release branch created and ready for merge
- [ ] Phase 4 spec updated with completion status

---

## 6. Success Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Test coverage | ≥80% | 18.9% |
| Accessibility pass rate | 100% | TBD |
| Lighthouse performance | ≥90 | TBD |
| Bundle size (gzipped) | ≤500KB | ~440KB ✅ |
| Deprecated code files | 0 | TBD |
| Documentation completeness | 100% | TBD |

---

**This plan will be updated as Phase 4 progresses.**
