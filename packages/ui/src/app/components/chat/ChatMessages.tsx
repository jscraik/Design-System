import { IconOpenAILogo, IconUser } from "../icons/ChatGPTIcons";
import { MessageActions } from "../ui/chat/message-actions";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatMessagesProps {
  emptyState?: React.ReactNode;
  messages?: ChatMessage[];
}

export function ChatMessages({ emptyState, messages }: ChatMessagesProps) {
  const resolvedMessages = messages ?? [];

  if (emptyState && resolvedMessages.length === 0) {
    return (
      <div className="bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1">{emptyState}</div>
    );
  }

  return (
    <div className="bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {resolvedMessages.map((message) => (
          <div key={message.id} className="group">
            {message.role === "assistant" ? (
              <div className="flex gap-3">
                <div className="flex items-start justify-center size-8 rounded-full bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary">
                  <IconOpenAILogo className="size-4" />
                </div>
                <div className="flex-1 flex flex-col gap-3">
                  <div className="font-foundation text-body leading-body tracking-body text-foundation-text-light-primary dark:text-foundation-text-dark-primary whitespace-pre-wrap">
                    {message.content}
                  </div>
                  <MessageActions
                    messageId={message.id}
                    onCopy={() => navigator.clipboard.writeText(message.content)}
                    onThumbsUp={() => console.log("Thumbs up:", message.id)}
                    onThumbsDown={() => console.log("Thumbs down:", message.id)}
                    onShare={() => console.log("Share:", message.id)}
                    onRegenerate={() => console.log("Regenerate:", message.id)}
                    onMore={() => console.log("More options:", message.id)}
                  />
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <div className="flex items-start gap-2 max-w-[70%]">
                  <div className="bg-foundation-accent-green text-foundation-text-light-primary dark:text-foundation-text-dark-primary font-foundation text-body leading-body tracking-body rounded-[20px] px-4 py-3">
                    {message.content}
                  </div>
                  <div className="flex items-center justify-center size-8 rounded-full bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary">
                    <IconUser className="size-4" />
                  </div>
                  <MessageActions
                    messageId={message.id}
                    onCopy={() => navigator.clipboard.writeText(message.content)}
                    actions={["copy"]}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
