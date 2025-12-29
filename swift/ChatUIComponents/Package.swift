// swift-tools-version: 5.9
// Version: 0.0.0
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "ChatUIComponents",
    platforms: [
        .iOS(.v15),
        .macOS(.v13),
        .visionOS(.v1)
    ],
    products: [
        .library(
            name: "ChatUIComponents",
            targets: ["ChatUIComponents"]
        ),
    ],
    dependencies: [
        .package(path: "../ChatUIFoundation"),
        .package(path: "../ChatUIThemes"),
        .package(path: "../ChatUITestSupport"),
        .package(url: "https://github.com/toastersocks/SwiftCheck.git", from: "0.13.1")
    ],
    targets: [
        .target(
            name: "ChatUIComponents",
            dependencies: ["ChatUIFoundation", "ChatUIThemes"]
        ),
        .testTarget(
            name: "ChatUIComponentsTests",
            dependencies: ["ChatUIComponents", "ChatUITestSupport", "SwiftCheck"]
        ),
    ]
)
