import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { useIsMobile } from "./UseMobile";

/**
 * useIsMobile hook - detects mobile viewport based on 768px breakpoint.
 *
 * ## Usage
 * ```tsx
 * import { useIsMobile } from "@design-studio/ui";
 *
 * function MyComponent() {
 *   const isMobile = useIsMobile();
 *   return <div>{isMobile ? "Mobile view" : "Desktop view"}</div>;
 * }
 * ```
 *
 * ## Behavior
 * - Returns `true` when viewport width < 768px
 * - Returns `false` when viewport width >= 768px
 * - Updates reactively on window resize
 * - Client-side only; avoid SSR usage (returns `false` during SSR)
 *
 * ## Use Cases
 * - Responsive layout switching
 * - Mobile-specific UI adaptations
 * - Conditional rendering based on viewport
 * - Touch vs mouse interaction detection
 *
 * ## Accessibility
 * - Hook itself has no accessibility implications
 * - Use to inform ARIA attributes or interaction patterns
 * - Example: Show different navigation patterns for mobile vs desktop
 */

// Demo component to showcase the hook
function IsMobileDemo() {
  const isMobile = useIsMobile();
  const [viewportWidth, setViewportWidth] = React.useState(typeof window !== "undefined" ? window.innerWidth : 0);

  React.useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-w-[300px] flex-col gap-4 p-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Viewport Detection</h3>
        <p className="text-muted-foreground">Resize the browser window to see the hook update.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border bg-muted p-4">
          <div className="text-sm text-muted-foreground">Viewport Width</div>
          <div className="text-2xl font-bold">{viewportWidth}px</div>
        </div>
        <div className="rounded-lg border bg-muted p-4">
          <div className="text-sm text-muted-foreground">Is Mobile</div>
          <div className={`text-2xl font-bold ${isMobile ? "text-accent" : "text-muted-foreground"}`}>
            {isMobile ? "Yes" : "No"}
          </div>
        </div>
      </div>

      <div className={`rounded-lg border p-4 ${isMobile ? "bg-accent/10 border-accent" : "bg-muted"}`}>
        <div className="text-sm font-medium">
          {isMobile ? "📱 Mobile Viewport Detected" : "🖥️ Desktop Viewport Detected"}
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          {isMobile
            ? "Viewport is narrower than 768px. Consider using mobile-optimized layouts."
            : "Viewport is 768px or wider. Desktop layouts are available."}
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        Breakpoint: 768px (matchMedia: max-width: 767px)
      </div>
    </div>
  );
}

// Responsive layout demo
function ResponsiveLayoutDemo() {
  const isMobile = useIsMobile();

  return (
    <div className="min-w-[300px] rounded-lg border p-4">
      <div className="mb-4 text-sm font-medium">Responsive Layout Example</div>

      {isMobile ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 rounded-md bg-accent/10 p-3">
            <span>📱</span>
            <span className="text-sm">Mobile navigation</span>
          </div>
          <div className="space-y-1 text-sm">
            <div className="h-2 w-full rounded bg-muted" />
            <div className="h-2 w-3/4 rounded bg-muted" />
          </div>
        </div>
      ) : (
        <div className="flex gap-4">
          <div className="flex items-center gap-2 rounded-md bg-accent/10 px-3 py-2">
            <span>🖥️</span>
            <span className="text-sm">Desktop nav</span>
          </div>
          <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2">
            <span className="text-sm">Tab 1</span>
          </div>
          <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2">
            <span className="text-sm">Tab 2</span>
          </div>
          <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2">
            <span className="text-sm">Tab 3</span>
          </div>
        </div>
      )}
    </div>
  );
}

const meta = {
  title: "Components/UI/Base/UseMobile",
  component: IsMobileDemo,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A React hook that detects mobile viewport based on a 768px breakpoint. Returns true when viewport width < 768px.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof IsMobileDemo>;

export default meta;
type Story = StoryObj<typeof IsMobileDemo>;

export const Default: Story = {
  name: "Viewport Detector",
  render: () => <IsMobileDemo />,
};

export const ResponsiveLayout: Story = {
  name: "Responsive Layout Example",
  render: () => <ResponsiveLayoutDemo />,
};

// Story with different viewport sizes for testing
export const MobileViewport: Story = {
  name: "Mobile Viewport (Test at <768px)",
  render: () => <IsMobileDemo />,
  parameters: {
    viewport: {
      defaultViewport: "iphone12",
    },
  },
};

export const DesktopViewport: Story = {
  name: "Desktop Viewport (Test at ≥768px)",
  render: () => <IsMobileDemo />,
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
};

// Accessibility note story
export const AccessibilityNotes: Story = {
  name: "Accessibility Considerations",
  render: () => (
    <div className="max-w-2xl space-y-4 p-6">
      <h3 className="text-lg font-semibold">Using useIsMobile for Accessibility</h3>

      <div className="space-y-3 text-sm">
        <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
          <div className="font-medium text-accent">✓ DO</div>
          <p className="mt-1 text-muted-foreground">
            Use to inform UI patterns that work better on mobile (e.g., bottom sheets instead of modals, larger touch targets).
          </p>
        </div>

        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <div className="font-medium text-destructive">✗ DON'T</div>
          <p className="mt-1 text-muted-foreground">
            Hide content from screen readers based on viewport. Use responsive ARIA attributes instead.
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <div className="font-medium">Example: Touch-Friendly Targets</div>
          <pre className="mt-2 overflow-x-auto text-xs">
{`const isMobile = useIsMobile();
const buttonSize = isMobile ? "p-4 min-h-[44px]" : "p-2";
return <button className={buttonSize}>Action</button>;`}
          </pre>
        </div>
      </div>
    </div>
  ),
};
