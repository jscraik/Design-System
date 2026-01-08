# OAuth Integration Guide for Apps SDK

Last updated: 2026-01-07

## Doc requirements

- Audience: Developers (intermediate)
- Scope: OAuth authentication patterns for MCP servers
- Non-scope: General MCP server setup
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

This guide explains how to implement OAuth authentication in MCP servers for ChatGPT Apps SDK integration.

## Overview

The Apps SDK supports OAuth 2.0 authentication flows. When a tool requires authentication, the server responds with MCP authorization metadata, triggering ChatGPT's authentication UI.

## Security Schemes

Tools can declare their authentication requirements via `securitySchemes`:

```javascript
// No authentication required
securitySchemes: [{ type: "noauth" }]

// OAuth required
securitySchemes: [{ type: "oauth2", scopes: ["read", "write"] }]

// Mixed: works without auth, enhanced with auth
securitySchemes: [
  { type: "noauth" },
  { type: "oauth2", scopes: [] }
]
```

## Tool Definition with OAuth

```javascript
const tools = [
  {
    name: "protected_tool",
    title: "Protected Action",
    description: "Requires authentication to access user data.",
    inputSchema: { /* ... */ },
    securitySchemes: [{ type: "oauth2", scopes: [] }],
    annotations: {
      destructiveHint: false,
      openWorldHint: false,
      readOnlyHint: true,
    },
    _meta: {
      "openai/outputTemplate": "ui://widget/my-widget.html",
      "openai/widgetAccessible": true,
    },
  },
];
```

## Protected Resource Metadata

Expose RFC 9728 metadata so clients can discover the authorization server:

```javascript
// Endpoint: /.well-known/oauth-protected-resource
const PROTECTED_RESOURCE_METADATA = {
  resource: "https://your-server.com/mcp",
  authorization_servers: ["https://your-auth0-tenant.auth0.com"],
  scopes_supported: ["read", "write"],
};
```

## WWW-Authenticate Response

When a request lacks valid authentication, return the `mcp/www_authenticate` hint:

```javascript
function buildWwwAuthenticateValue(error, description) {
  return `Bearer error="${error}", error_description="${description}", resource_metadata="${PROTECTED_RESOURCE_METADATA_URL}"`;
}

function oauthErrorResult(userMessage, error = "invalid_request", description) {
  return {
    content: [{ type: "text", text: userMessage }],
    _meta: {
      "mcp/www_authenticate": [
        buildWwwAuthenticateValue(error, description || userMessage)
      ]
    },
    isError: true,
  };
}
```

## Extracting Bearer Token

```javascript
function getBearerTokenFromRequest(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.toLowerCase().startsWith("bearer ")) {
    return null;
  }
  return authHeader.slice(7).trim() || null;
}
```

## Tool Handler with Auth Check

```javascript
async function handleProtectedTool(request, args) {
  const token = getBearerTokenFromRequest(request);
  
  if (!token) {
    return oauthErrorResult(
      "Authentication required: no access token provided.",
      "invalid_request",
      "No access token was provided"
    );
  }
  
  // Validate token (verify JWT, check expiry, etc.)
  const isValid = await validateToken(token);
  if (!isValid) {
    return oauthErrorResult(
      "Authentication failed: invalid or expired token.",
      "invalid_token",
      "The access token is invalid or expired"
    );
  }
  
  // Proceed with authenticated request
  return {
    content: [{ type: "text", text: "Success!" }],
    structuredContent: { /* widget data */ },
  };
}
```

## Auth0 Setup

### 1. Create an API

- Auth0 Dashboard → Applications → APIs → Create API
- Identifier: `https://your-domain.com/mcp`
- Profile: Auth0 (RS256 JWT)

### 2. Enable Default Audience

- Tenant Settings → Default Audience → Add your API identifier
- This ensures Auth0 issues unencrypted RS256 JWTs

### 3. Enable Dynamic Client Registration

- Dashboard → Settings → Advanced → Enable OIDC Dynamic Application Registration

### 4. Add Social Connection

- Authentication → Social → google-oauth2
- Advanced → Promote Connection to Domain Level

## Environment Variables

```env
AUTHORIZATION_SERVER_URL=https://your-tenant.auth0.com
RESOURCE_SERVER_URL=https://your-server.com/mcp
```

## Mixed Authentication Pattern

Some tools work without auth but provide enhanced functionality when authenticated:

```javascript
{
  name: "search_items",
  securitySchemes: [
    { type: "noauth" },           // Works without auth
    { type: "oauth2", scopes: [] } // Enhanced with auth
  ],
  // ...
}

async function handleSearch(request, args) {
  const token = getBearerTokenFromRequest(request);
  
  // Basic results for unauthenticated users
  const results = await searchPublicItems(args.query);
  
  // Enhanced results for authenticated users
  if (token && await validateToken(token)) {
    const personalizedResults = await searchPersonalizedItems(args.query, token);
    results.push(...personalizedResults);
  }
  
  return {
    content: [{ type: "text", text: `Found ${results.length} results` }],
    structuredContent: { results },
  };
}
```

## Widget Integration

Widgets can check auth status and trigger login:

```typescript
// Check if user is authenticated
const authStatus = await window.openai?.auth?.getStatus();

// Trigger login flow
if (!authStatus?.authenticated) {
  await window.openai?.auth?.login({ provider: "google" });
}

// Call protected tool
const result = await window.openai?.callTool("protected_tool", { /* args */ });
```

## Testing

1. Start MCP server with OAuth configured
2. Tunnel with ngrok: `ngrok http 8000`
3. Update `RESOURCE_SERVER_URL` with ngrok URL
4. Test unauthenticated call → should trigger auth UI
5. Complete OAuth flow → should return protected data

## Reference Implementation

See `_temp/openai-apps-sdk-examples/authenticated_server_python/` for a complete Python implementation using FastMCP.
