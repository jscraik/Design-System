import { useState } from "react";
import { Toggle } from "../../../../components/ui/base/toggle";
import { ModeSelector } from "../../../../components/ui/navigation/ModeSelector";
import { IconChevronDownMd } from "../../../../icons";
import { TemplateFieldGroup } from "../../../../templates/blocks/TemplateFieldGroup";
import { TemplateFormField } from "../../../../templates/blocks/TemplateFormField";
import { TemplateHeaderBar } from "../../../../templates/blocks/TemplateHeaderBar";
import { TemplatePanel } from "../../../../templates/blocks/TemplatePanel";
import type { ComposeModeConfig } from "../shared/types";

/**
 * Props for the prompt builder section.
 */
interface PromptBuilderSectionProps {
  systemMessage: string;
  onSystemMessageChange: (value: string) => void;
  taskDescription: string;
  onTaskDescriptionChange: (value: string) => void;
  promptEnhancement: "rewrite" | "augment" | "preserve";
  targetSize: number;
  onOpenDiscoverySettings: () => void;
  autoPlan: boolean;
  onAutoPlanChange: (value: boolean) => void;
  previewMode: ComposeModeConfig;
  onModeSelect: (mode: ComposeModeConfig) => void;
  modes: ComposeModeConfig[];
  taskConfig: ReturnType<typeof import("../shared/constants").getTaskSectionConfig>;
}

/**
 * Renders the prompt builder panel for compose mode.
 *
 * @param props - Prompt builder props.
 * @returns A panel with task and system inputs.
 */
