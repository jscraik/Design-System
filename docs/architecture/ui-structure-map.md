# UI Structure Map

Last updated: 2026-01-04

## Doc requirements
- Audience: Engineers and technical leads
- Scope: System architecture and component relationships
- Non-scope: Step-by-step operational procedures
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


This map shows the current layout for the UI library after the per-component foldering pass. Use it to find where to add new components, stories, and tests.

## packages/ui/src/

```
packages/ui/src/
├── app/
│   ├── chat/
│   │   ├── AttachmentMenu/AttachmentMenu.tsx
│   │   ├── ChatHeader/ChatHeader.tsx
│   │   ├── ChatInput/ChatInput.tsx
│   │   ├── ChatMessages/ChatMessages.tsx
│   │   ├── ChatShell/ChatShell.tsx
│   │   ├── ChatSidebar/ChatSidebar.tsx
│   │   ├── ChatUIRoot/ChatUIRoot.tsx
│   │   ├── ChatVariants/ChatVariants.tsx
│   │   ├── ChatView/ChatView.tsx
│   │   ├── ComposeView/ComposeView.tsx
│   │   ├── ChatSidebar/
│   │   │   ├── components/
│   │   │   ├── data/
│   │   │   ├── hooks/
│   │   │   └── modals/
│   │   ├── compose/
│   │   │   ├── ComposeInstructionsPanel/
│   │   │   ├── PromptBuilderSection/
│   │   │   ├── ProEditConfigModal/
│   │   │   └── shared/
│   │   │       ├── constants.ts
│   │   │       └── types.ts
│   │   └── shared/
│   │       ├── constants.ts
│   │       ├── iconHelpers.tsx
│   │       ├── slots.tsx
│   │       └── types.ts
│   ├── modals/
│   │   ├── DiscoverySettingsModal/
│   │   ├── IconPickerModal/
│   │   ├── SettingsModal/
│   │   └── settings/
│   │       ├── AboutSection/
│   │       ├── AccountSection/
│   │       ├── AppSection/
│   │       ├── ChatBarSection/
│   │       ├── SpeechSection/
│   │       ├── SuggestionsSection/
│   │       └── WorkWithAppsSection/
│   └── settings/
│       ├── AppsPanel/
│       ├── ArchivedChatsPanel/
│       ├── AudioSettingsPanel/
│       ├── CheckForUpdatesPanel/
│       ├── DataControlsPanel/
│       ├── ManageAppsPanel/
│       ├── NotificationsPanel/
│       ├── PersonalizationPanel/
│       ├── SecurityPanel/
│       ├── SettingDropdown/
│       ├── SettingRow/
│       ├── SettingToggle/
│       └── shared/
│           └── types.ts
├── components/
│   └── ui/
│       ├── base/<component>/<component>.tsx
│       ├── forms/<component>/<component>.tsx
│       ├── navigation/<component>/<component>.tsx
│       ├── overlays/<component>/<component>.tsx
│       ├── feedback/<component>/<component>.tsx
│       ├── data-display/<component>/<component>.tsx
│       └── chat/<component>/<component>.tsx
├── templates/
│   ├── <TemplateName>/<TemplateName>.tsx
│   ├── blocks/<BlockName>/<BlockName>.tsx
│   ├── demos/<DemoName>/<DemoName>.tsx
│   └── registry.ts
├── design-system/
│   └── showcase/
├── storybook/
│   ├── App/App.tsx
│   ├── docs/*.mdx
│   ├── design-system/DesignTokens/DesignTokens.ts
│   └── pages/<PageName>/<PageName>.tsx
├── icons/
├── integrations/
│   └── figma/ImageWithFallback/ImageWithFallback.tsx
├── hooks/
├── fixtures/
├── testing/
├── utils/
└── styles/
```

## Conventions
- Per-component folders: a component and its stories/tests live together.
- Component folders and files use `PascalCase` (e.g. `Button/Button.tsx`); category folders stay `kebab-case` (e.g. `data-display`).
- Component folders export from `index.ts`, so imports can stay at the folder root.
- Shared utilities and types live under a `shared/` folder (e.g. `app/chat/shared/types.ts`).
- Templates follow the same per-component convention, including `*.figmaConnect.tsx` files.

## Adding new components
1. Create a folder named after the component inside the correct category.
2. Add `<Component>.tsx` plus optional `.stories.tsx` / `.test.tsx` in the same folder.
3. Export from the category `index.ts` and any higher-level barrel you want.
