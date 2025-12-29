// swift-tools-version: 5.9
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "ChatUISwift",
    platforms: [
        .macOS(.v13)
    ],
    products: [
        .library(
            name: "ChatUISwift",
            targets: ["ChatUISwift"]
        ),
    ],
    dependencies: [
        // Add dependencies here if needed
    ],
    targets: [
        .target(
            name: "ChatUISwift",
            dependencies: []
        ),
        .testTarget(
            name: "ChatUISwiftTests",
            dependencies: ["ChatUISwift"]
        ),
    ]
)