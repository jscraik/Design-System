import type { ReactNode } from "react";

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
 * Accessibility contract:
 * - Overlay click closes the modal via `onClose`.
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
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-foundation-bg-dark-1/70 backdrop-blur-sm flex items-center justify-center z-[95]"
      onClick={onClose}
    >
      <div
        className="bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-2 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 text-foundation-text-light-primary dark:text-foundation-text-dark-primary rounded-2xl w-[420px] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-5">
          <p className="text-body-small text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary font-normal text-center">
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
              className="w-full bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg pl-10 pr-3 py-3 text-body-small text-foundation-text-light-primary dark:text-foundation-text-dark-primary placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary focus:outline-none focus:ring-1 focus:ring-foundation-border-light/50 dark:focus:ring-foundation-border-dark-default/50 transition-all font-normal"
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
                        : "bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 hover:bg-foundation-bg-light-2/80 dark:hover:bg-foundation-bg-dark-2/80"
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
            className="w-full bg-foundation-accent-green-light dark:bg-foundation-accent-green hover:bg-foundation-accent-green-light/80 dark:hover:bg-foundation-accent-green/80 disabled:bg-foundation-bg-light-2 dark:disabled:bg-foundation-bg-dark-2 disabled:text-foundation-text-light-tertiary dark:disabled:text-foundation-text-dark-tertiary disabled:cursor-not-allowed text-foundation-text-dark-primary py-3 rounded-lg transition-all text-body-small font-normal"
          >
            Create project
          </button>
          <button
            onClick={onMoreOptions}
            className="w-full bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 hover:bg-foundation-bg-light-2/80 dark:hover:bg-foundation-bg-dark-2/80 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary py-3 rounded-lg mt-2 transition-colors text-body-small font-normal"
          >
            More options
          </button>
        </div>
      </div>
    </div>
  );
}
