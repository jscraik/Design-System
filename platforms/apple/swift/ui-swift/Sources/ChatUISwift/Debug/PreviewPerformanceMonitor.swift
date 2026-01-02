import SwiftUI

/**
 * Performance monitoring tools specifically designed for SwiftUI Previews
 * 
 * Provides real-time performance metrics, memory usage tracking, and
 * preview-specific debugging tools for ChatUISwift development.
 */

// MARK: - Preview Performance Configuration

/// Configuration flags for preview performance monitoring.
public struct PreviewPerformanceConfig {
    /// Whether preview performance monitoring is enabled (defaults to true in DEBUG).
    public static var isEnabled: Bool = {
        #if DEBUG
        return true
        #else
        return false
        #endif
    }()
    
    /// Whether to show the metrics overlay.
    public static var showMetricsOverlay = true
    /// Whether to track memory usage.
    public static var trackMemoryUsage = true
    /// Whether to log slow preview renders.
    public static var logSlowPreviews = true
    /// Threshold (seconds) for a slow preview render.
    public static var slowPreviewThreshold: TimeInterval = 0.016 // 60fps
    /// Memory warning threshold (MB).
    public static var memoryWarningThreshold: Double = 100.0 // MB
}

// MARK: - Preview Performance Monitor

@available(macOS 13.0, *)
/// Wraps content with preview performance monitoring.
public struct PreviewPerformanceMonitor<Content: View>: View {
    let content: Content
    let previewName: String
    let renderKey: AnyHashable?
    
    @StateObject private var metrics = PreviewMetrics()
    @State private var isMetricsVisible = PreviewPerformanceConfig.showMetricsOverlay
    
    /// Creates a performance monitor wrapper.
    ///
    /// - Parameters:
    ///   - previewName: Label shown in the overlay.
    ///   - renderKey: Optional render key to track changes.
    ///   - content: Preview content builder.
    public init(
        previewName: String,
        renderKey: AnyHashable? = nil,
        @ViewBuilder content: () -> Content
    ) {
        self.previewName = previewName
        self.renderKey = renderKey
        self.content = content()
    }
    
    /// The content and behavior of this view.
    public var body: some View {
        ZStack(alignment: .topLeading) {
            // Main content with performance tracking
            content
                .background(
                    // Invisible performance tracker
                    PerformanceTracker(
                        previewName: previewName,
                        metrics: metrics,
                        renderKey: renderKey
                    )
                )
            
            // Metrics overlay
            if isMetricsVisible && PreviewPerformanceConfig.isEnabled {
                metricsOverlay
            }
        }
        .onAppear {
            metrics.startMonitoring(previewName: previewName)
        }
        .onDisappear {
            metrics.stopMonitoring()
        }
    }
    
    private var metricsOverlay: some View {
        VStack(alignment: .leading, spacing: 4) {
            // Header with toggle
            HStack {
                Text("⚡ \(previewName)")
                    .font(.caption.bold().monospaced())
                    .foregroundColor(.white)
                
                Spacer()
                
                Button(action: { isMetricsVisible.toggle() }) {
                    Image(systemName: isMetricsVisible ? "eye.slash" : "eye")
                        .font(.caption)
                        .foregroundColor(.white)
                }
                .buttonStyle(.plain)
            }
            
            // Performance metrics
            Group {
                metricRow("FPS", value: String(format: "%.1f", metrics.currentFPS), 
                         color: metrics.currentFPS < 30 ? .red : metrics.currentFPS < 50 ? .orange : .green)
                
                metricRow("Render", value: "\(metrics.renderCount)", 
                         color: .blue)
                
                metricRow("Avg Time", value: String(format: "%.2fms", metrics.averageRenderTime * 1000), 
                         color: metrics.averageRenderTime > PreviewPerformanceConfig.slowPreviewThreshold ? .red : .green)
                
                if PreviewPerformanceConfig.trackMemoryUsage {
                    metricRow("Memory", value: String(format: "%.1fMB", metrics.memoryUsage), 
                             color: metrics.memoryUsage > PreviewPerformanceConfig.memoryWarningThreshold ? .red : .green)
                }
                
                metricRow("Updates", value: "\(metrics.stateUpdateCount)", 
                         color: .purple)
            }
        }
        .padding(8)
        .background(
            RoundedRectangle(cornerRadius: 6)
                .fill(Color.black.opacity(0.8))
        )
        .padding(8)
    }
    
    private func metricRow(_ label: String, value: String, color: Color) -> some View {
        HStack {
            Text(label + ":")
                .font(.caption2.monospaced())
                .foregroundColor(.white.opacity(0.8))
                .frame(width: 50, alignment: .leading)
            
            Text(value)
                .font(.caption2.monospaced().bold())
                .foregroundColor(color)
        }
    }
}

