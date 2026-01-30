# Component Creation Guide

**Audience:** Developers
**Last updated:** 2026-01-19
**Owner:** Jamie Scott Craik (@jscraik)
**Backup owner:** TBD
**Review cadence:** Every release or monthly (whichever is sooner)

This guide explains the end-to-end workflow for creating UI components in the AStudio monorepo, from planning to release.

---

## Quick Start

1. Run: `pnpm new:component MyComponent [category]`
2. Follow the checklist below
3. Run tests and release

---

## End-to-End Workflow

### Phase 1: Plan (5 minutes)

Before writing code, understand what you're building.

- [ ] **Review design tokens** in `packages/tokens/README.md` for patterns
- [ ] **Review coverage matrix** in `docs/design-system/COVERAGE_MATRIX.md` and note any gaps
- [ ] **Identify UX states required:**
  - Initial loading (skeleton or spinner)
  - Background refresh / stale data
  - Empty state with next action (if applicable)
  - No-results state (search/filter contexts)
  - Error state with recovery path (retry/fallback)
  - Permission/entitlement denied (if applicable)
  - Offline or degraded mode (if applicable)
  - Success confirmation (action components)
  - Hover/active states
  - Disabled state

**Why:** Planning prevents rework. Identifying all states upfront ensures you don't discover missing states during testing.

---

### Phase 2: Create React Component (30 minutes)

**Step 1: Generate the component skeleton**

```bash
pnpm new:component MyComponent [category]
```

Categories:
- `primitive` - Basic UI elements (buttons, inputs, etc.)
- `chat` - Chat-specific components
- `overlay` - Dialogs, sheets, popovers
- `data-display` - Tables, lists, cards
- `feedback` - Alerts, toasts, progress indicators
- `navigation` - Breadcrumbs, tabs, menus
- `template` - Page templates
- `page` - Full page layouts

**Step 2: Implement the component**

Edit `packages/ui/src/components/[category]/my-component/MyComponent.tsx`

**Requirements:**
- Implement all UX states identified in Phase 1
- Use `@openai/apps-sdk-ui` classes for styling (not Tailwind utilities directly)
- Import icons from `packages/ui/src/icons` (Apps SDK UI first, Lucide fallback)
- Add a static Storybook preview

**Example:**

```tsx
import { useState } from "react";
import { Check, X } from "@design-studio/ui/icons";

export interface MyComponentProps {
  variant?: "primary" | "secondary";
  disabled?: boolean;
  children: React.ReactNode;
  onSubmit?: () => void;
}

export function MyComponent({
  variant = "primary",
  disabled = false,
  children,
  onSubmit,
}: MyComponentProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return <div className="appsdk-skeleton">...</div>;
  }

  return (
    <div className={`appsdk-card ${variant === "primary" ? "appsdk-card-primary" : ""}`}>
      {children}
      <button
        className="appsdk-button"
        disabled={disabled}
        onClick={() => {
          setIsLoading(true);
          onSubmit?.();
        }}
      >
        Submit
      </button>
    </div>
  );
}
```

**Step 3: Add Storybook stories**

Edit `packages/ui/src/components/[category]/my-component/MyComponent.stories.tsx`

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { MyComponent } from "./MyComponent";

const meta: Meta<typeof MyComponent> = {
  title: "Components/[Category]/MyComponent",
  component: MyComponent,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Hello world",
  },
};

export const Loading: Story = {
  args: {
    variant: "primary",
    children: "Loading...",
  },
  parameters: {
    // Simulate loading state
  },
};

export const Error: Story = {
  args: {
    variant: "secondary",
    children: "Error state",
  },
};
```

**Step 4: Run Storybook**

```bash
pnpm dev:storybook
```

Navigate to `http://localhost:6006/?path=/story/components-[category]-mycomponent--primary`

---

### Phase 3: Test (30 minutes)

**Step 1: Add unit tests**

Edit `packages/ui/src/components/[category]/my-component/MyComponent.test.tsx`

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MyComponent } from "./MyComponent";

