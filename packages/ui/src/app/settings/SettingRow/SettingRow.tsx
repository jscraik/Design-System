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
  const hoverClasses = onClick ? "hover:bg-secondary dark:hover:bg-secondary cursor-pointer" : "";

  const content = (
    <>
      <div className="flex items-center gap-3 flex-1">
        {icon && <span className="text-text-secondary dark:text-text-secondary">{icon}</span>}
        <div className="flex-1">
          <span className="text-body-small font-normal   text-foreground">{label}</span>
          {description && (
            <p className="text-caption   text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
      {right && <div className="ml-3 flex-shrink-0">{right}</div>}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`w-full ${baseClasses} ${hoverClasses} ${className}`}
      >
        {content}
      </button>
    );
  }

  return <div className={`${baseClasses} ${className}`}>{content}</div>;
}
