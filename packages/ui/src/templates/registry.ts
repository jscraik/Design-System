import type { ComponentType } from "react";
import * as React from "react";

import { FoundationsShowcase as TempFoundationsShowcase } from "./_temp_import/components/FoundationsShowcase";
import { ColorShowcase as TempColorShowcase } from "./_temp_import/components/ColorShowcase";
import { TypographyShowcase as TempTypographyShowcase } from "./_temp_import/components/TypographyShowcase";
import { SpacingShowcase as TempSpacingShowcase } from "./_temp_import/components/SpacingShowcase";
import { IconographyShowcase as TempIconographyShowcase } from "./_temp_import/components/IconographyShowcase";
import { DesignSystemDocs as TempDesignSystemDocs } from "./_temp_import/components/DesignSystemDocs";
import { ComposeTemplate } from "./ComposeTemplate";
import { ChatTemplate } from "./ChatTemplate";
import { ChatSidebarTemplate } from "./ChatSidebarTemplate";
import { ChatMessagesTemplate } from "./ChatMessagesTemplate";
import { ChatVariantsTemplate } from "./ChatVariantsTemplate";
import { ChatHeader as TempChatHeader } from "./_temp_import/components/ChatHeader";
import { ChatInput as TempChatInput } from "./_temp_import/components/ChatInput";
import { AppsPanel as TempAppsPanel } from "./_temp_import/components/AppsPanel";
import { ArchivedChatsPanel as TempArchivedChatsPanel } from "./_temp_import/components/ArchivedChatsPanel";
import { AudioSettingsPanelTemplate } from "./AudioSettingsPanelTemplate";
import { CheckForUpdatesPanelTemplate } from "./CheckForUpdatesPanelTemplate";
import { DataControlsPanel as TempDataControlsPanel } from "./_temp_import/components/DataControlsPanel";
import { ManageAppsPanel as TempManageAppsPanel } from "./_temp_import/components/ManageAppsPanel";
import { NotificationsPanel as TempNotificationsPanel } from "./_temp_import/components/NotificationsPanel";
import { PersonalizationPanel as TempPersonalizationPanel } from "./_temp_import/components/PersonalizationPanel";
import { SecurityPanel as TempSecurityPanel } from "./_temp_import/components/SecurityPanel";
import TempChatGPTIconCatalog from "./_temp_import/components/icons/ChatGPTIconCatalog";
import { TemplateShellDemo as TempTemplateShellDemo } from "./_temp_import/components/demos/TemplateShellDemo";
import { TemplatePanelDemo as TempTemplatePanelDemo } from "./_temp_import/components/demos/TemplatePanelDemo";
import { TemplateHeaderBarDemo as TempTemplateHeaderBarDemo } from "./_temp_import/components/demos/TemplateHeaderBarDemo";
import { TemplateFormFieldDemo as TempTemplateFormFieldDemo } from "./_temp_import/components/demos/TemplateFormFieldDemo";
import { TemplateFooterBarDemo as TempTemplateFooterBarDemo } from "./_temp_import/components/demos/TemplateFooterBarDemo";
import { TemplateFieldGroupDemo as TempTemplateFieldGroupDemo } from "./_temp_import/components/demos/TemplateFieldGroupDemo";
import { SettingToggleBlockDemo as TempSettingToggleBlockDemo } from "./_temp_import/components/demos/SettingToggleBlockDemo";
import { SettingRowBlockDemo as TempSettingRowBlockDemo } from "./_temp_import/components/demos/SettingRowBlockDemo";
import { SettingDropdownBlockDemo as TempSettingDropdownBlockDemo } from "./_temp_import/components/demos/SettingDropdownBlockDemo";
import { ChatHeaderDemo as TempChatHeaderDemo } from "./_temp_import/components/demos/ChatHeaderDemo";
import { ModelSelectorDemo as TempModelSelectorDemo } from "./_temp_import/components/demos/ModelSelectorDemo";
import { ChatInputDemo as TempChatInputDemo } from "./_temp_import/components/demos/ChatInputDemo";
import { AttachmentMenuDemo as TempAttachmentMenuDemo } from "./_temp_import/components/demos/AttachmentMenuDemo";
import { IconPickerModalDemo as TempIconPickerModalDemo } from "./_temp_import/components/demos/IconPickerModalDemo";
import { DiscoverySettingsModalDemo as TempDiscoverySettingsModalDemo } from "./_temp_import/components/demos/DiscoverySettingsModalDemo";
import { SettingsModalDemo as TempSettingsModalDemo } from "./_temp_import/components/demos/SettingsModalDemo";

