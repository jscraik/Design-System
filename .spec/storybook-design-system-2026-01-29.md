# Storybook Design System Specification

**Schema Version:** 1
**Status:** Draft
**Date:** 2026-01-29
**Owner:** Design System Team
**Review Cycle:** Weekly during Phase 4, then monthly

---

## Executive Summary

This specification transforms the existing Storybook setup from a **component library** into a **gold-standard professional design system** following modern techniques from industry leaders:

- **Emil Kowalski**: Motion as communication, precision timing/easing, "less but better" animation
- **Jhey Tompkins**: CSS-first creativity, playful but performant micro-interactions
- **Jenny Wen**: Deliberate judgment, clarity over process, delight that serves purpose

**Current State:**
- ✅ 34/34 base components have stories
- ✅ Autodocs enabled
- ✅ Accessibility configured (WCAG 2.2 AA)
- ✅ Theme switching via backgrounds (manual)
- ✅ Design tokens documented (developer-centric)

**Target State:**
- ✅ Visual-first documentation for designers
- ✅ Theme toolbar toggle
- ✅ Usage guidelines per component
- ✅ Component patterns section
- ✅ Motion design system
- ✅ Do's and Don'ts examples

**Evidence Gap:** No formal design system documentation exists. This spec creates it from first principles.

---

## Problem & Job (JTBD)

### Primary Problem
The current Storybook setup serves developers well but fails designers who need to understand:
- When to use Component A vs Component B
- How components compose into patterns
- Visual scale of typography/spacing/color
- Motion principles and timing
- Do's and Don'ts of usage

**Current Workaround:** Designers ask developers or dig into component source code.

**Why Now:**
- Phase 4 cleanup in progress
- Manual quality gates require better design-system surface
- Team scaling requires self-service design documentation

### Jobs to be Done

| Job | User | Current Pain | Target Outcome |
|-----|------|--------------|----------------|
| Find the right component | Designer | Scan 34 stories, still unsure | Clear "when to use" guidelines |
| Understand spacing scale | Designer | Read CSS variables | Visual rhythm examples |
| Verify theme compliance | Designer | Toggle backgrounds dropdown | One-click theme toolbar toggle |
| Learn motion patterns | Developer | No timing documentation | Motion spec with durations/easing |
| Compose layouts | Designer | Guess component combinations | Pattern library with examples |

---

## Success Criteria

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| **Designer Onboarding Time** | ~2 hours | ≤30 minutes | Time-to-first-component-used |
| **Theme Switches Per Session** | ~0 (hidden) | ≥5 | Toolbar toggle usage |
| **Pattern Usage** | Unknown | 80% of forms use patterns | Component telemetry |
| **Documentation Coverage** | 60% (props only) | 95% (usage + patterns) | Content audit |
| **Designer Satisfaction** | Unknown | ≥4.5/5 | Quarterly survey |

### Guardrail Metrics
- Storybook build time: ≤60 seconds
- Bundle size increase: ≤10%
- Component story count: no decrease (maintain 34/34)
- Accessibility compliance: 100% (maintain WCAG 2.2 AA)

---

## Scope

### In-Scope (MVP)

**Phase 1: Quick Wins (2 hours)**
- Theme toolbar toggle via `@storybook/addon-themes`
- Visual typography scale page
- Design system landing page

**Phase 2: Designer Experience (4 hours)**
- Usage guidelines for top 10 components (Button, Input, Checkbox, Modal, Select, Switch, RadioGroup, Tabs, Link, Badge)
- Component patterns section (forms, cards, navigation)
- Do's and Don'ts examples

**Phase 3: Motion System (2 hours)**
- Motion design system documentation
- Duration/easing tokens
- Reduced-motion examples

**Phase 4: Polish (2 hours)**
- Component status badges
- Copy-to-clipboard for tokens
- Responsive breakpoint documentation

### Out-of-Scope (MVP)

- Figma integration bridge (Phase 5)
- Design token editor (Phase 5)
- Component variant generator (Phase 5)
- Storybook embed in external docs (Phase 6)
- Interactive motion playground (Phase 6)

---

## Design System Architecture

### Information Architecture

