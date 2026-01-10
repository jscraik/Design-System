import SwiftUI
import AStudioFoundation
import AStudioThemes

/// Column definition for `ChatUITableView`.
public struct ChatUITableColumn {
    /// Column title text.
    public let title: String
    /// Optional fixed width for the column.
    public let width: CGFloat?
    /// Horizontal alignment for column content.
    public let alignment: HorizontalAlignment

    /// Creates a table column definition.
    ///
    /// - Parameters:
    ///   - title: Column title.
    ///   - width: Optional fixed width.
    ///   - alignment: Horizontal alignment for column content.
    public init(title: String, width: CGFloat? = nil, alignment: HorizontalAlignment = .leading) {
        self.title = title
        self.width = width
        self.alignment = alignment
    }
}

/// Renders a table view with optional sorting and row actions.
///
/// - Example:
/// ```swift
/// ChatUITableView(data: rows, columns: columns) { row in
///     Text(row.title)
/// }
/// ```
public struct ChatUITableView<Data: RandomAccessCollection, RowContent: View>: View where Data.Element: Identifiable {
    private let data: Data
    private let columns: [ChatUITableColumn]
    private let rowContent: (Data.Element) -> RowContent
    private let onRowTap: ((Data.Element) -> Void)?
    private let sortComparator: ((Data.Element, Data.Element, Int, Bool) -> Bool)?

    @State private var sortColumn: Int?
    @State private var sortAscending = true
    @Environment(\.colorScheme) private var scheme
    @Environment(\.chatUITheme) private var theme

    /// Creates a table view.
    ///
    /// - Parameters:
    ///   - data: Collection of row data.
    ///   - columns: Column definitions.
    ///   - sortComparator: Optional comparator for sorting.
    ///   - onRowTap: Optional row tap handler.
    ///   - rowContent: Row content builder.
    public init(
        data: Data,
        columns: [ChatUITableColumn],
        sortComparator: ((Data.Element, Data.Element, Int, Bool) -> Bool)? = nil,
        onRowTap: ((Data.Element) -> Void)? = nil,
        @ViewBuilder rowContent: @escaping (Data.Element) -> RowContent
    ) {
        self.data = data
        self.columns = columns
        self.sortComparator = sortComparator
        self.onRowTap = onRowTap
        self.rowContent = rowContent
    }

    /// The content and behavior of this view.
    public var body: some View {
        VStack(spacing: 0) {
            tableHeader
            ScrollView {
                LazyVStack(spacing: 0) {
                    ForEach(Array(sortedItems.enumerated()), id: \.element.id) { index, item in
                        tableRow(for: item, at: index)
                    }
                }
            }
        }
        .background(FColor.bgCard)
        .clipShape(RoundedRectangle(cornerRadius: theme.cardCornerRadius, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: theme.cardCornerRadius, style: .continuous)
                .stroke(
                    FColor.divider.opacity(scheme == .dark ? theme.dividerOpacityDark : theme.dividerOpacityLight),
                    lineWidth: 1
                )
        )
    }

    private var tableHeader: some View {
        HStack(spacing: 0) {
            ForEach(Array(columns.enumerated()), id: \.offset) { index, column in
                tableHeaderColumn(column, index: index)
                if index < columns.count - 1 {
                    Rectangle()
                        .frame(width: 1)
                        .foregroundStyle(FColor.divider.opacity(0.5))
                }
            }
        }
        .background(FColor.bgCardAlt)
        .overlay(SettingsDivider(), alignment: .bottom)
    }

    @ViewBuilder
    private func tableRow(for item: Data.Element, at index: Int) -> some View {
        let content = rowContent(item)
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.horizontal, FSpacing.s12)
            .padding(.vertical, FSpacing.s8)

        Group {
            if let onRowTap {
                Button {
                    onRowTap(item)
                } label: {
                    content
                }
                .buttonStyle(.plain)
            } else {
                content
            }
        }
        .background(index % 2 == 0 ? FColor.bgCard : FColor.bgCardAlt.opacity(0.4))
        .overlay(SettingsDivider(), alignment: .bottom)
        .accessibilityElement(children: .combine)
        .accessibilityAddTraits(onRowTap != nil ? .isButton : [])
    }

    @ViewBuilder
    private func tableHeaderColumn(_ column: ChatUITableColumn, index: Int) -> some View {
        let headerContent = HStack(spacing: FSpacing.s4) {
            Text(column.title)
                .font(FType.sectionTitle())
                .foregroundStyle(FColor.textSecondary)
            if sortColumn == index {
                Image(systemName: sortAscending ? "chevron.up" : "chevron.down")
                    .font(.system(size: 10, weight: .semibold))
                    .foregroundStyle(FColor.iconSecondary)
                    .accessibilityHidden(true)
            }
        }
        .frame(maxWidth: .infinity, alignment: alignmentForColumn(column))
        .padding(.horizontal, FSpacing.s12)
        .padding(.vertical, FSpacing.s8)

        if sortComparator != nil {
            Button {
                toggleSort(for: index)
            } label: {
                headerContent
            }
            .buttonStyle(.plain)
            .accessibilityLabel("\(column.title) column header")
            .accessibilityHint("Tap to sort by \(column.title)")
        } else {
            headerContent
                .accessibilityAddTraits(.isHeader)
        }
    }

    private func toggleSort(for columnIndex: Int) {
        guard sortComparator != nil else { return }
        if sortColumn == columnIndex {
            sortAscending.toggle()
        } else {
            sortColumn = columnIndex
            sortAscending = true
        }
    }

    private func alignmentForColumn(_ column: ChatUITableColumn) -> Alignment {
        switch column.alignment {
        case .leading:
            return .leading
        case .center:
            return .center
        case .trailing:
            return .trailing
        default:
            return .leading
        }
    }

    private var sortedItems: [Data.Element] {
        let items = Array(data)
        guard let sortColumn, let comparator = sortComparator else {
            return items
        }
        return items.sorted { comparator($0, $1, sortColumn, sortAscending) }
    }
}
