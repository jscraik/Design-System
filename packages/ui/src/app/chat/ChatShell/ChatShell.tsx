import type { ReactNode } from "react";

import { cn } from "../../../components/ui/utils";

/**
 * Slot content regions for the chat shell layout.
 */
export type ChatShellSlots = {
  sidebar?: ReactNode;
  header?: ReactNode;
  messages?: ReactNode;
  composer?: ReactNode;
  contextPanel?: ReactNode;
};

/**
 * Props for the chat shell layout.
 */
export interface ChatShellProps {
  slots: ChatShellSlots;
  className?: string;
  contentClassName?: string;
}

/**
 * Renders the chat shell layout with named slots.
 *
 * @param props - Chat shell props.
 * @returns A layout container that arranges slot regions.
 */
export function ChatShell({ slots, className, contentClassName }: ChatShellProps) {
  return (
    <div
      data-testid="chat-shell"
      className={cn("size-full flex bg-foundation-bg-dark-1 overflow-hidden", className)}
    >
      {slots.sidebar}
      <div className={cn("flex min-h-0 min-w-0 flex-1 flex-col", contentClassName)}>
        {slots.header}
        <div className="flex min-h-0 min-w-0 flex-1">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            {slots.messages}
            {slots.composer}
          </div>
          {slots.contextPanel}
        </div>
      </div>
    </div>
  );
}
