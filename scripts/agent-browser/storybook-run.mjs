#!/usr/bin/env node
/**
 * agent-browser Storybook smoke runner
 *
 * Runs deterministic smoke validation against a running Storybook instance by:
 *  - Fetching `${BASE_URL}/index.json`
 *  - Selecting a small set of stories (default max 10) likely to exercise Radix overlays
 *  - Opening each story iframe, capturing snapshot + full screenshot
 *  - Clicking an "open/show" button when present, capturing another snapshot + screenshot
 *
 * Usage:
 *   pnpm test:agent-browser:storybook
 *
 * Environment:
 *   AGENT_BROWSER_STORYBOOK_BASE_URL=http://127.0.0.1:6006
 *   AGENT_BROWSER_STORYBOOK_MAX_STORIES=10
 *   AGENT_BROWSER_STORYBOOK_STORY_GREP="Dialog|Popover"
 */

import { spawn } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "../..");

const BASE_URL = process.env.AGENT_BROWSER_STORYBOOK_BASE_URL || "http://127.0.0.1:6006";
const SESSION_NAME = "astudio-storybook-smoke";
const RESULTS_DIR =
  process.env.AGENT_BROWSER_STORYBOOK_RESULTS_DIR ||
  join(rootDir, "test-results", "agent-browser", "storybook");
const SCREENSHOTS_DIR = join(RESULTS_DIR, "screenshots");
const SNAPSHOTS_DIR = join(RESULTS_DIR, "snapshots");

const MAX_STORIES = Number.parseInt(process.env.AGENT_BROWSER_STORYBOOK_MAX_STORIES || "10", 10);

const HEURISTIC_OVERLAY_RE =
  /(Dialog|AlertDialog|Popover|Tooltip|Dropdown|Select|Combobox|Menu|Sheet)/i;

const OPEN_BUTTON_RE = /(open|show)/i;

[RESULTS_DIR, SCREENSHOTS_DIR, SNAPSHOTS_DIR].forEach((dir) => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
});

const cliPath = existsSync(join(rootDir, "node_modules", ".bin", "agent-browser"))
  ? join(rootDir, "node_modules", ".bin", "agent-browser")
  : "agent-browser";

function safeBasename(input) {
  return String(input).replace(/[^a-z0-9_-]/gi, "_").slice(0, 160);
}

function runAgentBrowser(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cliPath, args, {
      stdio: ["ignore", "pipe", "pipe"],
      cwd: rootDir,
    });

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    proc.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    proc.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(
          new Error(`agent-browser exited with code ${code}\\nstdout: ${stdout}\\nstderr: ${stderr}`),
        );
      }
    });

    proc.on("error", (err) => {
      reject(new Error(`Failed to spawn agent-browser: ${err.message}`));
    });
  });
}

async function openUrl(url) {
  await runAgentBrowser(["--session", SESSION_NAME, "open", url]);
  await runAgentBrowser(["--session", SESSION_NAME, "wait", "500"]);
}

async function captureSnapshot(name) {
  const { stdout } = await runAgentBrowser(["--session", SESSION_NAME, "snapshot", "-i", "--json"]);
  const data = JSON.parse(stdout.trim());
  const snapshotPath = join(SNAPSHOTS_DIR, `${safeBasename(name)}.json`);
  writeFileSync(snapshotPath, JSON.stringify(data, null, 2));
  return data;
}

async function takeScreenshot(name) {
  const screenshotPath = join(SCREENSHOTS_DIR, `${safeBasename(name)}.png`);
  await runAgentBrowser(["--session", SESSION_NAME, "screenshot", "--full", screenshotPath]);
}

function selectRef(refs, predicate) {
  const entries = Object.entries(refs ?? {});
  for (const [key, value] of entries) {
    if (predicate(value)) {
      return key;
    }
  }
  return null;
}

function storyLabel(story) {
  const title = story?.title || story?.kind || "";
  const name = story?.name || story?.story || story?.storyName || "";
  return `${title} - ${name}`.trim();
}

function extractStories(indexJson) {
  const entries = indexJson?.entries;

  if (entries && typeof entries === "object") {
    return Object.values(entries)
      .filter((entry) => entry && typeof entry === "object")
      .filter((entry) => entry.type === "story")
      .map((entry) => ({
        id: entry.id,
        title: entry.title,
        name: entry.name,
        tags: entry.tags,
      }))
      .filter((s) => Boolean(s.id));
  }

  // Fallback for other index formats (best-effort).
  if (Array.isArray(indexJson?.stories)) {
    return indexJson.stories
      .filter((s) => s && typeof s === "object")
      .map((s) => ({
        id: s.id || s.storyId,
        title: s.title || s.kind,
        name: s.name || s.story,
        tags: s.tags,
      }))
      .filter((s) => Boolean(s.id));
  }

  return [];
}

