# Implementation Guide: Practical Development Approach

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (beginner to intermediate)
- Scope: Task-focused instructions for this topic
- Non-scope: Comprehensive architecture reference
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


## Implementation Spectrum

The Native macOS Bridge can be implemented at different levels of complexity:

### Level 1: UI-Only Bridge (Recommended Start)

**Scope**: Tokens → Swift constants → SwiftUI components
**Risk**: Lowest
**Timeline**: Fastest

- Generate design tokens as Swift constants
- Build SwiftUI components with consistent styling
- Business logic stays native Swift (separate from web)
- No JSCore complexity

### Level 2: Shared Contracts (Low Risk)

**Scope**: Share schemas/types/validation rules, duplicate logic implementation
**Risk**: Low
**Timeline**: Medium

- Define shared JSON schemas and types
- Implement validation rules in both TypeScript and Swift
- Keep state machines aligned but separate
- No runtime bridging complexity

### Level 3: Shared Business Logic via JSCore (Higher Complexity)

**Scope**: Swift calls pure TypeScript functions in JSCore
**Risk**: Higher
**Timeline**: Longer

- Pure functions only (reducers/validators/formatters)
- Avoid IO in JSCore initially (fetch/files/auth)
- Async bridging adds significant complexity

## Recommended Development Workflow

### Step 1: Create macOS Playground App

Create a development environment for live SwiftUI previews:

```bash
# In Xcode:
# File → New → Project…
# Choose macOS → App
# Interface: SwiftUI
# Location: apps/macos/AStudioPlayground/
```

### Step 2: Add Local Swift Package

In Xcode project:

1. Click project (blue icon) → select app target
2. General → Frameworks, Libraries, and Embedded Content → +
3. Choose Add Other… → Add Local…
4. Select: `packages/ui-swift/`

### Step 3: SwiftUI Development Environment

**Key Xcode shortcuts:**

- `⌥⌘⏎` - Toggle Canvas
- `⌥⌘P` - Resume previews
- `⌘R` - Run app
- `⌘B` - Build
- `⇧⌘K` - Clean build folder (when previews get stuck)

### Step 4: Component Gallery Structure

Create a "SwiftUI Storybook" equivalent:

```swift
// apps/macos/AStudioPlayground/ContentView.swift
import SwiftUI
import AStudioSwift

struct ContentView: View {
    var body: some View {
        NavigationSplitView {
            // Component categories
            List {
                NavigationLink("Buttons", destination: ButtonGallery())
                NavigationLink("Inputs", destination: InputGallery())
                NavigationLink("Cards", destination: CardGallery())
                NavigationLink("Modals", destination: ModalGallery())
            }
            .navigationTitle("Components")
        } detail: {
            Text("Select a component category")
        }
        .frame(minWidth: 800, minHeight: 600)
    }
}

struct ButtonGallery: View {
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                ComponentSection("Default Buttons") {
                    HStack(spacing: 12) {
                        ChatUIButton(variant: .default, size: .default, action: {}) {
                            Text("Default")
                        }
                        ChatUIButton(variant: .destructive, size: .default, action: {}) {
                            Text("Destructive")
                        }
                        ChatUIButton(variant: .outline, size: .default, action: {}) {
                            Text("Outline")
                        }
                    }
                }
                
                ComponentSection("Button Sizes") {
                    HStack(spacing: 12) {
                        ChatUIButton(variant: .default, size: .sm, action: {}) {
                            Text("Small")
                        }
                        ChatUIButton(variant: .default, size: .default, action: {}) {
                            Text("Default")
                        }
                        ChatUIButton(variant: .default, size: .lg, action: {}) {
                            Text("Large")
                        }
                    }
                }
                
                ComponentSection("Icon Buttons") {
                    HStack(spacing: 12) {
                        ChatUIButton(variant: .ghost, size: .icon, action: {}) {
                            Image(systemName: "xmark")
                        }
                        .accessibilityLabel("Close")
                        
                        ChatUIButton(variant: .default, size: .icon, action: {}) {
                            Image(systemName: "plus")
                        }
                        .accessibilityLabel("Add")
                    }
                }
            }
            .padding()
        }
        .navigationTitle("Buttons")
    }
}

struct ComponentSection<Content: View>: View {
    let title: String
    let content: Content
    
    init(_ title: String, @ViewBuilder content: () -> Content) {
        self.title = title
        self.content = content()
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.headline)
                .foregroundColor(.secondary)
            
            content
        }
    }
}

#Preview {
    ContentView()
}

#Preview("Button Gallery") {
    ButtonGallery()
}
```

## Accessibility Testing During Development

### Built-in macOS Testing

- **VoiceOver**: `⌘F5` to enable/disable
- **Keyboard Navigation**: Tab/Shift+Tab, Enter/Space for activation
- **System Settings**: Test Dynamic Type, High Contrast, Reduced Motion

### SwiftUI Preview Accessibility

```swift
#Preview("High Contrast") {
    ButtonGallery()
        .environment(\.colorSchemeContrast, .increased)
}

#Preview("Large Text") {
    ButtonGallery()
        .environment(\.dynamicTypeSize, .accessibility3)
}

#Preview("Reduced Motion") {
    ButtonGallery()
        .environment(\.accessibilityReduceMotion, true)
}
```

### Accessibility Checklist

- [ ] Icon-only buttons have `.accessibilityLabel()`
- [ ] Interactive elements respond to keyboard navigation
- [ ] Colors work in high contrast mode
- [ ] Text scales with Dynamic Type
- [ ] Animations respect reduced motion preference
- [ ] Focus indicators are visible and clear

## Development Phases

### Phase 1: Foundation (Start Here)

1. Set up token generation (CSS + Swift constants)
2. Create playground app with component gallery
3. Build 5-10 core components (Button, Input, Card, etc.)
4. Test accessibility and SwiftUI previews

### Phase 2: Integration

1. Add more complex components (modals, navigation)
2. Integrate with existing design system
3. Create proper Swift package structure
4. Add comprehensive testing

### Phase 3: Business Logic (If Needed)

1. Evaluate if JSCore shared logic is worth the complexity
2. Start with shared contracts approach
3. Only add JSCore if significant logic duplication exists

## Target Architecture Decision

**Question**: Is your macOS target SwiftUI-only or SwiftUI + AppKit integration?

### SwiftUI-Only

- Pure SwiftUI components
- System integration through SwiftUI APIs
- Simpler development and testing
- Modern macOS feel

### SwiftUI + AppKit Integration

- Custom window management
- Menu bar integration
- System tray functionality
- More complex but more native integration

This choice affects the component gallery structure and testing approach. Let me know your preference for specific guidance on scaling the component architecture.

## Next Steps

1. **Start with Level 1 (UI-Only Bridge)**
2. **Create the playground app**
3. **Build component gallery with previews**
4. **Get comfortable with Xcode + SwiftUI workflow**
5. **Implement 5-10 core components**
6. **Then decide on business logic sharing approach**

This phased approach minimizes risk while building confidence in the SwiftUI development workflow.
