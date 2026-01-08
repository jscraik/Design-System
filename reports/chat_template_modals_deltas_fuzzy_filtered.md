# Chat/Template/Compose/Modals Delta Report (Fuzzy, Filtered)

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


Scope: `Chat*.tsx`, `*Template*.tsx`, `ComposeView.tsx`, and `packages/ui/src/app/modals/**/*.tsx`
Match strategy: semantic token Jaccard over entire _temp TSX corpus.
Filter: only matches with similarity >= 0.30 (lower scores are likely false matches).

| File (packages/ui) | Best _temp match | Similarity |
|---|---|---:|
| `/Users/jamiecraik/chatui/packages/ui/src/templates/SettingsPanelsTemplate/SettingsPanelsTemplate.stories.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SettingsModal.stories.tsx` | 0.30 |
| `/Users/jamiecraik/chatui/packages/ui/src/templates/ChatSidebarTemplate/ChatSidebarTemplate.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/SettingsModalDemo.tsx` | 0.30 |
| `/Users/jamiecraik/chatui/packages/ui/src/templates/blocks/ChatHeaderBlock/ChatHeaderBlock.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/ui/aspect-ratio.tsx` | 0.31 |
| `/Users/jamiecraik/chatui/packages/ui/src/templates/blocks/ChatInputBlock/ChatInputBlock.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/ui/aspect-ratio.tsx` | 0.31 |
| `/Users/jamiecraik/chatui/packages/ui/src/templates/blocks/ChatMessagesBlock/ChatMessagesBlock.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/ui/aspect-ratio.tsx` | 0.31 |
| `/Users/jamiecraik/chatui/packages/ui/src/templates/blocks/ChatSidebarBlock/ChatSidebarBlock.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/ui/aspect-ratio.tsx` | 0.31 |
| `/Users/jamiecraik/chatui/packages/ui/src/app/chat/ChatSidebar/modals/ProjectSettingsModal/ProjectSettingsModal.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/TemplatePreview.tsx` | 0.32 |
| `/Users/jamiecraik/chatui/packages/ui/src/icons/ChatGPTIconCatalog.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SettingRow.tsx` | 0.32 |
| `/Users/jamiecraik/chatui/packages/ui/src/templates/TemplatesGallery/TemplatesGallery.stories.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/App.tsx` | 0.32 |
| `/Users/jamiecraik/chatui/packages/ui/src/app/modals/settings/SpeechSection/SpeechSection.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SettingRow.tsx` | 0.32 |
| `/Users/jamiecraik/chatui/packages/ui/src/app/chat/ChatInput/ChatInput.stories.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SettingsModal.stories.tsx` | 0.33 |
| `/Users/jamiecraik/chatui/packages/ui/src/templates/ChatBlocksTemplate/ChatBlocksTemplate.stories.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SettingsModal.stories.tsx` | 0.33 |
| `/Users/jamiecraik/chatui/packages/ui/src/app/modals/settings/WorkWithAppsSection/WorkWithAppsSection.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/TemplateCard.tsx` | 0.34 |
| `/Users/jamiecraik/chatui/packages/ui/src/app/modals/SettingsModal/SettingsModal.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SettingsModal.tsx` | 0.35 |
| `/Users/jamiecraik/chatui/packages/ui/src/app/chat/ChatSidebar/components/ChatSidebarQuickActions/ChatSidebarQuickActions.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SettingRow.tsx` | 0.35 |
| `/Users/jamiecraik/chatui/packages/ui/src/app/modals/settings/AppSection/AppSection.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SettingDropdown.tsx` | 0.37 |
| `/Users/jamiecraik/chatui/packages/ui/src/app/modals/settings/ChatBarSection/ChatBarSection.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/TemplateCard.tsx` | 0.37 |
| `/Users/jamiecraik/chatui/packages/ui/src/app/modals/SettingsModal/SettingsModal.stories.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SettingsModal.stories.tsx` | 0.38 |
| `/Users/jamiecraik/chatui/packages/ui/src/templates/ChatTemplate/ChatTemplate.stories.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SettingsModal.stories.tsx` | 0.40 |
| `/Users/jamiecraik/chatui/packages/ui/src/templates/ChatVariantsTemplate/ChatVariantsTemplate.stories.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SettingsModal.stories.tsx` | 0.41 |
| `/Users/jamiecraik/chatui/packages/ui/src/templates/ChatInputTemplate/ChatInputTemplate.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/SettingsModalDemo.tsx` | 0.41 |
| `/Users/jamiecraik/chatui/packages/ui/src/app/chat/ChatInput/ChatInput.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/ChatInput.tsx` | 0.41 |
| `/Users/jamiecraik/chatui/packages/ui/src/app/chat/ChatSidebar/ChatSidebar.stories.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SettingsModal.stories.tsx` | 0.42 |
| `/Users/jamiecraik/chatui/packages/ui/src/templates/ChatMessagesTemplate/ChatMessagesTemplate.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/SettingsModalDemo.tsx` | 0.42 |
| `/Users/jamiecraik/chatui/packages/ui/src/app/modals/IconPickerModal/IconPickerModal.stories.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SettingsModal.stories.tsx` | 0.47 |
| `/Users/jamiecraik/chatui/packages/ui/src/app/chat/ChatMessages/ChatMessages.stories.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SettingsModal.stories.tsx` | 0.48 |
| `/Users/jamiecraik/chatui/packages/ui/src/app/modals/DiscoverySettingsModal/DiscoverySettingsModal.stories.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SettingsModal.stories.tsx` | 0.56 |
| `/Users/jamiecraik/chatui/packages/ui/src/templates/blocks/TemplatePanel/TemplatePanel.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/TemplatePanel.tsx` | 0.58 |
| `/Users/jamiecraik/chatui/packages/ui/src/app/chat/ChatHeader/ChatHeader.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/ChatHeader.tsx` | 0.62 |
| `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/TemplatePanelDemo/TemplatePanelDemo.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/TemplatePanelDemo.tsx` | 0.67 |
| `/Users/jamiecraik/chatui/packages/ui/src/app/modals/DiscoverySettingsModal/DiscoverySettingsModal.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/DiscoverySettingsModal.tsx` | 0.78 |
| `/Users/jamiecraik/chatui/packages/ui/src/app/modals/IconPickerModal/IconPickerModal.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/IconPickerModal.tsx` | 0.79 |
| `/Users/jamiecraik/chatui/packages/ui/src/templates/ChatGPTIconCatalog/ChatGPTIconCatalog.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/icons/ChatGPTIconCatalog.tsx` | 0.93 |
| `/Users/jamiecraik/chatui/packages/ui/src/templates/blocks/TemplateFieldGroup/TemplateFieldGroup.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/TemplateFieldGroup.tsx` | 0.94 |
| `/Users/jamiecraik/chatui/packages/ui/src/templates/blocks/TemplateFormField/TemplateFormField.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/TemplateFormField.tsx` | 0.96 |
| `/Users/jamiecraik/chatui/packages/ui/src/templates/blocks/TemplateFooterBar/TemplateFooterBar.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/TemplateFooterBar.tsx` | 0.97 |
| `/Users/jamiecraik/chatui/packages/ui/src/templates/blocks/TemplateHeaderBar/TemplateHeaderBar.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/TemplateHeaderBar.tsx` | 0.97 |
| `/Users/jamiecraik/chatui/packages/ui/src/templates/blocks/TemplateShell/TemplateShell.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/TemplateShell.tsx` | 0.98 |
| `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/TemplateShellDemo/TemplateShellDemo.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/TemplateShellDemo.tsx` | 0.98 |
| `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/TemplateFooterBarDemo/TemplateFooterBarDemo.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/TemplateFooterBarDemo.tsx` | 0.99 |
| `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/TemplateFormFieldDemo/TemplateFormFieldDemo.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/TemplateFormFieldDemo.tsx` | 0.99 |
| `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/TemplateHeaderBarDemo/TemplateHeaderBarDemo.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/TemplateHeaderBarDemo.tsx` | 0.99 |
| `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/ChatInputDemo/ChatInputDemo.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/ChatInputDemo.tsx` | 0.99 |
| `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/TemplateFieldGroupDemo/TemplateFieldGroupDemo.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/TemplateFieldGroupDemo.tsx` | 0.99 |
| `/Users/jamiecraik/chatui/packages/ui/src/templates/demos/ChatHeaderDemo/ChatHeaderDemo.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/ChatHeaderDemo.tsx` | 1.00 |
| `/Users/jamiecraik/chatui/packages/ui/src/icons/chatgpt/ChatGPTIconsFixed.tsx` | `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/icons/ChatGPTIconsFixed.tsx` | 1.00 |

