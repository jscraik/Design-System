# CLAUDE.md

Last updated: 2026-01-09

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **library-first monorepo** for building consistent UI across ChatGPT widgets (via Apps SDK) and standalone React applications. The system uses OpenAI's Apps SDK UI as its visual foundation.

### Core Architecture

```
packages/
├── ui/          # React component library (main output)
├── runtime/     # Host adapters (embedded/standalone)
├── tokens/      # Design tokens (CSS variables, Tailwind preset)
├── cloudflare-template/ # Cloudflare Workers deployment template
└── widgets/     # Standalone widget bundles for ChatGPT

platforms/
├── web/         # Web apps (reference app + Storybook + templates gallery)
└── mcp/         # MCP server for ChatGPT integration
```

## Commands

### Development

```bash
pnpm install              # Install dependencies
pnpm dev                  # Web (localhost:5173)
pnpm dev:web              # Web only
pnpm dev:storybook        # Storybook only
```

### Building

```bash
pnpm build                # Build pipeline (web packages)
pnpm build:widget         # Build single-file widget HTML (for MCP)
pnpm build:lib            # Build all library packages (ui, runtime, tokens)
pnpm build:widgets        # Build widget bundles
```

### Tokens

```bash
pnpm generate:tokens      # Regenerate design tokens from source definitions
```

### Testing

```bash
pnpm test                 # Run UI package tests (vitest)
pnpm test:watch           # Watch mode
pnpm test:coverage        # Coverage report
pnpm test:e2e:web         # E2E tests with Playwright
pnpm test:a11y:widgets    # Accessibility tests
pnpm test:visual:web      # Visual regression tests
pnpm test:visual:update   # Update visual snapshots
```

### Linting/Formatting

```bash
pnpm lint                 # Biome
pnpm lint:compliance      # Check compliance rules (set COMPLIANCE_STRICT=1 for errors)
pnpm format               # Biome
pnpm format:check         # Check formatting
```

### MCP Server

```bash
pnpm mcp:dev              # MCP server in dev mode
pnpm mcp:start            # MCP server in production mode
pnpm test:mcp-contract    # Test MCP tool contracts
```

### Component Creation

```bash
pnpm new:component MyButton primitive     # Create UI primitive
pnpm new:component ChatToolbar chat       # Create chat component
pnpm new:component AdminTemplate template # Create template
pnpm new:component SettingsPage page      # Create page
```

### Release

```bash
pnpm changeset            # Create changeset
pnpm version-packages     # Apply version bumps
pnpm release              # Publish packages
```

## Package Rules

### `packages/ui` - React Component Library

**✅ Allowed:**

- UI components (forms, chat, layout, overlays, primitives)
- Icons from `packages/ui/src/icons` (Apps SDK UI first, Lucide fallback)
- Dependencies on `@openai/apps-sdk-ui` for styling
- `@radix-ui/*` primitives (within `packages/ui/src/primitives` only)

**❌ Prohibited:**

- No `window.openai` access (host-agnostic)
- No MCP logic
- No real network calls (only via injected host)
- No direct `lucide-react` imports (use the icons adapter)
- No `@mui/*` (warn-only for now)
- No direct `@radix-ui/*` imports outside `src/primitives`

### `packages/runtime` - Host Abstraction

**✅ Allowed:**

- Host interface (`Host` type)
- `createEmbeddedHost()` - wraps `window.openai`
- `createStandaloneHost()` - uses your API/mocks
- `HostProvider` React context

**❌ Prohibited:**

- No UI components

### `platforms/web/apps/web` / `platforms/web/apps/storybook`

**✅ Allowed:**

- Reference shells + preview
- Provide host adapters for demo

**❌ Prohibited:**

- No reusable UI source (goes in `packages/ui`)

### `platforms/mcp`

**✅ Allowed:**

- Integration harness (widget bundle + tool definitions)

**❌ Prohibited:**

- Not required for the library itself

## Library Imports

### Production code (prefer subpath exports for tree-shaking):

```ts
import { Button } from "@design-studio/ui/base";
import { ModelSelector } from "@design-studio/ui/navigation";
import { ChatSidebar } from "@design-studio/ui/chat";
```

### Dev/demo exports:

```ts
import { AStudioApp, DesignSystemPage } from "@design-studio/ui/dev";
```

