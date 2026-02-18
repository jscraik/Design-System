import {
  IconCheckCircle,
  IconChevronDownMd,
  IconChevronRightMd,
  IconEdit,
  IconLightBulb,
  IconPro,
  IconSettings,
  IconStack,
} from "../../../../icons/ChatGPTIcons";
import { SettingRow, SettingToggle } from "../../../settings";

interface WorkWithAppsSectionProps {
  enableWorkWithApps: boolean;
  togglePairing: string;
  linearApps: string;
  autoPairWithApps: boolean;
  generateSuggestedEdits: boolean;
  autoApplySuggestedEdits: boolean;
  onNavigate: (view: string) => void;
  onToggle: (key: string) => void;
  onChange: (key: string, value: string) => void;
}

/** WorkWithAppsSection renders Work with Apps settings. */
export function WorkWithAppsSection({
  enableWorkWithApps,
  togglePairing,
  linearApps,
  autoPairWithApps,
  generateSuggestedEdits,
  autoApplySuggestedEdits,
  onNavigate,
  onToggle,
  onChange,
}: WorkWithAppsSectionProps) {
  return (
    <div className="mb-5">
      <h3 className="text-body-small font-semibold text-foreground mb-2">Work with Apps</h3>
      <div className="space-y-0.5">
        <SettingToggle
          icon={<IconPro className="size-4 text-text-secondary dark:text-text-secondary" />}
          label="Enable Work with Apps"
          checked={enableWorkWithApps}
          onCheckedChange={() => onToggle("enableWorkWithApps")}
        />

        <SettingRow
          icon={<IconCheckCircle className="size-4 text-text-secondary dark:text-text-secondary" />}
          label="Toggle pairing"
          right={
            <div className="flex items-center gap-2">
              <span className="text-body-small font-normal text-text-secondary">
                {togglePairing}
              </span>
              <button
                type="button"
                onClick={() => onChange("togglePairing", "")}
                aria-label="Clear pairing"
                title="Clear pairing"
                className="p-1 hover:bg-muted rounded-full transition-colors"
              >
                <svg
                  className="size-3 text-text-secondary dark:text-text-secondary"
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
          icon={<IconStack className="size-4 text-text-secondary dark:text-text-secondary" />}
          label="Unpair apps"
          right={
            <div className="flex items-center gap-2">
              <span className="text-body-small font-normal text-text-secondary">{linearApps}</span>
              <div className="size-5 rounded-full bg-muted flex items-center justify-center">
                <IconChevronDownMd className="size-3 text-text-secondary dark:text-text-secondary" />
              </div>
            </div>
          }
        />

        <SettingRow
          icon={<IconSettings className="size-4 text-text-secondary dark:text-text-secondary" />}
          label="Manage Apps"
          onClick={() => onNavigate("manageApps")}
          right={
            <IconChevronRightMd className="size-4 text-muted-foreground dark:text-muted-foreground" />
          }
        />

        <SettingToggle
          icon={<IconLightBulb className="size-4 text-text-secondary dark:text-text-secondary" />}
          label="Automatically Pair with Apps from Chat Bar"
          checked={autoPairWithApps}
          onCheckedChange={() => onToggle("autoPairWithApps")}
        />

        <SettingToggle
          icon={<IconEdit className="size-4 text-text-secondary dark:text-text-secondary" />}
          label="Generate suggested edits"
          checked={generateSuggestedEdits}
          onCheckedChange={() => onToggle("generateSuggestedEdits")}
        />

        <SettingToggle
          icon={<IconEdit className="size-4 text-text-secondary dark:text-text-secondary" />}
          label="Automatically Apply Suggested Edits"
          checked={autoApplySuggestedEdits}
          onCheckedChange={() => onToggle("autoApplySuggestedEdits")}
        />

        <div className="px-3 py-2">
          <p className="text-caption text-muted-foreground font-normal">
            Allow ChatGPT to work with code and text editors.
          </p>
        </div>
      </div>
    </div>
  );
}
