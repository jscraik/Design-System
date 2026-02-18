# Version Compatibility Matrix

This document tracks version compatibility between `@design-studio/*` packages and their dependencies.

## Package Versions

| Package | Current Version |
|---------|----------------|
| `@design-studio/ui` | 0.0.1 |
| `@design-studio/runtime` | 2.0.0 |
| `@design-studio/tokens` | (workspace) |
| `@openai/apps-sdk-ui` | 0.2.1 (from package.json) |
| React | 19.0.0 |
| TypeScript | 5.9.3 |

## Compatibility Status

### UI Package (`@design-studio/ui`)

| Dependency | Minimum | Tested | Notes |
|-----------|---------|--------|-------|
| `@openai/apps-sdk-ui` | ^0.2.1 | ✅ 0.2.1 | CSS variable names may change; wrapper layer provides safety |
| React | ^19.0.0 | ✅ 19.0.0 | Required for peer dependency |
| `@design-studio/runtime` | - | ❓ Untested | No direct dependency; uses via host provider |
| `@design-studio/tokens` | - | ✅ (workspace) | CSS variables; stable |

### Runtime Package (`@design-studio/runtime`)

| Dependency | Minimum | Tested | Notes |
|-----------|---------|--------|-------|
| React | ^19.0.0 | ✅ 19.0.0 | Peer dependency only |

## Breaking Changes

### Version 0.0.1 → Future

#### Apps SDK UI Wrapper (NEW)

- **Added**: `@design-studio/ui/wrapper` subpath exports
- **Components**: `Badge`, `Button`, `Checkbox`, `CodeBlock`, `Icon`, `Image`, `Input`, `Popover`, `Textarea` wrapped with version safety
- **Provider**: `AppsSDKWrapper` replaces `AppsSDKUIProvider` at app root
- **Version check**: Runtime validation of `@openai/apps-sdk-ui` version

**Migration Guide**:
```tsx
// Before (direct Apps SDK UI imports)
import { Badge, Button } from "@openai/apps-sdk-ui/components/Badge";

// After (wrapper imports)
import { Badge, Button } from "@design-studio/ui/wrapper";
```

## Upgrade Path

When upgrading dependencies:

1. **Apps SDK UI** → Check `MIN_APPSSDK_UI_VERSION` in wrapper
2. **React** → Peer dependency, locked to 19.x
3. **TypeScript** → Review for new syntax/features

## Testing Checklist

Before releasing:
- [ ] Test wrapper components with Apps SDK UI 0.2.1
- [ ] Test wrapper components with Apps SDK UI 0.3.0 (when available)
- [ ] Test version detection works correctly
- [ ] Test graceful degradation when Apps SDK unavailable

## Notes

- The wrapper layer adds a small runtime overhead for version checking
- If Apps SDK UI is unavailable in standalone mode, components throw descriptive errors
- In embedded (ChatGPT) mode, Apps SDK UI version is read from `window.openai`
