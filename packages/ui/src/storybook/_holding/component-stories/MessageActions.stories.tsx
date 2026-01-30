import type { Meta, StoryObj } from "@storybook/react-vite";

import { MessageActions } from "./MessageActions";

const meta: Meta<typeof MessageActions> = {
  title: "Components/Chat/Message Actions",
  component: MessageActions,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "var(--foundation-bg-dark-1)" },
        { name: "light", value: "var(--foundation-bg-light-1)" },
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    onCopy: { action: "copy" },
    onThumbsUp: { action: "thumbs-up" },
    onThumbsDown: { action: "thumbs-down" },
    onShare: { action: "share" },
    onRegenerate: { action: "regenerate" },
    onMore: { action: "more" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    messageId: "msg-1",
  },
};

export const AssistantMessage: Story = {
  args: {
    messageId: "msg-1",
    actions: ["copy", "thumbsUp", "thumbsDown", "share", "regenerate", "more"],
  },
};

export const UserMessage: Story = {
  args: {
    messageId: "msg-2",
    actions: ["copy"],
  },
};

export const AlwaysVisible: Story = {
  args: {
    messageId: "msg-3",
    showOnHover: false,
  },
};

export const CustomActions: Story = {
  args: {
    messageId: "msg-4",
    actions: ["copy", "share", "more"],
  },
};

export const InMessageContext: Story = {
  render: () => (
    <div className="max-w-md p-4 bg-foundation-bg-dark-1 rounded-lg">
      <div className="group">
        <div className="mb-3 p-3 bg-foundation-bg-dark-2 rounded-lg">
          <p className="text-foundation-text-dark-primary text-sm mb-2">
            This is a sample assistant message that demonstrates how the MessageActions component
            appears in context.
          </p>
          <MessageActions
            messageId="context-msg"
            actions={["copy", "thumbsUp", "thumbsDown", "share", "regenerate"]}
          />
        </div>
      </div>
    </div>
  ),
};
