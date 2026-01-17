// Barrel export file for all settings panels
export { PersonalizationPanel } from "./PersonalizationPanel";
export { NotificationsPanel } from "./NotificationsPanel";
export { AppsPanel } from "./AppsPanel";
export { DataControlsPanel } from "./DataControlsPanel";
export { ArchivedChatsPanel } from "./ArchivedChatsPanel";
export { SecurityPanel } from "./SecurityPanel";
export { ManageAppsPanel } from "./ManageAppsPanel";

// Reusable setting components
export { SettingRow } from "./SettingRow";
export { SettingToggle } from "./SettingToggle";
export { SettingDropdown } from "./SettingDropdown";

// Stub components for other panels - to be implemented
import { IconChevronLeftMd } from "./icons/ChatGPTIcons";
import type { SettingsPanelProps } from "./types";

export function CheckForUpdatesPanel({ onBack }: SettingsPanelProps) {
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
          Check for updates
        </h2>
      </div>
      <div className="overflow-y-auto max-h-[calc(85vh-80px)] px-6 py-4">
        <p className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-[var(--foundation-text-dark-primary)]">
          Your app is up to date.
        </p>
      </div>
    </>
  );
}

export function AudioSettingsPanel({ onBack }: SettingsPanelProps) {
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
          Audio settings
        </h2>
      </div>
      <div className="overflow-y-auto max-h-[calc(85vh-80px)] px-6 py-4">
        <p className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-[var(--foundation-text-dark-primary)]">
          Audio settings coming soon...
        </p>
      </div>
    </>
  );
}