## Deltas (token/typography/spacing hints)

### /Users/jamiecraik/chatui/packages/ui/src/templates/SettingsPanelsTemplate/SettingsPanelsTemplate.stories.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SettingsModal.stories.tsx`
- similarity: 0.30
- class tokens added (top): ../AppsPanelTemplate, ../ArchivedChatsPanelTemplate, ../AudioSettingsPanelTemplate, ../CheckForUpdatesPanelTemplate, ../DataControlsPanelTemplate, ../ManageAppsPanelTemplate, ../NotificationsPanelTemplate, ../PersonalizationPanelTemplate, ../SecurityPanelTemplate, Components/Templates/Settings/Settings
- class tokens removed (top): ./SettingsModal, ChatUI/SettingsModal, h-screen
- css vars added: none
- css vars removed: foundation-bg-dark-1

### /Users/jamiecraik/chatui/packages/ui/src/templates/ChatSidebarTemplate/ChatSidebarTemplate.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/SettingsModalDemo.tsx`
- similarity: 0.30
- class tokens added (top): ../../fixtures/sample-data, ../blocks/ChatSidebarBlock, min-h-[640px]
- class tokens removed (top): ../SettingsModal, items-center, justify-center, min-h-screen

### /Users/jamiecraik/chatui/packages/ui/src/templates/blocks/ChatHeaderBlock/ChatHeaderBlock.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/ui/aspect-ratio.tsx`
- similarity: 0.31
- class tokens added (top): ../../../app/chat/ChatHeader
- class tokens removed (top): aspect-ratio

### /Users/jamiecraik/chatui/packages/ui/src/templates/blocks/ChatInputBlock/ChatInputBlock.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/ui/aspect-ratio.tsx`
- similarity: 0.31
- class tokens added (top): ../../../app/chat/ChatInput
- class tokens removed (top): aspect-ratio

