import { useEffect, useRef, useState } from "react";

import { ModalDialog } from "../../../components/ui/overlays/modal";
import { cn } from "../../../components/ui/utils";

interface DiscoverySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  promptEnhancement: "rewrite" | "augment" | "preserve";
  onPromptEnhancementChange: (mode: "rewrite" | "augment" | "preserve") => void;
  targetSize: number;
  onTargetSizeChange: (size: number) => void;
}

function SectionHeader({
  title,
  description,
  descriptionClassName,
}: {
  title: string;
  description: string;
  descriptionClassName?: string;
}) {
  return (
    <>
      <h3 className="text-body-small font-medium text-foreground dark:text-foreground mb-2">
        {title}
      </h3>
      <p
        className={
          descriptionClassName ?? "text-caption text-text-secondary dark:text-text-secondary mb-3"
        }
      >
        {description}
      </p>
    </>
  );
}

function RangeSlider({
  label,
  value,
  onChange,
  background,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  background: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-caption text-text-secondary dark:text-text-secondary">{label}</label>
        <span className="text-caption font-medium text-foreground dark:text-foreground">
          {value}k
        </span>
      </div>
      <input
        type="range"
        min="20"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-background dark:[&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-background dark:[&::-moz-range-thumb]:bg-foreground [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
        style={{ background }}
        aria-label={label}
      />
    </div>
  );
}

function SegmentedButtons<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "px-4 py-2 rounded-lg text-caption transition-colors flex-1 min-w-[80px]",
            value === option.value
              ? "bg-accent-green text-foreground"
              : "bg-secondary text-text-secondary hover:text-foreground dark:bg-muted dark:text-text-secondary dark:hover:text-foreground",
          )}
          aria-pressed={value === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function ToggleRow({
  icon,
  title,
  description,
  checked,
  onToggle,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{icon}</div>
        <div className="flex-1">
          <div className="text-caption font-medium text-foreground dark:text-foreground mb-0.5">
            {title}
          </div>
          <div className="text-caption font-normal text-text-secondary dark:text-text-secondary">
            {description}
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0",
          checked ? "bg-accent-green" : "bg-muted dark:bg-muted",
        )}
        role="switch"
        aria-checked={checked}
        aria-label={title}
      >
        <span
          className={cn(
            "inline-block size-4 transform rounded-full bg-background dark:bg-foreground transition-transform",
            checked ? "translate-x-[18px]" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  );
}

export function DiscoverySettingsModal({
  isOpen,
  onClose,
  promptEnhancement: externalPromptEnhancement,
  onPromptEnhancementChange,
  targetSize: externalTargetSize,
  onTargetSizeChange,
}: DiscoverySettingsModalProps) {
  const [targetSize, setTargetSize] = useState(externalTargetSize);
  const [showAutoPlanBudget, setShowAutoPlanBudget] = useState(false);
  const [autoPlanBudget, setAutoPlanBudget] = useState(80);
  const [promptEnhancement, setPromptEnhancement] = useState(externalPromptEnhancement);
  const [manualRuns, setManualRuns] = useState(true);
  const [mcpRuns, setMcpRuns] = useState(true);
  const [textFormat, setTextFormat] = useState<"text" | "markdown" | "xml" | "json">("text");
  const [reasoningEffort, setReasoningEffort] = useState<"low" | "medium" | "high">("medium");
  const [verbosity, setVerbosity] = useState<"low" | "medium" | "high">("medium");
  const [storeLogs, setStoreLogs] = useState(true);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      setTargetSize(externalTargetSize);
      setPromptEnhancement(externalPromptEnhancement);
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, externalTargetSize, externalPromptEnhancement]);

  const handlePromptEnhancementChange = (mode: "rewrite" | "augment" | "preserve") => {
    setPromptEnhancement(mode);
    onPromptEnhancementChange(mode);
  };

  const handleTargetSizeChange = (size: number) => {
    setTargetSize(size);
    onTargetSizeChange(size);
  };

  const handleReset = () => {
    const nextSize = 60;
    const nextMode = "rewrite" as const;

    setTargetSize(nextSize);
    onTargetSizeChange(nextSize);

    setPromptEnhancement(nextMode);
    onPromptEnhancementChange(nextMode);

    setShowAutoPlanBudget(false);
    setAutoPlanBudget(80);
    setManualRuns(true);
    setMcpRuns(true);
    setTextFormat("text");
    setReasoningEffort("medium");
    setVerbosity("medium");
    setStoreLogs(true);
  };

  const getEnhancementDescription = () => {
    switch (promptEnhancement) {
      case "rewrite":
        return "Agent writes a new prompt based on what it discovered about the codebase.";
      case "augment":
        return "Keeps your original instructions and appends relevant context from discoveries.";
      case "preserve":
        return "Leaves your instructions unchanged. Only updates the file selection.";
    }
  };

  const resetButton = (
    <button
      type="button"
      onClick={handleReset}
      className="px-3 py-1.5 text-caption font-normal text-accent-green dark:text-accent-green bg-background dark:bg-secondary border border-muted hover:bg-muted rounded-lg transition-colors flex items-center gap-1.5"
      aria-label="Reset all settings to defaults"
    >
      <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      Reset
    </button>
  );

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Discovery Settings"
      titleId="discovery-settings-title"
      maxWidth="420px"
      className="bg-background dark:bg-background border border-muted dark:border-foreground/10 rounded-[16px] shadow-2xl"
      showOverlay={false}
    >
      <div className="px-6 py-4 border-b border-muted dark:border-foreground/10 flex items-center justify-between">
        <h2
          id="discovery-settings-title"
          className="text-[18px] font-semibold leading-[26px] tracking-[-0.45px] text-foreground dark:text-foreground"
        >
          Discovery Settings
        </h2>
        {resetButton}
      </div>

      <div className="px-6 py-4 space-y-6">
        <div>
          <SectionHeader
            title="Token Budgets"
            description="Sets the target size for your final prompt. Use 60k for ChatGPT (lite Pro context), higher for CLIAPI tools with larger context windows."
            descriptionClassName="text-caption text-text-secondary dark:text-text-secondary mb-3"
          />
          <RangeSlider
            label="Target size"
            value={targetSize}
            onChange={handleTargetSizeChange}
            background="linear-gradient(90deg, rgba(16,163,127,0.3) 0%, rgba(16,163,127,0.3) 100%)"
          />
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowAutoPlanBudget(!showAutoPlanBudget)}
              className="flex items-center gap-2 text-caption font-normal text-text-secondary hover:text-foreground dark:text-text-secondary dark:hover:text-foreground transition-colors w-full"
            >
              <svg
                className={`size-3 transition-transform ${showAutoPlanBudget ? "rotate-90" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <svg
                className="size-3.5 text-accent-orange dark:text-accent-orange"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Auto Plan Budget</span>
              <span className="ml-auto text-text-secondary dark:text-text-secondary">
                {autoPlanBudget}k
              </span>
            </button>

            {showAutoPlanBudget && (
              <div className="mt-3 ml-5 space-y-3">
                <p className="text-caption text-text-secondary dark:text-text-secondary">
                  Auto Plan runs use CLI/API calls which support larger context windows.
                </p>
                <RangeSlider
                  label="Target size"
                  value={autoPlanBudget}
                  onChange={setAutoPlanBudget}
                  background="linear-gradient(90deg, rgba(16,163,127,0.3) 0%, rgba(16,163,127,0.3) 100%)"
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <SectionHeader
            title="Prompt Enhancement"
            description="How the agent modifies your instructions after discovery."
          />
          <SegmentedButtons
            value={promptEnhancement}
            options={[
              { value: "rewrite", label: "Rewrite" },
              { value: "augment", label: "Augment" },
              { value: "preserve", label: "Preserve" },
            ]}
            onChange={handlePromptEnhancementChange}
          />
          <p className="text-caption text-text-secondary dark:text-text-secondary">
            {getEnhancementDescription()}
          </p>
        </div>

        <div>
          <SectionHeader
            title="Clarifying Questions"
            description="Allow the agent to ask you questions during discovery to better understand your intent."
            descriptionClassName="text-caption text-text-secondary dark:text-text-secondary mb-3"
          />
          <div className="space-y-4">
            <ToggleRow
              icon={
                <svg className="size-5 text-accent-blue" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 15c0-4.625-3.507-8.441-8-8.941V4h-2v2.059c-4.493.5-8 4.316-8 8.941v2l-2 2v1h22v-1l-2-2v-2zm-9 5c1.103 0 2-.897 2-2h-4c0 1.103.897 2 2 2z" />
                </svg>
              }
              title="Manual Runs (UI)"
              description="When you click Run Discovery"
              checked={manualRuns}
              onToggle={() => setManualRuns(!manualRuns)}
            />
            <ToggleRow
              icon={
                <svg
                  className="size-5 text-accent-green dark:text-accent-green"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2z" />
                </svg>
              }
              title="MCP Runs"
              description="Auto Plan runs via CLI/API"
              checked={mcpRuns}
              onToggle={() => setMcpRuns(!mcpRuns)}
            />
          </div>
        </div>

        <div>
          <SectionHeader
            title="Output Format"
            description="Set how the agent formats your responses."
          />
          <SegmentedButtons
            value={textFormat}
            options={[
              { value: "text", label: "Text" },
              { value: "markdown", label: "Markdown" },
              { value: "xml", label: "XML" },
              { value: "json", label: "JSON" },
            ]}
            onChange={setTextFormat}
          />
        </div>

        <div>
          <SectionHeader title="Model Behavior" description="Adjust tone and verbosity." />
          <div className="space-y-4">
            <div>
              <div className="text-caption font-medium text-foreground dark:text-foreground mb-1">
                Reasoning effort
              </div>
              <SegmentedButtons
                value={reasoningEffort}
                options={[
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" },
                ]}
                onChange={setReasoningEffort}
              />
            </div>
            <div>
              <div className="text-caption font-medium text-foreground dark:text-foreground mb-1">
                Verbosity
              </div>
              <SegmentedButtons
                value={verbosity}
                options={[
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" },
                ]}
                onChange={setVerbosity}
              />
            </div>
          </div>
        </div>

        <div>
          <SectionHeader title="Data" description="Control session logging." />
          <ToggleRow
            icon={
              <svg
                className="size-5 text-accent-orange dark:text-accent-orange"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2a10 10 0 00-7.07 17.07l-1.42 1.42L5 22l1.42-1.42A10 10 0 1012 2z" />
              </svg>
            }
            title="Store logs"
            description="Save run metadata for debugging"
            checked={storeLogs}
            onToggle={() => setStoreLogs(!storeLogs)}
          />
        </div>
      </div>
    </ModalDialog>
  );
}
