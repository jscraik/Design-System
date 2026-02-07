import { useState } from "react";

import {
  sampleCategories,
  sampleCategoryColors,
  sampleCategoryIconColors,
  sampleCategoryIcons,
  sampleChatHistory,
  sampleLegacyModels,
  sampleMessages,
  sampleModels,
  sampleProjects,
  sampleUser,
} from "../../fixtures/sample-data";
import { IconCheckmark, IconChevronDownMd } from "../../icons";

import { ChatHeaderBlock } from "./ChatHeaderBlock";
import { ChatInput } from "../../app/chat/ChatInput";
import { ChatMessagesBlock } from "./ChatMessagesBlock";
import { ChatSidebarBlock } from "./ChatSidebarBlock";
import { SettingDropdownBlock } from "./SettingDropdownBlock";
import { SettingRowBlock } from "./SettingRowBlock";
import { SettingToggleBlock } from "./SettingToggleBlock";
import { TemplateFieldGroup } from "./TemplateFieldGroup";
import { TemplateFooterBar } from "./TemplateFooterBar";
import { TemplateFormField } from "./TemplateFormField";
import {
  TemplateHeaderActionButton,
  TemplateHeaderBackButton,
  TemplateHeaderBar,
  TemplateHeaderIconButton,
} from "./TemplateHeaderBar";
import { TemplatePanel, TemplatePanelFooter, TemplatePanelHeader } from "./TemplatePanel";
import { TemplateShell } from "./TemplateShell";

export type BlockId =
  | "template-shell"
  | "template-panel"
  | "template-header-bar"
  | "template-footer-bar"
  | "template-form-field"
  | "template-field-group"
  | "chat-header"
  | "chat-sidebar"
  | "chat-messages"
  | "chat-input"
  | "setting-row"
  | "setting-toggle"
  | "setting-dropdown";

export type BlockDefinition = {
  id: BlockId;
  title: string;
  description: string;
  Component: () => React.JSX.Element;
};

function TemplateShellSample() {
  return (
    <TemplateShell
      sidebarWidth={200}
      detailWidth={200}
      animated
      showDividers
      sidebar={
        <div className="h-full bg-secondary p-4">
          <div className="text-sm font-medium text-foreground mb-3">Sidebar</div>
          <nav className="space-y-1">
            {["Chats", "Profile", "Settings"].map((item) => (
              <button
                key={item}
                type="button"
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-muted transition-colors"
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
      }
      header={
        <div className="px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Header Section</span>
          <button
            type="button"
            className="text-xs px-2 py-1 rounded bg-muted text-text-secondary hover:bg-muted/80 transition-colors"
          >
            Action
          </button>
        </div>
      }
      body={
        <div className="p-4">
          <h2 className="text-lg font-semibold text-foreground mb-2">Main Content Area</h2>
          <p className="text-sm text-text-secondary mb-4">
            This is the main body section that takes up remaining vertical space. It scrolls
            independently when content overflows.
          </p>
          <div className="space-y-3">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="p-3 rounded-lg bg-secondary text-sm text-text-secondary">
                Content block {i + 1}
              </div>
            ))}
          </div>
        </div>
      }
      footer={
        <div className="px-4 py-3 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Footer info</span>
          <button
            type="button"
            className="text-xs px-3 py-1.5 rounded-lg bg-accent-blue text-accent-foreground hover:bg-accent-blue/90 transition-colors"
          >
            Save
          </button>
        </div>
      }
      detail={
        <div className="h-full bg-secondary p-4">
          <div className="text-sm font-medium text-foreground mb-2">Detail Panel</div>
          <p className="text-xs text-muted-foreground">
            Optional right panel for additional information or actions.
          </p>
        </div>
      }
    />
  );
}