### /Users/jamiecraik/chatui/packages/ui/src/templates/blocks/ChatMessagesBlock/ChatMessagesBlock.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/ui/aspect-ratio.tsx`
- similarity: 0.31
- class tokens added (top): ../../../app/chat/ChatMessages
- class tokens removed (top): aspect-ratio

### /Users/jamiecraik/chatui/packages/ui/src/templates/blocks/ChatSidebarBlock/ChatSidebarBlock.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/ui/aspect-ratio.tsx`
- similarity: 0.31
- class tokens added (top): ../../../app/chat/ChatSidebar
- class tokens removed (top): aspect-ratio

### /Users/jamiecraik/chatui/packages/ui/src/app/chat/ChatSidebar/modals/ProjectSettingsModal/ProjectSettingsModal.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/TemplatePreview.tsx`
- similarity: 0.32
- class tokens added (top): project-only, bg-foundation-bg-dark-1/70, backdrop-blur-sm, z-[100], bg-secondary, border-border, text-foreground, rounded-2xl, w-[380px], shadow-2xl, pt-6, pb-5, text-body, pb-6, mb-6, text-body-small, text-muted-foreground, mb-3, font-normal, text-left, p-4, rounded-xl, border-2, transition-all
- class tokens removed (top): ../templates/registry, z-50, bg-black/50, max-w-[90vw], max-h-[90vh], flex-col, rounded-t-xl, text-[18px], leading-[26px], tracking-[-0.45px], text-[13px], leading-[18px], tracking-[-0.32px], mt-1, text-[14px], leading-[20px], tracking-[-0.3px], rounded-b-xl, overflow-hidden
- css vars added: accent-green
- css vars removed: foundation-bg-dark-1, foundation-text-dark-primary, foundation-text-dark-tertiary, foundation-bg-dark-2

### /Users/jamiecraik/chatui/packages/ui/src/icons/ChatGPTIconCatalog.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SettingRow.tsx`
- similarity: 0.32
- class tokens added (top): ./chatgpt/ChatGPTIconsFixed, p-8, bg-foundation-bg-dark-1, min-h-screen, text-foundation-text-dark-primary, text-3xl, font-bold, mb-4, text-foundation-text-dark-secondary, mb-8, grid-cols-6, gap-4, p-4, bg-foundation-bg-dark-2, border-foundation-bg-dark-3, hover:border-foundation-accent-blue, flex-col, gap-2, size-6, text-xs, text-foundation-text-dark-tertiary, text-center
- class tokens removed (top): justify-between, px-3, py-2.5, gap-3, min-w-0, flex-1, text-[14px], font-normal, leading-[20px], tracking-[-0.3px], text-[13px], leading-[18px], tracking-[-0.32px], mt-1, flex-shrink-0
- css vars added: none
- css vars removed: foundation-bg-dark-2, foundation-text-dark-primary, foundation-text-dark-tertiary

### /Users/jamiecraik/chatui/packages/ui/src/templates/TemplatesGallery/TemplatesGallery.stories.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/App.tsx`
- similarity: 0.32
- class tokens added (top): ../blocks/registry, ../registry, Components/Templates/Gallery, p-6, mx-auto, max-w-[1400px], flex-col, gap-10, space-y-4, space-y-1, text-lg, overflow-hidden, rounded-2xl, h-[360px], gap-6, md:grid-cols-2, xl:grid-cols-3, min-h-[140px], p-3
- class tokens removed (top): ./templates/registry, design-system, Registry:, Template:, Component:, top-0, left-0, right-0, z-10, bg-foundation-bg-light-2/95, dark:bg-foundation-bg-dark-2/95, backdrop-blur-sm, items-center, justify-between, px-6, py-4, text-xl, text-foundation-text-light-tertiary, dark:text-foundation-text-dark-tertiary, mt-1, gap-3, px-3, py-1.5, bg-foundation-bg-light-3

### /Users/jamiecraik/chatui/packages/ui/src/app/modals/settings/SpeechSection/SpeechSection.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SettingRow.tsx`
- similarity: 0.32
- class tokens added (top): ../../../../icons/ChatGPTIcons, ../../../settings, mb-5, text-body-small, font-semibold, text-foundation-text-dark-primary, mb-2, space-y-0.5, size-4, text-foundation-icon-light-secondary, dark:text-foundation-icon-dark-secondary, gap-2, text-foundation-text-dark-secondary, text-foundation-icon-light-tertiary, dark:text-foundation-icon-dark-tertiary, size-5, rounded-full, bg-foundation-bg-dark-3, justify-center, size-3, py-2, text-caption, text-foundation-text-dark-tertiary
- class tokens removed (top): justify-between, py-2.5, rounded-lg, transition-colors, cursor-pointer, gap-3, min-w-0, flex-1, text-[14px], leading-[20px], tracking-[-0.3px], text-[13px], leading-[18px], tracking-[-0.32px], mt-1, flex-shrink-0, w-full
- css vars added: none
- css vars removed: foundation-bg-dark-2, foundation-text-dark-primary, foundation-text-dark-tertiary

