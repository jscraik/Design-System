# Final Technical Corrections: Bridge Mechanics & Runtime Environment

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


## 1. JSON Bridge Contract (Critical Fix)

**Problem**: `result.toString()` on JS objects returns "[object Object]", not JSON.

**Solution**: Single JSON-string entrypoint with error envelope:

### TypeScript Side (Runtime Bundle)

```typescript
// packages/runtime/src/native/entry.ts
type Json = string;

function safe<T>(fn: () => T): Json {
  try {
    const out = fn();
    return JSON.stringify({ ok: true, value: out });
  } catch (err: any) {
    return JSON.stringify({
      ok: false,
      error: { 
        message: String(err?.message ?? err), 
        name: String(err?.name ?? "Error") 
      }
    });
  }
}

export function call(fnName: string, argsJson: string): Json {
  return safe(() => {
    const args = JSON.parse(argsJson);
    const fn = (globalThis as any).ChatUIRuntime?.[fnName];
    if (typeof fn !== "function") {
      throw new Error(`Missing function: ${fnName}`);
    }
    return fn(args);
  });
}

// Make it easy for Swift to find
(globalThis as any).ChatUINative = { call };
```

### Swift Side

```swift
// packages/ui-swift/Sources/AStudioSwift/Runtime/JSBridge.swift
struct NativeCallEnvelope<T: Decodable>: Decodable {
  let ok: Bool
  let value: T?
  let error: NativeError?
}

struct NativeError: Decodable {
  let message: String
  let name: String
}

public func callBusinessLogic<T: Decodable>(
  function: String,
  args: Encodable
) throws -> T {
  let argsData = try JSONEncoder().encode(AnyEncodable(args))
  let argsJson = String(data: argsData, encoding: .utf8)!
  
  guard let native = context.objectForKeyedSubscript("ChatUINative"),
        let call = native.objectForKeyedSubscript("call"),
        !call.isUndefined else {
    throw BridgeError.initializationFailed("ChatUINative.call missing")
  }
  
  let result = call.call(withArguments: [function, argsJson])!
  let json = result.toString() ?? ""
  
  let envelope = try JSONDecoder().decode(NativeCallEnvelope<T>.self, from: Data(json.utf8))
  
  if envelope.ok, let value = envelope.value {
    return value
  }
  
  throw BridgeError.executionFailed(envelope.error?.message ?? "Unknown JS error")
}
```

## 2. Async Bridging Strategy

**Problem**: JS promises don't "just work" from Swift.

**Recommended Solution**: Pattern B - "Shared logic is pure + sync only"

### Constrained JSCore Scope

```typescript
// packages/runtime/src/core/pure-logic.ts
export const ChatUIRuntime = {
  // ✅ Allowed: Pure functions
  validateMessage(message: unknown): boolean {
    return typeof message === 'object' && message !== null &&
      typeof (message as any).content === 'string';
  },
  
  // ✅ Allowed: State reducers
  addMessage(state: ChatState, message: ChatMessage): ChatState {
    return {
      ...state,
      messages: [...state.messages, message]
    };
  },
  
  // ✅ Allowed: Formatters
  formatTimestamp(isoString: string): string {
    return new Date(isoString).toLocaleString();
  },
  
  // ✅ Allowed: Widget schema normalization
  normalizeWidgetData(raw: unknown): WidgetData | null {
    // Pure transformation logic
  },
  
  // ❌ NOT allowed: Async IO (keep in Swift)
  // readFile, fetch, showNotification, etc.
};
```

### Swift Handles All IO

```swift
// packages/ui-swift/Sources/AStudioSwift/State/ChatState.swift
@MainActor
public class ChatState: ObservableObject {
  @Published public var messages: [ChatMessage] = []
  
  private let bridge: ChatUIJSBridge
  
  public func addMessage(_ content: String) async {
    // Create message with Swift-generated ID and timestamp
    let message = ChatMessage(
      id: UUID().uuidString,
      content: content,
      author: .user,
      timestamp: ISO8601DateFormatter().string(from: Date())
    )
    
    // Use pure JS logic for state transformation
    let newState: ChatState = try! bridge.callBusinessLogic(
      function: "addMessage",
      args: ["state": self.toDictionary(), "message": message]
    )
    
    // Update Swift state
    self.messages = newState.messages
  }
}
```

## 3. JSCore Runtime Environment Constraints

**Problem**: JSCore lacks web primitives.

**Solution**: Minimal environment with explicit constraints:

### Runtime Bundle Configuration

```typescript
// tools/build-runtime.ts
export async function buildRuntime() {
  await build({
    entryPoints: ['packages/runtime/src/native/entry.ts'],
    bundle: true,
    format: 'iife',
    globalName: 'ChatUIRuntime',
    outfile: 'packages/ui-swift/Sources/AStudioSwift/Resources/chatui-runtime.js',
    target: 'es2017', // JSCore compatibility
    define: {
      'process.env.NODE_ENV': '"production"',
      // Explicitly undefined to catch usage
      'fetch': 'undefined',
      'Request': 'undefined',
      'Response': 'undefined',
      'TextEncoder': 'undefined',
      'TextDecoder': 'undefined',
    },
    external: [], // Bundle everything
  });
}
```

### Safe Polyfills (If Needed)

```typescript
// packages/runtime/src/native/polyfills.ts
// Only include if absolutely necessary
export const safePolyfills = {
  // Generate IDs on Swift side instead
  // crypto: { getRandomValues: () => { throw new Error('Use Swift UUID') } },
  
  // Use Swift Date instead
  // Date: { now: () => { throw new Error('Use Swift Date') } },
};
```

