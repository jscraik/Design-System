// swift-tools-version: 5.9
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "ComponentGallery",
    platforms: [
        .macOS(.v13),
        .iOS(.v16)
    ],
    products: [
        .executable(
            name: "ComponentGallery",
            targets: ["ComponentGallery"]
        )
    ],
    dependencies: [
        .package(path: "../../../swift/ChatUIFoundation"),
        .package(path: "../../../swift/ChatUIComponents"),
        .package(path: "../../../swift/ChatUIThemes"),
        .package(path: "../../../swift/ChatUIShellChatGPT")
    ],
    targets: [
        .executableTarget(
            name: "ComponentGallery",
            dependencies: [
                "ChatUIFoundation",
                "ChatUIComponents",
                "ChatUIThemes",
                "ChatUIShellChatGPT"
            ],
            path: "Sources"
        ),
        .testTarget(
            name: "ComponentGalleryTests",
            dependencies: ["ComponentGallery"],
            path: "Tests"
        )
    ]
)
