import { IconChevronLeftMd, IconChevronRightMd } from "./icons/ChatGPTIcons";
import type { SettingsPanelProps } from "./types";

// App icon component for desktop/system apps with consistent styling
function AppIcon({ name, color }: { name: string; color: string }) {
  return (
    <div
      className="size-5 rounded flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: color }}
    >
      <span className="text-white text-[11px] font-semibold">
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

export function ManageAppsPanel({ onBack }: SettingsPanelProps) {
  const connectedApps = [
    { name: "Notes", status: "Enabled via Accessibility", color: "#F9C74F" },
    { name: "Script Editor", status: "Enabled via Accessibility", color: "#6C757D" },
    { name: "Terminal", status: "Enabled via Accessibility", color: "#2D3436" },
    { name: "TextEdit", status: "Enabled via Accessibility", color: "#4A90E2" },
    { name: "Warp", status: "Enabled via Accessibility", color: "#01D3A7" },
    { name: "Xcode", status: "Enabled via Accessibility", color: "#147EFB" },
  ];

  const availableApps = [
    { name: "Code", status: "Requires extension", color: "#007ACC" },
    { name: "Code - Insiders", status: "Requires extension", color: "#1A9E5A" },
  ];

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
          Manage Apps
        </h2>
      </div>

      <div className="overflow-y-auto max-h-[calc(85vh-80px)] px-6 py-4">
        {/* Work with Apps section */}
        <div className="mb-6">
          <h3 className="text-[14px] font-semibold leading-[20px] tracking-[-0.3px] text-[var(--foundation-text-dark-primary)] mb-1">
            Work with Apps
          </h3>
          <p className="text-[13px] leading-[18px] tracking-[-0.32px] text-[var(--foundation-text-dark-tertiary)] mb-4">
            Allow ChatGPT to work with code and text editors.
          </p>

          {/* Connected apps */}
          <div className="mb-6">
            <h4 className="text-[13px] font-semibold leading-[18px] tracking-[-0.32px] text-[var(--foundation-text-dark-tertiary)] mb-2 px-3">
              Connected apps
            </h4>
            <div className="space-y-0.5">
              {connectedApps.map((app, index) => (
                <button
                  key={index}
                  className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-[var(--foundation-bg-dark-2)] rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <AppIcon name={app.name} color={app.color} />
                    <div className="text-left">
                      <div className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-[var(--foundation-text-dark-primary)]">
                        {app.name}
                      </div>
                      <div className="text-[12px] leading-[16px] tracking-[-0.24px] text-[var(--foundation-accent-green)]">
                        {app.status}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-[var(--foundation-text-dark-secondary)]">
                      Manage
                    </span>
                    <IconChevronRightMd className="size-4 text-[var(--foundation-icon-dark-tertiary)]" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Available to Connect */}
          <div>
            <h4 className="text-[13px] font-semibold leading-[18px] tracking-[-0.32px] text-[var(--foundation-text-dark-tertiary)] mb-2 px-3">
              Available to Connect
            </h4>
            <div className="space-y-0.5">
              {availableApps.map((app, index) => (
                <button
                  key={index}
                  className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-[var(--foundation-bg-dark-2)] rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <AppIcon name={app.name} color={app.color} />
                    <div className="text-left">
                      <div className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-[var(--foundation-text-dark-primary)]">
                        {app.name}
                      </div>
                      <div className="text-[12px] leading-[16px] tracking-[-0.24px] text-[var(--foundation-text-dark-tertiary)]">
                        {app.status}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-[var(--foundation-text-dark-secondary)]">
                      Install Extension
                    </span>
                    <IconChevronRightMd className="size-4 text-[var(--foundation-icon-dark-tertiary)]" />
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