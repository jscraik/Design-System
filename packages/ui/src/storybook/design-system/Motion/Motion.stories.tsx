import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

/**
 * Motion System - Design Foundation
 *
 * ## Overview
 * Motion is communication, not decoration. Every animation should teach the user something
 * about what's happening in the interface.
 *
 * ## Core Principles (Emil Kowalski)
 * - **Motion is communication**: Animations explain state changes (where did it go? what happened?)
 * - **Less but better**: If you can't justify the animation, simplify it
 * - **Respect preferences**: Always honor `prefers-reduced-motion`
 * - **Performance matters**: Use CSS transforms, avoid layout thrashing
 *
 * ## Timing Scale
 * - **100ms**: Micro-interactions (button press, hover feedback, checkbox toggle)
 * - **150-200ms**: Navigation transitions (tab switch, dropdown open/close, panel slide)
 * - **200-300ms**: Layout changes (filter application, sort change, reflow)
 * - **500ms+**: Celebration moments (success animation, confetti, large reveals)
 *
 * ## Easing Functions
 * - **ease-out** (entry): Elements arrive quickly, decelerate smoothly (natural arrival)
 * - **ease-in** (exit): Elements accelerate away (swift departure)
 * - **ease-in-out** (movement): Combined acceleration/deceleration (smooth travel)
 * - **linear**: Only for continuous motion (loading spinners, progress bars)
 *
 * ## CSS-First Approach (Jhey Tompkins)
 * - Prefer `transform` and `opacity` (GPU-accelerated, no reflow)
 * - Avoid animating `width`, `height`, `top`, `left` (triggers layout)
 * - Use `will-change` sparingly (browser optimization hint)
 * - Test at 60fps on target devices
 *
 * ## Accessibility
 * - **Always respect** `prefers-reduced-motion` (system preference)
 * - **Never** block task completion with animation
 * - **Provide** skip animation option for long sequences
 * - **Ensure** keyboard focus remains visible during motion
 */

const TIMING_SCALE = [
  {
    name: "micro",
    duration: 100,
    usage: "Button press, hover feedback, checkbox toggle",
    easing: "ease-out",
    examples: ["Button press", "Hover lift", "Toggle switch", "Checkbox check"],
  },
  {
    name: "fast",
    duration: 150,
    usage: "Quick transitions, dropdown open/close, tooltip show/hide",
    easing: "ease-out",
    examples: ["Dropdown", "Tooltip", "Popover", "Menu item hover"],
  },
  {
    name: "standard",
    duration: 200,
    usage: "Tab switch, panel slide, modal fade in",
    easing: "ease-in-out",
    examples: ["Tab switch", "Panel slide", "Modal open", "Page transition"],
  },
  {
    name: "slow",
    duration: 300,
    usage: "Layout reflow, filter application, complex transitions",
    easing: "ease-in-out",
    examples: ["Filter apply", "Sort change", "Card shuffle", "List reorder"],
  },
  {
    name: "celebration",
    duration: 500,
    usage: "Success moments, completion, large reveals",
    easing: "ease-out",
    examples: ["Success check", "Confetti", "Achievement unlock", "Feature reveal"],
  },
] as const;

const EASING_FUNCTIONS = [
  {
    name: "ease-out",
    curve: "cubic-bezier(0, 0, 0.2, 1)",
    description: "Fast start, slow end (natural arrival)",
    useFor: "Elements entering, hover lift, press feedback",
  },
  {
    name: "ease-in",
    curve: "cubic-bezier(0.4, 0, 1, 1)",
    description: "Slow start, fast end (swift departure)",
    useFor: "Elements exiting, dismiss, slide away",
  },
  {
    name: "ease-in-out",
    curve: "cubic-bezier(0.4, 0, 0.2, 1)",
    description: "Smooth acceleration and deceleration",
    useFor: "Movement between positions, layout changes",
  },
  {
    name: "linear",
    curve: "linear",
    description: "Constant speed (no acceleration)",
    useFor: "Loading spinners, progress bars, continuous motion",
  },
] as const;