```
Storybook
├── Overview (Welcome)
│   ├── Quick Start (for designers)
│   ├── What's New
│   └── Changelog
│
├── Design System (tokens + principles)
│   ├── Colors (visual swatches + semantics)
│   ├── Typography (visual scale with line-heights)
│   ├── Spacing (visual rhythm)
│   ├── Elevation/Shadow (visual depth)
│   ├── Motion (timing curves + durations)
│   └── Principles (when to use what)
│
├── Components (organized by mental model)
│   ├── Actions (Button, Link, IconButton)
│   ├── Inputs (Input, Textarea, Select, Checkbox, Switch, RadioGroup, Slider)
│   ├── Feedback (Alert, Toast, Skeleton, Spinner, Progress)
│   ├── Navigation (Tabs, Breadcrumb, Pagination, Menu)
│   ├── Overlays (Modal, Drawer, Popover, Tooltip, Dropdown)
│   ├── Display (Card, Table, List, Badge, Avatar)
│   └── Layout (Container, Grid, Stack, Spacer)
│
├── Patterns (composed examples)
│   ├── Forms (label + input + error + action)
│   ├── Cards (header + body + footer)
│   ├── Navigation (breadcrumb + tabs + back)
│   └── Data Display (table + filters + pagination)
│
└── Guidelines (when to use)
    ├── Accessibility (keyboard, focus, screen reader)
    ├── Motion (when to animate, when to skip)
    ├── Responsive (breakpoints, container queries)
    └── Dark Mode (theme switching, color adaptation)
```

### Mental Model Alignment

| Concept | What Users Believe | What We Must Reinforce | What We Must Never Imply |
|---------|-------------------|------------------------|--------------------------|
| Component Selection | "This button looks right" | "This button is for primary actions" | "Any button works anywhere" |
| Spacing | "Pick what looks good" | "Use the scale; it's intentional" | "Random spacing is acceptable" |
| Motion | "More animation = better" | "Motion communicates state change" | "Animation is decoration" |
| Themes | "Light/dark are separate" | "Same components, different presentation" | "Components behave differently by theme" |

---

## Key Principles

### 1. Visual First, Code Second

**Jenny Wen's Principle:** Clarity over process.

Designers see the visual output first; code is secondary. Each token page must show:
- Visual swatch/scale (large, clear)
- Token name (secondary)
- Code snippet (collapsible)

```tsx
// Bad: Code-first token display
<pre>colors.bg.dark1 = "#212121"</pre>
<div style={{ backgroundColor: "#212121" }} />

// Good: Visual-first token display
<div className="flex gap-4 items-center">
  <div className="w-16 h-16 rounded-lg" style={{ backgroundColor: "#212121" }} />
  <div>
    <div className="font-medium">Background Dark 1</div>
    <div className="text-sm text-muted-foreground font-mono">colors.bg.dark1</div>
  </div>
</div>
```

### 2. Motion as Communication

**Emil Kowalski's Principle:** Motion teaches users what happened.

Every animation must answer: "What state changed and why?"

**Motion Decision Tree:**
```
Is the user waiting for feedback?
├── Yes: Use micro-interaction (press, hover, drag)
└── No: Skip animation

Is the user navigating?
├── Yes: Use transition (enter/exit, 150-300ms)
└── No: Use instant state change

Is this a celebration moment?
├── Yes: Use expressive motion (confetti, particles)
│   └── BUT: Respect prefers-reduced-motion
└── No: Use simple transition
```

