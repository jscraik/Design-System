# Design Document: Gold-Standard UI Design System (Apps SDK UI–First)

Last updated: 2026-01-08

## Overview

This document specifies the architecture and implementation of the aStudio UI design system. It treats **Apps SDK UI (`@openai/apps-sdk-ui`) as the primary foundation** for all ChatGPT-embedded surfaces and as the baseline contract for web UI foundations (tokens, component behavior, interaction patterns). Apps SDK UI is explicitly designed to make apps feel native to ChatGPT and provides Tailwind + CSS variable tokens and accessible components.

**Foundation Rule (Non-Negotiable):** Custom tokens/components MUST either:

1. Alias/extend Apps SDK UI foundations, or
2. Use **Radix primitives strictly as a fallback** when Apps SDK UI lacks required coverage, while still adhering to Apps SDK UI tokens, accessibility, and interaction conventions.

This system extends the repo's published packages:

- `@design-studio/tokens` (CSS variables + Tailwind preset; canonical token outputs)
- `@design-studio/ui` (React components; Apps SDK UI-first wrappers + local primitives)
- `@design-studio/runtime` (Host adapters + `window.openai` seam, mocks, HostProvider)
- `packages/widgets` (ChatGPT widget bundles)
- Storybook + Widget Gallery apps for validation and demos
- Swift packages + macOS apps for native parity

**Key Design Decisions:**

1. **Apps SDK UI as Primary**: All components prefer Apps SDK UI re-export or composition over custom implementation
2. **Radix Fallback Policy**: Radix primitives only when Apps SDK UI lacks coverage, with documented migration path
3. **Token Alias Map**: Semantic tokens explicitly map to Apps SDK UI foundation values (verifiable against published foundations)
4. **Generated Component Coverage Matrix**: Auto-generated from upstream exports + local exports, enforced via CI
5. **Upstream Alignment Log**: Actionable tracking with drift tests, delta register, and review cadence
6. **Iframe Isolation**: Widgets run in iframe (primary isolation); Shadow DOM optional for internal encapsulation
7. **Host Contract Compliance**: `@design-studio/runtime` provides typed wrapper of `window.openai` with mock host for testing

## Architecture

```mermaid
graph TB
    subgraph "Upstream Contracts"
        APPSDKUI[@openai/apps-sdk-ui<br/>Tokens + Components]
        APPSDKDOCS[Apps SDK UI Guidelines + Reference]
        EXAMPLES[openai-apps-sdk-examples]
    end
    
    subgraph "Token Source of Truth"
        DTCG[DTCG-aligned JSON + pinned schema in-repo]
        ALIAS[Alias Map: semantic → Apps SDK UI foundations]
        DTCG --> ALIAS
    end
    
    subgraph "Token Pipeline"
        VAL[Validator: schema + naming + contrast + modes]
        GEN[Generator: CSS + Tailwind preset + TS + Swift + xcassets]
        ALIAS --> VAL --> GEN
    end
    
    subgraph "Published Packages"
        TOK[@design-studio/tokens]
        UI[@design-studio/ui]
        RT[@design-studio/runtime<br/>Host adapter seam]
        GEN --> TOK
        TOK --> UI
        RT --> UI
    end
    
    subgraph "Embedded Surfaces - ChatGPT"
        IFRAME[Widget runs in iframe]
        WIDGETS[packages/widgets]
        UI --> WIDGETS --> IFRAME
        RT --> IFRAME
    end
    
    subgraph "Dev Surfaces"
        SB[Storybook]
        GALLERY[Widget Gallery]
        UI --> SB
        WIDGETS --> GALLERY
    end
    
    subgraph "Native"
        SWIFT[Swift token outputs + xcassets]
        GEN --> SWIFT
    end
```

## Component Coverage Matrix

The matrix is **generated** (not maintained manually) from:

- upstream `@openai/apps-sdk-ui` exports, and
- local `packages/ui` exports.

### Generation Rules

- Any component available upstream MUST be re-exported or wrapped (no parallel re-implementation)
- Any local component not backed by Apps SDK UI MUST declare:
  - `fallback: radix` OR `local-primitive`
  - `why_missing_upstream`
  - `migration_trigger` (what upstream addition would replace it)
  - `a11y_contract_ref` (link to contract tests)

### CI Enforcement

PR fails if:

- A new component is added without a matrix entry
- A Radix import occurs outside `/fallback/` (or without an explicit waiver)
- A local component duplicates upstream capability

### Current Matrix

| Apps SDK UI Component | Local Wrapper | Status | Notes |
|----------------------|---------------|--------|-------|
| `Button` | `AppsSDKButton` | re-export | Direct re-export via integrations/apps-sdk |
| `Badge` | `AppsSDKBadge` | re-export | Direct re-export |
| `Checkbox` | `AppsSDKCheckbox` | re-export | Direct re-export |
| `Input` | `AppsSDKInput` | re-export | Direct re-export |
| `Textarea` | `AppsSDKTextarea` | re-export | Direct re-export |
| `Popover` | `AppsSDKPopover` | re-export | Direct re-export |
| `CodeBlock` | `AppsSDKCodeBlock` | re-export | Direct re-export |
| `Image` | `AppsSDKImage` | re-export | Direct re-export |
| `AppsSDKUIProvider` | `AppsSDKUIProvider` | re-export | Theme provider |
| `Download` (icon) | `AppsSDKDownloadIcon` | re-export | Prefer Apps SDK UI icons |
| `Sparkles` (icon) | `AppsSDKSparklesIcon` | re-export | Prefer Apps SDK UI icons |
|: | `Dialog` | Radix fallback | `why_missing_upstream`: Apps SDK UI lacks modal |
|: | `Drawer` | Radix fallback | `why_missing_upstream`: Apps SDK UI lacks drawer |
|: | `Tooltip` | Radix fallback | `why_missing_upstream`: Apps SDK UI lacks tooltip |
|: | `Select` | Radix fallback | `why_missing_upstream`: Apps SDK UI lacks select |
|: | `Slider` | Radix fallback | `why_missing_upstream`: Apps SDK UI lacks slider |

### Radix Fallback Policy

When Apps SDK UI lacks a component:

1. Use Radix primitive as the base
2. MUST consume semantic tokens aligned to Apps SDK UI
3. MUST match Apps SDK UI interaction conventions (focus, disabled, loading)
4. MUST document migration plan if Apps SDK UI later adds equivalent
5. MUST include parity notes in component documentation
6. MUST place fallback components in `packages/ui/src/components/**/fallback/`

## Upstream Alignment Log

| Field | Value |
|-------|-------|
| apps-sdk-ui pinned version | Recorded in `packages/ui/package.json` and repeated in token generation manifest |
| Last verified date | ISO timestamp written by CI when drift tests pass |
| Drift test suite | Snapshots + contract tests against fixed set of upstream components used in production |

### Delta Register

Any deviation from upstream tokens/behavior MUST be tracked with:

- **Rationale**: Why the deviation exists
- **Scope**: What's affected
- **Rollback plan**: How to revert if upstream changes
- **Owner**: Who is responsible
- **Expiry/review date**: When to re-evaluate

### Apps SDK UI Usage Enforcement

**ESLint Rules:**

- Disallow `@radix-ui/*` imports outside `packages/ui/src/components/**/fallback/**`
- Disallow creation of "parallel" components when upstream exists (config-based allowlist)

**CI Checks:**

- If apps-sdk-ui version changes, require drift tests to run and stamp the alignment log
- Validate Component Coverage Matrix is up-to-date with upstream exports

## Components and Interfaces

### 1. Token System Architecture (Apps SDK UI–Aligned)

The token system uses the existing `packages/tokens/src/tokens/index.dtcg.json` as the source of truth, which is already aligned to Apps SDK UI foundation values.

#### 1.1 Existing Token Structure

The repo already contains Apps SDK UI–aligned tokens:

```
packages/tokens/src/tokens/
└── index.dtcg.json           # Main token file with Apps SDK UI values
    ├── color/                # Background, text, icon, border, accent (light/dark)
    ├── space/                # 0, 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 128
    ├── radius/               # 6, 8, 10, 12, 16, 18, 21, 24, 30, round
    ├── size/                 # controlHeight (44), cardHeaderHeight (56), hitTarget (44)
    ├── shadow/               # card, pip, pill, close
    └── type/                 # web/ios/android typography scales
```

#### 1.2 Token Alias Map (Apps SDK UI → Semantic)

The Token Alias Map explicitly documents how semantic tokens map to Apps SDK UI foundations:

```typescript
// packages/tokens/src/alias-map.ts

/**
 * Token Alias Map: Semantic tokens → Apps SDK UI foundation values
 * This documents the explicit mapping to Apps SDK UI foundations.
 */
export const TOKEN_ALIAS_MAP = {
  // Background colors (from index.dtcg.json)
  'bg.primary': 'color.background.{mode}.primary',      // #FFFFFF / #212121
  'bg.secondary': 'color.background.{mode}.secondary',  // #E8E8E8 / #303030
  'bg.tertiary': 'color.background.{mode}.tertiary',    // #F3F3F3 / #414141
  
  // Text colors
  'text.primary': 'color.text.{mode}.primary',          // #0D0D0D / #FFFFFF
  'text.secondary': 'color.text.{mode}.secondary',      // #5D5D5D / #CDCDCD
  'text.tertiary': 'color.text.{mode}.tertiary',        // #8F8F8F / #AFAFAF
  
  // Accent colors
  'accent.blue': 'color.accent.{mode}.blue',            // #0285FF / #48AAFF
  'accent.green': 'color.accent.{mode}.green',          // #008635 / #40C977
  'accent.red': 'color.accent.{mode}.red',              // #E02E2A / #FF8583
  
  // Spacing (Apps SDK UI scale)
  'space.xs': 'space.s4',   // 4px
  'space.sm': 'space.s8',   // 8px
  'space.md': 'space.s16',  // 16px
  'space.lg': 'space.s24',  // 24px
  'space.xl': 'space.s32',  // 32px
  
  // Typography (web scale from index.dtcg.json)
  'type.heading1': 'type.web.heading1',
  'type.heading2': 'type.web.heading2',
  'type.heading3': 'type.web.heading3',
  'type.body': 'type.web.body',
  'type.bodySmall': 'type.web.bodySmall',
  'type.caption': 'type.web.caption',
  'type.buttonLabel': 'type.web.buttonLabel',
} as const;
```

#### 1.3 TokenGenerator Interface

```typescript
// packages/tokens/src/generator.ts

export interface TokenGeneratorConfig {
  inputPath: string;           // Path to DTCG source files
  outputPaths: {
    css: string;               // CSS custom properties output
    tailwind: string;          // Tailwind theme preset
    typescript: string;        // TypeScript types
    swift: string;             // Swift constants
    assetCatalog: string;      // Xcode Asset Catalog
  };
  modes: string[];             // ['light', 'dark', 'high-contrast']
  validate: boolean;           // Run validation before generation
  aliasMap: typeof TOKEN_ALIAS_MAP; // Apps SDK UI alias mapping
}

export interface GenerationManifest {
  version: string;
  appsSDKUIVersion: string;    // Pinned apps-sdk-ui version
  sha256: {
    css: string;
    tailwind: string;
    typescript: string;
    swift: string;
    assetCatalog: string;
  };
  generated: string;           // ISO timestamp (deterministic for CI)
  tokenCount: {
    reference: number;
    semantic: number;
    component: number;
  };
  aliasMapValid: boolean;      // Token alias map validation result
}

export class TokenGenerator {
  constructor(config: TokenGeneratorConfig);
  
  // Validate token files and alias map against Apps SDK UI
  async validate(): Promise<ValidationResult>;
  
  // Generate all platform outputs
  async generate(): Promise<GenerationManifest>;
  
  // Generate specific output
  async generateCSS(): Promise<string>;
  async generateTailwind(): Promise<string>;
  async generateTypeScript(): Promise<string>;
  async generateSwift(): Promise<string>;
  async generateAssetCatalog(): Promise<void>;
  
  // Watch mode for development
  watch(onChange: (manifest: GenerationManifest) => void): void;
}
```

