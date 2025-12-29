import type { Meta, StoryObj } from "@storybook/react-vite";

import { ColorPaletteShowcase } from "./ColorPaletteShowcase";

const meta: Meta<typeof ColorPaletteShowcase> = {
  title: "Design System/Color Palette Showcase",
  component: ColorPaletteShowcase,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};