import { useState } from "react";

import {
  sampleCategories,
  sampleCategoryColors,
  sampleCategoryIconColors,
  sampleCategoryIcons,
  sampleChatHistory,
  sampleGroupChats,
  sampleProjects,
  sampleUser,
} from "../../fixtures/sample-data";
import { ChatSidebarBlock } from "../blocks/ChatSidebarBlock";

/**
 * Render the chat sidebar template with sample data.
 * @returns The chat sidebar template element.
 */
export function ChatSidebarTemplate() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-[640px] bg-background">
      <ChatSidebarBlock
        isOpen={isOpen}
        onToggle={() => setIsOpen((prev) => !prev)}
        projects={sampleProjects}
        chatHistory={sampleChatHistory}
        groupChats={sampleGroupChats}
        categories={sampleCategories}
        categoryIcons={sampleCategoryIcons}
        categoryColors={sampleCategoryColors}
        categoryIconColors={sampleCategoryIconColors}
        user={sampleUser}
      />
    </div>
  );
}
