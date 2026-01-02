import { IconCheckmark, IconChevronDownMd } from "../../../../icons";
import { type ProEditMode } from "../shared/types";

/**
 * Props for the Pro Edit configuration modal.
 */
interface ProEditConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  proEditMode: ProEditMode;
  onProEditModeChange: (mode: ProEditMode) => void;
  selectedAgent: string;
  onSelectedAgentChange: (agent: string) => void;
  selectedModelConfig: string;
  onSelectedModelConfigChange: (config: string) => void;
}

/**
 * Renders the Pro Edit configuration modal.
 *
 * @param props - Pro Edit config modal props.
 * @returns The modal element or `null` when closed.
 */
export function ProEditConfigModal({
  isOpen,
  onClose,
  proEditMode,
  onProEditModeChange,
  selectedAgent,
  onSelectedAgentChange,
  selectedModelConfig,
  onSelectedModelConfigChange,
}: ProEditConfigModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-foundation-bg-dark-1/60 z-50" onClick={onClose} />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] w-[720px] bg-popover border border-border rounded-[12px] shadow-2xl p-8">
        <h2 className="text-heading-3 font-semibold text-foreground mb-4">Pro Edit Settings</h2>

        <div className="flex items-center gap-2 mb-4">
          <IconCheckmark className="size-4 text-accent-green" />
          <span className="text-body-small font-normal text-foreground">Pro Edits currently using Agent mode</span>
        </div>

        <p className="text-body-small font-normal text-text-secondary mb-6">
          Pro Edit mode uses your selected AI model to plan edits, while delegate edit agents or models apply
          those edits simultaneously.
        </p>

        <div className="inline-flex items-center gap-0 bg-muted rounded-lg p-1 mb-6">
          <button
            type="button"
            onClick={() => onProEditModeChange("agent")}
            className={`px-4 py-1.5 rounded-md transition-all text-body-small font-normal ${
              proEditMode === "agent" ? "bg-accent-green/30 text-foreground" : "text-text-secondary hover:text-foreground"
            }`}
          >
            Agent
          </button>
          <button
            type="button"
            onClick={() => onProEditModeChange("model")}
            className={`px-4 py-1.5 rounded-md transition-all text-body-small font-normal ${
              proEditMode === "model" ? "bg-accent-green/30 text-foreground" : "text-text-secondary hover:text-foreground"
            }`}
          >
            Model
          </button>
        </div>

        {proEditMode === "agent" && (
          <div>
            <h3 className="text-body font-semibold text-foreground mb-2">Agent Configuration</h3>
            <p className="text-body-small font-normal text-text-secondary mb-4">
              Runs a headless agent for each file to apply edits in parallel within a sandbox.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-body-small font-normal text-text-secondary mb-2">Agent</label>
                <div className="relative">
                  <select
                    value={selectedAgent}
                    onChange={(e) => onSelectedAgentChange(e.target.value)}
                    className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-body-small text-foreground font-normal appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-border/50"
                  >
                    <option value="Codex CLI">Codex CLI</option>
                    <option value="Aider">Aider</option>
                    <option value="Custom">Custom</option>
                  </select>
                  <IconChevronDownMd className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-body-small font-normal text-text-secondary mb-2">Model</label>
                <div className="relative">
                  <select
                    value={selectedModelConfig}
                    onChange={(e) => onSelectedModelConfigChange(e.target.value)}
                    className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-body-small text-foreground font-normal appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-border/50"
                  >
                    <option value="GPT-5.2 Codex Medium">GPT-5.2 Codex Medium</option>
                    <option value="GPT-5.2 Codex Large">GPT-5.2 Codex Large</option>
                    <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                  </select>
                  <IconChevronDownMd className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
