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

/**
 * Props for the message actions toolbar.
 */
export interface MessageActionsProps {
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
 * @example
 * ```tsx
 * <MessageActions
 *   messageId={message.id}
 *   onCopy={(id) => copyToClipboard(id)}
 *   onThumbsUp={(id) => rateMessage(id, "up")}
 *   showOnHover
 * />
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
}: MessageActionsProps) {
  const actionMap = {
    copy: {
      icon: <IconCopy className="size-4" />,
      title: "Copy",
      onClick: () => onCopy?.(messageId),
    },
    thumbsUp: {
      icon: <IconThumbUp className="size-4" />,
      title: "Good response",
      onClick: () => onThumbsUp?.(messageId),
    },
    thumbsDown: {
      icon: <IconThumbDown className="size-4" />,
      title: "Bad response",
      onClick: () => onThumbsDown?.(messageId),
    },
    share: {
      icon: <IconShare className="size-4" />,
      title: "Share",
      onClick: () => onShare?.(messageId),
    },
    regenerate: {
      icon: <IconRegenerate className="size-4" />,
      title: "Regenerate",
      onClick: () => onRegenerate?.(messageId),
    },
    more: {
      icon: <IconDotsHorizontal className="size-4" />,
      title: "More",
      onClick: () => onMore?.(messageId),
    },
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1",
        showOnHover && "opacity-0 group-hover:opacity-100 transition-opacity",
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
          />
        );
      })}
    </div>
  );
}

MessageActions.displayName = "MessageActions";
