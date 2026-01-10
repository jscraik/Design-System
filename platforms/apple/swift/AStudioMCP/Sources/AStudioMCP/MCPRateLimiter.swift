import Foundation

/// Rate limiter for MCP tool calls to prevent DoS attacks.
public actor MCPRateLimiter {
    private var requestTimestamps: [Date] = []
    private let maxRequests: Int
    private let timeWindow: TimeInterval
    private var lastResetTime: Date

    /// Initialize rate limiter.
    /// - Parameters:
    ///   - maxRequests: Maximum number of requests allowed in time window
    ///   - perTimeWindow: Time window in seconds
    public init(maxRequests: Int = 100, perTimeWindow: TimeInterval = 60) {
        self.maxRequests = maxRequests
        self.timeWindow = perTimeWindow
        self.lastResetTime = Date()
    }

    /// Acquire permission to make a request.
    /// - Throws: MCPError if rate limit is exceeded
    public func acquire() async throws {
        let now = Date()

        // Remove timestamps outside the current time window
        let windowStart = now.addingTimeInterval(-timeWindow)
        requestTimestamps.removeAll { $0 < windowStart }

        // Check if limit is exceeded
        guard requestTimestamps.count < maxRequests else {
            throw MCPError.rateLimitExceeded("Rate limit exceeded: \(maxRequests) requests per \(Int(timeWindow))s")
        }

        // Add current request timestamp
        requestTimestamps.append(now)
    }

    /// Get current usage statistics.
    /// - Returns: Tuple of (currentRequestCount, remainingRequests, resetTime)
    public func getUsageStats() -> (current: Int, remaining: Int, resetTime: Date?) {
        let now = Date()
        let windowStart = now.addingTimeInterval(-timeWindow)

        // Clean old timestamps
        requestTimestamps.removeAll { $0 < windowStart }

        let remaining = max(0, maxRequests - requestTimestamps.count)
        let oldestTimestamp = requestTimestamps.first
        let resetTime = oldestTimestamp?.addingTimeInterval(timeWindow)

        return (current: requestTimestamps.count, remaining: remaining, resetTime: resetTime)
    }

    /// Reset the rate limiter (for testing).
    public func reset() {
        requestTimestamps.removeAll()
        lastResetTime = Date()
    }
}
