import { useChatUISlots } from "../../../shared/slots";

/**
 * Renders the optional sidebar footer slot content.
 *
 * @returns Footer slot content or `null` when unset.
 */
export function ChatSidebarFooterSlot() {
  const { sidebarFooter } = useChatUISlots();

  if (!sidebarFooter) {
    return null;
  }

  return <div className="border-t border-border">{sidebarFooter}</div>;
}
