import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { radiusTokens } from "@design-studio/tokens/radius";

/**
 * # Interactive States Gallery
 *
 * **Purpose**: Show components in multiple states side-by-side for comparison.
 *
 * **Emil Kowalski**: Motion teaches state. Show what happens when you interact.
 * **Jhey Tompkins**: CSS-first states. Use `data-*` attributes, not JS toggles.
 *
 * ## What This Demonstrates
 * - Hover, focus, active, disabled states simultaneously
 * - Loading, error, success states with visual feedback
 * - Reduced-motion behavior comparison
 * - Keyboard navigation patterns
 */

// State Gallery Card - shows multiple states at once
const StateGalleryCard = ({ title, states }: { title: string; states: Array<{ name: string; state: string; element: React.ReactNode }> }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">{title}</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {states.map(({ name, state, element }) => (
        <div key={name} className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {state}
          </div>
          <div className="flex items-center justify-center p-6 rounded-lg border bg-card min-h-[100px]">
            {element}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Button with all states
const ButtonStates = () => {
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);

  return (
    <div className="flex flex-wrap gap-4">
      {/* Default */}
      <button
        className="px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm font-medium"
        style={{ borderRadius: `${radiusTokens.r8}px` }}
      >
        Default
      </button>

      {/* Hover */}
      <button
        className="px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors"
        style={{ borderRadius: `${radiusTokens.r8}px` }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {hovered ? "Hovering" : "Hover"}
      </button>

      {/* Active/Pressed */}
      <button
        className="px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm font-medium active:scale-95 transition-transform"
        style={{ borderRadius: `${radiusTokens.r8}px`, transform: pressed ? "scale(0.95)" : undefined }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
      >
        {pressed ? "Pressed" : "Press"}
      </button>

      {/* Focus */}
      <button
        className="px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        style={{ borderRadius: `${radiusTokens.r8}px` }}
      >
        Focus
      </button>

      {/* Disabled */}
      <button
        disabled
        className="px-4 py-2 rounded-md bg-muted text-muted-foreground text-sm font-medium cursor-not-allowed opacity-50"
        style={{ borderRadius: `${radiusTokens.r8}px` }}
      >
        Disabled
      </button>

      {/* Loading */}
      <button
        disabled
        className="px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm font-medium opacity-80 relative"
        style={{ borderRadius: `${radiusTokens.r8}px` }}
      >
        <span className="opacity-0">Loading</span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
        </div>
      </button>
    </div>
  );
};

// Input with all states
const InputStates = () => {
  const [focused, setFocused] = React.useState(false);

  return (
    <div className="flex flex-wrap gap-4 max-w-md">
      {/* Default */}
      <input
        type="text"
        placeholder="Default"
        className="w-40 px-3 rounded-md border bg-background text-sm"
        style={{ height: "44px", borderRadius: `${radiusTokens.r10}px` }}
      />

      {/* Focus */}
      <input
        type="text"
        placeholder={focused ? "Focused!" : "Focus me"}
        className="w-40 px-3 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        style={{ height: "44px", borderRadius: `${radiusTokens.r10}px` }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />

      {/* Error */}
      <div className="relative w-40">
        <input
          type="text"
          placeholder="Error state"
          className="w-full px-3 rounded-md border bg-background text-sm"
          style={{ height: "44px", borderRadius: `${radiusTokens.r10}px`, borderColor: "var(--color-error)" }}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm">⚠️</div>
      </div>

      {/* Disabled */}
      <input
        disabled
        type="text"
        placeholder="Disabled"
        className="w-40 px-3 rounded-md border bg-muted text-muted-foreground text-sm cursor-not-allowed"
        style={{ height: "44px", borderRadius: `${radiusTokens.r10}px` }}
      />
    </div>
  );
};

const meta: Meta = {
  title: "Design System/10 Interactive States",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Interactive component states shown side-by-side for comparison. Learn hover, focus, active, disabled, loading, and error states.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const ButtonStateGallery: Story = {
  name: "Button States",
  render: () => (
    <div className="max-w-5xl p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Button State Gallery</h1>
        <p className="text-muted-foreground">
          All button states shown simultaneously. Hover, press, and focus to see interactions.
        </p>
      </div>

      <StateGalleryCard
        title="Primary Button"
        states={[
          { name: "default", state: "Default", element: <ButtonStates /> },
        ]}
      />

      <div className="rounded-lg border bg-card p-6">
        <h3 className="font-semibold mb-4">Interaction Guidelines</h3>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Hover:</span> 150ms ease-out, slight opacity change (80% → 100%)
          </div>
          <div>
            <span className="font-medium">Active/Press:</span> Immediate scale(0.95) for tactile feedback
          </div>
          <div>
            <span className="font-medium">Focus:</span> 2px ring with offset, visible on keyboard navigation
          </div>
          <div>
            <span className="font-medium">Disabled:</span> 50% opacity, no pointer events
          </div>
        </div>
      </div>
    </div>
  ),
};

export const InputStateGallery: Story = {
  name: "Input States",
  render: () => (
    <div className="max-w-5xl p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Input State Gallery</h1>
        <p className="text-muted-foreground">
          Input field states: default, focus, error, disabled.
        </p>
      </div>

      <StateGalleryCard
        title="Text Input"
        states={[
          { name: "default", state: "Default", element: <InputStates /> },
        ]}
      />

      <div className="rounded-lg border bg-card p-6">
        <h3 className="font-semibold mb-4">Input Guidelines</h3>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Height:</span> 44px minimum (touch target)
          </div>
          <div>
            <span className="font-medium">Focus:</span> 2px ring, maintains contrast ratio
          </div>
          <div>
            <span className="font-medium">Error:</span> Red border + icon indicator
          </div>
          <div>
            <span className="font-medium">Disabled:</span> Muted background, no pointer events
          </div>
        </div>
      </div>
    </div>
  ),
};

export const MotionComparison: Story = {
  name: "Motion Comparison",
  render: () => (
    <div className="max-w-5xl p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Motion Duration Comparison</h1>
        <p className="text-muted-foreground">
          Side-by-side comparison of motion timings. See the difference 50ms makes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Fast (100ms)</h3>
          <button
            className="w-full px-4 py-3 rounded-md bg-accent text-accent-foreground transition-all"
            style={{ borderRadius: `${radiusTokens.r8}px`, transitionDuration: "100ms" }}
          >
            Hover me (100ms)
          </button>
          <div className="text-sm text-muted-foreground">
            Best for: Button hover, checkbox toggle
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Standard (200ms)</h3>
          <button
            className="w-full px-4 py-3 rounded-md bg-accent text-accent-foreground transition-all"
            style={{ borderRadius: `${radiusTokens.r8}px`, transitionDuration: "200ms" }}
          >
            Hover me (200ms)
          </button>
          <div className="text-sm text-muted-foreground">
            Best for: Modal open/close, tab switch
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-accent/5 p-6">
        <h3 className="font-semibold mb-4">Reduced Motion Support</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Test this by enabling "prefers-reduced-motion" in your OS accessibility settings.
          All animations automatically respect this preference and skip to final state.
        </p>
        <div className="flex gap-2">
          <div className="px-3 py-1 rounded bg-background border text-xs font-mono">
            @media (prefers-reduced-motion: reduce) {"{"} * {"{"} transition: none !important; {"}"} {"}"}
          </div>
        </div>
      </div>
    </div>
  ),
};