### 2. React Component Library (Apps SDK UI–First)

#### 2.1 Existing Apps SDK UI Integration

The repo already has Apps SDK UI integration at `packages/ui/src/integrations/apps-sdk/index.ts`:

```typescript
// packages/ui/src/integrations/apps-sdk/index.ts (existing)
export { AppsSDKUIProvider } from "@openai/apps-sdk-ui/components/AppsSDKUIProvider";
export { Badge } from "@openai/apps-sdk-ui/components/Badge";
export { Button } from "@openai/apps-sdk-ui/components/Button";
export { CodeBlock } from "@openai/apps-sdk-ui/components/CodeBlock";
export { Checkbox } from "@openai/apps-sdk-ui/components/Checkbox";
export { Image } from "@openai/apps-sdk-ui/components/Image";
export { Input } from "@openai/apps-sdk-ui/components/Input";
export { Popover } from "@openai/apps-sdk-ui/components/Popover";
export { Textarea } from "@openai/apps-sdk-ui/components/Textarea";
export { Download, Sparkles } from "@openai/apps-sdk-ui/components/Icon";
```

And re-exported with prefixes in `packages/ui/src/index.ts`:

```typescript
// packages/ui/src/index.ts (existing)
export {
  AppsSDKUIProvider,
  Button as AppsSDKButton,
  Checkbox as AppsSDKCheckbox,
  Image as AppsSDKImage,
  Input as AppsSDKInput,
  Badge as AppsSDKBadge,
  CodeBlock as AppsSDKCodeBlock,
  Popover as AppsSDKPopover,
  Textarea as AppsSDKTextarea,
  Download as AppsSDKDownloadIcon,
  Sparkles as AppsSDKSparklesIcon,
} from "./integrations/apps-sdk";
```

#### 2.2 Package Structure (Apps SDK UI–First)

```
packages/ui/src/
├── integrations/
│   └── apps-sdk/             # PRIMARY: Apps SDK UI re-exports
│       └── index.ts          # Direct re-exports from @openai/apps-sdk-ui
├── components/
│   ├── primitives/           # Layout primitives (local implementation)
│   │   ├── Stack.tsx
│   │   ├── Inline.tsx
│   │   ├── Grid.tsx
│   │   ├── Divider.tsx
│   │   └── Spacer.tsx
│   ├── typography/           # Text components (local, uses tokens)
│   │   ├── Text.tsx
│   │   ├── Heading.tsx
│   │   ├── Code.tsx
│   │   ├── Label.tsx
│   │   └── Caption.tsx
│   ├── inputs/               # RADIX FALLBACK: Apps SDK UI lacks these
│   │   ├── Select.tsx        # Radix Select + Apps SDK UI tokens
│   │   ├── Combobox.tsx      # Radix Combobox + Apps SDK UI tokens
│   │   ├── Radio.tsx         # Radix Radio + Apps SDK UI tokens
│   │   ├── Switch.tsx        # Radix Switch + Apps SDK UI tokens
│   │   └── Slider.tsx        # Radix Slider + Apps SDK UI tokens
│   ├── feedback/             # Status indicators
│   │   ├── Alert.tsx
│   │   ├── Toast.tsx
│   │   ├── InlineError.tsx
│   │   ├── Skeleton.tsx
│   │   └── Progress.tsx
│   ├── data-display/         # Content display
│   │   ├── List.tsx
│   │   ├── KeyValue.tsx
│   │   ├── Table.tsx
│   │   └── Card.tsx
│   ├── overlays/             # RADIX FALLBACK: Apps SDK UI lacks these
│   │   ├── Tooltip.tsx       # Radix Tooltip + Apps SDK UI tokens
│   │   ├── Dialog.tsx        # Radix Dialog + Apps SDK UI tokens
│   │   └── Drawer.tsx        # Radix Dialog variant + Apps SDK UI tokens
│   └── llm/                  # AI-specific components
│       ├── StreamingText.tsx
│       ├── CitationList.tsx
│       ├── SourceChip.tsx
│       ├── RegenerateButton.tsx
│       ├── FeedbackButtons.tsx
│       ├── ConfirmAction.tsx
│       └── AgentStatus.tsx
├── hooks/
│   ├── useTokens.ts          # Access design tokens
│   ├── useFocusTrap.ts       # Focus management
│   └── useReducedMotion.ts   # Motion preferences
└── utils/
    ├── cn.ts                 # Class name utility (clsx + tailwind-merge)
    └── tokens.ts             # Token access utilities
```

#### 2.3 Component Interface Pattern (Radix Fallback Example)

When Apps SDK UI lacks a component, use Radix with Apps SDK UI tokens:

```typescript
// packages/ui/src/components/overlays/Dialog.tsx
// RADIX FALLBACK: Apps SDK UI lacks modal/dialog component

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { X } from 'lucide-react';

/**
 * Dialog component using Radix primitive with Apps SDK UI tokens.
 * 
 * Apps_SDK_UI Mapping:
 * - Upstream: Not available in @openai/apps-sdk-ui
 * - Fallback: Radix Dialog primitive
 * - Tokens: Uses Apps SDK UI semantic tokens (bg, text, border, shadow)
 * - Migration: Will migrate when Apps SDK UI adds Dialog component
 */

const dialogOverlayVariants = cva(
  // Uses Apps SDK UI token values via Tailwind
  'fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out',
);

const dialogContentVariants = cva(
  // Apps SDK UI aligned: bg-primary, border-light, shadow-card, radius-r16
  'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%]',
  'gap-4 border border-border-light bg-bg-primary p-6 shadow-card rounded-2xl',
  'duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out',
);

export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </DialogPrimitive.Root>
  );
}

Dialog.Trigger = DialogPrimitive.Trigger;

Dialog.Content = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className={dialogOverlayVariants()} />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(dialogContentVariants(), className)}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-interactive-ring">
        <X className="h-4 w-4 text-icon-secondary" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
Dialog.Content.displayName = 'Dialog.Content';

Dialog.Title = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    // Apps SDK UI typography: heading3 equivalent
    className={cn('text-lg font-semibold text-text-primary tracking-tight', className)}
    {...props}
  />
));
Dialog.Title.displayName = 'Dialog.Title';

Dialog.Description = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    // Apps SDK UI typography: body equivalent
    className={cn('text-sm text-text-secondary', className)}
    {...props}
  />
));
Dialog.Description.displayName = 'Dialog.Description';

Dialog.Footer = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
);
Dialog.Footer.displayName = 'Dialog.Footer';
```

### 3. SwiftUI Component Library (Apps SDK UI Parity)

#### 3.1 Existing Package Structure

The repo already has modular Swift packages at `platforms/apple/swift/`:

```
platforms/apple/swift/
├── AStudioFoundation/         # Foundation tokens aligned to Apps SDK UI
│   ├── Package.swift
│   └── Sources/AStudioFoundation/
│       ├── Tokens/
│       │   ├── FColor.swift          # Semantic colors via Asset Catalog
│       │   ├── FType.swift           # Typography styles
│       │   ├── FSpacing.swift        # Spacing constants (Apps SDK UI scale)
│       │   ├── FRadius.swift         # Corner radius values
│       │   └── FMotion.swift         # Animation durations/easing
│       ├── Platform/
│       │   ├── Platform.swift        # Platform detection (iOS/macOS/visionOS)
│       │   └── PlatformModifiers.swift
│       ├── Accessibility/
│       │   ├── FAccessibility.swift  # Focus ring, high contrast, reduced motion
│       │   └── AccessibilityModifiers.swift
│       └── Resources/
│           └── Colors.xcassets/      # Generated Asset Catalog
├── AStudioComponents/         # UI components with Apps SDK UI parity
│   ├── Package.swift
│   └── Sources/AStudioComponents/
│       ├── Settings/                 # Settings primitives (existing)
│       │   ├── SettingsCardView.swift
│       │   ├── SettingRowView.swift
│       │   ├── SettingToggleView.swift
│       │   ├── SettingDropdownView.swift
│       │   └── SettingsDivider.swift
│       └── ... (other components)
├── AStudioThemes/             # Theme presets
│   ├── Package.swift
│   └── Sources/AStudioThemes/
│       ├── ChatGPTTheme.swift        # ChatGPT-style constants
│       └── DefaultTheme.swift        # Native platform styling
└── AStudioShellChatGPT/       # Application shell
    ├── Package.swift
    └── Sources/AStudioShellChatGPT/
        ├── AppShellView.swift
        ├── VisualEffectView.swift
        └── RoundedAppContainer.swift
```

#### 3.2 Foundation Token Interface

```swift
// platforms/apple/swift/AStudioFoundation/Sources/AStudioFoundation/Tokens/FColor.swift

import SwiftUI

/// Semantic color tokens backed by Asset Catalog for automatic light/dark mode
public enum FColor {
    // MARK: - Background
    public static let bgPrimary = Color("bg-primary")
    public static let bgSecondary = Color("bg-secondary")
    public static let bgTertiary = Color("bg-tertiary")
    public static let bgSurface = Color("bg-surface")
    public static let bgElevated = Color("bg-elevated")
    
    // MARK: - Text
    public static let textPrimary = Color("text-primary")
    public static let textSecondary = Color("text-secondary")
    public static let textTertiary = Color("text-tertiary")
    public static let textInverted = Color("text-inverted")
    
    // MARK: - Icon
    public static let iconPrimary = Color("icon-primary")
    public static let iconSecondary = Color("icon-secondary")
    public static let iconTertiary = Color("icon-tertiary")
    
    // MARK: - Accent
    public static let accentBlue = Color("accent-blue")
    public static let accentGreen = Color("accent-green")
    public static let accentRed = Color("accent-red")
    public static let accentOrange = Color("accent-orange")
    public static let accentPurple = Color("accent-purple")
    
    // MARK: - Border
    public static let borderDefault = Color("border-default")
    public static let borderLight = Color("border-light")
    public static let borderHeavy = Color("border-heavy")
    
    // MARK: - Status
    public static let statusSuccess = Color("status-success")
    public static let statusWarning = Color("status-warning")
    public static let statusError = Color("status-error")
    public static let statusInfo = Color("status-info")
    
    // MARK: - Interactive
    public static let focusRing = Color("focus-ring")
}

// platforms/apple/swift/AStudioFoundation/Sources/AStudioFoundation/Tokens/FType.swift

import SwiftUI

/// Typography tokens matching React component styles
public enum FType {
    // MARK: - Headings
    public static func heading1() -> Font {
        .system(size: 36, weight: .semibold)
    }
    
    public static func heading2() -> Font {
        .system(size: 24, weight: .semibold)
    }
    
    public static func heading3() -> Font {
        .system(size: 18, weight: .semibold)
    }
    
    // MARK: - Body
    public static func body() -> Font {
        .system(size: 16, weight: .regular)
    }
    
    public static func bodySmall() -> Font {
        .system(size: 14, weight: .regular)
    }
    
    public static func bodyEmphasis() -> Font {
        .system(size: 16, weight: .semibold)
    }
    
    // MARK: - Caption
    public static func caption() -> Font {
        .system(size: 12, weight: .regular)
    }
    
    // MARK: - Button
    public static func buttonLabel() -> Font {
        .system(size: 15, weight: .medium)
    }
    
    public static func buttonLabelSmall() -> Font {
        .system(size: 14, weight: .semibold)
    }
    
    // MARK: - Tracking (letter-spacing)
    public static let trackingHeading: CGFloat = -0.25
    public static let trackingBody: CGFloat = -0.4
    public static let trackingCaption: CGFloat = -0.1
}

// platforms/apple/swift/AStudioFoundation/Sources/AStudioFoundation/Tokens/FSpacing.swift

import Foundation

/// Spacing scale matching React/Tailwind
public enum FSpacing {
    public static let s0: CGFloat = 0
    public static let s2: CGFloat = 2
    public static let s4: CGFloat = 4
    public static let s8: CGFloat = 8
    public static let s12: CGFloat = 12
    public static let s16: CGFloat = 16
    public static let s24: CGFloat = 24
    public static let s32: CGFloat = 32
    public static let s40: CGFloat = 40
    public static let s48: CGFloat = 48
    public static let s64: CGFloat = 64
    public static let s128: CGFloat = 128
}
```

