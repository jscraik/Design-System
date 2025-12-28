import { useState } from "react";

import { IconCheckmark, IconChevronDownMd, IconSettings } from "../../../../icons";

import { cn } from "../utils";

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
 * ModeSelector - A selector for choosing operational modes
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

  const handleSelect = (mode: ModeConfig) => {
    onChange?.(mode);
    setIsOpen(false);
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

  const triggerClasses = {
    default: "bg-foundation-bg-dark-2 border border-white/10 rounded-lg px-3 py-1.5",
    compact: "px-2 py-1 rounded-md",
    pill: "bg-foundation-bg-dark-2 border border-white/10 rounded-full px-4 py-1.5",
  };

  return (
    <>
      <div className={cn("relative", className)}>
        {label && (
          <span className="text-[12px] leading-[18px] text-foundation-text-dark-primary/70 mr-2">
            {label}
          </span>
        )}
        <button
          onClick={handleOpen}
          className={cn(
            "text-[12px] leading-[18px] text-foundation-text-dark-primary flex items-center gap-2 hover:bg-foundation-bg-dark-3 transition-colors",
            triggerClasses[variant],
          )}
        >
          {value?.name ?? modes[0]?.name}
          <IconChevronDownMd className="size-3 text-foundation-text-dark-primary/70" />
        </button>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setIsOpen(false)} />

          <div
            className={cn(
              "fixed z-50 bg-foundation-bg-dark-1 border border-white/10 rounded-[16px] shadow-2xl overflow-hidden",
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
                    <div className="p-2 bg-white/5 rounded-lg">
                      {previewMode.icon ?? <IconSettings className="size-5 text-white/60" />}
                    </div>
                    <div>
                      <h2 className="text-[18px] font-semibold leading-[26px] tracking-[-0.45px] text-white">
                        {previewMode.name}
                      </h2>
                      {previewMode.subtitle && (
                        <p className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white/60">
                          {previewMode.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {previewMode.config && (
                    <div className="mb-8">
                      <h3 className="text-[14px] font-semibold leading-[20px] tracking-[-0.3px] text-white/60 mb-4">
                        Configuration
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(previewMode.config).map(([key, val]) => (
                          <div
                            key={key}
                            className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg"
                          >
                            <div className="text-[12px] font-normal leading-[18px] tracking-[-0.32px] text-white/60">
                              {key} · <span className="text-white">{val}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {previewMode.whenToUse && previewMode.whenToUse.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-[14px] font-semibold leading-[20px] tracking-[-0.3px] text-white/60 mb-3">
                        When to use
                      </h3>
                      <ul className="space-y-2">
                        {previewMode.whenToUse?.map((item, index) => (
                          <li
                            key={index}
                            className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white/80 flex items-start gap-2"
                          >
                            <span className="text-white/60">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {previewMode.about && (
                    <div>
                      <h3 className="text-[14px] font-semibold leading-[20px] tracking-[-0.3px] text-white/60 mb-3">
                        About this mode
                      </h3>
                      <p className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white/80">
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
                  showPreview ? "w-[360px] border-l border-white/10" : "w-full",
                )}
              >
                <h3 className="text-[14px] font-semibold leading-[20px] tracking-[-0.3px] text-white/60 mb-4">
                  Available Modes
                </h3>
                <div className="space-y-2">
                  {modes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => handleSelect(mode)}
                      onMouseEnter={() => handleHover(mode)}
                      className={cn(
                        "w-full px-4 py-3 rounded-lg text-left transition-all flex items-center justify-between",
                        value?.id === mode.id
                          ? "bg-foundation-accent-green/10 border border-foundation-accent-green/30 text-white"
                          : "bg-white/5 border border-transparent text-white/80 hover:bg-white/10",
                      )}
                    >
                      <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px]">
                        {mode.name}
                      </span>
                      {value?.id === mode.id && <IconCheckmark className="size-4 text-white" />}
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
