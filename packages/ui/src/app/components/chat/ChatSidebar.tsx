import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  IconArchive,
  IconChat,
  IconCloseBold,
  IconCode,
  IconDotsHorizontal,
  IconFolder,
  IconGrid3x3,
  IconImage,
  IconRadio,
  IconSearch,
  IconSettings,
  IconSidebar,
  Sparkles,
} from "../../../icons";
import { Popover } from "../../../vendor/appsSdkUi";
import { useChatUISlots } from "../../slots";
import { IconBarChart, IconBook, IconCompose, IconWriting } from "../icons/ChatGPTIcons";
import { IconPickerModal } from "../modals/IconPickerModal";
import { SettingsModal } from "../modals/SettingsModal";
import { CollapsibleSection } from "../ui/base/collapsible-section";
import { ListItem } from "../ui/base/list-item";

export interface SidebarItem {
  id: string;
  label: string;
  icon: ReactNode;
  color?: string;
}

export interface ChatSidebarUser {
  name: string;
  accountLabel?: string;
  planLabel?: string;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle?: () => void;
  onProjectSelect?: (project: SidebarItem) => void;
  projects?: SidebarItem[];
  chatHistory?: string[];
  groupChats?: SidebarItem[];
  categories?: string[];
  categoryIcons?: Record<string, ReactNode>;
  categoryColors?: Record<string, string>;
  categoryIconColors?: Record<string, string>;
  user?: ChatSidebarUser;
}

const projectIconMap: Record<string, ReactNode> = {
  folder: <IconFolder className="size-4" />,
  chat: <IconChat className="size-4" />,
  "bar-chart": <IconBarChart className="size-4" />,
  writing: <IconWriting className="size-4" />,
  book: <IconBook className="size-4" />,
  compose: <IconCompose className="size-4" />,
};

const getProjectIcon = (iconId: string) =>
  projectIconMap[iconId] || <IconFolder className="size-4" />;

// Helper to get color ID from CSS class string (reverse mapping)
const getColorIdFromClass = (colorClass: string): string => {
  const colorClassMap: Record<string, string> = {
    gray: "text-foundation-icon-light-tertiary dark:text-white/60",
    blue: "text-foundation-accent-blue",
    green: "text-foundation-accent-green",
    orange: "text-foundation-accent-orange",
    red: "text-foundation-accent-red",
  };
  return (
    Object.entries(colorClassMap).find(([_, value]) => colorClass === value)?.[0] ?? "gray"
  );
};

