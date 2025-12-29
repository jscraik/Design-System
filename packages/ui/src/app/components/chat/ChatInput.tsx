import type { ReactNode } from "react";
import { useState } from "react";

import { Popover } from "../../../vendor/appsSdkUi";
import {
  IconCamera,
  IconClock,
  IconCompose,
  IconFolder,
  IconGlobe,
  IconGoFilled,
  IconHeadphones,
  IconImage,
  IconMic,
  IconOperator,
  IconPlusLg,
  IconTelescope,
  IconVideo,
} from "../icons/ChatGPTIcons";
import { IconButton } from "../ui/base/icon-button";
import { ModelBadge } from "../ui/navigation/model-badge";
import { ContextTag } from "../ui/overlays/context-tag";

interface ModelConfig {
  name: string;
  shortName: string;
  description: string;
}

export type ChatInputAttachmentAction =
  | "upload-file"
  | "upload-photo"
  | "take-screenshot"
  | "take-photo";

export type ChatInputToolAction =
  | "terminal-add"
  | "code-open"
  | "code-insiders-open"
  | "notes-open"
  | "script-editor-open";

export interface ChatInputProps {
  selectedModel: ModelConfig;

  /** Slot: Custom content left of composer input (before attachment button) */
  composerLeft?: ReactNode;

  /** Slot: Custom content right of composer input (after send button) */
  composerRight?: ReactNode;

  /** Active context tag label */
  activeTag?: string;
  /** Clear active context tag */
  onClearActiveTag?: () => void;

  /** Called when a message is submitted */
  onSendMessage?: (message: string) => void | Promise<void>;
  /** Called when an attachment action is selected */
  onAttachmentAction?: (action: ChatInputAttachmentAction) => void;
  /** Called when a tool action is selected */
  onToolAction?: (action: ChatInputToolAction) => void;
  /** Called when web search is toggled */
  onSearchToggle?: (enabled: boolean) => void;
  /** Called when deep research is toggled */
  onResearchToggle?: (enabled: boolean) => void;
}

