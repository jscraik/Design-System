# Cloudflare Workers Deployment Guide

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


## Deploy ChatUI Widgets to Cloudflare Workers

This guide shows how to deploy the ChatUI widget library to Cloudflare Workers, making your widgets available as a production MCP server for OpenAI integration.

## Table of Contents

1. [What You Get](#what-you-get)
2. [Architecture Overview](#architecture-overview)
3. [Setup Instructions](#setup-instructions)
4. [Verify the Deployment](#verify-the-deployment)
5. [Customization](#customization)
6. [Deployment Process](#deployment-process)
7. [ChatGPT Integration](#chatgpt-integration)
8. [Production Considerations](#production-considerations)
9. [Troubleshooting](#troubleshooting)
10. [Next Steps](#next-steps)

## Prerequisites

- Node.js 18+
- pnpm
- Cloudflare account with Wrangler configured (`npx wrangler login`)

## What You Get

- **Edge deployment** on Cloudflare's global network
- **Auto-discovery** of all ChatUI widgets
- **Content hashing** for cache busting
- **MCP server** ready for OpenAI ChatGPT integration
- **Durable Objects** for persistent state
- **Production-ready** error handling and logging

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   ChatGPT       │───▶│ Cloudflare       │───▶│ ChatUI Widgets  │
│   (OpenAI)      │    │ Workers Edge     │    │ (Your Library)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │ MCP Server       │
                       │ /mcp endpoint    │
                       └──────────────────┘
```

**Flow:**

1. ChatGPT calls your MCP server at `https://your-app.workers.dev/mcp`
2. Cloudflare Workers serves the MCP protocol
3. Widgets are served from Cloudflare Assets with content hashing
4. State persists via Durable Objects

## Setup Instructions

### Step 1: Prepare Your Environment

```bash
# Ensure widgets are built
pnpm -C packages/widgets build

# Navigate to the deployment template
cd packages/cloudflare-template

# Install dependencies
pnpm install

# Copy environment configuration
cp .env.example .env
```

### Step 2: Configure Environment

Edit `.env` with your Cloudflare Workers domain:

```bash
# Required: Your Cloudflare Workers domain
WORKER_DOMAIN_BASE="https://my-chatui-widgets.your-subdomain.workers.dev"

# Optional: Domain shown to users in ChatGPT
WIDGET_DOMAIN="https://your-company.com"
```

### Step 3: Authenticate with Cloudflare

```bash
# Login to Cloudflare (if not already done)
npx wrangler login

# Generate types for your worker
pnpm cf-typegen
```

### Step 4: Deploy

```bash
# Build and deploy in one command
pnpm build-deploy

# Or step by step
pnpm build    # Copies widgets and builds worker
pnpm deploy   # Deploys to Cloudflare Workers
```

### Step 5: Test Your Deployment

```bash
# Check if your MCP server is responding
curl https://your-app.workers.dev/mcp

# Should return MCP server information
```

## ✅ Verify the Deployment

Confirm these before wiring ChatGPT:

- `curl https://your-app.your-subdomain.workers.dev/mcp` returns JSON.
- The response lists your tools and widget resources.
- Widget assets resolve under the worker domain.

## Customization

### Adding Custom Tools

Edit `packages/cloudflare-template/src/worker/index.ts`:

```typescript
// In the registerExampleTools() method
this.server.registerTool(
  "my_custom_tool",
  {
    title: "My Custom Tool",
    description: "Does something amazing with my widgets",
    _meta: {
      "openai/outputTemplate": `ui://widget/${widgetManifest["my-widget"].uri}`,
      "openai/toolInvocation/invoking": "Processing...",
      "openai/toolInvocation/invoked": "Complete!",
      "openai/widgetAccessible": true,
    },
  },
  async (args, { _meta } = {}) => {
    // Your custom logic here
    return {
      content: [{ type: "text", text: "Custom tool executed!" }],
      structuredContent: {
        result: "success",
        data: args,
      },
    };
  },
);
```

### Environment-Specific Configuration

The deployment automatically configures:

- **CSP headers** based on your domains
- **Resource domains** for widget loading
- **Cache headers** for optimal performance

### Widget State Persistence

Durable Objects provide persistent state:

```typescript
// Widgets can use persistent state via useWidgetState()
const [state, setState] = useWidgetState<MyStateType>();

// State persists across:
// - Conversation turns
// - Widget reloads
// - Server restarts
```

## Deployment Process

### Build Phase

1. **Widget Discovery**: Scans `@chatui/widgets` for all widgets
2. **Asset Copying**: Copies HTML, CSS, JS files to `dist/client`
3. **Manifest Generation**: Creates manifest with content hashes
4. **Worker Build**: Compiles TypeScript worker code

### Deploy Phase

1. **Asset Upload**: Uploads widget files to Cloudflare Assets
2. **Worker Deploy**: Deploys MCP server to Cloudflare edge
3. **DNS Update**: Makes your MCP server available globally

### Runtime

1. **Auto-Registration**: All widgets become MCP resources
2. **Tool Availability**: Custom tools are available to ChatGPT
3. **Edge Serving**: Widgets served from nearest Cloudflare edge

## ChatGPT Integration

Use the dedicated ChatGPT integration guide once the MCP server is deployed:

- `docs/guides/CHATGPT_INTEGRATION.md`

## Production Considerations

### Performance

- **Edge caching** via Cloudflare CDN
- **Content hashing** prevents cache issues
- **Lazy loading** of widget assets
- **Optimized bundles** with vendor chunking

### Security

- **CSP headers** prevent XSS attacks
- **Domain validation** ensures proper origins
- **Environment isolation** between dev/prod

### Monitoring

- **Cloudflare Analytics** for request metrics
- **Worker logs** via `wrangler tail`
- **Error tracking** with structured logging

### Scaling

- **Automatic scaling** with Cloudflare Workers
- **Global distribution** across 300+ edge locations
- **Durable Objects** for consistent state

## Troubleshooting

### Common Issues

**"Widget manifest not found"**

```bash
# Ensure widgets are built first
pnpm -C packages/widgets build
```

**"WORKER_DOMAIN_BASE required"**

```bash
# Set in .env file
echo 'WORKER_DOMAIN_BASE="https://your-app.workers.dev"' >> .env
```

**"Deployment failed"**

```bash
# Check authentication
npx wrangler whoami

# Check configuration (from packages/cloudflare-template)
pnpm -C packages/cloudflare-template check
```

### Development Tips

```bash
# Local development with Cloudflare environment
pnpm -C packages/cloudflare-template dev

# Validate before deployment
pnpm -C packages/cloudflare-template check

# View live logs
npx wrangler tail

# Check worker status
npx wrangler status
```

## Next Steps

1. **Deploy your first widget server** using this guide
2. **Customize tools** for your specific use cases
3. **Monitor performance** via Cloudflare dashboard
4. **Scale up** by adding more widgets and tools

The Cloudflare Workers integration makes the ChatUI widget library production-ready with minimal configuration, providing a robust foundation for deploying interactive widgets at scale.

## Risks and assumptions
- Assumptions: TBD (confirm)
- Failure modes and blast radius: TBD (confirm)
- Rollback or recovery guidance: TBD (confirm)

## Verify
- TBD: Add concrete verification steps and expected results.

