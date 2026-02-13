# Desktop Theme Overrides (Optional)

**Owner:** Jamie Scott Craik (@jscraik)  
**Last updated:** 2026-01-24  
**Scope:** Optional desktop-only token overrides without changing token sources.

## Purpose

Provide optional platform-specific tweaks for desktop shells (Tauri) while preserving the token source of truth.

## Recommended Overrides

Use CSS variable overrides in the desktop app entry stylesheet:

- Font family
- Radius scale
- Density (spacing)

## Example

```css
:root[data-platform="desktop"] {
  --ds-font-sans: "SF Pro Text", system-ui, sans-serif;
  --ds-radius-md: 0.625rem;
  --ds-space-2: 0.375rem;
}
```

## Rules

- Do not change DTCG source files for platform overrides.
- Keep overrides minimal and documented.
