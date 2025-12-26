import type { Meta, StoryObj } from "@storybook/react";

import { ComposeView } from "./ComposeView";

const meta: Meta<typeof ComposeView> = {
  title: "ChatUI/ComposeView",
  component: ComposeView,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof ComposeView>;

export const Default: Story = {
  render: () => (
    <div className="h-screen">
      <ComposeView />
    </div>
  ),
};

export const Framed: Story = {
  render: () => (
    <div className="h-screen bg-[#0D0D0D] p-6">
      <div className="h-full rounded-2xl border border-white/10 overflow-hidden">
        <ComposeView />
      </div>
    </div>
  ),
};
