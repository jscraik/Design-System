import { useState } from "react";

import { Popover } from "../../vendor/appsSdkUi";
import {
  IconArchive,
  IconChat,
  IconChevronRightMd,
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
} from "../../icons";
import {
  IconBarChart,
  IconBook,
  IconCompose,
  IconWriting,
} from "./icons/ChatGPTIcons";
import { IconPickerModal } from "./IconPickerModal";
import { SettingsModal } from "./SettingsModal";
import { useChatUISlots } from "../slots";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  color?: string;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onProjectSelect?: (project: SidebarItem) => void;
}

const projects: SidebarItem[] = [
  {
    id: "apps-sdk",
    label: "Apps SDK Designer",
    icon: <IconWriting className="size-4" />,
    color: "text-[var(--foundation-accent-blue)]",
  },
  {
    id: "dadmode",
    label: "DADMODE",
    icon: <IconBarChart className="size-4" />,
    color: "text-[var(--foundation-accent-green)]",
  },
  {
    id: "peer",
    label: "PEER Framework",
    icon: <IconFolder className="size-4" />,
    color: "text-[var(--foundation-accent-orange)]",
  },
];

const chatHistory = [
  "Greeting exchange",
  "Storybook and Apps SDK UI",
  "Conversation start",
  "Your Year with ChatGPT",
  "CRMO explanation and sensitivity",
  "Project governance complexity",
  "React Component Explorers",
  "Clone SwiftUI macOS App",
  "Apps SDK UI examples",
  "Governance framework expansion",
  "New chat",
  "Bobblehead figurine design",
  "Plushie transformation concept",
  "Plushie-style transformation",
  "3D pencil sketch generation",
  "Assistant response clarification",
  "Learn Year 7 Maths",
];

const categories = ["Investing", "Homework", "Writing", "Coding", "Research"];

const categoryIcons = {
  Investing: <IconBarChart className="size-3" />,
  Homework: <IconBook className="size-3" />,
  Writing: <IconWriting className="size-3" />,
  Coding: <IconCompose className="size-3" />,
  Research: <IconSearch className="size-3" />,
};

const categoryColors = {
  Investing:
    "bg-[var(--foundation-accent-green)]/20 text-[var(--foundation-accent-green)] border-[var(--foundation-accent-green)]/30",
  Homework:
    "bg-[var(--foundation-accent-blue)]/20 text-[var(--foundation-accent-blue)] border-[var(--foundation-accent-blue)]/30",
  Writing:
    "bg-[var(--foundation-accent-orange)]/20 text-[var(--foundation-accent-orange)] border-[var(--foundation-accent-orange)]/30",
  Coding:
    "bg-[var(--foundation-accent-red)]/20 text-[var(--foundation-accent-red)] border-[var(--foundation-accent-red)]/30",
  Research:
    "bg-[var(--foundation-accent-blue)]/20 text-[var(--foundation-accent-blue)] border-[var(--foundation-accent-blue)]/30",
};

const categoryIconColors = {
  Investing: "text-[var(--foundation-accent-green)]",
  Homework: "text-[var(--foundation-accent-blue)]",
  Writing: "text-[var(--foundation-accent-orange)]",
  Coding: "text-[var(--foundation-accent-red)]",
  Research: "text-[var(--foundation-accent-blue)]",
};

const projectIconMap: { [key: string]: React.ReactNode } = {
  folder: <IconFolder className="size-4" />,
  chat: <IconChat className="size-4" />,
  "bar-chart": <IconBarChart className="size-4" />,
  writing: <IconWriting className="size-4" />,
  book: <IconBook className="size-4" />,
  compose: <IconCompose className="size-4" />,
};

