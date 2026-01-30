# Phase 5: Design System Enhancements

**Schema Version:** 1
**Status:** Draft
**Date:** 2026-01-30
**Owner:** Design System Team
**Dependencies:** Phase 4 Epic 6 Foundation (Complete)

---

## Executive Summary

This specification defines the remaining enhancements to transform the Storybook design system from a **developer-focused component library** into a **gold-standard professional design system** following modern techniques from industry leaders:

- **Emil Kowalski**: Motion as communication, precision timing/easing, "less but better" animation
- **Jhey Tompkins**: CSS-first creativity, playful but performant micro-interactions
- **Jenny Wen**: Deliberate judgment, clarity over process, delight that serves purpose

**Foundation Complete (Phase 4):**
- ✅ 15 design system foundation stories (01-15) with proper ordering
- ✅ Visual scale pages for all foundations (Colors, Typography, Spacing, Radius, Sizes, Elevation, Motion)
- ✅ Component patterns documentation
- ✅ Iconography system with visual catalog
- ✅ Import paths standardized to `@astudio/tokens/*`

**Target State (Phase 5):**
- 🎯 Theme toolbar toggle for light/dark mode switching
- 🎯 Design system landing page for new users
- 🎯 Usage guidelines for top 10 components
- 🎯 Comprehensive dark mode support across all stories
- 🎯 Enhanced pattern library with real-world examples

---

## Problem & Job (JTBD)

### Primary Problem

The design system foundation is complete, but designers and developers still face friction:

1. **No easy theme switching** - Must use backgrounds dropdown or manually change URL hash
2. **No onboarding** - New users see 15 stories but don't know where to start
3. **Component choice ambiguity** - When to use Button vs Link? Modal vs Drawer?
4. **Dark mode gaps** - Some stories don't demonstrate dark mode variants
5. **Limited pattern examples** - Need more real-world composed examples

### Jobs to be Done

| Job | User | Current Pain | Target Outcome |
|-----|------|--------------|----------------|
| Verify dark mode | Designer | Toggle backgrounds dropdown | One-click toolbar toggle |
| Get started | New Designer | 15 stories, no entry point | Clear landing page with path |
| Choose right component | Designer | Guess based on name | Clear "when to use" guidelines |
| See dark variants | Designer | Some stories missing dark mode | All stories show both themes |
| Build complete UI | Developer | Token combinations unclear | Pattern library with examples |

---

## Success Criteria

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| **Theme Switches Per Session** | ~0 (hidden) | ≥5 | Toolbar toggle usage |
| **Designer Onboarding Time** | ~10 minutes | ≤2 minutes | Time-to-first-story-understood |
| **Component Choice Confidence** | Unknown | ≥80% | Survey of designers |
| **Dark Mode Coverage** | ~60% | 100% | Audit of all stories |
| **Pattern Examples** | 7 basic | 20+ real-world | Pattern story count |

---

## Scope

### In-Scope (MVP)

**Story 5.1: Theme Toolbar Toggle (30 min)**
- Install `@storybook/addon-themes`
- Configure light/dark themes
- Add sun/moon icon to toolbar
- Ensure toggle persists across stories

**Story 5.2: Design System Landing Page (1 hour)**
- Welcome message with design system philosophy
- Quick links to key foundations
- "Getting Started" for designers (3-step guide)
- What's New section

**Story 5.3: Component Usage Guidelines (3 hours)**
- Top 10 components: Button, Input, Checkbox, Modal, Select, Switch, RadioGroup, Tabs, Link, Badge
- "When to use" section for each
- "When to use [alternative] instead" comparisons
- Do's and Don'ts examples with visuals

**Story 5.4: Dark Mode Coverage (2 hours)**
- Audit all 15 foundation stories for dark mode support
- Add dark mode variants where missing
- Ensure all patterns show both themes
- Document dark mode best practices

