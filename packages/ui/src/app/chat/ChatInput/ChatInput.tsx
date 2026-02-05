import type { FormEvent, ReactNode } from "react";
import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../../../components/ui/utils";
import {
  getSizeClass,
  IconArrowUpSm,
  IconClock,
  IconGlobe,
  IconHeadphones,
  IconMic,
  IconRefresh,
  IconTelescope,
} from "../../../icons";
import { Textarea as AppsSDKTextarea } from "../../../integrations/apps-sdk";
import { type AttachmentAction, AttachmentMenu, type MoreAction } from "../AttachmentMenu";

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
  selectedModel?: ModelConfig;
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
  /** Hybrid Pattern: variant for compound API */
  variant?: "default" | "compound";
}

// ============================================================================
// COMPOUND CONTEXT
// ============================================================================

interface ChatInputContextValue {
  isCompound: boolean;
  message: string;
  setMessage: (message: string) => void;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
  isSearchEnabled: boolean;
  setIsSearchEnabled: (enabled: boolean) => void;
  isResearchEnabled: boolean;
  setIsResearchEnabled: (enabled: boolean) => void;
  attachmentMenuOpen: boolean;
  setAttachmentMenuOpen: (open: boolean) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  selectedModel: ModelConfig;
  placeholder: string;
  disabled: boolean;
  iconSm: string;
  iconMd: string;
  composerLeft?: ReactNode;
  composerRight?: ReactNode;
  onAutoClear?: () => void;
  handleSubmit: (e: FormEvent) => void;
  handleSearchToggle: () => void;
  handleResearchToggle: () => void;
}

const ChatInputContext = React.createContext<ChatInputContextValue | null>(null);
ChatInputContext.displayName = "ChatInputContext";

function useChatInputContext(): ChatInputContextValue {
  const context = React.useContext(ChatInputContext);
  if (!context) {
    throw new Error(
      'ChatInput compound components must be used within <ChatInput variant="compound">',
    );
  }
  return context;
}

// ============================================================================
// COMPOUND SUB-COMPONENTS
// ============================================================================

/**
 * ChatInput.ComposerArea - The textarea input area with mode indicators.
 *
 * **Compound API (opt-in):**
 * ```tsx
 * <ChatInput variant="compound">
 *   <ChatInput.ComposerArea />
 *   <ChatInput.ActionBar>...</ChatInput.ActionBar>
 * </ChatInput>
 * ```
 */
