# Template Drift (Code-Level)

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


Comparison source: `_temp/ChatGPT UI Templates (1)` vs `packages/ui/src`

## new-components-showcase
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/templates/NewComponentsShowcase.tsx`
- best match: `/Users/jamiecraik/chatui/packages/ui/src/templates/NewComponentsShowcase/NewComponentsShowcase.tsx`
- similarity: 0.30
- class tokens added (top): ../../components/ui, ../../design-system/showcase/docs/CodeBlock, h-4, w-2/3, w-5/6, pt-6
- class tokens removed (top): ../ui/alert, ../ui/code-block, ../ui/empty-message, ../ui/indicator, ../ui/shimmer-text, ../ui/segmented-control, ../ui/tag-input, ../ui/date-picker, ../ui/date-range-picker, ../ui/select-control, ../ui/menu, ../ui/text-link, ../ui/image, ../ui/markdown, ../ui/transition, ../ui/button, lucide-react, react-day-picker, -, ---, space-y-6, text-lg, font-medium, border-foundation-text-dark-primary/10

## foundations-showcase
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/FoundationsShowcase.tsx`
- best match: `/Users/jamiecraik/chatui/packages/ui/src/design-system/showcase/FoundationsShowcase.tsx`
- similarity: 0.94
- class tokens added (top): 0l5.843-3.369v2.332a.08, 4.135l-2.02-1.164a.08
- class tokens removed (top): 0l5.843-3.369v2.332a.08.08, 4.135l-2.02-1.164a.08.08

## design-system-docs
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/DesignSystemDocs.tsx`
- best match: `/Users/jamiecraik/chatui/packages/ui/src/templates/DesignSystemDocs/DesignSystemDocs.tsx`
- similarity: 0.98
- class tokens added (top): ../../utils/clipboard, ../../icons/ChatGPTIcons, ../../components/ui/utils, text-accent-foreground
- class tokens removed (top): ../utils/clipboard, ./icons/ChatGPTIcons, ./ui/utils, text-white

## color-showcase
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/ColorShowcase.tsx`
- best match: `/Users/jamiecraik/chatui/packages/ui/src/design-system/showcase/ColorShowcase.tsx`
- similarity: 0.20
- class tokens added (top): ../../components/ui/utils, ./colors/icons, ./colors/ColorGroup, ./colors/CSSVariableSwatch, ./colors/Toast, max-w-6xl, sm:items-center, text-xl, gap-1, p-1, py-2, space-y-4
- class tokens removed (top): ../utils/clipboard, ./ui/utils, 01-2-2V6a2, 012-2h8a2, 2v2m-6, 002-2v-8a2, 00-2-2h-8a2, 00-2, 01-4-4V5a2, 012-2h4a2, 01-4, 002-2v-4a2, 00-2-2h-2.343M11, 7.343l1.657-1.657a2, 2.828l-8.486, 12h16m-7, 17v4m-2-2h4m5-16l2.286, 12l-5.714, 21l-2.286-6.857L5, 12l5.714-2.143L13, 012-2h2a2, 01-2, 01-2-2V6zM14, 2h-2a2

