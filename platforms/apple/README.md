# Apple Platform

SwiftUI and macOS/iOS platform surfaces live under `platforms/apple/`. This area contains the Swift packages that mirror the React UI library plus the macOS apps used for validation and demos.

## Structure
- `apps/macos/` — macOS apps (ComponentGallery, ChatUIPlayground, ChatUIApp)
- `swift/` — Swift packages (Foundation, Themes, Components, Shell, System Integration, MCP)

## Quick start (macOS)
1. Open the primary dev app: `platforms/apple/apps/macos/ComponentGallery/Package.swift`
2. Run Swift tests from any package, e.g. `cd platforms/apple/swift/ChatUIFoundation && swift test`

## Key docs
- `platforms/apple/apps/macos/SETUP_GUIDE.md` — macOS setup + Xcode workflow
- `platforms/apple/apps/macos/README.md` — macOS app overview
- `platforms/apple/swift/README.md` — Swift package map + entry points
- `platforms/apple/swift/DEVELOPMENT_WORKFLOW.md` — local workflows + hot reload
- `platforms/apple/swift/ADOPTION_GUIDE.md` — integration guidance
- `platforms/apple/swift/ACCESSIBILITY_TESTING.md` — Apple accessibility checks
