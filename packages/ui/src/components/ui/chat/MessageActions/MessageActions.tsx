import * as React from "react";

import {
  IconCopy,
  IconDotsHorizontal,
  IconRegenerate,
  IconShare,
  IconThumbDown,
  IconThumbUp,
} from "../../../../icons";
import { IconButton } from "../../base/IconButton";
import { cn } from "../../utils";
import type { StatefulComponentProps, ComponentState } from "@design-studio/tokens";

/**
 * Props for the message actions toolbar.
 */
export interface MessageActionsProps extends StatefulComponentProps {
  /** Message ID for action callbacks */
  messageId?: string;
  /** Callback when copy is clicked */
  onCopy?: (messageId?: string) => void;
  /** Callback when thumbs up is clicked */
  onThumbsUp?: (messageId?: string) => void;
  /** Callback when thumbs down is clicked */
  onThumbsDown?: (messageId?: string) => void;
  /** Callback when share is clicked */
  onShare?: (messageId?: string) => void;
  /** Callback when regenerate is clicked */
  onRegenerate?: (messageId?: string) => void;
  /** Callback when more options is clicked */
  onMore?: (messageId?: string) => void;
  /** Which actions to show */
  actions?: ("copy" | "thumbsUp" | "thumbsDown" | "share" | "regenerate" | "more")[];
  /** Whether to show on hover only */
  showOnHover?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * MessageActions - Action buttons for chat messages
 *
 * Supports stateful props for loading, error, and disabled states.
 * When loading, disables all action buttons with pulse animation.
 * When error, shows error ring styling.
 * When disabled, reduces opacity and prevents interactions.
 *
 * @example
 * ```tsx
 * <MessageActions
 *   messageId={message.id}
 *   onCopy={(id) => copyToClipboard(id)}
 *   onThumbsUp={(id) => rateMessage(id, "up")}
 *   showOnHover
 * />
 * <MessageActions loading />
 * <MessageActions disabled />
 * ```
 */
export function MessageActions({
  messageId,
  onCopy,
  onThumbsUp,
  onThumbsDown,
  onShare,
  onRegenerate,
  onMore,
  actions = ["copy", "thumbsUp", "thumbsDown", "share", "regenerate", "more"],
  showOnHover = true,
  className,
  disabled = false,
  loading = false,
  error,
  required,
  onStateChange,
}: MessageActionsProps) {
  // Determine effective state (priority: loading > error > disabled > default)
  const effectiveState: ComponentState = loading
    ? "loading"
    : error
      ? "error"
      : disabled
        ? "disabled"
        : "default";

  // Notify parent of state changes
  React.useEffect(() => {
    onStateChange?.(effectiveState);
  }, [effectiveState, onStateChange]);

  // Effective disabled state (disabled if explicitly disabled OR loading)
  const isDisabled = disabled || loading;

  const actionMap = {
    copy: {
      icon: <IconCopy className="size-4" />,
      title: "Copy",
      onClick: () => {
        if (isDisabled) return;
        onCopy?.(messageId);
      },
    },
    thumbsUp: {
      icon: <IconThumbUp className="size-4" />,
      title: "Good response",
      onClick: () => {
        if (isDisabled) return;
        onThumbsUp?.(messageId);
      },
    },
    thumbsDown: {
      icon: <IconThumbDown className="size-4" />,
      title: "Bad response",
      onClick: () => {
        if (isDisabled) return;
        onThumbsDown?.(messageId);
      },
    },
    share: {
      icon: <IconShare className="size-4" />,
      title: "Share",
      onClick: () => {
        if (isDisabled) return;
        onShare?.(messageId);
      },
    },
    regenerate: {
      icon: <IconRegenerate className="size-4" />,
      title: "Regenerate",
      onClick: () => {
        if (isDisabled) return;
        onRegenerate?.(messageId);
      },
    },
    more: {
      icon: <IconDotsHorizontal className="size-4" />,
      title: "More",
      onClick: () => {
        if (isDisabled) return;
        onMore?.(messageId);
      },
    },
  };

  return (
    <div
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
      aria-disabled={isDisabled || undefined}
      aria-invalid={error ? "true" : required ? "false" : undefined}
      aria-required={required || undefined}
      aria-busy={loading || undefined}
      className={cn(
        "flex items-center gap-1",
        showOnHover && "opacity-0 group-hover:opacity-100 transition-opacity",
        isDisabled && "opacity-50",
        error && "ring-2 ring-foundation-accent-red/50 rounded-lg",
        loading && "animate-pulse",
        className,
      )}
    >
      {actions.map((action) => {
        const config = actionMap[action];
        return (
          <IconButton
            key={action}
            icon={config.icon}
            title={config.title}
            onClick={config.onClick}
            size="md"
            disabled={isDisabled}
          />
        );
      })}
    </div>
  );
}

MessageActions.displayName = "MessageActions";
