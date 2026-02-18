import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import { useState } from "react";

import { ChatHeader } from "../../app/chat/ChatHeader";
import { ChatInput } from "../../app/chat/ChatInput";
import { ChatMessages } from "../../app/chat/ChatMessages";
import { ComposeView } from "../../app/chat/ComposeView";

import { ChatFullWidthTemplate } from "./ChatFullWidthTemplate";

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
  showFooter: boolean;
  showCompose: boolean;
};

function FullWidthStoryShell({ showFooter, showCompose }: StoryArgs) {
  const [selectedModel, setSelectedModel] = useState<ModelConfig>(models[0]);
  const [viewMode, setViewMode] = useState<"chat" | "compose">("chat");

  return (
    <div className="h-full w-full">
      <ChatFullWidthTemplate
        header={
          <ChatHeader
            isSidebarOpen={false}
            onSidebarToggle={fn()}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        }
        body={viewMode === "compose" || showCompose ? <ComposeView /> : <ChatMessages />}
        footer={
          showFooter && (viewMode === "compose" || showCompose) ? null : (
            <ChatInput selectedModel={selectedModel} />
          )
        }
      />
    </div>
  );
}

const meta: Meta<typeof ChatFullWidthTemplate> = {
  title: "Components/Templates/Chat/Chat Full Width",
  component: ChatFullWidthTemplate,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    showFooter: true,
    showCompose: false,
  },
  argTypes: {
    showFooter: { control: "boolean" },
    showCompose: { control: "boolean" },
  },
};

export default meta;

type Story = StoryObj<typeof ChatFullWidthTemplate>;

export const FullWidthChat: Story = {
  render: (args) => <FullWidthStoryShell {...args} />,
};

export const FullWidthCompose: Story = {
  args: {
    showCompose: true,
    showFooter: false,
  },
  render: (args) => <FullWidthStoryShell {...args} />,
};