// MARK: - Performance Tracker

private struct PerformanceTracker: View {
    let previewName: String
    let metrics: PreviewMetrics
    let renderKey: AnyHashable?
    
    @State private var lastUpdateTime = Date()
    
    var body: some View {
        Color.clear
            .onAppear {
                trackUpdate()
            }
            .onChange(of: renderKey) { _ in
                trackUpdate()
            }
    }
    
    private func trackUpdate() {
        guard PreviewPerformanceConfig.isEnabled else { return }
        let now = Date()
        let timeSinceLastUpdate = now.timeIntervalSince(lastUpdateTime)
        
        metrics.recordRender(duration: timeSinceLastUpdate)
        lastUpdateTime = now
        
        if PreviewPerformanceConfig.logSlowPreviews && 
           timeSinceLastUpdate > PreviewPerformanceConfig.slowPreviewThreshold {
            print("⚡ [SLOW PREVIEW] \(previewName): \(String(format: "%.2f", timeSinceLastUpdate * 1000))ms")
        }
    }
}

// MARK: - Preview Metrics

@available(macOS 13.0, *)
/// Tracks preview performance metrics.
public class PreviewMetrics: ObservableObject {
    /// Number of renders recorded.
    @Published public var renderCount = 0
    /// Current frames per second estimate.
    @Published public var currentFPS: Double = 0
    /// Average render time (seconds).
    @Published public var averageRenderTime: TimeInterval = 0
    /// Current memory usage estimate (MB).
    @Published public var memoryUsage: Double = 0
    /// Number of state updates recorded.
    @Published public var stateUpdateCount = 0
    
    private var renderTimes: [TimeInterval] = []
    private var fpsTimer: Timer?
    private var memoryTimer: Timer?
    private var lastFPSUpdate = Date()
    private var frameCount = 0
    
    /// Starts monitoring for a preview.
    public func startMonitoring(previewName: String) {
        guard PreviewPerformanceConfig.isEnabled else { return }
        // Start FPS monitoring
        fpsTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { _ in
            self.updateFPS()
        }
        
        // Start memory monitoring
        if PreviewPerformanceConfig.trackMemoryUsage {
            memoryTimer = Timer.scheduledTimer(withTimeInterval: 2.0, repeats: true) { _ in
                self.updateMemoryUsage()
            }
        }
        
        print("⚡ Started performance monitoring for preview: \(previewName)")
    }
    
    /// Stops monitoring timers.
    public func stopMonitoring() {
        fpsTimer?.invalidate()
        memoryTimer?.invalidate()
        fpsTimer = nil
        memoryTimer = nil
    }
    
    /// Records a render duration.
    public func recordRender(duration: TimeInterval) {
        guard PreviewPerformanceConfig.isEnabled else { return }
        DispatchQueue.main.async {
            self.renderCount += 1
            self.frameCount += 1
            
            // Track render times for average calculation
            self.renderTimes.append(duration)
            if self.renderTimes.count > 30 {
                self.renderTimes.removeFirst()
            }
            
            self.averageRenderTime = self.renderTimes.reduce(0, +) / Double(self.renderTimes.count)
        }
    }
    
    /// Records a state update.
    public func recordStateUpdate() {
        guard PreviewPerformanceConfig.isEnabled else { return }
        DispatchQueue.main.async {
            self.stateUpdateCount += 1
        }
    }

    deinit {
        stopMonitoring()
    }
    
    private func updateFPS() {
        let now = Date()
        let timeSinceLastUpdate = now.timeIntervalSince(lastFPSUpdate)
        
        if timeSinceLastUpdate > 0 {
            currentFPS = Double(frameCount) / timeSinceLastUpdate
        }
        
        frameCount = 0
        lastFPSUpdate = now
    }
    
    private func updateMemoryUsage() {
        var memoryInfo = mach_task_basic_info()
        var count = mach_msg_type_number_t(MemoryLayout<mach_task_basic_info>.size)/4
        
        let kerr: kern_return_t = withUnsafeMutablePointer(to: &memoryInfo) {
            $0.withMemoryRebound(to: integer_t.self, capacity: 1) {
                task_info(mach_task_self_,
                         task_flavor_t(MACH_TASK_BASIC_INFO),
                         $0,
                         &count)
            }
        }
        
        if kerr == KERN_SUCCESS {
            let memoryUsageBytes = Double(memoryInfo.resident_size)
            memoryUsage = memoryUsageBytes / (1024 * 1024) // Convert to MB
            
            if memoryUsage > PreviewPerformanceConfig.memoryWarningThreshold {
                print("⚠️ [MEMORY WARNING] Preview memory usage: \(String(format: "%.1f", memoryUsage))MB")
            }
        }
    }
}

// MARK: - Preview Performance Wrapper

