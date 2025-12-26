import type { Meta, StoryObj } from "@storybook/react-vite";

import { ChatSidebar } from "./ChatSidebar";

const meta: Meta<typeof ChatSidebar> = {
  title: "ChatUI/ChatSidebar",
  component: ChatSidebar,
  args: {
    isOpen: true,
  },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof ChatSidebar>;

export const DefaultOpen: Story = {
  render: (args) => (
    <div className="h-screen bg-[#0D0D0D]">
      <ChatSidebar {...args} onToggle={() => {}} onProjectSelect={() => {}} />
    </div>
  ),
};

export const Collapsed: Story = {
  args: {
    isOpen: false,
  },
  render: (args) => (
    <div className="h-screen bg-[#0D0D0D]">
      <ChatSidebar {...args} onToggle={() => {}} onProjectSelect={() => {}} />
    </div>
  ),
};