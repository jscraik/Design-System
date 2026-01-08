# Enhanced Monorepo Build Pipeline

Last updated: 2026-01-07

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

The enhanced build pipeline provides unified build orchestration for both npm (React/web) and Swift Package Manager (macOS/iOS) platforms with version synchronization, incremental builds, and comprehensive validation.

## Table of contents

- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Verify](#verify)
- [Architecture](#architecture)
- [Build pipeline stages](#build-pipeline-stages)
- [Incremental builds](#incremental-builds)
- [CI/CD integration](#cicd-integration)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js 18+
- pnpm 10.27.0
- macOS 13+ + Xcode 15+ for Swift builds (if running `pnpm build:macos` / `pnpm test:swift`)

## Overview

The build pipeline is designed to:

- **Cross-Platform Builds**: Support both web (npm) and macOS (Swift) platforms
- **Version Synchronization**: Keep versions consistent across package.json and Package.swift files
- **Incremental Builds**: Only rebuild what has changed to save time
- **Token Validation**: Ensure Swift Asset Catalog colors match CSS custom properties
- **CI/CD Integration**: Automated testing and validation in GitHub Actions

## Quick Start

```bash
# Build all platforms
pnpm build

# Build specific platform
pnpm build:web
pnpm build:macos

# Clean build (no incremental)
pnpm build:clean

# Build with tests
pnpm test:cross-platform
```

## Verify

- Web: `pnpm build:web` produces `packages/*/dist` bundles.
- Swift: `pnpm test:swift:foundation` compiles and runs package tests.
- Tokens: `pnpm validate:tokens` reports zero blocking errors.

## Architecture

```
scripts/
├── build-pipeline.mjs              # Main build orchestrator
├── sync-swift-versions.mjs         # Version synchronization
└── validate-token-consistency.mjs  # Token validation

.github/workflows/
└── ci.yml                          # CI/CD configuration
```

## Build Pipeline Stages

### 1. Version Synchronization

Ensures all packages use the same version from root `package.json`:

```bash
# Synchronize all packages (npm + Swift)
pnpm sync:versions

# Swift-only (Package.swift comments)
pnpm sync:swift-versions
```

**What it does:**

- Reads version from root `package.json`
- Updates npm package.json files
- Updates Swift Package.swift version comments
- Falls back to Package.swift comments if agvtool unavailable

### 2. Token Generation

Generates design tokens for all platforms:

```bash
# Generate tokens manually
pnpm generate:tokens
```

**Outputs:**

- `packages/tokens/src/foundations.css` - CSS custom properties
- `platforms/apple/swift/ChatUIFoundation/Sources/ChatUIFoundation/Resources/Colors.xcassets/` - Swift Asset Catalog
- `packages/tokens/docs/outputs/manifest.json` - Validation manifest

### 3. Token Validation

Validates consistency between CSS and Swift tokens:

```bash
# Validate tokens manually
pnpm validate:tokens
```

**Checks:**

- Swift colorsets have corresponding CSS tokens
- CSS semantic tokens have Swift colorsets
- Colorset structure is valid (light/dark variants)
- All required color components present

### 4. Platform Builds

#### Web Platform (npm)

Builds all npm packages:

- `packages/ui` - React component library
- `packages/runtime` - Widget runtime
- `packages/tokens` - Design tokens
- `packages/widgets` - Widget implementations

#### macOS Platform (Swift)

Builds all Swift packages:

- `platforms/apple/swift/ChatUIFoundation` - Foundation tokens and utilities
- `platforms/apple/swift/ChatUIComponents` - SwiftUI components
- `platforms/apple/swift/ChatUIThemes` - Theme presets
- `platforms/apple/swift/ChatUIShellChatGPT` - Optional shell layouts

### 5. Testing

Runs platform-specific test suites:

```bash
# Web tests
pnpm test                    # Unit tests
pnpm test:e2e:web           # E2E tests
pnpm test:a11y:widgets      # Accessibility tests
pnpm test:mcp-contract      # MCP contract tests

# Swift tests
pnpm test:swift             # All Swift packages
pnpm test:swift:foundation  # Foundation only
pnpm test:swift:components  # Components only
pnpm test:swift:themes      # Themes only
pnpm test:swift:shell       # Shell only
```

## Incremental Builds

The pipeline uses file modification times to determine what needs rebuilding:

**Token Regeneration:**

- Checks: `packages/tokens/src/*.ts`
- Outputs: CSS and Swift Asset Catalog

**npm Package Builds:**

- Checks: `src/**/*`, `package.json`, `tsconfig.json`
- Outputs: `dist/` directory

**Swift Package Builds:**

- Checks: `Sources/**/*.swift`, `Package.swift`
- Outputs: `.build/` directory

To force a clean build:

```bash
pnpm build:clean
```

## CI/CD Integration

### GitHub Actions Workflow

The CI workflow runs on both Ubuntu (web) and macOS (Swift):

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, macos-latest]
    include:
      - os: ubuntu-latest
        platform: web
      - os: macos-latest
        platform: macos
```

**Jobs:**

1. **Build** - Runs build pipeline for each platform
2. **A11y** - Accessibility testing (web only)
3. **Visual** - Visual regression testing (web only)

### Build Artifacts

Artifacts are uploaded for each platform:

- `build-artifacts-web` - npm package dist folders
- `build-artifacts-macos` - Swift .build folders
- `.build-cache/` - Build manifest for incremental builds

## Configuration

### Build Pipeline Options

```bash
node scripts/build-pipeline.mjs [options]

Options:
  --platforms <list>    Comma-separated list (web,macos)
  --no-incremental      Disable incremental builds
  --skip-tests          Skip running tests
  --help                Show help message
```

### Package Configuration

**Swift Packages:**

```swift
// platforms/apple/swift/ChatUIFoundation/Package.swift
// swift-tools-version: 5.9
// Version: 0.0.0  // Synchronized by build pipeline

let package = Package(
    name: "ChatUIFoundation",
    platforms: [
        .iOS(.v15),
        .macOS(.v13)
    ],
    // ...
)
```

**npm Packages:**

```json
{
  "name": "@chatui/ui",
  "version": "0.0.0", // Synchronized by build pipeline
  "scripts": {
    "build": "tsc && vite build"
  }
}
```

## Troubleshooting

### Symptom: Swift builds fail but web builds succeed

Cause: Xcode toolchain not selected or missing.
Fix: Open Xcode → Settings → Locations and select Xcode 15+ for Command Line Tools.

### Symptom: Token validation fails after edits

Cause: Tokens were not regenerated.
Fix:

```bash
pnpm generate:tokens
pnpm validate:tokens
```

## Token Consistency

### CSS to Swift Mapping

CSS uses explicit light/dark tokens:

```css
--foundation-text-light-primary: #000000;
--foundation-text-dark-primary: #ffffff;
```

Swift uses semantic tokens with light/dark variants:

```swift
// Asset Catalog: foundation-text-primary.colorset
// - Light appearance: #000000
// - Dark appearance: #ffffff

FColor.textPrimary  // Automatically adapts to color scheme
```

### Validation Rules

1. **Semantic Mapping**: CSS light/dark pairs map to single Swift colorset
2. **Structure Validation**: Each colorset must have light and dark variants
3. **Component Validation**: All RGBA components must be present
4. **Warnings**: Missing tokens are warnings (non-blocking) to allow incremental implementation

## Troubleshooting

### agvtool Warnings

```
⚠️  Could not update Swift version: agvtool requires Xcode
```

**Solution:** This is expected without Xcode. The pipeline falls back to updating Package.swift comments, which works fine.

### Token Validation Warnings

```
⚠️  CSS semantic token 'foundation-bg-1' not found in Swift Asset Catalog
```

**Solution:** This indicates tokens not yet implemented in Swift. Warnings are non-blocking to allow incremental implementation.

### Build Cache Issues

If incremental builds aren't detecting changes:

```bash
# Clear build cache
rm -rf .build-cache/

# Force clean build
pnpm build:clean
```

### Swift Build Failures

```bash
# Test Swift packages individually
pnpm test:swift:foundation
pnpm test:swift:components

# Clean Swift build artifacts
rm -rf platforms/apple/swift/*/.build/
```

## Performance

**Typical Build Times:**

- **Incremental (no changes)**: ~0.5s
- **Incremental (token changes)**: ~2s
- **Incremental (single package)**: ~5s
- **Clean build (web)**: ~30s
- **Clean build (macos)**: ~45s
- **Full build (both platforms)**: ~60s

**Optimization Tips:**

1. Use incremental builds during development
2. Run platform-specific builds when possible
3. Skip tests during rapid iteration
4. Use `--skip-tests` flag for faster builds

## Future Enhancements

- [ ] Parallel package builds
- [ ] Build caching with content hashing
- [ ] Distributed build support
- [ ] Build performance metrics
- [ ] Automatic version bumping
- [ ] Release automation integration

## Related Documentation

- [Token Generation](../packages/tokens/README.md)
- [Swift Package Structure](../platforms/apple/swift/README.md)
- [CI/CD Workflow](../.github/workflows/ci.yml)
- [Version Synchronization](./VERSION_SYNC.md)

## Risks and assumptions

- Assumptions: TBD (confirm)
- Failure modes and blast radius: TBD (confirm)
- Rollback or recovery guidance: TBD (confirm)
