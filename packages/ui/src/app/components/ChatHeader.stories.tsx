import type { Meta, StoryObj } from "@storybook/react";

import { ChatHeader } from "./ChatHeader";

const meta: Meta<typeof ChatHeader> = {
  title: "ChatUI/ChatHeader",
  component: ChatHeader,
  args: {
    isSidebarOpen: true,
    selectedModel: {
      name: "ChatGPT 5.2 Pro",
      shortName: "5.2 Pro",
      description: "Our most capable model",
    },
    viewMode: "chat",
  },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof ChatHeader>;

export const Default: Story = {
  render: (args) => (
    <div className="h-[80px] bg-[#0D0D0D]">
      <ChatHeader
        {...args}
        onSidebarToggle={() => {}}
        onModelChange={() => {}}
        onViewModeChange={() => {}}
      />
    </div>
  ),
};
