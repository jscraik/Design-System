import SwiftUI
import Combine

/**
 * Component debugging tools for ChatUISwift development
 * 
 * Provides runtime inspection, state monitoring, and debugging utilities
 * for SwiftUI components during development.
 */

// MARK: - Debug Configuration

public struct DebugConfig {
    public static var isEnabled: Bool = {
        #if DEBUG
        return true
        #else
        return false
        #endif
    }()
    
    public static var showStateInspector = false
    public static var logStateChanges = false
    public static var showPerformanceMetrics = false
    public static var highlightRedraws = false
}

// MARK: - Component State Inspector

@available(macOS 13.0, *)
public struct ComponentStateInspector<Content: View>: View {
    let content: Content
    let componentName: String
    @State private var isExpanded = false
    @State private var stateHistory: [StateSnapshot] = []
    
    public init(componentName: String, @ViewBuilder content: () -> Content) {
        self.componentName = componentName
        self.content = content()
    }
    
    public var body: some View {
        if DebugConfig.isEnabled && DebugConfig.showStateInspector {
            VStack(alignment: .leading, spacing: 0) {
                // Component content
                content
                    .background(
                        DebugConfig.highlightRedraws ? 
                        AnyView(Color.red.opacity(0.1).animation(.easeInOut(duration: 0.2), value: UUID())) : 
                        AnyView(Color.clear)
                    )
                
                // Debug inspector panel
                debugInspectorPanel
            }
        } else {
            content
        }
    }
    
    private var debugInspectorPanel: some View {
        VStack(alignment: .leading, spacing: 8) {
            // Header
            HStack {
                Button(action: { isExpanded.toggle() }) {
                    HStack(spacing: 4) {
                        Image(systemName: isExpanded ? "chevron.down" : "chevron.right")
                            .font(.caption)
                        Text("🐛 \(componentName) Debug")
                            .font(.caption.monospaced())
                            .foregroundColor(.secondary)
                    }
                }
                .buttonStyle(.plain)
                
                Spacer()
                
                Button("Clear History") {
                    stateHistory.removeAll()
                }
                .font(.caption)
                .buttonStyle(.borderless)
            }
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(Color.gray.opacity(0.1))
            
            // Expanded content
            if isExpanded {
                ScrollView {
                    LazyVStack(alignment: .leading, spacing: 4) {
                        ForEach(stateHistory.reversed()) { snapshot in
                            stateSnapshotView(snapshot)
                        }
                    }
                    .padding(8)
                }
                .frame(maxHeight: 200)
                .background(Color.gray.opacity(0.05))
            }
        }
        .background(Color.gray.opacity(0.1))
        .cornerRadius(6)
        .overlay(
            RoundedRectangle(cornerRadius: 6)
                .stroke(Color.gray.opacity(0.3), lineWidth: 1)
        )
    }
    
    private func stateSnapshotView(_ snapshot: StateSnapshot) -> some View {
        VStack(alignment: .leading, spacing: 2) {
            HStack {
                Text(snapshot.timestamp, style: .time)
                    .font(.caption2.monospaced())
                    .foregroundColor(.secondary)
                
                Spacer()
                
                Text(snapshot.changeType.rawValue)
                    .font(.caption2)
                    .padding(.horizontal, 4)
                    .padding(.vertical, 1)
                    .background(snapshot.changeType.color.opacity(0.2))
                    .foregroundColor(snapshot.changeType.color)
                    .cornerRadius(3)
            }
            
            Text(snapshot.description)
                .font(.caption.monospaced())
                .foregroundColor(.primary)
                .lineLimit(3)
        }
        .padding(.vertical, 2)
    }
    
    public func logStateChange(_ description: String, type: StateChangeType = .update) {
        guard DebugConfig.isEnabled else { return }
        
        let snapshot = StateSnapshot(
            timestamp: Date(),
            description: description,
            changeType: type
        )
        
        stateHistory.append(snapshot)
        
        // Keep only last 50 entries
        if stateHistory.count > 50 {
            stateHistory.removeFirst()
        }
        
        if DebugConfig.logStateChanges {
            print("🐛 [\(componentName)] \(type.rawValue): \(description)")
        }
    }
}

// MARK: - State Snapshot

private struct StateSnapshot: Identifiable {
    let id = UUID()
    let timestamp: Date
    let description: String
    let changeType: StateChangeType
}

