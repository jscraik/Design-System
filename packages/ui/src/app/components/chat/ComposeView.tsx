import { useState } from "react";

import { IconCheckmark, IconChevronDownMd, IconSettings } from "../../../icons";
import { IconOperator } from "../icons/ChatGPTIcons";
import { DiscoverySettingsModal } from "../modals/DiscoverySettingsModal";
import { SegmentedControl } from "../ui/base/segmented-control";
import { Toggle } from "../ui/base/toggle";
import { ModeSelector, type ModeConfig } from "../ui/navigation/mode-selector";
import { ModelSelector, type ModelConfig } from "../ui/navigation/model-selector";

interface ComposeModeConfig extends ModeConfig {
  contextConfig?: {
    mode?: string;
    selectedFiles?: string;
    fileTree?: string;
    codeMap?: string;
    gitDiff?: string;
  };
}

interface ComposeViewProps {
  models?: ModelConfig[];
  modes?: ComposeModeConfig[];
}

const fallbackModel: ModelConfig = {
  name: "Default",
  shortName: "Default",
  description: "Default model",
};

const fallbackMode: ComposeModeConfig = {
  id: "default",
  name: "Default",
  subtitle: "Custom",
  whenToUse: [],
  about: "Default mode configuration.",
  contextConfig: {
    mode: "—",
    selectedFiles: "—",
    fileTree: "—",
    codeMap: "—",
    gitDiff: "—",
  },
};

