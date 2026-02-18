# Epic: Storybook Enhancement

**Status:** Planning
**Priority:** P2 (Can run parallel with Epic 1)
**Estimated:** 60-80 hours
**Created:** 2026-01-28
**Dependencies:** None
**Owner:** TBD

## Overview

Systematic enhancement of Storybook stories to improve documentation, enable visual regression testing, and ensure accessibility patterns are demonstrated. This epic addresses the gaps identified in Epic 0.1's audit.

## Success Criteria

| Criterion | Current | Target | Measurement |
|-----------|---------|--------|-------------|
| **Components with Default state** | ~100% | 100% | All stories have basic render |
| **Components with Hover/Focus states** | ~5% | 90% | Explicit state stories |
| **Components with Disabled state** | ~20% | 90% | Applicable components |
| **Components with Error/Loading states** | ~10% | 80% | Applicable components |
| **Components with Reduced motion** | 0% | 100% | Global parameter added |
| **Components with Interaction tests** | ~20% | 80% | play() functions |
| **Accessibility tests** | 0% | 100% | axe-core integration |

## Stories

### Story 1: Reduced Motion Testing (30 hours)

**Priority:** P1 (Accessibility requirement)
**Effort:** ~30 min per component × 60 components

**Description:** Add reduced motion global parameter to all component stories to verify animations respect user preferences.

**Implementation Pattern:**
```tsx
// Add to each component's .stories.tsx
export const ReducedMotion: Story = {
  parameters: {
    reducedMotion: 'reduce',
  },
  render: (args) => <Component {...args} />,
};
```

**Acceptance Criteria:**
- [ ] All 60 component stories have ReducedMotion variant
- [ ] Animations are disabled or use reduced duration
- [ ] No layout shifts when reduced motion is enabled
- [ ] Documented in pattern library

### Story 2: Interaction Tests (15 hours)

**Priority:** P1 (Automated regression)
**Effort:** ~30 min per form component × 30 components

**Description:** Add interaction tests for form inputs and interactive components.

**Components to Cover:**
- Form inputs: Input, Select, Checkbox, Radio, Switch, Slider, DatePicker
- Buttons: Button variants, icon buttons
- Navigation: Tabs, Menu, Breadcrumb, Pagination
- Overlays: Dialog, Sheet, Popover, Tooltip
- Chat: ChatInput, ChatMessages, Sidebar

**Implementation Pattern:**
```tsx
export const KeyboardNavigation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
  },
};
```

**Acceptance Criteria:**
- [ ] All form inputs have focus/blur tests
- [ ] All interactive components have keyboard navigation tests
- [ ] Click/tap interactions verified
- [ ] State transitions tested (open/close, expand/collapse)

### Story 3: Explicit State Stories (10 hours)

**Priority:** P2 (Documentation value)
**Effort:** ~15 min per component × 40 components

**Description:** Add explicit hover/focus/disabled/error states using Storybook's pseudo states.

**Implementation Pattern:**
```tsx
export const Hovered: Story = {
  parameters: { pseudo: { hover: true } },
  render: (args) => <Button {...args}>Hover me</Button>,
};

export const Focused: Story = {
  parameters: { pseudo: { focus: true } },
  render: (args) => <Button {...args}>Focus me</Button>,
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => <Button {...args}>Disabled</Button>,
};

export const Error: Story = {
  render: (args) => (
    <div>
      <Label>Email</Label>
      <Input error="Invalid email" {...args} />
    </div>
  ),
};
```

**Acceptance Criteria:**
- [ ] Interactive components show hover state
- [ ] Focusable components show focus state
- [ ] Form inputs show disabled state
- [ ] Form inputs show error state with message
- [ ] Loading state shown where applicable

### Story 4: Loading/Required States (15 hours)

**Priority:** P2 (Pattern documentation)
**Effort:** ~15 min per applicable component × 25 components

**Description:** Document loading and required states using StatefulComponentProps.

**Components:** Form inputs, Buttons, Cards, Data display components