public enum StateChangeType: String, CaseIterable {
    case initialization = "INIT"
    case update = "UPDATE"
    case userAction = "ACTION"
    case systemEvent = "SYSTEM"
    case error = "ERROR"
    
    var color: Color {
        switch self {
        case .initialization: return .blue
        case .update: return .green
        case .userAction: return .orange
        case .systemEvent: return .purple
        case .error: return .red
        }
    }
}

// MARK: - Performance Monitor

@available(macOS 13.0, *)
public struct PerformanceMonitor<Content: View>: View {
    let content: Content
    let componentName: String
    @State private var renderCount = 0
    @State private var lastRenderTime = Date()
    @State private var averageRenderTime: TimeInterval = 0
    @State private var renderTimes: [TimeInterval] = []
    
    public init(componentName: String, @ViewBuilder content: () -> Content) {
        self.componentName = componentName
        self.content = content()
    }
    
    public var body: some View {
        content
            .background(
                // Invisible view that tracks renders
                Color.clear
                    .onAppear {
                        trackRender()
                    }
                    .onChange(of: renderCount) { _ in
                        trackRender()
                    }
            )
            .overlay(
                performanceOverlay,
                alignment: .topTrailing
            )
    }
    
    private var performanceOverlay: some View {
        Group {
            if DebugConfig.isEnabled && DebugConfig.showPerformanceMetrics {
                VStack(alignment: .trailing, spacing: 2) {
                    Text("⚡ \(componentName)")
                        .font(.caption2.monospaced())
                        .foregroundColor(.secondary)
                    
                    Text("Renders: \(renderCount)")
                        .font(.caption2.monospaced())
                        .foregroundColor(.primary)
                    
                    if averageRenderTime > 0 {
                        Text("Avg: \(String(format: "%.2f", averageRenderTime * 1000))ms")
                            .font(.caption2.monospaced())
                            .foregroundColor(averageRenderTime > 0.016 ? .red : .green)
                    }
                }
                .padding(4)
                .background(Color.black.opacity(0.7))
                .foregroundColor(.white)
                .cornerRadius(4)
                .padding(8)
            }
        }
    }
    
    private func trackRender() {
        let now = Date()
        let renderTime = now.timeIntervalSince(lastRenderTime)
        
        renderCount += 1
        lastRenderTime = now
        
        // Track render times for average calculation
        renderTimes.append(renderTime)
        if renderTimes.count > 10 {
            renderTimes.removeFirst()
        }
        
        averageRenderTime = renderTimes.reduce(0, +) / Double(renderTimes.count)
        
        if DebugConfig.logStateChanges && renderTime > 0.016 { // 60fps threshold
            print("⚡ [\(componentName)] Slow render: \(String(format: "%.2f", renderTime * 1000))ms")
        }
    }
}

// MARK: - Debug View Modifiers

extension View {
    /// Adds component state inspection capabilities
    public func debugInspector(componentName: String) -> some View {
        ComponentStateInspector(componentName: componentName) {
            self
        }
    }
    
    /// Adds performance monitoring overlay
    public func debugPerformance(componentName: String) -> some View {
        PerformanceMonitor(componentName: componentName) {
            self
        }
    }
    
    /// Highlights view redraws with a red flash
    public func debugRedraws() -> some View {
        self.background(
            DebugConfig.highlightRedraws ? 
            AnyView(Color.red.opacity(0.3).animation(.easeInOut(duration: 0.1), value: UUID())) : 
            AnyView(Color.clear)
        )
    }
    
    /// Comprehensive debug wrapper with all debugging features
    public func debugComponent(name: String) -> some View {
        self
            .debugInspector(componentName: name)
            .debugPerformance(componentName: name)
            .debugRedraws()
    }
}

// MARK: - Debug Console

public class DebugConsole: ObservableObject {
    public static let shared = DebugConsole()
    
    @Published public var logs: [DebugLog] = []
    @Published public var isVisible = false
    
    private init() {}
    
    public func log(_ message: String, level: LogLevel = .info, component: String? = nil) {
        guard DebugConfig.isEnabled else { return }
        
        let log = DebugLog(
            message: message,
            level: level,
            component: component,
            timestamp: Date()
        )
        
        DispatchQueue.main.async {
            self.logs.append(log)
            
            // Keep only last 100 logs
            if self.logs.count > 100 {
                self.logs.removeFirst()
            }
        }
        
        // Also print to console
        let prefix = component.map { "[\($0)] " } ?? ""
        print("🐛 \(level.emoji) \(prefix)\(message)")
    }
    
