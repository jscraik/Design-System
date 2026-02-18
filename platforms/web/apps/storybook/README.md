# aStudio Storybook (platforms/web/apps/storybook)

Last updated: 2026-01-09

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Overview and essential workflows for this area
- Non-scope: Deep API reference or internal design rationale
- Owner: Design Systems Team (confirm)
- Review cadence: Quarterly (confirm)

Storybook is the primary component documentation and QA surface for `@design-studio/ui`.

## Table of contents

- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Common tasks](#common-tasks)
- [Verify](#verify)
- [Troubleshooting](#troubleshooting)
- [Related docs](#related-docs)

## What this app is for

- Browse and validate UI primitives, overlays, templates, and pages.
- Run interaction and accessibility checks in a dedicated UI surface.
- Keep component docs in sync with production code.

Story sources live in `packages/ui/src/storybook` and component stories are colocated
with the components under `packages/ui/src/app`, `packages/ui/src/components/ui`, and
`packages/ui/src/design-system/showcase`.

## Prerequisites

- Node.js 18+
- pnpm

## Quick start

From the repo root:

```bash
pnpm dev:storybook
```

Or run directly:

```bash
pnpm -C platforms/web/apps/storybook dev
```

Storybook runs at `http://localhost:6006` by default. Set `STORYBOOK_PORT=6007` to change it.

## Common tasks

Build the Storybook static site:

```bash
pnpm -C platforms/web/apps/storybook build
```

Run Storybook browser tests:

```bash
pnpm -C platforms/web/apps/storybook test
```

Run tests with coverage:

```bash
pnpm -C platforms/web/apps/storybook test:coverage
```

## Verify

1. Open `http://localhost:6006`.
2. Confirm stories render for Chat UI, UI primitives, and Pages sections.
3. Open a story with interactions and verify the Controls panel updates state.

## Troubleshooting

**Storybook does not start**

- Ensure dependencies are installed: `pnpm install`.
- Confirm port 6006 is free or set `STORYBOOK_PORT=6007` to change it.

**Stories render without styles**

- Verify `@openai/apps-sdk-ui/css` is imported in the Storybook setup.
- Rebuild `@design-studio/ui` if you changed CSS variables.

## Related docs

- `packages/ui/README.md` for component APIs.
- `docs/guides/DESIGN_GUIDELINES.md` for design and accessibility expectations.
