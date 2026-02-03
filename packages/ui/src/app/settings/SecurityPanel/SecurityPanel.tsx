import { useState } from "react";

import { IconChevronLeftMd } from "../../../icons/ChatGPTIcons";
import { SettingToggle } from "../SettingToggle";
import type { SettingsPanelProps } from "../shared/types";

export function SecurityPanel({ onBack }: SettingsPanelProps) {
  const [mfaEnabled, setMfaEnabled] = useState(true);

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
          aria-label="Back to settings"
        >
          <IconChevronLeftMd className="size-4 text-foreground" />
        </button>
        <h2 className="text-[18px] font-semibold leading-[26px] tracking-[-0.45px] text-foreground">
          Security
        </h2>
      </div>

      <div className="overflow-y-auto max-h-[calc(85vh-80px)] px-6 py-4">
        {/* Multi-factor authentication */}
        <div>
          <SettingToggle
            label="Multi-factor authentication"
            checked={mfaEnabled}
            onCheckedChange={setMfaEnabled}
          />
          <p className="text-[13px] leading-[18px] tracking-[-0.32px] text-muted-foreground px-3 mt-1">
            You'll only be able to log in using Google while this is on.{" "}
            <button type="button" className="text-accent-blue hover:underline">
              Learn more
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
