# Accessibility Contracts for Local Primitives

**Last updated:** 2026-02-14

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Accessibility expectations for local primitive components.
- Non-scope: Radix fallbacks or upstream re-exports (see `docs/KEYBOARD_NAVIGATION_TESTS.md` for app-level tests).
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## How to use this document

Each local primitive component has an explicit accessibility contract below. Use these contracts when:

- implementing or refactoring the component,
- writing keyboard navigation or a11y tests,
- reviewing usage in widgets or apps.

**Contract format**

- **Keyboard & focus**: Required keyboard behavior and focus handling.
- **ARIA & semantics**: Required roles, labels, and accessible names.
- **States & announcements**: Required state attributes or screen reader announcements.
- **Notes**: Any known constraints or implementation guidance.

---

## Alert

- **Keyboard & focus**: No required keyboard behavior; alerts should not steal focus unless explicitly dismissible.
- **ARIA & semantics**: Use `role="alert"` for assertive messaging or `role="status"` for non-urgent updates.
- **States & announcements**: Ensure dynamic updates are announced when content changes.
- **Notes**: If dismissible, the close control must be keyboard reachable and labeled.

## Calendar

- **Keyboard & focus**: Arrow keys move day focus; Home/End jump to week boundaries; PageUp/PageDown change month; Enter/Space selects a day.
- **ARIA & semantics**: Use `role="grid"` with `gridcell` days; apply `aria-selected` for the chosen day.
- **States & announcements**: Disabled dates use `aria-disabled` and are skipped by selection.
- **Notes**: Focus stays within the calendar when navigating.

## Card

- **Keyboard & focus**: Non-interactive by default; if clickable, behaves like a button or link with Enter/Space.
- **ARIA & semantics**: Use semantic container elements; if interactive, apply proper role and accessible name.
- **States & announcements**: Provide `aria-pressed` or `aria-current` when representing selection.
- **Notes**: Avoid nested interactive elements with conflicting focus handling.

## CodeBlock

- **Keyboard & focus**: Non-interactive by default; copy buttons must be keyboard reachable.
- **ARIA & semantics**: Use `<pre><code>` semantics; provide `aria-label` for language if needed.
- **States & announcements**: Announce copy success via a polite live region.
- **Notes**: Ensure horizontal scrolling is keyboard accessible.

## Carousel

- **Keyboard & focus**: Arrow keys move between slides; Tab focuses interactive content within the active slide.
- **ARIA & semantics**: Use `aria-roledescription="carousel"` and label controls.
- **States & announcements**: Indicate active slide via `aria-current` and announce slide changes.
- **Notes**: Pause auto-advance on focus or user interaction.

## Chart

- **Keyboard & focus**: Provide focusable data points when interactive; arrow keys navigate between points.
- **ARIA & semantics**: Provide accessible summary text and use `role="img"` with `aria-label` if purely visual.
- **States & announcements**: Announce data values for focused points.
- **Notes**: Always supply a textual alternative for screen readers.

## CollapsibleSection

- **Keyboard & focus**: Toggle with Enter/Space on the trigger.
- **ARIA & semantics**: Use `aria-expanded` on the trigger and `aria-controls` to reference the content region.
- **States & announcements**: Content region has `role="region"` with an accessible label.
- **Notes**: Preserve focus when collapsing; do not move focus unexpectedly.

## Combobox

- **Keyboard & focus**: Arrow keys navigate options; Enter selects; Esc closes; Tab commits selection.
- **ARIA & semantics**: Use `role="combobox"` with `aria-expanded`, `aria-controls`, and `aria-activedescendant`.
- **States & announcements**: Announce active option and selection changes.
- **Notes**: Support typeahead and clear feedback when no results.

## Command

- **Keyboard & focus**: Arrow keys navigate items; Enter activates; Esc closes when in an overlay.
- **ARIA & semantics**: Use `role="listbox"` or `menu` based on context; items have `role="option"` or `menuitem`.
- **States & announcements**: Active item uses `aria-selected` or `data-highlighted` with SR support.
- **Notes**: Ensure search input is labeled and focused on open.

## ContextTag

- **Keyboard & focus**: If dismissible, the remove button is reachable via Tab and activated with Enter/Space.
- **ARIA & semantics**: Provide accessible label for the tag and any actions.
- **States & announcements**: Announce removal (e.g., via live region).
- **Notes**: Non-interactive tags should not be focusable.

## DatePicker

- **Keyboard & focus**: Trigger opens with Enter/Space; calendar uses the same contract as Calendar.
- **ARIA & semantics**: Trigger has `aria-haspopup="dialog"` or `grid"` depending on implementation.
- **States & announcements**: Selected date reflected via `aria-selected`.
- **Notes**: Focus moves into calendar on open and returns to trigger on close.

## Drawer

- **Keyboard & focus**: Focus trap within drawer; Esc closes; Tab cycles within.
- **ARIA & semantics**: Use `role="dialog"` with `aria-modal="true"` and labeled title.
- **States & announcements**: Announce open/close via focus changes.
- **Notes**: Restore focus to trigger on close.

