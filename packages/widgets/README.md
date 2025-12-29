# @chatui/widgets

Standalone ChatUI widget bundles used by the MCP server and Cloudflare Workers deployment template.

## Structure

Widgets live under `packages/widgets/src/` as individual folders. Examples include:

- `dashboard-widget`
- `enhanced-example-widget`
- `shopping-cart`
- `search-results`

Shared utilities live in `packages/widgets/src/shared`.

## Development

```bash
pnpm -C packages/widgets dev
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

## Related docs

- Deployment: `docs/guides/CLOUDFLARE_DEPLOYMENT.md`
- MCP integration: `docs/guides/CHATGPT_INTEGRATION.md`
