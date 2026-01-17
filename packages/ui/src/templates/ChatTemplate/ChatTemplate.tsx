import { useState } from "react";

import { ChatHeader } from "../../app/chat/ChatHeader";
import { ChatInput } from "../../app/chat/ChatInput";
import { ChatVariantSplitSidebar } from "../../app/chat/ChatVariants";
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
} from "../../fixtures/sample-data";

/**
 * Props for the chat template surface.
 */
export interface ChatTemplateProps {
  initialViewMode?: "chat" | "compose";
}

/**
 * Render the full chat template with sample data.
 * @param props - Template props.
 * @returns The chat template element.
 */
export function ChatTemplate({ initialViewMode = "chat" }: ChatTemplateProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedModel, setSelectedModel] = useState(sampleModels[0]);
  const [viewMode, setViewMode] = useState<"chat" | "compose">(initialViewMode);

  const handleModelChange = (model: string | (typeof sampleModels)[number]) => {
    if (typeof model === "string") {
      const resolved = [...sampleModels, ...sampleLegacyModels].find(
        (candidate) => candidate.name === model || candidate.shortName === model,
      );
      if (resolved) setSelectedModel(resolved);
      return;
    }
    setSelectedModel(model);
  };

  return (
    <div className="h-full w-full">
      <ChatVariantSplitSidebar
        sidebarOpen={isSidebarOpen}
        onSidebarOpenChange={setIsSidebarOpen}
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
        models={sampleModels}
        legacyModels={sampleLegacyModels}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        composeModels={sampleModels}
        composeModes={sampleComposeModes}
        messages={sampleMessages}
        projects={sampleProjects}
        chatHistory={sampleChatHistory}
        groupChats={sampleGroupChats}
        categories={sampleCategories}
        categoryIcons={sampleCategoryIcons}
        categoryColors={sampleCategoryColors}
        categoryIconColors={sampleCategoryIconColors}
        user={sampleUser}
        slots={{
          header: (
            <ChatHeader
              isSidebarOpen={isSidebarOpen}
              onSidebarToggle={() => setIsSidebarOpen((prev) => !prev)}
              showSidebarToggle={true}
              selectedModel={selectedModel}
              onModelChange={handleModelChange}
              models={sampleModels}
              legacyModels={sampleLegacyModels}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          ),
          composer: viewMode === "compose" ? null : <ChatInput selectedModel={selectedModel} />,
        }}
      />
    </div>
  );
}
