/**
 * Public entry point for ChatUI exports.
 */

// App Surfaces
export * from "./app";
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
// Templates (canonical source)
export * from "./templates";
export * from "./utils/theme";
