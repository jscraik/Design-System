import type { ReactNode } from "react";

import { ModalDialog } from "../../../../../components/ui/overlays/Modal/Modal";
import { getProjectIcon } from "../../data/projectData";

/**
 * Props for the new project modal.
 */
export interface NewProjectModalProps {
  isOpen: boolean;
  projectName: string;
  newProjectIcon: string;
  newProjectColor: string;
  selectedCategories: string[];
  categories: string[];
  categoryIcons: Record<string, ReactNode>;
  categoryColors: Record<string, string>;
  categoryIconColors: Record<string, string>;
  onProjectNameChange: (name: string) => void;
  onToggleCategory: (category: string) => void;
  onCreateProject: () => void;
  onIconPickerOpen: () => void;
  onMoreOptions: () => void;
  onClose: () => void;
}

/**
 * Renders the new project modal with icon and category selection.
 *
 * @param props - New project modal props.
 * @returns The modal element or `null` when closed.
 */
export function NewProjectModal({
  isOpen,
  projectName,
  newProjectIcon,
  newProjectColor,
  selectedCategories,
  categories,
  categoryIcons,
  categoryColors,
  categoryIconColors,
  onProjectNameChange,
  onToggleCategory,
  onCreateProject,
  onIconPickerOpen,
  onMoreOptions,
  onClose,
}: NewProjectModalProps) {
  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title="New project"
      description="Projects give ChatGPT shared context across chats and files, all in one place."
      maxWidth="420px"
      className="bg-background dark:bg-secondary border border-muted dark:border-muted text-foreground dark:text-foreground rounded-2xl shadow-2xl"
      overlayClassName="bg-background/70 backdrop-blur-sm"
    >
      <div className="px-6 pt-6 pb-5">
        <p className="text-body-small text-muted-foreground dark:text-muted-foreground font-normal text-center">
          Projects give ChatGPT shared context
          <br />
          across chats and files, all in one place.
        </p>
      </div>
      <div className="px-6 pb-6">
        <div className="relative mb-5">
          <button
            type="button"
            onClick={onIconPickerOpen}
            className={`absolute left-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity ${newProjectColor}`}
            aria-label="Change project icon"
          >
            {getProjectIcon(newProjectIcon)}
          </button>
          <input
            type="text"
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => onProjectNameChange(e.target.value)}
            className="w-full bg-secondary dark:bg-secondary border border-muted dark:border-muted rounded-lg pl-10 pr-3 py-3 text-body-small text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring/50 dark:focus:ring-ring/50 transition-all font-normal"
            aria-label="Project name"
          />
        </div>
        <div className="mb-6">
          <div
            className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((category) => {
              const isSelected = selectedCategories.includes(category);
              return (
                <button
                  key={category}
                  onClick={() => onToggleCategory(category)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-body-small border transition-all whitespace-nowrap flex-shrink-0 font-normal ${
                    isSelected
                      ? categoryColors[category]
                      : "bg-secondary dark:bg-secondary text-muted-foreground dark:text-muted-foreground border-muted dark:border-muted hover:bg-secondary/80 dark:hover:bg-secondary/80"
                  }`}
                >
                  <span className={categoryIconColors[category]}>{categoryIcons[category]}</span>
                  <span>{category}</span>
                </button>
              );
            })}
          </div>
        </div>
        <button
          onClick={onCreateProject}
          disabled={!projectName.trim()}
          className="w-full bg-accent-green dark:bg-accent-green hover:bg-accent-green/80 dark:hover:bg-accent-green/80 disabled:bg-secondary dark:disabled:bg-secondary disabled:text-muted-foreground dark:disabled:text-muted-foreground disabled:cursor-not-allowed text-foreground py-3 rounded-lg transition-all text-body-small font-normal"
        >
          Create project
        </button>
        <button
          onClick={onMoreOptions}
          className="w-full bg-secondary dark:bg-secondary hover:bg-secondary/80 dark:hover:bg-secondary/80 text-muted-foreground dark:text-muted-foreground py-3 rounded-lg mt-2 transition-colors text-body-small font-normal"
        >
          More options
        </button>
      </div>
    </ModalDialog>
  );
}