function compileOptionalRegex(pattern) {
  if (!pattern) {
    return null;
  }
  try {
    return new RegExp(pattern, "i");
  } catch (err) {
    throw new Error(`Invalid regex in AGENT_BROWSER_STORYBOOK_STORY_GREP: ${String(err?.message || err)}`);
  }
}

async function fetchIndexJson() {
  const url = `${BASE_URL.replace(/\/$/, "")}/index.json`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch Storybook index.json: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

async function runStoryFlow(story, index) {
  const id = story.id;
  const label = storyLabel(story) || id;
  const prefix = `story-${String(index + 1).padStart(2, "0")}-${safeBasename(id)}`;

  console.log(`\\n[Storybook] ${label} (${id})`);

  const iframeUrl = `${BASE_URL.replace(/\/$/, "")}/iframe.html?id=${encodeURIComponent(id)}&viewMode=story`;

  await openUrl(iframeUrl);

  const openSnapshot = await captureSnapshot(`${prefix}-open`);
  await takeScreenshot(`${prefix}-open`);

  const buttonRef = selectRef(openSnapshot?.data?.refs, (ref) => {
    const name = ref?.name || "";
    return ref?.role === "button" && OPEN_BUTTON_RE.test(name);
  });

  if (buttonRef) {
    console.log(`  Found open/show button: @${buttonRef} — clicking`);
    await runAgentBrowser(["--session", SESSION_NAME, "click", `@${buttonRef}`]);
    await runAgentBrowser(["--session", SESSION_NAME, "wait", "500"]);
    await captureSnapshot(`${prefix}-after-open`);
    await takeScreenshot(`${prefix}-after-open`);
  } else {
    console.log("  No open/show button found; skipping click step");
  }
}

async function main() {
  console.log("Starting agent-browser Storybook smoke tests");
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Results: ${RESULTS_DIR}`);
  console.log(`Max stories: ${Number.isFinite(MAX_STORIES) ? MAX_STORIES : 10}`);
  console.log("");

  const grepPattern = process.env.AGENT_BROWSER_STORYBOOK_STORY_GREP;
  const grepRe = compileOptionalRegex(grepPattern);

  const indexJson = await fetchIndexJson();
  const allStories = extractStories(indexJson);

  if (allStories.length === 0) {
    throw new Error("No stories found in Storybook index.json (unexpected format or empty index)");
  }

  const selected = allStories
    .map((s) => ({ ...s, __label: storyLabel(s) }))
    .filter((s) => {
      const label = s.__label || "";
      if (grepRe) {
        return grepRe.test(label);
      }
      return HEURISTIC_OVERLAY_RE.test(label);
    })
    .sort((a, b) => String(a.__label).localeCompare(String(b.__label)))
    .slice(0, Number.isFinite(MAX_STORIES) ? Math.max(1, MAX_STORIES) : 10);

  if (selected.length === 0) {
    const note = grepRe
      ? `Regex filter matched no stories: ${String(grepPattern)}`
      : "Heuristic selection matched no stories (try AGENT_BROWSER_STORYBOOK_STORY_GREP to override)";
    throw new Error(note);
  }

  console.log(`Selected ${selected.length}/${allStories.length} story(ies) to validate`);
  if (grepRe) {
    console.log(`Filter: AGENT_BROWSER_STORYBOOK_STORY_GREP=${String(grepPattern)}`);
  } else {
    console.log(`Filter: heuristic (${String(HEURISTIC_OVERLAY_RE)})`);
  }

  let failed = 0;

  for (let i = 0; i < selected.length; i += 1) {
    const story = selected[i];
    try {
      await runStoryFlow(story, i);
      console.log(`PASS: ${story.__label || story.id}`);
    } catch (err) {
      failed += 1;
      console.error(`FAIL: ${story.__label || story.id}`);
      console.error(`Error: ${String(err?.message || err)}`);
    }
  }

  console.log("");
  console.log(`Results: ${selected.length - failed}/${selected.length} passed`);

  if (failed > 0) {
    console.error(`${failed} story flow(s) failed`);
    process.exit(1);
  }

  console.log("All Storybook smoke tests passed");
  process.exit(0);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});