**Story 5.5: Enhanced Pattern Library (3 hours)**
- Form patterns (login, signup, search, filter)
- Card patterns (article, product, profile, stats)
- Navigation patterns (breadcrumb, tabs, sidebar, top nav)
- Data display patterns (table with filters, list with actions, grid with cards)

### Out-of-Scope (MVP)

- Figma integration bridge (Future phase)
- Design token editor (Future phase)
- Component variant generator (Future phase)
- Storybook embed in external docs (Future phase)
- Interactive motion playground (Future phase)

---

## Build Breakdown

### Story 5.1: Theme Toolbar Toggle

**User Story:** As a designer, I want a one-click theme toggle so I can quickly verify components in both light and dark modes.

**Acceptance Criteria:**
- [ ] `@storybook/addon-themes` installed
- [ ] Sun/moon icon in toolbar
- [ ] Clicking icon toggles light/dark
- [ ] Toggle persists across stories
- [ ] Current theme reflected in URL hash

**Implementation:**
```bash
pnpm add -D @storybook/addon-themes
```

```tsx
// .storybook/preview.tsx
import { withThemeByDataAttribute } from '@storybook/addon-themes';

export const decorators = [
  withThemeByDataAttribute({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'dark',
    attributeName: 'data-theme',
  }),
];
```

**Evidence:** Storybook toolbar shows theme toggle icon.

**Estimated:** 30 minutes

---

### Story 5.2: Design System Landing Page

**User Story:** As a new designer, I want a landing page that explains the design system so I can quickly understand how to use it.

**Acceptance Criteria:**
- [ ] Welcome message with design system philosophy
- [ ] Quick links to key sections (Colors, Typography, Spacing)
- [ ] "Getting Started" for designers (3-step guide)
- [ ] What's New section (recent changes)
- [ ] Featured patterns (showcase best examples)

**File:** `packages/ui/src/storybook/design-system/00_GettingStarted/GettingStarted.stories.tsx` (update existing)

**Implementation:**
```tsx
export const Welcome: Story = {
  name: "Welcome to the Design System",
  render: () => (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Welcome to the Design System</h1>
        <p className="text-xl text-muted-foreground">
          A component library built with clarity, consistency, and accessibility in mind.
          Following principles from Emil Kowalski, Jhey Tompkins, and Jenny Wen.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <QuickLinkCard
          title="🎨 Colors"
          description="Visual palette with semantic meanings"
          href="/?path=/story/design-system-colors--color-palette"
        />
        <QuickLinkCard
          title="🔤 Typography"
          description="Type scale with line-heights and weights"
          href="/?path=/story/design-system-typography--type-scale"
        />
        <QuickLinkCard
          title="📏 Spacing"
          description="Visual rhythm and spacing scale"
          href="/?path=/story/design-system-spacing--spacing-scale"
        />
        <QuickLinkCard
          title="🎭 Motion"
          description="Timing, easing, and animation principles"
          href="/?path=/story/design-system-motion--timing-scale"
        />
      </div>

      <div className="bg-muted p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Getting Started (Designers)</h2>
        <ol className="space-y-2">
          <li>1. Browse <strong>Foundations</strong> (01-11) to understand tokens and principles</li>
          <li>2. Explore <strong>Component Patterns</strong> (11) to see how tokens combine</li>
          <li>3. Check <strong>Interactive Examples</strong> (13-15) for live demos</li>
        </ol>
      </div>

      <div className="bg-accent/5 p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">What's New</h2>
        <ul className="space-y-1 text-sm">
          <li>✅ 15 foundation stories with visual-first documentation</li>
          <li>✅ Theme toggle for easy light/dark switching</li>
          <li>✅ Component patterns with token recipes</li>
          <li>🚧 Usage guidelines for top components (coming soon)</li>
        </ul>
      </div>
    </div>
  ),
};
```

**Evidence:** Landing page appears at top of Design System section.

**Estimated:** 1 hour

