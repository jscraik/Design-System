/// Reusable SwiftUI primitives that mirror React component APIs.

import SwiftUI
import ChatUIFoundation
import ChatUIThemes

/// Package overview:
/// - Settings primitives: SettingsDivider, SettingsCardView, SettingRowView, SettingToggleView, SettingDropdownView
/// - Navigation primitives: ListItemView for sidebar navigation with selection state
/// - Input primitives: InputView, TextareaView, SelectView for form inputs
/// - Button primitives: ChatUIButton with multiple variants and sizes
/// - Data display: BadgeView, AvatarView, SkeletonView
/// - Feedback: AlertView, ToastView, ModalDialogView
/// - Data tables: ChatUITableView (macOS-friendly)
/// - Tooltips: chatUITooltip (macOS uses .help)
/// - Chat layout primitives: ChatShell + ChatVariantSplitSidebar/Compact/ContextRail
/// - FoundationSwitchStyle: Custom toggle style matching ChatGPT design
/// - All components consume semantic tokens from ChatUIFoundation exclusively
