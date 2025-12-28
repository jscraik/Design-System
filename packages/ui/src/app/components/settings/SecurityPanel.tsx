import { useState } from "react";

import { IconChevronLeftMd } from "../icons/ChatGPTIcons";

import type { SettingsPanelProps } from "./types";

export function SecurityPanel({ onBack }: SettingsPanelProps) {
  const [mfaEnabled, setMfaEnabled] = useState(true);

  return (
    <>
      <div className="px-6 py-4 border-b border-foundation-text-dark-primary/10 flex items-center gap-3">
        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="size-3 rounded-full bg-foundation-accent-red hover:bg-foundation-accent-red/80 transition-colors"
            aria-label="Close"
          />
          <div className="size-3 rounded-full bg-foundation-accent-orange" />
          <div className="size-3 rounded-full bg-foundation-accent-green" />
        </div>
        <button
          onClick={onBack}
          className="p-1 hover:bg-foundation-bg-dark-3 rounded transition-colors"
        >
          <IconChevronLeftMd className="size-4 text-foundation-icon-dark-primary" />
        </button>
        <h2 className="text-[18px] font-semibold leading-[26px] tracking-[-0.45px] text-foundation-text-dark-primary">
          Security
        </h2>
      </div>

      <div className="overflow-y-auto max-h-[calc(85vh-80px)] px-6 py-4">
        {/* Multi-factor authentication */}
        <div>
          <div className="flex items-center justify-between px-3 py-2.5">
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-dark-primary">
              Multi-factor authentication
            </span>
            <button
              onClick={() => setMfaEnabled(!mfaEnabled)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${mfaEnabled ? "bg-foundation-accent-green" : "bg-foundation-bg-dark-3"}`}
            >
              <span
                className={`inline-block size-4 transform rounded-full bg-white transition-transform ${mfaEnabled ? "translate-x-[18px]" : "translate-x-0.5"}`}
              />
            </button>
          </div>
          <p className="text-[13px] leading-[18px] tracking-[-0.32px] text-foundation-text-dark-tertiary px-3 mt-1">
            You'll only be able to log in using Google while this is on.{" "}
            <button className="text-foundation-accent-blue hover:underline">Learn more</button>
          </p>
        </div>
      </div>
    </>
  );
}