export function ChatInput({
  selectedModel,
  composerLeft,
  composerRight,
  activeTag,
  onClearActiveTag,
  onSendMessage,
  onAttachmentAction,
  onToolAction,
  onSearchToggle,
  onResearchToggle,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const [isResearchEnabled, setIsResearchEnabled] = useState(false);
  const [uploadMenuOpen, setUploadMenuOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;
    setMessage("");
    void onSendMessage?.(trimmed);
  };

  const toggleSearch = () => {
    setIsSearchEnabled((prev) => {
      const next = !prev;
      onSearchToggle?.(next);
      return next;
    });
  };

  const toggleResearch = () => {
    setIsResearchEnabled((prev) => {
      const next = !prev;
      onResearchToggle?.(next);
      return next;
    });
  };

  return (
    <div className="border-t border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 p-4">
      {/* Active Context Tag */}
      {activeTag && (
        <div className="mb-3 flex items-center gap-2">
          <ContextTag
            icon={<IconCompose />}
            label={activeTag}
            onClose={onClearActiveTag}
            variant="green"
          />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="rounded-[20px] border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 shadow-lg overflow-hidden">
          {/* Input Area */}
          <div className="px-4 py-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask anything"
              rows={1}
              aria-label="Message input"
              className="w-full resize-none bg-transparent
                text-foundation-text-light-primary dark:text-foundation-text-dark-primary
                placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary
                focus:outline-none text-[16px] font-normal leading-[24px] tracking-[-0.32px]"
              style={{
                minHeight: "24px",
                maxHeight: "200px",
                height: "auto",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-foundation-bg-light-3/70 dark:border-foundation-bg-dark-3">
            {/* Left Actions */}
            <div className="flex items-center gap-1 relative">
              {composerLeft ? <div className="mr-1 flex items-center">{composerLeft}</div> : null}
              <Popover open={uploadMenuOpen} onOpenChange={setUploadMenuOpen}>
                <Popover.Trigger>
                  <button
                    type="button"
                    className="p-2 rounded-lg transition-colors group hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-2 data-[state=open]:bg-foundation-accent-blue/20"
                    aria-label="Add attachment"
                    title="Add attachment"
                  >
                    <IconPlusLg className="size-4 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary group-hover:text-foundation-text-light-primary dark:group-hover:text-foundation-text-dark-primary data-[state=open]:text-foundation-accent-blue" />
                  </button>
                </Popover.Trigger>

                <Popover.Content
                  side="top"
                  align="start"
                  sideOffset={10}
                  className="z-[60] w-[200px] rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 shadow-2xl outline-none"
                >
                  <button
                    type="button"
                    onClick={() => {
                      onAttachmentAction?.("upload-file");
                      setUploadMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-foundation-text-light-primary dark:text-foundation-text-dark-primary hover:bg-foundation-accent-green transition-colors text-left text-[14px] font-normal leading-[20px] tracking-[-0.3px] group first:rounded-t-lg"
                  >
                    <IconFolder className="size-4 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary group-hover:text-foundation-text-light-primary dark:group-hover:text-foundation-text-dark-primary" />
                    <span className="group-hover:text-foundation-text-light-primary dark:group-hover:text-foundation-text-dark-primary">Upload file</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onAttachmentAction?.("upload-photo");
                      setUploadMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-foundation-text-light-primary dark:text-foundation-text-dark-primary hover:bg-foundation-accent-green transition-colors text-left text-[14px] font-normal leading-[20px] tracking-[-0.3px] group"
                  >
                    <IconImage className="size-4 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary group-hover:text-foundation-text-light-primary dark:group-hover:text-foundation-text-dark-primary" />
                    <span className="group-hover:text-foundation-text-light-primary dark:group-hover:text-foundation-text-dark-primary">Upload photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onAttachmentAction?.("take-screenshot");
                      setUploadMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-foundation-text-light-primary dark:text-foundation-text-dark-primary hover:bg-foundation-accent-green transition-colors text-left text-[14px] font-normal leading-[20px] tracking-[-0.3px] group"
                  >
                    <IconVideo className="size-4 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary group-hover:text-foundation-text-light-primary dark:group-hover:text-foundation-text-dark-primary" />
                    <span className="group-hover:text-foundation-text-light-primary dark:group-hover:text-foundation-text-dark-primary">Take screenshot</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onAttachmentAction?.("take-photo");
                      setUploadMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-foundation-text-light-primary dark:text-foundation-text-dark-primary hover:bg-foundation-accent-green transition-colors text-left text-[14px] font-normal leading-[20px] tracking-[-0.3px] group last:rounded-b-lg"
                  >
                    <IconCamera className="size-4 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary group-hover:text-foundation-text-light-primary dark:group-hover:text-foundation-text-dark-primary" />
                    <span className="group-hover:text-foundation-text-light-primary dark:group-hover:text-foundation-text-dark-primary">Take photo</span>
                  </button>
                </Popover.Content>
              </Popover>

              <button
                type="button"
                onClick={toggleSearch}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors ${
                  isSearchEnabled
                    ? "bg-foundation-accent-blue/20 text-foundation-accent-blue"
                    : "hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-2 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary hover:text-foundation-text-light-primary dark:hover:text-foundation-text-dark-primary"
                }`}
                title="Browse web"
                aria-label={isSearchEnabled ? "Disable web search" : "Enable web search"}
              >
                <IconGlobe
                  className={`size-4 ${isSearchEnabled ? "text-foundation-accent-blue" : ""}`}
                />
                {isSearchEnabled && (
                  <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px]">
                    Search
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={toggleResearch}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors ${
                  isResearchEnabled
                    ? "bg-foundation-accent-blue/20 text-foundation-accent-blue"
                    : "hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-2 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary hover:text-foundation-text-light-primary dark:hover:text-foundation-text-dark-primary"
                }`}
                title="Research"
                aria-label={isResearchEnabled ? "Disable deep research" : "Enable deep research"}
              >
                <IconTelescope
                  className={`size-4 ${isResearchEnabled ? "text-foundation-accent-blue" : ""}`}
                />
                {isResearchEnabled && (
                  <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px]">
                    Research
                  </span>
                )}
              </button>

              <Popover>
                <Popover.Trigger>
                  <button
                    type="button"
                    className="p-2 rounded-lg transition-colors group hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-2 data-[state=open]:bg-foundation-accent-blue/20 data-[state=open]:border data-[state=open]:border-foundation-accent-blue/40"
                    aria-label="Tools"
                    title="Tools"
                  >
                    <IconOperator className="size-4 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary group-hover:text-foundation-text-light-primary dark:group-hover:text-foundation-text-dark-primary data-[state=open]:text-foundation-accent-blue" />
                  </button>
                </Popover.Trigger>

                <Popover.Content
                  side="top"
                  align="start"
                  sideOffset={10}
                  className="z-[60] w-[280px] rounded-xl border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 shadow-2xl outline-none"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 pt-3 pb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary font-normal leading-[18px] tracking-[-0.3px]">
                        Work With
                      </span>
                      <svg
                        className="size-3.5 text-foundation-text-light-tertiary/70 dark:text-foundation-text-dark-tertiary"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Search */}
                  <div className="px-3 pb-2">
                    <div className="relative">
                      <svg
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-foundation-text-light-tertiary/70 dark:text-foundation-text-dark-tertiary"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        />
                      </svg>
                      <input
                        type="text"
                        placeholder="Search"
                        aria-label="Search apps"
                        className="w-full rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 pl-8 pr-3 py-1.5 text-[13px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary focus:outline-none focus:border-foundation-bg-light-3/70 dark:focus:border-foundation-bg-dark-3 font-normal leading-[18px] tracking-[-0.3px]"
                      />
                    </div>
                  </div>

                  {/* Apps List - Scrollable */}
                  <div className="px-2 pb-2 max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-foundation-bg-light-3 dark:scrollbar-thumb-foundation-bg-dark-3 scrollbar-track-transparent hover:scrollbar-thumb-foundation-bg-light-3/70 dark:hover:scrollbar-thumb-foundation-bg-dark-3">
                    {/* Terminal - Running */}
                    <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-2 transition-colors group">
                      <div className="flex items-center justify-center size-5 text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                        <svg
                          className="size-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 6.75L12 3m0 0l3.75 3.75M12 3v18"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary font-normal leading-[18px] tracking-[-0.3px]">
                          Terminal
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToolAction?.("terminal-add");
                        }}
                        className="opacity-0 group-hover:opacity-100 px-2.5 py-1 text-[11px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary hover:text-foundation-text-light-primary dark:hover:text-foundation-text-dark-primary bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-2 hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-3 rounded-md transition-all font-normal leading-[16px] tracking-[-0.3px]"
                      >
                        Add
                      </button>
                    </div>

                    {/* Code - Not running */}
                    <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-2 transition-colors group">
                      <div className="flex items-center justify-center size-5">
                        <svg
                          className="size-4 text-foundation-accent-blue"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary font-normal leading-[18px] tracking-[-0.3px]">
                            Code
                          </span>
                          <span className="text-[11px] text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary font-normal leading-[16px] tracking-[-0.3px] group-hover:opacity-0 transition-opacity">
                            • Not running
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToolAction?.("code-open");
                        }}
                        className="opacity-0 group-hover:opacity-100 px-2.5 py-1 text-[11px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary hover:text-foundation-text-light-primary dark:hover:text-foundation-text-dark-primary bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-2 hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-3 rounded-md transition-all font-normal leading-[16px] tracking-[-0.3px]"
                      >
                        Open app
                      </button>
                    </div>

                    {/* Code - Insiders */}
                    <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-2 transition-colors group">
                      <div className="flex items-center justify-center size-5">
                        <svg
                          className="size-4 text-foundation-accent-blue"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary font-normal leading-[18px] tracking-[-0.3px]">
                            Code - Insiders
                          </span>
                          <span className="text-[11px] text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary font-normal leading-[16px] tracking-[-0.3px] group-hover:opacity-0 transition-opacity">
                            • Not running
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToolAction?.("code-insiders-open");
                        }}
                        className="opacity-0 group-hover:opacity-100 px-2.5 py-1 text-[11px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary hover:text-foundation-text-light-primary dark:hover:text-foundation-text-dark-primary bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-2 hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-3 rounded-md transition-all font-normal leading-[16px] tracking-[-0.3px]"
                      >
                        Open app
                      </button>
                    </div>

                    {/* Notes */}
                    <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-2 transition-colors group">
                      <div className="flex items-center justify-center size-5">
                        <svg
                          className="size-4 text-foundation-accent-orange"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary font-normal leading-[18px] tracking-[-0.3px]">
                            Notes
                          </span>
                          <span className="text-[11px] text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary font-normal leading-[16px] tracking-[-0.3px] group-hover:opacity-0 transition-opacity">
                            • Not running
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToolAction?.("notes-open");
                        }}
                        className="opacity-0 group-hover:opacity-100 px-2.5 py-1 text-[11px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary hover:text-foundation-text-light-primary dark:hover:text-foundation-text-dark-primary bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-2 hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-3 rounded-md transition-all font-normal leading-[16px] tracking-[-0.3px]"
                      >
                        Open app
                      </button>
                    </div>

                    {/* Script Editor */}
                    <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-2 transition-colors group">
                      <div className="flex items-center justify-center size-5">
                        <svg
                          className="size-4 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary font-normal leading-[18px] tracking-[-0.3px]">
                            Script Editor
                          </span>
                          <span className="text-[11px] text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary font-normal leading-[16px] tracking-[-0.3px] group-hover:opacity-0 transition-opacity">
                            • Not running
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToolAction?.("script-editor-open");
                        }}
                        className="opacity-0 group-hover:opacity-100 px-2.5 py-1 text-[11px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary hover:text-foundation-text-light-primary dark:hover:text-foundation-text-dark-primary bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-2 hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-3 rounded-md transition-all font-normal leading-[16px] tracking-[-0.3px]"
                      >
                        Open app
                      </button>
                    </div>
                  </div>
                </Popover.Content>
              </Popover>

              {/* Model Badge */}
              <ModelBadge name={selectedModel.shortName} variant="blue" className="ml-2" />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              {/* Composer Right Slot - highest ROI for customization */}
              {composerRight}

              <IconButton icon={<IconClock />} variant="ghost" size="md" title="History" />

              {/* Voice input */}
              <IconButton
                icon={<IconMic />}
                variant="ghost"
                size="md"
                onClick={() => setIsRecording(!isRecording)}
                title="Voice input"
                active={isRecording}
                activeColor="var(--foundation-accent-red)"
              />

              {/* Advanced features with purple gradient */}
              <button
                type="button"
                className="p-2 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 rounded-full transition-all hover:opacity-90"
                aria-label="Advanced features"
                title="Advanced features"
              >
                <IconHeadphones className="size-4 text-white" />
              </button>

              {/* Send button */}
              <button
                type="submit"
                disabled={!message.trim()}
                className="ml-1 rounded-full bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 p-2 text-foundation-text-light-primary dark:text-foundation-text-dark-primary transition-all hover:bg-foundation-bg-light-1/90 dark:hover:bg-foundation-bg-dark-2 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send message"
                title="Send message (Enter) • New line (Shift+Enter)"
              >
                <IconGoFilled className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
