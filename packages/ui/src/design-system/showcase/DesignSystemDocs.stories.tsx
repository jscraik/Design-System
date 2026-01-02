import type { Meta, StoryObj } from "@storybook/react-vite";

import { DesignSystemDocs } from "./DesignSystemDocs";

const meta: Meta<typeof DesignSystemDocs> = {
  title: "Documentation/Design System/Design System Docs",
  component: DesignSystemDocs,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof DesignSystemDocs>;

export const Default: Story = {
  render: () => (
    <div className="min-h-screen">
      <DesignSystemDocs />
    </div>
  ),
};
