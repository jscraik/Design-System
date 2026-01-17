import type { ReactNode } from "react";

import {
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
import { getSizeClass } from "../../../icons";

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

interface ChatMessagesProps {
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
 * When `messages` is omitted, a sample transcript is shown.
 *
 * Accessibility contract:
 * - Message actions are native buttons with tooltips.
 *
 * @param props - Chat messages props.
 * @returns A message list container.
 */
export function ChatMessages({ emptyState, messages, onMessageAction }: ChatMessagesProps) {
  const iconMd = getSizeClass("md");
  const resolvedMessages = messages ?? sampleMessages;

  if (emptyState && resolvedMessages.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 flex-col bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1">
        {emptyState}
      </div>
    );
  }

  return (
    <div className="bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1">
      <div className="max-w-[62rem] mx-auto px-6 py-8 space-y-6">
        {resolvedMessages.map((message, index) => (
          <div key={message.id ?? index} className="group">
            {message.role === "assistant" ? (
              <div className="flex gap-3">
                <div className="mt-1">
                  <IconOpenAILogo className="size-6 text-foundation-text-light-primary/80 dark:text-foundation-text-dark-primary/80" />
                </div>
                <div className="flex flex-col gap-6">
                  <div className="text-body-medium font-normal text-foundation-text-light-primary dark:text-foundation-text-dark-primary whitespace-pre-wrap">
                    {message.content}
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="p-1.5 hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-2 rounded-md transition-colors text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary hover:text-foundation-icon-light-primary dark:hover:text-foundation-icon-dark-primary"
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
                      className="p-1.5 hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-2 rounded-md transition-colors text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary hover:text-foundation-icon-light-primary dark:hover:text-foundation-icon-dark-primary"
                      title="Good response"
                      onClick={() => onMessageAction?.("thumbs-up", message)}
                    >
                      <IconThumbUp className={iconMd} />
                    </button>
                    <button
                      className="p-1.5 hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-2 rounded-md transition-colors text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary hover:text-foundation-icon-light-primary dark:hover:text-foundation-icon-dark-primary"
                      title="Bad response"
                      onClick={() => onMessageAction?.("thumbs-down", message)}
                    >
                      <IconThumbDown className={iconMd} />
                    </button>
                    <button
                      className="p-1.5 hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-2 rounded-md transition-colors text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary hover:text-foundation-icon-light-primary dark:hover:text-foundation-icon-dark-primary"
                      title="Share"
                      onClick={() => onMessageAction?.("share", message)}
                    >
                      <IconShare className={iconMd} />
                    </button>
                    <button
                      className="p-1.5 hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-2 rounded-md transition-colors text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary hover:text-foundation-icon-light-primary dark:hover:text-foundation-icon-dark-primary"
                      title="Regenerate"
                      onClick={() => onMessageAction?.("regenerate", message)}
                    >
                      <IconRegenerate className={iconMd} />
                    </button>
                    <button
                      className="p-1.5 hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-2 rounded-md transition-colors text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary hover:text-foundation-icon-light-primary dark:hover:text-foundation-icon-dark-primary"
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
                  <div className="bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 text-foundation-text-light-primary dark:text-foundation-text-dark-primary text-body-medium font-normal rounded-[20px] px-4 py-3 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3">
                    {message.content}
                  </div>
                  <div className="mt-1">
                    <IconUser className="size-6 text-foundation-text-light-primary/70 dark:text-foundation-text-dark-primary/70" />
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
                      className="p-1.5 rounded-lg hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-2 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary hover:text-foundation-icon-light-primary dark:hover:text-foundation-icon-dark-primary transition-colors"
                      title="Copy"
                    >
                      <IconCopy className={iconMd} />
                    </button>
                    <button
                      onClick={() => onMessageAction?.("edit", message)}
                      className="p-1.5 rounded-lg hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-2 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary hover:text-foundation-text-light-primary dark:hover:text-foundation-text-dark-primary transition-colors"
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
