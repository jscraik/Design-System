// swift-tools-version: 5.9
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "SecurityTests",
    platforms: [
        .macOS(.v13)
    ],
    dependencies: [
        // Add dependencies for security testing
        .package(
            url: "https://github.com/apple/swift-crypto.git",
            from: "3.0.0"
        ),
        .package(
            url: "https://github.com/pointfreeco/swift-snapshot-testing.git",
            from: "1.0.0"
        )
    ],
    targets: [
        // Security test target
        .testTarget(
            name: "SecurityTests",
            dependencies: [
                "AStudioFoundation",
                "AStudioComponents",
                .product(name: "Crypto", package: "swift-crypto"),
                .product(name: "SnapshotTesting", package: "swift-snapshot-testing")
            ],
            path: ".",
            exclude: [
                "README.md",
                "Package.swift"
            ],
            sources: [
                "SecurityTestCase.swift",
                "InputValidationTests.swift",
                "AuthenticationTests.swift",
                "AuthorizationTests.swift"
            ],
            resources: [
                // Test data fixtures can go here
            ],
            swiftSettings: [
                // Enable warnings as errors for security tests
                .unsafeFlags(["-warnings-as-errors"])
            ]
        )
    ]
)
