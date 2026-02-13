# aStudio Test Plan

Last updated: 2026-02-06

## Executive Summary

This test plan addresses the critical testing gaps identified in the codebase audit. The estimated test coverage from the original audit was <20%, which is insufficient for a production UI library; this historical figure needs re-measurement with current tooling. This plan outlines a comprehensive testing strategy to achieve 80%+ coverage.

## Current Test Status

**Last updated**: 2026-01-18

For the latest test execution results and current status, see [docs/work/work_outstanding.md](../work/work_outstanding.md). That document tracks:
- 477 tests passing in `packages/ui`
- 37/107 Storybook browser test files failing due to Vitest browser + Radix dynamic import limitation (stories render correctly in Storybook UI)
- 65/107 Storybook browser test files passing (206 tests)

## Current State

### Existing Tests

- **15 test files** exist (excluding node_modules)
- **Vitest** is configured as the test runner
- **Playwright** is configured for E2E testing
- **Visual regression tests** exist for web
- **Accessibility tests** exist for widgets

### Coverage Status

**Note**: The <20% coverage estimate in the Executive Summary is historical and based on the original audit. Current actual coverage needs to be re-measured with up-to-date tooling. See [docs/work/work_outstanding.md](../work/work_outstanding.md) for current test execution metrics.

### Critical Gaps

- No unit tests for core UI components (Button, Input, Modal, etc.)
- No integration tests for widget functionality
- Chat components lack comprehensive testing
- Form components untested
- Navigation components untested

## Testing Strategy

### 1. Unit Tests (Vitest)

**Goal:** Test individual components in isolation

**Priority 1 - Core Primitives**

- [ ] Button (`packages/ui/src/components/ui/base/Button/`)
- [ ] Input (`packages/ui/src/components/ui/base/Input/`)
- [ ] Textarea (`packages/ui/src/components/ui/base/Textarea/`)
- [ ] Checkbox (`packages/ui/src/components/ui/base/Checkbox/`)
- [ ] Switch (`packages/ui/src/components/ui/base/Switch/`)
- [ ] Select (`packages/ui/src/components/ui/base/Select/`)
- [ ] Dialog/Modal (`packages/ui/src/components/ui/overlays/Modal/`)
- [ ] Tooltip (`packages/ui/src/components/ui/overlays/Tooltip/`)

**Priority 2 - Chat Components**

- [ ] ChatHeader (`packages/ui/src/app/chat/ChatHeader/`)
- [ ] ChatSidebar (`packages/ui/src/app/chat/ChatSidebar/`)
- [ ] ChatMessages (`packages/ui/src/app/chat/ChatMessages/`)
- [ ] ChatInput (`packages/ui/src/app/chat/ChatInput/`)
- [ ] Message rendering (in `packages/ui/src/app/chat/ChatMessages/`)

**Priority 3 - Form Components**

- [ ] FormField (`packages/ui/src/components/ui/forms/Form/` via FormField export)
- [ ] FormLabel (`packages/ui/src/components/ui/forms/Form/` via FormLabel export)
- [ ] FormDescription (`packages/ui/src/components/ui/forms/Form/` via FormDescription export)
- [ ] FormError (`packages/ui/src/components/ui/forms/Form/` via FormMessage export)

**Priority 4 - Navigation**

- [ ] Tabs (`packages/ui/src/components/ui/navigation/Tabs/`)
- [ ] Breadcrumb (`packages/ui/src/components/ui/navigation/Breadcrumb/`)
- [ ] ModelSelector (`packages/ui/src/components/ui/navigation/ModelSelector/`)

**Priority 5 - Feedback**

- [ ] AlertDialog (`packages/ui/src/components/ui/feedback/AlertDialog/`)
- [ ] Toast (`packages/ui/src/components/ui/feedback/Toast/`)
- [ ] Sonner (`packages/ui/src/components/ui/feedback/Sonner/`)

### 2. Integration Tests (Vitest)

**Goal:** Test component interactions and composition

**Priority 1 - Chat Workflows**

- [ ] Complete chat flow (send message → receive response)
- [ ] Chat mode switching (browse, create, casual)
- [ ] Thread management (create, delete, rename)
- [ ] Attachment handling

**Priority 2 - Form Workflows**

