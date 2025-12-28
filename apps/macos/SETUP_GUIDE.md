# ChatUI Playground Setup Guide

This guide will help you create the ChatUIPlayground Xcode project to test the SwiftUI components.

## Quick Setup (Recommended)

### Step 1: Create New Xcode Project

1. Open Xcode
2. Choose "Create a new Xcode project"
3. Select **macOS** → **App**
4. Configure your project:
   - **Product Name**: `ChatUIPlayground`
   - **Interface**: SwiftUI
   - **Language**: Swift
   - **Use Core Data**: Unchecked
   - **Include Tests**: Unchecked
5. Save to: `apps/macos/ChatUIPlayground/`

### Step 2: Add ChatUISwift Package

1. In Xcode, select your project in the navigator
2. Select the **ChatUIPlayground** target
3. Go to **General** tab → **Frameworks, Libraries, and Embedded Content**
4. Click the **+** button
5. Click **Add Package Dependency**
6. Enter the local path: `../../../packages/ui-swift`
7. Click **Add Package**
8. Select **ChatUISwift** and click **Add Package**

### Step 3: Replace Default Files

Replace the contents of the generated files with the provided source code:

#### ContentView.swift

```swift
import SwiftUI
import ChatUISwift

struct ContentView: View {
    @State private var selectedComponent: ComponentType = .button
    
    var body: some View {
        NavigationSplitView {
            // Sidebar with component list
            List(ComponentType.allCases, id: \.self, selection: $selectedComponent) { component in
                Label(component.displayName, systemImage: component.systemImage)
                    .tag(component)
            }
            .navigationTitle("Components")
            .frame(minWidth: 200)
        } detail: {
            // Main content area
            ComponentGallery(selectedComponent: selectedComponent)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(DesignTokens.Colors.Background.primary)
        }
    }
}

enum ComponentType: String, CaseIterable {
    case button = "button"
    case input = "input"
    case card = "card"
    case tokens = "tokens"
    
    var displayName: String {
        switch self {
        case .button:
            return "Button"
        case .input:
            return "Input"
        case .card:
            return "Card"
        case .tokens:
            return "Design Tokens"
        }
    }
    
    var systemImage: String {
        switch self {
        case .button:
            return "button.programmable"
        case .input:
            return "textfield"
        case .card:
            return "rectangle"
        case .tokens:
            return "paintpalette"
        }
    }
}

#Preview {
    ContentView()
        .frame(width: 1000, height: 700)
}
```

#### ChatUIPlaygroundApp.swift

```swift
import SwiftUI
import ChatUISwift

@main
struct ChatUIPlaygroundApp: App {
    
    init() {
        // Initialize the ChatUISwift package
        ChatUISwift.initialize()
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .frame(minWidth: 800, minHeight: 600)
        }
        .windowStyle(.titleBar)
        .windowToolbarStyle(.unified)
    }
}
```

### Step 4: Add Additional Files

Create these new Swift files in your project:

1. **Right-click** on your project → **New File** → **Swift File**
2. Create `ComponentGallery.swift` and `PreviewScenarios.swift`
3. Copy the contents from the `Sources/` directory in this folder

### Step 5: Build and Run

1. Select your target and press **⌘R** to build and run
2. You should see the component gallery with a sidebar
3. Click on different components to see examples

## Alternative: Swift Package Manager (Command Line)

If you prefer command line development:

```bash
cd apps/macos/ChatUIPlayground
swift run
```

Note: This approach has limitations with SwiftUI previews and is better suited for command-line tools.

## Development Workflow

### Using SwiftUI Previews

1. Open any component file in the ChatUISwift package
2. Show Canvas: `⌥⌘⏎` (Option+Command+Enter)
3. Resume previews: `⌥⌘P`
4. Edit components and see live updates

### Using the Playground App

1. Run the playground app: `⌘R`
2. Browse components in the sidebar
3. Interact with live examples
4. Test accessibility features

## Troubleshooting

### Package Not Found

- Ensure the path `../../../packages/ui-swift` is correct relative to your Xcode project
- Try cleaning and rebuilding: `⌘⇧K` then `⌘B`

### Build Errors

- Make sure you're targeting macOS 13.0+
- Check that all files are added to the target
- Verify the ChatUISwift package builds: `cd packages/ui-swift && swift build`

### Previews Not Working

- Resume previews: `⌥⌘P`
- Try restarting Xcode
- Check for compilation errors in the component files

## Next Steps

Once you have the playground running:

1. **Explore Components**: Browse the sidebar to see all available components
2. **Test Accessibility**: Use VoiceOver (⌘F5) to test accessibility
3. **Try Dark Mode**: Switch system appearance to test dark mode
4. **Add New Components**: Create new components in the ChatUISwift package
5. **Use in Your Projects**: Add the ChatUISwift package to your own projects

## File Structure

After setup, your structure should look like:

```
apps/macos/ChatUIPlayground/
├── ChatUIPlayground.xcodeproj/
└── ChatUIPlayground/
    ├── ChatUIPlaygroundApp.swift
    ├── ContentView.swift
    ├── ComponentGallery.swift
    ├── PreviewScenarios.swift
    └── Assets.xcassets/
```

The playground app will reference the ChatUISwift package at `../../../packages/ui-swift`.

## Success Criteria

You'll know the setup is working when:

- ✅ The app builds and runs without errors
- ✅ You see a sidebar with component categories
- ✅ Clicking components shows interactive examples
- ✅ Components use design tokens (consistent colors/spacing)
- ✅ Dark mode works correctly
- ✅ SwiftUI previews work in component files

Happy coding! 🚀