### /Users/jamiecraik/chatui/packages/ui/src/app/chat/ChatInput/ChatInput.stories.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SettingsModal.stories.tsx`
- similarity: 0.33
- class tokens added (top): ./ChatInput, Components/Chat/Chat, min-h-screen, bg-foundation-bg-dark-1, items-end, w-full, bg-foundation-bg-light-1, px-2, py-1, rounded-md, bg-foundation-bg-dark-2, text-foundation-text-dark-secondary, text-xs, hover:bg-foundation-bg-dark-3, transition-colors
- class tokens removed (top): ./SettingsModal, ChatUI/SettingsModal, h-screen
- css vars added: none
- css vars removed: foundation-bg-dark-1

### /Users/jamiecraik/chatui/packages/ui/src/templates/ChatBlocksTemplate/ChatBlocksTemplate.stories.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SettingsModal.stories.tsx`
- similarity: 0.33
- class tokens added (top): ../ChatHeaderTemplate, ../ChatSidebarTemplate, ../ChatMessagesTemplate, ../ChatInputTemplate, Components/Templates/Chat/Chat
- class tokens removed (top): ./SettingsModal, ChatUI/SettingsModal, h-screen
- css vars added: none
- css vars removed: foundation-bg-dark-1

### /Users/jamiecraik/chatui/packages/ui/src/app/modals/settings/WorkWithAppsSection/WorkWithAppsSection.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/TemplateCard.tsx`
- similarity: 0.34
- class tokens added (top): ../../../../icons/ChatGPTIcons, ../../../settings, mb-5, text-body-small, text-foundation-text-dark-primary, mb-2, space-y-0.5, size-4, text-foundation-icon-light-secondary, dark:text-foundation-icon-dark-secondary, items-center, gap-2, font-normal, text-foundation-text-dark-secondary, p-1, hover:bg-foundation-bg-dark-3, rounded-full, transition-colors, size-3, bg-foundation-bg-dark-3, justify-center, text-foundation-icon-light-tertiary, dark:text-foundation-icon-dark-tertiary, px-3
- class tokens removed (top): ../templates/registry, w-full, text-left, p-4, rounded-lg, transition-all, hover:shadow-lg, items-start, justify-between, mb-3, flex-1, text-[16px], leading-[22px], tracking-[-0.4px], mb-1, inline-block, px-2, py-0.5, text-[11px], font-medium, leading-[16px], tracking-[-0.2px], opacity-0, group-hover:opacity-100
- css vars added: none
- css vars removed: foundation-bg-dark-2, foundation-bg-dark-3, foundation-text-dark-primary, foundation-text-dark-secondary, foundation-icon-dark-tertiary, foundation-text-dark-tertiary, foundation-bg-dark-1

### /Users/jamiecraik/chatui/packages/ui/src/app/modals/SettingsModal/SettingsModal.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SettingsModal.tsx`
- similarity: 0.35
- class tokens added (top): ../../../components/ui/overlays/Modal, ../../settings, ../settings, border-foundation-bg-light-3, dark:border-foundation-bg-dark-3, gap-3, gap-2, size-3, bg-foundation-accent-red, hover:bg-foundation-accent-red/80, focus-visible:ring-2, focus-visible:ring-foundation-accent-blue/50, bg-foundation-accent-orange, bg-foundation-accent-green, settings-modal-title, text-heading-3, text-foundation-text-light-primary, overflow-y-auto
- class tokens removed (top): ./icons/ChatGPTIcons, ./settings, ./ui/dropdown-menu, mb-6, text-[14px], leading-[20px], tracking-[-0.3px], text-foundation-text-dark-primary, mb-3, :, inset-0, bg-black/60, backdrop-blur-sm, justify-center, rounded-[16px], w-[560px], shadow-2xl, leading-[26px], tracking-[-0.45px], font-normal, justify-between, px-3, py-2.5, rounded-lg
- css vars added: none
- css vars removed: foundation-bg-dark-1, foundation-text-dark-primary, foundation-accent-red, foundation-accent-orange, foundation-accent-green, foundation-icon-dark-secondary, foundation-text-dark-secondary, foundation-icon-dark-tertiary, foundation-bg-dark-2, foundation-bg-dark-3, foundation-text-dark-tertiary

### /Users/jamiecraik/chatui/packages/ui/src/app/chat/ChatSidebar/components/ChatSidebarQuickActions/ChatSidebarQuickActions.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SettingRow.tsx`
- similarity: 0.35
- class tokens added (top): ../../../../../icons, ../../../shared/types, more/less, space-y-0.5, py-2, bg-muted, hover:bg-muted/80, size-4, text-body-small, hover:bg-muted, text-left, :, hover:opacity-70, transition-opacity
- class tokens removed (top): justify-between, py-2.5, min-w-0, flex-1, text-[14px], leading-[20px], tracking-[-0.3px], text-[13px], leading-[18px], tracking-[-0.32px], mt-1
- css vars added: none
- css vars removed: foundation-bg-dark-2, foundation-text-dark-primary, foundation-text-dark-tertiary

