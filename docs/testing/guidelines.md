# Testing Guidelines

**Audience:** Developers (intermediate)

These guidelines operationalize ADR 005's "smart testing" approach: target 80% coverage, require Storybook for every component, and add tests only when they add signal.

## Goals

- **Target 80% statement coverage** (not 100%).
- **Avoid redundant tests** for Radix primitives and trivial props.
- **Prioritize Storybook** as the primary visual verification surface.

## Required Baseline (All Components)

Every UI component must include:

```
Component/
├── Component.tsx
└── Component.stories.tsx
```

Add a **unit test** only if the component has non-trivial logic (state, derived values, data formatting, debouncing, etc.).

```
Component/
├── Component.test.tsx   # Only when there is logic to verify
```

## Optional Tests (Only When Needed)

Add these **only when the component behavior warrants it**:

```
Component/
├── Component.a11y.test.tsx          # Custom keyboard/focus/ARIA behavior
├── Component.visual.test.tsx        # Complex visual variants/states
└── Component.interactions.test.tsx  # Multi-step or complex flows
```

## When to Add Tests

| Scenario | Test Type | Example |
| --- | --- | --- |
| Component has logic | Unit test | Debounce, data transformation, conditional rendering | 
| Component has custom a11y | A11y test | Custom keyboard interactions not provided by Radix |
| Component has visual variants | Storybook (required) | Size/variant/state permutations |
| Component has complex flow | Interaction test | Multi-step forms, compound widgets |
| Component wraps Radix | Storybook only | Dialog wrapper with minor styling |

## When **Not** to Add Tests

| Scenario | Reason |
| --- | --- |
| Component is trivial props | No meaningful logic to validate |
| Component wraps Radix UI primitives | Radix already validates behavior |
| Component only differs visually | Storybook already covers variants |
| Component has no user interaction | Nothing to assert beyond rendering |

## How to Run Tests

### Fast local checks

```bash
pnpm test
```

### Coverage report

```bash
pnpm test --coverage
open coverage/index.html
```

### Test suites by type

```bash
pnpm storybook:test     # Component tests
pnpm test:e2e:web       # E2E tests
pnpm test:visual:web    # Visual regression
pnpm test:a11y:widgets  # Accessibility tests
pnpm test:mcp-contract  # MCP contract tests
```

## Coverage Targets

The project targets **80%** for statements, branches, functions, and lines. If the coverage gate blocks CI, prioritize meaningful tests over exhaustive coverage.

## Examples

### ✅ Test component logic

```ts
expect(onSend).toHaveBeenCalledWith("Hello");
```

### ❌ Avoid testing Radix or trivial props

```ts
// Avoid testing Radix primitives or trivial rendering details
```

## Related Docs

- ADR 005: `docs/architecture/005-smart-testing.md`
- Test plan: `docs/TEST_PLAN.md`
