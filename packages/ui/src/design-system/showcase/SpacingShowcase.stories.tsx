import type { Meta, StoryObj } from "@storybook/react-vite";

import { SpacingShowcase } from "./SpacingShowcase";

const meta: Meta<typeof SpacingShowcase> = {
  title: "Documentation/Design System/Spacing Showcase",
  component: SpacingShowcase,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof SpacingShowcase>;

export const Default: Story = {
  render: () => (
    <div className="min-h-screen">
      <SpacingShowcase />
    </div>
  ),
};
