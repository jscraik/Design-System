# ChatUISystemIntegration

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Overview and essential workflows for this area
- Non-scope: Deep API reference or internal design rationale
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


Native macOS and iOS system integration package providing file system access, notifications, sharing, Spotlight search, and app lifecycle management.

## Table of contents

- [Prerequisites](#prerequisites)
- [Quickstart](#quickstart)
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Platform support](#platform-support)
- [Verify](#verify)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Xcode 15+
- Swift 5.9
- macOS 13+ / iOS 15+

## Quickstart

```swift
import ChatUISystemIntegration

let notificationManager = NotificationManager()
_ = try await notificationManager.requestPermission()
```

## Overview

ChatUISystemIntegration provides a comprehensive set of managers for integrating with native macOS and iOS system features. This package handles platform-specific APIs and provides a unified interface for common system integration tasks.

## Features

- **File System Access**: Security-scoped file access with permission handling
- **Notifications**: Local and scheduled notifications using UserNotifications framework
- **Share Sheet**: Native sharing integration for content export
- **Spotlight Search**: Index and search chat history using Core Spotlight
- **App Lifecycle**: State persistence and restoration for seamless user experience

## Installation

### Swift Package Manager

Add ChatUISystemIntegration to your `Package.swift`:

```swift
dependencies: [
    .package(path: "../ChatUISystemIntegration")
]
```

Or add it as a dependency in Xcode:

1. File → Add Package Dependencies
2. Enter the package path
3. Select ChatUISystemIntegration

## Usage

### File System Manager

Handle file system access with proper permission management:

```swift
import ChatUISystemIntegration

let fileManager = FileSystemManager()

// Request file access (macOS)
let urls = try await fileManager.requestFileAccess(
    allowedFileTypes: ["txt", "pdf"],
    allowsMultipleSelection: true
)

// Create security-scoped bookmark for persistent access
let bookmark = try fileManager.createBookmark(for: urls[0])

// Later, resolve bookmark and access file
let url = try fileManager.resolveBookmark(bookmark)
let didStart = fileManager.startAccessingSecurityScopedResource(url)

// Read file
let data = try await fileManager.readFile(at: url)

// Stop accessing when done
fileManager.stopAccessingSecurityScopedResource(url)

// Write file
try await fileManager.writeFile(data: data, to: url)
```

### Notification Manager

Send local and scheduled notifications:

```swift
import ChatUISystemIntegration

let notificationManager = NotificationManager()

// Request permission
let granted = try await notificationManager.requestPermission()

// Send immediate notification
try await notificationManager.sendNotification(
    title: "New Message",
    body: "You have a new chat message",
    category: .message,
    userInfo: ["chatId": "123"],
    badge: 1
)

// Schedule notification
let futureDate = Date().addingTimeInterval(3600) // 1 hour from now
try await notificationManager.scheduleNotification(
    title: "Reminder",
    body: "Don't forget to check your messages",
    date: futureDate,
    category: .update
)

// Manage notifications
let pending = await notificationManager.getPendingNotifications()
notificationManager.removeAllPendingNotifications()
notificationManager.clearBadge()
```

### Share Manager

Share content using native share sheets:

```swift
import ChatUISystemIntegration

let shareManager = ShareManager()

// Share text (macOS)
try await shareManager.shareText("Check out this message!", from: view)

// Share URL
let url = URL(string: "https://example.com")!
try await shareManager.shareURL(url, from: view)

// Share file
let fileURL = URL(fileURLWithPath: "/path/to/file.pdf")
try await shareManager.shareFile(at: fileURL, from: view)

// Create and export chat transcript
let messages = [
    ChatMessage(id: "1", sender: "Alice", content: "Hello!", timestamp: Date()),
    ChatMessage(id: "2", sender: "Bob", content: "Hi there!", timestamp: Date())
]

let transcript = shareManager.createChatTranscript(messages: messages)
let exportURL = FileManager.default.temporaryDirectory.appendingPathComponent("chat.txt")
try await shareManager.exportChatHistory(messages: messages, to: exportURL)
```

### Spotlight Manager

Index chat messages for Spotlight search:

```swift
import ChatUISystemIntegration

let spotlightManager = SpotlightManager()

// Index a single message
let message = ChatMessage(
    id: "msg-1",
    sender: "Alice",
    content: "Let's discuss the project timeline",
    timestamp: Date()
)
try await spotlightManager.indexChatMessage(message)

// Index multiple messages
let messages = [message1, message2, message3]
try await spotlightManager.indexChatMessages(messages)

// Search for messages
let results = try await spotlightManager.searchChatMessages(
    query: "project",
    limit: 20
)

// Remove messages from index
try await spotlightManager.removeChatMessage(withId: "msg-1")
try await spotlightManager.removeAllChatMessages()
```

### App Lifecycle Manager

Manage app state persistence and restoration:

```swift
import ChatUISystemIntegration

let lifecycleManager = AppLifecycleManager()

// Save application state
struct AppState: Codable {
    let selectedChatId: String
    let scrollPosition: Double
    let preferences: [String: String]
}

let state = AppState(
    selectedChatId: "chat-123",
    scrollPosition: 450.0,
    preferences: ["theme": "dark"]
)

try await lifecycleManager.saveState(state, forKey: "app_state")

// Restore state on app launch
if let restored = try await lifecycleManager.restoreState(
    forKey: "app_state",
    as: AppState.self
) {
    // Apply restored state
    print("Restored chat: \(restored.selectedChatId)")
}

// Save chat session
let session = ChatSession(
    id: "session-1",
    title: "Project Discussion",
    messages: messages,
    created: Date(),
    lastModified: Date()
)

try await lifecycleManager.saveChatSession(session)

// Get all sessions
let sessions = try await lifecycleManager.getAllChatSessions()

// Observe lifecycle events
NotificationCenter.default.addObserver(
    forName: .appWillTerminate,
    object: nil,
    queue: .main
) { _ in
    // Save state before termination
}
```

## Platform Support

- **macOS 13.0+**: Full feature support including security-scoped bookmarks and NSOpenPanel
- **iOS 15.0+**: Full feature support with UIActivityViewController for sharing

## Architecture

### File System Manager

- Security-scoped bookmarks for persistent file access
- Native file picker integration (NSOpenPanel on macOS)
- Proper permission handling and error reporting

### Notification Manager

- UserNotifications framework integration
- Support for immediate and scheduled notifications
- Custom notification categories with actions
- Badge management

### Share Manager

- Platform-specific sharing (NSSharingService on macOS, UIActivityViewController on iOS)
- Chat transcript generation and export
- Support for text, URLs, images, and files

### Spotlight Manager

- Core Spotlight integration for searchable content
- Automatic keyword extraction
- Domain-based organization (com.chatui.messages)
- Batch indexing and removal

### App Lifecycle Manager

- JSON-based state persistence
- Type-safe state restoration
- Chat session management
- Window state restoration (macOS)
- Lifecycle event notifications

## Error Handling

All managers provide comprehensive error handling with localized error descriptions:

```swift
do {
    try await fileManager.readFile(at: url)
} catch let error as FileSystemManager.FileSystemError {
    switch error {
    case .permissionDenied:
        print("Permission denied")
    case .fileNotFound:
        print("File not found")
    case .readFailed(let underlyingError):
        print("Read failed: \(underlyingError)")
    default:
        print("Error: \(error.localizedDescription)")
    }
}
```

## Testing

The package includes comprehensive unit tests for all managers:

```bash
# Run all tests
swift test

# Run specific test
swift test --filter FileSystemManagerTests

# Run with verbose output
swift test --verbose
```

## Verify

- Build: `cd platforms/apple/swift/ChatUISystemIntegration && swift build`
- Request notifications and confirm the permission prompt appears.

## Troubleshooting

### Symptom: Notifications never appear

Cause: Permission denied.
Fix: Re-enable notifications in System Settings and re-run `requestPermission()`.

### Symptom: Spotlight search returns no results

Cause: Items not indexed or query terms not escaped.
Fix: Call `indexChatMessage` before searching and use simple query terms.

## Requirements

- Swift 5.9+
- macOS 13.0+ or iOS 15.0+
- Xcode 15.0+

## Integration with Production Apps

This package is designed to be integrated into production macOS applications:

```swift
import SwiftUI
import ChatUISystemIntegration

@main
struct ChatApp: App {
    @StateObject private var lifecycleManager = AppLifecycleManager()
    @StateObject private var notificationManager = NotificationManager()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(lifecycleManager)
                .environmentObject(notificationManager)
                .task {
                    // Request notification permissions on launch
                    _ = try? await notificationManager.requestPermission()

                    // Restore app state
                    if let state = try? await lifecycleManager.restoreState(
                        forKey: "app_state",
                        as: AppState.self
                    ) {
                        // Apply restored state
                    }
                }
        }
    }
}
```

## License

MIT License - See LICENSE file for details

## Related Packages

- **ChatUIFoundation**: Design tokens and platform utilities
- **ChatUIComponents**: Reusable SwiftUI components
- **ChatUIThemes**: Theme presets and styling
- **ChatUIMCP**: MCP tool integration

## Contributing

Contributions are welcome! Please ensure:

- All tests pass
- New features include unit tests
- Code follows Swift style guidelines
- Documentation is updated

## Support

For issues and questions:

- Check the test files for usage examples
- Review the inline documentation
- Open an issue on the repository
