# Dev Reference

## Table of Contents

- [Library imports](#library-imports)
- [Styling system](#styling-system)
- [Host adapter pattern](#host-adapter-pattern)
- [Compatibility](#compatibility)
- [Page system](#page-system)
- [Public API surface](#public-api-surface)
- [Component creation](#component-creation)
- [MCP server](#mcp-server)

---

## Library imports

### Production code (prefer subpath exports for tree-shaking)

```ts
import { Button } from "@design-studio/ui/base";
import { ModelSelector } from "@design-studio/ui/navigation";
import { ChatSidebar } from "@design-studio/ui/chat";
```

### Dev/demo

```ts
import { AStudioApp, DesignSystemPage } from "@design-studio/ui/dev";
```

### Experimental (subject to breaking changes)

```ts
import { ChatFullWidthTemplate } from "@design-studio/ui/experimental";
```

---

## Styling system

### CSS import order (critical)

```css
@import "tailwindcss";
@import "@openai/apps-sdk-ui/css";
@import "@design-studio/tokens/foundations.css";

@source "../node_modules/@openai/apps-sdk-ui";
@source "../../packages/ui/src";
```

### Design tokens

- `@design-studio/tokens` encodes Figma foundations as CSS variables.
- Source: `packages/tokens/src/foundations.css`.
- Audit/extension only — use Apps SDK UI classes in UI components.
- TS exports available for Storybook documentation pages.

---

## Host adapter pattern

The runtime keeps components host-agnostic:

```ts
import { HostProvider, createStandaloneHost } from "@design-studio/runtime";

const host = createStandaloneHost("http://localhost:8787");
```

For embedded ChatGPT apps: `createEmbeddedHost()` wraps `window.openai`.

---

## Compatibility

| | Version |
|---|---|
| React | 19.x (required by Apps SDK UI) |
| TypeScript | 5.9+ |
| Node.js | 18+ |
| Apps SDK UI | ^0.2.1 |

---

## Page system

URL-based routing in the web app. Available pages:

- `/` — Chat (default)
- `/settings` — Settings
- `/profile` — Profile
- `/about` — About
- `/harness` — Widget Harness

See `docs/guides/PAGES_QUICK_START.md` for adding pages.

---

## Public API surface

| Category | Examples |
|---|---|
| Chat UI components | ChatUIRoot, ChatHeader, ChatSidebar, ChatMessages, ChatInput |
| UI primitives | Button, Dialog, Tabs, Tooltip |
| Icons | Icons adapter, ChatGPTIcons |
| Pages | DesignSystemPage (via `@design-studio/ui/dev`) |
| Templates | ChatFullWidthTemplate, DashboardTemplate (experimental) |
| Utilities | useControllableState |

### API stability

- **Stable**: `@design-studio/ui/app`, `/chat`, `/modals`, `/settings`, `/base`, `/data-display`, `/feedback`, `/navigation`, `/overlays`, `/icons`
- **Experimental**: `@design-studio/ui/experimental`, `/templates`
- **Dev-only**: `@design-studio/ui/dev` (Storybook/docs only)

---

## Component creation

```bash
pnpm new:component MyButton primitive     # UI primitive
pnpm new:component ChatToolbar chat       # Chat component
pnpm new:component AdminTemplate template # Template
pnpm new:component SettingsPage page      # Page
```

---

## MCP server

```bash
pnpm mcp:dev              # Dev mode
pnpm mcp:start            # Production mode
pnpm test:mcp-contract    # Test MCP tool contracts
pnpm build:widget         # Build single-file widget HTML (for MCP)
```
