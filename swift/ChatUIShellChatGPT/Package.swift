// swift-tools-version: 5.9
// Version: 0.0.0
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "ChatUIShellChatGPT",
    platforms: [
        .iOS(.v15),
        .macOS(.v13),
        .visionOS(.v1)
    ],
    products: [
        .library(
            name: "ChatUIShellChatGPT",
            targets: ["ChatUIShellChatGPT"]
        ),
    ],
    dependencies: [
        .package(path: "../ChatUIFoundation"),
        .package(path: "../ChatUIComponents"),
        .package(path: "../ChatUIThemes"),
        .package(path: "../ChatUITestSupport")
    ],
    targets: [
        .target(
            name: "ChatUIShellChatGPT",
            dependencies: ["ChatUIFoundation", "ChatUIComponents", "ChatUIThemes"]
        ),
        .testTarget(
            name: "ChatUIShellChatGPTTests",
            dependencies: ["ChatUIShellChatGPT", "ChatUITestSupport"]
        ),
    ]
)
