import { useState } from "react";

import { DiscoverySettingsModal } from "../../modals/DiscoverySettingsModal";
import {
  ComposeInstructionsPanel,
  ProEditConfigModal,
  PromptBuilderSection,
  fallbackModel,
  fallbackMode,
  getTaskSectionConfig,
  type ComposeModeConfig,
  type ComposeViewProps,
  type ProEditMode,
} from "../compose";

/**
 * Renders the prompt composition interface for compose mode.
 *
 * @param props - Compose view props.
 * @returns A compose mode panel layout.
 */
export function ComposeView({ models, modes }: ComposeViewProps) {
  const resolvedModels = models && models.length > 0 ? models : [fallbackModel];
  const resolvedModes = modes && modes.length > 0 ? modes : [fallbackMode];
  const [selectedModel] = useState(resolvedModels[0] ?? fallbackModel);
  const [instructions, setInstructions] = useState("");
  const [promptEnhancement, setPromptEnhancement] = useState<"rewrite" | "augment" | "preserve">("rewrite");
  const [isWebSearchActive, setIsWebSearchActive] = useState(false);
  const [systemMessage, setSystemMessage] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [autoPlan, setAutoPlan] = useState(false);
  const [showDiscoverySettings, setShowDiscoverySettings] = useState(false);
  const [targetSize, setTargetSize] = useState(60);
  const [previewMode, setPreviewMode] = useState<ComposeModeConfig>(
    resolvedModes[5] ?? resolvedModes[0] ?? fallbackMode,
  );
  const [showProEditConfig, setShowProEditConfig] = useState(false);
  const [proEditMode, setProEditMode] = useState<ProEditMode>("agent");
  const [selectedAgent, setSelectedAgent] = useState("Codex CLI");
  const [selectedModelConfig, setSelectedModelConfig] = useState("GPT-5.2 Codex Medium");

  const taskConfig = getTaskSectionConfig(promptEnhancement);

  return (
    <>
      <div className="flex-1 flex flex-col bg-background text-foreground">
        <div className="flex-1 overflow-y-auto">
          <div className="w-full px-8 py-8 space-y-4 overflow-y-auto">
            <ComposeInstructionsPanel
              instructions={instructions}
              onInstructionsChange={setInstructions}
              isWebSearchActive={isWebSearchActive}
              onToggleWebSearch={() => setIsWebSearchActive(!isWebSearchActive)}
              selectedModel={selectedModel}
            />

            <div className="border-b border-border"></div>

            <PromptBuilderSection
              systemMessage={systemMessage}
              onSystemMessageChange={setSystemMessage}
              taskDescription={taskDescription}
              onTaskDescriptionChange={setTaskDescription}
              promptEnhancement={promptEnhancement}
              targetSize={targetSize}
              onOpenDiscoverySettings={() => setShowDiscoverySettings(true)}
              autoPlan={autoPlan}
              onAutoPlanChange={setAutoPlan}
              previewMode={previewMode}
              onModeSelect={setPreviewMode}
              modes={resolvedModes}
              taskConfig={taskConfig}
            />
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

      <ProEditConfigModal
        isOpen={showProEditConfig}
        onClose={() => setShowProEditConfig(false)}
        proEditMode={proEditMode}
        onProEditModeChange={setProEditMode}
        selectedAgent={selectedAgent}
        onSelectedAgentChange={setSelectedAgent}
        selectedModelConfig={selectedModelConfig}
        onSelectedModelConfigChange={setSelectedModelConfig}
      />
    </>
  );
}

/**
 * Re-export compose types for backward compatibility.
 */
export type { ComposeModeConfig, ComposeViewProps, ProEditMode } from "../compose";