### Experimental APIs (subject to breaking changes):

```ts
import { ChatFullWidthTemplate } from "@design-studio/ui/experimental";
```

## Styling System

### CSS Import Order (critical):

```css
@import "tailwindcss";
@import "@openai/apps-sdk-ui/css";
@import "@design-studio/tokens/foundations.css";

/* Tailwind v4 scanning */
@source "../node_modules/@openai/apps-sdk-ui";
@source "../../packages/ui/src";
```

### Design Tokens

- `@design-studio/tokens` encodes Figma foundations as CSS variables
- Source: `packages/tokens/src/foundations.css`
- These are **audit/extension only** - use Apps SDK UI classes in UI
- TS exports available for Storybook documentation pages

## Host Adapter Pattern

The runtime keeps components host-agnostic:

```ts
import { HostProvider, createStandaloneHost } from "@design-studio/runtime";

const host = createStandaloneHost("http://localhost:8787");
```

For embedded ChatGPT apps, use `createEmbeddedHost()` which wraps `window.openai`.

## Compatibility

- **React**: 19.x (required by Apps SDK UI)
- **TypeScript**: 5.9+
- **Node.js**: 18+
- **Apps SDK UI**: ^0.2.1

## Page System

The web app includes URL-based routing. Available pages:

- `/` - Chat (default)
- `/settings` - Settings
- `/profile` - Profile
- `/about` - About
- `/harness` - Widget Harness

See `docs/guides/PAGES_QUICK_START.md` for adding pages.

## Public API Surface

| Category           | Examples                                                     |
| ------------------ | ------------------------------------------------------------ |
| Chat UI components | ChatUIRoot, ChatHeader, ChatSidebar, ChatMessages, ChatInput |
| UI primitives      | Button, Dialog, Tabs, Tooltip                                |
| Icons              | Icons adapter, ChatGPTIcons                                  |
| Pages              | DesignSystemPage (via `@design-studio/ui/dev`)                     |
| Templates          | ChatFullWidthTemplate, DashboardTemplate (experimental)      |
| Utilities          | useControllableState                                         |

### API Stability

- **Stable**: Root exports, `@design-studio/ui/app`, `@design-studio/ui/chat`, `@design-studio/ui/modals`, `@design-studio/ui/settings`,
  `@design-studio/ui/base`, `@design-studio/ui/data-display`, `@design-studio/ui/feedback`, `@design-studio/ui/navigation`,
  `@design-studio/ui/overlays`, `@design-studio/ui/icons`
- **Experimental**: `@design-studio/ui/experimental`, `@design-studio/ui/templates`
- **Dev-only**: `@design-studio/ui/dev` (for Storybook/docs only)
---

# AI Assistance Governance (Model A)

This project follows **Model A** AI artifact governance: prompts and session logs are committed artifacts in the repository.

## When creating PRs with AI assistance

Claude must:

1. **Save artifacts to `ai/` directory**:
   - Final prompt → `ai/prompts/YYYY-MM-DD-<slug>.yaml`
   - Session summary → `ai/sessions/YYYY-MM-DD-<slug>.json`

2. **Commit both files in the PR branch**:
   ```bash
   git add ai/prompts/YYYY-MM-DD-<slug>.yaml ai/sessions/YYYY-MM-DD-<slug>.json
   ```

3. **Reference exact paths in PR body**:
   - Under **AI assistance** section:
     - Prompt: `ai/prompts/YYYY-MM-DD-<slug>.yaml`
     - Session: `ai/sessions/YYYY-MM-DD-<slug>.json`
   - In **AI Session Log** details:
     - Log file: `ai/sessions/YYYY-MM-DD-<slug>.json`
     - Prompt file: `ai/prompts/YYYY-MM-DD-<slug>.yaml`

4. **Do NOT**:
   - Embed prompt/log excerpts in the PR body
   - Link to external logs or pastebins
   - Skip creating artifacts when AI assistance is acknowledged

5. **Abort** if artifacts cannot be created and committed.

## Artifact Templates

See `ai/prompts/.template.yaml` and `ai/sessions/.template.json` for required fields.

## PR Template

All PRs must use `.github/PULL_REQUEST_TEMPLATE.md` which includes required AI disclosure sections.
