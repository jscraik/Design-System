import { useState } from "react";

import { IconBook, IconChevronDownMd, IconChevronLeftMd, IconChevronRightMd } from "./icons/ChatGPTIcons";
import { SettingDropdown, type DropdownOption } from "./SettingDropdown";
import { SettingToggle } from "./SettingToggle";
import { SettingRow } from "./SettingRow";
import type { SettingsPanelProps } from "./types";

export function PersonalizationPanel({ onBack }: SettingsPanelProps) {
  // Base style state
  const [baseStyle, setBaseStyle] = useState("Efficient");
  
  // Characteristics state
  const [warmStyle, setWarmStyle] = useState("Default");
  const [enthusiasticStyle, setEnthusiasticStyle] = useState("Default");
  const [headersListsStyle, setHeadersListsStyle] = useState("Default");
  const [emojiStyle, setEmojiStyle] = useState("Default");
  
  // Advanced section state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [webSearch, setWebSearch] = useState(true);
  const [codeEnabled, setCodeEnabled] = useState(true);
  const [canvasEnabled, setCanvasEnabled] = useState(true);
  const [advancedVoice, setAdvancedVoice] = useState(true);

  // Dropdown options
  const baseStyleOptions: DropdownOption[] = [
    { value: "Default", label: "Default", description: "Preset style and tone" },
    { value: "Professional", label: "Professional", description: "Polished and precise" },
    { value: "Friendly", label: "Friendly", description: "Warm and chatty" },
    { value: "Candid", label: "Candid", description: "Direct and encouraging" },
    { value: "Quirky", label: "Quirky", description: "Playful and imaginative" },
    { value: "Efficient", label: "Efficient", description: "Concise and plain" },
    { value: "Nerdy", label: "Nerdy", description: "Exploratory and enthusiastic" },
    { value: "Cynical", label: "Cynical", description: "Critical and sarcastic" },
  ];

  const characteristicOptions: DropdownOption[] = [
    { value: "More", label: "More" },
    { value: "Default", label: "Default" },
    { value: "Less", label: "Less" },
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
          Personalization
        </h2>
      </div>

      <div className="overflow-y-auto max-h-[calc(85vh-80px)] px-6 py-4">
        {/* Base style and tone */}
        <div className="mb-5">
          <SettingDropdown
            label="Base style and tone"
            value={baseStyle}
            options={baseStyleOptions}
            onValueChange={setBaseStyle}
            description="This is the main voice and tone ChatGPT uses in your conversations. This doesn't impact ChatGPT's capabilities."
          />
        </div>

        {/* Characteristics */}
        <div className="mb-5">
          <h3 className="text-[14px] font-semibold leading-[20px] tracking-[-0.3px] text-[var(--foundation-text-dark-primary)] mb-2 px-3">
            Characteristics
          </h3>

          <div className="space-y-0.5">
            <SettingDropdown
              label="Warm"
              value={warmStyle}
              options={characteristicOptions}
              onValueChange={setWarmStyle}
            />

            <SettingDropdown
              label="Enthusiastic"
              value={enthusiasticStyle}
              options={characteristicOptions}
              onValueChange={setEnthusiasticStyle}
            />

            <SettingDropdown
              label="Headers & Lists"
              value={headersListsStyle}
              options={characteristicOptions}
              onValueChange={setHeadersListsStyle}
            />

            <SettingDropdown
              label="Emoji"
              value={emojiStyle}
              options={characteristicOptions}
              onValueChange={setEmojiStyle}
            />
          </div>

          <p className="text-[13px] leading-[18px] tracking-[-0.32px] text-[var(--foundation-text-dark-tertiary)] px-3 mt-3">
            Choose some additional customizations on top of your base style and tone.
          </p>
        </div>

        {/* Custom instructions */}
        <div className="mb-5">
          <h3 className="text-[14px] font-semibold leading-[20px] tracking-[-0.3px] text-[var(--foundation-text-dark-primary)] mb-2 px-3">
            Custom instructions
          </h3>
          <textarea 
            className="w-full px-3 py-2 text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-[var(--foundation-text-dark-primary)] bg-[var(--foundation-bg-dark-2)] border border-[var(--foundation-text-dark-primary)]/10 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-[var(--foundation-text-dark-primary)]/20 transition-all"
            rows={2}
            defaultValue="Be habitual and conversational"
            placeholder="Enter custom instructions..."
          />
        </div>

        {/* Your nickname */}
        <div className="mb-5">
          <h3 className="text-[14px] font-semibold leading-[20px] tracking-[-0.3px] text-[var(--foundation-text-dark-primary)] mb-2 px-3">
            Your nickname
          </h3>
          <input
            type="text"
            className="w-full px-3 py-2 text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-[var(--foundation-text-dark-primary)] bg-[var(--foundation-bg-dark-2)] border border-[var(--foundation-text-dark-primary)]/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--foundation-text-dark-primary)]/20 transition-all"
            defaultValue="Jamie"
            placeholder="Enter your nickname..."
          />
        </div>

        {/* Your occupation */}
        <div className="mb-5">
          <h3 className="text-[14px] font-semibold leading-[20px] tracking-[-0.3px] text-[var(--foundation-text-dark-primary)] mb-2 px-3">
            Your occupation
          </h3>
          <input
            type="text"
            className="w-full px-3 py-2 text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-[var(--foundation-text-dark-primary)] bg-[var(--foundation-bg-dark-2)] border border-[var(--foundation-text-dark-primary)]/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--foundation-text-dark-primary)]/20 transition-all"
            defaultValue="AI System Architect & Dev"
            placeholder="Enter your occupation..."
          />
        </div>

        {/* More about you */}
        <div className="mb-5">
          <h3 className="text-[14px] font-semibold leading-[20px] tracking-[-0.3px] text-[var(--foundation-text-dark-primary)] mb-2 px-3">
            More about you
          </h3>
          <input
            type="text"
            className="w-full px-3 py-2 text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-[var(--foundation-text-dark-primary)] bg-[var(--foundation-bg-dark-2)] border border-[var(--foundation-text-dark-primary)]/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--foundation-text-dark-primary)]/20 transition-all"
            defaultValue="Ai, Dev"
            placeholder="Tell us more about yourself..."
          />
        </div>

        {/* Memory */}
        <div className="mb-5">
          <SettingRow
            icon={<IconBook className="size-4 text-[var(--foundation-icon-dark-secondary)]" />}
            label="Memory"
            onClick={() => {}}
            right={<IconChevronRightMd className="size-4 text-[var(--foundation-icon-dark-tertiary)]" />}
          />
        </div>

        {/* Advanced section */}
        <div className="mb-5">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-[var(--foundation-bg-dark-2)] rounded-lg transition-colors mb-2"
          >
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-[var(--foundation-text-dark-primary)]">
              Advanced
            </span>
            <IconChevronDownMd
              className={`size-4 text-[var(--foundation-icon-dark-tertiary)] transition-transform ${showAdvanced ? "" : "-rotate-90"}`}
            />
          </button>

          {showAdvanced && (
            <div className="space-y-0.5">
              <SettingToggle
                checked={webSearch}
                onCheckedChange={setWebSearch}
                label="Web Search"
                description="Automatically search the web to get answers"
              />

              <SettingToggle
                checked={codeEnabled}
                onCheckedChange={setCodeEnabled}
                label="Code"
                description="Execute code using Code Interpreter"
              />

              <SettingToggle
                checked={canvasEnabled}
                onCheckedChange={setCanvasEnabled}
                label="Canvas"
                description="Work with ChatGPT on text and code"
              />

              <SettingToggle
                checked={advancedVoice}
                onCheckedChange={setAdvancedVoice}
                label="Advanced voice"
                description="More natural conversations in voice mode"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}