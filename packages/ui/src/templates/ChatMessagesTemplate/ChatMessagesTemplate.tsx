import { sampleMessages } from "../../fixtures/sample-data";
import { ChatMessagesBlock } from "../blocks/ChatMessagesBlock";

/**
 * Render the chat messages template with sample data.
 * @returns The chat messages template element.
 */
export function ChatMessagesTemplate() {
  return (
    <div className="min-h-[520px] bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1">
      <ChatMessagesBlock messages={sampleMessages} />
    </div>
  );
}
