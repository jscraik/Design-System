// swift-tools-version: 5.9
// Version: 0.0.0
import PackageDescription

let package = Package(
    name: "ChatUIMCP",
    platforms: [
        .macOS(.v13),
        .iOS(.v15)
    ],
    products: [
        .library(
            name: "ChatUIMCP",
            targets: ["ChatUIMCP"]
        )
    ],
    dependencies: [
        .package(path: "../ChatUIFoundation"),
        .package(path: "../ChatUIComponents")
    ],
    targets: [
        .target(
            name: "ChatUIMCP",
            dependencies: [
                "ChatUIFoundation",
                "ChatUIComponents"
            ]
        ),
        .testTarget(
            name: "ChatUIMCPTests",
            dependencies: ["ChatUIMCP"]
        )
    ]
)
