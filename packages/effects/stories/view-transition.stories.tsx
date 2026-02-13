/**
 * View Transition Stories
 * Based on @jh3yy's View Transitions API patterns
 * Reference: https://x.com/jh3yy/status/2016902094305755339
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import type { ViewTransitionType } from "../src/components/view-transition";
import { useViewTransition, ViewTransitionWrapper } from "../src/components/view-transition";

const meta: Meta = {
  title: "Effects/View Transition",
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs", "a11y"],
};

export default meta;
type Story = StoryObj;

// ============================================================================
// VIEW TRANSITION WRAPPER
// ============================================================================

export const WrapperDemo: Story = {
  render: () => {
    const [page, setPage] = useState<"home" | "about" | "contact">("home");

    const pages = {
      home: (
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-4">Home Page</h1>
          <p className="text-lg">This is the home page with view transition.</p>
        </div>
      ),
      about: (
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-4">About Page</h1>
          <p className="text-lg">Learn more about us with smooth transitions.</p>
        </div>
      ),
      contact: (
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-4">Contact Page</h1>
          <p className="text-lg">Get in touch with view transition effects.</p>
        </div>
      ),
    };

    return (
      <div className="min-h-screen bg-background">
        <nav className="flex gap-4 p-4 border-b">
          <button
            type="button"
            onClick={() => setPage("home")}
            className="px-4 py-2 rounded bg-muted hover:bg-muted/80"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => setPage("about")}
            className="px-4 py-2 rounded bg-muted hover:bg-muted/80"
          >
            About
          </button>
          <button
            onClick={() => setPage("contact")}
            className="px-4 py-2 rounded bg-muted hover:bg-muted/80"
          >
            Contact
          </button>
        </nav>

        <ViewTransitionWrapper name={`page-${page}`}>{pages[page]}</ViewTransitionWrapper>
      </div>
    );
  },
};

// ============================================================================
// USE VIEW TRANSITION HOOK
// ============================================================================

export const HookDemo: Story = {
  render: () => {
    const [count, setCount] = useState(0);
    const { startTransition } = useViewTransition();

    const handleIncrement = async () => {
      await startTransition({
        name: "count-update",
        update: async () => {
          setCount((c) => c + 1);
        },
        duration: 300,
      });
    };

    return (
      <div className="min-h-screen flex items-center justify-center gap-8">
        <div className="text-center">
          <ViewTransitionWrapper name={`count-${count}`}>
            <div className="text-8xl font-bold">{count}</div>
          </ViewTransitionWrapper>

          <button
            onClick={handleIncrement}
            className="mt-8 px-8 py-4 text-xl rounded-lg bg-primary text-primary-foreground hover:opacity-90"
          >
            Increment with Transition
          </button>
        </div>
      </div>
    );
  },
};

// ============================================================================
// TRANSITION TYPES
// ============================================================================

export const TransitionTypes: Story = {
  render: () => {
    const [activeType, setActiveType] = useState<ViewTransitionType | "none">("none");

    return (
      <div className="min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-8">View Transition Types</h1>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveType("none")}
            className="px-4 py-2 rounded bg-muted hover:bg-muted/80"
          >
            None
          </button>
          <button
            onClick={() => setActiveType("fade")}
            className="px-4 py-2 rounded bg-muted hover:bg-muted/80"
          >
            Fade
          </button>
          <button
            onClick={() => setActiveType("slide")}
            className="px-4 py-2 rounded bg-muted hover:bg-muted/80"
          >
            Slide
          </button>
          <button
            onClick={() => setActiveType("scale")}
            className="px-4 py-2 rounded bg-muted hover:bg-muted/80"
          >
            Scale
          </button>
          <button
            onClick={() => setActiveType("flip")}
            className="px-4 py-2 rounded bg-muted hover:bg-muted/80"
          >
            Flip
          </button>
        </div>

        <ViewTransitionWrapper name={`transition-${activeType}`}>
          <div className="p-8 bg-card rounded-xl border">
            <h2 className="text-2xl font-semibold mb-4">
              {activeType === "none"
                ? "No Transition"
                : `${activeType.charAt(0).toUpperCase() + activeType.slice(1)} Transition`}
            </h2>
            <p className="text-muted-foreground">
              Click the buttons above to see different transition effects.
            </p>
          </div>
        </ViewTransitionWrapper>
      </div>
    );
  },
};

// ============================================================================
// BROWSER SUPPORT NOTICE
// ============================================================================

export const BrowserSupport: Story = {
  render: () => {
    const supported = "startViewTransition" in document;

    return (
      <div className="p-8">
        <div
          className={`p-6 rounded-lg border ${
            supported
              ? "bg-status-success-muted/10 border-status-success/20 dark:bg-status-success-muted/20 dark:border-status-success/30"
              : "bg-status-warning-muted/10 border-status-warning/20 dark:bg-status-warning-muted/20 dark:border-status-warning/30"
          }`}
        >
          <h2 className="text-xl font-semibold mb-2">View Transitions API Support</h2>
          <p
            className={
              supported
                ? "text-status-success dark:text-status-success"
                : "text-status-warning dark:text-status-warning"
            }
          >
            {supported
              ? "✓ Supported! Your browser supports the View Transitions API."
              : "⚠ Not Supported. View Transitions API is not available in your browser."}
          </p>
        </div>

        <div className="mt-6 p-6 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Browser Support:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Chrome 111+</li>
            <li>Edge 111+</li>
            <li>Firefox (behind flag)</li>
            <li>Safari (in development)</li>
          </ul>
        </div>
      </div>
    );
  },
};