// Demo component for timing
const TimingDemo = ({ duration, easing }: { duration: number; easing: string }) => {
  const [animating, setAnimating] = React.useState(false);

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border bg-card">
      <button
        onClick={() => {
          setAnimating(true);
          setTimeout(() => setAnimating(false), duration + 100);
        }}
        className="px-3 py-1.5 rounded-md bg-accent text-accent-foreground text-sm"
      >
        Animate ({duration}ms)
      </button>
      <div
        className="w-16 h-16 rounded bg-accent/20 flex items-center justify-center text-accent"
        style={{
          transform: animating ? "translateX(100px) scale(1.1)" : "translateX(0) scale(1)",
          transition: `transform ${duration}ms ${easing}`,
        }}
      >
        Box
      </div>
    </div>
  );
};

// Demo component for easing
const EasingDemo = ({ easing, label }: { easing: string; label: string }) => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const animate = () => {
      setProgress(0);
      requestAnimationFrame(() => {
        setProgress(1);
      });
    };
    animate();
    const interval = setInterval(animate, 2000);
    return () => clearInterval(interval);
  }, [easing]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="font-mono text-xs text-muted-foreground">{easing}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full"
          style={{
            width: "100%",
            transformOrigin: "left",
            transform: `scaleX(${progress})`,
            transition: "transform 1.5s ease-in-out",
          }}
        />
      </div>
    </div>
  );
};

// Hover lift demo
const HoverLiftDemo = () => (
  <div className="space-y-6 p-6">
    <div>
      <h3 className="text-lg font-semibold mb-2">Hover Lift (150ms ease-out)</h3>
      <p className="text-sm text-muted-foreground">
        Standard hover feedback: slight elevation + scale increase.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { name: "Subtle", lift: "translateY(-2px)", scale: "scale(1.01)" },
        { name: "Standard", lift: "translateY(-4px)", scale: "scale(1.02)" },
        { name: "Prominent", lift: "translateY(-6px)", scale: "scale(1.03)" },
      ].map((variant) => (
        <div
          key={variant.name}
          className="p-6 rounded-lg border bg-card cursor-pointer transition-all duration-150 ease-out hover:shadow-lg"
          style={{
            transform: `${variant.lift} ${variant.scale}`,
          }}
        >
          <div className="font-medium mb-1">{variant.name}</div>
          <div className="text-sm text-muted-foreground">{variant.lift} • {variant.scale}</div>
        </div>
      ))}
    </div>

    <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
      <div className="text-sm font-medium text-accent">💡 Implementation</div>
      <pre className="text-sm bg-background p-3 rounded mt-2 overflow-x-auto">
{`transition: transform 150ms ease-out, box-shadow 150ms ease-out;

&:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 10px 15px -3px rgba(0 0 0 / 10%);
}`}
      </pre>
    </div>
  </div>
);

