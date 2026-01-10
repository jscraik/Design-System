//
//  DataDisplayGallery.swift
//  ComponentGallery
//
//  Created on 30-12-2025.
//

import SwiftUI
import AStudioFoundation
import AStudioComponents

/// Gallery of data display components.
struct DataDisplayGallery: View {
    private struct RowItem: Identifiable {
        let id = UUID()
        let name: String
        let status: String
        let owner: String
    }

    private let rows: [RowItem] = [
        RowItem(name: "Launch Plan", status: "Active", owner: "Jamie"),
        RowItem(name: "Design Audit", status: "Review", owner: "Priya"),
        RowItem(name: "SDK Cleanup", status: "Blocked", owner: "Sam")
    ]

    private let columns: [ChatUITableColumn] = [
        ChatUITableColumn(title: "Project"),
        ChatUITableColumn(title: "Status", alignment: .center),
        ChatUITableColumn(title: "Owner", alignment: .trailing)
    ]

    var body: some View {
        VStack(alignment: .leading, spacing: FSpacing.s24) {
            GallerySection(title: "AvatarView", subtitle: "User avatars with initials fallback") {
                HStack(spacing: FSpacing.s12) {
                    AvatarView(initials: "JC")
                    AvatarView(image: Image(systemName: "person.fill"), initials: "AB")
                    AvatarView(url: nil, initials: "KW", size: .lg)
                }
            }

            GallerySection(title: "BadgeView", subtitle: "Status badges with variants") {
                HStack(spacing: FSpacing.s12) {
                    BadgeView("New")
                    BadgeView("Pro", variant: .secondary)
                    BadgeView("Warning", variant: .outline)
                    BadgeView("Error", variant: .destructive)
                }
            }

            GallerySection(title: "ChatUITableView", subtitle: "macOS-friendly table layout") {
                ChatUITableView(data: rows, columns: columns) { row in
                    HStack {
                        Text(row.name)
                            .font(FType.rowTitle())
                            .foregroundStyle(FColor.textPrimary)
                        Spacer()
                        BadgeView(row.status, variant: row.status == "Blocked" ? .destructive : .secondary)
                            .frame(maxWidth: 120, alignment: .center)
                        Spacer()
                        Text(row.owner)
                            .font(FType.caption())
                            .foregroundStyle(FColor.textSecondary)
                    }
                }
            }

            GallerySection(title: "chatUITooltip", subtitle: "Tooltip helper for macOS") {
                HStack(spacing: FSpacing.s12) {
                    Text("Hover for details")
                        .font(FType.rowTitle())
                        .foregroundStyle(FColor.textPrimary)
                        .chatUITooltip("This tooltip appears on macOS using .help()")
                    ChatUIButton(systemName: "info.circle", variant: .ghost, size: .icon, accessibilityLabel: "Info") {}
                        .chatUITooltip("More info about this component")
                }
            }
        }
    }
}
