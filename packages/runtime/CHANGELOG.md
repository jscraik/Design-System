# @design-studio/runtime

Last updated: 2026-01-09

## Doc requirements

- Audience: Contributors and release stakeholders
- Scope: Release history and notable changes
- Non-scope: Usage instructions or implementation details
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

> Note: This package changelog is archived. Use the root `CHANGELOG.md` for current release history.
> This file is retained for historical context only.

## 0.0.1

### Patch Changes

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

  **Breaking Changes:**
  None - this is a minor version bump for new tokens and internal improvements
