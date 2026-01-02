import type { ComponentType } from "react";

import { FoundationsShowcase } from "../design-system/showcase/FoundationsShowcase";
import { ColorShowcase } from "../design-system/showcase/ColorShowcase";
import { TypographyShowcase } from "../design-system/showcase/TypographyShowcase";
import { SpacingShowcase } from "../design-system/showcase/SpacingShowcase";
import { IconographyShowcase } from "../design-system/showcase/IconographyShowcase";
import { DesignSystemDocs } from "../design-system/showcase/DesignSystemDocs";

import { ComposeTemplate } from "./ComposeTemplate";
import { ChatTemplate } from "./ChatTemplate";
import { ChatHeaderTemplate } from "./ChatHeaderTemplate";
import { ChatSidebarTemplate } from "./ChatSidebarTemplate";
import { ChatMessagesTemplate } from "./ChatMessagesTemplate";
import { ChatInputTemplate } from "./ChatInputTemplate";
import { ChatVariantsTemplate } from "./ChatVariantsTemplate";
import { AppsPanelTemplate } from "./AppsPanelTemplate";
import { ArchivedChatsPanelTemplate } from "./ArchivedChatsPanelTemplate";
import { AudioSettingsPanelTemplate } from "./AudioSettingsPanelTemplate";
import { CheckForUpdatesPanelTemplate } from "./CheckForUpdatesPanelTemplate";
import { DataControlsPanelTemplate } from "./DataControlsPanelTemplate";
import { ManageAppsPanelTemplate } from "./ManageAppsPanelTemplate";
import { NotificationsPanelTemplate } from "./NotificationsPanelTemplate";
import { PersonalizationPanelTemplate } from "./PersonalizationPanelTemplate";
import { SecurityPanelTemplate } from "./SecurityPanelTemplate";
import { ChatGPTIconCatalog } from "./ChatGPTIconCatalog";
import { TemplateShellDemo } from "./demos/TemplateShellDemo";
import { TemplatePanelDemo } from "./demos/TemplatePanelDemo";
import { TemplateHeaderBarDemo } from "./demos/TemplateHeaderBarDemo";
import { TemplateFormFieldDemo } from "./demos/TemplateFormFieldDemo";
import { TemplateFooterBarDemo } from "./demos/TemplateFooterBarDemo";
import { TemplateFieldGroupDemo } from "./demos/TemplateFieldGroupDemo";
import { SettingToggleBlockDemo } from "./demos/SettingToggleBlockDemo";
import { SettingRowBlockDemo } from "./demos/SettingRowBlockDemo";
import { SettingDropdownBlockDemo } from "./demos/SettingDropdownBlockDemo";
import { ChatHeaderDemo } from "./demos/ChatHeaderDemo";
import { ModelSelectorDemo } from "./demos/ModelSelectorDemo";
import { ChatInputDemo } from "./demos/ChatInputDemo";
import { AttachmentMenuDemo } from "./demos/AttachmentMenuDemo";
import { IconPickerModalDemo } from "./demos/IconPickerModalDemo";
import { DiscoverySettingsModalDemo } from "./demos/DiscoverySettingsModalDemo";
import { SettingsModalDemo } from "./demos/SettingsModalDemo";

// ============================================================================
// TEMPLATE DEFINITIONS
// ============================================================================

/**
 * Template identifiers for the templates registry.
 */
export type TemplateId =
  // Original templates
  | "compose"
  | "chat"
  | "chat-header"
  | "chat-sidebar"
  | "chat-messages"
  | "chat-input"
  | "chat-variants"
  | "settings-apps"
  | "settings-archived-chats"
  | "settings-audio"
  | "settings-check-updates"
  | "settings-data-controls"
  | "settings-manage-apps"
  | "settings-notifications"
  | "settings-personalization"
  | "settings-security"
  | "icon-catalog"
  // Design System Showcases
  | "foundations-showcase"
  | "color-showcase"
  | "typography-showcase"
  | "spacing-showcase"
  | "iconography-showcase"
  | "design-system-docs"
  // Template Block Demos
  | "template-shell"
  | "template-panel"
  | "template-header-bar"
  | "template-form-field"
  | "template-footer-bar"
  | "template-field-group"
  | "setting-toggle-block"
  | "setting-row-block"
  | "setting-dropdown-block"
  // Chat Component Demos
  | "chat-header-demo"
  | "model-selector"
  | "chat-input-demo"
  | "attachment-menu"
  // Modal Demos
  | "icon-picker-modal"
  | "discovery-settings-modal"
  | "settings-modal";

