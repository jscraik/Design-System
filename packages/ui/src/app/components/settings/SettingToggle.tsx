import type { ReactNode } from "react";

export interface SettingToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  icon?: ReactNode;
  label: string;
  description?: string;
  className?: string;
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
}: SettingToggleProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-3 flex-1">
          {icon}
          <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
            {label}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onCheckedChange(!checked)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${
            checked
              ? "bg-foundation-accent-green"
              : "bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3"
          }`}
          role="switch"
          aria-checked={checked}
          aria-label={label}
        >
          <span
            className={`inline-block size-4 transform rounded-full bg-foundation-bg-light-1 dark:bg-white transition-transform ${
              checked ? "translate-x-[18px]" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>
      {description && (
        <p className="text-[13px] leading-[18px] tracking-[-0.32px] text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary px-3 mt-1">
          {description}
        </p>
      )}
    </div>
  );
}
