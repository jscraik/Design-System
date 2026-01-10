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
        .package(path: "../../../swift/AStudioFoundation"),
        .package(path: "../../../swift/AStudioComponents"),
        .package(path: "../../../swift/AStudioThemes"),
        .package(path: "../../../swift/AStudioShellChatGPT")
    ],
    targets: [
        .executableTarget(
            name: "ComponentGallery",
            dependencies: [
                "AStudioFoundation",
                "AStudioComponents",
                "AStudioThemes",
                "AStudioShellChatGPT"
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
