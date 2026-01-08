# ChatUISwift Development Tools

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Contents

- [Doc requirements](#doc-requirements)
- [Overview](#overview)
- [Quick Start](#quick-start)
  - [Start All Development Tools](#start-all-development-tools)
  - [Start Individual Tools](#start-individual-tools)
- [Tool Details](#tool-details)
  - [1. Token Hot Reload](#1-token-hot-reload)
  - [2. Component Documentation Generation](#2-component-documentation-generation)
  - [3. Component Debugging Tools](#3-component-debugging-tools)
  - [4. Performance Monitoring](#4-performance-monitoring)
- [Integration with Xcode](#integration-with-xcode)
  - [SwiftUI Previews](#swiftui-previews)
  - [Xcode Workflow](#xcode-workflow)
- [Configuration](#configuration)
  - [Environment Variables](#environment-variables)
  - [Debug Configuration](#debug-configuration)
- [Performance Dashboard](#performance-dashboard)
- [Troubleshooting](#troubleshooting)
  - [Token Hot Reload Issues](#token-hot-reload-issues)
  - [Documentation Generation Issues](#documentation-generation-issues)
  - [Performance Monitoring Issues](#performance-monitoring-issues)
  - [Debug Tools Not Appearing](#debug-tools-not-appearing)
- [Best Practices](#best-practices)
  - [Development Workflow](#development-workflow)
  - [Performance Optimization](#performance-optimization)
  - [Documentation Maintenance](#documentation-maintenance)
- [Requirements](#requirements)
- [Verify](#verify)
- [Validation: Requirements 7.1, 7.4](#validation-requirements-71-74)


> Legacy: `platforms/apple/swift/ui-swift` is retained for reference. The current macOS apps use the modular Swift packages in `platforms/apple/swift/`.

This document describes the development tooling available for ChatUISwift, including hot reload, documentation generation, debugging tools, and performance monitoring.

## Overview

The ChatUISwift development tools provide an integrated development experience with:

1. **Hot Reload for Token Changes** - Automatic regeneration when design tokens change
2. **Component Documentation Generation** - Automated API documentation from source code
3. **Debugging Tools for Component State** - Runtime inspection and state monitoring
4. **Performance Monitoring for SwiftUI Previews** - Real-time performance metrics

## Quick Start

### Start All Development Tools

```bash
# Start the token dev tools
pnpm -C packages/tokens dev

# Or with verbose logging
pnpm -C packages/tokens dev:verbose
```

### Start Individual Tools

```bash
# Token hot reload only
pnpm -C packages/tokens dev:hot-reload

# Swift development mode
cd platforms/apple/swift/ui-swift
./build.sh dev

# Generate documentation
./build.sh docs
```

## Tool Details

### 1. Token Hot Reload

Automatically regenerates Swift constants and CSS variables when design tokens change.

**Features:**

- File watching with debounced regeneration
- Automatic cache clearing for module reloads
- Integration with Xcode preview system
- Verbose logging for debugging

**Usage:**

```bash
# Start token watcher
pnpm -C packages/tokens dev:hot-reload

# With verbose logging
pnpm -C packages/tokens dev:hot-reload:verbose

# Custom debounce timing
pnpm -C packages/tokens exec tsx scripts/watch-tokens.ts --debounce=500
```

**How it works:**

1. Watches `src/colors.ts`, `src/spacing.ts`, `src/typography.ts`
2. Debounces changes (default 300ms)
3. Clears Node.js module cache
4. Regenerates Swift and CSS outputs
5. Notifies about Xcode preview refresh

### 2. Component Documentation Generation

Automatically generates comprehensive API documentation from Swift source code.

**Features:**

- Parses Swift components for properties, methods, examples
- Extracts accessibility features and documentation
- Generates Markdown with usage examples
- Integrates with build system

**Usage:**

```bash
# Generate documentation
cd platforms/apple/swift/ui-swift
./build.sh docs

# Or directly with Swift
swift scripts/generate-docs.swift . docs/components.md
```

**Generated Documentation Includes:**

- Component descriptions and file locations
- Property tables with types, defaults, and descriptions
- Method signatures and documentation
- Usage examples from `#Preview` blocks
- Accessibility features and compliance information

### 3. Component Debugging Tools

Runtime debugging and state inspection tools for SwiftUI components.

**Features:**

- Component state inspector with history
- Performance monitoring overlay
- Debug console with filtering
- Redraw highlighting
- Memory usage tracking

**Usage in Components:**

```swift
import ChatUISwift

struct MyComponent: View {
    var body: some View {
        VStack {
            // Your component content
        }
        .debugComponent(name: "MyComponent") // Adds all debug features

        // Or individual features:
        .debugInspector(componentName: "MyComponent")
        .debugPerformance(componentName: "MyComponent")
        .debugRedraws()
    }
}
```

**Debug Configuration:**

```swift
// Enable/disable debug features
DebugConfig.isEnabled = true
DebugConfig.showStateInspector = true
DebugConfig.logStateChanges = true
DebugConfig.showPerformanceMetrics = true
DebugConfig.highlightRedraws = true
```

**Debug Console:**

```swift
// Global debug logging
debugLog("Component initialized", component: "MyComponent")
debugError("Validation failed", component: "MyComponent")
debugWarning("Performance issue detected", component: "MyComponent")

// Show debug console
DebugConsole.shared.toggle()
```

### 4. Performance Monitoring

Real-time performance metrics specifically designed for SwiftUI Previews.

**Features:**

- FPS monitoring and display
- Render time tracking
- Memory usage monitoring
- Slow preview detection
- Performance benchmarking

**Usage in Previews:**

```swift
#Preview("Button Performance") {
    PreviewWithMonitoring("Button Test") {
        VStack {
            ChatUIButton(variant: .default) { Text("Test") }
            ChatUIButton(variant: .destructive) { Text("Delete") }
        }
    }
}

// Or as a modifier
#Preview("Input Performance") {
    ChatUIInput(placeholder: "Enter text")
        .previewPerformance(name: "Input Test")
}
```

**Performance Configuration:**

```swift
PreviewPerformanceConfig.isEnabled = true
PreviewPerformanceConfig.showMetricsOverlay = true
PreviewPerformanceConfig.trackMemoryUsage = true
PreviewPerformanceConfig.logSlowPreviews = true
PreviewPerformanceConfig.slowPreviewThreshold = 0.016 // 60fps
PreviewPerformanceConfig.memoryWarningThreshold = 100.0 // MB
```

**Benchmarking:**

```swift
let result = PreviewBenchmark.measurePreviewPerformance(
    name: "Button Benchmark",
    iterations: 100
) {
    ChatUIButton(variant: .default) { Text("Benchmark") }
}

print("Performance Grade: \(result.performanceGrade)")
print("Is Performant: \(result.isPerformant)")
```

## Integration with Xcode

### SwiftUI Previews

The development tools are designed to work seamlessly with Xcode's SwiftUI preview system:

1. **Token Changes**: Resume previews with `⌥⌘P` after token regeneration
2. **Performance Metrics**: Visible as overlays in preview canvas
3. **Debug Inspector**: Expandable panels within preview content
4. **State Monitoring**: Real-time updates in preview environment

### Xcode Workflow

```bash
# 1. Start development tools
pnpm -C packages/tokens dev

# 2. Open the ChatUISwift package in Xcode
open platforms/apple/swift/ui-swift/Package.swift

# 3. In Xcode:
# - Open component files
# - Show Canvas: ⌥⌘⏎
# - Resume previews: ⌥⌘P
# - Performance metrics appear automatically
```

## Configuration

### Environment Variables

```bash
# Enable development mode
export CHATUI_DEV_MODE=true

# Enable performance monitoring
export CHATUI_PERFORMANCE_MONITORING=true

# Verbose logging
export CHATUI_VERBOSE=true
```

### Debug Configuration

```swift
// In your app or preview setup
#if DEBUG
DebugConfig.isEnabled = true
DebugConfig.showStateInspector = true
DebugConfig.showPerformanceMetrics = true

PreviewPerformanceConfig.showMetricsOverlay = true
PreviewPerformanceConfig.trackMemoryUsage = true
#endif
```

## Performance Dashboard

When running the full development tools suite, a web dashboard is available at:

**<http://localhost:3001>**

The dashboard provides:

- Tool status overview
- Metrics API endpoint (`/metrics`)
- Links to documentation
- Development tool configuration

## Troubleshooting

### Token Hot Reload Issues

```bash
# Check if files are being watched
pnpm -C packages/tokens dev:hot-reload:verbose

# Manually trigger regeneration
pnpm -C packages/tokens generate

# Clear Node.js cache
rm -rf node_modules/.cache
```

### Documentation Generation Issues

```bash
# Check Swift compiler
swift --version

# Test documentation generator
swift scripts/generate-docs.swift . /tmp/test-docs.md

# Check file permissions
chmod +x scripts/generate-docs.swift
```

### Performance Monitoring Issues

```bash
# Check if debug mode is enabled
echo $CHATUI_DEV_MODE

# Verify Xcode preview setup
# - Ensure Canvas is visible (⌥⌘⏎)
# - Resume previews (⌥⌘P)
# - Check console for debug output
```

### Debug Tools Not Appearing

```swift
// Verify debug configuration
print("Debug enabled: \(DebugConfig.isEnabled)")
print("State inspector: \(DebugConfig.showStateInspector)")
print("Performance metrics: \(DebugConfig.showPerformanceMetrics)")

// Force enable for testing
DebugConfig.isEnabled = true
DebugConfig.showStateInspector = true
```

## Best Practices

### Development Workflow

1. **Start with tools enabled**: Always run `pnpm -C packages/tokens dev` before development
2. **Use performance monitoring**: Add `.previewPerformance()` to new components
3. **Monitor state changes**: Use debug inspector for complex state logic
4. **Generate documentation**: Run `./build.sh docs` after API changes
5. **Check performance**: Benchmark components with heavy rendering

### Performance Optimization

1. **Monitor FPS**: Keep above 30fps for smooth previews
2. **Watch memory usage**: Stay below 100MB for preview stability
3. **Profile render times**: Optimize components with >16ms render times
4. **Use debug highlighting**: Identify unnecessary redraws
5. **Benchmark regularly**: Compare performance across changes

### Documentation Maintenance

1. **Add component documentation**: Use `///` comments above components
2. **Document properties**: Describe purpose and usage
3. **Include examples**: Add `#Preview` blocks with descriptive names
4. **Update accessibility info**: Document accessibility features
5. **Regenerate after changes**: Keep documentation current

## Requirements

- **macOS 13.0+** (for SwiftUI features)
- **Xcode 15.0+** (for SwiftUI previews)
- **Swift 5.9+** (for package compilation)
- **Node.js 18+** (for token generation)
- **pnpm** (for package management)

## Verify

1. Run `pnpm -C packages/tokens dev:hot-reload`.
2. Change a token in `packages/tokens/src/colors.ts`.
3. Confirm regeneration logs in the terminal and refresh previews with `⌥⌘P`.

## Validation: Requirements 7.1, 7.4

This development tooling implementation satisfies the specified requirements:

**Requirement 7.1**: Hot reloading for both React and Swift applications

- ✅ Token hot reload with file watching and debounced regeneration
- ✅ Automatic Swift constant and CSS variable generation
- ✅ Integration with Xcode preview system for immediate feedback

**Requirement 7.4**: Real-time validation and preview of design token changes

- ✅ File watching system for token source files
- ✅ Automatic regeneration with validation
- ✅ Real-time preview updates in Xcode
- ✅ Performance monitoring to ensure changes don't impact performance
- ✅ Debug tools to validate token application in components
