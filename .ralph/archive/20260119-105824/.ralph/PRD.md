# PRD

## Overview

Align in-scope app modals with the existing `ModalDialog` primitive to restore focus trapping, Escape handling, and dialog semantics. Remove the hardcoded Mapbox token fallback in the Pizzaz map widget and show an inline error when `VITE_MAPBOX_TOKEN` is missing. Source spec: `.spec/spec-2026-01-19-modal-a11y-mapbox-token.md`.

## Tasks

- [ ] **Task 1: Replace ProEditConfigModal overlay with ModalDialog**
  - Replace the overlay `div` and fixed modal container with `ModalDialog` component
  - Set `isOpen={isOpen}`, `onClose={onClose}`, `title="Pro Edit Settings"`, `maxWidth="720px"`
  - Move existing content inside the `ModalDialog` body
  - Use `className` and `overlayClassName` to preserve current visual styling
  - Verify: Component compiles; modal opens/closes; focus is trapped

- [ ] **Task 2: Replace NewProjectModal overlay with ModalDialog**
  - Replace the outer overlay `div` with `ModalDialog` component
  - Set `title="New project"` and `description` to match the helper text
  - Preserve the inner card styles as the dialog container `className`
  - Remove `onClick` stopPropagation since overlay behavior is handled by `ModalDialog`
  - Verify: Component compiles; modal opens/closes; focus is trapped

- [ ] **Task 3: Replace ProjectSettingsModal overlay with ModalDialog**
  - Replace the outer overlay `div` with `ModalDialog` component
  - Set `title="Project settings"` and optionally include a short description
  - Preserve inner content styling in `className`
  - Remove manual overlay/stopPropagation logic
  - Verify: Component compiles; modal opens/closes; focus is trapped

- [ ] **Task 4: Add Mapbox token guard and remove hardcoded fallback**
  - Replace token assignment to remove the hardcoded fallback in `packages/widgets/src/widgets/pizzaz/pizzaz-map/main.tsx`
  - Add guard that renders inline "missing token" UI when `import.meta.env.VITE_MAPBOX_TOKEN` is not set
  - Ensure Mapbox initialization is skipped when the token is missing
  - Verify: Widget shows error when token missing; Mapbox doesn't initialize; no token leaked in logs/UI

- [ ] **Task 5: Validate accessibility and run lint**
  - Manual checks: Tab key cycles within each modal; Escape closes modal; focus returns to trigger
  - Run `pnpm lint` and ensure no errors (or skip with note if too heavy)
  - Verify: All modal a11y behaviors work; lint passes; no visual regressions

# Notes
# - Mark done:   - [x] ...
# - Mark blocked: - [-] ...
# - Dependencies (optional): add an acceptance bullet like:
#   - Depends on: 1, 2
