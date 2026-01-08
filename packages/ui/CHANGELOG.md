# @chatui/ui

Last updated: 2026-01-04

## Doc requirements
- Audience: Contributors and release stakeholders
- Scope: Release history and notable changes
- Non-scope: Usage instructions or implementation details
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


## [Unreleased]

### Added
- Tabbed interface to FoundationsShowcase for better navigation between design system sections (Colors, Typography, Spacing, Icons)
- 16 demo templates for template blocks, settings, chat components, and modals
- ChatGPTIconCatalog template for browsing all 350+ icons with search and categories

### Changed
- FoundationsShowcase now uses modular tabbed layout (83 lines) instead of monolithic page (235 lines)
- Improved UX with conditional rendering - only active tab content is loaded

### Fixed
- Duplicate icon exports (IconMoon, IconChevronUp) removed from additional-icons.tsx
- Missing chatGPTIconSizes import added to icons/index.ts
- All demo template import paths corrected for proper component resolution

## 0.1.0

### Minor Changes

- b716ca9: Move templates to experimental exports, require React 19 peers, and expand a11y/test guardrails.
- Add new design tokens (accent-foreground, ring, accent-purple) and migrate all UI components to use foundation design tokens instead of hardcoded values.

  **Design Tokens:**
  - Added `--accent-foreground` token for text on accent-colored backgrounds
  - Added `--accent-purple` token for purple accent color
  - Added `--ring` token for focus ring/keyboard navigation states
  - Updated DTCG source with new `accent.foreground` and `interactive.ring` tokens

  **Component Updates:**
  - Fixed all hardcoded typography values to use foundation tokens (caption, body-small, body, heading-3)
  - Removed hardcoded line-heights and letter-spacing to use token defaults
  - Fixed 40+ UI components across base, navigation, overlays, forms, chat, and settings categories

  **Cross-Platform:**
  - Swift: Added `FColor.accentForeground` and `FColor.ring` tokens
  - Updated Swift components (ListItemView, BadgeView) to use new tokens
  - Regenerated Swift DesignTokens with new token categories

  **Breaking Changes:**
  None - this is a minor version bump for new tokens and internal improvements

### Patch Changes

- Updated dependencies
  - @chatui/tokens@0.1.0
