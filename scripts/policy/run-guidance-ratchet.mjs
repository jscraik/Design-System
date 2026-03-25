import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();

const RATCHET_PREFIXES = [
  "packages/ui/src/app/settings/",
  "packages/ui/src/app/chat/AttachmentMenu/AttachmentMenu.stories.tsx",
  "packages/ui/src/app/chat/AttachmentMenu/AttachmentMenu.tsx",
  "packages/ui/src/app/chat/ChatInput/ChatInput.stories.tsx",
  "packages/ui/src/app/chat/ChatInput/ChatInput.tsx",
  "packages/ui/src/app/chat/ChatHeader/ChatHeader.stories.tsx",
  "packages/ui/src/app/chat/ChatHeader/ChatHeader.tsx",
  "packages/ui/src/app/chat/ChatMessages/ChatMessages.stories.tsx",
  "packages/ui/src/app/chat/ChatMessages/ChatMessages.tsx",
  "packages/ui/src/app/chat/ChatShell/ChatShell.stories.tsx",
  "packages/ui/src/app/chat/ChatVariants/ChatVariants.tsx",
  "packages/ui/src/app/chat/ChatView/ChatView.tsx",
  "packages/ui/src/app/chat/ChatUIRoot/ChatUIRoot.stories.tsx",
  "packages/ui/src/app/chat/ChatUIRoot/ChatUIRoot.tsx",
  "packages/ui/src/app/chat/compose/ComposeInstructionsPanel/ComposeInstructionsPanel.tsx",
  "packages/ui/src/app/chat/compose/ProEditConfigModal/ProEditConfigModal.tsx",
  "packages/ui/src/app/chat/compose/PromptBuilderSection/PromptBuilderSection.tsx",
  "packages/ui/src/app/chat/ComposeView/ComposeView.stories.tsx",
  "packages/ui/src/app/chat/ComposeView/ComposeView.tsx",
  "packages/ui/src/app/modals/DiscoverySettingsModal/DiscoverySettingsModal.stories.tsx",
  "packages/ui/src/app/modals/DiscoverySettingsModal/DiscoverySettingsModal.tsx",
  "packages/ui/src/app/modals/IconPickerModal/IconPickerModal.stories.tsx",
  "packages/ui/src/app/modals/IconPickerModal/IconPickerModal.tsx",
  "packages/ui/src/app/modals/SettingsModal/SettingsModal.stories.tsx",
  "packages/ui/src/app/modals/SettingsModal/SettingsModal.tsx",
  "packages/ui/src/app/modals/settings/",
  "packages/ui/src/app/chat/ChatSidebar/ChatSidebar.stories.tsx",
  "packages/ui/src/app/chat/ChatSidebar/ChatSidebar.tsx",
  "packages/ui/src/app/chat/ChatSidebar/components/ChatSidebarHistory/ChatSidebarHistory.stories.tsx",
  "packages/ui/src/app/chat/ChatSidebar/components/ChatSidebarHistory/ChatSidebarHistory.tsx",
  "packages/ui/src/app/chat/ChatSidebar/modals/NewProjectModal/NewProjectModal.stories.tsx",
  "packages/ui/src/app/chat/ChatSidebar/modals/NewProjectModal/NewProjectModal.tsx",
  "packages/ui/src/app/chat/ChatSidebar/modals/ProjectSettingsModal/ProjectSettingsModal.stories.tsx",
  "packages/ui/src/app/chat/ChatSidebar/modals/ProjectSettingsModal/ProjectSettingsModal.tsx",
  "packages/ui/src/components/ui/forms/",
  "packages/ui/src/components/ui/navigation/NavigationMenu/fallback/NavigationMenu.tsx",
  "packages/ui/src/components/ui/navigation/sidebar/fallback/Sidebar.tsx",
  "packages/ui/src/components/ui/navigation/tabs/fallback/Tabs.tsx",
  "packages/ui/src/components/ui/navigation/ModeSelector/ModeSelector.tsx",
  "packages/ui/src/components/ui/navigation/ModelSelector/ModelSelector.tsx",
  "packages/ui/src/components/ui/base/IconButton/IconButton.tsx",
  "packages/ui/src/components/ui/base/button/fallback/Button.tsx",
  "packages/ui/src/components/ui/base/InputOTP/InputOTP.tsx",
  "packages/ui/src/components/ui/base/RadioGroup/fallback/RadioGroup.tsx",
  "packages/ui/src/components/ui/base/ScrollArea/fallback/ScrollArea.tsx",
  "packages/ui/src/components/ui/base/checkbox/fallback/Checkbox.tsx",
  "packages/ui/src/components/ui/base/input/input.tsx",
  "packages/ui/src/components/ui/base/select/fallback/Select.tsx",
  "packages/ui/src/components/ui/base/switch/fallback/Switch.tsx",
  "packages/ui/src/components/ui/base/table/table.tsx",
  "packages/ui/src/components/ui/base/textarea/textarea.tsx",
  "packages/ui/src/components/ui/data-display/card/card.tsx",
  "packages/ui/src/components/ui/feedback/ErrorBoundary/ErrorBoundary.tsx",
  "packages/ui/src/components/ui/feedback/toast/toast.tsx",
  "packages/ui/src/components/ui/overlays/command/command.tsx",
  "packages/ui/src/components/ui/overlays/drawer/drawer.tsx",
  "packages/ui/src/components/ui/overlays/modal/modal.tsx",
  "packages/ui/src/components/ui/overlays/tooltip/fallback/Tooltip.tsx",
  "packages/ui/src/storybook/_holding/component-stories/Chart.stories.tsx",
  "packages/ui/src/storybook/_holding/component-stories/IconButton.stories.tsx",
  "packages/ui/src/storybook/_holding/component-stories/MessageActions.stories.tsx",
  "packages/ui/src/storybook/_holding/component-stories/NavigationMenu.stories.tsx",
  "packages/ui/src/storybook/_holding/docs/APIReference.mdx",
  "packages/ui/src/storybook/_holding/docs/DesignSystem.mdx",
  "packages/ui/src/storybook/_holding/docs/GettingStarted.mdx",
  "packages/ui/src/storybook/_holding/docs/Migration.mdx",
  "packages/ui/src/storybook/_holding/docs/Patterns.mdx",
  "packages/ui/src/storybook/_holding/docs/QuickStart.mdx",
  "platforms/web/apps/web/src/pages/",
];

