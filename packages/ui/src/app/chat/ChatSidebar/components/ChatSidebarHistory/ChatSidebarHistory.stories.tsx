import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";

import { ChatSidebarHistory } from "./ChatSidebarHistory";

const meta: Meta<typeof ChatSidebarHistory> = {
  title: "Components/Chat/Chat Sidebar History",
  component: ChatSidebarHistory,
  tags: ["autodocs"],
  args: {
    chatHistory: [
      "Design review follow-up",
      "Token audit fixes",
      "Widget flow polish",
      "UI library release plan",
      "Accessibility check",
    ],
    searchQuery: "",
    selectedId: "chat-1",
    onSelect: fn(),
  },
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => (
    <div className="min-h-dvh w-72 border-r border-muted bg-background">
      <ChatSidebarHistory {...args} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof ChatSidebarHistory>;

export const DefaultSelected: Story = {};

export const Filtered: Story = {
  args: {
    searchQuery: "design",
    selectedId: "chat-0",
  },
};
