/**
 * Basic Usage Examples
 *
 * Copy these examples to get started quickly with common patterns
 */
import * as React from "react";

import {
  Button,
  ChatUIRoot,
  ChatVariantSplitSidebar,
  ContextTag,
  IconButton,
  MessageActions,
  ModelSelector,
  RangeSlider,
  SegmentedControl,
  Toggle,
} from "../src";

// 1. Basic Chat Interface
export function BasicChatExample() {
  const [selectedModel, setSelectedModel] = React.useState("GPT-4o");

  const models = [
    { name: "GPT-4o", shortName: "4o", description: "Fast and efficient" },
    { name: "GPT-4", shortName: "4", description: "Most capable" },
  ];

  return (
    <ChatUIRoot>
      <div className="p-4 space-y-4">
        <ModelSelector
          value={selectedModel}
          models={models}
          onChange={setSelectedModel}
          label="ChatGPT"
        />

        <div className="flex gap-2">
          <ContextTag
            label="Active Context"
            variant="green"
            onClose={() => console.log("Context removed")}
          />
        </div>

        <MessageActions messageId="example" actions={["copy", "thumbsUp", "thumbsDown"]} />
      </div>
    </ChatUIRoot>
  );
}

// 2. Settings Panel Example
export function SettingsPanelExample() {
  const [darkMode, setDarkMode] = React.useState(true);
  const [volume, setVolume] = React.useState(75);
  const [quality, setQuality] = React.useState<"low" | "medium" | "high">("medium");

  return (
    <ChatUIRoot>
      <div className="p-6 space-y-6 max-w-md">
        <h2 className="text-lg font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
          Settings
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Dark Mode
            </span>
            <Toggle checked={darkMode} onChange={setDarkMode} />
          </div>

          <RangeSlider
            label="Volume"
            value={volume}
            onChange={setVolume}
            min={0}
            max={100}
            suffix="%"
          />

          <div className="space-y-2">
            <label className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Quality
            </label>
            <SegmentedControl
              value={quality}
              options={[
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
              ]}
              onChange={setQuality}
            />
          </div>
        </div>
      </div>
    </ChatUIRoot>
  );
}

// 3. Action Bar Example
export function ActionBarExample() {
  return (
    <ChatUIRoot>
      <div className="p-4 flex items-center gap-2 bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 rounded-lg">
        <IconButton icon={<span>📋</span>} title="Copy" variant="ghost" />
        <IconButton icon={<span>👍</span>} title="Like" variant="ghost" />
        <IconButton icon={<span>👎</span>} title="Dislike" variant="ghost" />
        <IconButton icon={<span>🔄</span>} title="Regenerate" variant="ghost" />
        <div className="flex-1" />
        <Button variant="outline" size="sm">
          Share
        </Button>
      </div>
    </ChatUIRoot>
  );
}

// 4. Slot-based Chat Variant Example
export function ChatVariantExample() {
  return (
    <ChatVariantSplitSidebar
      messages={[
        {
          id: "1",
          role: "assistant",
          content: "This layout is composed from slots.",
          timestamp: new Date(),
        },
      ]}
      projects={[{ id: "general", label: "General", icon: <span>💬</span> }]}
    />
  );
}
