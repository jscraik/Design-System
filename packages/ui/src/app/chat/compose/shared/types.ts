import type { ModelConfig } from "../../../../components/ui/navigation/ModelSelector";
import type { ModeConfig } from "../../../../components/ui/navigation/ModeSelector";

/** Compose mode configuration with optional context config. */
export interface ComposeModeConfig extends ModeConfig {
  contextConfig?: {
    mode?: string;
    selectedFiles?: string;
    fileTree?: string;
    codeMap?: string;
    gitDiff?: string;
  };
}

/** Props for the ComposeView component. */
export interface ComposeViewProps {
  models?: ModelConfig[];
  modes?: ComposeModeConfig[];
}

/** Pro edit mode type. */
export type ProEditMode = "agent" | "model";

/** Prompt enhancement type. */
export type PromptEnhancement = "rewrite" | "augment" | "preserve";
