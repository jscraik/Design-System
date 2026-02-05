import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/overlays/DropdownMenu";
import {
  IconCheckmark,
  IconChevronDownMd,
  IconChevronRightMd,
  IconComment,
  IconGlobe,
  IconLink,
  IconPlayground,
  IconRegenerate,
  IconSun,
} from "../../../../icons/ChatGPTIcons";
import { SettingRow, SettingToggle } from "../../../settings";

interface AppSectionProps {
  appLanguage: string;
  showInMenuBar: string;
  accentColor: string;
  showAdditionalModels: boolean;
  correctSpelling: boolean;
  openLinksInApp: boolean;
  onNavigate: (view: string) => void;
  onToggle: (key: string) => void;
  onChange: (key: string, value: string) => void;
}

const accentColors = [
  { name: "Blue", color: "#3b82f6" },
  { name: "Green", color: "#10b981" },
  { name: "Orange", color: "#f97316" },
  { name: "Red", color: "#ef4444" },
  { name: "Purple", color: "#8b5cf6" },
];

/** AppSection renders app-related settings. */
export function AppSection({
  appLanguage,
  showInMenuBar,
  accentColor,
  showAdditionalModels,
  correctSpelling,
  openLinksInApp,
  onNavigate,
  onToggle,
  onChange,
}: AppSectionProps) {
  const selectedColorHex = accentColors.find((c) => c.name === accentColor)?.color || "#3b82f6";

  return (
    <div className="mb-5">
      <h3 className="text-body-small font-semibold text-foreground mb-2">App</h3>
      <div className="space-y-0.5">
        <SettingRow
          icon={<IconGlobe className="size-4 text-text-secondary dark:text-text-secondary" />}
          label="App language"
          right={
            <div className="flex items-center gap-2">
              <span className="text-body-small font-normal text-text-secondary">{appLanguage}</span>
              <IconChevronRightMd className="size-4 text-text-secondary dark:text-text-secondary" />
            </div>
          }
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-secondary dark:hover:bg-secondary rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <IconPlayground className="size-4 text-text-secondary dark:text-text-secondary" />
                <span className="text-body-small font-normal text-foreground">
                  Show in Menu Bar
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-body-small font-normal text-text-secondary">
                  {showInMenuBar}
                </span>
                <div className="size-5 rounded-full bg-muted flex items-center justify-center">
                  <IconChevronDownMd className="size-3 text-text-secondary dark:text-text-secondary" />
                </div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[200px]">
            <DropdownMenuRadioGroup
              value={showInMenuBar}
              onValueChange={(v) => onChange("showInMenuBar", v)}
            >
              <DropdownMenuRadioItem value="Always">Always</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="When app is running">
                When app is running
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Never">Never</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-secondary dark:hover:bg-secondary rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <IconSun className="size-4 text-text-secondary dark:text-text-secondary" />
                <span className="text-body-small font-normal text-foreground">Accent color</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="size-3 rounded-full"
                  style={{ backgroundColor: selectedColorHex }}
                />
                <span className="text-body-small font-normal text-text-secondary">
                  {accentColor}
                </span>
                <div className="size-5 rounded-full bg-muted flex items-center justify-center">
                  <IconChevronDownMd className="size-3 text-text-secondary dark:text-text-secondary" />
                </div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[140px]">
            <DropdownMenuRadioGroup
              value={accentColor}
              onValueChange={(v) => onChange("accentColor", v)}
            >
              {accentColors.map((color) => (
                <DropdownMenuRadioItem key={color.name} value={color.name}>
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full" style={{ backgroundColor: color.color }} />
                    <span>{color.name}</span>
                  </div>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <SettingToggle
          icon={<IconComment className="size-4 text-text-secondary dark:text-text-secondary" />}
          label="Show additional models"
          checked={showAdditionalModels}
          onCheckedChange={() => onToggle("showAdditionalModels")}
        />

        <SettingToggle
          icon={<IconCheckmark className="size-4 text-text-secondary dark:text-text-secondary" />}
          label="Correct spelling automatically"
          checked={correctSpelling}
          onCheckedChange={() => onToggle("correctSpelling")}
        />

        <SettingToggle
          icon={<IconLink className="size-4 text-text-secondary dark:text-text-secondary" />}
          label="Open ChatGPT links in desktop app"
          checked={openLinksInApp}
          onCheckedChange={() => onToggle("openLinksInApp")}
        />

        <SettingRow
          icon={<IconRegenerate className="size-4 text-text-secondary dark:text-text-secondary" />}
          label="Check for updates..."
          onClick={() => onNavigate("checkForUpdates")}
          right={
            <IconChevronRightMd className="size-4 text-muted-foreground dark:text-muted-foreground" />
          }
        />
      </div>
    </div>
  );
}
