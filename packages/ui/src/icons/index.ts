// ============================================================================
// CHATUI CANONICAL ICON SYSTEM
// ============================================================================
// This is the SINGLE SOURCE OF TRUTH for all icons across the entire ChatUI
// repository. All apps (web, storybook, templates route) must import icons
// from this file only.
//
// Icon System Breakdown:
// - 350+ ChatGPT icons (hardcoded SVG from Figma)
// - Lucide React icons (convenience re-exports)
// - Brand icons (GitHub, Notion, Slack, etc.)
// - Apps SDK UI icons (Download, Sparkles)
//
// Usage: import { IconCheckmark, IconSettings } from "@design-studio/ui/icons"
// ============================================================================

import { chatGPTIconSizes } from "./ChatGPTIconSizes";

// ----------------------------------------------------------------------------
// CHATGPT ICONS (350+ production-ready icons from Figma)
// ----------------------------------------------------------------------------

// Core ChatGPT icons with hardcoded SVG paths
export * from "./chatgpt/ChatGPTIconsFixed";

// Additional ChatGPT icons (chevrons, arrows, specialized)
// Note: Some icons may overlap with ChatGPTIconsFixed - they're exported as is
export * from "./chatgpt/additional-icons";

// Missing ChatGPT icons
export * from "./chatgpt/missing-icons";
export { IconOperator } from "./legacy/chatgpt/misc";
export {
  IconArrowCurvedRight,
  IconArrowDownLg,
  IconArrowRotateCw,
  IconArrowTopRightSm,
  IconChevronUpDown,
  IconExpandLg,
  IconRegenerateStar,
  IconReply,
  IconShuffle,
} from "./legacy/chatgpt/arrows";
export {
  IconGroup,
  IconGroupFilled,
  IconUserAdd,
  IconUserLock as IconUserLockLegacy,
} from "./legacy/chatgpt/account";

// Common icon aliases for consistency
export { IconArrowUpSm as IconArrowUp } from "./chatgpt/ChatGPTIconsFixed";
export { IconCheckmark as IconCheck } from "./chatgpt/missing-icons";

// ----------------------------------------------------------------------------
// BRAND ICONS
// ----------------------------------------------------------------------------

export {
  CanvaIcon,
  DropboxIcon,
  FigmaIcon,
  GitHubIcon,
  LinearIcon,
  MicrosoftIcon,
  NotionIcon,
  SharePointIcon,
  SlackIcon,
  TeamsIcon,
} from "./brands";

// ----------------------------------------------------------------------------
// UTILITY ICONS (replacing legacy/chatgpt/platform.tsx)
// ----------------------------------------------------------------------------

export {
  IconRadio,
  IconRadioChecked,
  IconNotification,
  IconNotificationFilled,
  IconWifi,
  IconBatteryFull,
  IconBatteryHalf,
  IconBatteryLow,
} from "./UtilityIcons";
// IconRefresh aliases to IconRegenerate (semantically similar)
export { IconRegenerate as IconRefresh } from "./chatgpt/ChatGPTIconsFixed";

// ----------------------------------------------------------------------------
// APPS SDK UI ICONS (local implementations to avoid circular dependencies)
// ----------------------------------------------------------------------------

// Local implementations to avoid circular dependency with @openai/apps-sdk-ui
// These replicate the visual appearance without importing from that package
export { IconSparkles } from "./AppsSDKIconLocal";
export { IconDownload } from "./legacy/chatgpt/public";

// ----------------------------------------------------------------------------
// NAMED EXPORTS (Icon* prefix for consistency)
// ----------------------------------------------------------------------------

// These provide convenient aliases with Icon* prefix
export {
  IconArchive,
  IconArrowLeftSm,
  IconArrowRightSm,
  IconArrowUpSm,
  IconChat,
  IconChevronDownMd,
  IconChevronLeftMd,
  IconChevronRightMd,
  IconChevronUpMd,
  IconCopy,
  IconDotsVertical,
  IconEdit,
  IconFolder,
  IconImage,
  IconLightBulb,
  IconPlusComposer,
  IconPlusLg,
  IconRegenerate,
  IconSearch,
  IconSettings,
  IconShare,
  IconStar,
  IconThumbDown,
  IconThumbUp,
} from "./chatgpt/ChatGPTIconsFixed";
export {
  IconCheckCircle,
  IconCheckmark,
  IconCode,
  IconGrid3x3,
  IconPlusCircle,
  IconX,
} from "./chatgpt/missing-icons";
export {
  IconCloseBold,
  IconDotsHorizontal,
  IconPlusSm,
  IconSidebar,
} from "./legacy/chatgpt/interface";

// ----------------------------------------------------------------------------
// ICON CATALOG (for browsing all icons)
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// SIZE UTILITIES
// ----------------------------------------------------------------------------

export { chatGPTIconSizes, getSizeClass } from "./ChatGPTIconSizes";
export type { ChatGPTIconSizes } from "./ChatGPTIconSizes";

// ----------------------------------------------------------------------------
// ICON PROPS TYPE
// ----------------------------------------------------------------------------

export interface IconProps {
  className?: string;
  size?: keyof typeof chatGPTIconSizes;
}
