import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { radiusTokens } from "@astudio/tokens/radius";
import { shadowTokens } from "@astudio/tokens/shadows";

/**
 * Component Patterns - Design Foundation
 *
 * ## Overview
 * Individual design tokens are useful, but real UI is built from **combinations** of tokens.
 * This page documents common component patterns that combine multiple foundations.
 *
 * ## Pattern Philosophy
 * - **Consistent combinations**: All cards use the same token recipe
 * - **Semantic naming**: Pattern names describe usage, not appearance
 * - **Responsive behavior**: Patterns adapt across viewport sizes
 * - **Accessible by default**: Patterns include keyboard/focus support
 *
 * ## How to Use These Patterns
 * 1. Copy the token combination for your component type
 * 2. Adjust as needed for specific use cases
 * 3. Document deviations to prevent inconsistency
 * 4. Test across light/dark modes and responsive breakpoints
 */

const shadowToBoxShadow = (shadow: keyof typeof shadowTokens): string => {
  const layers = shadowTokens[shadow];
  return layers
    .map((layer) => `${layer.offsetX}px ${layer.offsetY}px ${layer.blur}px ${layer.spread}px ${layer.color}`)
    .join(", ");
};

// Standard Card Pattern
const StandardCard = ({ title, children, footer }: { title: string; children: React.ReactNode; footer?: React.ReactNode }) => (
  <div
    className="bg-card border transition-shadow hover:shadow-lg"
    style={{
      borderRadius: `${radiusTokens.r12}px`,
      boxShadow: shadowToBoxShadow("card"),
    }}
  >
    <div
      className="flex items-center border-b bg-muted/30"
      style={{ height: "56px" }}
    >
      <div className="font-semibold px-4">{title}</div>
    </div>
    <div className="p-4">{children}</div>
    {footer && (
      <div className="flex items-center gap-2 border-t p-4">
        {footer}
      </div>
    )}
  </div>
);

// Compact Card Pattern
const CompactCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div
    className="bg-card border"
    style={{
      borderRadius: `${radiusTokens.r8}px`,
      boxShadow: shadowToBoxShadow("card"),
    }}
  >
    <div
      className="flex items-center border-b bg-muted/30"
      style={{ height: "48px" }}
    >
      <div className="font-medium px-3 text-sm">{title}</div>
    </div>
    <div className="p-3">{children}</div>
  </div>
);

// Hero Card Pattern
const HeroCard = ({ title, description, action }: { title: string; description: string; action: React.ReactNode }) => (
  <div
    className="bg-card border p-6"
    style={{
      borderRadius: `${radiusTokens.r16}px`,
      boxShadow: shadowToBoxShadow("card"),
    }}
  >
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-muted-foreground mb-4">{description}</p>
    {action}
  </div>
);

