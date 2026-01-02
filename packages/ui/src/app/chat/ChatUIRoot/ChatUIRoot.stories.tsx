import type { Meta, StoryObj } from "@storybook/react-vite";

import { IconLightBulb, IconPlusLg, IconSettings, IconShare, IconStar } from "../../../icons";
import { IconPro } from "../../../icons/ChatGPTIcons";
import {
  sampleCategories,
  sampleCategoryColors,
  sampleCategoryIconColors,
  sampleCategoryIcons,
  sampleChatHistory,
  sampleComposeModes,
  sampleGroupChats,
  sampleLegacyModels,
  sampleMessages,
  sampleModels,
  sampleProjects,
  sampleUser,
} from "../../../fixtures/sample-data";

import { ChatUIRoot } from "./ChatUIRoot";
const meta: Meta<typeof ChatUIRoot> = {
  title: "Components/Chat/Chat UI Root",
  component: ChatUIRoot,
  tags: ["autodocs"],
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
    composeModels: sampleModels,
    composeModes: sampleComposeModes,
  },
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => (
    <div className="min-h-screen bg-foundation-bg-dark-1">
      <ChatUIRoot {...args} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof ChatUIRoot>;

export const Default: Story = {
  args: {
    defaultMode: "twoPane",
    defaultSidebarOpen: true,
    defaultViewMode: "chat",
  },
};

export const WithCustomHeaderActions: Story = {
  args: {
    defaultMode: "twoPane",
    defaultSidebarOpen: true,
    defaultViewMode: "chat",
    headerRight: (
      <>
        <button
          type="button"
          className="p-1.5 hover:bg-foundation-bg-dark-3 rounded-md transition-colors"
          aria-label="New chat"
        >
          <IconPlusLg className="size-4 text-foundation-text-dark-tertiary" />
        </button>
        <button
          type="button"
          className="p-1.5 hover:bg-foundation-bg-dark-3 rounded-md transition-colors"
          aria-label="Star"
        >
          <IconStar className="size-4 text-foundation-text-dark-tertiary" />
        </button>
        <button
          type="button"
          className="p-1.5 hover:bg-foundation-bg-dark-3 rounded-md transition-colors"
          aria-label="Settings"
        >
          <IconSettings className="size-4 text-foundation-text-dark-tertiary" />
        </button>
      </>
    ),
  },
};

export const WithShareButton: Story = {
  args: {
    defaultMode: "twoPane",
    defaultSidebarOpen: true,
    defaultViewMode: "chat",
    headerRight: (
      <button
        type="button"
        className="px-3 py-1.5 bg-foundation-accent-green-light dark:bg-foundation-accent-green hover:bg-foundation-accent-green-light/90 dark:hover:bg-foundation-accent-green/90 text-foundation-text-dark-primary dark:text-foundation-text-light-primary rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
      >
        <IconShare className="size-4" />
        Share Chat
      </button>
    ),
  },
};

export const WithSidebarSlots: Story = {
  args: {
    defaultMode: "twoPane",
    defaultSidebarOpen: true,
    defaultViewMode: "chat",
    slots: {
      sidebarFooter: (
        <button
          type="button"
          className="w-full px-3 py-2 bg-foundation-bg-dark-2 hover:bg-foundation-bg-dark-3 rounded-lg text-sm text-foundation-text-dark-secondary transition-colors"
        >
          + New Workspace
        </button>
      ),
    },
  },
};

export const WithComposerSlots: Story = {
  args: {
    defaultMode: "twoPane",
    defaultSidebarOpen: false,
    defaultViewMode: "chat",
    composerLeft: (
      <button
        type="button"
        className="p-2 bg-[var(--foundation-accent-blue)]/20 text-[var(--foundation-accent-blue)] rounded-lg transition-colors"
        aria-label="Custom Tool"
      >
        <IconLightBulb className="size-4" />
      </button>
    ),
    composerRight: (
      <button
        type="button"
        className="p-2 bg-foundation-accent-purple-light dark:bg-foundation-accent-purple rounded-lg transition-colors"
        aria-label="AI Assistant"
      >
        <IconPro className="size-4 text-foundation-text-dark-primary dark:text-foundation-text-light-primary" />
      </button>
    ),
  },
};

export const ComposeMode: Story = {
  args: {
    defaultMode: "twoPane",
    defaultSidebarOpen: true,
    defaultViewMode: "compose",
  },
};

export const WithAllSlots: Story = {
  args: {
    defaultMode: "twoPane",
    defaultSidebarOpen: true,
    defaultViewMode: "chat",
    headerRight: (
      <>
        <button
          type="button"
          className="p-1.5 hover:bg-foundation-bg-dark-3 rounded-md transition-colors"
          aria-label="New chat"
        >
          <IconPlusLg className="size-4 text-foundation-text-dark-tertiary" />
        </button>
        <button
          type="button"
          className="p-1.5 hover:bg-foundation-bg-dark-3 rounded-md transition-colors"
          aria-label="Share"
        >
          <IconShare className="size-4 text-foundation-text-dark-tertiary" />
        </button>
      </>
    ),
    composerLeft: (
      <button
        type="button"
        className="p-2 bg-[var(--foundation-accent-blue)]/20 text-[var(--foundation-accent-blue)] rounded-lg transition-colors"
        aria-label="Custom Tool"
      >
        <IconLightBulb className="size-4" />
      </button>
    ),
    composerRight: (
      <button
        type="button"
        className="p-2 bg-foundation-accent-purple-light dark:bg-foundation-accent-purple rounded-lg transition-colors"
        aria-label="AI Assistant"
      >
        <IconPro className="size-4 text-foundation-text-dark-primary dark:text-foundation-text-light-primary" />
      </button>
    ),
  },
};

export const FullWidthWithSlots: Story = {
  args: {
    defaultMode: "full",
    defaultSidebarOpen: true,
    defaultViewMode: "chat",
    headerRight: (
      <>
        <button
          type="button"
          className="p-1.5 hover:bg-foundation-bg-dark-3 rounded-md transition-colors"
          aria-label="New chat"
        >
          <IconPlusLg className="size-4 text-foundation-text-dark-tertiary" />
        </button>
        <button
          type="button"
          className="p-1.5 hover:bg-foundation-bg-dark-3 rounded-md transition-colors"
          aria-label="Share"
        >
          <IconShare className="size-4 text-foundation-text-dark-tertiary" />
        </button>
      </>
    ),
  },
};
