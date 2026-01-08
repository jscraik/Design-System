# Block Wrapper Pattern Recommendations

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Contents

- [Doc requirements](#doc-requirements)
- [Current State](#current-state)
- [Industry Context](#industry-context)
- [Options](#options)
  - [Option A: Delete ChatInputBlock (Recommended)](#option-a-delete-chatinputblock-recommended)
  - [Option B: Keep for Consistency](#option-b-keep-for-consistency)
  - [Option C: Add Value to the Block](#option-c-add-value-to-the-block)
- [My Recommendation](#my-recommendation)
- [Files to Review](#files-to-review)


## Current State

`ChatInputBlock.tsx` is a pure pass-through wrapper:

```tsx
export function ChatInputBlock(props: ChatInputBlockProps) {
  return <ChatInput {...props} />;
}
```

It adds **zero functionality** - just re-exports `ChatInput` with the same props.

## Industry Context

**Wrapper pattern is standard when it adds value:**

- Layout/positioning in a template system
- Default props injection
- Context consumption
- Template-specific styling

**Pure pass-throughs are noise when:**

- They just forward props unchanged
- No template-specific logic
- No default values added

Design systems like Chakra UI, Radix, and shadcn/ui use wrappers, but they always add something.

## Options

### Option A: Delete ChatInputBlock (Recommended)

- Remove `packages/ui/src/templates/blocks/ChatInputBlock.tsx`
- Update imports to use `ChatInput` directly
- Reduces indirection and file count
- Cleaner mental model

### Option B: Keep for Consistency

- Other blocks follow this pattern
- Future-proofs for template-specific logic
- Maintains uniform API across blocks

### Option C: Add Value to the Block

If keeping, make it useful:

```tsx
export function ChatInputBlock({ className, ...props }: ChatInputBlockProps) {
  return (
    <div className={cn("template-input-container", className)}>
      <ChatInput {...props} />
    </div>
  );
}
```

## My Recommendation

**Go with Option A** unless you have concrete plans to add template-specific behavior. The current wrapper is just noise.

If you want consistency across all blocks, audit the other blocks too - if they're all pass-throughs, consider removing the block layer entirely and using components directly in templates.

## Files to Review

- `packages/ui/src/templates/blocks/ChatInputBlock.tsx`
- `packages/ui/src/templates/blocks/ChatHeaderBlock.tsx`
- `packages/ui/src/templates/blocks/ChatMessagesBlock.tsx`
- `packages/ui/src/templates/blocks/ChatSidebarBlock.tsx`
