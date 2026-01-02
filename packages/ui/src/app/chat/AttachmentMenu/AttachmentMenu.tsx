import * as Popover from "@radix-ui/react-popover";
import * as React from "react";

import {
  IconDotsVertical,
  IconImage,
  IconPaperclip,
  IconPlusComposer,
  IconPublic,
  IconSearch,
  CanvaIcon,
  DropboxIcon,
  FigmaIcon,
  GitHubIcon,
  LinearIcon,
  NotionIcon,
  SharePointIcon,
  SlackIcon,
  TeamsIcon,
} from "../../../icons";
import { cn } from "../../../components/ui/utils";

/**
 * Primary attachment menu actions.
 */
export type AttachmentAction =
  | "add-photos-files"
  | "deep-research"
  | "shopping-research"
  | "agent-mode"
  | "create-image";

/**
 * Secondary actions available under the "More" submenu.
 */
export type MoreAction =
  | "study-learn"
  | "web-search"
  | "browser-memory"
  | "canva"
  | "figma"
  | "quizzes"
  | "slack"
  | "year-with-chatgpt"
  | "dropbox"
  | "github"
  | "linear"
  | "notion"
  | "sharepoint"
  | "teams"
  | "explore-apps";

/**
 * Props for the attachment menu popover.
 */
export interface AttachmentMenuProps {
  onAttachmentAction?: (action: AttachmentAction) => void;
  onMoreAction?: (action: MoreAction) => void;
  isWebSearchActive?: boolean;
  onWebSearchToggle?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// Custom icons for specific actions
const TelescopeIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5H21l-7.5 7.5v-7.5z"
    />
  </svg>
);

const ShoppingIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
    />
  </svg>
);

const AgentIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232 1.232 3.233 0 4.465l-1.7 1.7a2.121 2.121 0 01-3-.001l-1.15-1.15a2.122 2.122 0 01-.001-3L5 14.5"
    />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

// Menu item component for consistent styling
const MenuItem = React.forwardRef<
  HTMLButtonElement,
  {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
  }
>(({ children, onClick, className, disabled, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors rounded-lg",
      "text-foundation-text-light-primary dark:text-foundation-text-dark-primary",
      "hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3",
      "text-[15px] font-normal leading-[22px] tracking-[-0.3px]",
      "group disabled:opacity-50 disabled:cursor-not-allowed",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue-light dark:focus-visible:ring-foundation-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-foundation-bg-light-2 dark:focus-visible:ring-offset-foundation-bg-dark-2",
      className,
    )}
    {...props}
  >
    {children}
  </button>
));

MenuItem.displayName = "MenuItem";

/**
 * Renders the attachment menu popover for the chat composer.
 *
 * Accessibility contract:
 * - Trigger is a button with a visible icon and title.
 * - Menu items are focusable buttons with visible labels.
 *
 * @param props - Attachment menu props.
 * @returns An attachment menu popover.
 */
