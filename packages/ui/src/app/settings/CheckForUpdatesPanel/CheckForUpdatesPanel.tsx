import { IconChevronLeftMd } from "../../../icons/ChatGPTIcons";
import type { SettingsPanelProps } from "../shared/types";

export function CheckForUpdatesPanel({ onBack }: SettingsPanelProps) {
  return (
    <>
      <div className="px-6 py-4 border-b border-foreground/10 flex items-center gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onBack}
            className="size-3 rounded-full bg-status-error hover:bg-status-error/80 transition-colors"
            aria-label="Close"
          />
          <div className="size-3 rounded-full bg-accent-orange" />
          <div className="size-3 rounded-full bg-accent-green" />
        </div>
        <button
          type="button"
          onClick={onBack}
          className="p-1 hover:bg-muted rounded transition-colors"
        >
          <IconChevronLeftMd className="size-4 text-foreground" />
        </button>
        <h2 className="text-heading-3 font-semibold   text-foreground">Check for Updates</h2>
      </div>

      <div className="overflow-y-auto max-h-[calc(85vh-80px)] px-6 py-4">
        <p className="text-body-small text-text-secondary">
          Update checking functionality will be implemented here.
        </p>
      </div>
    </>
  );
}
