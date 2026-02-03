import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

/**
 * # Getting Started Tour
 *
 * **Purpose**: Your orientation to the aStudio design system.
 *
 * **Welcome**: This Storybook is your single source of truth for UI components, design tokens,
 * and implementation patterns. Everything you see here reflects the Figma foundations.
 *
 * ## What You'll Learn
 * - How to navigate this Storybook
 * - How to use design tokens in your components
 * - Quick start patterns for common UI needs
 * - Where to find component documentation
 */

// Welcome Story - The landing page for new developers
const WelcomeStory = () => {
  return (
    <div className="max-w-4xl p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Welcome to aStudio Design System</h1>
        <p className="text-xl text-muted-foreground">
          Your comprehensive guide to building consistent UI across ChatGPT widgets and standalone
          React applications.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-2xl font-semibold mb-4">What is this Storybook?</h2>
        <p className="text-muted-foreground mb-4">
          This is your living documentation for the design system. Every component, token, and
          pattern is documented here with working examples.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-background">
            <div className="font-medium mb-2">🎨 Design Tokens</div>
            <div className="text-sm text-muted-foreground">
              Colors, typography, spacing, radius, shadows, and motion
            </div>
          </div>
          <div className="p-4 rounded-lg bg-background">
            <div className="font-medium mb-2">🧩 UI Components</div>
            <div className="text-sm text-muted-foreground">
              Buttons, inputs, dialogs, and all interactive elements
            </div>
          </div>
          <div className="p-4 rounded-lg bg-background">
            <div className="font-medium mb-2">📐 Layout Patterns</div>
            <div className="text-sm text-muted-foreground">
              Cards, grids, responsive breakpoints, and containers
            </div>
          </div>
          <div className="p-4 rounded-lg bg-background">
            <div className="font-medium mb-2">♿ Accessibility</div>
            <div className="text-sm text-muted-foreground">
              Keyboard navigation, focus states, and ARIA patterns
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-2xl font-semibold mb-4">How to Navigate</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-medium shrink-0">
              1
            </div>
            <div>
              <div className="font-medium mb-1">Use the sidebar</div>
              <div className="text-sm text-muted-foreground">
                Browse by category: Design System (tokens, patterns), Components (UI elements), or
                Templates (full page layouts)
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-medium shrink-0">
              2
            </div>
            <div>
              <div className="font-medium mb-1">Explore story variants</div>
              <div className="text-sm text-muted-foreground">
                Each component has multiple stories showing different states, sizes, and
                combinations. Use the tabs to switch between them.
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-medium shrink-0">
              3
            </div>
            <div>
              <div className="font-medium mb-1">Check the Controls panel</div>
              <div className="text-sm text-muted-foreground">
                Many stories have interactive controls. Toggle them to see how the component
                responds to different props and themes.
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-medium shrink-0">
              4
            </div>
            <div>
              <div className="font-medium mb-1">View the code</div>
              <div className="text-sm text-muted-foreground">
                Click the &quot;Code&quot; tab to see the implementation. Copy-paste ready.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-accent/10 p-6">
        <h2 className="text-xl font-semibold mb-2">🚀 Quick Start</h2>
        <p className="text-sm text-muted-foreground mb-4">
          New to the project? Start with these stories:
        </p>
        <div className="space-y-2 text-sm">
          <div>
            <code className="px-2 py-1 rounded bg-background">Design System / Colors</code> — See
            all color tokens and usage examples
          </div>
          <div>
            <code className="px-2 py-1 rounded bg-background">Design System / Typography</code> —
            Explore the type scale and font pairing
          </div>
          <div>
            <code className="px-2 py-1 rounded bg-background">Design System / Spacing</code> — Learn
            the spacing scale (s4 through s32)
          </div>
          <div>
            <code className="px-2 py-1 rounded bg-background">Interactive States</code> — See hover,
            focus, and active states
          </div>
        </div>
      </div>
    </div>
  );
};

