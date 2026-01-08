import { useState } from "react";

import {
  IconBatteryFull,
  IconCalendar,
  IconClock,
  IconCode,
  IconFolder,
  IconGlobe,
  IconHeadphones,
  IconImage,
  IconMoon,
  IconNotification,
  IconPhone,
  IconSparkles,
  IconSun,
  IconUserLock,
  IconWifi,
  IconNotebook,
} from "../../../icons";
import {
  SettingDropdownBlock,
  SettingDropdownGroup,
  type SettingDropdownOption,
} from "../../blocks/SettingDropdownBlock";
import { SettingRowBadge } from "../../blocks/SettingRowBlock";

export function SettingDropdownBlockDemo() {
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("en");
  const [model, setModel] = useState("gpt-4");
  const [fontSize, setFontSize] = useState("medium");
  const [dateFormat, setDateFormat] = useState("mdy");
  const [timeFormat, setTimeFormat] = useState("12h");
  const [quality, setQuality] = useState("high");
  const [region, setRegion] = useState("us");
  const [notifications, setNotifications] = useState("all");
  const [soundVolume, setSoundVolume] = useState("medium");
  const [networkMode, setNetworkMode] = useState("auto");
  const [powerMode, setPowerMode] = useState("balanced");
  const [storage, setStorage] = useState("cloud");
  const [processor, setProcessor] = useState("performance");

  // Theme options with icons
  const themeOptions: SettingDropdownOption[] = [
    { value: "light", label: "Light", description: "Use light theme", icon: <IconSun className="size-4" /> },
    { value: "dark", label: "Dark", description: "Use dark theme", icon: <IconMoon className="size-4" /> },
    { value: "system", label: "System", description: "Match system preference", icon: <IconNotebook className="size-4" /> },
  ];

  // Language options with groups
  const languageOptions: SettingDropdownOption[] = [
    { value: "en", label: "English", group: "Popular" },
    { value: "es", label: "Español", group: "Popular" },
    { value: "fr", label: "Français", group: "Popular" },
    { value: "de", label: "Deutsch", group: "Popular" },
    { value: "zh", label: "中文", group: "Popular" },
    { value: "ja", label: "日本語", group: "Asian" },
    { value: "ko", label: "한국어", group: "Asian" },
    { value: "pt", label: "Português", group: "European" },
    { value: "it", label: "Italiano", group: "European" },
    { value: "ru", label: "Русский", group: "European" },
    { value: "ar", label: "العربية", group: "Other" },
    { value: "hi", label: "हिन्दी", group: "Other" },
  ];

  // Model options with descriptions
  const modelOptions: SettingDropdownOption[] = [
    {
      value: "gpt-4",
      label: "GPT-4",
      description: "Most capable model, best at complex tasks",
      icon: <IconSparkles className="size-4" />,
    },
    {
      value: "gpt-4-turbo",
      label: "GPT-4 Turbo",
      description: "Faster and more efficient GPT-4",
      icon: <IconSparkles className="size-4" />,
    },
    {
      value: "gpt-3.5-turbo",
      label: "GPT-3.5 Turbo",
      description: "Fast and efficient for most tasks",
      icon: <IconCode className="size-4" />,
    },
  ];

  // Font size options
  const fontSizeOptions: SettingDropdownOption[] = [
    { value: "small", label: "Small", description: "Compact text size" },
    { value: "medium", label: "Medium", description: "Default text size" },
    { value: "large", label: "Large", description: "Larger for better readability" },
    { value: "xlarge", label: "Extra Large", description: "Maximum text size" },
  ];

  // Date format options
  const dateFormatOptions: SettingDropdownOption[] = [
    { value: "mdy", label: "MM/DD/YYYY", description: "12/31/2025" },
    { value: "dmy", label: "DD/MM/YYYY", description: "31/12/2025" },
    { value: "ymd", label: "YYYY-MM-DD", description: "2025-12-31" },
  ];

  // Time format options
  const timeFormatOptions: SettingDropdownOption[] = [
    { value: "12h", label: "12-hour", description: "1:30 PM" },
    { value: "24h", label: "24-hour", description: "13:30" },
  ];

  // Quality options
  const qualityOptions: SettingDropdownOption[] = [
    { value: "low", label: "Low", description: "Faster, smaller files" },
    { value: "medium", label: "Medium", description: "Balanced quality and size" },
    { value: "high", label: "High", description: "Best quality, larger files" },
  ];

  // Region options
  const regionOptions: SettingDropdownOption[] = [
    { value: "us", label: "United States" },
    { value: "uk", label: "United Kingdom" },
    { value: "eu", label: "European Union" },
    { value: "ca", label: "Canada" },
    { value: "au", label: "Australia" },
    { value: "jp", label: "Japan" },
    { value: "cn", label: "China" },
    { value: "in", label: "India" },
  ];

  // Notification options
  const notificationOptions: SettingDropdownOption[] = [
    { value: "all", label: "All notifications", description: "Receive all notifications" },
    { value: "important", label: "Important only", description: "Only critical notifications" },
    { value: "daily", label: "Daily digest", description: "One summary per day" },
    { value: "none", label: "None", description: "No notifications" },
  ];

  // Sound volume options
  const soundVolumeOptions: SettingDropdownOption[] = [
    { value: "muted", label: "Muted", icon: <IconHeadphones className="size-4 opacity-30" /> },
    { value: "low", label: "Low", icon: <IconHeadphones className="size-4 opacity-50" /> },
    { value: "medium", label: "Medium", icon: <IconHeadphones className="size-4 opacity-75" /> },
    { value: "high", label: "High", icon: <IconHeadphones className="size-4" /> },
  ];

  // Network mode options
  const networkModeOptions: SettingDropdownOption[] = [
    { value: "auto", label: "Automatic", description: "Auto-select best network", icon: <IconWifi className="size-4" /> },
    { value: "wifi", label: "Wi-Fi only", description: "Connect via Wi-Fi only", icon: <IconWifi className="size-4" /> },
    { value: "cellular", label: "Cellular only", description: "Use mobile data only", icon: <IconPhone className="size-4" /> },
    { value: "offline", label: "Offline mode", description: "Work without connection", disabled: true },
  ];

  // Power mode options
  const powerModeOptions: SettingDropdownOption[] = [
    { value: "performance", label: "Performance", description: "Maximum performance", icon: <IconSparkles className="size-4" /> },
    { value: "balanced", label: "Balanced", description: "Balance performance and battery", icon: <IconBatteryFull className="size-4" /> },
    { value: "saver", label: "Power Saver", description: "Extend battery life", icon: <IconBatteryFull className="size-4 opacity-50" /> },
  ];

  // Storage options
  const storageOptions: SettingDropdownOption[] = [
    { value: "cloud", label: "Cloud Storage", description: "Sync across devices", icon: <IconFolder className="size-4" /> },
    { value: "local", label: "Local Storage", description: "Store on device only", icon: <IconFolder className="size-4" /> },
    { value: "hybrid", label: "Hybrid", description: "Both cloud and local", icon: <IconFolder className="size-4" /> },
  ];

  // Processor mode options
  const processorOptions: SettingDropdownOption[] = [
    { value: "performance", label: "Performance", icon: <IconCode className="size-4" /> },
    { value: "efficiency", label: "Efficiency", icon: <IconCode className="size-4 opacity-75" /> },
    { value: "auto", label: "Automatic", icon: <IconCode className="size-4 opacity-50" /> },
  ];

  return (
    <div className="h-full bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 overflow-auto">
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        {/* Introduction */}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
            Setting Dropdown Block
          </h1>
          <p className="text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            Comprehensive dropdown component with 4 variants, 3 sizes, searchable options, grouped options,
            icons, badges, loading states, and full accessibility support.
          </p>
        </div>

        {/* 1. Variants */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
              1. Variants
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mt-1">
              Four visual variants: default, card, compact, and inline
            </p>
          </div>

          <div className="space-y-4">
            {/* Default Variant */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                Default
              </h3>
              <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden divide-y divide-foundation-bg-light-3 dark:divide-foundation-bg-dark-3">
                <SettingDropdownBlock
                  variant="default"
                  icon={<IconSparkles />}
                  label="Theme"
                  value={theme}
                  options={themeOptions}
                  onValueChange={setTheme}
                  description="Choose your preferred color scheme"
                />
                <SettingDropdownBlock
                  variant="default"
                  icon={<IconGlobe />}
                  label="Language"
                  value={language}
                  options={languageOptions}
                  onValueChange={setLanguage}
                />
              </div>
            </div>

            {/* Card Variant */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                Card
              </h3>
              <div className="space-y-2">
                <SettingDropdownBlock
                  variant="card"
                  icon={<IconSparkles />}
                  label="AI Model"
                  value={model}
                  options={modelOptions}
                  onValueChange={setModel}
                  description="Select which AI model to use"
                />
                <SettingDropdownBlock
                  variant="card"
                  icon={<IconImage />}
                  label="Image Quality"
                  value={quality}
                  options={qualityOptions}
                  onValueChange={setQuality}
                />
              </div>
            </div>

            {/* Compact Variant */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                Compact
              </h3>
              <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden divide-y divide-foundation-bg-light-3 dark:divide-foundation-bg-dark-3">
                <SettingDropdownBlock
                  variant="compact"
                  size="sm"
                  label="Date Format"
                  value={dateFormat}
                  options={dateFormatOptions}
                  onValueChange={setDateFormat}
                />
                <SettingDropdownBlock
                  variant="compact"
                  size="sm"
                  label="Time Format"
                  value={timeFormat}
                  options={timeFormatOptions}
                  onValueChange={setTimeFormat}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Sizes */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
              2. Sizes
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mt-1">
              Three size presets: small, medium, and large
            </p>
          </div>

          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden divide-y divide-foundation-bg-light-3 dark:divide-foundation-bg-dark-3">
            <SettingDropdownBlock
              size="sm"
              icon={<IconGlobe />}
              label="Small Size"
              value={region}
              options={regionOptions}
              onValueChange={setRegion}
            />
            <SettingDropdownBlock
              size="md"
              icon={<IconGlobe />}
              label="Medium Size (Default)"
              value={region}
              options={regionOptions}
              onValueChange={setRegion}
            />
            <SettingDropdownBlock
              size="lg"
              icon={<IconGlobe />}
              label="Large Size"
              value={region}
              options={regionOptions}
              onValueChange={setRegion}
            />
          </div>
        </div>

        {/* 3. Searchable Dropdown */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
              3. Searchable Dropdown
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mt-1">
              Filter options with search input
            </p>
          </div>

          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden">
            <SettingDropdownBlock
              icon={<IconGlobe />}
              label="Language (Searchable)"
              value={language}
              options={languageOptions}
              onValueChange={setLanguage}
              searchable
              description="Search through 12 languages"
            />
          </div>
        </div>

        {/* 4. Grouped Options */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
              4. Grouped Options
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mt-1">
              Organize options into categories
            </p>
          </div>

          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden">
            <SettingDropdownBlock
              icon={<IconGlobe />}
              label="Language (Grouped)"
              value={language}
              options={languageOptions}
              onValueChange={setLanguage}
              searchable
              description="Languages organized by region"
            />
          </div>
        </div>

        {/* 5. With Icons */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
              5. Options with Icons
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mt-1">
              Visual indicators for each option
            </p>
          </div>

          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden divide-y divide-foundation-bg-light-3 dark:divide-foundation-bg-dark-3">
            <SettingDropdownBlock
              icon={<IconSparkles />}
              label="Theme (With Icons)"
              value={theme}
              options={themeOptions}
              onValueChange={setTheme}
            />
            <SettingDropdownBlock
              icon={<IconHeadphones />}
              label="Sound Volume"
              value={soundVolume}
              options={soundVolumeOptions}
              onValueChange={setSoundVolume}
            />
            <SettingDropdownBlock
              icon={<IconSparkles />}
              label="AI Model (With Icons)"
              value={model}
              options={modelOptions}
              onValueChange={setModel}
            />
          </div>
        </div>

        {/* 6. States */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
              6. States
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mt-1">
              Loading, disabled, and error states
            </p>
          </div>

          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden divide-y divide-foundation-bg-light-3 dark:divide-foundation-bg-dark-3">
            <SettingDropdownBlock
              icon={<IconSparkles />}
              label="Loading State"
              value={model}
              options={modelOptions}
              onValueChange={setModel}
              loading
            />
            <SettingDropdownBlock
              icon={<IconUserLock />}
              label="Disabled State"
              value={theme}
              options={themeOptions}
              onValueChange={setTheme}
              disabled
            />
            <SettingDropdownBlock
              icon={<IconNotification />}
              label="Error State"
              value={notifications}
              options={notificationOptions}
              onValueChange={setNotifications}
              error="Failed to load notification settings"
            />
          </div>
        </div>

        {/* 7. With Badges */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
              7. With Badges
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mt-1">
              Status indicators and labels
            </p>
          </div>

          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden divide-y divide-foundation-bg-light-3 dark:divide-foundation-bg-dark-3">
            <SettingDropdownBlock
              icon={<IconSparkles />}
              label="AI Model"
              value={model}
              options={modelOptions}
              onValueChange={setModel}
              badge={<SettingRowBadge variant="new">New</SettingRowBadge>}
            />
            <SettingDropdownBlock
              icon={<IconSparkles />}
              label="Performance Mode"
              value={powerMode}
              options={powerModeOptions}
              onValueChange={setPowerMode}
              badge={<SettingRowBadge variant="primary">Pro</SettingRowBadge>}
            />
            <SettingDropdownBlock
              icon={<IconWifi />}
              label="Network Mode"
              value={networkMode}
              options={networkModeOptions}
              onValueChange={setNetworkMode}
              badge={<SettingRowBadge variant="success">Active</SettingRowBadge>}
            />
          </div>
        </div>

        {/* 8. Disabled Options */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
              8. Disabled Options
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mt-1">
              Some options can be disabled
            </p>
          </div>

          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden">
            <SettingDropdownBlock
              icon={<IconWifi />}
              label="Network Mode"
              value={networkMode}
              options={networkModeOptions}
              onValueChange={setNetworkMode}
              description="Offline mode is currently unavailable"
            />
          </div>
        </div>

        {/* 9. Dropdown Groups */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
              9. Dropdown Groups
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mt-1">
              Organize related dropdowns together
            </p>
          </div>

          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden">
            <SettingDropdownGroup label="Display Settings" description="Customize your visual experience">
              <SettingDropdownBlock
                icon={<IconSparkles />}
                label="Theme"
                value={theme}
                options={themeOptions}
                onValueChange={setTheme}
              />
              <SettingDropdownBlock
                icon={<IconImage />}
                label="Font Size"
                value={fontSize}
                options={fontSizeOptions}
                onValueChange={setFontSize}
              />
            </SettingDropdownGroup>
          </div>
        </div>

        {/* 10. Real-World Examples */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
              10. Real-World Examples
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mt-1">
              Complete settings panels
            </p>
          </div>

          {/* Display Preferences */}
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden">
            <SettingDropdownGroup label="Display Preferences">
              <SettingDropdownBlock
                icon={<IconSparkles />}
                label="Appearance"
                value={theme}
                options={themeOptions}
                onValueChange={setTheme}
                description="Choose your preferred color theme"
              />
              <SettingDropdownBlock
                icon={<IconImage />}
                label="Text Size"
                value={fontSize}
                options={fontSizeOptions}
                onValueChange={setFontSize}
                description="Adjust text size for readability"
              />
            </SettingDropdownGroup>
          </div>

          {/* Localization */}
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden">
            <SettingDropdownGroup label="Localization">
              <SettingDropdownBlock
                icon={<IconGlobe />}
                label="Language"
                value={language}
                options={languageOptions}
                onValueChange={setLanguage}
                searchable
              />
              <SettingDropdownBlock
                icon={<IconGlobe />}
                label="Region"
                value={region}
                options={regionOptions}
                onValueChange={setRegion}
              />
              <SettingDropdownBlock
                icon={<IconCalendar />}
                label="Date Format"
                value={dateFormat}
                options={dateFormatOptions}
                onValueChange={setDateFormat}
              />
              <SettingDropdownBlock
                icon={<IconClock />}
                label="Time Format"
                value={timeFormat}
                options={timeFormatOptions}
                onValueChange={setTimeFormat}
              />
            </SettingDropdownGroup>
          </div>

          {/* System Settings */}
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-hidden">
            <SettingDropdownGroup label="System & Performance">
              <SettingDropdownBlock
                icon={<IconCode />}
                label="Processor Mode"
                value={processor}
                options={processorOptions}
                onValueChange={setProcessor}
                description="Balance performance and efficiency"
              />
              <SettingDropdownBlock
                icon={<IconBatteryFull />}
                label="Power Mode"
                value={powerMode}
                options={powerModeOptions}
                onValueChange={setPowerMode}
              />
              <SettingDropdownBlock
                icon={<IconFolder />}
                label="Storage"
                value={storage}
                options={storageOptions}
                onValueChange={setStorage}
              />
              <SettingDropdownBlock
                icon={<IconWifi />}
                label="Network"
                value={networkMode}
                options={networkModeOptions}
                onValueChange={setNetworkMode}
              />
            </SettingDropdownGroup>
          </div>
        </div>

        {/* 11. Accessibility */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
              11. Accessibility
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mt-1">
              Full ARIA support and keyboard navigation
            </p>
          </div>

          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 p-4 space-y-2">
            <ul className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary space-y-1">
              <li>✓ Proper ARIA labels and roles (listbox, option)</li>
              <li>✓ Keyboard navigation (Tab, Enter, Escape)</li>
              <li>✓ Focus visible states</li>
              <li>✓ Screen reader compatible</li>
              <li>✓ Searchable with keyboard</li>
              <li>✓ Disabled state handling</li>
              <li>✓ Error announcements</li>
            </ul>
          </div>
        </div>

        {/* 12. Design Token Compliance */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
              12. Design Token Compliance
            </h2>
            <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mt-1">
              100% ChatGPT design system compliance
            </p>
          </div>

          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-2">
                  Colors
                </h4>
                <ul className="text-xs text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary space-y-1">
                  <li>• foundation-bg-* (backgrounds)</li>
                  <li>• foundation-text-* (text colors)</li>
                  <li>• foundation-accent-* (accents)</li>
                  <li>• foundation-icon-* (icons)</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-2">
                  Interactions
                </h4>
                <ul className="text-xs text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary space-y-1">
                  <li>• Smooth transitions (200ms)</li>
                  <li>• Hover/focus states</li>
                  <li>• Click outside handling</li>
                  <li>• Auto-close on select</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-2">
                  Features
                </h4>
                <ul className="text-xs text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary space-y-1">
                  <li>• Searchable options</li>
                  <li>• Grouped options</li>
                  <li>• Icons & badges</li>
                  <li>• Loading & error states</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-2">
                  Typography
                </h4>
                <ul className="text-xs text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary space-y-1">
                  <li>• System font stack</li>
                  <li>• Size variants (sm/md/lg)</li>
                  <li>• Proper truncation</li>
                  <li>• Line clamping</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
