import { ComposeView } from "../../app/chat/ComposeView";
import { sampleComposeModes, sampleModels } from "../../fixtures/sample-data";
import type { ComposeModeConfig } from "../../app/chat/ComposeView";
import type { ModelConfig } from "../../components/ui/navigation/ModelSelector";

/**
 * Props for the compose template wrapper.
 */
interface ComposeTemplateProps {
  models?: ModelConfig[];
  modes?: ComposeModeConfig[];
}

/**
 * Render the compose template with optional model and mode overrides.
 * @param props - Template props.
 * @returns The compose template element.
 */
export function ComposeTemplate({ models, modes }: ComposeTemplateProps) {
  return <ComposeView models={models ?? sampleModels} modes={modes ?? sampleComposeModes} />;
}
