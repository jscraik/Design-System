# Xcode Project Integration Guide

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


## Issue: ChatUIComponents module not found

If you see the error:

```
Unable to find module dependency: 'ChatUIComponents'
```

This means the Xcode project is missing local package references for the modular Swift packages.

## Solution: add local package dependencies

The ChatUIPlayground app and other macOS targets use local packages from the `platforms/apple/swift/` directory. If Xcode cannot resolve a module, add the local package paths manually.

### Steps to Fix

1. **Open the Xcode project**:

   ```bash
   open platforms/apple/apps/macos/ChatUIPlayground/ChatUIPlayground.xcodeproj
   ```

2. **Add local package dependencies**:
   - Select the project in the navigator (ChatUIPlayground)
   - Select the ChatUIPlayground target
   - Go to "General" tab
   - Scroll to "Frameworks, Libraries, and Embedded Content"
   - Click the "+" button
   - Click "Add Other..." → "Add Package Dependency..."
   - Click "Add Local..." button
   - Navigate to `platforms/apple/swift/ChatUIComponents/` and select it
   - Click "Add Package"
   - Select "ChatUIComponents" from the products list
   - Click "Add Package"

3. **Repeat for other packages** (if needed):
   - `platforms/apple/swift/ChatUIFoundation/`
   - `platforms/apple/swift/ChatUIThemes/`
   - `platforms/apple/swift/ChatUIShellChatGPT/`

4. **Alternative: use Swift Package Manager directly**:

   Create a `Package.swift` file in the playground app directory:

   ```swift
   // swift-tools-version: 5.9
   import PackageDescription

   let package = Package(
       name: "ChatUIPlayground",
       platforms: [
           .macOS(.v13)
       ],
       dependencies: [
           .package(path: "../../../swift/ChatUIFoundation"),
           .package(path: "../../../swift/ChatUIComponents"),
           .package(path: "../../../swift/ChatUIThemes"),
           .package(path: "../../../swift/ChatUIShellChatGPT")
       ],
       targets: [
           .executableTarget(
               name: "ChatUIPlayground",
               dependencies: [
                   .product(name: "ChatUIFoundation", package: "ChatUIFoundation"),
                   .product(name: "ChatUIComponents", package: "ChatUIComponents"),
                   .product(name: "ChatUIThemes", package: "ChatUIThemes"),
                   .product(name: "ChatUIShellChatGPT", package: "ChatUIShellChatGPT")
               ]
           )
       ]
   )
   ```

## Why this happened

Xcode caches package metadata per workspace. If you opened the project before the local package references were added, the build can still resolve to stale state until packages are re-added.

## Verification After Fix

Once the package dependencies are added:

1. Clean build folder: `⇧⌘K` (Shift+Command+K)
2. Build: `⌘B`
3. Run: `⌘R`
4. Navigate to "Settings" in the sidebar
5. You should see the settings example rendering with the latest primitives

## Related Files

- **SettingsExampleView Source**: `platforms/apple/swift/ChatUIComponents/Sources/ChatUIComponents/SettingsExampleView.swift`
- **Playground Integration**: `platforms/apple/apps/macos/ChatUIPlayground/ChatUIPlayground/ComponentGallery.swift`
- **Package Definition**: `platforms/apple/swift/ChatUIComponents/Package.swift`

## Risks and assumptions
- Assumptions: TBD (confirm)
- Failure modes and blast radius: TBD (confirm)
- Rollback or recovery guidance: TBD (confirm)

## Verify
- TBD: Add concrete verification steps and expected results.

## Troubleshooting
- TBD: Add the top 3 failure modes and fixes.