## 4. Data Model: ISO Strings End-to-End

**Fix**: Consistent timestamp handling:

```typescript
// packages/runtime/src/models/message.ts
export interface ChatMessage {
  id: string;
  content: string;
  author: 'user' | 'assistant' | 'system';
  timestamp: string; // ISO-8601 string, not Date
  metadata?: MessageMetadata;
}

// Validation without Zod (smaller bundle)
export function isValidChatMessage(obj: unknown): obj is ChatMessage {
  if (typeof obj !== 'object' || obj === null) return false;
  const msg = obj as any;
  
  return typeof msg.id === 'string' &&
         typeof msg.content === 'string' &&
         ['user', 'assistant', 'system'].includes(msg.author) &&
         typeof msg.timestamp === 'string' &&
         /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(msg.timestamp);
}
```

```swift
// packages/ui-swift/Sources/AStudioSwift/Models/ChatMessage.swift
public struct ChatMessage: Codable, Identifiable {
  public let id: String
  public let content: String
  public let author: Author
  public let timestamp: String // ISO string for bridge
  
  // Computed property for Swift Date usage
  public var date: Date {
    ISO8601DateFormatter().date(from: timestamp) ?? Date()
  }
  
  public init(id: String, content: String, author: Author, timestamp: Date) {
    self.id = id
    self.content = content
    self.author = author
    self.timestamp = ISO8601DateFormatter().string(from: timestamp)
  }
}
```

## 5. Property Tests: Concrete Codable Types

**Problem**: `[String: Any]` won't work with SwiftCheck.

**Solution**: Generate concrete test data:

```swift
// packages/ui-swift/Tests/AStudioSwiftTests/Properties/BridgeTests.swift
import SwiftCheck

extension ChatMessage: Arbitrary {
  public static var arbitrary: Gen<ChatMessage> {
    return Gen.compose { c in
      ChatMessage(
        id: c.generate(using: String.arbitrary),
        content: c.generate(using: String.arbitrary.suchThat { !$0.isEmpty }),
        author: c.generate(using: Author.arbitrary),
        timestamp: c.generate(using: Date.arbitrary)
      )
    }
  }
}

class BridgePropertyTests: XCTestCase {
  func testJavaScriptBridgeExecution() {
    property("JavaScript Bridge handles valid messages") <- forAll { (message: ChatMessage) in
      let bridge = try! ChatUIJSBridge()
      
      do {
        let isValid: Bool = try bridge.callBusinessLogic(
          function: "validateMessage",
          args: message
        )
        return isValid == true
      } catch {
        return false
      }
    }
  }
}
```

## 6. Token Generation: Determinism + Accessibility

**Enhancement**: Stable output with accessibility hooks:

```typescript
// tools/token-generator.ts
export class TokenGenerator {
  async generateSwift(tokens: DesignTokens): Promise<string> {
    const tokenHash = this.generateHash(tokens);
    
    return `
// Generated by build-tokens.ts - DO NOT EDIT
// Token Hash: ${tokenHash}
// Generated: ${new Date().toISOString()}
import SwiftUI

public enum DesignTokens {
    public static let version = "${tokenHash}"
    
    public enum Colors {
        // Standard colors
        public static let primaryText = Color.primary
        public static let accent = Color.accentColor
        
        // Accessibility variants
        public static var highContrastText: Color {
            Color.primary.opacity(Environment(\\.colorSchemeContrast) == .increased ? 1.0 : 0.87)
        }
    }
    
    public enum Focus {
        public static let ringWidth: CGFloat = 2.0
        public static let ringColor = Color.accentColor
        
        // Accessibility: thicker focus rings for better visibility
        public static var accessibleRingWidth: CGFloat {
            Environment(\\.accessibilityReduceTransparency).wrappedValue ? 3.0 : 2.0
        }
    }
    
    public enum Animation {
        public static let standard = Animation.easeInOut(duration: 0.2)
        
        // Respect reduced motion preference
        public static var accessible: Animation {
            Environment(\\.accessibilityReduceMotion).wrappedValue ? .none : standard
        }
    }
}`;
  }
  
  private generateHash(tokens: DesignTokens): string {
    const content = JSON.stringify(tokens, Object.keys(tokens).sort());
    return require('crypto').createHash('sha256').update(content).digest('hex').slice(0, 8);
  }
}
```

## 7. Hot Reload: Simple Bundle Reload

**Implementation**: Menu-driven runtime reload:

```swift
// packages/ui-swift/Sources/AStudioSwift/Runtime/HotReload.swift
#if DEBUG
extension ChatUIJSBridge {
  public func reloadRuntime() throws {
    // Clear current context
    context.evaluateScript("delete globalThis.ChatUIRuntime; delete globalThis.ChatUINative;")
    
    // Reload bundle from disk
    let bundle = try loadRuntimeBundle()
    context.evaluateScript(bundle)
    
    // Re-verify initialization
    guard let native = context.objectForKeyedSubscript("ChatUINative"),
          !native.isUndefined else {
      throw BridgeError.initializationFailed("Hot reload failed")
    }
    
    print("✅ Runtime reloaded successfully")
  }
}
#endif
```

## MVP Implementation Boundary

**Allowed in JSCore**:

- ✅ Validation functions
- ✅ Formatting/transformation
- ✅ State reducers
- ✅ Widget schema normalization
- ✅ Tool-call orchestration (pure planning)

**Not Allowed in JSCore** (initially):

- ❌ fetch/network IO
- ❌ File system operations
- ❌ Authentication flows
- ❌ Notifications
- ❌ Any async operations

This keeps Swift native, avoids Promise-bridging complexity, and still provides shared business rules where they matter most.
