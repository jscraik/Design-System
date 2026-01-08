# aStudio Cloudflare Workers Deployment Template

Last updated: 2026-01-07

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Overview and essential workflows for this area
- Non-scope: Deep API reference or internal design rationale
- Owner: Infrastructure Team (confirm)
- Review cadence: Each release (confirm)

Deploy your aStudio widgets to Cloudflare Workers with automatic widget discovery and MCP server integration.

## Table of contents

- [Prerequisites](#prerequisites)
- [Quick start](#-quick-start)
- [Project structure](#-project-structure)
- [Configuration](#-configuration)
- [Features](#-features)
- [Deployment process](#-deployment-process)
- [Verify](#verify)
- [Troubleshooting](#-troubleshooting)

## Prerequisites

- Node.js 18+
- pnpm
- Cloudflare account + Wrangler configured

## 🚀 Quick Start

### 1. Setup

```bash
# From repo root
cd packages/cloudflare-template

# Copy environment variables
cp .env.example .env

# Edit .env with your Cloudflare Workers domain
# WORKER_DOMAIN_BASE="https://your-app.your-subdomain.workers.dev"
```

### 2. Development

```bash
# Start local development server
pnpm dev

# Your MCP server will be available at:
# http://localhost:8787/mcp
```

### 3. Deployment

```bash
# Build and deploy to Cloudflare Workers
pnpm build-deploy

# Or deploy separately
pnpm build
pnpm deploy
```

### 4. Add to ChatGPT

After deployment, integrate with ChatGPT. UI labels change over time, so follow the on-screen prompts for adding an MCP server or connector.

1. **Copy your MCP URL**: `https://your-app.your-subdomain.workers.dev/mcp`
2. **Open ChatGPT** and go to Settings
3. **Add a new MCP server/connector**
4. **Name**: `aStudio Widgets`
5. **URL**: `https://your-app.your-subdomain.workers.dev/mcp`
6. **Test**: Try "Show me the dashboard" in ChatGPT

For full steps and troubleshooting, see `docs/guides/CHATGPT_INTEGRATION.md`.

🎉 **You're done!** Your widgets are now available in ChatGPT.

## Verify

- `wrangler dev` responds at `http://localhost:8787/mcp`.
- `pnpm build-deploy` completes without errors.
- The MCP URL serves widgets in ChatGPT after connecting.

## 📁 Project Structure

```
packages/cloudflare-template/
├── src/
│   └── worker/
│       ├── index.ts                    # Main MCP server
│       └── widget-manifest.generated.ts # Auto-generated widget manifest
├── wrangler.jsonc                      # Cloudflare Workers configuration
├── vite.config.ts                     # Build configuration
└── .env.example                       # Environment variables template
```

## 🔧 Configuration

### Environment Variables

| Variable             | Required | Description                      |
| -------------------- | -------- | -------------------------------- |
| `WORKER_DOMAIN_BASE` | Yes      | Your Cloudflare Workers domain   |
| `WIDGET_DOMAIN`      | No       | Domain shown to users in ChatGPT |

### Wrangler Configuration

The `wrangler.jsonc` file configures:

- **Durable Objects** for persistent state
- **Assets binding** for serving widget files
- **Environment variables** for runtime configuration

### Customizing Tools

Edit `src/worker/index.ts` to add your own MCP tools:

```typescript
// In the registerExampleTools() method
this.server.registerTool(
  "my_custom_tool",
  {
    title: "My Custom Tool",
    description: "Does something amazing",
    _meta: {
      "openai/outputTemplate": `ui://widget/${widgetManifest["my-widget"].uri}`,
      "openai/widgetAccessible": true,
    },
  },
  async (args) => {
    // Your tool logic here
    return {
      content: [{ type: "text", text: "Tool executed!" }],
      structuredContent: args,
    };
  },
);
```

## 🎯 Features

### ✅ **Auto-Discovery**

- Automatically discovers all widgets from `@chatui/widgets`
- Generates content-hashed URIs for cache busting
- No manual widget registration required

### ✅ **Production Ready**

- Cloudflare Workers edge deployment
- Durable Objects for persistent state
- Environment-aware CSP configuration
- Error handling and logging

### ✅ **MCP Integration**

- Full MCP server with widget resources
- Example tools demonstrating widget usage
- OpenAI Apps SDK compliant

### ✅ **Development Experience**

- Local development server with hot reloading
- TypeScript support with proper types
- Environment validation

## 📊 Deployment Process

1. **Build Phase**
   - Widgets are built with content hashing
   - Manifest is generated with widget URIs
   - Assets are prepared for Cloudflare

2. **Deploy Phase**
   - Worker code is deployed to Cloudflare edge
   - Widget assets are uploaded to Cloudflare Assets
   - MCP server becomes available at `/mcp` endpoint

3. **Runtime**
   - MCP server auto-registers all widgets as resources
   - Tools are available for OpenAI integration
   - Widgets are served with proper CSP headers

## 🔗 Integration with ChatGPT

After deployment, add your MCP server to ChatGPT:

1. Copy your worker URL: `https://your-app.your-subdomain.workers.dev/mcp`
2. Add it as an MCP server in ChatGPT
3. Your widgets will be available as tools

## 🛠 Troubleshooting

### Common Issues

**Build fails with "WORKER_DOMAIN_BASE not found"**

- Ensure `.env` file exists with `WORKER_DOMAIN_BASE` set
- For production builds, this variable is required

**Widgets not loading**

- Check that `@chatui/widgets` is built: `pnpm -C packages/widgets build`
- Verify widget manifest is generated in `src/generated/`

**MCP server not responding**

- Check Cloudflare Workers logs: `wrangler tail`
- Verify environment variables are set in Cloudflare dashboard

### Development Tips

- Use `pnpm -C packages/cloudflare-template check` to validate before deployment
- Use `pnpm -C packages/cloudflare-template dev` for local development with Cloudflare environment
- Check `wrangler.jsonc` for Cloudflare-specific configuration

## 📚 Learn More

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [MCP Specification](https://modelcontextprotocol.io/)
- [OpenAI Apps SDK](https://developers.openai.com/apps-sdk/)
- [aStudio Widget System](../widgets/README.md)
