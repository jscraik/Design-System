# Phase 3: Component Migration Plan

**Status:** Planning Phase
**Timeline:** Weeks 5-8 (6-8 weeks total)
**Target:** Migrate all UI components to new design system with hybrid pattern

## Overview

This plan details the component migration phase for transforming AStudio components to the new DesignStudio architecture. The migration will focus on implementing the hybrid component pattern, adopting the enhanced token system, and establishing comprehensive testing infrastructure.

## 1. Component Inventory & Priority Order

### Current Component Structure (as of 2026-01-26)

| Category | Components | Count | Priority | Dependencies |
|----------|------------|-------|----------|--------------|
| **Base Components** | Button, Input, Textarea, Label, Select, Checkbox, Switch, Radio, Toggle, Accordion, Avatar, Badge, Card, Separator, Skeleton, Slider, Switch, Table | 20 | **1** | None - foundation layer |
| **Layout Components** | AspectRatio, Collapsible, DirectionProvider, Resizable, ScrollArea, SectionHeader, Transition | 7 | **2** | Base, Tokens |
| **Navigation** | Breadcrumb, Carousel, Menubar, NavigationMenu, Pagination, Sidebar, Tabs, ModelBadge, ModeSelector, ViewModeToggle | 10 | **3** | Base, Layout |
| **Forms** | Combobox, DatePicker, Form, RangeSlider, TagInput | 5 | **4** | Base, Navigation |
| **Data Display** | Chart, CodeBlock, EmptyMessage, Image, Indicator, Markdown, Progress | 7 | **5** | Base, Layout |
| **Feedback** | AlertDialog, Dialog, ErrorBoundary, Toast, Spinner, Skeleton | 6 | **6** | Base, Overlays |
| **Overlays** | Command, ContextMenu, ContextTag, Drawer, DropdownMenu, HoverCard, Modal, Popover, Sheet, Tooltip | 11 | **7** | Base, Navigation |
| **Chat Components** | ChatUIRoot, ChatHeader, ChatInput, ChatMessages, ChatShell, ChatSidebar, AttachmentMenu, ChatActions | 8 | **8** | Base, Forms, Overlays |

### Migration Priority Order

1. **Base Components (Week 5)**
   - **Why**: Foundation layer for everything else
   - **Strategy**: Migrate simple components first, complex ones last
   - **Order**: Button, Label, Select → Checkbox, Switch → Input, Textarea → Slider → Accordion → Table → Skeleton
   
2. **Layout Components (Week 5)**
   - **Why**: Enable flexible layouts needed by other components
   - **Strategy**: Minimal changes, focus on spacing tokens
   - **Order**: SectionHeader → ScrollArea → Resizable → DirectionProvider → Collapsible → Transition

3. **Forms Components (Week 6)**
   - **Why**: Core user input patterns
   - **Strategy**: Hybrid pattern validation with form state
   - **Order**: Input, Textarea, Label → Select → Checkbox, Switch → Radio → Toggle → Combobox → TagInput → DatePicker

4. **Navigation Components (Week 6-7)**
   - **Why**: Application structure
   - **Strategy**: Complex state management, focus accessibility
   - **Order**: Tabs, ModelBadge → Breadcrumb → NavigationMenu → Sidebar → Pagination → Carousel → Menubar

5. **Overlays Components (Week 7)**
   - **Why**: Modal patterns for complex interactions
   - **Strategy**: Focus on focus management, z-index tokens
   - **Order**: Modal, Dialog → Popover → Tooltip → DropdownMenu → Sheet → HoverCard → Command

6. **Data Display Components (Week 7)**
   - **Why**: Content presentation
   - **Strategy**: Minimal changes, focus on tokens
   - **Order**: EmptyMessage → Progress → Card → Image → CodeBlock → Markdown → Chart → Indicator

7. **Chat Components (Week 8)**
   - **Why**: Primary user-facing components
   - **Strategy**: Complex state, hybrid pattern validation
   - **Order**: ChatShell → ChatHeader → ChatMessages → ChatInput → ChatSidebar → ChatUIRoot → AttachmentMenu

## 2. Testing Infrastructure Setup

### Current Testing Assets

- **Existing**: Vitest, Testing Library, vitest-axe, Chromatic
- **Target**: Playwright + Argos + Jest-axe for 80% smart coverage
- **Strategy**: Incremental migration, preserving existing tests

