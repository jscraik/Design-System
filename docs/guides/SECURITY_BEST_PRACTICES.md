# Security Best Practices

Last updated: 2026-01-04

## Doc requirements
- Audience: Maintainers and security reviewers
- Scope: Security posture, guidance, and required practices
- Non-scope: Feature usage or product marketing
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


This guide covers security best practices for deploying ChatUI applications and widgets.

## Table of Contents

- [Content Security Policy (CSP)](#content-security-policy-csp)
- [Rate Limiting](#rate-limiting)
- [Widget Security](#widget-security)
- [Environment Variables](#environment-variables)
- [CORS Configuration](#cors-configuration)
- [Dependency Security](#dependency-security)

## Content Security Policy (CSP)

### Recommended CSP Headers

For production deployments, implement the following Content Security Policy headers:

```nginx
# Nginx configuration
add_header Content-Security-Policy "
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.openai.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://api.openai.com https://*.openai.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
" always;
```

### Vite Configuration

Add CSP meta tag in your HTML template:

```html
<!-- platforms/web/apps/web/index.html -->
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.openai.com;"
/>
```

### Cloudflare Workers

For Cloudflare deployments, add CSP headers in your worker:

```typescript
// packages/cloudflare-template/src/worker/index.ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const response = await handleRequest(request, env);

    // Add security headers
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
    );
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

    return response;
  },
};
```

### CSP for Widgets

Widgets embedded in ChatGPT need relaxed CSP due to iframe constraints:

```typescript
// Widget-specific CSP considerations
const widgetCSP = {
  "script-src": "'self' 'unsafe-inline' 'unsafe-eval'", // Required for dynamic imports
  "style-src": "'self' 'unsafe-inline'", // Required for styled components
  "connect-src": "'self' https://api.openai.com",
  "img-src": "'self' data: https:",
};
```

## Rate Limiting

### MCP Server Rate Limiting

Implement rate limiting for MCP endpoints to prevent abuse:

```javascript
// platforms/mcp/server.js - Add rate limiting middleware
import rateLimit from "express-rate-limit";

const mcpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply to MCP endpoints
app.use("/mcp", mcpLimiter);
```

### Tool Call Rate Limiting

Implement per-tool rate limits:

```javascript
const toolRateLimits = new Map();

function checkToolRateLimit(toolName, userId) {
  const key = `${userId}:${toolName}`;
  const now = Date.now();
  const limit = toolRateLimits.get(key) || { count: 0, resetAt: now + 60000 };

  if (now > limit.resetAt) {
    limit.count = 0;
    limit.resetAt = now + 60000;
  }

  if (limit.count >= 10) {
    // 10 calls per minute per tool
    throw new Error("Rate limit exceeded for this tool");
  }

  limit.count++;
  toolRateLimits.set(key, limit);
}
```

### Cloudflare Rate Limiting

Use Cloudflare's built-in rate limiting:

```typescript
// packages/cloudflare-template/src/worker/index.ts
import { RateLimiter } from "@cloudflare/workers-rate-limit";

const limiter = new RateLimiter({
  limit: 100,
  window: 60, // 100 requests per 60 seconds
});

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";

    const { success } = await limiter.limit({ key: ip });
    if (!success) {
      return new Response("Rate limit exceeded", { status: 429 });
    }

    return handleRequest(request, env);
  },
};
```

## Widget Security

### Input Validation

Always validate and sanitize user inputs in widgets:

```typescript
// packages/widgets/src/shared/validation.ts
export function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .trim()
    .slice(0, 1000); // Limit length
}

export function validateToolInput(input: unknown): boolean {
  if (typeof input !== "object" || input === null) {
    return false;
  }

  // Add specific validation logic
  return true;
}
```

### XSS Prevention

Use proper escaping for dynamic content:

```typescript
// Use React's built-in XSS protection
function SafeComponent({ userContent }: { userContent: string }) {
  // React automatically escapes text content
  return <div>{userContent}</div>;

  // For HTML content, use DOMPurify
  // return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />;
}
```

### Secure Tool Calls

Validate tool parameters before execution:

```typescript
async function callTool(toolName: string, params: unknown) {
  // Validate tool name
  const allowedTools = ["get_weather", "search", "calculate"];
  if (!allowedTools.includes(toolName)) {
    throw new Error("Invalid tool name");
  }

  // Validate parameters
  if (!validateToolInput(params)) {
    throw new Error("Invalid tool parameters");
  }

  // Execute tool
  return await window.openai?.callTool?.(toolName, params);
}
```

## Environment Variables

### Never Commit Secrets

```bash
# .gitignore should include:
.env
.env.local
.env.*.local
*.key
*.pem
```

### Environment Variable Validation

```typescript
// packages/runtime/src/env.ts
export function validateEnv() {
  const required = ["VITE_API_BASE", "VITE_MCP_URL"];

  for (const key of required) {
    if (!import.meta.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}
```

### Secure Environment Loading

```typescript
// platforms/web/apps/web/src/config.ts
export const config = {
  apiBase: import.meta.env.VITE_API_BASE || "http://localhost:8787",
  mcpUrl: import.meta.env.VITE_MCP_URL || "http://localhost:8787/mcp",
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;

// Validate in production
if (config.isProd && config.apiBase.includes("localhost")) {
  console.error("Production build using localhost API");
}
```

## CORS Configuration

### MCP Server CORS

```javascript
// platforms/mcp/server.js
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? ["https://chat.openai.com", "https://chatgpt.com"]
      : true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));
```

### Cloudflare Workers CORS

```typescript
function handleCORS(request: Request): Response | null {
  const origin = request.headers.get("Origin");
  const allowedOrigins = ["https://chat.openai.com", "https://chatgpt.com"];

  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": allowedOrigins.includes(origin || "") ? origin! : "",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  return null;
}
```

## Dependency Security

### Regular Audits

```bash
# Run security audits regularly
pnpm audit

# Fix vulnerabilities automatically
pnpm audit --fix

# Check for outdated packages
pnpm outdated
```

### Automated Dependency Updates

Add Dependabot configuration:

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    groups:
      development-dependencies:
        dependency-type: "development"
      production-dependencies:
        dependency-type: "production"
```

### Lock File Integrity

```bash
# Verify lock file integrity
pnpm install --frozen-lockfile

# In CI/CD
pnpm install --frozen-lockfile --prefer-offline
```

## Security Checklist

### Pre-Deployment

- [ ] CSP headers configured
- [ ] Rate limiting implemented
- [ ] CORS properly configured
- [ ] Environment variables validated
- [ ] No secrets in code
- [ ] Dependencies audited
- [ ] Input validation in place
- [ ] XSS prevention implemented
- [ ] HTTPS enforced
- [ ] Security headers set

### Widget Development

- [ ] Input sanitization
- [ ] Tool parameter validation
- [ ] Error messages don't leak sensitive info
- [ ] No eval() or Function() constructors
- [ ] External resources from trusted sources only
- [ ] State management secure
- [ ] No localStorage for sensitive data

### Monitoring

- [ ] Error tracking configured
- [ ] Rate limit monitoring
- [ ] Failed authentication logging
- [ ] Suspicious activity alerts
- [ ] Regular security audits scheduled

## Incident Response

### Security Issue Reporting

Follow the process in [SECURITY.md](../../SECURITY.md):

1. Do not open public issues
2. Use GitHub Security Advisories
3. Contact maintainers privately
4. Include reproduction steps
5. Assess impact

### Response Timeline

- Initial response: 5 business days
- Status updates: Weekly
- Fix timeline: Based on severity
  - Critical: 24-48 hours
  - High: 1 week
  - Medium: 2 weeks
  - Low: Next release

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Cloudflare Security](https://developers.cloudflare.com/workers/runtime-apis/web-crypto/)
- [React Security Best Practices](https://react.dev/learn/security)

## Related Documentation

- [SECURITY.md](../../SECURITY.md) - Security policy
- [BUILD_PIPELINE.md](../BUILD_PIPELINE.md) - Build security
- [Widget Architecture](../architecture/WIDGET_ARCHITECTURE.md) - Widget security patterns

## Risks and assumptions
- Assumptions: TBD (confirm)
- Failure modes and blast radius: TBD (confirm)
- Rollback or recovery guidance: TBD (confirm)

## Verify
- TBD: Add concrete verification steps and expected results.

## Troubleshooting
- TBD: Add the top 3 failure modes and fixes.

