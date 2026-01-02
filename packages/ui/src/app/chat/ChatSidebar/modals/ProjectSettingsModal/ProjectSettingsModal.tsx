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
 * Accessibility contract:
 * - Overlay click closes the modal via `onClose`.
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
    <div
      className="fixed inset-0 bg-foundation-bg-dark-1/70 backdrop-blur-sm flex items-center justify-center z-[100]"
      onClick={onClose}
    >
      <div
        className="bg-secondary border border-border text-foreground rounded-2xl w-[380px] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-5">
          <h2 className="text-body font-semibold text-foreground">Project settings</h2>
        </div>
        <div className="px-6 pb-6">
          <div className="mb-6">
            <h3 className="text-body-small text-muted-foreground mb-3 font-normal">Memory</h3>
            <button
              onClick={() => onSelectMemoryOption("default")}
              className={`w-full text-left p-4 rounded-xl mb-3 border-2 transition-all ${
                memoryOption === "default"
                  ? "bg-[var(--accent-green)]/20 border-[var(--accent-green)]/40"
                  : "bg-transparent border-border hover:border-border"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-body-small font-semibold text-foreground">Default</span>
              </div>
              <p className="text-body-small text-muted-foreground font-normal">
                Project can access memories from outside chats, and vice versa.
              </p>
            </button>
            <button
              onClick={() => onSelectMemoryOption("project-only")}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                memoryOption === "project-only"
                  ? "bg-[var(--accent-green)]/20 border-[var(--accent-green)]/40"
                  : "bg-transparent border-border hover:border-border"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-body-small font-semibold text-foreground">Project-only</span>
              </div>
              <p className="text-body-small text-muted-foreground font-normal">
                Project can only access its own memories. Its memories are hidden from outside
                chats.
              </p>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-end gap-6 px-6 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-body-small text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors font-normal"
          >
            Cancel
          </button>
          <button
            onClick={onDone}
            className="px-4 py-2 text-body-small bg-foreground text-background hover:bg-foreground/90 rounded-lg transition-colors font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
