import type { ModelConfig } from "../../../../components/ui/navigation/ModelSelector";

import type { ComposeModeConfig, PromptEnhancement } from "./types";

/** Fallback model when no models are provided. */
export const fallbackModel: ModelConfig = {
  name: "Default",
  shortName: "Default",
  description: "Default model",
};

/** Fallback mode when no modes are provided. */
export const fallbackMode: ComposeModeConfig = {
  id: "default",
  name: "Default",
  subtitle: "Custom",
  whenToUse: [],
  about: "Default mode configuration.",
  contextConfig: {
    mode: "—",
    selectedFiles: "—",
    fileTree: "—",
    codeMap: "—",
    gitDiff: "—",
  },
};

/** Get task section configuration based on prompt enhancement mode. */
export function getTaskSectionConfig(promptEnhancement: PromptEnhancement) {
  switch (promptEnhancement) {
    case "rewrite":
      return {
        label: "Task Description",
        placeholder:
          'Describe your task here...\n\nExample: "Add a dark mode toggle to the settings page with system, light, and dark options. Store the preference and apply it app-wide."',
        tooltip:
          "Describe your task here.\n\nThe agent will:\n• Analyze your codebase\n• Select relevant files\n• Write detailed instructions above\n\nThis is your primary input in Rewrite mode.",
        buttonText: "Rewrite",
      };
    case "augment":
      return {
        label: "Additional Context (Optional)",
        placeholder:
          "Add extra details to help the agent find relevant files and enhance your prompt",
        tooltip:
          "Add extra context to help the agent.\n\nThe agent will:\n• Keep your existing instructions\n• Add relevant context from discoveries\n• Select appropriate files\n\nLeave empty to just enhance with file context.",
        buttonText: "Augment",
      };
    case "preserve":
      return {
        label: "Discovery Hints (Optional)",
        placeholder: "Describe what files to look for (your instructions won't be modified)",
        tooltip:
          "Provide hints for file discovery.\n\nThe agent will:\n• Only select relevant files\n• Leave your instructions unchanged\n\nUseful when you've already written detailed instructions.",
        buttonText: "Preserve",
      };
  }
}
