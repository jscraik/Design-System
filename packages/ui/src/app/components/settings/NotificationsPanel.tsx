import { IconChevronLeftMd, IconChevronRightMd } from "../icons/ChatGPTIcons";

import type { SettingsPanelProps } from "./types";

export function NotificationsPanel({ onBack }: SettingsPanelProps) {
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
          Notifications
        </h2>
      </div>

      <div className="overflow-y-auto max-h-[calc(85vh-80px)] px-6 py-4">
        <div className="space-y-0.5">
          {/* Responses */}
          <button className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-foundation-bg-dark-2 rounded-lg transition-colors">
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-dark-primary">
              Responses
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-dark-secondary">
                Push
              </span>
              <IconChevronRightMd className="size-4 text-foundation-icon-dark-tertiary" />
            </div>
          </button>

          {/* Turn safety notifications */}
          <button className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-foundation-bg-dark-2 rounded-lg transition-colors">
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-dark-primary">
              Turn safety notifications
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-dark-secondary">
                Push, Email, SMS
              </span>
              <IconChevronRightMd className="size-4 text-foundation-icon-dark-tertiary" />
            </div>
          </button>

          {/* Group chats */}
          <button className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-foundation-bg-dark-2 rounded-lg transition-colors">
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-dark-primary">
              Group chats
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-dark-secondary">
                Push
              </span>
              <IconChevronRightMd className="size-4 text-foundation-icon-dark-tertiary" />
            </div>
          </button>

          {/* Pulse daily updates */}
          <button className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-foundation-bg-dark-2 rounded-lg transition-colors">
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-dark-primary">
              Pulse daily updates
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-dark-secondary">
                Push
              </span>
              <IconChevronRightMd className="size-4 text-foundation-icon-dark-tertiary" />
            </div>
          </button>

          {/* Pulse leaks */}
          <button className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-foundation-bg-dark-2 rounded-lg transition-colors">
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-dark-primary">
              Pulse leaks
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-dark-secondary">
                Push, Email
              </span>
              <IconChevronRightMd className="size-4 text-foundation-icon-dark-tertiary" />
            </div>
          </button>

          {/* Projects */}
          <button className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-foundation-bg-dark-2 rounded-lg transition-colors">
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-dark-primary">
              Projects
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-dark-secondary">
                Email
              </span>
              <IconChevronRightMd className="size-4 text-foundation-icon-dark-tertiary" />
            </div>
          </button>

          {/* Recommendations */}
          <button className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-foundation-bg-dark-2 rounded-lg transition-colors">
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-dark-primary">
              Recommendations
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-dark-secondary">
                Push, Email
              </span>
              <IconChevronRightMd className="size-4 text-foundation-icon-dark-tertiary" />
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
