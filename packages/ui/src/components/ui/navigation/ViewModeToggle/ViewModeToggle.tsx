import { IconChat } from "../../../../icons";
import { Sparkles } from "../../../../integrations/apps-sdk";
import { cn } from "../../utils";

/**
 * Supported view modes for the toggle.
 */
export type ViewMode = "chat" | "compose";

/**
 * Props for the view mode toggle component.
 */
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
 * Renders a toggle between chat and compose modes.
 *
 * @example
 * ```tsx
 * <ViewModeToggle
 *   value={viewMode}
 *   onChange={setViewMode}
 * />
 * ```
 *
 * @param props - View mode toggle props.
 * @returns A view mode toggle element.
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
    <button
      type="button"
      className={cn(
        "flex items-center gap-2 px-4 py-2 border border-border rounded-xl hover:bg-secondary transition-colors",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      onClick={handleToggle}
      disabled={disabled}
    >
      {value === "compose" ? (
        <>
          <div className="size-4 text-text-secondary">
            <IconChat />
          </div>
          <span className="text-body-small text-text-secondary">{labels.chat}</span>
        </>
      ) : (
        <>
          <Sparkles className="size-4 text-accent-blue" />
          <span className="text-body-small text-accent-blue">{labels.compose}</span>
        </>
      )}
    </button>
  );
}

ViewModeToggle.displayName = "ViewModeToggle";