---

### Story 5.3: Component Usage Guidelines

**User Story:** As a designer, I want clear "when to use" guidelines for each component so I don't have to guess.

**Components to Cover (Top 10):**
1. Button (when to use vs Link)
2. Input (when to use vs Textarea)
3. Checkbox (when to use vs Switch/Radio)
4. Modal (when to use vs Drawer)
5. Select (when to use vs RadioGroup)
6. Switch (when to use vs Checkbox)
7. RadioGroup (when to use vs Select)
8. Tabs (when to use vs Breadcrumb)
9. Link (when to use vs Button)
10. Badge (when to use vs Alert)

**Template (per component):**

```tsx
// Button.stories.tsx - add to existing file

export const UsageGuidelines: Story = {
  name: "📖 Usage Guidelines",
  render: () => (
    <div className="max-w-2xl space-y-6">
      <section>
        <h3 className="text-lg font-semibold">When to Use Button</h3>
        <ul className="list-disc pl-4 space-y-1">
          <li>Primary actions in a flow (Submit, Confirm, Save)</li>
          <li>Standalone actions (Create new, Upload file)</li>
          <li>Actions that advance the user toward a goal</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold">When to Use Link Instead</h3>
        <ul className="list-disc pl-4 space-y-1">
          <li>Navigating to a new page (not an action)</li>
          <li>External references (docs, help articles)</li>
          <li>Inline navigation within content</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold">Do's and Don'ts</h3>
        <div className="grid grid-cols-2 gap-4">
          <ExampleCard label="✓ Do">
            <Button>Submit</Button>
            <p className="text-sm text-muted-foreground mt-2">
              Use default variant for primary actions
            </p>
          </ExampleCard>
          <ExampleCard label="✗ Don't">
            <Button variant="link">Submit</Button>
            <p className="text-sm text-muted-foreground mt-2">
              Don't use link style for primary CTAs
            </p>
          </ExampleCard>
        </div>
      </section>
    </div>
  ),
};
```

**Evidence:** 10 components have usage guidelines stories.

**Estimated:** 3 hours (10 components × 18 min each)

---

### Story 5.4: Dark Mode Coverage

**User Story:** As a designer, I want to see all components and patterns in both light and dark themes so I can verify they work in all contexts.

**Acceptance Criteria:**
- [ ] All 15 foundation stories support theme toggle
- [ ] All pattern stories show both themes
- [ ] Dark mode is default (per Apps SDK UI convention)
- [ ] Light mode is accessible via toolbar toggle
- [ ] Contrast ratios validated in both themes

**Audit Checklist:**

```markdown
## Dark Mode Coverage Audit

### Foundation Stories (01-15)
- [ ] 01 Getting Started - works in both
- [ ] 02 Design Tokens - shows both themes
- [ ] 03 Colors - palette shown in both
- [ ] 04 Typography - renders in both
- [ ] 05 Spacing - works in both
- [ ] 06 Radius - visible in both
- [ ] 07 Sizes - renders in both
- [ ] 08 Elevation - shadows visible in both
- [ ] 09 Motion - animations work in both
- [ ] 10 Interactive States - states visible in both
- [ ] 11 Component Patterns - patterns shown in both
- [ ] 12 Iconography - icons visible in both
- [ ] 13 Interactive Playgrounds - works in both
- [ ] 14 Interactive Patterns - works in both
- [ ] 15 Keyboard Navigation - focus visible in both

### Component Stories
- [ ] Top 10 components have theme examples
- [ ] All patterns show both themes
```

**Implementation:**
```tsx
// Add to stories that need dark mode examples
export const ThemeVariants: Story = {
  name: "Theme Variants",
  render: () => (
    <div className="space-y-8 p-8">
      <div>
        <h3 className="text-sm font-medium mb-4">Dark Mode (Default)</h3>
        <div className="dark bg-background border rounded-lg p-6">
          <YourComponent />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-4">Light Mode</h3>
        <div className="light bg-background border rounded-lg p-6">
          <YourComponent />
        </div>
      </div>
    </div>
  ),
};
```

