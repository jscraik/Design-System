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
          selectedAction === "chatgpt" ? "bg-muted" : "hover:bg-muted"
        }`}
      >
        <IconChat className="size-5 flex-shrink-0 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
        <span className="text-body-small font-normal text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
          ChatGPT
        </span>
      </button>

      {/* New Project */}
      <button
        onClick={onNewProjectClick}
        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg transition-colors group"
      >
        <IconFolder className="size-5 flex-shrink-0 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
        <span className="text-body-small font-normal text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
          New project
        </span>
      </button>

      {/* Projects List */}
      {displayedProjects.map((project) => (
        <button
          key={project.id}
          onClick={() => onProjectSelect(project)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
            selectedAction === project.id ? "bg-muted" : "hover:bg-muted"
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
          <span className="text-body-small font-normal text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            {project.label}
          </span>
        </button>
      ))}

      {/* See More/Less */}
      {projectsData.length > 3 && (
        <button
          onClick={onToggleExpanded}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-left"
        >
          <IconDotsHorizontal className="size-5 flex-shrink-0 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
          <span className="text-body-small font-normal text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            {projectsExpanded ? "See less" : "See more"}
          </span>
        </button>
      )}
    </div>
  );
}
