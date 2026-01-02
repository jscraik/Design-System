//
//  ChatVariantsGallery.swift
//  ComponentGallery
//
//  Created on 30-12-2025.
//

import SwiftUI
import ChatUIFoundation
import ChatUIComponents
import ChatUIThemes

/// Gallery of chat layout variants.
struct ChatVariantsGallery: View {
    @State private var composerText = ""
    @State private var selectedThread: String = "general"

    var body: some View {
        VStack(alignment: .leading, spacing: FSpacing.s24) {
            GallerySection(
                title: "Split Sidebar",
                subtitle: "Desktop-style layout with left navigation"
            ) {
                variantContainer {
                    ChatVariantSplitSidebar(
                        sidebar: { sidebarView },
                        header: { headerView },
                        messages: { messagesView },
                        composer: { composerView }
                    )
                }
            }

            GallerySection(
                title: "Compact",
                subtitle: "Inline widget layout without sidebar"
            ) {
                variantContainer {
                    ChatVariantCompact(
                        header: { headerView },
                        messages: { messagesView },
                        composer: { composerView }
                    )
                }
            }

            GallerySection(
                title: "Context Rail",
                subtitle: "Right-side context panel for tools or references"
            ) {
                variantContainer {
                    ChatVariantContextRail(
                        sidebar: { sidebarView },
                        header: { headerView },
                        messages: { messagesView },
                        composer: { composerView },
                        contextPanel: { contextPanelView }
                    )
                }
            }
        }
    }

    @ViewBuilder
    private func variantContainer<Content: View>(@ViewBuilder content: () -> Content) -> some View {
        content()
            .frame(height: 320)
            .clipShape(RoundedRectangle(cornerRadius: ChatGPTTheme.cardCornerRadius))
            .overlay(
                RoundedRectangle(cornerRadius: ChatGPTTheme.cardCornerRadius)
                    .stroke(FColor.divider.opacity(0.2), lineWidth: 1)
            )
    }

    private var sidebarView: some View {
        VStack(alignment: .leading, spacing: FSpacing.s12) {
            Text("Threads")
                .font(FType.sectionTitle())
                .foregroundStyle(FColor.textPrimary)
                .padding(.horizontal, FSpacing.s12)
                .padding(.top, FSpacing.s12)

            SettingsCardView {
                VStack(spacing: 0) {
                    ListItemView(
                        icon: AnyView(Image(systemName: "bubble.left.and.bubble.right.fill").foregroundStyle(FColor.iconSecondary)),
                        title: "General",
                        isSelected: selectedThread == "general",
                        action: { selectedThread = "general" }
                    )

                    SettingsDivider()

                    ListItemView(
                        icon: AnyView(Image(systemName: "bolt.fill").foregroundStyle(FColor.iconSecondary)),
                        title: "Quick notes",
                        isSelected: selectedThread == "notes",
                        action: { selectedThread = "notes" }
                    )
                }
            }
            .padding(.horizontal, FSpacing.s8)

            Spacer()
        }
        .frame(width: 220)
        .background(FColor.bgApp)
    }

    private var headerView: some View {
        HStack(spacing: FSpacing.s12) {
            Text("Chat")
                .font(FType.title())
                .foregroundStyle(FColor.textPrimary)

            Spacer()

            ChatUIButton(variant: .secondary, size: .sm, accessibilityLabel: "New chat", action: {}) {
                Text("New")
            }

            ChatUIButton(variant: .ghost, size: .icon, accessibilityLabel: "Share", action: {}) {
                Image(systemName: "square.and.arrow.up")
            }
        }
        .padding(.horizontal, FSpacing.s16)
        .padding(.vertical, FSpacing.s12)
        .background(FColor.bgCard)
        .overlay(
            Rectangle()
                .frame(height: 1)
                .foregroundStyle(FColor.divider.opacity(0.2)),
            alignment: .bottom
        )
    }

    private var messagesView: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: FSpacing.s12) {
                ChatBubble(
                    role: .assistant,
                    text: "Here is a composable chat layout with slot-based components."
                )
                ChatBubble(role: .user, text: "Looks consistent across platforms.")
            }
            .padding(FSpacing.s16)
        }
        .background(FColor.bgApp)
    }

    private var composerView: some View {
        HStack(spacing: FSpacing.s12) {
            InputView(text: $composerText, placeholder: "Message", submitLabel: .send) {
                composerText = ""
            }

            ChatUIButton(variant: .default, size: .icon, accessibilityLabel: "Send", action: {}) {
                Image(systemName: "arrow.up")
                    .font(.system(size: 12, weight: .bold))
            }
        }
        .padding(.horizontal, FSpacing.s16)
        .padding(.vertical, FSpacing.s12)
        .background(FColor.bgCard)
        .overlay(
            Rectangle()
                .frame(height: 1)
                .foregroundStyle(FColor.divider.opacity(0.2)),
            alignment: .top
        )
    }

    private var contextPanelView: some View {
        VStack(alignment: .leading, spacing: FSpacing.s12) {
            Text("Context")
                .font(FType.sectionTitle())
                .foregroundStyle(FColor.textPrimary)

            SettingsCardView {
                VStack(alignment: .leading, spacing: FSpacing.s8) {
                    Text("Pinned files")
                        .font(FType.rowTitle())
                        .foregroundStyle(FColor.textPrimary)

                    Text("No items pinned yet.")
                        .font(FType.caption())
                        .foregroundStyle(FColor.textSecondary)
                }
                .padding(FSpacing.s16)
            }
        }
        .padding(FSpacing.s16)
        .frame(width: 240)
        .background(FColor.bgApp)
        .overlay(
            Rectangle()
                .frame(width: 1)
                .foregroundStyle(FColor.divider.opacity(0.2)),
            alignment: .leading
        )
    }
}

private struct ChatBubble: View {
    enum Role {
        case user
        case assistant
    }

    let role: Role
    let text: String

    var body: some View {
        HStack {
            if role == .assistant {
                bubble
                Spacer(minLength: FSpacing.s16)
            } else {
                Spacer(minLength: FSpacing.s16)
                bubble
            }
        }
    }

    private var bubble: some View {
        Text(text)
            .font(FType.rowTitle())
            .foregroundStyle(role == .assistant ? FColor.textPrimary : Color.white)
            .padding(.vertical, FSpacing.s8)
            .padding(.horizontal, FSpacing.s12)
            .background(role == .assistant ? FColor.bgCard : FColor.accentGreen)
            .clipShape(RoundedRectangle(cornerRadius: ChatGPTTheme.rowCornerRadius))
    }
}
