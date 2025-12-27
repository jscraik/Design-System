import { useState } from "react";

import { Popover } from "../../vendor/appsSdkUi";
import {
  Download,
  Sparkles,
  IconChat,
  IconChevronDownMd,
  IconChevronRightMd,
  IconCheckmark,
  IconShare,
  IconSidebar,
} from "../../icons";

interface ModelConfig {
  name: string;
  shortName: string;
  description: string;
  isLegacy?: boolean;
}

interface ChatHeaderProps {
  onSidebarToggle: () => void;
  isSidebarOpen?: boolean;
  selectedModel?: string | ModelConfig;
  onModelChange?: (model: string | ModelConfig) => void;
  viewMode?: "chat" | "compose";
  onViewModeChange?: (mode: "chat" | "compose") => void;
  headerRight?: React.ReactNode;
}

const availableModels: ModelConfig[] = [
  { name: "Auto", shortName: "Auto", description: "Decides how long to think" },
  { name: "Instant", shortName: "Instant", description: "Answers right away" },
  { name: "Thinking", shortName: "Thinking", description: "Thinks longer for better answers" },
  { name: "Pro", shortName: "Pro", description: "Research-grade intelligence" },
];

const legacyModels: ModelConfig[] = [
  { name: "GPT-5.1 Instant", shortName: "GPT-5.1 Instant", description: "Legacy model", isLegacy: true },
  { name: "GPT-5.1 Thinking", shortName: "GPT-5.1 Thinking", description: "Legacy model", isLegacy: true },
  { name: "GPT-5.1 Pro", shortName: "GPT-5.1 Pro", description: "Legacy model", isLegacy: true },
  { name: "GPT-5 Instant", shortName: "GPT-5 Instant", description: "Legacy model", isLegacy: true },
  { name: "GPT-5 Thinking mini", shortName: "GPT-5 Thinking mini", description: "Thinks quickly", isLegacy: true },
  { name: "GPT-5 Thinking", shortName: "GPT-5 Thinking", description: "Legacy model", isLegacy: true },
  { name: "GPT-5 Pro", shortName: "GPT-5 Pro", description: "Legacy model", isLegacy: true },
  { name: "GPT-4o", shortName: "GPT-4o", description: "Legacy model", isLegacy: true },
  { name: "GPT-4.1", shortName: "GPT-4.1", description: "Legacy model", isLegacy: true },
  { name: "GPT-4.5", shortName: "GPT-4.5", description: "Legacy model", isLegacy: true },
  { name: "o3", shortName: "o3", description: "Legacy model", isLegacy: true },
  { name: "o4-mini", shortName: "o4-mini", description: "Legacy model", isLegacy: true },
];

export function ChatHeader({
  onSidebarToggle,
  isSidebarOpen,
  selectedModel = "GPT-4o",
  onModelChange,
  viewMode = "chat",
  onViewModeChange,
  headerRight,
}: ChatHeaderProps) {
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);

  const modelName = typeof selectedModel === "string" ? selectedModel : selectedModel.shortName;

  const handleModelSelect = (selected: string) => {
    onModelChange?.(selected);
    setIsModelSelectorOpen(false);
  };

  return (
    <div className="h-14 border-b border-white/10 bg-[var(--foundation-bg-dark-1)] flex items-center justify-between px-4 flex-shrink-0">
      <div className="flex items-center gap-2">
        <button
          className="flex items-center justify-center size-9 border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
          onClick={onSidebarToggle}
          aria-pressed={isSidebarOpen}
          title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <IconSidebar className="size-4 text-[var(--foundation-text-dark-secondary)]" />
        </button>

        <button
          className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
          onClick={() =>
            onViewModeChange?.(viewMode === "compose" ? "chat" : "compose")
          }
        >
          {viewMode === "compose" ? (
            <>
              <div className="size-4 text-[var(--foundation-text-dark-secondary)]">
                <IconChat />
              </div>
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-[var(--foundation-text-dark-secondary)]">
                Chat
              </span>
            </>
          ) : (
            <>
              <Sparkles className="size-4 text-[var(--foundation-accent-blue)]" />
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-[var(--foundation-accent-blue)]">
                Compose
              </span>
            </>
          )}
        </button>

        {viewMode !== "compose" && (
          <Popover open={isModelSelectorOpen} onOpenChange={setIsModelSelectorOpen}>
            <Popover.Trigger>
              <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded-lg transition-colors">
                <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white">
                  ChatGPT
                </span>
                <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-[var(--foundation-text-dark-tertiary)]">
                  {modelName}
                </span>
                <IconChevronDownMd className="size-4 text-[var(--foundation-text-dark-tertiary)]" />
              </button>
            </Popover.Trigger>

            <Popover.Content
              side="bottom"
              align="start"
              sideOffset={8}
              className="z-50 w-[340px] rounded-2xl border border-white/10 bg-[var(--foundation-bg-dark-2)] shadow-2xl outline-none"
            >
              <div className="p-3">
                <div className="mb-2">
                  {availableModels.map((model) => (
                    <button
                      key={model.name}
                      onClick={() => handleModelSelect(model.name)}
                      className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/5 rounded-lg transition-colors text-left group"
                    >
                      <div className="flex-1">
                        <div className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white">
                          {model.name}
                        </div>
                        <div className="text-[12px] text-[var(--foundation-text-dark-tertiary)] leading-[16px] tracking-[-0.3px]">
                          {model.description}
                        </div>
                      </div>
                      {modelName === model.name && (
                        <IconCheckmark className="size-4 text-white flex-shrink-0 ml-2" />
                      )}
                    </button>
                  ))}
                </div>

                <Popover open={isTemplateOpen} onOpenChange={setIsTemplateOpen}>
                  <Popover.Trigger>
                    <button className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/5 rounded-lg transition-colors text-left">
                      <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white">
                        Legacy models
                      </span>
                      <IconChevronRightMd
                        className={`size-4 text-[var(--foundation-text-dark-tertiary)] transition-transform ${
                          isTemplateOpen ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                  </Popover.Trigger>

                  <Popover.Content
                    side="right"
                    align="start"
                    sideOffset={8}
                    className="z-50 w-[340px] rounded-2xl border border-white/10 bg-[var(--foundation-bg-dark-2)] shadow-2xl outline-none"
                  >
                    <div className="p-3 max-h-[400px] overflow-y-auto">
                      {legacyModels.map((model) => (
                        <button
                          key={model.name}
                          onClick={() => handleModelSelect(model.name)}
                          className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/5 rounded-lg transition-colors text-left group"
                        >
                          <div className="flex-1">
                            <div className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white">
                              {model.name}
                            </div>
                            <div className="text-[12px] text-[var(--foundation-text-dark-tertiary)] leading-[16px] tracking-[-0.3px]">
                              {model.description}
                            </div>
                          </div>
                          {modelName === model.name && (
                            <IconCheckmark className="size-4 text-white flex-shrink-0 ml-2" />
                          )}
                        </button>
                      ))}
                    </div>
                  </Popover.Content>
                </Popover>
              </div>
            </Popover.Content>
          </Popover>
        )}
      </div>

      <div className="flex items-center gap-2">
        {headerRight}

        <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors">
          <Download className="size-4 text-[var(--foundation-text-dark-tertiary)]" />
        </button>
        <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors">
          <IconShare className="size-4 text-[var(--foundation-text-dark-tertiary)]" />
        </button>
      </div>
    </div>
  );
}
