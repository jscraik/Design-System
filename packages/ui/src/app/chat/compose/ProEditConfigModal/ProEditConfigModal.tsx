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

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] w-[720px] bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-2 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-[12px] shadow-2xl p-8">
        <h2 className="text-heading-3 font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-4">
          Pro Edit Settings
        </h2>

        <div className="flex items-center gap-2 mb-4">
          <IconCheckmark className="size-4 text-foundation-accent-green-light dark:text-foundation-accent-green" />
          <span className="text-body-small font-normal text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
            Pro Edits currently using Agent mode
          </span>
        </div>

        <p className="text-body-small font-normal text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mb-6">
          Pro Edit mode uses your selected AI model to plan edits, while delegate edit agents or
          models apply those edits simultaneously.
        </p>

        <div className="inline-flex items-center gap-0 bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 rounded-lg p-1 mb-6">
          <button
            type="button"
            onClick={() => onProEditModeChange("agent")}
            className={`px-4 py-1.5 rounded-md transition-all text-body-small font-normal ${
              proEditMode === "agent"
                ? "bg-foundation-accent-green-light/30 dark:bg-foundation-accent-green/30 text-foundation-text-light-primary dark:text-foundation-text-dark-primary"
                : "text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary hover:text-foundation-text-light-primary dark:hover:text-foundation-text-dark-primary"
            }`}
          >
            Agent
          </button>
          <button
            type="button"
            onClick={() => onProEditModeChange("model")}
            className={`px-4 py-1.5 rounded-md transition-all text-body-small font-normal ${
              proEditMode === "model"
                ? "bg-foundation-accent-green-light/30 dark:bg-foundation-accent-green/30 text-foundation-text-light-primary dark:text-foundation-text-dark-primary"
                : "text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary hover:text-foundation-text-light-primary dark:hover:text-foundation-text-dark-primary"
            }`}
          >
            Model
          </button>
        </div>

        {proEditMode === "agent" && (
          <div>
            <h3 className="text-body font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-2">
              Agent Configuration
            </h3>
            <p className="text-body-small font-normal text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mb-4">
              Runs a headless agent for each file to apply edits in parallel within a sandbox.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-body-small font-normal text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mb-2">
                  Agent
                </label>
                <div className="relative">
                  <select
                    value={selectedAgent}
                    onChange={(e) => onSelectedAgentChange(e.target.value)}
                    className="w-full bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg px-4 py-2.5 text-body-small text-foundation-text-light-primary dark:text-foundation-text-dark-primary font-normal appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-foundation-border-light/50 dark:focus:ring-foundation-border-dark-default/50"
                  >
                    <option value="Codex CLI">Codex CLI</option>
                    <option value="Aider">Aider</option>
                    <option value="Custom">Custom</option>
                  </select>
                  <IconChevronDownMd className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-body-small font-normal text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mb-2">
                  Model
                </label>
                <div className="relative">
                  <select
                    value={selectedModelConfig}
                    onChange={(e) => onSelectedModelConfigChange(e.target.value)}
                    className="w-full bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg px-4 py-2.5 text-body-small text-foundation-text-light-primary dark:text-foundation-text-dark-primary font-normal appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-foundation-border-light/50 dark:focus:ring-foundation-border-dark-default/50"
                  >
                    <option value="GPT-5.2 Codex Medium">GPT-5.2 Codex Medium</option>
                    <option value="GPT-5.2 Codex Large">GPT-5.2 Codex Large</option>
                    <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                  </select>
                  <IconChevronDownMd className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
