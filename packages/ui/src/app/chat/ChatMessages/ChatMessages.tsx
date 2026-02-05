import type { ComponentState, StatefulComponentProps } from "@design-studio/tokens";
import type { ReactNode } from "react";
import * as React from "react";
import {
  getSizeClass,
  IconCopy,
  IconDotsHorizontal,
  IconEdit,
  IconOpenAILogo,
  IconRegenerate,
  IconShare,
  IconThumbDown,
  IconThumbUp,
  IconUser,
} from "../../../icons";

/**
 * Represents a chat message in the conversation stream.
 */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

/**
 * Actions that can be performed on a message.
 */
export type ChatMessageAction =
  | "copy"
  | "thumbs-up"
  | "thumbs-down"
  | "share"
  | "regenerate"
  | "more"
  | "edit";

interface ChatMessagesProps extends StatefulComponentProps {
  emptyState?: ReactNode;
  messages?: ChatMessage[];
  onMessageAction?: (action: ChatMessageAction, message: ChatMessage) => void;
}

const sampleMessages: ChatMessage[] = [
  {
    id: "1",
    role: "assistant",
    content: "Welcome! This is a reference ChatUI shell.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "2",
    role: "user",
    content: "Show me the new sidebar and input layout.",
    timestamp: new Date(Date.now() - 1000 * 60 * 28),
  },
];

/**
 * Renders the chat message list with optional empty state.
 *
 * Supports stateful props for loading, error, and disabled states.
 * When loading, shows loading message instead of messages.
 * When error, shows error message.
 * When disabled, disables message action buttons.
 *
 * When `messages` is omitted, a sample transcript is shown.
 *
 * Accessibility contract:
 * - Message actions are native buttons with tooltips.
 *
 * @param props - Chat messages props and stateful options.
 * @returns A message list container.
 *
 * @example
 * ```tsx
 * <ChatMessages messages={messages} onMessageAction={handleAction} />
 * <ChatMessages loading />
 * <ChatMessages error="Failed to load messages" />
 * ```
 */
export function ChatMessages({
  emptyState,
  messages,
  onMessageAction,
  loading = false,
  error,
  disabled = false,
  required,
  onStateChange,
}: ChatMessagesProps) {
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

  const iconMd = getSizeClass("md");
  const resolvedMessages = messages ?? sampleMessages;

  if (loading) {
    return (
      <div className="flex min-h-0 flex-1 flex-col bg-background dark:bg-background items-center justify-center">
        <div className="text-muted-foreground">Loading messages...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-0 flex-1 flex-col bg-background dark:bg-background items-center justify-center">
        <div className="text-status-error">{error}</div>
      </div>
    );
  }

  if (emptyState && resolvedMessages.length === 0) {
    return (
      <div
        data-state={effectiveState}
        data-error={error ? "true" : undefined}
        data-required={required ? "true" : undefined}
        aria-disabled={isDisabled || undefined}
        aria-invalid={error ? "true" : required ? "false" : undefined}
        aria-required={required || undefined}
        className="flex min-h-0 flex-1 flex-col bg-background dark:bg-background"
      >
        {emptyState}
      </div>
    );
  }

  return (
    <div
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
      aria-disabled={isDisabled || undefined}
      aria-invalid={error ? "true" : required ? "false" : undefined}
      aria-required={required || undefined}
      aria-busy={loading || undefined}
      className="bg-background dark:bg-background"
    >
      <div className="max-w-[62rem] mx-auto px-6 py-8 space-y-6">
        {resolvedMessages.map((message, index) => (
          <div key={message.id ?? index} className="group">
            {message.role === "assistant" ? (
              <div className="flex gap-3">
                <div className="mt-1">
                  <IconOpenAILogo className="size-6 text-foreground/80 dark:text-foreground/80" />
                </div>
                <div className="flex flex-col gap-6">
                  <div className="text-body-medium font-normal text-foreground dark:text-foreground whitespace-pre-wrap">
                    {message.content}
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="p-1.5 hover:bg-secondary dark:hover:bg-secondary rounded-md transition-colors text-text-secondary dark:text-text-secondary hover:text-foreground dark:hover:text-foreground"
                      title="Copy"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(message.content);
                        } catch (error) {
                          console.warn("Failed to copy to clipboard:", error);
                        } finally {
                          onMessageAction?.("copy", message);
                        }
                      }}
                    >
                      <IconCopy className={iconMd} />
                    </button>
                    <button
                      className="p-1.5 hover:bg-secondary dark:hover:bg-secondary rounded-md transition-colors text-text-secondary dark:text-text-secondary hover:text-foreground dark:hover:text-foreground"
                      title="Good response"
                      onClick={() => onMessageAction?.("thumbs-up", message)}
                    >
                      <IconThumbUp className={iconMd} />
                    </button>
                    <button
                      className="p-1.5 hover:bg-secondary dark:hover:bg-secondary rounded-md transition-colors text-text-secondary dark:text-text-secondary hover:text-foreground dark:hover:text-foreground"
                      title="Bad response"
                      onClick={() => onMessageAction?.("thumbs-down", message)}
                    >
                      <IconThumbDown className={iconMd} />
                    </button>
                    <button
                      className="p-1.5 hover:bg-secondary dark:hover:bg-secondary rounded-md transition-colors text-text-secondary dark:text-text-secondary hover:text-foreground dark:hover:text-foreground"
                      title="Share"
                      onClick={() => onMessageAction?.("share", message)}
                    >
                      <IconShare className={iconMd} />
                    </button>
                    <button
                      className="p-1.5 hover:bg-secondary dark:hover:bg-secondary rounded-md transition-colors text-text-secondary dark:text-text-secondary hover:text-foreground dark:hover:text-foreground"
                      title="Regenerate"
                      onClick={() => onMessageAction?.("regenerate", message)}
                    >
                      <IconRegenerate className={iconMd} />
                    </button>
                    <button
                      className="p-1.5 hover:bg-secondary dark:hover:bg-secondary rounded-md transition-colors text-text-secondary dark:text-text-secondary hover:text-foreground dark:hover:text-foreground"
                      title="More"
                      onClick={() => onMessageAction?.("more", message)}
                    >
                      <IconDotsHorizontal className={iconMd} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <div className="flex items-start gap-2 max-w-[70%]">
                  <div className="bg-secondary dark:bg-secondary text-foreground dark:text-foreground text-body-medium font-normal rounded-[20px] px-4 py-3 border border-muted dark:border-muted">
                    {message.content}
                  </div>
                  <div className="mt-1">
                    <IconUser className="size-6 text-foreground/70 dark:text-foreground/70" />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(message.content);
                        } catch (error) {
                          console.warn("Failed to copy to clipboard:", error);
                        } finally {
                          onMessageAction?.("copy", message);
                        }
                      }}
                      className="p-1.5 rounded-lg hover:bg-secondary dark:hover:bg-secondary text-text-secondary dark:text-text-secondary hover:text-foreground dark:hover:text-foreground transition-colors"
                      title="Copy"
                    >
                      <IconCopy className={iconMd} />
                    </button>
                    <button
                      onClick={() => onMessageAction?.("edit", message)}
                      className="p-1.5 rounded-lg hover:bg-secondary dark:hover:bg-secondary text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:hover:text-foreground transition-colors"
                      title="Edit"
                    >
                      <IconEdit className={iconMd} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
