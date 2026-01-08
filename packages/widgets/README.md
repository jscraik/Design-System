# @chatui/widgets

Last updated: 2026-01-07

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Overview and essential workflows for this area
- Non-scope: Deep API reference or internal design rationale
- Owner: Widgets Team (confirm)
- Review cadence: Each release (confirm)

Standalone aStudio widget bundles used by the MCP server and Cloudflare Workers deployment template.

## Table of contents

- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Build](#build)
- [Verify](#verify)
- [Troubleshooting](#troubleshooting)
- [Related docs](#related-docs)

## Prerequisites

- Node.js 18+
- pnpm

## Structure

Widgets live under `packages/widgets/src/widgets/` grouped by category. Examples and demos live in
`packages/widgets/docs/examples/` and are not bundled into production widgets. Examples include:

- `widgets/chat/chat-view`
- `examples/dashboard-widget`
- `widgets/commerce/shopping-cart`
- `widgets/search/search-results`
- `widgets/pizzaz/pizzaz-gallery`

Shared utilities live in `packages/widgets/src/shared`, and global widget styles live in
`packages/widgets/src/styles.css`. Build-time Apps SDK manifest tooling lives in
`packages/widgets/src/sdk`.

## Development

```bash
pnpm -C packages/widgets dev
```

## Quick start

From the repo root:

```bash
pnpm build:widgets
```

## Build

```bash
pnpm -C packages/widgets build
```

From the repo root:

```bash
pnpm build:widgets
```

The Cloudflare deployment template copies widget assets from `packages/widgets/dist`.

## Verify

- `packages/widgets/dist/` contains HTML/JS bundles.
- `packages/cloudflare-template` can deploy the assets to Cloudflare.

## Troubleshooting

### Symptom: Widgets do not appear in MCP responses

Cause: Widgets are not built.
Fix:

```bash
pnpm build:widgets
```

### Symptom: Cloudflare deployment missing assets

Cause: `packages/widgets/dist` is empty.
Fix: Build widgets before deploying.

## Related docs

- Deployment: `docs/guides/CLOUDFLARE_DEPLOYMENT.md`
- MCP integration: `docs/guides/CHATGPT_INTEGRATION.md`
