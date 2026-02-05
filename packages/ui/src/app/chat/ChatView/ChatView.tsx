import { useEffect, useRef, useState } from "react";

import { IconArrowDownMd } from "../../../icons";
import { ChatInput } from "../ChatInput";
import type { ChatMessage, ChatMessageAction } from "../ChatMessages";
import { ChatMessages } from "../ChatMessages";
import type { ModelConfig } from "../ChatUIRoot";

/**
 * Props for the composed chat view.
 */
interface ChatViewProps {
  selectedModel: ModelConfig;
  composerLeft?: React.ReactNode;
  composerRight?: React.ReactNode;
  emptyState?: React.ReactNode;
  messages?: ChatMessage[];
  onMessageAction?: (action: ChatMessageAction, message: ChatMessage) => void;
}

/**
 * Renders the full chat view with message list and composer.
 *
 * @param props - Chat view props.
 * @returns A chat view layout container.
 */
export function ChatView({
  selectedModel,
  composerLeft,
  composerRight,
  emptyState,
  messages,
  onMessageAction,
}: ChatViewProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100;

    setShowScrollButton(!isNearBottom);
  };

  const scrollToBottom = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    checkScrollPosition();
    container.addEventListener("scroll", checkScrollPosition);

    return () => {
      container.removeEventListener("scroll", checkScrollPosition);
    };
  }, [checkScrollPosition]);

  return (
    <div className="flex-1 flex flex-col relative h-full overflow-hidden">
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto pb-[180px]">
        <ChatMessages
          emptyState={emptyState}
          messages={messages}
          onMessageAction={onMessageAction}
        />
      </div>

      {showScrollButton && (
        <button
          type="button"
          onClick={scrollToBottom}
          aria-label="Scroll to bottom"
          title="Scroll to bottom"
          className="absolute bottom-[200px] left-1/2 -translate-x-1/2 z-10 flex items-center justify-center size-10 bg-secondary dark:bg-secondary hover:bg-secondary/80 dark:hover:bg-secondary/80 border border-muted dark:border-muted rounded-full shadow-lg transition-all duration-200 ease-out hover:scale-110"
        >
          <IconArrowDownMd className="size-5 text-foreground dark:text-foreground" />
        </button>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-background dark:bg-background">
        <ChatInput
          selectedModel={selectedModel}
          composerLeft={composerLeft}
          composerRight={composerRight}
        />
      </div>
    </div>
  );
}
