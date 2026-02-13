import type { ComponentProps } from "react";

import { ChatHeader } from "../../../app/chat/ChatHeader";

/** Props for ChatHeaderBlock, forwarded to ChatHeader. */
export type ChatHeaderBlockProps = ComponentProps<typeof ChatHeader>;

/**
 * Render the chat header block wrapper.
 * @param props - Chat header props.
 * @returns The chat header block element.
 */
export function ChatHeaderBlock(props: ChatHeaderBlockProps) {
  return <ChatHeader {...props} />;
}