## typography-showcase
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/TypographyShowcase.tsx`
- best match: `/Users/jamiecraik/chatui/packages/ui/src/design-system/showcase/TypographyShowcase.tsx`
- similarity: 0.25
- class tokens added (top): ../../components/ui/utils, ./typography/icons, ./typography/FontFamilyCard, ./typography/Toast, ./typography/TypeStyleCard, max-w-6xl, sm:items-center, p-1, py-1.5, size-3.5, mb-1
- class tokens removed (top): ../utils/clipboard, ../design-tokens, ./ui/utils, 01-2-2V6a2, 012-2h8a2, 2v2m-6, 002-2v-8a2, 00-2-2h-8a2, 00-2, 12h16m-7, 20l4-16m4, 4-4, 16l-4-4, 11-6, 7-1.274, 4.057-5.064, 7-9.542, 7-4.477, 0-8.268-2.943-9.542-7z, 002-2V7a2, 00-2-2h-2M9, 002-2M9, 012-2h2a2, bottom-8

## spacing-showcase
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SpacingShowcase.tsx`
- best match: `/Users/jamiecraik/chatui/packages/ui/src/design-system/showcase/SpacingShowcase.tsx`
- similarity: 0.28
- class tokens added (top): ../../components/ui/utils, ./spacing/icons, ./spacing/SpacingCard, ./spacing/ScaleDisplay, ./spacing/UsageExamples, bottom-6, left-1/2, -translate-x-1/2, z-50, px-4, py-3, shadow-lg, border-foundation-bg-dark-3, gap-3, transition-all, duration-300, opacity-100, translate-y-0, opacity-0, translate-y-4, pointer-events-none, size-8, rounded-full, bg-foundation-accent-green/10
- class tokens removed (top): ../constants, border-foundation-text-dark-primary/10, bg-foundation-accent-blue, space-y-12, mb-2, text-body-small, lg:grid-cols-3, p-6, bg-foundation-accent-green, container-padding, mb-1, component-gap, border-radius, bg-foundation-accent-purple, text-foundation-accent-blue, space-y-3, w-32

## iconography-showcase
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/IconographyShowcase.tsx`
- best match: `/Users/jamiecraik/chatui/packages/ui/src/design-system/showcase/IconographyShowcase.tsx`
- similarity: 0.09
- class tokens added (top): ../../icons/ChatGPTIcons, min-h-screen, p-8, max-w-6xl, space-y-10, text-[12px], tracking-[-0.32px], text-[36px], leading-[40px], tracking-[-0.1px], text-[14px], leading-[20px], mt-2, text-[18px], leading-[26px], tracking-[-0.45px], text-[13px], leading-[18px], mb-6, justify-between, text-[11px]
- class tokens removed (top): ../utils/clipboard, ./icons/ChatGPTIcons, ./ui/utils, 21l-6-6m2-5a7, 11-14, 17v4m-2-2h4m5-16l2.286, 12l-5.714, 21l-2.286-6.857L5, 12l5.714-2.143L13, 012-2h2a2, 01-2, 01-2-2V6zM14, 2h-2a2, 01-2-2V6zM4, 01-2-2v-2zM14, 01-2-2v-2z, bottom-8, left-1/2, -translate-x-1/2, z-50, px-5, py-3.5, shadow-2xl, bg-foundation-bg-dark-2/95
- css vars added: foundation-bg-light-1, foundation-bg-light-2, foundation-text-light-primary, foundation-text-light-secondary, foundation-text-light-tertiary
- css vars removed: none

## icon-catalog
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/icons/ChatGPTIconCatalog.tsx`
- best match: `/Users/jamiecraik/chatui/packages/ui/src/templates/ChatGPTIconCatalog/ChatGPTIconCatalog.tsx`
- similarity: 0.75
- class tokens added (top): ../../icons/ChatGPTIcons, bg-foundation-bg-dark-1, p-8, text-foundation-text-dark-primary, text-foundation-text-dark-secondary, border-foundation-divider-dark, bg-foundation-bg-dark-2, icon-search, focus-foundation-accent-dark-green, :, text-foundation-icon-dark-primary, text-foundation-accent-dark-green, text-foundation-text-dark-tertiary
- class tokens removed (top): ./ChatGPTIcons, ../../design-tokens, --tw-ring-color, ./icons/ChatGPTIcons