describe("MyComponent", () => {
  it("renders children", () => {
    render(<MyComponent>Hello world</MyComponent>);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("applies variant class", () => {
    const { container } = render(
      <MyComponent variant="primary">Test</MyComponent>
    );
    expect(container.firstChild).toHaveClass("appsdk-card-primary");
  });

  it("shows loading state when isLoading is true", () => {
    const { container } = render(<MyComponent>Loading</MyComponent>);
    // Test loading state logic
  });
});
```

**Step 2: Run tests**

```bash
pnpm test
```

**Step 3: Test accessibility**

Install [axe DevTools](https://www.deque.com/axe/devtools/) browser extension.

1. Open Storybook
2. Run axe DevTools on each story
3. Fix any WCAG 2.2 AA violations
4. Validate keyboard nav, focus-visible, and label/name/role/value
5. Save the audit artifact to `docs/operations/` using `docs/operations/a11y-audit-template.md`

**Step 4: Visual regression tests**

```bash
pnpm test:visual:web
```

Review any visual diffs in Playwright.

**Step 5: Keyboard navigation tests**

- Tab: Focus moves to next interactive element
- Shift+Tab: Focus moves to previous element
- Enter/Space: Activates buttons and links
- Escape: Closes overlays/dialogs

---

### Phase 4: Release (15 minutes)

**Step 1: Run linter and tests**

```bash
pnpm lint
pnpm test
```

Fix any issues before proceeding.

**Step 2: Create a changeset**

```bash
pnpm changeset
```

Follow the prompts:
- Select the package(s) that changed (usually `@design-studio/ui`)
- Choose the semver bump type:
  - `patch` - Bug fixes, small improvements
  - `minor` - New features, backward-compatible changes
  - `major` - Breaking changes
- Write a summary of changes

**Step 3: Update design tokens** (if needed)

If you added new design tokens:

```bash
pnpm generate:tokens
```

**Step 4: Verify release checklist**

See `docs/guides/RELEASE_CHECKLIST.md` (if it exists) for full release requirements.

---

## Definition of Done

A component is complete when:

- [ ] Required UX states implemented and documented in stories
- [ ] Accessibility passes WCAG 2.2 AA (axe + keyboard/focus checks)
- [ ] A11y audit artifact saved to `docs/operations/` using `docs/operations/a11y-audit-template.md`
- [ ] Unit tests pass with ≥80% coverage
- [ ] Storybook stories documented for required states
- [ ] Visual regression tests pass
- [ ] Keyboard navigation works correctly
- [ ] Coverage matrix updated (or gap recorded) in `docs/design-system/COVERAGE_MATRIX.md`
- [ ] Parity checklist updated (if applicable)
- [ ] Changeset created
- [ ] Code follows `CODESTYLE.md` standards

### Definition of Done Evidence (template)

| Item | Evidence | Link/Path |
| --- | --- | --- |
| Coverage matrix updated | Yes/No | `docs/design-system/COVERAGE_MATRIX.md` |
| UX state stories | Yes/No | Storybook links |
| A11y audit | Yes/No | `docs/operations/a11y-audit-template.md` |
| Tests run | Yes/No | CI job or local log |
| Visual regression | Yes/No | Playwright report |
| Release checklist | Yes/No | `docs/guides/RELEASE_CHECKLIST.md` |

---

## Common Patterns

### State Management

For internal component state, use React hooks:

```tsx
const [isOpen, setIsOpen] = useState(false);
```

For external control, use the `useControllableState` pattern:

```tsx
import { useControllableState } from "@design-studio/ui/base";

interface Props {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
}

export function MyComponent({ open, onOpenChange, defaultOpen }: Props) {
  const [internalOpen, setInternalOpen] = useControllableState({
    value: open,
    onChange: onOpenChange,
    defaultValue: defaultOpen,
  });
  // ...
}
```

### Icons

Always use the icons adapter:

```tsx
import { Check, X } from "@design-studio/ui/icons";
```

This ensures:
- Apps SDK UI icons are used when available
- Lucide icons are the fallback
- Consistent icon rendering across platforms

## Token API Mapping

See `docs/theming/TOKEN_API_MAPPING.md` for the Tailwind v4 utility mapping and token layer notes.

### Styling

Use Apps SDK UI classes via `@openai/apps-sdk-ui/css`:

```tsx
// ✅ Good - uses design system
<div className="appsdk-card appsdk-card-primary">...</div>

// ❌ Bad - uses raw Tailwind
<div className="bg-white text-black rounded-lg">...</div>
```

For custom styles that require CSS variables:

```tsx
<div
  className="appsdk-card"
  style={{ color: "var(--foundation-text-light-primary)" }}
>
  ...
</div>
```

---

## Troubleshooting

### Storybook won't load component

- Check that the component is exported from `packages/ui/src/components/[category]/index.ts`
- Check that the category is exported from `packages/ui/src/components/index.ts`
- Restart Storybook: `pnpm dev:storybook`

### Tests fail with import errors

- Run `pnpm build:lib` to ensure packages are built
- Check that `package.json` exports include your component
- Verify imports use the correct subpath: `@design-studio/ui/[category]`

### Accessibility violations

Common issues:
- Missing `aria-label` on icon-only buttons
- Invalid HTML structure (nested buttons, etc.)
- Low color contrast (use tokens, not arbitrary colors)
- Missing focus states

---

## Related Documentation

- **UX Patterns:** `docs/guides/DESIGN_GUIDELINES.md`
- **Tooling:** `docs/guides/UI_COMPONENT_TOOLING.md`
- **Design Tokens:** `packages/tokens/README.md`
- **Component Standards:** `CODESTYLE.md`

---

## Workflow Timing

Based on the spec targets:

| Phase | Target Time |
|-------|-------------|
| Plan | 5 minutes |
| Create React Component | 30 minutes |
| Test | 30 minutes |
| Release | 15 minutes |
| **Total** | **~80 minutes** |
