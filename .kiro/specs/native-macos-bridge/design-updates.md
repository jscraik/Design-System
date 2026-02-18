# Design Updates: Addressing Technical Issues

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


Based on feedback, here are the critical technical corrections to the design:

## 1. Swift Package Manager Structure

**Issue**: DesignTokens.swift cannot be a Resource - it must be compiled code.

**Fix**: Generate tokens into Sources directory:

```
packages/ui-swift/Sources/AStudioSwift/Tokens/DesignTokens.swift
```

## 2. JavaScript Bridge Wiring

**Issue**: Bundle naming and object access don't align.

**Fix**: Correct the bridge initialization:

```swift
public class ChatUIJSBridge {
    private let context: JSContext
    private let runtime: JSValue
    
    public init() throws {
        context = JSContext()
        
        // Load bundled runtime (IIFE format)
        let bundle = try loadRuntimeBundle()
        context.evaluateScript(bundle)
        
        // Access the global runtime object
        guard let runtimeObj = context.objectForKeyedSubscript("ChatUIRuntime"),
              !runtimeObj.isUndefined else {
            throw BridgeError.initializationFailed("ChatUIRuntime not found")
        }
        
        runtime = runtimeObj
        
        // Create state manager instance
        guard let StateManagerClass = runtime.objectForKeyedSubscript("ChatStateManager"),
              let stateManager = StateManagerClass.construct(withArguments: []) else {
            throw BridgeError.initializationFailed("Failed to create ChatStateManager")
        }
        
        self.stateManager = stateManager
    }
}
```

## 3. Simplified Shared Logic Approach

**Issue**: JSCore complexity may not be worth it for the shared logic scope.

**Recommendation**: Start with contract-based sharing:

- Share schemas and validation rules
- Implement state management natively in Swift
- Keep TypeScript runtime for web
- Only use JSCore if shared logic becomes large and volatile

## 4. Data Model Corrections

**Issue**: z.date() and Zod size concerns.

**Fix**: Use ISO strings and lighter validation:

```typescript
// Lightweight schema without Zod
export interface ChatMessage {
  id: string;
  content: string;
  author: 'user' | 'assistant' | 'system';
  timestamp: string; // ISO string instead of Date
  metadata?: MessageMetadata;
}

// Runtime validation function (much smaller than Zod)
export function validateMessage(obj: unknown): obj is ChatMessage {
  return typeof obj === 'object' && obj !== null &&
    typeof (obj as any).id === 'string' &&
    typeof (obj as any).content === 'string' &&
    ['user', 'assistant', 'system'].includes((obj as any).author) &&
    typeof (obj as any).timestamp === 'string';
}
```

## 5. Accessibility-Aware Token Generation

**Fix**: Generate Dynamic Type-friendly fonts and accessibility-aware colors:

```swift
public enum DesignTokens {
    public enum Typography {
        // Use system text styles that scale with Dynamic Type
        public static let heading1 = Font.system(.largeTitle, design: .default, weight: .semibold)
        public static let body = Font.system(.body, design: .default, weight: .regular)
        
        // Support high contrast and reduced transparency
        public static var accessibleBody: Font {
            Font.system(.body, design: .default, weight: .medium)
        }
    }
    
    public enum Colors {
        // Colors that adapt to accessibility settings
        public static var primaryText: Color {
            Color.primary // System-appropriate contrast
        }
        
        public static var accent: Color {
            Color.accentColor // Respects user preference
        }
    }
}
```

## 6. Robust Version Synchronization

**Issue**: Regex editing .pbxproj is fragile.

**Fix**: Use proper Xcode tools:

```typescript
// tools/sync-versions.ts
import { execSync } from 'child_process';

export async function syncVersions() {
  const version = getVersionFromPackageJson();
  
  // Use agvtool for Xcode version management
  try {
    execSync(`cd apps/macos && agvtool new-marketing-version ${version}`, {
      stdio: 'inherit'
    });
  } catch (error) {
    // Fallback to xcodeproj parsing library
    await updateXcodeProjectVersion(version);
  }
}
```

## 7. Platform Host Interface Correction

**Issue**: Missing setState/getState methods.

**Fix**: Add storage capability:

```typescript
export interface PlatformHost {
  platform: 'web' | 'macos';
  
  // Storage operations
  storage: {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T): Promise<void>;
    remove(key: string): Promise<void>;
  };
  
  // Other capabilities...
}
```

## 8. Component Parity Philosophy

**Clarification**: Parity means:

- **API/behavior parity**: Same events, states, constraints
- **Intent parity**: Same semantic meaning and variants
- **NOT pixel-perfect parity**: Allow platform-native improvements

This prevents SwiftUI from feeling like a web skin and enables native enhancements.

## 9. Accessibility Requirements

Bake in these cross-platform accessibility patterns:

- Keyboard navigation contracts for all interactive components
- Focus management in overlays (trap and restore)
- Accessible names for icon-only buttons
- No color-only signals (use text/shape/ARIA for states)

These corrections address the major technical issues while preserving the overall architecture strategy.
