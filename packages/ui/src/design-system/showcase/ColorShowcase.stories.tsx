import type { Meta, StoryObj } from "@storybook/react-vite";

import { ColorShowcase } from "./ColorShowcase";

/**
 * ColorShowcase displays all foundation color tokens from the design system.
 * Use this to verify colors match the Figma foundations spec.
 *
 * Shows:
 * - Dark theme colors (backgrounds, text, icons, accents)
 * - Light theme colors (backgrounds, text, icons, accents)
 * - Live CSS variable reference
 */
const meta: Meta<typeof ColorShowcase> = {
  title: "Documentation/Design System/Color Showcase",
  component: ColorShowcase,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark-1",
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ColorShowcase>;

/** Default view showing all color tokens */
export const Default: Story = {};

/** Dark background context */
export const OnDarkBackground: Story = {
  parameters: {
    backgrounds: {
      default: "dark-2",
    },
  },
};

/** Light background context */
export const OnLightBackground: Story = {
  parameters: {
    backgrounds: {
      default: "light-1",
    },
  },
};