const getProjectIcon = (iconId: string) =>
  projectIconMap[iconId] || <IconFolder className="size-4" />;

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
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100]"
      onClick={onClose}
    >
      <div
        className="bg-[var(--foundation-bg-dark-2)] border border-white/10 text-white rounded-2xl w-[380px] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-5">
          <h2 className="text-[16px] font-semibold text-white leading-[22px] tracking-[-0.32px]">
            Project settings
          </h2>
        </div>
        <div className="px-6 pb-6">
          <div className="mb-6">
            <h3 className="text-[13px] text-white/50 mb-3 font-normal leading-[18px] tracking-[-0.3px]">
              Memory
            </h3>
            <button
              onClick={() => onSelectMemoryOption("default")}
              className={`w-full text-left p-4 rounded-xl mb-3 border-2 transition-all ${
                memoryOption === "default"
                  ? "bg-[var(--foundation-accent-green)]/20 border-[var(--foundation-accent-green)]/40"
                  : "bg-transparent border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-[14px] font-semibold text-white leading-[20px] tracking-[-0.3px]">
                  Default
                </span>
              </div>
              <p className="text-[13px] text-white/50 leading-[18px] tracking-[-0.32px] font-normal">
                Project can access memories from outside chats, and vice versa.
              </p>
            </button>
            <button
              onClick={() => onSelectMemoryOption("project-only")}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                memoryOption === "project-only"
                  ? "bg-[var(--foundation-accent-green)]/20 border-[var(--foundation-accent-green)]/40"
                  : "bg-transparent border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-[14px] font-semibold text-white leading-[20px] tracking-[-0.3px]">
                  Project-only
                </span>
              </div>
              <p className="text-[13px] text-white/50 leading-[18px] tracking-[-0.32px] font-normal">
                Project can only access its own memories. Its memories are hidden
                from outside chats.
              </p>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[14px] text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-normal leading-[20px] tracking-[-0.3px]"
          >
            Cancel
          </button>
          <button
            onClick={onDone}
            className="px-4 py-2 text-[14px] bg-white text-[var(--foundation-text-light-primary)] hover:bg-white/90 rounded-lg transition-colors font-semibold leading-[20px] tracking-[-0.3px]"
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
}: ChatSidebarProps) {
  const { sidebarFooter } = useChatUISlots();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAction, setSelectedAction] = useState("chatgpt");
  const [projectName, setProjectName] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [selectedProjectForIcon, setSelectedProjectForIcon] =
    useState<SidebarItem | null>(null);
  const [projectsData, setProjectsData] = useState<SidebarItem[]>(projects);
  const [newProjectIcon, setNewProjectIcon] = useState("folder");
  const [newProjectColor, setNewProjectColor] = useState("text-white/60");
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [memoryOption, setMemoryOption] =
    useState<"default" | "project-only">("default");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [gptsExpanded, setGptsExpanded] = useState(false);
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const [groupChatsExpanded, setGroupChatsExpanded] = useState(false);
  const [yourChatsExpanded, setYourChatsExpanded] = useState(true);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  const handleNewChat = () => {
    console.log("Starting new chat");
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

  const handleCreateProject = () => {
    console.log("Creating project:", {
      name: projectName,
      categories: selectedCategories,
    });
    setProjectName("");
    setSelectedCategories([]);
  };

  const handleIconChange = (iconId: string, color: string) => {
    if (selectedProjectForIcon) {
      const newIcon = getProjectIcon(iconId);
      const updatedProjects = projectsData.map((project) =>
        project.id === selectedProjectForIcon.id
          ? { ...project, icon: newIcon, color }
          : project,
      );
      setProjectsData(updatedProjects);
    }
    setShowIconPicker(false);
    setSelectedProjectForIcon(null);
  };

  const handleNewProjectIconChange = (iconId: string, color: string) => {
    setNewProjectIcon(iconId);
    setNewProjectColor(color);
    setShowIconPicker(false);
  };

  const handleProjectSelect = (project: SidebarItem) => {
    setSelectedAction(project.id);
    if (onProjectSelect) {
      onProjectSelect(project);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        className={`bg-[var(--foundation-bg-dark-1)] text-white flex flex-col h-full border-r border-white/10 transition-all duration-300 ${
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
            className="size-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <IconSidebar className="size-5 text-[var(--foundation-text-dark-tertiary)]" />
          </button>
        </div>

        <div className="px-2 pb-1">
          <button
            onClick={handleNewChat}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/5 ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "New chat" : ""}
          >
            <IconCompose className="size-4 flex-shrink-0 text-white" />
            {!isCollapsed && (
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white">
                New chat
              </span>
            )}
          </button>
        </div>

        <div className="px-2 pb-1">
          <button
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/5 ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Search chats" : ""}
          >
            <IconSearch className="size-4 flex-shrink-0 text-white" />
            {!isCollapsed && (
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white">
                Search chats
              </span>
            )}
          </button>
        </div>

        {!isCollapsed && (
          <div className="px-2 pb-1">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/5">
              <Sparkles className="size-4 flex-shrink-0 text-white" />
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white">
                Your Year With ChatGPT
              </span>
            </button>
          </div>
        )}

        <div className="px-2 pb-1">
          <button
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/5 ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Pulse" : ""}
          >
            <IconRadio className="size-4 flex-shrink-0 text-white" />
            {!isCollapsed && (
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white">
                Pulse
              </span>
            )}
          </button>
        </div>

        <div className="px-2 pb-1">
          <button
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/5 ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Images" : ""}
          >
            <IconImage className="size-4 flex-shrink-0 text-white" />
            {!isCollapsed && (
              <>
                <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white">
                  Images
                </span>
                <span className="ml-auto text-[10px] font-semibold leading-[14px] tracking-[0.5px] px-1.5 py-0.5 bg-white/10 rounded text-white uppercase">
                  NEW
                </span>
              </>
            )}
          </button>
        </div>

        {!isCollapsed && (
          <div className="px-2 pb-1">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/5">
              <IconArchive className="size-4 flex-shrink-0 text-white" />
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white">
                Archived chats
              </span>
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {!isCollapsed && (
            <div className="px-2 pb-1">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/5">
                <IconGrid3x3 className="size-4 flex-shrink-0 text-white" />
                <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white">
                  Apps
                </span>
              </button>
            </div>
          )}

          {!isCollapsed && (
            <div className="px-2 pb-1">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/5">
                <IconCode className="size-4 flex-shrink-0 text-white" />
                <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white">
                  Codex
                </span>
              </button>
            </div>
          )}

          {!isCollapsed && (
            <div className="px-2 pb-1 pt-2">
              <button
                onClick={() => setGptsExpanded(!gptsExpanded)}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5"
              >
                <span className="text-[13px] font-normal leading-[18px] tracking-[-0.3px] text-[var(--foundation-text-dark-tertiary)]">
                  GPTs
                </span>
                <IconChevronRightMd
                  className={`size-3 text-[var(--foundation-text-dark-tertiary)] transition-transform ${
                    gptsExpanded ? "rotate-90" : ""
                  }`}
                />
              </button>
            </div>
          )}

          {!isCollapsed && (
            <div className="px-2 pb-1">
              <button
                onClick={() => setProjectsExpanded(!projectsExpanded)}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5"
              >
                <span className="text-[13px] font-normal leading-[18px] tracking-[-0.3px] text-[var(--foundation-text-dark-tertiary)]">
                  Projects
                </span>
                <IconChevronRightMd
                  className={`size-3 text-[var(--foundation-text-dark-tertiary)] transition-transform ${
                    projectsExpanded ? "rotate-90" : ""
                  }`}
                />
              </button>
            </div>
          )}

          {projectsExpanded && !isCollapsed && (
            <>
              <div className="px-2 pb-1">
                <Popover>
                  <Popover.Trigger>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/5">
                      <IconFolder className="size-4 flex-shrink-0 text-white" />
                      <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white">
                        New project
                      </span>
                    </button>
                  </Popover.Trigger>
                  <Popover.Content
                    side="right"
                    align="start"
                    sideOffset={12}
                    className="z-[60] w-[420px] rounded-2xl border border-white/10 bg-[var(--foundation-bg-dark-2)] shadow-2xl outline-none"
                  >
                    <div className="px-6 pt-6 pb-5">
                      <p className="text-[13px] text-white/50 leading-[18px] tracking-[-0.32px] font-normal text-center">
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
                          className={`absolute left-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity ${newProjectColor}`}
                        >
                          {getProjectIcon(newProjectIcon)}
                        </button>
                        <input
                          type="text"
                          placeholder="Project Name"
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                          className="w-full bg-[var(--foundation-bg-dark-3)] border border-white/10 rounded-lg pl-10 pr-3 py-3 text-[14px] text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all font-normal leading-[20px] tracking-[-0.3px]"
                        />
                      </div>
                      <div className="mb-6">
                        <div
                          className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide"
                          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        >
                          {categories.map((category) => {
                            const isSelected =
                              selectedCategories.includes(category);
                            return (
                              <button
                                key={category}
                                onClick={() => toggleCategory(category)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[14px] border transition-all whitespace-nowrap flex-shrink-0 font-normal leading-[20px] tracking-[-0.3px] ${
                                  isSelected
                                    ? categoryColors[
                                        category as keyof typeof categoryColors
                                      ]
                                    : "bg-[var(--foundation-bg-dark-3)] text-white/60 border-white/10 hover:bg-[var(--foundation-bg-dark-3)]/80"
                                }`}
                              >
                                <span
                                  className={
                                    categoryIconColors[
                                      category as keyof typeof categoryIconColors
                                    ]
                                  }
                                >
                                  {categoryIcons[
                                    category as keyof typeof categoryIcons
                                  ]}
                                </span>
                                <span>{category}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <button
                        onClick={handleCreateProject}
                        disabled={!projectName.trim()}
                        className="w-full bg-[var(--foundation-accent-green)] hover:bg-[var(--foundation-accent-green)]/80 disabled:bg-[var(--foundation-bg-dark-3)] disabled:text-white/30 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-all text-[14px] font-normal leading-[20px] tracking-[-0.3px]"
                      >
                        Create project
                      </button>
                      <button
                        onClick={() => setShowMoreOptions(true)}
                        className="w-full bg-[var(--foundation-bg-dark-3)] hover:bg-[var(--foundation-bg-dark-3)]/80 text-white/70 py-3 rounded-lg mt-2 transition-colors text-[14px] font-normal leading-[20px] tracking-[-0.3px]"
                      >
                        More options
                      </button>
                    </div>
                  </Popover.Content>
                </Popover>
              </div>

              <div
                className="px-2 pb-1 group"
                onMouseEnter={() => setHoveredProject("apps-sdk-lib")}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <div className="relative">
                  <button
                    onClick={() =>
                      handleProjectSelect({
                        id: "apps-sdk-lib",
                        label: "Apps SDK Library",
                        icon: <IconCode className="size-4" />,
                        color: "text-[var(--foundation-accent-green)]",
                      })
                    }
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/5"
                  >
                    <IconCode className="size-4 flex-shrink-0 text-[var(--foundation-accent-green)]" />
                    <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white text-left">
                      Apps SDK Library
                    </span>
                  </button>
                  {hoveredProject === "apps-sdk-lib" && (
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-md transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Project options");
                      }}
                    >
                      <IconDotsHorizontal className="size-4 text-[var(--foundation-text-dark-tertiary)]" />
                    </button>
                  )}
                </div>
              </div>

              <div
                className="px-2 pb-1 group"
                onMouseEnter={() => setHoveredProject("apps-sdk")}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <div className="relative">
                  <button
                    onClick={() => handleProjectSelect(projectsData[0])}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/5"
                  >
                    <IconWriting className="size-4 flex-shrink-0 text-[var(--foundation-accent-blue)]" />
                    <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white text-left">
                      Apps SDK Designer
                    </span>
                  </button>
                  {hoveredProject === "apps-sdk" && (
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-md transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Project options");
                      }}
                    >
                      <IconDotsHorizontal className="size-4 text-[var(--foundation-text-dark-tertiary)]" />
                    </button>
                  )}
                </div>
              </div>

              <div
                className="px-2 pb-1 group"
                onMouseEnter={() => setHoveredProject("dadmode")}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <div className="relative">
                  <button
                    onClick={() => handleProjectSelect(projectsData[1])}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/5"
                  >
                    <IconBarChart className="size-4 flex-shrink-0 text-[var(--foundation-accent-green)]" />
                    <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white text-left">
                      DADMODE
                    </span>
                  </button>
                  {hoveredProject === "dadmode" && (
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-md transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Project options");
                      }}
                    >
                      <IconDotsHorizontal className="size-4 text-[var(--foundation-text-dark-tertiary)]" />
                    </button>
                  )}
                </div>
              </div>

              <div
                className="px-2 pb-1 group"
                onMouseEnter={() => setHoveredProject("peer")}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <div className="relative">
                  <button
                    onClick={() => handleProjectSelect(projectsData[2])}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/5"
                  >
                    <IconFolder className="size-4 flex-shrink-0 text-[var(--foundation-accent-orange)]" />
                    <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white text-left">
                      PEER Framework
                    </span>
                  </button>
                  {hoveredProject === "peer" && (
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-md transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Project options");
                      }}
                    >
                      <IconDotsHorizontal className="size-4 text-[var(--foundation-text-dark-tertiary)]" />
                    </button>
                  )}
                </div>
              </div>

              <div
                className="px-2 pb-1 group"
                onMouseEnter={() => setHoveredProject("lyra")}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <div className="relative">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/5">
                    <IconFolder className="size-4 flex-shrink-0 text-[var(--foundation-accent-orange)]" />
                    <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white text-left">
                      Lyra Interactive
                    </span>
                  </button>
                  {hoveredProject === "lyra" && (
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-md transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Project options");
                      }}
                    >
                      <IconDotsHorizontal className="size-4 text-[var(--foundation-text-dark-tertiary)]" />
                    </button>
                  )}
                </div>
              </div>

              <div className="px-2 pb-1">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/5">
                  <IconDotsHorizontal className="size-4 flex-shrink-0 text-white" />
                  <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white">
                    See more
                  </span>
                </button>
              </div>
            </>
          )}

          {!isCollapsed && (
            <div className="px-2 pb-1 pt-2">
              <button
                onClick={() => setGroupChatsExpanded(!groupChatsExpanded)}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5"
              >
                <span className="text-[13px] font-normal leading-[18px] tracking-[-0.3px] text-[var(--foundation-text-dark-tertiary)]">
                  Group chats
                </span>
                <IconChevronRightMd
                  className={`size-3 text-[var(--foundation-text-dark-tertiary)] transition-transform ${
                    groupChatsExpanded ? "rotate-90" : ""
                  }`}
                />
              </button>
            </div>
          )}

          {groupChatsExpanded && !isCollapsed && (
            <div className="px-2 pb-1">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/5">
                <div className="size-6 rounded-full bg-[var(--foundation-accent-red)] flex items-center justify-center flex-shrink-0">
                  <IconChat className="size-3 text-white" />
                </div>
                <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white">
                  Summarize chat exchange
                </span>
              </button>
            </div>
          )}

          {!isCollapsed && (
            <div className="px-2 pb-1 pt-2">
              <button
                onClick={() => setYourChatsExpanded(!yourChatsExpanded)}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5"
              >
                <span className="text-[13px] font-normal leading-[18px] tracking-[-0.3px] text-[var(--foundation-text-dark-tertiary)]">
                  Your chats
                </span>
                <IconChevronRightMd
                  className={`size-3 text-[var(--foundation-text-dark-tertiary)] transition-transform ${
                    yourChatsExpanded ? "rotate-90" : ""
                  }`}
                />
              </button>
            </div>
          )}

          {yourChatsExpanded && !isCollapsed && (
            <>
              {chatHistory.slice(0, 5).map((chat) => (
                <div key={chat} className="px-2 pb-1">
                  <button className="w-full text-left px-3 py-2.5 rounded-lg transition-colors hover:bg-white/5">
                    <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-white">
                      {chat}
                    </span>
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="p-2 border-t border-white/10 relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Jamie Scott Craik" : ""}
          >
            <div className="size-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
              <IconCloseBold className="size-4" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col items-start flex-1 min-w-0">
                <span className="text-[14px] truncate font-normal leading-[20px] tracking-[-0.3px] text-white">
                  Jamie Scott Craik
                </span>
                <span className="text-[12px] font-normal leading-[16px] tracking-[-0.3px] text-[var(--foundation-text-dark-tertiary)]">
                  Personal account
                </span>
              </div>
            )}
          </button>
          {showUserMenu && !isCollapsed && (
            <div className="absolute bottom-full left-3 right-3 mb-2 bg-[var(--foundation-bg-dark-2)] border border-white/20 rounded-xl shadow-2xl py-1 z-50">
              <div className="px-3 py-2.5 border-b border-white/10">
                <div className="flex items-center gap-2 text-[13px]">
                  <div className="size-2 rounded-full bg-[var(--foundation-accent-green)]" />
                  <span className="text-white/70 font-normal">
                    PRO/Veteran/Lik
                  </span>
                </div>
              </div>
              <button className="w-full text-left px-3 py-2.5 hover:bg-white/5 transition-colors flex items-center gap-2">
                <svg
                  className="size-4 text-white/70"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="text-[14px] text-white font-normal leading-[20px] tracking-[-0.3px]">
                  Personal account
                </span>
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  setShowSettingsModal(true);
                }}
                className="w-full text-left px-3 py-2.5 hover:bg-white/5 transition-colors flex items-center gap-2"
              >
                <IconSettings className="size-4 text-white/70" />
                <span className="text-[14px] text-white font-normal leading-[20px] tracking-[-0.3px]">
                  Settings
                </span>
              </button>
              <div className="my-1 border-t border-white/10" />
              <button className="w-full text-left px-3 py-2.5 hover:bg-white/5 transition-colors">
                <span className="text-[14px] text-white font-normal leading-[20px] tracking-[-0.3px]">
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
            currentColor={selectedProjectForIcon.color}
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
            currentColor={newProjectColor}
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
          />
        )}
      </div>
      {sidebarFooter}
    </>
  );
}