## EmptyMessage

- **Keyboard & focus**: Non-interactive; should not receive focus.
- **ARIA & semantics**: Use `role="status"` for informative empty states.
- **States & announcements**: Announce changes when the empty state appears/disappears.
- **Notes**: If actionable CTAs exist, ensure they are labeled and focusable.

## ErrorBoundary

- **Keyboard & focus**: No required keyboard behavior.
- **ARIA & semantics**: Error message should be in a region with `role="alert"` or `status` as appropriate.
- **States & announcements**: Ensure error changes are announced.
- **Notes**: Provide retry or recovery controls with proper labels if rendered.

## forms

- **Keyboard & focus**: Delegates to contained form controls.
- **ARIA & semantics**: Ensure form fields have labels and groupings use `fieldset`/`legend` where appropriate.
- **States & announcements**: Validation errors must be associated with inputs via `aria-describedby`.
- **Notes**: Use `aria-invalid` for invalid fields.

## IconButton

- **Keyboard & focus**: Activated with Enter/Space; focus ring visible.
- **ARIA & semantics**: Must have an accessible name via `aria-label` or text.
- **States & announcements**: Use `aria-pressed` for toggle behavior.
- **Notes**: Icons alone are not sufficient for accessible labeling.

## Image

- **Keyboard & focus**: Non-interactive; not focusable unless clickable.
- **ARIA & semantics**: Provide meaningful `alt` text; use `alt=""` and `aria-hidden="true"` when decorative.
- **States & announcements**: N/A.
- **Notes**: If the image is a link, ensure the accessible name includes context beyond “image”.

## Indicator

- **Keyboard & focus**: Non-interactive by default.
- **ARIA & semantics**: If conveying status, provide `aria-label` or use `role="status"` with hidden text.
- **States & announcements**: Update status text for screen readers when state changes.
- **Notes**: Avoid relying solely on color to communicate state.

## Input

- **Keyboard & focus**: Standard text input behavior; Tab moves focus; Enter submits when within a form.
- **ARIA & semantics**: Must be labeled via `label`/`aria-label`/`aria-labelledby`.
- **States & announcements**: Use `aria-invalid` and `aria-describedby` for errors.
- **Notes**: Placeholder text is not a label.

## InputOTP

- **Keyboard & focus**: Arrow keys move between slots; typing fills current slot; Backspace moves backward.
- **ARIA & semantics**: Group slots with `role="group"` and label the entire OTP input.
- **States & announcements**: Announce completion or remaining slots if possible.
- **Notes**: Support paste to fill all slots.

## ListItem

- **Keyboard & focus**: If interactive, behaves like `button`/`link`; arrow navigation when in listbox context.
- **ARIA & semantics**: Use appropriate `role` based on parent (`listitem`, `option`, `menuitem`).
- **States & announcements**: Use `aria-selected` or `aria-current` when representing state.
- **Notes**: Non-interactive items should not be focusable.

## Markdown

- **Keyboard & focus**: Links and interactive elements remain keyboard accessible.
- **ARIA & semantics**: Preserve semantic headings, lists, and landmarks in rendered output.
- **States & announcements**: Ensure code blocks and alerts convey their context via semantics.
- **Notes**: Avoid stripping heading levels or link text that provide accessible names.

## Menu

- **Keyboard & focus**: Arrow keys move between items; Enter/Space activates; Esc closes.
- **ARIA & semantics**: Use `role="menu"` with items as `menuitem`, `menuitemcheckbox`, or `menuitemradio`.
- **States & announcements**: Selected items use `aria-checked`.
- **Notes**: Focus should be managed within the menu while open.

## MessageActions

- **Keyboard & focus**: Actions reachable via Tab; Enter/Space activates.
- **ARIA & semantics**: Provide accessible names for each action.
- **States & announcements**: Toggle actions use `aria-pressed`.
- **Notes**: Ensure focus order matches visual order.

## Modal

- **Keyboard & focus**: Focus trap inside modal; Esc closes; Tab/Shift+Tab cycle.
- **ARIA & semantics**: Use `role="dialog"` with `aria-modal="true"` and labeled title.
- **States & announcements**: Announce opening via focus placement.
- **Notes**: Restore focus to trigger on close.

## ModelBadge

- **Keyboard & focus**: Non-interactive by default; if clickable, behaves like a button/link.
- **ARIA & semantics**: Provide accessible name describing the model.
- **States & announcements**: If selectable, use `aria-current` or `aria-pressed`.
- **Notes**: Avoid purely color-based meaning.

## ModelSelector

- **Keyboard & focus**: Arrow keys navigate options; Enter selects; Esc closes.
- **ARIA & semantics**: Use `role="listbox"` with labeled trigger.
- **States & announcements**: Active option uses `aria-selected`.
- **Notes**: Ensure selection is announced.

## ModeSelector

- **Keyboard & focus**: Arrow keys move between modes; Enter/Space selects.
- **ARIA & semantics**: Use `role="radiogroup"` with each option as `role="radio"`.
- **States & announcements**: Selected option has `aria-checked="true"`.
- **Notes**: Provide visible focus styling.

