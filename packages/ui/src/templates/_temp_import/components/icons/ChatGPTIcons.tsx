// Main ChatGPT Icon System Export
// Comprehensive icon library with 350+ production-ready icons

// Export all fixed icons (core UI icons with hardcoded SVGs)
export * from "./ChatGPTIconsFixed";

// Export additional icons (non-duplicated)
export {
  IconArrowUp,
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconRedo,
} from "./additional-icons";

// Export missing icons
export * from "./missing-icons";

// Re-export common icon types
export interface IconProps {
  className?: string;
}
