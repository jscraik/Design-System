import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";

import { cn } from "./ui/utils";

// Icons
function IconSparkles({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  );
}

function IconChat({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}

function IconChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function IconChevronRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function IconDownload({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  );
}

function IconShare({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
      />
    </svg>
  );
}

function IconSidebar({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
    </svg>
  );
}

// Types
interface ModelConfig {
  name: string;
  shortName: string;
  description: string;
  isLegacy?: boolean;
  badge?: string;
}

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

/** ChatHeader - Complete chat interface header with mode toggle, model selector, and customizable actions */
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
          <Popover.Root open={isModelSelectorOpen} onOpenChange={setIsModelSelectorOpen}>
            <Popover.Trigger asChild>
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
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
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
                  <Popover.Root open={isLegacyOpen} onOpenChange={setIsLegacyOpen}>
                    <Popover.Trigger asChild>
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
                            "size-4 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary transition-transform duration-200",
                            isLegacyOpen && "rotate-90",
                          )}
                        />
                      </button>
                    </Popover.Trigger>
                    <Popover.Portal>
                      <Popover.Content
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
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                </div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
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
          <IconDownload className="size-4" />
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
          <IconShare className="size-4" />
        </button>
      </div>
    </header>
  );
}

// Export types for external use
export type { ChatHeaderProps, ModelConfig };