function ComposerArea({ className, children }: { className?: string; children?: ReactNode }) {
  const {
    message,
    setMessage,
    textareaRef,
    isSearchEnabled,
    placeholder,
    disabled,
    iconSm,
    handleSubmit,
  } = useChatInputContext();

  const dynamicPlaceholder = isSearchEnabled ? "Search the web" : placeholder || "Ask anything";

  return (
    <div className={cn("px-4 py-3", className)}>
      {/* Active Mode Indicator */}
      {isSearchEnabled && (
        <div className="flex items-center gap-2 mb-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <div
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg",
              "bg-accent-blue/10 dark:bg-accent-blue/10",
              "text-accent-blue dark:text-accent-blue",
              "text-[13px] font-medium leading-[18px] tracking-[-0.3px]",
            )}
          >
            <IconGlobe className={iconSm} />
            <span>Search</span>
          </div>
        </div>
      )}
      <AppsSDKTextarea
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
          "text-foreground dark:text-foreground",
          "placeholder:text-muted-foreground dark:placeholder:text-muted-foreground",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        style={{ minHeight: "26px", maxHeight: "200px" }}
        onKeyDown={(e) => {
          if (e.nativeEvent.isComposing) {
            return;
          }
          if (e.key === "Enter" && !e.shiftKey && !e.metaKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      {children}
    </div>
  );
}

/**
 * ChatInput.ActionBar - The bottom action bar with left/right actions.
 *
 * **Compound API (opt-in):**
 * ```tsx
 * <ChatInput variant="compound">
 *   <ChatInput.ComposerArea />
 *   <ChatInput.ActionBar>
 *     <ChatInput.LeftActions>...</ChatInput.LeftActions>
 *     <ChatInput.RightActions>...</ChatInput.RightActions>
 *   </ChatInput.ActionBar>
 * </ChatInput>
 * ```
 */
function ActionBar({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-3 py-2",
        "border-t border-muted/50 dark:border-muted/50",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * ChatInput.LeftActions - Container for left-side action bar buttons.
 *
 * Renders the AttachmentMenu, search/research toggles, and model badge.
 * Custom buttons can be passed as children.
 */
function LeftActions({ className, children }: { className?: string; children?: ReactNode }) {
  const {
    composerLeft,
    selectedModel,
    iconMd,
    isSearchEnabled,
    handleSearchToggle,
    isResearchEnabled,
    handleResearchToggle,
    attachmentMenuOpen,
    setAttachmentMenuOpen,
  } = useChatInputContext();

  // Get parent callbacks - note: these need to be passed to ChatInput
  // For now, we'll render a simplified version
  const onAttachmentAction = undefined as unknown as
    | ((action: AttachmentAction) => void)
    | undefined;
  const onMoreAction = undefined as unknown as ((action: MoreAction) => void) | undefined;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {composerLeft}
      {children}

      {/* Attachment Menu */}
      <AttachmentMenu
        onAttachmentAction={onAttachmentAction}
        onMoreAction={onMoreAction}
        isWebSearchActive={isSearchEnabled}
        onWebSearchToggle={handleSearchToggle}
        open={attachmentMenuOpen}
        onOpenChange={setAttachmentMenuOpen}
      />

      <button
        type="button"
        onClick={handleSearchToggle}
        title="Web search"
        aria-label="Toggle web search"
        aria-pressed={isSearchEnabled}
        className={cn(
          "flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue dark:focus-visible:ring-accent-blue focus-visible:ring-offset-1",
          isSearchEnabled
            ? "bg-accent-blue/15 dark:bg-accent-blue/15 text-accent-blue dark:text-accent-blue"
            : cn(
                "hover:bg-muted dark:hover:bg-muted",
                "text-muted-foreground dark:text-muted-foreground",
                "hover:text-foreground dark:hover:text-foreground",
              ),
        )}
      >
        <IconGlobe className={iconMd} />
        {isSearchEnabled && (
          <span className="text-[14px] font-normal leading-[18px] tracking-[-0.3px]">Search</span>
        )}
      </button>

      <button
        type="button"
        onClick={handleResearchToggle}
        title="Research"
        aria-label="Toggle research"
        aria-pressed={isResearchEnabled}
        className={cn(
          "flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue dark:focus-visible:ring-accent-blue focus-visible:ring-offset-1",
          isResearchEnabled
            ? "bg-accent-blue/15 dark:bg-accent-blue/15 text-accent-blue dark:text-accent-blue"
            : cn(
                "hover:bg-muted dark:hover:bg-muted",
                "text-muted-foreground dark:text-muted-foreground",
                "hover:text-foreground dark:hover:text-foreground",
              ),
        )}
      >
        <IconTelescope className={iconMd} />
        {isResearchEnabled && (
          <span className="text-[14px] font-normal leading-[18px] tracking-[-0.3px]">Research</span>
        )}
      </button>

      {/* Model Badge */}
      {selectedModel && (
        <div
          className={cn(
            "ml-2 px-2.5 py-1 rounded-lg",
            "bg-accent-blue/10 dark:bg-accent-blue/10",
            "text-accent-blue dark:text-accent-blue",
            "text-[12px] font-medium leading-[16px] tracking-[-0.1px]",
          )}
        >
          {selectedModel.shortName}
        </div>
      )}
    </div>
  );
}

/**
 * ChatInput.RightActions - Container for right-side action bar buttons.
 *
 * Note: This renders standard action buttons. Custom buttons can be passed as children.
 * The Send button is handled by the parent form, not here (use type="submit" button in children if needed).
 */
function RightActions({ className, children }: { className?: string; children?: ReactNode }) {
  const { composerRight, onAutoClear, iconMd, isRecording, setIsRecording } = useChatInputContext();

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {/* Auto-clear */}
      {onAutoClear && (
        <button
          type="button"
          onClick={onAutoClear}
          title="Auto-clear conversation"
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full",
            "text-[13px] font-normal leading-[18px] tracking-[-0.3px]",
            "bg-muted dark:bg-muted",
            "hover:bg-muted/80 dark:hover:bg-muted/80",
            "text-text-secondary dark:text-text-secondary",
            "hover:text-foreground dark:hover:text-foreground",
            "transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue dark:focus-visible:ring-accent-blue focus-visible:ring-offset-1",
          )}
        >
          <IconRefresh className={iconMd} />
          <span>Auto-clear</span>
        </button>
      )}

      {composerRight}
      {children}

      {/* History */}
      <button
        type="button"
        aria-label="History"
        className={cn(
          "p-2 rounded-lg transition-all duration-200",
          "text-muted-foreground dark:text-muted-foreground",
          "hover:bg-muted dark:hover:bg-muted",
          "hover:text-foreground dark:hover:text-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue dark:focus-visible:ring-accent-blue focus-visible:ring-offset-1",
        )}
        title="History"
      >
        <IconClock className={iconMd} />
      </button>

      {/* Voice Input */}
      <button
        type="button"
        onClick={() => setIsRecording(!isRecording)}
        aria-label="Toggle voice input"
        aria-pressed={isRecording}
        className={cn(
          "p-2 rounded-lg transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue dark:focus-visible:ring-accent-blue focus-visible:ring-offset-1",
          isRecording
            ? "bg-status-error-muted/15 dark:bg-status-error-muted/15 text-status-error dark:text-status-error"
            : cn(
                "text-muted-foreground dark:text-muted-foreground",
                "hover:bg-muted dark:hover:bg-muted",
                "hover:text-foreground dark:hover:text-foreground",
              ),
        )}
        title="Voice input"
      >
        <IconMic className={iconMd} />
      </button>
      {/* Advanced Features */}
      <button
        type="button"
        title="Advanced features"
        aria-label="Advanced features"
        className={cn(
          "flex items-center gap-1.5 p-2 rounded-full transition-all duration-200",
          "bg-gradient-to-br from-accent-purple via-accent-purple to-accent-purple dark:from-accent-purple dark:via-accent-purple dark:to-accent-purple",
          "hover:opacity-90 hover:scale-105 active:scale-95",
          "shadow-lg shadow-accent-purple/25 dark:shadow-accent-purple/25",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue dark:focus-visible:ring-accent-blue focus-visible:ring-offset-1",
        )}
      >
        <IconHeadphones className={cn(iconMd, "text-text-body-on-color")} />
      </button>
    </div>
  );
}

