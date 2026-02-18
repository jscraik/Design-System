import { IconChevronLeftMd, IconChevronRightMd } from "../../../icons/ChatGPTIcons";
import type { SettingsPanelProps } from "../shared/types";

function AppIcon({ name, color }: { name: string; color: string }) {
  return (
    <div
      className="size-5 rounded flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: color }}
    >
      <span className="text-text-body-on-color text-[11px] font-semibold">
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
  ];

  const availableApps = [
    { name: "Code", status: "Requires extension", color: "#007ACC" },
    { name: "Code - Insiders", status: "Requires extension", color: "#1A9E5A" },
  ];

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
          Manage Apps
        </h2>
      </div>

      <div className="overflow-y-auto max-h-[calc(85vh-80px)] px-6 py-4">
        {/* Work with Apps section */}
        <div className="mb-6">
          <h3 className="text-[14px] font-semibold leading-[20px] tracking-[-0.3px] text-foreground mb-1">
            Work with Apps
          </h3>
          <p className="text-[13px] leading-[18px] tracking-[-0.32px] text-muted-foreground mb-4">
            Allow ChatGPT to work with code and text editors.
          </p>

          {/* Connected apps */}
          <div className="mb-6">
            <h4 className="text-[13px] font-semibold leading-[18px] tracking-[-0.32px] text-muted-foreground mb-2 px-3">
              Connected apps
            </h4>
            <div className="space-y-0.5">
              {connectedApps.map((app) => (
                <button
                  type="button"
                  key={app.name}
                  className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-secondary rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <AppIcon name={app.name} color={app.color} />
                    <div className="text-left">
                      <div className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foreground">
                        {app.name}
                      </div>
                      <div className="text-[12px] leading-[16px] tracking-[-0.24px] text-accent-green">
                        {app.status}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-text-secondary">
                      Manage
                    </span>
                    <IconChevronRightMd className="size-4 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Available to Connect */}
          <div>
            <h4 className="text-[13px] font-semibold leading-[18px] tracking-[-0.32px] text-muted-foreground mb-2 px-3">
              Available to Connect
            </h4>
            <div className="space-y-0.5">
              {availableApps.map((app) => (
                <button
                  type="button"
                  key={app.name}
                  className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-secondary rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <AppIcon name={app.name} color={app.color} />
                    <div className="text-left">
                      <div className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foreground">
                        {app.name}
                      </div>
                      <div className="text-[12px] leading-[16px] tracking-[-0.24px] text-muted-foreground">
                        {app.status}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-text-secondary">
                      Install Extension
                    </span>
                    <IconChevronRightMd className="size-4 text-muted-foreground" />
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
