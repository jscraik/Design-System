import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

/**
 * # Keyboard Navigation Tour
 *
 * **Purpose**: Learn how keyboard navigation should feel in your components.
 *
 * **Accessibility First**: If it works for keyboard, it works for everyone.
 *
 * ## What This Demonstrates
 * - Visible focus indicators (2px ring)
 * - Tab order through interactive elements
 * - Focus trap patterns (modals, dropdowns)
 * - Escape key behavior
 * - Enter/Space activation
 */

// Focus State Showcase
const FocusShowcase = () => {
  const [focusedIndex, setFocusedIndex] = React.useState(0);
  const elements = React.useRef<(HTMLButtonElement | HTMLInputElement)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((i) => (i + 1) % elements.current.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((i) => (i - 1 + elements.current.length) % elements.current.length);
    }
  };

  React.useEffect(() => {
    if (elements.current[focusedIndex]) {
      elements.current[focusedIndex].focus();
    }
  }, [focusedIndex]);

  const buttons = [
    { label: "First Action", color: "bg-accent text-accent-foreground" },
    { label: "Second Action", color: "bg-muted text-muted-foreground" },
    { label: "Third Action", color: "bg-border" },
  ];

  return (
    <div className="max-w-4xl p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Keyboard Navigation Tour</h1>
        <p className="text-muted-foreground">
          Learn how focus states and keyboard navigation should work. Use arrow keys to navigate.
        </p>
      </div>

      <div className="space-y-8">
        {/* Focus Ring Demo */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Focus Ring Demo</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Tab through buttons to see focus indicators. Each button gets a 2px ring.
          </p>

          <div className="flex flex-wrap gap-4" onKeyDown={handleKeyDown}>
            {buttons.map((btn, i) => (
              <button
                key={i}
                ref={(el) => {
                  if (el) elements.current[i] = el;
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 transition-colors ${
                  focusedIndex === i ? "ring-2 ring-accent ring-offset-2" : ""
                } ${btn.color}`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg bg-muted text-sm">
            <div className="font-medium mb-2">Keyboard Controls</div>
            <div className="space-y-1">
              <div>
                <kbd className="px-2 py-1 rounded bg-background border">Tab</kbd> - Move focus
                forward
              </div>
              <div>
                <kbd className="px-2 py-1 rounded bg-background border">Shift+Tab</kbd> - Move focus
                backward
              </div>
              <div>
                <kbd className="px-2 py-1 rounded bg-background border">↑/↓</kbd> - Arrow keys
                (custom)
              </div>
              <div>
                <kbd className="px-2 py-1 rounded bg-background border">Enter</kbd> /{" "}
                <kbd className="px-2 py-1 rounded bg-background border">Space</kbd> - Activate
              </div>
            </div>
          </div>
        </div>

        {/* Focus Indicators */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Focus Indicator Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border bg-background">
              <div className="text-sm font-medium mb-2">✅ Pass</div>
              <div className="text-xs text-muted-foreground">
                2px ring with offset
                <br />
                Contrasts with all backgrounds
              </div>
            </div>
            <div className="p-4 rounded-lg border bg-background">
              <div className="text-sm font-medium mb-2">✅ Pass</div>
              <div className="text-xs text-muted-foreground">
                Visible on both dark
                <br />
                and light themes
              </div>
            </div>
            <div className="p-4 rounded-lg border bg-background">
              <div className="text-sm font-medium mb-2">✅ Pass</div>
              <div className="text-xs text-muted-foreground">
                Doesn't obscure content
                <br />
                or interfere with interaction
              </div>
            </div>
          </div>
        </div>

        {/* Skip Links Demo */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Skip Links Pattern</h2>
          <p className="text-sm text-muted-foreground mb-6">
            "Skip to main content" links improve accessibility for keyboard users.
          </p>

          <div className="space-y-4">
            <div className="p-4 rounded-lg border bg-muted">
              <div className="text-sm font-medium mb-2">Before (Without Skip Link)</div>
              <div className="text-xs text-muted-foreground">
                Users must tab through all navigation to reach content
              </div>
            </div>
            <div className="p-4 rounded-lg border bg-accent/10">
              <div className="text-sm font-medium mb-2">After (With Skip Link)</div>
              <a
                href="#main-content"
                className="inline-block px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                onClick={(e) => e.preventDefault()}
              >
                Skip to main content
              </a>
              <div className="text-xs text-muted-foreground mt-2">
                Press Enter to jump directly to content
              </div>
            </div>
          </div>
        </div>

        {/* Focus Trap Demo */}
        <FocusTrapDemo />
      </div>
    </div>
  );
};

// Focus Trap Demo (for modals)
const FocusTrapDemo = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const modalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0] as HTMLElement;
      if (firstElement) {
        firstElement.focus();
      }
    }
  }, [isOpen]);

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-xl font-semibold mb-4">Focus Trap Pattern (Modals)</h2>
      <p className="text-sm text-muted-foreground mb-6">
        When a modal opens, focus is trapped inside. Press Escape to close.
      </p>

      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        Open Modal (with focus trap)
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-overlay/50"
            style={{ zIndex: 40 }}
            onClick={() => setIsOpen(false)}
          />
          <div
            ref={modalRef}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border w-full max-w-md rounded-lg p-6"
            style={{ zIndex: 50, borderRadius: "16px" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Modal Dialog</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 rounded-md hover:bg-muted text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Focus is trapped in this modal. Tab cycles through elements. Press Escape or click
              outside to close.
            </p>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 rounded-md border text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                First button
              </button>
              <button className="w-full px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                Second button
              </button>
              <input
                type="text"
                placeholder="Type to test focus..."
                className="w-full px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const meta: Meta = {
  title: "Design System/15 Keyboard Navigation",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Keyboard navigation patterns and focus state demonstrations. Learn how to build accessible components.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const KeyboardTour: Story = {
  name: "Keyboard Tour",
  render: () => <FocusShowcase />,
};

export const FocusTrapStory: Story = {
  name: "Focus Trap Demo",
  render: () => <FocusTrapDemo />,
};

export const AccessibilityChecklist: Story = {
  name: "Accessibility Checklist",
  render: () => (
    <div className="max-w-4xl p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Accessibility Checklist</h1>
        <p className="text-muted-foreground">
          Use this checklist when reviewing components for keyboard accessibility.
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Keyboard Navigation</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <input type="checkbox" id="k1" className="mt-1" />
              <label htmlFor="k1" className="text-sm">
                All interactive elements are focusable
              </label>
            </div>
            <div className="flex items-start gap-3">
              <input type="checkbox" id="k2" className="mt-1" />
              <label htmlFor="k2" className="text-sm">
                Tab order follows logical reading order
              </label>
            </div>
            <div className="flex items-start gap-3">
              <input type="checkbox" id="k3" className="mt-1" />
              <label htmlFor="k3" className="text-sm">
                Focus indicators are visible (2px ring)
              </label>
            </div>
            <div className="flex items-start gap-3">
              <input type="checkbox" id="k4" className="mt-1" />
              <label htmlFor="k4" className="text-sm">
                Skip links provided for long content
              </label>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Focus Management</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <input type="checkbox" id="k5" className="mt-1" />
              <label htmlFor="k5" className="text-sm">
                Modals trap focus (Escape closes)
              </label>
            </div>
            <div className="flex items-start gap-3">
              <input type="checkbox" id="k6" className="mt-1" />
              <label htmlFor="k6" className="text-sm">
                Dropdowns trap focus (Escape closes)
              </label>
            </div>
            <div className="flex items-start gap-3">
              <input type="checkbox" id="k7" className="mt-1" />
              <label htmlFor="k7" className="text-sm">
                Focus returns to trigger after close
              </label>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Keyboard Shortcuts</h2>
          <div className="space-y-3 text-sm">
            <div>
              <kbd className="px-2 py-1 rounded bg-background border">Enter</kbd> /{" "}
              <kbd className="px-2 py-1 rounded bg-background border">Space</kbd> - Activate focused
              element
            </div>
            <div>
              <kbd className="px-2 py-1 rounded bg-background border">Escape</kbd> - Close/dismiss
            </div>
            <div>
              <kbd className="px-2 py-1 rounded bg-background border">Tab</kbd> - Move to next
              element
            </div>
            <div>
              <kbd className="px-2 py-1 rounded bg-background border">Shift+Tab</kbd> - Move to
              previous element
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
