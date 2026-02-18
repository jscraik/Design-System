# Hybrid Pattern Validation Report
**Date:** 2026-01-26
**Phase:** Validation - Week 1

---

## Executive Summary

This document validates the hybrid component pattern for DesignStudio. The hybrid pattern balances developer experience (DX) with flexibility, offering props-based APIs for simple cases and compound patterns for complex needs.

---

## Patterns Validated

### 1. Simple Component (Props-Based Only)

**File:** `SimpleComponent.tsx`

**Use Case:** 80% of components - simple, standard use cases

**Example:**
```tsx
<SimpleComponent variant="primary" size="md" onClick={handleClick}>
  Click me
</SimpleComponent>
```

**Metrics:**
- Code size: ~1KB
- DX score: 5/5 (simple, clear)
- Flexibility: 3/5 (limited to props)

**Components suited for this pattern:**
- Button, Input, Checkbox, Toggle
- Badge, Avatar, Separator
- TextLink, CodeBlock

---

### 2. Hybrid Component (Props + Compound)

**File:** `HybridComponent.tsx`

**Use Case:** Components that benefit from flexibility but have sensible defaults

**Props Mode (80% of use cases):**
```tsx
<HybridComponent
  title="Welcome"
  description="Hello world"
  actionLabel="Get Started"
  onAction={handleStart}
  showIcon
/>
```

**Compound Mode (20% of use cases):**
```tsx
<HybridComponent variant="compound">
  <HybridComponent.Title>Custom Title</HybridComponent.Title>
  <HybridComponent.Description>
    <ul>
      <li>Feature 1</li>
      <li>Feature 2</li>
    </ul>
  </HybridComponent.Description>
  <HybridComponent.Action>Learn More</HybridComponent.Action>
</HybridComponent>
```

**Metrics:**
- Code size: ~3KB (3x SimpleComponent)
- DX score: 4/5 (slightly more complex but still clear)
- Flexibility: 5/5 (both simple and complex)

**Implementation Details:**
- Context provider only active when `variant="compound"`
- Internal state management for props mode
- TypeScript union types for both patterns
- Sub-components attached to main component

**Components suited for this pattern:**
- Card, Alert, Toast
- Modal, Dialog, Drawer
- Input (with addons), Select

---

### 3. Complex Component (Compound Only)

**File:** `ComplexComponent.tsx`

**Use Case:** Complex layouts with multiple slots, custom rendering

**Example:**
```tsx
<ComplexComponent layout="vertical" spacing="md">
  <ComplexComponent.Header align="center">
    <ComplexComponent.Title variant="h1">Settings</ComplexComponent.Title>
    <ComplexComponent.Subtitle>Manage preferences</ComplexComponent.Subtitle>
  </ComplexComponent.Header>
  <ComplexComponent.Body scrollable>
    <p>Content...</p>
  </ComplexComponent.Body>
  <ComplexComponent.Footer sticky position="right">
    <ComplexComponent.Action>Cancel</ComplexComponent.Action>
    <ComplexComponent.Action primary onClick={save}>Save</ComplexComponent.Action>
  </ComplexComponent.Footer>
</ComplexComponent>
```

**Metrics:**
- Code size: ~5KB (5x SimpleComponent)
- DX score: 3/5 (more complex, requires learning)
- Flexibility: 5/5 (maximum customization)

**Components suited for this pattern:**
- Data Table, Form (complex)
- Navigation Menu, Sidebar
- Multi-step wizards

---

## Complexity Analysis

### Code Size Comparison

| Pattern | Lines of Code | Size vs Simple | Notes |
|---------|--------------|----------------|-------|
| Simple | ~30 | 1x | Baseline |
| Hybrid | ~100 | 3x | Context + sub-components |
| Complex | ~150 | 5x | Many sub-components |

### TypeScript Complexity

| Pattern | Type Definitions | Union Types | Context Required |
|---------|-----------------|-------------|------------------|
| Simple | 1 interface | No | No |
| Hybrid | 1 interface + context | Yes (variant) | Conditional |
| Complex | 5+ interfaces | No | Yes (required) |

### Bundle Impact

Assuming 100 components:
- 70 simple (70KB total)
- 25 hybrid (75KB total)
- 5 complex (25KB total)
- **Total: 170KB** (vs 300KB if all hybrid, 500KB if all complex)

---

## Decision Framework

### When to Use Each Pattern

**Use Simple (Props) when:**
- ✅ Single slot (children only)
- ✅ Few configuration options (< 10 props)
- ✅ Standard use cases only
- ✅ No custom layout needs

**Use Hybrid when:**
- ✅ 2-3 slots max
- ✅ Common defaults (80% of uses)
- ✅ Occasional custom layout (20%)
- ✅ Medium complexity (10-20 props)

**Use Complex (Compound) when:**
- ✅ Many slots (4+)
- ✅ Highly customizable layouts
- ✅ Designer workflows
- ✅ No "standard" use case

---

## Real-World Examples

