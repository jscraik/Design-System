import { IconChevronLeftMd, IconChevronRightMd } from "../../../icons/ChatGPTIcons";
import type { SettingsPanelProps } from "../shared/types";

const LIGHT_TEXT_HEX = "#0D0D0D";
const DARK_TEXT_HEX = "#FFFFFF";

const hexToRgb = (hex: string) => {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) return null;
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
  return { r, g, b };
};

const relativeLuminance = ({ r, g, b }: { r: number; g: number; b: number }) => {
  const toLinear = (c: number) => {
    const normalized = c / 255;
    return normalized <= 0.04045 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4);
  };
  const rLin = toLinear(r);
  const gLin = toLinear(g);
  const bLin = toLinear(b);
  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
};

const contrastRatio = (hexA: string, hexB: string) => {
  const rgbA = hexToRgb(hexA);
  const rgbB = hexToRgb(hexB);
  if (!rgbA || !rgbB) return 1;
  const l1 = relativeLuminance(rgbA);
  const l2 = relativeLuminance(rgbB);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
};

const getReadableTextClass = (backgroundHex: string) => {
  const onLight = contrastRatio(backgroundHex, LIGHT_TEXT_HEX);
  const onDark = contrastRatio(backgroundHex, DARK_TEXT_HEX);
  return onLight >= onDark
    ? "text-foundation-text-light-primary"
    : "text-foundation-text-dark-primary";
};

// App icon component for consistent styling
function AppIcon({ children, color }: { children: React.ReactNode; color: string }) {
  const textClass = getReadableTextClass(color);
  return (
    <div
      className={`size-5 rounded flex items-center justify-center flex-shrink-0 ${textClass}`}
      style={{ backgroundColor: color }}
    >
      <span className="text-white text-[11px] font-semibold">{children}</span>
    </div>
  );
}

export function AppsPanel({ onBack }: SettingsPanelProps) {
  const enabledApps = [
    { name: "Canva", icon: "C", color: "#00C4CC" },
    { name: "Code for Slack", icon: "S", color: "#4A154B" },
    { name: "Dropbox", icon: "D", color: "#0061FF" },
    { name: "Figma", icon: "F", color: "#F24E1E" },
    { name: "GitHub", icon: "G", color: "#24292e" },
    { name: "Linear", icon: "L", color: "#5E6AD2" },
    { name: "Linear Coder Agent", icon: "L", color: "#5E6AD2" },
    { name: "Notion", icon: "N", color: "#000000" },
    { name: "Outlook Calendar", icon: "O", color: "#0078D4" },
    { name: "Outlook Email", icon: "O", color: "#0078D4" },
    { name: "PEER", icon: "P", color: "#6B7280" },
    { name: "SharePoint", icon: "S", color: "#0078D4" },
    { name: "Shopping research", icon: "S", color: "#10a37f" },
    { name: "Slack", icon: "S", color: "#4A154B" },
    { name: "Sora", icon: "S", color: "#000000" },
    { name: "Teams", icon: "T", color: "#6264A7" },
    { name: "todo", icon: "T", color: "#2564CF" },
    { name: "Your 'app with ChatGPT'", icon: "Y", color: "#FF6B35" },
  ];

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
        >
          <IconChevronLeftMd className="size-4 text-foundation-icon-dark-primary" />
        </button>
        <h2 className="text-[18px] font-semibold leading-[26px] tracking-[-0.45px] text-foundation-text-dark-primary">
          Apps
        </h2>
      </div>

      <div className="overflow-y-auto max-h-[calc(85vh-80px)] px-6 py-4">
        {/* Enabled apps section */}
        <div className="mb-6">
          <h3 className="text-[14px] font-semibold leading-[20px] tracking-[-0.3px] text-foundation-text-dark-primary mb-2 px-3">
            Enabled apps
          </h3>
          <div className="space-y-0.5">
            {enabledApps.map((app) => (
              <button
                type="button"
                key={app.name}
                className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-foundation-bg-dark-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <AppIcon color={app.color}>{app.icon}</AppIcon>
                  <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-dark-primary">
                    {app.name}
                  </span>
                </div>
                <IconChevronRightMd className="size-4 text-foundation-icon-dark-tertiary" />
              </button>
            ))}
          </div>

          {/* Info text */}
          <div className="px-3 mt-3">
            <p className="text-[13px] leading-[18px] tracking-[-0.32px] text-foundation-text-dark-tertiary">
              ChatGPT can access information from connected apps. Your permissions are always
              respected.{" "}
              <button type="button" className="text-foundation-accent-blue hover:underline">
                Learn more
              </button>
            </p>
          </div>
        </div>

        {/* All apps section */}
        <div>
          <h3 className="text-[14px] font-semibold leading-[20px] tracking-[-0.3px] text-foundation-text-dark-primary mb-2 px-3">
            All apps
          </h3>
          <button
            type="button"
            className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-foundation-bg-dark-2 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="size-5 rounded bg-foundation-bg-dark-3 flex items-center justify-center">
                <svg
                  className="size-3 text-foundation-icon-dark-secondary"
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
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-dark-primary">
                Browse Apps
              </span>
            </div>
            <IconChevronRightMd className="size-4 text-foundation-icon-dark-tertiary" />
          </button>
        </div>
      </div>
    </>
  );
}
