/**
 * ChatSidebar - Refactored main component
 *
 * This component has been refactored into smaller, focused modules:
 * - modals/ - Modal components (ProjectSettingsModal, NewProjectModal)
 * - data/ - Hardcoded data (projects, chatHistory, categories)
 * - hooks/ - State management hook (useChatSidebarState)
 *
 * Main component now focuses on composition and rendering.
 */

import { useRef } from "react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../../components/ui/base/Collapsible";
import { Input } from "../../../components/ui/base/Input";
import { ListItem } from "../../../components/ui/base/ListItem";
import {
  IconChat,
  IconChevronRightMd,
  IconCloseBold,
  IconSearch,
  IconSettings,
  IconSidebar,
  IconArchive,
  IconCode,
  IconGrid3x3,
  IconImage,
  IconRadio,
  IconSparkles,
} from "../../../icons";
import { IconPickerModal } from "../../modals/IconPickerModal";
import { SettingsModal } from "../../modals/SettingsModal";
import type { ChatSidebarUser, SidebarItem, SidebarItemConfig } from "../shared/types";

import { ChatSidebarFooterSlot } from "./components/ChatSidebarFooterSlot";
import { ChatSidebarHistory } from "./components/ChatSidebarHistory";
import { ChatSidebarQuickActions } from "./components/ChatSidebarQuickActions";
import { NewProjectModal } from "./modals/NewProjectModal";
import { ProjectSettingsModal } from "./modals/ProjectSettingsModal";
import {
  categoryColors as defaultCategoryColors,
  categoryIcons as defaultCategoryIcons,
  categoryIconColors as defaultCategoryIconColors,
  categories as defaultCategories,
  chatHistory as defaultChatHistory,
  getProjectIcon,
  projects as defaultProjects,
} from "./data/projectData";
import { useChatSidebarState } from "./hooks/useChatSidebarState";

/**
 * Props for the chat sidebar component.
 */
interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onProjectSelect?: (project: SidebarItem) => void;
  projects?: SidebarItem[];
  chatHistory?: string[];
  groupChats?: SidebarItem[];
  categories?: string[];
  categoryIcons?: Record<string, React.ReactNode>;
  categoryColors?: Record<string, string>;
  categoryIconColors?: Record<string, string>;
  user?: ChatSidebarUser;
}

/* eslint-disable complexity */
/**
 * Renders the chat sidebar with projects, history, and quick actions.
 *
 * @param props - Chat sidebar props.
 * @returns A sidebar panel element.
 */
