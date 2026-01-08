# ChatUI Test Plan

Last updated: 2026-01-04

## Executive Summary

This test plan addresses the critical testing gaps identified in the codebase audit. The current estimated test coverage is <20%, which is insufficient for a production UI library. This plan outlines a comprehensive testing strategy to achieve 80%+ coverage.

## Current State

### Existing Tests
- **15 test files** exist (excluding node_modules)
- **Vitest** is configured as the test runner
- **Playwright** is configured for E2E testing
- **Visual regression tests** exist for web
- **Accessibility tests** exist for widgets

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
- [ ] Dialog/Modal (`packages/ui/src/components/ui/overlays/Dialog/`)
- [ ] Tooltip (`packages/ui/src/components/ui/overlays/Tooltip/`)

**Priority 2 - Chat Components**
- [ ] ChatHeader (`packages/ui/src/components/ui/chat/ChatHeader/`)
- [ ] ChatSidebar (`packages/ui/src/components/ui/chat/ChatSidebar/`)
- [ ] ChatMessages (`packages/ui/src/components/ui/chat/ChatMessages/`)
- [ ] ChatInput (`packages/ui/src/components/ui/chat/ChatInput/`)
- [ ] MessageBubble (`packages/ui/src/components/ui/chat/MessageBubble/`)

**Priority 3 - Form Components**
- [ ] FormField (`packages/ui/src/components/ui/forms/FormField/`)
- [ ] FormLabel (`packages/ui/src/components/ui/forms/FormLabel/`)
- [ ] FormDescription (`packages/ui/src/components/ui/forms/FormDescription/`)
- [ ] FormError (`packages/ui/src/components/ui/forms/FormError/`)

**Priority 4 - Navigation**
- [ ] Tabs (`packages/ui/src/components/ui/navigation/Tabs/`)
- [ ] Breadcrumb (`packages/ui/src/components/ui/navigation/Breadcrumb/`)
- [ ] ModelSelector (`packages/ui/src/components/ui/navigation/ModelSelector/`)

**Priority 5 - Feedback**
- [ ] Alert (`packages/ui/src/components/ui/feedback/Alert/`)
- [ ] Toast (`packages/ui/src/components/ui/feedback/Toast/`)
- [ ] Progress (`packages/ui/src/components/ui/feedback/Progress/`)

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

| Category | Current | Target | Priority |
|----------|---------|--------|----------|
| Core Primitives | ~10% | 90% | P0 |
| Chat Components | ~5% | 85% | P0 |
| Form Components | 0% | 80% | P1 |
| Navigation | 0% | 80% | P1 |
| Feedback | 0% | 75% | P2 |
| **Overall** | **<20%** | **80%** | - |

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
- [ ] Complete accessibility audit
- [ ] Document testing guidelines

## Success Metrics

- **Coverage**: 80%+ overall coverage
- **CI/CD**: All tests passing in CI
- **Performance**: Test suite runs in <5 minutes
- **Reliability**: <1% flaky test rate

## Commands

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run E2E tests
pnpm test:e2e:web

# Run accessibility tests
pnpm test:a11y:widgets

# Run visual regression tests
pnpm test:visual:web
```

## Documentation

After implementing this test plan, update:

1. **CONTRIBUTING.md**: Add testing guidelines for contributors
2. **Component READMEs**: Document how to test each component type
3. **CLAUDE.md**: Update with testing requirements for new components

---

**Owner**: TBD
**Review cadence**: Weekly during implementation, monthly after completion
**Status**: 📋 Planning Phase - Ready for implementation