#### 3.3 Component Interface Pattern

```swift
// platforms/apple/swift/AStudioComponents/Sources/AStudioComponents/Actions/FButton.swift

import SwiftUI
import AStudioFoundation
import AStudioThemes

public enum FButtonVariant {
    case primary
    case secondary
    case soft
    case destructive
    case ghost
}

public enum FButtonSize {
    case sm
    case md
    case lg
    
    var height: CGFloat {
        switch self {
        case .sm: return 32
        case .md: return 40
        case .lg: return 48
        }
    }
    
    var horizontalPadding: CGFloat {
        switch self {
        case .sm: return FSpacing.s12
        case .md: return FSpacing.s16
        case .lg: return FSpacing.s24
        }
    }
    
    var font: Font {
        switch self {
        case .sm, .md: return FType.buttonLabelSmall()
        case .lg: return FType.buttonLabel()
        }
    }
}

public struct FButton<Label: View>: View {
    let variant: FButtonVariant
    let size: FButtonSize
    let isLoading: Bool
    let isDisabled: Bool
    let action: () -> Void
    let label: () -> Label
    
    @Environment(\.colorScheme) private var colorScheme
    @State private var isHovering = false
    @State private var isPressed = false
    
    public init(
        variant: FButtonVariant = .primary,
        size: FButtonSize = .md,
        isLoading: Bool = false,
        isDisabled: Bool = false,
        action: @escaping () -> Void,
        @ViewBuilder label: @escaping () -> Label
    ) {
        self.variant = variant
        self.size = size
        self.isLoading = isLoading
        self.isDisabled = isDisabled
        self.action = action
        self.label = label
    }
    
    public var body: some View {
        Button(action: action) {
            HStack(spacing: FSpacing.s8) {
                if isLoading {
                    ProgressView()
                        .progressViewStyle(.circular)
                        .scaleEffect(0.8)
                }
                label()
            }
            .font(size.font)
            .foregroundStyle(foregroundColor)
            .frame(height: size.height)
            .padding(.horizontal, size.horizontalPadding)
            .background(backgroundColor)
            .clipShape(RoundedRectangle(cornerRadius: FRadius.md, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: FRadius.md, style: .continuous)
                    .stroke(borderColor, lineWidth: variant == .secondary ? 1 : 0)
            )
        }
        .buttonStyle(.plain)
        .disabled(isDisabled || isLoading)
        .opacity(isDisabled ? 0.5 : 1)
        #if os(macOS)
        .onHover { isHovering = $0 }
        #endif
        .accessibilityLabel(isLoading ? "Loading" : "")
    }
    
    private var backgroundColor: Color {
        switch variant {
        case .primary:
            return isHovering ? FColor.accentBlue.opacity(0.9) : FColor.accentBlue
        case .secondary:
            return isHovering ? FColor.bgTertiary : FColor.bgSecondary
        case .soft:
            return isHovering ? FColor.accentBlue.opacity(0.2) : FColor.accentBlue.opacity(0.1)
        case .destructive:
            return isHovering ? FColor.accentRed.opacity(0.9) : FColor.accentRed
        case .ghost:
            return isHovering ? FColor.bgSecondary : .clear
        }
    }
    
    private var foregroundColor: Color {
        switch variant {
        case .primary, .destructive:
            return FColor.textInverted
        case .secondary, .ghost:
            return FColor.textPrimary
        case .soft:
            return FColor.accentBlue
        }
    }
    
    private var borderColor: Color {
        variant == .secondary ? FColor.borderDefault : .clear
    }
}
```

### 4. Widget Runtime System (Iframe Isolation + Host Contract)

Widgets run in an **iframe** (primary isolation). Shadow DOM may be used within the iframe only for internal style encapsulation of third-party content or markdown renderers.

#### 4.1 Host Contract Compliance

`@design-studio/runtime` provides a typed wrapper of `window.openai` and a mock host for Storybook/Gallery parity:

```typescript
// packages/runtime/src/host-adapter.ts

import type { OpenAIHostAPI } from './types';

/**
 * Typed wrapper for window.openai host API.
 * Only uses documented APIs from Apps SDK reference.
 */
export class HostAdapter {
  private host: OpenAIHostAPI | null = null;
  
  constructor() {
    if (typeof window !== 'undefined' && window.openai) {
      this.host = window.openai;
    }
  }
  
  get isConnected(): boolean {
    return this.host !== null;
  }
  
  // Documented host APIs only
  getToolInput<T = unknown>(): T | undefined {
    return this.host?.toolInput as T;
  }
  
  getToolOutput<T = unknown>(): T | undefined {
    return this.host?.toolOutput as T;
  }
  
  getWidgetState<T = unknown>(): T | undefined {
    return this.host?.widgetState as T;
  }
  
  getTheme(): { colorScheme: 'light' | 'dark'; accentColor?: string } {
    return this.host?.theme ?? { colorScheme: 'light' };
  }
  
  getDisplayMode(): 'inline' | 'fullscreen' | 'pip' {
    return this.host?.displayMode ?? 'inline';
  }
  
  getSafeArea(): { top: number; bottom: number; left: number; right: number } {
    return this.host?.safeArea ?? { top: 0, bottom: 0, left: 0, right: 0 };
  }
  
  getLocale(): string {
    return this.host?.locale ?? 'en';
  }
  
  async callTool(name: string, args: unknown): Promise<unknown> {
    return this.host?.callTool?.(name, args);
  }
  
  setWidgetState(state: unknown): void {
    this.host?.setWidgetState?.(state);
  }
  
  requestDisplayMode(mode: 'inline' | 'fullscreen'): void {
    this.host?.requestDisplayMode?.(mode);
  }
  
  notifyIntrinsicHeight(height: number): void {
    this.host?.notifyIntrinsicHeight?.(height);
  }
}

// packages/runtime/src/mock-host.ts

/**
 * Mock host for Storybook/Gallery testing.
 * Implements same interface as real host.
 */
export function createMockHost(config?: Partial<MockHostConfig>): OpenAIHostAPI {
  return {
    toolInput: config?.toolInput ?? {},
    toolOutput: config?.toolOutput ?? {},
    widgetState: config?.widgetState ?? {},
    theme: config?.theme ?? { colorScheme: 'light' },
    displayMode: config?.displayMode ?? 'inline',
    safeArea: config?.safeArea ?? { top: 0, bottom: 0, left: 0, right: 0 },
    locale: config?.locale ?? 'en',
    callTool: config?.callTool ?? (async () => ({})),
    setWidgetState: config?.setWidgetState ?? (() => {}),
    requestDisplayMode: config?.requestDisplayMode ?? (() => {}),
    notifyIntrinsicHeight: config?.notifyIntrinsicHeight ?? (() => {}),
  };
}
```

#### 4.2 Existing Widget Architecture

The repo already has widget infrastructure at `packages/widgets/`:

```
packages/widgets/src/
├── sdk/
│   ├── generated/
│   │   └── widget-manifest.ts    # Auto-generated from widget discovery
│   └── plugins/
│       └── widget-manifest.ts    # Vite plugin for widget discovery
├── shared/                       # Shared utilities
│   ├── widget-base.tsx           # Base wrapper component
│   ├── openai-hooks.ts           # window.openai integration hooks (uses HostAdapter)
│   ├── use-widget-props.ts       # Widget props hook
│   ├── use-widget-state.ts       # Widget state hook
│   └── ... (other utilities)
├── styles/
│   └── widget.css                # Widget base styles with CSS variables
└── widgets/
    └── [category]/[widget-name]/ # Widget implementations
```

#### 4.3 Widget Base (Apps SDK UI Aligned)

```typescript
// packages/widgets/src/shared/widget-base.tsx

import React, { useEffect, useRef } from 'react';
import { cn } from '@design-studio/ui/utils';
import { useHostAdapter } from './use-host-adapter';

export interface WidgetBaseProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
  autoHeight?: boolean;
}

export function WidgetBase({ 
  title, 
  className, 
  children, 
  autoHeight = true 
}: WidgetBaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const host = useHostAdapter();
  const theme = host.getTheme();
  
  // Report height changes to host
  useEffect(() => {
    if (!autoHeight || !containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        host.notifyIntrinsicHeight(entry.contentRect.height);
      }
    });
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [autoHeight, host]);
  
  return (
    <div 
      ref={containerRef}
      className={cn(
        // Apps SDK UI aligned tokens
        'widget-base antialiased w-full p-4',
        'border border-border-light rounded-2xl overflow-hidden',
        'bg-bg-primary text-text-primary',
        theme.colorScheme === 'dark' ? 'dark' : 'light',
        className
      )}
    >
      {title && (
        <header className="widget-header mb-4 pb-3 border-b border-border-light">
          <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        </header>
      )}
      <main className="widget-content overflow-auto max-h-[80vh]">
        {children}
      </main>
    </div>
  );
}
```

#### 4.4 Existing WidgetErrorBoundary

The repo already has error boundary at `packages/widgets/src/shared/widget-base.tsx` - no changes needed.
        // Apps SDK UI aligned tokens
        'widget-base antialiased w-full p-4',
        'border border-border-light rounded-2xl overflow-hidden',
        'bg-bg-primary text-text-primary',
        colorScheme === 'dark' ? 'dark' : 'light',
        className
      )}
      style={{
        // Inject host theme as CSS variables (Apps SDK UI compatible)
        '--widget-accent': theme?.accentColor,
        '--widget-bg': theme?.backgroundColor,
        '--widget-text': theme?.textColor,
      } as React.CSSProperties}
    >
      {title && (
        <header className="widget-header mb-4 pb-3 border-b border-border-light">
          <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        </header>
      )}
      <main className="widget-content overflow-auto max-h-[80vh]">
        {children}
      </main>
    </div>
  );
}

```

#### 4.4 Existing WidgetErrorBoundary

The repo already has error boundary at `packages/widgets/src/shared/widget-base.tsx`:

```typescript
// packages/widgets/src/shared/widget-base.tsx (existing)
export class WidgetErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error?: Error }
> {
  // ... existing implementation
}
```g>
    </>
  );
}
```

### 5. LLM/AI Interaction Components

#### 5.1 Streaming Text Component

