import { ModalDialog } from "../../../../../components/ui/overlays/Modal/Modal";

/**
 * Props for the project settings modal.
 */
export interface ProjectSettingsModalProps {
  memoryOption: "default" | "project-only";
  onSelectMemoryOption: (value: "default" | "project-only") => void;
  onClose: () => void;
  onDone: () => void;
}

/**
 * Renders the project settings modal for memory configuration.
 *
 * @param props - Project settings modal props.
 * @returns The modal element.
 */
export function ProjectSettingsModal({
  memoryOption,
  onSelectMemoryOption,
  onClose,
  onDone,
}: ProjectSettingsModalProps) {
  return (
    <ModalDialog
      isOpen={true}
      onClose={onClose}
      title="Project settings"
      maxWidth="380px"
      className="bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-2 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 text-foundation-text-light-primary dark:text-foundation-text-dark-primary rounded-2xl shadow-2xl"
      overlayClassName="bg-foundation-bg-dark-1/70 backdrop-blur-sm"
    >
      <div className="mb-6">
        <h3 className="text-body-small text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary mb-3 font-normal">
          Memory
        </h3>
        <button
          onClick={() => onSelectMemoryOption("default")}
          className={`w-full text-left p-4 rounded-xl mb-3 border-2 transition-all ${
            memoryOption === "default"
              ? "bg-foundation-accent-green-light/20 dark:bg-foundation-accent-green/20 border-foundation-accent-green-light/40 dark:border-foundation-accent-green/40"
              : "bg-transparent border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 hover:border-foundation-bg-light-3 dark:hover:border-foundation-bg-dark-3"
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <span className="text-body-small font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
              Default
            </span>
          </div>
          <p className="text-body-small text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary font-normal">
            Project can access memories from outside chats, and vice versa.
          </p>
        </button>
        <button
          onClick={() => onSelectMemoryOption("project-only")}
          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
            memoryOption === "project-only"
              ? "bg-foundation-accent-green-light/20 dark:bg-foundation-accent-green/20 border-foundation-accent-green-light/40 dark:border-foundation-accent-green/40"
              : "bg-transparent border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 hover:border-foundation-bg-light-3 dark:hover:border-foundation-bg-dark-3"
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <span className="text-body-small font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
              Project-only
            </span>
          </div>
          <p className="text-body-small text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary font-normal">
            Project can only access its own memories. Its memories are hidden from outside chats.
          </p>
        </button>
      </div>
      <div className="flex items-center justify-end gap-6 py-4 border-t border-foundation-bg-light-3 dark:border-foundation-bg-dark-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-body-small text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary hover:text-foundation-text-light-primary dark:hover:text-foundation-text-dark-primary hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-2 rounded-lg transition-colors font-normal"
        >
          Cancel
        </button>
        <button
          onClick={onDone}
          className="px-4 py-2 text-body-small bg-foundation-text-light-primary dark:bg-foundation-text-dark-primary text-foundation-bg-light-1 dark:text-foundation-bg-dark-1 hover:opacity-90 rounded-lg transition-colors font-semibold"
        >
          Done
        </button>
      </div>
    </ModalDialog>
  );
}