**Evidence:** All stories support theme switching, dark mode is default.

**Estimated:** 2 hours

---

### Story 5.5: Enhanced Pattern Library

**User Story:** As a designer, I want to see real-world composed examples so I can design complete interfaces.

**Patterns to Create:**

**Form Patterns:**
1. **Login Form** - Email + password + "forgot password" link + submit button
2. **Signup Form** - Name + email + password + confirm password + terms checkbox + submit
3. **Search Form** - Search input + filter dropdown + sort dropdown + search button
4. **Filter Form** - Multiple checkboxes + date range + apply/reset buttons

**Card Patterns:**
5. **Article Card** - Image + category tag + title + excerpt + "read more" link
6. **Product Card** - Image + title + price + "add to cart" button + rating
7. **Profile Card** - Avatar + name + role + bio + social links + "connect" button
8. **Stats Card** - Icon + label + big number + trend indicator

**Navigation Patterns:**
9. **Breadcrumb** - Home > Category > Subcategory > Current
10. **Tabs with Content** - Tab list + tab panel + action buttons
11. **Sidebar Nav** - Logo + nav links + active state + collapse button
12. **Top Nav** - Logo + nav links + search + avatar + notifications

**Data Display Patterns:**
13. **Table with Filters** - Table + search input + column filters + pagination
14. **List with Actions** - List items + actions menu + delete confirmation
15. **Grid with Cards** - Responsive grid + card items + load more button

**Template:**

```tsx
// patterns/Forms.stories.tsx
export const LoginForm: Story = {
  name: "Login Form",
  render: () => (
    <form className="max-w-md space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@example.com" />
        <p className="text-sm text-muted-foreground mt-1">
          We'll email you a magic link for login
        </p>
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" />
        <div className="flex justify-between items-center mt-1">
          <Checkbox id="remember" label="Remember me" />
          <Link href="/forgot-password">Forgot password?</Link>
        </div>
      </div>

      <Button type="submit" className="w-full">Sign in with Email</Button>

      <p className="text-sm text-center text-muted-foreground">
        Don't have an account? <Link href="/signup">Sign up</Link>
      </p>
    </form>
  ),
};
```

**Evidence:** Pattern library has 20+ real-world examples.

**Estimated:** 3 hours (15 patterns × 12 min each)

---

## Test Strategy

### Visual Regression Tests

**Tool:** Argos (already configured)

**Test Coverage:**
- [ ] Theme toggle functionality
- [ ] All foundation stories in both themes
- [ ] All pattern examples in both themes
- [ ] Usage guidelines stories render correctly

**Baseline:** Capture after Story 5.1 (theme toggle) complete.

### Accessibility Tests

**Tool:** `@storybook/addon-a11y` (already configured)

**Test Coverage:**
- [ ] Theme toggle maintains focus
- [ ] All new stories pass axe scan
- [ ] Dark mode contrast ratios pass WCAG AA
- [ ] Keyboard navigation works in all patterns

### Manual QA Checklist

- [ ] Theme toggle works in all browsers (Chrome, Firefox, Safari)
- [ ] Dark mode is default, light mode accessible
- [ ] All patterns render correctly in both themes
- [ ] Usage guidelines are clear to non-technical users
- [ ] Landing page provides clear navigation path

---

## Release & Measurement Plan

### Phase 5 Release

**Timeline:** Week of 2026-02-03
**Rollout:** Feature flag disabled (default to new behavior)
**Monitoring:**
- Theme toggle usage (track clicks via Storybook analytics)
- Landing page visits
- Usage guidelines page views
- Pattern section usage

**Success Criteria:**
- ≥10 theme toggle clicks/day after 1 week
- ≥50 unique users view landing page in first month
- Designer feedback ≥4.5/5 satisfaction

