import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { ChatHeader } from "../../app/chat/ChatHeader";
import { ChatInput } from "../../app/chat/ChatInput";
import { ChatMessages } from "../../app/chat/ChatMessages";
import { ChatSidebar } from "../../app/chat/ChatSidebar";
import { ComposeView } from "../../app/chat/ComposeView";

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
  title: "Components/Templates/Dashboard/Dashboard",
  component: DashboardTemplate,
  tags: ["autodocs", "template", "layout"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Full application layout with header, sidebar, main content area, and optional details panel. Use this template as the starting point for complete ChatGPT-style applications.",
      },
    },
  },
  args: {
    showSidebar: true,
    showDetailsPanel: true,
    showFooter: true,
    showCompose: false,
  },
  argTypes: {
    showSidebar: { control: "boolean", description: "Show left sidebar with conversations" },
    showDetailsPanel: { control: "boolean", description: "Show right details panel" },
    showFooter: { control: "boolean", description: "Show input area at bottom" },
    showCompose: { control: "boolean", description: "Show compose view instead of chat" },
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