function run(command, { allowFailure = false } = {}) {
  const result = spawnSync(command[0], command.slice(1), {
    cwd: ROOT,
    env: process.env,
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });

  if (!allowFailure && result.status !== 0) {
    const message = (result.stderr || result.stdout || "").trim();
    throw new Error(message || `Command failed: ${command.join(" ")}`);
  }

  return result;
}

function normalize(filePath) {
  return filePath.replace(/\\/g, "/");
}

function getBaseRefCandidate() {
  if (process.env.DESIGN_SYSTEM_RATCHET_BASE_REF) {
    return process.env.DESIGN_SYSTEM_RATCHET_BASE_REF;
  }

  if (process.env.GITHUB_BASE_REF) {
    return `origin/${process.env.GITHUB_BASE_REF}`;
  }

  return "origin/main";
}

function readDiffFiles(command) {
  const result = run(command, { allowFailure: true });
  if (result.status !== 0) {
    return [];
  }

  return result.stdout
    .split("\n")
    .map((entry) => normalize(entry.trim()))
    .filter(Boolean);
}

function readUntrackedFiles() {
  return readDiffFiles(["git", "ls-files", "--others", "--exclude-standard"]);
}

function resolveMergeBaseDiffFiles() {
  const mergeBase = run(["git", "merge-base", "HEAD", getBaseRefCandidate()], {
    allowFailure: true,
  });
  if (mergeBase.status !== 0) {
    return [];
  }

  const baseSha = mergeBase.stdout.trim();
  if (!baseSha) {
    return [];
  }

  return readDiffFiles(["git", "diff", "--name-only", "--diff-filter=ACMR", `${baseSha}...HEAD`]);
}

function collectTouchedFiles() {
  const touched = new Set([
    ...resolveMergeBaseDiffFiles(),
    ...readDiffFiles(["git", "diff", "--name-only", "--diff-filter=ACMR"]),
    ...readDiffFiles(["git", "diff", "--cached", "--name-only", "--diff-filter=ACMR"]),
    ...readUntrackedFiles(),
  ]);

  return Array.from(touched).sort();
}

function isRatchetedPath(filePath) {
  return RATCHET_PREFIXES.some((prefix) => filePath.startsWith(prefix));
}

function main() {
  const touchedFiles = collectTouchedFiles().filter(isRatchetedPath);

  if (touchedFiles.length === 0) {
    console.log("PASS touched-file design-system ratchet");
    console.log("- No touched files are currently inside the ratcheted surface set.");
    process.exit(0);
  }

  const guidance = run([
    "node",
    "packages/design-system-guidance/dist/cli.js",
    "check",
    ".",
    "--ci",
    "--json",
  ]);
  const parsed = JSON.parse(guidance.stdout);

  const touchedSet = new Set(touchedFiles.map((filePath) => path.resolve(ROOT, filePath)));
  const violations = parsed.violations.filter(
    (violation) => violation.level === "warn" && violation.file && touchedSet.has(path.resolve(violation.file)),
  );

  if (violations.length === 0) {
    console.log("PASS touched-file design-system ratchet");
    console.log(`- Checked ${touchedFiles.length} touched file(s) in the ratcheted surface set.`);
    for (const filePath of touchedFiles) {
      console.log(`- clean: ${filePath}`);
    }
    process.exit(0);
  }

  console.log("FAIL touched-file design-system ratchet");
  console.log(
    `- ${violations.length} warning violation(s) remain in ${new Set(violations.map((item) => item.file)).size} touched ratcheted file(s).`,
  );
  console.log("- Remediation: clear these warn-level guidance violations before expanding scope further.");

  for (const violation of violations) {
    const relativeFile = normalize(path.relative(ROOT, violation.file));
    const location = violation.line ? `${relativeFile}:${violation.line}` : relativeFile;
    console.log(`- [${violation.ruleId}] ${violation.message} (${location})`);
  }

  process.exit(1);
}

main();
