// swift-tools-version: 5.9
// Version: 0.0.0
import PackageDescription

let package = Package(
    name: "ChatUITestSupport",
    platforms: [
        .iOS(.v15),
        .macOS(.v13),
        .visionOS(.v1)
    ],
    products: [
        .library(
            name: "ChatUITestSupport",
            targets: ["ChatUITestSupport"]
        ),
    ],
    dependencies: [
        .package(path: "../ChatUIThemes"),
        .package(
            url: "https://github.com/pointfreeco/swift-snapshot-testing.git",
            from: "1.18.7"
        )
    ],
    targets: [
        .target(
            name: "ChatUITestSupport",
            dependencies: [
                "ChatUIThemes",
                .product(name: "SnapshotTesting", package: "swift-snapshot-testing")
            ]
        ),
    ]
)