## template-shell
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/TemplateShellDemo.tsx`
- best match: `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/TemplateShellDemo/TemplateShellDemo.tsx`
- similarity: 0.94
- class tokens added (top): ../../blocks/TemplateShell, text-accent-foreground
- class tokens removed (top): ../TemplateShell, text-white

## template-panel
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/TemplatePanelDemo.tsx`
- best match: `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/TemplatePanelDemo/TemplatePanelDemo.tsx`
- similarity: 0.85
- class tokens added (top): ../../blocks/TemplatePanel, p-1.5, hover:bg-foundation-bg-light-3, dark:hover:bg-foundation-bg-dark-3, text-accent-foreground, gap-3, size-5, flex-col, py-6
- class tokens removed (top): ../TemplatePanel, text-white, size-12, -, to:

## template-header-bar
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/TemplateHeaderBarDemo.tsx`
- best match: `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/TemplateHeaderBarDemo/TemplateHeaderBarDemo.tsx`
- similarity: 0.96
- class tokens added (top): ../../blocks/TemplateHeaderBar
- class tokens removed (top): ../TemplateHeaderBar

## template-form-field
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/TemplateFormFieldDemo.tsx`
- best match: `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/TemplateFormFieldDemo/TemplateFormFieldDemo.tsx`
- similarity: 0.97
- class tokens added (top): ../../blocks/TemplateFormField
- class tokens removed (top): ../TemplateFormField

## template-footer-bar
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/TemplateFooterBarDemo.tsx`
- best match: `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/TemplateFooterBarDemo/TemplateFooterBarDemo.tsx`
- similarity: 0.96
- class tokens added (top): ../../blocks/TemplateFooterBar
- class tokens removed (top): ../TemplateFooterBar

## template-field-group
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/TemplateFieldGroupDemo.tsx`
- best match: `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/TemplateFieldGroupDemo/TemplateFieldGroupDemo.tsx`
- similarity: 0.95
- class tokens added (top): ../../blocks/TemplateFieldGroup, ../../blocks/TemplateFormField
- class tokens removed (top): ../TemplateFieldGroup, ../TemplateFormField

## setting-toggle-block
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/SettingToggleBlockDemo.tsx`
- best match: `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/SettingToggleBlockDemo/SettingToggleBlockDemo.tsx`
- similarity: 0.96
- class tokens added (top): ../../blocks/SettingToggleBlock
- class tokens removed (top): ../SettingToggleBlock

## setting-row-block
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/SettingRowBlockDemo.tsx`
- best match: `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/SettingRowBlockDemo/SettingRowBlockDemo.tsx`
- similarity: 0.97
- class tokens added (top): ../../blocks/SettingRowBlock
- class tokens removed (top): ../SettingRowBlock

## setting-dropdown-block
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/SettingDropdownBlockDemo.tsx`
- best match: `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/SettingDropdownBlockDemo/SettingDropdownBlockDemo.tsx`
- similarity: 0.94
- class tokens added (top): ../../blocks/SettingDropdownBlock, ../../blocks/SettingRowBlock
- class tokens removed (top): ../SettingDropdownBlock, ../SettingRowBlock

## chat-header
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/ChatHeaderDemo.tsx`
- best match: `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/ChatHeaderDemo/ChatHeaderDemo.tsx`
- similarity: 0.97
- class tokens added (top): ../../../app/chat/ChatHeader
- class tokens removed (top): ../ChatHeader

## model-selector
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/ModelSelectorDemo.tsx`
- best match: `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/ModelSelectorDemo/ModelSelectorDemo.tsx`
- similarity: 0.97
- class tokens added (top): ../../../components/ui/navigation/ModelSelector
- class tokens removed (top): ../ModelSelector

## chat-input
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/ChatInputDemo.tsx`
- best match: `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/ChatInputDemo/ChatInputDemo.tsx`
- similarity: 0.96
- class tokens added (top): ../../../app/chat/ChatInput
- class tokens removed (top): ../ChatInput

