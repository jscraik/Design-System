# Template Drift Report

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


Source: `_temp/ChatGPT UI Templates (1)/src/templates/registry.ts` vs `packages/ui/src`

| Template ID | Component | _temp path | Best match in packages/ui | Similarity (Jaccard) | Match count |
|---|---|---|---|---:|---:|
| iconography-showcase | IconographyShowcase | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/IconographyShowcase.tsx` | `/Users/jamiecraik/chatui/packages/ui/src/design-system/showcase/IconographyShowcase.tsx` | 0.16 | 2 |
| new-components-showcase | NewComponentsShowcase | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/templates/NewComponentsShowcase.tsx` | `/Users/jamiecraik/chatui/packages/ui/src/templates/NewComponentsShowcase/NewComponentsShowcase.tsx` | 0.30 | 1 |
| color-showcase | ColorShowcase | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/ColorShowcase.tsx` | `/Users/jamiecraik/chatui/packages/ui/src/design-system/showcase/ColorShowcase.tsx` | 0.37 | 2 |
| spacing-showcase | SpacingShowcase | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SpacingShowcase.tsx` | `/Users/jamiecraik/chatui/packages/ui/src/design-system/showcase/SpacingShowcase.tsx` | 0.41 | 2 |
| typography-showcase | TypographyShowcase | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/TypographyShowcase.tsx` | `/Users/jamiecraik/chatui/packages/ui/src/design-system/showcase/TypographyShowcase.tsx` | 0.50 | 2 |
| apps-panel | AppsPanel | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/AppsPanel.tsx` | `/Users/jamiecraik/chatui/packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx` | 0.66 | 6 |
| template-panel | TemplatePanelDemo | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/TemplatePanelDemo.tsx` | `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/TemplatePanelDemo/TemplatePanelDemo.tsx` | 0.67 | 2 |
| security-panel | SecurityPanel | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SecurityPanel.tsx` | `/Users/jamiecraik/chatui/packages/ui/src/app/settings/SecurityPanel/SecurityPanel.tsx` | 0.71 | 3 |
| data-controls-panel | DataControlsPanel | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/DataControlsPanel.tsx` | `/Users/jamiecraik/chatui/packages/ui/src/app/settings/DataControlsPanel/DataControlsPanel.tsx` | 0.75 | 3 |
| manage-apps-panel | ManageAppsPanel | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/ManageAppsPanel.tsx` | `/Users/jamiecraik/chatui/packages/ui/src/app/settings/ManageAppsPanel/ManageAppsPanel.tsx` | 0.76 | 3 |
| notifications-panel | NotificationsPanel | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/NotificationsPanel.tsx` | `/Users/jamiecraik/chatui/packages/ui/src/app/settings/NotificationsPanel/NotificationsPanel.tsx` | 0.82 | 3 |
| personalization-panel | PersonalizationPanel | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/PersonalizationPanel.tsx` | `/Users/jamiecraik/chatui/packages/ui/src/app/settings/PersonalizationPanel/PersonalizationPanel.tsx` | 0.85 | 3 |
| model-selector | ModelSelectorDemo | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/ModelSelectorDemo.tsx` | `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/ModelSelectorDemo/ModelSelectorDemo.tsx` | 0.89 | 3 |
| archived-chats-panel | ArchivedChatsPanel | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/ArchivedChatsPanel.tsx` | `/Users/jamiecraik/chatui/packages/ui/src/app/settings/ArchivedChatsPanel/ArchivedChatsPanel.tsx` | 0.92 | 3 |
| settings-modal | SettingsModalDemo | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/SettingsModalDemo.tsx` | `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/SettingsModalDemo/SettingsModalDemo.tsx` | 0.92 | 7 |
| icon-catalog | ChatGPTIconCatalog | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/icons/ChatGPTIconCatalog.tsx` | `/Users/jamiecraik/chatui/packages/ui/src/templates/ChatGPTIconCatalog/ChatGPTIconCatalog.tsx` | 0.93 | 2 |
| discovery-settings-modal | DiscoverySettingsModalDemo | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/DiscoverySettingsModalDemo.tsx` | `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/DiscoverySettingsModalDemo/DiscoverySettingsModalDemo.tsx` | 0.97 | 3 |
| template-shell | TemplateShellDemo | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/TemplateShellDemo.tsx` | `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/TemplateShellDemo/TemplateShellDemo.tsx` | 0.98 | 2 |
| icon-picker-modal | IconPickerModalDemo | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/IconPickerModalDemo.tsx` | `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/IconPickerModalDemo/IconPickerModalDemo.tsx` | 0.99 | 3 |
| setting-dropdown-block | SettingDropdownBlockDemo | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/SettingDropdownBlockDemo.tsx` | `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/SettingDropdownBlockDemo/SettingDropdownBlockDemo.tsx` | 0.99 | 2 |
| template-footer-bar | TemplateFooterBarDemo | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/TemplateFooterBarDemo.tsx` | `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/TemplateFooterBarDemo/TemplateFooterBarDemo.tsx` | 0.99 | 2 |
| template-form-field | TemplateFormFieldDemo | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/TemplateFormFieldDemo.tsx` | `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/TemplateFormFieldDemo/TemplateFormFieldDemo.tsx` | 0.99 | 2 |
| template-header-bar | TemplateHeaderBarDemo | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/TemplateHeaderBarDemo.tsx` | `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/TemplateHeaderBarDemo/TemplateHeaderBarDemo.tsx` | 0.99 | 2 |
| chat-input | ChatInputDemo | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/ChatInputDemo.tsx` | `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/ChatInputDemo/ChatInputDemo.tsx` | 0.99 | 6 |
| template-field-group | TemplateFieldGroupDemo | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/TemplateFieldGroupDemo.tsx` | `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/TemplateFieldGroupDemo/TemplateFieldGroupDemo.tsx` | 0.99 | 2 |
| setting-row-block | SettingRowBlockDemo | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/SettingRowBlockDemo.tsx` | `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/SettingRowBlockDemo/SettingRowBlockDemo.tsx` | 0.99 | 2 |
| chat-header | ChatHeaderDemo | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/ChatHeaderDemo.tsx` | `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/ChatHeaderDemo/ChatHeaderDemo.tsx` | 1.00 | 7 |
| attachment-menu | AttachmentMenuDemo | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/AttachmentMenuDemo.tsx` | `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/AttachmentMenuDemo/AttachmentMenuDemo.tsx` | 1.00 | 3 |
| setting-toggle-block | SettingToggleBlockDemo | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/SettingToggleBlockDemo.tsx` | `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/SettingToggleBlockDemo/SettingToggleBlockDemo.tsx` | 1.00 | 2 |
| design-system-docs | DesignSystemDocs | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/DesignSystemDocs.tsx` | `/Users/jamiecraik/chatui/packages/ui/src/templates/DesignSystemDocs/DesignSystemDocs.tsx` | 1.00 | 3 |
| foundations-showcase | FoundationsShowcase | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/FoundationsShowcase.tsx` | `/Users/jamiecraik/chatui/packages/ui/src/design-system/showcase/FoundationsShowcase.tsx` | 1.00 | 2 |

## Findings

### Low similarity (<0.30) - likely drift
- iconography-showcase (IconographyShowcase) temp `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/IconographyShowcase.tsx` vs `/Users/jamiecraik/chatui/packages/ui/src/design-system/showcase/IconographyShowcase.tsx` similarity 0.16
- new-components-showcase (NewComponentsShowcase) temp `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/templates/NewComponentsShowcase.tsx` vs `/Users/jamiecraik/chatui/packages/ui/src/templates/NewComponentsShowcase/NewComponentsShowcase.tsx` similarity 0.30

## Candidate Matches (manual review)

### iconography-showcase -> IconographyShowcase
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/IconographyShowcase.tsx`
- matches:
  - `/Users/jamiecraik/chatui/packages/ui/src/design-system/showcase/IconographyShowcase.stories.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/design-system/showcase/IconographyShowcase.tsx`