const TempChatInputPreview: ComponentType = () =>
  React.createElement(TempChatInput, {
    selectedModel: {
      name: "GPT-4",
      shortName: "GPT-4",
      description: "Most capable model",
    },
  });

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
    Component: TempChatHeader,
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
    Component: TempChatInputPreview,
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
    Component: TempAppsPanel,
    tags: ["settings", "apps"],
  },
  {
    id: "settings-archived-chats",
    title: "Settings: Archived Chats",
    description: "Archived chats panel template.",
    category: "panels",
    Component: TempArchivedChatsPanel,
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
    Component: TempDataControlsPanel,
    tags: ["settings", "data"],
  },
  {
    id: "settings-manage-apps",
    title: "Settings: Manage Apps",
    description: "Manage apps panel template.",
    category: "panels",
    Component: TempManageAppsPanel,
    tags: ["settings", "apps"],
  },
  {
    id: "settings-notifications",
    title: "Settings: Notifications",
    description: "Notifications panel template.",
    category: "panels",
    Component: TempNotificationsPanel,
    tags: ["settings", "notifications"],
  },
  {
    id: "settings-personalization",
    title: "Settings: Personalization",
    description: "Personalization panel template.",
    category: "panels",
    Component: TempPersonalizationPanel,
    tags: ["settings", "personalization"],
  },
  {
    id: "settings-security",
    title: "Settings: Security",
    description: "Security panel template.",
    category: "panels",
    Component: TempSecurityPanel,
    tags: ["settings", "security"],
  },
  {
    id: "icon-catalog",
    title: "Icon Catalog",
    description: "Browse all 350+ ChatGPT icons with search and categories.",
    category: "design-system",
    Component: TempChatGPTIconCatalog,
    tags: ["design-system", "icons", "catalog"],
  },
  {
    id: "foundations-showcase",
    title: "Foundations Showcase",
    description: "Complete design system hub with tabbed interface.",
    category: "design-system",
    Component: TempFoundationsShowcase,
    tags: ["design-system", "foundations", "hub"],
  },
  {
    id: "color-showcase",
    title: "Color Showcase",
    description: "Complete color palette with light/dark modes.",
    category: "design-system",
    Component: TempColorShowcase,
    tags: ["design-system", "color", "palette"],
  },
  {
    id: "typography-showcase",
    title: "Typography Showcase",
    description: "Typography system with font families, sizes, and weights.",
    category: "design-system",
    Component: TempTypographyShowcase,
    tags: ["design-system", "typography", "fonts"],
  },
  {
    id: "spacing-showcase",
    title: "Spacing Showcase",
    description: "Spacing system with scale and usage examples.",
    category: "design-system",
    Component: TempSpacingShowcase,
    tags: ["design-system", "spacing", "scale"],
  },
  {
    id: "iconography-showcase",
    title: "Iconography Showcase",
    description: "Icon library with categories and usage guidelines.",
    category: "design-system",
    Component: TempIconographyShowcase,
    tags: ["design-system", "icons", "guidelines"],
  },
  {
    id: "design-system-docs",
    title: "Design System Documentation",
    description: "Comprehensive design system documentation.",
    category: "design-system",
    Component: TempDesignSystemDocs,
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
    Component: TempTemplateShellDemo,
    tags: ["templates", "shell", "layout"],
  },
  {
    id: "template-panel",
    title: "Template Panel",
    description: "Demo of TemplatePanel component with variants and states.",
    category: "templates",
    Component: TempTemplatePanelDemo,
    tags: ["templates", "panel"],
  },
  {
    id: "template-header-bar",
    title: "Template Header Bar",
    description: "Demo of TemplateHeaderBar component.",
    category: "templates",
    Component: TempTemplateHeaderBarDemo,
    tags: ["templates", "header"],
  },
  {
    id: "template-form-field",
    title: "Template Form Field",
    description: "Demo of TemplateFormField component.",
    category: "templates",
    Component: TempTemplateFormFieldDemo,
    tags: ["templates", "form"],
  },
  {
    id: "template-footer-bar",
    title: "Template Footer Bar",
    description: "Demo of TemplateFooterBar component.",
    category: "templates",
    Component: TempTemplateFooterBarDemo,
    tags: ["templates", "footer"],
  },
  {
    id: "template-field-group",
    title: "Template Field Group",
    description: "Demo of TemplateFieldGroup component.",
    category: "templates",
    Component: TempTemplateFieldGroupDemo,
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
    Component: TempSettingToggleBlockDemo,
    tags: ["settings", "toggle", "block"],
  },
  {
    id: "setting-row-block",
    title: "Setting Row Block",
    description: "Demo of SettingRowBlock component.",
    category: "components",
    Component: TempSettingRowBlockDemo,
    tags: ["settings", "row", "block"],
  },
  {
    id: "setting-dropdown-block",
    title: "Setting Dropdown Block",
    description: "Demo of SettingDropdownBlock component.",
    category: "components",
    Component: TempSettingDropdownBlockDemo,
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
    Component: TempChatHeaderDemo,
    tags: ["chat", "header", "demo"],
  },
  {
    id: "model-selector",
    title: "Model Selector",
    description: "Demo of ModelSelector component.",
    category: "components",
    Component: TempModelSelectorDemo,
    tags: ["chat", "model", "selector"],
  },
  {
    id: "chat-input-demo",
    title: "Chat Input Demo",
    description: "Demo of ChatInput component.",
    category: "components",
    Component: TempChatInputDemo,
    tags: ["chat", "input", "demo"],
  },
  {
    id: "attachment-menu",
    title: "Attachment Menu",
    description: "Demo of AttachmentMenu component.",
    category: "components",
    Component: TempAttachmentMenuDemo,
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
    Component: TempIconPickerModalDemo,
    tags: ["modal", "icon", "picker"],
  },
  {
    id: "discovery-settings-modal",
    title: "Discovery Settings Modal",
    description: "Demo of DiscoverySettingsModal component.",
    category: "modals",
    Component: TempDiscoverySettingsModalDemo,
    tags: ["modal", "settings", "discovery"],
  },
  {
    id: "settings-modal",
    title: "Settings Modal",
    description: "Demo of SettingsModal component.",
    category: "modals",
    Component: TempSettingsModalDemo,
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
