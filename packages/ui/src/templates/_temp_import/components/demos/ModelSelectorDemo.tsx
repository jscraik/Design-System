import { useState } from "react";

import { ModelSelector, type ModelConfig } from "../ModelSelector";

export function ModelSelectorDemo() {
  // Example 1: Basic model selector
  const [model1, setModel1] = useState("Auto");

  // Example 2: With custom label
  const [model2, setModel2] = useState("Pro");

  // Example 3: Custom models
  const [model3, setModel3] = useState("gpt-4-turbo");
  const customAvailableModels: ModelConfig[] = [
    { name: "gpt-4-turbo", shortName: "GPT-4 Turbo", description: "Most capable GPT-4 model" },
    { name: "gpt-4", shortName: "GPT-4", description: "Standard GPT-4 model" },
    { name: "gpt-3.5-turbo", shortName: "GPT-3.5 Turbo", description: "Fast and efficient" },
  ];
  const customLegacyModels: ModelConfig[] = [
    { name: "gpt-3.5", shortName: "GPT-3.5", description: "Legacy model", isLegacy: true },
    { name: "gpt-3", shortName: "GPT-3", description: "Legacy model", isLegacy: true },
  ];

  // Example 4: Different selected model
  const [model4, setModel4] = useState("GPT-4o");

  // Example 5: Code generation models
  const [model5, setModel5] = useState("codex-advanced");
  const codeModels: ModelConfig[] = [
    { name: "codex-advanced", shortName: "Codex Advanced", description: "Best for complex code" },
    { name: "codex-standard", shortName: "Codex Standard", description: "General coding tasks" },
    { name: "codex-fast", shortName: "Codex Fast", description: "Quick code suggestions" },
  ];
  const codeLegacyModels: ModelConfig[] = [
    { name: "codex-v1", shortName: "Codex v1", description: "Original Codex", isLegacy: true },
  ];

  // Example 6: Image generation models
  const [model6, setModel6] = useState("dall-e-3");
  const imageModels: ModelConfig[] = [
    { name: "dall-e-3", shortName: "DALL·E 3", description: "Latest image generation" },
    { name: "dall-e-2", shortName: "DALL·E 2", description: "Fast image generation" },
  ];

  // Example 7: No legacy models
  const [model7, setModel7] = useState("Claude Opus");
  const anthropicModels: ModelConfig[] = [
    { name: "Claude Opus", shortName: "Claude Opus", description: "Most capable Claude model" },
    { name: "Claude Sonnet", shortName: "Claude Sonnet", description: "Balanced performance" },
    { name: "Claude Haiku", shortName: "Claude Haiku", description: "Fast responses" },
  ];

  // Example 8: Language-specific models
  const [model8, setModel8] = useState("multilingual-advanced");
  const languageModels: ModelConfig[] = [
    {
      name: "multilingual-advanced",
      shortName: "Multilingual Advanced",
      description: "100+ languages",
    },
    {
      name: "multilingual-standard",
      shortName: "Multilingual Standard",
      description: "50+ languages",
    },
    { name: "english-only", shortName: "English Only", description: "Optimized for English" },
  ];

  return (
    <div className="h-full bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 overflow-auto">
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        <div className="space-y-2">
          <h2 className="text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
            Basic Model Selector
          </h2>
          <p className="text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            Default model selector with available and legacy models
          </p>
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 p-6">
            <ModelSelector value={model1} onChange={(model) => setModel1(typeof model === "string" ? model : model.name)} />
            <div className="mt-4 text-center text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
              <p className="text-[13px]">
                Selected: <span className="font-medium">{model1}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
            Custom Label
          </h2>
          <p className="text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            Model selector with custom label text
          </p>
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 p-6">
            <ModelSelector
              label="AI Model"
              value={model2}
              onChange={(model) => setModel2(typeof model === "string" ? model : model.name)}
            />
            <div className="mt-4 text-center text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
              <p className="text-[13px]">
                Selected: <span className="font-medium">{model2}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
            Custom Models
          </h2>
          <p className="text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            Model selector with custom available and legacy models
          </p>
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 p-6">
            <ModelSelector
              label="GPT"
              value={model3}
              onChange={(model) => setModel3(typeof model === "string" ? model : model.name)}
              models={customAvailableModels}
              legacyModels={customLegacyModels}
            />
            <div className="mt-4 text-center text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
              <p className="text-[13px]">
                Selected: <span className="font-medium">{model3}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
            Legacy Model Selected
          </h2>
          <p className="text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            Model selector with a legacy model pre-selected
          </p>
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 p-6">
            <ModelSelector value={model4} onChange={(model) => setModel4(typeof model === "string" ? model : model.name)} />
            <div className="mt-4 text-center text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
              <p className="text-[13px]">
                Click to see legacy models in the nested menu
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
            Code Generation Models
          </h2>
          <p className="text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            Specialized model selector for code generation
          </p>
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 p-6">
            <ModelSelector
              label="Codex"
              value={model5}
              onChange={(model) => setModel5(typeof model === "string" ? model : model.name)}
              models={codeModels}
              legacyModels={codeLegacyModels}
            />
            <div className="mt-4 text-center text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
              <p className="text-[13px]">
                Selected: <span className="font-medium">{model5}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
            Image Generation Models
          </h2>
          <p className="text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            Model selector for image generation without legacy models
          </p>
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 p-6">
            <ModelSelector
              label="DALL·E"
              value={model6}
              onChange={(model) => setModel6(typeof model === "string" ? model : model.name)}
              models={imageModels}
              legacyModels={[]}
            />
            <div className="mt-4 text-center text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
              <p className="text-[13px]">
                No legacy models menu (empty array)
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
            Third-Party Models
          </h2>
          <p className="text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            Using the selector with non-OpenAI models (Anthropic Claude)
          </p>
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 p-6">
            <ModelSelector
              label="Claude"
              value={model7}
              onChange={(model) => setModel7(typeof model === "string" ? model : model.name)}
              models={anthropicModels}
              legacyModels={[]}
            />
            <div className="mt-4 text-center text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
              <p className="text-[13px]">
                Selected: <span className="font-medium">{model7}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
            Language-Specific Models
          </h2>
          <p className="text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            Model selector for multilingual support
          </p>
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 p-6">
            <ModelSelector
              label="Language Model"
              value={model8}
              onChange={(model) => setModel8(typeof model === "string" ? model : model.name)}
              models={languageModels}
              legacyModels={[]}
            />
            <div className="mt-4 text-center text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
              <p className="text-[13px]">
                Selected: <span className="font-medium">{model8}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
            Multiple Selectors
          </h2>
          <p className="text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            Using multiple model selectors in a form
          </p>
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 p-6 space-y-6">
            <div>
              <h3 className="text-[15px] font-medium mb-3 text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                Primary Model
              </h3>
              <ModelSelector
                label="Chat Model"
                value={model1}
                onChange={(model) => setModel1(typeof model === "string" ? model : model.name)}
              />
            </div>
            <div>
              <h3 className="text-[15px] font-medium mb-3 text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                Code Model
              </h3>
              <ModelSelector
                label="Code Model"
                value={model5}
                onChange={(model) => setModel5(typeof model === "string" ? model : model.name)}
                models={codeModels}
                legacyModels={codeLegacyModels}
              />
            </div>
            <div>
              <h3 className="text-[15px] font-medium mb-3 text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                Image Model
              </h3>
              <ModelSelector
                label="Image Model"
                value={model6}
                onChange={(model) => setModel6(typeof model === "string" ? model : model.name)}
                models={imageModels}
                legacyModels={[]}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
            In Context Example
          </h2>
          <p className="text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            Model selector in a realistic interface context
          </p>
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg overflow-hidden bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2">
            <div className="border-b border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 p-4 flex items-center justify-between bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1">
              <div className="flex items-center gap-4">
                <h3 className="text-[15px] font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                  New Conversation
                </h3>
                <ModelSelector
                  value={model1}
                  onChange={(model) => setModel1(typeof model === "string" ? model : model.name)}
                />
              </div>
              <button className="px-4 py-2 bg-button-primary-bg-light dark:bg-button-primary-bg-dark text-button-primary-text-light dark:text-button-primary-text-dark rounded-lg hover:opacity-90 transition-opacity text-[13px]">
                Start Chat
              </button>
            </div>
            <div className="p-8 min-h-[300px] flex items-center justify-center">
              <div className="text-center text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
                <p className="text-[14px]">
                  Select a model and start chatting
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
