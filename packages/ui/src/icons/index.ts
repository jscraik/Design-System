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
// Usage: import { IconCheckmark, IconSettings } from "@astudio/ui/icons"
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
export { IconGroup, IconGroupFilled, IconUserAdd, IconUserLock as IconUserLockLegacy } from "./legacy/chatgpt/account";
export {
  IconNotification,
  IconNotificationFilled,
  IconWifi,
  IconBatteryFull,
  IconBatteryHalf,
  IconBatteryLow,
} from "./legacy/chatgpt/platform";

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
// APPS SDK UI ICONS
// ----------------------------------------------------------------------------

export { Download, Sparkles } from "../integrations/apps-sdk";
export { Download as IconDownload, Sparkles as IconSparkles } from "../integrations/apps-sdk";

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
export { IconCloseBold, IconDotsHorizontal, IconPlusSm, IconSidebar } from "./legacy/chatgpt/interface";
export { IconRadio, IconRefreshCw as IconRefresh } from "./legacy/chatgpt/platform";

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