// Modal Pattern
const ModalPattern = ({ title, children, actions }: { title: string; children: React.ReactNode; actions: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <button onClick={() => setOpen(true)} className="px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm">
        Open Modal
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/50"
            style={{ zIndex: 40 }}
            onClick={() => setOpen(false)}
          />
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border w-full max-w-md"
            style={{
              zIndex: 50,
              borderRadius: `${radiusTokens.r16}px`,
              boxShadow: shadowToBoxShadow("card"),
            }}
          >
            <div
              className="flex items-center justify-between border-b"
              style={{ height: "56px" }}
            >
              <div className="font-semibold px-4">{title}</div>
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1 rounded-md hover:bg-muted text-sm"
              >
                ✕
              </button>
            </div>
            <div className="p-4">{children}</div>
            <div className="flex items-center justify-end gap-2 border-t p-4">
              {actions}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Button Patterns
const ButtonPatterns = () => (
  <div className="space-y-4">
    <div>
      <h4 className="text-sm font-medium mb-2">Primary Button</h4>
      <div className="flex flex-wrap gap-2">
        <button
          className="px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm"
          style={{ height: "44px" }}
        >
          Default
        </button>
        <button
          className="px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm opacity-80"
          style={{ height: "44px" }}
        >
          Hover
        </button>
        <button
          className="px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm opacity-60"
          style={{ height: "44px" }}
        >
          Disabled
        </button>
      </div>
      <div className="text-xs text-muted-foreground mt-2">
        r8 radius • 44px height • s8 vertical padding • accent background
      </div>
    </div>

    <div>
      <h4 className="text-sm font-medium mb-2">Secondary Button</h4>
      <div className="flex flex-wrap gap-2">
        <button
          className="px-4 py-2 rounded-md bg-muted text-sm"
          style={{ height: "44px" }}
        >
          Default
        </button>
        <button
          className="px-4 py-2 rounded-md border text-sm"
          style={{ height: "44px" }}
        >
          Outline
        </button>
        <button
          className="px-4 py-2 rounded-md bg-accent/10 text-accent text-sm"
          style={{ height: "44px" }}
        >
          Ghost
        </button>
      </div>
      <div className="text-xs text-muted-foreground mt-2">
        Same sizing, different backgrounds
      </div>
    </div>
  </div>
);

// Input Patterns
const InputPatterns = () => (
  <div className="space-y-4 max-w-md">
    <div>
      <label className="text-sm font-medium mb-1.5 block">Standard Input</label>
      <input
        type="text"
        placeholder="Enter text..."
        className="w-full px-3 rounded-md border bg-background text-sm"
        style={{ height: "44px" }}
      />
      <div className="text-xs text-muted-foreground mt-1">
        r10 radius • 44px height • s8 horizontal padding • border
      </div>
    </div>

    <div>
      <label className="text-sm font-medium mb-1.5 block">With Icon</label>
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-3 rounded-md border bg-background text-sm"
          style={{ height: "44px" }}
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        Add s8 padding-left for icon
      </div>
    </div>
  </div>
);

// Token Recipe Card
const TokenRecipeCard = ({
  name,
  description,
  tokens,
  recipe,
}: {
  name: string;
  description: string;
  tokens: string[];
  recipe: React.ReactNode;
}) => (
  <div className="rounded-lg border bg-card p-4">
    <h4 className="font-semibold mb-1">{name}</h4>
    <p className="text-sm text-muted-foreground mb-3">{description}</p>

    <div className="mb-3">
      <div className="text-xs text-muted-foreground mb-1">Tokens Used:</div>
      <div className="flex flex-wrap gap-1">
        {tokens.map((token) => (
          <span
            key={token}
            className="px-2 py-0.5 rounded bg-muted text-xs font-mono"
          >
            {token}
          </span>
        ))}
      </div>
    </div>

    <div className="mb-3">{recipe}</div>
  </div>
);

const meta = {
  title: "Design System/11 Component Patterns",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Component patterns showing how tokens combine into reusable UI elements.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const CardPatterns: Story = {
  name: "Card Patterns",
  render: () => (
    <div className="max-w-5xl space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Card Component Patterns</h2>
        <p className="text-muted-foreground mb-6">
          Standard card patterns combining radius, spacing, elevation, and size tokens.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Standard Card</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StandardCard title="Card Title" footer={<button className="px-3 py-1.5 rounded-md bg-accent text-accent-foreground text-sm">Action</button>}>
              <p className="text-sm text-muted-foreground">
                This is the standard card pattern. Use for most content cards.
              </p>
            </StandardCard>
            <StandardCard title="With Content" footer={<div className="flex gap-2"><button className="px-3 py-1.5 rounded-md border text-sm">Cancel</button><button className="px-3 py-1.5 rounded-md bg-accent text-accent-foreground text-sm">Confirm</button></div>}>
              <p className="text-sm text-muted-foreground">
                Cards can have actions in the footer.
              </p>
            </StandardCard>
          </div>
          <div className="mt-3 p-3 rounded bg-muted">
            <div className="text-xs font-mono text-sm">
              <strong>Token Recipe:</strong> r12 radius • card shadow • s16 padding • 56px header
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Compact Card</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CompactCard title="Small Card">
              <p className="text-xs text-muted-foreground">Compact card for tight layouts.</p>
            </CompactCard>
            <CompactCard title="Another">
              <p className="text-xs text-muted-foreground">Uses smaller radius and padding.</p>
            </CompactCard>
            <CompactCard title="Third">
              <p className="text-xs text-muted-foreground">Good for dashboards.</p>
            </CompactCard>
          </div>
          <div className="mt-3 p-3 rounded bg-muted">
            <div className="text-xs font-mono text-sm">
              <strong>Token Recipe:</strong> r8 radius • card shadow • s12 padding • 48px header
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Hero Card</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <HeroCard
              title="Feature Highlight"
              description="This card emphasizes important content with larger spacing and radius."
              action={<button className="px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm">Learn More</button>}
            />
            <HeroCard
              title="Call to Action"
              description="Use for featured content or promotional cards."
              action={<button className="px-4 py-2 rounded-md border text-sm">Get Started</button>}
            />
          </div>
          <div className="mt-3 p-3 rounded bg-muted">
            <div className="text-xs font-mono text-sm">
              <strong>Token Recipe:</strong> r16 radius • card shadow • s24 padding • no header (inline content)
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const ModalPatternStory: Story = {
  name: "Modal Pattern",
  render: () => (
    <div className="max-w-4xl space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Modal Component Pattern</h2>
        <p className="text-muted-foreground mb-6">
          Standard modal pattern combining foundations.
        </p>
      </div>

      <ModalPattern
        title="Modal Title"
        actions={
          <>
            <button className="px-3 py-1.5 rounded-md border text-sm">Cancel</button>
            <button className="px-3 py-1.5 rounded-md bg-accent text-accent-foreground text-sm">Confirm</button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          Modal content goes here. This pattern uses r16 radius for a softer appearance.
        </p>
      </ModalPattern>

      <div className="p-4 rounded-lg bg-muted">
        <div className="text-xs font-mono text-sm">
          <strong>Token Recipe:</strong> r16 radius • card shadow • overlay bg-black/50 • 56px header
        </div>
      </div>
    </div>
  ),
};

export const ButtonPatternsStory: Story = {
  name: "Button Patterns",
  render: () => (
    <div className="max-w-4xl space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Button Component Patterns</h2>
        <p className="text-muted-foreground mb-6">
          Standard button patterns combining size, radius, and spacing tokens.
        </p>
      </div>

      <ButtonPatterns />
    </div>
  ),
};

export const InputPatternsStory: Story = {
  name: "Input Patterns",
  render: () => (
    <div className="max-w-4xl space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Input Component Patterns</h2>
        <p className="text-muted-foreground mb-6">
          Standard input patterns combining size, radius, and spacing tokens.
        </p>
      </div>

      <InputPatterns />
    </div>
  ),
};

export const TokenRecipes: Story = {
  name: "Token Recipes",
  render: () => (
    <div className="max-w-4xl space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Token Combination Recipes</h2>
        <p className="text-muted-foreground mb-6">
          Quick reference for common component token combinations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TokenRecipeCard
          name="Standard Card"
          description="Default card for most content"
          tokens={["r12 radius", "card shadow", "s16 padding", "56px header"]}
          recipe={
            <div className="p-3 rounded bg-background border text-xs">
              <code>rounded-r12 shadow-card p-s16</code>
            </div>
          }
        />

        <TokenRecipeCard
          name="Primary Button"
          description="Main call-to-action button"
          tokens={["r8 radius", "44px height", "s8 padding", "accent bg"]}
          recipe={
            <div className="p-3 rounded bg-background border text-xs">
              <code>rounded-md h-[44px] px-s8 bg-accent</code>
            </div>
          }
        />

        <TokenRecipeCard
          name="Text Input"
          description="Standard text input field"
          tokens={["r10 radius", "44px height", "s8 padding", "border"]}
          recipe={
            <div className="p-3 rounded bg-background border text-xs">
              <code>rounded-r10 h-[44px] px-s8 border</code>
            </div>
          }
        />

        <TokenRecipeCard
          name="Modal"
          description="Modal dialog with overlay"
          tokens={["r16 radius", "card shadow", "overlay bg-black/50"]}
          recipe={
            <div className="p-3 rounded bg-background border text-xs">
              <code>rounded-r16 shadow-card bg-black/50 overlay</code>
            </div>
          }
        />

        <TokenRecipeCard
          name="Badge/Pill"
          description="Small status or tag indicator"
          tokens={["round radius", "pip shadow", "s8 padding"]}
          recipe={
            <div className="p-3 rounded bg-background border text-xs">
              <code>rounded-full shadow-pip px-s8</code>
            </div>
          }
        />

        <TokenRecipeCard
          name="Dropdown Menu"
          description="Floating menu with items"
          tokens={["r12 radius", "card shadow", "s8 item padding"]}
          recipe={
            <div className="p-3 rounded bg-background border text-xs">
              <code>rounded-r12 shadow-card py-s8</code>
            </div>
          }
        />
      </div>
    </div>
  ),
};

export const UsageGuidelines: Story = {
  name: "Usage Guidelines",
  render: () => (
    <div className="max-w-4xl space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Pattern Usage Guidelines</h2>
        <p className="text-muted-foreground">
          When to use each component pattern.
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-3">When to Use Each Card Pattern</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium">Standard Card (r12):</span> Most content cards,
              dashboard widgets, settings panels. Default choice.
            </div>
            <div>
              <span className="font-medium">Compact Card (r8):</span> Data-heavy tables, tight
              layouts, mobile-first interfaces where space is limited.
            </div>
            <div>
              <span className="font-medium">Hero Card (r16):</span> Featured content, landing
              page sections, promotional materials, empty states.
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-3">Combining Foundations</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium">Start with the pattern:</span> Copy the token recipe
              for your component type.
            </div>
            <div>
              <span className="font-medium">Adjust spacing:</span> Use larger spacing (s24-s32) for
              spacious layouts, smaller (s12-s16) for compact.
            </div>
            <div>
              <span className="font-medium">Maintain radius ratio:</span> Don't mix r8 and r16
              in the same layout without clear reason.
            </div>
            <div>
              <span className="font-medium">Elevation for hierarchy:</span> Same "height" elements get
              same shadow. Higher elements get stronger elevation.
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-3">Responsive Patterns</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium">Mobile:</span> Prefer compact cards (r8) with s12-s16
              padding to maximize content area.
            </div>
            <div>
              <span className="font-medium">Tablet:</span> Standard cards (r12) with s16-s24 padding
              provide good balance.
            </div>
            <div>
              <span className="font-medium">Desktop:</span> Hero cards (r16) with s24-s32 padding
              create spacious, premium feel.
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
