/**
 * Props for the chat history list.
 */
interface ChatSidebarHistoryProps {
  chatHistory: string[];
  searchQuery: string;
  selectedId?: string | null;
  onSelect?: (chatId: string) => void;
}

/**
 * Renders the recent chat history list with filtering.
 *
 * @param props - Chat history props.
 * @returns A history list element.
 */
export function ChatSidebarHistory({
  chatHistory,
  searchQuery,
  selectedId,
  onSelect,
}: ChatSidebarHistoryProps) {
  const filteredHistory = chatHistory.filter((chat) =>
    chat.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
      <div className="px-3 pb-2 text-[11px] text-muted-foreground font-medium tracking-wide uppercase">
        Recent
      </div>
      {filteredHistory.map((item, index) => {
        const chatId = `chat-${index}`;
        const isSelected = selectedId === chatId;
        return (
        <button
          key={chatId}
          onClick={() => onSelect?.(chatId)}
          className={`w-full text-left px-3 py-2 text-body-small rounded-lg transition-colors line-clamp-1 font-normal ${
            isSelected
              ? "bg-muted text-foreground"
              : "text-text-secondary hover:bg-muted hover:text-foreground"
          }`}
        >
          {item}
        </button>
      );
      })}
    </div>
  );
}