export function ChatSidebar({
  isOpen,
  onToggle: _onToggle,
  onProjectSelect,
  projects,
  chatHistory,
  groupChats: _groupChats,
  categories,
  categoryIcons,
  categoryColors,
  categoryIconColors,
  user: _user,
}: ChatSidebarProps) {
  const resolvedProjects = projects ?? defaultProjects;
  const resolvedChatHistory = chatHistory ?? defaultChatHistory;
  const resolvedCategories = categories ?? defaultCategories;
  const resolvedCategoryIcons = categoryIcons ?? defaultCategoryIcons;
  const resolvedCategoryColors = categoryColors ?? defaultCategoryColors;
  const resolvedCategoryIconColors = categoryIconColors ?? defaultCategoryIconColors;

  const sidebarState = useChatSidebarState(resolvedProjects);
  const userMenuButtonRef = useRef<HTMLButtonElement | null>(null);

  const {
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
    setIsCollapsed,
    setSearchQuery,
    setProjectName,
    setShowMoreOptions,
    setShowNewProjectModal,
    setShowUserMenu,
    setShowSettingsModal,
    setGptsExpanded,
    setProjectsExpanded,
    setGroupChatsExpanded,
    setYourChatsExpanded,
    setMemoryOption,
    setSelectedChatId,
    setSelectedAction,
    setSelectedProjectForIcon,
    setShowIconPicker,
    handleNewChat,
    toggleCategory,
    handleCreateProject,
    handleIconChange,
    handleNewProjectIconChange,
    handleProjectSelect,
  } = sidebarState;

  if (!isOpen) {
    return null;
  }

  const railItemClassName = isCollapsed ? "justify-center" : "";

  return (
    <>
      <div
        data-testid="chat-sidebar"
        role="navigation"
        aria-label="Chat sidebar"
        className={`bg-background text-foreground flex flex-col h-full border-r border-border transition-all duration-300 shrink-0 ${
          isCollapsed ? "w-[60px]" : "w-64"
        }`}
      >
        <div
          className={`flex items-center px-6 py-6 ${isCollapsed ? "justify-center" : "justify-between"}`}
        >
          {!isCollapsed && (
            <div className="size-8 rounded-full bg-foundation-accent-purple-light dark:bg-foundation-accent-purple text-foundation-text-dark-primary flex items-center justify-center flex-shrink-0">
              <IconCloseBold className="size-4" />
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="size-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            data-testid="chat-sidebar-toggle"
          >
            <IconSidebar className="size-6 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
          </button>
        </div>

        <div className="px-3 pb-3">
          {isCollapsed ? (
            <ListItem
              icon={<IconSearch className="size-5" />}
              label=""
              ariaLabel="Search chats"
              title="Search chats"
              dataRailItem={true}
              onClick={() => setIsCollapsed(false)}
              className={railItemClassName}
            />
          ) : (
            <div className="relative">
              <IconSearch className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-secondary" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search chats"
                className="pl-9"
                aria-label="Search chats"
              />
            </div>
          )}
        </div>

        {!isCollapsed && (
          <ChatSidebarQuickActions
            selectedAction={selectedAction}
            projectsData={projectsData}
            projectsExpanded={projectsExpanded}
            onNewChatClick={handleNewChat}
            onNewProjectClick={() => setShowNewProjectModal(true)}
            onProjectSelect={(project) => handleProjectSelect(project, onProjectSelect)}
            onProjectIconClick={(project) => {
              setSelectedProjectForIcon(project);
              setShowIconPicker(true);
            }}
            onToggleExpanded={() => setProjectsExpanded((prev) => !prev)}
          />
        )}

        {!isCollapsed && (
          <div className="px-2 pb-1">
            <ListItem
              icon={<IconSparkles className="size-5" />}
              label="Your Year With ChatGPT"
              onClick={() => setSelectedAction("year-summary")}
              selected={selectedAction === "year-summary"}
            />
          </div>
        )}

        <div className="px-2 pb-1">
          <ListItem
            icon={<IconRadio className="size-5" />}
            label={isCollapsed ? "" : "Pulse"}
            ariaLabel="Pulse"
            title="Pulse"
            dataRailItem={isCollapsed}
            onClick={() => setSelectedAction("pulse")}
            selected={selectedAction === "pulse"}
            className={railItemClassName}
          />
        </div>

        <div className="px-2 pb-1">
          <ListItem
            icon={<IconImage className="size-5" />}
            label={isCollapsed ? "" : "Images"}
            ariaLabel="Images"
            title="Images"
            dataRailItem={isCollapsed}
            onClick={() => setSelectedAction("images")}
            selected={selectedAction === "images"}
            right={
              !isCollapsed && (
                <span className="text-[10px] font-semibold leading-[14px] tracking-[0.5px] px-1.5 py-0.5 bg-secondary rounded text-foreground uppercase">
                  NEW
                </span>
              )
            }
            className={railItemClassName}
          />
        </div>

        {!isCollapsed && (
          <div className="px-2 pb-1">
            <ListItem
              icon={<IconArchive className="size-5" />}
              label="Archived chats"
              onClick={() => setSelectedAction("archived")}
              selected={selectedAction === "archived"}
            />
          </div>
        )}

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {!isCollapsed && (
            <div className="px-2 pb-1">
              <ListItem
                icon={<IconGrid3x3 className="size-5" />}
                label="Apps"
                onClick={() => setSelectedAction("apps")}
                selected={selectedAction === "apps"}
              />
            </div>
          )}

          {!isCollapsed && (
            <div className="px-2 pb-1">
              <ListItem
                icon={<IconCode className="size-5" />}
                label="Codex"
                onClick={() => setSelectedAction("codex")}
                selected={selectedAction === "codex"}
              />
            </div>
          )}

          {!isCollapsed && (
            <Collapsible open={gptsExpanded} onOpenChange={setGptsExpanded}>
              <div className="px-2 pb-1 pt-2">
                <CollapsibleTrigger asChild>
                  <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-secondary">
                    <span className="text-[13px] font-normal leading-[18px] tracking-[-0.3px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary flex-1 text-left">
                      GPTs
                    </span>
                    <IconChevronRightMd
                      className={`size-4 text-foundation-icon-light-primary dark:text-foundation-icon-dark-primary transition-transform ${gptsExpanded ? "rotate-90" : ""}`}
                    />
                  </button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent forceMount>
                <div className="px-2 pb-2 space-y-1">
                  {["GPT-5 Pro", "GPT-5 Thinking", "GPT-4o"].map((label) => (
                    <button
                      key={label}
                      onClick={() => setSelectedAction(label)}
                      className={`w-full text-left px-3 py-2 text-body-small rounded-lg transition-colors ${
                        selectedAction === label
                          ? "bg-muted text-foreground"
                          : "text-text-secondary hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {!isCollapsed && (
            <Collapsible open={groupChatsExpanded} onOpenChange={setGroupChatsExpanded}>
              <div className="px-2 pb-1 pt-2">
                <CollapsibleTrigger asChild>
                  <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-secondary">
                    <span className="text-[13px] font-normal leading-[18px] tracking-[-0.3px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary flex-1 text-left">
                      Group chats
                    </span>
                    <IconChevronRightMd
                      className={`size-4 text-foundation-icon-light-primary dark:text-foundation-icon-dark-primary transition-transform ${groupChatsExpanded ? "rotate-90" : ""}`}
                    />
                  </button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent forceMount>
                {!isCollapsed && (
                  <div className="px-2 pb-1">
                    <ListItem
                      icon={
                        <div className="size-6 rounded-full bg-accent-red flex items-center justify-center flex-shrink-0">
                          <IconChat className="size-4 text-foreground" />
                        </div>
                      }
                      label="Summarize chat exchange"
                    />
                    <ListItem
                      icon={
                        <div className="size-6 rounded-full bg-accent-blue flex items-center justify-center flex-shrink-0">
                          <IconChat className="size-4 text-foreground" />
                        </div>
                      }
                      label="Draft follow-up"
                    />
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          )}

          {!isCollapsed && (
            <Collapsible open={yourChatsExpanded} onOpenChange={setYourChatsExpanded}>
              <div className="px-2 pb-1 pt-2">
                <CollapsibleTrigger asChild>
                  <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-secondary">
                    <span className="text-[13px] font-normal leading-[18px] tracking-[-0.3px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary flex-1 text-left">
                      Your chats
                    </span>
                    <IconChevronRightMd
                      className={`size-4 text-foundation-icon-light-primary dark:text-foundation-icon-dark-primary transition-transform ${yourChatsExpanded ? "rotate-90" : ""}`}
                    />
                  </button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent forceMount>
                {!isCollapsed && (
                  <ChatSidebarHistory
                    chatHistory={resolvedChatHistory}
                    searchQuery={searchQuery}
                    selectedId={selectedChatId}
                    onSelect={setSelectedChatId}
                  />
                )}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>

        <div className="p-2 border-t border-border relative">
          <button
            ref={userMenuButtonRef}
            onClick={() => setShowUserMenu(!showUserMenu)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors ${railItemClassName}`}
            title={isCollapsed ? "Jamie Scott Craik" : ""}
            data-testid="chat-sidebar-user-menu"
          >
            <div className="size-7 rounded-full bg-foundation-accent-purple-light dark:bg-foundation-accent-purple text-foundation-text-dark-primary flex items-center justify-center flex-shrink-0">
              <IconCloseBold className="size-4" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col items-start flex-1 min-w-0">
                <span className="text-body-small truncate font-normal text-foreground">Jamie Scott Craik</span>
                <span className="text-caption font-normal text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                  Personal account
                </span>
              </div>
            )}
          </button>
          {showUserMenu && !isCollapsed && (
            <div className="absolute bottom-full left-3 right-3 mb-2 bg-popover border border-border rounded-xl shadow-2xl py-1 z-50">
              <div className="px-3 py-2.5 border-b border-border">
                <div className="flex items-center gap-2 text-body-small">
                  <div className="size-2 rounded-full bg-[var(--accent-green)]" />
                  <span className="text-foundation-text-light-primary dark:text-foundation-text-dark-primary font-normal">
                    PRO/Veteran/Lik
                  </span>
                </div>
              </div>
              <button className="w-full text-left px-3 py-2.5 hover:bg-secondary transition-colors flex items-center gap-2">
                <svg
                  className="size-4 text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="text-body-small text-foreground font-normal">Personal account</span>
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  setShowSettingsModal(true);
                }}
                data-testid="chat-sidebar-settings"
                className="w-full text-left px-3 py-2.5 hover:bg-secondary transition-colors flex items-center gap-2"
              >
                <IconSettings className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
                <span className="text-body-small text-foreground font-normal">Settings</span>
              </button>
              <div className="my-1 border-t border-border" />
              <button className="w-full text-left px-3 py-2.5 hover:bg-secondary transition-colors">
                <span className="text-body-small text-foreground font-normal">Log Out</span>
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
            onSave={(iconId, color) => handleIconChange(iconId, color, getProjectIcon)}
            currentColorId={selectedProjectForIcon.color}
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
            currentColorId={newProjectColor}
            projectName={projectName || "New Project"}
          />
        )}

        {showMoreOptions && !showIconPicker && (
          <ProjectSettingsModal
            memoryOption={memoryOption}
            onSelectMemoryOption={setMemoryOption}
            onClose={() => setShowMoreOptions(false)}
            onDone={() => {
              setShowMoreOptions(false);
            }}
          />
        )}

        {showSettingsModal && (
          <SettingsModal
            isOpen={showSettingsModal}
            onClose={() => {
              setShowSettingsModal(false);
              requestAnimationFrame(() => userMenuButtonRef.current?.focus());
            }}
          />
        )}

        <NewProjectModal
          isOpen={showNewProjectModal}
          projectName={projectName}
          newProjectIcon={newProjectIcon}
          newProjectColor={newProjectColor}
          selectedCategories={selectedCategories}
          categories={resolvedCategories}
          categoryIcons={resolvedCategoryIcons}
          categoryColors={resolvedCategoryColors}
          categoryIconColors={resolvedCategoryIconColors}
          onProjectNameChange={setProjectName}
          onToggleCategory={toggleCategory}
          onCreateProject={handleCreateProject}
          onIconPickerOpen={() => {
            setSelectedProjectForIcon(null);
            setShowIconPicker(true);
          }}
          onMoreOptions={() => {
            setShowMoreOptions(true);
            setShowNewProjectModal(false);
          }}
          onClose={() => setShowNewProjectModal(false)}
        />
      </div>
      <ChatSidebarFooterSlot />
    </>
  );
}
/* eslint-enable complexity */

/**
 * Re-export shared sidebar types for consumers.
 */
export type { ChatSidebarUser, SidebarItem, SidebarItemConfig };