// Button press demo
const ButtonPressDemo = () => {
  const [pressed, setPressed] = React.useState<Record<string, boolean>>({});

  const handleMouseDown = (key: string) => setPressed((prev) => ({ ...prev, [key]: true }));
  const handleMouseUp = (key: string) => setPressed((prev) => ({ ...prev, [key]: false }));

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Button Press (100ms ease-out)</h3>
        <p className="text-sm text-muted-foreground">
          Immediate tactile feedback on press.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {[
          { key: "primary", label: "Primary Button", variant: "bg-accent text-accent-foreground" },
          { key: "secondary", label: "Secondary", variant: "bg-muted" },
          { key: "outline", label: "Outline", variant: "border" },
        ].map((btn) => (
          <button
            key={btn.key}
            onMouseDown={() => handleMouseDown(btn.key)}
            onMouseUp={() => handleMouseUp(btn.key)}
            onMouseLeave={() => handleMouseUp(btn.key)}
            className={`px-4 py-2 rounded-md text-sm transition-transform duration-100 ease-out ${btn.variant}`}
            style={{
              transform: pressed[btn.key] ? "scale(0.97)" : "scale(1)",
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
        <div className="text-sm font-medium text-accent">💡 Implementation</div>
        <pre className="text-sm bg-background p-3 rounded mt-2 overflow-x-auto">
{`transition: transform 100ms ease-out;

&:active {
  transform: scale(0.97);
}`}
        </pre>
      </div>
    </div>
  );
};

// Modal transition demo
const ModalTransitionDemo = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Modal Open/Close (200ms ease-in-out)</h3>
        <p className="text-sm text-muted-foreground">
          Smooth fade + scale for modal appearance.
        </p>
      </div>

      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm"
      >
        {open ? "Close" : "Open"} Modal
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
          style={{
            animation: "fadeIn 200ms ease-in-out",
          }}
        >
          <div
            className="bg-card rounded-lg p-6 max-w-md w-full"
            style={{
              animation: "scaleIn 200ms ease-out",
            }}
          >
            <h4 className="text-lg font-semibold mb-2">Modal Content</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Modal uses fade-in backdrop + scale-in content for smooth appearance.
            </p>
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

// Reduced motion demo
const ReducedMotionDemo = () => {
  const [respectsMotion, setRespectsMotion] = React.useState(true);
  const [animating, setAnimating] = React.useState(false);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Reduced Motion Support</h3>
        <p className="text-sm text-muted-foreground">
          Always respect `prefers-reduced-motion` for accessibility.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setRespectsMotion(!respectsMotion)}
          className={`px-3 py-1.5 rounded-md text-sm ${
            respectsMotion ? "bg-accent text-accent-foreground" : "bg-muted"
          }`}
        >
          {respectsMotion ? "Respecting" : "Ignoring"} Reduced Motion
        </button>
      </div>

      <div
        className="p-4 rounded-lg border bg-card"
        style={{
          // Simulate prefers-reduced-motion
          animation: respectsMotion && !animating ? "none" : undefined,
        }}
      >
        <button
          onClick={() => {
            if (respectsMotion) {
              // Skip animation
              return;
            }
            setAnimating(true);
            setTimeout(() => setAnimating(false), 500);
          }}
          disabled={respectsMotion}
          className="px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm disabled:opacity-50"
        >
          {respectsMotion ? "Motion Respected" : "Animate"}
        </button>

        <div
          className="mt-4 h-2 bg-muted rounded-full overflow-hidden"
          style={{
            transition: respectsMotion ? "none" : undefined,
          }}
        >
          <div
            className="h-full bg-accent rounded-full"
            style={{
              width: animating ? "100%" : "0%",
              transition: animating ? "width 500ms ease-out" : "none",
            }}
          />
        </div>
      </div>

      <div className="p-4 rounded-lg bg-muted">
        <div className="text-sm font-medium mb-2">Implementation Pattern</div>
        <pre className="text-sm bg-background p-3 rounded overflow-x-auto">
{`@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}`}
        </pre>
      </div>
    </div>
  );
};

const meta = {
  title: "Design System/Motion",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Motion system documentation with timing scale, easing functions, and accessibility guidelines.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const TimingScale: Story = {
  name: "Timing Scale",
  render: () => (
    <div className="max-w-4xl space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Motion Timing Scale</h2>
        <p className="text-muted-foreground mb-6">
          Duration guidelines for different interaction types.
        </p>
      </div>

      <div className="space-y-4">
        {TIMING_SCALE.map((timing) => (
          <div key={timing.name} className="rounded-lg border bg-card p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-semibold capitalize">{timing.name} ({timing.duration}ms)</div>
                <div className="text-sm text-muted-foreground">{timing.usage}</div>
              </div>
              <div className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                {timing.easing}
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xs text-muted-foreground mb-2">Examples:</div>
              <div className="flex flex-wrap gap-2">
                {timing.examples.map((example) => (
                  <span
                    key={example}
                    className="px-2 py-1 rounded-md bg-muted text-xs"
                  >
                    {example}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <TimingDemo duration={timing.duration} easing={timing.easing} />
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
        <div className="text-sm font-medium text-accent">💡 Key Insight</div>
        <p className="text-sm text-muted-foreground mt-1">
          Faster isn't always better. 100ms feels snappy for buttons, but 200-300ms creates
          thoughtful transitions for layout changes. Reserve 500ms+ for celebration moments.
        </p>
      </div>
    </div>
  ),
};

export const EasingFunctions: Story = {
  name: "Easing Functions",
  render: () => (
    <div className="max-w-4xl space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Easing Functions</h2>
        <p className="text-muted-foreground mb-6">
          Visual easing curves and when to use each.
        </p>
      </div>

      <div className="space-y-4">
        {EASING_FUNCTIONS.map((easing) => (
          <div key={easing.name} className="rounded-lg border bg-card p-4">
            <div className="font-semibold mb-1">{easing.name}</div>
            <div className="text-sm font-mono text-muted-foreground mb-2">{easing.curve}</div>
            <div className="text-sm text-muted-foreground mb-3">{easing.description}</div>
            <div className="text-sm mb-3">
              <span className="font-medium">Use for:</span> {easing.useFor}
            </div>
            <EasingDemo easing={easing.curve} label={easing.name} />
          </div>
        ))}
      </div>
    </div>
  ),
};

export const HoverLift: Story = {
  name: "Hover Lift",
  render: () => <HoverLiftDemo />,
};

export const ButtonPress: Story = {
  name: "Button Press",
  render: () => <ButtonPressDemo />,
};

export const ModalTransition: Story = {
  name: "Modal Transition",
  render: () => <ModalTransitionDemo />,
};

export const ReducedMotion: Story = {
  name: "Reduced Motion",
  render: () => <ReducedMotionDemo />,
};

export const BestPractices: Story = {
  name: "Best Practices",
  render: () => (
    <div className="max-w-4xl space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Motion Best Practices</h2>
        <p className="text-muted-foreground">
          Guidelines for creating effective, accessible animations.
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg border-l-4 border-accent bg-accent/5 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <div className="font-semibold text-accent">DO: Use CSS transforms</div>
              <p className="text-sm text-muted-foreground mt-1">
                Prefer <code>transform</code> and <code>opacity</code> for animations. These are
                GPU-accelerated and don't trigger layout reflows.
              </p>
              <div className="mt-3 p-3 rounded bg-muted">
                <code className="text-xs">
                  transform: translateY(-4px) scale(1.02); opacity: 0.95;
                </code>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-l-4 border-destructive bg-destructive/5 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✗</span>
            <div>
              <div className="font-semibold text-destructive">DON'T: Animate layout properties</div>
              <p className="text-sm text-muted-foreground mt-1">
                Avoid animating <code>width</code>, <code>height</code>, <code>top</code>, <code>left</code>.
                These trigger expensive layout recalculations.
              </p>
              <div className="mt-3 p-3 rounded bg-muted">
                <code className="text-xs text-destructive">
                  /* Avoid this: */ width: 200px; left: 50px;
                </code>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-l-4 border-accent bg-accent/5 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <div className="font-semibold text-accent">DO: Respect reduced motion preference</div>
              <p className="text-sm text-muted-foreground mt-1">
                Always check <code>prefers-reduced-motion</code> and disable or simplify
                animations for users who prefer reduced motion.
              </p>
              <div className="mt-3 p-3 rounded bg-muted">
                <code className="text-xs">
                  @media (prefers-reduced-motion: reduce) { /* disable animations */ }
                </code>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-l-4 border-destructive bg-destructive/5 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✗</span>
            <div>
              <div className="font-semibold text-destructive">DON'T: Block completion with animation</div>
              <p className="text-sm text-muted-foreground mt-1">
                Never force users to wait for an animation to finish before they can proceed.
                Animations should enhance, not obstruct.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-l-4 border-accent bg-accent/5 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <div className="font-semibold text-accent">DO: Animate with purpose</div>
              <p className="text-sm text-muted-foreground mt-1">
                Every animation should communicate something (state change, location,
                causality). If you can't explain what the animation teaches, remove it.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-l-4 border-destructive bg-destructive/5 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✗</span>
            <div>
              <div className="font-semibold text-destructive">DON'T: Animate just because you can</div>
              <p className="text-sm text-muted-foreground mt-1">
                "Less but better" — avoid gratuitous motion. If the animation doesn't serve
                a clear purpose, it's just visual noise.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-l-4 border-accent bg-accent/5 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <div className="font-semibold text-accent">DO: Match timing to interaction</div>
              <p className="text-sm text-muted-foreground mt-1">
                Fast interactions (button press) need fast feedback (100ms). Slower
                transitions (modal) can take longer (200ms).
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-l-4 border-destructive bg-destructive/5 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✗</span>
            <div>
              <div className="font-semibold text-destructive">
                DON'T: Use long durations for frequent interactions
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Hover states, dropdowns, and tabs should use 100-200ms. 500ms+ feels sluggish
                for common interactions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const TokenReference: Story = {
  name: "Token Reference",
  render: () => (
    <div className="max-w-4xl space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Quick Reference</h2>
        <p className="text-muted-foreground">
          Motion timing and easing values for implementation.
        </p>
      </div>

      <div className="rounded-lg border bg-card">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="text-left p-3 font-semibold">Duration</th>
              <th className="text-left p-3 font-semibold">Use For</th>
              <th className="text-left p-3 font-semibold">Easing</th>
            </tr>
          </thead>
          <tbody>
            {TIMING_SCALE.map((timing, i) => (
              <tr key={timing.name} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                <td className="p-3 font-mono text-sm">{timing.duration}ms</td>
                <td className="p-3 text-sm text-muted-foreground">{timing.usage}</td>
                <td className="p-3 font-mono text-xs">{timing.easing}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 rounded-lg bg-muted border">
        <div className="text-sm font-medium mb-2">Tailwind Transition Classes</div>
        <div className="text-sm space-y-1">
          <div><code>duration-100</code> → Micro-interactions</div>
          <div><code>duration-150</code> → Quick transitions</div>
          <div><code>duration-200</code> → Standard transitions</div>
          <div><code>duration-300</code> → Layout changes</div>
          <div><code>duration-500</code> → Celebrations</div>
          <div><code>ease-out</code> → Entry, hover lift</div>
          <div><code>ease-in</code> → Exit, dismiss</div>
          <div><code>ease-in-out</code> → Movement, layout</div>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-muted border">
        <div className="text-sm font-medium mb-2">CSS Custom Properties (Optional)</div>
        <pre className="text-sm bg-background p-3 rounded overflow-x-auto">
{`:root {
  --motion-duration-micro: 100ms;
  --motion-duration-fast: 150ms;
  --motion-duration-standard: 200ms;
  --motion-duration-slow: 300ms;
  --motion-duration-celebration: 500ms;
  --motion-easing-out: cubic-bezier(0, 0, 0.2, 1);
  --motion-easing-in: cubic-bezier(0.4, 0, 1, 1);
  --motion-easing-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}`}
        </pre>
      </div>
    </div>
  ),
};

// Enhanced Motion: Side-by-side timing comparison
export const TimingComparison: Story = {
  name: "Timing Comparison",
  render: () => (
    <div className="max-w-5xl p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Motion Timing Comparison</h1>
        <p className="text-muted-foreground">
          See the difference 50ms makes. Hover over each card to compare timings side-by-side.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { duration: 100, name: "Micro", usage: "Button hover, checkbox" },
          { duration: 150, name: "Fast", usage: "Dropdown, toggle" },
          { duration: 200, name: "Standard", usage: "Modal, tab" },
          { duration: 300, name: "Slow", usage: "Layout change" },
          { duration: 500, name: "Celebration", usage: "Success moment" },
        ].map((timing) => (
          <div key={timing.name} className="space-y-3">
            <div className="text-sm font-medium">{timing.name} ({timing.duration}ms)</div>
            <div
              className="p-4 rounded-lg border bg-accent/5 hover:bg-accent/10 transition-transform hover:scale-105 cursor-pointer"
              style={{ transitionDuration: `${timing.duration}ms` }}
            >
              <div className="text-sm text-center">Hover me!</div>
            </div>
            <div className="text-xs text-muted-foreground">{timing.usage}</div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border bg-accent/5 p-6">
        <h3 className="font-semibold mb-4">Emil Kowalski's Guidance</h3>
        <div className="text-sm space-y-2">
          <div>
            <span className="font-medium">100ms (Micro):</span> Feels instant, like electricity
          </div>
          <div>
            <span className="font-medium">200ms (Standard):</span> Feels responsive, not sluggish
          </div>
          <div>
            <span className="font-medium">500ms (Celebration):</span> Feels substantial, rewarding
          </div>
          <div className="text-muted-foreground italic mt-2">
            If you can't justify the timing, simplify it.
          </div>
        </div>
      </div>
    </div>
  ),
};

// Enhanced Motion: Easing function comparison
export const EasingComparison: Story = {
  name: "Easing Comparison",
  render: () => (
    <div className="max-w-5xl p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Easing Function Comparison</h1>
        <p className="text-muted-foreground">
          Different easing functions create distinct "feels." Hover to compare.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            name: "Ease Out",
            easing: "cubic-bezier(0, 0, 0.2, 1)",
            description: "Fast then slow",
            usage: "Entry, hover lift",
          },
          {
            name: "Ease In",
            easing: "cubic-bezier(0.4, 0, 1, 1)",
            description: "Slow then fast",
            usage: "Exit, dismiss",
          },
          {
            name: "Ease In Out",
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            description: "Smooth both ends",
            usage: "Movement, layout",
          },
        ].map((easing) => (
          <div key={easing.name} className="space-y-3">
            <div className="text-sm font-medium">{easing.name}</div>
            <div className="text-xs text-muted-foreground mb-2">{easing.description}</div>
            <div
              className="p-4 rounded-lg border bg-accent cursor-pointer hover:bg-accent/10"
              style={{
                transition: "transform 300ms",
                transitionTimingFunction: easing.easing as any,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateX(10px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <div className="text-sm text-center">→ Slide to see easing</div>
            </div>
            <div className="text-xs text-muted-foreground">{easing.usage}</div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border bg-accent/5 p-6">
        <h3 className="font-semibold mb-4">Choosing Easing Functions</h3>
        <div className="text-sm space-y-2">
          <div>
            <span className="font-medium">Entry:</span> Use ease-out (fast start, gentle stop)
          </div>
          <div>
            <span className="font-medium">Exit:</span> Use ease-in (gentle start, clean finish)
          </div>
          <div>
            <span className="font-medium">Movement:</span> Use ease-in-out (smooth both ways)
          </div>
        </div>
      </div>
    </div>
  ),
};

// Interactive motion demo with state control
export const InteractiveMotionDemo: Story = {
  name: "Interactive Motion Demo",
  render: () => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [isPressed, setIsPressed] = React.useState(false);

    return (
      <div className="max-w-4xl p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Interactive Motion Demo</h1>
          <p className="text-muted-foreground">
            Combine timing and easing for polished interactions. Hover and press to see.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4">Button Press</h3>
              <div
                className="p-8 rounded-lg border-2 border-accent flex items-center justify-center text-center cursor-pointer select-none"
                style={{
                  borderRadius: "12px",
                  transition: "transform 150ms ease-out, background-color 200ms",
                  transform: isPressed ? "scale(0.95)" : isHovered ? "scale(1.02)" : "scale(1)",
                  backgroundColor: isPressed ? "hsl(var(--color-accent) / 0.8)" : "",
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                  setIsHovered(false);
                  setIsPressed(false);
                }}
                onMouseDown={() => setIsPressed(true)}
                onMouseUp={() => setIsPressed(false)}
              >
                <div className="font-medium">{isPressed ? "Pressed!" : isHovered ? "Hover me" : "Press and hold"}</div>
              </div>
              <div className="mt-4 p-4 rounded-lg bg-muted text-sm space-y-2">
                <div><span className="font-mono">transform:</span> {isPressed ? "scale(0.95)" : isHovered ? "scale(1.02)" : "scale(1)"}</div>
                <div><span className="font-mono">timing:</span> 150ms ease-out</div>
                <div><span className="font-mono">feedback:</span> Immediate scale change</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4">State Timeline</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span>Default → Resting state</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent opacity-60" />
                  <span>Hover → 150ms ease-out scale(1.02)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent opacity-30" />
                  <span>Press → Immediate scale(0.95)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
};
