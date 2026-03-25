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
  tags: ["autodocs"],
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
    <div className="min-h-dvh bg-background">
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
    <div className="min-h-dvh bg-background">
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
        <h3 className="text-body-small font-semibold text-foreground">Context</h3>
        <div className="rounded-lg border border-muted p-3 text-body-small text-text-secondary">
          Pin references, files, or tools here.
        </div>
      </div>
    ),
  },
  render: (args) => (
    <div className="min-h-dvh bg-background">
      <ChatVariantContextRail {...args} />
    </div>
  ),
};
