import XCTest
@testable import AStudioMCP

/// Comprehensive tests for MCPRateLimiter
/// Tests rate limiting behavior, window expiration, concurrent requests, and statistics
final class MCPRateLimiterTests: XCTestCase {

    var rateLimiter: MCPRateLimiter!

    override func setUp() {
        super.setUp()
        rateLimiter = MCPRateLimiter(maxRequests: 10, perTimeWindow: 1.0)
    }

    override func tearDown() {
        rateLimiter = nil
        super.tearDown()
    }

    // MARK: - Basic Rate Limiting Tests

    func testAllowRequestsUnderLimit() async throws {
        // Should allow 10 requests in a 1-second window
        for i in 0..<10 {
            try await rateLimiter.acquire()
        }

        // 11th request should fail
        do {
            try await rateLimiter.acquire()
            XCTFail("Expected rateLimitExceeded error")
        } catch {
            XCTAssertTrue(error is MCPError)
            if case MCPError.rateLimitExceeded(let message) = error {
                XCTAssertTrue(message.contains("Rate limit exceeded"))
            } else {
                XCTFail("Expected rateLimitExceeded error")
            }
        }
    }

    func testRateLimitResetsAfterWindow() async throws {
        // Fill the rate limit
        for _ in 0..<10 {
            try await rateLimiter.acquire()
        }

        // Should be rate limited
        await assertRateLimitExceeded({ try await self.rateLimiter.acquire() })

        // Wait for window to expire (plus a small buffer)
        try await Task.sleep(nanoseconds: 1_100_000_000) // 1.1 seconds

        // Should be able to make requests again
        try await rateLimiter.acquire()

        // Verify we can make more requests
        for _ in 0..<9 {
            try await rateLimiter.acquire()
        }
    }

    func testRateLimitWithCustomConfiguration() async throws {
        // Create rate limiter with different configuration
        let customLimiter = MCPRateLimiter(maxRequests: 5, perTimeWindow: 2.0)

        // Should allow 5 requests
        for _ in 0..<5 {
            try await customLimiter.acquire()
        }

        // 6th should fail
        await assertRateLimitExceeded({ try await customLimiter.acquire() })
    }

    // MARK: - Window Expiration Tests

    func testOldRequestsExpireFromWindow() async throws {
        // Make 5 requests
        for _ in 0..<5 {
            try await rateLimiter.acquire()
        }

        // Wait for half the window
        try await Task.sleep(nanoseconds: 500_000_000) // 0.5 seconds

        // Make 5 more requests - should succeed because first 5 have expired
        for _ in 0..<5 {
            try await rateLimiter.acquire()
        }

        // Next request should fail (total 10 in current window)
        await assertRateLimitExceeded({ try await self.rateLimiter.acquire() })
    }

    func testSlidingWindowBehavior() async throws {
        // Make 3 requests spaced apart
        try await rateLimiter.acquire()
        try await Task.sleep(nanoseconds: 200_000_000) // 0.2 seconds

        try await rateLimiter.acquire()
        try await Task.sleep(nanoseconds: 200_000_000) // 0.2 seconds

        try await rateLimiter.acquire()

        // Should be able to make 7 more requests
        for _ in 0..<7 {
            try await rateLimiter.acquire()
        }

        // Should be at limit
        await assertRateLimitExceeded({ try await self.rateLimiter.acquire() })

        // Wait 0.4 seconds - first request should expire
        try await Task.sleep(nanoseconds: 400_000_000)

        // Should be able to make 1 more request
        try await rateLimiter.acquire()

        // Should be at limit again
        await assertRateLimitExceeded({ try await self.rateLimiter.acquire() })
    }

    func testWindowExpirationEdgeCases() async throws {
        // Make requests up to limit
        for _ in 0..<10 {
            try await rateLimiter.acquire()
        }

        // Wait just under the window
        try await Task.sleep(nanoseconds: 990_000_000) // 0.99 seconds

        // Should still be rate limited
        await assertRateLimitExceeded({ try await self.rateLimiter.acquire() })

        // Wait a bit more
        try await Task.sleep(nanoseconds: 20_000_000) // 0.02 seconds (total 1.01s)

        // Should now be allowed
        try await rateLimiter.acquire()
    }

    // MARK: - Concurrent Request Tests

    func testConcurrentRequestsUnderLimit() async throws {
        // Launch 10 concurrent requests
        try await withThrowingTaskGroup(of: Void.self) { group in
            for _ in 0..<10 {
                group.addTask {
                    try await self.rateLimiter.acquire()
                }
            }

            // All should succeed
            try await group.waitForAll()
        }

        // 11th should fail
        await assertRateLimitExceeded({ try await self.rateLimiter.acquire() })
    }

