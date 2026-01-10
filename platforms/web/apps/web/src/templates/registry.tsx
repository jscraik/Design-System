import { useState } from "react";
import { AppsSDKBadge, AppsSDKButton, AppsSDKInput } from "@astudio/ui";
import { IconCheckmark, IconSettings } from "@astudio/ui/icons";
import { DiscoverySettingsModal, IconPickerModal, SettingsModal } from "@astudio/ui/modals";
import {
  SettingDropdownBlock,
  SettingRowBlock,
  SettingToggleBlock,
  TemplateFieldGroup,
  TemplateFooterBar,
  TemplateFormField,
  TemplateHeaderBar,
  TemplatePanel,
  TemplateShell,
} from "@astudio/ui/templates";

const badgeBaseClassName =
  "bg-foundation-bg-light-3 text-foundation-text-light-secondary dark:bg-foundation-bg-dark-3 dark:text-foundation-text-dark-secondary";

export { EducationalStarterTemplate } from "./educational/EducationalStarterTemplate";

/**
 * @template
 * id: template-field-group
 * title: Template Field Group
 * description: Grouped fields with shared label and actions.
 * category: templates
 * tags: [form, grouping, templates]
 * status: stable
 * entry: TemplateFieldGroupSample
 */
export function TemplateFieldGroupSample() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 px-6 py-8">
      <TemplateFieldGroup
        label="Profile"
        description="Update the basics used across your workspace."
        badge={<AppsSDKBadge className={badgeBaseClassName}>Required</AppsSDKBadge>}
        divider
      >
        <TemplateFormField label="Display name">
          <AppsSDKInput defaultValue="Workspace A" />
        </TemplateFormField>
        <TemplateFormField label="Owner email" description="Notifications are sent here.">
          <AppsSDKInput defaultValue="team@astudio.dev" />
        </TemplateFormField>
      </TemplateFieldGroup>
    </div>
  );
}

/**
 * @template
 * id: template-footer-bar
 * title: Template Footer Bar
 * description: Footer bar with status and actions.
 * category: templates
 * tags: [actions, footer, templates]
 * status: stable
 * entry: TemplateFooterBarSample
 */
export function TemplateFooterBarSample() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 px-6 py-8">
      <div className="rounded-2xl border border-foundation-bg-light-3 bg-foundation-bg-light-2 p-6 dark:border-foundation-bg-dark-3 dark:bg-foundation-bg-dark-2">
        <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
          Draft your workflow summary here.
        </p>
      </div>
      <TemplateFooterBar
        status={{ type: "success", message: "All changes saved" }}
        trailing={
          <AppsSDKButton size="sm" variant="outline">
            Publish
          </AppsSDKButton>
        }
      />
    </div>
  );
}

/**
 * @template
 * id: template-form-field
 * title: Template Form Field
 * description: Form field wrapper with label and helper text.
 * category: templates
 * tags: [form, input, templates]
 * status: stable
 * entry: TemplateFormFieldSample
 */
export function TemplateFormFieldSample() {
  return (
    <div className="mx-auto w-full max-w-xl space-y-4 px-6 py-8">
      <TemplateFormField
        label="Project name"
        description="Visible to everyone in your workspace."
      >
        <AppsSDKInput defaultValue="AStudio Core" />
      </TemplateFormField>
      <TemplateFormField label="Short summary" hint="140 characters max." optional>
        <AppsSDKInput defaultValue="Design system templates" />
      </TemplateFormField>
    </div>
  );
}

/**
 * @template
 * id: template-header-bar
 * title: Template Header Bar
 * description: Header bar with title and optional actions.
 * category: templates
 * tags: [header, navigation, templates]
 * status: stable
 * entry: TemplateHeaderBarSample
 */
export function TemplateHeaderBarSample() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-8">
      <TemplateHeaderBar
        title="Workspace settings"
        subtitle="Adjust notifications and access"
        badge={<AppsSDKBadge className={badgeBaseClassName}>Beta</AppsSDKBadge>}
        trailing={
          <AppsSDKButton size="sm" variant="outline">
            Save
          </AppsSDKButton>
        }
      />
    </div>
  );
}

