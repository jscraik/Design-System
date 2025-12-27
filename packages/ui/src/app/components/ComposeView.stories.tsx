import type { Meta, StoryObj } from "@storybook/react-vite";

import { ComposeView } from "./ComposeView";

const meta: Meta<typeof ComposeView> = {
  title: "ChatUI/ComposeView",
  component: ComposeView,
  parameters: {
    layout: "fullscreen",
  },
  render: () => (
    <div className="h-screen bg-[var(--foundation-bg-dark-1)]">
      <ComposeView />
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof ComposeView>;

export const Default: Story = {};

export const Framed: Story = {
  render: () => (
    <div className="h-screen bg-[var(--foundation-bg-dark-1)] p-6">
      <div className="h-full rounded-2xl border border-white/10 overflow-hidden">
        <ComposeView />
      </div>
    </div>
  ),
};
