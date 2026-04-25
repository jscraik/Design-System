import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const PROFESSIONAL_FINISH_DOC = "docs/design-system/PROFESSIONAL_FINISH_REVIEW.md";
const ENHANCED_CSS = "packages/tokens/src/enhanced.css";

const passthroughArgs = process.argv.slice(2);

const EXEMPLAR_STORY_IDS = [
  "components-chat-chat-sidebar--defaultopen",
  "components-chat-chat-sidebar--loading",
  "components-chat-chat-sidebar--error-state",
  "components-chat-chat-sidebar-history--default-selected",
  "components-chat-new-project-modal--default",
  "components-chat-project-settings-modal--project-only",
  "components-chat-chat-ui-root--default",
  "components-chat-chat-ui-root--loading-overlay",
  "components-chat-chat-ui-root--error-overlay",
  "components-chat-chat-ui-root--full-overlay-open",
  "components-chat-chat-shell--split-sidebar",
  "components-settings-apps-panel--default",
  "components-settings-apps-panel--loading",
  "components-settings-apps-panel--empty",
  "components-settings-apps-panel--error",
  "components-settings-manage-apps-panel--default",
  "components-settings-manage-apps-panel--loading",
  "components-settings-manage-apps-panel--empty",
  "components-settings-manage-apps-panel--error",
  "components-settings-notifications-panel--default",
  "components-settings-notifications-panel--loading",
  "components-settings-notifications-panel--empty",
  "components-settings-notifications-panel--error",
  "components-settings-security-panel--default",
  "components-settings-security-panel--loading",
  "components-settings-security-panel--busy",
  "components-settings-security-panel--error",
  "components-settings-data-controls-panel--default",
  "components-settings-data-controls-panel--loading",
  "components-settings-data-controls-panel--busy",
  "components-settings-data-controls-panel--error",
];

const FOCUS_STORY_IDS = [
  "components-settings-setting-toggle--default",
  "components-chat-chat-sidebar--open-project-settings-flow",
  "components-chat-chat-ui-root--default",
];

const GOLD_STANDARD_REFERENCES = [
  "components-settings-apps-panel--default",
  "components-settings-apps-panel--loading",
  "components-settings-apps-panel--empty",
  "components-settings-apps-panel--error",
  "components-chat-chat-ui-root--default",
  "components-chat-chat-ui-root--loading-overlay",
  "components-chat-chat-ui-root--error-overlay",
  "chat page - default state",
  "harness page",
  "template browser page",
  "template widget page",
];

function assertIncludes(content, needle, source) {
  if (!content.includes(needle)) {
    const preview = content.slice(0, 200);
    throw new Error(
      `${source} is missing required professional-finish marker: ${needle}\n` +
      `Content preview: ${preview}...`
    );
  }
}

function checkProfessionalFinishContract() {
  const reviewDoc = readFileSync(PROFESSIONAL_FINISH_DOC, "utf8");
  const enhancedCss = readFileSync(ENHANCED_CSS, "utf8");

  for (const marker of [
    "## Review Rubric",
    "## Gold-standard Reference Set",
    "Hierarchy",
    "Spacing Rhythm",
    "Focus Quality",
    "State Quality",
    "Motion Restraint",
  ]) {
    assertIncludes(reviewDoc, marker, PROFESSIONAL_FINISH_DOC);
  }

  for (const reference of GOLD_STANDARD_REFERENCES) {
    assertIncludes(reviewDoc, reference, PROFESSIONAL_FINISH_DOC);
  }

  if (/(^|[\s,{]):focus-visible\s*\{/.test(enhancedCss)) {
    throw new Error(
      `${ENHANCED_CSS} must not reintroduce a bare global :focus-visible rule. Use .ds-focusable or [data-ds-focusable].`,
    );
  }

  for (const selector of [".ds-focusable:focus-visible", "[data-ds-focusable]:focus-visible"]) {
    assertIncludes(enhancedCss, selector, ENHANCED_CSS);
  }
}

const checks = [
  {
    label: "Professional finish contract",
    run: checkProfessionalFinishContract,
  },
  {
    label: "Workspace library build",
    command: ["pnpm", "build:lib"],
  },
  {
    label: "Storybook settings exemplar visuals",
    command: ["pnpm", "test:visual:storybook", ...passthroughArgs],
    env: {
      PLAYWRIGHT_STORYBOOK_STORY_IDS: EXEMPLAR_STORY_IDS.join(","),
      PLAYWRIGHT_STORYBOOK_INTERACTIVE_STORY_IDS: FOCUS_STORY_IDS.join(","),
    },
  },
  {
    label: "Web app exemplar visuals",
    command: [
      "pnpm",
      "test:visual:web",
      "--",
      "--grep",
      "chat page - default state|harness page|template (browser|widget) page",
      ...passthroughArgs,
    ],
  },
];

let failed = false;

for (const check of checks) {
  console.log(`\n== ${check.label} ==`);

  let result = { status: 0 };

  if (check.run) {
    console.log("$ professional-finish contract precheck");
    try {
      check.run();
    } catch (error) {
      result = { status: 1 };
      console.error(error instanceof Error ? error.message : error);
    }
  } else {
    console.log(`$ ${check.command.join(" ")}`);
    result = spawnSync(check.command[0], check.command.slice(1), {
      cwd: process.cwd(),
      env: {
        ...process.env,
        ...check.env,
      },
      stdio: "inherit",
    });
  }

  if (result.status !== 0) {
    failed = true;
    console.error(`FAIL: ${check.label}`);
    break;
  }

  console.log(`PASS: ${check.label}`);
}

if (failed) {
  process.exit(1);
}
