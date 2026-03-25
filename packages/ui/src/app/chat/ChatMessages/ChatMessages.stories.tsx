import type { Meta, StoryObj } from "@storybook/react-vite";

import { sampleMessages } from "../../../fixtures/sample-data";

import { ChatMessages } from "./ChatMessages";

const meta: Meta<typeof ChatMessages> = {
  title: "Components/Chat/Chat Messages",
  component: ChatMessages,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => (
    <div className="flex min-h-dvh bg-background">
      <ChatMessages {...args} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof ChatMessages>;

export const Default: Story = {
  args: {
    messages: sampleMessages,
  },
};

export const EmptyState: Story = {
  args: {
    messages: [],
    emptyState: (
      <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        No messages yet
      </div>
    ),
  },
};
