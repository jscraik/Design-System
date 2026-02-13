# ADR 002: Hybrid Component Pattern

**Status:** Accepted
**Date:** 2026-01-26
**Decision:** Support both props-based and compound component APIs
**Context:** DesignStudio Migration Phase 1

---

## Context

Component libraries face a tradeoff between **simplicity** (props) and **flexibility** (compound):

### Props-Based (Simple)
```tsx
<ChatInput
  placeholder="Type a message..."
  onSend={handleSubmit}
  showAttachments={true}
/>
```

**Pros:**
- Simple to use
- Clear API surface
- Easy to learn
- Works for 80% of cases

**Cons:**
- Limited customization
- Props explosion for complex cases
- Hard to extend

### Compound Components (Flexible)
```tsx
<ChatInput>
  <ChatInput.Textarea placeholder="..." />
  <ChatInput.Actions>
    <ChatInput.SendButton />
  </ChatInput.Actions>
</ChatInput>
```

**Pros:**
- Maximum flexibility
- Composable
- Extensible

**Cons:**
- More verbose
- Steeper learning curve
- Context overhead
- Overkill for simple cases

## Decision

**Support both APIs** via a **hybrid pattern**:

1. **Props-based by default** (80% of cases)
2. **Compound opt-in via `variant="compound"`** (20% of cases)

### Implementation

```tsx
type ChatInputProps = {
  // Props API
  placeholder?: string;
  onSend?: (text: string) => void;
  showAttachments?: boolean;
  // Compound API
  variant?: "default" | "compound";
  children?: ReactNode;
};

export function ChatInput({ variant, children, ...props }: ChatInputProps) {
  // Props-based: internal state
  if (variant !== "compound") {
    return <SimpleChatInput {...props} />;
  }

  // Compound: context provider
  return (
    <ChatInputContext.Provider value={...}>
      {children}
    </ChatInputContext.Provider>
  );
}

// Compound sub-components
ChatInput.Textarea = function Textarea({ ... }) { ... };
ChatInput.SendButton = function SendButton({ ... }) { ... };
```

### Usage

**80% of cases (props):**
```tsx
<ChatInput
  placeholder="Type a message..."
  onSend={handleSubmit}
/>
```

**20% of cases (compound):**
```tsx
<ChatInput variant="compound">
  <ChatInput.Textarea placeholder="..." />
  <ChatInput.Actions>
    <ChatInput.SendButton />
    <CustomAttachmentButton /> {/* Custom! */}
  </ChatInput.Actions>
</ChatInput>
```

## Rationale

### Why hybrid?

1. **Best of both worlds:** Simple for simple cases, flexible for complex cases
2. **Progressive enhancement:** Start with props, opt into compound when needed
3. **No breaking changes:** Existing props-based code still works
4. **Clear upgrade path:** When props aren't enough, use compound

### Why props as default?

1. **80/20 rule:** Most use cases are simple
2. **Lower learning curve:** Easier for beginners
3. **Better DX:** Less boilerplate for common cases
4. **Type safety:** Props are easier to type than context

### Why `variant="compound"` opt-in?

1. **Explicit intent:** Clear when compound API is active
2. **No context overhead:** Only create context when needed
3. **Backward compatible:** Doesn't break existing props-based usage

### Why not just compound?

1. **Too verbose** for simple cases
2. **Steeper learning curve** for new users
3. **Context overhead** even when not needed
4. **Industry trend:** Most libraries support both (Radix, Chakra, etc.)

### Why not just props?

1. **Props explosion** for complex components
2. **Hard to extend** with custom slots
3. **Limited composition** options
4. **Control inversion** harder to achieve

## Consequences

### Positive

1. **Flexible DX:** Users choose the right tool for the job
2. **Progressive:** Simple to learn, powerful when needed
3. **Compatible:** Doesn't break existing props-based usage
4. **Type-safe:** Full TypeScript support for both APIs

### Negative

1. **Implementation complexity:** Components must support both patterns
2. **Bundle size:** Compound sub-components add ~2KB per component
3. **Documentation:** Need to document both APIs
4. **Testing:** Need to test both APIs

### Mitigations

1. **Implementation:** Use shared logic between props and compound
2. **Bundle size:** Tree-shake compound sub-components (only bundle when used)
3. **Documentation:** Clear examples showing when to use each
4. **Testing:** Storybook stories for both APIs

## Decision Criteria

Use **props** when:
- Simple configuration
- Standard layout
- Most common cases
- Quick prototyping

Use **compound** when:
- Custom layouts
- Multiple slots
- Advanced composition
- Extending with custom slots

## Examples

### Props API (80% of cases)
```tsx
// Simple chat input
<ChatInput
  placeholder="Type a message..."
  onSend={handleSubmit}
/>

// With attachments
<ChatInput
  placeholder="..."
  onSend={handleSubmit}
  showAttachments={true}
/>

// Disabled
<ChatInput
  placeholder="..."
  onSend={handleSubmit}
  disabled={true}
/>
```

### Compound API (20% of cases)
```tsx
// Custom layout
<ChatInput variant="compound">
  <ChatInput.Textarea />
  <ChatInput.Actions>
    <ChatInput.SendButton />
    <CustomEmojiPicker /> {/* Custom slot */}
  </ChatInput.Actions>
</ChatInput>

// Multiple slots
<ChatInput variant="compound">
  <ChatInput.Header>
    <ChannelInfo />
  </ChatInput.Header>
  <ChatInput.Textarea />
  <ChatInput.Actions>
    <ChatInput.SendButton />
  </ChatInput.Actions>
  <ChatInput.Footer>
    <CharacterCount />
  </ChatInput.Footer>
</ChatInput>
```

## Related Decisions

- [ADR 001: Package Structure](./001-package-structure.md)
- [ADR 003: Type-Safe Tokens](./003-type-safe-tokens.md)
- [ADR 004: Category Imports](./004-category-imports.md)

## References

- Validation report: `docs/validation/hybrid-pattern-validation-report.md`
- Component examples: `packages/ui/src/`

---

**Last Updated:** 2026-02-06