- [ ] Multi-step form completion
- [ ] Form validation
- [ ] Error handling

**Priority 3 - Widget Integration**

- [ ] Widget mounting/unmounting
- [ ] Host adapter switching (embedded vs standalone)
- [ ] Event handling

### 3. E2E Tests (Playwright)

**Goal:** Test complete user workflows

**Priority 1 - Core Chat**

- [ ] New chat creation
- [ ] Message sending and receiving
- [ ] History navigation
- [ ] Settings modification

**Priority 2 - Widget Embedding**

- [ ] Widget loads correctly
- [ ] Widget responds to host events
- [ ] Widget sends events to host

**Priority 3 - Cross-browser**

- [ ] Chrome compatibility
- [ ] Firefox compatibility
- [ ] Safari compatibility
- [ ] Edge compatibility

### 4. Visual Regression Tests (Playwright)

**Goal:** Catch unintended visual changes

**Priority 1 - Component States**

- [ ] Button (default, hover, active, disabled, loading)
- [ ] Input (default, focus, error, disabled)
- [ ] Dialog (open, closed, with/without backdrop)
- [ ] Message bubble (user, assistant, system)

**Priority 2 - Theme Variants**

- [ ] Light mode
- [ ] Dark mode
- [ ] High contrast mode (if applicable)

### 5. Accessibility Tests

**Goal:** Ensure WCAG 2.2 AA compliance

**Priority 1 - Keyboard Navigation**

- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical
- [ ] Focus indicators are visible

**Priority 2 - Screen Reader**

- [ ] ARIA labels are correct
- [ ] Role attributes are appropriate
- [ ] State changes are announced

**Priority 3 - Color Contrast**

- [ ] All text meets WCAG AA contrast ratios
- [ ] Interactive elements have sufficient contrast

## Test Structure

```
packages/ui/src/
├── components/
│   └── ui/
│       └── [component]/
│           ├── Component.tsx
│           ├── Component.test.tsx       ← Unit tests
│           └── Component.stories.tsx    ← Storybook stories
├── chat/
│   └── [chat-component]/
│       ├── Component.tsx
│       └── Component.test.tsx
└── __tests__/
    ├── integration/                     ← Integration tests
    │   ├── chat-flow.test.tsx
    │   └── widget-integration.test.tsx
    └── mocks/                           ← Test utilities
        ├── host-mock.ts
        └── test-helpers.tsx
```

## Test Utilities

Create shared test utilities in `packages/ui/src/testing/`:

- **`test-helpers.tsx`**: Common render functions, user event wrappers
- **`host-mock.ts`**: Mock host adapter for testing
- **`mock-data.ts`**: Sample messages, threads, config objects

## Coverage Targets

| Category        | Current  | Target  | Priority |
| --------------- | -------- | ------- | -------- |
| Core Primitives | ~10%     | 90%     | P0       |
| Chat Components | ~5%      | 85%     | P0       |
| Form Components | 0%       | 80%     | P1       |
| Navigation      | 0%       | 80%     | P1       |
| Feedback        | 0%       | 75%     | P2       |
| **Overall**     | **<20%** | **80%** | -        |

## Implementation Timeline

### Phase 1: Foundation (Week 1)

- [ ] Set up test utilities (`test-helpers.tsx`, `host-mock.ts`)
- [ ] Configure Vitest for better coverage reporting
- [ ] Write tests for 5 core primitives (Button, Input, Dialog, etc.)

### Phase 2: Core Components (Week 2-3)

- [ ] Complete all Priority 1 component tests
- [ ] Set up integration test framework
- [ ] Write chat flow integration tests

### Phase 3: Extended Coverage (Week 4-5)

- [ ] Complete Priority 2-4 component tests
- [ ] Expand integration test coverage
- [ ] Set up visual regression testing

### Phase 4: E2E & Accessibility (Week 6)

- [ ] Write critical E2E tests
- [ ] Complete accessibility audit (use `docs/operations/a11y-audit-template.md`)
- [ ] Document testing guidelines

## Success Metrics

- **Coverage**: 80%+ overall coverage
- **CI/CD**: All tests passing in CI
- **Performance**: Test suite runs in <5 minutes
- **Reliability**: <1% flaky test rate

## Test Tier Overview