## attachment-menu
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/AttachmentMenuDemo.tsx`
- best match: `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/AttachmentMenuDemo/AttachmentMenuDemo.tsx`
- similarity: 0.98
- class tokens added (top): ../../../app/chat/AttachmentMenu
- class tokens removed (top): ../AttachmentMenu

## icon-picker-modal
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/IconPickerModalDemo.tsx`
- best match: `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/IconPickerModalDemo/IconPickerModalDemo.tsx`
- similarity: 0.94
- class tokens added (top): ../../../app/modals/IconPickerModal, ../../../icons/ChatGPTIcons, text-accent-foreground
- class tokens removed (top): ../IconPickerModal, ../icons/ChatGPTIcons, text-white

## discovery-settings-modal
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/DiscoverySettingsModalDemo.tsx`
- best match: `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/DiscoverySettingsModalDemo/DiscoverySettingsModalDemo.tsx`
- similarity: 0.89
- class tokens added (top): ../../../app/modals/DiscoverySettingsModal, text-accent-foreground
- class tokens removed (top): ../DiscoverySettingsModal, text-white

## settings-modal
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/SettingsModalDemo.tsx`
- best match: `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/SettingsModalDemo/SettingsModalDemo.tsx`
- similarity: 0.71
- class tokens added (top): ../../../app/modals/SettingsModal
- class tokens removed (top): ../SettingsModal

## personalization-panel
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/PersonalizationPanel.tsx`
- best match: `/Users/jamiecraik/chatui/packages/ui/src/app/settings/PersonalizationPanel/PersonalizationPanel.tsx`
- similarity: 0.35
- class tokens added (top): ../../../icons/ChatGPTIcons, ../SettingDropdown, ../SettingToggle, ../shared/types, border-foundation-text-light-primary/10, dark:border-foundation-text-dark-primary/10, bg-foundation-accent-red, hover:bg-foundation-accent-red/80, bg-foundation-accent-orange, bg-foundation-accent-green, hover:bg-foundation-bg-dark-3, text-foundation-icon-light-primary, dark:text-foundation-icon-dark-primary, text-heading-3, text-foundation-text-dark-primary, mb-6, text-body-small, text-caption, text-foundation-text-dark-tertiary, hover:bg-foundation-bg-light-2, dark:hover:bg-foundation-bg-dark-2, text-foundation-icon-light-secondary, dark:text-foundation-icon-dark-secondary, text-foundation-icon-light-tertiary
- class tokens removed (top): ./icons/ChatGPTIcons, ./SettingDropdown, ./SettingToggle, ./SettingRow, ./types, text-[18px], leading-[26px], tracking-[-0.45px], mb-5, text-[14px], leading-[20px], tracking-[-0.3px], text-[13px], leading-[18px], tracking-[-0.32px], py-2, resize-none, focus:outline-none, focus:ring-1, transition-all
- css vars added: none
- css vars removed: foundation-text-dark-primary, foundation-accent-red, foundation-accent-orange, foundation-accent-green, foundation-bg-dark-3, foundation-icon-dark-primary, foundation-text-dark-tertiary, foundation-bg-dark-2, foundation-icon-dark-secondary, foundation-icon-dark-tertiary

## apps-panel
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/AppsPanel.tsx`
- best match: `/Users/jamiecraik/chatui/packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx`
- similarity: 0.46
- class tokens added (top): ../../../icons/ChatGPTIcons, ../shared/types, text-foundation-text-light-primary, text-foundation-text-dark-primary, text-caption, border-foundation-text-dark-primary/10, bg-foundation-accent-red, hover:bg-foundation-accent-red/80, bg-foundation-accent-orange, bg-foundation-accent-green, hover:bg-foundation-bg-dark-3, text-foundation-icon-dark-primary, text-heading-3, text-body-small, hover:bg-foundation-bg-dark-2, text-foundation-icon-dark-tertiary, text-foundation-text-dark-tertiary, decoration-foundation-accent-blue, underline-offset-2, hover:decoration-foundation-accent-blue/70, bg-foundation-bg-dark-3, text-foundation-icon-dark-secondary
- class tokens removed (top): ./icons/ChatGPTIcons, ./types, flex-shrink-0, text-white, text-[11px], text-[18px], leading-[26px], tracking-[-0.45px], text-[14px], leading-[20px], tracking-[-0.3px], text-[13px], leading-[18px], tracking-[-0.32px], hover:underline
- css vars added: none
- css vars removed: foundation-text-dark-primary, foundation-accent-red, foundation-accent-orange, foundation-accent-green, foundation-bg-dark-3, foundation-icon-dark-primary, foundation-bg-dark-2, foundation-icon-dark-tertiary, foundation-text-dark-tertiary, foundation-accent-blue, foundation-icon-dark-secondary

