# Template / Block API (Internal)

Last updated: 2026-01-04

## Doc requirements
- Audience: Engineers and technical leads
- Scope: System architecture and component relationships
- Non-scope: Step-by-step operational procedures
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Contents

- [Doc requirements](#doc-requirements)
- [React API (templates + blocks)](#react-api-templates-blocks)
  - [Templates](#templates)
  - [Blocks](#blocks)
  - [Adding a new React template](#adding-a-new-react-template)
  - [Adding a new React block](#adding-a-new-react-block)
- [SwiftUI API (templates + blocks)](#swiftui-api-templates-blocks)
  - [Templates](#templates-1)
  - [Adding a new SwiftUI template](#adding-a-new-swiftui-template)
  - [Available SwiftUI templates](#available-swiftui-templates)
  - [Blocks](#blocks-1)
- [Widgets (template-backed)](#widgets-template-backed)
- [Stability](#stability)
- [Related docs](#related-docs)


This document defines the internal API for templates and blocks across React, widgets, and SwiftUI/AppKit. It reflects the current repo layout and export surface.

## React API (templates + blocks)

**Exports:** `@chatui/ui/templates`

### Templates

- Registry: `packages/ui/src/templates/registry.ts`
- Access:

```tsx
import { templateRegistry, getTemplate, ChatTemplate } from "@chatui/ui/templates";

const template = getTemplate("chat");
return template ? <template.Component /> : null;
```

### Blocks

- Registry: `packages/ui/src/templates/blocks/registry.ts`
- Access:

```tsx
import { blockRegistry, getBlock, ChatHeaderBlock } from "@chatui/ui/templates";

const block = getBlock("chat-header");
return block ? <block.Component /> : null;
```

### Adding a new React template

1. Create `packages/ui/src/templates/MyTemplate.tsx`.
2. Register in `packages/ui/src/templates/registry.ts`.
3. Export in `packages/ui/src/templates/index.ts`.

### Adding a new React block

1. Create `packages/ui/src/templates/blocks/MyBlock.tsx`.
2. Register in `packages/ui/src/templates/blocks/registry.ts`.
3. Export in `packages/ui/src/templates/blocks/index.ts`.

## SwiftUI API (templates + blocks)

**Location:** `platforms/apple/swift/ChatUIComponents/Sources/ChatUIComponents/Templates`

### Templates

- Registry: `TemplateRegistry.swift`
- Access:

```swift
let template = TemplateRegistry.template(for: .compose)
template?.makeView()
```

### Adding a new SwiftUI template

1. Create `MyTemplateView.swift` in `Templates/`.
2. Register it in `TemplateRegistry.swift`.

### Available SwiftUI templates

- `ChatHeaderTemplateView`
- `ChatSidebarTemplateView`
- `ChatMessagesTemplateView`
- `ChatInputTemplateView`
- `ChatTemplateView`
- `ChatVariantsTemplateView`
- `ComposeView`

### Blocks

- Blocks are exposed as `*BlockView` (e.g., `ChatHeaderBlockView`).
- Use blocks directly inside template views to build compositions.

## Widgets (template-backed)

**Location:** `packages/widgets/src/widgets/**/<widget-id>`

Each widget renders a React template from `@chatui/ui/templates`:

```tsx
import { ChatTemplate } from "@chatui/ui/templates";

root.render(<ChatTemplate />);
```

## Stability

These APIs are internal for your apps. Treat them as stable only once you explicitly version them.

## Related docs

- `docs/architecture/template-library.md`