function TemplatePanelSample() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-4">
      {/* Collapsible panel with header */}
      <TemplatePanel
        collapsible
        variant="default"
        size="md"
        header={
          <TemplatePanelHeader
            title="Collapsible Panel"
            subtitle="Click the chevron to collapse"
            showCollapseToggle
            trailing={
              <button
                type="button"
                onClick={() => setIsLoading((prev) => !prev)}
                className="text-xs px-2 py-1 rounded bg-muted text-text-secondary hover:bg-muted/80 transition-colors"
              >
                {isLoading ? "Stop Loading" : "Simulate Load"}
              </button>
            }
          />
        }
        footer={
          <TemplatePanelFooter
            leading={<span className="text-xs text-muted-foreground">Last updated: just now</span>}
            trailing={
              <div className="flex gap-2">
                <button
                  type="button"
                  className="text-xs px-3 py-1.5 rounded-md text-text-secondary hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="text-xs px-3 py-1.5 rounded-md bg-accent-blue text-accent-foreground hover:bg-accent-blue/90 transition-colors"
                >
                  Save
                </button>
              </div>
            }
          />
        }
        loading={isLoading}
      >
        <div className="text-sm text-text-secondary">
          This panel demonstrates collapsible behavior with loading states. The body content
          smoothly animates when collapsed.
        </div>
      </TemplatePanel>

      {/* Elevated variant */}
      <TemplatePanel variant="elevated" size="sm">
        <div className="text-sm text-text-secondary">
          Elevated panel with stronger shadow for emphasis.
        </div>
      </TemplatePanel>

      {/* Outlined variant */}
      <TemplatePanel variant="outlined" size="lg">
        <div className="text-sm text-text-secondary">
          Outlined panel with transparent background.
        </div>
      </TemplatePanel>
    </div>
  );
}