## archived-chats-panel
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/ArchivedChatsPanel.tsx`
- best match: `/Users/jamiecraik/chatui/packages/ui/src/app/settings/ArchivedChatsPanel/ArchivedChatsPanel.tsx`
- similarity: 0.54
- class tokens added (top): ../../../icons/ChatGPTIcons, ../shared/types, border-foundation-text-dark-primary/10, bg-foundation-accent-red, hover:bg-foundation-accent-red/80, bg-foundation-accent-orange, bg-foundation-accent-green, hover:bg-foundation-bg-dark-3, text-foundation-icon-dark-primary, text-heading-3, text-foundation-text-dark-primary, text-foundation-icon-dark-tertiary, bg-foundation-bg-dark-2, border-foundation-bg-dark-3, text-body-small, placeholder:text-foundation-text-dark-tertiary, focus:ring-2, focus:ring-foundation-accent-blue/50, focus:border-foundation-accent-blue, text-caption, text-foundation-text-dark-tertiary, hover:bg-foundation-bg-dark-2
- class tokens removed (top): ./icons/ChatGPTIcons, ./types, text-[18px], leading-[26px], tracking-[-0.45px], border-white/10, text-[14px], focus:ring-1, focus:ring-white/20, text-[13px], leading-[18px], tracking-[-0.32px], leading-[20px], tracking-[-0.3px]
- css vars added: none
- css vars removed: foundation-text-dark-primary, foundation-accent-red, foundation-accent-orange, foundation-accent-green, foundation-bg-dark-3, foundation-icon-dark-primary, foundation-icon-dark-tertiary, foundation-bg-dark-2, foundation-text-dark-tertiary

## data-controls-panel
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/DataControlsPanel.tsx`
- best match: `/Users/jamiecraik/chatui/packages/ui/src/app/settings/DataControlsPanel/DataControlsPanel.tsx`
- similarity: 0.33
- class tokens added (top): ../../../icons/ChatGPTIcons, ../shared/types, border-foundation-text-dark-primary/10, bg-foundation-accent-red, hover:bg-foundation-accent-red/80, bg-foundation-accent-orange, bg-foundation-accent-green, hover:bg-foundation-bg-dark-3, text-foundation-icon-dark-primary, text-heading-3, text-foundation-text-dark-primary, justify-between, py-2.5, text-body-small, inline-flex, h-5, w-9, :, inline-block, bg-foundation-bg-light-1, transition-transform, text-caption, text-foundation-text-dark-tertiary, decoration-foundation-accent-blue
- class tokens removed (top): ./icons/ChatGPTIcons, ./SettingToggle, ./SettingRow, ./types, text-[18px], leading-[26px], tracking-[-0.45px], text-[13px], leading-[18px], tracking-[-0.32px], text-[14px], leading-[20px], tracking-[-0.3px], text-white
- css vars added: none
- css vars removed: foundation-text-dark-primary, foundation-accent-red, foundation-accent-orange, foundation-accent-green, foundation-bg-dark-3, foundation-icon-dark-primary, foundation-text-dark-tertiary, foundation-accent-blue

