import type { ReactNode } from "react";
import { useCallback, useState } from "react";

import type { SidebarItem } from "../../shared/types";

/**
 * Manages ChatSidebar state and handlers.
 *
 * @param initialProjects - Initial project list for the sidebar.
 * @returns Sidebar state and action handlers.
 */

export function useChatSidebarState(initialProjects: SidebarItem[]) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAction, setSelectedAction] = useState("chatgpt");
  const [projectName, setProjectName] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [projectsData, setProjectsData] = useState<SidebarItem[]>(initialProjects);
  const [newProjectIcon, setNewProjectIcon] = useState("folder");
  const [newProjectColor, setNewProjectColor] = useState("text-muted-foreground");
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [memoryOption, setMemoryOption] = useState<"default" | "project-only">("default");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [gptsExpanded, setGptsExpanded] = useState(false);
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const [groupChatsExpanded, setGroupChatsExpanded] = useState(false);
  const [yourChatsExpanded, setYourChatsExpanded] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  // Icon picker state
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [selectedProjectForIcon, setSelectedProjectForIcon] = useState<SidebarItem | null>(null);

  // Handlers
  const handleNewChat = useCallback(() => {
    setSelectedAction("chatgpt");
  }, []);

  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories((prev) => {
      const newCategories = prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category];
      setProjectName(newCategories.join(" "));
      return newCategories;
    });
  }, []);

  const handleCreateProject = useCallback(() => {
    setProjectName("");
    setSelectedCategories([]);
    setShowNewProjectModal(false);
  }, []);

  const handleIconChange = useCallback(
    (iconId: string, color: string, getProjectIcon: (id: string) => ReactNode) => {
      if (selectedProjectForIcon) {
        const newIcon = getProjectIcon(iconId);
        const updatedProjects = projectsData.map((project) =>
          project.id === selectedProjectForIcon.id ? { ...project, icon: newIcon, color } : project,
        );
        setProjectsData(updatedProjects);
      }
      setShowIconPicker(false);
      setSelectedProjectForIcon(null);
    },
    [selectedProjectForIcon, projectsData],
  );

  const handleNewProjectIconChange = useCallback((iconId: string, color: string) => {
    setNewProjectIcon(iconId);
    setNewProjectColor(color);
    setShowIconPicker(false);
  }, []);

  const handleProjectSelect = useCallback(
    (project: SidebarItem, onProjectSelect?: (project: SidebarItem) => void) => {
      setSelectedAction(project.id);
      if (onProjectSelect) {
        onProjectSelect(project);
      }
    },
    [],
  );

  return {
    // State
    isCollapsed,
    searchQuery,
    selectedChatId,
    selectedAction,
    projectName,
    selectedCategories,
    projectsData,
    newProjectIcon,
    newProjectColor,
    showIconPicker,
    selectedProjectForIcon,
    showMoreOptions,
    showNewProjectModal,
    showUserMenu,
    showSettingsModal,
    gptsExpanded,
    projectsExpanded,
    groupChatsExpanded,
    yourChatsExpanded,
    memoryOption,

    // Setters
    setIsCollapsed,
    setSearchQuery,
    setSelectedAction,
    setProjectName,
    setProjectsData,
    setShowMoreOptions,
    setShowNewProjectModal,
    setShowUserMenu,
    setShowSettingsModal,
    setGptsExpanded,
    setProjectsExpanded,
    setGroupChatsExpanded,
    setYourChatsExpanded,
    setSelectedChatId,
    setMemoryOption,
    setSelectedProjectForIcon,
    setShowIconPicker,

    // Handlers
    handleNewChat,
    toggleCategory,
    handleCreateProject,
    handleIconChange,
    handleNewProjectIconChange,
    handleProjectSelect,
  };
}
