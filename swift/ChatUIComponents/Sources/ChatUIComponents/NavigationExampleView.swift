import SwiftUI
import ChatUIFoundation

/// Example view demonstrating ListItemView and InputView components
public struct NavigationExampleView: View {
    @State private var selectedItem: String? = "inbox"
    @State private var searchText: String = ""
    
    public init() {}
    
    public var body: some View {
        VStack(spacing: 0) {
            // Search input
            InputView(
                text: $searchText,
                placeholder: "Search...",
                variant: .search,
                size: .default
            )
            .padding(FSpacing.s16)
            
            // Navigation list
            ScrollView {
                VStack(spacing: FSpacing.s4) {
                    Text("Navigation")
                        .font(FType.sectionTitle())
                        .foregroundStyle(FColor.textSecondary)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(.horizontal, FSpacing.s16)
                        .padding(.top, FSpacing.s8)
                    
                    SettingsCardView {
                        VStack(spacing: 0) {
                            ListItemView(
                                systemIcon: "tray",
                                title: "Inbox",
                                trailing: .badge(5),
                                isSelected: selectedItem == "inbox",
                                action: { selectedItem = "inbox" }
                            )
                            
                            SettingsDivider()
                            
                            ListItemView(
                                systemIcon: "paperplane",
                                title: "Sent",
                                isSelected: selectedItem == "sent",
                                action: { selectedItem = "sent" }
                            )
                            
                            SettingsDivider()
                            
                            ListItemView(
                                systemIcon: "folder",
                                title: "Archive",
                                trailing: .badge(12),
                                isSelected: selectedItem == "archive",
                                action: { selectedItem = "archive" }
                            )
                            
                            SettingsDivider()
                            
                            ListItemView(
                                systemIcon: "trash",
                                title: "Trash",
                                isSelected: selectedItem == "trash",
                                action: { selectedItem = "trash" }
                            )
                        }
                    }
                    .padding(.horizontal, FSpacing.s16)
                    
                    Text("Folders")
                        .font(FType.sectionTitle())
                        .foregroundStyle(FColor.textSecondary)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(.horizontal, FSpacing.s16)
                        .padding(.top, FSpacing.s16)
                    
                    SettingsCardView {
                        VStack(spacing: 0) {
                            ListItemView(
                                systemIcon: "briefcase",
                                title: "Work",
                                subtitle: "Project files",
                                trailing: .chevron,
                                isSelected: selectedItem == "work",
                                action: { selectedItem = "work" }
                            )
                            
                            SettingsDivider()
                            
                            ListItemView(
                                systemIcon: "person",
                                title: "Personal",
                                subtitle: "Private documents",
                                trailing: .chevron,
                                isSelected: selectedItem == "personal",
                                action: { selectedItem = "personal" }
                            )
                        }
                    }
                    .padding(.horizontal, FSpacing.s16)
                }
                .padding(.bottom, FSpacing.s16)
            }
        }
        .frame(maxWidth: 720, alignment: .leading)
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}
