// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "ChatUIApp",
    platforms: [
        .macOS(.v13)
    ],
    products: [
        .executable(
            name: "ChatUIApp",
            targets: ["ChatUIApp"]
        )
    ],
    dependencies: [
        .package(path: "../../../swift/ChatUIFoundation"),
        .package(path: "../../../swift/ChatUIComponents"),
        .package(path: "../../../swift/ChatUIThemes"),
        .package(path: "../../../swift/ChatUIShellChatGPT"),
        .package(path: "../../../swift/ChatUIMCP"),
        .package(path: "../../../swift/ChatUISystemIntegration")
    ],
    targets: [
        .executableTarget(
            name: "ChatUIApp",
            dependencies: [
                "ChatUIFoundation",
                "ChatUIComponents",
                "ChatUIThemes",
                "ChatUIShellChatGPT",
                "ChatUIMCP",
                "ChatUISystemIntegration"
            ],
            path: "Sources"
        )
    ]
)
