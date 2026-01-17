import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";

import { cn } from "./ui/utils";

// Icons
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

function IconSparkle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.06 1.06l1.06 1.06z" />
    </svg>
  );
}

export interface ModelConfig {
  /** Unique identifier or full name */
  name: string;
  /** Short display name */
  shortName: string;
  /** Description of the model */
  description: string;
  /** Whether this is a legacy/deprecated model */
  isLegacy?: boolean;
  /** Optional badge text (e.g., "New", "Recommended") */
  badge?: string;
  /** Badge variant for styling */
  badgeVariant?: "default" | "success" | "warning";
  /** Optional icon to show */
  icon?: React.ReactNode;
}

export interface ModelSelectorProps {
  /** Currently selected model */
  value?: string | ModelConfig;
  /** Callback when model changes */
  onChange?: (model: string | ModelConfig) => void;
  /** Available models to choose from */
  models?: ModelConfig[];
  /** Legacy models (shown in submenu) */
  legacyModels?: ModelConfig[];
  /** Label shown before model name */
  label?: string;
  /** Additional CSS classes */
  className?: string;
  /** Disable the selector */
  disabled?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Show model icon */
  showIcon?: boolean;
}

const defaultModels: ModelConfig[] = [
  {
    name: "Auto",
    shortName: "Auto",
    description: "Decides how long to think",
    badge: "Recommended",
    badgeVariant: "default",
  },
  { name: "Instant", shortName: "Instant", description: "Answers right away" },
  { name: "Thinking", shortName: "Thinking", description: "Thinks longer for better answers" },
  {
    name: "Pro",
    shortName: "Pro",
    description: "Research-grade intelligence",
    badge: "New",
    badgeVariant: "success",
  },
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
 * ModelSelector - A polished dropdown for selecting AI models
 *
 * @example
 * ```tsx
 * <ModelSelector
 *   value={selectedModel}
 *   onChange={setSelectedModel}
 *   models={[
 *     { name: "Auto", shortName: "Auto", description: "Decides how long to think", badge: "Recommended" },
 *     { name: "Pro", shortName: "Pro", description: "Research-grade intelligence", badge: "New", badgeVariant: "success" },
 *   ]}
 *   label="ChatGPT"
 * />
 * ```
 */
export function ModelSelector({
  value,
  onChange,
  models = defaultModels,
  legacyModels = defaultLegacyModels,
  label = "ChatGPT",
  className,
  disabled = false,
  size = "md",
  showIcon = false,
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLegacyOpen, setIsLegacyOpen] = useState(false);

  const modelName = typeof value === "string" ? value : (value?.shortName ?? models[0]?.shortName);

  const handleSelect = (model: ModelConfig) => {
    onChange?.(model);
    setIsOpen(false);
    setIsLegacyOpen(false);
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (isOpen) setIsLegacyOpen(false);
    }
  };

  const isModelSelected = (model: ModelConfig) => {
    if (typeof value === "string") {
      return value === model.name || value === model.shortName;
    }
    return value?.name === model.name;
  };

  const sizeClasses = {
    sm: "px-2.5 py-1.5 text-xs gap-1.5",
    md: "px-3.5 py-2 text-[13px] gap-2.5",
    lg: "px-4 py-2.5 text-sm gap-3",
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className={cn(
            "flex items-center rounded-lg transition-all duration-150",
            "hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-3",
            "active:scale-[0.98]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue/50",
            isOpen && "bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-3",
            disabled && "opacity-50 cursor-not-allowed",
            sizeClasses[size],
            className,
          )}
        >
          {showIcon && <IconSparkle className="size-4 text-foundation-accent-blue" />}
          {label && (
            <>
              <span className="font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                {label}
              </span>
              <div className="w-px h-4 bg-foundation-border-light dark:bg-foundation-border-dark" />
            </>
          )}
          <span className="font-medium text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
            {modelName}
          </span>
          <IconChevronDown
            className={cn(
              "size-3.5 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary transition-transform duration-200",
              isOpen && "rotate-180",
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
          role="listbox"
        >
          <div className="p-2">
            {/* Available Models */}
            <div className="space-y-0.5">
              {models.map((model) => (
                <ModelOption
                  key={model.name}
                  model={model}
                  isSelected={isModelSelected(model)}
                  onSelect={handleSelect}
                />
              ))}
            </div>

            {/* Legacy Models */}
            {legacyModels && legacyModels.length > 0 && (
              <>
                <div className="h-px bg-foundation-border-light dark:bg-foundation-border-dark my-2" />
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
                            <LegacyModelOption
                              key={model.name}
                              model={model}
                              isSelected={isModelSelected(model)}
                              onSelect={handleSelect}
                            />
                          ))}
                        </div>
                      </div>
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>
              </>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

interface ModelOptionProps {
  model: ModelConfig;
  isSelected: boolean;
  onSelect: (model: ModelConfig) => void;
}

function ModelOption({ model, isSelected, onSelect }: ModelOptionProps) {
  const badgeColors = {
    default:
      "bg-foundation-accent-blue/10 text-foundation-accent-blue dark:bg-foundation-accent-blue/20",
    success:
      "bg-foundation-accent-green/10 text-foundation-accent-green dark:bg-foundation-accent-green/20",
    warning:
      "bg-foundation-accent-orange/10 text-foundation-accent-orange dark:bg-foundation-accent-orange/20",
  };

  return (
    <button
      type="button"
      onClick={() => onSelect(model)}
      role="option"
      aria-selected={isSelected}
      className={cn(
        "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150",
        "hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-3",
        "active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-foundation-accent-blue/50",
        "text-left group",
        isSelected && "bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-3",
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {model.icon}
          <span className="text-sm font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
            {model.name}
          </span>
          {model.badge && (
            <span
              className={cn(
                "text-[10px] font-semibold px-1.5 py-0.5 rounded-md uppercase tracking-wide",
                badgeColors[model.badgeVariant ?? "default"],
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
      {isSelected && <IconCheck className="size-4 text-foundation-accent-green shrink-0 ml-2" />}
    </button>
  );
}

function LegacyModelOption({ model, isSelected, onSelect }: ModelOptionProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(model)}
      role="option"
      aria-selected={isSelected}
      className={cn(
        "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-150",
        "hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-3",
        "active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-foundation-accent-blue/50",
        "text-left",
        isSelected && "bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-3",
      )}
    >
      <span className="text-sm text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
        {model.name}
      </span>
      {isSelected && <IconCheck className="size-4 text-foundation-accent-green shrink-0 ml-2" />}
    </button>
  );
}

ModelSelector.displayName = "ModelSelector";
