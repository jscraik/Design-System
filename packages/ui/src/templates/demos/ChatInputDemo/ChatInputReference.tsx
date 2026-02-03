import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/overlays/Popover";
import type { FormEvent, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "../../../components/ui/utils";

// ============================================================================
// ICONS - Optimized for ChatGPT aesthetic
// ============================================================================

function IconPlus({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function IconGlobe({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
      />
    </svg>
  );
}

function IconPaperclip({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
      />
    </svg>
  );
}

function IconMic({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
      />
    </svg>
  );
}

function IconArrowUp({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
    </svg>
  );
}

function IconClock({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function IconHeadphones({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
      />
    </svg>
  );
}

function IconTelescope({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IconImage({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
      />
    </svg>
  );
}

function IconRefresh({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
      />
    </svg>
  );
}

// ============================================================================
// TYPES
// ============================================================================

interface ModelConfig {
  name: string;
  shortName: string;
  description: string;
}

export type ChatInputAttachmentAction =
  | "add-photos-files"
  | "deep-research"
  | "shopping-research"
  | "agent-mode"
  | "create-image";

export type ChatInputMoreAction =
  | "study-learn"
  | "web-search"
  | "browser-memory"
  | "canvas"
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

export type ChatInputToolAction =
  | "terminal-add"
  | "code-open"
  | "code-insiders-open"
  | "notes-open"
  | "script-editor-open";

export interface ChatInputReferenceProps {
  /** Currently selected model */
  selectedModel: ModelConfig;
  /** Custom content for left side of composer */
  composerLeft?: ReactNode;
  /** Custom content for right side of composer */
  composerRight?: ReactNode;
  /** Callback when message is sent */
  onSendMessage?: (message: string) => void | Promise<void>;
  /** Callback for attachment actions */
  onAttachmentAction?: (action: ChatInputAttachmentAction) => void;
  /** Callback for more menu actions */
  onMoreAction?: (action: ChatInputMoreAction) => void;
  /** Callback for tool actions */
  onToolAction?: (action: ChatInputToolAction) => void;
  /** Callback when search is toggled */
  onSearchToggle?: (enabled: boolean) => void;
  /** Callback when research is toggled */
  onResearchToggle?: (enabled: boolean) => void;
  /** Callback for auto-clear action */
  onAutoClear?: () => void;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * ChatInput - Complete chat input with attachments, search/research toggles, tools menu, and voice input
 * Optimized for ChatGPT's polished aesthetic with full design token compliance
 */
export function ChatInputReference({
  selectedModel,
  composerLeft,
  composerRight,
  onSendMessage,
  onAttachmentAction,
  onMoreAction,
  onToolAction,
  onSearchToggle,
  onResearchToggle,
  onAutoClear,
  placeholder,
  disabled = false,
  className,
}: ChatInputReferenceProps) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const [isResearchEnabled, setIsResearchEnabled] = useState(false);
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (message.trim() && !disabled) {
        void onSendMessage?.(message);
        setMessage("");
        // Reset textarea height
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      }
    },
    [message, disabled, onSendMessage],
  );

  const handleSearchToggle = useCallback(() => {
    const newValue = !isSearchEnabled;
    setIsSearchEnabled(newValue);
    onSearchToggle?.(newValue);
  }, [isSearchEnabled, onSearchToggle]);

  const handleResearchToggle = useCallback(() => {
    const newValue = !isResearchEnabled;
    setIsResearchEnabled(newValue);
    onResearchToggle?.(newValue);
  }, [isResearchEnabled, onResearchToggle]);

  const dynamicPlaceholder = isSearchEnabled ? "Search the web" : placeholder || "Ask anything";

  return (
    <div className={cn("border-t border-border", "bg-background", "px-4 py-4", className)}>
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div
          className={cn(
            "rounded-[24px] overflow-hidden transition-all duration-200",
            "bg-secondary",
            "border border-border",
            "shadow-sm hover:shadow-md dark:shadow-muted/",
            "focus-within:border-accent-blue/50 dark:focus-within:border-accent-blue/50",
            "focus-within:shadow-lg focus-within:shadow-accent-blue/5 dark:focus-within:shadow-accent-blue/5",
          )}
        >
          {/* Input Area */}
          <div className="px-4 py-3">
            {/* Active Mode Indicator */}
            {isSearchEnabled && (
              <div className="flex items-center gap-2 mb-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <div
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg",
                    "bg-accent-blue/10 dark:bg-accent-blue/10",
                    "text-accent-blue-light dark:text-accent-blue",
                    "text-[13px] font-medium leading-[18px] tracking-[-0.3px]",
                  )}
                >
                  <IconGlobe className="size-3.5" />
                  <span>Search</span>
                </div>
              </div>
            )}

            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={dynamicPlaceholder}
              aria-label={dynamicPlaceholder}
              disabled={disabled}
              rows={1}
              className={cn(
                "w-full bg-transparent resize-none focus:outline-none",
                "text-[16px] font-normal leading-[26px] tracking-[-0.4px]",
                "text-foreground",
                "placeholder:text-muted-foreground dark:placeholder:text-muted-foreground",
                disabled && "opacity-50 cursor-not-allowed",
              )}
              style={{ minHeight: "26px", maxHeight: "200px" }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.metaKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          </div>

          {/* Action Bar */}
          <div
            className={cn(
              "flex items-center justify-between px-3 py-2",
              "border-t border-border/50 dark:border-border/50",
            )}
          >
            {/* Left Actions */}
            <div className="flex items-center gap-1">
              {composerLeft}

              {/* Attachment Menu */}
              <Popover open={attachmentMenuOpen} onOpenChange={setAttachmentMenuOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    aria-label="Add attachment"
                    className={cn(
                      "p-2 rounded-lg transition-all duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-light dark:focus-visible:ring-ring focus-visible:ring-offset-1",
                      attachmentMenuOpen
                        ? "bg-accent-blue-light/15 dark:bg-accent-blue/15 text-accent-blue-light dark:text-accent-blue"
                        : cn("text-muted-foreground", "hover:bg-muted", "hover:text-foreground"),
                    )}
                  >
                    <IconPlus className="size-5" />
                  </button>
                </PopoverTrigger>

                <PopoverContent
                  side="top"
                  align="start"
                  sideOffset={8}
                  className={cn(
                    "z-50 w-[260px] rounded-2xl overflow-hidden",
                    "border border-border",
                    "bg-background",
                    "shadow-xl dark:shadow-muted/",
                    "animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-200",
                  )}
                >
                  <div className="p-2 space-y-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        onAttachmentAction?.("add-photos-files");
                        setAttachmentMenuOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left",
                        "text-[15px] font-normal leading-[22px] tracking-[-0.3px] group",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring-light dark:focus-visible:ring-ring",
                        "text-foreground",
                        "hover:bg-secondary dark:hover:bg-muted",
                      )}
                    >
                      <IconPaperclip className="size-5 text-muted-foreground group-hover:text-foreground dark:group-hover:text-foreground transition-colors" />
                      <span>Add photos & files</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onAttachmentAction?.("deep-research");
                        setAttachmentMenuOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left",
                        "text-[15px] font-normal leading-[22px] tracking-[-0.3px] group",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring-light dark:focus-visible:ring-ring",
                        "text-foreground",
                        "hover:bg-secondary dark:hover:bg-muted",
                      )}
                    >
                      <IconTelescope className="size-5 text-muted-foreground group-hover:text-foreground dark:group-hover:text-foreground transition-colors" />
                      <span>Deep research</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onAttachmentAction?.("create-image");
                        setAttachmentMenuOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left",
                        "text-[15px] font-normal leading-[22px] tracking-[-0.3px] group",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring-light dark:focus-visible:ring-ring",
                        "text-foreground",
                        "hover:bg-secondary dark:hover:bg-muted",
                      )}
                    >
                      <IconImage className="size-5 text-muted-foreground group-hover:text-foreground dark:group-hover:text-foreground transition-colors" />
                      <span>Create image</span>
                    </button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Search Toggle */}
              <button
                type="button"
                onClick={handleSearchToggle}
                title="Browse web"
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-light dark:focus-visible:ring-ring focus-visible:ring-offset-1",
                  isSearchEnabled
                    ? "bg-accent-blue-light/15 dark:bg-accent-blue/15 text-accent-blue-light dark:text-accent-blue"
                    : cn("hover:bg-muted", "text-muted-foreground", "hover:text-foreground"),
                )}
              >
                <IconGlobe className="size-4" />
                {isSearchEnabled && (
                  <span className="text-[14px] font-normal leading-[18px] tracking-[-0.3px]">
                    Search
                  </span>
                )}
              </button>

              {/* Research Toggle */}
              <button
                type="button"
                onClick={handleResearchToggle}
                title="Research"
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-light dark:focus-visible:ring-ring focus-visible:ring-offset-1",
                  isResearchEnabled
                    ? "bg-accent-blue-light/15 dark:bg-accent-blue/15 text-accent-blue-light dark:text-accent-blue"
                    : cn("hover:bg-muted", "text-muted-foreground", "hover:text-foreground"),
                )}
              >
                <IconTelescope className="size-4" />
                {isResearchEnabled && (
                  <span className="text-[14px] font-normal leading-[18px] tracking-[-0.3px]">
                    Research
                  </span>
                )}
              </button>

              {/* Model Badge */}
              <div
                className={cn(
                  "ml-2 px-2.5 py-1 rounded-lg",
                  "bg-accent-blue/10 dark:bg-accent-blue/10",
                  "text-accent-blue-light dark:text-accent-blue",
                  "text-[12px] font-medium leading-[16px] tracking-[-0.1px]",
                )}
              >
                {selectedModel.shortName}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              {/* Auto-clear */}
              {onAutoClear && (
                <button
                  type="button"
                  onClick={onAutoClear}
                  title="Auto-clear conversation"
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full",
                    "text-[13px] font-normal leading-[18px] tracking-[-0.3px]",
                    "bg-muted",
                    "hover:bg-muted/80",
                    "text-text-secondary",
                    "hover:text-foreground",
                    "transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-light dark:focus-visible:ring-ring focus-visible:ring-offset-1",
                  )}
                >
                  <IconRefresh className="size-4" />
                  <span>Auto-clear</span>
                </button>
              )}

              {composerRight}

              {/* History */}
              <button
                type="button"
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  "text-muted-foreground",
                  "hover:bg-muted",
                  "hover:text-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-light dark:focus-visible:ring-ring focus-visible:ring-offset-1",
                )}
                title="History"
              >
                <IconClock className="size-4" />
              </button>

              {/* Voice Input */}
              <button
                type="button"
                onClick={() => setIsRecording(!isRecording)}
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-light dark:focus-visible:ring-ring focus-visible:ring-offset-1",
                  isRecording
                    ? "bg-status-error-muted/15 dark:bg-status-error-muted/15 text-status-error dark:text-status-error"
                    : cn("text-muted-foreground", "hover:bg-muted", "hover:text-foreground"),
                )}
                title="Voice input"
              >
                <IconMic className="size-4" />
              </button>

              {/* Advanced Features */}
              <button
                type="button"
                title="Advanced features"
                className={cn(
                  "flex items-center gap-1.5 p-2 rounded-full transition-all duration-200",
                  "bg-gradient-to-br from-accent-purple via-accent-purple to-accent-purple dark:from-accent-purple dark:via-accent-purple dark:to-accent-purple",
                  "hover:opacity-90 hover:scale-105 active:scale-95",
                  "shadow-lg shadow-accent-purple/25 dark:shadow-accent-purple/25",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-light dark:focus-visible:ring-ring focus-visible:ring-offset-1",
                )}
              >
                <IconHeadphones className="size-4 text-text-body-on-color" />
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!message.trim() || disabled}
                title="Send message (Enter)"
                className={cn(
                  "flex items-center gap-1.5 p-2 rounded-full ml-1 transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-light dark:focus-visible:ring-ring focus-visible:ring-offset-1",
                  !message.trim() || disabled
                    ? "bg-muted opacity-40 cursor-not-allowed"
                    : "bg-accent-green-light dark:bg-accent-green hover:opacity-90 hover:scale-105 active:scale-95",
                  "text-text-body-on-color shadow-sm",
                )}
              >
                <IconArrowUp className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

ChatInputReference.displayName = "ChatInputReference";

// Export types
export type { ModelConfig };
