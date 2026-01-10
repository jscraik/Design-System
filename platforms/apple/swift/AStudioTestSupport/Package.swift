// swift-tools-version: 5.9
// Version: 0.0.0
import PackageDescription

let package = Package(
    name: "AStudioTestSupport",
    platforms: [
        .iOS(.v15),
        .macOS(.v13),
        .visionOS(.v1)
    ],
    products: [
        .library(
            name: "AStudioTestSupport",
            targets: ["AStudioTestSupport"]
        ),
    ],
    dependencies: [
        .package(path: "../AStudioThemes"),
        .package(
            url: "https://github.com/pointfreeco/swift-snapshot-testing.git",
            from: "1.18.7"
        )
    ],
    targets: [
        .target(
            name: "AStudioTestSupport",
            dependencies: [
                "AStudioThemes",
                .product(name: "SnapshotTesting", package: "swift-snapshot-testing")
            ]
        ),
    ]
)