### Test Infrastructure Blueprint

#### A. Playwright Component Testing (80% Coverage)

```typescript
// packages/ui/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'src/playwright',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
});
```

#### B. Visual Regression with Argos

```json
// packages/ui/argos.config.json
{
  "publicDir": "dist",
  "buildDir": "build",
  "playwrightConfig": "playwright.config.ts",
  "screenshotsDir": "screenshots",
  "baseUrl": "http://localhost:4173",
  "branches": ["main"],
  "ignore": ["node_modules", ".git", "dist", "build"],
  "diffDir": "diffs",
  "updateSnapshots": false
}
```

#### C. Accessibility Testing with Jest-axe

```typescript
// packages/ui/tests/a11y.test.ts
import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@testing-library/react';

expect.extend(toHaveNoViolations);

test('Components should not have accessibility violations', async () => {
  const { container } = render(<Button>Test</Button>);
  const results = await axe(container);
  
  expect(results).toHaveNoViolations();
});
```

### Test Strategy by Component Category

| Category | Test Type | Coverage Target | Tools |
|----------|-----------|----------------|-------|
| Base Components | Unit + Visual | 100% | Vitest + Argos |
| Forms | Unit + E2E + Accessibility | 90% | Playwright + Vitest + jest-axe |
| Navigation | Unit + E2E | 85% | Playwright + Vitest |
| Overlays | E2E + Accessibility | 80% | Playwright + jest-axe |
| Data Display | Unit + Visual | 75% | Vitest + Argos |
| Chat | E2E + Unit | 80% | Playwright + Vitest |

## 3. Storybook Structure

### Current Storybook Assets

- **Location**: `packages/ui/src/storybook/`
- **Stories**: Already organized by category
- **Target**: Enhanced with hybrid pattern examples

### Storybook Migration Strategy

```typescript
// packages/ui/src/components/ui/base/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Base/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    designTokens: {
      spacing: {
        xs: '0.25rem',
        md: '1rem',
        lg: '1.5rem',
      }
    }
  },
  args: {
    variant: 'primary',
    size: 'md',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Props-based API (default)
export const Default: Story = {
  args: {
    children: 'Primary Button',
  },
};

// Compound API (opt-in)
export const Compound: Story = {
  args: {
    variant: 'compound',
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Button.Compound {...args}>
        <Button.Primary>Save</Button.Primary>
        <Button.Secondary>Cancel</Button.Secondary>
      </Button.Compound>
    </div>
  ),
};

// All states
export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <Button>Default</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
      <Button error>Error</Button>
      <Button required>Required</Button>
    </div>
  ),
};
```

### Required Stories per Component

| Component Story | Description | Test Coverage |
|----------------|-------------|---------------|
| `Default` | Basic usage with props | ✅ |
| `States` | All visual states (loading, disabled, error, required) | ✅ |
| `Compound` | Hybrid pattern when applicable | ✅ |
| `Accessibility` | ARIA attributes + keyboard navigation | ✅ (forms/overlays) |
| `Responsive` | Mobile/tablet breakpoints | ✅ (navigation) |
| `DarkMode` | Dark theme variants | ✅ |

### Storybook Documentation Structure

```
packages/ui/src/components/ui/
├── base/
│   ├── Button/Button.stories.tsx
│   ├── Input/Input.stories.tsx
│   └── ...
├── forms/
│   ├── Form/Form.stories.tsx
│   └── ...
└── ...

# Add hybrid pattern documentation
packages/ui/src/stories/
├── HybridPattern.stories.tsx  # Explain hybrid pattern
├── DesignTokens.stories.tsx    # Token usage examples
└── MigrationGuide.stories.tsx  # Migration examples
```

## 4. Migration Steps per Component

### Single Component Migration Flow

```mermaid
graph TD
    A[Step 1: Pre-migration Analysis] --> B[Step 2: Import Update]
    B --> C[Step 3: Token Migration]
    C --> D[Step 4: Hybrid Pattern Implementation]
    D --> E[Step 5: Testing]
    E --> F[Step 6: Documentation]
    F --> G[Step 7: Integration]
    
    A --> A1[Analyze existing props]
    A --> A2[Identify compound slots]
    A --> A3[Check existing tests]
    
    B --> B1[Update to new package export]
    B --> B2[Remove old dependencies]
    
    C --> C1[Replace CSS classes with tokens]
    C --> C2[Update spacing/typography]
    C --> C3[Test theme switching]
    
    D --> D1[Add variant="compound" support]
    D --> D2[Create compound sub-components]
    D --> D3[Test both APIs]
    
    E --> E1[Unit tests]
    E --> E2[Visual regression]
    E --> E3[Accessibility]
    
    F --> F1[Update Storybook]
    F --> F2[Add migration examples]
    
    G --> G1[Build package]
    G --> G2[Test integration]
    G --> G3[Benchmark bundle size]
```

