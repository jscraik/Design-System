import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";

import {
  sampleCategories,
  sampleCategoryColors,
  sampleCategoryIconColors,
  sampleCategoryIcons,
  sampleChatHistory,
  sampleGroupChats,
  sampleProjects,
  sampleUser,
} from "../../data/sample-data";

import { ChatSidebar } from "./ChatSidebar";

const meta: Meta<typeof ChatSidebar> = {
  title: "ChatUI/ChatSidebar",
  component: ChatSidebar,
  tags: ["autodocs"],
  args: {
    isOpen: true,
    onToggle: fn(),
    onProjectSelect: fn(),
    projects: sampleProjects,
    chatHistory: sampleChatHistory,
    groupChats: sampleGroupChats,
    categories: sampleCategories,
    categoryIcons: sampleCategoryIcons,
    categoryColors: sampleCategoryColors,
    categoryIconColors: sampleCategoryIconColors,
    user: sampleUser,
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
