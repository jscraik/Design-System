/**
 * Public entry point for ChatUI exports.
 */

// App Surfaces
export * from "./app";

// Hooks
export * from "./hooks/useFocusTrap";
export * from "./hooks/useControllableState";

// UI Components (prioritized over vendor)
export * from "./components/ui";

// Organized component exports for better tree-shaking
export * from "./components/ui/chat";
export * from "./components/ui/forms";
export * from "./components/ui/layout";

// Vendor Components (explicit exports with AppsSDK prefix to avoid conflicts)
export {
  AppsSDKUIProvider,
  Button as AppsSDKButton,
  Checkbox as AppsSDKCheckbox,
  Image as AppsSDKImage,
  Input as AppsSDKInput,
  Badge as AppsSDKBadge,
  CodeBlock as AppsSDKCodeBlock,
  Popover as AppsSDKPopover,
  Textarea as AppsSDKTextarea,
  Download as AppsSDKDownloadIcon,
  Sparkles as AppsSDKSparklesIcon,
} from "./integrations/apps-sdk";

// Figma integrations
export * from "./integrations/figma";

// Icons (canonical source - 350+ icons from Figma)
export * from "./icons";

// Utils
export * from "./components/ui/utils";
export * from "./utils/theme";

// Templates (canonical source)
export * from "./templates";