### Current AStudio Components Analysis

| Component | Current Pattern | Recommended Pattern | Rationale |
|-----------|-----------------|---------------------|-----------|
| Button | Props | Simple | Single slot, few options |
| Input | Props | Simple | Single slot |
| Card | Props | Hybrid | Could benefit from header/body slots |
| Modal | Props | Hybrid | Header/body/footer flexibility |
| Dialog | Compound | Hybrid | Keep compound, add props mode |
| Toast | Props | Hybrid | Title/message/action common |
| Form | Compound | Complex | Too many slots for hybrid |
| DataTable | N/A | Complex | Highly customizable |

---

## Developer Experience Assessment

### Learning Curve

| Pattern | Time to Learn | Time to Master | Documentation Needed |
|---------|--------------|----------------|---------------------|
| Simple | < 5 min | < 30 min | Minimal |
| Hybrid | 10-15 min | 1-2 hours | Examples of both modes |
| Complex | 30+ min | 4+ hours | Comprehensive guide |

### Migration Path

**For developers familiar with AStudio (props-based):**
1. Start with simple/hybrid props mode (familiar)
2. Discover compound pattern when needed
3. Gradually adopt compound for complex cases

**This is the key advantage of hybrid:**
- No breaking change from props-based
- Progressive enhancement
- Opt-in complexity

---

## Recommendations

### For DesignStudio Migration

1. **Default to Simple** for new components
   - Start simple, add complexity only if needed
   - Most components don't need compound pattern

2. **Use Hybrid selectively**
   - Only for components with clear 80/20 split
   - Document both patterns clearly
   - Provide examples

3. **Reserve Complex for edge cases**
   - Only when truly necessary
   - Clear documentation required
   - Consider alternative approaches

### Component Categorization

**Simple (70 components):**
- All base primitives (Button, Input, etc.)
- Most feedback components (Badge, Alert)
- Simple data display (Card, Progress)

**Hybrid (25 components):**
- Cards with header/body
- Modals/Dialogs
- Toasts/Snackbars
- Inputs with addons
- Navigation components

**Complex (5 components):**
- Forms (with complex layouts)
- Data Tables
- Multi-step wizards
- Complex navigation (Menubar, Sidebar)

---

## Success Criteria

The hybrid pattern validation is **successful** if:

1. ✅ Props mode works without context overhead
2. ✅ Compound mode enables flexible layouts
3. ✅ TypeScript supports both patterns
4. ✅ Bundle size increase is acceptable (< 2x simple)

The validation **fails** if:

1. ❌ Context overhead affects props mode performance
2. ❌ TypeScript types are confusing
3. ❌ Bundle size doubles across all components
4. ❌ Documentation burden is too high

---

## Expected Outcome

**Optimistic:**
- 70% simple, 25% hybrid, 5% complex
- Bundle impact: ~2x vs all simple (acceptable)
- DX: Good for most, excellent for advanced use cases

**Realistic:**
- 60% simple, 30% hybrid, 10% complex
- Bundle impact: ~2.5x vs all simple
- DX: Slightly more complex but manageable

**Pessimistic:**
- Hybrid adds too much complexity
- Revert to props-only or compound-only

---

## Next Steps

1. ✅ Pattern prototypes created
2. ⏳ Get developer feedback on examples
3. ⏳ Test with real components
4. ⏳ Measure actual bundle sizes
5. ⏳ Make final decision on pattern adoption

---

## Status

- [x] Simple component prototype
- [x] Hybrid component prototype
- [x] Complex component prototype
- [x] Usage examples
- [x] Complexity analysis
- [ ] Developer feedback
- [ ] Performance testing
- [ ] Final decision

**Current Status:** Prototypes complete, ready for feedback

---

## Appendix: Implementation Notes

### Hybrid Pattern Implementation Tips

```typescript
// 1. Use conditional context
const context = variant === 'compound' ? useContext(MyContext) : null;

// 2. Maintain internal state for props mode
const [state, setState] = useState(initialState);

// 3. Sub-components check context
const useCompoundContext = () => {
  const context = useContext(Context);
  if (!context) throw new Error('Must use in compound mode');
  return context;
};

// 4. TypeScript union types
interface Props {
  variant?: 'default' | 'compound';
  // Props for default mode
  title?: string;
  // Children for compound mode
  children?: React.ReactNode;
}
```

### Testing Strategy

```typescript
// Test props mode
test('renders with props', () => {
  render(<HybridComponent title="Test" />)
  expect(screen.getByText('Test')).toBeInTheDocument()
})

// Test compound mode
test('renders compound slots', () => {
  render(
    <HybridComponent variant="compound">
      <HybridComponent.Title>Test</HybridComponent.Title>
    </HybridComponent>
  )
  expect(screen.getByText('Test')).toBeInTheDocument()
})

// Test context is not used in props mode
test('props mode does not create context', () => {
  const { container } = render(<HybridComponent title="Test" />)
  expect(container.querySelector('[data-context]')).toBeNull()
})
```