### Rollback Plan

If any issue causes:
- Storybook build time >90 seconds
- Bundle size increase >15%
- Accessibility regression
- Breaking changes in consuming applications

**Rollback:** Revert the story's changes, document issue, retry with smaller scope.

---

## Key Assumptions & Risks

### Assumptions

1. **Theme addon is compatible** - `@storybook/addon-themes` works with Apps SDK UI theme system
   - *Mitigation:* Test with top 10 components before release
   - *Evidence:* Apps SDK UI uses standard `data-theme` attribute

2. **Designers will use guidelines** - Usage guidelines will be read and followed
   - *Mitigation:* Keep guidelines concise and visual
   - *Evidence Gap:* No current designer usage metrics

3. **Dark mode is desired** - Making dark mode default aligns with user preference
   - *Mitigation:* Monitor theme toggle usage, adjust if needed
   - *Evidence:* Apps SDK UI defaults to dark mode

### Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Theme toggle conflicts with Apps SDK UI | High (breaks components) | Low | Test in preview, document issues |
| Designer adoption is low | Medium (wasted effort) | Medium | Survey designers first, iterate |
| Dark mode contrast issues | Medium | Low | Run contrast checks, fix issues |
| Pattern examples become outdated | Low | Medium | Keep patterns simple, document clearly |

---

## Evidence Map

| Section | Evidence Source | Status |
|---------|----------------|--------|
| Foundation stories complete | Phase 4 spec Epic 6 | ✅ Verified |
| Theme addon compatibility | Storybook docs | ⚠️ To be tested |
| Current theme implementation | `.storybook/preview.tsx` | ✅ Verified |
| Component story count | Glob `**/*.stories.tsx` | ✅ Verified |
| Designer usage metrics | None | ⚠️ Evidence Gap |

**Evidence Gaps:**
1. No current designer usage metrics - validate assumptions before Phase 5
2. Theme addon compatibility untested - verify in Story 5.1

---

## Next Steps

### Immediate (This Week)
1. **Install theme addon** - 15 min task, unblock Story 5.1
2. **Create landing page** - Update existing GettingStarted story
3. **Audit dark mode coverage** - Identify gaps before fixing

### Short Term (Next 2 Weeks)
1. **Complete Stories 5.1-5.3** - Theme toggle, landing page, usage guidelines
2. **Gather feedback** - Survey designers after Story 5.3 complete
3. **Start Story 5.4** - Dark mode coverage based on audit

### Long Term (Next Month)
1. **Complete Story 5.5** - Enhanced pattern library
2. **Measure adoption** - Track usage metrics, iterate
3. **Plan Phase 6** - Figma integration, advanced features

---

## Definition of Done

Phase 5 is complete when:

**Theme Toggle:**
- [ ] `@storybook/addon-themes` installed and configured
- [ ] Sun/moon icon visible in toolbar
- [ ] Toggle works across all stories
- [ ] Dark mode is default, light mode accessible

**Landing Page:**
- [ ] Welcome message with philosophy
- [ ] Quick links to foundations
- [ ] Getting Started guide (3 steps)
- [ ] What's New section

**Usage Guidelines:**
- [ ] 10 components have guidelines stories
- [ ] "When to use" sections clear
- [ ] Do's and Don'ts examples visible

**Dark Mode:**
- [ ] All 15 foundations support theme toggle
- [ ] All patterns show both themes
- [ ] Contrast validated in both themes

**Pattern Library:**
- [ ] 15+ real-world patterns documented
- [ ] Each pattern shows both themes
- [ ] Code examples provided

**Quality:**
- [ ] All new stories pass accessibility scan
- [ ] Storybook build time ≤60 seconds
- [ ] Bundle size increase ≤10%

---

**End of Specification**

*This spec is living. Update as decisions change, evidence emerges, or feedback arrives.*
