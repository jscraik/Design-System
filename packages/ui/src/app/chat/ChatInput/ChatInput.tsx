import type { FormEvent, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  IconArrowUpSm,
  IconClock,
  IconGlobe,
  IconHeadphones,
  IconMic,
  IconRefresh,
  IconTelescope,
} from "../../../icons";
import { cn } from "../../../components/ui/utils";
import { AttachmentMenu, type AttachmentAction, type MoreAction } from "../AttachmentMenu";

// ============================================================================
// TYPES
// ============================================================================

interface ModelConfig {
  name: string;
  shortName: string;
  description: string;
}

/**
 * Tool actions emitted by the chat input toolbar.
 */
export type ChatInputToolAction =
  | "terminal-add"
  | "code-open"
  | "code-insiders-open"
  | "notes-open"
  | "script-editor-open";

/**
 * Attachment action union for the chat input.
 */
export type ChatInputAttachmentAction = AttachmentAction;

/**
 * Props for the main chat input component.
 */
export interface ChatInputProps {
  /** Currently selected model */
  selectedModel: ModelConfig;
  /** Custom content for left side of composer */
  composerLeft?: ReactNode;
  /** Custom content for right side of composer */
  composerRight?: ReactNode;
  /** Callback when message is sent */
  onSendMessage?: (message: string) => void | Promise<void>;
  /** Callback for attachment actions */
  onAttachmentAction?: (action: AttachmentAction) => void;
  /** Callback for more menu actions */
  onMoreAction?: (action: MoreAction) => void;
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
 * Renders the main chat composer with attachments and mode toggles.
 *
 * Accessibility contract:
 * - Textarea uses `aria-label` derived from the placeholder.
 * - Buttons are native `<button>` elements with visible labels/icons.
 *
 * @param props - Chat input props.
 * @returns A chat composer container.
 */
export function ChatInput({
  selectedModel,
  composerLeft,
  composerRight,
  onSendMessage,
  onAttachmentAction,
  onMoreAction,
  onToolAction: _onToolAction,
  onSearchToggle,
  onResearchToggle,
  onAutoClear,
  placeholder,
  disabled = false,
  className,
}: ChatInputProps) {
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
    <div
      className={cn(
        "border-t border-foundation-border-light dark:border-foundation-border-dark",
        "bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1",
        "px-4 py-4",
        className,
      )}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[361px] sm:max-w-[992px] mx-auto"
      >
        <div
          className={cn(
            "rounded-[24px] overflow-hidden transition-all duration-200",
            "bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-2",
            "border border-foundation-border-heavy dark:border-foundation-border-dark-default",
            "shadow-sm dark:shadow-black/10",
            "focus-within:border-foundation-accent-blue-light/40 dark:focus-within:border-foundation-accent-blue/40",
            "focus-within:shadow-lg focus-within:shadow-foundation-accent-blue-light/5 dark:focus-within:shadow-foundation-accent-blue/5",
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
                    "bg-foundation-accent-blue-light/10 dark:bg-foundation-accent-blue/10",
                    "text-foundation-accent-blue-light dark:text-foundation-accent-blue",
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
                "text-foundation-text-light-primary dark:text-foundation-text-dark-primary",
                "placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary",
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
              "flex items-center justify-between px-4 py-2.5",
              "border-t border-foundation-border-light dark:border-foundation-border-dark",
            )}
          >
            {/* Left Actions */}
            <div className="flex items-center gap-1">
              {composerLeft}

              {/* Attachment Menu */}
              <AttachmentMenu
                onAttachmentAction={onAttachmentAction}
                onMoreAction={onMoreAction}
                isWebSearchActive={isSearchEnabled}
                onWebSearchToggle={handleSearchToggle}
                open={attachmentMenuOpen}
                onOpenChange={setAttachmentMenuOpen}
              />

              {/* Research Toggle */}
              <button
                type="button"
                onClick={handleResearchToggle}
                title="Research"
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue-light dark:focus-visible:ring-foundation-accent-blue focus-visible:ring-offset-1",
                  isResearchEnabled
                    ? "bg-foundation-accent-blue-light/15 dark:bg-foundation-accent-blue/15 text-foundation-accent-blue-light dark:text-foundation-accent-blue"
                    : cn(
                        "hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-3",
                        "text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary",
                        "hover:text-foundation-icon-light-primary dark:hover:text-foundation-icon-dark-primary",
                      ),
                )}
              >
                <IconTelescope className="size-4" />
                {isResearchEnabled && (
                  <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px]">
                    Research
                  </span>
                )}
              </button>
              {/* Model Badge */}
              <div
                className={cn(
                  "ml-2 px-2.5 py-1 rounded-lg",
                  "bg-foundation-accent-blue-light/10 dark:bg-foundation-accent-blue/10",
                  "text-foundation-accent-blue-light dark:text-foundation-accent-blue",
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
                    "bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3",
                    "hover:bg-foundation-bg-light-3/80 dark:hover:bg-foundation-bg-dark-3/80",
                    "text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary",
                    "hover:text-foundation-text-light-primary dark:hover:text-foundation-text-dark-primary",
                    "transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue-light dark:focus-visible:ring-foundation-accent-blue focus-visible:ring-offset-1",
                  )}
                >
                  <IconRefresh className="size-4 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary" />
                  <span>Auto-clear</span>
                </button>
              )}

              {composerRight}

              {/* History */}
              <button
                type="button"
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  "text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary",
                  "hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3",
                  "hover:text-foundation-icon-light-primary dark:hover:text-foundation-icon-dark-primary",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue-light dark:focus-visible:ring-foundation-accent-blue focus-visible:ring-offset-1",
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
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue-light dark:focus-visible:ring-foundation-accent-blue focus-visible:ring-offset-1",
                  isRecording
                    ? "bg-foundation-accent-red-light/15 dark:bg-foundation-accent-red/15 text-foundation-accent-red-light dark:text-foundation-accent-red"
                    : cn(
                        "text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary",
                        "hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3",
                        "hover:text-foundation-icon-light-primary dark:hover:text-foundation-icon-dark-primary",
                      ),
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
                  "bg-gradient-to-br from-foundation-accent-purple-light via-foundation-accent-purple to-foundation-accent-pink",
                  "dark:from-foundation-accent-purple dark:via-foundation-accent-purple dark:to-foundation-accent-pink",
                  "hover:opacity-90 hover:scale-105 active:scale-95",
                  "shadow-lg shadow-foundation-accent-purple-light/25 dark:shadow-foundation-accent-purple/25",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue-light dark:focus-visible:ring-foundation-accent-blue focus-visible:ring-offset-1",
                )}
              >
                <IconHeadphones className="size-4 text-white" />
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!message.trim() || disabled}
                title="Send message (Enter)"
                className={cn(
                  "flex items-center gap-1.5 p-2 rounded-full ml-1 transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue-light dark:focus-visible:ring-foundation-accent-blue focus-visible:ring-offset-1",
                  !message.trim() || disabled
                    ? "bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 opacity-40 cursor-not-allowed"
                    : "bg-foundation-accent-green-light dark:bg-foundation-accent-green hover:opacity-90 hover:scale-105 active:scale-95",
                  "text-white shadow-sm",
                )}
              >
                <IconArrowUpSm className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

ChatInput.displayName = "ChatInput";
