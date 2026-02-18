import { IconChevronLeftMd, IconChevronRightMd } from "../../../icons/ChatGPTIcons";
import type { SettingsPanelProps } from "../shared/types";

export function NotificationsPanel({ onBack }: SettingsPanelProps) {
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
        <h2 className="text-[18px] font-semibold leading-[26px] tracking-[-0.45px] text-foreground">
          Notifications
        </h2>
      </div>

      <div className="overflow-y-auto max-h-[calc(85vh-80px)] px-6 py-4">
        <div className="space-y-0.5">
          {/* Responses */}
          <button
            type="button"
            className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-secondary rounded-lg transition-colors"
          >
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foreground">
              Responses
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-text-secondary">
                Push
              </span>
              <IconChevronRightMd className="size-4 text-muted-foreground" />
            </div>
          </button>

          {/* Turn safety notifications */}
          <button
            type="button"
            className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-secondary rounded-lg transition-colors"
          >
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foreground">
              Turn safety notifications
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-text-secondary">
                Push, Email, SMS
              </span>
              <IconChevronRightMd className="size-4 text-muted-foreground" />
            </div>
          </button>

          {/* Group chats */}
          <button
            type="button"
            className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-secondary rounded-lg transition-colors"
          >
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foreground">
              Group chats
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-text-secondary">
                Push
              </span>
              <IconChevronRightMd className="size-4 text-muted-foreground" />
            </div>
          </button>

          {/* Pulse daily updates */}
          <button
            type="button"
            className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-secondary rounded-lg transition-colors"
          >
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foreground">
              Pulse daily updates
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-text-secondary">
                Push
              </span>
              <IconChevronRightMd className="size-4 text-muted-foreground" />
            </div>
          </button>

          {/* Pulse leaks */}
          <button
            type="button"
            className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-secondary rounded-lg transition-colors"
          >
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foreground">
              Pulse leaks
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-text-secondary">
                Push, Email
              </span>
              <IconChevronRightMd className="size-4 text-muted-foreground" />
            </div>
          </button>

          {/* Projects */}
          <button
            type="button"
            className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-secondary rounded-lg transition-colors"
          >
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foreground">
              Projects
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-text-secondary">
                Email
              </span>
              <IconChevronRightMd className="size-4 text-muted-foreground" />
            </div>
          </button>

          {/* Recommendations */}
          <button
            type="button"
            className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-secondary rounded-lg transition-colors"
          >
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foreground">
              Recommendations
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-text-secondary">
                Push, Email
              </span>
              <IconChevronRightMd className="size-4 text-muted-foreground" />
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