// Using Tokens Story - Shows how to use tokens in components
const UsingTokensStory = () => {
  return (
    <div className="max-w-4xl p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Using Design Tokens</h1>
        <p className="text-muted-foreground">
          Learn how to apply design tokens consistently in your components.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">What are Design Tokens?</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Design tokens are the single source of truth for all visual decisions. Instead of
          hardcoding values like <code className="px-1 py-0.5 rounded bg-muted">#FF5733</code>
          {" or "}
          <code className="px-1 py-0.5 rounded bg-muted">16px</code>, use semantic names like{" "}
          <code className="px-1 py-0.5 rounded bg-muted">bg-accent</code> or{" "}
          <code className="px-1 py-0.5 rounded bg-muted">p-s16</code>.
        </p>
        <div className="p-4 rounded-lg bg-muted">
          <div className="text-sm font-medium mb-2">Why this matters</div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>✓ Consistency: Same value everywhere, same name</li>
            <li>✓ Maintainability: Update once, change everywhere</li>
            <li>✓ Theme support: Tokens adapt to light/dark modes</li>
            <li>
              ✓ Intent-based: <code className="px-1 py-0.5 rounded bg-background">s16</code> means
              &quot;medium spacing&quot;, not &quot;16px&quot;
            </li>
          </ul>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Token Categories</h2>
        <div className="space-y-4">
          <div>
            <div className="font-medium mb-2">🎨 Colors</div>
            <div className="text-sm text-muted-foreground mb-2">
              Background, text, border, and accent colors
            </div>
            <code className="block text-xs bg-background p-3 rounded">
              bg-accent text-accent-foreground text-muted-foreground border-border
            </code>
          </div>
          <div>
            <div className="font-medium mb-2">📏 Spacing</div>
            <div className="text-sm text-muted-foreground mb-2">
              Consistent spacing scale from s4 (4px) to s32 (32px)
            </div>
            <code className="block text-xs bg-background p-3 rounded">p-s8 m-s16 gap-s4</code>
          </div>
          <div>
            <div className="font-medium mb-2">🔳 Radius</div>
            <div className="text-sm text-muted-foreground mb-2">
              Border radius from r0 (sharp) to r24 (round)
            </div>
            <code className="block text-xs bg-background p-3 rounded">
              rounded-lg (r8) rounded-xl (r12)
            </code>
          </div>
          <div>
            <div className="font-medium mb-2">🌊 Motion</div>
            <div className="text-sm text-muted-foreground mb-2">
              Duration and easing for animations
            </div>
            <code className="block text-xs bg-background p-3 rounded">duration-150 ease-out</code>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Practical Examples</h2>
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium mb-2">Example 1: Styled Button</div>
            <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
              {`<button className="
  px-s16 py-s8           // spacing tokens
  rounded-lg             // radius token (r8)
  bg-accent              // color token
  text-accent-foreground // semantic text color
  hover:bg-accent/90     // hover state
  transition-colors      // smooth transition
">
  Click me
</button>`}
            </pre>
          </div>
          <div>
            <div className="text-sm font-medium mb-2">Example 2: Card Component</div>
            <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
              {`<div className="
  border                 // from border token
  bg-card                // semantic background
  rounded-xl             // radius (r12)
  p-s16                  // padding (16px)
  shadow-card            // elevation shadow
">
  <h3 className="text-lg font-semibold mb-s2">Title</h3>
  <p className="text-muted-foreground">Description</p>
</div>`}
            </pre>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-accent/10 p-6">
        <h2 className="text-xl font-semibold mb-2">💡 Pro Tips</h2>
        <ul className="text-sm space-y-2">
          <li>
            • Use semantic colors like{" "}
            <code className="px-1 py-0.5 rounded bg-background">bg-accent</code> instead of raw hex
            values
          </li>
          <li>
            • Combine tokens:{" "}
            <code className="px-1 py-0.5 rounded bg-background">px-s16 py-s8</code> for
            horizontal/vertical spacing
          </li>
          <li>• Tailwind IDE extensions provide autocomplete for all tokens</li>
          <li>• Check the Design System section to see all available tokens</li>
        </ul>
      </div>
    </div>
  );
};

