import * as React from "react";
import { FileQuestion, Search, Inbox, AlertCircle } from "lucide-react";

import { cn } from "./utils";

export interface EmptyMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode | React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "search" | "error" | "inbox";
}

const EmptyMessage = React.forwardRef<HTMLDivElement, EmptyMessageProps>(
  (
    {
      icon,
      title,
      description,
      action,
      variant = "default",
      className,
      ...props
    },
    ref
  ) => {
    const defaultIcons = {
      default: FileQuestion,
      search: Search,
      error: AlertCircle,
      inbox: Inbox,
    };

    const Icon = icon || defaultIcons[variant];
    const iconNode = React.isValidElement(Icon)
      ? Icon
      : typeof Icon === "function"
        ? <Icon className="size-8 text-foundation-text-dark-tertiary" />
        : null;

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center gap-4 py-16 px-6 text-center",
          className
        )}
        {...props}
      >
        {/* Icon */}
        <div className="rounded-full bg-foundation-bg-dark-2 p-6">
          {iconNode}
        </div>

        {/* Content */}
        <div className="max-w-md space-y-2">
          <h3 className="font-semibold text-foundation-text-dark-primary">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-foundation-text-dark-tertiary">
              {description}
            </p>
          )}
        </div>

        {/* Action */}
        {action && (
          <div className="mt-2">
            {action}
          </div>
        )}
      </div>
    );
  }
);
EmptyMessage.displayName = "EmptyMessage";

export { EmptyMessage };
