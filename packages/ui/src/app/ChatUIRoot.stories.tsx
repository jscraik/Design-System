import type { Meta, StoryObj } from "@storybook/react";

import { ChatUIRoot } from "./ChatUIRoot";
import { Plus, Star, Settings, Share2, Sparkles, Zap } from "lucide-react";

const meta: Meta<typeof ChatUIRoot> = {
  title: "ChatUI/ChatUIRoot",
  component: ChatUIRoot,
  parameters: {
    layout: "fullscreen",
  },
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
        <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors" aria-label="New chat">
          <Plus className="size-4 text-white/60" />
        </button>
        <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors" aria-label="Star">
          <Star className="size-4 text-white/60" />
        </button>
        <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors" aria-label="Settings">
          <Settings className="size-4 text-white/60" />
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
      <button className="px-3 py-1.5 bg-[#2f7a4f] hover:bg-[#2a6b45] text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2">
        <Share2 className="size-4" />
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
        <button className="w-full px-3 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-sm text-white/80 transition-colors">
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
      <button className="p-2 bg-[#1B72E8]/20 text-[#5A9EF4] rounded-lg transition-colors" title="Custom Tool">
        <Sparkles className="size-4" />
      </button>
    ),
    composerRight: (
      <button className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg transition-colors" title="AI Assistant">
        <Zap className="size-4 text-white" />
      </button>
    ),
  },
};

export const WithAllSlots: Story = {
  args: {
    defaultMode: "twoPane",
    defaultSidebarOpen: true,
    defaultViewMode: "chat",
    headerRight: (
      <>
        <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors" aria-label="New chat">
          <Plus className="size-4 text-white/60" />
        </button>
        <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors" aria-label="Share">
          <Share2 className="size-4 text-white/60" />
        </button>
      </>
    ),
    composerLeft: (
      <button className="p-2 bg-[#1B72E8]/20 text-[#5A9EF4] rounded-lg transition-colors" title="Custom Tool">
        <Sparkles className="size-4" />
      </button>
    ),
    composerRight: (
      <button className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg transition-colors" title="AI Assistant">
        <Zap className="size-4 text-white" />
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
        <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors" aria-label="New chat">
          <Plus className="size-4 text-white/60" />
        </button>
        <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors" aria-label="Share">
          <Share2 className="size-4 text-white/60" />
        </button>
      </>
    ),
  },
};

export const WithCustomEmptyState: Story = {
  args: {
    defaultMode: "twoPane",
    defaultSidebarOpen: true,
    defaultViewMode: "chat",
    emptyState: (
      <div className="flex flex-col items-center justify-center h-full text-center px-8">
        <div className="size-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4">
          <Sparkles className="size-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Start a new conversation</h3>
        <p className="text-white/60 text-sm">Ask anything and get started with ChatGPT</p>
      </div>
    ),
  },
};
