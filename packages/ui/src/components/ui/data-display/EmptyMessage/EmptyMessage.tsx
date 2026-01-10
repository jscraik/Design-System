import * as React from "react";

import { IconArchive, IconQuestion, IconSearch, IconWarning } from "../../../../icons";
import { cn } from "../../utils";

export interface EmptyMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode | React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "search" | "error" | "inbox";
}

const defaultIcons = {
  default: IconQuestion,
  search: IconSearch,
  error: IconWarning,
  inbox: IconArchive,
} as const;

function EmptyMessage({
  icon,
  title,
  description,
  action,
  variant = "default",
  className,
  ...props
}: EmptyMessageProps) {
  const Icon = icon || defaultIcons[variant];
  const iconNode = React.isValidElement(Icon)
    ? Icon
    : typeof Icon === "function"
      ? <Icon className="size-8 text-muted-foreground" />
      : null;

  return (
    <div
      data-slot="empty-message"
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-16 px-6 text-center",
        className,
      )}
      {...props}
    >
      <div className="rounded-full bg-muted p-6">{iconNode}</div>

      <div className="max-w-md space-y-2">
        <h3 className="font-semibold text-foreground">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>

      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export { EmptyMessage };
