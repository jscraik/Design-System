# Fix modal accessibility and Mapbox token handling

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

There is no repo-local `PLANS.md` or `.agent/PLANS.md` file. This ExecPlan is written according to `/Users/jamiecraik/.codex/instructions/plans.md` and must be maintained in accordance with it.

## Purpose / Big Picture

After this change, all UI modals in the main app paths use the repo’s accessible modal primitive with focus trap, Escape handling, and proper dialog semantics, and the Mapbox widget no longer ships with a hardcoded token fallback. A user can open and close modals with keyboard and screen reader expectations intact, and the map widget only initializes when a valid environment token is provided.

## Acceptance Criteria

- [ ] All in-scope app modals (`ProEditConfigModal`, `NewProjectModal`, `ProjectSettingsModal`) use `ModalDialog` and no longer render manual overlay divs.
- [ ] Focus is trapped inside modals, Escape closes modals, and focus returns to the triggering element after modal close.
- [ ] Modal headings are wired to `aria-labelledby` via `ModalDialog` title handling.
- [ ] Hardcoded Mapbox token fallback is removed from `pizzaz-map/main.tsx`.
- [ ] When `VITE_MAPBOX_TOKEN` is missing, the widget renders an inline error state and does not initialize Mapbox.
- [ ] No logs or UI output reveal token values or use fallback tokens.
- [ ] `pnpm lint` completes without errors (or skip with note if too heavy for design-only pass).

## Progress

- [ ] (2026-01-19 00:00Z) Implement modal refactors to use `ModalDialog` and remove Mapbox token fallback; add missing a11y attributes and empty-state UI when env token is missing.

## Surprises & Discoveries

- Observation: The repo does not contain `references/components-index.md`, which is referenced by the `react-ui-patterns` skill.
  Evidence: `rg --files -g 'components-index.md'` returned no results.

## Decision Log

- Decision: Use the existing `packages/ui/src/components/ui/overlays/Modal/Modal.tsx` primitive as the single modal pattern for app modals.
  Rationale: It already implements focus trap, Escape handling, and WAI-ARIA dialog semantics, and avoids bespoke modal logic.
  Date/Author: 2026-01-19 / Codex

- Decision: Remove hardcoded Mapbox token fallback and require `VITE_MAPBOX_TOKEN` for map initialization.
  Rationale: Hardcoded credentials violate repo security policy and create hidden production behavior.
  Date/Author: 2026-01-19 / Codex

## Outcomes & Retrospective

Pending. Will complete after implementation and validation.

## Context and Orientation

The repo contains a `ModalDialog` primitive at `packages/ui/src/components/ui/overlays/Modal/Modal.tsx` that already implements focus trapping, Escape to close, overlay click handling, and `role="dialog"`, `aria-modal`, and label/description wiring. This plan uses that primitive exclusively. No new modal primitives are introduced.

Several app modals currently render as plain `div` overlays, which bypass accessibility and keyboard support:
- `packages/ui/src/app/chat/compose/ProEditConfigModal/ProEditConfigModal.tsx`
- `packages/ui/src/app/chat/ChatSidebar/modals/NewProjectModal/NewProjectModal.tsx`
- `packages/ui/src/app/chat/ChatSidebar/modals/ProjectSettingsModal/ProjectSettingsModal.tsx`

The Pizzaz map widget hardcodes a Mapbox token fallback:
- `packages/widgets/src/widgets/pizzaz/pizzaz-map/main.tsx`

“Modal” here means a dialog that interrupts the main UI and must trap focus. “Overlay” means a background layer that dismisses the modal.

## Plan of Work

First, replace the modal shell markup in the three app modal files with the `ModalDialog` primitive. The goal is to preserve all existing layout and styles while delegating focus management, Escape handling, and overlay behavior to the primitive. Do not change any internal modal content structure or state logic.

For `ProEditConfigModal`, keep the existing contents and styles but wrap the modal in `ModalDialog`. Provide `title` and a `maxWidth` that matches the current width. Remove the outer overlay `div` and the manual fixed-position container so the primitive owns the overlay and dialog role. Use `className` and `overlayClassName` to preserve the existing styling.

