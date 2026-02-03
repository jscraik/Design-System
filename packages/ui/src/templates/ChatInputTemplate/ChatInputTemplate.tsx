import { sampleModels } from "../../fixtures/sample-data";
import { ChatInputBlock } from "../blocks/ChatInputBlock";

/**
 * Render the chat input template with sample data.
 * @returns The chat input template element.
 */
export function ChatInputTemplate() {
  return (
    <div className="min-h-[140px] bg-background">
      <ChatInputBlock selectedModel={sampleModels[0]} />
    </div>
  );
}