```typescript
// packages/ui/src/components/llm/StreamingText.tsx

import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface StreamingTextProps {
  /** Text content (may be partial during streaming) */
  content: string;
  /** Whether content is still streaming */
  isStreaming: boolean;
  /** Callback when streaming completes */
  onComplete?: () => void;
  /** Custom cursor element */
  cursor?: React.ReactNode;
  className?: string;
}

/**
 * Streaming text component for LLM output.
 * - Incremental rendering without layout shifts
 * - Accessible announcements (debounced to avoid SR spam)
 * - Respects reduced motion preferences
 */
export function StreamingText({
  content,
  isStreaming,
  onComplete,
  cursor,
  className,
}: StreamingTextProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [announced, setAnnounced] = useState('');
  
  // Debounced screen reader announcements
  useEffect(() => {
    if (!isStreaming) {
      setAnnounced(content);
      onComplete?.();
      return;
    }
    
    // Announce new content every 2 seconds to avoid SR spam
    const timer = setTimeout(() => {
      if (content !== announced) {
        setAnnounced(content);
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [content, isStreaming, announced, onComplete]);
  
  return (
    <div 
      ref={containerRef}
      className={cn('streaming-text', className)}
      role="status"
      aria-live="polite"
      aria-busy={isStreaming}
    >
      <span className="streaming-text-content">
        {content}
      </span>
      
      {isStreaming && (
        <span 
          className={cn(
            'streaming-cursor',
            !prefersReducedMotion && 'animate-pulse'
          )}
          aria-hidden
        >
          {cursor || '▋'}
        </span>
      )}
      
      {/* Screen reader announcement (hidden visually) */}
      <span className="sr-only">
        {announced}
        {isStreaming && ' (still generating)'}
      </span>
    </div>
  );
}
```

#### 5.2 Citation Components

```typescript
// packages/ui/src/components/llm/CitationList.tsx

import React from 'react';
import { SourceChip } from './SourceChip';

export interface Citation {
  id: string;
  title: string;
  url?: string;
  snippet?: string;
  domain?: string;
}

export interface CitationListProps {
  citations: Citation[];
  /** Inline markers in text reference these IDs */
  highlightedId?: string;
  onCitationClick?: (citation: Citation) => void;
  className?: string;
}

/**
 * Citation list component for AI-generated content.
 * - Keyboard navigable
 * - Screen reader accessible
 * - Supports inline marker highlighting
 */
export function CitationList({
  citations,
  highlightedId,
  onCitationClick,
  className,
}: CitationListProps) {
  return (
    <nav 
      className={cn('citation-list', className)}
      aria-label="Sources"
    >
      <h4 className="citation-list-title">Sources</h4>
      <ol className="citation-list-items">
        {citations.map((citation, index) => (
          <li 
            key={citation.id}
            className={cn(
              'citation-item',
              highlightedId === citation.id && 'citation-item-highlighted'
            )}
          >
            <SourceChip
              index={index + 1}
              title={citation.title}
              url={citation.url}
              domain={citation.domain}
              onClick={() => onCitationClick?.(citation)}
            />
            {citation.snippet && (
              <p className="citation-snippet">{citation.snippet}</p>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// packages/ui/src/components/llm/SourceChip.tsx

export interface SourceChipProps {
  index: number;
  title: string;
  url?: string;
  domain?: string;
  onClick?: () => void;
}

export function SourceChip({
  index,
  title,
  url,
  domain,
  onClick,
}: SourceChipProps) {
  const Comp = url ? 'a' : 'button';
  
  return (
    <Comp
      className="source-chip"
      href={url}
      target={url ? '_blank' : undefined}
      rel={url ? 'noopener noreferrer' : undefined}
      onClick={onClick}
      aria-label={`Source ${index}: ${title}`}
    >
      <span className="source-chip-index" aria-hidden>
        {index}
      </span>
      <span className="source-chip-title">{title}</span>
      {domain && (
        <span className="source-chip-domain">{domain}</span>
      )}
    </Comp>
  );
}
```

#### 5.3 Feedback Components

```typescript
// packages/ui/src/components/llm/FeedbackButtons.tsx

import React, { useState } from 'react';
import { IconButton } from '../actions/IconButton';
import { Popover } from '../overlays/Popover';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

export interface FeedbackReason {
  id: string;
  label: string;
}

export interface FeedbackButtonsProps {
  /** Current feedback state */
  feedback?: 'positive' | 'negative' | null;
  /** Available reasons for negative feedback */
  negativeReasons?: FeedbackReason[];
  /** Callback when feedback is submitted */
  onFeedback: (feedback: {
    type: 'positive' | 'negative';
    reasons?: string[];
    comment?: string;
  }) => void;
  className?: string;
}

const DEFAULT_NEGATIVE_REASONS: FeedbackReason[] = [
  { id: 'incorrect', label: 'Incorrect information' },
  { id: 'unhelpful', label: 'Not helpful' },
  { id: 'incomplete', label: 'Incomplete answer' },
  { id: 'harmful', label: 'Harmful or unsafe' },
  { id: 'other', label: 'Other' },
];

export function FeedbackButtons({
  feedback,
  negativeReasons = DEFAULT_NEGATIVE_REASONS,
  onFeedback,
  className,
}: FeedbackButtonsProps) {
  const [showReasons, setShowReasons] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  
  const handlePositive = () => {
    onFeedback({ type: 'positive' });
  };
  
  const handleNegative = () => {
    setShowReasons(true);
  };
  
  const submitNegative = () => {
    onFeedback({
      type: 'negative',
      reasons: selectedReasons,
      comment: comment || undefined,
    });
    setShowReasons(false);
    setSelectedReasons([]);
    setComment('');
  };
  
  return (
    <div className={cn('feedback-buttons', className)}>
      <IconButton
        icon={<ThumbsUp />}
        variant={feedback === 'positive' ? 'soft' : 'ghost'}
        size="sm"
        onClick={handlePositive}
        aria-label="Good response"
        aria-pressed={feedback === 'positive'}
      />
      
      <Popover open={showReasons} onOpenChange={setShowReasons}>
        <Popover.Trigger asChild>
          <IconButton
            icon={<ThumbsDown />}
            variant={feedback === 'negative' ? 'soft' : 'ghost'}
            size="sm"
            onClick={handleNegative}
            aria-label="Bad response"
            aria-pressed={feedback === 'negative'}
          />
        </Popover.Trigger>
        
        <Popover.Content>
          <div className="feedback-reasons">
            <h4>What was the issue?</h4>
            <div className="feedback-reason-list">
              {negativeReasons.map((reason) => (
                <label key={reason.id} className="feedback-reason-item">
                  <input
                    type="checkbox"
                    checked={selectedReasons.includes(reason.id)}
                    onChange={(e) => {
                      setSelectedReasons(prev =>
                        e.target.checked
                          ? [...prev, reason.id]
                          : prev.filter(id => id !== reason.id)
                      );
                    }}
                  />
                  <span>{reason.label}</span>
                </label>
              ))}
            </div>
            <textarea
              placeholder="Additional comments (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="feedback-comment"
            />
            <Button onClick={submitNegative} size="sm">
              Submit Feedback
            </Button>
          </div>
        </Popover.Content>
      </Popover>
    </div>
  );
}
```

#### 5.4 Agent Status Component

```typescript
// packages/ui/src/components/llm/AgentStatus.tsx

import React from 'react';
import { Progress } from '../feedback/Progress';
import { Button } from '../actions/Button';
import { Pause, Play, X, Check, AlertCircle } from 'lucide-react';

export type AgentState = 
  | 'queued'
  | 'running'
  | 'waiting'
  | 'completed'
  | 'failed'
  | 'paused'
  | 'cancelled';

export interface AgentStep {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  output?: string;
}

export interface AgentStatusProps {
  state: AgentState;
  steps: AgentStep[];
  currentStep?: string;
  progress?: number;
  error?: string;
  onPause?: () => void;
  onResume?: () => void;
  onCancel?: () => void;
  onRetry?: () => void;
  className?: string;
}

export function AgentStatus({
  state,
  steps,
  currentStep,
  progress,
  error,
  onPause,
  onResume,
  onCancel,
  onRetry,
  className,
}: AgentStatusProps) {
  const isActive = state === 'running' || state === 'waiting';
  const canPause = state === 'running' && onPause;
  const canResume = state === 'paused' && onResume;
  const canCancel = isActive && onCancel;
  const canRetry = state === 'failed' && onRetry;
  
  return (
    <div className={cn('agent-status', `agent-status-${state}`, className)}>
      <header className="agent-status-header">
        <div className="agent-status-indicator">
          {state === 'running' && <Spinner className="animate-spin" />}
          {state === 'completed' && <Check className="text-status-success" />}
          {state === 'failed' && <AlertCircle className="text-status-error" />}
          {state === 'paused' && <Pause className="text-status-warning" />}
        </div>
        
        <span className="agent-status-label">
          {state === 'queued' && 'Queued'}
          {state === 'running' && 'Running'}
          {state === 'waiting' && 'Waiting for input'}
          {state === 'completed' && 'Completed'}
          {state === 'failed' && 'Failed'}
          {state === 'paused' && 'Paused'}
          {state === 'cancelled' && 'Cancelled'}
        </span>
        
        <div className="agent-status-actions">
          {canPause && (
            <IconButton icon={<Pause />} size="sm" onClick={onPause} aria-label="Pause" />
          )}
          {canResume && (
            <IconButton icon={<Play />} size="sm" onClick={onResume} aria-label="Resume" />
          )}
          {canCancel && (
            <IconButton icon={<X />} size="sm" onClick={onCancel} aria-label="Cancel" />
          )}
          {canRetry && (
            <Button size="sm" onClick={onRetry}>Retry</Button>
          )}
        </div>
      </header>
      
      {progress !== undefined && isActive && (
        <Progress value={progress} className="agent-status-progress" />
      )}
      
      {error && (
        <div className="agent-status-error" role="alert">
          {error}
        </div>
      )}
      
      <ol className="agent-status-steps" aria-label="Task steps">
        {steps.map((step) => (
          <li 
            key={step.id}
            className={cn(
              'agent-step',
              `agent-step-${step.status}`,
              currentStep === step.id && 'agent-step-current'
            )}
          >
            <span className="agent-step-indicator" aria-hidden>
              {step.status === 'completed' && <Check />}
              {step.status === 'running' && <Spinner className="animate-spin" />}
              {step.status === 'failed' && <AlertCircle />}
              {step.status === 'pending' && <span className="agent-step-dot" />}
            </span>
            <span className="agent-step-label">{step.label}</span>
            {step.output && (
              <span className="agent-step-output">{step.output}</span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
```

## Data Models

### Token System Data Models

#### DTCG Token Schema

```typescript
// packages/tokens/src/schema/dtcg.ts

/**
 * W3C DTCG 2025.10 compliant token schema
 */
export interface DTCGToken {
  $value: string | number | DTCGTokenReference;
  $type: DTCGTokenType;
  $description?: string;
  $extensions?: {
    mode?: Record<string, string | number>;
    [key: string]: unknown;
  };
}

export type DTCGTokenType = 
  | 'color'
  | 'dimension'
  | 'fontFamily'
  | 'fontWeight'
  | 'duration'
  | 'cubicBezier'
  | 'number'
  | 'strokeStyle'
  | 'border'
  | 'transition'
  | 'shadow'
  | 'gradient'
  | 'typography';

export interface DTCGTokenReference {
  $ref: string; // for example, "{ref.color.gray.900}"
}

export interface DTCGTokenGroup {
  [key: string]: DTCGToken | DTCGTokenGroup;
}

export interface DTCGTokenFile {
  $schema?: string;
  [key: string]: DTCGToken | DTCGTokenGroup | string | undefined;
}
```

#### Token Generation Manifest

```typescript
// packages/tokens/src/schema/manifest.ts

export interface GenerationManifest {
  version: string;
  sha256: {
    css: string;
    tailwind: string;
    typescript: string;
    swift: string;
    assetCatalog: string;
  };
  generated: string; // ISO timestamp
  tokenCount: {
    reference: number;
    semantic: number;
    component: number;
  };
  modes: string[];
  validation: {
    passed: boolean;
    warnings: ValidationWarning[];
    errors: ValidationError[];
  };
}

export interface ValidationWarning {
  path: string;
  message: string;
  suggestion?: string;
}

export interface ValidationError {
  path: string;
  message: string;
  code: string;
}
```

### Component Library Data Models

#### React Component Props

