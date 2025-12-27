import { useState } from "react";
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
  IconGo,
  IconInfo,
  IconLightBulb,
  IconLink,
  IconMessaging,
  IconMic,
  IconPhone,
  IconPlayground,
  IconPro,
  IconPublic,
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
} from "./icons/ChatGPTIcons";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const accentColors = [
  { name: "Blue", color: "var(--foundation-accent-blue)" },
  { name: "Green", color: "var(--foundation-accent-green)" },
  { name: "Orange", color: "var(--foundation-accent-orange)" },
  { name: "Red", color: "var(--foundation-accent-red)" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-[14px] font-semibold leading-[20px] tracking-[-0.3px] text-white/90 mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

function RowDisplay({
  icon,
  label,
  right,
}: {
  icon: React.ReactNode;
  label: string;
  right: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5 hover:bg-white/5 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white/90">
          {label}
        </span>
      </div>
      {right}
    </div>
  );
}

function RowButton({
  icon,
  label,
  right,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  right: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/5 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white/90">
          {label}
        </span>
      </div>
      {right}
    </button>
  );
}

function ToggleRow({
  icon,
  label,
  checked,
  onToggle,
}: {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5 hover:bg-white/5 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white/90">
          {label}
        </span>
      </div>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
          checked ? "bg-[var(--foundation-accent-green)]" : "bg-white/20"
        }`}
      >
        <span
          className={`inline-block size-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-[18px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [showAdditionalModels, setShowAdditionalModels] = useState(true);
  const [correctSpelling, setCorrectSpelling] = useState(true);
  const [openLinksInApp, setOpenLinksInApp] = useState(true);
  const [appLanguage, setAppLanguage] = useState("English");
  const [showInMenuBar, setShowInMenuBar] = useState("When app is running");
  const [accentColor, setAccentColor] = useState("Blue");
  const [positionOnScreen, setPositionOnScreen] = useState("Remember last position");
  const [resetToNewChat, setResetToNewChat] = useState("After 10 minutes");
  const [keyboardShortcut, setKeyboardShortcut] = useState("⌘Space");

  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showMenuBarDropdown, setShowMenuBarDropdown] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [showPositionDropdown, setShowPositionDropdown] = useState(false);
  const [showResetDropdown, setShowResetDropdown] = useState(false);

  const [enableWorkWithApps, setEnableWorkWithApps] = useState(true);
  const [togglePairing, setTogglePairing] = useState("CV1");
  const [linearApps, setLinearApps] = useState("Never");
  const [autoFairWithApps, setAutoFairWithApps] = useState(true);
  const [generateSuggestedEdits, setGenerateSuggestedEdits] = useState(true);
  const [autoApplySuggestedEdits, setAutoApplySuggestedEdits] = useState(true);

  const [voice, setVoice] = useState("Cove");
  const [mainLanguage, setMainLanguage] = useState("English");

  const [autocomplete, setAutocomplete] = useState(true);
  const [trendingSearches, setTrendingSearches] = useState(true);
  const [followUpSuggestions, setFollowUpSuggestions] = useState(true);

  if (!isOpen) return null;

  const selectedColorHex =
    accentColors.find((c) => c.name === accentColor)?.color || "var(--foundation-accent-blue)";

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200]"
      onClick={onClose}
    >
      <div
        className="bg-[var(--foundation-bg-dark-1)] rounded-[16px] w-[560px] max-h-[85vh] overflow-hidden shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="size-3 rounded-full bg-[var(--foundation-accent-red)] hover:bg-[var(--foundation-accent-red)]/80 transition-colors"
            />
            <div className="size-3 rounded-full bg-[var(--foundation-accent-orange)]" />
            <div className="size-3 rounded-full bg-[var(--foundation-accent-green)]" />
          </div>
          <h2 className="text-[18px] font-semibold leading-[26px] tracking-[-0.45px] text-white">
            IconSettings
          </h2>
        </div>

        <div className="overflow-y-auto max-h-[calc(85vh-80px)] px-6 py-4">
          <Section title="Account">
            <div className="space-y-0.5">
              <RowDisplay
                icon={<IconEmail className="size-4 text-white/60" />}
                label="Email"
                right={
                  <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white/60">
                    fndveteran@gmail.com
                  </span>
                }
              />
              <RowDisplay
                icon={<IconPhone className="size-4 text-white/60" />}
                label="Phone number"
                right={
                  <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white/60">
                    +447472683324
                  </span>
                }
              />
              <RowDisplay
                icon={<IconCreditCard className="size-4 text-white/60" />}
                label="Subscription"
                right={
                  <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white/60">
                    ChatGPT Pro
                  </span>
                }
              />
              <RowButton
                icon={<IconSuitcase className="size-4 text-white/60" />}
                label="Orders"
                right={<IconChevronRightMd className="size-4 text-white/40" />}
              />
              <RowButton
                icon={<IconStarFilled className="size-4 text-white/60" />}
                label="Personalization"
                right={<IconChevronRightMd className="size-4 text-white/40" />}
              />
              <RowButton
                icon={<IconStatus className="size-4 text-white/60" />}
                label="Notifications"
                right={<IconChevronRightMd className="size-4 text-white/40" />}
              />
              <RowButton
                icon={<IconCategory className="size-4 text-white/60" />}
                label="Apps"
                right={<IconChevronRightMd className="size-4 text-white/40" />}
              />
              <RowButton
                icon={<IconUserLock className="size-4 text-white/60" />}
                label="Data controls"
                right={<IconChevronRightMd className="size-4 text-white/40" />}
              />
              <RowButton
                icon={<IconArchive className="size-4 text-white/60" />}
                label="Archived chats"
                right={<IconChevronRightMd className="size-4 text-white/40" />}
              />
              <RowButton
                icon={<IconUserLock className="size-4 text-white/60" />}
                label="Security"
                right={<IconChevronRightMd className="size-4 text-white/40" />}
              />
            </div>
          </Section>

          <Section title="App">
            <div className="space-y-0.5">
              <div className="relative">
                <RowButton
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  icon={<IconGlobe className="size-4 text-white/60" />}
                  label="App language"
                  right={
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white/60">
                        {appLanguage}
                      </span>
                      <IconChevronRightMd className="size-4 text-white/40" />
                    </div>
                  }
                />
              </div>

              <div className="relative">
                <RowButton
                  onClick={() => setShowMenuBarDropdown(!showMenuBarDropdown)}
                  icon={<IconPlayground className="size-4 text-white/60" />}
                  label="Show in Menu Bar"
                  right={
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white/60">
                        {showInMenuBar}
                      </span>
                      <IconChevronDownMd className="size-4 text-white/40" />
                    </div>
                  }
                />
              </div>

              <div className="relative">
                <RowButton
                  onClick={() => setShowColorDropdown(!showColorDropdown)}
                  icon={<IconSun className="size-4 text-white/60" />}
                  label="Accent color"
                  right={
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded-full" style={{ backgroundColor: selectedColorHex }} />
                      <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white/60">
                        {accentColor}
                      </span>
                      <IconChevronDownMd className="size-4 text-white/40" />
                    </div>
                  }
                />
                {showColorDropdown && (
                  <div className="absolute right-0 top-full mt-1 bg-[var(--foundation-bg-dark-2)] border border-white/10 rounded-lg shadow-xl p-1 min-w-[140px] z-10">
                    {accentColors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => {
                          setAccentColor(color.name);
                          setShowColorDropdown(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded text-left transition-colors"
                      >
                        <div className="size-3 rounded-full" style={{ backgroundColor: color.color }} />
                        <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white/90">
                          {color.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <ToggleRow
                icon={<IconPublic className="size-4 text-white/60" />}
                label="Show additional models"
                checked={showAdditionalModels}
                onToggle={() => setShowAdditionalModels(!showAdditionalModels)}
              />

              <ToggleRow
                icon={<IconCheckmark className="size-4 text-white/60" />}
                label="Correct spelling automatically"
                checked={correctSpelling}
                onToggle={() => setCorrectSpelling(!correctSpelling)}
              />

              <ToggleRow
                icon={<IconLink className="size-4 text-white/60" />}
                label="Open ChatGPT links in desktop app"
                checked={openLinksInApp}
                onToggle={() => setOpenLinksInApp(!openLinksInApp)}
              />

              <RowButton
                icon={<IconRegenerate className="size-4 text-white/60" />}
                label="Check for updates..."
                right={<IconChevronRightMd className="size-4 text-white/40" />}
              />
            </div>
          </Section>

          <Section title="Chat bar">
            <div className="space-y-0.5">
              <div className="relative">
                <RowButton
                  onClick={() => setShowPositionDropdown(!showPositionDropdown)}
                  icon={<IconComment className="size-4 text-white/60" />}
                  label="Position on screen"
                  right={
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white/60">
                        {positionOnScreen}
                      </span>
                      <IconChevronDownMd className="size-4 text-white/40" />
                    </div>
                  }
                />
              </div>

              <div className="relative">
                <RowButton
                  onClick={() => setShowResetDropdown(!showResetDropdown)}
                  icon={<IconUndo className="size-4 text-white/60" />}
                  label="Reset to new chat"
                  right={
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white/60">
                        {resetToNewChat}
                      </span>
                      <IconChevronDownMd className="size-4 text-white/40" />
                    </div>
                  }
                />
              </div>

              <RowDisplay
                icon={<IconTerminal className="size-4 text-white/60" />}
                label="Keyboard shortcut"
                right={
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white/60">
                      {keyboardShortcut}
                    </span>
                    <button
                      onClick={() => setKeyboardShortcut("")}
                      className="p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <IconX className="size-3 text-white/60" />
                    </button>
                  </div>
                }
              />

              <RowDisplay
                icon={<IconMessaging className="size-4 text-white/60" />}
                label="Open new chats"
                right={
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white/60">
                      In Companion Chat
                    </span>
                    <IconChevronDownMd className="size-4 text-white/40" />
                  </div>
                }
              />
            </div>
          </Section>

          <Section title="Work with Apps">
            <div className="space-y-0.5">
              <ToggleRow
                icon={<IconPro className="size-4 text-white/60" />}
                label="Enable Work with Apps"
                checked={enableWorkWithApps}
                onToggle={() => setEnableWorkWithApps(!enableWorkWithApps)}
              />

              <RowDisplay
                icon={<IconCheckCircle className="size-4 text-white/60" />}
                label="Toggle pairing"
                right={
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white/60">
                      {togglePairing}
                    </span>
                    <button className="p-1 hover:bg-white/10 rounded-full transition-colors">
                      <IconX className="size-3 text-white/60" />
                    </button>
                  </div>
                }
              />

              <RowDisplay
                icon={<IconStack className="size-4 text-white/60" />}
                label="Linear apps"
                right={
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white/60">
                      {linearApps}
                    </span>
                    <IconChevronDownMd className="size-4 text-white/40" />
                  </div>
                }
              />

              <RowButton
                icon={<IconSettings className="size-4 text-white/60" />}
                label="Manage Apps"
                right={<IconChevronRightMd className="size-4 text-white/40" />}
              />

              <ToggleRow
                icon={<IconLightBulb className="size-4 text-white/60" />}
                label="Automatically Pair with Apps from Chat Bar"
                checked={autoFairWithApps}
                onToggle={() => setAutoFairWithApps(!autoFairWithApps)}
              />

              <ToggleRow
                icon={<IconEdit className="size-4 text-white/60" />}
                label="Generate suggested edits"
                checked={generateSuggestedEdits}
                onToggle={() => setGenerateSuggestedEdits(!generateSuggestedEdits)}
              />

              <ToggleRow
                icon={<IconEdit className="size-4 text-white/60" />}
                label="Automatically Apply Suggested Edits"
                checked={autoApplySuggestedEdits}
                onToggle={() => setAutoApplySuggestedEdits(!autoApplySuggestedEdits)}
              />

              <div className="px-3 py-2">
                <p className="text-[13px] text-white/50 leading-[18px] tracking-[-0.32px] font-normal">
                  Allow ChatGPT to work with code and text editors.
                </p>
              </div>
            </div>
          </Section>

          <Section title="Speech">
            <div className="space-y-0.5">
              <RowDisplay
                icon={<IconMic className="size-4 text-white/60" />}
                label="Voice"
                right={
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white/60">
                      {voice}
                    </span>
                    <IconChevronRightMd className="size-4 text-white/40" />
                  </div>
                }
              />

              <RowDisplay
                icon={<IconGlobe className="size-4 text-white/60" />}
                label="Main language"
                right={
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white/60">
                      {mainLanguage}
                    </span>
                    <IconChevronRightMd className="size-4 text-white/40" />
                  </div>
                }
              />

              <RowButton
                icon={<IconSoundOn className="size-4 text-white/60" />}
                label="Audio settings"
                right={<IconChevronRightMd className="size-4 text-white/40" />}
              />

              <div className="px-3 py-2">
                <p className="text-[13px] text-white/50 leading-[18px] tracking-[-0.32px] font-normal">
                  For best results, select the language you mainly speak. If it's not listed, it may
                  still be supported via auto-detection.
                </p>
              </div>
            </div>
          </Section>

          <Section title="Suggestions">
            <div className="space-y-0.5">
              <ToggleRow
                icon={<IconCheckCircle className="size-4 text-white/60" />}
                label="Autocomplete"
                checked={autocomplete}
                onToggle={() => setAutocomplete(!autocomplete)}
              />

              <ToggleRow
                icon={<IconBarChart className="size-4 text-white/60" />}
                label="Trending searches"
                checked={trendingSearches}
                onToggle={() => setTrendingSearches(!trendingSearches)}
              />

              <ToggleRow
                icon={<IconLightBulb className="size-4 text-white/60" />}
                label="Follow-up suggestions"
                checked={followUpSuggestions}
                onToggle={() => setFollowUpSuggestions(!followUpSuggestions)}
              />
            </div>
          </Section>

          <Section title="About">
            <div className="space-y-0.5">
              <RowButton
                icon={<IconWarning className="size-4 text-white/60" />}
                label="Report bug"
                right={<IconChevronRightMd className="size-4 text-white/40" />}
              />
              <RowButton
                icon={<IconQuestion className="size-4 text-white/60" />}
                label="Help Center"
                right={<IconChevronRightMd className="size-4 text-white/40" />}
              />
              <RowButton
                icon={<IconBook className="size-4 text-white/60" />}
                label="Terms of Use"
                right={<IconChevronRightMd className="size-4 text-white/40" />}
              />
              <RowButton
                icon={<IconUserLock className="size-4 text-white/60" />}
                label="Privacy Policy"
                right={<IconChevronRightMd className="size-4 text-white/40" />}
              />
              <RowDisplay
                icon={<IconInfo className="size-4 text-white/60" />}
                label="ChatGPT for macOS"
                right={
                  <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white/60">
                    1.2025.343 (176593692)
                  </span>
                }
              />
              <RowButton
                icon={<IconGo className="size-4 text-white/60" />}
                label="Log out"
                right={<IconChevronRightMd className="size-4 text-white/40" />}
              />
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