### new-components-showcase -> NewComponentsShowcase
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/templates/NewComponentsShowcase.tsx`
- matches:
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/NewComponentsShowcase/NewComponentsShowcase.tsx`

### color-showcase -> ColorShowcase
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/ColorShowcase.tsx`
- matches:
  - `/Users/jamiecraik/chatui/packages/ui/src/design-system/showcase/ColorShowcase.stories.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/design-system/showcase/ColorShowcase.tsx`

### spacing-showcase -> SpacingShowcase
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SpacingShowcase.tsx`
- matches:
  - `/Users/jamiecraik/chatui/packages/ui/src/design-system/showcase/SpacingShowcase.stories.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/design-system/showcase/SpacingShowcase.tsx`

### typography-showcase -> TypographyShowcase
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/TypographyShowcase.tsx`
- matches:
  - `/Users/jamiecraik/chatui/packages/ui/src/design-system/showcase/TypographyShowcase.stories.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/design-system/showcase/TypographyShowcase.tsx`

### apps-panel -> AppsPanel
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/AppsPanel.tsx`
- matches:
  - `/Users/jamiecraik/chatui/packages/ui/src/app/settings/AppsPanel/AppsPanel.stories.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/app/settings/ManageAppsPanel/ManageAppsPanel.stories.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/app/settings/ManageAppsPanel/ManageAppsPanel.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/AppsPanelTemplate/AppsPanelTemplate.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/ManageAppsPanelTemplate/ManageAppsPanelTemplate.tsx`