export function PromptBuilderSection({
  systemMessage,
  onSystemMessageChange,
  taskDescription,
  onTaskDescriptionChange,
  promptEnhancement,
  targetSize,
  onOpenDiscoverySettings,
  autoPlan,
  onAutoPlanChange,
  previewMode,
  onModeSelect,
  modes,
  taskConfig,
}: PromptBuilderSectionProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="min-h-[200px]">
      <TemplatePanel
        header={
          <TemplateHeaderBar
            title="Prompt Builder"
            trailing={
              <button
                type="button"
                aria-label="Run discovery"
                className="flex items-center gap-2 px-3 py-1.5 bg-secondary dark:bg-secondary hover:bg-secondary/80 dark:hover:bg-secondary/80 border border-muted dark:border-muted text-foreground dark:text-foreground rounded-lg transition-colors text-caption leading-5"
              >
                <svg
                  className="size-[18px]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Run Discovery
              </button>
            }
          />
        }
      >
        <div className="p-6 space-y-6">
          <div className="space-y-5">
            {/* Model and System Message */}
            <div className="flex gap-6">
              <div className="w-[200px] flex-shrink-0">
                <TemplateFormField label="Model">
                  <div className="bg-secondary dark:bg-secondary border border-muted dark:border-muted rounded-lg px-3 py-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-body-small font-medium leading-5 text-foreground dark:text-foreground">
                          Selected Model
                        </div>
                        <div className="text-caption leading-4 text-text-secondary dark:text-text-secondary">
                          Model description
                        </div>
                      </div>
                      <IconChevronDownMd className="size-4 text-muted-foreground dark:text-muted-foreground flex-shrink-0" />
                    </div>
                  </div>
                </TemplateFormField>
              </div>

              <div className="flex-1">
                <TemplateFormField label="System Message">
                  <textarea
                    value={systemMessage}
                    onChange={(e) => onSystemMessageChange(e.target.value)}
                    placeholder="Describe desired modal behavior (tone, tool usage, response style)"
                    className="w-full h-[60px] bg-secondary dark:bg-secondary border border-muted dark:border-muted rounded-lg px-3 py-2.5 text-caption leading-5 text-foreground dark:text-foreground placeholder:text-text-secondary dark:placeholder:text-text-secondary focus:outline-none focus:border-muted/70 dark:focus:border-muted/70 resize-none"
                    aria-label="System message input"
                  />
                </TemplateFormField>
              </div>
            </div>

            {/* Task Description */}
            <div className="relative">
              <TemplateFieldGroup
                label={taskConfig.label}
                actions={
                  <>
                    <div className="relative">
                      <button
                        type="button"
                        aria-label="Show task information"
                        className="p-1.5 hover:bg-secondary dark:hover:bg-secondary rounded transition-colors"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                      >
                        <svg
                          className="size-4 text-text-secondary dark:text-text-secondary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </button>

                      {showTooltip && (
                        <div className="absolute right-0 top-8 w-[320px] bg-background dark:bg-secondary border border-muted dark:border-muted rounded-lg p-4 shadow-xl z-50">
                          <div className="text-caption leading-5 text-foreground dark:text-foreground space-y-3">
                            {promptEnhancement === "rewrite" && (
                              <>
                                <p className="font-medium">Describe your task here.</p>
                                <div>
                                  <p className="font-medium mb-1.5">The agent will:</p>
                                  <ul className="space-y-1 ml-0">
                                    <li>• Analyze your codebase</li>
                                    <li>• Select relevant files</li>
                                    <li>• Write detailed instructions above</li>
                                  </ul>
                                </div>
                                <p className="text-foreground/90 dark:text-foreground/90">
                                  This is your primary input in Rewrite mode.
                                </p>
                              </>
                            )}
                            {promptEnhancement === "augment" && (
                              <>
                                <p className="font-medium">Add extra context to help the agent.</p>
                                <div>
                                  <p className="font-medium mb-1.5">The agent will:</p>
                                  <ul className="space-y-1 ml-0">
                                    <li>• Keep your existing instructions</li>
                                    <li>• Add relevant context from discoveries</li>
                                    <li>• Select appropriate files</li>
                                  </ul>
                                </div>
                                <p className="text-foreground/90 dark:text-foreground/90">
                                  Leave empty to just enhance with file context.
                                </p>
                              </>
                            )}
                            {promptEnhancement === "preserve" && (
                              <>
                                <p className="font-medium">Provide hints for file discovery.</p>
                                <div>
                                  <p className="font-medium mb-1.5">The agent will:</p>
                                  <ul className="space-y-1 ml-0">
                                    <li>• Only select relevant files</li>
                                    <li>• Leave your instructions unchanged</li>
                                  </ul>
                                </div>
                                <p className="text-foreground/90 dark:text-foreground/90">
                                  Useful when you've already written detailed instructions.
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      aria-label="Clear task"
                      className="p-1.5 hover:bg-secondary dark:hover:bg-secondary rounded transition-colors"
                    >
                      <svg
                        className="size-4 text-text-secondary dark:text-text-secondary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </>
                }
              >
                <div className="relative">
                  <textarea
                    value={taskDescription}
                    onChange={(e) => onTaskDescriptionChange(e.target.value)}
                    placeholder={taskConfig.placeholder}
                    className="w-full h-[120px] bg-secondary dark:bg-secondary border border-muted dark:border-muted rounded-lg px-3 py-2.5 pr-24 text-caption leading-5 text-foreground dark:text-foreground placeholder:text-text-secondary dark:placeholder:text-text-secondary focus:outline-none focus:border-muted/70 dark:focus:border-muted/70 resize-none"
                    aria-label={taskConfig.label}
                  />

                  <button
                    type="button"
                    onClick={onOpenDiscoverySettings}
                    aria-label={`Run discovery: ${taskConfig.buttonText}`}
                    className="absolute top-2.5 right-2.5 px-3 py-1.5 bg-secondary dark:bg-secondary hover:bg-secondary/80 dark:hover:bg-secondary/80 text-foreground dark:text-foreground rounded-lg transition-all text-caption leading-5 whitespace-nowrap flex items-center gap-1.5"
                  >
                    <span className="rounded-sm bg-accent-green/20 dark:bg-accent-green/20 px-1 text-foreground dark:text-foreground text-caption">
                      {targetSize}k
                    </span>
                    <span>{taskConfig.buttonText}</span>
                  </button>
                </div>
              </TemplateFieldGroup>
            </div>

            {/* Auto Create and Mode Selector */}
            <div className="flex items-center justify-between pt-5 border-t border-muted dark:border-muted">
              <div className="flex items-center gap-2">
                <div className="text-caption leading-5 text-foreground dark:text-foreground">
                  Auto Create
                </div>
                <div className="text-caption text-text-secondary dark:text-text-secondary">
                  Generate a prompt automatically after discovery
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-caption text-text-secondary dark:text-text-secondary">
                    Plan mode
                  </span>
                  <ModeSelector
                    value={previewMode}
                    onChange={onModeSelect}
                    modes={modes}
                    showPreview={true}
                  />
                </div>

                <Toggle checked={autoPlan} onChange={onAutoPlanChange} ariaLabel="Auto create" />
                <span className="text-caption leading-5 text-text-secondary dark:text-text-secondary min-w-[32px]">
                  {autoPlan ? "On" : "Off"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </TemplatePanel>
    </div>
  );
}
