import type { Meta, StoryObj } from "@storybook/react-vite";

import { ChatInput } from "./ChatInput";

const meta: Meta<typeof ChatInput> = {
  title: "ChatUI/ChatInput",
  component: ChatInput,
  args: {
    selectedModel: {
      name: "Auto",
      shortName: "Auto",
      description: "Decides how long to think",
    },
  },
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => (
    <div className="min-h-screen bg-[var(--foundation-bg-dark-1)] flex items-end">
      <div className="w-full">
        <ChatInput {...args} />
      </div>
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof ChatInput>;

export const Default: Story = {};

export const WithComposerSlots: Story = {
  args: {
    composerLeft: (
      <button className="px-2 py-1 rounded-md bg-white/5 text-white/70 text-xs hover:bg-white/10 transition-colors">
        Quick action
      </button>
    ),
    composerRight: (
      <button className="px-2 py-1 rounded-md bg-white/5 text-white/70 text-xs hover:bg-white/10 transition-colors">
        Save draft
      </button>
    ),
  },
};
