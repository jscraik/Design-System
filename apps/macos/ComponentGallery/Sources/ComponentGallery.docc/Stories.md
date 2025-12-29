# Component Stories

ComponentGallery organizes stories by category. Each gallery section is a deterministic example designed for accessibility and visual regression checks.

## Categories

- Foundation: colors, typography, spacing, and platform utilities
- Settings: settings primitives and composed settings screens
- Buttons: ChatUIButton and icon-only variants
- Inputs: InputView variants and accessibility patterns
- Navigation: ListItemView and navigation patterns
- Themes: ChatGPT theme constants and comparisons
- Accessibility: focus management, VoiceOver, keyboard navigation, high contrast, reduced motion

## Adding Stories

1. Add a new section to the appropriate gallery in `Sources/Galleries/`.
2. Provide a clear title and subtitle describing the scenario.
3. Keep data deterministic to avoid visual diffs.
4. Ensure icon-only controls include accessibility labels.
5. Prefer ChatUIFoundation tokens (FColor, FType, FSpacing) for styling.
