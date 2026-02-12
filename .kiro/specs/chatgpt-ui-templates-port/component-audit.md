# Component Audit: Source Templates vs @design-studio/ui

## Context
This audit compares source template components in `packages/ui/src/templates/_temp_import` against the current `@design-studio/ui` component library. It identifies which pieces already exist, which need wrappers, and which require new ports.

## Source Component Inventory (from _temp_import)

### Template building blocks
- `TemplateShell`
- `TemplatePanel`
- `TemplateHeaderBar`
- `TemplateFooterBar`
- `TemplateFormField`
- `TemplateFieldGroup`
- `SettingRow`
- `SettingToggle`
- `SettingDropdown`
- `SettingRowBlock`
- `SettingToggleBlock`
- `SettingDropdownBlock`
- `ChatHeader`
- `ChatInput`
- `AttachmentMenu`
- `ModelSelector`

### Template panels/modals
- `SettingsModal`
- `DiscoverySettingsModal`
- `IconPickerModal`
- Settings panels: `AppsPanel`, `ArchivedChatsPanel`, `AudioSettingsPanel`, `CheckForUpdatesPanel`, `DataControlsPanel`, `ManageAppsPanel`, `NotificationsPanel`, `PersonalizationPanel`, `SecurityPanel`

### Showcases / docs
- `ColorShowcase`
- `SpacingShowcase`
- `TypographyShowcase`
- `IconographyShowcase`
- `FoundationsShowcase`
- `DesignSystemDocs`
- `ChatGPTIconCatalog`

### UI primitives (source-local)
- `alert`
- `badge`
- `button`
- `calendar`
- `code-block`
- `command`
- `date-picker`
- `date-range-picker`
- `dialog`
- `dropdown-menu`
- `empty-message`
- `image`
- `indicator`
- `markdown`
- `menu`
- `popover`
- `scroll-area`
- `segmented-control`
- `select-control`
- `shimmer-text`
- `tag-input`
- `text-link`
- `transition`

### Icons
- Core/utility icons under `components/icons/*`
- Brand icons under `components/icons/brands/*`

## Existing in @design-studio/ui

### Template blocks (available)
- `TemplateShell`, `TemplatePanel`, `TemplateHeaderBar`, `TemplateFooterBar`, `TemplateFormField`, `TemplateFieldGroup` via `packages/ui/src/templates/blocks`
- `SettingRowBlock`, `SettingToggleBlock`, `SettingDropdownBlock` via `packages/ui/src/templates/blocks`
- `ChatHeaderBlock`, `ChatInputBlock`, `ChatMessagesBlock`, `ChatSidebarBlock`

### Templates / panels (available)
- Panel templates: `AppsPanelTemplate`, `ArchivedChatsPanelTemplate`, `AudioSettingsPanelTemplate`, `CheckForUpdatesPanelTemplate`, `DataControlsPanelTemplate`, `ManageAppsPanelTemplate`, `NotificationsPanelTemplate`, `PersonalizationPanelTemplate`, `SecurityPanelTemplate`
- Chat templates: `ChatTemplate`, `ChatHeaderTemplate`, `ChatInputTemplate`, `ChatMessagesTemplate`, `ChatSidebarTemplate`, `ChatVariantsTemplate`, `ChatTwoPaneTemplate`, `ChatFullWidthTemplate`

### Modals (available)
- `SettingsModal`, `DiscoverySettingsModal`, `IconPickerModal` via `@design-studio/ui/modals`

### Primitives (available)
- `Alert`, `Badge`, `Button`, `Calendar`, `Input`, `Select`, `ScrollArea`, `SegmentedControl`
- `Dialog` (feedback), `DropdownMenu` (overlays), `Popover` (overlays), `Command` (overlays)
- `DatePicker` (forms)

### Showcases (available)
- `ColorShowcase`, `SpacingShowcase`, `TypographyShowcase`, `IconographyShowcase`, `FoundationsShowcase`, `DesignSystemDocs` via `@design-studio/ui/showcase`

## Gaps / Wrapper Needed

### UI primitives missing in @design-studio/ui
- `CodeBlock`
- `EmptyMessage`
- `Image` (generic image/Avatar image wrapper)
- `Indicator`
- `Markdown`
- `Menu` (source uses DropdownMenu-style composition; can map to overlays `DropdownMenu` or `Menubar`)
- `ShimmerText`
- `TagInput`
- `TextLink`
- `Transition` (Stagger/Collapse/SlideIn utilities)

### Ambiguous mappings
- `SelectControl` and `MultiSelectControl` should map to base `Select` and/or `Combobox` in `@design-studio/ui/forms`.
- `AttachmentMenu` can likely be rebuilt using `DropdownMenu` + `Menu` primitives; confirm interaction requirements.
- `ModelSelector` overlaps `@design-studio/ui/navigation/ModelSelector`; confirm parity or adopt existing component.
- `DateRangePicker` is already available via `@design-studio/ui/forms` (exported from the DatePicker module).

## Notes
- Icons in `_temp_import/components/icons` should be reconciled with `@design-studio/ui/icons`. Missing icons should be added to the icons package before template porting.
- Source-only demos (`components/demos/*`) are not production template dependencies; they can remain in dev/showcase surfaces.
