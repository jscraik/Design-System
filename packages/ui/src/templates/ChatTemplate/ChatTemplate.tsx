import { useState } from "react";

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

  return (
    <div className="h-full w-full">
      <ChatVariantSplitSidebar
        sidebarOpen={isSidebarOpen}
        onSidebarOpenChange={setIsSidebarOpen}
        selectedModel={selectedModel}
        onModelChange={(model) => {
          if (typeof model === "string") {
            const resolved = [...sampleModels, ...sampleLegacyModels].find(
              (candidate) => candidate.name === model || candidate.shortName === model,
            );
            if (resolved) setSelectedModel(resolved);
            return;
          }
          setSelectedModel(model);
        }}
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
      />
    </div>
  );
}
