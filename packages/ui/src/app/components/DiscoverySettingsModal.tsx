import { useState } from "react";
import { IconX } from "../../icons";

interface DiscoverySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  promptEnhancement: 'rewrite' | 'augment' | 'preserve';
  onPromptEnhancementChange: (mode: 'rewrite' | 'augment' | 'preserve') => void;
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
      <h3 className="text-[14px] font-medium leading-[20px] text-white mb-2">{title}</h3>
      <p
        className={
          descriptionClassName ||
          "text-[13px] font-normal leading-[18px] text-[var(--foundation-text-dark-tertiary)] mb-3"
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
        <label className="text-[13px] font-normal leading-[18px] text-white/80">
          {label}
        </label>
        <span className="text-[13px] font-medium leading-[18px] text-white">{value}k</span>
      </div>
      <input
        type="range"
        min="20"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
        style={{ background }}
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
    <div className="flex gap-2 mb-3">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-4 py-2 rounded-lg text-[13px] font-normal leading-[18px] transition-colors ${
            value === option.value
              ? "bg-[var(--foundation-accent-green)] text-[var(--foundation-text-light-primary)]"
              : "bg-[var(--foundation-bg-dark-2)] text-white/60 hover:text-white"
          }`}
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
          <div className="text-[13px] font-medium leading-[18px] text-white mb-0.5">
            {title}
          </div>
          <div className="text-[12px] font-normal leading-[16px] text-white/50">
            {description}
          </div>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
          checked ? "bg-[var(--foundation-accent-green)]" : "bg-white/20"
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 size-5 bg-white rounded-full transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
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
  const [textFormat, setTextFormat] = useState<'text' | 'markdown' | 'xml' | 'json'>('text');
  const [reasoningEffort, setReasoningEffort] = useState<'low' | 'medium' | 'high'>('medium');
  const [verbosity, setVerbosity] = useState<'low' | 'medium' | 'high'>('medium');
  const [storeLogs, setStoreLogs] = useState(true);

  const handlePromptEnhancementChange = (mode: 'rewrite' | 'augment' | 'preserve') => {
    setPromptEnhancement(mode);
    onPromptEnhancementChange(mode);
  };

  const handleTargetSizeChange = (size: number) => {
    setTargetSize(size);
    onTargetSizeChange(size);
  };

  if (!isOpen) return null;

  const handleReset = () => {
    setTargetSize(60);
    setShowAutoPlanBudget(false);
    setAutoPlanBudget(80);
    setPromptEnhancement('rewrite');
    setManualRuns(true);
    setMcpRuns(true);
    setTextFormat('text');
    setReasoningEffort('medium');
    setVerbosity('medium');
    setStoreLogs(true);
  };

  const getEnhancementDescription = () => {
    switch (promptEnhancement) {
      case 'rewrite':
        return 'Agent writes a new prompt based on what it discovered about the codebase.';
      case 'augment':
        return 'Keeps your original instructions and appends relevant context from discoveries.';
      case 'preserve':
        return 'Leaves your instructions unchanged. Only updates the file selection.';
    }
  };

  const targetSizeBackground = `linear-gradient(to right, var(--foundation-accent-green) 0%, var(--foundation-accent-green) ${(targetSize - 20) / 0.8}%, rgba(255,255,255,0.1) ${(targetSize - 20) / 0.8}%, rgba(255,255,255,0.1) 100%)`;
  const autoPlanBackground = `linear-gradient(to right, var(--foundation-accent-green) 0%, var(--foundation-accent-green) ${(autoPlanBudget - 20) / 0.8}%, rgba(255,255,255,0.1) ${(autoPlanBudget - 20) / 0.8}%, rgba(255,255,255,0.1) 100%)`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-[var(--foundation-bg-dark-1)] border border-white/10 rounded-xl w-[420px] max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-[16px] font-semibold leading-[24px] tracking-[-0.32px] text-white">
            Discovery Settings
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-[13px] font-normal leading-[18px] text-[var(--foundation-accent-green)] hover:bg-white/5 rounded-lg transition-colors flex items-center gap-1.5"
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
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <IconX className="size-4 text-white/60" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <SectionHeader
              title="Token Budgets"
              description="Sets the target size for your final prompt. Use 60k for ChatGPT (lite Pro context), higher for CLIAPI tools with larger context windows."
              descriptionClassName="text-[13px] font-normal leading-[18px] text-white/60 mb-4"
            />
            <RangeSlider
              label="Target size"
              value={targetSize}
              onChange={handleTargetSizeChange}
              background={targetSizeBackground}
            />
            <div className="mt-3">
              <button
                onClick={() => setShowAutoPlanBudget(!showAutoPlanBudget)}
                className="flex items-center gap-2 text-[13px] font-normal leading-[18px] text-white/80 hover:text-white transition-colors w-full"
              >
                <svg 
                  className={`size-3 transition-transform ${showAutoPlanBudget ? 'rotate-90' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <svg className="size-3.5 text-[var(--foundation-accent-orange)]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Auto Plan Budget</span>
                <span className="ml-auto text-white/60">{autoPlanBudget}k</span>
              </button>

              {showAutoPlanBudget && (
                <div className="mt-3 ml-5 space-y-3">
                  <p className="text-[12px] font-normal leading-[16px] text-white/50">
                    Auto Plan runs use CLI/API calls which support larger context windows.
                  </p>
                  <RangeSlider
                    label="Target size"
                    value={autoPlanBudget}
                    onChange={setAutoPlanBudget}
                    background={autoPlanBackground}
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
                { value: 'rewrite', label: 'Rewrite' },
                { value: 'augment', label: 'Augment' },
                { value: 'preserve', label: 'Preserve' },
              ]}
              onChange={handlePromptEnhancementChange}
            />
            <p className="text-[12px] font-normal leading-[16px] text-white/50">
              {getEnhancementDescription()}
            </p>
          </div>

          <div>
            <SectionHeader
              title="Clarifying Questions"
              description="Allow the agent to ask you questions during discovery to better understand your intent."
              descriptionClassName="text-[13px] font-normal leading-[18px] text-white/60 mb-4"
            />
            <div className="space-y-4">
              <ToggleRow
                icon={
                  <svg className="size-5 text-[var(--foundation-accent-blue)]" fill="currentColor" viewBox="0 0 24 24">
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
                  <svg className="size-5 text-[var(--foundation-accent-green)]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 3h18v2H3V3zm0 16h18v2H3v-2zm0-8h18v2H3v-2z" />
                  </svg>
                }
                title="MCP Runs"
                description="When called via context_builder"
                checked={mcpRuns}
                onToggle={() => setMcpRuns(!mcpRuns)}
              />
            </div>
          </div>

          <div>
            <SectionHeader
              title="Text Format"
              description="Choose the format for the output text."
            />
            <SegmentedButtons
              value={textFormat}
              options={[
                { value: 'text', label: 'Text' },
                { value: 'markdown', label: 'Markdown' },
                { value: 'xml', label: 'XML' },
                { value: 'json', label: 'JSON' },
              ]}
              onChange={setTextFormat}
            />
          </div>

          <div>
            <SectionHeader
              title="Reasoning Effort"
              description="Set the level of reasoning effort for the agent."
            />
            <SegmentedButtons
              value={reasoningEffort}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
              ]}
              onChange={setReasoningEffort}
            />
          </div>

          <div>
            <SectionHeader
              title="Verbosity"
              description="Set the level of verbosity for the agent's output."
            />
            <SegmentedButtons
              value={verbosity}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
              ]}
              onChange={setVerbosity}
            />
          </div>

          <div>
            <SectionHeader
              title="Store Logs"
              description="Enable or disable logging of the agent's actions."
            />
            <ToggleRow
              icon={
                <svg className="size-5 text-[var(--foundation-accent-blue)]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 15c0-4.625-3.507-8.441-8-8.941V4h-2v2.059c-4.493.5-8 4.316-8 8.941v2l-2 2v1h22v-1l-2-2v-2zm-9 5c1.103 0 2-.897 2-2h-4c0 1.103.897 2 2 2z" />
                </svg>
              }
              title="Store Logs"
              description="Enable logging for debugging and analysis"
              checked={storeLogs}
              onToggle={() => setStoreLogs(!storeLogs)}
            />
          </div>
        </div>

        <div className="border-t border-white/10 px-6 py-4 flex items-center justify-center">
          <div className="flex items-center gap-2 bg-[var(--foundation-bg-dark-1)] border border-white/10 rounded-lg px-4 py-2">
            <svg className="size-5 text-[var(--foundation-accent-blue)]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <span className="text-[14px] font-medium leading-[20px] text-white">
              {targetSize}k
            </span>
            <span className="text-[13px] font-normal leading-[18px] text-[var(--foundation-accent-green)] capitalize">
              {promptEnhancement}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
