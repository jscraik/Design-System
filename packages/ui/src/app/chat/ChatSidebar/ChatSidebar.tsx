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

import * as React from "react";
import { useRef } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../components/ui/base/Collapsible";
import { Input } from "../../../components/ui/base/Input";
import { ListItem } from "../../../components/ui/base/ListItem";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/overlays";
import { cn } from "../../../components/ui/utils";
import type { StatefulComponentProps, ComponentState } from "@design-studio/tokens";
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
interface ChatSidebarProps extends StatefulComponentProps {
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
 * Supports stateful props for loading, error, and disabled states.
 * When loading, shows loading state overlay.
 * When error, shows error message overlay.
 * When disabled, disables all interactive elements.
 *
 * @param props - Chat sidebar props and stateful options.
 * @returns A sidebar panel element.
 *
 * @example
 * ```tsx
 * <ChatSidebar isOpen={true} onToggle={handleToggle} />
 * <ChatSidebar isOpen={true} loading />
 * <ChatSidebar isOpen={true} error="Failed to load sidebar" />
 * ```
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
  loading = false,
  error,
  disabled = false,
  required,
  onStateChange,
}: ChatSidebarProps) {
  // Determine effective state (priority: loading > error > disabled > default)
  const effectiveState: ComponentState = loading
    ? "loading"
    : error
      ? "error"
      : disabled
        ? "disabled"
        : "default";

  // Notify parent of state changes
  React.useEffect(() => {
    onStateChange?.(effectiveState);
  }, [effectiveState, onStateChange]);

  // Effective disabled state (disabled if explicitly disabled OR loading)
  const isDisabled = disabled || loading;
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
        data-state={effectiveState}
        data-error={error ? "true" : undefined}
        data-required={required ? "true" : undefined}
        aria-disabled={isDisabled || undefined}
        aria-invalid={error ? "true" : required ? "false" : undefined}
        aria-required={required || undefined}
        aria-busy={loading || undefined}
        className={cn(
          "bg-background dark:bg-background text-foreground dark:text-foreground flex flex-col h-full border-r border-muted dark:border-muted transition-all duration-300 shrink-0 w-[260px] relative",
          isCollapsed && "w-[64px]",
          isDisabled && "opacity-50 pointer-events-none",
          error && "ring-2 ring-status-error/50",
          loading && "animate-pulse",
        )}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 dark:bg-background/80 z-10">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        )}
        {error && !loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 dark:bg-background/80 z-10">
            <div className="text-status-error">{error}</div>
          </div>
        )}
        <div
          className={`flex items-center px-6 py-6 ${isCollapsed ? "justify-center" : "justify-between"}`}
        >
          {!isCollapsed && (
            <div className="size-8 rounded-full bg-accent-purple dark:bg-accent-purple text-foreground flex items-center justify-center flex-shrink-0">
              <IconCloseBold className="size-5" />
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="size-8 flex items-center justify-center rounded-lg hover:bg-secondary dark:hover:bg-secondary transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            data-testid="chat-sidebar-toggle"
          >
            <IconSidebar className="size-6 text-text-secondary dark:text-text-secondary" />
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
              <IconSearch className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-secondary dark:text-text-secondary" />
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
                <span className="text-[10px] font-semibold leading-[14px] tracking-[0.5px] px-1.5 py-0.5 bg-secondary dark:bg-secondary rounded text-foreground dark:text-foreground uppercase">
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
                  <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-secondary dark:hover:bg-secondary">
                    <span className="text-[13px] font-normal leading-[18px] tracking-[-0.3px] text-foreground dark:text-foreground flex-1 text-left">
                      GPTs
                    </span>
                    <IconChevronRightMd
                      className={`size-4 text-foreground dark:text-foreground transition-transform ${gptsExpanded ? "rotate-90" : ""}`}
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
                          ? "bg-secondary dark:bg-secondary text-foreground dark:text-foreground"
                          : "text-text-secondary dark:text-text-secondary hover:bg-secondary/80 dark:hover:bg-secondary/80 hover:text-foreground dark:hover:text-foreground"
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
                  <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-secondary dark:hover:bg-secondary">
                    <span className="text-[13px] font-normal leading-[18px] tracking-[-0.3px] text-foreground dark:text-foreground flex-1 text-left">
                      Group chats
                    </span>
                    <IconChevronRightMd
                      className={`size-4 text-foreground dark:text-foreground transition-transform ${groupChatsExpanded ? "rotate-90" : ""}`}
                    />
                  </button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent forceMount>
                {!isCollapsed && (
                  <div className="px-2 pb-1">
                    <ListItem
                      icon={
                        <div className="size-6 rounded-full bg-status-error dark:bg-status-error flex items-center justify-center flex-shrink-0">
                          <IconChat className="size-5 text-text-body-on-color" />
                        </div>
                      }
                      label="Summarize chat exchange"
                    />
                    <ListItem
                      icon={
                        <div className="size-6 rounded-full bg-accent-blue dark:bg-accent-blue flex items-center justify-center flex-shrink-0">
                          <IconChat className="size-5 text-text-body-on-color" />
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
                  <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-secondary dark:hover:bg-secondary">
                    <span className="text-[13px] font-normal leading-[18px] tracking-[-0.3px] text-foreground dark:text-foreground flex-1 text-left">
                      Your chats
                    </span>
                    <IconChevronRightMd
                      className={`size-4 text-foreground dark:text-foreground transition-transform ${yourChatsExpanded ? "rotate-90" : ""}`}
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

        <div className="p-2 border-t border-muted dark:border-muted">
          <DropdownMenu open={showUserMenu} onOpenChange={setShowUserMenu}>
            <DropdownMenuTrigger asChild>
              <button
                ref={userMenuButtonRef}
                disabled={isCollapsed}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  "hover:bg-secondary dark:hover:bg-secondary",
                  "disabled:opacity-60 disabled:hover:bg-transparent",
                  railItemClassName,
                )}
                title={isCollapsed ? "Jamie Scott Craik" : ""}
                aria-label="User menu"
                data-testid="chat-sidebar-user-menu"
              >
                <div className="size-7 rounded-full bg-accent-purple dark:bg-accent-purple text-foreground flex items-center justify-center flex-shrink-0">
                  <IconCloseBold className="size-5" />
                </div>
                {!isCollapsed && (
                  <div className="flex flex-col items-start flex-1 min-w-0">
                    <span className="text-body-small truncate font-normal text-foreground dark:text-foreground">
                      Jamie Scott Craik
                    </span>
                    <span className="text-caption font-normal text-foreground dark:text-foreground">
                      Personal account
                    </span>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            {!isCollapsed && (
              <DropdownMenuContent
                align="start"
                side="top"
                sideOffset={8}
                className="min-w-[220px] bg-background dark:bg-secondary border border-muted dark:border-muted rounded-xl shadow-2xl py-1"
              >
                <DropdownMenuLabel className="px-3 py-2.5 border-b border-muted dark:border-muted">
                  <div className="flex items-center gap-2 text-body-small">
                    <div className="size-2 rounded-full bg-[var(--accent-green)]" />
                    <span className="text-foreground dark:text-foreground font-normal">
                      PRO/Veteran/Lik
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuItem className="px-3 py-2.5 flex items-center gap-2">
                  <svg
                    className="size-4 text-text-secondary dark:text-text-secondary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span className="text-body-small text-foreground dark:text-foreground font-normal">
                    Personal account
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-testid="chat-sidebar-settings"
                  onSelect={() => {
                    setShowSettingsModal(true);
                  }}
                  className="px-3 py-2.5 flex items-center gap-2"
                >
                  <IconSettings className="size-4 text-text-secondary dark:text-text-secondary" />
                  <span className="text-body-small text-foreground dark:text-foreground font-normal">
                    Settings
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 bg-muted dark:bg-muted" />
                <DropdownMenuItem className="px-3 py-2.5">
                  <span className="text-body-small text-foreground dark:text-foreground font-normal">
                    Log Out
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
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
