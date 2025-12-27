import type { Meta, StoryObj } from "@storybook/react-vite";

import { ChatSidebar } from "./ChatSidebar";

const meta: Meta<typeof ChatSidebar> = {
  title: "ChatUI/ChatSidebar",
  component: ChatSidebar,
  args: {
    isOpen: true,
    onToggle: () => {},
    onProjectSelect: () => {},
  },
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => (
    <div className="h-screen bg-[var(--foundation-bg-dark-1)]">
      <ChatSidebar {...args} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof ChatSidebar>;

export const DefaultOpen: Story = {};