/**
 * @template
 * id: template-panel
 * title: Template Panel
 * description: Container with optional header, footer, and variants.
 * category: templates
 * tags: [container, panel, templates]
 * status: stable
 * entry: TemplatePanelSample
 */
export function TemplatePanelSample() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 px-6 py-8">
      <TemplatePanel
        header={
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Notifications</h2>
            <AppsSDKBadge className={badgeBaseClassName}>3 updates</AppsSDKBadge>
          </div>
        }
        footer={
          <div className="flex items-center justify-between">
            <span className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
              Updated 2 hours ago
            </span>
            <AppsSDKButton size="sm" variant="outline">
              Review
            </AppsSDKButton>
          </div>
        }
      >
        <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
          Keep your team informed about key changes and account activity.
        </p>
      </TemplatePanel>
    </div>
  );
}

/**
 * @template
 * id: template-shell
 * title: Template Shell
 * description: Layout shell with sidebar, header, body, footer, and detail slots.
 * category: templates
 * tags: [layout, shell, templates]
 * status: stable
 * entry: TemplateShellSample
 */
export function TemplateShellSample() {
  return (
    <div className="mx-auto h-[520px] w-full max-w-5xl px-6 py-8">
      <TemplateShell
        sidebarWidth={220}
        detailWidth={240}
        sidebar={
          <div className="h-full bg-foundation-bg-light-2 p-4 dark:bg-foundation-bg-dark-2">
            <h3 className="text-sm font-semibold">Navigation</h3>
            <ul className="mt-3 space-y-2 text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              <li>Overview</li>
              <li>Templates</li>
              <li>Settings</li>
            </ul>
          </div>
        }
        header={
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm font-semibold">Template Shell</span>
            <AppsSDKButton size="sm" variant="outline">
              Share
            </AppsSDKButton>
          </div>
        }
        body={
          <div className="p-4 text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            Use this region for scrollable content and primary workflows.
          </div>
        }
        footer={
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
              Saved just now
            </span>
            <AppsSDKButton size="sm">Continue</AppsSDKButton>
          </div>
        }
        detail={
          <div className="h-full bg-foundation-bg-light-2 p-4 dark:bg-foundation-bg-dark-2">
            <p className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
              Contextual metadata or secondary actions.
            </p>
          </div>
        }
      />
    </div>
  );
}

export { ComponentsShowcaseTemplate } from "./components/ComponentsShowcaseTemplate";

export { ColorShowcase } from "./design-system/ColorShowcaseTemplate";
export { DesignSystemDocs } from "./design-system/DesignSystemDocsTemplate";
export { FoundationsShowcase } from "./design-system/FoundationsShowcaseTemplate";
export { IconographyShowcase } from "./design-system/IconographyShowcaseTemplate";
export { SpacingShowcase } from "./design-system/SpacingShowcaseTemplate";
export { TypographyShowcase } from "./design-system/TypographyShowcaseTemplate";

/**
 * @template
 * id: chat
 * title: Chat
 * description: Full chat experience with sidebar, header, messages, and composer.
 * category: layouts
 * tags: [chat, complete]
 * status: stable
 * entry: ChatTemplate
 */
export { ChatTemplate } from "@astudio/ui/templates";

/**
 * @template
 * id: chat-full-width
 * title: Chat Full Width
 * description: Full-width chat layout with header, messages, and composer.
 * category: layouts
 * tags: [chat, layout]
 * status: stable
 * entry: ChatFullWidthTemplate
 */
export { ChatFullWidthTemplate } from "@astudio/ui/templates";

/**
 * @template
 * id: chat-header
 * title: Chat Header
 * description: Top navigation header for chat surfaces.
 * category: layouts
 * tags: [chat, header]
 * status: stable
 * entry: ChatHeaderTemplate
 */
export { ChatHeaderTemplate } from "@astudio/ui/templates";

/**
 * @template
 * id: chat-input
 * title: Chat Input
 * description: Composer bar with attachments and send controls.
 * category: layouts
 * tags: [chat, input]
 * status: stable
 * entry: ChatInputTemplate
 */
export { ChatInputTemplate } from "@astudio/ui/templates";