### /Users/jamiecraik/chatui/packages/ui/src/app/modals/settings/AppSection/AppSection.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SettingDropdown.tsx`
- similarity: 0.37
- class tokens added (top): ../../../../icons/ChatGPTIcons, ../../../settings, ../../../../components/ui/overlays/DropdownMenu, mb-5, text-body-small, font-semibold, text-foundation-text-dark-primary, mb-2, space-y-0.5, text-foundation-icon-light-secondary, dark:text-foundation-icon-dark-secondary, text-foundation-text-dark-secondary, hover:bg-foundation-bg-light-2, dark:hover:bg-foundation-bg-dark-2, gap-3, size-5, bg-foundation-bg-dark-3, size-3, min-w-[200px], min-w-[140px], text-foundation-icon-light-tertiary, dark:text-foundation-icon-dark-tertiary
- class tokens removed (top): ./icons/ChatGPTIcons, ./ui/dropdown-menu, text-[14px], leading-[20px], tracking-[-0.3px], size-6, size-3.5, min-w-[270px], flex-1, text-[12px], leading-[16px], tracking-[-0.24px], mt-0.5, ml-2, flex-shrink-0, text-[13px], leading-[18px], tracking-[-0.32px], mt-2
- css vars added: none
- css vars removed: foundation-bg-dark-2, foundation-text-dark-primary, foundation-text-dark-secondary, foundation-bg-dark-3, foundation-icon-dark-secondary, foundation-icon-dark-primary, foundation-text-dark-tertiary

### /Users/jamiecraik/chatui/packages/ui/src/app/modals/settings/ChatBarSection/ChatBarSection.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/TemplateCard.tsx`
- similarity: 0.37
- class tokens added (top): ../../../../icons/ChatGPTIcons, ../../../settings, mb-5, text-body-small, text-foundation-text-dark-primary, mb-2, space-y-0.5, size-4, text-foundation-icon-light-secondary, dark:text-foundation-icon-dark-secondary, items-center, gap-2, font-normal, text-foundation-text-dark-secondary, rounded-full, bg-foundation-bg-dark-3, justify-center, size-3, p-1, hover:bg-foundation-bg-dark-3, transition-colors
- class tokens removed (top): ../templates/registry, w-full, text-left, p-4, rounded-lg, transition-all, hover:shadow-lg, items-start, justify-between, mb-3, flex-1, text-[16px], leading-[22px], tracking-[-0.4px], mb-1, inline-block, px-2, py-0.5, text-[11px], font-medium, leading-[16px], tracking-[-0.2px], opacity-0, group-hover:opacity-100
- css vars added: none
- css vars removed: foundation-bg-dark-2, foundation-bg-dark-3, foundation-text-dark-primary, foundation-text-dark-secondary, foundation-icon-dark-tertiary, foundation-text-dark-tertiary, foundation-bg-dark-1

### /Users/jamiecraik/chatui/packages/ui/src/app/modals/SettingsModal/SettingsModal.stories.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SettingsModal.stories.tsx`
- similarity: 0.38
- class tokens added (top): Components/Modals/Settings, items-center, justify-center, px-4, py-2, rounded-lg, transition-colors, opacity-based
- class tokens removed (top): ChatUI/SettingsModal
- css vars added: foundation-bg-dark-2, foundation-bg-dark-3, foundation-text-dark-primary
- css vars removed: none

### /Users/jamiecraik/chatui/packages/ui/src/templates/ChatTemplate/ChatTemplate.stories.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SettingsModal.stories.tsx`
- similarity: 0.40
- class tokens added (top): ./ChatTemplate, Components/Templates/Chat/Chat
- class tokens removed (top): ./SettingsModal, ChatUI/SettingsModal, h-screen
- css vars added: none
- css vars removed: foundation-bg-dark-1

### /Users/jamiecraik/chatui/packages/ui/src/templates/ChatVariantsTemplate/ChatVariantsTemplate.stories.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SettingsModal.stories.tsx`
- similarity: 0.41
- class tokens added (top): ./ChatVariantsTemplate, Components/Templates/Chat/Chat
- class tokens removed (top): ./SettingsModal, ChatUI/SettingsModal, h-screen
- css vars added: none
- css vars removed: foundation-bg-dark-1

### /Users/jamiecraik/chatui/packages/ui/src/templates/ChatInputTemplate/ChatInputTemplate.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/SettingsModalDemo.tsx`
- similarity: 0.41
- class tokens added (top): ../../fixtures/sample-data, ../blocks/ChatInputBlock, min-h-[140px]
- class tokens removed (top): ../SettingsModal, items-center, justify-center, min-h-screen

### /Users/jamiecraik/chatui/packages/ui/src/app/chat/ChatInput/ChatInput.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/ChatInput.tsx`
- similarity: 0.41
- class tokens added (top): ../../../icons, ../../../components/ui/utils, ../AttachmentMenu, p-4, focus-within:border-foundation-accent-blue/50, focus-within:shadow-foundation-accent-blue/5, bg-foundation-accent-blue/10, text-foundation-accent-blue, leading-[24px], tracking-[-0.32px], focus-visible:ring-foundation-accent-blue, bg-foundation-accent-blue/15, leading-[20px], dark:hover:bg-foundation-bg-dark-4, bg-foundation-accent-red/15, text-foundation-accent-red, bg-foundation-accent-purple-light, dark:bg-foundation-accent-purple, shadow-foundation-accent-purple/25, text-foundation-text-dark-primary, hover:bg-foundation-accent-green-light/90, dark:hover:bg-foundation-accent-green/90
- class tokens removed (top): ./ui/utils, 4.5v15m7.5-7.5h-15, 008.716-6.747M12, 01-8.716-6.747M12, 4.5-4.03, 4.5-9S14.485, 18c-2.485, 0-4.5-4.03-4.5-9S9.515, 00-7.843, 10.5c-2.998, 0-5.74-1.1-7.843-2.918m15.686, .778-.099, 1.533-.284, 16.5c-3.162, 0-6.133-.815-8.716-2.247m0, 12c0-1.605.42-3.113, 1.157-4.418, 12.739l-7.693, 01-6.364-6.364l10.94-10.94A3, 18.32m.009-.01l-.01.01m5.699-9.941l-7.81, 006-6v-1.5m-6, 01-6-6v-1.5m6, 7.5v3.75m-3.75, 01-3-3V4.5a3