## Pagination

- **Keyboard & focus**: Tab to controls; Enter/Space activates; arrow keys optional for prev/next.
- **ARIA & semantics**: Use `nav` with `aria-label="Pagination"`.
- **States & announcements**: Current page uses `aria-current="page"`.
- **Notes**: Disabled buttons use `aria-disabled`.

## RangeSlider

- **Keyboard & focus**: Arrow keys adjust value; PageUp/PageDown for larger steps; Home/End for min/max.
- **ARIA & semantics**: Use `role="slider"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow`.
- **States & announcements**: Announce value changes on focus and input.
- **Notes**: Provide accessible label for each thumb if multi-thumb.

## Resizable

- **Keyboard & focus**: Resize handles accessible via keyboard; arrow keys adjust size.
- **ARIA & semantics**: Use `role="separator"` with `aria-orientation`.
- **States & announcements**: Provide `aria-valuenow` where applicable.
- **Notes**: Ensure handles are focusable and visually indicated.

## SectionHeader

- **Keyboard & focus**: Non-interactive by default; if it includes actions, they must be keyboard accessible.
- **ARIA & semantics**: Use appropriate heading levels (`h2`, `h3`, etc.).
- **States & announcements**: N/A.
- **Notes**: Avoid skipping heading levels.

## SegmentedControl

- **Keyboard & focus**: Arrow keys move between segments; Enter/Space selects.
- **ARIA & semantics**: Use `role="radiogroup"` with segments as `radio`.
- **States & announcements**: Use `aria-checked` for selected segment.
- **Notes**: Provide visible focus styling.

## ShimmerText

- **Keyboard & focus**: Non-interactive; should not receive focus.
- **ARIA & semantics**: Use `aria-hidden="true"` if decorative loading indicator.
- **States & announcements**: Provide loading text via a separate live region if needed.
- **Notes**: Replace with real text content once loaded.

## Skeleton

- **Keyboard & focus**: Non-interactive; should not receive focus.
- **ARIA & semantics**: Use `aria-hidden="true"` if purely decorative.
- **States & announcements**: Avoid announcing loading skeletons; use a separate live region for load states.
- **Notes**: Replace with real content when available.

## Sonner

- **Keyboard & focus**: Toast actions reachable via Tab; Escape closes if supported.
- **ARIA & semantics**: Use `role="status"` for non-urgent, `role="alert"` for urgent toasts.
- **States & announcements**: Announce toast content via live region.
- **Notes**: Ensure close buttons are labeled.

## Table

- **Keyboard & focus**: Default table navigation; if interactive rows, provide keyboard handling.
- **ARIA & semantics**: Use semantic table elements; add `scope` or `headers` for cells.
- **States & announcements**: Sortable headers use `aria-sort`.
- **Notes**: Provide captions or summaries for complex tables.

## TagInput

- **Keyboard & focus**: Tab moves between input and tags; Backspace removes last tag; arrow keys navigate tags.
- **ARIA & semantics**: Use `role="combobox"` or `textbox` with `aria-describedby` for instructions.
- **States & announcements**: Announce tag additions/removals via polite live region.
- **Notes**: Provide clear instructions for keyboard users.

## TextLink

- **Keyboard & focus**: Enter activates; focus ring visible.
- **ARIA & semantics**: Use semantic `<a>` with descriptive link text.
- **States & announcements**: Use `aria-current` for active page links.
- **Notes**: Avoid “click here” link text without context.

## Textarea

- **Keyboard & focus**: Standard textarea behavior.
- **ARIA & semantics**: Must have a label; use `aria-describedby` for help text.
- **States & announcements**: Use `aria-invalid` for errors.
- **Notes**: Placeholder is not a label.

## Toast

- **Keyboard & focus**: Actions reachable via Tab; Escape closes if supported.
- **ARIA & semantics**: Use `role="status"` or `alert` depending on urgency.
- **States & announcements**: Announce content changes.
- **Notes**: Avoid focus theft unless user interacts.

## Toggle

- **Keyboard & focus**: Enter/Space toggles; Tab to focus.
- **ARIA & semantics**: Use `role="switch"` or `button` with `aria-pressed`.
- **States & announcements**: Use `aria-checked` or `aria-pressed` reflecting state.
- **Notes**: Label must describe on/off state.

## UseMobile

- **Keyboard & focus**: Non-interactive utility hook; no keyboard contract.
- **ARIA & semantics**: N/A.
- **States & announcements**: N/A.
- **Notes**: Components consuming this hook must satisfy their own contracts.

## utils

- **Keyboard & focus**: Non-interactive utility exports; no keyboard contract.
- **ARIA & semantics**: N/A.
- **States & announcements**: N/A.
- **Notes**: Downstream components must meet their accessibility requirements.

## ViewModeToggle

- **Keyboard & focus**: Arrow keys move between views; Enter/Space selects.
- **ARIA & semantics**: Use `role="radiogroup"` with options as `radio`.
- **States & announcements**: Selected option uses `aria-checked`.
- **Notes**: Provide visible focus indicators.
