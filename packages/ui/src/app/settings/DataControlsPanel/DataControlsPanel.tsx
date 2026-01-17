import { useId, useState } from "react";

import { IconChevronLeftMd } from "../../../icons/ChatGPTIcons";
import type { SettingsPanelProps } from "../shared/types";

export function DataControlsPanel({ onBack }: SettingsPanelProps) {
  const [improveModel, setImproveModel] = useState(true);
  const [includeAudioRecordings, setIncludeAudioRecordings] = useState(true);
  const [includeVideoRecordings, setIncludeVideoRecordings] = useState(true);
  const improveModelId = useId();
  const includeAudioId = useId();
  const includeVideoId = useId();

  return (
    <>
      <div className="px-6 py-4 border-b border-foundation-text-dark-primary/10 flex items-center gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onBack}
            className="size-3 rounded-full bg-foundation-accent-red hover:bg-foundation-accent-red/80 transition-colors"
            aria-label="Close"
          />
          <div className="size-3 rounded-full bg-foundation-accent-orange" />
          <div className="size-3 rounded-full bg-foundation-accent-green" />
        </div>
        <button
          type="button"
          onClick={onBack}
          className="p-1 hover:bg-foundation-bg-dark-3 rounded transition-colors"
          aria-label="Back to settings"
        >
          <IconChevronLeftMd className="size-4 text-foundation-icon-dark-primary" />
        </button>
        <h2 className="text-[18px] font-semibold leading-[26px] tracking-[-0.45px] text-foundation-text-dark-primary">
          Data controls
        </h2>
      </div>

      <div className="overflow-y-auto max-h-[calc(85vh-80px)] px-6 py-4">
        {/* Improve the model for everyone */}
        <div className="mb-6">
          <div className="flex items-center justify-between px-3 py-2.5">
            <span
              id={improveModelId}
              className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-dark-primary"
            >
              Improve the model for everyone
            </span>
            <button
              type="button"
              onClick={() => setImproveModel(!improveModel)}
              role="switch"
              aria-checked={improveModel}
              aria-labelledby={improveModelId}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${improveModel ? "bg-foundation-accent-green" : "bg-foundation-bg-dark-3"}`}
            >
              <span
                className={`inline-block size-4 transform rounded-full bg-foundation-bg-light-1 transition-transform ${improveModel ? "translate-x-[18px]" : "translate-x-0.5"}`}
              />
            </button>
          </div>
          <p className="text-[13px] leading-[18px] tracking-[-0.32px] text-foundation-text-dark-tertiary px-3 mt-1">
            Allow your content to be used to train our models, which makes ChatGPT better for you
            and everyone who uses it. We take steps to protect your privacy.{" "}
            <button type="button" className="text-foundation-accent-blue hover:underline">
              Learn more
            </button>
          </p>
        </div>

        {/* Voice mode section */}
        <div className="mb-6">
          <h3 className="text-[14px] font-semibold leading-[20px] tracking-[-0.3px] text-foundation-text-dark-primary mb-2 px-3">
            Voice mode
          </h3>

          {/* Include audio recordings */}
          <div className="mb-3">
            <div className="flex items-center justify-between px-3 py-2.5">
              <span
                id={includeAudioId}
                className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-dark-primary"
              >
                Include audio recordings
              </span>
              <button
                type="button"
                onClick={() => setIncludeAudioRecordings(!includeAudioRecordings)}
                role="switch"
                aria-checked={includeAudioRecordings}
                aria-labelledby={includeAudioId}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${includeAudioRecordings ? "bg-foundation-accent-green" : "bg-foundation-bg-dark-3"}`}
              >
                <span
                  className={`inline-block size-4 transform rounded-full bg-foundation-bg-light-1 transition-transform ${includeAudioRecordings ? "translate-x-[18px]" : "translate-x-0.5"}`}
                />
              </button>
            </div>
          </div>

          {/* Include video recordings */}
          <div className="mb-3">
            <div className="flex items-center justify-between px-3 py-2.5">
              <span
                id={includeVideoId}
                className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-dark-primary"
              >
                Include video recordings
              </span>
              <button
                type="button"
                onClick={() => setIncludeVideoRecordings(!includeVideoRecordings)}
                role="switch"
                aria-checked={includeVideoRecordings}
                aria-labelledby={includeVideoId}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${includeVideoRecordings ? "bg-foundation-accent-green" : "bg-foundation-bg-dark-3"}`}
              >
                <span
                  className={`inline-block size-4 transform rounded-full bg-foundation-bg-light-1 transition-transform ${includeVideoRecordings ? "translate-x-[18px]" : "translate-x-0.5"}`}
                />
              </button>
            </div>
            <p className="text-[13px] leading-[18px] tracking-[-0.32px] text-foundation-text-dark-tertiary px-3 mt-1">
              Include your audio or video recordings from Voice Mode to train our models.
              Transcripts and other data are covered by "Improve the model for everyone".{" "}
              <button type="button" className="text-foundation-accent-blue hover:underline">
                Learn more
              </button>
            </p>
          </div>
        </div>

        {/* Archive all chats */}
        <div className="mb-3">
          <div className="flex items-center justify-between px-3 py-2.5">
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-dark-primary">
              Archive all chats
            </span>
            <button
              type="button"
              className="px-3 py-1.5 text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-dark-primary bg-foundation-bg-dark-3 hover:bg-foundation-bg-dark-3/80 rounded-md transition-colors"
            >
              Archive
            </button>
          </div>
        </div>

        {/* Delete all chats */}
        <div className="mb-3">
          <div className="flex items-center justify-between px-3 py-2.5">
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-dark-primary">
              Delete all chats
            </span>
            <button
              type="button"
              className="px-3 py-1.5 text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white bg-foundation-accent-red hover:bg-foundation-accent-red/80 rounded-md transition-colors"
            >
              Delete all
            </button>
          </div>
        </div>

        {/* Export data */}
        <div className="mb-6">
          <div className="flex items-center justify-between px-3 py-2.5">
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-dark-primary">
              Export data
            </span>
            <button
              type="button"
              className="px-3 py-1.5 text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-dark-primary bg-foundation-bg-dark-3 hover:bg-foundation-bg-dark-3/80 rounded-md transition-colors"
            >
              Export
            </button>
          </div>
        </div>

        {/* Delete account */}
        <div className="px-3">
          <button
            type="button"
            className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-accent-red hover:underline"
          >
            Delete account
          </button>
        </div>
      </div>
    </>
  );
}