// New templates from Figma export (to be enabled after fixing imports)
// type TemplateId =
//   ...Original templates
//   | "foundations-showcase"
//   | "design-system-docs"
//   | "color-showcase"
//   | "typography-showcase"
//   | "spacing-showcase"
//   | "iconography-showcase"
//   | "icon-catalog"
//   | "template-shell"
//   | "template-panel"
//   | "template-header-bar"
//   | "template-form-field"
//   | "template-footer-bar"
//   | "template-field-group"
//   | "setting-toggle-block"
//   | "setting-row-block"
//   | "setting-dropdown-block"
//   | "chat-header-demo"
//   | "model-selector"
//   | "chat-input-demo"
//   | "attachment-menu"
//   | "icon-picker-modal"
//   | "discovery-settings-modal"
//   | "settings-modal";

/**
 * Template categories used for grouping registry entries.
 */
export type TemplateCategory =
  | "layouts"
  | "modals"
  | "panels"
  | "settings"
  | "design-system"
  | "components"
  | "templates";

/**
 * Definition for a template registry entry.
 */
export interface TemplateDefinition {
  id: TemplateId;
  title: string;
  description: string;
  category: TemplateCategory;
  Component: ComponentType;
  tags?: string[];
}

/**
 * Registry of available templates and demos.
 */
