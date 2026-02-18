import type { ComponentState, StatefulComponentProps } from "@design-studio/tokens";
import * as React from "react";
import { useRef, useState } from "react";
import { useFocusTrap } from "../../../../hooks/useFocusTrap";
import { IconCheckmark, IconChevronDownMd, IconSettings } from "../../../../icons";
import { cn } from "../../utils";

/**
 * Describes a selectable mode entry.
 */
export interface ModeConfig {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Subtitle or category */
  subtitle?: string;
  /** Description of when to use this mode */
  whenToUse?: string[];
  /** Detailed description */
  about?: string;
  /** Icon component */
  icon?: React.ReactNode;
  /** Additional configuration */
  config?: Record<string, string>;
}

/**
 * Props for the mode selector component.
 */
export interface ModeSelectorProps extends StatefulComponentProps {
  /** Currently selected mode */
  value?: ModeConfig;
  /** Callback when mode changes */
  onChange?: (mode: ModeConfig) => void;
  /** Available modes */
  modes: ModeConfig[];
  /** Show detailed preview panel */
  showPreview?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Trigger button variant */
  variant?: "default" | "compact" | "pill";
  /** Label shown before mode name */
  label?: string;
}

/**
 * Renders a selector for choosing operational modes.
 *
 * Supports stateful props for loading, error, and disabled states.
 *
 * @example
 * ```tsx
 * <ModeSelector
 *   value={selectedMode}
 *   onChange={setSelectedMode}
 *   modes={[
 *     { id: "chat", name: "Chat", subtitle: "General conversation" },
 *     { id: "edit", name: "Edit", subtitle: "Code editing" },
 *   ]}
 *   showPreview
 * />
 * ```
 *
 * @param props - Mode selector props.
 * @returns A mode selector element.
 */
export function ModeSelector({
  value,
  onChange,
  modes,
  showPreview = false,
  className,
  variant = "default",
  label,
  loading = false,
  error,
  disabled = false,
  required,
  onStateChange,
}: ModeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<ModeConfig | null>(value ?? modes[0]);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

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

  const handleClose = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const { trapProps } = useFocusTrap({
    isOpen,
    onClose: handleClose,
    restoreFocus: true,
  });

  const handleSelect = (mode: ModeConfig) => {
    onChange?.(mode);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleHover = (mode: ModeConfig) => {
    if (showPreview) {
      setPreviewMode(mode);
    }
  };

  const handleOpen = () => {
    setPreviewMode(value ?? modes[0]);
    setIsOpen(true);
  };

  // Focus trap handles Escape and focus restoration.

  const triggerClasses = {
    default: "bg-secondary border border-border rounded-lg px-3 py-1.5",
    compact: "px-2 py-1 rounded-md",
    pill: "bg-secondary border border-border rounded-full px-4 py-1.5",
  };

  return (
    <>
      <div
        data-slot="mode-selector"
        data-state={effectiveState}
        data-error={error ? "true" : undefined}
        data-required={required ? "true" : undefined}
        className={cn("relative", className)}
        aria-disabled={isDisabled || undefined}
        aria-invalid={error ? "true" : required ? "false" : undefined}
        aria-required={required || undefined}
        aria-busy={loading || undefined}
      >
        {label && <span className="text-caption text-muted-foreground mr-2">{label}</span>}
        <button
          ref={triggerRef}
          onClick={handleOpen}
          type="button"
          disabled={isDisabled}
          className={cn(
            "text-caption text-foreground flex items-center gap-2 hover:bg-muted transition-colors",
            isDisabled && "opacity-50 cursor-not-allowed",
            error && "border border-status-error ring-2 ring-status-error/50 rounded-lg",
            loading && "animate-pulse",
            triggerClasses[variant],
          )}
        >
          {loading ? "Loading..." : error ? error : (value?.name ?? modes[0]?.name)}
          <IconChevronDownMd className="size-3 text-muted-foreground" />
        </button>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-overlay/50 z-40"
            onClick={handleClose}
            role="presentation"
            aria-hidden="true"
          />

          <div
            {...trapProps}
            role="dialog"
            aria-modal="true"
            aria-label="Mode selector"
            className={cn(
              "fixed z-50 bg-card border border-border rounded-[16px] shadow-2xl overflow-hidden",
              showPreview
                ? "top-16 right-4 w-[960px]"
                : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px]",
            )}
          >
            <div className={cn("flex", showPreview && "h-[600px]")}>
              {/* Preview Panel */}
              {showPreview && previewMode && (
                <div className="flex-1 p-8 overflow-y-auto">
                  <div className="flex items-start gap-3 mb-6">
                    <div className="p-2 bg-muted rounded-lg">
                      {previewMode.icon ?? (
                        <IconSettings className="size-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-heading-3 font-semibold text-foreground">
                        {previewMode.name}
                      </h2>
                      {previewMode.subtitle && (
                        <p className="text-body-small text-muted-foreground">
                          {previewMode.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {previewMode.config && (
                    <div className="mb-8">
                      <h3 className="text-body-small font-semibold text-muted-foreground mb-4">
                        Configuration
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(previewMode.config).map(([key, val]) => (
                          <div
                            key={key}
                            className="px-4 py-3 bg-secondary border border-border rounded-lg"
                          >
                            <div className="text-caption text-muted-foreground">
                              {key} · <span className="text-foreground">{val}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {previewMode.whenToUse && previewMode.whenToUse.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-body-small font-semibold text-muted-foreground mb-3">
                        When to use
                      </h3>
                      <ul className="space-y-2">
                        {previewMode.whenToUse?.map((item) => (
                          <li
                            key={item}
                            className="text-body-small text-text-secondary flex items-start gap-2"
                          >
                            <span className="text-muted-foreground">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {previewMode.about && (
                    <div>
                      <h3 className="text-body-small font-semibold text-muted-foreground mb-3">
                        About this mode
                      </h3>
                      <p className="text-body-small text-text-secondary">{previewMode.about}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Mode List */}
              <div
                className={cn(
                  "bg-card p-6",
                  showPreview ? "w-[360px] border-l border-border" : "w-full",
                )}
              >
                <h3 className="text-body-small font-semibold text-muted-foreground mb-4">
                  Available Modes
                </h3>
                <div className="space-y-2">
                  {modes.map((mode) => (
                    <button
                      type="button"
                      key={mode.id}
                      onClick={() => handleSelect(mode)}
                      onMouseEnter={() => handleHover(mode)}
                      className={cn(
                        "w-full px-4 py-3 rounded-lg text-left transition-all flex items-center justify-between",
                        value?.id === mode.id
                          ? "bg-status-success-muted/10 border border-status-success/30 text-foreground"
                          : "bg-secondary border border-transparent text-text-secondary hover:bg-muted",
                      )}
                    >
                      <span className="text-body-small">{mode.name}</span>
                      {value?.id === mode.id && (
                        <IconCheckmark className="size-4 text-foreground" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

ModeSelector.displayName = "ModeSelector";
