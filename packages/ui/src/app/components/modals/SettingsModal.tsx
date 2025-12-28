import { useState } from "react";

import { ModalDialog } from "../ui/overlays/modal";
import {
  IconArchive,
  IconBarChart,
  IconBook,
  IconCategory,
  IconCheckCircle,
  IconCheckmark,
  IconChevronDownMd,
  IconChevronRightMd,
  IconComment,
  IconCreditCard,
  IconEdit,
  IconEmail,
  IconGlobe,
  IconInfo,
  IconLightBulb,
  IconLink,
  IconMessaging,
  IconMic,
  IconPhone,
  IconPlayground,
  IconPro,
  IconQuestion,
  IconRegenerate,
  IconSettings,
  IconSoundOn,
  IconStack,
  IconStarFilled,
  IconStatus,
  IconSuitcase,
  IconSun,
  IconTerminal,
  IconUndo,
  IconUserLock,
  IconWarning,
  IconX,
} from "../icons/ChatGPTIcons";
import {
  AppsPanel,
  ArchivedChatsPanel,
  AudioSettingsPanel,
  CheckForUpdatesPanel,
  DataControlsPanel,
  ManageAppsPanel,
  NotificationsPanel,
  PersonalizationPanel,
  SecurityPanel,
  SettingRow,
  SettingToggle,
} from "../settings";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/overlays/dropdown-menu";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  account?: {
    email?: string;
    phone?: string;
    subscriptionLabel?: string;
  };
  appInfo?: {
    versionLabel?: string;
  };
}

type SettingsView =
  | "main"
  | "personalization"
  | "notifications"
  | "apps"
  | "dataControls"
  | "archivedChats"
  | "security"
  | "checkForUpdates"
  | "manageApps"
  | "audioSettings";

