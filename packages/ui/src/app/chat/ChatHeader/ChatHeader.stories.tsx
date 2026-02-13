import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import { sampleLegacyModels, sampleModels } from "../../../fixtures/sample-data";
import { IconPlusLg, IconSettings, IconStar } from "../../../icons";

import { ChatHeader } from "./ChatHeader";

const meta: Meta<typeof ChatHeader> = {
  title: "Components/Chat/Chat Header",
  component: ChatHeader,
  tags: ["autodocs"],
  args: {
    isSidebarOpen: true,
    selectedModel: {
      name: "Auto",
      shortName: "Auto",
      description: "Decides how long to think",
    },
    models: sampleModels,
    legacyModels: sampleLegacyModels,
    viewMode: "chat",
    onSidebarToggle: fn(),
    onModelChange: fn(),
    onViewModeChange: fn(),
  },
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => (
    <div className="h-[80px] bg-background">
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
        <button
          type="button"
          className="p-1.5 hover:bg-muted rounded-md transition-colors"
          aria-label="New chat"
        >
          <IconPlusLg className="size-4 text-muted-foreground" />
        </button>
        <button
          type="button"
          className="p-1.5 hover:bg-muted rounded-md transition-colors"
          aria-label="Star"
        >
          <IconStar className="size-4 text-muted-foreground" />
        </button>
        <button
          type="button"
          className="p-1.5 hover:bg-muted rounded-md transition-colors"
          aria-label="Settings"
        >
          <IconSettings className="size-4 text-muted-foreground" />
        </button>
      </>
    ),
  },
};

export const WithSingleAction: Story = {
  args: {
    headerRight: (
      <button
        type="button"
        className="px-3 py-1.5 bg-accent-green dark:bg-accent-green hover:bg-accent-green/90 dark:hover:bg-accent-green/90 text-foreground dark:text-foreground rounded-lg transition-colors text-sm font-medium"
      >
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