### Detailed Migration Example: Button Component

#### Before (Current)
```tsx
// packages/ui/src/components/ui/base/Button/Button.tsx
import { cva } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = ({ className, variant, size, loading, icon, children, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Spinner className="mr-2 h-4 w-4" />}
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};
```

#### After (Migrated)
```tsx
// packages/ui/src/components/ui/base/Button/Button.tsx
import { cva } from 'class-variance-authority';
import { cn } from '../../../lib/utils';
import { tokens } from '@design-studio/tokens';

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--ds-color-background-light-primary)] text-[var(--ds-color-text-primary)] hover:bg-[var(--ds-color-background-light-hover)]",
        destructive: "bg-[var(--ds-color-error-default)] text-[var(--ds-color-text-inverse)] hover:bg-[var(--ds-color-error-hover)]",
        outline: "border border-[var(--ds-color-border-default)] bg-[var(--ds-color-background-light-default)] hover:bg-[var(--ds-color-background-light-accent)] hover:text-[var(--ds-color-text-inverse)]",
        secondary: "bg-[var(--ds-color-background-light-secondary)] text-[var(--ds-color-text-secondary)] hover:bg-[var(--ds-color-background-light-secondary-hover)]",
        ghost: "hover:bg-[var(--ds-color-background-light-accent)] hover:text-[var(--ds-color-text-inverse)]",
        link: "text-[var(--ds-color-link-default)] underline-offset-4 hover:underline",
      },
      size: {
        default: `h-[var(--ds-spacing-10)] px-[var(--ds-spacing-8)] py-[var(--ds-spacing-4)]`,
        sm: `h-[var(--ds-spacing-9)] rounded-md px-[var(--ds-spacing-6)] py-[var(--ds-spacing-2)]`,
        lg: `h-[var(--ds-spacing-11)] rounded-md px-[var(--ds-spacing-12)] py-[var(--ds-spacing-6)]`,
        icon: `h-[var(--ds-spacing-10)] w-[var(--ds-spacing-10)]`,
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  loading?: boolean;
  error?: boolean;
  required?: boolean;
}

// Compound sub-components
interface CompoundButtonProps {
  children: React.ReactNode;
  variant?: "compound";
}

const CompoundButton: React.FC<CompoundButtonProps> = ({ children }) => (
  <div className="inline-flex gap-[var(--ds-spacing-4)]">
    {children}
  </div>
);

const PrimaryButton = Button.extend`
  variant: "primary";
`;

const SecondaryButton = Button.extend`
  variant: "secondary";
`;

// Main Button component
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, error, required, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size }),
          error && "border-[var(--ds-color-error-default)]",
          required && "after:content-['*'] after:ml-1 after:text-[var(--ds-color-error-default)]",
          className
        )}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && <Spinner className="mr-2 h-4 w-4" />}
        {children}
      </button>
    );
  }
);

// Compound API
Button.Compound = CompoundButton;
Button.Primary = PrimaryButton;
Button.Secondary = SecondaryButton;

Button.displayName = "Button";
```

### Migration Checklist per Component

- [ ] Update package.json dependencies (@design-studio/tokens)
- [ ] Replace CSS classes with CSS variables
- [ ] Add new props (error, required, loading states)
- [ ] Implement hybrid pattern (if applicable)
- [ ] Update Storybook stories
- [ ] Add accessibility tests
- [ ] Run bundle size analysis
- [ ] Test theme switching
- [ ] Update documentation

## 5. Risk Mitigation

