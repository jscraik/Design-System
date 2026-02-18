import type { Meta, StoryObj } from "@storybook/react-vite";

import { IconographyShowcase } from "./IconographyShowcase";

const meta: Meta<typeof IconographyShowcase> = {
  title: "Documentation/Design System/Iconography Showcase",
  component: IconographyShowcase,
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