export function AttachmentMenu({
  onAttachmentAction,
  onMoreAction,
  isWebSearchActive = false,
  onWebSearchToggle,
  open,
  onOpenChange,
}: AttachmentMenuProps) {
  const handleAction = (action: AttachmentAction) => {
    onAttachmentAction?.(action);
    onOpenChange?.(false);
  };

  const handleMoreAction = (action: MoreAction) => {
    onMoreAction?.(action);
    onOpenChange?.(false);
  };

  const handleWebSearch = () => {
    onWebSearchToggle?.();
    onOpenChange?.(false);
  };

  return (
    <Popover.Root modal={false} open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            "p-2 rounded-lg transition-colors group",
            "hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue-light dark:focus-visible:ring-foundation-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-foundation-bg-light-1 dark:focus-visible:ring-offset-foundation-bg-dark-1",
            "data-[state=open]:bg-foundation-accent-blue-light/20 dark:data-[state=open]:bg-foundation-accent-blue/20",
          )}
          title="Add attachment"
        >
          <IconPlusComposer
            className={cn(
              "size-4 transition-colors",
              "text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary",
              "group-hover:text-foundation-icon-light-primary dark:group-hover:text-foundation-icon-dark-primary",
              "group-data-[state=open]:text-foundation-accent-blue-light dark:group-data-[state=open]:text-foundation-accent-blue",
            )}
          />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          forceMount
          side="top"
          align="start"
          sideOffset={10}
          className={cn(
            "z-[60] w-[240px] rounded-xl border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3",
            "bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 shadow-2xl outline-none p-2",
            "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          )}
        >
          {/* Primary Actions */}
          <MenuItem onClick={() => handleAction("add-photos-files")}>
            <IconPaperclip className="size-5 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary group-hover:text-foundation-icon-light-primary dark:group-hover:text-foundation-icon-dark-primary transition-colors" />
            <span>Add photos & files</span>
          </MenuItem>

          <MenuItem onClick={() => handleAction("deep-research")}>
            <TelescopeIcon className="size-5 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary group-hover:text-foundation-icon-light-primary dark:group-hover:text-foundation-icon-dark-primary transition-colors" />
            <span>Deep research</span>
          </MenuItem>

          <MenuItem onClick={() => handleAction("shopping-research")}>
            <ShoppingIcon className="size-5 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary group-hover:text-foundation-icon-light-primary dark:group-hover:text-foundation-icon-dark-primary transition-colors" />
            <span>Shopping research</span>
          </MenuItem>

          <MenuItem onClick={() => handleAction("agent-mode")}>
            <AgentIcon className="size-5 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary group-hover:text-foundation-icon-light-primary dark:group-hover:text-foundation-icon-dark-primary transition-colors" />
            <span>Agent mode</span>
          </MenuItem>

          <MenuItem onClick={() => handleAction("create-image")}>
            <IconImage className="size-5 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary group-hover:text-foundation-icon-light-primary dark:group-hover:text-foundation-icon-dark-primary transition-colors" />
            <span>Create image</span>
          </MenuItem>

          {/* More submenu with nested popover */}
          <Popover.Root modal={false}>
            <Popover.Trigger asChild>
              <MenuItem className="justify-between data-[state=open]:bg-foundation-bg-dark-3">
                <div className="flex items-center gap-3">
                  <IconDotsVertical className="size-5 text-foundation-icon-dark-secondary group-hover:text-foundation-icon-dark-primary" />
                  <span>More</span>
                </div>
                <ChevronRightIcon className="size-4 text-foundation-icon-dark-tertiary group-hover:text-foundation-icon-dark-secondary" />
              </MenuItem>
            </Popover.Trigger>

            <Popover.Portal>
              <Popover.Content
                forceMount
                side="right"
                align="start"
                sideOffset={8}
                className={cn(
                  "z-[70] w-[240px] rounded-xl border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3",
                  "bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 shadow-2xl outline-none p-2",
                  "max-h-[400px] overflow-y-auto",
                  "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
                  "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                )}
              >
                {/* Add sources header */}
                <div className="px-3 py-2 text-[13px] text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary font-normal leading-[18px] tracking-[-0.3px]">
                  Add sources
                </div>

                <MenuItem onClick={() => handleMoreAction("study-learn")}>
                  <svg
                    className="size-5 text-foundation-icon-dark-secondary group-hover:text-foundation-icon-dark-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                    />
                  </svg>
                  <span>Study and learn</span>
                </MenuItem>

                <MenuItem
                  onClick={handleWebSearch}
                  className={cn(
                    "justify-between",
                    isWebSearchActive && "text-foundation-accent-blue-light dark:text-foundation-accent-blue",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <IconPublic
                      className={cn(
                        "size-5 transition-colors",
                        isWebSearchActive
                          ? "text-foundation-accent-blue-light dark:text-foundation-accent-blue"
                          : "text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary group-hover:text-foundation-icon-light-primary dark:group-hover:text-foundation-icon-dark-primary",
                      )}
                    />
                    <span>Web search</span>
                  </div>
                  {isWebSearchActive && (
                    <CheckIcon className="size-5 text-foundation-accent-blue-light dark:text-foundation-accent-blue" />
                  )}
                </MenuItem>

                {/* Additional integrations would go here */}
                <MenuItem onClick={() => handleMoreAction("browser-memory")}>
                  <svg
                    className="size-5 text-foundation-icon-dark-secondary group-hover:text-foundation-icon-dark-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    />
                  </svg>
                  <span>Browser memory</span>
                </MenuItem>

                <MenuItem onClick={() => handleMoreAction("canva")}>
                  <CanvaIcon className="size-5 transition-colors" />
                  <span>Canva</span>
                </MenuItem>

                <MenuItem onClick={() => handleMoreAction("quizzes")}>
                  <svg
                    className="size-5 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary group-hover:text-foundation-icon-light-primary dark:group-hover:text-foundation-icon-dark-primary transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                    />
                  </svg>
                  <span>Quizzes</span>
                </MenuItem>

                <MenuItem onClick={() => handleMoreAction("slack")}>
                  <SlackIcon className="size-5 transition-colors" />
                  <span>Slack</span>
                </MenuItem>

                <MenuItem onClick={() => handleMoreAction("figma")}>
                  <FigmaIcon className="size-5 transition-colors" />
                  <span>Figma</span>
                </MenuItem>

                <MenuItem onClick={() => handleMoreAction("year-with-chatgpt")}>
                  <svg
                    className="size-5 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary group-hover:text-foundation-icon-light-primary dark:group-hover:text-foundation-icon-dark-primary transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                    />
                  </svg>
                  <span>Your Year with ChatGPT</span>
                </MenuItem>

                <MenuItem onClick={() => handleMoreAction("dropbox")}>
                  <DropboxIcon className="size-5 transition-colors" />
                  <span>Dropbox</span>
                </MenuItem>

                <MenuItem onClick={() => handleMoreAction("github")}>
                  <GitHubIcon className="size-5 transition-colors" />
                  <span>GitHub</span>
                </MenuItem>

                <MenuItem onClick={() => handleMoreAction("linear")}>
                  <LinearIcon className="size-5 transition-colors" />
                  <span>Linear</span>
                </MenuItem>

                <MenuItem onClick={() => handleMoreAction("notion")}>
                  <NotionIcon className="size-5 transition-colors" />
                  <span>Notion</span>
                </MenuItem>

                <MenuItem onClick={() => handleMoreAction("sharepoint")}>
                  <SharePointIcon className="size-5 transition-colors" />
                  <span>SharePoint</span>
                </MenuItem>

                <MenuItem onClick={() => handleMoreAction("teams")}>
                  <TeamsIcon className="size-5 transition-colors" />
                  <span>Teams</span>
                </MenuItem>

                {/* Divider */}
                <div className="my-2 border-t border-foundation-bg-light-3 dark:border-foundation-bg-dark-3" />

                <MenuItem onClick={() => handleMoreAction("explore-apps")}>
                  <IconSearch className="size-5 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary group-hover:text-foundation-icon-light-primary dark:group-hover:text-foundation-icon-dark-primary transition-colors" />
                  <span>Explore apps</span>
                </MenuItem>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
