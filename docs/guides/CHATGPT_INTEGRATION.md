# ChatGPT Integration Guide

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


This guide explains how to connect a deployed ChatUI MCP server to ChatGPT so widgets appear inside chats.

If you have not deployed the MCP server yet, start with `docs/guides/CLOUDFLARE_DEPLOYMENT.md`.

## Table of contents

- [Prerequisites](#prerequisites)
- [Connect the MCP server in ChatGPT](#connect-the-mcp-server-in-chatgpt)
- [Verify the integration](#verify-the-integration)
- [Refresh metadata after changes](#refresh-metadata-after-changes)
- [Troubleshooting](#troubleshooting)
- [Security notes](#security-notes)
- [Related docs](#related-docs)

## Prerequisites

- An MCP server reachable over HTTPS (for example: `https://your-app.workers.dev/mcp`).
- Widgets built and deployed with the Cloudflare template.
- A successful `curl` to the MCP endpoint from your terminal.

```bash
curl https://your-app.workers.dev/mcp
```

## Connect the MCP server in ChatGPT

ChatGPT UI labels change over time. Look for **Apps**, **Connectors**, or **Tools** in Settings.

1. Open ChatGPT.
2. Go to Settings and find the area for Apps/Connectors/Tools.
3. Choose the option to add a new MCP server or connector.
4. Provide:
   - Name: `ChatUI Widgets` (or your team name)
   - URL: `https://your-app.workers.dev/mcp`
5. Save and confirm that ChatGPT lists your tools.

## Verify the integration

Start a new chat and try:

```
Show me the dashboard
Display the enhanced example widget
What widgets are available?
```

You should see interactive widgets rendered in the chat.

## Refresh metadata after changes

When tools or widgets change:

1. Redeploy the MCP server.
2. In ChatGPT settings, refresh or re-open the connector.
3. Re-test the prompts above.

## Troubleshooting

**MCP server not responding**

- Confirm the URL is reachable: `curl https://your-app.workers.dev/mcp`
- Check Cloudflare logs: `npx wrangler tail`

**Tools are missing**

- Ensure you redeployed after changes.
- Refresh the connector metadata in ChatGPT.
- Verify the server returns the tools in the MCP response.

**Widgets load as blank**

- Check browser console for CSP errors.
- Confirm `WORKER_DOMAIN_BASE` and `WIDGET_DOMAIN` in the Cloudflare template.
- Verify widget assets are present in the Cloudflare deployment.

## Security notes

- Use HTTPS only. ChatGPT will not connect to HTTP endpoints.
- Do not embed secrets in tool outputs or widget HTML.
- Keep local dev URLs (ngrok, localhost) out of production configs.

## Related docs

- Deployment: `docs/guides/CLOUDFLARE_DEPLOYMENT.md`
- Template README: `packages/cloudflare-template/README.md`
- MCP specification: `https://modelcontextprotocol.io/`
- Apps SDK UI: `https://developers.openai.com/apps-sdk/`

## Risks and assumptions
- Assumptions: TBD (confirm)
- Failure modes and blast radius: TBD (confirm)
- Rollback or recovery guidance: TBD (confirm)

## Verify
- TBD: Add concrete verification steps and expected results.

