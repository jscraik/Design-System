import SwiftUI
import Combine

/**
 * Performance monitoring tools specifically designed for SwiftUI Previews
 * 
 * Provides real-time performance metrics, memory usage tracking, and
 * preview-specific debugging tools for ChatUISwift development.
 */

// MARK: - Preview Performance Configuration

public struct PreviewPerformanceConfig {
    public static var isEnabled: Bool = {
        #if DEBUG
        return true
        #else
        return false
        #endif
    }()
    
    public static var showMetricsOverlay = true
    public static var trackMemoryUsage = true
    public static var logSlowPreviews = true
    public static var slowPreviewThreshold: TimeInterval = 0.016 // 60fps
    public static var memoryWarningThreshold: Double = 100.0 // MB
}

// MARK: - Preview Performance Monitor

@available(macOS 13.0, *)
public struct PreviewPerformanceMonitor<Content: View>: View {
    let content: Content
    let previewName: String
    
    @StateObject private var metrics = PreviewMetrics()
    @State private var isMetricsVisible = PreviewPerformanceConfig.showMetricsOverlay
    
    public init(previewName: String, @ViewBuilder content: () -> Content) {
        self.previewName = previewName
        self.content = content()
    }
    
    public var body: some View {
        ZStack(alignment: .topLeading) {
            // Main content with performance tracking
            content
                .background(
                    // Invisible performance tracker
                    PerformanceTracker(
                        previewName: previewName,
                        metrics: metrics
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
    
    @State private var lastUpdateTime = Date()
    
    var body: some View {
        Color.clear
            .onAppear {
                trackUpdate()
            }
            .onChange(of: metrics.renderCount) { _ in
                trackUpdate()
            }
    }
    
    private func trackUpdate() {
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
public class PreviewMetrics: ObservableObject {
    @Published public var renderCount = 0
    @Published public var currentFPS: Double = 0
    @Published public var averageRenderTime: TimeInterval = 0
    @Published public var memoryUsage: Double = 0
    @Published public var stateUpdateCount = 0
    
    private var renderTimes: [TimeInterval] = []
    private var fpsTimer: Timer?
    private var memoryTimer: Timer?
    private var lastFPSUpdate = Date()
    private var frameCount = 0
    
    public func startMonitoring(previewName: String) {
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
    
    public func stopMonitoring() {
        fpsTimer?.invalidate()
        memoryTimer?.invalidate()
        fpsTimer = nil
        memoryTimer = nil
    }
    
    public func recordRender(duration: TimeInterval) {
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
    
    public func recordStateUpdate() {
        DispatchQueue.main.async {
            self.stateUpdateCount += 1
        }
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
public struct PreviewWithPerformanceMonitoring<Content: View>: View {
    let content: Content
    let name: String
    
    public init(_ name: String, @ViewBuilder content: () -> Content) {
        self.name = name
        self.content = content()
    }
    
    public var body: some View {
        PreviewPerformanceMonitor(previewName: name) {
            content
        }
    }
}

// MARK: - Preview Performance Extensions

extension View {
    /// Adds performance monitoring to a SwiftUI preview
    public func previewPerformance(name: String) -> some View {
        PreviewPerformanceMonitor(previewName: name) {
            self
        }
    }
    
    /// Tracks state updates for performance monitoring
    public func trackStateUpdate() -> some View {
        self.onAppear {
            // This would be called by components when their state updates
            // Components can call this manually or through a custom modifier
        }
    }
}

// MARK: - Preview Performance Helpers

/// Convenience function for creating performance-monitored previews
public func PreviewWithMonitoring<Content: View>(
    _ name: String,
    @ViewBuilder content: () -> Content
) -> some View {
    PreviewWithPerformanceMonitoring(name, content: content)
}

// MARK: - Performance Benchmark

@available(macOS 13.0, *)
public struct PreviewBenchmark {
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

public struct BenchmarkResult {
    public let previewName: String
    public let iterations: Int
    public let averageRenderTime: TimeInterval
    public let minRenderTime: TimeInterval
    public let maxRenderTime: TimeInterval
    public let totalTime: TimeInterval
    
    public var isPerformant: Bool {
        averageRenderTime <= PreviewPerformanceConfig.slowPreviewThreshold
    }
    
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