> **Port binding note (as-of 2026-02-06):** Any tier that starts a dev server, preview server, or browser runner requires an environment that can bind local ports. In restricted sandbox environments where port binding fails (for example: `EPERM`), run those tiers in CI or on a host machine.

### Tier 1: Unit Tests (Vitest)
Fast, isolated component tests.
- **Command**: `pnpm test`
- **Runtime**: <30s
- **Coverage**: Component logic, hooks, utilities
- **Port binding:** ✅ Not required

### Tier 2: Smoke Tests (agent-browser)
Built-preview smoke tests for critical routes.
- **Commands**:
  - Local: `pnpm test:agent-browser` (requires dev server running)
  - CI: `pnpm test:agent-browser:ci` (builds, serves, tests, cleans up)
- **Runtime**: ~60s
- **Coverage**: Route loading, console errors, basic interactivity
- **Routes tested**:
  - `/` - ChatShellPage
  - `/harness` - HarnessPage with modal controls
  - `/templates` - TemplateBrowserPage
  - `/templates/template-shell` - Template detail page
- **Artifacts**:
  - Screenshots: `test-results/agent-browser/screenshots/`
  - Snapshots: `test-results/agent-browser/snapshots/`
- **Purpose**: Fast validation that built artifacts actually work (catches rendering errors, missing assets, JavaScript exceptions)
- **Port binding:** ❌ Required (preview/dev server)

### Tier 3: Component Tests (Storybook)
Interactive component documentation and tests.
- **Command**: `pnpm storybook:test`
- **Runtime**: ~2min
- **Coverage**: Component variants, interactions, a11y
- **Port binding:** ⚠️ Depends (non-browser tests: ✅; browser-mode / Storybook server: ❌)

### Tier 4: E2E Tests (Playwright)
Full user workflow automation.
- **Command**: `pnpm test:e2e:web`
- **Runtime**: ~5min
- **Coverage**: Critical user journeys, cross-browser
- **Port binding:** ❌ Required (dev/preview server)

### Tier 5: Visual Regression (Playwright)
Screenshot comparison testing.
- **Command**: `pnpm test:visual:web`
- **Runtime**: ~3min
- **Coverage**: Visual consistency across themes
- **Port binding:** ❌ Required (dev/preview server)

### Tier 6: Accessibility Tests (Playwright + axe-core)
Automated accessibility audits.
- **Command**: `pnpm test:a11y:widgets`
- **Runtime**: ~2min
- **Coverage**: WCAG 2.2 AA compliance for widgets
- **Manual audit artifact**: `docs/operations/a11y-audit-template.md`
- **Port binding:** ❌ Typically required (dev/preview server)

### Tier 7: MCP Contract Tests (Node.js native runner)
MCP tool contract validation.
- **Command**: `pnpm test:mcp-contract`
- **Runtime**: ~30s
- **Coverage**: MCP server tool contracts
- **Port binding:** ✅ Not required

## Commands

### Quick Test Workflow
```bash
# Tier 1: Fast unit tests (run locally before commit)
pnpm test

# Tier 2: Smoke tests (run after build)
pnpm build:web && pnpm test:agent-browser

# Full CI suite (run before PR)
pnpm test && pnpm test:agent-browser:ci && pnpm storybook:test && pnpm test:e2e:web
```

### Individual Test Tiers
```bash
# Tier 1: Unit tests
pnpm test

# Tier 2: Smoke tests
pnpm test:agent-browser                    # Local (dev server must be running)
pnpm test:agent-browser:ci                 # CI (builds, serves, tests, cleans up)

# Tier 3: Component tests
pnpm storybook:test

# Tier 4: E2E tests
pnpm test:e2e:web

# Tier 5: Visual regression
pnpm test:visual:web

# Tier 6: Accessibility
pnpm test:a11y:widgets

# Tier 7: MCP contract
pnpm test:mcp-contract
```
## Documentation

After implementing this test plan, update:

1. **CONTRIBUTING.md**: Add testing guidelines for contributors
2. **Component READMEs**: Document how to test each component type
3. **CLAUDE.md**: Update with testing requirements for new components

---

**Owner**: Jamie Scott Craik (@jscraik)
**Review cadence**: Monthly or each release (whichever is sooner)
**Status**: 📋 Planning Phase - Ready for implementation
