import {
  IconChevronDownMd,
  IconMessaging,
  IconTerminal,
  IconUndo,
} from "../../../../icons/ChatGPTIcons";
import { SettingRow } from "../../../settings";

interface ChatBarSectionProps {
  positionOnScreen: string;
  resetToNewChat: string;
  keyboardShortcut: string;
  onChange: (key: string, value: string) => void;
}

/** ChatBarSection renders chat bar settings. */
export function ChatBarSection({
  positionOnScreen,
  resetToNewChat,
  keyboardShortcut,
  onChange,
}: ChatBarSectionProps) {
  return (
    <div className="mb-5">
      <h3 className="text-body-small font-semibold text-foundation-text-dark-primary mb-2">
        Chat bar
      </h3>
      <div className="space-y-0.5">
        <SettingRow
          icon={
            <IconMessaging className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
          }
          label="Position on screen"
          right={
            <div className="flex items-center gap-2">
              <span className="text-body-small font-normal text-foundation-text-dark-secondary">
                {positionOnScreen}
              </span>
              <div className="size-5 rounded-full bg-foundation-bg-dark-3 flex items-center justify-center">
                <IconChevronDownMd className="size-3 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
              </div>
            </div>
          }
        />

        <SettingRow
          icon={
            <IconUndo className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
          }
          label="Reset to new chat"
          right={
            <div className="flex items-center gap-2">
              <span className="text-body-small font-normal text-foundation-text-dark-secondary">
                {resetToNewChat}
              </span>
              <div className="size-5 rounded-full bg-foundation-bg-dark-3 flex items-center justify-center">
                <IconChevronDownMd className="size-3 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
              </div>
            </div>
          }
        />

        <SettingRow
          icon={
            <IconTerminal className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
          }
          label="Keyboard shortcut"
          right={
            <div className="flex items-center gap-2">
              <span className="text-body-small font-normal text-foundation-text-dark-secondary">
                {keyboardShortcut}
              </span>
              <button
                type="button"
                onClick={() => onChange("keyboardShortcut", "")}
                aria-label="Clear keyboard shortcut"
                title="Clear keyboard shortcut"
                className="p-1 hover:bg-foundation-bg-dark-3 rounded-full transition-colors"
              >
                <svg
                  className="size-3 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          }
        />

        <SettingRow
          icon={
            <IconMessaging className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
          }
          label="Open new chats"
          right={
            <div className="flex items-center gap-2">
              <span className="text-body-small font-normal text-foundation-text-dark-secondary">
                In Companion Chat
              </span>
              <div className="size-5 rounded-full bg-foundation-bg-dark-3 flex items-center justify-center">
                <IconChevronDownMd className="size-3 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}
