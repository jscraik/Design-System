import { useState } from "react";

import { IconChevronLeftMd } from "./icons/ChatGPTIcons";
import { SettingToggle } from "./SettingToggle";
import { SettingRow } from "./SettingRow";
import type { SettingsPanelProps } from "./types";

export function DataControlsPanel({ onBack }: SettingsPanelProps) {
  const [improveModel, setImproveModel] = useState(true);
  const [includeAudioRecordings, setIncludeAudioRecordings] = useState(true);
  const [includeVideoRecordings, setIncludeVideoRecordings] = useState(true);

  return (
    <>
      <div className="px-6 py-4 border-b border-[var(--foundation-text-dark-primary)]/10 flex items-center gap-3">
        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="size-3 rounded-full bg-[var(--foundation-accent-red)] hover:bg-[var(--foundation-accent-red)]/80 transition-colors"
            aria-label="Close"
          />
          <div className="size-3 rounded-full bg-[var(--foundation-accent-orange)]" />
          <div className="size-3 rounded-full bg-[var(--foundation-accent-green)]" />
        </div>
        <button
          onClick={onBack}
          className="p-1 hover:bg-[var(--foundation-bg-dark-3)] rounded transition-colors"
        >
          <IconChevronLeftMd className="size-4 text-[var(--foundation-icon-dark-primary)]" />
        </button>
        <h2 className="text-[18px] font-semibold leading-[26px] tracking-[-0.45px] text-[var(--foundation-text-dark-primary)]">
          Data controls
        </h2>
      </div>

      <div className="overflow-y-auto max-h-[calc(85vh-80px)] px-6 py-4">
        {/* Improve the model for everyone */}
        <div className="mb-6">
          <SettingToggle
            label="Improve the model for everyone"
            checked={improveModel}
            onCheckedChange={setImproveModel}
          />
          <p className="text-[13px] leading-[18px] tracking-[-0.32px] text-[var(--foundation-text-dark-tertiary)] px-3 mt-1">
            Allow your content to be used to train our models, which makes ChatGPT better for you
            and everyone who uses it. We take steps to protect your privacy.{" "}
            <button className="text-[var(--foundation-accent-blue)] hover:underline">
              Learn more
            </button>
          </p>
        </div>

        {/* Voice mode section */}
        <div className="mb-6">
          <h3 className="text-[14px] font-semibold leading-[20px] tracking-[-0.3px] text-[var(--foundation-text-dark-primary)] mb-2 px-3">
            Voice mode
          </h3>

          {/* Include audio recordings */}
          <div className="mb-3">
            <SettingToggle
              label="Include audio recordings"
              checked={includeAudioRecordings}
              onCheckedChange={setIncludeAudioRecordings}
            />
          </div>

          {/* Include video recordings */}
          <div className="mb-3">
            <SettingToggle
              label="Include video recordings"
              checked={includeVideoRecordings}
              onCheckedChange={setIncludeVideoRecordings}
            />
            <p className="text-[13px] leading-[18px] tracking-[-0.32px] text-[var(--foundation-text-dark-tertiary)] px-3 mt-1">
              Include your audio or video recordings from Voice Mode to train our models.
              Transcripts and other data are covered by "Improve the model for everyone".{" "}
              <button className="text-[var(--foundation-accent-blue)] hover:underline">
                Learn more
              </button>
            </p>
          </div>
        </div>

        {/* Archive all chats */}
        <SettingRow
          label="Archive all chats"
          right={
            <button className="px-3 py-1.5 text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-[var(--foundation-text-dark-primary)] bg-[var(--foundation-bg-dark-3)] hover:bg-[var(--foundation-bg-dark-3)]/80 rounded-md transition-colors">
              Archive
            </button>
          }
          className="mb-3"
        />

        {/* Delete all chats */}
        <SettingRow
          label="Delete all chats"
          right={
            <button className="px-3 py-1.5 text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white bg-[var(--foundation-accent-red)] hover:bg-[var(--foundation-accent-red)]/80 rounded-md transition-colors">
              Delete all
            </button>
          }
          className="mb-3"
        />

        {/* Export data */}
        <SettingRow
          label="Export data"
          right={
            <button className="px-3 py-1.5 text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-[var(--foundation-text-dark-primary)] bg-[var(--foundation-bg-dark-3)] hover:bg-[var(--foundation-bg-dark-3)]/80 rounded-md transition-colors">
              Export
            </button>
          }
          className="mb-6"
        />

        {/* Delete account */}
        <div className="px-3">
          <button className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-[var(--foundation-accent-red)] hover:underline">
            Delete account
          </button>
        </div>
      </div>
    </>
  );
}
