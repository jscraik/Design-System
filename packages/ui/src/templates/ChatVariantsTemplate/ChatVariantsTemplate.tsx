import type { ReactNode } from "react";
import { useState } from "react";

import {
  ChatVariantCompact,
  ChatVariantContextRail,
  ChatVariantSplitSidebar,
} from "../../app/chat/ChatVariants";
import {
  sampleCategories,
  sampleCategoryColors,
  sampleCategoryIconColors,
  sampleCategoryIcons,
  sampleChatHistory,
  sampleGroupChats,
  sampleLegacyModels,
  sampleMessages,
  sampleModels,
  sampleProjects,
  sampleUser,
} from "../../fixtures/sample-data";

const variants = ["Split Sidebar", "Compact", "Context Rail"] as const;
type Variant = (typeof variants)[number];

/**
 * Props for the chat variants template.
 */
export interface ChatVariantsTemplateProps {
  headerLeading?: ReactNode;
  headerActions?: ReactNode;
}

/**
 * Render selectable chat layout variants using sample data.
 * @param props - Template props.
 * @returns The chat variants template element.
 */
export function ChatVariantsTemplate({ headerLeading, headerActions }: ChatVariantsTemplateProps) {
  const [activeVariant, setActiveVariant] = useState<Variant>("Split Sidebar");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedModel, setSelectedModel] = useState(sampleModels[0]);
  const [viewMode, setViewMode] = useState<"chat" | "compose">("chat");

  const sharedProps = {
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
    selectedModel,
    onModelChange: (model: string | typeof selectedModel) => {
      if (typeof model === "string") {
        const resolved = [...sampleModels, ...sampleLegacyModels].find(
          (candidate) => candidate.name === model || candidate.shortName === model,
        );
        if (resolved) setSelectedModel(resolved);
        return;
      }
      setSelectedModel(model);
    },
    viewMode,
    onViewModeChange: setViewMode,
    composeModels: sampleModels,
  };

  return (
    <div className="h-full w-full bg-foundation-bg-dark-1 text-foundation-text-dark-primary">
      <div className="border-b border-foundation-bg-dark-3 bg-foundation-bg-dark-2">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {headerLeading ? <div className="flex items-center gap-2">{headerLeading}</div> : null}
            <div>
              <h2 className="text-lg font-semibold">Chat Variants</h2>
              <p className="text-xs text-foundation-text-dark-tertiary">
                Slot-based layouts for ChatGPT Apps + native parity
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
            {variants.map((variant) => (
              <button
                key={variant}
                type="button"
                onClick={() => setActiveVariant(variant)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  activeVariant === variant
                    ? "bg-foundation-accent-blue text-foundation-text-dark-primary"
                    : "bg-foundation-bg-dark-3 text-foundation-text-dark-secondary"
                }`}
              >
                {variant}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-[720px]">
        {activeVariant === "Split Sidebar" ? (
          <ChatVariantSplitSidebar
            {...sharedProps}
            sidebarOpen={isSidebarOpen}
            onSidebarOpenChange={setIsSidebarOpen}
          />
        ) : null}

        {activeVariant === "Compact" ? <ChatVariantCompact {...sharedProps} /> : null}

        {activeVariant === "Context Rail" ? (
          <ChatVariantContextRail
            {...sharedProps}
            sidebarOpen={isSidebarOpen}
            onSidebarOpenChange={setIsSidebarOpen}
            contextPanel={
              <div className="p-4 space-y-3">
                <h3 className="text-sm font-semibold">Context</h3>
                <div className="rounded-lg border border-foundation-bg-dark-3 bg-foundation-bg-dark-2 p-3 text-xs text-foundation-text-dark-tertiary">
                  Pin references, tools, or files here.
                </div>
              </div>
            }
          />
        ) : null}
      </div>
    </div>
  );
}
