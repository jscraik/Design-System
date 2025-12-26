import type { Meta, StoryObj } from "@storybook/react-vite";

import { ChatInput } from "./ChatInput";

const meta: Meta<typeof ChatInput> = {
  title: "ChatUI/ChatInput",
  component: ChatInput,
  args: {
    selectedModel: {
      name: "ChatGPT 5.2 Pro",
      shortName: "5.2 Pro",
      description: "Our most capable model",
    },
  },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof ChatInput>;

export const Default: Story = {
  render: (args) => (
    <div className="min-h-screen bg-[#0D0D0D] flex items-end">
      <div className="w-full">
        <ChatInput {...args} />
      </div>
    </div>
  ),
};

export const WithComposerSlots: Story = {
  render: (args) => (
    <div className="min-h-screen bg-[#0D0D0D] flex items-end">
      <div className="w-full">
        <ChatInput
          {...args}
          composerLeft={
            <button className="px-2 py-1 rounded-md bg-white/5 text-white/70 text-xs hover:bg-white/10 transition-colors">
              Quick action
            </button>
          }
          composerRight={
            <button className="px-2 py-1 rounded-md bg-white/5 text-white/70 text-xs hover:bg-white/10 transition-colors">
              Save draft
            </button>
          }
        />
      </div>
    </div>
  ),
};