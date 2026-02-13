import { ChatInput } from "../../app/chat/ChatInput";
import { sampleModels } from "../../fixtures/sample-data";

/**
 * Render the chat input template with sample data.
 * @returns The chat input template element.
 */
export function ChatInputTemplate() {
  return (
    <div className="min-h-[140px] bg-background">
      <ChatInput selectedModel={sampleModels[0]} />
    </div>
  );
}
