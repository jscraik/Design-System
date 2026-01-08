# FEATURE_DESIGN: ComposeView Parity (SwiftUI + AppKit + Widget)

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Contents

- [Doc requirements](#doc-requirements)
- [0) Summary](#0-summary)
- [1) User journeys](#1-user-journeys)
  - [1.1 Happy path](#11-happy-path)
  - [1.2 Failure/edge paths](#12-failureedge-paths)
- [2) Information architecture + navigation](#2-information-architecture-navigation)
- [3) Screens and states (token-referenced)](#3-screens-and-states-token-referenced)
- [4) Interaction patterns](#4-interaction-patterns)
- [5) Responsive/adaptive behavior](#5-responsiveadaptive-behavior)
- [6) Motion](#6-motion)
- [7) Accessibility map (WCAG 2.2 AA + Apple AX)](#7-accessibility-map-wcag-22-aa-apple-ax)
  - [7.1 Semantics and labels](#71-semantics-and-labels)
  - [7.2 Focus order](#72-focus-order)
  - [7.3 Keyboard + shortcuts](#73-keyboard-shortcuts)
  - [7.4 Contrast + accommodations](#74-contrast-accommodations)
- [8) Acceptance criteria](#8-acceptance-criteria)
- [9) Implementation guide](#9-implementation-guide)
  - [9.1 React (Apps SDK widget)](#91-react-apps-sdk-widget)
  - [9.2 SwiftUI](#92-swiftui)
  - [9.3 AppKit](#93-appkit)
- [10) Test plan (step-by-step)](#10-test-plan-step-by-step)
- [Apps SDK widget (React + Apps SDK UI)](#apps-sdk-widget-react-apps-sdk-ui)
- [SwiftUI (macOS)](#swiftui-macos)
- [AppKit (macOS parity)](#appkit-macos-parity)


## 0) Summary

- Goal: Match the existing web `ComposeView` UI in macOS SwiftUI and AppKit, plus a widget-friendly version (Apps SDK UI) that preserves structure, tokens, and accessibility.
- Primary users: macOS power users + widget users who need a compact version of the Compose workflow.
- Critical path (<=7 steps): Open Compose -> edit Prompt Instructions -> optionally toggle Web/Tools -> set Model + System Message -> enter Task Description -> Run Discovery/Rewrite -> confirm status.
- Non-goals: Pro Edit modal parity, Discovery settings modal parity (unless requested), backend/tool wiring.

Assumptions: Widget uses inline summary + CTA and fullscreen for full Compose; macOS uses full two-card layout and optional sidebar if hosted inside the app shell.

## 1) User journeys

### 1.1 Happy path

1. Open Compose screen.
2. Enter prompt instructions.
3. Toggle Web/Tools if needed.
4. Select model.
5. Enter system message.
6. Enter task description.
7. Run discovery / rewrite / augment.

### 1.2 Failure/edge paths

- Case A: No tool output / models -> show empty state with disabled Run button and hint text.
- Case B: Tool call fails/offline -> show inline error banner, keep drafts, allow retry.

## 2) Information architecture + navigation

- Entry points: existing Compose view in app; widget entry via widget list.
- Navigation model: macOS uses NavigationSplitView host (if app shell), content area uses stacked cards.
- Back/escape behavior (widget + iOS + macOS): Escape clears focus from editors; widget inline offers "Open Fullscreen" for editing.

## 3) Screens and states (token-referenced)

Screen: Compose (macOS full)

- Layout: full-width scroll, two cards stacked (Prompt Instructions + Prompt Builder).
- Components used:
  - Web: ComposeView (existing)
  - SwiftUI: ComposeViewSwiftUI, SettingsCardView, ChatUIButton, Toggle
  - Widget: ComposeWidgetView (inline + fullscreen mode)
- States:
  - Default: both cards visible.
  - Loading: skeleton placeholders in card bodies.
  - Empty: disable primary actions; show hint text.
  - Error/Offline: banner at top, retry button; drafts preserved.
  - Permission-denied: inline callout, disable actions.
- Error prevention: validate required fields before Run.
- Feedback timing: pressed state within 100ms.

Screen: Widget Inline

- Layout: Prompt Instructions card only + CTA "Open Fullscreen".
- Avoid nested scroll; use minimal height.
- Primary actions: 1 max in inline.

Screen: Widget Fullscreen

- Layout: full Compose layout matching web.

## 4) Interaction patterns

- Inputs + validation: persistent labels, helper text, no placeholder-only labels.
- Primary/secondary actions: primary = Run Discovery/Rewrite; secondary = Auto-clear.
- Undo/cancel: Cmd+Z supported; Escape unfocuses.
- Destructive actions: confirm Clear All.

## 5) Responsive/adaptive behavior

- Breakpoints (px): <=900 collapse left-side controls; <=700 single-column.
- Widget displayMode: inline summary; fullscreen for editing.
- iOS size classes: compact width -> stacked fields.
- macOS window resizing: cards expand fluidly; min width 720pt.

## 6) Motion

- Animations: button press, error banner fade (tokenized duration/easing).
- Reduced motion: remove translate/scale; opacity-only.

## 7) Accessibility map (WCAG 2.2 AA + Apple AX)

### 7.1 Semantics and labels

- Prompt Instructions editor: label "Prompt Instructions".
- System Message: label "System Message".
- Task Description: label varies by mode (Rewrite/Augment/Preserve).
- Run button: label "Run Discovery" / "Rewrite".
- Web-only icons: aria-label for tools, web search toggle.
- SwiftUI: .accessibilityLabel for all buttons/fields.

### 7.2 Focus order

State: Default

1. Prompt Instructions title
2. Prompt Instructions editor
3. Toolbar buttons (copy, send)
4. Prompt Builder title
5. Model selector
6. System Message
7. Task Description
8. Run button
9. Enhancement segmented control
10. Plan mode + toggle

State: Error

1. Error banner
2. Retry
3. Then default order

### 7.3 Keyboard + shortcuts

- Tab order: as above; Shift+Tab reverse.
- Activation: Enter/Space on buttons.
- Escape: clear focus from editor.
- Optional: Cmd+Enter triggers Run.

### 7.4 Contrast + accommodations

- Contrast verified for text on card/background.
- Reduce transparency: cards stay opaque.
- Increased contrast: use higher-contrast tokens.
- Dynamic Type: text scales without clipping.

## 8) Acceptance criteria

- Task success >=95% across macOS + widget flows (usability test).
- WCAG 2.2 AA verified (labels, contrast, keyboard).
- Feedback <=100ms on all actions.
- Full keyboard coverage.

## 9) Implementation guide

### 9.1 React (Apps SDK widget)

- Use ComposeWidgetView with inline+fullscreen switch.
- toolOutput read-only; widgetState for drafts.
- requestDisplayMode({ mode: "fullscreen" }) for full edit.

### 9.2 SwiftUI

- Use SettingsCardView + ChatUIButton + FSpacing + FColor.

### 9.3 AppKit

- Use NSHostingController to host SwiftUI for parity.

## 10) Test plan (step-by-step)

- VoiceOver: labels and focus order.
- Switch Control: all actions reachable, no focus traps.
- Dynamic Type: largest sizes without clipping.
- Reduce Motion: no translate/scale.
- Keyboard: all controls reachable; Cmd+Enter works if enabled.
- Contrast: all states.

# TOKEN_REFERENCED_MEASUREMENTS

All values are token-backed (px/rem/pt). Existing tokens used where possible; new tokens noted.

- Card padding: space.24 (FSpacing.s24) = 24px / 1.5rem / 24pt
- Inter-card gap: space.16 (FSpacing.s16) = 16px / 1rem / 16pt
- Field gap: space.12 (FSpacing.s12) = 12px / 0.75rem / 12pt
- Icon size: size.icon.md NEW = 16px / 1rem / 16pt
- Button height: size.button.sm NEW = 28px / 1.75rem / 28pt
- Card radius: theme.cardCornerRadius (ChatGPTTheme=12pt)
- Border width: border.1 NEW = 1px / 0.0625rem / 1pt
- Surfaces: FColor.bgApp, FColor.bgCard, FColor.bgCardAlt
- Text: FColor.textPrimary, FColor.textSecondary, FColor.textTertiary
- Accent: FColor.accentBlue, FColor.accentGreen
- Focus ring: foundation focus ring (web); SwiftUI uses focusable + overlay if needed.

# IMPLEMENTATION_SNIPPETS

## Apps SDK widget (React + Apps SDK UI)

```tsx
import { Button, Card, TextField } from "@openai/apps-sdk-ui";

export function ComposeWidgetView() {
  const toolOutput = window.openai?.toolOutput ?? {};
  const [state, setState] = React.useState(window.openai?.widgetState ?? {});
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const updateState = (next: any) => {
    setState(next);
    window.openai?.setWidgetState(next);
  };

  const openFullscreen = () => window.openai?.requestDisplayMode?.({ mode: "fullscreen" });

  return (
    <div
      className="p-4 text-[var(--foundation-text-dark-primary)]"
      style={{ background: "var(--foundation-bg-dark-1)" }}
      aria-label="Compose Widget"
    >
      <Card className="mb-3" style={{ background: "var(--foundation-bg-dark-2)" }}>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Prompt Instructions</h2>
          <Button size="sm" onClick={openFullscreen} aria-label="Open Fullscreen">
            Open Fullscreen
          </Button>
        </div>
        <TextField
          label="Instructions"
          multiline
          value={state.instructions ?? ""}
          onChange={(v) => updateState({ ...state, instructions: v })}
        />
      </Card>

      <style>{`
        * { transition-duration: ${reduceMotion ? "0.1s" : "0.25s"}; }
      `}</style>
    </div>
  );
}
```

Storybook (CSF)

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { ComposeWidgetView } from "./ComposeWidgetView";

const meta: Meta<typeof ComposeWidgetView> = {
  title: "Widget/Compose",
  component: ComposeWidgetView,
};
export default meta;

export const Default: StoryObj<typeof ComposeWidgetView> = {};
```

## SwiftUI (macOS)

```swift
import SwiftUI
import ChatUIComponents
import ChatUIFoundation

public struct ComposeViewSwiftUI: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var instructions = ""
    @State private var systemMessage = ""
    @State private var taskDescription = ""

    public init() {}

    public var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: FSpacing.s16) {
                SettingsCardView {
                    VStack(alignment: .leading, spacing: FSpacing.s12) {
                        HStack {
                            Text("Prompt Instructions").font(FType.title())
                            Spacer()
                            ChatUIButton(variant: .secondary, size: .sm, accessibilityLabel: "Send to Chat") {
                                Text("Send to Chat")
                            }
                        }
                        LabeledTextEditor(title: "Instructions", text: $instructions)
                    }
                    .padding(.all, FSpacing.s24)
                }

                SettingsCardView {
                    VStack(alignment: .leading, spacing: FSpacing.s12) {
                        HStack {
                            Text("Prompt Builder").font(FType.title())
                            Spacer()
                            ChatUIButton(variant: .secondary, size: .sm, accessibilityLabel: "Run Discovery") {
                                Text("Run Discovery")
                            }
                        }
                        LabeledTextField(title: "Model", text: .constant("ChatGPT 5.2 Pro"), isReadOnly: true)
                        LabeledTextField(title: "System Message", text: $systemMessage)
                        LabeledTextEditor(title: "Task Description", text: $taskDescription)
                    }
                    .padding(.all, FSpacing.s24)
                }
            }
            .padding(.all, FSpacing.s24)
        }
        .background(FColor.bgApp)
        .animation(reduceMotion ? nil : .easeOut(duration: 0.25), value: instructions)
    }
}

private struct LabeledTextField: View {
    let title: String
    @Binding var text: String
    var isReadOnly = false

    var body: some View {
        VStack(alignment: .leading, spacing: FSpacing.s8) {
            Text(title).font(FType.caption()).foregroundColor(FColor.textSecondary)
            TextField("", text: $text)
                .disabled(isReadOnly)
                .textFieldStyle(.plain)
                .padding(.vertical, FSpacing.s8)
                .padding(.horizontal, FSpacing.s12)
                .background(FColor.bgCardAlt)
                .clipShape(RoundedRectangle(cornerRadius: 8))
                .accessibilityLabel(Text(title))
        }
    }
}

private struct LabeledTextEditor: View {
    let title: String
    @Binding var text: String

    var body: some View {
        VStack(alignment: .leading, spacing: FSpacing.s8) {
            Text(title).font(FType.caption()).foregroundColor(FColor.textSecondary)
            TextEditor(text: $text)
                .frame(minHeight: 120)
                .padding(.all, FSpacing.s8)
                .background(FColor.bgCardAlt)
                .clipShape(RoundedRectangle(cornerRadius: 8))
                .accessibilityLabel(Text(title))
        }
    }
}
```

## AppKit (macOS parity)

```swift
import AppKit
import SwiftUI

final class ComposeViewController: NSViewController {
    override func loadView() {
        let root = ComposeViewSwiftUI()
        view = NSHostingView(rootView: root)
    }
}
```

# ACCESSIBILITY_TESTING_STEPS

- VoiceOver: traverse sidebar (if present), cards, and fields; check labels.
- Switch Control: all actions reachable, no focus traps.
- Keyboard: Tab order matches spec; Cmd+Enter runs primary action (if enabled).
- Dynamic Type: verify no clipping at larger sizes.
- Reduce Motion: no translate/scale.
- Reduce Transparency: cards remain opaque.
- Contrast: verify all text + icons in light/dark/high-contrast.

# VALIDATION_CHECKLIST

- Task success >=95% for Compose flow (measured via test plan).
- WCAG 2.2 AA: labels, contrast, keyboard operability.
- Performance: visual feedback <=100ms on presses.
- Keyboard completeness: all controls focusable and operable.
- Contrast validation for default/hover/pressed/disabled states.
- Storybook coverage for widget component states.

# FILE_PLAN

- packages/ui/src/app/chat/ComposeView.tsx (reference: web parity target)
- packages/ui/src/app/chat/ComposeWidgetView.tsx (new widget view)
- platforms/web/apps/web/src/pages/HarnessPage.tsx (add widget entry)
- platforms/web/apps/web/src/widgets/compose-widget/index.html (new widget mount, if using existing widget harness pattern)
- platforms/web/apps/web/src/widgets/compose-widget/main.tsx (widget entry)
- platforms/web/apps/storybook/src/stories/ComposeWidgetView.stories.tsx
- platforms/apple/swift/ChatUIComponents/Sources/ChatUIComponents/ComposeViewSwiftUI.swift
- platforms/apple/swift/ChatUIComponents/Sources/ChatUIComponents/ComposeViewController.swift (AppKit wrapper)
- packages/tokens/src (add size/icon/border tokens if you want strict parity without ad-hoc values)
- platforms/apple/swift/ChatUIFoundation/Sources/ChatUIFoundation/DesignTokens.swift (regenerate for new tokens if added)
