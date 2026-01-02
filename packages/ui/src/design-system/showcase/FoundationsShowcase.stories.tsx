import type { Meta, StoryObj } from "@storybook/react-vite";

import { FoundationsShowcase } from "./FoundationsShowcase";

const meta: Meta<typeof FoundationsShowcase> = {
  title: "Documentation/Design System/Foundations Showcase",
  component: FoundationsShowcase,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof FoundationsShowcase>;

export const Default: Story = {};