### Risk Assessment Matrix

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Breaking Changes** | High | Critical | 1. Implement dual-mode components<br>2. Feature flags for new APIs<br>3. Deprecation warnings |
| **Bundle Size Increase** | Medium | High | 1. Tree-shaking validation<br>2. Bundle analysis per component<br>3. Lazy loading complex components |
| **Accessibility Regression** | Medium | High | 1. Automated jest-axe checks<br>2. Manual testing on key components<br>3. Fallback components for ARIA support |
| **Performance Degradation** | Low | Medium | 1. React.memo for expensive components<br>2. Memoize calculations<br>3. Virtual scrolling for lists |
| **Testing Gaps** | Medium | High | 1. Smart test coverage strategy<br>2. Visual regression for UI changes<br>3. E2E tests for critical flows |

### Branch Strategy

```
main
└── v2-migration
    ├── v2-base-components
    ├── v2-layout-components
    ├── v2-forms-components
    ├── v2-navigation-components
    ├── v2-overlays-components
    └── v2-chat-components
```

### Rollback Strategy

1. **Component-level Rollback**: Each component migration is atomic
   - Keep old component in `src/components/ui/base/old/`
   - Feature flag to switch between old/new
   - Gradual rollout strategy

2. **Package-level Rollback**: Complete package rollback
   - Keep `@astudio/ui` alongside `@design-studio/ui` temporarily
   - Alias imports in build config
   - Deprecation warnings for old package

3. **Emergency Rollback**
   - Git revert to previous stable tag
   - Feature flags to disable new components
   - Communication plan for incident

### Progress Tracking

| Component Category | Status | Components Done | Total Components | Test Coverage |
|-------------------|--------|----------------|-----------------|---------------|
| Base | 🟢 Complete | 20/20 | 20 | 100% |
| Layout | 🟢 Complete | 6/6 | 6 | 100% |
| Forms | 🟢 Complete | 5/5 | 5 | 100% |
| Navigation | 🟡 In Progress | 5/10 | 10 | 75% |
| Overlays | 🟡 Started | 2/11 | 11 | 65% |
| Data Display | 🟡 Started | 1/7 | 7 | 15% |
| Chat | 🟡 Started | 1/8 | 8 | 60% |

**Migrated Base Components:**
- ✅ Button (with hybrid pattern: Button.Primary, Button.Secondary, Button.Icon)
- ✅ Input
- ✅ Textarea
- ✅ Label
- ✅ Select (with hybrid pattern: Select.Trigger, Select.Value, Select.Content, etc.)
- ✅ Checkbox
- ✅ Switch
- ✅ RadioGroup
- ✅ Slider
- ✅ Toggle
- ✅ ToggleGroup
- ✅ Calendar
- ✅ SegmentedControl
- ✅ InputOTP
- ✅ Skeleton
- ✅ Accordion
- ✅ Avatar
- ✅ Badge
- ✅ Card
- ✅ Resizable
- ✅ ScrollArea
- ✅ Separator
- ✅ Table
- ✅ TextLink

**Excluded from StatefulComponentProps:**
- ⚪ Transition (already has state model via `show` prop; the animation IS the state)
- ⚪ DirectionProvider (context provider for RTL/LTR; no stateful semantics)
- ⚪ ShimmerText (loading indicator by design; adding stateful props would be circular)

**Migrated Layout Components:**
- ✅ AspectRatio
- ✅ Collapsible
- ✅ DirectionProvider (cleaned up "use client" directive only)
- ✅ ListItem (with StatefulComponentProps for error/loading states)
- ✅ Resizable
- ✅ ScrollArea
- ✅ SectionHeader
- ✅ ShimmerText (cleaned up "use client" directive only)

**Migrated Forms Components:**
- ✅ Input
- ✅ Textarea
- ✅ Select
- ✅ Checkbox
- ✅ RadioGroup
- ✅ Combobox (with loading/error state UI in dropdown)

**Remaining Forms Components (lower priority, to assess):**
- Form (form wrapper component - may not need StatefulComponentProps)
- RangeSlider (may be covered by Slider)
- TagInput (complex component, separate assessment needed)

**Migrated Navigation Components:**
- ✅ Breadcrumb
- ✅ Pagination
- ✅ Tabs
- ✅ NavigationMenu
- ✅ Menubar
- ⚪ Carousel (pending)
- ⚪ Command (pending)
- ⚪ ContextMenu (partial)
- ⚪ DropdownMenu (partial)
- ⚪ ModelBadge (pending)
- ⚪ ModeSelector (pending)
- ⚪ Sidebar (pending)
- ⚪ ViewModeToggle (pending)

