# DocC Documentation Setup Guide

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (beginner to intermediate)
- Scope: Task-focused instructions for this topic
- Non-scope: Comprehensive architecture reference
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


Complete guide for generating and publishing DocC documentation for ChatUI Swift packages.

## Table of Contents

1. [Overview](#overview)
2. [DocC Basics](#docc-basics)
3. [Setup](#setup)
4. [Writing Documentation](#writing-documentation)
5. [Generating Documentation](#generating-documentation)
6. [Publishing Documentation](#publishing-documentation)
7. [Best Practices](#best-practices)

## Overview

DocC (Documentation Compiler) is Apple's documentation system for Swift packages. It generates beautiful, interactive documentation from code comments and markdown files.

**Benefits:**

- Automatic API reference generation
- Interactive code examples
- Search functionality
- Cross-linking between symbols
- Export to static website

## DocC Basics

### Documentation Comments

DocC uses special comment syntax:

````swift
/// Brief description of the function.
///
/// Detailed description with more context about what the function does,
/// when to use it, and any important considerations.
///
/// - Parameters:
///   - name: Description of the name parameter
///   - age: Description of the age parameter
/// - Returns: Description of what the function returns
/// - Throws: Description of errors that might be thrown
///
/// ## Example
///
/// ```swift
/// let result = myFunction(name: "Alice", age: 30)
/// print(result)
/// ```
///
/// ## See Also
/// - ``RelatedFunction``
/// - ``RelatedType``
public func myFunction(name: String, age: Int) throws -> String {
    // Implementation
}
````

### Documentation Structure

```
Package/
├── Sources/
│   └── PackageName/
│       ├── PackageName.docc/
│       │   ├── PackageName.md          # Landing page
│       │   ├── GettingStarted.md       # Tutorial
│       │   └── Resources/              # Images, etc.
│       ├── File1.swift
│       └── File2.swift
└── Package.swift
```

## Setup

### Step 1: Create Documentation Catalog

For each package, create a `.docc` directory:

```bash
cd platforms/apple/swift/ChatUIFoundation/Sources/ChatUIFoundation
mkdir ChatUIFoundation.docc
```

### Step 2: Create Landing Page

Create `ChatUIFoundation.docc/ChatUIFoundation.md`:

```markdown
# `ChatUIFoundation`

Semantic design tokens, platform utilities, and accessibility helpers for native SwiftUI development.

## Overview

ChatUIFoundation provides the foundation layer for the ChatUI Swift package architecture, including semantic color tokens with automatic light/dark mode, typography styles matching React components, and comprehensive accessibility helpers.

## Topics

### Colors

- `FColor`

### Typography

- `FType`

### Spacing

- `FSpacing`

### Platform Utilities

- `Platform`

### Accessibility

- `FAccessibility`
```

### Step 3: Add Documentation Comments

Add DocC comments to all public APIs:

````swift
/// Semantic color tokens with automatic light/dark mode support.
///
/// `FColor` provides compile-time safe access to all design system colors
/// through Asset Catalog integration. Colors automatically adapt to system
/// appearance without manual switching logic.
///
/// ## Example
///
/// ```swift
/// Text("Hello, World!")
///     .foregroundStyle(FColor.textPrimary)
///     .background(FColor.bgCard)
/// ```
///
/// ## Topics
///
/// ### Surface Colors
/// - ``bgApp``
/// - ``bgCard``
/// - ``bgCardAlt``
///
/// ### Text Colors
/// - ``textPrimary``
/// - ``textSecondary``
/// - ``textTertiary``
public enum FColor {
    /// Primary text color for main content.
    ///
    /// - Light mode: Black (#000000)
    /// - Dark mode: White (#FFFFFF)
    public static let textPrimary = Color("foundation-text-primary", bundle: .module)

    // ... more colors
}
````

## Writing Documentation

### Documentation Comment Structure

```swift
/// [Brief description - one line]
///
/// [Detailed description - multiple paragraphs if needed]
///
/// [Parameters, Returns, Throws sections]
///
/// ## [Section Title]
///
/// [Section content]
///
/// ## Topics
///
/// ### [Group Title]
/// - ``Symbol1``
/// - ``Symbol2``
```

### Markdown Features

**Bold and Italic:**

```markdown
**bold text**
_italic text_
```

**Code:**

````markdown
Inline `code` or:

```swift
// Code block
let x = 5
```
````

````

**Links:**
```markdown
[DocC Reference](https://developer.apple.com/documentation/docc)
``InternalSymbol``
````

**Lists:**

```markdown
- Item 1
- Item 2

1. Numbered item 1
2. Numbered item 2
```

**Notes and Warnings:**

```markdown
> Note: This is a note

> Warning: This is a warning

> Important: This is important information
```

### Example Documentation

````swift
/// A view that displays a settings row with optional icon, title, subtitle, and trailing content.
///
/// `SettingRowView` is the core primitive for building settings interfaces. It supports
/// multiple trailing content options including chevrons, text values, and custom views.
///
/// ## Example
///
/// ```swift
/// SettingRowView(
///     icon: AnyView(Image(systemName: "bell.fill")),
///     title: "Notifications",
///     subtitle: "Receive push notifications",
///     trailing: .chevron
/// ) {
///     // Navigate to notifications settings
/// }
/// ```
///
/// ## Platform Behavior
///
/// - **macOS**: Displays hover overlay when cursor is over the row
/// - **iOS**: Displays pressed overlay when touched
/// - **visionOS**: Uses standard interaction patterns
///
/// - Parameters:
///   - icon: Optional icon displayed on the left side
///   - title: Main title text
///   - subtitle: Optional subtitle text displayed below title
///   - trailing: Trailing content option (none, chevron, text, or custom)
///   - action: Optional action closure called when row is tapped
///
/// ## Topics
///
/// ### Creating a Row
/// - ``init(icon:title:subtitle:trailing:action:)``
///
/// ### Trailing Options
/// - ``SettingTrailing``
///
/// ## See Also
/// - ``SettingToggleView``
/// - ``SettingDropdownView``
public struct SettingRowView: View {
    // Implementation
}
````

## Generating Documentation

### Command Line

Generate documentation for a single package:

```bash
cd platforms/apple/swift/ChatUIFoundation
swift package generate-documentation
```

Generate with custom output directory:

```bash
swift package generate-documentation \
    --output-path ./docs
```

### Xcode

1. Open package in Xcode
2. Product → Build Documentation (`⌃⇧⌘D`)
3. Documentation appears in Xcode's Documentation window

### Viewing Documentation

**In Xcode:**

- Window → Developer Documentation
- Search for your package name

**In Browser:**

```bash
# Generate and open
swift package generate-documentation \
    --output-path ./docs
open ./docs/documentation/chatuifoundation/index.html
```

## Publishing Documentation

### GitHub Pages

1. **Generate Static Site:**

   ```bash
   swift package generate-documentation \
       --output-path ./docs \
       --hosting-base-path /ChatUI
   ```

2. **Commit Documentation:**

   ```bash
   git add docs/
   git commit -m "Update documentation"
   git push
   ```

3. **Enable GitHub Pages:**
   - Repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: main, /docs folder
   - Save

4. **Access Documentation:**
   - <https://yourusername.github.io/ChatUI/documentation/chatuifoundation/>

### Custom Domain

1. Add `CNAME` file to docs directory:

   ```
   docs.example.com
   ```

2. Configure DNS:
   - Add CNAME record pointing to `yourusername.github.io`

3. Enable custom domain in GitHub Pages settings

### Automated Publishing

Add to CI/CD pipeline:

```yaml
# .github/workflows/docs.yml
name: Documentation

on:
  push:
    branches: [main]

jobs:
  docs:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3

      - name: Generate Documentation
        run: |
          cd platforms/apple/swift/ChatUIFoundation
          swift package generate-documentation \
            --output-path ../../docs/foundation \
            --hosting-base-path /ChatUI

          cd ../ChatUIComponents
          swift package generate-documentation \
            --output-path ../../docs/components \
            --hosting-base-path /ChatUI

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs
```

## Best Practices

### Documentation Coverage

**Minimum Requirements:**

- ✅ All public types documented
- ✅ All public functions documented
- ✅ All public properties documented
- ✅ At least one example per type
- ✅ Landing page with overview

**Recommended:**

- ✅ Multiple examples showing different use cases
- ✅ Platform-specific behavior documented
- ✅ Common pitfalls and solutions
- ✅ Related symbols cross-linked
- ✅ Tutorials for complex features

### Writing Style

**Do:**

- ✅ Start with brief, one-line description
- ✅ Use active voice ("Returns the value" not "The value is returned")
- ✅ Include code examples
- ✅ Document parameters and return values
- ✅ Cross-link related symbols
- ✅ Explain when to use vs alternatives

**Don't:**

- ❌ Repeat information from type name
- ❌ Use vague descriptions ("Does stuff")
- ❌ Skip examples
- ❌ Forget to document parameters
- ❌ Use jargon without explanation

### Code Examples

**Good Example:**

````swift
/// Creates a settings row with a toggle switch.
///
/// ## Example
///
/// ```swift
/// @State private var isEnabled = false
///
/// SettingToggleView(
///     icon: AnyView(Image(systemName: "bell.fill")),
///     title: "Notifications",
///     subtitle: "Receive push notifications",
///     isOn: $isEnabled
/// )
/// ```
````

**Bad Example:**

```swift
/// A toggle view.
///
/// Use this for toggles.
```

### Organization

Group related symbols using Topics:

```swift
/// ## Topics
///
/// ### Creating Views
/// - ``init(title:)``
/// - ``init(title:subtitle:)``
///
/// ### Configuring Appearance
/// - ``backgroundColor``
/// - ``foregroundColor``
///
/// ### Handling Interactions
/// - ``onTap(_:)``
/// - ``onLongPress(_:)``
```

### Versioning

Document version requirements:

```swift
/// A modern settings row component.
///
/// - Since: ChatUIComponents 1.0
/// - Requires: iOS 15.0+, macOS 13.0+
```

Document deprecations:

```swift
/// Old function that's being replaced.
///
/// - Deprecated: Use ``newFunction()`` instead.
@available(*, deprecated, renamed: "newFunction")
public func oldFunction() { }
```

## Verify

1. Generate docs: `swift package generate-documentation --output-path ./docs`.
2. Open the landing page: `open ./docs/documentation/chatuifoundation/index.html`.
3. Confirm symbol links resolve and search returns your public types.

## Troubleshooting

### Documentation Not Generating

**Problem:** `swift package generate-documentation` fails

**Solutions:**

1. **Check Swift Version:**

   ```bash
   swift --version
   # Requires Swift 5.5+
   ```

2. **Check Package Structure:**
   - Ensure `.docc` directory exists
   - Ensure landing page exists
   - Check for syntax errors in markdown

3. **Clean and Retry:**

   ```bash
   swift package clean
   swift package generate-documentation
   ```

### Symbols Not Appearing

**Problem:** Public symbols missing from documentation

**Solutions:**

1. **Check Access Level:**
   - Must be `public` or `open`
   - Internal symbols not included

2. **Add Documentation Comment:**
   - Symbols without comments may be excluded
   - Add at least brief description

3. **Rebuild:**

   ```bash
   swift package clean
   swift build
   swift package generate-documentation
   ```

### Links Not Working

**Problem:** Symbol links show as plain text

**Solutions:**

1. **Use Double Backticks:**

   ```swift
   /// See ``MyType`` for details
   ```

2. **Check Symbol Name:**
   - Must match exactly
   - Include module if ambiguous: `ChatUIFoundation/FColor`

3. **Check Visibility:**
   - Can only link to public symbols

## Next Steps

1. **Add Documentation to All Packages**: Start with ChatUIFoundation
2. **Generate and Review**: Build documentation and review in Xcode
3. **Publish to GitHub Pages**: Make documentation publicly accessible
4. **Automate**: Add documentation generation to CI/CD
5. **Maintain**: Update documentation with code changes

## Resources

- [Apple DocC Documentation](https://www.swift.org/documentation/docc/)
- [DocC Tutorial](https://developer.apple.com/documentation/docc)
- [Swift-DocC Plugin](https://github.com/apple/swift-docc-plugin)

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