@available(macOS 13.0, *)
/// Convenience wrapper for monitored previews.
public struct PreviewWithPerformanceMonitoring<Content: View>: View {
    let content: Content
    let name: String
    let renderKey: AnyHashable?
    
    /// Creates a monitored preview wrapper.
    ///
    /// - Parameters:
    ///   - name: Preview name shown in the overlay.
    ///   - renderKey: Optional render key to track changes.
    ///   - content: Preview content builder.
    public init(_ name: String, renderKey: AnyHashable? = nil, @ViewBuilder content: () -> Content) {
        self.name = name
        self.renderKey = renderKey
        self.content = content()
    }
    
    /// The content and behavior of this view.
    public var body: some View {
        PreviewPerformanceMonitor(previewName: name, renderKey: renderKey) {
            content
        }
    }
}

// MARK: - Preview Performance Extensions

extension View {
    /// Adds performance monitoring to a SwiftUI preview.
    public func previewPerformance(name: String, renderKey: AnyHashable? = nil) -> some View {
        PreviewPerformanceMonitor(previewName: name, renderKey: renderKey) {
            self
        }
    }
    
    /// Tracks state updates for performance monitoring.
    public func trackStateUpdate() -> some View {
        self.onAppear {
            // This would be called by components when their state updates
            // Components can call this manually or through a custom modifier
        }
    }
}

// MARK: - Preview Performance Helpers

/// Convenience function for creating performance-monitored previews.
public func PreviewWithMonitoring<Content: View>(
    _ name: String,
    renderKey: AnyHashable? = nil,
    @ViewBuilder content: () -> Content
) -> some View {
    PreviewWithPerformanceMonitoring(name, renderKey: renderKey, content: content)
}

// MARK: - Performance Benchmark

@available(macOS 13.0, *)
/// Utility for benchmarking preview render performance.
public struct PreviewBenchmark {
    /// Measures render performance for a preview.
    public static func measurePreviewPerformance<Content: View>(
        name: String,
        iterations: Int = 100,
        @ViewBuilder content: () -> Content
    ) -> BenchmarkResult {
        
        var renderTimes: [TimeInterval] = []
        
        for _ in 0..<iterations {
            let startTime = Date()
            
            // Simulate preview render
            let _ = content()
            
            let renderTime = Date().timeIntervalSince(startTime)
            renderTimes.append(renderTime)
        }
        
        let averageTime = renderTimes.reduce(0, +) / Double(renderTimes.count)
        let minTime = renderTimes.min() ?? 0
        let maxTime = renderTimes.max() ?? 0
        
        let result = BenchmarkResult(
            previewName: name,
            iterations: iterations,
            averageRenderTime: averageTime,
            minRenderTime: minTime,
            maxRenderTime: maxTime,
            totalTime: renderTimes.reduce(0, +)
        )
        
        print("📊 Benchmark Results for \(name):")
        print("   Iterations: \(iterations)")
        print("   Average: \(String(format: "%.3f", averageTime * 1000))ms")
        print("   Min: \(String(format: "%.3f", minTime * 1000))ms")
        print("   Max: \(String(format: "%.3f", maxTime * 1000))ms")
        print("   Total: \(String(format: "%.3f", result.totalTime * 1000))ms")
        
        return result
    }
}

/// Result of a preview performance benchmark.
public struct BenchmarkResult {
    /// Preview name used in the benchmark.
    public let previewName: String
    /// Number of iterations executed.
    public let iterations: Int
    /// Average render time (seconds).
    public let averageRenderTime: TimeInterval
    /// Minimum render time (seconds).
    public let minRenderTime: TimeInterval
    /// Maximum render time (seconds).
    public let maxRenderTime: TimeInterval
    /// Total elapsed time (seconds).
    public let totalTime: TimeInterval
    
    /// Whether average render time meets the configured threshold.
    public var isPerformant: Bool {
        averageRenderTime <= PreviewPerformanceConfig.slowPreviewThreshold
    }
    
    /// Human-readable performance grade.
    public var performanceGrade: String {
        switch averageRenderTime {
        case 0..<0.008: return "A+ (Excellent)"
        case 0.008..<0.016: return "A (Good)"
        case 0.016..<0.033: return "B (Acceptable)"
        case 0.033..<0.050: return "C (Slow)"
        default: return "D (Very Slow)"
        }
    }
}

// MARK: - Memory Utilities

private func mach_task_basic_info() -> mach_task_basic_info {
    return mach_task_basic_info(
        virtual_size: 0,
        resident_size: 0,
        resident_size_max: 0,
        user_time: time_value_t(seconds: 0, microseconds: 0),
        system_time: time_value_t(seconds: 0, microseconds: 0),
        policy: 0,
        suspend_count: 0
    )
}
