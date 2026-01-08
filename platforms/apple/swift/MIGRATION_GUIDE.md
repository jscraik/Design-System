# SwiftUI Migration Guide

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (beginner to intermediate)
- Scope: Task-focused instructions for this topic
- Non-scope: Comprehensive architecture reference
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


Complete guide for teams adopting ChatUI SwiftUI components incrementally.

## Table of Contents

1. [Overview](#overview)
2. [Migration Strategy](#migration-strategy)
3. [Team Organization](#team-organization)
4. [Phase 1: Foundation Setup](#phase-1-foundation-setup)
5. [Phase 2: Component Adoption](#phase-2-component-adoption)
6. [Phase 3: Full Integration](#phase-3-full-integration)
7. [Common Challenges](#common-challenges)
8. [Success Metrics](#success-metrics)

## Overview

This guide helps teams migrate from React-only development to a hybrid React + SwiftUI approach, enabling native iOS, macOS, and visionOS applications while maintaining existing web applications.

### Migration Principles

1. **Incremental Adoption**: Start small, expand gradually
2. **Zero Breaking Changes**: Existing React apps remain unaffected
3. **Parallel Development**: Teams can work on React and SwiftUI simultaneously
4. **Shared Design System**: Design tokens bridge both platforms
5. **Clear Ownership**: Establish boundaries between web and native teams

### Timeline

- **Phase 1** (1-2 weeks): Foundation setup and team training
- **Phase 2** (4-8 weeks): Component adoption and feature development
- **Phase 3** (Ongoing): Full integration and optimization

## Migration Strategy

### Assessment Phase

Before starting migration, assess your current state:

**Questions to Answer:**

1. Do you have existing React components using the ChatUI design system?
2. Do you need native iOS, macOS, or visionOS applications?
3. What features require native platform integration?
4. What's your team's Swift/SwiftUI experience level?
5. What's your timeline for native app delivery?

**Decision Matrix:**

| Scenario                     | Recommendation                                      |
| ---------------------------- | --------------------------------------------------- |
| Web-only, no native plans    | Stay with React                                     |
| Need native apps, small team | Start with ChatUIShellChatGPT for rapid development |
| Need native apps, large team | Full modular adoption with parallel teams           |
| Existing native app          | Integrate ChatUI packages incrementally             |
| Prototype/MVP                | Use ChatUIShellChatGPT for speed                    |

### Migration Paths

#### Path A: Greenfield Native App

**Best for:** New native applications with no existing codebase

**Steps:**

1. Install all four ChatUI packages
2. Use ChatUIShellChatGPT for rapid layout
3. Build features with ChatUIComponents
4. Customize as needed

**Timeline:** 2-4 weeks to first release

#### Path B: Existing Native App Integration

**Best for:** Teams with existing SwiftUI/UIKit applications

**Steps:**

1. Install ChatUIFoundation first
2. Gradually replace hardcoded colors with FColor
3. Add ChatUIComponents for new features
4. Refactor existing components to use ChatUI tokens

**Timeline:** 4-8 weeks for full integration

#### Path C: React + Native Hybrid

**Best for:** Teams maintaining both web and native applications

**Steps:**

1. Establish shared design token system
2. Build React components for web
3. Build SwiftUI components for native
4. Maintain parity through checklist
5. Share learnings between teams

**Timeline:** Ongoing parallel development

## Team Organization

### Roles and Responsibilities

**Design System Team:**

- Maintains design tokens (CSS + Swift)
- Ensures parity between React and SwiftUI
- Reviews component implementations
- Updates documentation

**Web Team:**

- Builds and maintains React components
- Implements web-specific features
- Ensures accessibility compliance
- Manages web deployment

**Native Team:**

- Builds and maintains SwiftUI components
- Implements platform-specific features
- Ensures native platform compliance
- Manages App Store deployment

**Shared Responsibilities:**

- Component parity reviews
- Design token updates
- Documentation updates
- Cross-platform testing

### Communication Channels

**Weekly Sync:**

- Design token changes
- New component additions
- Parity issues
- Platform-specific challenges

**Async Communication:**

- Slack/Teams channel for quick questions
- GitHub issues for bugs and features
- Pull request reviews for code changes
- Documentation updates for learnings

## Phase 1: Foundation Setup

### Week 1: Environment Setup

**Day 1-2: Install Dependencies**

1. Clone repository
2. Install Xcode 15.0+
3. Install Swift Package Manager dependencies
4. Verify builds:

   ```bash
   cd platforms/apple/swift/ChatUIFoundation && swift build
   cd platforms/apple/swift/ChatUIThemes && swift build
   cd platforms/apple/swift/ChatUIComponents && swift build
   cd platforms/apple/swift/ChatUIShellChatGPT && swift build
   ```

**Day 3-4: Team Training**

1. SwiftUI basics workshop (if needed)
2. ChatUI architecture overview
3. Asset Catalog walkthrough
4. Component Gallery demonstration
5. Hot reload workflow training

**Day 5: First Component**

1. Create simple view using ChatUIFoundation
2. Use FColor, FType, FSpacing
3. Test light/dark mode switching
4. Review with team

**Deliverable:** Team comfortable with ChatUI basics

### Week 2: Token Integration

**Day 1-2: Token Setup**

1. Run token generator: `pnpm generate:tokens`
2. Verify Asset Catalog created
3. Test token hot reload workflow
4. Document any issues

**Day 3-4: Component Exploration**

1. Run Component Gallery app
2. Explore all components
3. Test on different platforms (iOS, macOS)
4. Identify components needed for first feature

**Day 5: Planning**

1. Select first feature to build
2. Identify required components
3. Create implementation plan
4. Assign tasks to team members

**Deliverable:** Clear plan for Phase 2

## Phase 2: Component Adoption

### Weeks 3-4: Settings Interface

**Goal:** Build complete settings interface using ChatUI components

**Tasks:**

1. **Create Settings View Structure**

   ```swift
   struct SettingsView: View {
       var body: some View {
           ScrollView {
               VStack(alignment: .leading, spacing: FSpacing.s24) {
                   // Sections will go here
               }
               .padding(FSpacing.s24)
           }
           .background(FColor.bgApp)
       }
   }
   ```

2. **Add First Settings Card**

   ```swift
   SettingsCardView {
       VStack(spacing: 0) {
           SettingToggleView(
               title: "Notifications",
               isOn: $notificationsEnabled
           )
       }
   }
   ```

3. **Add Multiple Rows with Dividers**

   ```swift
   SettingsCardView {
       VStack(spacing: 0) {
           SettingToggleView(title: "Setting 1", isOn: $setting1)
           SettingsDivider()
           SettingToggleView(title: "Setting 2", isOn: $setting2)
           SettingsDivider()
           SettingDropdownView(
               title: "Language",
               options: languages,
               selection: $selectedLanguage
           )
       }
   }
   ```

4. **Test on All Platforms**
   - iOS: Touch interactions
   - macOS: Hover effects
   - Light/dark mode
   - Accessibility (VoiceOver)

**Deliverable:** Complete settings interface matching React version

### Weeks 5-6: Navigation and Layout

**Goal:** Implement app shell with navigation

**Tasks:**

1. **Add AppShellView**

   ```swift
   AppShellView {
       // Sidebar
       MySidebarView()
   } detail: {
       // Detail
       MyDetailView()
   }
   ```

2. **Implement Sidebar Navigation**

   ```swift
   VStack(alignment: .leading, spacing: 16) {
       ForEach(navigationItems) { item in
           ListItemView(
               icon: AnyView(item.icon),
               title: item.title,
               isSelected: selectedItem == item.id
           ) {
               selectedItem = item.id
           }
       }
   }
   ```

3. **Add Detail Views**
   - Settings view (from weeks 3-4)
   - Dashboard view
   - Profile view

4. **Test Navigation Flow**
   - Sidebar selection
   - Detail view updates
   - State persistence

**Deliverable:** Complete app shell with navigation

### Weeks 7-8: Feature Development

**Goal:** Build first complete feature using ChatUI components

**Tasks:**

1. **Select Feature**
   - Choose feature that showcases components
   - Ensure it has React equivalent for comparison

2. **Implement Feature**
   - Use ChatUIComponents exclusively
   - Follow established patterns
   - Add platform-specific enhancements

3. **Add Tests**
   - Unit tests for business logic
   - SwiftUI Preview variants
   - Accessibility testing

4. **Review Parity**
   - Compare with React version
   - Document differences
   - Update parity checklist

**Deliverable:** Complete feature with tests and documentation

## Phase 3: Full Integration

### Ongoing: Expand Component Library

**Tasks:**

1. **Identify Missing Components**
   - Review parity checklist
   - Prioritize based on feature needs
   - Create implementation plan

2. **Implement New Components**
   - Follow established patterns
   - Use ChatUIFoundation tokens
   - Add to Component Gallery

3. **Maintain Parity**
   - Update parity checklist
   - Document behavioral differences
   - Share learnings with React team

### Ongoing: Platform-Specific Features

**Tasks:**

1. **macOS Integration**
   - Menu bar integration
   - Keyboard shortcuts
   - Window management
   - File system access

2. **iOS Integration**
   - Safe area handling
   - Gesture navigation
   - Share sheet integration
   - Notifications

3. **visionOS Preparation**
   - Glass background effects
   - Spatial layout considerations
   - Platform detection

### Ongoing: Optimization

**Tasks:**

1. **Performance**
   - Profile app performance
   - Optimize heavy views
   - Reduce memory usage

2. **Accessibility**
   - VoiceOver testing
   - Keyboard navigation
   - High contrast support
   - Dynamic type support

3. **Testing**
   - Expand unit test coverage
   - Add integration tests
   - Visual regression testing

## Common Challenges

### Challenge 1: State Management Differences

**Problem:** React uses props + useState, SwiftUI uses @State + @Binding

**Solution:**

React:

```tsx
function MyComponent({ value, onChange }) {
  return <Toggle checked={value} onChange={onChange} />;
}
```

SwiftUI:

```swift
struct MyComponent: View {
    @Binding var value: Bool

    var body: some View {
        Toggle("", isOn: $value)
    }
}
```

**Pattern:** Use `@Binding` for two-way data flow

### Challenge 2: Conditional Rendering

**Problem:** SwiftUI requires @ViewBuilder context

**Solution:**

Create helper extension:

```swift
extension View {
    @ViewBuilder
    func `if`<Content: View>(
        _ condition: Bool,
        transform: (Self) -> Content
    ) -> some View {
        if condition {
            transform(self)
        } else {
            self
        }
    }
}
```

Usage:

```swift
Text("Hello")
    .if(Platform.isMac) { view in
        view.onHover { isHovering = $0 }
    }
```

### Challenge 3: Platform Detection

**Problem:** Need different behavior on iOS vs macOS

**Solution:**

Use `Platform` helpers:

```swift
.if(Platform.isMac) { view in
    view.onHover { isHovering = $0 }
}
.if(Platform.isIOS) { view in
    view.simultaneousGesture(
        DragGesture(minimumDistance: 0)
            .onChanged { _ in isPressed = true }
    )
}
```

### Challenge 4: Asset Catalog Not Found

**Problem:** Colors not loading from Asset Catalog

**Solution:**

1. Check Package.swift includes resources:

   ```swift
   .target(
       name: "ChatUIFoundation",
       resources: [.process("Resources")]
   )
   ```

2. Use `.module` bundle:

   ```swift
   Color("foundation-text-primary", bundle: .module)
   ```

3. Or use `FColor` API (recommended):

   ```swift
   FColor.textPrimary
   ```

### Challenge 5: SwiftUI Previews Not Working

**Problem:** Previews show "Cannot preview in this file"

**Solution:**

1. Open package directly in Xcode:

   ```bash
   cd platforms/apple/swift/ChatUIComponents
   open Package.swift
   ```

2. Ensure deployment target is correct (macOS 13.0+)

3. Clean build folder and rebuild

## Success Metrics

### Phase 1 Success Criteria

- ✅ All team members can build and run ChatUI packages
- ✅ Token hot reload workflow working
- ✅ First simple view created using ChatUIFoundation
- ✅ Team comfortable with SwiftUI basics

### Phase 2 Success Criteria

- ✅ Complete settings interface built
- ✅ App shell with navigation implemented
- ✅ First feature complete and tested
- ✅ Parity checklist updated

### Phase 3 Success Criteria

- ✅ Multiple features built with ChatUI components
- ✅ Platform-specific integrations working
- ✅ Performance meets targets
- ✅ Accessibility compliance achieved
- ✅ Team velocity stable

### Ongoing Metrics

**Development Velocity:**

- Time to implement new features
- Component reuse rate
- Bug fix time

**Quality Metrics:**

- Test coverage percentage
- Accessibility compliance score
- Performance benchmarks

**Team Metrics:**

- Developer satisfaction
- Onboarding time for new team members
- Cross-platform parity percentage

## Best Practices

### Do's

✅ Start with small, low-risk features
✅ Maintain parity checklist
✅ Share learnings between React and SwiftUI teams
✅ Use Component Gallery for visual comparison
✅ Document platform-specific differences
✅ Test on all target platforms regularly
✅ Keep design tokens in sync

### Don'ts

❌ Don't try to migrate everything at once
❌ Don't skip team training
❌ Don't ignore parity differences
❌ Don't hardcode colors or spacing
❌ Don't skip accessibility testing
❌ Don't forget to update documentation

## Next Steps

1. **Complete Phase 1**: Set up environment and train team
2. **Start Phase 2**: Build first feature with ChatUI components
3. **Review Progress**: Weekly check-ins on migration progress
4. **Expand Gradually**: Add more components and features
5. **Optimize**: Improve performance and accessibility
6. **Share Learnings**: Update documentation with discoveries

## Support

For migration support:

- Review adoption guide for detailed usage examples
- Check parity checklist for component comparison
- Explore Component Gallery for live examples
- File issues on repository for bugs or questions

## License

See repository root for license information.

## Risks and assumptions
- Assumptions: TBD (confirm)
- Failure modes and blast radius: TBD (confirm)
- Rollback or recovery guidance: TBD (confirm)

## Verify
- TBD: Add concrete verification steps and expected results.

## Troubleshooting
- TBD: Add the top 3 failure modes and fixes.