### template-panel -> TemplatePanelDemo
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/TemplatePanelDemo.tsx`
- matches:
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/blocks/TemplatePanel/TemplatePanel.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/TemplatePanelDemo/TemplatePanelDemo.tsx`

### security-panel -> SecurityPanel
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SecurityPanel.tsx`
- matches:
  - `/Users/jamiecraik/chatui/packages/ui/src/app/settings/SecurityPanel/SecurityPanel.stories.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/app/settings/SecurityPanel/SecurityPanel.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/SecurityPanelTemplate/SecurityPanelTemplate.tsx`

### data-controls-panel -> DataControlsPanel
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/DataControlsPanel.tsx`
- matches:
  - `/Users/jamiecraik/chatui/packages/ui/src/app/settings/DataControlsPanel/DataControlsPanel.stories.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/app/settings/DataControlsPanel/DataControlsPanel.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/DataControlsPanelTemplate/DataControlsPanelTemplate.tsx`

### manage-apps-panel -> ManageAppsPanel
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/ManageAppsPanel.tsx`
- matches:
  - `/Users/jamiecraik/chatui/packages/ui/src/app/settings/ManageAppsPanel/ManageAppsPanel.stories.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/app/settings/ManageAppsPanel/ManageAppsPanel.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/ManageAppsPanelTemplate/ManageAppsPanelTemplate.tsx`

### notifications-panel -> NotificationsPanel
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/NotificationsPanel.tsx`
- matches:
  - `/Users/jamiecraik/chatui/packages/ui/src/app/settings/NotificationsPanel/NotificationsPanel.stories.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/app/settings/NotificationsPanel/NotificationsPanel.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/NotificationsPanelTemplate/NotificationsPanelTemplate.tsx`

### personalization-panel -> PersonalizationPanel
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/PersonalizationPanel.tsx`
- matches:
  - `/Users/jamiecraik/chatui/packages/ui/src/app/settings/PersonalizationPanel/PersonalizationPanel.stories.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/app/settings/PersonalizationPanel/PersonalizationPanel.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/PersonalizationPanelTemplate/PersonalizationPanelTemplate.tsx`

### model-selector -> ModelSelectorDemo
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/ModelSelectorDemo.tsx`
- matches:
  - `/Users/jamiecraik/chatui/packages/ui/src/components/ui/navigation/ModelSelector/ModelSelector.stories.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/components/ui/navigation/ModelSelector/ModelSelector.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/ModelSelectorDemo/ModelSelectorDemo.tsx`

### archived-chats-panel -> ArchivedChatsPanel
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/ArchivedChatsPanel.tsx`
- matches:
  - `/Users/jamiecraik/chatui/packages/ui/src/app/settings/ArchivedChatsPanel/ArchivedChatsPanel.stories.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/app/settings/ArchivedChatsPanel/ArchivedChatsPanel.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/ArchivedChatsPanelTemplate/ArchivedChatsPanelTemplate.tsx`

### settings-modal -> SettingsModalDemo
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/SettingsModalDemo.tsx`
- matches:
  - `/Users/jamiecraik/chatui/packages/ui/src/app/chat/ChatSidebar/modals/ProjectSettingsModal/ProjectSettingsModal.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/app/modals/DiscoverySettingsModal/DiscoverySettingsModal.stories.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/app/modals/DiscoverySettingsModal/DiscoverySettingsModal.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/app/modals/SettingsModal/SettingsModal.stories.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/app/modals/SettingsModal/SettingsModal.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/DiscoverySettingsModalDemo/DiscoverySettingsModalDemo.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/SettingsModalDemo/SettingsModalDemo.tsx`

### icon-catalog -> ChatGPTIconCatalog
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/icons/ChatGPTIconCatalog.tsx`
- matches:
  - `/Users/jamiecraik/chatui/packages/ui/src/icons/ChatGPTIconCatalog.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/ChatGPTIconCatalog/ChatGPTIconCatalog.tsx`

### discovery-settings-modal -> DiscoverySettingsModalDemo
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/DiscoverySettingsModalDemo.tsx`
- matches:
  - `/Users/jamiecraik/chatui/packages/ui/src/app/modals/DiscoverySettingsModal/DiscoverySettingsModal.stories.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/app/modals/DiscoverySettingsModal/DiscoverySettingsModal.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/DiscoverySettingsModalDemo/DiscoverySettingsModalDemo.tsx`

