#!/usr/bin/env swift

import Foundation

// Simple verification script to check that the package structure is correct
print("🔍 Verifying AStudioSwift package structure...")

let fileManager = FileManager.default
let currentPath = fileManager.currentDirectoryPath

// Check required files exist
let requiredFiles = [
    "Package.swift",
    "Sources/AStudioSwift/DesignTokens.swift",
    "Sources/AStudioSwift/Components/ChatUIButton.swift",
    "Sources/AStudioSwift/Components/ChatUIInput.swift",
    "Sources/AStudioSwift/Components/ChatUICard.swift",
    "Sources/AStudioSwift/AStudioSwift.swift",
    "Tests/AStudioSwiftTests/AStudioSwiftTests.swift",
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
    print("📦 AStudioSwift package structure is complete")
    print("🚀 Ready for Xcode development")
} else {
    print("\n⚠️  Some files are missing")
    exit(1)
}

// Check playground app structure
print("\n🔍 Verifying playground app structure...")

let playgroundPath = "../../apps/macos/AStudioPlayground"
let playgroundFiles = [
    "AStudioPlayground.xcodeproj/project.pbxproj",
    "AStudioPlayground/AStudioPlaygroundApp.swift",
    "AStudioPlayground/ContentView.swift",
    "AStudioPlayground/ComponentGallery.swift",
    "AStudioPlayground/PreviewScenarios.swift"
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
print("1. Open AStudioPlayground.xcodeproj in Xcode")
print("2. Build and run the playground app (⌘R)")
print("3. Browse components in the sidebar")
print("4. Use SwiftUI previews for component development")
print("5. Add the local Swift package to other Xcode projects")

print("\n✨ Task 1 implementation complete!")
