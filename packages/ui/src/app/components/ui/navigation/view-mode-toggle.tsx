import { IconChat } from "../../../../icons";
import { Sparkles } from "../../../../vendor/appsSdkUi";
import { cn } from "../utils";

export type ViewMode = "chat" | "compose";

export interface ViewModeToggleProps {
  /** Current view mode */
  value?: ViewMode;
  /** Callback when mode changes */
  onChange?: (mode: ViewMode) => void;
  /** Additional CSS classes */
  className?: string;
  /** Disable the toggle */
  disabled?: boolean;
  /** Custom labels */
  labels?: {
    chat?: string;
    compose?: string;
  };
}

/**
 * ViewModeToggle - Toggle between chat and compose modes
 *
 * @example
 * ```tsx
 * <ViewModeToggle
 *   value={viewMode}
 *   onChange={setViewMode}
 * />
 * ```
 */
export function ViewModeToggle({
  value = "chat",
  onChange,
  className,
  disabled = false,
  labels = { chat: "Chat", compose: "Compose" },
}: ViewModeToggleProps) {
  const handleToggle = () => {
    if (disabled) return;
    onChange?.(value === "compose" ? "chat" : "compose");
  };

  return (
    <button type="button"
      className={cn(
        "flex items-center gap-2 px-4 py-2 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-xl hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3 transition-colors",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      onClick={handleToggle}
      disabled={disabled}
    >
      {value === "compose" ? (
        <>
          <div className="size-4 text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            <IconChat />
          </div>
          <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            {labels.chat}
          </span>
        </>
      ) : (
        <>
          <Sparkles className="size-4 text-foundation-accent-blue" />
          <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-accent-blue">
            {labels.compose}
          </span>
        </>
      )}
    </button>
  );
}

ViewModeToggle.displayName = "ViewModeToggle";
