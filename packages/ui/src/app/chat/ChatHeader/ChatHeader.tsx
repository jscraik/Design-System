import type { ComponentState, StatefulComponentProps } from "@design-studio/tokens";
import * as React from "react";
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
interface ChatHeaderProps extends StatefulComponentProps {
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
 * Supports stateful props for loading, error, and disabled states.
 * When loading, shows loading state in model selector.
 * When error, shows error message.
 * When disabled, disables all interactive elements.
 *
 * Accessibility contract:
 * - Sidebar and mode toggles are native buttons with ARIA labels.
 *
 * @param props - Chat header props and stateful options.
 * @returns A chat header element.
 *
 * @example
 * ```tsx
 * <ChatHeader selectedModel="Auto" viewMode="chat" />
 * <ChatHeader loading />
 * <ChatHeader error="Failed to load models" />
 * ```
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
  loading = false,
  error,
  disabled = false,
  required,
  onStateChange,
}: ChatHeaderProps) {
  // Determine effective state (priority: loading > error > disabled > default)
  const effectiveState: ComponentState = loading
    ? "loading"
    : error
      ? "error"
      : disabled
        ? "disabled"
        : "default";

  // Notify parent of state changes
  React.useEffect(() => {
    onStateChange?.(effectiveState);
  }, [effectiveState, onStateChange]);

  // Effective disabled state (disabled if explicitly disabled OR loading)
  const isDisabled = disabled || loading;

  const [isModelSelectorOpen, setIsModelSelectorOpen] = React.useState(false);
  const [isLegacyOpen, setIsLegacyOpen] = React.useState(false);

  const modelName = typeof selectedModel === "string" ? selectedModel : selectedModel.shortName;

  const handleModelSelect = (model: ModelConfig) => {
    if (isDisabled) return;
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
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
      aria-disabled={isDisabled || undefined}
      aria-invalid={error ? "true" : required ? "false" : undefined}
      aria-required={required || undefined}
      aria-busy={loading || undefined}
      className={cn(
        "h-14 border-b border-border dark:border-border",
        "bg-background dark:bg-secondary",
        "flex items-center justify-between px-4 shrink-0",
        isDisabled && "opacity-50 pointer-events-none",
        error && "ring-b-2 ring-status-error/50",
        loading && "animate-pulse",
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
              "text-text-secondary dark:text-text-secondary",
              "hover:bg-secondary dark:hover:bg-muted",
              "active:scale-95",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/50",
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
            "border border-border dark:border-border",
            "hover:bg-secondary dark:hover:bg-muted",
            "hover:border-muted dark:hover:border-muted",
            "active:scale-[0.98]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/50",
            viewMode === "compose" && "bg-secondary dark:bg-muted",
          )}
        >
          {viewMode === "compose" ? (
            <>
              <IconChat className="size-4 text-text-secondary dark:text-text-secondary" />
              <span className="text-sm font-medium text-text-secondary dark:text-text-secondary">
                Chat
              </span>
            </>
          ) : (
            <>
              <IconSparkles className="size-4 text-accent-blue" />
              <span className="text-sm font-medium text-accent-blue">Compose</span>
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
                  "hover:bg-secondary dark:hover:bg-muted",
                  "active:scale-[0.98]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/50",
                  isModelSelectorOpen && "bg-secondary dark:bg-muted",
                )}
              >
                <span className="text-[13px] font-semibold text-foreground dark:text-foreground">
                  ChatGPT
                </span>
                <div className="w-px h-4 bg-border dark:bg-border" />
                <span className="text-[13px] font-medium text-muted-foreground dark:text-muted-foreground">
                  {modelName}
                </span>
                <IconChevronDown
                  className={cn(
                    "size-3.5 text-muted-foreground dark:text-muted-foreground transition-transform duration-200",
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
                "border border-border dark:border-border",
                "bg-background dark:bg-secondary",
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
                        "hover:bg-secondary dark:hover:bg-muted",
                        "active:scale-[0.98]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-blue/50",
                        "text-left group",
                        isModelSelected(model) && "bg-secondary dark:bg-muted",
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground dark:text-foreground">
                            {model.name}
                          </span>
                          {model.badge && (
                            <span
                              className={cn(
                                "text-[10px] font-semibold px-1.5 py-0.5 rounded-md uppercase tracking-wide",
                                model.badge === "New"
                                  ? "bg-accent-green/10 text-accent-green dark:bg-accent-green/20"
                                  : "bg-accent-blue/10 text-accent-blue dark:bg-accent-blue/20",
                              )}
                            >
                              {model.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-1 leading-tight">
                          {model.description}
                        </p>
                      </div>
                      {isModelSelected(model) && (
                        <IconCheck className="size-4 text-accent-green shrink-0 ml-2" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-border dark:bg-border my-2" />

                {/* Legacy Models Submenu */}
                <Popover open={isLegacyOpen} onOpenChange={setIsLegacyOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150",
                        "hover:bg-secondary dark:hover:bg-muted",
                        "active:scale-[0.98]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-blue/50",
                        "text-left",
                        isLegacyOpen && "bg-secondary dark:bg-muted",
                      )}
                    >
                      <span className="text-sm font-medium text-foreground dark:text-foreground">
                        Legacy models
                      </span>
                      <IconChevronRight
                        className={cn(
                          "size-4 text-muted-foreground dark:text-muted-foreground transition-transform duration-200",
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
                      "border border-border dark:border-border",
                      "bg-background dark:bg-secondary",
                      "shadow-[0_8px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.24)]",
                      "animate-in fade-in-0 zoom-in-95 slide-in-from-left-2 duration-200",
                    )}
                  >
                    <div className="p-2 max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted dark:scrollbar-thumb-muted scrollbar-track-transparent">
                      <div className="space-y-0.5">
                        {legacyModels.map((model) => (
                          <button
                            key={model.name}
                            type="button"
                            onClick={() => handleModelSelect(model)}
                            className={cn(
                              "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-150",
                              "hover:bg-secondary dark:hover:bg-muted",
                              "active:scale-[0.98]",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-blue/50",
                              "text-left",
                              isModelSelected(model) && "bg-secondary dark:bg-muted",
                            )}
                          >
                            <span className="text-sm text-foreground dark:text-foreground">
                              {model.name}
                            </span>
                            {isModelSelected(model) && (
                              <IconCheck className="size-4 text-accent-green shrink-0 ml-2" />
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
            "text-muted-foreground dark:text-muted-foreground",
            "hover:bg-secondary dark:hover:bg-muted",
            "hover:text-text-secondary dark:hover:text-text-secondary",
            "active:scale-95",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/50",
          )}
        >
          <IconDownload className="size-4 text-text-secondary dark:text-text-secondary" />
        </button>
        <button
          type="button"
          aria-label="Share"
          className={cn(
            "p-2 rounded-lg transition-all duration-150",
            "text-muted-foreground dark:text-muted-foreground",
            "hover:bg-secondary dark:hover:bg-muted",
            "hover:text-text-secondary dark:hover:text-text-secondary",
            "active:scale-95",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/50",
          )}
        >
          <IconShare className="size-4 text-text-secondary dark:text-text-secondary" />
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
