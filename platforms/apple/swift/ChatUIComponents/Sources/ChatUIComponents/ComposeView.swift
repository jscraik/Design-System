import SwiftUI
import ChatUIFoundation
import ChatUIThemes

/// Renders the Compose experience layout.
///
/// ### Discussion
/// This view showcases prompt instructions, prompt builder, and configuration controls.
///
/// - Example:
/// ```swift
/// ComposeView()
/// ```
public struct ComposeView: View {
    @Environment(\.chatUITheme) private var theme
    @Environment(\.colorScheme) private var scheme

    @State private var instructions = ""
    @State private var isWebSearchActive = false
    @State private var systemMessage = ""
    @State private var taskDescription = ""
    @State private var promptEnhancement: PromptEnhancement = .rewrite
    @State private var autoPlan = false
    @State private var showTaskHelp = false
    @State private var modelSelection = "ChatGPT 5.2 Pro"
    @State private var planMode = "Manual"

    /// Creates a compose view.
    public init() {}

    /// The content and behavior of this view.
    public var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: FSpacing.s16) {
                SettingsCardView {
                    VStack(spacing: 0) {
                        TemplateHeaderBarView(
                            title: "Prompt Instructions",
                            leading: AnyView(
                                ComposeIconButton(systemName: "doc.on.doc", label: "Copy to clipboard") {}
                            ),
                            trailing: AnyView(
                                ComposeActionButton(
                                    title: "Send to Chat",
                                    systemName: "bubble.left",
                                    style: .secondary
                                ) {}
                            )
                        )

                        ComposeTextArea(
                            text: $instructions,
                            placeholder: "Enter your prompt's task specific instructions. Use {{template variables}} for dynamic inputs",
                            minHeight: 180,
                            accessibilityLabel: "Prompt instructions"
                        )

                        TemplateFooterBarView(
                            leading: AnyView(
                                HStack(spacing: FSpacing.s4) {
                                    ComposeIconButton(systemName: "plus", label: "Add") {}

                                    ComposeIconButton(
                                        systemName: isWebSearchActive ? "globe" : "globe",
                                        label: "Toggle web search",
                                        isActive: isWebSearchActive
                                    ) {
                                        isWebSearchActive.toggle()
                                    }

                                    ComposeIconButton(systemName: "link", label: "Link") {}
                                    ComposeIconButton(systemName: "arrow.clockwise", label: "Refresh") {}

                                    ComposeIconButton(systemName: "square.grid.2x2", label: "Apps") {}

                                    Text(modelSelection)
                                        .font(FType.caption())
                                        .foregroundStyle(FColor.accentBlue)
                                        .padding(.vertical, 2)
                                        .padding(.horizontal, FSpacing.s8)
                                        .background(FColor.bgCardAlt)
                                        .clipShape(RoundedRectangle(cornerRadius: theme.pillCornerRadius))
                                }
                            ),
                            trailing: AnyView(
                                HStack(spacing: FSpacing.s8) {
                                    ComposeActionButton(
                                        title: "Auto-clear",
                                        systemName: "arrow.clockwise",
                                        style: .ghost
                                    ) {}

                                    ComposeIconButton(systemName: "mic", label: "Voice") {}

                                    Button {
                                    } label: {
                                        Image(systemName: "arrow.up")
                                            .font(.system(size: 12, weight: .bold))
                                            .foregroundStyle(FColor.textPrimary)
                                            .frame(width: 24, height: 24)
                                            .background(FColor.accentGreen)
                                            .clipShape(Circle())
                                    }
                                    .buttonStyle(.plain)
                                    .accessibilityLabel(Text("Send message"))
                                }
                            )
                        )
                    }
                }

                SettingsDivider()

                SettingsCardView {
                    VStack(spacing: 0) {
                        TemplateHeaderBarView(
                            title: "Prompt Builder",
                            trailing: AnyView(
                                ComposeActionButton(
                                    title: "Run Discovery",
                                    systemName: "play.circle",
                                    style: .secondary
                                ) {}
                            )
                        )

                        VStack(alignment: .leading, spacing: FSpacing.s16) {
                            HStack(alignment: .top, spacing: FSpacing.s16) {
                                TemplateFormFieldView(label: "Model") {
                                    ComposeMenu(
                                        title: modelSelection,
                                        options: ["ChatGPT 5.2 Pro", "GPT-5.2 Codex Medium", "GPT-5.2 Codex Large"],
                                        selection: $modelSelection
                                    )
                                }
                                .frame(maxWidth: 320)

                                TemplateFormFieldView(label: "System Message") {
                                    ComposeTextArea(
                                        text: $systemMessage,
                                        placeholder: "Describe desired modal behavior (tone, tool usage, response style)",
                                        minHeight: 68,
                                        accessibilityLabel: "System message"
                                    )
                                }
                            }

                            TemplateFieldGroupView(
                                label: taskConfig.label,
                                actions: AnyView(
                                    HStack(spacing: FSpacing.s8) {
                                        Button {
                                            showTaskHelp.toggle()
                                        } label: {
                                            Image(systemName: "info.circle")
                                                .font(.system(size: 14, weight: .semibold))
                                                .foregroundStyle(FColor.iconSecondary)
                                        }
                                        .buttonStyle(.plain)
                                        .accessibilityLabel(Text("Show task information"))
                                        .popover(isPresented: $showTaskHelp) {
                                            TaskHelpView(content: taskConfig.helpText)
                                        }

                                        ComposeIconButton(
                                            systemName: "xmark",
                                            label: "Clear task"
                                        ) {
                                            taskDescription = ""
                                        }
                                    }
                                )
                            ) {
                                HStack(alignment: .top, spacing: FSpacing.s12) {
                                    ComposeTextArea(
                                        text: $taskDescription,
                                        placeholder: taskConfig.placeholder,
                                        minHeight: 120,
                                        accessibilityLabel: taskConfig.label
                                    )

                                    VStack(alignment: .leading, spacing: FSpacing.s8) {
                                        ComposeActionButton(
                                            title: taskConfig.buttonText,
                                            systemName: "sparkles",
                                            style: .secondary
                                        ) {}
                                        .accessibilityLabel(Text("Run discovery: \(taskConfig.buttonText)"))

                                        Text("60k")
                                            .font(FType.caption())
                                            .padding(.vertical, 2)
                                            .padding(.horizontal, FSpacing.s8)
                                            .background(FColor.accentGreen.opacity(0.2))
                                            .clipShape(RoundedRectangle(cornerRadius: theme.buttonCornerRadius))
                                    }
                                }
                            }

                            SettingsDivider()

                            HStack(alignment: .center, spacing: FSpacing.s16) {
                                VStack(alignment: .leading, spacing: 2) {
                                    Text("Prompt Enhancement")
                                        .font(FType.sectionTitle())
                                    Text("How to handle your instructions")
                                        .font(FType.caption())
                                        .foregroundStyle(FColor.textSecondary)
                                }

                                Picker("Prompt Enhancement", selection: $promptEnhancement) {
                                    ForEach(PromptEnhancement.allCases, id: \.self) { option in
                                        Text(option.rawValue.capitalized).tag(option)
                                    }
                                }
                                .pickerStyle(.segmented)
                                .frame(maxWidth: 280)

                                Spacer()

                                HStack(spacing: FSpacing.s8) {
                                    Text("Plan mode")
                                        .font(FType.caption())
                                        .foregroundStyle(FColor.textSecondary)

                                    ComposeMenu(
                                        title: planMode,
                                        options: ["Manual", "Auto"],
                                        selection: $planMode
                                    )
                                }

                                Toggle("Auto plan", isOn: $autoPlan)
                                    .labelsHidden()
                                    .toggleStyle(FoundationSwitchStyle())

                                Text(autoPlan ? "On" : "Off")
                                    .font(FType.caption())
                                    .foregroundStyle(FColor.textSecondary)
                            }
                        }
                        .padding(.all, FSpacing.s24)
                    }
                }
            }
            .padding(.all, FSpacing.s24)
        }
        .background(FColor.bgApp)
    }

    private var taskConfig: TaskSectionConfig {
        promptEnhancement.taskConfig
    }
}

#if DEBUG
/// Previews for ComposeView
@available(macOS 14.0, *)
struct ComposeView_Previews: PreviewProvider {
    static var previews: some View {
        ComposeView()
            .chatUITheme(.chatgpt)
            .frame(width: 800, height: 1000)
            .previewDisplayName("Compose View")
    }
}
#endif
