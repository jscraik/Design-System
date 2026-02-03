import { IconChat, IconFolder, IconDotsHorizontal } from "../../../../../icons";
import type { SidebarItem } from "../../../shared/types";

/**
 * Props for the quick actions section in the sidebar.
 */
interface ChatSidebarQuickActionsProps {
  selectedAction: string;
  projectsData: SidebarItem[];
  projectsExpanded: boolean;
  onNewChatClick: (actionId: string) => void;
  onNewProjectClick: () => void;
  onProjectSelect: (project: SidebarItem) => void;
  onProjectIconClick: (project: SidebarItem) => void;
  onToggleExpanded: () => void;
}

/**
 * Renders quick actions and project shortcuts in the sidebar.
 *
 * @param props - Quick actions props.
 * @returns A quick actions list.
 */
export function ChatSidebarQuickActions({
  selectedAction,
  projectsData,
  projectsExpanded,
  onNewChatClick,
  onNewProjectClick,
  onProjectSelect,
  onProjectIconClick,
  onToggleExpanded,
}: ChatSidebarQuickActionsProps) {
  const displayedProjects = projectsExpanded ? projectsData : projectsData.slice(0, 3);

  return (
    <div className="px-3 space-y-0.5">
      {/* ChatGPT */}
      <button
        onClick={() => onNewChatClick("chatgpt")}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group ${
          selectedAction === "chatgpt"
            ? "bg-secondary dark:bg-secondary"
            : "hover:bg-secondary/80 dark:hover:bg-secondary/80"
        }`}
      >
        <IconChat className="size-5 flex-shrink-0 text-text-secondary dark:text-text-secondary" />
        <span className="text-body-small font-normal text-text-secondary dark:text-text-secondary">
          ChatGPT
        </span>
      </button>

      {/* New Project */}
      <button
        onClick={onNewProjectClick}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group hover:bg-secondary/80 dark:hover:bg-secondary/80"
      >
        <IconFolder className="size-5 flex-shrink-0 text-text-secondary dark:text-text-secondary" />
        <span className="text-body-small font-normal text-text-secondary dark:text-text-secondary">
          New project
        </span>
      </button>

      {/* Projects List */}
      {displayedProjects.map((project) => (
        <button
          key={project.id}
          onClick={() => onProjectSelect(project)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
            selectedAction === project.id
              ? "bg-secondary dark:bg-secondary"
              : "hover:bg-secondary/80 dark:hover:bg-secondary/80"
          }`}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              onProjectIconClick(project);
            }}
            className={`flex-shrink-0 ${project.color ?? ""} hover:opacity-70 transition-opacity cursor-pointer`}
          >
            {project.icon}
          </div>
          <span className="text-body-small font-normal text-text-secondary dark:text-text-secondary">
            {project.label}
          </span>
        </button>
      ))}

      {/* See More/Less */}
      {projectsData.length > 3 && (
        <button
          onClick={onToggleExpanded}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left hover:bg-secondary/80 dark:hover:bg-secondary/80"
        >
          <IconDotsHorizontal className="size-5 flex-shrink-0 text-text-secondary dark:text-text-secondary" />
          <span className="text-body-small font-normal text-text-secondary dark:text-text-secondary">
            {projectsExpanded ? "See less" : "See more"}
          </span>
        </button>
      )}
    </div>
  );
}
