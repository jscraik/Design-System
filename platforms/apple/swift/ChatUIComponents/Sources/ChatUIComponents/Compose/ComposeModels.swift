import SwiftUI

/// Configuration for task sections in the compose view.
public struct TaskSectionConfig {
    /// Section title text.
    let label: String
    /// Placeholder text for the text area.
    let placeholder: String
    /// Help text shown in the popover.
    let helpText: String
    /// Button title for the action.
    let buttonText: String
}

/// Prompt enhancement modes for the compose view.
public enum PromptEnhancement: String, CaseIterable {
    case rewrite
    case augment
    case preserve

    /// Display title for the prompt enhancement mode.
    public var title: String {
        switch self {
        case .rewrite:
            return "Rewrite"
        case .augment:
            return "Augment"
        case .preserve:
            return "Preserve"
        }
    }

    /// Task section configuration for the selected mode.
    public var taskConfig: TaskSectionConfig {
        switch self {
        case .rewrite:
            return TaskSectionConfig(
                label: "Task Description",
                placeholder: "Describe your task here...\n\nExample: \"Add a dark mode toggle to the settings page with system, light, and dark options. Store the preference and apply it app-wide.\"",
                helpText: "Describe your task here.\n\nThe agent will:\n- Analyze your codebase\n- Select relevant files\n- Write detailed instructions above\n\nThis is your primary input in Rewrite mode.",
                buttonText: "Rewrite"
            )
        case .augment:
            return TaskSectionConfig(
                label: "Additional Context (Optional)",
                placeholder: "Add extra details to help the agent find relevant files and enhance your prompt",
                helpText: "Add extra context to help the agent.\n\nThe agent will:\n- Keep your existing instructions\n- Add relevant context from discoveries\n- Select appropriate files\n\nLeave empty to just enhance with file context.",
                buttonText: "Augment"
            )
        case .preserve:
            return TaskSectionConfig(
                label: "Discovery Hints (Optional)",
                placeholder: "Describe what files to look for (your instructions won't be modified)",
                helpText: "Provide hints for file discovery.\n\nThe agent will:\n- Only select relevant files\n- Leave your instructions unchanged\n\nUseful when you've already written detailed instructions.",
                buttonText: "Preserve"
            )
        }
    }
}
