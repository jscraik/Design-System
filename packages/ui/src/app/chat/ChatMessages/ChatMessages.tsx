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
    content:
      "Hello! I'm ChatGPT 5.2 Pro. I'm here to help you with any questions or tasks you have. What would you like to work on today?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "2",
    role: "user",
    content:
      "Can you help me understand how to merge two different chat interfaces to create the best user experience?",
    timestamp: new Date(Date.now() - 1000 * 60 * 28),
  },
  {
    id: "3",
    role: "assistant",
    content: `Of course! When merging chat interfaces, you'll want to focus on a few key principles:

1. **Navigation & Organization**: Combine clear chat history with smart sidebar structure
2. **Input Experience**: Make the composer powerful yet effortless
3. **Visual Hierarchy**: Use spacing, typography, and contrast to guide focus
4. **Accessibility**: Ensure keyboard and screen reader support
5. **Performance**: Keep interactions responsive and smooth

Would you like me to elaborate on any of these points?`,
    timestamp: new Date(Date.now() - 1000 * 60 * 27),
  },
  {
    id: "4",
    role: "user",
    content: "Yes, can you explain more about the visual hierarchy?",
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
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
  const resolvedMessages = messages ?? sampleMessages;

  if (emptyState && resolvedMessages.length === 0) {
    return <div className="flex min-h-0 flex-1 flex-col bg-background">{emptyState}</div>;
  }

  return (
    <div className="bg-background">
      <div className="max-w-[62rem] mx-auto px-6 py-8 space-y-6">
        {resolvedMessages.map((message, index) => (
          <div key={message.id ?? index} className="group">
            {message.role === "assistant" ? (
              <div className="flex gap-3">
                <div className="mt-1">
                  <IconOpenAILogo className="size-6 text-foreground/80" />
                </div>
                <div className="flex flex-col gap-6">
                  <div className="text-body-medium font-normal text-foreground whitespace-pre-wrap">
                    {message.content}
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="p-1.5 hover:bg-secondary rounded-md transition-colors text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary hover:text-foundation-icon-light-primary dark:hover:text-foundation-icon-dark-primary"
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
                      <IconCopy className="size-5" />
                    </button>
                    <button
                      className="p-1.5 hover:bg-secondary rounded-md transition-colors text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary hover:text-foundation-icon-light-primary dark:hover:text-foundation-icon-dark-primary"
                      title="Good response"
                      onClick={() => onMessageAction?.("thumbs-up", message)}
                    >
                      <IconThumbUp className="size-5" />
                    </button>
                    <button
                      className="p-1.5 hover:bg-secondary rounded-md transition-colors text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary hover:text-foundation-icon-light-primary dark:hover:text-foundation-icon-dark-primary"
                      title="Bad response"
                      onClick={() => onMessageAction?.("thumbs-down", message)}
                    >
                      <IconThumbDown className="size-5" />
                    </button>
                    <button
                      className="p-1.5 hover:bg-secondary rounded-md transition-colors text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary hover:text-foundation-icon-light-primary dark:hover:text-foundation-icon-dark-primary"
                      title="Share"
                      onClick={() => onMessageAction?.("share", message)}
                    >
                      <IconShare className="size-5" />
                    </button>
                    <button
                      className="p-1.5 hover:bg-secondary rounded-md transition-colors text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary hover:text-foundation-icon-light-primary dark:hover:text-foundation-icon-dark-primary"
                      title="Regenerate"
                      onClick={() => onMessageAction?.("regenerate", message)}
                    >
                      <IconRegenerate className="size-5" />
                    </button>
                    <button
                      className="p-1.5 hover:bg-secondary rounded-md transition-colors text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary hover:text-foundation-icon-light-primary dark:hover:text-foundation-icon-dark-primary"
                      title="More"
                      onClick={() => onMessageAction?.("more", message)}
                    >
                      <IconDotsHorizontal className="size-5" />
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
                    <IconUser className="size-6 text-foreground/70" />
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
                      className="p-1.5 rounded-lg hover:bg-secondary text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary hover:text-foundation-icon-light-primary dark:hover:text-foundation-icon-dark-primary transition-colors"
                      title="Copy"
                    >
                      <IconCopy className="size-4" />
                    </button>
                    <button
                      onClick={() => onMessageAction?.("edit", message)}
                      className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                      title="Edit"
                    >
                      <IconEdit className="size-4" />
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
