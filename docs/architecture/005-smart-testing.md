# ADR 005: Smart Testing Strategy (80% Coverage)

**Status:** Accepted
**Date:** 2026-01-26
**Decision:** Target 80% test coverage with "smart" testing approach
**Context:** DesignStudio Migration Phase 1

---

## Context

AStudio currently has **unknown test coverage** (not measured).

### Problems with 100% Coverage

1. **Visual tests are flaky:** Screenshot comparisons fail on minor diffs
2. **A11y tests redundant:** Radix UI already handles accessibility
3. **Maintenance burden:** 400 test files for 100 components
4. **Slow feedback:** More tests = longer CI runs
5. **Diminishing returns:** Last 20% takes 80% of effort

### Industry Reality

- **Radix UI:** Already handles a11y, keyboard, focus, ARIA
- **Visual regression:** Tools like Argos catch what unit tests miss
- **Storybook:** Component isolation catches most issues
- **100% is unrealistic:** Even major libraries don't have 100% coverage

## Decision

Target **80% statement coverage** with "smart" testing:

### Required (All Components)

```typescript
Component/
├── Component.tsx           # Implementation
├── Component.test.tsx        # Unit tests (if logic)
└── Component.stories.tsx     # Storybook (REQUIRED)
```

**Every component MUST have:**
1. **Storybook story:** For visual testing and documentation
2. **Unit tests (if logic):** Only if component has non-trivial logic
3. **A11y tests (if custom):** Only if component has custom interactive behavior

### Optional (When Needed)

```typescript
Component/
├── Component.a11y.test.tsx     # A11y tests (custom interactive only)
├── Component.visual.test.tsx   # Visual tests (visual variants only)
└── Component.interactions.test.tsx  # Interaction tests (complex flows only)
```

**Add these ONLY when:**
- **A11y tests:** Component has custom keyboard/focus behavior (not wrapping Radix)
- **Visual tests:** Component has visual variants (colors, sizes, states)
- **Interaction tests:** Component has complex user flows

### Coverage Targets

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      statements: 80,  // Target 80% statement coverage
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
});
```

### What NOT to Test

```typescript
// ❌ Don't test: Radix UI primitives
test("Dialog renders", () => {
  render(<Dialog open={true}>Content</Dialog>);
  // Radix already tests this
});

// ❌ Don't test: Trivial props
test("Button renders with className", () => {
  render(<Button className="test">Click</Button>);
  // Too trivial, no logic
});

// ❌ Don't test: Storybook covers this
test("Button renders variants", () => {
  render(<Button variant="primary">Primary</Button>);
  // Storybook already covers visual variants
});
```

### What TO Test

```typescript
// ✅ Test: Component logic
test("ChatInput debounces send", async () => {
  const onSend = vi.fn();
  render(<ChatInput onSend={onSend} debounceMs={100} />);

  await user.type(screen.getByRole("textbox"), "Hello{Enter}");
  await waitFor(() => expect(onSend).toHaveBeenCalledTimes(1));
});

// ✅ Test: Custom behavior
test("ChatInput stops propagation when variant=compound", async () => {
  const onClick = vi.fn();
  render(
    <div onClick={onClick}>
      <ChatInput variant="compound" />
    </div>
  );

  await user.click(screen.getByRole("textbox"));
  expect(onClick).not.toHaveBeenCalled();
});

// ✅ Test: Integration
test("ChatInput calls onSend with trimmed text", async () => {
  const onSend = vi.fn();
  render(<ChatInput onSend={onSend} />);

  await user.type(screen.getByRole("textbox"), "  Hello  {Enter}");
  expect(onSend).toHaveBeenCalledWith("Hello");
});
```

## Rationale

### Why 80% instead of 100%?

1. **Diminishing returns:** Last 20% takes 80% of effort
2. **Radix coverage:** Radix UI already has 100% coverage
3. **Visual tests are flaky:** Screenshot diffs fail on minor changes
4. **Storybook covers visual:** Don't need unit tests for visual variants
5. **Industry standard:** Major libraries target 70-80% (Radix, Chakra, etc.)

### Why "smart" testing?

1. **Focus on value:** Test what matters (logic, behavior, integration)
2. **Skip redundancy:** Don't test what Radix already tests
3. **Storybook first:** Visual testing > unit testing for UI
4. **Pragmatic:** Accept 80% is good enough

### Why Storybook REQUIRED?

1. **Visual testing:** Catches what unit tests miss
2. **Documentation:** Living documentation for components
3. **Accessibility:** Built-in a11y addon
4. **Review surface:** Easy to review changes visually

### Why optional a11y/visual/interaction tests?

1. **Not always needed:** Simple components don't need them
2. **Flaky:** Visual tests fail on minor diffs
3. **Redundant:** Radix already handles a11y
4. **Add when needed:** Scale up testing as complexity increases

## Consequences

### Positive

1. **Faster CI:** Fewer tests = faster feedback
2. **Less maintenance:** Fewer test files to maintain
3. **Focus on value:** Test what matters (logic, behavior)
4. **Storybook first:** Visual testing catches most issues

### Negative

1. **Not 100%:** Some edge cases may be missed
2. **Subjective:** "Smart" testing requires judgment
3. **Documentation:** Need clear guidelines on what to test

### Mitigations

1. **80% target:** High enough to catch most issues
2. **Storybook required:** Visual testing catches what unit tests miss
3. **Clear guidelines:** Document what to test and what not to test
4. **Code review:** Reviewers check for missing tests

## Testing Guidelines

### When to add tests

| Scenario | Test Type | Example |
|----------|-----------|---------|
| Component has logic | Unit test | ChatInput debouncing |
| Component has custom a11y | A11y test | Custom keyboard handler |
| Component has visual variants | Storybook | Button variants |
| Component has complex flow | Interaction test | Multi-step form |
| Component wraps Radix | Storybook only | Dialog wrapper |

### When NOT to add tests

| Scenario | Reason |
|----------|--------|
| Component is trivial props | No logic to test |
| Component wraps Radix | Radix already tested |
| Component has visual variants | Storybook covers this |
| Component has no user interaction | Nothing to test |

## Coverage Report

```bash
# Run tests with coverage
pnpm test --coverage

# View coverage report
open coverage/index.html
```

### CI Enforce (example; not currently enforced in CI)

```yaml
# .github/workflows/ci.yml (example only; not currently enforced)
- name: Test
  run: pnpm test --coverage

- name: Enforce coverage
  run: |
    if [[ $(jq '.total.lines.pct' coverage/coverage-summary.json) -lt 80 ]]; then
      echo "❌ Coverage below 80%"
      exit 1
    fi
```

## Related Decisions

- [ADR 001: Package Structure](./001-package-structure.md)
- [ADR 002: Hybrid Component Pattern](./002-hybrid-components.md)

## References

- Vitest config: `packages/ui/vitest.config.ts`
- Testing guide: `docs/testing/guidelines.md`
- CI workflow: `.github/workflows/ci.yml`

---

**Last Updated:** 2026-02-06
