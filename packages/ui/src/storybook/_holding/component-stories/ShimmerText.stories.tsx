import type { Meta, StoryObj } from "@storybook/react-vite";

import { ShimmerText } from "./ShimmerText";

/**
 * ShimmerText component - loading placeholder with animated shimmer effect.
 *
 * ## Usage
 * ```tsx
 * import { ShimmerText } from "@design-studio/ui";
 *
 * <ShimmerText lines={3} lineHeight="md" />
 * ```
 *
 * ## Accessibility
 * - Uses `role="status"` and `aria-label="Loading content"` to indicate loading state
 * - Animated shimmer effect respects `prefers-reduced-motion`
 * * ## Keyboard Navigation
 * This component is decorative (loading indicator) and doesn't accept keyboard input.
 */

const meta: Meta<typeof ShimmerText> = {
  title: "Components/UI/Base/ShimmerText",
  component: ShimmerText,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A loading placeholder component with animated shimmer effect for indicating content is loading.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    lines: {
      control: "number",
      description: "Number of shimmer lines to display",
      table: {
        defaultValue: { summary: "3" },
      },
    },
    lineHeight: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Line height for shimmer lines",
      table: {
        defaultValue: { summary: "md" },
      },
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ShimmerText>;

export const Default: Story = {
  args: {
    lines: 3,
    lineHeight: "md",
  },
};

export const SingleLine: Story = {
  args: {
    lines: 1,
    lineHeight: "md",
  },
};

export const MultipleLines: Story = {
  args: {
    lines: 5,
    lineHeight: "md",
  },
};

export const Small: Story = {
  args: {
    lines: 3,
    lineHeight: "sm",
  },
};

export const Large: Story = {
  args: {
    lines: 3,
    lineHeight: "lg",
  },
};

export const CustomLines: Story = {
  args: {
    lines: 4,
    lineHeight: "md",
  },
};

// Accessibility test story for reduced motion
export const ReducedMotion: Story = {
  args: {
    lines: 3,
    lineHeight: "md",
  },
  parameters: {
    chromatic: {
      disable: false,
    },
  },
};
