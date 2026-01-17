import { useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/overlays/Popover";
import { cn } from "../../../components/ui/utils";
import {
  IconChat,
  IconCheck,
  IconChevronDown,
  IconChevronRight,
  IconDownload,
  IconShare,
  IconSidebar,
  IconSparkles,
} from "../../../icons";

// Types
interface ModelConfig {
  name: string;
  shortName: string;
  description: string;
  isLegacy?: boolean;
  badge?: string;
}

/**
 * Props for the chat header.
 */
interface ChatHeaderProps {
  /** Callback when sidebar toggle is clicked */
  onSidebarToggle?: () => void;
  /** Whether sidebar is currently open */
  isSidebarOpen?: boolean;
  /** Currently selected model (string or ModelConfig) */
  selectedModel?: string | ModelConfig;
  /** Callback when model changes */
  onModelChange?: (model: string | ModelConfig) => void;
  /** Current view mode */
  viewMode?: "chat" | "compose";
  /** Callback when view mode changes */
  onViewModeChange?: (mode: "chat" | "compose") => void;
  /** Custom content for the right side of the header */
  headerRight?: React.ReactNode;
  /** Show sidebar toggle button */
  showSidebarToggle?: boolean;
  /** Custom available models */
  models?: ModelConfig[];
  /** Custom legacy models */
  legacyModels?: ModelConfig[];
  /** Additional class names */
  className?: string;
}

const defaultModels: ModelConfig[] = [
  {
    name: "Auto",
    shortName: "Auto",
    description: "Decides how long to think",
    badge: "Recommended",
  },
  { name: "Instant", shortName: "Instant", description: "Answers right away" },
  { name: "Thinking", shortName: "Thinking", description: "Thinks longer for better answers" },
  { name: "Pro", shortName: "Pro", description: "Research-grade intelligence", badge: "New" },
];

const defaultLegacyModels: ModelConfig[] = [
  {
    name: "GPT-5.1 Instant",
    shortName: "GPT-5.1 Instant",
    description: "Legacy model",
    isLegacy: true,
  },
  {
    name: "GPT-5.1 Thinking",
    shortName: "GPT-5.1 Thinking",
    description: "Legacy model",
    isLegacy: true,
  },
  { name: "GPT-5.1 Pro", shortName: "GPT-5.1 Pro", description: "Legacy model", isLegacy: true },
  {
    name: "GPT-5 Instant",
    shortName: "GPT-5 Instant",
    description: "Legacy model",
    isLegacy: true,
  },
  {
    name: "GPT-5 Thinking",
    shortName: "GPT-5 Thinking",
    description: "Legacy model",
    isLegacy: true,
  },
  { name: "GPT-4o", shortName: "GPT-4o", description: "Legacy model", isLegacy: true },
  { name: "GPT-4.1", shortName: "GPT-4.1", description: "Legacy model", isLegacy: true },
];

/**
 * Renders the chat header with model selection and mode toggle.
 *
 * Accessibility contract:
 * - Sidebar and mode toggles are native buttons with ARIA labels.
 *
 * @param props - Chat header props.
 * @returns A chat header element.
 */
export function ChatHeader({
  onSidebarToggle,
  isSidebarOpen,
  selectedModel = "Auto",
  onModelChange,
  viewMode = "chat",
  onViewModeChange,
  headerRight,
  showSidebarToggle = false,
  models = defaultModels,
  legacyModels = defaultLegacyModels,
  className,
}: ChatHeaderProps) {
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [isLegacyOpen, setIsLegacyOpen] = useState(false);

  const modelName = typeof selectedModel === "string" ? selectedModel : selectedModel.shortName;

  const handleModelSelect = (model: ModelConfig) => {
    onModelChange?.(model);
    setIsModelSelectorOpen(false);
    setIsLegacyOpen(false);
  };

  const isModelSelected = (model: ModelConfig) => {
    if (typeof selectedModel === "string") {
      return selectedModel === model.name || selectedModel === model.shortName;
    }
    return selectedModel.name === model.name;
  };

  return (
    <header
      className={cn(
        "h-14 border-b border-foundation-border-light dark:border-foundation-border-dark",
        "bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-2",
        "flex items-center justify-between px-4 shrink-0",
        className,
      )}
    >
      {/* Left side */}
      <div className="flex items-center gap-2">
        {/* Sidebar Toggle */}
        {showSidebarToggle && (
          <button
            type="button"
            onClick={onSidebarToggle}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            aria-expanded={isSidebarOpen}
            className={cn(
              "p-2 rounded-lg transition-all duration-150",
              "text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary",
              "hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-3",
              "active:scale-95",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue/50",
            )}
          >
            <IconSidebar className="size-5" />
          </button>
        )}

        {/* Compose/Chat Toggle */}
        <button
          type="button"
          onClick={() => onViewModeChange?.(viewMode === "compose" ? "chat" : "compose")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200",
            "border border-foundation-border-light dark:border-foundation-border-dark",
            "hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-3",
            "hover:border-foundation-bg-light-3 dark:hover:border-foundation-bg-dark-3",
            "active:scale-[0.98]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue/50",
            viewMode === "compose" && "bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-3",
          )}
        >
          {viewMode === "compose" ? (
            <>
              <IconChat className="size-4 text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary" />
              <span className="text-sm font-medium text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                Chat
              </span>
            </>
          ) : (
            <>
              <IconSparkles className="size-4 text-foundation-accent-blue" />
              <span className="text-sm font-medium text-foundation-accent-blue">Compose</span>
            </>
          )}
        </button>

        {/* Model Selector */}
        {viewMode !== "compose" && (
          <Popover open={isModelSelectorOpen} onOpenChange={setIsModelSelectorOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex items-center gap-2.5 px-3.5 py-2 rounded-lg transition-all duration-150",
                  "hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-3",
                  "active:scale-[0.98]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue/50",
                  isModelSelectorOpen && "bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-3",
                )}
              >
                <span className="text-[13px] font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                  ChatGPT
                </span>
                <div className="w-px h-4 bg-foundation-border-light dark:bg-foundation-border-dark" />
                <span className="text-[13px] font-medium text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
                  {modelName}
                </span>
                <IconChevronDown
                  className={cn(
                    "size-3.5 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary transition-transform duration-200",
                    isModelSelectorOpen && "rotate-180",
                  )}
                />
              </button>
            </PopoverTrigger>
            <PopoverContent
              forceMount
              side="bottom"
              align="start"
              sideOffset={8}
              className={cn(
                "z-50 w-[320px] rounded-2xl overflow-hidden",
                "border border-foundation-border-light dark:border-foundation-border-dark",
                "bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-2",
                "shadow-[0_8px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.24)]",
                "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200",
              )}
            >
              <div className="p-2">
                {/* Available Models */}
                <div className="space-y-0.5">
                  {models.map((model) => (
                    <button
                      key={model.name}
                      type="button"
                      onClick={() => handleModelSelect(model)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150",
                        "hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-3",
                        "active:scale-[0.98]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-foundation-accent-blue/50",
                        "text-left group",
                        isModelSelected(model) &&
                          "bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-3",
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                            {model.name}
                          </span>
                          {model.badge && (
                            <span
                              className={cn(
                                "text-[10px] font-semibold px-1.5 py-0.5 rounded-md uppercase tracking-wide",
                                model.badge === "New"
                                  ? "bg-foundation-accent-green/10 text-foundation-accent-green dark:bg-foundation-accent-green/20"
                                  : "bg-foundation-accent-blue/10 text-foundation-accent-blue dark:bg-foundation-accent-blue/20",
                              )}
                            >
                              {model.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary mt-1 leading-tight">
                          {model.description}
                        </p>
                      </div>
                      {isModelSelected(model) && (
                        <IconCheck className="size-4 text-foundation-accent-green shrink-0 ml-2" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-foundation-border-light dark:bg-foundation-border-dark my-2" />

                {/* Legacy Models Submenu */}
                <Popover open={isLegacyOpen} onOpenChange={setIsLegacyOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150",
                        "hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-3",
                        "active:scale-[0.98]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-foundation-accent-blue/50",
                        "text-left",
                        isLegacyOpen && "bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-3",
                      )}
                    >
                      <span className="text-sm font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                        Legacy models
                      </span>
                      <IconChevronRight
                        className={cn(
                          "size-4 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary transition-transform duration-200",
                          isLegacyOpen && "rotate-90",
                        )}
                      />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    forceMount
                    side="right"
                    align="start"
                    sideOffset={8}
                    className={cn(
                      "z-50 w-[280px] rounded-2xl overflow-hidden",
                      "border border-foundation-border-light dark:border-foundation-border-dark",
                      "bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-2",
                      "shadow-[0_8px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.24)]",
                      "animate-in fade-in-0 zoom-in-95 slide-in-from-left-2 duration-200",
                    )}
                  >
                    <div className="p-2 max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-foundation-bg-light-3 dark:scrollbar-thumb-foundation-bg-dark-3 scrollbar-track-transparent">
                      <div className="space-y-0.5">
                        {legacyModels.map((model) => (
                          <button
                            key={model.name}
                            type="button"
                            onClick={() => handleModelSelect(model)}
                            className={cn(
                              "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-150",
                              "hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-3",
                              "active:scale-[0.98]",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-foundation-accent-blue/50",
                              "text-left",
                              isModelSelected(model) &&
                                "bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-3",
                            )}
                          >
                            <span className="text-sm text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                              {model.name}
                            </span>
                            {isModelSelected(model) && (
                              <IconCheck className="size-4 text-foundation-accent-green shrink-0 ml-2" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-0.5">
        {headerRight}
        <button
          type="button"
          aria-label="Download"
          className={cn(
            "p-2 rounded-lg transition-all duration-150",
            "text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary",
            "hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-3",
            "hover:text-foundation-text-light-secondary dark:hover:text-foundation-text-dark-secondary",
            "active:scale-95",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue/50",
          )}
        >
          <IconDownload className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
        </button>
        <button
          type="button"
          aria-label="Share"
          className={cn(
            "p-2 rounded-lg transition-all duration-150",
            "text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary",
            "hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-3",
            "hover:text-foundation-text-light-secondary dark:hover:text-foundation-text-dark-secondary",
            "active:scale-95",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue/50",
          )}
        >
          <IconShare className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
        </button>
      </div>
    </header>
  );
}

// Export types for external use
/**
 * Re-export chat header props for consumers.
 */
export type { ChatHeaderProps };
