/**
 * xKit CSS Pattern Stories
 *
 * Demonstrates CSS patterns extracted from @jh3yy, @emilkowalski, and @kubadesign
 * Reference: /Users/jamiecraik/dev/aStudio/docs/xkit-patterns-extracted.md
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

const meta: Meta = {
  title: "Effects/xKit Patterns",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs", "a11y", "patterns"],
};

export default meta;
type Story = StoryObj;

// ============================================================================
// HOVER ANTI-FLICKER PATTERN (Based on @emilkowalski)
// ============================================================================

/**
 * The anti-flicker pattern separates the hover trigger from the effect.
 * Listen for hovers on the parent, but animate a child element instead.
 *
 * Reference: https://x.com/emilkowalski/status/1954891053032755560
 */
export const HoverAntiFlicker: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div className="text-sm text-muted-foreground">
        <p>
          Move your mouse over the cards below. Notice how the hover effect is smooth without any
          flickering.
        </p>
      </div>

      <div className="flex gap-8">
        {/* Flicker-prone example (what NOT to do) */}
        <div className="text-center">
          <p className="text-xs text-status-error mb-2">❌ Flicker-prone (animating parent)</p>
          <div className="relative w-48 h-32 bg-red-50 dark:bg-red-900/20 rounded-lg cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
            <p className="absolute inset-0 flex items-center justify-center text-sm">Hover Me</p>
          </div>
        </div>

        {/* Anti-flicker example (what TO do) */}
        <div className="text-center">
          <p className="text-xs text-status-success mb-2">✓ Anti-flicker (animating child)</p>
          <div className="hover-trigger relative w-48 h-32 bg-green-50 dark:bg-green-900/20 rounded-lg cursor-pointer">
            <p className="absolute inset-0 flex items-center justify-center text-sm">Hover Me</p>
            <div className="hover-effect absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  ),
};

// ============================================================================
// BUTTON PRESS STATES (Based on @emilkowalski patterns)
// ============================================================================

export const ButtonPressStates: Story = {
  render: () => (
    <div className="p-8 space-y-6">
      <div className="text-sm text-muted-foreground">
        <p>Press the buttons to see the scale(0.93) press effect.</p>
      </div>

      <div className="flex gap-4">
        <button className="hover-trigger relative px-6 py-3 bg-primary text-primary-foreground rounded-lg">
          <span>Primary Button</span>
          <span className="hover-effect absolute inset-0 bg-primary/90 rounded-lg" />
        </button>

        <button className="hover-trigger relative px-6 py-3 bg-secondary text-secondary-foreground rounded-lg">
          <span>Secondary Button</span>
          <span className="hover-effect absolute inset-0 bg-secondary/90 rounded-lg" />
        </button>

        <button className="hover-trigger relative px-6 py-3 bg-accent text-accent-foreground rounded-lg">
          <span>Accent Button</span>
          <span className="hover-effect absolute inset-0 bg-accent/90 rounded-lg" />
        </button>
      </div>

      <style>{`
        .hover-trigger:active span {
          transform: scale(0.93);
        }
        .hover-trigger:active .hover-effect {
          transform: scale(0.93);
        }
      `}</style>
    </div>
  ),
};

// ============================================================================
// FORM VALIDATION WITH :HAS() (Based on @jh3yy patterns)
// ============================================================================

export const FormValidationHas: Story = {
  render: () => {
    const [emailValue, setEmailValue] = useState("");

    return (
      <div className="p-8 space-y-6 max-w-md">
        <div className="text-sm text-muted-foreground">
          <p>
            The form below uses <code>:has()</code> to show error state when invalid.
          </p>
        </div>

        <form className="space-y-4">
          <div className="form-group:has(input:invalid):not(:focus-within) p-4 rounded-lg border-2 border-transparent bg-background transition-colors">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              placeholder="Enter a valid email"
              className="w-full px-3 py-2 rounded border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <p className="text-xs text-muted-foreground mt-2">
              Type to see the error state clear when focused
            </p>
          </div>

          <div className="quantity-picker:has(input:invalid):not(:focus-within) p-4 rounded-lg border-2 border-transparent bg-background transition-colors">
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <input
              type="number"
              min="1"
              max="100"
              placeholder="1-100"
              className="w-full px-3 py-2 rounded border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </form>

        <style>{`
          .form-group:has(input:invalid):not(:focus-within) {
            background: hsl(0 100% 50% / 0.1);
            border-color: hsl(0 100% 50% / 0.3);
          }
          .quantity-picker:has(input:invalid):not(:focus-within) {
            background: hsl(0 100% 50% / 0.14);
            border-color: hsl(0 100% 50% / 0.5);
          }
        `}</style>
      </div>
    );
  },
};