### template-shell -> TemplateShellDemo
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/TemplateShellDemo.tsx`
- matches:
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/blocks/TemplateShell/TemplateShell.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/TemplateShellDemo/TemplateShellDemo.tsx`

### icon-picker-modal -> IconPickerModalDemo
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/IconPickerModalDemo.tsx`
- matches:
  - `/Users/jamiecraik/chatui/packages/ui/src/app/modals/IconPickerModal/IconPickerModal.stories.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/app/modals/IconPickerModal/IconPickerModal.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/IconPickerModalDemo/IconPickerModalDemo.tsx`

### setting-dropdown-block -> SettingDropdownBlockDemo
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/SettingDropdownBlockDemo.tsx`
- matches:
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/blocks/SettingDropdownBlock/SettingDropdownBlock.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/SettingDropdownBlockDemo/SettingDropdownBlockDemo.tsx`

### template-footer-bar -> TemplateFooterBarDemo
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/TemplateFooterBarDemo.tsx`
- matches:
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/blocks/TemplateFooterBar/TemplateFooterBar.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/TemplateFooterBarDemo/TemplateFooterBarDemo.tsx`

### template-form-field -> TemplateFormFieldDemo
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/TemplateFormFieldDemo.tsx`
- matches:
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/blocks/TemplateFormField/TemplateFormField.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/TemplateFormFieldDemo/TemplateFormFieldDemo.tsx`

### template-header-bar -> TemplateHeaderBarDemo
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/TemplateHeaderBarDemo.tsx`
- matches:
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/blocks/TemplateHeaderBar/TemplateHeaderBar.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/TemplateHeaderBarDemo/TemplateHeaderBarDemo.tsx`

### chat-input -> ChatInputDemo
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/ChatInputDemo.tsx`
- matches:
  - `/Users/jamiecraik/chatui/packages/ui/src/app/chat/ChatInput/ChatInput.stories.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/app/chat/ChatInput/ChatInput.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/ChatInputTemplate/ChatInputTemplate.figmaConnect.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/ChatInputTemplate/ChatInputTemplate.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/blocks/ChatInputBlock/ChatInputBlock.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/ChatInputDemo/ChatInputDemo.tsx`

### template-field-group -> TemplateFieldGroupDemo
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/TemplateFieldGroupDemo.tsx`
- matches:
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/blocks/TemplateFieldGroup/TemplateFieldGroup.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/TemplateFieldGroupDemo/TemplateFieldGroupDemo.tsx`

### setting-row-block -> SettingRowBlockDemo
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/SettingRowBlockDemo.tsx`
- matches:
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/blocks/SettingRowBlock/SettingRowBlock.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/SettingRowBlockDemo/SettingRowBlockDemo.tsx`

### chat-header -> ChatHeaderDemo
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/ChatHeaderDemo.tsx`
- matches:
  - `/Users/jamiecraik/chatui/packages/ui/src/app/chat/ChatHeader/ChatHeader.stories.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/app/chat/ChatHeader/ChatHeader.test.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/app/chat/ChatHeader/ChatHeader.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/ChatHeaderTemplate/ChatHeaderTemplate.figmaConnect.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/ChatHeaderTemplate/ChatHeaderTemplate.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/blocks/ChatHeaderBlock/ChatHeaderBlock.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/ChatHeaderDemo/ChatHeaderDemo.tsx`

### attachment-menu -> AttachmentMenuDemo
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/AttachmentMenuDemo.tsx`
- matches:
  - `/Users/jamiecraik/chatui/packages/ui/src/app/chat/AttachmentMenu/AttachmentMenu.stories.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/app/chat/AttachmentMenu/AttachmentMenu.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/AttachmentMenuDemo/AttachmentMenuDemo.tsx`

### setting-toggle-block -> SettingToggleBlockDemo
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/SettingToggleBlockDemo.tsx`
- matches:
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/blocks/SettingToggleBlock/SettingToggleBlock.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/SettingToggleBlockDemo/SettingToggleBlockDemo.tsx`

### design-system-docs -> DesignSystemDocs
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/DesignSystemDocs.tsx`
- matches:
  - `/Users/jamiecraik/chatui/packages/ui/src/design-system/showcase/DesignSystemDocs.stories.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/design-system/showcase/DesignSystemDocs.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/templates/DesignSystemDocs/DesignSystemDocs.tsx`

### foundations-showcase -> FoundationsShowcase
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/FoundationsShowcase.tsx`
- matches:
  - `/Users/jamiecraik/chatui/packages/ui/src/design-system/showcase/FoundationsShowcase.stories.tsx`
  - `/Users/jamiecraik/chatui/packages/ui/src/design-system/showcase/FoundationsShowcase.tsx`