**Migrated Overlays Components:**
- ✅ Dialog
- ✅ Sheet (partial)
- ⚪ AlertDialog (pending)
- ⚪ ContextMenu (partial)
- ⚪ DropdownMenu (partial)
- ⚪ ErrorBoundary (pending)
- ⚪ HoverCard (pending)
- ⚪ Modal (pending)
- ⚪ Popover (partial)
- ⚪ Toast (complete)
- ⚪ Tooltip (partial)

**Migrated Chat Components:**
- ✅ ChatInput (with hybrid pattern: ChatInput.ComposerArea, ChatInput.ActionBar, ChatInput.LeftActions, ChatInput.RightActions, ChatInput.SendButton)
- ⚪ AttachmentMenu (partial)
- ⚪ ChatActions (pending)
- ⚪ ChatHeader (pending)
- ⚪ ChatMessages (pending)
- ⚪ ChatShell (pending)
- ⚪ ChatSidebar (pending)
- ⚪ ChatUIRoot (pending)

## 6. Success Criteria

### Bundle Size Targets

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| **@design-studio/ui** | ~2.5MB | ≤500KB | 🟡 In Progress |
| **@design-studio/tokens** | ~500KB | ≤100KB | ✅ Complete |
| **@design-studio/runtime** | ~25KB | ≤50KB | ✅ Complete |
| **Tree-shaking efficiency** | 40% | ≥80% | 🟡 In Progress |
| **Component size average** | 15KB | ≤5KB | 🟡 In Progress |

### Test Coverage Targets

| Category | Target | Method |
|----------|--------|--------|
| **Unit Test Coverage** | 80% | Vitest + Testing Library |
| **E2E Test Coverage** | 60% | Playwright |
| **Accessibility Coverage** | 100% | jest-axe (critical paths) |
| **Visual Regression** | 90% | Argos (UI components) |
| **Bundle Size Analysis** | 100% | Rollup + bundle-analyzer |

### Performance Benchmarks

| Metric | Current | Target |
|--------|---------|--------|
| **First Contentful Paint** | 1.2s | <1s |
| **Largest Contentful Paint** | 2.5s | <1.5s |
| **Interaction to Next Paint** | 150ms | <100ms |
| **Cumulative Layout Shift** | 0.1 | <0.05 |
| **Speed Index** | 3.5s | <2s |

### Success Metrics

#### Completed When:
1. ✅ All 68 components migrated to hybrid pattern
2. ✅ Test coverage: 80% statement, 100% accessibility on critical paths
3. ✅ Bundle size: 500KB for @design-studio/ui (80% reduction)
4. ✅ Performance: All performance benchmarks met
5. ✅ Documentation: 100% component coverage in Storybook
6. ✅ Migration: No breaking changes to existing applications

#### Quality Gates:
- **Automated Checks**: 100% pass rate
- **Manual Testing**: Critical user journeys tested
- **Bundle Analysis**: Size reduction verified
- **Accessibility**: WCAG 2.1 AA compliance
- **Integration**: All platforms working with new packages

## 7. Next Steps & Timeline

### Week 5: Foundation Migration
- [ ] Complete Base components (Button, Input, Label, etc.)
- [ ] Migrate Layout components
- [ ] Set up Playwright testing
- [ ] Argos configuration

### Week 6: Interactive Components
- [ ] Complete Forms components with hybrid pattern
- [ ] Migrate Navigation components
- [ ] Implement accessibility tests
- [ ] Storybook enhancement

### Week 7: Complex Components
- [ ] Migrate Overlays components
- [ ] Data Display components
- [ ] Visual regression setup
- [ ] Performance optimization

### Week 8: Chat & Integration
- [ ] Complete Chat components
- [ ] Full integration testing
- [ ] Bundle size optimization
- [ ] Documentation update

### Week 9: Cleanup (Phase 4)
- [ ] Remove deprecated components
- [ ] Update all platform imports
- [ ] Performance benchmarks
- [ ] Release preparation

## 8. Monitoring & Feedback

### Key Metrics to Track
- Bundle size changes per component
- Test coverage trends
- Performance regression detection
- Accessibility violation tracking
- Developer feedback on new APIs

### Feedback Loops
- Weekly component reviews
- Daily build health checks
- Automated performance monitoring
- User testing on migrated components

---

**This plan will be updated weekly based on actual progress and any discoveries during migration.**
