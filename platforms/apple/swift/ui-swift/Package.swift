// swift-tools-version: 5.9
// Version: 0.0.1
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "AStudioSwift",
    platforms: [
        .macOS(.v13)
    ],
    products: [
        .library(
            name: "AStudioSwift",
            targets: ["AStudioSwift"]
        ),
    ],
    dependencies: [
        // Add dependencies here if needed
    ],
    targets: [
        .target(
            name: "AStudioSwift",
            dependencies: []
        ),
        .testTarget(
            name: "AStudioSwiftTests",
            dependencies: ["AStudioSwift"]
        ),
    ]
)