# Cross-Platform Architecture: React + Swift + Apps SDK

Last updated: 2026-01-04

## Doc requirements
- Audience: Engineers and technical leads
- Scope: System architecture and component relationships
- Non-scope: Step-by-step operational procedures
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Contents

- [Doc requirements](#doc-requirements)
- [Executive Summary](#executive-summary)
- [1. UI Component Parity Strategy](#1-ui-component-parity-strategy)
  - [1.1 Token-Driven Design System](#11-token-driven-design-system)
  - [1.2 Component Architecture Mapping](#12-component-architecture-mapping)
  - [1.3 Component Parity Matrix](#13-component-parity-matrix)
- [2. Shared Business Logic Architecture](#2-shared-business-logic-architecture)
  - [2.1 Runtime Abstraction Layer](#21-runtime-abstraction-layer)
  - [2.2 Shared State Management](#22-shared-state-management)
  - [2.3 JavaScript Core Bridge (Swift ↔ TypeScript)](#23-javascript-core-bridge-swift-typescript)
  - [2.4 Validation & Business Rules](#24-validation-business-rules)
- [3. Build & Distribution Pipeline](#3-build-distribution-pipeline)
  - [3.1 Enhanced Monorepo Structure](#31-enhanced-monorepo-structure)
  - [3.2 Token Generation Pipeline](#32-token-generation-pipeline)
  - [3.3 Runtime Bundling Strategy](#33-runtime-bundling-strategy)
  - [3.4 Swift Package Manager Integration](#34-swift-package-manager-integration)
  - [3.5 Cross-Platform Build Pipeline (Current)](#35-cross-platform-build-pipeline-current)
  - [3.6 Version Synchronization (Current)](#36-version-synchronization-current)
- [Verify (Current Pipeline)](#verify-current-pipeline)
- [4. Implementation Roadmap (Historical)](#4-implementation-roadmap-historical)
  - [Phase 1: Foundation (Weeks 1-2)](#phase-1-foundation-weeks-1-2)
  - [Phase 2: Core Components (Weeks 3-4)](#phase-2-core-components-weeks-3-4)
  - [Phase 3: Integration (Weeks 5-6)](#phase-3-integration-weeks-5-6)
  - [Phase 4: Production (Weeks 7-8)](#phase-4-production-weeks-7-8)
- [5. Benefits & Trade-offs](#5-benefits-trade-offs)
  - [Benefits](#benefits)
  - [Trade-offs](#trade-offs)
- [6. Success Metrics](#6-success-metrics)


> Status: This document includes historical proposals that reference the legacy `platforms/apple/swift/ui-swift` package.
> For the current Swift architecture, see `platforms/apple/swift/README.md` and `docs/SWIFT_INTEGRATION.md`.

## Executive Summary

This document outlines a comprehensive strategy for expanding the ChatUI system to support three target platforms:

1. **React Web/Apps SDK** (current)
2. **Swift macOS Native** (new)
3. **Shared Business Logic** (enhanced)

The approach leverages design tokens as the bridge, implements platform-specific UI layers, and creates a unified build/distribution pipeline.

## 1. UI Component Parity Strategy

### 1.1 Token-Driven Design System

**Current State:**

```typescript
// packages/tokens/src/colors.ts
export const colorTokens = {
  background: { light: { primary: "#FFFFFF" }, dark: { primary: "#212121" } },
  text: { light: { primary: "#0D0D0D" }, dark: { primary: "#FFFFFF" } },
  // ...
};
```

**Enhanced Multi-Platform Tokens:**

```
packages/tokens/
├── src/
│   ├── colors.ts           # Source definitions
│   ├── typography.ts       # Typography scale
│   ├── spacing.ts          # Spacing scale
│   └── semantic.ts         # Semantic token mappings
├── outputs/
│   ├── css/               # CSS custom properties (React)
│   ├── platforms/apple/swift/             # Swift constants (macOS)
│   ├── json/              # Platform-agnostic JSON
│   └── docs/              # Documentation
└── build/
    ├── css-generator.ts   # Generates CSS variables
    ├── swift-generator.ts # Generates Swift constants
    └── docs-generator.ts  # Generates token docs
```

### 1.2 Component Architecture Mapping

**React Component (Current):**

```tsx
// packages/ui/src/components/ui/base/Button/Button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-foundation text-body-small font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-foundation-accent-blue text-foundation-text-light-primary hover:bg-foundation-accent-blue/90",
        destructive:
          "bg-foundation-accent-red text-foundation-text-light-primary hover:bg-foundation-accent-red/90",
        // ...
      },
    },
  },
);
```

**Swift Component (Proposed):**

```swift
// platforms/apple/swift/ui-swift/Sources/ChatUISwift/Components/Button.swift
public struct ChatUIButton: View {
    public enum Variant {
        case `default`, destructive, outline, secondary, ghost, link
    }

    public enum Size {
        case `default`, sm, lg, icon
    }

    private let variant: Variant
    private let size: Size
    private let action: () -> Void
    private let content: () -> Content

    public var body: some View {
        Button(action: action) {
            content()
        }
        .buttonStyle(ChatUIButtonStyle(variant: variant, size: size))
    }
}

struct ChatUIButtonStyle: ButtonStyle {
    let variant: ChatUIButton.Variant
    let size: ChatUIButton.Size

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .padding(paddingForSize(size))
            .background(backgroundForVariant(variant, isPressed: configuration.isPressed))
            .foregroundColor(foregroundForVariant(variant))
            .font(fontForSize(size))
            .cornerRadius(DesignTokens.cornerRadius.medium)
    }

    private func backgroundForVariant(_ variant: ChatUIButton.Variant, isPressed: Bool) -> Color {
        switch variant {
        case .default:
            return isPressed ? DesignTokens.colors.accent.blue.opacity(0.9) : DesignTokens.colors.accent.blue
        case .destructive:
            return isPressed ? DesignTokens.colors.accent.red.opacity(0.9) : DesignTokens.colors.accent.red
        // ...
        }
    }
}
```

### 1.3 Component Parity Matrix

| Component  | React Status | Swift Status | Shared Logic   | Notes                           |
| ---------- | ------------ | ------------ | -------------- | ------------------------------- |
| Button     | ✅ Complete  | 🔄 Implement | ❌ None        | Pure UI, no shared logic needed |
| Input      | ✅ Complete  | 🔄 Implement | ✅ Validation  | Validation rules can be shared  |
| DatePicker | ✅ Complete  | 🔄 Implement | ✅ Formatting  | Date formatting/locale logic    |
| Combobox   | ✅ Complete  | 🔄 Implement | ✅ Filtering   | Search/filter algorithms        |
| Toast      | ✅ Complete  | 🔄 Implement | ✅ Queue Logic | Toast queue management          |
| ChatHeader | ✅ Complete  | 🔄 Implement | ✅ State Logic | Chat state management           |
| Pagination | ✅ Complete  | 🔄 Implement | ✅ Math Logic  | Page calculation logic          |

## 2. Shared Business Logic Architecture

### 2.1 Runtime Abstraction Layer

**Current Runtime (React-focused):**

```typescript
// packages/runtime/src/index.tsx - Current
export interface Host {
  mode: "embedded" | "standalone";
  callTool?: (name: string, args?: unknown) => Promise<unknown>;
  sendMessage?: (text: string) => Promise<void>;
  // ...
}
```

**Enhanced Cross-Platform Runtime:**

```typescript
// packages/runtime/src/core/host.ts - Enhanced
export interface PlatformHost {
  platform: "web" | "macos" | "ios";
  mode: "embedded" | "standalone";

  // Core capabilities
  callTool?: (name: string, args?: unknown) => Promise<unknown>;
  sendMessage?: (text: string) => Promise<void>;

  // Platform-specific capabilities
  nativeCapabilities?: {
    notifications?: boolean;
    fileSystem?: boolean;
    systemIntegration?: boolean;
  };
}

// Platform-specific implementations
export class WebHost implements PlatformHost {
  platform = "web" as const;
  // ... web-specific implementation
}

export class MacOSHost implements PlatformHost {
  platform = "macos" as const;
  // ... macOS-specific implementation via JSCore bridge
}
```

### 2.2 Shared State Management

```typescript
// packages/runtime/src/state/chat-state.ts
export interface ChatState {
  messages: Message[];
  currentUser: User | null;
  isTyping: boolean;
  connectionStatus: "connected" | "disconnected" | "reconnecting";
}

export class ChatStateManager {
  private state: ChatState;
  private listeners: Set<(state: ChatState) => void> = new Set();

  constructor(private host: PlatformHost) {
    this.state = this.getInitialState();
  }

  // Pure business logic - no platform dependencies
  addMessage(message: Message): void {
    this.state = {
      ...this.state,
      messages: [...this.state.messages, message],
    };
    this.notifyListeners();
  }

  // Platform-agnostic persistence
  async persistState(): Promise<void> {
    await this.host.setState?.(this.state);
  }

  // Can be consumed by both React hooks and Swift ObservableObject
  subscribe(listener: (state: ChatState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
```

### 2.3 JavaScript Core Bridge (Swift ↔ TypeScript)

```swift
// platforms/apple/swift/ui-swift/Sources/ChatUISwift/Runtime/JSBridge.swift
import JavaScriptCore

public class ChatUIJSBridge {
    private let context: JSContext
    private let stateManager: JSValue

    public init() throws {
        guard let jsPath = Bundle.module.path(forResource: "chatui-runtime", ofType: "js") else {
            throw ChatUIError.runtimeNotFound
        }

        let jsSource = try String(contentsOfFile: jsPath)
        context = JSContext()

        // Inject Swift → JS bridge functions
        context.setObject(self.callTool, forKeyedSubscript: "swiftCallTool" as NSString)
        context.setObject(self.sendMessage, forKeyedSubscript: "swiftSendMessage" as NSString)

        // Load the shared runtime
        context.evaluateScript(jsSource)

        // Get the state manager instance
        stateManager = context.objectForKeyedSubscript("ChatStateManager")
    }

    public func addMessage(_ message: ChatMessage) {
        let messageJS = JSValue(object: message.toJSONObject(), in: context)
        stateManager.invokeMethod("addMessage", withArguments: [messageJS])
    }

    private let callTool: @convention(block) (String, JSValue) -> JSValue = { name, args in
        // Bridge to Swift MCP client
        // Return Promise-like JSValue
    }
}
```

### 2.4 Validation & Business Rules

```typescript
// packages/runtime/src/validation/schemas.ts
import { z } from "zod";

export const MessageSchema = z.object({
  id: z.string().uuid(),
  content: z.string().min(1).max(10000),
  timestamp: z.date(),
  author: z.enum(["user", "assistant", "system"]),
  metadata: z.record(z.unknown()).optional(),
});

export const ChatConfigSchema = z.object({
  maxMessages: z.number().int().positive().max(1000),
  allowFileUploads: z.boolean(),
  enableNotifications: z.boolean(),
});

// These schemas can be used in both React and Swift via JS bridge
export type Message = z.infer<typeof MessageSchema>;
export type ChatConfig = z.infer<typeof ChatConfigSchema>;
```

## 3. Build & Distribution Pipeline

### 3.1 Enhanced Monorepo Structure

```
chatui/
├── packages/
│   ├── tokens/              # Design system source of truth
│   │   ├── src/            # Token definitions
│   │   ├── outputs/        # Generated platform files
│   │   └── build/          # Build scripts
│   ├── runtime/            # Shared business logic
│   │   ├── src/
│   │   │   ├── core/       # Platform-agnostic logic
│   │   │   ├── web/        # Web-specific adapters
│   │   │   └── native/     # Native bridge helpers
│   │   └── dist/
│   │       ├── web/        # Bundled for web
│   │       ├── platforms/apple/swift/      # Bundled for Swift Package
│   │       └── node/       # Node.js for build tools
│   ├── ui/                 # React components
│   ├── platforms/apple/swift/ui-swift/           # Swift/SwiftUI components
│   │   ├── Sources/
│   │   │   └── ChatUISwift/
│   │   │       ├── Components/  # SwiftUI components
│   │   │       ├── Runtime/     # JS bridge
│   │   │       └── Tokens/      # Generated design tokens
│   │   ├── Tests/
│   │   └── Package.swift
│   └── widgets/            # Cross-platform widget definitions
├── platforms/
│   ├── web/               # React web apps
│   │   ├── apps/web
│   │   ├── apps/storybook
│   ├── apple/             # Swift/macOS targets
│   │   ├── apps/macos
│   │   └── swift
│   └── mcp/               # MCP server + tool contracts
├── tools/
│   ├── build-tokens.ts    # Token generation
│   ├── build-runtime.ts   # Runtime bundling
│   └── sync-versions.ts   # Version synchronization
└── scripts/
    ├── build-all.sh       # Cross-platform build
    ├── test-all.sh        # Cross-platform testing
    └── release.sh         # Multi-platform release
```

### 3.2 Token Generation Pipeline

**Source of truth:** `packages/tokens/src/tokens/index.dtcg.json` (DTCG/W3C). Platform artifacts (`colors.ts`, `spacing.ts`, `typography.ts`, CSS, Swift) are generated from this bundle.

```typescript
// tools/build-tokens.ts
import { colorTokens, typographyTokens } from "@chatui/tokens";

interface TokenBuildConfig {
  platforms: ("css" | "swift" | "json")[];
  outputDir: string;
}

export async function buildTokens(config: TokenBuildConfig) {
  const generators = {
    css: generateCSSTokens,
    swift: generateSwiftTokens,
    json: generateJSONTokens,
  };

  for (const platform of config.platforms) {
    await generators[platform](config.outputDir);
  }
}

function generateSwiftTokens(outputDir: string) {
  const swiftCode = `
// Generated by build-tokens.ts - DO NOT EDIT
import SwiftUI

public enum DesignTokens {
    public enum Colors {
        public enum Background {
            public static let lightPrimary = Color(hex: "${colorTokens.background.light.primary}")
            public static let darkPrimary = Color(hex: "${colorTokens.background.dark.primary}")
        }
    }
    
    public enum Typography {
        public static let heading1 = Font.system(size: ${typographyTokens.heading1.size}, weight: .semibold)
        public static let body = Font.system(size: ${typographyTokens.body.size}, weight: .regular)
    }
}

extension Color {
    init(hex: String) {
        let scanner = Scanner(string: hex.dropFirst())
        var rgbValue: UInt64 = 0
        scanner.scanHexInt64(&rgbValue)
        
        let r = Double((rgbValue & 0xFF0000) >> 16) / 255.0
        let g = Double((rgbValue & 0x00FF00) >> 8) / 255.0
        let b = Double(rgbValue & 0x0000FF) / 255.0
        
        self.init(red: r, green: g, blue: b)
    }
}
`;

  writeFileSync(`${outputDir}/platforms/apple/swift/DesignTokens.swift`, swiftCode);
}
```

### 3.3 Runtime Bundling Strategy

```typescript
// tools/build-runtime.ts
import { build } from "esbuild";

export async function buildRuntime() {
  // Web bundle (ESM)
  await build({
    entryPoints: ["packages/runtime/src/index.tsx"],
    bundle: true,
    format: "esm",
    outfile: "packages/runtime/dist/web/index.js",
    external: ["react", "react-dom"],
    target: "es2020",
  });

  // Swift bundle (IIFE for JavaScriptCore)
  await build({
    entryPoints: ["packages/runtime/src/core/index.ts"],
    bundle: true,
    format: "iife",
    globalName: "ChatUIRuntime",
    outfile: "platforms/apple/swift/ui-swift/Sources/ChatUISwift/Resources/chatui-runtime.js",
    target: "es2017", // JavaScriptCore compatibility
    define: {
      "process.env.NODE_ENV": '"production"',
    },
  });

  // Node.js bundle (for build tools)
  await build({
    entryPoints: ["packages/runtime/src/core/index.ts"],
    bundle: true,
    format: "cjs",
    platform: "node",
    outfile: "packages/runtime/dist/node/index.js",
    target: "node16",
  });
}
```

### 3.4 Swift Package Manager Integration

```swift
// platforms/apple/swift/ui-swift/Package.swift
// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "ChatUISwift",
    platforms: [
        .macOS(.v13),
        .iOS(.v16)
    ],
    products: [
        .library(
            name: "ChatUISwift",
            targets: ["ChatUISwift"]
        ),
    ],
    dependencies: [
        // No external dependencies - self-contained
    ],
    targets: [
        .target(
            name: "ChatUISwift",
            dependencies: [],
            resources: [
                .process("Resources/chatui-runtime.js"), // Bundled JS runtime
                .process("Resources/DesignTokens.swift") // Generated tokens
            ]
        ),
        .testTarget(
            name: "ChatUISwiftTests",
            dependencies: ["ChatUISwift"]
        ),
    ]
)
```

### 3.5 Cross-Platform Build Pipeline (Current)

The repo uses a unified build pipeline. These commands exist today:

```bash
# Generate design tokens
pnpm generate:tokens

# Build core libraries (ui/runtime/tokens)
pnpm build:lib

# Build widgets
pnpm build:widgets

# Build web app
pnpm build:web

# Build macOS targets (Swift packages + macOS apps)
pnpm build:macos
```

For full details and flags, see `docs/BUILD_PIPELINE.md`.

### 3.6 Version Synchronization (Current)

Use the scripts in `scripts/`:

- `pnpm sync:versions` for JS package version alignment (`scripts/version-sync.mjs`)
- `pnpm sync:swift-versions` for Swift Package.swift version comments (`scripts/sync-swift-versions.mjs`)

See `docs/VERSION_SYNC.md` for the full workflow.

## Verify (Current Pipeline)

- `pnpm build:lib` builds UI/runtime/tokens.
- `pnpm build:widgets` builds widget bundles.
- `pnpm build:macos` builds Swift packages and macOS apps.

## 4. Implementation Roadmap (Historical)

### Phase 1: Foundation (Weeks 1-2)

- [ ] Enhance token system with multi-platform outputs
- [ ] Create Swift package structure
- [ ] Set up JavaScript Core bridge
- [ ] Implement basic Button/Input components in Swift

### Phase 2: Core Components (Weeks 3-4)

- [ ] Port remaining UI components to Swift
- [ ] Implement shared state management
- [ ] Create cross-platform build pipeline
- [ ] Add comprehensive testing

### Phase 3: Integration (Weeks 5-6)

- [ ] Build sample macOS app
- [ ] Implement widget system for Swift
- [ ] Add documentation and examples
- [ ] Performance optimization

### Phase 4: Production (Weeks 7-8)

- [ ] CI/CD pipeline for multi-platform releases
- [ ] Version synchronization automation
- [ ] Distribution via npm + Swift Package Manager
- [ ] Migration guides and tooling

## 5. Benefits & Trade-offs

### Benefits

- **Single Source of Truth**: Design tokens ensure visual consistency
- **Shared Business Logic**: Reduces duplication and bugs
- **Native Performance**: Swift UI feels native on macOS
- **Unified Development**: Same team can work on all platforms
- **Incremental Adoption**: Can be implemented gradually

### Trade-offs

- **Complexity**: More moving parts to maintain
- **Build Time**: Multi-platform builds take longer
- **Learning Curve**: Team needs Swift/SwiftUI knowledge
- **Testing Surface**: More platforms = more testing needed

## 6. Success Metrics

- **Component Parity**: 95%+ feature parity between React and Swift
- **Bundle Size**: Swift package < 2MB, JS runtime < 100KB
- **Performance**: Native Swift UI matches system performance
- **Developer Experience**: Single command builds all platforms
- **Maintenance**: Shared logic reduces bug reports by 40%

This architecture provides a solid foundation for true cross-platform development while maintaining the quality and performance users expect from each platform.