    func testConcurrentRequestsExceedLimit() async throws {
        // Launch 15 concurrent requests (more than limit)
        var successCount = 0
        var failureCount = 0

        await withTaskGroup(of: Bool.self) { group in
            for _ in 0..<15 {
                group.addTask {
                    do {
                        try await self.rateLimiter.acquire()
                        return true
                    } catch {
                        return false
                    }
                }
            }

            for await success in group {
                if success {
                    successCount += 1
                } else {
                    failureCount += 1
                }
            }
        }

        // Exactly 10 should succeed, 5 should fail
        XCTAssertEqual(successCount, 10, "Expected 10 successful requests")
        XCTAssertEqual(failureCount, 5, "Expected 5 rate-limited requests")
    }

    func testConcurrentRequestsAcrossWindows() async throws {
        // Make 10 requests to fill limit
        for _ in 0..<10 {
            try await rateLimiter.acquire()
        }

        // Launch concurrent tasks that wait for window reset
        let results = await withTaskGroup(of: Bool.self) { group in
            for i in 0..<5 {
                group.addTask {
                    do {
                        // Wait for window to expire
                        try await Task.sleep(nanoseconds: 1_100_000_000)
                        try await self.rateLimiter.acquire()
                        return true
                    } catch {
                        return false
                    }
                }
            }

            var results: [Bool] = []
            for await result in group {
                results.append(result)
            }
            return results
        }

        // All should succeed after waiting
        XCTAssertTrue(results.allSatisfy { $0 }, "All requests should succeed after window reset")
    }

    // MARK: - Usage Statistics Tests

    func testUsageStatsWhenEmpty() async {
        let stats = await rateLimiter.getUsageStats()

        XCTAssertEqual(stats.current, 0, "Current request count should be 0")
        XCTAssertEqual(stats.remaining, 10, "Should have all 10 requests remaining")
        XCTAssertNil(stats.resetTime, "Reset time should be nil when no requests")
    }

    func testUsageStatsAfterRequests() async throws {
        // Make 5 requests
        for _ in 0..<5 {
            try await rateLimiter.acquire()
        }

        let stats = await rateLimiter.getUsageStats()

        XCTAssertEqual(stats.current, 5, "Should have 5 current requests")
        XCTAssertEqual(stats.remaining, 5, "Should have 5 remaining requests")
        XCTAssertNotNil(stats.resetTime, "Reset time should be set")
    }

    func testUsageStatsAtLimit() async throws {
        // Fill the rate limit
        for _ in 0..<10 {
            try await rateLimiter.acquire()
        }

        let stats = await rateLimiter.getUsageStats()

        XCTAssertEqual(stats.current, 10, "Should have 10 current requests")
        XCTAssertEqual(stats.remaining, 0, "Should have 0 remaining requests")
        XCTAssertNotNil(stats.resetTime, "Reset time should be set")
    }

    func testUsageStatsAfterExpiration() async throws {
        // Make 5 requests
        for _ in 0..<5 {
            try await rateLimiter.acquire()
        }

        // Wait for window to expire
        try await Task.sleep(nanoseconds: 1_100_000_000)

        // Get stats (which should clean old timestamps)
        let stats = await rateLimiter.getUsageStats()

        XCTAssertEqual(stats.current, 0, "Old requests should have expired")
        XCTAssertEqual(stats.remaining, 10, "Should have all requests remaining")
        XCTAssertNil(stats.resetTime, "Reset time should be nil after expiration")
    }

    func testResetTimeAccuracy() async throws {
        // Make a request
        try await rateLimiter.acquire()

        let stats = await rateLimiter.getUsageStats()

        XCTAssertNotNil(stats.resetTime, "Reset time should be set")

        // Reset time should be approximately 1 second from now
        let expectedReset = Date().addingTimeInterval(1.0)
        let timeDifference = abs(stats.resetTime!.timeIntervalSince(expectedReset))

        XCTAssertLessThan(timeDifference, 0.1, "Reset time should be accurate within 100ms")
    }

    // MARK: - Reset Tests

    func testManualReset() async throws {
        // Make some requests
        for _ in 0..<5 {
            try await rateLimiter.acquire()
        }

        // Verify we've used 5 requests
        var stats = await rateLimiter.getUsageStats()
        XCTAssertEqual(stats.current, 5)

        // Reset
        await rateLimiter.reset()

        // Should be back to empty state
        stats = await rateLimiter.getUsageStats()
        XCTAssertEqual(stats.current, 0, "Should be 0 after reset")
        XCTAssertEqual(stats.remaining, 10, "Should have all requests remaining after reset")
        XCTAssertNil(stats.resetTime, "Reset time should be nil after reset")

        // Should be able to make 10 requests again
        for _ in 0..<10 {
            try await rateLimiter.acquire()
        }
    }