```typescript
// packages/ui/src/types/component-props.ts

/**
 * Base props shared by all components
 */
export interface BaseComponentProps {
  className?: string;
  'data-testid'?: string;
}

/**
 * Props for components with variants
 */
export interface VariantProps<T extends string> {
  variant?: T;
}

/**
 * Props for components with sizes
 */
export interface SizeProps<T extends string = 'sm' | 'md' | 'lg'> {
  size?: T;
}

/**
 * Props for interactive components
 */
export interface InteractiveProps {
  disabled?: boolean;
  loading?: boolean;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

/**
 * Props for form components
 */
export interface FormFieldProps {
  id?: string;
  name?: string;
  required?: boolean;
  error?: string;
  hint?: string;
}
```

#### SwiftUI Component Models

```swift
// platforms/apple/swift/AStudioComponents/Sources/AStudioComponents/Models/ComponentModels.swift

import Foundation

/// Variant options for button components
public enum ButtonVariant: String, CaseIterable {
    case primary
    case secondary
    case soft
    case destructive
    case ghost
    case link
}

/// Size options for components
public enum ComponentSize: String, CaseIterable {
    case sm
    case md
    case lg
    
    public var height: CGFloat {
        switch self {
        case .sm: return 32
        case .md: return 40
        case .lg: return 48
        }
    }
}

/// Status variants for feedback components
public enum StatusVariant: String, CaseIterable {
    case info
    case success
    case warning
    case error
}

/// Agent execution states
public enum AgentState: String, CaseIterable {
    case queued
    case running
    case waiting
    case completed
    case failed
    case paused
    case cancelled
}
```

### Widget Runtime Data Models

```typescript
// packages/widgets/src/shared/types.ts

/**
 * OpenAI SDK context provided to widgets
 */
export interface OpenAIContext {
  toolInput: unknown;
  toolOutput: unknown;
  widgetState: unknown;
  theme: WidgetTheme;
  displayMode: DisplayMode;
  safeArea: SafeAreaInsets;
  locale: string;
}

export interface WidgetTheme {
  colorScheme: 'light' | 'dark';
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
}

export type DisplayMode = 'inline' | 'fullscreen' | 'pip';

export interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/**
 * Tool annotation types for action confirmation
 */
export type ToolAnnotationType = 'readOnly' | 'openWorld' | 'destructive';

/**
 * Widget manifest entry (auto-generated)
 */
export interface WidgetManifestEntry {
  name: string;
  path: string;
  category: string;
  displayModes: DisplayMode[];
}
```

### LLM Interaction Data Models

```typescript
// packages/ui/src/types/llm.ts

/**
 * Citation data for AI-generated content
 */
export interface Citation {
  id: string;
  title: string;
  url?: string;
  snippet?: string;
  domain?: string;
  publishedDate?: string;
}

/**
 * Feedback submission data
 */
export interface FeedbackSubmission {
  type: 'positive' | 'negative';
  reasons?: string[];
  comment?: string;
  messageId?: string;
  timestamp: string;
}

/**
 * Agent task step
 */
export interface AgentStep {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  output?: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

/**
 * Streaming text state
 */
export interface StreamingState {
  content: string;
  isStreaming: boolean;
  startedAt: string;
  completedAt?: string;
  tokenCount?: number;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

After analyzing the acceptance criteria for the gold-standard UI design system, I've identified key properties that can be validated through property-based testing. Properties have been consolidated to eliminate redundancy and provide comprehensive validation.

### Property Reflection

Several properties were identified as logically redundant or could be combined for more comprehensive testing:

- Token generation properties (Requirements 2, 3) can be consolidated into comprehensive token system validation
- Component consistency properties (Requirements 4, 5, 6) can be combined into comprehensive component library validation
- Accessibility properties (Requirements 8, 10) can be consolidated into accessibility compliance validation
- Cross-platform properties (Requirements 18, 20) can be combined into platform parity validation

### Core Properties

**Property 1: Token System Determinism**
*For any* DTCG token source file, the TokenGenerator SHALL produce identical output bytes when run multiple times with the same input, enabling SHA-256 hash validation in CI/CD pipelines.
**Validates: Requirements 2.6, 3.2**

**Property 2: Token Tier Resolution**
*For any* semantic token reference (for example, `{ref.color.gray.900}`), the token pipeline SHALL resolve the reference to a concrete value from the reference tier, and component tokens SHALL resolve through semantic tokens to reference tokens.
**Validates: Requirements 2.2, 2.3**

**Property 3: Cross-Platform Token Consistency**
*For any* design token, the generated CSS custom property value SHALL equal the generated Swift constant value (accounting for format differences like `#RRGGBB` vs `Color(hex:)`).
**Validates: Requirements 2.3, 3.4, 20.1**

**Property 4: Theme Mode Completeness**
*For any* semantic color token, the token system SHALL provide values for all configured modes (light, dark, high-contrast), and missing mode values SHALL cause validation failure.
**Validates: Requirements 2.5, 8.2**

**Property 5: React Component Token Consumption**
*For any* React component in Component_Library_React, the component SHALL consume only semantic tokens (no hardcoded hex values, no reference tokens directly), validated through static analysis.
**Validates: Requirements 4.8, 10.9**

**Property 6: SwiftUI Component Token Consumption**
*For any* SwiftUI component in Component_Library_Swift, the component SHALL consume only FColor/FType/FSpacing tokens from AStudioFoundation, with compile-time safety preventing invalid token references.
**Validates: Requirements 5.1, 5.8**

**Property 7: Accessibility Focus Management**
*For any* interactive component, keyboard focus SHALL be visible, not clipped, and meet WCAG 2.2 AA contrast requirements (3:1 minimum for focus indicators).
**Validates: Requirements 8.3, 8.4**

**Property 8: Reduced Motion Compliance**
*For any* animated component, when `prefers-reduced-motion: reduce` is active, the component SHALL provide a non-animated alternative or reduce animation duration to ≤100ms.
**Validates: Requirements 8.5, 12.4**

**Property 9: Touch Target Size**
*For any* interactive element, the clickable/tappable area SHALL be at least 44x44 CSS pixels (or equivalent platform units).
**Validates: Requirement 8.6**

**Property 10: Widget Display Mode Constraints**
*For any* inline widget, the widget SHALL enforce: no deep navigation (max 1 level), no nested scrolling, and maximum 2 primary CTAs.
**Validates: Requirements 6.1, 6.4**

**Property 11: Widget State Budget**
*For any* widget state object, the serialized JSON size SHALL be under the token budget (configurable, default 4KB) since the model reads widgetState verbatim.
**Validates: Requirement 6.7**

**Property 12: Confirmation Action Enforcement**
*For any* tool with `openWorld` or `destructive` annotation, the Widget_Runtime SHALL require user confirmation before execution, with destructive actions requiring explicit acknowledgment.
**Validates: Requirements 6.6, 7.8**

**Property 13: Streaming Text Accessibility**
*For any* streaming text output, screen reader announcements SHALL be debounced (≥2 second intervals) to prevent announcement spam, and focus SHALL not be trapped during streaming.
**Validates: Requirements 7.2, 8.8**

**Property 14: Citation Keyboard Navigation**
*For any* citation list, all citations SHALL be keyboard navigable with visible focus indicators and proper ARIA labeling.
**Validates: Requirements 7.3, 8.4**

**Property 15: Component API Parity**
*For any* component that exists in both React and SwiftUI libraries, the public API (props/parameters, variants, sizes) SHALL be equivalent, with documented exceptions for platform-specific features.
**Validates: Requirements 5.2, 20.3, 20.4**

**Property 16: Visual Regression Stability**
*For any* component snapshot, the visual output SHALL match the baseline within tolerance (default 0.1% pixel difference) across light/dark modes and viewport sizes.
**Validates: Requirements 10.1, 10.2**

**Property 17: Build Pipeline Determinism**
*For any* build execution with identical inputs, the build pipeline SHALL produce identical output artifacts (excluding timestamps in non-content metadata).
**Validates: Requirements 16.4, 3.6**

**Property 18: Package Version Synchronization**
*For any* release, version numbers SHALL be synchronized across package.json, Package.swift, and widget manifests within the same release.
**Validates: Requirement 16.2**

**Property 19: Documentation Completeness**
*For any* public component, documentation SHALL include: purpose, when to use, anatomy, variants, states, accessibility notes, and theming hooks.
**Validates: Requirements 9.1, 9.2, 9.3**

**Property 20: Figma Token Synchronization**
*For any* token update in the DTCG source, the Figma sync workflow SHALL update corresponding Figma variables to maintain design-code consistency.
**Validates: Requirements 18.1, 18.3**

**Property 21: Icon Category Completeness**
*For any* icon SVG file in the `@design-studio/icons` source directory, the icon SHALL belong to exactly one category from the Apps-in-ChatGPT taxonomy (arrows, interface, settings, chat-tools, account-user, platform, misc).
**Validates: Requirement 20.6**

**Property 22: Icon Generation Round-Trip**
*For any* SVG source file in `@design-studio/icons`, the SVGR-generated React component SHALL render visual output equivalent to the source SVG (validated via snapshot comparison).
**Validates: Requirement 20.5**

**Property 23: Figma Package Version Synchronization**
*For any* release of the design system, all `@design-studio/*` packages SHALL have identical version numbers synchronized with the main design system version.
**Validates: Requirement 20.11**

## Error Handling

The system implements comprehensive error handling across all layers to ensure robust operation and clear developer feedback.

### Token Validation Errors

```typescript
// packages/tokens/src/validation/errors.ts

export class TokenValidationError extends Error {
  constructor(
    public readonly path: string,
    public readonly code: TokenErrorCode,
    public readonly message: string,
    public readonly suggestion?: string
  ) {
    super(`[${code}] ${path}: ${message}`);
    this.name = 'TokenValidationError';
  }
}

export enum TokenErrorCode {
  // Format errors
  INVALID_HEX_COLOR = 'INVALID_HEX_COLOR',
  INVALID_DIMENSION = 'INVALID_DIMENSION',
  INVALID_REFERENCE = 'INVALID_REFERENCE',
  CIRCULAR_REFERENCE = 'CIRCULAR_REFERENCE',
  
  // Schema errors
  MISSING_VALUE = 'MISSING_VALUE',
  MISSING_TYPE = 'MISSING_TYPE',
  INVALID_TYPE = 'INVALID_TYPE',
  
  // Mode errors
  MISSING_MODE = 'MISSING_MODE',
  INCONSISTENT_MODES = 'INCONSISTENT_MODES',
  
  // Naming errors
  INVALID_TOKEN_NAME = 'INVALID_TOKEN_NAME',
  DUPLICATE_TOKEN = 'DUPLICATE_TOKEN',
  
  // Contrast errors
  INSUFFICIENT_CONTRAST = 'INSUFFICIENT_CONTRAST',
}

export class TokenValidator {
  validate(tokens: DTCGTokenFile): ValidationResult {
    const errors: TokenValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    
    this.validateRecursive(tokens, '', errors, warnings);
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
  
  private validateRecursive(
    node: DTCGToken | DTCGTokenGroup,
    path: string,
    errors: TokenValidationError[],
    warnings: ValidationWarning[]
  ): void {
    if (this.isToken(node)) {
      this.validateToken(node, path, errors, warnings);
    } else {
      for (const [key, value] of Object.entries(node)) {
        if (key.startsWith('$')) continue;
        this.validateRecursive(value, `${path}.${key}`, errors, warnings);
      }
    }
  }
  
  private validateToken(
    token: DTCGToken,
    path: string,
    errors: TokenValidationError[],
    warnings: ValidationWarning[]
  ): void {
    // Validate required fields
    if (token.$value === undefined) {
      errors.push(new TokenValidationError(
        path,
        TokenErrorCode.MISSING_VALUE,
        'Token must have a $value',
        'Add a $value field with the token value'
      ));
    }
    
    if (!token.$type) {
      errors.push(new TokenValidationError(
        path,
        TokenErrorCode.MISSING_TYPE,
        'Token must have a $type',
        'Add a $type field (for example, "color", "dimension")'
      ));
    }
    
    // Type-specific validation
    if (token.$type === 'color') {
      this.validateColorToken(token, path, errors);
    }
    
    // Mode validation
    if (token.$extensions?.mode) {
      this.validateModes(token, path, errors, warnings);
    }
  }
  
  private validateColorToken(
    token: DTCGToken,
    path: string,
    errors: TokenValidationError[]
  ): void {
    const value = token.$value;
    if (typeof value === 'string' && !value.startsWith('{')) {
      if (!this.isValidHexColor(value)) {
        errors.push(new TokenValidationError(
          path,
          TokenErrorCode.INVALID_HEX_COLOR,
          `Invalid hex color: ${value}`,
          'Use format #RRGGBB, #RGB, or #RRGGBBAA'
        ));
      }
    }
  }
  
  private isValidHexColor(color: string): boolean {
    return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/.test(color);
  }
}
```