/**
 * ChatInput.SendButton - The submit button for sending messages.
 *
 * Should be placed within RightActions or as a direct child of ActionBar.
 * Automatically handles disabled state based on message content.
 *
 * @example
 * ```tsx
 * <ChatInput.RightActions>
 *   <ChatInput.SendButton />
 * </ChatInput.RightActions>
 * ```
 */
function SendButton({ className }: { className?: string }) {
  const { iconMd, message, disabled } = useChatInputContext();

  return (
    <button
      type="submit"
      disabled={!message.trim() || disabled}
      title="Send message (Enter)"
      aria-label="Send message"
      className={cn(
        "flex items-center gap-1.5 p-2 rounded-full ml-1 transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue dark:focus-visible:ring-accent-blue focus-visible:ring-offset-1",
        !message.trim() || disabled
          ? "bg-muted dark:bg-muted opacity-40 cursor-not-allowed"
          : "bg-accent-green dark:bg-accent-green hover:opacity-90 hover:scale-105 active:scale-95",
        "text-text-body-on-color shadow-sm",
        className,
      )}
    >
      <IconArrowUpSm className={iconMd} />
    </button>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Renders the main chat composer with attachments and mode toggles.
 *
 * **Hybrid Pattern:**
 * - **Props API (default)**: Simple usage with all props
 * - **Compound API (opt-in)**: Use with variant=\"compound\" for advanced composition
 *
 * **Props API (default):**
 * ```tsx
 * <ChatInput
 *   selectedModel={model}
 *   onSendMessage={handleSend}
 *   placeholder="Ask anything"
 * />
 * ```
 *
 * **Compound API (opt-in):**
 * ```tsx
 * <ChatInput variant="compound" selectedModel={model}>
 *   <ChatInput.ComposerArea />
 *   <ChatInput.ActionBar>
 *     <ChatInput.LeftActions>
 *       <AttachmentMenu />
 *     </ChatInput.LeftActions>
 *     <ChatInput.RightActions />
 *   </ChatInput.ActionBar>
 * </ChatInput>
 * ```
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
  placeholder = "Ask anything",
  disabled = false,
  className,
  variant = "default",
  children,
}: ChatInputProps & { children?: ReactNode }) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const [isResearchEnabled, setIsResearchEnabled] = useState(false);
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const isCompound = variant === "compound";

  // Default model if not provided
  const defaultModel: ModelConfig = selectedModel || {
    name: "GPT-4o",
    shortName: "4o",
    description: "Latest model",
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, []);

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

  const iconSm = getSizeClass("sm");
  const iconMd = getSizeClass("md");

  const contextValue = useMemo<ChatInputContextValue>(
    () => ({
      isCompound,
      message,
      setMessage,
      isRecording,
      setIsRecording,
      isSearchEnabled,
      setIsSearchEnabled,
      isResearchEnabled,
      setIsResearchEnabled,
      attachmentMenuOpen,
      setAttachmentMenuOpen,
      textareaRef,
      selectedModel: defaultModel,
      placeholder,
      disabled,
      iconSm,
      iconMd,
      handleSubmit,
      handleSearchToggle,
      handleResearchToggle,
    }),
    [
      isCompound,
      message,
      isRecording,
      isSearchEnabled,
      isResearchEnabled,
      attachmentMenuOpen,
      defaultModel,
      placeholder,
      disabled,
      iconSm,
      iconMd,
      handleSubmit,
      handleSearchToggle,
      handleResearchToggle,
    ],
  );

  const dynamicPlaceholder = isSearchEnabled ? "Search the web" : placeholder;

  // Compound mode: provide context and render children
  if (isCompound) {
    return (
      <ChatInputContext.Provider value={contextValue}>
        <div
          className={cn(
            "border-t border-muted dark:border-muted",
            "bg-background dark:bg-background",
            "px-4 py-4",
            className,
          )}
        >
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto" data-testid="chat-input">
            <div
              className={cn(
                "rounded-[24px] overflow-hidden transition-all duration-200",
                "bg-secondary dark:bg-secondary",
                "border border-muted dark:border-muted",
                "shadow-sm hover:shadow-md dark:shadow-muted/",
                "focus-within:border-accent-blue/50 dark:focus-within:border-accent-blue/50",
                "focus-within:shadow-lg focus-within:shadow-accent-blue/5 dark:focus-within:shadow-accent-blue/5",
              )}
            >
              {children}
            </div>
          </form>
        </div>
      </ChatInputContext.Provider>
    );
  }

  // Props-based mode: render full component (existing behavior)
  return (
    <div
      className={cn(
        "border-t border-muted dark:border-muted",
        "bg-background dark:bg-background",
        "px-4 py-4",
        className,
      )}
    >
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto" data-testid="chat-input">
        <div
          className={cn(
            "rounded-[24px] overflow-hidden transition-all duration-200",
            "bg-secondary dark:bg-secondary",
            "border border-muted dark:border-muted",
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
                    "text-accent-blue dark:text-accent-blue",
                    "text-[13px] font-medium leading-[18px] tracking-[-0.3px]",
                  )}
                >
                  <IconGlobe className={iconSm} />
                  <span>Search</span>
                </div>
              </div>
            )}
            <AppsSDKTextarea
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
                "text-foreground dark:text-foreground",
                "placeholder:text-muted-foreground dark:placeholder:text-muted-foreground",
                disabled && "opacity-50 cursor-not-allowed",
              )}
              style={{ minHeight: "26px", maxHeight: "200px" }}
              onKeyDown={(e) => {
                if (e.nativeEvent.isComposing) {
                  return;
                }
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
              "border-t border-muted/50 dark:border-muted/50",
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

              <button
                type="button"
                onClick={handleSearchToggle}
                title="Web search"
                aria-label="Toggle web search"
                aria-pressed={isSearchEnabled}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue dark:focus-visible:ring-accent-blue focus-visible:ring-offset-1",
                  isSearchEnabled
                    ? "bg-accent-blue/15 dark:bg-accent-blue/15 text-accent-blue dark:text-accent-blue"
                    : cn(
                        "hover:bg-muted dark:hover:bg-muted",
                        "text-muted-foreground dark:text-muted-foreground",
                        "hover:text-foreground dark:hover:text-foreground",
                      ),
                )}
              >
                <IconGlobe className={iconMd} />
                {isSearchEnabled && (
                  <span className="text-[14px] font-normal leading-[18px] tracking-[-0.3px]">
                    Search
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={handleResearchToggle}
                title="Research"
                aria-label="Toggle research"
                aria-pressed={isResearchEnabled}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue dark:focus-visible:ring-accent-blue focus-visible:ring-offset-1",
                  isResearchEnabled
                    ? "bg-accent-blue/15 dark:bg-accent-blue/15 text-accent-blue dark:text-accent-blue"
                    : cn(
                        "hover:bg-muted dark:hover:bg-muted",
                        "text-muted-foreground dark:text-muted-foreground",
                        "hover:text-foreground dark:hover:text-foreground",
                      ),
                )}
              >
                <IconTelescope className={iconMd} />
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
                  "text-accent-blue dark:text-accent-blue",
                  "text-[12px] font-medium leading-[16px] tracking-[-0.1px]",
                )}
              >
                {defaultModel.shortName}
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
                    "bg-muted dark:bg-muted",
                    "hover:bg-muted/80 dark:hover:bg-muted/80",
                    "text-text-secondary dark:text-text-secondary",
                    "hover:text-foreground dark:hover:text-foreground",
                    "transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue dark:focus-visible:ring-accent-blue focus-visible:ring-offset-1",
                  )}
                >
                  <IconRefresh className={iconMd} />
                  <span>Auto-clear</span>
                </button>
              )}

              {composerRight}

              {/* History */}
              <button
                type="button"
                aria-label="History"
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  "text-muted-foreground dark:text-muted-foreground",
                  "hover:bg-muted dark:hover:bg-muted",
                  "hover:text-foreground dark:hover:text-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue dark:focus-visible:ring-accent-blue focus-visible:ring-offset-1",
                )}
                title="History"
              >
                <IconClock className={iconMd} />
              </button>

              {/* Voice Input */}
              <button
                type="button"
                onClick={() => setIsRecording(!isRecording)}
                aria-label="Toggle voice input"
                aria-pressed={isRecording}
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue dark:focus-visible:ring-accent-blue focus-visible:ring-offset-1",
                  isRecording
                    ? "bg-status-error-muted/15 dark:bg-status-error-muted/15 text-status-error dark:text-status-error"
                    : cn(
                        "text-muted-foreground dark:text-muted-foreground",
                        "hover:bg-muted dark:hover:bg-muted",
                        "hover:text-foreground dark:hover:text-foreground",
                      ),
                )}
                title="Voice input"
              >
                <IconMic className={iconMd} />
              </button>
              {/* Advanced Features */}
              <button
                type="button"
                title="Advanced features"
                aria-label="Advanced features"
                className={cn(
                  "flex items-center gap-1.5 p-2 rounded-full transition-all duration-200",
                  "bg-gradient-to-br from-accent-purple via-accent-purple to-accent-purple dark:from-accent-purple dark:via-accent-purple dark:to-accent-purple",
                  "hover:opacity-90 hover:scale-105 active:scale-95",
                  "shadow-lg shadow-accent-purple/25 dark:shadow-accent-purple/25",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue dark:focus-visible:ring-accent-blue focus-visible:ring-offset-1",
                )}
              >
                <IconHeadphones className={cn(iconMd, "text-text-body-on-color")} />
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!message.trim() || disabled}
                title="Send message (Enter)"
                aria-label="Send message"
                className={cn(
                  "flex items-center gap-1.5 p-2 rounded-full ml-1 transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue dark:focus-visible:ring-accent-blue focus-visible:ring-offset-1",
                  !message.trim() || disabled
                    ? "bg-muted dark:bg-muted opacity-40 cursor-not-allowed"
                    : "bg-accent-green dark:bg-accent-green hover:opacity-90 hover:scale-105 active:scale-95",
                  "text-text-body-on-color shadow-sm",
                )}
              >
                <IconArrowUpSm className={iconMd} />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

ChatInput.displayName = "ChatInput";

// Assign sub-components
ChatInput.ComposerArea = ComposerArea;
ChatInput.ActionBar = ActionBar;
ChatInput.LeftActions = LeftActions;
ChatInput.RightActions = RightActions;
ChatInput.SendButton = SendButton;
