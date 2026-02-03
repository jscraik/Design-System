import type { Meta, StoryObj } from "@storybook/react-vite";

import { ChatInput } from "./ChatInput";

const meta: Meta<typeof ChatInput> = {
  title: "Components/Chat/Chat Input",
  component: ChatInput,
  tags: ["autodocs"],
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
    <div className="min-h-screen bg-background flex items-end">
      <div className="w-full">
        <ChatInput {...args} />
      </div>
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof ChatInput>;

export const Default: Story = {};

export const LightTheme: Story = {
  parameters: {
    backgrounds: { default: "light" },
  },
  render: (args) => (
    <div className="min-h-screen bg-background flex items-end">
      <div className="w-full">
        <ChatInput {...args} />
      </div>
    </div>
  ),
};

export const WithComposerSlots: Story = {
  args: {
    composerLeft: (
      <button
        type="button"
        className="px-2 py-1 rounded-md bg-secondary text-text-secondary text-xs hover:bg-muted transition-colors"
      >
        Quick action
      </button>
    ),
    composerRight: (
      <button
        type="button"
        className="px-2 py-1 rounded-md bg-secondary text-text-secondary text-xs hover:bg-muted transition-colors"
      >
        Save draft
      </button>
    ),
  },
};
