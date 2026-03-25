import type { ReactNode } from "react";

import { cn } from "../../../components/ui/utils";

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
  const baseClasses = "flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors";
  const interactiveClasses = onClick
    ? "cursor-pointer text-left hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    : "";

  const content = (
    <>
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {icon && <span className="shrink-0 text-text-secondary">{icon}</span>}
        <div className="min-w-0 flex-1">
          <span className="text-body-small text-foreground">{label}</span>
          {description ? (
            <p className="mt-1 text-caption text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>
      {right ? <div className="ml-3 shrink-0">{right}</div> : null}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn("w-full", baseClasses, interactiveClasses, className)}
      >
        {content}
      </button>
    );
  }

  return <div className={cn(baseClasses, className)}>{content}</div>;
}
