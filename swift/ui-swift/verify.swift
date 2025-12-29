#!/usr/bin/env swift

import Foundation

// Simple verification script to check that the package structure is correct
print("🔍 Verifying ChatUISwift package structure...")

let fileManager = FileManager.default
let currentPath = fileManager.currentDirectoryPath

// Check required files exist
let requiredFiles = [
    "Package.swift",
    "Sources/ChatUISwift/DesignTokens.swift",
    "Sources/ChatUISwift/Components/ChatUIButton.swift",
    "Sources/ChatUISwift/Components/ChatUIInput.swift",
    "Sources/ChatUISwift/Components/ChatUICard.swift",
    "Sources/ChatUISwift/ChatUISwift.swift",
    "Tests/ChatUISwiftTests/ChatUISwiftTests.swift",
    "README.md"
]

var allFilesExist = true

for file in requiredFiles {
    let filePath = "\(currentPath)/\(file)"
    if fileManager.fileExists(atPath: filePath) {
        print("✅ \(file)")
    } else {
        print("❌ \(file) - MISSING")
        allFilesExist = false
    }
}

if allFilesExist {
    print("\n🎉 All required files are present!")
    print("📦 ChatUISwift package structure is complete")
    print("🚀 Ready for Xcode development")
} else {
    print("\n⚠️  Some files are missing")
    exit(1)
}

// Check playground app structure
print("\n🔍 Verifying playground app structure...")

let playgroundPath = "../../apps/macos/ChatUIPlayground"
let playgroundFiles = [
    "ChatUIPlayground.xcodeproj/project.pbxproj",
    "ChatUIPlayground/ChatUIPlaygroundApp.swift",
    "ChatUIPlayground/ContentView.swift",
    "ChatUIPlayground/ComponentGallery.swift",
    "ChatUIPlayground/PreviewScenarios.swift"
]

var allPlaygroundFilesExist = true

for file in playgroundFiles {
    let filePath = "\(currentPath)/\(playgroundPath)/\(file)"
    if fileManager.fileExists(atPath: filePath) {
        print("✅ \(file)")
    } else {
        print("❌ \(file) - MISSING")
        allPlaygroundFilesExist = false
    }
}

if allPlaygroundFilesExist {
    print("\n🎉 Playground app structure is complete!")
    print("📱 Ready to open in Xcode")
} else {
    print("\n⚠️  Some playground files are missing")
}

print("\n📋 Next steps:")
print("1. Open ChatUIPlayground.xcodeproj in Xcode")
print("2. Build and run the playground app (⌘R)")
print("3. Browse components in the sidebar")
print("4. Use SwiftUI previews for component development")
print("5. Add the local Swift package to other Xcode projects")

print("\n✨ Task 1 implementation complete!")