### Component Error Boundaries

```typescript
// packages/ui/src/components/error/ErrorBoundary.tsx

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert } from '../feedback/Alert';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
    
    // Log to error tracking service
    console.error('Component error:', error, errorInfo);
  }

  reset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error!, this.reset);
      }
      
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <Alert variant="error" className="error-boundary-fallback">
          <Alert.Title>Something went wrong</Alert.Title>
          <Alert.Description>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Alert.Description>
          <button onClick={this.reset} className="error-boundary-reset">
            Try again
          </button>
        </Alert>
      );
    }

    return this.props.children;
  }
}
```

### Widget Error Handling

```typescript
// packages/widgets/src/shared/widget-error.tsx

import React from 'react';
import { ErrorBoundary } from '@design-studio/ui';
import { useOpenAI } from './openai-hooks';

export interface WidgetErrorBoundaryProps {
  children: React.ReactNode;
  widgetName?: string;
}

export function WidgetErrorBoundary({ 
  children, 
  widgetName 
}: WidgetErrorBoundaryProps) {
  const openai = useOpenAI();
  
  const handleError = (error: Error) => {
    // Report error to host
    openai?.reportError?.({
      type: 'widget_error',
      widget: widgetName,
      message: error.message,
      stack: error.stack,
    });
  };
  
  return (
    <ErrorBoundary
      onError={handleError}
      fallback={(error, reset) => (
        <div className="widget-error">
          <div className="widget-error-icon" aria-hidden>⚠️</div>
          <p className="widget-error-message">
            Unable to load widget
          </p>
          <button 
            className="widget-error-retry"
            onClick={reset}
          >
            Retry
          </button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
```

### SwiftUI Error Handling

```swift
// platforms/apple/swift/AStudioComponents/Sources/AStudioComponents/Errors/ComponentError.swift

import Foundation

public enum ComponentError: Error, LocalizedError {
    case invalidConfiguration(component: String, details: String)
    case missingRequiredProperty(component: String, property: String)
    case invalidState(component: String, details: String)
    case tokenNotFound(tokenName: String)
    case accessibilityViolation(component: String, violation: String)
    
    public var errorDescription: String? {
        switch self {
        case .invalidConfiguration(let component, let details):
            return "[\(component)] Invalid configuration: \(details)"
        case .missingRequiredProperty(let component, let property):
            return "[\(component)] Missing required property: \(property)"
        case .invalidState(let component, let details):
            return "[\(component)] Invalid state: \(details)"
        case .tokenNotFound(let tokenName):
            return "Design token not found: \(tokenName)"
        case .accessibilityViolation(let component, let violation):
            return "[\(component)] Accessibility violation: \(violation)"
        }
    }
    
    public var recoverySuggestion: String? {
        switch self {
        case .invalidConfiguration:
            return "Check the component documentation for valid configuration options."
        case .missingRequiredProperty(_, let property):
            return "Provide a value for the '\(property)' property."
        case .invalidState:
            return "Ensure the component state is valid before rendering."
        case .tokenNotFound(let tokenName):
            return "Verify the token '\(tokenName)' exists in AStudioFoundation."
        case .accessibilityViolation:
            return "Review WCAG 2.2 AA guidelines for the specific violation."
        }
    }
}
```

### Build Pipeline Error Recovery

```typescript
// scripts/build-pipeline.ts

export interface BuildResult {
  success: boolean;
  steps: BuildStepResult[];
  errors: BuildError[];
  warnings: BuildWarning[];
  duration: number;
}

export interface BuildError {
  step: string;
  code: string;
  message: string;
  file?: string;
  line?: number;
  recoverable: boolean;
  suggestion?: string;
}

export class BuildPipeline {
  async build(config: BuildConfig): Promise<BuildResult> {
    const startTime = Date.now();
    const steps: BuildStepResult[] = [];
    const errors: BuildError[] = [];
    const warnings: BuildWarning[] = [];
    
    try {
      // Step 1: Token validation
      const tokenResult = await this.runStep('tokens:validate', async () => {
        const validator = new TokenValidator();
        const result = validator.validate(await this.loadTokens());
        
        if (!result.isValid) {
          throw new BuildStepError('Token validation failed', result.errors);
        }
        
        warnings.push(...result.warnings.map(w => ({
          step: 'tokens:validate',
          ...w
        })));
      });
      steps.push(tokenResult);
      
      if (!tokenResult.success) {
        return this.createResult(false, steps, errors, warnings, startTime);
      }
      
      // Step 2: Token generation (parallel)
      const generationResults = await Promise.allSettled([
        this.runStep('tokens:css', () => this.generateCSS()),
        this.runStep('tokens:swift', () => this.generateSwift()),
        this.runStep('tokens:tailwind', () => this.generateTailwind()),
      ]);
      
      for (const result of generationResults) {
        if (result.status === 'fulfilled') {
          steps.push(result.value);
        } else {
          errors.push({
            step: 'tokens:generate',
            code: 'GENERATION_FAILED',
            message: result.reason.message,
            recoverable: false,
          });
        }
      }
      
      // Step 3: Component builds (parallel)
      const componentResults = await Promise.allSettled([
        this.runStep('build:react', () => this.buildReact()),
        this.runStep('build:swift', () => this.buildSwift()),
        this.runStep('build:widgets', () => this.buildWidgets()),
      ]);
      
      // ... continue with remaining steps
      
      const hasErrors = errors.length > 0 || 
        steps.some(s => !s.success);
      
      return this.createResult(!hasErrors, steps, errors, warnings, startTime);
      
    } catch (error) {
      errors.push({
        step: 'build',
        code: 'UNEXPECTED_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
        recoverable: false,
      });
      
      return this.createResult(false, steps, errors, warnings, startTime);
    }
  }
  
  private createResult(
    success: boolean,
    steps: BuildStepResult[],
    errors: BuildError[],
    warnings: BuildWarning[],
    startTime: number
  ): BuildResult {
    return {
      success,
      steps,
      errors,
      warnings,
      duration: Date.now() - startTime,
    };
  }
}
```

## Testing Strategy

The testing strategy ensures comprehensive coverage across all platforms, components, and integration points.

### Testing Pyramid

```
                    ┌─────────────────┐
                    │   E2E Tests     │  ← Cross-platform flows
                    │   (Playwright)  │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │     Integration Tests       │  ← Component interactions
              │  (Storybook, SwiftUI Tests) │
              └──────────────┬──────────────┘
                             │
    ┌────────────────────────┴────────────────────────┐
    │              Unit Tests                         │  ← Token validation,
    │  (Vitest, XCTest, Property-based)              │     Component logic
    └─────────────────────────────────────────────────┘
```

### Token System Testing

```typescript
// packages/tokens/src/__tests__/generator.test.ts

import { describe, it, expect } from 'vitest';
import { TokenGenerator } from '../generator';
import { TokenValidator } from '../validation/token-validator';

describe('TokenGenerator', () => {
  const generator = new TokenGenerator();
  
  describe('determinism', () => {
    it('produces identical output for same input', async () => {
      const output1 = await generator.generateCSS();
      const output2 = await generator.generateCSS();
      
      expect(output1).toBe(output2);
    });
    
    it('produces consistent SHA-256 hashes', async () => {
      const manifest1 = await generator.generateManifest();
      const manifest2 = await generator.generateManifest();
      
      expect(manifest1.sha256).toEqual(manifest2.sha256);
    });
  });
  
  describe('cross-platform consistency', () => {
    it('CSS and Swift values match for all tokens', async () => {
      const css = await generator.generateCSS();
      const swift = await generator.generateSwift();
      
      // Extract color values and compare
      const cssColors = extractCSSColors(css);
      const swiftColors = extractSwiftColors(swift);
      
      for (const [name, cssValue] of Object.entries(cssColors)) {
        const swiftValue = swiftColors[name];
        expect(normalizeColor(cssValue)).toBe(normalizeColor(swiftValue));
      }
    });
  });
  
  describe('mode completeness', () => {
    it('all semantic tokens have light/dark/high-contrast modes', async () => {
      const tokens = await loadTokens('semantic/colors.dtcg.json');
      
      for (const [path, token] of flattenTokens(tokens)) {
        if (token.$type === 'color') {
          expect(token.$extensions?.mode).toBeDefined();
          expect(token.$extensions?.mode?.light).toBeDefined();
          expect(token.$extensions?.mode?.dark).toBeDefined();
          expect(token.$extensions?.mode?.['high-contrast']).toBeDefined();
        }
      }
    });
  });
});

describe('TokenValidator', () => {
  const validator = new TokenValidator();
  
  it('rejects invalid hex colors', () => {
    const result = validator.validate({
      color: {
        invalid: {
          $value: 'not-a-color',
          $type: 'color',
        },
      },
    });
    
    expect(result.isValid).toBe(false);
    expect(result.errors[0].code).toBe('INVALID_HEX_COLOR');
  });
  
  it('detects circular references', () => {
    const result = validator.validate({
      color: {
        a: { $value: '{color.b}', $type: 'color' },
        b: { $value: '{color.a}', $type: 'color' },
      },
    });
    
    expect(result.isValid).toBe(false);
    expect(result.errors[0].code).toBe('CIRCULAR_REFERENCE');
  });
});
```

### React Component Testing

```typescript
// packages/ui/src/components/actions/__tests__/Button.test.tsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '../Button';

expect.extend(toHaveNoViolations);

describe('Button', () => {
  describe('rendering', () => {
    it('renders with default props', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button')).toHaveTextContent('Click me');
    });
    
    it('applies variant classes', () => {
      const { rerender } = render(<Button variant="primary">Primary</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-accent-blue');
      
      rerender(<Button variant="destructive">Destructive</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-accent-red');
    });
    
    it('applies size classes', () => {
      const { rerender } = render(<Button size="sm">Small</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-8');
      
      rerender(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-12');
    });
  });
  
  describe('interactions', () => {
    it('calls onClick when clicked', async () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Click</Button>);
      
      await userEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
    
    it('does not call onClick when disabled', async () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick} disabled>Click</Button>);
      
      await userEvent.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });
    
    it('shows loading state', () => {
      render(<Button loading>Loading</Button>);
      
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
      expect(screen.getByText('Loading')).toBeInTheDocument();
    });
  });
  
  describe('accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Button>Accessible</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
    
    it('is keyboard accessible', async () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Press Enter</Button>);
      
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
      
      await userEvent.keyboard('{Enter}');
      expect(onClick).toHaveBeenCalled();
    });
    
    it('has visible focus indicator', () => {
      render(<Button>Focus me</Button>);
      const button = screen.getByRole('button');
      button.focus();
      
      // Check for focus-visible styles
      expect(button).toHaveClass('focus-visible:ring-2');
    });
  });
  
  describe('token consumption', () => {
    it('uses semantic tokens only (no hardcoded colors)', () => {
      const { container } = render(<Button variant="primary">Token check</Button>);
      const styles = window.getComputedStyle(container.firstChild as Element);
      
      // Verify no hardcoded hex values in inline styles
      expect(styles.backgroundColor).not.toMatch(/#[0-9a-f]{6}/i);
    });
  });
});
```

