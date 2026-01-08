# visionOS Support Guide

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


Complete guide for visionOS support and future platform considerations in ChatUI Swift packages.

## Table of Contents

1. [Overview](#overview)
2. [Current Support](#current-support)
3. [Platform Detection](#platform-detection)
4. [visionOS-Specific Features](#visionos-specific-features)
5. [Migration Path](#migration-path)
6. [Best Practices](#best-practices)
7. [Future Platforms](#future-platforms)

## Overview

ChatUI Swift packages are designed with future platform support in mind. While initially focused on iOS and macOS, the architecture supports visionOS and future Apple platforms through modular design and platform detection utilities.

### Design Principles

1. **Platform-Agnostic Core**: Foundation and Components layers work across all platforms
2. **Platform-Specific Enhancements**: Shell and integration layers provide platform-optimized experiences
3. **Graceful Degradation**: Features degrade gracefully on platforms that don't support them
4. **Future-Proof Architecture**: Easy to add new platform-specific features

### Platform Support Matrix

| Package            | iOS 15+ | macOS 13+ | visionOS 1+ | Future Platforms |
| ------------------ | ------- | --------- | ----------- | ---------------- |
| ChatUIFoundation   | ✅      | ✅        | ✅          | ✅               |
| ChatUIThemes       | ✅      | ✅        | ✅          | ✅               |
| ChatUIComponents   | ✅      | ✅        | ✅          | ✅               |
| ChatUIShellChatGPT | ✅      | ✅        | ✅          | ✅               |

## Current Support

### Deployment Targets

All packages support visionOS 1.0+:

```swift
// Package.swift
platforms: [
    .iOS(.v15),
    .macOS(.v13),
    .visionOS(.v1)
]
```

### Tested Features

**ChatUIFoundation:**

- ✅ FColor semantic colors
- ✅ FType typography
- ✅ FSpacing constants
- ✅ Platform detection (Platform.isVisionOS)
- ✅ Accessibility helpers

**ChatUIComponents:**

- ✅ Settings primitives (Row, Toggle, Dropdown, Card, Divider)
- ✅ Button components
- ✅ Input components
- ⚠️ Platform-specific interactions (needs visionOS testing)

**ChatUIShellChatGPT:**

- ✅ AppShellView (NavigationSplitView-based)
- ✅ RoundedAppContainer
- ⚠️ VisualEffectView (fallback to Material)

### Known Limitations

1. **No visionOS Hardware Testing**: Packages built for visionOS but not tested on actual hardware
2. **Interaction Patterns**: visionOS-specific gestures and interactions not yet optimized
3. **Spatial Layout**: No spatial layout features yet (windows, volumes, spaces)
4. **Eye Tracking**: No eye tracking integration
5. **Hand Gestures**: Standard SwiftUI gestures only

## Platform Detection

### Using Platform Utilities

```swift
import ChatUIFoundation

struct MyView: View {
    var body: some View {
        VStack {
            Text("Hello")
        }
        .if(Platform.isVisionOS) { view in
            view
                .glassBackgroundEffect()
                .padding(FSpacing.s32)
        }
    }
}
```

### Platform-Specific Code

```swift
#if os(visionOS)
import RealityKit

struct VisionOSSpecificView: View {
    var body: some View {
        // visionOS-specific implementation
    }
}
#else
struct VisionOSSpecificView: View {
    var body: some View {
        // Fallback for other platforms
    }
}
#endif
```

### Runtime Detection

```swift
if Platform.isVisionOS {
    // visionOS-specific behavior
} else if Platform.isMac {
    // macOS-specific behavior
} else {
    // iOS-specific behavior
}
```

## visionOS-Specific Features

### Glass Background Effect

**Available in visionOS 1.0+:**

```swift
import SwiftUI

struct GlassCard: View {
    var body: some View {
        VStack {
            Text("Content")
        }
        .padding(FSpacing.s24)
        .background(.regularMaterial)
        .glassBackgroundEffect()
        .clipShape(RoundedRectangle(cornerRadius: ChatGPTTheme.cardCornerRadius))
    }
}
```

### Ornaments

**Window ornaments for visionOS:**

```swift
struct MyApp: View {
    var body: some View {
        ContentView()
            .ornament(attachmentAnchor: .scene(.bottom)) {
                HStack {
                    Button("Action 1") { }
                    Button("Action 2") { }
                }
                .padding()
                .glassBackgroundEffect()
            }
    }
}
```

### Immersive Spaces

**Full immersion for visionOS:**

```swift
@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }

        ImmersiveSpace(id: "immersive") {
            ImmersiveView()
        }
    }
}
```

### Spatial Layout

**3D window positioning:**

```swift
WindowGroup {
    ContentView()
}
.defaultSize(width: 800, height: 600, depth: 400)
.windowStyle(.volumetric)
```

## Migration Path

### Phase 1: Basic Compatibility (Current)

**Status:** ✅ Complete

- All packages compile for visionOS
- Platform detection utilities available
- Graceful fallbacks for platform-specific features

**What Works:**

- All foundation tokens
- All components render correctly
- Basic interactions work
- Light/dark mode support

**What's Missing:**

- visionOS-specific optimizations
- Spatial layout features
- Eye tracking integration
- Hand gesture optimization

### Phase 2: visionOS Optimization (Planned)

**Timeline:** When visionOS hardware available

**Goals:**

1. Test on actual visionOS hardware
2. Optimize interaction patterns for spatial computing
3. Add visionOS-specific enhancements
4. Update Component Gallery for visionOS

**Tasks:**

- [ ] Test all components on visionOS hardware
- [ ] Optimize hover effects for eye tracking
- [ ] Add spatial layout examples
- [ ] Implement ornament patterns
- [ ] Add immersive space examples
- [ ] Update documentation with visionOS patterns

### Phase 3: Advanced visionOS Features (Future)

**Timeline:** After Phase 2 complete

**Goals:**

1. Full spatial computing support
2. RealityKit integration
3. Advanced hand gestures
4. Eye tracking optimization

**Tasks:**

- [ ] Add RealityKit components
- [ ] Implement spatial navigation
- [ ] Optimize for eye tracking
- [ ] Add hand gesture recognizers
- [ ] Create visionOS-specific shell layouts

## Best Practices

### Writing Platform-Agnostic Code

**Do:**

```swift
// Use semantic tokens
Text("Hello")
    .font(FType.title())
    .foregroundStyle(FColor.textPrimary)

// Use platform detection
.if(Platform.isVisionOS) { view in
    view.glassBackgroundEffect()
}
```

**Don't:**

```swift
// Don't hardcode platform-specific values
Text("Hello")
    .font(.system(size: 16))
    .foregroundColor(.black)

// Don't assume platform features
.glassBackgroundEffect() // Crashes on iOS/macOS
```

### Graceful Degradation

```swift
struct AdaptiveCard: View {
    var body: some View {
        VStack {
            Text("Content")
        }
        .padding(FSpacing.s24)
        .background(cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: ChatGPTTheme.cardCornerRadius))
    }

    @ViewBuilder
    private var cardBackground: some View {
        if Platform.isVisionOS {
            Color.clear
                .background(.regularMaterial)
                .glassBackgroundEffect()
        } else {
            FColor.bgCard
        }
    }
}
```

### Testing Across Platforms

```swift
#Preview("iOS") {
    MyView()
}

#Preview("macOS") {
    MyView()
        .frame(width: 800, height: 600)
}

#Preview("visionOS") {
    MyView()
        .glassBackgroundEffect()
}
```

### Platform-Specific Enhancements

```swift
extension View {
    @ViewBuilder
    func platformOptimized() -> some View {
        if Platform.isVisionOS {
            self
                .glassBackgroundEffect()
                .padding(FSpacing.s32)
        } else if Platform.isMac {
            self
                .background(VisualEffectView(material: .sidebar))
        } else {
            self
                .background(FColor.bgCard)
        }
    }
}
```

## Future Platforms

### Extensibility Architecture

The ChatUI architecture is designed to support future Apple platforms:

**Foundation Layer:**

- Platform-agnostic tokens
- Semantic color API
- Typography system
- Spacing constants

**Platform Layer:**

- Platform detection utilities
- Platform-specific helpers
- Graceful fallbacks

**Component Layer:**

- Platform-agnostic components
- Platform-specific variants
- Adaptive layouts

### Adding New Platform Support

**Step 1: Update Deployment Targets**

```swift
// Package.swift
platforms: [
    .iOS(.v15),
    .macOS(.v13),
    .visionOS(.v1),
    .newPlatform(.v1) // Future platform
]
```

**Step 2: Add Platform Detection**

```swift
// Platform.swift
public enum Platform {
    public static var isNewPlatform: Bool {
        #if os(newPlatform)
        true
        #else
        false
        #endif
    }
}
```

**Step 3: Add Platform-Specific Features**

```swift
extension View {
    @ViewBuilder
    func newPlatformOptimized() -> some View {
        if Platform.isNewPlatform {
            self
                .newPlatformSpecificModifier()
        } else {
            self
        }
    }
}
```

**Step 4: Test and Document**

- Test on new platform
- Update documentation
- Add examples to Component Gallery
- Update parity checklist

### Anticipated Platforms

**watchOS:**

- Smaller screen sizes
- Limited interaction patterns
- Simplified components
- Complications support

**tvOS:**

- Focus-based navigation
- Remote control input
- Large screen optimization
- Living room viewing distance

**CarPlay:**

- Driving-optimized UI
- Voice control
- Limited interaction
- Safety-first design

## visionOS-Specific Patterns

### Spatial Windows

```swift
@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .defaultSize(width: 800, height: 600)

        WindowGroup(id: "settings") {
            SettingsView()
        }
        .defaultSize(width: 400, height: 600)
    }
}
```

### Glass Materials

```swift
struct GlassCard: View {
    var body: some View {
        SettingsCardView {
            // Content
        }
        .background(.regularMaterial)
        .glassBackgroundEffect()
    }
}
```

### Depth and Layering

```swift
struct LayeredView: View {
    var body: some View {
        ZStack {
            BackgroundLayer()
                .offset(z: -100)

            ContentLayer()

            ForegroundLayer()
                .offset(z: 100)
        }
    }
}
```

### Eye Tracking Optimization

```swift
struct EyeTrackableButton: View {
    @State private var isHovered = false

    var body: some View {
        Button("Action") {
            // Action
        }
        .hoverEffect()
        .scaleEffect(isHovered ? 1.05 : 1.0)
        .onHover { isHovered = $0 }
    }
}
```

## Testing visionOS Support

### Simulator Testing

```bash
# Build for visionOS simulator
cd platforms/apple/swift/ChatUIComponents
swift build --destination 'platform=visionOS Simulator,name=Apple Vision Pro'
```

### Xcode Testing

1. Select visionOS simulator
2. Build and run (`⌘R`)
3. Test interactions
4. Verify layouts
5. Check performance

### Manual Testing Checklist

- [ ] All components render correctly
- [ ] Colors match light/dark mode
- [ ] Typography scales appropriately
- [ ] Spacing is consistent
- [ ] Interactions work as expected
- [ ] Glass effects render properly
- [ ] Performance is acceptable
- [ ] Accessibility features work

## Resources

- [visionOS Documentation](https://developer.apple.com/visionos/)
- [Spatial Computing Guide](https://developer.apple.com/design/human-interface-guidelines/spatial-computing)
- [RealityKit Documentation](https://developer.apple.com/documentation/realitykit)
- [SwiftUI for visionOS](https://developer.apple.com/documentation/swiftui/bringing-your-app-to-visionos)

## Next Steps

1. **Test on visionOS Simulator**: Build and run on simulator
2. **Plan visionOS Optimizations**: Identify platform-specific enhancements
3. **Wait for Hardware**: Test on actual visionOS device when available
4. **Implement Optimizations**: Add visionOS-specific features
5. **Update Documentation**: Document visionOS patterns and best practices

## Support

For visionOS support questions:

- Check Apple's visionOS documentation
- Review platform detection utilities
- File issues on repository for bugs
- Share learnings with community

## License

See repository root for license information.