**Duration Guidelines (Emil's influence):**
- Micro-interactions: 100-150ms (fast feedback)
- Navigation transitions: 200-300ms (perceivable but not slow)
- Complex overlays: 300-400ms (max for patience)
- Celebrations: 500-1000ms (intentional delight)

### 3. CSS-First Creativity

**Jhey Tompkins' Principle:** Prefer CSS primitives over heavy JS.

Use transforms, masks, clip-path, filters before reaching for animation libraries.

```css
/* Bad: JS-driven animation */
useEffect(() => {
  requestAnimationFrame(() => {
    element.style.transform = `scale(${scale})`;
  });
}, [scale]);

/* Good: CSS transition */
style={{ transform: `scale(${scale})`, transition: 'transform 150ms ease-out' }}
```

**CSS-First Micro-Interactions:**
- Press: `transform: scale(0.98)` (active state)
- Hover: `transform: translateY(-1px)` (lift effect)
- Focus: `box-shadow: 0 0 0 2px var(--ring)` (ring expands)
- Shimmer: `background: linear-gradient(90deg, ...)` (no JS)

### 4. Less But Better

**Emil + Jenny's Principle:** If you can't justify it, simplify.

Before adding any motion:
1. Name the moment (what action?)
2. Identify the feeling (what emotion?)
3. Choose the simplest motion that communicates it

**Simplification Checklist:**
- [ ] Does this animation teach the user something?
- [ ] Is the timing intentional (not arbitrary)?
- [ ] Does it respect reduced motion?
- [ ] Is it implemented with CSS (not JS)?

If any answer is "no", remove the animation.

---

## Build Breakdown

### Epic 1: Theme Toolbar Toggle (30 min)

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

---

### Epic 2: Visual Typography Scale (1 hour)

**User Story:** As a designer, I want to see the typography scale visually so I can choose the right size/weight for my content.

**Acceptance Criteria:**
- [ ] All font sizes displayed visually (not just numbers)
- [ ] Line-height ratios shown in context
- [ ] Font weights with examples
- [ ] Responsive breakpoints indicated
- [ ] Copy-to-clipboard for token values

**File:** `packages/ui/src/storybook/design-system/Typography/Typography.stories.tsx`

```tsx
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Design System/Typography",
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const TypeScale: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      {/* Display */}
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground uppercase tracking-wide">Display</div>
        <div className="text-6xl font-bold">Aa</div>
        <div className="text-sm text-muted-foreground">
          60px / 1.2 line-height / 700 weight
        </div>
      </div>

      {/* H1-H6, Body, Caption, etc. */}
      {/* Each shows visual sample + token name + usage guidelines */}
    </div>
  ),
};

export const FontWeight: Story = {
  render: () => (
    <div className="space-y-4">
      {[
        { weight: 400, name: "Regular", usage: "Body text" },
        { weight: 500, name: "Medium", usage: "Emphasized text" },
        { weight: 600, name: "Semibold", usage: "Headings" },
        { weight: 700, name: "Bold", usage: "Display text" },
      ].map(({ weight, name, usage }) => (
        <div key={weight} className="flex items-baseline gap-4">
          <div className={`font-${weight} text-2xl`}>Aa</div>
          <div className="flex-1">
            <div className="font-medium">{name}</div>
            <div className="text-sm text-muted-foreground">{usage}</div>
          </div>
        </div>
      ))}
    </div>
  ),
};
```

**Evidence:** Typography page shows visual scale, not just numbers.

---

### Epic 3: Design System Landing Page (30 min)

**User Story:** As a new designer, I want a landing page that explains the design system so I can quickly understand how to use it.

**Acceptance Criteria:**
- [ ] Welcome message with design system philosophy
- [ ] Quick links to key sections (Colors, Typography, Components)
- [ ] "Getting Started" for designers (3-step guide)
- [ ] What's New section (recent changes)
- [ ] Changelog link

**File:** `packages/ui/src/storybook/docs/DesignSystemLanding.stories.tsx`

```tsx
export const Welcome: Story = {
  render: () => (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Welcome to the Design System</h1>
        <p className="text-xl text-muted-foreground">
          A component library built with clarity, consistency, and accessibility in mind.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <QuickLinkCard
          title="Colors"
          description="Visual palette with semantic meanings"
          href="/?path=/docs/design-system--docs"
        />
        <QuickLinkCard
          title="Typography"
          description="Type scale with line-heights and weights"
          href="/?path=/story/design-system-typography--type-scale"
        />
        {/* More quick links */}
      </div>

      <div className="bg-muted p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Getting Started (Designers)</h2>
        <ol className="space-y-2">
          <li>1. Browse Colors and Typography to understand foundations</li>
          <li>2. Explore Components to see what's available</li>
          <li>3. Check Patterns for composed examples</li>
        </ol>
      </div>
    </div>
  ),
};
```

**Evidence:** Landing page appears at Storybook root with clear navigation.

---

### Epic 4: Usage Guidelines (2 hours)

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
            <Button variant="default">Submit</Button>
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

**Evidence:** Each top-10 component has a "📖 Usage Guidelines" story.

---

### Epic 5: Component Patterns Section (2 hours)

**User Story:** As a designer, I want to see how components compose into patterns so I can design complete interfaces.

**Patterns to Create:**

1. **Form Pattern** (label + input + error + helper)
2. **Card Pattern** (header + body + footer + actions)
3. **Navigation Pattern** (breadcrumb + tabs + back button)
4. **Data Display Pattern** (table + filters + pagination)

**File:** `packages/ui/src/storybook/patterns/Forms.stories.tsx`

```tsx
export const FormPattern: Story = {
  name: "Form with Label + Input + Error",
  render: () => (
    <form className="space-y-4 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@example.com" />
        <p className="text-sm text-muted-foreground">
          We'll never share your email with anyone else.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" />
        <p className="text-sm text-destructive">
          Password must be at least 8 characters
        </p>
      </div>

      <Button type="submit" className="w-full">Sign In</Button>
    </form>
  ),
};
```

**Evidence:** Patterns section shows 4+ composed examples.

---

### Epic 6: Motion Design System (2 hours)

**User Story:** As a designer, I want to understand the motion principles so I can design animations that feel consistent.

**Acceptance Criteria:**
- [ ] Motion philosophy documented (Emil's principles)
- [ ] Duration tokens (100ms, 150ms, 200ms, 300ms, 400ms)
- [ ] Easing curves documented (ease-out, ease-in-out, spring)
- [ ] When to animate (decision tree)
- [ ] When to skip (reduced motion, performance)
- [ ] Examples of "good" vs "bad" motion

**File:** `packages/ui/src/storybook/design-system/Motion/Motion.stories.tsx`

```tsx
export const MotionPhilosophy: Story = {
  render: () => (
    <div className="max-w-2xl space-y-6">
      <section>
        <h3 className="text-lg font-semibold">Motion as Communication</h3>
        <p className="text-muted-foreground">
          Every animation answers: "What state changed and why?"
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold">Duration Guidelines</h3>
        <div className="space-y-2">
          <DurationCard ms={100} label="Micro-interaction" example="Press, hover" />
          <DurationCard ms={200} label="Navigation" example="Tab switch, page transition" />
          <DurationCard ms={300} label="Complex overlay" example="Modal open, drawer slide" />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold">CSS-First Approach</h3>
        <pre className="bg-muted p-4 rounded text-sm">
          {`/* Good: CSS transition */}
style={{ transition: 'transform 150ms ease-out' }}

/* Bad: JS animation loop */
useEffect(() => {
  const animate = () => { /* ... */ }
  requestAnimationFrame(animate)
}, [])`}
        </pre>
      </section>
    </div>
  ),
};

export const ReducedMotion: Story = {
  render: () => (
    <div className="max-w-2xl space-y-6">
      <p className="text-muted-foreground">
        Respect user's motion preferences. Always test with:
      </p>
      <pre className="bg-muted p-4 rounded text-sm">
        {`// Chrome DevTools
Rendering → Emulate CSS media feature → prefers-reduced-motion: reduce`}
      </pre>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium">❌ Skip animations when:</h4>
          <ul className="list-disc pl-4 text-sm text-muted-foreground">
            <li>User prefers reduced motion</li>
            <li>Animation doesn't communicate state change</li>
            <li>Performance is critical (low-end devices)</li>
          </ul>
        </div>
      </div>
    </div>
  ),
};
```

**Evidence:** Motion page shows philosophy, durations, and reduced-motion guidance.

---

## Test Strategy

### Visual Regression Tests

**Tool:** Argos (already configured)

**Test Coverage:**
- [ ] Design token pages (Colors, Typography, Spacing)
- [ ] Top 10 component variants (light/dark)
- [ ] Pattern examples (forms, cards, navigation)
- [ ] Theme toggle functionality

**Baseline:** Capture after Phase 1 complete.

### Accessibility Tests

**Tool:** `@storybook/addon-a11y` (already configured)

**Test Coverage:**
- [ ] All new pages pass axe scan
- [ ] Theme toggle maintains focus
- [ ] Reduced-motion examples are testable
- [ ] Token pages have semantic structure

### Manual QA Checklist

**Per Epic:**
- [ ] Theme toggle works in all browsers (Chrome, Firefox, Safari)
- [ ] Typography scale renders correctly at 100%/200% zoom
- [ ] Copy-to-clipboard works for all tokens
- [ ] Usage guidelines are clear to non-technical users
- [ ] Patterns render in light/dark themes

---

## Release & Measurement Plan

### Phase 1 Release (Quick Wins)

**Timeline:** Week of 2026-02-03
**Rollout:** Feature flag disabled (default to new behavior)
**Monitoring:**
- Theme toggle usage (track clicks)
- Typography page views
- Design system landing page visits

**Success Criteria:**
- ≥10 theme toggle clicks/day after 1 week
- ≥50 unique users view typography page in first month

### Phase 2 Release (Designer Experience)

**Timeline:** Week of 2026-02-10
**Rollout:** Gradual (top 10 components first)
**Monitoring:**
- Usage guidelines page views per component
- Pattern section usage
- Designer feedback (survey)

**Success Criteria:**
- ≥80% of top-10 components have guidelines
- ≥20 pattern page views/day after 1 month

### Phase 3 Release (Motion System)

**Timeline:** Week of 2026-02-17
**Rollout:** Documentation only (no code changes)
**Monitoring:**
- Motion page views
- Reduced-motion test page views
- Component animation consistency (audit)

**Success Criteria:**
- Motion philosophy cited in 5+ code reviews
- Zero new animations that violate principles

### Kill Switch

If any phase causes:
- Storybook build time >90 seconds
- Bundle size increase >15%
- Accessibility regression

**Rollback:** Revert the epic's stories, document issue, retry with smaller scope.

---

## Key Assumptions & Risks

### Assumptions

1. **Designer audience exists** - We have designers who will use Storybook
   - *Mitigation:* Validate with 1-2 designers before Phase 1
   - *Evidence Gap:* No current designer usage metrics

2. **Theme toggle doesn't break existing stories** - Current theme logic is compatible
   - *Mitigation:* Test top 10 components in preview before release
   - *Evidence:* Theme logic in `preview.tsx` line 145-162

3. **Visual-first format fits current Stories** - Existing stories can accommodate new sections
   - *Mitigation:* Add as separate stories, don't modify existing ones
   - *Evidence:* Current story structure supports multiple export stories

### Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Theme toggle conflicts with Apps SDK UI | High (breaks components) | Low | Test in preview, document issues |
| Designer adoption is low | Medium (wasted effort) | Medium | Survey designers first, iterate based on feedback |
| Bundle size increase >10% | Medium | Low | Use code splitting for new docs |
| Motion documentation misinterpreted | Low | Medium | Clear examples, pair with devs |

---

## Evidence Map

| Section | Evidence Source | Status |
|---------|----------------|--------|
| Current Storybook state | `.storybook/main.ts`, `.storybook/preview.tsx` | ✅ Verified |
| Component story count | Glob `**/*.stories.tsx` (34 files) | ✅ Verified |
| Existing design tokens | `packages/ui/src/storybook/design-system/DesignTokens.stories.tsx` | ✅ Verified |
| Theme logic implementation | `.storybook/preview.tsx` lines 145-162 | ✅ Verified |
| Designer usage metrics | None | ⚠️ Evidence Gap |
| Figma integration requirements | None | ⚠️ Out of Scope (MVP) |
| Motion principles | Emil Kowalski references (transcripts) | ✅ Referenced |
| CSS-first patterns | Jhey Tompkins references (transcripts) | ✅ Referenced |
| Usage guidelines template | None | ⚠️ To be created |

**Evidence Gaps:**
1. No current designer usage metrics - validate assumptions before Phase 2
2. No formal usage guideline examples - create from best practices
3. No motion baseline - audit existing animations before documenting principles

---

## Next Steps

### Immediate (This Week)
1. **Validate with designers** - Show 2-3 designers current Storybook, ask what's missing
2. **Install theme addon** - 15 min task, unblock Phase 1
3. **Create typography page** - Test visual-first format before committing to pattern

### Short Term (Next 2 Weeks)
1. **Complete Phase 1** - Theme toggle + typography + landing page
2. **Gather feedback** - Survey designers after Phase 1 release
3. **Start Phase 2** - Usage guidelines for top 5 components first

### Long Term (Next Month)
1. **Complete Phase 2-4** - Full design system experience
2. **Measure adoption** - Track usage metrics, iterate
3. **Plan Phase 5** - Figma integration, advanced features

---

## Appendices

### A. Emil Kowalski's Motion Principles

From transcript analysis:

1. **Motion is communication** - Every animation teaches something
2. **Duration matters** - 100ms (fast), 200-300ms (navigation), 500ms+ (celebration)
3. **Easing is intent** - `ease-out` for entry, `ease-in` for exit, `ease-in-out` for movement
4. **Less is better** - If you can't justify it, simplify
5. **Reduced motion is mandatory** - Always provide fallback

**Key Quote:** "Best animation is no animation when it doesn't add clarity or feedback."

### B. Jhey Tompkins' CSS-First Principles

From transcript analysis:

1. **CSS transforms over JS** - `transform`, `opacity` are GPU-accelerated
2. **Avoid layout thrash** - Never animate `width`, `height`, `top`, `left`
3. **Micro-interactions are systems** - States, durations, reduced-motion included
4. **Playful but performant** - `clip-path`, `mask`, `filter` for creative effects
5. **Test at 60fps** - Use Chrome DevTools Performance tab

**Key Quote:** "Prefer CSS-first primitives and shipable defaults."

### C. Jenny Wen's Deliberate Judgment

From transcript analysis:

1. **Clarity over process** - Don't document for documentation's sake
2. **Delight serves purpose** - "Just to make people smile" is a valid reason
3. **Simplify decisions** - Reduce cognitive load for users
4. **Test with real users** - Observe, don't assume
5. **Ship quality, not quantity** - One polished feature > three half-baked

**Key Quote:** "Make the default path effortless."

---

**End of Specification**

*This spec is living. Update as decisions change, evidence emerges, or feedback arrives.*
