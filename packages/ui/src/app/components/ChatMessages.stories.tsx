import type { Meta, StoryObj } from "@storybook/react-vite";

import { ChatMessages } from "./ChatMessages";

const meta: Meta<typeof ChatMessages> = {
  title: "ChatUI/ChatMessages",
  component: ChatMessages,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof ChatMessages>;

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-[#0D0D0D] flex">
      <ChatMessages />
    </div>
  ),
};

export const WithEmptyState: Story = {
  render: () => (
    <div className="min-h-screen bg-[#0D0D0D] flex">
      <ChatMessages
        emptyState={
          <div className="text-white/60 text-sm px-4 py-6">
            No messages yet. Start a conversation.
          </div>
        }
      />
    </div>
  ),
};