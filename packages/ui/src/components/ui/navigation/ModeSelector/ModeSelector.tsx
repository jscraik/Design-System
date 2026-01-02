import { useRef, useState } from "react";

import { IconCheckmark, IconChevronDownMd, IconSettings } from "../../../../icons";
import { useFocusTrap } from "../../../../hooks/useFocusTrap";
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
export interface ModeSelectorProps {
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
}: ModeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<ModeConfig | null>(value ?? modes[0]);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

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
    default: "bg-foundation-bg-dark-2 border border-foundation-bg-dark-3 rounded-lg px-3 py-1.5",
    compact: "px-2 py-1 rounded-md",
    pill: "bg-foundation-bg-dark-2 border border-foundation-bg-dark-3 rounded-full px-4 py-1.5",
  };

  return (
    <>
      <div className={cn("relative", className)}>
        {label && (
          <span className="text-caption text-foundation-text-dark-tertiary mr-2">{label}</span>
        )}
        <button
          ref={triggerRef}
          onClick={handleOpen}
          type="button"
          className={cn(
            "text-caption text-foundation-text-dark-primary flex items-center gap-2 hover:bg-foundation-bg-dark-3 transition-colors",
            triggerClasses[variant],
          )}
        >
          {value?.name ?? modes[0]?.name}
          <IconChevronDownMd className="size-3 text-foundation-text-dark-tertiary" />
        </button>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-foundation-bg-dark-1/50 z-40"
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
              "fixed z-50 bg-foundation-bg-dark-1 border border-foundation-bg-dark-3 rounded-[16px] shadow-2xl overflow-hidden",
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
                    <div className="p-2 bg-foundation-bg-dark-3 rounded-lg">
                      {previewMode.icon ?? (
                        <IconSettings className="size-5 text-foundation-text-dark-tertiary" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-heading-3 font-semibold text-foundation-text-dark-primary">
                        {previewMode.name}
                      </h2>
                      {previewMode.subtitle && (
                        <p className="text-body-small text-foundation-text-dark-tertiary">
                          {previewMode.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {previewMode.config && (
                    <div className="mb-8">
                      <h3 className="text-body-small font-semibold text-foundation-text-dark-tertiary mb-4">
                        Configuration
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(previewMode.config).map(([key, val]) => (
                          <div
                            key={key}
                            className="px-4 py-3 bg-foundation-bg-dark-2 border border-foundation-bg-dark-3 rounded-lg"
                          >
                            <div className="text-caption text-foundation-text-dark-tertiary">
                              {key} ·{" "}
                              <span className="text-foundation-text-dark-primary">{val}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {previewMode.whenToUse && previewMode.whenToUse.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-body-small font-semibold text-foundation-text-dark-tertiary mb-3">
                        When to use
                      </h3>
                      <ul className="space-y-2">
                        {previewMode.whenToUse?.map((item) => (
                          <li
                            key={item}
                            className="text-body-small text-foundation-text-dark-secondary flex items-start gap-2"
                          >
                            <span className="text-foundation-text-dark-tertiary">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {previewMode.about && (
                    <div>
                      <h3 className="text-body-small font-semibold text-foundation-text-dark-tertiary mb-3">
                        About this mode
                      </h3>
                      <p className="text-body-small text-foundation-text-dark-secondary">
                        {previewMode.about}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Mode List */}
              <div
                className={cn(
                  "bg-foundation-bg-dark-1 p-6",
                  showPreview ? "w-[360px] border-l border-foundation-bg-dark-3" : "w-full",
                )}
              >
                <h3 className="text-body-small font-semibold text-foundation-text-dark-tertiary mb-4">
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
                          ? "bg-foundation-accent-green/10 border border-foundation-accent-green/30 text-foundation-text-dark-primary"
                          : "bg-foundation-bg-dark-2 border border-transparent text-foundation-text-dark-secondary hover:bg-foundation-bg-dark-3",
                      )}
                    >
                      <span className="text-body-small">{mode.name}</span>
                      {value?.id === mode.id && (
                        <IconCheckmark className="size-4 text-foundation-text-dark-primary" />
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
