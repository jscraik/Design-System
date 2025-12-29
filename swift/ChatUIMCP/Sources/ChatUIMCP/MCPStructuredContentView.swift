import SwiftUI
import ChatUIFoundation
import ChatUIComponents

/// Renders structured MCP tool output using native ChatUI components.
public struct MCPStructuredContentView: View {
    private let content: [String: AnyCodable]

    public init(content: [String: AnyCodable]) {
        self.content = content
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: FSpacing.s16) {
            section(for: content)
        }
    }

    @ViewBuilder
    private func section(for content: [String: AnyCodable], title: String? = nil) -> some View {
        Group {
            if let title {
                Text(title)
                    .font(FType.sectionTitle())
                    .foregroundStyle(FColor.textSecondary)
            }

            SettingsCardView {
                VStack(spacing: 0) {
                    let keys = content.keys.sorted()
                    ForEach(keys, id: \.self) { key in
                        let value = content[key]!

                        if let dictValue = value.dictionaryValue {
                            VStack(alignment: .leading, spacing: FSpacing.s8) {
                                rowHeader(title: key, subtitle: "\(dictValue.count) fields")
                                nestedSection(for: dictValue)
                                    .padding(.leading, FSpacing.s12)
                            }
                            .padding(.vertical, FSpacing.s8)
                        } else if let arrayValue = value.arrayValue {
                            VStack(alignment: .leading, spacing: FSpacing.s8) {
                                rowHeader(title: key, subtitle: "\(arrayValue.count) items")
                                arraySection(arrayValue)
                                    .padding(.leading, FSpacing.s12)
                            }
                            .padding(.vertical, FSpacing.s8)
                        } else {
                            valueRow(title: key, value: value)
                            if key != keys.last {
                                SettingsDivider()
                            }
                        }
                    }
                }
            }
        }
    }
    
    @ViewBuilder
    private func nestedSection(for content: [String: AnyCodable]) -> some View {
        SettingsCardView {
            VStack(spacing: 0) {
                let keys = content.keys.sorted()
                ForEach(keys, id: \.self) { key in
                    let value = content[key]!
                    valueRow(title: key, value: value)
                    if key != keys.last {
                        SettingsDivider()
                    }
                }
            }
        }
    }

    @ViewBuilder
    private func arraySection(_ values: [AnyCodable]) -> some View {
        VStack(alignment: .leading, spacing: FSpacing.s12) {
            ForEach(Array(values.enumerated()), id: \.offset) { index, value in
                if let dictValue = value.dictionaryValue {
                    VStack(alignment: .leading, spacing: FSpacing.s8) {
                        Text("Item \(index + 1)")
                            .font(FType.caption())
                            .foregroundStyle(FColor.textTertiary)
                        nestedSection(for: dictValue)
                    }
                } else {
                    SettingsCardView {
                        valueRow(title: "Item \(index + 1)", value: value)
                    }
                }
            }
        }
    }

    private func valueRow(title: String, value: AnyCodable) -> some View {
        let displayTitle = title.humanizedKey
        let displayValue = value.displayString
        let usesSubtitle = displayValue.count > 42

        return SettingRowView(
            title: displayTitle,
            subtitle: usesSubtitle ? displayValue : nil,
            trailing: usesSubtitle ? .none : .text(displayValue)
        )
    }

    private func rowHeader(title: String, subtitle: String) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title.humanizedKey)
                .font(FType.rowTitle())
                .foregroundStyle(FColor.textPrimary)
            Text(subtitle)
                .font(FType.caption())
                .foregroundStyle(FColor.textTertiary)
        }
    }
}

/// Renders unstructured content blocks from MCP tool calls.
public struct MCPContentBlocksView: View {
    private let blocks: [MCPContentBlock]

    public init(blocks: [MCPContentBlock]) {
        self.blocks = blocks
    }

    public var body: some View {
        SettingsCardView {
            VStack(alignment: .leading, spacing: FSpacing.s12) {
                ForEach(Array(blocks.enumerated()), id: \.offset) { _, block in
                    if let text = block.text {
                        Text(text)
                            .font(FType.rowTitle())
                            .foregroundStyle(FColor.textSecondary)
                            .tracking(FType.trackingRow())
                    } else {
                        Text("Unsupported content block: \(block.type)")
                            .font(FType.caption())
                            .foregroundStyle(FColor.textTertiary)
                    }
                }
            }
            .padding(FSpacing.s16)
        }
    }
}

private extension String {
    var humanizedKey: String {
        if isEmpty { return self }
        let spaced = replacingOccurrences(of: "_", with: " ")
            .replacingOccurrences(of: "-", with: " ")
        return spaced.prefix(1).uppercased() + spaced.dropFirst()
    }
}

private extension AnyCodable {
    var displayString: String {
        switch value {
        case let string as String:
            return string
        case let number as NSNumber:
            return number.stringValue
        case let bool as Bool:
            return bool ? "True" : "False"
        case let array as [Any]:
            return "\(array.count) items"
        case let dict as [String: Any]:
            return "\(dict.count) fields"
        default:
            return String(describing: value)
        }
    }

    var dictionaryValue: [String: AnyCodable]? {
        guard let dict = value as? [String: Any] else { return nil }
        return dict.mapValues { AnyCodable($0) }
    }

    var arrayValue: [AnyCodable]? {
        guard let array = value as? [Any] else { return nil }
        return array.map { AnyCodable($0) }
    }
}
