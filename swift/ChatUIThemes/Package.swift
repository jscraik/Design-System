// swift-tools-version: 5.9
// Version: 0.0.0
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "ChatUIThemes",
    platforms: [
        .iOS(.v15),
        .macOS(.v13),
        .visionOS(.v1)
    ],
    products: [
        .library(
            name: "ChatUIThemes",
            targets: ["ChatUIThemes"]
        ),
    ],
    dependencies: [
        .package(path: "../ChatUIFoundation")
    ],
    targets: [
        .target(
            name: "ChatUIThemes",
            dependencies: ["ChatUIFoundation"]
        ),
        .testTarget(
            name: "ChatUIThemesTests",
            dependencies: ["ChatUIThemes"]
        ),
    ]
)