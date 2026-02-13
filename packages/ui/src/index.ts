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
// Vendor Components (explicit exports with AppsSDK prefix to avoid conflicts)
export {
  AppsSDKUIProvider,
  Badge as AppsSDKBadge,
  Button as AppsSDKButton,
  Checkbox as AppsSDKCheckbox,
  CodeBlock as AppsSDKCodeBlock,
  Download as AppsSDKDownloadIcon,
  Image as AppsSDKImage,
  Input as AppsSDKInput,
  Popover as AppsSDKPopover,
  Sparkles as AppsSDKSparklesIcon,
  Textarea as AppsSDKTextarea,
} from "./integrations/apps-sdk";
// Figma integrations
export * from "./integrations/figma";
// Templates (canonical source)
export * from "./templates";
export * from "./utils/theme";