    func testResetWhileAtLimit() async throws {
        // Fill to limit
        for _ in 0..<10 {
            try await rateLimiter.acquire()
        }

        // Should be at limit
        await assertRateLimitExceeded({ try await self.rateLimiter.acquire() })

        // Reset
        await rateLimiter.reset()

        // Should be able to make requests again
        try await rateLimiter.acquire()
    }

    // MARK: - Edge Cases

    func testZeroRequestRateLimiter() async throws {
        // Create a rate limiter that allows 0 requests
        let zeroLimiter = MCPRateLimiter(maxRequests: 0, perTimeWindow: 1.0)

        // Should immediately be at limit
        await assertRateLimitExceeded({ try await zeroLimiter.acquire() })

        let stats = await zeroLimiter.getUsageStats()
        XCTAssertEqual(stats.current, 0)
        XCTAssertEqual(stats.remaining, 0)
    }

    func testVeryLargeRateLimit() async throws {
        // Create a rate limiter with very high limit
        let largeLimiter = MCPRateLimiter(maxRequests: 10_000, perTimeWindow: 60.0)

        // Should be able to make many requests
        for _ in 0..<100 {
            try await largeLimiter.acquire()
        }

        let stats = await largeLimiter.getUsageStats()
        XCTAssertEqual(stats.current, 100)
        XCTAssertEqual(stats.remaining, 9900)
    }

    func testVeryShortTimeWindow() async throws {
        // Create a rate limiter with very short window (0.1 seconds)
        let shortWindowLimiter = MCPRateLimiter(maxRequests: 5, perTimeWindow: 0.1)

        // Fill the limit
        for _ in 0..<5 {
            try await shortWindowLimiter.acquire()
        }

        // Should be at limit
        await assertRateLimitExceeded({ try await shortWindowLimiter.acquire() })

        // Wait for window to expire
        try await Task.sleep(nanoseconds: 150_000_000) // 0.15 seconds

        // Should be able to make requests again
        try await shortWindowLimiter.acquire()
    }

    func testVeryLongTimeWindow() async throws {
        // Create a rate limiter with very long window (10 seconds)
        let longWindowLimiter = MCPRateLimiter(maxRequests: 3, perTimeWindow: 10.0)

        // Fill the limit
        for _ in 0..<3 {
            try await longWindowLimiter.acquire()
        }

        // Should be at limit
        await assertRateLimitExceeded({ try await longWindowLimiter.acquire() })

        // Wait 1 second - should still be at limit
        try await Task.sleep(nanoseconds: 1_000_000_000)
        await assertRateLimitExceeded({ try await longWindowLimiter.acquire() })

        let stats = await longWindowLimiter.getUsageStats()
        XCTAssertEqual(stats.remaining, 0, "Should still be at limit after 1 second")
    }

    // MARK: - Burst Traffic Tests

    func testBurstTrafficPattern() async throws {
        // Simulate burst traffic: many requests in quick succession
        let burstSize = 10

        // First burst
        for _ in 0..<burstSize {
            try await rateLimiter.acquire()
        }

        // Should be at limit
        await assertRateLimitExceeded({ try await self.rateLimiter.acquire() })

        // Wait and make second burst
        try await Task.sleep(nanoseconds: 1_100_000_000)

        for _ in 0..<burstSize {
            try await rateLimiter.acquire()
        }

        // Should be at limit again
        await assertRateLimitExceeded({ try await self.rateLimiter.acquire() })
    }

    func testGradualTrafficPattern() async throws {
        // Make requests gradually over time
        for _ in 0..<3 {
            try await rateLimiter.acquire()
            try await Task.sleep(nanoseconds: 100_000_000) // 0.1 seconds between requests
        }

        let stats1 = await rateLimiter.getUsageStats()
        XCTAssertEqual(stats1.current, 3)

        // Wait for first requests to expire
        try await Task.sleep(nanoseconds: 1_000_000_000)

        // Should be able to make more requests
        for _ in 0..<7 {
            try await rateLimiter.acquire()
        }

        // Should be at limit
        await assertRateLimitExceeded({ try await self.rateLimiter.acquire() })
    }

    // MARK: - Table-Driven Tests

