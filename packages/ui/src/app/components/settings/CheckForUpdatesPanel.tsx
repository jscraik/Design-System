import { IconChevronLeftMd } from "../icons/ChatGPTIcons";

import type { SettingsPanelProps } from "./types";

export function CheckForUpdatesPanel({ onBack }: SettingsPanelProps) {
  return (
    <>
      <div className="px-6 py-4 border-b border-foundation-text-dark-primary/10 flex items-center gap-3">
        <div className="flex gap-2">
          <button type="button"
            onClick={onBack}
            className="size-3 rounded-full bg-foundation-accent-red hover:bg-foundation-accent-red/80 transition-colors"
            aria-label="Close"
          />
          <div className="size-3 rounded-full bg-foundation-accent-orange" />
          <div className="size-3 rounded-full bg-foundation-accent-green" />
        </div>
        <button type="button"
          onClick={onBack}
          className="p-1 hover:bg-foundation-bg-dark-3 rounded transition-colors"
        >
          <IconChevronLeftMd className="size-4 text-foundation-icon-dark-primary" />
        </button>
        <h2 className="text-[18px] font-semibold leading-[26px] tracking-[-0.45px] text-foundation-text-dark-primary">
          Check for Updates
        </h2>
      </div>

      <div className="overflow-y-auto max-h-[calc(85vh-80px)] px-6 py-4">
        <p className="text-[14px] text-foundation-text-dark-secondary">
          Update checking functionality will be implemented here.
        </p>
      </div>
    </>
  );
}
