import { IconChevronLeftMd, IconChevronRightMd } from "../icons/ChatGPTIcons";

import type { SettingsPanelProps } from "./types";

export function ManageAppsPanel({ onBack }: SettingsPanelProps) {
  const connectedApps = [
    { name: "Notes", status: "Enabled via Accessibility", icon: "📝" },
    { name: "Script Editor", status: "Enabled via Accessibility", icon: "📜" },
    { name: "Terminal", status: "Enabled via Accessibility", icon: "⌨️" },
    { name: "TextEdit", status: "Enabled via Accessibility", icon: "📄" },
    { name: "Warp", status: "Enabled via Accessibility", icon: "🔷" },
    { name: "Xcode", status: "Enabled via Accessibility", icon: "🔨" },
  ];

  const availableApps = [
    { name: "Code", status: "Requires extension", icon: "💻" },
    { name: "Code - Insiders", status: "Requires extension", icon: "💻" },
  ];

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
          Manage Apps
        </h2>
      </div>

      <div className="overflow-y-auto max-h-[calc(85vh-80px)] px-6 py-4">
        {/* Work with Apps section */}
        <div className="mb-6">
          <h3 className="text-[14px] font-semibold leading-[20px] tracking-[-0.3px] text-foundation-text-dark-primary mb-1">
            Work with Apps
          </h3>
          <p className="text-[13px] leading-[18px] tracking-[-0.32px] text-foundation-text-dark-tertiary mb-4">
            Allow ChatGPT to work with code and text editors.
          </p>

          {/* Connected apps */}
          <div className="mb-6">
            <h4 className="text-[13px] font-semibold leading-[18px] tracking-[-0.32px] text-foundation-text-dark-tertiary mb-2 px-3">
              Connected apps
            </h4>
            <div className="space-y-0.5">
              {connectedApps.map((app) => (
                <button type="button"
                  key={app.name}
                  className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-foundation-bg-dark-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[18px]">{app.icon}</span>
                    <div className="text-left">
                      <div className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-dark-primary">
                        {app.name}
                      </div>
                      <div className="text-[12px] leading-[16px] tracking-[-0.24px] text-foundation-accent-green">
                        {app.status}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-dark-secondary">
                      Manage
                    </span>
                    <IconChevronRightMd className="size-4 text-foundation-icon-dark-tertiary" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Available to Connect */}
          <div>
            <h4 className="text-[13px] font-semibold leading-[18px] tracking-[-0.32px] text-foundation-text-dark-tertiary mb-2 px-3">
              Available to Connect
            </h4>
            <div className="space-y-0.5">
              {availableApps.map((app) => (
                <button type="button"
                  key={app.name}
                  className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-foundation-bg-dark-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[18px]">{app.icon}</span>
                    <div className="text-left">
                      <div className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-dark-primary">
                        {app.name}
                      </div>
                      <div className="text-[12px] leading-[16px] tracking-[-0.24px] text-foundation-text-dark-tertiary">
                        {app.status}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-dark-secondary">
                      Install Extension
                    </span>
                    <IconChevronRightMd className="size-4 text-foundation-icon-dark-tertiary" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
