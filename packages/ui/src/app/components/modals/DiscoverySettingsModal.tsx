import { useEffect, useState } from "react";

import { ModalDialog, ModalHeader, ModalBody } from "../ui/overlays/modal";
import { SectionHeader } from "../ui/base/section-header";
import { SegmentedControl } from "../ui/base/segmented-control";
import { Toggle } from "../ui/base/toggle";
import { RangeSlider } from "../ui/forms/range-slider";

interface DiscoverySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  promptEnhancement: "rewrite" | "augment" | "preserve";
  onPromptEnhancementChange: (mode: "rewrite" | "augment" | "preserve") => void;
  targetSize: number;
  onTargetSizeChange: (size: number) => void;
}

export function DiscoverySettingsModal({
  isOpen,
  onClose,
  promptEnhancement: externalPromptEnhancement,
  onPromptEnhancementChange,
  targetSize: externalTargetSize,
  onTargetSizeChange,
}: DiscoverySettingsModalProps) {
  // Sync local state with props when modal opens or props change
  useEffect(() => {
    if (!isOpen) return;
    setTargetSize(externalTargetSize);
    setPromptEnhancement(externalPromptEnhancement);
  }, [isOpen, externalTargetSize, externalPromptEnhancement]);

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
      className="px-3 py-1.5 text-[13px] font-normal leading-[18px] text-foundation-accent-green-light dark:text-foundation-accent-green bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-2 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3 rounded-lg transition-colors flex items-center gap-1.5"
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
    >
      <ModalHeader
        title="Discovery Settings"
        titleId="discovery-settings-title"
        showClose
        onClose={onClose}
        actions={resetButton}
      />

      <ModalBody className="space-y-6">
        <div>
          <SectionHeader
            title="Token Budgets"
            description="Sets the target size for your final prompt. Use 60k for ChatGPT (lite Pro context), higher for CLIAPI tools with larger context windows."
            descriptionClassName="text-[13px] font-normal leading-[18px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mb-4"
          />
          <RangeSlider
            label="Target size"
            value={targetSize}
            onChange={handleTargetSizeChange}
            min={20}
            max={100}
            suffix="k"
          />
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowAutoPlanBudget(!showAutoPlanBudget)}
              className="flex items-center gap-2 text-[13px] font-normal leading-[18px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary hover:text-foundation-text-light-primary dark:hover:text-foundation-text-dark-primary transition-colors w-full"
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
                className="size-3.5 text-foundation-accent-orange"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Auto Plan Budget</span>
              <span className="ml-auto text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">{autoPlanBudget}k</span>
            </button>

            {showAutoPlanBudget && (
              <div className="mt-3 ml-5 space-y-3">
                <p className="text-[12px] font-normal leading-[16px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                  Auto Plan runs use CLI/API calls which support larger context windows.
                </p>
                <RangeSlider
                  label="Target size"
                  value={autoPlanBudget}
                  onChange={setAutoPlanBudget}
                  min={20}
                  max={100}
                  suffix="k"
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
          <SegmentedControl
            value={promptEnhancement}
            options={[
              { value: "rewrite", label: "Rewrite" },
              { value: "augment", label: "Augment" },
              { value: "preserve", label: "Preserve" },
            ]}
            onChange={handlePromptEnhancementChange}
          />
          <p className="text-[12px] font-normal leading-[16px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            {getEnhancementDescription()}
          </p>
        </div>

        <div>
          <SectionHeader
            title="Clarifying Questions"
            description="Allow the agent to ask you questions during discovery to better understand your intent."
            descriptionClassName="text-[13px] font-normal leading-[18px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mb-4"
          />
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <svg
                    className="size-5 text-foundation-accent-blue"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 15c0-4.625-3.507-8.441-8-8.941V4h-2v2.059c-4.493.5-8 4.316-8 8.941v2l-2 2v1h22v-1l-2-2v-2zm-9 5c1.103 0 2-.897 2-2h-4c0 1.103.897 2 2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-medium leading-[18px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-0.5">
                    Manual Runs (UI)
                  </div>
                  <div className="text-[12px] font-normal leading-[16px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                    When you click Run Discovery
                  </div>
                </div>
              </div>
              <Toggle
                checked={manualRuns}
                onChange={setManualRuns}
                ariaLabel="Manual runs"
              />
            </div>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <svg
                    className="size-5 text-foundation-accent-green"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 3h18v2H3V3zm0 16h18v2H3v-2zm0-8h18v2H3v-2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-medium leading-[18px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-0.5">
                    MCP Runs
                  </div>
                  <div className="text-[12px] font-normal leading-[16px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                    When called via context_builder
                  </div>
                </div>
              </div>
              <Toggle checked={mcpRuns} onChange={setMcpRuns} ariaLabel="MCP runs" />
            </div>
          </div>
        </div>

        <div>
          <SectionHeader
            title="Text Format"
            description="Choose the format for the output text."
          />
          <SegmentedControl
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
          <SectionHeader
            title="Reasoning Effort"
            description="Set the level of reasoning effort for the agent."
          />
          <SegmentedControl
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
          <SectionHeader
            title="Verbosity"
            description="Set the level of verbosity for the agent's output."
          />
          <SegmentedControl
            value={verbosity}
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ]}
            onChange={setVerbosity}
          />
        </div>

        <div>
          <SectionHeader
            title="Store Logs"
            description="Enable or disable logging of the agent's actions."
          />
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <svg
                  className="size-5 text-foundation-accent-blue"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 15c0-4.625-3.507-8.441-8-8.941V4h-2v2.059c-4.493.5-8 4.316-8 8.941v2l-2 2v1h22v-1l-2-2v-2zm-9 5c1.103 0 2-.897 2-2h-4c0 1.103.897 2 2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-medium leading-[18px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-0.5">
                  Store Logs
                </div>
                <div className="text-[12px] font-normal leading-[16px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                  Enable logging for debugging and analysis
                </div>
              </div>
            </div>
            <Toggle checked={storeLogs} onChange={setStoreLogs} ariaLabel="Store logs" />
          </div>
        </div>
      </ModalBody>

      <div className="border-t border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 px-6 py-4 flex items-center justify-center">
        <div className="flex items-center gap-2 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg px-4 py-2">
          <svg
            className="size-5 text-foundation-accent-blue"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          <span className="text-[14px] font-medium leading-[20px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary">{targetSize}k</span>
          <span className="text-[13px] font-normal leading-[18px] text-foundation-accent-green-light dark:text-foundation-accent-green capitalize">
            {promptEnhancement}
          </span>
        </div>
      </div>
    </ModalDialog>
  );
}
