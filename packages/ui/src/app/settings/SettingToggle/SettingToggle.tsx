import { type ReactNode, useId } from "react";

import { cn } from "../../../components/ui/utils";

export interface SettingToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  icon?: ReactNode;
  label: string;
  description?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Reusable toggle switch component for settings
 * Uses ChatGPT design system colors
 * Supports optional icon on the left
 */
export function SettingToggle({
  checked,
  onCheckedChange,
  icon,
  label,
  description,
  className = "",
  disabled = false,
}: SettingToggleProps) {
  const descriptionId = useId();

  return (
    <div className={className}>
      <div className="flex items-start justify-between gap-4 rounded-lg px-3 py-2.5">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          {icon ? <span className="mt-0.5 shrink-0 text-text-secondary">{icon}</span> : null}
          <div className="min-w-0 flex-1">
            <span className="text-body-small text-foreground">{label}</span>
            {description ? (
              <p id={descriptionId} className="mt-1 text-caption text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            if (!disabled) {
              onCheckedChange(!checked);
            }
          }}
          disabled={disabled}
          className={cn(
            "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60",
            checked ? "bg-accent-green" : "bg-muted",
          )}
          role="switch"
          aria-checked={checked}
          aria-label={label}
          aria-describedby={description ? descriptionId : undefined}
          aria-disabled={disabled}
        >
          <span
            className={`inline-block size-5 transform rounded-full bg-background transition-transform ${
              checked ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