function RailButton(props: {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const { icon, label, active, onClick } = props;

  return (
    <button
      type="button"
      data-rail-item="true"
      aria-label={label}
      title={label}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={`mx-2 mb-1 size-10 rounded-lg flex items-center justify-center transition-colors hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 dark:focus-visible:ring-white/30 ${
        active ? "bg-black/10 dark:bg-white/10" : ""
      }`}
    >
      {icon}
    </button>
  );
}

function ProjectSettingsModal({
  memoryOption,
  onSelectMemoryOption,
  onClose,
  onDone,
}: {
  memoryOption: "default" | "project-only";
  onSelectMemoryOption: (value: "default" | "project-only") => void;
  onClose: () => void;
  onDone: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  // Focus management with focus trap
  useEffect(() => {
    const t = window.setTimeout(() => dialogRef.current?.focus(), 0);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      // Focus trap for Tab key
      if (e.key === "Tab" && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<
          HTMLElement
        >(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100]"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-settings-title"
        className="bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 border border-foundation-bg-light-3 dark:border-white/10 text-foundation-text-light-primary dark:text-foundation-text-dark-primary rounded-2xl w-[380px] shadow-2xl outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-5">
          <h2
            id="project-settings-title"
            className="text-[16px] font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary leading-[22px] tracking-[-0.32px]"
          >
            Project settings
          </h2>
        </div>
        <div className="px-6 pb-6">
          <div className="mb-6">
            <h3 className="text-[13px] text-foundation-text-light-tertiary dark:text-white/50 mb-3 font-normal leading-[18px] tracking-[-0.3px]">
              Memory
            </h3>
            <button
              onClick={() => onSelectMemoryOption("default")}
              className={`w-full text-left p-4 rounded-xl mb-3 border-2 transition-all ${
                memoryOption === "default"
                  ? "bg-foundation-accent-green/20 border-foundation-accent-green/40"
                  : "bg-transparent border-foundation-bg-light-3 dark:border-white/10 hover:border-foundation-bg-light-3/70 dark:hover:border-white/20"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-[14px] font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary leading-[20px] tracking-[-0.3px]">
                  Default
                </span>
              </div>
              <p className="text-[13px] text-foundation-text-light-tertiary dark:text-white/50 leading-[18px] tracking-[-0.32px] font-normal">
                Project can access memories from outside chats, and vice versa.
              </p>
            </button>
            <button
              onClick={() => onSelectMemoryOption("project-only")}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                memoryOption === "project-only"
                  ? "bg-foundation-accent-green/20 border-foundation-accent-green/40"
                  : "bg-transparent border-foundation-bg-light-3 dark:border-white/10 hover:border-foundation-bg-light-3/70 dark:hover:border-white/20"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-[14px] font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary leading-[20px] tracking-[-0.3px]">
                  Project-only
                </span>
              </div>
              <p className="text-[13px] text-foundation-text-light-tertiary dark:text-white/50 leading-[18px] tracking-[-0.32px] font-normal">
                Project can only access its own memories. Its memories are hidden from outside
                chats.
              </p>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-foundation-bg-light-3 dark:border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[14px] text-foundation-text-light-secondary dark:text-white/70 hover:text-foundation-text-light-primary dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors font-normal leading-[20px] tracking-[-0.3px]"
          >
            Cancel
          </button>
          <button
            onClick={onDone}
            className="px-4 py-2 text-[14px] bg-foundation-bg-light-1 dark:bg-white text-foundation-text-light-primary dark:text-foundation-text-dark-primary hover:bg-foundation-bg-light-1/90 dark:hover:bg-white/90 rounded-lg transition-colors font-semibold leading-[20px] tracking-[-0.3px]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export function ChatSidebar({
  isOpen,
  onToggle,
  onProjectSelect,
  projects,
  chatHistory,
  groupChats,
  categories,
  categoryIcons,
  categoryColors,
  categoryIconColors,
  user,
}: ChatSidebarProps) {
  const resolvedProjects = useMemo(() => projects ?? [], [projects]);
  const resolvedChatHistory = chatHistory ?? [];
  const resolvedGroupChats = groupChats ?? [];
  const resolvedCategories = categories ?? [];
  const resolvedCategoryIcons = categoryIcons ?? {};
  const resolvedCategoryColors = categoryColors ?? {};
  const resolvedCategoryIconColors = categoryIconColors ?? {};
  const resolvedUser: ChatSidebarUser = {
    name: user?.name ?? "User",
    accountLabel: user?.accountLabel ?? "Personal account",
    planLabel: user?.planLabel ?? "Pro",
  };

  const { sidebarFooter } = useChatUISlots();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [_selectedAction, _setSelectedAction] = useState("chatgpt");
  const [projectName, setProjectName] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [selectedProjectForIcon, setSelectedProjectForIcon] = useState<SidebarItem | null>(null);
  const [projectsData, setProjectsData] = useState<SidebarItem[]>(resolvedProjects);
  const [newProjectIcon, setNewProjectIcon] = useState("folder");
  const [newProjectColorId, setNewProjectColorId] = useState("gray");
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  // Ref to track if we've initialized from props (prevents overwriting local edits)
  const didInitProjectsRef = useRef(false);

  // Color key to class mapping (matches IconPickerModal colors)
  const colorClassMap: Record<string, string> = {
    gray: "text-foundation-icon-light-tertiary dark:text-white/60",
    blue: "text-foundation-accent-blue",
    green: "text-foundation-accent-green",
    orange: "text-foundation-accent-orange",
    red: "text-foundation-accent-red",
  };
  const newProjectColor = colorClassMap[newProjectColorId] || colorClassMap.gray;
  const [memoryOption, setMemoryOption] = useState<"default" | "project-only">("default");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [gptsExpanded, setGptsExpanded] = useState(false);
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const [groupChatsExpanded, setGroupChatsExpanded] = useState(false);
  const [yourChatsExpanded, setYourChatsExpanded] = useState(true);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  const onRailKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;

    const root = e.currentTarget as HTMLElement;
    const buttons = Array.from(
      root.querySelectorAll<HTMLButtonElement>('button[data-rail-item="true"]'),
    );
    const i = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (i < 0) return;

    const delta = e.key === "ArrowDown" ? 1 : -1;
    const next = buttons[(i + delta + buttons.length) % buttons.length];
    next?.focus();
    e.preventDefault();
  };

  // Initialize projects from props only once (prevents overwriting local edits)
  useEffect(() => {
    if (didInitProjectsRef.current) return;
    setProjectsData(resolvedProjects);
    didInitProjectsRef.current = true;
  }, [resolvedProjects]);

  const handleNewChat = () => {
    _setSelectedAction("chatgpt");
    console.log("Starting new chat");
    onToggle?.();
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => {
      const newCategories = prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category];
      setProjectName(newCategories.join(" "));
      return newCategories;
    });
  };

  const handleCreateProject = useCallback(() => {
    if (!projectName.trim()) return;

    const newProject: SidebarItem = {
      id: `project-${Date.now()}`,
      label: projectName,
      icon: getProjectIcon(newProjectIcon),
      color: newProjectColor,
    };

    // Use functional update to avoid stale state
    setProjectsData((prev) => [...prev, newProject]);
    setProjectName("");
    setSelectedCategories([]);
    // Note: Popover closing would require controlled state - this is left as exercise for implementer
  }, [projectName, newProjectIcon, newProjectColor]);

  const handleIconChange = useCallback((iconId: string, colorId: string) => {
    if (selectedProjectForIcon) {
      const newIcon = getProjectIcon(iconId);
      const colorClass = colorClassMap[colorId] || colorClassMap.gray;
      setProjectsData((prev) =>
        prev.map((project) =>
          project.id === selectedProjectForIcon.id ? { ...project, icon: newIcon, color: colorClass } : project,
        ),
      );
    }
    setShowIconPicker(false);
    setSelectedProjectForIcon(null);
  }, [selectedProjectForIcon]);

  const handleNewProjectIconChange = useCallback((iconId: string, colorId: string) => {
    setNewProjectIcon(iconId);
    setNewProjectColorId(colorId);
    setShowIconPicker(false);
  }, []);

  const handleProjectSelect = (project: SidebarItem) => {
    _setSelectedAction(project.id);
    if (onProjectSelect) {
      onProjectSelect(project);
    }
    onToggle?.();
  };

  const renderProjectIcon = (project: SidebarItem) => {
    if (!project.icon) return null;
    return project.color ? <span className={project.color}>{project.icon}</span> : project.icon;
  };

  const renderProjectActions = (projectId: string) =>
    hoveredProject === projectId ? (
      <button
        type="button"
        aria-label="Project options"
        className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          console.log("Project options");
        }}
      >
        <IconDotsHorizontal className="size-4 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary" />
      </button>
    ) : null;

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        className={`bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary flex flex-col h-full border-r border-foundation-bg-light-3 dark:border-white/10 transition-all duration-300 ${
          isCollapsed ? "w-[60px]" : "w-64"
        }`}
      >
        <div
          className={`flex items-center px-3 py-3 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!isCollapsed && (
            <div className="size-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
              <IconCloseBold className="size-4" />
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            type="button"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="size-8 flex items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <IconSidebar className="size-5 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary" />
          </button>
        </div>

        {isCollapsed ? (
          <div
            role="navigation"
            aria-label="Sidebar"
            onKeyDown={onRailKeyDown}
            className="flex-1 overflow-y-auto overflow-x-hidden pt-1"
          >
            {/* Primary actions */}
            <RailButton
              icon={<IconCompose className="size-4" />}
              label="New chat"
              active={_selectedAction === "chatgpt"}
              onClick={handleNewChat}
            />
            <RailButton
              icon={<IconSearch className="size-4" />}
              label="Search chats"
              active={_selectedAction === "search"}
              onClick={() => {
                _setSelectedAction("search");
                console.log("Search chats");
              }}
            />
            <RailButton
              icon={<IconRadio className="size-4" />}
              label="Pulse"
              active={_selectedAction === "pulse"}
              onClick={() => {
                _setSelectedAction("pulse");
                console.log("Pulse");
              }}
            />
            <RailButton
              icon={<IconImage className="size-4" />}
              label="Images"
              active={_selectedAction === "images"}
              onClick={() => {
                _setSelectedAction("images");
                console.log("Images");
              }}
            />
            <RailButton
              icon={<IconGrid3x3 className="size-4" />}
              label="Apps"
              active={_selectedAction === "apps"}
              onClick={() => {
                _setSelectedAction("apps");
                console.log("Apps");
              }}
            />
            <RailButton
              icon={<IconArchive className="size-4" />}
              label="Archived chats"
              active={_selectedAction === "archived"}
              onClick={() => {
                _setSelectedAction("archived");
                console.log("Archived chats");
              }}
            />
            <RailButton
              icon={<IconCode className="size-4" />}
              label="Codex"
              active={_selectedAction === "codex"}
              onClick={() => {
                _setSelectedAction("codex");
                console.log("Codex");
              }}
            />

            <div className="mx-2 my-2 border-t border-foundation-bg-light-3 dark:border-white/10" />

            {/* Projects */}
            <div role="group" aria-label="Projects">
              {projectsData.map((project) => (
                <RailButton
                  key={project.id}
                  icon={renderProjectIcon(project)}
                  label={project.label}
                  active={_selectedAction === project.id}
                  onClick={() => handleProjectSelect(project)}
                />
              ))}
            </div>

            {resolvedGroupChats.length > 0 ? (
              <>
                <div className="mx-2 my-2 border-t border-foundation-bg-light-3 dark:border-white/10" />
                <div role="group" aria-label="Group chats">
                  {resolvedGroupChats.map((chat) => (
                    <RailButton
                      key={chat.id}
                      icon={renderProjectIcon(chat)}
                      label={chat.label}
                      active={_selectedAction === chat.id}
                      onClick={() => handleProjectSelect(chat)}
                    />
                  ))}
                </div>
              </>
            ) : null}
          </div>
        ) : null}

        {!isCollapsed ? (
          <>
            <div className="px-2 pb-1">
              <ListItem
                icon={<IconCompose className="size-4" />}
                label={isCollapsed ? "" : "New chat"}
                onClick={handleNewChat}
                className={isCollapsed ? "justify-center" : ""}
              />
            </div>

            <div className="px-2 pb-1">
              <ListItem
                icon={<IconSearch className="size-4" />}
                label={isCollapsed ? "" : "Search chats"}
                className={isCollapsed ? "justify-center" : ""}
              />
            </div>

            <div className="px-2 pb-1">
              <ListItem icon={<Sparkles className="size-4" />} label="Your Year With ChatGPT" />
            </div>

            <div className="px-2 pb-1">
              <ListItem
                icon={<IconRadio className="size-4" />}
                label={isCollapsed ? "" : "Pulse"}
                className={isCollapsed ? "justify-center" : ""}
              />
            </div>

            <div className="px-2 pb-1">
              <ListItem
                icon={<IconImage className="size-4" />}
                label={isCollapsed ? "" : "Images"}
                right={
                  !isCollapsed && (
                    <span className="text-[10px] font-semibold leading-[14px] tracking-[0.5px] px-1.5 py-0.5 bg-black/10 dark:bg-white/10 rounded text-foundation-text-light-primary dark:text-white uppercase">
                      NEW
                    </span>
                  )
                }
                className={isCollapsed ? "justify-center" : ""}
              />
            </div>

            {!isCollapsed && (
              <div className="px-2 pb-1">
                <ListItem icon={<IconArchive className="size-4" />} label="Archived chats" />
              </div>
            )}

            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              {!isCollapsed && (
                <div className="px-2 pb-1">
                  <ListItem icon={<IconGrid3x3 className="size-4" />} label="Apps" />
                </div>
              )}

              {!isCollapsed && (
                <div className="px-2 pb-1">
                  <ListItem icon={<IconCode className="size-4" />} label="Codex" />
                </div>
              )}

              {!isCollapsed && (
                <CollapsibleSection
                  title="GPTs"
                  expanded={gptsExpanded}
                  onExpandedChange={(expanded: boolean) => setGptsExpanded(expanded)}
                />
              )}

              {!isCollapsed && (
                <CollapsibleSection
                  title="Projects"
                  expanded={projectsExpanded}
                  onExpandedChange={(expanded: boolean) => setProjectsExpanded(expanded)}
                />
              )}

              {projectsExpanded && !isCollapsed && (
            <>
              <div className="px-2 pb-1">
                <Popover>
                  <Popover.Trigger asChild>
                    <div className="w-full">
                      <ListItem icon={<IconFolder className="size-4" />} label="New project" />
                    </div>
                  </Popover.Trigger>
                  <Popover.Content
                    side="right"
                    align="start"
                    sideOffset={12}
                    className="z-[60] w-[420px] rounded-2xl border border-foundation-bg-light-3 dark:border-white/10 bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 shadow-2xl outline-none"
                  >
                    <div className="px-6 pt-6 pb-5">
                      <p className="text-[13px] text-foundation-text-light-tertiary dark:text-white/50 leading-[18px] tracking-[-0.32px] font-normal text-center">
                        Projects give ChatGPT shared context
                        <br />
                        across chats and files, all in one place.
                      </p>
                    </div>
                    <div className="px-6 pb-6">
                      <div className="relative mb-5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowIconPicker(true);
                          }}
                          aria-label="Choose project icon"
                          title="Choose project icon"
                          className={`absolute left-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity ${newProjectColor}`}
                        >
                          {getProjectIcon(newProjectIcon)}
                        </button>
                        <input
                          type="text"
                          placeholder="Project Name"
                          aria-label="Project Name"
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                          className="w-full bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 border border-foundation-bg-light-3 dark:border-white/10 rounded-lg pl-10 pr-3 py-3 text-[14px] text-foundation-text-light-primary dark:text-white placeholder:text-foundation-text-light-tertiary dark:placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20 transition-all font-normal leading-[20px] tracking-[-0.3px]"
                        />
                      </div>
                      {resolvedCategories.length > 0 ? (
                        <div className="mb-6">
                          <div
                            className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide"
                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                          >
                            {resolvedCategories.map((category) => {
                              const isSelected = selectedCategories.includes(category);
                              return (
                                <button
                                  key={category}
                                  onClick={() => toggleCategory(category)}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[14px] border transition-all whitespace-nowrap flex-shrink-0 font-normal leading-[20px] tracking-[-0.3px] ${
                                    isSelected
                                      ? resolvedCategoryColors[
                                          category as keyof typeof resolvedCategoryColors
                                        ]
                                      : "bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 text-foundation-text-light-tertiary dark:text-white/60 border-foundation-bg-light-3 dark:border-white/10 hover:bg-foundation-bg-light-3/80 dark:hover:bg-foundation-bg-dark-3/80"
                                  }`}
                                >
                                  {resolvedCategoryIcons[category] ? (
                                    <span
                                      className={
                                        resolvedCategoryIconColors[
                                          category as keyof typeof resolvedCategoryIconColors
                                        ]
                                      }
                                    >
                                      {
                                        resolvedCategoryIcons[
                                          category as keyof typeof resolvedCategoryIcons
                                        ]
                                      }
                                    </span>
                                  ) : null}
                                  <span>{category}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : null}
                      <button
                        onClick={handleCreateProject}
                        disabled={!projectName.trim()}
                        className="w-full bg-foundation-accent-green hover:bg-foundation-accent-green/80 disabled:bg-foundation-bg-light-3 dark:disabled:bg-foundation-bg-dark-3 disabled:text-foundation-text-light-tertiary dark:disabled:text-white/30 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-all text-[14px] font-normal leading-[20px] tracking-[-0.3px]"
                      >
                        Create project
                      </button>
                      <button
                        onClick={() => setShowMoreOptions(true)}
                        className="w-full bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 hover:bg-foundation-bg-light-3/80 dark:hover:bg-foundation-bg-dark-3/80 text-foundation-text-light-secondary dark:text-white/70 py-3 rounded-lg mt-2 transition-colors text-[14px] font-normal leading-[20px] tracking-[-0.3px]"
                      >
                        More options
                      </button>
                    </div>
                  </Popover.Content>
                </Popover>
              </div>
              {projectsData.map((project) => (
                <div
                  key={project.id}
                  className="px-2 pb-1"
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                  onFocusCapture={() => setHoveredProject(project.id)}
                  onBlurCapture={() => setHoveredProject(null)}
                >
                  <ListItem
                    icon={renderProjectIcon(project)}
                    label={project.label}
                    onClick={() => handleProjectSelect(project)}
                    right={renderProjectActions(project.id)}
                  />
                </div>
              ))}
            </>
          )}

          {resolvedGroupChats.length > 0 && (
            <CollapsibleSection
              title="Group chats"
              expanded={groupChatsExpanded}
              onExpandedChange={(expanded: boolean) => setGroupChatsExpanded(expanded)}
            />
          )}

          {groupChatsExpanded && resolvedGroupChats.length > 0 && (
            <>
              {resolvedGroupChats.map((chat) => (
                <div
                  key={chat.id}
                  className="px-2 pb-1"
                  onMouseEnter={() => setHoveredProject(chat.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                  onFocusCapture={() => setHoveredProject(chat.id)}
                  onBlurCapture={() => setHoveredProject(null)}
                >
                  <ListItem
                    icon={renderProjectIcon(chat)}
                    label={chat.label}
                    onClick={() => handleProjectSelect(chat)}
                    right={renderProjectActions(chat.id)}
                  />
                </div>
              ))}
            </>
          )}

          {resolvedChatHistory.length > 0 && (
            <CollapsibleSection
              title="Your chats"
              expanded={yourChatsExpanded}
              onExpandedChange={(expanded: boolean) => setYourChatsExpanded(expanded)}
            />
          )}

          {yourChatsExpanded && resolvedChatHistory.length > 0 && (
            <>
              {resolvedChatHistory.slice(0, 5).map((chat) => (
                <div key={chat} className="px-2 pb-1">
                  <ListItem label={chat} />
                </div>
              ))}
            </>
          )}
            </div>
          </>
        ) : null}

        {sidebarFooter && !isCollapsed ? <div className="px-2 pb-2">{sidebarFooter}</div> : null}

        <div className="p-2 border-t border-foundation-bg-light-3 dark:border-white/10 relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-haspopup="menu"
            aria-expanded={showUserMenu}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? resolvedUser.name : ""}
          >
            <div className="size-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
              <IconCloseBold className="size-4" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col items-start flex-1 min-w-0">
                <span className="text-[14px] truncate font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                  {resolvedUser.name}
                </span>
                <span className="text-[12px] font-normal leading-[16px] tracking-[-0.3px] text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
                  {resolvedUser.accountLabel}
                </span>
              </div>
            )}
          </button>
          {showUserMenu && !isCollapsed && (
            <div role="menu" className="absolute bottom-full left-3 right-3 mb-2 bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 border border-foundation-bg-light-3 dark:border-white/20 rounded-xl shadow-2xl py-1 z-50">
              <div className="px-3 py-2.5 border-b border-foundation-bg-light-3 dark:border-white/10">
                <div className="flex items-center gap-2 text-[13px]">
                  <div className="size-2 rounded-full bg-foundation-accent-green" />
                  <span className="text-foundation-text-light-secondary dark:text-white/70 font-normal">{resolvedUser.planLabel}</span>
                </div>
              </div>
              <button className="w-full text-left px-3 py-2.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-2">
                <svg
                  className="size-4 text-foundation-text-light-secondary dark:text-white/70"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="text-[14px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary font-normal leading-[20px] tracking-[-0.3px]">
                  {resolvedUser.accountLabel}
                </span>
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  setShowSettingsModal(true);
                }}
                className="w-full text-left px-3 py-2.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-2"
              >
                <IconSettings className="size-4 text-foundation-text-light-secondary dark:text-white/70" />
                <span className="text-[14px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary font-normal leading-[20px] tracking-[-0.3px]">
                  Settings
                </span>
              </button>
              <div className="my-1 border-t border-foundation-bg-light-3 dark:border-white/10" />
              <button className="w-full text-left px-3 py-2.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <span className="text-[14px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary font-normal leading-[20px] tracking-[-0.3px]">
                  Log Out
                </span>
              </button>
            </div>
          )}
        </div>

        {showIconPicker && selectedProjectForIcon && (
          <IconPickerModal
            isOpen={showIconPicker}
            onClose={() => {
              setShowIconPicker(false);
              setSelectedProjectForIcon(null);
            }}
            onSave={handleIconChange}
            currentIconId={selectedProjectForIcon.id}
            currentColorId={getColorIdFromClass(selectedProjectForIcon.color)}
            projectName={selectedProjectForIcon.label}
          />
        )}

        {showIconPicker && !selectedProjectForIcon && (
          <IconPickerModal
            isOpen={showIconPicker}
            onClose={() => {
              setShowIconPicker(false);
              setShowMoreOptions(false);
            }}
            onSave={handleNewProjectIconChange}
            currentIconId={newProjectIcon}
            currentColorId={newProjectColorId}
            projectName={projectName || "New Project"}
          />
        )}

        {showMoreOptions && !showIconPicker && (
          <ProjectSettingsModal
            memoryOption={memoryOption}
            onSelectMemoryOption={setMemoryOption}
            onClose={() => setShowMoreOptions(false)}
            onDone={() => {
              console.log("Memory option:", memoryOption);
              setShowMoreOptions(false);
            }}
          />
        )}

        {showSettingsModal && (
          <SettingsModal
            isOpen={showSettingsModal}
            onClose={() => setShowSettingsModal(false)}
            account={{ subscriptionLabel: resolvedUser.planLabel }}
          />
        )}
      </div>
    </>
  );
}