export const templateRegistry: TemplateDefinition[] = [
  // ==========================================================================
  // ORIGINAL TEMPLATES
  // ==========================================================================

  {
    id: "compose",
    title: "Compose",
    description: "Prompt builder and compose workflow template.",
    category: "layouts",
    Component: ComposeTemplate,
    tags: ["chat", "compose"],
  },
  {
    id: "chat",
    title: "Chat",
    description: "Full chat experience with sidebar, header, messages, and composer.",
    category: "layouts",
    Component: ChatTemplate,
    tags: ["chat", "complete"],
  },
  {
    id: "chat-header",
    title: "Chat Header",
    description: "Top navigation header for chat surfaces.",
    category: "layouts",
    Component: ChatHeaderTemplate,
    tags: ["chat", "header"],
  },
  {
    id: "chat-sidebar",
    title: "Chat Sidebar",
    description: "Sidebar navigation for chat history and projects.",
    category: "layouts",
    Component: ChatSidebarTemplate,
    tags: ["chat", "sidebar"],
  },
  {
    id: "chat-messages",
    title: "Chat Messages",
    description: "Message list with assistant and user messages.",
    category: "layouts",
    Component: ChatMessagesTemplate,
    tags: ["chat", "messages"],
  },
  {
    id: "chat-input",
    title: "Chat Input",
    description: "Composer bar with attachments and send controls.",
    category: "layouts",
    Component: ChatInputTemplate,
    tags: ["chat", "input"],
  },
  {
    id: "chat-variants",
    title: "Chat Variants",
    description: "Slot-based chat layout variations (split, compact, rail).",
    category: "layouts",
    Component: ChatVariantsTemplate,
    tags: ["chat", "variants", "slots"],
  },
  {
    id: "settings-apps",
    title: "Settings: Apps",
    description: "Apps settings panel template.",
    category: "panels",
    Component: AppsPanelTemplate,
    tags: ["settings", "apps"],
  },
  {
    id: "settings-archived-chats",
    title: "Settings: Archived Chats",
    description: "Archived chats panel template.",
    category: "panels",
    Component: ArchivedChatsPanelTemplate,
    tags: ["settings", "chats"],
  },
  {
    id: "settings-audio",
    title: "Settings: Audio",
    description: "Audio settings panel template.",
    category: "panels",
    Component: AudioSettingsPanelTemplate,
    tags: ["settings", "audio"],
  },
  {
    id: "settings-check-updates",
    title: "Settings: Check for Updates",
    description: "Check for updates panel template.",
    category: "panels",
    Component: CheckForUpdatesPanelTemplate,
    tags: ["settings", "updates"],
  },
  {
    id: "settings-data-controls",
    title: "Settings: Data Controls",
    description: "Data controls panel template.",
    category: "panels",
    Component: DataControlsPanelTemplate,
    tags: ["settings", "data"],
  },
  {
    id: "settings-manage-apps",
    title: "Settings: Manage Apps",
    description: "Manage apps panel template.",
    category: "panels",
    Component: ManageAppsPanelTemplate,
    tags: ["settings", "apps"],
  },
  {
    id: "settings-notifications",
    title: "Settings: Notifications",
    description: "Notifications panel template.",
    category: "panels",
    Component: NotificationsPanelTemplate,
    tags: ["settings", "notifications"],
  },
  {
    id: "settings-personalization",
    title: "Settings: Personalization",
    description: "Personalization panel template.",
    category: "panels",
    Component: PersonalizationPanelTemplate,
    tags: ["settings", "personalization"],
  },
  {
    id: "settings-security",
    title: "Settings: Security",
    description: "Security panel template.",
    category: "panels",
    Component: SecurityPanelTemplate,
    tags: ["settings", "security"],
  },
  {
    id: "icon-catalog",
    title: "Icon Catalog",
    description: "Browse all 350+ ChatGPT icons with search and categories.",
    category: "design-system",
    Component: ChatGPTIconCatalog,
    tags: ["design-system", "icons", "catalog"],
  },
  {
    id: "foundations-showcase",
    title: "Foundations Showcase",
    description: "Complete design system hub with tabbed interface.",
    category: "design-system",
    Component: FoundationsShowcase,
    tags: ["design-system", "foundations", "hub"],
  },
  {
    id: "color-showcase",
    title: "Color Showcase",
    description: "Complete color palette with light/dark modes.",
    category: "design-system",
    Component: ColorShowcase,
    tags: ["design-system", "color", "palette"],
  },
  {
    id: "typography-showcase",
    title: "Typography Showcase",
    description: "Typography system with font families, sizes, and weights.",
    category: "design-system",
    Component: TypographyShowcase,
    tags: ["design-system", "typography", "fonts"],
  },
  {
    id: "spacing-showcase",
    title: "Spacing Showcase",
    description: "Spacing system with scale and usage examples.",
    category: "design-system",
    Component: SpacingShowcase,
    tags: ["design-system", "spacing", "scale"],
  },
  {
    id: "iconography-showcase",
    title: "Iconography Showcase",
    description: "Icon library with categories and usage guidelines.",
    category: "design-system",
    Component: IconographyShowcase,
    tags: ["design-system", "icons", "guidelines"],
  },
  {
    id: "design-system-docs",
    title: "Design System Documentation",
    description: "Comprehensive design system documentation.",
    category: "design-system",
    Component: DesignSystemDocs,
    tags: ["design-system", "docs", "reference"],
  },

  // ==========================================================================
  // TEMPLATE BLOCK DEMOS
  // ==========================================================================

  {
    id: "template-shell",
    title: "Template Shell",
    description: "Demo of TemplateShell component with collapsible sidebars.",
    category: "templates",
    Component: TemplateShellDemo,
    tags: ["templates", "shell", "layout"],
  },
  {
    id: "template-panel",
    title: "Template Panel",
    description: "Demo of TemplatePanel component with variants and states.",
    category: "templates",
    Component: TemplatePanelDemo,
    tags: ["templates", "panel"],
  },
  {
    id: "template-header-bar",
    title: "Template Header Bar",
    description: "Demo of TemplateHeaderBar component.",
    category: "templates",
    Component: TemplateHeaderBarDemo,
    tags: ["templates", "header"],
  },
  {
    id: "template-form-field",
    title: "Template Form Field",
    description: "Demo of TemplateFormField component.",
    category: "templates",
    Component: TemplateFormFieldDemo,
    tags: ["templates", "form"],
  },
  {
    id: "template-footer-bar",
    title: "Template Footer Bar",
    description: "Demo of TemplateFooterBar component.",
    category: "templates",
    Component: TemplateFooterBarDemo,
    tags: ["templates", "footer"],
  },
  {
    id: "template-field-group",
    title: "Template Field Group",
    description: "Demo of TemplateFieldGroup component.",
    category: "templates",
    Component: TemplateFieldGroupDemo,
    tags: ["templates", "form", "group"],
  },

  // ==========================================================================
  // SETTINGS BLOCK DEMOS
  // ==========================================================================

  {
    id: "setting-toggle-block",
    title: "Setting Toggle Block",
    description: "Demo of SettingToggleBlock component.",
    category: "components",
    Component: SettingToggleBlockDemo,
    tags: ["settings", "toggle", "block"],
  },
  {
    id: "setting-row-block",
    title: "Setting Row Block",
    description: "Demo of SettingRowBlock component.",
    category: "components",
    Component: SettingRowBlockDemo,
    tags: ["settings", "row", "block"],
  },
  {
    id: "setting-dropdown-block",
    title: "Setting Dropdown Block",
    description: "Demo of SettingDropdownBlock component.",
    category: "components",
    Component: SettingDropdownBlockDemo,
    tags: ["settings", "dropdown", "block"],
  },

  // ==========================================================================
  // CHAT COMPONENT DEMOS
  // ==========================================================================

  {
    id: "chat-header-demo",
    title: "Chat Header Demo",
    description: "Demo of ChatHeader component with various states.",
    category: "components",
    Component: ChatHeaderDemo,
    tags: ["chat", "header", "demo"],
  },
  {
    id: "model-selector",
    title: "Model Selector",
    description: "Demo of ModelSelector component.",
    category: "components",
    Component: ModelSelectorDemo,
    tags: ["chat", "model", "selector"],
  },
  {
    id: "chat-input-demo",
    title: "Chat Input Demo",
    description: "Demo of ChatInput component.",
    category: "components",
    Component: ChatInputDemo,
    tags: ["chat", "input", "demo"],
  },
  {
    id: "attachment-menu",
    title: "Attachment Menu",
    description: "Demo of AttachmentMenu component.",
    category: "components",
    Component: AttachmentMenuDemo,
    tags: ["chat", "attachment", "menu"],
  },

  // ==========================================================================
  // MODAL DEMOS
  // ==========================================================================

  {
    id: "icon-picker-modal",
    title: "Icon Picker Modal",
    description: "Demo of IconPickerModal component.",
    category: "modals",
    Component: IconPickerModalDemo,
    tags: ["modal", "icon", "picker"],
  },
  {
    id: "discovery-settings-modal",
    title: "Discovery Settings Modal",
    description: "Demo of DiscoverySettingsModal component.",
    category: "modals",
    Component: DiscoverySettingsModalDemo,
    tags: ["modal", "settings", "discovery"],
  },
  {
    id: "settings-modal",
    title: "Settings Modal",
    description: "Demo of SettingsModal component.",
    category: "modals",
    Component: SettingsModalDemo,
    tags: ["modal", "settings"],
  },

  // ==========================================================================
  // NEW TEMPLATES FROM FIGMA EXPORT
  // ==========================================================================
  // NOTE: These templates have been temporarily disabled due to import path issues.
  // They will be enabled after fixing the imports to work with the new structure.
  //
  // To add a template:
  // 1. Uncomment the import at the top of this file
  // 2. Fix the import paths in the component file
  // 3. Uncomment the template entry below
  //
  // Example:
  // {
  //   id: "foundations-showcase",
  //   title: "Foundations Showcase",
  //   description: "Complete design system hub with tabbed interface.",
  //   category: "design-system",
  //   Component: FoundationsShowcase,
  //   tags: ["design-system", "foundations", "hub"],
  // },
];

/**
 * Look up a template definition by ID.
 * @param id - Template identifier.
 * @returns The template definition if found.
 */
export const getTemplate = (id: TemplateId): TemplateDefinition | undefined =>
  templateRegistry.find((template) => template.id === id);

/**
 * Return templates matching a category.
 * @param category - Template category.
 * @returns Templates in the requested category.
 */
export const getTemplatesByCategory = (category: TemplateCategory): TemplateDefinition[] =>
  templateRegistry.filter((template) => template.category === category);

/**
 * Human-readable category labels for UI.
 */
export const categories: Record<TemplateCategory, string> = {
  layouts: "Layouts",
  modals: "Modals",
  panels: "Panels",
  settings: "Settings",
  "design-system": "Design System",
  components: "Components",
  templates: "Templates",
} as const;