### SwiftUI Component Testing

```swift
// platforms/apple/swift/AStudioComponents/Tests/AStudioComponentsTests/FButtonTests.swift

import XCTest
import SwiftUI
import ViewInspector
@testable import AStudioComponents
@testable import AStudioFoundation

final class FButtonTests: XCTestCase {
    
    // MARK: - Rendering Tests
    
    func testButtonRendersWithLabel() throws {
        let button = FButton(variant: .primary, size: .md, action: {}) {
            Text("Click me")
        }
        
        let text = try button.inspect().find(text: "Click me")
        XCTAssertNotNil(text)
    }
    
    func testButtonAppliesVariantStyles() throws {
        let primaryButton = FButton(variant: .primary, size: .md, action: {}) {
            Text("Primary")
        }
        
        let destructiveButton = FButton(variant: .destructive, size: .md, action: {}) {
            Text("Destructive")
        }
        
        // Verify different background colors
        // (Implementation depends on ViewInspector capabilities)
    }
    
    func testButtonAppliesSizeStyles() throws {
        let sizes: [FButtonSize] = [.sm, .md, .lg]
        let expectedHeights: [CGFloat] = [32, 40, 48]
        
        for (size, expectedHeight) in zip(sizes, expectedHeights) {
            XCTAssertEqual(size.height, expectedHeight)
        }
    }
    
    // MARK: - Interaction Tests
    
    func testButtonCallsActionOnTap() throws {
        var actionCalled = false
        
        let button = FButton(variant: .primary, size: .md, action: {
            actionCalled = true
        }) {
            Text("Tap me")
        }
        
        try button.inspect().button().tap()
        XCTAssertTrue(actionCalled)
    }
    
    func testDisabledButtonDoesNotCallAction() throws {
        var actionCalled = false
        
        let button = FButton(
            variant: .primary,
            size: .md,
            isDisabled: true,
            action: { actionCalled = true }
        ) {
            Text("Disabled")
        }
        
        // Disabled buttons should not respond to taps
        XCTAssertFalse(actionCalled)
    }
    
    // MARK: - Token Consumption Tests
    
    func testButtonUsesSemanticTokens() {
        // Verify button uses FColor tokens
        let primaryBg = FColor.accentBlue
        let textColor = FColor.textInverted
        
        // These should compile - if tokens don't exist, compilation fails
        XCTAssertNotNil(primaryBg)
        XCTAssertNotNil(textColor)
    }
    
    // MARK: - Accessibility Tests
    
    func testButtonHasAccessibilityLabel() throws {
        let button = FButton(variant: .primary, size: .md, action: {}) {
            Text("Submit")
        }
        
        // Verify accessibility traits
        let traits = try button.inspect().accessibilityTraits()
        XCTAssertTrue(traits.contains(.isButton))
    }
    
    func testLoadingButtonHasAccessibilityHint() throws {
        let button = FButton(
            variant: .primary,
            size: .md,
            isLoading: true,
            action: {}
        ) {
            Text("Loading")
        }
        
        let label = try button.inspect().accessibilityLabel()
        XCTAssertTrue(label.string.contains("Loading"))
    }
}
```

### Visual Regression Testing

```typescript
// packages/ui/src/__tests__/visual/Button.visual.test.ts

import { test, expect } from '@playwright/test';

test.describe('Button Visual Regression', () => {
  const variants = ['primary', 'secondary', 'soft', 'destructive', 'ghost'];
  const sizes = ['sm', 'md', 'lg'];
  const states = ['default', 'hover', 'active', 'disabled', 'loading'];
  
  for (const variant of variants) {
    for (const size of sizes) {
      test(`${variant}-${size} matches snapshot`, async ({ page }) => {
        await page.goto(`/storybook/iframe.html?id=button--${variant}&args=size:${size}`);
        
        await expect(page.locator('.button-story')).toHaveScreenshot(
          `button-${variant}-${size}.png`
        );
      });
    }
  }
  
  test.describe('dark mode', () => {
    test.use({ colorScheme: 'dark' });
    
    for (const variant of variants) {
      test(`${variant} dark mode matches snapshot`, async ({ page }) => {
        await page.goto(`/storybook/iframe.html?id=button--${variant}`);
        
        await expect(page.locator('.button-story')).toHaveScreenshot(
          `button-${variant}-dark.png`
        );
      });
    }
  });
  
  test.describe('high contrast', () => {
    test.use({ forcedColors: 'active' });
    
    test('primary high contrast matches snapshot', async ({ page }) => {
      await page.goto('/storybook/iframe.html?id=button--primary');
      
      await expect(page.locator('.button-story')).toHaveScreenshot(
        'button-primary-high-contrast.png'
      );
    });
  });
});
```

### Accessibility Testing

```typescript
// packages/ui/src/__tests__/a11y/components.a11y.test.ts

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Component Accessibility', () => {
  const components = [
    'button',
    'text-input',
    'checkbox',
    'radio',
    'select',
    'dialog',
    'tooltip',
    'alert',
  ];
  
  for (const component of components) {
    test(`${component} has no accessibility violations`, async ({ page }) => {
      await page.goto(`/storybook/iframe.html?id=${component}--default`);
      
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
        .analyze();
      
      expect(results.violations).toEqual([]);
    });
  }
  
  test.describe('keyboard navigation', () => {
    test('dialog traps focus correctly', async ({ page }) => {
      await page.goto('/storybook/iframe.html?id=dialog--default');
      
      // Open dialog
      await page.click('[data-testid="open-dialog"]');
      
      // Tab through dialog
      await page.keyboard.press('Tab');
      const firstFocusable = await page.evaluate(() => 
        document.activeElement?.getAttribute('data-testid')
      );
      
      // Tab to end and wrap
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
      }
      
      const wrappedFocus = await page.evaluate(() =>
        document.activeElement?.getAttribute('data-testid')
      );
      
      // Focus should wrap within dialog
      expect(wrappedFocus).toBe(firstFocusable);
    });
    
    test('escape closes dialog', async ({ page }) => {
      await page.goto('/storybook/iframe.html?id=dialog--default');
      
      await page.click('[data-testid="open-dialog"]');
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      
      await page.keyboard.press('Escape');
      await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    });
  });
});
```

### Cross-Platform Parity Testing

```typescript
// scripts/parity-check.ts

import { chromium } from 'playwright';
import { execSync } from 'child_process';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

interface ParityResult {
  component: string;
  platform: 'react' | 'swiftui';
  variant: string;
  pixelDiff: number;
  passed: boolean;
}

async function checkParity(): Promise<ParityResult[]> {
  const results: ParityResult[] = [];
  const components = ['button', 'card', 'input', 'badge'];
  const variants = ['default', 'dark'];
  
  for (const component of components) {
    for (const variant of variants) {
      // Capture React screenshot
      const reactScreenshot = await captureReactComponent(component, variant);
      
      // Capture SwiftUI screenshot
      const swiftScreenshot = await captureSwiftUIComponent(component, variant);
      
      // Compare
      const diff = compareScreenshots(reactScreenshot, swiftScreenshot);
      
      results.push({
        component,
        platform: 'react',
        variant,
        pixelDiff: diff.percentage,
        passed: diff.percentage < 0.1, // 0.1% tolerance
      });
    }
  }
  
  return results;
}

async function captureReactComponent(
  component: string, 
  variant: string
): Promise<Buffer> {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto(`http://localhost:6006/iframe.html?id=${component}--${variant}`);
  const screenshot = await page.screenshot();
  
  await browser.close();
  return screenshot;
}

async function captureSwiftUIComponent(
  component: string,
  variant: string
): Promise<Buffer> {
  // Run Swift snapshot test and capture output
  execSync(`swift test --filter "Snapshot_${component}_${variant}"`, {
    cwd: 'platforms/apple/swift/AStudioComponents',
  });
  
  // Read generated snapshot
  return fs.readFileSync(
    `platforms/apple/swift/AStudioComponents/Snapshots/${component}_${variant}.png`
  );
}
```

### 6. Figma Make Private Package Publishing

This section defines the architecture for publishing design system packages to Figma's org private npm registry, enabling Figma Make AI to discover and use components, tokens, and icons for code generation.

#### 6.1 Package Architecture

```
packages/
├── astudio-tokens/           # @design-studio/tokens
│   ├── package.json
│   ├── src/
│   │   ├── index.ts          # Main exports
│   │   ├── css/              # CSS variable exports
│   │   ├── tailwind/         # Tailwind preset exports
│   │   └── types/            # TypeScript token types
│   └── dist/                 # Built outputs
├── astudio-ui/               # @design-studio/ui
│   ├── package.json
│   ├── src/
│   │   ├── index.ts          # Component re-exports from @design-studio/ui
│   │   └── components/       # Any Make-specific wrappers
│   └── dist/
├── astudio-icons/            # @design-studio/icons
│   ├── package.json
│   ├── src/
│   │   ├── svg/              # SVG source files (source of truth)
│   │   │   ├── arrows/
│   │   │   ├── interface/
│   │   │   ├── settings/
│   │   │   ├── chat-tools/
│   │   │   ├── account-user/
│   │   │   ├── platform/
│   │   │   └── misc/
│   │   ├── react/            # Generated React components (via SVGR)
│   │   ├── index.ts          # Main exports
│   │   ├── Icon.tsx          # <Icon name="..." /> renderer
│   │   └── types.ts          # IconName union type
│   └── dist/
└── astudio-make-template/    # Figma Make template
    ├── package.json
    ├── guidelines/
    │   ├── Guidelines.md
    │   ├── overview-components.md
    │   ├── overview-icons.md
    │   └── design-tokens/
    │       ├── colors.md
    │       ├── spacing.md
    │       └── typography.md
    └── src/                  # Template starter files
```

#### 6.2 Registry Configuration

```ini
# .npmrc.figma.template
# Figma org private registry configuration
# Replace <AUTH_TOKEN> with admin-generated key from Figma Make settings

@astudio:registry=https://npm.figma.com/
//npm.figma.com/:_authToken=<AUTH_TOKEN>
```

#### 6.3 @design-studio/tokens Package

```typescript
// packages/astudio-tokens/src/index.ts

/**
 * @design-studio/tokens
 * Design tokens for Figma Make integration
 * Re-exports from @design-studio/tokens with Make-compatible structure
 */

// CSS Variables
export * from './css/variables';

// Tailwind Preset
export { default as tailwindPreset } from './tailwind/preset';

// TypeScript Types
export type * from './types/tokens';

// Token values for direct access
export { colors } from './values/colors';
export { spacing } from './values/spacing';
export { typography } from './values/typography';
export { radius } from './values/radius';
export { shadows } from './values/shadows';
```

```typescript
// packages/astudio-tokens/src/css/variables.ts

/**
 * CSS custom properties for all design tokens
 * Aligned to Apps SDK UI foundations
 */