export function ComposeView({ models, modes }: ComposeViewProps) {
  const resolvedModels = models && models.length > 0 ? models : [fallbackModel];
  const resolvedModes = modes && modes.length > 0 ? modes : [fallbackMode];
  const [selectedModel, setSelectedModel] = useState<ModelConfig>(
    resolvedModels[0] ?? fallbackModel,
  );
  const [selectedMode, setSelectedMode] = useState<ComposeModeConfig>(
    resolvedModes[0] ?? fallbackMode,
  );
  const [activeTab] = useState<"builder" | "rules">("builder");
  const [instructions, setInstructions] = useState("");
  const [promptEnhancement, setPromptEnhancement] = useState<"rewrite" | "augment" | "preserve">(
    "rewrite",
  );
  const [isWebSearchActive, setIsWebSearchActive] = useState(false);
  const [systemMessage, setSystemMessage] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [autoPlan, setAutoPlan] = useState(false);
  const [showDiscoverySettings, setShowDiscoverySettings] = useState(false);
  const [targetSize, setTargetSize] = useState(60);
  const [showTooltip, setShowTooltip] = useState(false);
  const [previewMode, setPreviewMode] = useState<ComposeModeConfig>(
    resolvedModes[5] ?? resolvedModes[0] ?? fallbackMode,
  );
  const [showProEditConfig, setShowProEditConfig] = useState(false);
  const [proEditMode, setProEditMode] = useState<"agent" | "model">("agent");
  const [selectedAgent, setSelectedAgent] = useState("Codex CLI");
  const [selectedModelConfig, setSelectedModelConfig] = useState("GPT-5.2 Codex Medium");

  const handleModeSelect = (mode: ComposeModeConfig) => {
    setSelectedMode(mode);
    setPreviewMode(mode);
    setShowModeSelector(false);
  };

  const handleModeHover = (mode: ComposeModeConfig) => {
    setPreviewMode(mode);
  };

  const getTaskSectionConfig = () => {
    switch (promptEnhancement) {
      case "rewrite":
        return {
          label: "Task Description",
          placeholder:
            'Describe your task here...\n\nExample: "Add a dark mode toggle to the settings page with system, light, and dark options. Store the preference and apply it app-wide."',
          tooltip:
            "Describe your task here.\n\nThe agent will:\n• Analyze your codebase\n• Select relevant files\n• Write detailed instructions above\n\nThis is your primary input in Rewrite mode.",
          buttonText: "Rewrite",
        };
      case "augment":
        return {
          label: "Additional Context (Optional)",
          placeholder:
            "Add extra details to help the agent find relevant files and enhance your prompt",
          tooltip:
            "Add extra context to help the agent.\n\nThe agent will:\n• Keep your existing instructions\n• Add relevant context from discoveries\n• Select appropriate files\n\nLeave empty to just enhance with file context.",
          buttonText: "Augment",
        };
      case "preserve":
        return {
          label: "Discovery Hints (Optional)",
          placeholder: "Describe what files to look for (your instructions won't be modified)",
          tooltip:
            "Provide hints for file discovery.\n\nThe agent will:\n• Only select relevant files\n• Leave your instructions unchanged\n\nUseful when you've already written detailed instructions.",
          buttonText: "Preserve",
        };
    }
  };

  const taskConfig = getTaskSectionConfig();

  return (
    <>
      <div className="flex-1 flex flex-col bg-foundation-bg-dark-1">
        <div className="flex-1 overflow-y-auto">
          <div className="w-full px-8 py-8 space-y-4 overflow-y-auto">
            <div className="bg-foundation-bg-dark-1 border border-white/10 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-foundation-bg-dark-2">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] leading-6 text-white font-medium">
                    Prompt Instructions
                  </span>
                  <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors">
                    <svg
                      className="size-4 text-foundation-text-dark-tertiary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-foundation-bg-dark-2 hover:bg-foundation-bg-dark-3 border border-white/10 text-white rounded-lg transition-colors text-[13px] leading-5">
                  <svg
                    className="size-4 text-foundation-text-dark-tertiary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                    />
                  </svg>
                  Send to Chat
                </button>
              </div>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder=" Enter your prompt's task specific instructions. Use {{template variables}} for dynamic inputs"
                className="w-full h-[187px] bg-foundation-bg-dark-1 px-4 py-3 text-[15px] leading-6 text-foundation-text-dark-primary placeholder:text-foundation-text-dark-primary/40 focus:outline-none resize-none border-0"
              />

              <div className="flex items-center justify-between px-4 py-2 bg-foundation-bg-dark-1 border-t border-white/10">
                <div className="flex items-center gap-1">
                  <button
                    className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
                    title="Add"
                  >
                    <svg
                      className="size-4 text-foundation-text-dark-tertiary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setIsWebSearchActive(!isWebSearchActive)}
                    className={`p-1.5 rounded-md transition-colors relative ${
                      isWebSearchActive ? "bg-foundation-accent-blue/10" : "hover:bg-white/10"
                    }`}
                    title="Web"
                  >
                    <svg
                      className={`size-4 ${
                        isWebSearchActive
                          ? "text-foundation-accent-blue"
                          : "text-foundation-text-dark-tertiary"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                    {isWebSearchActive && (
                      <svg
                        className="size-3 text-foundation-accent-blue absolute top-0.5 right-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    )}
                  </button>
                  <button
                    className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
                    title="Link"
                  >
                    <svg
                      className="size-4 text-foundation-text-dark-tertiary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </button>
                  <button
                    className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
                    title="Refresh"
                  >
                    <svg
                      className="size-4 text-foundation-text-dark-tertiary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors group hover:bg-white/5"
                    title="Tools"
                  >
                    <IconOperator className="size-4 text-white/60 group-hover:text-white" />
                    <span className="hidden text-[14px] font-normal leading-[20px] tracking-[-0.3px]">
                      Apps
                    </span>
                  </button>
                  <div className="ml-1 px-2 py-1 bg-foundation-bg-dark-2 rounded-md">
                    <span className="text-[11px] leading-4 text-foundation-accent-blue font-medium">
                      {selectedModel.shortName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button className="flex items-center gap-1.5 px-2 py-1 hover:bg-white/10 rounded-md transition-colors">
                    <svg
                      className="size-3.5 text-foundation-text-dark-tertiary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span className="text-[12px] leading-4 text-foundation-text-dark-tertiary">
                      Auto-clear
                    </span>
                  </button>
                  <button
                    className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
                    title="Voice"
                  >
                    <svg
                      className="size-4 text-foundation-text-dark-tertiary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                  </button>
                  <button className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 ml-1 flex items-center justify-center hover:opacity-80 transition-opacity">
                    <svg
                      className="size-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="border-b border-white/10"></div>

            <div className="min-h-[200px]">
              {activeTab === "builder" && (
                <div className="bg-foundation-bg-dark-1 border border-white/10 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-foundation-bg-dark-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] leading-6 text-foundation-text-dark-primary font-medium">
                        Prompt Builder
                      </span>
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-foundation-bg-dark-2 hover:bg-foundation-bg-dark-3 border border-white/10 text-foundation-text-dark-primary rounded-lg transition-colors text-[13px] leading-5">
                      <svg
                        className="size-[18px]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Run Discovery
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="space-y-5">
                      <div className="flex gap-6">
                        <div className="w-[340px] flex-shrink-0">
                          <label className="block text-[13px] leading-5 text-foundation-text-dark-primary/70 mb-2">
                            Model
                          </label>
                          <ModelSelector
                            value={selectedModel.name}
                            onChange={(modelName) => {
                              const model = resolvedModels.find((m) => m.name === modelName);
                              if (model) setSelectedModel(model);
                            }}
                            models={resolvedModels}
                          />
                        </div>

                        <div className="flex-1">
                          <label className="block text-[13px] leading-5 text-foundation-text-dark-primary/70 mb-2">
                            System Message
                          </label>
                          <textarea
                            value={systemMessage}
                            onChange={(e) => setSystemMessage(e.target.value)}
                            placeholder="Describe desired modal behavior (tone, tool usage, response style)"
                            className="w-full h-[60px] bg-foundation-bg-dark-2 border border-white/10 rounded-lg px-3 py-2.5 text-[13px] leading-5 text-foundation-text-dark-primary placeholder:text-foundation-text-dark-primary/50 focus:outline-none focus:border-white/20 resize-none"
                          />
                        </div>
                      </div>

                      <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[13px] leading-5 text-foundation-text-dark-primary/70">
                            {taskConfig.label}
                          </label>
                          <div className="flex items-center gap-1">
                            <div className="relative">
                              <button
                                className="p-1.5 hover:bg-foundation-bg-dark-2 rounded transition-colors"
                                onMouseEnter={() => setShowTooltip(true)}
                                onMouseLeave={() => setShowTooltip(false)}
                              >
                                <svg
                                  className="size-4 text-foundation-text-dark-primary/70"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </button>

                              {showTooltip && (
                                <div className="absolute right-0 top-8 w-[320px] bg-foundation-bg-dark-2 border border-white/10 rounded-lg p-4 shadow-xl z-50">
                                  <div className="text-[13px] leading-5 text-foundation-text-dark-primary space-y-3">
                                    {promptEnhancement === "rewrite" && (
                                      <>
                                        <p className="font-medium">Describe your task here.</p>
                                        <div>
                                          <p className="font-medium mb-1.5">The agent will:</p>
                                          <ul className="space-y-1 ml-0">
                                            <li>• Analyze your codebase</li>
                                            <li>• Select relevant files</li>
                                            <li>• Write detailed instructions above</li>
                                          </ul>
                                        </div>
                                        <p className="text-foundation-text-dark-primary/90">
                                          This is your primary input in Rewrite mode.
                                        </p>
                                      </>
                                    )}
                                    {promptEnhancement === "augment" && (
                                      <>
                                        <p className="font-medium">
                                          Add extra context to help the agent.
                                        </p>
                                        <div>
                                          <p className="font-medium mb-1.5">The agent will:</p>
                                          <ul className="space-y-1 ml-0">
                                            <li>• Keep your existing instructions</li>
                                            <li>• Add relevant context from discoveries</li>
                                            <li>• Select appropriate files</li>
                                          </ul>
                                        </div>
                                        <p className="text-foundation-text-dark-primary/90">
                                          Leave empty to just enhance with file context.
                                        </p>
                                      </>
                                    )}
                                    {promptEnhancement === "preserve" && (
                                      <>
                                        <p className="font-medium">
                                          Provide hints for file discovery.
                                        </p>
                                        <div>
                                          <p className="font-medium mb-1.5">The agent will:</p>
                                          <ul className="space-y-1 ml-0">
                                            <li>• Only select relevant files</li>
                                            <li>• Leave your instructions unchanged</li>
                                          </ul>
                                        </div>
                                        <p className="text-foundation-text-dark-primary/90">
                                          Useful when you've already written detailed instructions.
                                        </p>
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                            <button className="p-1.5 hover:bg-foundation-bg-dark-2 rounded transition-colors">
                              <svg
                                className="size-4 text-foundation-text-dark-primary/70"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <textarea
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                            placeholder={taskConfig.placeholder}
                            className="flex-1 h-[120px] bg-foundation-bg-dark-2 border border-white/10 rounded-lg px-3 py-2.5 text-[13px] leading-5 text-foundation-text-dark-primary placeholder:text-foundation-text-dark-primary/50 focus:outline-none focus:border-white/20 resize-none"
                          />

                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => setShowDiscoverySettings(true)}
                              className="px-4 py-2 bg-foundation-bg-dark-2 hover:bg-foundation-bg-dark-3 border border-white/10 text-foundation-text-dark-primary/90 rounded-lg transition-all text-[13px] leading-5 whitespace-nowrap flex items-center gap-2"
                            >
                              <span className="flex items-center gap-1.5">
                                <span className="text-foundation-accent-green">{targetSize}k</span>
                                <span>{taskConfig.buttonText}</span>
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-5 border-t border-white/10">
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="text-[13px] leading-5 text-foundation-text-dark-primary">
                              Prompt Enhancement
                            </div>
                            <div className="text-[12px] leading-[18px] text-foundation-text-dark-primary/70">
                              How to handle your instructions
                            </div>
                          </div>
                          <SegmentedControl
                            value={promptEnhancement}
                            onChange={setPromptEnhancement}
                            options={[
                              { value: "rewrite", label: "Rewrite" },
                              { value: "augment", label: "Augment" },
                              { value: "preserve", label: "Preserve" },
                            ]}
                          />
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[12px] leading-[18px] text-foundation-text-dark-primary/70">
                              Plan mode
                            </span>
                            <ModeSelector
                              value={previewMode}
                              onChange={handleModeSelect}
                              modes={resolvedModes}
                              showPreview={true}
                            />
                          </div>

                          <Toggle checked={autoPlan} onChange={setAutoPlan} />
                          <span className="text-[13px] leading-5 text-foundation-text-dark-primary/70 min-w-[32px]">
                            {autoPlan ? "On" : "Off"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <DiscoverySettingsModal
        isOpen={showDiscoverySettings}
        onClose={() => setShowDiscoverySettings(false)}
        promptEnhancement={promptEnhancement}
        onPromptEnhancementChange={setPromptEnhancement}
        targetSize={targetSize}
        onTargetSizeChange={setTargetSize}
      />

      {showModeSelector && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setShowModeSelector(false)}
          />

          <div className="fixed top-16 right-4 z-50 w-[960px] bg-foundation-bg-dark-1 border border-white/10 rounded-[16px] shadow-2xl overflow-hidden">
            <div className="flex h-[600px]">
              <div className="flex-1 p-8 overflow-y-auto">
                <div className="flex items-start gap-3 mb-6">
                  <div className="p-2 bg-white/5 rounded-lg">
                    <IconSettings className="size-5 text-white/60" />
                  </div>
                  <div>
                    <h2 className="text-[18px] font-semibold leading-[26px] tracking-[-0.45px] text-white">
                      {previewMode.name}
                    </h2>
                    <p className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white/60">
                      {previewMode.subtitle}
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-[14px] font-semibold leading-[20px] tracking-[-0.3px] text-white/60 mb-4">
                    Context Configuration
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
                      <div className="text-[12px] font-normal leading-[18px] tracking-[-0.32px] text-white/60">
                        Mode ·{" "}
                        <span className="text-white">{previewMode.contextConfig?.mode ?? "—"}</span>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
                      <div className="text-[12px] font-normal leading-[18px] tracking-[-0.32px] text-white/60">
                        Selected Files ·{" "}
                        <span className="text-white">
                          {previewMode.contextConfig?.selectedFiles ?? "—"}
                        </span>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
                      <div className="text-[12px] font-normal leading-[18px] tracking-[-0.32px] text-white/60">
                        File Tree{" "}
                        <span className="text-white">
                          {previewMode.contextConfig?.fileTree ?? "—"}
                        </span>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
                      <div className="text-[12px] font-normal leading-[18px] tracking-[-0.32px] text-white/60">
                        Code Map ·{" "}
                        <span className="text-white">
                          {previewMode.contextConfig?.codeMap ?? "—"}
                        </span>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg col-span-2">
                      <div className="text-[12px] font-normal leading-[18px] tracking-[-0.32px] text-white/60">
                        Git Diff ·{" "}
                        <span className="text-white">
                          {previewMode.contextConfig?.gitDiff ?? "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-[14px] font-semibold leading-[20px] tracking-[-0.3px] text-white/60 mb-3">
                    When to use
                  </h3>
                  <ul className="space-y-2">
                    {previewMode.whenToUse?.map((item, index) => (
                      <li
                        key={index}
                        className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white/80 flex items-start gap-2"
                      >
                        <span className="text-white/60">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-[14px] font-semibold leading-[20px] tracking-[-0.3px] text-white/60 mb-3">
                    About this mode
                  </h3>
                  <p className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white/80">
                    {previewMode.about}
                  </p>
                </div>

                {previewMode.id === "pro-edit" && (
                  <div className="mt-6">
                    <button
                      onClick={() => setShowProEditConfig(true)}
                      className="px-4 py-2 bg-foundation-accent-green hover:bg-foundation-accent-green/80 text-white rounded-lg transition-all text-[14px] font-normal leading-[20px] tracking-[-0.3px]"
                    >
                      Pro Edit Config
                    </button>
                  </div>
                )}
              </div>

              <div className="w-[360px] bg-foundation-bg-dark-1 border-l border-white/10 p-6">
                <h3 className="text-[14px] font-semibold leading-[20px] tracking-[-0.3px] text-white/60 mb-4">
                  Standard Modes
                </h3>
                <div className="space-y-2">
                  {resolvedModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => handleModeSelect(mode)}
                      onMouseEnter={() => handleModeHover(mode)}
                      className={`w-full px-4 py-3 rounded-lg text-left transition-all flex items-center justify-between ${
                        selectedMode.id === mode.id
                          ? mode.id === "manual"
                            ? "bg-foundation-accent-blue/10 border-2 border-foundation-accent-blue text-white"
                            : "bg-foundation-accent-green/10 border border-foundation-accent-green/30 text-white"
                          : "bg-white/5 border border-transparent text-white/80 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px]">
                        {mode.name}
                      </span>
                      {selectedMode.id === mode.id && (
                        <IconCheckmark className="size-4 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {showProEditConfig && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-50"
            onClick={() => setShowProEditConfig(false)}
          />

          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] w-[720px] bg-foundation-bg-dark-2 border border-white/10 rounded-[12px] shadow-2xl p-8">
            <h2 className="text-[18px] font-semibold leading-[26px] tracking-[-0.45px] text-white mb-4">
              Pro Edit Settings
            </h2>

            <div className="flex items-center gap-2 mb-4">
              <IconCheckmark className="size-4 text-foundation-accent-green" />
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-accent-green">
                Pro Edits currently using Agent mode
              </span>
            </div>

            <p className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white/70 mb-6">
              Pro Edit mode uses your selected AI model to plan edits, while delegate edit agents or
              models apply those edits simultaneously.
            </p>

            <div className="inline-flex items-center gap-0 bg-foundation-bg-dark-2 rounded-lg p-1 mb-6">
              <button
                onClick={() => setProEditMode("agent")}
                className={`px-4 py-1.5 rounded-md transition-all text-[14px] font-normal leading-[20px] tracking-[-0.3px] ${
                  proEditMode === "agent"
                    ? "bg-foundation-accent-green/30 text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Agent
              </button>
              <button
                onClick={() => setProEditMode("model")}
                className={`px-4 py-1.5 rounded-md transition-all text-[14px] font-normal leading-[20px] tracking-[-0.3px] ${
                  proEditMode === "model"
                    ? "bg-foundation-accent-green/30 text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Model
              </button>
            </div>

            {proEditMode === "agent" && (
              <div>
                <h3 className="text-[16px] font-semibold leading-[24px] tracking-[-0.32px] text-white mb-2">
                  Agent Configuration
                </h3>
                <p className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white/70 mb-4">
                  Runs a headless agent for each file to apply edits in parallel within a sandbox.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white/70 mb-2">
                      Agent
                    </label>
                    <div className="relative">
                      <select
                        value={selectedAgent}
                        onChange={(e) => setSelectedAgent(e.target.value)}
                        className="w-full bg-foundation-bg-dark-2 border border-white/10 rounded-lg px-4 py-2.5 text-[14px] text-white font-normal leading-[20px] tracking-[-0.3px] appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/20"
                      >
                        <option value="Codex CLI">Codex CLI</option>
                        <option value="Aider">Aider</option>
                        <option value="Custom">Custom</option>
                      </select>
                      <IconChevronDownMd className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-white/60 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white/70 mb-2">
                      Model
                    </label>
                    <div className="relative">
                      <select
                        value={selectedModelConfig}
                        onChange={(e) => setSelectedModelConfig(e.target.value)}
                        className="w-full bg-foundation-bg-dark-2 border border-white/10 rounded-lg px-4 py-2.5 text-[14px] text-white font-normal leading-[20px] tracking-[-0.3px] appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/20"
                      >
                        <option value="GPT-5.2 Codex Medium">GPT-5.2 Codex Medium</option>
                        <option value="GPT-5.2 Codex Large">GPT-5.2 Codex Large</option>
                        <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                      </select>
                      <IconChevronDownMd className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-white/60 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
