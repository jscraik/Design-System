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

import type { chatGPTIconSizes } from "./ChatGPTIconSizes";

// ----------------------------------------------------------------------------
// CHATGPT ICONS (350+ production-ready icons from Figma)
// ----------------------------------------------------------------------------

// Additional ChatGPT icons (chevrons, arrows, specialized)
// Note: Some icons may overlap with ChatGPTIconsFixed - they're exported as is
export * from "./chatgpt/additional-icons";
// Core ChatGPT icons with hardcoded SVG paths
export * from "./chatgpt/ChatGPTIconsFixed";
// Common icon aliases for consistency
// NEW: Account category icons (from Figma)
export * as AccountUserIcons from "./account-user";
// NEW: Arrow icons
export * as ArrowIcons from "./arrows";
// NEW: Chat tool icons
export * as ChatToolsIcons from "./chat-tools";
// NEW: Misc/utility icons
export * as MiscIcons from "./misc";
// NEW: Platform icons
export * as PlatformIcons from "./platform";
// NEW: Settings icons
export * as SettingsIcons from "./settings";
// ----------------------------------------------------------------------------
// These provide convenient aliases with Icon* prefix
export {
export { IconCheckmark as IconCheck } from "./chatgpt/missing-icons";
export {
  IconGroup,
  IconGroupFilled,
  IconUserAdd,
  IconUserLock as IconUserLockLegacy,
} from "./legacy/chatgpt/account";
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
export { IconOperator } from "./legacy/chatgpt/misc";

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

// IconRefresh aliases to IconRegenerate (semantically similar)
export { IconRegenerate as IconRefresh } from "./chatgpt/ChatGPTIconsFixed";
export {
  IconBatteryFull,
  IconBatteryHalf,
  IconBatteryLow,
  IconNotification,
  IconNotificationFilled,
  IconRadio,
  IconRadioChecked,
  IconWifi,
} from "./UtilityIcons";

// ----------------------------------------------------------------------------
// APPS SDK UI ICONS (local implementations to avoid circular dependencies)
// ----------------------------------------------------------------------------

// Local implementations to avoid circular dependency with @openai/apps-sdk-ui
// These replicate the visual appearance without importing from that package
export { IconSparkles } from "./AppsSDKIconLocal";
export { IconDownload } from "./legacy/chatgpt/public";

// ----------------------------------------------------------------------------
// NAMED EXPORTS (Icon* prefix for consistency)
// NEW: Account category icons (from Figma)
export * as AccountUserIcons from "./account-user";
// NEW: Arrow icons
export * as ArrowIcons from "./arrows";
// NEW: Chat tool icons
export * as ChatToolsIcons from "./chat-tools";
// NEW: Misc/utility icons
export * as MiscIcons from "./misc";
// NEW: Platform icons
export * as PlatformIcons from "./platform";
// NEW: Settings icons
export * as SettingsIcons from "./settings";
// NEW: Account category icons (from Figma)
export * as AccountUserIcons from "./account-user";
// NEW: Arrow icons
export * as ArrowIcons from "./arrows";
// NEW: Chat tool icons
export * as ChatToolsIcons from "./chat-tools";
// NEW: Misc/utility icons
export * as MiscIcons from "./misc";
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

export type { ChatGPTIconSizes } from "./ChatGPTIconSizes";
export { chatGPTIconSizes, getSizeClass } from "./ChatGPTIconSizes";

// ----------------------------------------------------------------------------
// ICON PROPS TYPE
// ----------------------------------------------------------------------------

export interface IconProps {
  className?: string;
  size?: keyof typeof chatGPTIconSizes;
}
