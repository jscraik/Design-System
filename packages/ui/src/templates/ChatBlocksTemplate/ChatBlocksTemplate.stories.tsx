import type { Meta, StoryObj } from "@storybook/react-vite";

import { ChatHeaderTemplate } from "../ChatHeaderTemplate";
import { ChatInputTemplate } from "../ChatInputTemplate";
import { ChatMessagesTemplate } from "../ChatMessagesTemplate";
import { ChatSidebarTemplate } from "../ChatSidebarTemplate";

const meta: Meta = {
  title: "Components/Templates/Chat/Chat Blocks",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj;

export const Header: Story = {
  render: () => <ChatHeaderTemplate />,
};

export const Sidebar: Story = {
  render: () => <ChatSidebarTemplate />,
};

export const Messages: Story = {
  render: () => <ChatMessagesTemplate />,
};

export const Input: Story = {
  render: () => <ChatInputTemplate />,
};
