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
      className="bg-background dark:bg-secondary border border-muted dark:border-muted text-foreground dark:text-foreground rounded-2xl shadow-2xl"
      overlayClassName="bg-background/70 backdrop-blur-sm"
    >
      <div className="mb-6">
        <h3 className="text-body-small text-muted-foreground dark:text-muted-foreground mb-3 font-normal">
          Memory
        </h3>
        <button
          onClick={() => onSelectMemoryOption("default")}
          className={`w-full text-left p-4 rounded-xl mb-3 border-2 transition-all ${
            memoryOption === "default"
              ? "bg-accent-green/20 dark:bg-accent-green/20 border-accent-green/40 dark:border-accent-green/40"
              : "bg-transparent border-muted dark:border-muted hover:border-muted dark:hover:border-muted"
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <span className="text-body-small font-semibold text-foreground dark:text-foreground">
              Default
            </span>
          </div>
          <p className="text-body-small text-muted-foreground dark:text-muted-foreground font-normal">
            Project can access memories from outside chats, and vice versa.
          </p>
        </button>
        <button
          onClick={() => onSelectMemoryOption("project-only")}
          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
            memoryOption === "project-only"
              ? "bg-accent-green/20 dark:bg-accent-green/20 border-accent-green/40 dark:border-accent-green/40"
              : "bg-transparent border-muted dark:border-muted hover:border-muted dark:hover:border-muted"
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <span className="text-body-small font-semibold text-foreground dark:text-foreground">
              Project-only
            </span>
          </div>
          <p className="text-body-small text-muted-foreground dark:text-muted-foreground font-normal">
            Project can only access its own memories. Its memories are hidden from outside chats.
          </p>
        </button>
      </div>
      <div className="flex items-center justify-end gap-6 py-4 border-t border-muted dark:border-muted">
        <button
          onClick={onClose}
          className="px-4 py-2 text-body-small text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:hover:text-foreground hover:bg-secondary dark:hover:bg-secondary rounded-lg transition-colors font-normal"
        >
          Cancel
        </button>
        <button
          onClick={onDone}
          className="px-4 py-2 text-body-small bg-foreground dark:bg-foreground text-background dark:text-background hover:opacity-90 rounded-lg transition-colors font-semibold"
        >
          Done
        </button>
      </div>
    </ModalDialog>
  );
}
