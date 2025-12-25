import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { ChatTwoPaneTemplate } from "./ChatTwoPaneTemplate";
import { ChatHeader } from "../app/components/ChatHeader";
import { ChatSidebar } from "../app/components/ChatSidebar";
import { ChatMessages } from "../app/components/ChatMessages";
import { ChatInput } from "../app/components/ChatInput";
import { ComposeView } from "../app/components/ComposeView";

type ModelConfig = {
  name: string;
  shortName: string;
  description: string;
};

const models: ModelConfig[] = [
  { name: "ChatGPT 5.2 Pro", shortName: "5.2 Pro", description: "Our most capable model" },
  { name: "ChatGPT 4o", shortName: "4o", description: "Fast and efficient" },
  { name: "ChatGPT 4o mini", shortName: "4o mini", description: "Lightweight and quick" },
];

type StoryArgs = {
  showSidebar: boolean;
  showFooter: boolean;
  showDetailsPanel: boolean;
  showCompose: boolean;
};

function TwoPaneStoryShell({
  showSidebar,
  showFooter,
  showDetailsPanel,
  showCompose,
}: StoryArgs) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedModel, setSelectedModel] = useState<ModelConfig>(models[0]);
  const [viewMode, setViewMode] = useState<"chat" | "compose">("chat");

  const onToggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="h-full w-full">
      <ChatTwoPaneTemplate
        sidebar={
          showSidebar ? (
            <ChatSidebar isOpen={isSidebarOpen} onToggle={onToggleSidebar} />
          ) : null
        }
        header={
          <ChatHeader
            isSidebarOpen={isSidebarOpen}
            onSidebarToggle={onToggleSidebar}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        }
        body={
          viewMode === "compose" || showCompose ? (
            <ComposeView />
          ) : (
            <ChatMessages />
          )
        }
        footer={
          showFooter && (viewMode === "compose" || showCompose) ? null : (
            <ChatInput selectedModel={selectedModel} />
          )
        }
        detailsPanel={
          showDetailsPanel ? (
            <div className="h-full w-[360px]">
              <ComposeView />
            </div>
          ) : null
        }
      />
    </div>
  );
}

const meta: Meta<typeof ChatTwoPaneTemplate> = {
  title: "Templates/ChatTwoPaneTemplate",
  component: ChatTwoPaneTemplate,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    showSidebar: true,
    showFooter: true,
    showDetailsPanel: false,
    showCompose: false,
  },
  argTypes: {
    showSidebar: { control: "boolean" },
    showFooter: { control: "boolean" },
    showDetailsPanel: { control: "boolean" },
    showCompose: { control: "boolean" },
  },
};

export default meta;

type Story = StoryObj<typeof ChatTwoPaneTemplate>;

export const Golden: Story = {
  render: (args) => <TwoPaneStoryShell {...args} />,
};

export const TwoPaneWithDetails: Story = {
  args: {
    showDetailsPanel: true,
  },
  render: (args) => <TwoPaneStoryShell {...args} />,
};

export const TwoPaneCompose: Story = {
  args: {
    showCompose: true,
    showFooter: false,
  },
  render: (args) => <TwoPaneStoryShell {...args} />,
};