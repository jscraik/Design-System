import type { ReactNode } from "react";

import { IconChevronLeftMd } from "../../../icons/ChatGPTIcons";

export interface SettingsPanelShellProps {
  title: string;
  onBack: () => void;
  children: ReactNode;
}

export function SettingsPanelShell({ title, onBack, children }: SettingsPanelShellProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-border/60 flex items-center gap-3 border-b px-6 py-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onBack}
            className="size-3 rounded-full bg-status-error transition-colors hover:bg-status-error/80"
            aria-label="Close"
          />
          <div className="size-3 rounded-full bg-accent-orange" />
          <div className="size-3 rounded-full bg-accent-green" />
        </div>
        <button
          type="button"
          onClick={onBack}
          className="rounded-md p-1 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Back to settings"
        >
          <IconChevronLeftMd className="size-4 text-foreground" />
        </button>
        <h2 className="text-card-title text-foreground text-balance">{title}</h2>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">{children}</div>
    </div>
  );
}
