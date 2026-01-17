import type { ReactNode } from "react";

export interface SettingRowProps {
  icon?: ReactNode;
  label: string;
  description?: string;
  right?: ReactNode;
  onClick?: () => void;
  className?: string;
}

/**
 * Reusable settings row component
 * Can be used as a display row or clickable button
 * Supports optional icon on the left
 */
export function SettingRow({
  icon,
  label,
  description,
  right,
  onClick,
  className = "",
}: SettingRowProps) {
  const baseClasses = "flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors";
  const hoverClasses = onClick ? "hover:bg-[var(--foundation-bg-dark-2)] cursor-pointer" : "";

  const content = (
    <>
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {icon}
        <div className="min-w-0">
          <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-[var(--foundation-text-dark-primary)]">
            {label}
          </span>
          {description && (
            <p className="text-[13px] leading-[18px] tracking-[-0.32px] text-[var(--foundation-text-dark-tertiary)] mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
      {right && <div className="flex-shrink-0">{right}</div>}
    </>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className={`w-full ${baseClasses} ${hoverClasses} ${className}`}>
        {content}
      </button>
    );
  }

  return <div className={`${baseClasses} ${className}`}>{content}</div>;
}
