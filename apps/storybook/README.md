# ChatUI Storybook (apps/storybook)

Storybook is the primary component documentation and QA surface for `@chatui/ui`.

## What this app is for

- Browse and validate UI primitives, overlays, templates, and pages.
- Run interaction and accessibility checks in a dedicated UI surface.
- Keep component docs in sync with production code.

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
pnpm -C apps/storybook dev
```

Storybook runs at `http://localhost:6006`.

## Common tasks

Build the Storybook static site:

```bash
pnpm -C apps/storybook build
```

Run Storybook browser tests:

```bash
pnpm -C apps/storybook test
```

Run tests with coverage:

```bash
pnpm -C apps/storybook test:coverage
```

## Verify

1. Open `http://localhost:6006`.
2. Confirm stories render for Chat UI, UI primitives, and Pages sections.
3. Open a story with interactions and verify the Controls panel updates state.

## Troubleshooting

**Storybook does not start**

- Ensure dependencies are installed: `pnpm install`.
- Confirm port 6006 is free or pass `-p` to change it: `pnpm -C apps/storybook dev -- -p 6007`.

**Stories render without styles**

- Verify `@openai/apps-sdk-ui/css` is imported in the Storybook setup.
- Rebuild `@chatui/ui` if you changed CSS variables.

## Related docs

- `packages/ui/README.md` for component APIs.
- `docs/guides/DESIGN_GUIDELINES.md` for design and accessibility expectations.
