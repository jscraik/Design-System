import type { ReactNode } from "react";
import { createContext, useContext } from "react";

export type ChatUISlots = {
  sidebarFooter?: ReactNode;
};

const ChatUISlotsContext = createContext<ChatUISlots | null>(null);

export function ChatUISlotsProvider({
  value,
  children,
}: {
  value: ChatUISlots;
  children: ReactNode;
}) {
  return (
    <ChatUISlotsContext.Provider value={value}>
      {children}
    </ChatUISlotsContext.Provider>
  );
}

export function useChatUISlots(): ChatUISlots {
  return useContext(ChatUISlotsContext) ?? {};
}
