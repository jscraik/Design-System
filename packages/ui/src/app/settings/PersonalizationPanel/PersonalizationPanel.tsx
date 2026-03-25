import { useState } from "react";

import { IconBook, IconChevronDownMd, IconChevronRightMd } from "../../../icons/ChatGPTIcons";
import { type DropdownOption, SettingDropdown } from "../SettingDropdown";
import { SettingRow } from "../SettingRow";
import { SettingToggle } from "../SettingToggle";
import { SettingsPanelShell } from "../shared/SettingsPanelShell";
import type { SettingsPanelProps } from "../shared/types";

const fieldClassName =
  "w-full rounded-lg border border-border bg-secondary px-3 py-2 text-body-small text-foreground transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const sectionClassName = "space-y-3";
const labelClassName = "block px-3 text-body-small font-semibold text-foreground";

export function PersonalizationPanel({ onBack }: SettingsPanelProps) {
  const [baseStyle, setBaseStyle] = useState("Efficient");
  const [warmStyle, setWarmStyle] = useState("Default");
  const [enthusiasticStyle, setEnthusiasticStyle] = useState("Default");
  const [headersListsStyle, setHeadersListsStyle] = useState("Default");
  const [emojiStyle, setEmojiStyle] = useState("Default");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [webSearch, setWebSearch] = useState(true);
  const [codeEnabled, setCodeEnabled] = useState(true);
  const [canvasEnabled, setCanvasEnabled] = useState(true);
  const [advancedVoice, setAdvancedVoice] = useState(true);

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
    <SettingsPanelShell title="Personalization" onBack={onBack}>
      <div className="space-y-5">
        <SettingDropdown
          label="Base style and tone"
          value={baseStyle}
          options={baseStyleOptions}
          onValueChange={setBaseStyle}
          description="This is the main voice and tone ChatGPT uses in your conversations. This doesn't impact ChatGPT's capabilities."
        />

        <section className={sectionClassName}>
          <h3 className={labelClassName}>Characteristics</h3>

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

          <p className="px-3 text-caption text-muted-foreground">
            Choose some additional customizations on top of your base style and tone.
          </p>
        </section>

        <section className={sectionClassName}>
          <label htmlFor="personalization-instructions" className={labelClassName}>
            Custom instructions
          </label>
          <textarea
            id="personalization-instructions"
            aria-label="Custom instructions"
            className={`${fieldClassName} resize-none`}
            rows={2}
            defaultValue="Be habitual and conversational"
            placeholder="Enter custom instructions..."
          />
        </section>

        <section className={sectionClassName}>
          <label htmlFor="personalization-nickname" className={labelClassName}>
            Your nickname
          </label>
          <input
            id="personalization-nickname"
            type="text"
            aria-label="Your nickname"
            className={fieldClassName}
            defaultValue="Jamie"
            placeholder="Enter your nickname..."
          />
        </section>

        <section className={sectionClassName}>
          <label htmlFor="personalization-occupation" className={labelClassName}>
            Your occupation
          </label>
          <input
            id="personalization-occupation"
            type="text"
            aria-label="Your occupation"
            className={fieldClassName}
            defaultValue="AI System Architect & Dev"
            placeholder="Enter your occupation..."
          />
        </section>

        <section className={sectionClassName}>
          <label htmlFor="personalization-about" className={labelClassName}>
            More about you
          </label>
          <input
            id="personalization-about"
            type="text"
            aria-label="More about you"
            className={fieldClassName}
            defaultValue="Ai, Dev"
            placeholder="Tell us more about yourself..."
          />
        </section>

        <section className={sectionClassName}>
          <SettingRow
            icon={<IconBook className="size-4 text-text-secondary" />}
            label="Memory"
            onClick={() => {}}
            right={<IconChevronRightMd className="size-4 text-muted-foreground" />}
          />
        </section>

        <section className={sectionClassName}>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span className="text-body-small text-foreground">Advanced</span>
            <IconChevronDownMd
              className={`size-4 text-muted-foreground transition-transform ${showAdvanced ? "" : "-rotate-90"}`}
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
        </section>
      </div>
    </SettingsPanelShell>
  );
}
