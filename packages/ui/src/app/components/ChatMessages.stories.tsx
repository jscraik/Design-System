import type { Meta, StoryObj } from "@storybook/react-vite";

import { ChatMessages } from "./ChatMessages";

const meta: Meta<typeof ChatMessages> = {
  title: "ChatUI/ChatMessages",
  component: ChatMessages,
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => (
    <div className="min-h-screen bg-[var(--foundation-bg-dark-1)] flex">
      <ChatMessages {...args} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof ChatMessages>;

export const Default: Story = {
  args: {},
};

export const EmptyState: Story = {
  args: {
    messages: [],
    emptyState: (
      <div className="flex-1 flex items-center justify-center text-[var(--foundation-text-dark-tertiary)] text-sm">
        No messages yet
      </div>
    ),
  },
};