For `NewProjectModal`, replace the outer overlay `div` with `ModalDialog`. Use `title` and `description` props so the dialog is properly labeled. Preserve the inner card styles as the `className`. Remove `onClick` stopPropagation since overlay behavior is handled by `ModalDialog`.

For `ProjectSettingsModal`, do the same: switch to `ModalDialog`, apply a title, preserve the layout as the dialog content, and remove manual overlay logic.

Second, remove the hardcoded Mapbox token fallback in `packages/widgets/src/widgets/pizzaz/pizzaz-map/main.tsx`. Require `import.meta.env.VITE_MAPBOX_TOKEN`. If the token is missing, render a small inline error state in the widget instead of initializing Mapbox. This error state must be visible and should mention that `VITE_MAPBOX_TOKEN` is required, but it must not log or expose any secret values.

No new dependencies should be added. Avoid any behavior or visual regressions beyond the modal shell and token guard.

## Concrete Steps

1) Update `packages/ui/src/app/chat/compose/ProEditConfigModal/ProEditConfigModal.tsx`.
   - Replace the overlay `div` and fixed modal container with `ModalDialog`.
   - Set `isOpen={isOpen}`, `onClose={onClose}`, `title="Pro Edit Settings"`, `maxWidth="720px"`.
   - Move the existing content inside the `ModalDialog` body.
   - Use `className` and `overlayClassName` to preserve current visual styling.

2) Update `packages/ui/src/app/chat/ChatSidebar/modals/NewProjectModal/NewProjectModal.tsx`.
   - Replace the outer overlay `div` with `ModalDialog`.
   - Set `title` to “New project” and set `description` to match the helper text at the top.
   - Preserve the inner card styles as the dialog container `className`.
   - Remove `onClick` stopPropagation since the overlay behavior is handled by `ModalDialog`.

3) Update `packages/ui/src/app/chat/ChatSidebar/modals/ProjectSettingsModal/ProjectSettingsModal.tsx`.
   - Replace the outer overlay `div` with `ModalDialog`.
   - Set `title="Project settings"` and optionally include a short description if needed.
   - Preserve inner content styling in `className`.
   - Remove manual overlay/stopPropagation logic.

4) Update `packages/widgets/src/widgets/pizzaz/pizzaz-map/main.tsx`.
   - Replace the token assignment to remove the hardcoded fallback.
   - Add a guard that renders an inline “missing token” UI when `import.meta.env.VITE_MAPBOX_TOKEN` is not set.
   - Ensure Mapbox initialization is skipped when the token is missing.

## Validation and Acceptance

Run from repo root:

    pnpm lint

If this is too heavy for a design-only pass, skip with a note and run after implementation.

Manual acceptance checks:

- Each modal traps focus, closes on Escape, and announces a dialog role to screen readers.
- Clicking outside the modal closes it without requiring manual `stopPropagation`.
- `ProEditConfigModal` visual layout matches the previous layout (title, mode switch, selects).
- `NewProjectModal` and `ProjectSettingsModal` layouts match existing presentation.
- The Pizzaz map widget does not initialize without `VITE_MAPBOX_TOKEN` and instead shows a clear error message.

## Idempotence and Recovery

These changes are safe to reapply. If a modal renders incorrectly, revert the file to its previous structure and reapply the `ModalDialog` wrapper carefully while preserving inner layout. If the map widget fails to render, ensure the token guard is only around Mapbox initialization and not around general layout.

## Artifacts and Notes

Expected replacement pattern for modals:

    <ModalDialog isOpen={isOpen} onClose={onClose} title="..." maxWidth="...px" className="...">
      ...existing content...
    </ModalDialog>

Expected token handling in Pizzaz map:

    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!token) {
      return <InlineErrorState message="VITE_MAPBOX_TOKEN is required to use the map widget." />;
    }
    mapboxgl.accessToken = token;

## Interfaces and Dependencies

- Use `ModalDialog` from `packages/ui/src/components/ui/overlays/Modal/Modal.tsx`.
- Do not introduce new modal primitives or dialog libraries.
- Keep component props stable; do not change external APIs for these components.
- Do not log token values or introduce fallback secrets for Mapbox.

Update note: Added explicit modal pattern constraints and token-handling contract to align with `react-ui-patterns` and security policy, plus strengthened manual acceptance checks and no-regression guidance.
