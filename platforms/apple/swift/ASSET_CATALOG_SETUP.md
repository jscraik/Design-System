# Asset Catalog Setup and Hot Reload Workflow

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (beginner to intermediate)
- Scope: Task-focused instructions for this topic
- Non-scope: Comprehensive architecture reference
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


Complete guide for setting up Asset Catalog colors and enabling hot reload during development.

## Table of Contents

1. [Overview](#overview)
2. [Asset Catalog Structure](#asset-catalog-structure)
3. [Manual Setup](#manual-setup)
4. [Automated Generation](#automated-generation)
5. [Hot Reload Workflow](#hot-reload-workflow)
6. [Troubleshooting](#troubleshooting)
7. [Best Practices](#best-practices)

## Overview

The ChatUI Swift architecture uses Xcode Asset Catalogs for color management, providing:

- **Automatic Light/Dark Mode**: Colors adapt to system appearance without manual logic
- **High Contrast Support**: Asset Catalog handles accessibility automatically
- **Compile-Time Safety**: Named colors are checked at compile time
- **Hot Reload**: Changes to Asset Catalog update instantly in SwiftUI Previews
- **Zero Manual Logic**: No need for `@Environment(\.colorScheme)` for color selection

## Asset Catalog Structure

Asset Catalogs are located at:

```
platforms/apple/swift/ChatUIFoundation/Sources/ChatUIFoundation/Resources/Colors.xcassets/
```

Each color is defined as a `.colorset` directory containing a `Contents.json` file:

```
Colors.xcassets/
├── Contents.json
├── foundation-bg-app.colorset/
│   └── Contents.json
├── foundation-bg-card.colorset/
│   └── Contents.json
├── foundation-text-primary.colorset/
│   └── Contents.json
└── ... (15 total colorsets)
```

### Colorset Structure

Each `.colorset/Contents.json` defines light and dark variants:

```json
{
  "colors": [
    {
      "color": {
        "color-space": "srgb",
        "components": {
          "red": "0.000",
          "green": "0.000",
          "blue": "0.000",
          "alpha": "1.000"
        }
      },
      "idiom": "universal",
      "appearances": [
        {
          "appearance": "luminosity",
          "value": "light"
        }
      ]
    },
    {
      "color": {
        "color-space": "srgb",
        "components": {
          "red": "1.000",
          "green": "1.000",
          "blue": "1.000",
          "alpha": "1.000"
        }
      },
      "idiom": "universal",
      "appearances": [
        {
          "appearance": "luminosity",
          "value": "dark"
        }
      ]
    }
  ],
  "info": {
    "author": "xcode",
    "version": 1
  }
}
```

## Manual Setup

### Step 1: Create Asset Catalog

1. Open Xcode
2. Navigate to `platforms/apple/swift/ChatUIFoundation/Sources/ChatUIFoundation/`
3. Right-click → New File → Asset Catalog
4. Name it `Colors.xcassets`
5. Move it to `Resources/` directory

### Step 2: Add Color Set

1. Select `Colors.xcassets` in Xcode
2. Click + button at bottom
3. Choose "Color Set"
4. Name it (e.g., `foundation-text-primary`)

### Step 3: Configure Light/Dark Variants

1. Select the color set
2. In Attributes Inspector (right panel):
   - Set "Appearances" to "Any, Light, Dark"
3. Click on "Any Appearance" color well
4. Set the light mode color (RGB values)
5. Click on "Dark Appearance" color well
6. Set the dark mode color (RGB values)

### Step 4: Configure Package Resources

Ensure `Package.swift` includes the Asset Catalog:

```swift
.target(
    name: "ChatUIFoundation",
    dependencies: [],
    resources: [
        .process("Resources")
    ]
)
```

### Step 5: Access Colors in Code

Use the `FColor` semantic API:

```swift
import SwiftUI
import ChatUIFoundation

struct MyView: View {
    var body: some View {
        Text("Hello")
            .foregroundStyle(FColor.textPrimary)
            .background(FColor.bgCard)
    }
}
```

## Automated Generation

The token generation system automatically creates Asset Catalog colorsets from design tokens.

### Token Generator

Located at `packages/tokens/src/generator.ts`, the generator:

1. Reads design tokens from `packages/tokens/src/colors.ts`
2. Maps CSS light/dark pairs to Swift colorsets
3. Generates `.colorset/Contents.json` files
4. Outputs to `platforms/apple/swift/ChatUIFoundation/Sources/ChatUIFoundation/Resources/Colors.xcassets/`

### Running Token Generation

```bash
# Generate all tokens (CSS + Swift)
pnpm generate:tokens

# Watch for changes and regenerate
pnpm -C packages/tokens tokens:watch
```

### Token Mapping

CSS tokens map to Swift colorsets:

| CSS Light                   | CSS Dark                   | Swift Colorset            |
| --------------------------- | -------------------------- | ------------------------- |
| `--foundation-bg-dark-1`    | `--foundation-bg-light-1`  | `foundation-bg-app`       |
| `--foundation-bg-dark-2`    | `--foundation-bg-light-2`  | `foundation-bg-card`      |
| `--foundation-text-light-1` | `--foundation-text-dark-1` | `foundation-text-primary` |

### Validation

Token validation ensures consistency:

```bash
# Validate tokens match between CSS and Swift
pnpm validate:tokens
```

The validator checks:

- All CSS tokens have corresponding Swift colorsets
- RGB values match between platforms
- No missing or extra colorsets

## Hot Reload Workflow

Hot reload enables instant feedback when editing design tokens.

### Setup

1. **Open Component Gallery**:

   ```bash
   cd platforms/apple/apps/macos/ComponentGallery
   open Package.swift
   ```

2. **Run the App**:
   - Press `⌘R` to run
   - Or use SwiftUI Previews (`⌥⌘⏎`)

3. **Start Token Watcher**:

   ```bash
   # In separate terminal
   pnpm -C packages/tokens tokens:watch
   ```

### Workflow

1. **Edit Design Tokens**:

   ```typescript
   // packages/tokens/src/colors.ts
   export const colors = {
     foundation: {
       text: {
         light: {
           primary: "#000000", // Change this
         },
         dark: {
           primary: "#FFFFFF",
         },
       },
     },
   };
   ```

2. **Token Watcher Regenerates**:

   ```
   ✓ Tokens validated
   ✓ CSS generated
   ✓ Swift Asset Catalog generated
   ✓ Manifest updated
   ```

3. **SwiftUI Auto-Refreshes**:
   - Asset Catalog changes detected
   - SwiftUI Previews refresh automatically
   - Running app updates instantly

### Hot Reload Triggers

Hot reload works for:

- ✅ Asset Catalog color changes
- ✅ SwiftUI view code changes
- ✅ Component property changes
- ❌ Package.swift changes (requires rebuild)
- ❌ New file additions (requires rebuild)

## Troubleshooting

### Colors Not Updating

**Problem:** Changed colors in Asset Catalog but app still shows old colors.

**Solutions:**

1. **Clean Build Folder**:
   - Xcode → Product → Clean Build Folder (`⇧⌘K`)
   - Rebuild (`⌘B`)

2. **Restart SwiftUI Previews**:
   - Close preview canvas
   - Reopen with `⌥⌘⏎`

3. **Check Bundle**:

   ```swift
   // Ensure using .module bundle
   Color("foundation-text-primary", bundle: .module)
   ```

### Asset Catalog Not Found

**Problem:** "Cannot find 'Colors' in scope" or similar errors.

**Solutions:**

1. **Check Package.swift**:

   ```swift
   .target(
       name: "ChatUIFoundation",
       resources: [
           .process("Resources")  // Must include this
       ]
   )
   ```

2. **Verify Directory Structure**:

   ```
   Sources/ChatUIFoundation/
   └── Resources/
       └── Colors.xcassets/
   ```

3. **Clean and Rebuild**:

   ```bash
   cd platforms/apple/swift/ChatUIFoundation
   swift package clean
   swift build
   ```

### Token Generation Fails

**Problem:** `pnpm generate:tokens` fails with validation errors.

**Solutions:**

1. **Check Token Format**:
   - Ensure all colors have light and dark variants
   - Verify RGB values are valid (0-255 or 0.0-1.0)

2. **Check File Permissions**:

   ```bash
   # Ensure write permissions
   chmod -R u+w platforms/apple/swift/ChatUIFoundation/Sources/ChatUIFoundation/Resources/
   ```

3. **Review Error Messages**:
   - Token generator provides specific error messages
   - Fix the indicated tokens and retry

### SwiftUI Previews Not Loading

**Problem:** Previews show "Cannot preview in this file".

**Solutions:**

1. **Open Package Directly**:

   ```bash
   cd platforms/apple/swift/ChatUIFoundation
   open Package.swift
   ```

2. **Check Deployment Target**:
   - Ensure macOS 13.0+ in Package.swift
   - Ensure Xcode is using correct SDK

3. **Restart Xcode**:
   - Sometimes Xcode needs a restart
   - Close and reopen the project

## Best Practices

### Naming Conventions

Use semantic names that describe purpose, not appearance:

✅ **Good:**

- `foundation-text-primary`
- `foundation-bg-card`
- `foundation-accent-green`

❌ **Bad:**

- `color-black`
- `background-gray`
- `green-500`

### Color Organization

Group colors by category:

```
Colors.xcassets/
├── Surface Colors/
│   ├── foundation-bg-app.colorset
│   ├── foundation-bg-card.colorset
│   └── foundation-bg-card-alt.colorset
├── Text Colors/
│   ├── foundation-text-primary.colorset
│   ├── foundation-text-secondary.colorset
│   └── foundation-text-tertiary.colorset
└── Accent Colors/
    ├── foundation-accent-green.colorset
    └── foundation-accent-blue.colorset
```

### Semantic API

Always use the `FColor` API instead of direct `Color()` calls:

✅ **Good:**

```swift
Text("Hello")
    .foregroundStyle(FColor.textPrimary)
```

❌ **Bad:**

```swift
Text("Hello")
    .foregroundStyle(Color("foundation-text-primary", bundle: .module))
```

**Benefits:**

- Compile-time safety
- Autocomplete support
- Easier refactoring
- Better discoverability

### Version Control

**Commit Asset Catalog changes:**

```bash
git add platforms/apple/swift/ChatUIFoundation/Sources/ChatUIFoundation/Resources/Colors.xcassets/
git commit -m "Update color tokens"
```

**Don't commit:**

- `.build/` directories
- `.swiftpm/` directories
- Xcode user data

### Documentation

Document color usage in code:

```swift
/// Primary text color for main content
/// - Light mode: Black (#000000)
/// - Dark mode: White (#FFFFFF)
public static let textPrimary = Color("foundation-text-primary", bundle: .module)
```

## Advanced Workflows

### Custom Color Spaces

For wide color gamut displays:

```json
{
  "color": {
    "color-space": "display-p3",
    "components": {
      "red": "0.000",
      "green": "0.000",
      "blue": "0.000",
      "alpha": "1.000"
    }
  }
}
```

### High Contrast Variants

Add high contrast variants:

1. In Xcode, select color set
2. Attributes Inspector → Appearances
3. Add "High Contrast" variant
4. Set high contrast colors

### Dynamic Colors

For colors that change based on context:

```swift
extension FColor {
    static var contextual: Color {
        Color("foundation-contextual", bundle: .module)
    }
}
```

## Integration with CI/CD

### Automated Validation

Add to CI pipeline:

```yaml
# .github/workflows/ci.yml
- name: Validate Tokens
  run: pnpm validate:tokens

- name: Build Swift Packages
  run: |
    cd platforms/apple/swift/ChatUIFoundation
    swift build
```

### Pre-commit Hooks

Validate tokens before commit:

```bash
# .git/hooks/pre-commit
#!/bin/bash
pnpm validate:tokens || exit 1
```

## Next Steps

1. **Explore Component Gallery**: See all colors in use
2. **Read Development Workflow**: Learn about testing and debugging
3. **Review Migration Guide**: Understand team adoption strategies
4. **Check Parity Checklist**: Compare React and SwiftUI components

## Support

For issues and questions:

- Check troubleshooting section above
- Review token generator documentation
- File an issue on the repository

## License

See repository root for license information.

## Risks and assumptions
- Assumptions: TBD (confirm)
- Failure modes and blast radius: TBD (confirm)
- Rollback or recovery guidance: TBD (confirm)

## Verify
- TBD: Add concrete verification steps and expected results.

