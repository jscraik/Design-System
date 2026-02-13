import { ModalDialog } from "../../../../components/ui/overlays/modal/modal";
import { IconCheckmark, IconChevronDownMd } from "../../../../icons";
import type { ProEditMode } from "../shared/types";

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
  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Pro Edit Settings"
      maxWidth="720px"
      className="bg-background dark:bg-secondary border border-muted dark:border-muted rounded-[12px] shadow-2xl p-8"
      overlayClassName="bg-background/60"
    >
      <div className="flex items-center gap-2 mb-4">
        <IconCheckmark className="size-4 text-accent-green dark:text-accent-green" />
        <span className="text-body-small font-normal text-foreground dark:text-foreground">
          Pro Edits currently using Agent mode
        </span>
      </div>

      <p className="text-body-small font-normal text-text-secondary dark:text-text-secondary mb-6">
        Pro Edit mode uses your selected AI model to plan edits, while delegate edit agents or
        models apply those edits simultaneously.
      </p>

      <div className="inline-flex items-center gap-0 bg-secondary dark:bg-secondary rounded-lg p-1 mb-6">
        <button
          type="button"
          onClick={() => onProEditModeChange("agent")}
          className={`px-4 py-1.5 rounded-md transition-all text-body-small font-normal ${
            proEditMode === "agent"
              ? "bg-accent-green/30 dark:bg-accent-green/30 text-foreground dark:text-foreground"
              : "text-text-secondary dark:text-text-secondary hover:text-foreground dark:hover:text-foreground"
          }`}
        >
          Agent
        </button>
        <button
          type="button"
          onClick={() => onProEditModeChange("model")}
          className={`px-4 py-1.5 rounded-md transition-all text-body-small font-normal ${
            proEditMode === "model"
              ? "bg-accent-green/30 dark:bg-accent-green/30 text-foreground dark:text-foreground"
              : "text-text-secondary dark:text-text-secondary hover:text-foreground dark:hover:text-foreground"
          }`}
        >
          Model
        </button>
      </div>

      {proEditMode === "agent" && (
        <div>
          <h3 className="text-body font-semibold text-foreground dark:text-foreground mb-2">
            Agent Configuration
          </h3>
          <p className="text-body-small font-normal text-text-secondary dark:text-text-secondary mb-4">
            Runs a headless agent for each file to apply edits in parallel within a sandbox.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-body-small font-normal text-text-secondary dark:text-text-secondary mb-2">
                Agent
              </label>
              <div className="relative">
                <select
                  value={selectedAgent}
                  onChange={(e) => onSelectedAgentChange(e.target.value)}
                  className="w-full bg-secondary dark:bg-secondary border border-muted dark:border-muted rounded-lg px-4 py-2.5 text-body-small text-foreground dark:text-foreground font-normal appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring/50 dark:focus:ring-ring/50"
                >
                  <option value="Codex CLI">Codex CLI</option>
                  <option value="Aider">Aider</option>
                  <option value="Custom">Custom</option>
                </select>
                <IconChevronDownMd className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground dark:text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-body-small font-normal text-text-secondary dark:text-text-secondary mb-2">
                Model
              </label>
              <div className="relative">
                <select
                  value={selectedModelConfig}
                  onChange={(e) => onSelectedModelConfigChange(e.target.value)}
                  className="w-full bg-secondary dark:bg-secondary border border-muted dark:border-muted rounded-lg px-4 py-2.5 text-body-small text-foreground dark:text-foreground font-normal appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring/50 dark:focus:ring-ring/50"
                >
                  <option value="GPT-5.2 Codex Medium">GPT-5.2 Codex Medium</option>
                  <option value="GPT-5.2 Codex Large">GPT-5.2 Codex Large</option>
                  <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                </select>
                <IconChevronDownMd className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground dark:text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      )}
    </ModalDialog>
  );
}
