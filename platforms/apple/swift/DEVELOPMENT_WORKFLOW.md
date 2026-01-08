# Development Workflow Guide

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


Complete guide for developing with ChatUI Swift packages including hot reload, testing, and debugging.

## Table of Contents

1. [Development Environment](#development-environment)
2. [Hot Reload Workflow](#hot-reload-workflow)
3. [Testing Strategy](#testing-strategy)
4. [Debugging Techniques](#debugging-techniques)
5. [Performance Optimization](#performance-optimization)
6. [Common Workflows](#common-workflows)

## Development Environment

### Required Tools

- **Xcode 15.0+**: Primary IDE for SwiftUI development
- **Swift 5.9+**: Language version
- **Node.js 18+**: For token generation
- **pnpm**: Package manager for token system

### Recommended Setup

**Xcode Configuration:**

1. Enable SwiftUI Previews: Editor → Canvas
2. Show Minimap: Editor → Minimap
3. Enable Line Numbers: Xcode → Settings → Text Editing
4. Install SF Symbols app for icon reference

**Terminal Setup:**

```bash
# Add aliases to ~/.zshrc or ~/.bashrc
alias swift-build='swift build'
alias swift-test='swift test'
alias swift-clean='swift package clean'
alias tokens-watch='pnpm -C packages/tokens tokens:watch'
alias tokens-gen='pnpm generate:tokens'
```

### Project Structure

```
workspace/
├── platforms/apple/swift/                          # Swift packages
│   ├── ChatUIFoundation/
│   ├── ChatUIComponents/
│   ├── ChatUIThemes/
│   └── ChatUIShellChatGPT/
├── platforms/apple/apps/macos/ComponentGallery/    # Development app
├── packages/tokens/                # Token system
└── scripts/                        # Build scripts
```

## Hot Reload Workflow

### Setup

1. **Open Component Gallery:**

   ```bash
   cd platforms/apple/apps/macos/ComponentGallery
   open Package.swift
   ```

2. **Start Token Watcher:**

   ```bash
   # In separate terminal
   pnpm -C packages/tokens tokens:watch
   ```

3. **Run App or Previews:**
   - App: Press `⌘R`
   - Previews: Press `⌥⌘⏎`

### Workflow Loop

```
Edit Code → Auto-Save → SwiftUI Refreshes → See Changes
     ↑                                            ↓
     └────────────────────────────────────────────┘
```

**What Triggers Hot Reload:**

- ✅ SwiftUI view code changes
- ✅ Asset Catalog color changes
- ✅ Component property changes
- ✅ State variable changes
- ❌ Package.swift changes (requires rebuild)
- ❌ New file additions (requires rebuild)

### Token Hot Reload

**Workflow:**

1. **Edit Design Tokens:**

   ```typescript
   // packages/tokens/src/colors.ts
   export const colors = {
     foundation: {
       text: {
         light: {
           primary: "#000000", // Change this
         },
       },
     },
   };
   ```

2. **Token Watcher Regenerates:**

   ```
   [tokens:watch] File changed: colors.ts
   [tokens:watch] ✓ Validating tokens...
   [tokens:watch] ✓ Generating CSS...
   [tokens:watch] ✓ Generating Swift Asset Catalog...
   [tokens:watch] ✓ Complete in 234ms
   ```

3. **SwiftUI Auto-Refreshes:**
   - Asset Catalog changes detected
   - Previews refresh automatically
   - Running app updates instantly

### Preview Variants

Create multiple preview variants for rapid testing:

```swift
#Preview("Light Mode") {
    MyView()
        .frame(width: 400, height: 600)
}

#Preview("Dark Mode") {
    MyView()
        .frame(width: 400, height: 600)
        .environment(\.colorScheme, .dark)
}

#Preview("macOS") {
    MyView()
        .frame(width: 450, height: 650)
}

#Preview("iOS") {
    NavigationView {
        MyView()
    }
}

#Preview("High Contrast") {
    MyView()
        .environment(\.accessibilityReduceMotion, true)
}
```

### Preview Tips

**Speed Up Previews:**

- Use smaller frame sizes
- Limit number of preview variants
- Use `PreviewProvider` instead of `#Preview` for complex setups

**Debug Previews:**

- Add `print()` statements
- Use `.onAppear { print("View appeared") }`
- Check Xcode console for errors

**Restart Previews:**

- `⌥⌘P` - Resume previews
- `⌥⌘⏎` - Show/hide canvas
- Clean build folder if stuck

## Testing Strategy

### Unit Tests

**Location:** `Tests/PackageNameTests/`

**Structure:**

```swift
import XCTest
@testable import ChatUIComponents

final class SettingRowTests: XCTestCase {
    func testRowRendersTitle() {
        // Arrange
        let title = "Test Title"

        // Act
        let row = SettingRowView(title: title)

        // Assert
        // Test implementation
    }

    func testRowWithIcon() {
        // Test with icon
    }

    func testRowWithChevron() {
        // Test with chevron
    }
}
```

**Running Tests:**

```bash
# All tests
cd platforms/apple/swift/ChatUIComponents
swift test

# Specific test
swift test --filter SettingRowTests

# With verbose output
swift test --verbose
```

### SwiftUI Preview Tests

Use previews as visual tests:

```swift
#Preview("All Variants") {
    VStack(spacing: 20) {
        SettingRowView(title: "Simple")
        SettingRowView(
            icon: AnyView(Image(systemName: "bell.fill")),
            title: "With Icon"
        )
        SettingRowView(
            title: "With Chevron",
            trailing: .chevron
        )
    }
    .padding()
}
```

### Accessibility Tests

Test with Accessibility Inspector:

1. Run app in simulator
2. Xcode → Open Developer Tool → Accessibility Inspector
3. Select simulator
4. Run audit
5. Fix issues

**Common Checks:**

- VoiceOver labels present
- Focus order logical
- Contrast ratios sufficient
- Dynamic type support

### Integration Tests

Test complete flows:

```swift
func testSettingsFlow() {
    // 1. Open settings
    // 2. Toggle notification setting
    // 3. Verify state changed
    // 4. Close settings
    // 5. Reopen settings
    // 6. Verify state persisted
}
```

## Debugging Techniques

### Print Debugging

```swift
struct MyView: View {
    var body: some View {
        Text("Hello")
            .onAppear {
                print("View appeared")
            }
            .onChange(of: someState) { oldValue, newValue in
                print("State changed: \(oldValue) → \(newValue)")
            }
    }
}
```

### Breakpoints

1. Click line number in Xcode to add breakpoint
2. Run app in debug mode (`⌘R`)
3. Execution pauses at breakpoint
4. Inspect variables in debug area
5. Step through code with controls

### View Hierarchy Debugging

1. Run app in simulator
2. Pause execution
3. Click "Debug View Hierarchy" button
4. Explore 3D view hierarchy
5. Inspect view properties

### Memory Debugging

**Detect Memory Leaks:**

1. Product → Profile (`⌘I`)
2. Choose "Leaks" instrument
3. Run app and interact
4. Check for leaks in timeline

**Common Causes:**

- Retain cycles in closures
- Strong references in delegates
- Unowned references to deallocated objects

**Solutions:**

```swift
// Use [weak self] in closures
Button("Action") {
    [weak self] in
    self?.doSomething()
}

// Use @StateObject for ObservableObject
@StateObject private var viewModel = MyViewModel()
```

### Performance Debugging

**Identify Slow Views:**

1. Product → Profile (`⌘I`)
2. Choose "Time Profiler"
3. Run app and interact
4. Find slow functions in call tree

**Common Issues:**

- Heavy computations in body
- Unnecessary view updates
- Large image rendering

**Solutions:**

```swift
// Cache expensive computations
private var expensiveValue: String {
    // Computed once, cached
}

// Use @State for local state
@State private var count = 0

// Use .equatable() to prevent unnecessary updates
MyView()
    .equatable()
```

## Performance Optimization

### View Performance

**Minimize Body Calls:**

```swift
// Bad: Recomputes every time
var body: some View {
    let value = expensiveComputation()
    return Text(value)
}

// Good: Compute once
private let value = expensiveComputation()
var body: some View {
    Text(value)
}
```

**Use @State Wisely:**

```swift
// Bad: Unnecessary state
@State private var constantValue = "Hello"

// Good: Use let
private let constantValue = "Hello"
```

**Lazy Loading:**

```swift
// Use LazyVStack for long lists
ScrollView {
    LazyVStack {
        ForEach(items) { item in
            ItemView(item: item)
        }
    }
}
```

### Asset Optimization

**Image Optimization:**

- Use SF Symbols when possible
- Compress images before adding
- Use appropriate image scales (@1x, @2x, @3x)

**Color Optimization:**

- Use Asset Catalog colors
- Avoid creating Color instances repeatedly
- Cache color instances if needed

### Build Performance

**Reduce Build Time:**

```bash
# Clean build folder
swift package clean

# Build in release mode
swift build -c release

# Parallel builds (default)
swift build --jobs 8
```

**Incremental Builds:**

- Only changed files rebuild
- Faster iteration during development
- Use `swift build` instead of clean builds

## Common Workflows

### Adding New Component

1. **Create Component File:**

   ```bash
   cd platforms/apple/swift/ChatUIComponents/Sources/ChatUIComponents
   touch MyNewComponent.swift
   ```

2. **Implement Component:**

   ```swift
   import SwiftUI
   import ChatUIFoundation
   import ChatUIThemes

   public struct MyNewComponent: View {
       public init() {}

       public var body: some View {
           Text("My Component")
               .font(FType.title())
               .foregroundStyle(FColor.textPrimary)
       }
   }
   ```

3. **Add Preview:**

   ```swift
   #Preview {
       MyNewComponent()
   }
   ```

4. **Add to Component Gallery:**

   ```swift
   // In ComponentGallery.swift
   NavigationLink("My New Component") {
       MyNewComponent()
   }
   ```

5. **Write Tests:**

   ```swift
   // In Tests/ChatUIComponentsTests/
   final class MyNewComponentTests: XCTestCase {
       func testComponentRenders() {
           // Test implementation
       }
   }
   ```

6. **Update Documentation:**
   - Add DocC comments
   - Update README
   - Add to parity checklist

### Updating Design Tokens

1. **Edit Token Source:**

   ```typescript
   // packages/tokens/src/colors.ts
   export const colors = {
     foundation: {
       text: {
         light: { primary: "#000000" },
         dark: { primary: "#FFFFFF" },
       },
     },
   };
   ```

2. **Regenerate Tokens:**

   ```bash
   pnpm generate:tokens
   ```

3. **Verify Changes:**
   - Check Asset Catalog updated
   - Test in Component Gallery
   - Verify light/dark modes

4. **Commit Changes:**

   ```bash
   git add packages/tokens/src/colors.ts
   git add platforms/apple/swift/ChatUIFoundation/Sources/ChatUIFoundation/Resources/
   git commit -m "Update text primary color"
   ```

### Fixing Build Errors

1. **Read Error Message:**
   - Xcode shows errors in Issue Navigator
   - Click error to jump to location

2. **Common Fixes:**
   - Missing import: Add `import ChatUIFoundation`
   - Type mismatch: Check parameter types
   - Missing resource: Verify Asset Catalog included

3. **Clean Build:**

   ```bash
   swift package clean
   swift build
   ```

4. **Check Dependencies:**

   ```bash
   swift package resolve
   swift package update
   ```

### Debugging Preview Issues

1. **Preview Not Loading:**
   - Check deployment target (macOS 13.0+)
   - Verify no syntax errors
   - Clean build folder

2. **Preview Crashes:**
   - Check for force unwraps
   - Verify all required data provided
   - Add error handling

3. **Preview Shows Wrong Content:**
   - Check preview code
   - Verify state initialization
   - Restart Xcode if needed

## Best Practices

### Development Habits

✅ **Do:**

- Use SwiftUI Previews for rapid iteration
- Write tests as you develop
- Commit frequently with clear messages
- Update documentation with code changes
- Test on multiple platforms regularly

❌ **Don't:**

- Skip testing until the end
- Hardcode values instead of using tokens
- Ignore compiler warnings
- Commit broken code
- Skip documentation

### Code Organization

**File Structure:**

```swift
// 1. Imports
import SwiftUI
import ChatUIFoundation

// 2. Main Type
public struct MyView: View {
    // 3. Properties
    @State private var isEnabled = false

    // 4. Initializer
    public init() {}

    // 5. Body
    public var body: some View {
        // Implementation
    }

    // 6. Private Helpers
    private func helper() {
        // Helper implementation
    }
}

// 7. Previews
#Preview {
    MyView()
}
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-component

# Make changes and commit
git add .
git commit -m "Add new component"

# Push and create PR
git push origin feature/new-component
```

## Next Steps

1. **Set Up Environment**: Install required tools
2. **Try Hot Reload**: Edit tokens and see instant updates
3. **Write First Test**: Add unit test for a component
4. **Debug a View**: Use breakpoints and print debugging
5. **Optimize Performance**: Profile and improve slow views

## Support

For development support:

- Check troubleshooting sections in other guides
- Review Component Gallery for examples
- File issues on repository for bugs

## License

See repository root for license information.

## Risks and assumptions
- Assumptions: TBD (confirm)
- Failure modes and blast radius: TBD (confirm)
- Rollback or recovery guidance: TBD (confirm)

## Verify
- TBD: Add concrete verification steps and expected results.

## Troubleshooting
- TBD: Add the top 3 failure modes and fixes.

