import { useState } from "react";

import { cn } from "../../utils";

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

/**
 * Describes a selectable model.
 */
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

/**
 * Props for the model selector component.
 */
export interface ModelSelectorProps {
  /** Currently selected model */
  value?: string | ModelConfig;
  /** Callback when model changes */
  onChange?: (model: string | ModelConfig) => void;
  /** Available models to choose from */
  models: ModelConfig[];
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

/**
 * Renders a polished dropdown for selecting AI models.
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
 *
 * @param props - Model selector props.
 * @returns A model selector element.
 */
export function ModelSelector({
  value,
  onChange,
  models,
  legacyModels,
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
    onChange?.(model.name);
    setIsOpen(false);
    setIsLegacyOpen(false);
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (isOpen) setIsLegacyOpen(false);
    }
  };

  const sizeClasses = {
    sm: "px-2.5 py-1.5 text-xs gap-1.5",
    md: "px-3 py-2 text-sm gap-2",
    lg: "px-4 py-2.5 text-sm gap-3",
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={cn(
          "flex items-center rounded-lg transition-all duration-150",
          "hover:bg-secondary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isOpen && "bg-secondary",
          disabled && "opacity-50 cursor-not-allowed",
          sizeClasses[size],
          className,
        )}
      >
        {showIcon && <IconSparkle className="size-4 text-interactive" />}
        {label && <span className="font-semibold text-foreground">{label}</span>}
        <span className="text-muted-foreground">{modelName}</span>
        <IconChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setIsOpen(false);
              setIsLegacyOpen(false);
            }}
          />

          {/* Main Menu */}
          <div
            className={cn(
              "absolute top-full left-0 mt-2 z-50 w-[320px] rounded-2xl overflow-hidden",
              "border border-border",
              "bg-card",
              "shadow-xl",
              "animate-in fade-in-0 zoom-in-95 duration-200",
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
                    isSelected={modelName === model.name || modelName === model.shortName}
                    onSelect={handleSelect}
                  />
                ))}
              </div>

              {/* Legacy Models */}
              {legacyModels && legacyModels.length > 0 && (
                <>
                  <div className="h-px bg-border my-2" />
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsLegacyOpen(!isLegacyOpen)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors duration-150",
                        "hover:bg-secondary",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                        "text-left",
                      )}
                    >
                      <span className="text-sm font-medium text-foreground">Legacy models</span>
                      <IconChevronRight
                        className={cn(
                          "size-4 text-muted-foreground transition-transform duration-200",
                          isLegacyOpen && "rotate-90",
                        )}
                      />
                    </button>

                    {/* Legacy Submenu */}
                    {isLegacyOpen && (
                      <div
                        className={cn(
                          "absolute left-full top-0 ml-2 w-[280px] rounded-2xl overflow-hidden",
                          "border border-border",
                          "bg-card",
                          "shadow-xl",
                          "animate-in fade-in-0 slide-in-from-left-2 duration-200",
                        )}
                      >
                        <div className="p-2 max-h-[320px] overflow-y-auto">
                          {legacyModels.map((model) => (
                            <LegacyModelOption
                              key={model.name}
                              model={model}
                              isSelected={modelName === model.name || modelName === model.shortName}
                              onSelect={handleSelect}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface ModelOptionProps {
  model: ModelConfig;
  isSelected: boolean;
  onSelect: (model: ModelConfig) => void;
}

/**
 * Renders an individual model option.
 *
 * @param props - Model option props.
 * @returns A model option element.
 */
function ModelOption({ model, isSelected, onSelect }: ModelOptionProps) {
  const badgeColors = {
    default: "bg-interactive/10 text-interactive",
    success: "bg-status-success-muted/10 text-status-success",
    warning: "bg-status-warning/10 text-status-warning",
  };

  return (
    <button
      type="button"
      onClick={() => onSelect(model)}
      role="option"
      aria-selected={isSelected}
      className={cn(
        "w-full flex items-center justify-between px-3 py-3 rounded-xl transition-colors duration-150",
        "hover:bg-secondary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
        "text-left group",
        isSelected && "bg-secondary",
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {model.icon}
          <span className="text-sm font-medium text-foreground">{model.name}</span>
          {model.badge && (
            <span
              className={cn(
                "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                badgeColors[model.badgeVariant ?? "default"],
              )}
            >
              {model.badge}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{model.description}</p>
      </div>
      {isSelected && <IconCheck className="size-4 text-status-success shrink-0 ml-2" />}
    </button>
  );
}

/**
 * Renders a legacy model option.
 *
 * @param props - Model option props.
 * @returns A legacy model option element.
 */
function LegacyModelOption({ model, isSelected, onSelect }: ModelOptionProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(model)}
      role="option"
      aria-selected={isSelected}
      className={cn(
        "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors duration-150",
        "hover:bg-secondary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
        "text-left",
        isSelected && "bg-secondary",
      )}
    >
      <span className="text-sm text-foreground">{model.name}</span>
      {isSelected && <IconCheck className="size-4 text-status-success shrink-0 ml-2" />}
    </button>
  );
}

ModelSelector.displayName = "ModelSelector";