**Implementation Pattern:**
```tsx
export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading...',
  },
};

export const Required: Story = {
  render: (args) => (
    <div>
      <Label htmlFor="required">Required Field *</Label>
      <Input id="required" required {...args} />
    </div>
  ),
};
```

**Acceptance Criteria:**
- [ ] Async components show loading state
- [ ] Form fields show required indicator
- [ ] Skeleton states documented
- [ ] Empty states documented

### Story 5: Accessibility Testing (10 hours)

**Priority:** P1 (Quality gate)
**Effort:** Initial setup + ongoing maintenance

**Description:** Integrate axe-core for automated accessibility testing in Storybook.

**Implementation:**
```bash
pnpm add -D @storybook/addon-a11y
```

```tsx
// .storybook/main.ts
import { withA11y } from '@storybook/addon-a11y';

export const addons = [
  withA11y,
  // ... other addons
];
```

**Acceptance Criteria:**
- [ ] axe-core addon installed and configured
- [ ] All stories pass automated a11y checks
- [ ] Violations documented and triaged
- [ ] Critical violations block completion

## Pattern Templates

### Button Pattern (Gold Standard)
Reference: `packages/ui/src/components/ui/base/button/button.stories.tsx`

```tsx
export const Default: Story = { args: { children: 'Button' } };
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = {
  args: { disabled: true, children: <IconRefresh className="animate-spin" /> }
};
export const Hovered: Story = {
  parameters: { pseudo: { hover: true } },
  args: { children: 'Hover me' },
};
export const Focused: Story = {
  parameters: { pseudo: { focus: true } },
  args: { children: 'Focus me' },
};
export const ReducedMotion: Story = {
  parameters: { reducedMotion: 'reduce' },
  args: { children: 'Reduced Motion' },
};
export const KeyboardNavigation: Story = {
  play: async ({ canvasElement }) => {
    // ... keyboard tests
  },
};
```

### Form Input Pattern
Reference: `packages/ui/src/components/ui/base/Input/Input.stories.tsx`

```tsx
export const Default: Story = { args: { placeholder: 'Enter text...' } };
export const Disabled: Story = { args: { disabled: true } };
export const WithError: Story = {
  render: (args) => (
    <div>
      <Label htmlFor="email">Email</Label>
      <Input id="email" error="Invalid email" {...args} />
    </div>
  ),
};
export const Required: Story = {
  render: (args) => (
    <div>
      <Label htmlFor="required">Required *</Label>
      <Input id="required" required {...args} />
    </div>
  ),
};
```

### Overlay Pattern
Reference: `packages/ui/src/components/ui/feedback/Dialog/dialog.stories.tsx`

```tsx
export const Default: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
      <DialogContent>Content</DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    // ... interaction tests
  },
};
```

## Execution Order

1. **Week 1:** Story 1 (Reduced Motion) - Critical accessibility
2. **Week 2:** Story 2 (Interaction Tests) - Parallel with Story 5
3. **Week 3:** Story 3 (Explicit States) + Story 4 (Loading/Required)
4. **Week 4:** Story 5 (A11y Testing) + Validation

## Dependencies

- **Phase 4 Epic 1:** Test coverage improvements can inform Storybook stories
- **Phase 4 Epic 2:** Manual a11y testing will validate Storybook a11y tests

## Rollout Plan

1. **Batch 1:** High-impact components (Button, Input, Dialog, Form) - 10 components
2. **Batch 2:** Form components (Select, Checkbox, Radio, Slider) - 8 components
3. **Batch 3:** Navigation components (Tabs, Menu, Breadcrumb, Pagination) - 8 components
4. **Batch 4:** Overlay components (Popover, Tooltip, Sheet, Drawer) - 8 components
5. **Batch 5:** Chat components (ChatInput, ChatMessages, Sidebar) - 8 components
6. **Batch 6:** Remaining components - 18 components

## Notes

- Reduced motion testing is critical for users with vestibular disorders
- Interaction tests provide automated regression coverage
- Explicit state stories serve as living documentation
- A11y testing with axe-core catches ~40% of WCAG issues automatically