### /Users/jamiecraik/chatui/packages/ui/src/app/chat/ChatSidebar/ChatSidebar.stories.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SettingsModal.stories.tsx`
- similarity: 0.42
- class tokens added (top): ../../../fixtures/sample-data, ./ChatSidebar, Components/Chat/Chat, bg-foundation-bg-dark-1
- class tokens removed (top): ./SettingsModal, ChatUI/SettingsModal
- css vars added: none
- css vars removed: foundation-bg-dark-1

### /Users/jamiecraik/chatui/packages/ui/src/templates/ChatMessagesTemplate/ChatMessagesTemplate.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/SettingsModalDemo.tsx`
- similarity: 0.42
- class tokens added (top): ../../fixtures/sample-data, ../blocks/ChatMessagesBlock, min-h-[520px]
- class tokens removed (top): ../SettingsModal, items-center, justify-center, min-h-screen

### /Users/jamiecraik/chatui/packages/ui/src/app/modals/IconPickerModal/IconPickerModal.stories.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SettingsModal.stories.tsx`
- similarity: 0.47
- class tokens added (top): ./IconPickerModal, Components/Modals/Icon, bg-foundation-bg-dark-1
- class tokens removed (top): ./SettingsModal, ChatUI/SettingsModal
- css vars added: none
- css vars removed: foundation-bg-dark-1

### /Users/jamiecraik/chatui/packages/ui/src/app/chat/ChatMessages/ChatMessages.stories.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SettingsModal.stories.tsx`
- similarity: 0.48
- class tokens added (top): ../../../fixtures/sample-data, ./ChatMessages, Components/Chat/Chat, min-h-screen, flex-1, items-center, justify-center, text-sm
- class tokens removed (top): ./SettingsModal, ChatUI/SettingsModal, h-screen
- css vars added: foundation-text-dark-tertiary
- css vars removed: none

### /Users/jamiecraik/chatui/packages/ui/src/app/modals/DiscoverySettingsModal/DiscoverySettingsModal.stories.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/SettingsModal.stories.tsx`
- similarity: 0.56
- class tokens added (top): ./DiscoverySettingsModal, Components/Modals/Discovery, bg-foundation-bg-dark-1
- class tokens removed (top): ./SettingsModal, ChatUI/SettingsModal
- css vars added: none
- css vars removed: foundation-bg-dark-1

### /Users/jamiecraik/chatui/packages/ui/src/templates/blocks/TemplatePanel/TemplatePanel.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/TemplatePanel.tsx`
- similarity: 0.58
- class tokens added (top): ../../../components/ui/base/ScrollArea, ../../../components/ui/utils
- class tokens removed (top): re-resizable, ./ui/scroll-area, ./ui/utils, lucide-react, bg-foundation-bg-light-3, dark:bg-foundation-bg-dark-3, bg-foundation-accent-red/10, text-foundation-accent-red, bg-foundation-accent-orange/10, text-foundation-accent-orange, bg-foundation-accent-green/10, text-foundation-accent-green, bg-foundation-accent-blue/10, text-foundation-accent-blue, [data-radix-scroll-area-viewport], flex-col, size-12, mb-3, mb-1, text-center, mb-4, py-2, bg-foundation-accent-blue, text-white

### /Users/jamiecraik/chatui/packages/ui/src/app/chat/ChatHeader/ChatHeader.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/ChatHeader.tsx`
- similarity: 0.62
- class tokens added (top): ../../../components/ui/utils, ../../../icons, border-foundation-bg-light-3, dark:border-foundation-bg-dark-3, transition-colors, focus-visible:ring-foundation-accent-blue, gap-3, shadow-xl, space-y-1, py-3, rounded-full, mt-0.5, bg-foundation-bg-light-3, gap-1
- class tokens removed (top): ./ui/utils, 17v4m-2-2h4m5-16l2.286, 12l-5.714, 21l-2.286-6.857L5, 12l5.714-2.143L13, 4.418-4.03, 8-9, 01-4.255-.949L3, 20l1.395-3.72C3.512, 12c0-4.418, 4.03-8, 9-8s9, 9l-7, 7-7-7, 7-7, 003-3v-1m-4-4l-4, 0l-4-4m4, 12c0-.482-.114-.938-.316-1.342m0, 110-2.684m0, 3.316m-6.632-6l6.632-3.316m0, 105.367-2.684, 00-5.367, 00-5.368-2.684z, border-foundation-border-light

