# Ralph Gold Anchor

Task: 3 - Replace ProjectSettingsModal overlay with ModalDialog

Acceptance criteria:
- Component compiles without errors
- Modal opens and closes correctly
- Focus is trapped inside the modal
- Escape key closes modal

Repo reality:
- branch: main
- git status --porcelain:
```
M .github/workflows/ci.yml
 M .ralph/prd.json
 M .ralph/progress.md
 M .spec/PROJECT_REVIEW_REPORT.md
 M .spec/spec-2026-01-15-component-creation-governance.md
 M .spec/tech-spec-2026-01-15-component-creation-governance.md
 M CONTRIBUTING.md
 M README.md
 M docs/BUILD_PIPELINE.md
 M docs/TEST_PLAN.md
 M docs/work/work_outstanding.md
 M package.json
 M platforms/apple/apps/macos/AStudioApp/Package.swift
 M platforms/apple/apps/macos/AStudioPlayground
 M platforms/apple/swift/AStudioComponents/Package.swift
 M platforms/apple/swift/AStudioComponents/Sources/AStudioComponents/Templates/TemplateRegistry.swift
 M platforms/apple/swift/AStudioFoundation/Package.swift
 M platforms/apple/swift/AStudioFoundation/Sources/AStudioFoundation/DesignTokens.swift
 M platforms/apple/swift/AStudioFoundation/Sources/AStudioFoundation/Icons/ChatGPTIconVectors.swift
 M platforms/apple/swift/AStudioFoundation/Sources/AStudioFoundation/Icons/ChatGPTIcons.swift
 M platforms/apple/swift/AStudioMCP/Package.swift
 M platforms/apple/swift/AStudioShellChatGPT/Package.swift
 M platforms/apple/swift/AStudioSystemIntegration/Package.swift
 M platforms/apple/swift/AStudioTestSupport/Package.swift
 M platforms/apple/swift/AStudioThemes/Package.swift
 M platforms/apple/swift/ui-swift/Package.swift
 M platforms/web/apps/storybook/.storybook/main.ts
 M platforms/web/apps/storybook/package.json
 M platforms/web/apps/storybook/vitest.config.ts
 M pnpm-lock.yaml
 M scripts/build-pipeline.mjs
 M scripts/build-pipeline.test.js
 M scripts/build-pipeline.test.mjs
 M scripts/version-sync.mjs
?? .agent/EXECPLAN-agent-browser-smoke-tests.md
?? .ralph/AGENTS.md
?? .ralph/AUDIENCE_JTBD.md
?? .ralph/FEEDBACK.md
?? .ralph/PRD.md
?? .ralph/PROMPT.md
?? .ralph/PROMPT_build.md
?? .ralph/PROMPT_judge.md
?? .ralph/PROMPT_plan.md
?? .ralph/PROMPT_review.md
?? .ralph/attempts/
?? .ralph/context/
?? .ralph/loop.sh
?? .ralph/ralph.toml
?? .ralph/receipts/
?? .ralph/state.json
?? .spec/ExecPlan.md
?? .spec/spec-2026-01-19-modal-a11y-mapbox-token.md
?? mise.toml
?? scripts/agent-browser/
```
- git diff --stat:
```
.github/workflows/ci.yml                           |    60 +-
 .ralph/prd.json                                    |     4 +-
 .ralph/progress.md                                 |     3 +
 .spec/PROJECT_REVIEW_REPORT.md                     |    11 +
 ...pec-2026-01-15-component-creation-governance.md |     8 +
 ...pec-2026-01-15-component-creation-governance.md |    12 +
 CONTRIBUTING.md                                    |     5 +-
 README.md                                          |     9 +-
 docs/BUILD_PIPELINE.md                             |    12 +-
 docs/TEST_PLAN.md                                  |   115 +-
 docs/work/work_outstanding.md                      |    30 +-
 package.json                                       |     7 +
 .../apple/apps/macos/AStudioApp/Package.swift      |     2 +-
 platforms/apple/apps/macos/AStudioPlayground       |     0
 .../apple/swift/AStudioComponents/Package.swift    |     4 +-
 .../Templates/TemplateRegistry.swift               |     5 +-
 .../apple/swift/AStudioFoundation/Package.swift    |     4 +-
 .../Sources/AStudioFoundation/DesignTokens.swift   |     2 +-
 .../Icons/ChatGPTIconVectors.swift                 |    10 +-
 .../AStudioFoundation/Icons/ChatGPTIcons.swift     |     4 +-
 platforms/apple/swift/AStudioMCP/Package.swift     |     2 +-
 .../apple/swift/AStudioShellChatGPT/Package.swift  |     2 +-
 .../swift/AStudioSystemIntegration/Package.swift   |     2 +-
 .../apple/swift/AStudioTestSupport/Package.swift   |     2 +-
 platforms/apple/swift/AStudioThemes/Package.swift  |     4 +-
 platforms/apple/swift/ui-swift/Package.swift       |     2 +-
 platforms/web/apps/storybook/.storybook/main.ts    |    16 +-
 platforms/web/apps/storybook/package.json          |    15 +-
 platforms/web/apps/storybook/vitest.config.ts      |    64 +-
 pnpm-lock.yaml                                     | 16520 +++++++------------
 scripts/build-pipeline.mjs                         |   109 +-
 scripts/build-pipeline.test.js                     |    24 +-
 scripts/build-pipeline.test.mjs                    |    14 +-
 scripts/version-sync.mjs                           |    63 +
 34 files changed, 6378 insertions(+), 10768 deletions(-)
```

Constraints:
- Work on exactly ONE task per iteration
- Do not claim completion without passing gates
- Prefer minimal diffs; keep repo clean

