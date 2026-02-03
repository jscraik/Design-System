import { TemplatePanel } from "../../../../templates/blocks/TemplatePanel";
import { TemplateHeaderBar } from "../../../../templates/blocks/TemplateHeaderBar";
import { TemplateFooterBar } from "../../../../templates/blocks/TemplateFooterBar";
import { IconOperator } from "../../../../icons";
import { type ModelConfig } from "../../../../components/ui/navigation/ModelSelector";

/**
 * Props for the compose instructions panel.
 */
interface ComposeInstructionsPanelProps {
  instructions: string;
  onInstructionsChange: (value: string) => void;
  isWebSearchActive: boolean;
  onToggleWebSearch: () => void;
  selectedModel: ModelConfig;
}

/**
 * Renders the compose instructions panel with header and footer actions.
 *
 * @param props - Compose instructions panel props.
 * @returns A template panel containing the instructions editor.
 */
export function ComposeInstructionsPanel({
  instructions,
  onInstructionsChange,
  isWebSearchActive,
  onToggleWebSearch,
  selectedModel,
}: ComposeInstructionsPanelProps) {
  return (
    <TemplatePanel
      header={
        <TemplateHeaderBar
          title="Prompt Instructions"
          leading={
            <button
              type="button"
              className="p-2 hover:bg-secondary dark:hover:bg-secondary rounded-md transition-colors"
              aria-label="Copy to clipboard"
            >
              <svg
                className="size-4 text-muted-foreground dark:text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          }
          trailing={
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 bg-secondary dark:bg-secondary hover:bg-secondary/80 dark:hover:bg-secondary/80 border border-muted dark:border-muted text-foreground dark:text-foreground rounded-lg transition-colors text-caption leading-5"
            >
              <svg
                className="size-4 text-muted-foreground dark:text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                />
              </svg>
              Send to Chat
            </button>
          }
        />
      }
      footer={
        <TemplateFooterBar
          leading={
            <>
              <button
                type="button"
                className="p-2 hover:bg-secondary dark:hover:bg-secondary rounded-md transition-colors"
                title="Add"
                aria-label="Add"
              >
                <svg
                  className="size-4 text-muted-foreground dark:text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button
                type="button"
                onClick={onToggleWebSearch}
                className={`p-2 rounded-md transition-colors relative ${
                  isWebSearchActive
                    ? "bg-accent-blue/10 dark:bg-accent-blue/10"
                    : "hover:bg-secondary dark:hover:bg-secondary"
                }`}
                title="Web"
                aria-label="Toggle web search"
              >
                <svg
                  className={`size-4 ${
                    isWebSearchActive
                      ? "text-accent-blue dark:text-accent-blue"
                      : "text-muted-foreground dark:text-muted-foreground"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                {isWebSearchActive && (
                  <svg
                    className="size-3.5 text-accent-blue dark:text-accent-blue absolute top-0.5 right-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </button>
              <button
                type="button"
                className="p-2 hover:bg-secondary dark:hover:bg-secondary rounded-md transition-colors"
                title="Link"
                aria-label="Link"
              >
                <svg
                  className="size-4 text-muted-foreground dark:text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="p-2 hover:bg-secondary dark:hover:bg-secondary rounded-md transition-colors"
                title="Refresh"
                aria-label="Refresh"
              >
                <svg
                  className="size-4 text-muted-foreground dark:text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors group hover:bg-secondary dark:hover:bg-secondary"
                title="Tools"
                aria-label="Tools"
              >
                <IconOperator className="size-4 text-muted-foreground dark:text-muted-foreground group-hover:text-foreground dark:group-hover:text-foreground" />
                <span className="hidden text-body-small font-normal">Apps</span>
              </button>
              <div className="ml-1 px-2 py-1 bg-secondary dark:bg-secondary rounded-md">
                <span className="text-caption leading-4 text-foreground dark:text-foreground font-medium">
                  {selectedModel.shortName}
                </span>
              </div>
            </>
          }
          trailing={
            <>
              <button
                type="button"
                className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-secondary dark:hover:bg-secondary rounded-md transition-colors"
              >
                <svg
                  className="size-4 text-muted-foreground dark:text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="text-caption leading-4 text-muted-foreground dark:text-muted-foreground">
                  Auto-clear
                </span>
              </button>
              <button
                type="button"
                className="p-2 hover:bg-secondary dark:hover:bg-secondary rounded-md transition-colors"
                title="Voice"
                aria-label="Voice"
              >
                <svg
                  className="size-4 text-muted-foreground dark:text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </button>
              <button
                aria-label="Send message"
                type="button"
                className="w-7 h-7 rounded-full bg-accent-green dark:bg-accent-green ml-1 flex items-center justify-center hover:bg-accent-green/90 dark:hover:bg-accent-green/90 transition-colors"
              >
                <svg
                  className="size-4 text-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              </button>
            </>
          }
        />
      }
    >
      <textarea
        value={instructions}
        onChange={(e) => onInstructionsChange(e.target.value)}
        placeholder="Enter your prompt's task specific instructions. Use {{template variables}} for dynamic inputs"
        aria-label="Prompt instructions"
        className="w-full h-[187px] bg-secondary dark:bg-secondary px-4 py-3 text-body-small leading-6 text-foreground dark:text-foreground placeholder:text-text-secondary dark:placeholder:text-text-secondary focus:outline-none resize-none border-0"
      />
    </TemplatePanel>
  );
}
