import type { ComponentProps } from "react";

import { ChatSidebar } from "../../../app/chat/ChatSidebar";

/** Props for ChatSidebarBlock, forwarded to ChatSidebar. */
export type ChatSidebarBlockProps = ComponentProps<typeof ChatSidebar>;

/**
 * Render the chat sidebar block wrapper.
 * @param props - Chat sidebar props.
 * @returns The chat sidebar block element.
 */
export function ChatSidebarBlock(props: ChatSidebarBlockProps) {
  return <ChatSidebar {...props} />;
}
