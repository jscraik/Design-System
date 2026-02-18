/**
 * Public entry point for ChatUI exports.
 */

// NEW: Account category icons (from Figma)
export * as AccountUserIcons from "./account-user";
// App Surfaces
export * from "./app";
// NEW: Arrow icons
export * as ArrowIcons from "./arrows";
// NEW: Chat tool icons
export * as ChatToolsIcons from "./chat-tools";
// UI Components (prioritized over vendor)
export * from "./components/ui";
// Organized component exports for better tree-shaking
export * from "./components/ui/chat";
export * from "./components/ui/forms";
export * from "./components/ui/layout";
// Utils
export * from "./components/ui/utils";
export * from "./hooks/useControllableState";
// Hooks
export * from "./hooks/useFocusTrap";
// Icons (canonical source - 350+ icons from Figma)
export * from "./icons";
// Apps SDK Wrapper Components (stable abstraction layer with version safety)
export * from "./integrations/apps-sdk-wrapper";
// NEW: Misc/utility icons
export * as MiscIcons from "./misc";
// NEW: Platform icons
export * as PlatformIcons from "./platform";
// NEW: Settings icons
export * as SettingsIcons from "./settings";
// Templates (canonical source)
export * from "./templates";
export * from "./utils/theme";
