# Sparkle packaging template (SwiftPM macOS apps)

This repo uses SwiftPM for macOS apps. To enable Sparkle updates without an Xcode project:

- Prereqs: Developer ID cert, Sparkle 2.x keys (public in app, private for appcast), `SPARKLE_PUBLIC_KEY`, `SPARKLE_PRIVATE_KEY_FILE`, `SPARKLE_FEED_URL` env vars.
- Build + zip: use a script patterned after CodexSkillManager’s `Scripts/package_app.sh`:
  - `SIGNING_MODE=adhoc ARCHES="arm64 x86_64" ./Scripts/package_app.sh release`
  - Output: `YourApp.app` and zipped artifact.
- Notarize/sign: adapt `Scripts/sign-and-notarize.sh`:
  - `APP_STORE_CONNECT_API_KEY_P8=... APP_STORE_CONNECT_KEY_ID=... APP_STORE_CONNECT_ISSUER_ID=... APP_IDENTITY="Developer ID Application: ..." ./Scripts/sign-and-notarize.sh`
- Appcast: adapt `Scripts/make_appcast.sh`:
  - `SPARKLE_PRIVATE_KEY_FILE=... ./Scripts/make_appcast.sh YourApp-<version>.zip <feed-url>`
  - Commit updated `appcast.xml`.
- Versioning: keep MARKETING_VERSION/BUILD_NUMBER in `version.env` and bump both per release.
- Distribution: upload zip + appcast to your release host (GitHub Release or static hosting).

Minimal app configuration:
- Add `ENABLE_SPARKLE` compiler flag and `SUPublicEDKey`/`SUFeedURL` in Info.plist or Bundle info.
- Only enable Sparkle when the app is Developer ID–signed and keys/feed are present (gate at runtime).

Safety:
- Do not ship Sparkle enabled for unsigned local builds.
- Keep private Sparkle key outside the repo; never commit it.***
