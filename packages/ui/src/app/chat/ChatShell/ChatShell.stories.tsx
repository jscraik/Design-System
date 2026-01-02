import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  sampleCategories,
  sampleCategoryColors,
  sampleCategoryIconColors,
  sampleCategoryIcons,
  sampleChatHistory,
  sampleGroupChats,
  sampleLegacyModels,
  sampleMessages,
  sampleModels,
  sampleProjects,
  sampleUser,
} from "../../../fixtures/sample-data";
import {
  ChatVariantCompact,
  ChatVariantContextRail,
  ChatVariantSplitSidebar,
} from "../ChatVariants";

const meta: Meta = {
  title: "Components/Chat/Chat Shell",
  component: ChatVariantSplitSidebar,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj;

export const SplitSidebar: Story = {
  args: {
    models: sampleModels,
    legacyModels: sampleLegacyModels,
    messages: sampleMessages,
    projects: sampleProjects,
    chatHistory: sampleChatHistory,
    groupChats: sampleGroupChats,
    categories: sampleCategories,
    categoryIcons: sampleCategoryIcons,
    categoryColors: sampleCategoryColors,
    categoryIconColors: sampleCategoryIconColors,
    user: sampleUser,
  },
  render: (args) => (
    <div className="min-h-screen bg-foundation-bg-dark-1">
      <ChatVariantSplitSidebar {...args} />
    </div>
  ),
};

export const Compact: Story = {
  args: {
    models: sampleModels,
    legacyModels: sampleLegacyModels,
    messages: sampleMessages,
  },
  render: (args) => (
    <div className="min-h-screen bg-foundation-bg-dark-1">
      <ChatVariantCompact {...args} />
    </div>
  ),
};

export const ContextRail: Story = {
  args: {
    models: sampleModels,
    legacyModels: sampleLegacyModels,
    messages: sampleMessages,
    projects: sampleProjects,
    chatHistory: sampleChatHistory,
    groupChats: sampleGroupChats,
    categories: sampleCategories,
    categoryIcons: sampleCategoryIcons,
    categoryColors: sampleCategoryColors,
    categoryIconColors: sampleCategoryIconColors,
    user: sampleUser,
    contextPanel: (
      <div className="p-4 space-y-3">
        <h3 className="text-sm font-semibold text-foundation-text-dark-primary">Context</h3>
        <div className="rounded-lg border border-foundation-bg-dark-3 p-3 text-sm text-foundation-text-dark-secondary">
          Pin references, files, or tools here.
        </div>
      </div>
    ),
  },
  render: (args) => (
    <div className="min-h-screen bg-foundation-bg-dark-1">
      <ChatVariantContextRail {...args} />
    </div>
  ),
};
