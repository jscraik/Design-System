import { useState } from "react";

import {
  IconBook,
  IconDotsHorizontal,
  IconGlobe,
  IconGroup,
  IconLock,
  IconStar,
} from "../../../icons";
import { ChatHeader } from "../../../app/chat/ChatHeader";

export function ChatHeaderDemo() {
  // Example 1: Basic chat mode
  const [viewMode1, setViewMode1] = useState<"chat" | "compose">("chat");
  const [model1, setModel1] = useState("Auto");

  // Example 2: Compose mode
  const [viewMode2, setViewMode2] = useState<"chat" | "compose">("compose");
  const [model2, setModel2] = useState("Pro");

  // Example 3: With custom header actions
  const [viewMode3, setViewMode3] = useState<"chat" | "compose">("chat");
  const [model3, setModel3] = useState("Thinking");

  // Example 4: Different model selected
  const [viewMode4, setViewMode4] = useState<"chat" | "compose">("chat");
  const [model4, setModel4] = useState("GPT-4o");

  // Example 5: With share button
  const [viewMode5, setViewMode5] = useState<"chat" | "compose">("chat");
  const [model5, setModel5] = useState("Instant");

  return (
    <div className="h-full bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 overflow-auto">
      <div className="max-w-6xl mx-auto p-8 space-y-8">
        <div className="space-y-2">
          <h2 className="text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
            Basic Chat Header
          </h2>
          <p className="text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            Default chat header with model selector and action buttons
          </p>
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg overflow-hidden bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2">
            <ChatHeader
              onSidebarToggle={() => {}}
              selectedModel={model1}
              onModelChange={(model) => setModel1(typeof model === "string" ? model : model.name)}
              viewMode={viewMode1}
              onViewModeChange={setViewMode1}
            />
            <div className="p-6 text-center text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
              <p className="text-[13px]">
                Current mode: <span className="font-medium">{viewMode1}</span>
              </p>
              <p className="text-[13px]">
                Selected model: <span className="font-medium">{model1}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
            Compose Mode
          </h2>
          <p className="text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            Header in compose mode - model selector is hidden
          </p>
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg overflow-hidden bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2">
            <ChatHeader
              onSidebarToggle={() => {}}
              selectedModel={model2}
              onModelChange={(model) => setModel2(typeof model === "string" ? model : model.name)}
              viewMode={viewMode2}
              onViewModeChange={setViewMode2}
            />
            <div className="p-6 text-center text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
              <p className="text-[13px]">
                In compose mode, the model selector is hidden
              </p>
              <p className="text-[13px]">
                Click "Chat" button to switch back to chat mode
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
            With Custom Header Actions
          </h2>
          <p className="text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            Add custom buttons using the headerRight slot
          </p>
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg overflow-hidden bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2">
            <ChatHeader
              onSidebarToggle={() => {}}
              selectedModel={model3}
              onModelChange={(model) => setModel3(typeof model === "string" ? model : model.name)}
              viewMode={viewMode3}
              onViewModeChange={setViewMode3}
              headerRight={
                <>
                  <button className="p-1.5 hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3 rounded-md transition-colors">
                    <IconStar className="size-4 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary" />
                  </button>
                  <button className="p-1.5 hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3 rounded-md transition-colors">
                    <IconBook className="size-4 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary" />
                  </button>
                </>
              }
            />
            <div className="p-6 text-center text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
              <p className="text-[13px]">
                Custom actions (star, bookmark) added before default buttons
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
            Legacy Model Selected
          </h2>
          <p className="text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            Header with a legacy model selected from the dropdown
          </p>
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg overflow-hidden bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2">
            <ChatHeader
              onSidebarToggle={() => {}}
              selectedModel={model4}
              onModelChange={(model) => setModel4(typeof model === "string" ? model : model.name)}
              viewMode={viewMode4}
              onViewModeChange={setViewMode4}
            />
            <div className="p-6 text-center text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
              <p className="text-[13px]">
                Click the model selector to see available and legacy models
              </p>
              <p className="text-[13px]">
                Current selection: <span className="font-medium">{model4}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
            With Share Button
          </h2>
          <p className="text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            Header with additional sharing functionality
          </p>
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg overflow-hidden bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2">
            <ChatHeader
              onSidebarToggle={() => {}}
              selectedModel={model5}
              onModelChange={(model) => setModel5(typeof model === "string" ? model : model.name)}
              viewMode={viewMode5}
              onViewModeChange={setViewMode5}
              headerRight={
                <button
                  className="flex items-center gap-2 px-3 py-1.5 bg-button-primary-bg-light dark:bg-button-primary-bg-dark text-button-primary-text-light dark:text-button-primary-text-dark rounded-lg hover:opacity-90 transition-opacity"
                  onClick={() => alert("Share conversation")}
                >
                  <IconGroup className="size-3.5" />
                  <span className="text-[13px]">Share</span>
                </button>
              }
            />
            <div className="p-6 text-center text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
              <p className="text-[13px]">
                Custom share button with primary styling
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
            Full Example in Context
          </h2>
          <p className="text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            Complete chat interface with header and content area
          </p>
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg overflow-hidden bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 h-[500px] flex flex-col">
            <ChatHeader
              onSidebarToggle={() => {}}
              selectedModel={model1}
              onModelChange={(model) => setModel1(typeof model === "string" ? model : model.name)}
              viewMode={viewMode1}
              onViewModeChange={setViewMode1}
              headerRight={
                <button className="p-1.5 hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3 rounded-md transition-colors">
                  <IconDotsHorizontal className="size-4 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary" />
                </button>
              }
            />
            <div className="flex-1 overflow-auto p-8">
              <div className="max-w-3xl mx-auto space-y-6">
                {/* Sample chat messages */}
                <div className="flex gap-4">
                  <div className="size-8 rounded-full bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 flex items-center justify-center flex-shrink-0">
                    <span className="text-[13px]">You</span>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                      How do I use the ChatHeader component?
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="size-8 rounded-full bg-button-primary-bg-light dark:bg-button-primary-bg-dark flex items-center justify-center flex-shrink-0">
                    <span className="text-[13px] text-button-primary-text-light dark:text-button-primary-text-dark">
                      AI
                    </span>
                  </div>
                  <div className="flex-1 pt-1 space-y-3">
                    <p className="text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                      The ChatHeader component is a versatile header for chat interfaces. Here's how to use it:
                    </p>
                    <div className="bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 rounded-lg p-4 font-mono text-[12px]">
                      <code className="text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                        {`<ChatHeader
  onSidebarToggle={() => {}}
  selectedModel="Auto"
  onModelChange={setModel}
  viewMode="chat"
  onViewModeChange={setViewMode}
/>`}
                      </code>
                    </div>
                    <p className="text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                      Key features include:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                      <li>Toggle between Chat and Compose modes</li>
                      <li>Model selector with available and legacy models</li>
                      <li>Customizable header actions via headerRight slot</li>
                      <li>Built-in download and share buttons</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
            Different Header Right Configurations
          </h2>
          <p className="text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            Various examples of custom header actions
          </p>
          <div className="grid grid-cols-1 gap-4">
            {/* Privacy indicator */}
            <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg overflow-hidden bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2">
              <ChatHeader
                onSidebarToggle={() => {}}
                selectedModel="Auto"
                onModelChange={() => {}}
                viewMode="chat"
                onViewModeChange={() => {}}
                headerRight={
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 rounded-lg">
                    <IconLock className="size-3.5 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary" />
                    <span className="text-[13px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                      Private
                    </span>
                  </div>
                }
              />
              <div className="p-4 text-center text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
                <p className="text-[12px]">Privacy indicator badge</p>
              </div>
            </div>

            {/* Public/shared indicator */}
            <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg overflow-hidden bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2">
              <ChatHeader
                onSidebarToggle={() => {}}
                selectedModel="Pro"
                onModelChange={() => {}}
                viewMode="chat"
                onViewModeChange={() => {}}
                headerRight={
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-foundation-accent-green-light/10 dark:bg-foundation-accent-green/10 rounded-lg">
                    <IconGlobe className="size-3.5 text-foundation-accent-green-light dark:text-foundation-accent-green" />
                    <span className="text-[13px] text-foundation-accent-green-light dark:text-foundation-accent-green">
                      Public
                    </span>
                  </div>
                }
              />
              <div className="p-4 text-center text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
                <p className="text-[12px]">Public/shared conversation badge</p>
              </div>
            </div>

            {/* Multiple action buttons */}
            <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg overflow-hidden bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2">
              <ChatHeader
                onSidebarToggle={() => {}}
                selectedModel="Thinking"
                onModelChange={() => {}}
                viewMode="chat"
                onViewModeChange={() => {}}
                headerRight={
                  <>
                    <button className="px-3 py-1.5 text-[13px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3 rounded-lg transition-colors">
                      Save
                    </button>
                    <button className="px-3 py-1.5 text-[13px] bg-button-primary-bg-light dark:bg-button-primary-bg-dark text-button-primary-text-light dark:text-button-primary-text-dark rounded-lg hover:opacity-90 transition-opacity">
                      Export
                    </button>
                  </>
                }
              />
              <div className="p-4 text-center text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
                <p className="text-[12px]">Multiple action buttons (Save & Export)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