/**
 * @template
 * id: chat-messages
 * title: Chat Messages
 * description: Message list with assistant and user messages.
 * category: layouts
 * tags: [chat, messages]
 * status: stable
 * entry: ChatMessagesTemplate
 */
export { ChatMessagesTemplate } from "@astudio/ui/templates";

/**
 * @template
 * id: chat-sidebar
 * title: Chat Sidebar
 * description: Sidebar layout with chat history list.
 * category: layouts
 * tags: [chat, sidebar]
 * status: stable
 * entry: ChatSidebarTemplate
 */
export { ChatSidebarTemplate } from "@astudio/ui/templates";

/**
 * @template
 * id: chat-two-pane
 * title: Chat Two Pane
 * description: Two-pane chat layout with sidebar and main content slots.
 * category: layouts
 * tags: [chat, layout]
 * status: stable
 * entry: ChatTwoPaneTemplate
 */
export { ChatTwoPaneTemplate } from "@astudio/ui/templates";

/**
 * @template
 * id: chat-variants
 * title: Chat Variants
 * description: Slot-based chat layout variations (split, compact, rail).
 * category: layouts
 * tags: [chat, slots, variants]
 * status: stable
 * entry: ChatVariantsTemplate
 */
export { ChatVariantsTemplate } from "@astudio/ui/templates";

/**
 * @template
 * id: compose
 * title: Compose
 * description: Prompt builder and compose workflow template.
 * category: layouts
 * tags: [chat, compose]
 * status: stable
 * entry: ComposeTemplate
 */
export { ComposeTemplate } from "@astudio/ui/templates";

/**
 * @template
 * id: dashboard
 * title: Dashboard
 * description: Dashboard template for widgets and cards.
 * category: layouts
 * tags: [dashboard, layout]
 * status: stable
 * entry: DashboardTemplate
 */
export { DashboardTemplate } from "@astudio/ui/templates";

/**
 * @template
 * id: setting-dropdown-block
 * title: Setting Dropdown Block
 * description: Dropdown selection block for settings.
 * category: settings
 * tags: [dropdown, settings]
 * status: stable
 * entry: SettingDropdownBlockSample
 */
export function SettingDropdownBlockSample() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 px-6 py-8">
      <SettingDropdownBlock
        label="Tone"
        value="balanced"
        onValueChange={() => {}}
        options={[
          { value: "concise", label: "Concise" },
          { value: "balanced", label: "Balanced" },
          { value: "detailed", label: "Detailed" },
        ]}
        description="Controls verbosity in assistant responses."
      />
    </div>
  );
}

/**
 * @template
 * id: setting-row-block
 * title: Setting Row Block
 * description: Static row for navigation or quick settings.
 * category: settings
 * tags: [navigation, settings]
 * status: stable
 * entry: SettingRowBlockSample
 */
export function SettingRowBlockSample() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 px-6 py-8">
      <SettingRowBlock
        icon={<IconSettings className="h-4 w-4" />}
        label="Workspace settings"
        description="Manage apps and security preferences."
        right={<AppsSDKBadge className={badgeBaseClassName}>New</AppsSDKBadge>}
        onClick={() => {}}
      />
    </div>
  );
}

/**
 * @template
 * id: setting-toggle-block
 * title: Setting Toggle Block
 * description: Toggle row for settings control.
 * category: settings
 * tags: [settings, toggle]
 * status: stable
 * entry: SettingToggleBlockSample
 */
export function SettingToggleBlockSample() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 px-6 py-8">
      <SettingToggleBlock
        icon={<IconCheckmark className="h-4 w-4" />}
        label="Enable suggestions"
        description="Suggest follow-up prompts in new chats."
        checked
        onCheckedChange={() => {}}
      />
    </div>
  );
}

/**
 * @template
 * id: discovery-settings-modal
 * title: Discovery Settings Modal
 * description: Modal for configuring prompt enhancement and discovery settings.
 * category: modals
 * tags: [modals, settings]
 * status: stable
 * entry: DiscoverySettingsModalTemplate
 */
