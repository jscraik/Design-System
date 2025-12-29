import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { ChatHeader } from "../app/components/chat/ChatHeader";
import { ChatInput } from "../app/components/chat/ChatInput";
import { ChatMessages } from "../app/components/chat/ChatMessages";
import { ChatSidebar } from "../app/components/chat/ChatSidebar";
import { ComposeView } from "../app/components/chat/ComposeView";

import { DashboardTemplate } from "./DashboardTemplate";

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
  showDetailsPanel: boolean;
  showFooter: boolean;
  showCompose: boolean;
};

function DashboardStoryShell({
  showSidebar,
  showDetailsPanel,
  showFooter,
  showCompose,
}: StoryArgs) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedModel, setSelectedModel] = useState<ModelConfig>(models[0]);
  const [viewMode, setViewMode] = useState<"chat" | "compose">("chat");

  const onToggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="h-full w-full">
      <DashboardTemplate
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
        sidebar={
          showSidebar ? <ChatSidebar isOpen={isSidebarOpen} onToggle={onToggleSidebar} /> : null
        }
        body={viewMode === "compose" || showCompose ? <ComposeView /> : <ChatMessages />}
        detailsPanel={
          showDetailsPanel ? (
            <div className="h-full w-[360px]">
              <ComposeView />
            </div>
          ) : null
        }
        footer={
          showFooter && (viewMode === "compose" || showCompose) ? null : (
            <ChatInput selectedModel={selectedModel} />
          )
        }
      />
    </div>
  );
}

const meta: Meta<typeof DashboardTemplate> = {
  title: "Templates/DashboardTemplate",
  component: DashboardTemplate,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    showSidebar: true,
    showDetailsPanel: true,
    showFooter: true,
    showCompose: false,
  },
  argTypes: {
    showSidebar: { control: "boolean" },
    showDetailsPanel: { control: "boolean" },
    showFooter: { control: "boolean" },
    showCompose: { control: "boolean" },
  },
};

export default meta;

type Story = StoryObj<typeof DashboardTemplate>;

export const DashboardOverview: Story = {
  render: (args) => <DashboardStoryShell {...args} />,
};

export const DashboardFocused: Story = {
  args: {
    showSidebar: false,
    showDetailsPanel: false,
  },
  render: (args) => <DashboardStoryShell {...args} />,
};
