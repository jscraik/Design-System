// swift-tools-version: 5.9
// Version: 0.0.0
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "ChatUIFoundation",
    platforms: [
        .iOS(.v15),
        .macOS(.v13),
        .visionOS(.v1)
    ],
    products: [
        .library(
            name: "ChatUIFoundation",
            targets: ["ChatUIFoundation"]
        ),
    ],
    dependencies: [
        // No dependencies - foundation layer
    ],
    targets: [
        .target(
            name: "ChatUIFoundation",
            dependencies: [],
            resources: [
                .process("Resources")
            ]
        ),
        .testTarget(
            name: "ChatUIFoundationTests",
            dependencies: ["ChatUIFoundation"]
        ),
    ]
)