// ============================================================================
// 3D TRANSFORM PATTERNS (Based on @emilkowalski)
// ============================================================================

export const Transform3D: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div className="text-sm text-muted-foreground">
        <p>Hover over the cards to see 3D transform effects.</p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Scale(0) reveal */}
        <div className="hover-trigger group relative h-48 cursor-pointer">
          <div
            className="hover-effect absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl transition-all"
            style={{ transform: "scale(0)", transformOrigin: "bottom" }}
          />
          <div className="relative h-full bg-card rounded-xl border p-6 flex items-center justify-center">
            <span className="text-sm">Scale Reveal</span>
          </div>
          <style>{`
            .group:hover .hover-effect {
              transform: scale(1);
            }
          `}</style>
        </div>

        {/* RotateX flip */}
        <div className="hover-trigger group relative h-48 cursor-pointer perspective-1000">
          <div
            className="hover-effect absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl transition-all duration-500"
            style={{ transformStyle: "preserve-3d", transform: "rotateX(90deg)" }}
          />
          <div className="relative h-full bg-card rounded-xl border p-6 flex items-center justify-center">
            <span className="text-sm">3D Flip</span>
          </div>
          <style>{`
            .group:hover .hover-effect {
              transform: rotateX(0deg);
            }
          `}</style>
        </div>

        {/* Scale(0.93) press */}
        <div className="hover-trigger group relative h-48 cursor-pointer">
          <div
            className="hover-effect absolute inset-0 bg-gradient-to-br from-status-success to-status-success rounded-xl transition-all opacity-0 group-hover:opacity-100"
            style={{ transform: "scale(0.93)" }}
          />
          <div className="relative h-full bg-card rounded-xl border p-6 flex items-center justify-center">
            <span className="text-sm">Press Effect</span>
          </div>
          <style>{`
            .group:active .hover-effect {
              transform: scale(0.93);
            }
            .group:hover .hover-effect {
              opacity: 1;
            }
          `}</style>
        </div>
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  ),
};

// ============================================================================
// ACCORDION WITH GRID TRANSITION (Based on @jh3yy)
// ============================================================================

export const AccordionGridTransition: Story = {
  render: () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const items = [
      { title: "Item 1", content: "Content for item 1" },
      { title: "Item 2", content: "Content for item 2" },
      { title: "Item 3", content: "Content for item 3" },
    ];

    return (
      <div className="p-8 space-y-4 max-w-md">
        <div className="text-sm text-muted-foreground">
          <p>Accordion using grid-template-rows transition (no height animation).</p>
        </div>

        {items.map((item, index) => (
          <div key={index} className="accordion-item border rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-4 py-3 text-left font-medium hover:bg-muted/50 transition-colors"
            >
              {item.title}
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{
                gridTemplateRows: openIndex === index ? "1fr" : "0fr",
              }}
            >
              <div className="overflow-hidden">
                <div className="px-4 pb-4 text-muted-foreground">{item.content}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  },
};

// ============================================================================
// PATTERN REFERENCE
// ============================================================================

export const PatternReference: Story = {
  render: () => (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">xKit Pattern Reference</h1>

      <div className="space-y-6">
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">@jh3yy - CSS Anchor Positioning</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Scroll-driven animations using native CSS features
          </p>
          <code className="text-xs bg-background px-2 py-1 rounded">
            scroll-target-group: auto; anchor-name: --active; position-anchor: --active;
          </code>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">@emilkowalski - Hover Anti-Flicker</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Separate trigger from effect to prevent hover flickering
          </p>
          <code className="text-xs bg-background px-2 py-1 rounded">
            .parent:hover .child {/* animate child */}
          </code>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">@emilkowalski - Press States</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Subtle scale(0.93) for tactile press feedback
          </p>
          <code className="text-xs bg-background px-2 py-1 rounded">transform: scale(0.93);</code>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">@jh3yy - :has() Validation</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Style parent based on child input validity
          </p>
          <code className="text-xs bg-background px-2 py-1 rounded">
            .form-group:has(input:invalid):not(:focus-within) {/* error state */}
          </code>
        </div>
      </div>

      <div className="mt-6 text-sm text-muted-foreground">
        <p>
          See{" "}
          <code className="bg-background px-1 rounded">
            /Users/jamiecraik/dev/aStudio/docs/xkit-patterns-extracted.md
          </code>{" "}
          for full documentation.
        </p>
      </div>
    </div>
  ),
};
