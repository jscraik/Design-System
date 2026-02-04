# FORJAMIE.md

**Last updated:** 2026-02-04
**Audience:** Developers (intermediate)
**Owner:** TBD (confirm)
**Review cadence:** TBD (confirm)

## TL;DR

aStudio is a library-first monorepo for building ChatGPT-style UI across multiple surfaces (widgets, web apps, and MCP integrations). The core output is `@design-studio/ui` (React components), supported by runtime adapters, tokens, widget bundles, and platform apps. Recent changes added explicit accessibility contracts for local primitives and wired the coverage matrix to reference them.

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
  - `docs/design-system/ADOPTION_CHECKLIST.md` — step-by-step integration checklist for web, widgets, and Tauri
  - `docs/testing/` — testing guidelines (smart testing rules)
  - `docs/design-system/COVERAGE_MATRIX_SURFACES.json` — surface usage source of truth (web/tauri/widgets)
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
- High-contrast support needs explicit coverage in Brand, Alias, and Mapped layers to avoid silent fallbacks.

## Weaknesses & Improvements

- **Coverage visibility:** Coverage goals exist, but measurement should be kept current. Consider adding a CI artifact or dashboard link in `docs/TEST_PLAN.md`.
- **Testing guidance location:** Ensure `docs/testing/` stays aligned with ADRs and contributor docs (like `CONTRIBUTING.md`).
- **A11y contract maintenance:** Keep `docs/design-system/A11Y_CONTRACTS.md` updated whenever a local primitive changes keyboard or ARIA behavior.

## Recent Changes

- **2026-02-15:** Expanded the token-reference doc with concrete verification steps, pipeline assumptions, and top troubleshooting fixes so token updates are easier to validate and recover. Impact: fewer token drift surprises and clearer remediation guidance.
- **2026-02-04:** Added high-contrast color tokens in the Brand layer, wired alias mapping/validation, and updated theme mappings/docs to use explicit HC overrides. Impact: high-contrast modes no longer fall back to dark tokens and are validated for coverage.
- **2026-02-14:** Refined light-mode token usage in compose and template block components so text, icons, and borders use semantic tokens with stronger contrast. Impact: clearer light-mode readability while keeping dark-mode consistency.
- **2026-02-16:** Clarified design guidelines to require token-only Tailwind utilities (with examples) and linked to the token API mapping doc. Impact: more consistent theming and fewer ad-hoc utility tokens.
- **2026-02-14:** Added a maintained testing guidelines doc and updated the smart-testing ADR reference so contributors have a single source for how to run tests, what types exist, and when to add them. Impact: clearer testing expectations and fewer broken doc links.
- **2026-02-14:** Documented accessibility contracts for local primitive components and updated the coverage matrix generator to link to them. Impact: local primitives now have explicit a11y expectations referenced in coverage reporting.
- **2026-02-15:** Added a design system adoption checklist and linked it from the README and cross-platform architecture docs. Impact: faster, more consistent onboarding for new surfaces.
- **2026-02-18:** Added a surface usage source of truth for the coverage matrix and expanded the generated outputs to track web, tauri, and widget adoption. Impact: clearer surface-level coverage reporting. (commit: e1dbc75e86496aa9def807fbf1b79f99f9ba8712)
- **2026-02-20:** Routed `text-muted-foreground` through the mapped muted token so light/dark variants follow the brand → alias → mapped chain without hex overrides. Impact: consistent muted text color resolution and easier token audits.
- **2026-02-15:** Reframed the design audit report to mark the prior issues and fix list as historical/resolved, keeping the audit status, issue list, and remediation notes aligned for compliance reference. Impact: readers can trust the report status at a glance.
- **2026-02-14:** Added a design system adoption guide that clarifies when to use Apps SDK UI vs `@design-studio/ui` vs tokens-only, and linked it from core design docs. Impact: clearer onboarding for consumers and better discovery of the design system setup.
- **2026-02-14:** Adjusted the coverage matrix generator to ignore barrel-only exports (like `forms`/`utils`) and regenerated the matrix so it reflects real UI components. Impact: cleaner coverage reporting for the design system.
- **2026-02-14:** Enforced non-color alias path validation with an explicit computed-value allowlist, updated alias rules documentation, and added tests so raw values are rejected unless allowlisted. Impact: stronger guardrails around token alias integrity.