export function DiscoverySettingsModalTemplate() {
  const [targetSize, setTargetSize] = useState(60);
  const [promptEnhancement, setPromptEnhancement] = useState<
    "rewrite" | "augment" | "preserve"
  >("rewrite");

  return (
    <DiscoverySettingsModal
      isOpen
      onClose={() => {}}
      promptEnhancement={promptEnhancement}
      onPromptEnhancementChange={setPromptEnhancement}
      targetSize={targetSize}
      onTargetSizeChange={setTargetSize}
    />
  );
}

/**
 * @template
 * id: icon-picker-modal
 * title: Icon Picker Modal
 * description: Modal for selecting project icons with color choices.
 * category: modals
 * tags: [icons, modals]
 * status: stable
 * entry: IconPickerModalTemplate
 */
export function IconPickerModalTemplate() {
  return (
    <IconPickerModal
      isOpen
      onClose={() => {}}
      onSave={() => {}}
      projectName="Design systems"
    />
  );
}

/**
 * @template
 * id: settings-modal
 * title: Settings Modal
 * description: Full settings modal with nested panels.
 * category: modals
 * tags: [modals, settings]
 * status: stable
 * entry: SettingsModalTemplate
 */
export function SettingsModalTemplate() {
  return (
    <SettingsModal
      isOpen
      onClose={() => {}}
      account={{ email: "hello@astudio.dev" }}
      appInfo={{ versionLabel: "1.0.0" }}
    />
  );
}

/**
 * @template
 * id: apps-panel
 * title: Apps Panel
 * description: Apps settings panel template.
 * category: panels
 * tags: [apps, settings]
 * status: stable
 * entry: AppsPanelTemplate
 */
export { AppsPanelTemplate } from "@astudio/ui/templates";

/**
 * @template
 * id: archived-chats-panel
 * title: Archived Chats Panel
 * description: Archived chats panel template.
 * category: panels
 * tags: [chats, settings]
 * status: stable
 * entry: ArchivedChatsPanelTemplate
 */
export { ArchivedChatsPanelTemplate } from "@astudio/ui/templates";

/**
 * @template
 * id: audio-settings-panel
 * title: Audio Settings Panel
 * description: Audio settings panel template.
 * category: panels
 * tags: [audio, settings]
 * status: stable
 * entry: AudioSettingsPanelTemplate
 */
export { AudioSettingsPanelTemplate } from "@astudio/ui/templates";

/**
 * @template
 * id: check-for-updates-panel
 * title: Check for Updates Panel
 * description: Check for updates panel template.
 * category: panels
 * tags: [settings, updates]
 * status: stable
 * entry: CheckForUpdatesPanelTemplate
 */
export { CheckForUpdatesPanelTemplate } from "@astudio/ui/templates";

/**
 * @template
 * id: data-controls-panel
 * title: Data Controls Panel
 * description: Data controls panel template.
 * category: panels
 * tags: [data, settings]
 * status: stable
 * entry: DataControlsPanelTemplate
 */
export { DataControlsPanelTemplate } from "@astudio/ui/templates";

/**
 * @template
 * id: manage-apps-panel
 * title: Manage Apps Panel
 * description: Manage apps panel template.
 * category: panels
 * tags: [apps, settings]
 * status: stable
 * entry: ManageAppsPanelTemplate
 */
export { ManageAppsPanelTemplate } from "@astudio/ui/templates";

/**
 * @template
 * id: notifications-panel
 * title: Notifications Panel
 * description: Notifications panel template.
 * category: panels
 * tags: [notifications, settings]
 * status: stable
 * entry: NotificationsPanelTemplate
 */
export { NotificationsPanelTemplate } from "@astudio/ui/templates";

/**
 * @template
 * id: personalization-panel
 * title: Personalization Panel
 * description: Personalization panel template.
 * category: panels
 * tags: [personalization, settings]
 * status: stable
 * entry: PersonalizationPanelTemplate
 */
export { PersonalizationPanelTemplate } from "@astudio/ui/templates";

/**
 * @template
 * id: security-panel
 * title: Security Panel
 * description: Security panel template.
 * category: panels
 * tags: [security, settings]
 * status: stable
 * entry: SecurityPanelTemplate
 */
export { SecurityPanelTemplate } from "@astudio/ui/templates";
