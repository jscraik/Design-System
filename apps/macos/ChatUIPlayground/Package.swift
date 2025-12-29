// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "ChatUIPlayground",
    platforms: [
        .macOS(.v13)
    ],
    dependencies: [
        .package(path: "../../swift/ChatUIFoundation"),
        .package(path: "../../swift/ChatUIComponents"),
        .package(path: "../../swift/ChatUIThemes"),
        .package(path: "../../swift/ChatUIShellChatGPT")
    ],
    targets: [
        .executableTarget(
            name: "ChatUIPlayground",
            dependencies: [
                .product(name: "ChatUIFoundation", package: "ChatUIFoundation"),
                .product(name: "ChatUIComponents", package: "ChatUIComponents"),
                .product(name: "ChatUIThemes", package: "ChatUIThemes"),
                .product(name: "ChatUIShellChatGPT", package: "ChatUIShellChatGPT")
            ]
        )
    ]
)