## manage-apps-panel
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/ManageAppsPanel.tsx`
- best match: `/Users/jamiecraik/chatui/packages/ui/src/app/settings/ManageAppsPanel/ManageAppsPanel.tsx`
- similarity: 0.43
- class tokens added (top): ../../../icons/ChatGPTIcons, ../shared/types, border-foundation-text-dark-primary/10, bg-foundation-accent-red, hover:bg-foundation-accent-red/80, bg-foundation-accent-orange, bg-foundation-accent-green, hover:bg-foundation-bg-dark-3, text-foundation-icon-dark-primary, text-heading-3, text-foundation-text-dark-primary, text-body-small, text-caption, text-foundation-text-dark-tertiary, hover:bg-foundation-bg-dark-2, text-foundation-accent-green, text-foundation-text-dark-secondary, text-foundation-icon-dark-tertiary
- class tokens removed (top): ./icons/ChatGPTIcons, ./types, size-5, justify-center, flex-shrink-0, text-white, text-[11px], text-[18px], leading-[26px], tracking-[-0.45px], text-[14px], leading-[20px], tracking-[-0.3px], text-[13px], leading-[18px], tracking-[-0.32px], text-[12px], leading-[16px]
- css vars added: none
- css vars removed: foundation-text-dark-primary, foundation-accent-red, foundation-accent-orange, foundation-accent-green, foundation-bg-dark-3, foundation-icon-dark-primary, foundation-text-dark-tertiary, foundation-bg-dark-2, foundation-text-dark-secondary, foundation-icon-dark-tertiary

## notifications-panel
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/NotificationsPanel.tsx`
- best match: `/Users/jamiecraik/chatui/packages/ui/src/app/settings/NotificationsPanel/NotificationsPanel.tsx`
- similarity: 0.34
- class tokens added (top): ../../../icons/ChatGPTIcons, ../shared/types, border-foundation-text-dark-primary/10, bg-foundation-accent-red, hover:bg-foundation-accent-red/80, bg-foundation-accent-orange, bg-foundation-accent-green, hover:bg-foundation-bg-dark-3, text-foundation-icon-dark-primary, text-heading-3, text-foundation-text-dark-primary, w-full, justify-between, px-3, py-2.5, hover:bg-foundation-bg-dark-2, rounded-lg, text-body-small, text-foundation-text-dark-secondary, text-foundation-icon-dark-tertiary
- class tokens removed (top): ./icons/ChatGPTIcons, ./SettingRow, ./types, text-[18px], leading-[26px], tracking-[-0.45px], text-[14px], leading-[20px], tracking-[-0.3px]
- css vars added: none
- css vars removed: foundation-text-dark-primary, foundation-accent-red, foundation-accent-orange, foundation-accent-green, foundation-bg-dark-3, foundation-icon-dark-primary, foundation-text-dark-secondary, foundation-icon-dark-tertiary

## security-panel
- _temp: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SecurityPanel.tsx`
- best match: `/Users/jamiecraik/chatui/packages/ui/src/app/settings/SecurityPanel/SecurityPanel.tsx`
- similarity: 0.28
- class tokens added (top): ../../../icons/ChatGPTIcons, ../shared/types, border-foundation-text-dark-primary/10, bg-foundation-accent-red, hover:bg-foundation-accent-red/80, bg-foundation-accent-orange, bg-foundation-accent-green, hover:bg-foundation-bg-dark-3, text-foundation-icon-dark-primary, text-heading-3, text-foundation-text-dark-primary, justify-between, py-2.5, text-body-small, font-normal, inline-flex, h-5, w-9, :, inline-block, bg-foundation-bg-light-1, transition-transform, text-caption, text-foundation-text-dark-tertiary
- class tokens removed (top): ./icons/ChatGPTIcons, ./SettingToggle, ./types, text-[18px], leading-[26px], tracking-[-0.45px], Multi-factor, text-[13px], leading-[18px], tracking-[-0.32px], hover:underline
- css vars added: none
- css vars removed: foundation-text-dark-primary, foundation-accent-red, foundation-accent-orange, foundation-accent-green, foundation-bg-dark-3, foundation-icon-dark-primary, foundation-text-dark-tertiary, foundation-accent-blue