    func testRateLimitingScenarios() async throws {
        struct RateLimitScenario {
            let maxRequests: Int
            let timeWindow: TimeInterval
            let requestPattern: [TimeInterval]
            let expectedSuccesses: Int
            let description: String
        }

        let scenarios: [RateLimitScenario] = [
            RateLimitScenario(
                maxRequests: 5,
                timeWindow: 1.0,
                requestPattern: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5],
                expectedSuccesses: 5,
                description: "Basic rate limiting - first 5 succeed, 6th fails"
            ),
            RateLimitScenario(
                maxRequests: 10,
                timeWindow: 2.0,
                requestPattern: [0.0, 0.5, 1.0, 1.5, 2.1],
                expectedSuccesses: 5,
                description: "Requests spanning window boundary"
            ),
            RateLimitScenario(
                maxRequests: 3,
                timeWindow: 0.5,
                requestPattern: [0.0, 0.1, 0.2, 0.6],
                expectedSuccesses: 4,
                description: "Window expiration allows new requests"
            )
        ]

        for scenario in scenarios {
            let limiter = MCPRateLimiter(maxRequests: scenario.maxRequests, perTimeWindow: scenario.timeWindow)
            var successCount = 0
            var failureCount = 0

            for delay in scenario.requestPattern {
                if delay > 0 {
                    try await Task.sleep(nanoseconds: UInt64(delay * 1_000_000_000))
                }

                do {
                    try await limiter.acquire()
                    successCount += 1
                } catch {
                    failureCount += 1
                }
            }

            XCTAssertEqual(
                successCount,
                scenario.expectedSuccesses,
                "\(scenario.description): expected \(scenario.expectedSuccesses) successes, got \(successCount)"
            )

            // Reset for next scenario
            await limiter.reset()
        }
    }

    // MARK: - Performance Tests

    func testRateLimiterPerformance() async throws {
        // Test that rate limiting doesn't add significant overhead
        measure {
            let limiter = MCPRateLimiter(maxRequests: 1000, perTimeWindow: 1.0)

            // Make 100 requests
            Task {
                for _ in 0..<100 {
                    try? await limiter.acquire()
                }
            }
        }
    }

    func testConcurrentRateLimiterPerformance() async throws {
        measure {
            let limiter = MCPRateLimiter(maxRequests: 1000, perTimeWindow: 1.0)

            Task {
                await withTaskGroup(of: Void.self) { group in
                    for _ in 0..<100 {
                        group.addTask {
                            try? await limiter.acquire()
                        }
                    }
                }
            }
        }
    }

    // MARK: - Thread Safety Tests

    func testThreadSafeConcurrentAccess() async throws {
        // Test that the rate limiter is thread-safe under high concurrency
        let limiter = MCPRateLimiter(maxRequests: 100, perTimeWindow: 1.0)
        let numberOfTasks = 200

        var successCount = 0
        var failureCount = 0

        await withTaskGroup(of: Bool.self) { group in
            for _ in 0..<numberOfTasks {
                group.addTask {
                    do {
                        try await limiter.acquire()
                        return true
                    } catch {
                        return false
                    }
                }
            }

            for await success in group {
                if success {
                    successCount += 1
                } else {
                    failureCount += 1
                }
            }
        }

        // Exactly 100 should succeed (the limit), 100 should fail
        XCTAssertEqual(successCount, 100, "Exactly 100 requests should succeed")
        XCTAssertEqual(failureCount, 100, "Exactly 100 requests should be rate-limited")
    }

    // MARK: - Actor Isolation Tests

    func testActorSerialization() async throws {
        // MCPRateLimiter is an actor - test that it properly serializes access
        let limiter = MCPRateLimiter(maxRequests: 5, perTimeWindow: 1.0)

        // These should be serialized by the actor
        async let request1: Void = { try await limiter.acquire() }()
        async let request2: Void = { try await limiter.acquire() }()
        async let request3: Void = { try await limiter.acquire() }()
        async let request4: Void = { try await limiter.acquire() }()
        async let request5: Void = { try await limiter.acquire() }()

        // All should succeed
        try await request1
        try await request2
        try await request3
        try await request4
        try await request5

        // 6th should fail
        await assertRateLimitExceeded({ try await limiter.acquire() })
    }

    private func assertRateLimitExceeded(
        _ operation: @escaping () async throws -> Void,
        file: StaticString = #filePath,
        line: UInt = #line
    ) async {
        do {
            try await operation()
            XCTFail("Expected rateLimitExceeded error", file: file, line: line)
        } catch {
            guard let mcpError = error as? MCPError else {
                XCTFail("Error should be MCPError", file: file, line: line)
                return
            }

            if case MCPError.rateLimitExceeded = mcpError {
                // Expected
            } else {
                XCTFail("Expected rateLimitExceeded error", file: file, line: line)
            }
        }
    }
}