const accentColors = [
  { name: "Blue", color: "#3b82f6" },
  { name: "Green", color: "#10b981" },
  { name: "Orange", color: "#f97316" },
  { name: "Red", color: "#ef4444" },
  { name: "Purple", color: "#8b5cf6" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="text-[14px] font-semibold leading-[20px] tracking-[-0.3px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function SettingsModal({ isOpen, onClose, account, appInfo }: SettingsModalProps) {
  // Navigation state
  const [currentView, setCurrentView] = useState<SettingsView>("main");

  // Main settings state
  const [showAdditionalModels, setShowAdditionalModels] = useState(true);
  const [correctSpelling, setCorrectSpelling] = useState(true);
  const [openLinksInApp, setOpenLinksInApp] = useState(true);
  const [appLanguage] = useState("English");
  const [showInMenuBar, setShowInMenuBar] = useState("When app is running");
  const [accentColor, setAccentColor] = useState("Purple");
  const [positionOnScreen] = useState("Remember last position");
  const [resetToNewChat, setResetToNewChat] = useState("After 10 minutes");
  const [keyboardShortcut, setKeyboardShortcut] = useState("⌘Space");

  const [enableWorkWithApps, setEnableWorkWithApps] = useState(true);
  const [togglePairing] = useState("⌘⌥1");
  const [linearApps] = useState("Never");
  const [autoPairWithApps, setAutoPairWithApps] = useState(true);
  const [generateSuggestedEdits, setGenerateSuggestedEdits] = useState(false);
  const [autoApplySuggestedEdits, setAutoApplySuggestedEdits] = useState(false);

  const [voice] = useState("Cove");
  const [mainLanguage] = useState("English");

  const [autocomplete, setAutocomplete] = useState(true);
  const [trendingSearches, setTrendingSearches] = useState(true);
  const [followUpSuggestions, setFollowUpSuggestions] = useState(true);

  const selectedColorHex = accentColors.find((c) => c.name === accentColor)?.color || "#3b82f6";

  // Render the appropriate panel based on current view
  const renderPanel = () => {
    switch (currentView) {
      case "personalization":
        return <PersonalizationPanel onBack={() => setCurrentView("main")} />;
      case "notifications":
        return <NotificationsPanel onBack={() => setCurrentView("main")} />;
      case "apps":
        return <AppsPanel onBack={() => setCurrentView("main")} />;
      case "dataControls":
        return <DataControlsPanel onBack={() => setCurrentView("main")} />;
      case "archivedChats":
        return <ArchivedChatsPanel onBack={() => setCurrentView("main")} />;
      case "security":
        return <SecurityPanel onBack={() => setCurrentView("main")} />;
      case "checkForUpdates":
        return <CheckForUpdatesPanel onBack={() => setCurrentView("main")} />;
      case "manageApps":
        return <ManageAppsPanel onBack={() => setCurrentView("main")} />;
      case "audioSettings":
        return <AudioSettingsPanel onBack={() => setCurrentView("main")} />;
      default:
        return null;
    }
  };

  // Main content render
  const mainContent = (
    <>
      {/* Header with traffic light buttons */}
      <div className="px-6 py-4 border-b border-foundation-text-light-primary/10 dark:border-foundation-text-dark-primary/10 flex items-center gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="size-3 rounded-full bg-foundation-accent-red hover:bg-foundation-accent-red/80 transition-colors focus-visible:ring-2 focus-visible:ring-black/20 dark:focus-visible:ring-white/20"
            aria-label="Close"
          />
          <div className="size-3 rounded-full bg-foundation-accent-orange" />
          <div className="size-3 rounded-full bg-foundation-accent-green" />
        </div>
        <h2
          id="settings-modal-title"
          className="text-[18px] font-semibold leading-[26px] tracking-[-0.45px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary"
        >
          Settings
        </h2>
      </div>

      {/* Main content */}
      <div className="overflow-y-auto max-h-[calc(85vh-80px)] px-6 py-4">
        <Section title="Account">
          <div className="space-y-0.5">
            <SettingRow
              icon={<IconEmail className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="Email"
              right={
                <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                  {account?.email ?? "—"}
                </span>
              }
            />
            <SettingRow
              icon={<IconPhone className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="Phone number"
              right={
                <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                  {account?.phone ?? "—"}
                </span>
              }
            />
            <SettingRow
              icon={<IconCreditCard className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="Subscription"
              right={
                <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                  {account?.subscriptionLabel ?? "—"}
                </span>
              }
            />
            <SettingRow
              icon={<IconSuitcase className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="Orders"
              right={
                <IconChevronRightMd className="size-4 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary" />
              }
            />
            <SettingRow
              icon={<IconStarFilled className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="Personalization"
              onClick={() => setCurrentView("personalization")}
              right={
                <IconChevronRightMd className="size-4 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary" />
              }
            />
            <SettingRow
              icon={<IconStatus className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="Notifications"
              onClick={() => setCurrentView("notifications")}
              right={
                <IconChevronRightMd className="size-4 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary" />
              }
            />
            <SettingRow
              icon={<IconCategory className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="Apps"
              onClick={() => setCurrentView("apps")}
              right={
                <IconChevronRightMd className="size-4 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary" />
              }
            />
            <SettingRow
              icon={<IconUserLock className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="Data controls"
              onClick={() => setCurrentView("dataControls")}
              right={
                <IconChevronRightMd className="size-4 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary" />
              }
            />
            <SettingRow
              icon={<IconArchive className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="Archived chats"
              onClick={() => setCurrentView("archivedChats")}
              right={
                <IconChevronRightMd className="size-4 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary" />
              }
            />
            <SettingRow
              icon={<IconUserLock className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="Security"
              onClick={() => setCurrentView("security")}
              right={
                <IconChevronRightMd className="size-4 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary" />
              }
            />
          </div>
        </Section>

        <Section title="App">
          <div className="space-y-0.5">
            <SettingRow
              icon={<IconGlobe className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="App language"
              right={
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                    {appLanguage}
                  </span>
                  <IconChevronRightMd className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
                </div>
              }
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <IconPlayground className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
                    <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                      Show in Menu Bar
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                      {showInMenuBar}
                    </span>
                    <div className="size-5 rounded-full bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 flex items-center justify-center">
                      <IconChevronDownMd className="size-3 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
                    </div>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[200px]">
                <DropdownMenuRadioGroup value={showInMenuBar} onValueChange={setShowInMenuBar}>
                  <DropdownMenuRadioItem value="Always">Always</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="When app is running">When app is running</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Never">Never</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <IconSun className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
                    <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                      Accent color
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full" style={{ backgroundColor: selectedColorHex }} />
                    <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                      {accentColor}
                    </span>
                    <div className="size-5 rounded-full bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 flex items-center justify-center">
                      <IconChevronDownMd className="size-3 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
                    </div>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[140px]">
                <DropdownMenuRadioGroup value={accentColor} onValueChange={setAccentColor}>
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
              icon={<IconComment className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="Show additional models"
              checked={showAdditionalModels}
              onCheckedChange={() => setShowAdditionalModels(!showAdditionalModels)}
            />

            <SettingToggle
              icon={<IconCheckmark className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="Correct spelling automatically"
              checked={correctSpelling}
              onCheckedChange={() => setCorrectSpelling(!correctSpelling)}
            />

            <SettingToggle
              icon={<IconLink className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="Open ChatGPT links in desktop app"
              checked={openLinksInApp}
              onCheckedChange={() => setOpenLinksInApp(!openLinksInApp)}
            />

            <SettingRow
              icon={<IconRegenerate className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="Check for updates..."
              onClick={() => setCurrentView("checkForUpdates")}
              right={
                <IconChevronRightMd className="size-4 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary" />
              }
            />
          </div>
        </Section>

        <Section title="Chat bar">
          <div className="space-y-0.5">
            <SettingRow
              icon={<IconMessaging className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="Position on screen"
              right={
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                    {positionOnScreen}
                  </span>
                  <div className="size-5 rounded-full bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 flex items-center justify-center">
                    <IconChevronDownMd className="size-3 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
                  </div>
                </div>
              }
            />

            <SettingRow
              icon={<IconUndo className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="Reset to new chat"
              right={
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                    {resetToNewChat}
                  </span>
                  <div className="size-5 rounded-full bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 flex items-center justify-center">
                    <IconChevronDownMd className="size-3 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
                  </div>
                </div>
              }
            />

            <SettingRow
              icon={<IconTerminal className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="Keyboard shortcut"
              right={
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                    {keyboardShortcut}
                  </span>
                  <button
                    type="button"
                    onClick={() => setKeyboardShortcut("")}
                    aria-label="Clear keyboard shortcut"
                    title="Clear keyboard shortcut"
                    className="p-1 hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3 rounded-full transition-colors"
                  >
                    <IconX className="size-3 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
                  </button>
                </div>
              }
            />

            <SettingRow
              icon={<IconMessaging className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="Open new chats"
              right={
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                    In Companion Chat
                  </span>
                  <div className="size-5 rounded-full bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 flex items-center justify-center">
                    <IconChevronDownMd className="size-3 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
                  </div>
                </div>
              }
            />
          </div>
        </Section>

        <Section title="Work with Apps">
          <div className="space-y-0.5">
            <SettingToggle
              icon={<IconPro className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="Enable Work with Apps"
              checked={enableWorkWithApps}
              onCheckedChange={() => setEnableWorkWithApps(!enableWorkWithApps)}
            />

            <SettingRow
              icon={<IconCheckCircle className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="Toggle pairing"
              right={
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                    {togglePairing}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTogglePairing("")}
                    aria-label="Clear pairing"
                    title="Clear pairing"
                    className="p-1 hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3 rounded-full transition-colors"
                  >
                    <IconX className="size-3 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
                  </button>
                </div>
              }
            />

            <SettingRow
              icon={<IconStack className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="Unpair apps"
              right={
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                    {linearApps}
                  </span>
                  <div className="size-5 rounded-full bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 flex items-center justify-center">
                    <IconChevronDownMd className="size-3 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
                  </div>
                </div>
              }
            />

            <SettingRow
              icon={<IconSettings className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="Manage Apps"
              onClick={() => setCurrentView("manageApps")}
              right={
                <IconChevronRightMd className="size-4 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary" />
              }
            />

            <SettingToggle
              icon={<IconLightBulb className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="Automatically Pair with Apps from Chat Bar"
              checked={autoPairWithApps}
              onCheckedChange={() => setAutoPairWithApps(!autoPairWithApps)}
            />

            <SettingToggle
              icon={<IconEdit className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="Generate suggested edits"
              checked={generateSuggestedEdits}
              onCheckedChange={() => setGenerateSuggestedEdits(!generateSuggestedEdits)}
            />

            <SettingToggle
              icon={<IconEdit className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="Automatically Apply Suggested Edits"
              checked={autoApplySuggestedEdits}
              onCheckedChange={() => setAutoApplySuggestedEdits(!autoApplySuggestedEdits)}
            />

            <div className="px-3 py-2">
              <p className="text-[13px] text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary leading-[18px] tracking-[-0.32px] font-normal">
                Allow ChatGPT to work with code and text editors.
              </p>
            </div>
          </div>
        </Section>

        <Section title="Speech">
          <div className="space-y-0.5">
            <SettingRow
              icon={<IconMic className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="Voice"
              right={
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                    {voice}
                  </span>
                  <IconChevronRightMd className="size-4 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary" />
                </div>
              }
            />

            <SettingRow
              icon={<IconGlobe className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="Main language"
              right={
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                    {mainLanguage}
                  </span>
                  <div className="size-5 rounded-full bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 flex items-center justify-center">
                    <IconChevronDownMd className="size-3 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
                  </div>
                </div>
              }
            />

            <SettingRow
              icon={<IconSoundOn className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="Audio settings"
              onClick={() => setCurrentView("audioSettings")}
              right={
                <IconChevronRightMd className="size-4 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary" />
              }
            />

            <div className="px-3 py-2">
              <p className="text-[13px] text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary leading-[18px] tracking-[-0.32px] font-normal">
                For best results, select the language you mainly speak. If it's not listed, it may still be supported via
                auto-detection.
              </p>
            </div>
          </div>
        </Section>

        <Section title="Suggestions">
          <div className="space-y-0.5">
            <SettingToggle
              icon={<IconCheckCircle className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="Autocomplete"
              checked={autocomplete}
              onCheckedChange={() => setAutocomplete(!autocomplete)}
            />

            <SettingToggle
              icon={<IconBarChart className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="Trending searches"
              checked={trendingSearches}
              onCheckedChange={() => setTrendingSearches(!trendingSearches)}
            />

            <SettingToggle
              icon={<IconLightBulb className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="Follow-up suggestions"
              checked={followUpSuggestions}
              onCheckedChange={() => setFollowUpSuggestions(!followUpSuggestions)}
            />
          </div>
        </Section>

        <Section title="About">
          <div className="space-y-0.5">
            <SettingRow
              icon={<IconWarning className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="Report bug"
              right={
                <IconChevronRightMd className="size-4 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary" />
              }
            />
            <SettingRow
              icon={<IconQuestion className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="Help Center"
              right={
                <IconChevronRightMd className="size-4 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary" />
              }
            />
            <SettingRow
              icon={<IconBook className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="Terms of Use"
              right={
                <IconChevronRightMd className="size-4 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary" />
              }
            />
            <SettingRow
              icon={<IconUserLock className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="Privacy Policy"
              right={
                <IconChevronRightMd className="size-4 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary" />
              }
            />
            <SettingRow
              icon={<IconInfo className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />}
              label="ChatGPT for macOS"
              right={
                <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                  {appInfo?.versionLabel ?? "—"}
                </span>
              }
            />
            <SettingRow
              label="Log out"
              right={
                <IconChevronRightMd className="size-4 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary" />
              }
            />
          </div>
        </Section>
      </div>
    </>
  );

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Settings"
      titleId="settings-modal-title"
      maxWidth="560px"
      className="max-h-[85vh] overflow-hidden"
      showOverlay={false}
    >
      {currentView !== "main" ? renderPanel() : mainContent}
    </ModalDialog>
  );
}
