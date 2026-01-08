import { IconChevronLeftMd, IconChevronRightMd } from "./icons/ChatGPTIcons";
import type { SettingsPanelProps } from "./types";

// Simplified app icon component with better visual consistency
function AppIcon({ name, color }: { name: string; color: string }) {
  // Use a rounded square design with the first letter or brand-appropriate symbol
  const getIconContent = (appName: string) => {
    const first = appName.charAt(0).toUpperCase();
    return first;
  };

  return (
    <div
      className="size-5 rounded flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: color }}
    >
      <span className="text-white text-[11px] font-semibold">
        {getIconContent(name)}
      </span>
    </div>
  );
}

export function AppsPanel({ onBack }: SettingsPanelProps) {
  const enabledApps = [
    { name: "Canva", color: "#00C4CC" },
    { name: "Code for Slack", color: "#4A154B" },
    { name: "Dropbox", color: "#0061FF" },
    { name: "Figma", color: "#F24E1E" },
    { name: "GitHub", color: "#24292e" },
    { name: "Linear", color: "#5E6AD2" },
    { name: "Linear Coder Agent", color: "#5E6AD2" },
    { name: "Notion", color: "#000000" },
    { name: "Outlook Calendar", color: "#0078D4" },
    { name: "Outlook Email", color: "#0078D4" },
    { name: "PEER", color: "#6B7280" },
    { name: "SharePoint", color: "#0078D4" },
    { name: "Shopping research", color: "#10a37f" },
    { name: "Slack", color: "#4A154B" },
    { name: "Sora", color: "#000000" },
    { name: "Teams", color: "#6264A7" },
    { name: "todo", color: "#2564CF" },
    { name: "Your 'app with ChatGPT'", color: "#FF6B35" },
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
          Apps
        </h2>
      </div>

      <div className="overflow-y-auto max-h-[calc(85vh-80px)] px-6 py-4">
        {/* Enabled apps section */}
        <div className="mb-6">
          <h3 className="text-[14px] font-semibold leading-[20px] tracking-[-0.3px] text-[var(--foundation-text-dark-primary)] mb-2 px-3">
            Enabled apps
          </h3>
          <div className="space-y-0.5">
            {enabledApps.map((app, index) => (
              <button
                key={index}
                className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-[var(--foundation-bg-dark-2)] rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <AppIcon name={app.name} color={app.color} />
                  <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-[var(--foundation-text-dark-primary)]">
                    {app.name}
                  </span>
                </div>
                <IconChevronRightMd className="size-4 text-[var(--foundation-icon-dark-tertiary)]" />
              </button>
            ))}
          </div>

          {/* Info text */}
          <div className="px-3 mt-3">
            <p className="text-[13px] leading-[18px] tracking-[-0.32px] text-[var(--foundation-text-dark-tertiary)]">
              ChatGPT can access information from connected apps. Your permissions are always
              respected.{" "}
              <button className="text-[var(--foundation-accent-blue)] hover:underline">
                Learn more
              </button>
            </p>
          </div>
        </div>

        {/* All apps section */}
        <div>
          <h3 className="text-[14px] font-semibold leading-[20px] tracking-[-0.3px] text-[var(--foundation-text-dark-primary)] mb-2 px-3">
            All apps
          </h3>
          <button className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-[var(--foundation-bg-dark-2)] rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <div className="size-5 rounded bg-[var(--foundation-bg-dark-3)] flex items-center justify-center">
                <svg
                  className="size-3 text-[var(--foundation-icon-dark-secondary)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </div>
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-[var(--foundation-text-dark-primary)]">
                Browse Apps
              </span>
            </div>
            <IconChevronRightMd className="size-4 text-[var(--foundation-icon-dark-tertiary)]" />
          </button>
        </div>
      </div>
    </>
  );
}