function TemplateHeaderBarSample() {
  return (
    <div className="space-y-4">
      {/* Basic header */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">Basic Header</p>
        <TemplateHeaderBar title="Dashboard" variant="bordered" />
      </div>

      {/* With back button */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">With Back Button</p>
        <TemplateHeaderBar
          title="Settings"
          subtitle="Manage your preferences"
          leading={<TemplateHeaderBackButton onClick={() => {}} />}
          variant="default"
        />
      </div>

      {/* With trailing actions */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">With Actions</p>
        <TemplateHeaderBar
          title="Projects"
          variant="elevated"
          trailing={
            <div className="flex items-center gap-1">
              <TemplateHeaderIconButton
                icon={
                  <svg
                    className="size-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                }
                aria-label="Search"
              />
              <TemplateHeaderIconButton
                icon={
                  <svg
                    className="size-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                }
                aria-label="Settings"
              />
            </div>
          }
        />
      </div>

      {/* With primary action */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">With Primary Action</p>
        <TemplateHeaderBar
          title="My Tasks"
          size="lg"
          variant="bordered"
          trailing={
            <TemplateHeaderActionButton variant="primary" size="md">
              + New Task
            </TemplateHeaderActionButton>
          }
        />
      </div>
    </div>
  );
}

function TemplateFooterBarSample() {
  return (
    <TemplateFooterBar
      leading={<span className="text-xs">Left</span>}
      trailing={<span className="text-xs">Right</span>}
    />
  );
}

function TemplateFormFieldSample() {
  return (
    <TemplateFormField label="Label">
      <input
        className="w-full rounded-lg border border-border px-3 py-2 bg-secondary text-sm"
        placeholder="Input"
        aria-label="Template form field input"
      />
    </TemplateFormField>
  );
}

function TemplateFieldGroupSample() {
  const [value, setValue] = useState("");

  return (
    <TemplateFieldGroup
      label="Field Group"
      actions={
        <button type="button" className="text-xs px-2 py-1 rounded bg-muted">
          Help
        </button>
      }
    >
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-lg border border-border px-3 py-2 bg-secondary text-sm"
        placeholder="Text area"
        aria-label="Template field group input"
      />
    </TemplateFieldGroup>
  );
}

function ChatHeaderBlockSample() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<"chat" | "compose">("chat");
  const [selectedModel, setSelectedModel] = useState(sampleModels[0]);

  return (
    <ChatHeaderBlock
      isSidebarOpen={isSidebarOpen}
      onSidebarToggle={() => setIsSidebarOpen((prev) => !prev)}
      selectedModel={selectedModel}
      onModelChange={(model) => {
        if (typeof model === "string") {
          const resolved = [...sampleModels, ...sampleLegacyModels].find(
            (candidate) => candidate.name === model || candidate.shortName === model,
          );
          if (resolved) setSelectedModel(resolved);
          return;
        }
        setSelectedModel(model);
      }}
      models={sampleModels}
      legacyModels={sampleLegacyModels}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
    />
  );
}

function ChatSidebarBlockSample() {
  return (
    <ChatSidebarBlock
      isOpen={true}
      onToggle={() => {}}
      projects={sampleProjects}
      chatHistory={sampleChatHistory}
      categories={sampleCategories}
      categoryIcons={sampleCategoryIcons}
      categoryColors={sampleCategoryColors}
      categoryIconColors={sampleCategoryIconColors}
      user={sampleUser}
    />
  );
}

function ChatMessagesBlockSample() {
  return <ChatMessagesBlock messages={sampleMessages} />;
}

function ChatInputSample() {
  return <ChatInput selectedModel={sampleModels[0]} />;
}

function SettingRowBlockSample() {
  return (
    <SettingRowBlock
      label="Setting Row"
      description="Secondary description text."
      right={<IconChevronDownMd className="size-3.5 text-text-secondary" />}
    />
  );
}

function SettingToggleBlockSample() {
  const [checked, setChecked] = useState(true);

  return (
    <SettingToggleBlock
      checked={checked}
      onCheckedChange={setChecked}
      label="Toggle Setting"
      description="Enable or disable this setting."
      icon={<IconCheckmark className="size-4 text-accent-green" />}
    />
  );
}

function SettingDropdownBlockSample() {
  const [value, setValue] = useState("default");

  return (
    <SettingDropdownBlock
      label="Dropdown Setting"
      value={value}
      onValueChange={setValue}
      options={[
        { value: "default", label: "Default" },
        { value: "compact", label: "Compact" },
      ]}
      description="Select a density mode."
    />
  );
}

export const blockRegistry: BlockDefinition[] = [
  {
    id: "template-shell",
    title: "Template Shell",
    description: "Layout shell with sidebar/header/body/footer/detail slots.",
    Component: TemplateShellSample,
  },
  {
    id: "template-panel",
    title: "Template Panel",
    description: "Card container with header and footer slots.",
    Component: TemplatePanelSample,
  },
  {
    id: "template-header-bar",
    title: "Template Header Bar",
    description: "Header bar with title + actions.",
    Component: TemplateHeaderBarSample,
  },
  {
    id: "template-footer-bar",
    title: "Template Footer Bar",
    description: "Footer bar with leading/trailing actions.",
    Component: TemplateFooterBarSample,
  },
  {
    id: "template-form-field",
    title: "Template Form Field",
    description: "Label + content stack for a single field.",
    Component: TemplateFormFieldSample,
  },
  {
    id: "template-field-group",
    title: "Template Field Group",
    description: "Label + actions + content group.",
    Component: TemplateFieldGroupSample,
  },
  {
    id: "chat-header",
    title: "Chat Header Block",
    description: "Header with view mode toggle and model menu.",
    Component: ChatHeaderBlockSample,
  },
  {
    id: "chat-sidebar",
    title: "Chat Sidebar Block",
    description: "Sidebar for chat navigation.",
    Component: ChatSidebarBlockSample,
  },
  {
    id: "chat-messages",
    title: "Chat Messages Block",
    description: "Message list with assistant/user content.",
    Component: ChatMessagesBlockSample,
  },
  {
    id: "chat-input",
    title: "Chat Input Block",
    description: "Composer with send action.",
    Component: ChatInputSample,
  },
  {
    id: "setting-row",
    title: "Setting Row Block",
    description: "Reusable settings row.",
    Component: SettingRowBlockSample,
  },
  {
    id: "setting-toggle",
    title: "Setting Toggle Block",
    description: "Toggle row for settings.",
    Component: SettingToggleBlockSample,
  },
  {
    id: "setting-dropdown",
    title: "Setting Dropdown Block",
    description: "Dropdown selector for settings.",
    Component: SettingDropdownBlockSample,
  },
];

export const getBlock = (id: BlockId) => blockRegistry.find((block) => block.id === id);
