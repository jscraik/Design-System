// swift-tools-version: 6.2
// Version: 0.0.1
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "AStudioFoundation",
    platforms: [
        .iOS(.v15),
        .macOS(.v13),
        .visionOS(.v1)
    ],
    products: [
        .library(
            name: "AStudioFoundation",
            targets: ["AStudioFoundation"]
        ),
    ],
    dependencies: [
        // No dependencies - foundation layer
    ],
    targets: [
        .target(
            name: "AStudioFoundation",
            dependencies: [],
            resources: [
                .process("Resources")
            ]
        ),
        .testTarget(
            name: "AStudioFoundationTests",
            dependencies: ["AStudioFoundation"]
        ),
    ]
)