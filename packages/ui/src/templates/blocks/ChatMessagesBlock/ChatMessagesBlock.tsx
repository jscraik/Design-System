import type { ComponentProps } from "react";

import { ChatMessages } from "../../../app/chat/ChatMessages";

/** Props for ChatMessagesBlock, forwarded to ChatMessages. */
export type ChatMessagesBlockProps = ComponentProps<typeof ChatMessages>;

/**
 * Render the chat messages block wrapper.
 * @param props - Chat messages props.
 * @returns The chat messages block element.
 */
export function ChatMessagesBlock(props: ChatMessagesBlockProps) {
  return <ChatMessages {...props} />;
}
