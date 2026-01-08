# ChatUI - Native macOS Application

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Overview and essential workflows for this area
- Non-scope: Deep API reference or internal design rationale
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


A production-ready native macOS application built with SwiftUI, demonstrating the complete ChatUI component library and MCP tool integration.

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Dependencies](#dependencies)
- [Building](#building)
- [Configuration](#configuration)
- [Usage](#usage)
- [Keyboard shortcuts](#keyboard-shortcuts)
- [State persistence](#state-persistence)
- [MCP integration](#mcp-integration)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Production deployment](#production-deployment)
- [Related documentation](#related-documentation)

## Overview

ChatUI is a native macOS application that showcases:

- **Complete SwiftUI Component Library**: Uses all four ChatUI Swift packages (Foundation, Components, Themes, Shell)
- **MCP Tool Integration**: Connects to MCP servers for tool execution and widget rendering
- **Native macOS Features**: File system access, notifications, Spotlight search, state persistence
- **ChatGPT-Style UI**: Pixel-perfect implementation of ChatGPT design patterns
- **Production Architecture**: Proper app lifecycle, error handling, and state management

## Features

### Chat Interface

- Real-time messaging with MCP tool integration
- Widget rendering for rich content display
- Message history with user/assistant distinction
- Processing indicators and error handling

### Tools Browser

- Browse available MCP tools by category
- View tool descriptions and capabilities
- Quick access to tool documentation

### Settings Panel

- MCP server configuration
- Appearance customization (theme style)
- Component demo controls (dark mode, accent colors, language) for reusable UI previews
- Notification preferences (permission-based)
- Data management

### Native Integration

- **File System**: Security-scoped bookmarks for persistent file access
- **Notifications**: UserNotifications framework with custom categories
- **Spotlight**: Core Spotlight integration for searchable chat history
- **State Persistence**: Automatic save/restore of app state
- **Share Sheet**: Native sharing for chat transcripts

## Architecture

```
ChatUIApp/
├── Sources/
│   ├── ChatUIApp.swift          # App entry point with menu bar integration
│   ├── AppState.swift            # Observable app state management
│   ├── ContentView.swift         # Main app shell using AppShellView
│   ├── ChatView.swift            # Chat interface with MCP integration
│   ├── ToolsView.swift           # MCP tools browser
│   └── SettingsView.swift        # Settings panel with primitives
├── Bundle/Info.plist             # App bundle configuration
├── Bundle/ChatUIApp.entitlements # Sandbox entitlements for signing
├── Package.swift                 # Swift Package Manager manifest
└── README.md                     # This file
```

## Dependencies

The application depends on all ChatUI Swift packages:

- **ChatUIFoundation**: Semantic tokens, typography, spacing, platform utilities
- **ChatUIComponents**: Reusable SwiftUI primitives (settings, buttons, inputs)
- **ChatUIThemes**: ChatGPT theme constants and styling
- **ChatUIShellChatGPT**: AppShellView and shell layouts
- **ChatUIMCP**: MCP client, widget renderer, authentication
- **ChatUISystemIntegration**: File system, notifications, Spotlight, lifecycle

## Building

### Prerequisites

- macOS 13.0 or later
- Xcode 15.0 or later
- Swift 5.9 or later

### Build from Command Line

```bash
# Navigate to the app directory
cd platforms/apple/apps/macos/ChatUIApp

# Build the application
swift build

# Run the application
swift run
```

### Build in Xcode

1. Open `Package.swift` in Xcode
2. Select the ChatUIApp scheme
3. Build and run (⌘R)

### Verify

- App launches and shows Chat/Tools/Settings.
- Settings → General updates MCP server URL without errors.
- Tools list loads when MCP server is running.

## Configuration

### MCP Server URL

Configure the MCP server URL in Settings:

1. Open Settings (⌘,)
2. Navigate to General → MCP Server URL
3. Enter your MCP server URL (default: `http://localhost:8787`)

### Appearance

Customize the app appearance:

- **Theme Style**: Switch between ChatGPT and Default styling in Settings → Appearance
- **Component Demo**: Preview-only controls in Settings → Component Demo

## Usage

### Starting a Chat

1. Navigate to the Chat section (⌘N for new chat)
2. Type a message in the input field
3. Press Enter or click the send button
4. The app will call MCP tools and display responses

### Browsing Tools

1. Navigate to the Tools section (⌘T)
2. Browse available tools by category
3. Click on a tool to view details

### Managing Settings

1. Open Settings (⌘,)
2. Configure MCP server, appearance, and preferences
3. Changes are saved automatically

## Keyboard Shortcuts

- **⌘N**: New Chat
- **⌘T**: Open Tools
- **⌘,**: Open Settings
- **⌘Q**: Quit Application

## State Persistence

The application automatically saves and restores:

- Selected section (Chat, Tools, Settings)
- MCP server URL
- Theme style

State is stored in `~/Library/Application Support/ChatUI/`

## MCP Integration

### Supported Tool Patterns

- **Display Tools**: `display_chat`, `display_table`, `display_dashboard`
- **Widget Tools**: Render widgets using native SwiftUI components
- **Authentication**: Secure token storage in macOS Keychain
- **Error Handling**: Graceful degradation with user-friendly messages

### Widget Rendering

Widgets are rendered using native SwiftUI components styled with ChatUIFoundation tokens:

- **Card Widgets**: SettingsCardView with custom content
- **List Widgets**: SettingRowView for each item
- **Chart Widgets**: Rendered as list-style rows (no Swift Charts integration yet)
- **Custom Widgets**: Flexible rendering system

## Development

### Adding New Views

1. Create a new Swift file in `Sources/`
2. Import required ChatUI packages
3. Use ChatUIFoundation tokens (FColor, FType, FSpacing)
4. Follow ChatUITheme tokens for styling
5. Add SwiftUI previews for development

### Extending MCP Integration

1. Add new tool handlers in `ChatView.swift`
2. Implement widget rendering in `WidgetRenderer`
3. Update tool categories in `ToolsView.swift`
4. Test with MCP server at `platforms/mcp/`

## Troubleshooting

### Build Errors

**Issue**: Package dependencies not found
**Solution**: Ensure all Swift packages are built first:

```bash
cd platforms/apple/swift/ChatUIFoundation && swift build
cd platforms/apple/swift/ChatUIComponents && swift build
cd platforms/apple/swift/ChatUIThemes && swift build
cd platforms/apple/swift/ChatUIShellChatGPT && swift build
cd platforms/apple/swift/ChatUIMCP && swift build
cd platforms/apple/swift/ChatUISystemIntegration && swift build
```

**Issue**: Asset Catalog not found
**Solution**: Verify ChatUIFoundation has `Resources/Colors.xcassets/`

### Runtime Errors

**Issue**: MCP connection failed
**Solution**: Verify MCP server is running at configured URL

**Issue**: Widgets not rendering
**Solution**: Check MCP response format matches `WidgetData` structure

## Production Deployment

### App Bundle

To create a distributable app bundle:

1. Build in Release mode: `swift build -c release`
2. Create app bundle structure
3. Copy executable to `ChatUI.app/Contents/MacOS/`
4. Copy Info.plist (`platforms/apple/apps/macos/ChatUIApp/Bundle/Info.plist`) to `ChatUI.app/Contents/`
5. Add app icon to `ChatUI.app/Contents/Resources/`
6. Include entitlements file (`platforms/apple/apps/macos/ChatUIApp/Bundle/ChatUIApp.entitlements`) for sandboxed signing

### Code Signing

For distribution outside the Mac App Store:

```bash
codesign --deep --force --verify --verbose \
  --entitlements platforms/apple/apps/macos/ChatUIApp/Bundle/ChatUIApp.entitlements \
  --sign "Developer ID Application: Your Name" \
  ChatUI.app
```

### Notarization

Submit to Apple for notarization:

```bash
xcrun notarytool submit ChatUI.app.zip \
  --apple-id your@email.com \
  --team-id TEAMID \
  --password app-specific-password
```

## Requirements Satisfied

This application satisfies the following requirements from the Native macOS Bridge specification:

- **5.1**: AppShellView with NavigationSplitView layout
- **5.2**: Settings panel using ChatUIComponents primitives
- **7.1**: MCP tool integration with native macOS features

## Related Documentation

- [ChatUI Foundation README](../../../swift/ChatUIFoundation/README.md)
- [ChatUI Components README](../../../swift/ChatUIComponents/README.md)
- [ChatUI Themes README](../../../swift/ChatUIThemes/README.md)
- [MCP Integration Guide](../../../swift/ChatUIMCP/README.md)
- [System Integration Guide](../../../swift/ChatUISystemIntegration/README.md)
- [Adoption Guide](../../../swift/ADOPTION_GUIDE.md)
- [Development Workflow](../../../swift/DEVELOPMENT_WORKFLOW.md)

## License

Copyright © 2024 ChatUI. All rights reserved.
