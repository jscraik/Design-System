import type { ReactNode } from "react";
import { createContext, useContext } from "react";

/**
 * Slot content overrides for the chat UI shell.
 */
export type ChatUISlots = {
  sidebarFooter?: ReactNode;
};

const ChatUISlotsContext = createContext<ChatUISlots | null>(null);

/**
 * Provides slot overrides for the chat UI.
 *
 * @param props - Slot provider props.
 * @returns Slot provider element.
 */
export function ChatUISlotsProvider({
  value,
  children,
}: {
  value: ChatUISlots;
  children: ReactNode;
}) {
  return <ChatUISlotsContext.Provider value={value}>{children}</ChatUISlotsContext.Provider>;
}

/**
 * Returns the current slot overrides.
 *
 * @returns Slot overrides (empty object when unset).
 */
export function useChatUISlots(): ChatUISlots {
  return useContext(ChatUISlotsContext) ?? {};
}