### /Users/jamiecraik/chatui/packages/ui/src/templates/demos/TemplatePanelDemo/TemplatePanelDemo.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/TemplatePanelDemo.tsx`
- similarity: 0.67
- class tokens added (top): ../../blocks/TemplatePanel, p-1.5, hover:bg-foundation-bg-light-3, dark:hover:bg-foundation-bg-dark-3, text-accent-foreground, gap-3, size-5, flex-col, py-6
- class tokens removed (top): ../TemplatePanel, text-white, size-12, -, to:

### /Users/jamiecraik/chatui/packages/ui/src/app/modals/DiscoverySettingsModal/DiscoverySettingsModal.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/DiscoverySettingsModal.tsx`
- similarity: 0.78
- class tokens added (top): ../../../components/ui/overlays/Modal, ../../../components/ui/base/SectionHeader, ../../../components/ui/base/SegmentedControl, ../../../components/ui/base/Toggle, ../../../components/ui/forms/RangeSlider, font-normal, text-foundation-accent-green-light, dark:text-foundation-accent-green, bg-foundation-bg-light-1, dark:bg-foundation-bg-dark-2, discovery-settings-title, text-foundation-text-light-secondary, dark:text-foundation-text-dark-secondary, hover:text-foundation-text-light-primary, dark:hover:text-foundation-text-dark-primary, :, text-foundation-accent-orange-light, dark:text-foundation-accent-orange, dark:text-foundation-text-dark-primary
- class tokens removed (top): lucide-react, ./ui/dialog, ./ui/utils, mb-2, text-foundation-text-dark-secondary, mb-3, space-y-2, text-foundation-text-dark-primary/80, h-1.5, bg-foundation-bg-dark-3, appearance-none, cursor-pointer, flex-wrap, min-w-[80px], bg-foundation-accent-green, text-white, hover:text-foundation-text-dark-primary, w-11, h-6, rounded-full, flex-shrink-0, top-0.5, left-0.5, bg-white

### /Users/jamiecraik/chatui/packages/ui/src/app/modals/IconPickerModal/IconPickerModal.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/IconPickerModal.tsx`
- similarity: 0.79
- class tokens added (top): ../../../icons, ../../../components/ui/base/IconButton, ../../../components/ui/overlays/Modal, ../../../components/ui/utils, shadow-black/10, motion-reduce:transition-none, text-body-small, size-12, border-transparent, text-foundation-icon-light-secondary, dark:text-foundation-icon-dark-secondary, group-hover:text-foundation-icon-light-primary, dark:group-hover:text-foundation-icon-dark-primary, icon-picker-title, text-body, text-caption, active:opacity-95
- class tokens removed (top): ./icons/ChatGPTIcons, ./ui/dialog, ./ui/utils, dark:bg-foundation-accent-gray, dark:bg-foundation-accent-red, dark:bg-foundation-accent-orange, dark:bg-foundation-accent-yellow, dark:bg-foundation-accent-blue, dark:bg-foundation-accent-purple, dark:bg-foundation-accent-pink, bg-foundation-bg-light-3, shadow-foundation-bg-light-3/50, dark:shadow-black/10, text-[14px], leading-[18px], tracking-[-0.3px], scale-110, hover:scale-105, max-h-[280px], scale-95, shadow-inner, text-foundation-icon-light-tertiary, dark:text-foundation-icon-dark-tertiary, group-hover:text-foundation-icon-light-secondary
- css vars added: foundation-space-128, foundation-space-64, foundation-space-32
- css vars removed: none

### /Users/jamiecraik/chatui/packages/ui/src/templates/ChatGPTIconCatalog/ChatGPTIconCatalog.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/icons/ChatGPTIconCatalog.tsx`
- similarity: 0.93
- class tokens added (top): ../../icons/ChatGPTIcons, bg-foundation-bg-dark-1, p-8, text-foundation-text-dark-primary, text-foundation-text-dark-secondary, border-foundation-divider-dark, bg-foundation-bg-dark-2, icon-search, focus-foundation-accent-dark-green, :, text-foundation-icon-dark-primary, text-foundation-accent-dark-green, text-foundation-text-dark-tertiary
- class tokens removed (top): ./ChatGPTIcons, ../../design-tokens, --tw-ring-color, ./icons/ChatGPTIcons

### /Users/jamiecraik/chatui/packages/ui/src/templates/blocks/TemplateFieldGroup/TemplateFieldGroup.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/TemplateFieldGroup.tsx`
- similarity: 0.94
- class tokens added (top): ../../../components/ui/utils, pb-2, mt-0.5, rounded-md, p-1, hover:text-foundation-text-light-secondary, dark:hover:text-foundation-text-dark-secondary, transition-all, duration-150, size-4, duration-200, py-2, size-3.5, gap-1, focus-visible:rounded, bg-foundation-accent-yellow/10, text-foundation-accent-yellow, px-1.5, my-2
- class tokens removed (top): ./ui/utils, rounded-xl, shadow-sm, px-5, py-4, pb-3, gap-2.5, mt-1, w-7, h-7, hover:text-foundation-text-light-primary, dark:hover:text-foundation-text-dark-primary, w-4, h-4, py-2.5, w-3.5, h-3.5, px-2, py-1, opacity-40, bg-foundation-accent-orange/10, text-foundation-accent-orange, rounded-full, my-3

