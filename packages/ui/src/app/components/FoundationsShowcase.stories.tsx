import type { Meta, StoryObj } from "@storybook/react-vite";

import { FoundationsShowcase } from "./FoundationsShowcase";

const meta: Meta<typeof FoundationsShowcase> = {
  title: "DesignSystem/FoundationsShowcase",
  component: FoundationsShowcase,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof FoundationsShowcase>;

export const Default: Story = {};
