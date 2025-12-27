import type { Meta, StoryObj } from "@storybook/react-vite";

import { ChatHeader } from "./ChatHeader";
import { IconPlusLg, IconStar, IconSettings } from "../../icons";

const meta: Meta<typeof ChatHeader> = {
  title: "ChatUI/ChatHeader",
  component: ChatHeader,
  args: {
    isSidebarOpen: true,
    selectedModel: {
      name: "Auto",
      shortName: "Auto",
      description: "Decides how long to think",
    },
    viewMode: "chat",
    onSidebarToggle: () => {},
    onModelChange: () => {},
    onViewModeChange: () => {},
  },
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => (
    <div className="h-[80px] bg-[var(--foundation-bg-dark-1)]">
      <ChatHeader {...args} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof ChatHeader>;

export const Default: Story = {};

export const WithCustomHeaderRight: Story = {
  args: {
    headerRight: (
      <>
        <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors" aria-label="New chat">
          <IconPlusLg className="size-4 text-white/60" />
        </button>
        <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors" aria-label="Star">
          <IconStar className="size-4 text-white/60" />
        </button>
        <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors" aria-label="Settings">
          <IconSettings className="size-4 text-white/60" />
        </button>
      </>
    ),
  },
};

export const WithSingleAction: Story = {
  args: {
    headerRight: (
      <button className="px-3 py-1.5 bg-[var(--foundation-accent-green)] hover:bg-[var(--foundation-accent-green)]/80 text-white rounded-lg transition-colors text-sm font-medium">
        Share Chat
      </button>
    ),
  },
};

export const ComposeMode: Story = {
  args: {
    viewMode: "compose",
    selectedModel: "GPT-4o",
  },
};