// Component Patterns Story - Common UI patterns
const ComponentPatternsStory = () => {
  const [activeTab, setActiveTab] = React.useState("buttons");
  const [inputValue, setInputValue] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  return (
    <div className="max-w-4xl p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Component Patterns</h1>
        <p className="text-muted-foreground">Common UI patterns with copy-paste ready code.</p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Pattern Selector</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Select a pattern to see the implementation and code.
        </p>

        <div className="flex gap-2 mb-6">
          {["buttons", "inputs", "cards", "dialogs"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === "buttons" && (
          <div className="space-y-6">
            <div>
              <div className="text-sm font-medium mb-2">Preview</div>
              <div className="flex gap-3 p-4 rounded-lg bg-background">
                <button className="px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm">
                  Primary
                </button>
                <button className="px-4 py-2 rounded-md border text-sm">Secondary</button>
                <button className="px-4 py-2 rounded-md bg-muted text-sm opacity-50 cursor-not-allowed">
                  Disabled
                </button>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Code</div>
              <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
                {`// Primary button
<button className="
  px-s16 py-s8
  rounded-lg
  bg-accent text-accent-foreground
  hover:bg-accent/90
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
">
  Primary
</button>

// Secondary button
<button className="
  px-s16 py-s8
  rounded-lg
  border
  hover:bg-muted
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
">
  Secondary
</button>

// Disabled state
<button
  disabled
  className="
    px-s16 py-s8
    rounded-lg
    bg-muted
    opacity-50 cursor-not-allowed
  "
>
  Disabled
</button>`}
              </pre>
            </div>
          </div>
        )}

        {activeTab === "inputs" && (
          <div className="space-y-6">
            <div>
              <div className="text-sm font-medium mb-2">Preview</div>
              <div className="p-4 rounded-lg bg-background">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter text..."
                  className="w-full px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Typed: {inputValue || "(nothing yet)"}
                </p>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Code</div>
              <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
                {`const [value, setValue] = useState("");

<input
  type="text"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Enter text..."
  className="
    w-full
    px-s12 py-s8
    rounded-lg
    border
    bg-background
    text-sm
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-accent
  "
/>`}
              </pre>
            </div>
          </div>
        )}

        {activeTab === "cards" && (
          <div className="space-y-6">
            <div>
              <div className="text-sm font-medium mb-2">Preview</div>
              <div className="p-4 rounded-lg bg-background">
                <div className="border bg-card rounded-xl p-4 shadow-card">
                  <div className="flex items-center border-b pb-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="text-lg">🎨</span>
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold">Card Title</div>
                      <div className="text-xs text-muted-foreground">Optional subtitle</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Card content goes here. This pattern works for dashboards, lists, and content
                    displays.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Code</div>
              <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
                {`<div className="
  border
  bg-card
  rounded-xl
  p-s16
  shadow-card
">
  {/* Header */}
  <div className="
    flex items-center
    border-b
    pb-s16 mb-s16
  ">
    <div className="
      w-10 h-10
      rounded-full
      bg-accent/20
      flex items-center justify-center
    ">
      🎨
    </div>
    <div className="ml-s12">
      <div className="font-semibold">Card Title</div>
      <div className="text-xs text-muted-foreground">
        Optional subtitle
      </div>
    </div>
  </div>

  {/* Content */}
  <p className="text-sm text-muted-foreground">
    Card content goes here...
  </p>
</div>`}
              </pre>
            </div>
          </div>
        )}

        {activeTab === "dialogs" && (
          <div className="space-y-6">
            <div>
              <div className="text-sm font-medium mb-2">Preview</div>
              <div className="p-4 rounded-lg bg-background">
                <button
                  onClick={() => setIsDialogOpen(true)}
                  className="px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm"
                >
                  Open Dialog
                </button>
                {isDialogOpen && (
                  <div className="fixed inset-0 bg-overlay/50 flex items-center justify-center p-4">
                    <div className="bg-card border rounded-xl p-6 w-full max-w-md shadow-card">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Dialog Title</h3>
                        <button
                          onClick={() => setIsDialogOpen(false)}
                          className="px-2 py-1 rounded-md hover:bg-muted text-sm"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-6">
                        Dialog content with important information or actions.
                      </p>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setIsDialogOpen(false)}
                          className="px-4 py-2 rounded-md border text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => setIsDialogOpen(false)}
                          className="px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Code</div>
              <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
                {`const [isOpen, setIsOpen] = useState(false);

<button onClick={() => setIsOpen(true)}>
  Open Dialog
</button>

{isOpen && (
  <>
    {/* Backdrop */}
    <div className="fixed inset-0 bg-overlay/50" />

    {/* Dialog */}
    <div className="
      fixed top-1/2 left-1/2
      -translate-x-1/2 -translate-y-1/2
      bg-card border
      rounded-xl
      p-s24
      w-full max-w-md
      shadow-card
    ">
      <h3 className="text-lg font-semibold mb-s16">
        Dialog Title
      </h3>
      <p className="text-sm text-muted-foreground mb-s24">
        Dialog content...
      </p>
      <div className="flex justify-end gap-s8">
        <button onClick={() => setIsOpen(false)}>
          Cancel
        </button>
        <button
          onClick={() => setIsOpen(false)}
          className="bg-accent text-accent-foreground"
        >
          Confirm
        </button>
      </div>
    </div>
  </>
)}`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const meta: Meta = {
  title: "Design System/01 Getting Started",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Your orientation to the aStudio design system. Learn how to navigate Storybook, use design tokens, and implement common patterns.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Welcome: Story = {
  name: "Welcome",
  render: () => <WelcomeStory />,
};

export const UsingTokens: Story = {
  name: "Using Design Tokens",
  render: () => <UsingTokensStory />,
};

export const ComponentPatterns: Story = {
  name: "Component Patterns",
  render: () => <ComponentPatternsStory />,
};
