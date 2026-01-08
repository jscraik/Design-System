# Design Guidelines for ChatUI

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (beginner to intermediate)
- Scope: Task-focused instructions for this topic
- Non-scope: Comprehensive architecture reference
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


These guidelines keep the UI consistent across ChatGPT widgets and standalone apps.

## Table of contents

- [Core principles](#core-principles)
- [Component usage](#component-usage)
- [Layout and spacing](#layout-and-spacing)
- [Colors and typography](#colors-and-typography)
- [Icons and imagery](#icons-and-imagery)
- [Accessibility checklist](#accessibility-checklist)
- [Review standard](#review-standard)
- [Verify](#verify)
- [Related docs](#related-docs)

## Core principles

- **Use Apps SDK UI first.** Prefer `@openai/apps-sdk-ui` components and `@chatui/ui` wrappers.
- **Avoid raw tokens in production UI.** `@chatui/tokens` is for audits and extensions only.
- **Match the system defaults.** Stick to component defaults before adding custom styling.
- **Accessibility is non-negotiable.** Every interactive control must be usable by keyboard and assistive tech.

## Component usage

### Use the UI library exports

```tsx
import { Button, Card, IconButton } from "@chatui/ui";
```

If you need tree-shaking, use subpath exports:

```tsx
import { Button, SectionHeader } from "@chatui/ui/base";
```

### Avoid direct imports from underlying libraries

- Do not import `@radix-ui/*` outside `packages/ui/src/primitives`.
- Do not import `lucide-react` directly; use the icons adapter in `packages/ui/src/icons`.

## Layout and spacing

- Use the layout components (`Card`, `SectionHeader`, `CollapsibleSection`) before writing custom containers.
- Keep page layouts simple: one primary column, consistent padding, and predictable section breaks.
- Prefer `flex` and `grid` layouts with Tailwind utilities; avoid absolute positioning unless required.

## Colors and typography

- Use component defaults and semantic classes from Apps SDK UI.
- Do not hardcode hex colors or raw CSS variables in new UI code.
- If you need a token, add it to `@chatui/ui` or the Apps SDK UI layer, not directly in the page.

## Icons and imagery

- Use existing icons from the adapter before adding new SVGs.
- Provide accessible names for icon-only controls (aria-label, title, or visually hidden text).

## Accessibility checklist

Every new UI surface should pass these checks:

- All interactive elements are reachable by keyboard.
- Focus styles are visible (not color-only).
- Icon-only buttons have accessible labels.
- Dialogs and menus are announced correctly by screen readers.

Use the existing test workflows:

- `pnpm test:a11y:widgets`
- `docs/KEYBOARD_NAVIGATION_TESTS.md`

## Review standard

Before merging, verify:

- Component and styling choices are consistent with Apps SDK UI.
- No raw tokens or hex colors were introduced in UI code.
- A11y checks are satisfied and tests are updated if needed.

## Verify

- `pnpm lint:compliance` catches forbidden imports and token misuse.
- `pnpm test:a11y:widgets` confirms keyboard and screen reader paths for widgets.

## Related docs

- Component usage: `packages/ui/README.md`
- Page patterns: `docs/guides/PAGES_QUICK_START.md`
- Accessibility tests: `docs/KEYBOARD_NAVIGATION_TESTS.md`