### /Users/jamiecraik/chatui/packages/ui/src/templates/blocks/TemplateFormField/TemplateFormField.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/TemplateFormField.tsx`
- similarity: 0.96
- class tokens added (top): ../../../components/ui/utils, ring-foundation-accent-yellow, text-foundation-accent-yellow, p-0.5, duration-150, size-3.5, pt-2, focus-visible:rounded, p-1
- class tokens removed (top): ./ui/utils, ring-foundation-accent-orange, text-foundation-accent-orange, w-4, h-4, w-3.5, h-3.5, text-foundation-text-light-secondary, dark:text-foundation-text-dark-secondary, mt-0.5, pt-2.5, focus-visible:rounded-sm, rounded-lg, w-7, h-7, hover:text-foundation-text-light-primary, dark:hover:text-foundation-text-dark-primary, opacity-40

### /Users/jamiecraik/chatui/packages/ui/src/templates/blocks/TemplateFooterBar/TemplateFooterBar.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/TemplateFooterBar.tsx`
- similarity: 0.97
- class tokens added (top): ../../../components/ui/utils, py-3, text-foundation-accent-yellow, size-4, hover:bg-foundation-bg-light-4, dark:hover:bg-foundation-bg-dark-4, text-accent-foreground, hover:bg-foundation-accent-blue/90, rounded-md, duration-150, opacity-50, size-3.5, focus-visible:rounded
- class tokens removed (top): ./ui/utils, py-3.5, text-foundation-accent-orange, w-4, bg-button-primary-bg-light, dark:bg-button-primary-bg-dark, text-button-primary-text-light, dark:text-button-primary-text-dark, hover:bg-button-primary-bg-light-hover, dark:hover:bg-button-primary-bg-dark-hover, text-white, opacity-40, w-3.5, h-3.5, hover:text-foundation-accent-blue/80, focus-visible:rounded-sm

### /Users/jamiecraik/chatui/packages/ui/src/templates/blocks/TemplateHeaderBar/TemplateHeaderBar.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/TemplateHeaderBar.tsx`
- similarity: 0.97
- class tokens added (top): ../../../components/ui/utils, text-accent-foreground, bg-foundation-accent-green, bg-foundation-accent-yellow
- class tokens removed (top): ./ui/utils, text-white, bg-foundation-accent-success, bg-foundation-accent-orange

### /Users/jamiecraik/chatui/packages/ui/src/templates/blocks/TemplateShell/TemplateShell.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/TemplateShell.tsx`
- similarity: 0.98
- class tokens added (top): ../../../components/ui/base/ScrollArea, ../../../components/ui/utils
- class tokens removed (top): ./ui/scroll-area, ./ui/utils

### /Users/jamiecraik/chatui/packages/ui/src/templates/demos/TemplateShellDemo/TemplateShellDemo.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/TemplateShellDemo.tsx`
- similarity: 0.98
- class tokens added (top): ../../blocks/TemplateShell, text-accent-foreground
- class tokens removed (top): ../TemplateShell, text-white

### /Users/jamiecraik/chatui/packages/ui/src/templates/demos/TemplateFooterBarDemo/TemplateFooterBarDemo.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/TemplateFooterBarDemo.tsx`
- similarity: 0.99
- class tokens added (top): ../../blocks/TemplateFooterBar
- class tokens removed (top): ../TemplateFooterBar

### /Users/jamiecraik/chatui/packages/ui/src/templates/demos/TemplateFormFieldDemo/TemplateFormFieldDemo.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/TemplateFormFieldDemo.tsx`
- similarity: 0.99
- class tokens added (top): ../../blocks/TemplateFormField
- class tokens removed (top): ../TemplateFormField

### /Users/jamiecraik/chatui/packages/ui/src/templates/demos/TemplateHeaderBarDemo/TemplateHeaderBarDemo.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/TemplateHeaderBarDemo.tsx`
- similarity: 0.99
- class tokens added (top): ../../blocks/TemplateHeaderBar
- class tokens removed (top): ../TemplateHeaderBar

### /Users/jamiecraik/chatui/packages/ui/src/templates/demos/ChatInputDemo/ChatInputDemo.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/ChatInputDemo.tsx`
- similarity: 0.99
- class tokens added (top): ../../../app/chat/ChatInput
- class tokens removed (top): ../ChatInput

### /Users/jamiecraik/chatui/packages/ui/src/templates/demos/TemplateFieldGroupDemo/TemplateFieldGroupDemo.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/TemplateFieldGroupDemo.tsx`
- similarity: 0.99
- class tokens added (top): ../../blocks/TemplateFieldGroup, ../../blocks/TemplateFormField
- class tokens removed (top): ../TemplateFieldGroup, ../TemplateFormField

### /Users/jamiecraik/chatui/packages/ui/src/templates/demos/ChatHeaderDemo/ChatHeaderDemo.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/demos/ChatHeaderDemo.tsx`
- similarity: 1.00
- class tokens added (top): ../../../app/chat/ChatHeader
- class tokens removed (top): ../ChatHeader

### /Users/jamiecraik/chatui/packages/ui/src/icons/chatgpt/ChatGPTIconsFixed.tsx
- _temp match: `/Users/jamiecraik/chatui/_temp/ChatGPT UI Templates (1)/src/components/icons/ChatGPTIconsFixed.tsx`
- similarity: 1.00
- class tokens added (top): none
- class tokens removed (top): none