    public func clear() {
        logs.removeAll()
    }
    
    public func toggle() {
        isVisible.toggle()
    }
}

public struct DebugLog: Identifiable {
    public let id = UUID()
    public let message: String
    public let level: LogLevel
    public let component: String?
    public let timestamp: Date
}

public enum LogLevel: String, CaseIterable {
    case debug = "DEBUG"
    case info = "INFO"
    case warning = "WARNING"
    case error = "ERROR"
    
    var emoji: String {
        switch self {
        case .debug: return "🔍"
        case .info: return "ℹ️"
        case .warning: return "⚠️"
        case .error: return "❌"
        }
    }
    
    var color: Color {
        switch self {
        case .debug: return .gray
        case .info: return .blue
        case .warning: return .orange
        case .error: return .red
        }
    }
}

// MARK: - Debug Console View

@available(macOS 13.0, *)
public struct DebugConsoleView: View {
    @ObservedObject private var console = DebugConsole.shared
    @State private var selectedLevel: LogLevel? = nil
    
    public init() {}
    
    public var body: some View {
        VStack(spacing: 0) {
            // Header
            HStack {
                Text("🐛 Debug Console")
                    .font(.headline.monospaced())
                
                Spacer()
                
                // Level filter
                Picker("Level", selection: $selectedLevel) {
                    Text("All").tag(nil as LogLevel?)
                    ForEach(LogLevel.allCases, id: \.self) { level in
                        Text(level.rawValue).tag(level as LogLevel?)
                    }
                }
                .pickerStyle(.segmented)
                .frame(width: 200)
                
                Button("Clear") {
                    console.clear()
                }
                .buttonStyle(.borderless)
                
                Button("Close") {
                    console.isVisible = false
                }
                .buttonStyle(.borderless)
            }
            .padding()
            .background(Color.gray.opacity(0.1))
            
            Divider()
            
            // Logs
            ScrollViewReader { proxy in
                ScrollView {
                    LazyVStack(alignment: .leading, spacing: 1) {
                        ForEach(filteredLogs) { log in
                            logRowView(log)
                                .id(log.id)
                        }
                    }
                    .padding(.horizontal)
                }
                .onChange(of: console.logs.count) { _ in
                    if let lastLog = console.logs.last {
                        proxy.scrollTo(lastLog.id, anchor: .bottom)
                    }
                }
            }
        }
        .frame(width: 800, height: 400)
        .background(Color(NSColor.windowBackgroundColor))
    }
    
    private var filteredLogs: [DebugLog] {
        if let selectedLevel = selectedLevel {
            return console.logs.filter { $0.level == selectedLevel }
        }
        return console.logs
    }
    
    private func logRowView(_ log: DebugLog) -> some View {
        HStack(alignment: .top, spacing: 8) {
            Text(log.timestamp, style: .time)
                .font(.caption.monospaced())
                .foregroundColor(.secondary)
                .frame(width: 60, alignment: .leading)
            
            Text(log.level.emoji)
                .font(.caption)
            
            if let component = log.component {
                Text("[\(component)]")
                    .font(.caption.monospaced())
                    .foregroundColor(.secondary)
                    .frame(width: 100, alignment: .leading)
            }
            
            Text(log.message)
                .font(.caption.monospaced())
                .foregroundColor(log.level.color)
                .textSelection(.enabled)
            
            Spacer()
        }
        .padding(.vertical, 2)
        .background(
            log.level == .error ? Color.red.opacity(0.1) :
            log.level == .warning ? Color.orange.opacity(0.1) :
            Color.clear
        )
    }
}

// MARK: - Global Debug Functions

public func debugLog(_ message: String, level: LogLevel = .info, component: String? = nil) {
    DebugConsole.shared.log(message, level: level, component: component)
}

public func debugError(_ message: String, component: String? = nil) {
    DebugConsole.shared.log(message, level: .error, component: component)
}

public func debugWarning(_ message: String, component: String? = nil) {
    DebugConsole.shared.log(message, level: .warning, component: component)
}

public func debugInfo(_ message: String, component: String? = nil) {
    DebugConsole.shared.log(message, level: .info, component: component)
}