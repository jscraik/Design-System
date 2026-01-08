# Storybook Usage Guide

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (beginner to intermediate)
- Scope: Task-focused instructions for this topic
- Non-scope: Comprehensive architecture reference
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


Your ChatUI library is fully integrated with Storybook for comprehensive testing and documentation. Here's how to leverage all the built-in features:

## 🚀 **Getting Started**

```bash
# Start Storybook development server
pnpm storybook:dev

# Build Storybook for production
pnpm storybook:build

# Run Storybook interaction tests (Vitest addon)
pnpm storybook:test

# Run component unit tests
pnpm test

# Note: Storybook Vitest browser mode uses port 63315 by default.
# Override with `VITEST_BROWSER_PORT=xxxx pnpm storybook:test` if needed.
```

## 📚 **What's Already Configured**

### ✅ **Automated Testing** (`@storybook/addon-vitest`)

- Interactive testing in the browser
- Component behavior validation
- User interaction testing

### ✅ **Accessibility Testing** (`@storybook/addon-a11y`)

- Real-time accessibility checks
- WCAG compliance validation
- Color contrast analysis
- Keyboard navigation testing

### ✅ **Documentation** (`@storybook/addon-docs`)

- Auto-generated component docs
- Interactive controls
- Code examples
- Design tokens documentation

### ✅ **Visual Regression Testing** (Playwright)

- Story-level screenshot regression coverage
- Light and dark theme baselines

## 🧪 **Testing Features**

### **Interactive Testing**

Your components include interactive tests that run in the browser:

```tsx
// Example: button.test.stories.tsx
export const ClickInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    await expect(button).toBeInTheDocument();
    await userEvent.click(button);
  },
};
```

### **Accessibility Testing**

Every story automatically runs accessibility checks:

- Color contrast ratios
- ARIA attributes
- Keyboard navigation
- Screen reader compatibility

### **Visual Regression Testing**

Run Storybook visual regression tests:

```bash
pnpm test:visual:storybook
pnpm test:visual:storybook:update
```

## 📖 **Documentation Features**

### **Design Tokens**

Navigate to "Design System/Design Tokens" in Storybook to see:

- Color palette with CSS variables
- Spacing scale
- Border radius tokens
- Usage examples

### **Tool Output Stories**

Create stories that mirror MCP tool outputs so UI can be verified without running the server.
Example from `DashboardPage`:

```tsx
export const WithToolOutput: Story = {
  args: {
    headerSlot: <div className="text-secondary text-sm">Tool-driven dashboard</div>,
    stats: [
      { label: "Active Projects", value: "12", change: "+2" },
      { label: "Weekly Runs", value: "438", change: "+18%" },
      { label: "Open Issues", value: "7", change: "-3" },
      { label: "Avg Response", value: "1.1s", change: "-6%" },
    ],
    recentChats: [
      { id: "t-1", title: "Release Readiness", model: "GPT-4o", time: "5 min ago" },
      { id: "t-2", title: "A11y Audit Review", model: "GPT-4", time: "2 hours ago" },
      { id: "t-3", title: "Partner Onboarding", model: "Claude", time: "Yesterday" },
    ],
  },
};
```

This keeps stories aligned to your tool schemas and prevents UI drift.

### **Component Documentation**

Each component story includes:

- Interactive controls for all props
- Auto-generated prop tables
- Usage examples
- Accessibility guidelines

### **Code Examples**

View source code for any story using the "Show code" feature.

## 🎯 **Best Practices**

### **Writing Stories**

```tsx
// Good: Comprehensive story with multiple variants
export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
    </div>
  ),
};

// Good: Interactive test story
export const UserInteraction: Story = {
  play: async ({ canvasElement }) => {
    // Test user interactions
  },
};
```

### **Accessibility Testing**

- Every interactive component should have keyboard navigation tests
- Check color contrast in the A11y addon panel
- Verify ARIA attributes are properly set
- Test with screen reader simulation

### **Performance Monitoring**

- Use the Bundle addon to monitor component size
- Check for unnecessary re-renders in React DevTools
- Monitor bundle impact when adding new dependencies

## 🔧 **Advanced Features**

### **Custom Viewports**

Test responsive behavior with built-in viewport controls.

### **Theme Switching**

Components automatically work with the ChatUI theme system.

### **Mock Data**

Use the provided mock data utilities:

```tsx
import { mockData } from "@chatui/ui";

export const WithMockData: Story = {
  args: {
    models: mockData.models,
    messages: mockData.messages,
  },
};
```

## 📊 **Available Reports**

1. **Accessibility Report**: A11y addon panel
2. **Test Results**: Vitest addon panel
3. **Component Coverage**: Auto-generated from stories

## 🚀 **CI/CD Integration**

```yaml
# Example GitHub Actions
- name: Run Storybook Tests
  run: |
    pnpm storybook:build
    pnpm storybook:test
    pnpm -C packages/ui test:a11y
```

Your Storybook setup provides everything needed for comprehensive component testing, documentation, and quality assurance without additional tooling!
