# FORJAMIE.md

**Last updated:** 2026-02-15
**Audience:** Developers (intermediate)
**Owner:** TBD (confirm)
**Review cadence:** TBD (confirm)

## TL;DR

aStudio is a library-first monorepo for building ChatGPT-style UI across multiple surfaces (widgets, web apps, and MCP integrations). The core output is `@design-studio/ui` (React components), supported by runtime adapters, tokens, widget bundles, and platform apps. Recent changes clarified token-reference verification, risks, and troubleshooting steps for the theming pipeline.

## Architecture & Data Flow (High Level)

```mermaid
flowchart LR
  subgraph Packages
    UI[@design-studio/ui]
    Runtime[@design-studio/runtime]
    Tokens[@design-studio/tokens]
    Widgets[packages/widgets]
  end

  subgraph Platforms
    Web[platforms/web/apps/web]
    Storybook[platforms/web/apps/storybook]
    MCP[platforms/mcp]
  end

  Tokens --> UI
  Runtime --> UI
  UI --> Web
  UI --> Storybook
  Widgets --> Web
  Web --> MCP
```

- **Tokens** provide design primitives consumed by UI components.
- **Runtime** offers host adapters (embedded vs standalone) used by UI and platform apps.
- **UI** feeds the web gallery and Storybook for development/validation.
- **Web** builds widget bundles consumed by the MCP server.

## Codebase Map

- `packages/` — reusable libraries
  - `ui/` — core React component library
  - `runtime/` — host adapters and providers
  - `tokens/` — design tokens + Tailwind preset
  - `widgets/` — standalone widget bundles
  - `cloudflare-template/` — MCP deployment template
- `platforms/` — app surfaces
  - `web/apps/web` — Widget Gallery (primary dev surface)
  - `web/apps/storybook` — component documentation/testing
  - `mcp/` — MCP server integration
- `docs/` — architecture, guides, test plans, and policies
  - `docs/architecture/` — ADRs and architecture map
  - `docs/testing/` — testing guidelines (smart testing rules)
- `scripts/` — build, compliance, and version sync tooling

## How to Run

```bash
pnpm install
pnpm dev           # Widget Gallery (localhost:5173)
pnpm dev:storybook # Storybook (localhost:6006)
```

## How to Test

```bash
pnpm test                 # Unit tests (Vitest)
pnpm test --coverage      # Coverage report
pnpm storybook:test       # Component tests
pnpm test:e2e:web         # E2E tests (Playwright)
pnpm test:visual:web      # Visual regression
pnpm test:a11y:widgets    # Accessibility tests
pnpm test:mcp-contract    # MCP contract tests
```

## Lessons Learned

- Docs drift is easy: keep ADR references pointing at maintained docs and update them in the same change-set.

## Weaknesses & Improvements

- **Coverage visibility:** Coverage goals exist, but measurement should be kept current. Consider adding a CI artifact or dashboard link in `docs/TEST_PLAN.md`.
- **Testing guidance location:** Ensure `docs/testing/` stays aligned with ADRs and contributor docs (like `CONTRIBUTING.md`).

## Recent Changes

- **2026-02-15:** Expanded the token-reference doc with concrete verification steps, pipeline assumptions, and top troubleshooting fixes so token updates are easier to validate and recover. Impact: fewer token drift surprises and clearer remediation guidance.
