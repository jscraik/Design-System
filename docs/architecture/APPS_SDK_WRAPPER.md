# Apps SDK UI Abstraction Layer

## Purpose

The `@design-studio/ui` package includes a stable wrapper layer around `@openai/apps-sdk-ui` components. This reduces brittleness from direct dependency on Apps SDK UI's potentially changing API.

## Location

- **Source**: `packages/ui/src/integrations/apps-sdk-wrapper/`
- **Exports**: Available via root `@design-studio/ui` and subpath `@design-studio/ui/wrapper`

## Why This Exists

| Problem | Solution |
|----------|------------|
| Direct Apps SDK UI imports can break if CSS classes change | Wrapper provides stable component API |
| No version safety net | Version check prevents silent failures |
| Cannot swap implementation | Wrapper allows future alternative implementations |

## Usage

### For Components (Recommended)

```tsx
import { Badge, Button, Checkbox } from "@design-studio/ui/wrapper";

// Use instead of: import { Badge, Button } from "@openai/apps-sdk-ui/components/Badge"
export function MyComponent() {
  return (
    <div>
      <Badge variant="success">Complete</Badge>
      <Button onClick={handleClick}>Submit</Button>
      <Checkbox checked={checked} onChange={setChecked} />
    </div>
  );
}
```

### For App Root (Required)

Use `AppsSDKWrapper` at your app root instead of `AppsSDKUIProvider`:

```tsx
import { AppsSDKWrapper } from "@design-studio/ui/wrapper";

export function App() {
  return (
    <AppsSDKWrapper>
      <YourAppContent />
    </AppsSDKWrapper>
  );
}
```

### Version Safety

Each wrapper component checks that `@openai/apps-sdk-ui` version meets minimum requirements (0.2.1).

- **Development**: Throws error if version too low
- **Production**: Logs warning, continues gracefully

Check version programmatically:

```ts
import { getAppsSDKVersion } from "@design-studio/ui/wrapper";

const version = getAppsSDKVersion();
console.log(`Apps SDK UI version: ${version}`);
```

## Migration

To migrate from direct Apps SDK UI imports:

1. Find/replace: `from "@openai/apps-sdk-ui/` → `from "@design-studio/ui/wrapper"`
2. Remove unused direct imports
3. Test thoroughly in dev environment

## Version Support

- **Minimum**: 0.2.1
- **Tested**: 0.2.1
- **Status**: Bump `MIN_APPSSDK_UI_VERSION` when upgrading

## Future Work

This wrapper enables:
1. Custom implementations of Apps SDK UI patterns
2. A/B testing different UI libraries
3. Graceful degradation when Apps SDK unavailable
