import type { ComponentProps } from "react";

import { ChatInput } from "../../../app/chat/ChatInput";

/** Props for ChatInputBlock, forwarded to ChatInput. */
export type ChatInputBlockProps = ComponentProps<typeof ChatInput>;

/**
 * Render the chat input block wrapper.
 * @param props - Chat input props.
 * @returns The chat input block element.
 */
export function ChatInputBlock(props: ChatInputBlockProps) {
  return <ChatInput {...props} />;
}