export const cssVariables = `
:root {
  /* Background Colors */
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: #E8E8E8;
  --color-bg-tertiary: #F3F3F3;
  
  /* Text Colors */
  --color-text-primary: #0D0D0D;
  --color-text-secondary: #5D5D5D;
  --color-text-tertiary: #8F8F8F;
  
  /* Accent Colors */
  --color-accent-blue: #0285FF;
  --color-accent-green: #008635;
  --color-accent-red: #E02E2A;
  
  /* Spacing Scale */
  --space-0: 0px;
  --space-2: 2px;
  --space-4: 4px;
  --space-8: 8px;
  --space-12: 12px;
  --space-16: 16px;
  --space-24: 24px;
  --space-32: 32px;
  --space-40: 40px;
  --space-48: 48px;
  --space-64: 64px;
  --space-128: 128px;
  
  /* ... additional tokens */
}

[data-theme="dark"] {
  --color-bg-primary: #212121;
  --color-bg-secondary: #303030;
  --color-bg-tertiary: #414141;
  
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #CDCDCD;
  --color-text-tertiary: #AFAFAF;
  
  --color-accent-blue: #48AAFF;
  --color-accent-green: #40C977;
  --color-accent-red: #FF8583;
}
`;
```

#### 6.4 @design-studio/ui Package

```typescript
// packages/astudio-ui/src/index.ts

/**
 * @design-studio/ui
 * React components for Figma Make integration
 * Re-exports Apps SDK UI-first components from @design-studio/ui
 */

// Re-export all components from @design-studio/ui
export {
  // Apps SDK UI components
  AppsSDKButton,
  AppsSDKBadge,
  AppsSDKCheckbox,
  AppsSDKInput,
  AppsSDKTextarea,
  AppsSDKPopover,
  AppsSDKCodeBlock,
  AppsSDKImage,
  AppsSDKUIProvider,
  
  // Layout primitives
  Stack,
  Inline,
  Grid,
  Divider,
  Spacer,
  
  // Typography
  Text,
  Heading,
  Code,
  Label,
  Caption,
  
  // Feedback
  Alert,
  Toast,
  InlineError,
  Skeleton,
  Progress,
  
  // Data display
  List,
  KeyValue,
  Table,
  Card,
  
  // Overlays (Radix fallbacks)
  Dialog,
  Drawer,
  Tooltip,
  Select,
  
  // LLM components
  StreamingText,
  CitationList,
  SourceChip,
  FeedbackButtons,
  AgentStatus,
} from '@design-studio/ui';

// Re-export types
export type {
  ButtonProps,
  BadgeProps,
  InputProps,
  DialogProps,
  // ... all component prop types
} from '@design-studio/ui';
```

#### 6.5 @design-studio/icons Package

```typescript
// packages/astudio-icons/src/types.ts

/**
 * Icon name union type - generated from SVG filenames
 */
export type IconName =
  // Arrows
  | 'arrow-up'
  | 'arrow-down'
  | 'arrow-left'
  | 'arrow-right'
  | 'chevron-up'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  // Interface
  | 'check'
  | 'close'
  | 'menu'
  | 'search'
  | 'settings'
  | 'filter'
  // Settings
  | 'gear'
  | 'sliders'
  | 'toggle'
  // Chat and Tools
  | 'chat'
  | 'message'
  | 'send'
  | 'attachment'
  | 'code'
  | 'copy'
  // Account & User
  | 'user'
  | 'users'
  | 'profile'
  | 'logout'
  // Platform
  | 'openai'
  | 'chatgpt'
  | 'sparkles'
  | 'download'
  // Misc
  | 'info'
  | 'warning'
  | 'error'
  | 'success'
  | 'loading';

/**
 * Icon categories matching Apps-in-ChatGPT taxonomy
 */
export type IconCategory =
  | 'arrows'
  | 'interface'
  | 'settings'
  | 'chat-tools'
  | 'account-user'
  | 'platform'
  | 'misc';

export const ICON_CATEGORIES: Record<IconCategory, IconName[]> = {
  arrows: ['arrow-up', 'arrow-down', 'arrow-left', 'arrow-right', 'chevron-up', 'chevron-down', 'chevron-left', 'chevron-right'],
  interface: ['check', 'close', 'menu', 'search', 'settings', 'filter'],
  settings: ['gear', 'sliders', 'toggle'],
  'chat-tools': ['chat', 'message', 'send', 'attachment', 'code', 'copy'],
  'account-user': ['user', 'users', 'profile', 'logout'],
  platform: ['openai', 'chatgpt', 'sparkles', 'download'],
  misc: ['info', 'warning', 'error', 'success', 'loading'],
};
```

```typescript
// packages/astudio-icons/src/Icon.tsx

import React from 'react';
import type { IconName } from './types';

// Import all generated icon components
import * as Icons from './react';

export interface IconProps {
  /** Icon name from the IconName union */
  name: IconName;
  /** Icon size in pixels (default: 24) */
  size?: number;
  /** Icon color (default: currentColor) */
  color?: string;
  /** Additional CSS class */
  className?: string;
  /** Accessibility label */
  'aria-label'?: string;
  /** Hide from screen readers (default: true if no aria-label) */
  'aria-hidden'?: boolean;
}

/**
 * Icon component with typed name prop
 * 
 * @example
 * <Icon name="arrow-up" size={20} color="var(--color-icon-primary)" />
 */
export function Icon({
  name,
  size = 24,
  color = 'currentColor',
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
}: IconProps) {
  // Convert kebab-case to PascalCase for component lookup
  const componentName = name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  
  const IconComponent = (Icons as Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>>)[componentName];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  
  return (
    <IconComponent
      width={size}
      height={size}
      fill={color}
      className={className}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden ?? !ariaLabel}
      role={ariaLabel ? 'img' : undefined}
    />
  );
}
```

```typescript
// packages/astudio-icons/src/index.ts

/**
 * @design-studio/icons
 * Icon library for Figma Make integration
 */

// Main Icon component
export { Icon } from './Icon';
export type { IconProps } from './Icon';

// Types
export type { IconName, IconCategory } from './types';
export { ICON_CATEGORIES } from './types';

// Category exports for tree-shaking
export * as ArrowIcons from './react/arrows';
export * as InterfaceIcons from './react/interface';
export * as SettingsIcons from './react/settings';
export * as ChatToolsIcons from './react/chat-tools';
export * as AccountUserIcons from './react/account-user';
export * as PlatformIcons from './react/platform';
export * as MiscIcons from './react/misc';

// Re-export upstream Apps SDK UI icons
export { Download, Sparkles } from '@openai/apps-sdk-ui/components/Icon';
```

#### 6.6 SVGR Build Configuration

```typescript
// packages/astudio-icons/svgr.config.ts

import type { Config } from '@svgr/core';

const config: Config = {
  typescript: true,
  ref: true,
  svgo: true,
  svgoConfig: {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false,
            removeTitle: false,
          },
        },
      },
      'removeDimensions',
    ],
  },
  template: (variables, { tpl }) => {
    return tpl`
import * as React from 'react';
import type { SVGProps } from 'react';

const ${variables.componentName} = React.forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => ${variables.jsx}
);

${variables.componentName}.displayName = '${variables.componentName}';

export default ${variables.componentName};
`;
  },
};

export default config;
```

#### 6.7 Figma Make Guidelines

```markdown
<!-- packages/astudio-make-template/guidelines/Guidelines.md -->

# aStudio Design System Guidelines

This design system provides tokens, components, and icons for building ChatGPT-native experiences.

## Quick Start

\`\`\`tsx
import { AppsSDKButton, Stack, Text } from '@design-studio/ui';
import { Icon } from '@design-studio/icons';
import '@design-studio/tokens/css';

function MyComponent() {
  return (
    <Stack gap="md">
      <Text>Hello from aStudio!</Text>
      <AppsSDKButton>
        <Icon name="sparkles" size={16} />
        Get Started
      </AppsSDKButton>
    </Stack>
  );
}
\`\`\`

## Foundation

- **Tokens**: Use `@design-studio/tokens` for colors, spacing, typography
- **Components**: Use `@design-studio/ui` for React components (Apps SDK UI-first)
- **Icons**: Use `@design-studio/icons` for iconography

## Key Principles

1. **Apps SDK UI First**: Prefer Apps SDK UI components over custom implementations
2. **Semantic Tokens**: Always use semantic tokens, never hardcoded values
3. **Accessibility**: All components meet WCAG 2.2 AA standards
4. **Dark Mode**: All components support light/dark themes automatically

## See Also

- [Component Overview](./overview-components.md)
- [Icon Overview](./overview-icons.md)
- [Design Tokens](./design-tokens/)
```

#### 6.8 Version Synchronization

```typescript
// scripts/sync-astudio-versions.ts

import fs from 'fs';
import path from 'path';

const ASTUDIO_PACKAGES = [
  'packages/astudio-tokens',
  'packages/astudio-ui',
  'packages/astudio-icons',
  'packages/astudio-make-template',
];

async function syncVersions() {
  // Read root package.json for version
  const rootPkg = JSON.parse(
    fs.readFileSync('package.json', 'utf-8')
  );
  const version = rootPkg.version;
  
  console.log(`Syncing @design-studio/* packages to version ${version}`);
  
  for (const pkgPath of ASTUDIO_PACKAGES) {
    const pkgJsonPath = path.join(pkgPath, 'package.json');
    
    if (!fs.existsSync(pkgJsonPath)) {
      console.warn(`Package not found: ${pkgPath}`);
      continue;
    }
    
    const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
    pkg.version = version;
    
    // Update peer dependencies to match
    if (pkg.peerDependencies) {
      for (const dep of Object.keys(pkg.peerDependencies)) {
        if (dep.startsWith('@design-studio/')) {
          pkg.peerDependencies[dep] = `^${version}`;
        }
      }
    }
    
    fs.writeFileSync(pkgJsonPath, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`  Updated ${pkg.name} to ${version}`);
  }
  
  console.log('Version sync complete');
}

syncVersions().catch(console.error);
```

#### 6.9 Publish Workflow

```yaml
# .github/workflows/publish-astudio.yml

name: Publish @design-studio/* Packages

on:
  release:
    types: [published]
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to publish (leave empty to use package.json)'
        required: false

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Sync versions
        run: pnpm ds:astudio:sync-versions
      
      - name: Build packages
        run: |
          pnpm build:astudio-tokens
          pnpm build:astudio-icons
          pnpm build:astudio-ui
      
      - name: Configure Figma registry
        run: |
          echo "@astudio:registry=https://npm.figma.com/" >> .npmrc
          echo "//npm.figma.com/:_authToken=${{ secrets.FIGMA_NPM_TOKEN }}" >> .npmrc
      
      - name: Publish @design-studio/tokens
        run: npm publish --access restricted
        working-directory: packages/astudio-tokens
      
      - name: Publish @design-studio/icons
        run: npm publish --access restricted
        working-directory: packages/astudio-icons
      
      - name: Publish @design-studio/ui
        run: npm publish --access restricted
        working-directory: packages/astudio-ui
      
      - name: Publish summary
        run: |
          echo "## Published Packages" >> $GITHUB_STEP_SUMMARY
          echo "- @design-studio/tokens" >> $GITHUB_STEP_SUMMARY
          echo "- @design-studio/icons" >> $GITHUB_STEP_SUMMARY
          echo "- @design-studio/ui" >> $GITHUB_STEP_SUMMARY
```

```

### CI/CD Test Configuration

```yaml
# .github/workflows/test.yml

name: Test Suite

on:
  push:
    branches: [main]
  pull_request:

jobs:
  token-validation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm tokens:validate
      - run: pnpm tokens:generate
      - name: Verify deterministic output
        run: |
          pnpm tokens:generate
          git diff --exit-code packages/tokens/dist/

  react-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm test
      - run: pnpm test:a11y

  swift-tests:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - run: swift test
        working-directory: platforms/apple/swift/AStudioFoundation
      - run: swift test
        working-directory: platforms/apple/swift/AStudioComponents

  visual-regression:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm build:storybook
      - run: pnpm test:visual
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: visual-diff
          path: test-results/

  cross-platform-parity:
    runs-on: macos-latest
    needs: [react-tests, swift-tests]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm build
      - run: pnpm parity:check
```
