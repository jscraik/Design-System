#!/usr/bin/env node
import { execFile } from "node:child_process";
import { access, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { extractImportSources, lineNumberAt, readText, walkFiles } from "./policy/lib/scan.mjs";

const ROOT = process.cwd();
const execFileAsync = promisify(execFile);
const CODE_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"];
const ENGINE_SRC_RELATIVE = "packages/agent-design-engine/src";
const GUIDANCE_SRC_RELATIVE = "packages/design-system-guidance/src";
const PUBLIC_ENGINE_IMPORTS = new Set([
  "@brainwav/agent-design-engine",
  "@brainwav/agent-design-engine/rules",
  "@brainwav/agent-design-engine/rules/agent-design.rules.v1.json",
]);

const PROHIBITED_GUIDANCE_IMPORTS = new Set([
  "front-matter",
  "gray-matter",
  "js-yaml",
  "marked",
  "micromark",
  "remark",
  "remark-parse",
  "unified",
  "yaml",
]);

const PROHIBITED_GUIDANCE_SYMBOLS = [
  "parseDesignContract",
  "parseDesignMarkdown",
  "parseDesignFrontmatter",
  "parseDesignYaml",
  "extractDesignBody",
  "lintDesignContract",
  "lintDesignFile",
  "diffDesignContracts",
  "exportDesignContract",
  "compareDesignProfiles",
  "compareProfileCompatibility",
  "loadRuleManifest",
];

function normalize(filePath) {
  return filePath.split(path.sep).join("/");
}

function relativePath(rootDir, filePath) {
  return normalize(path.relative(rootDir, filePath));
}

function isInsidePath(rootDir, candidate) {
  const relative = path.relative(rootDir, candidate);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function issue(rule, filePath, content, index, message) {
  return {
    rule,
    filePath,
    line: lineNumberAt(content, index),
    message,
  };
}

function resolvesToEngineSource(rootDir, filePath, source) {
  if (PUBLIC_ENGINE_IMPORTS.has(source)) return false;
  if (source === "@brainwav/agent-design-engine/src") return true;
  if (source.startsWith("@brainwav/agent-design-engine/src/")) return true;
  if (source.includes("packages/agent-design-engine/src")) return true;

  if (!source.startsWith(".")) return false;

  const resolved = path.resolve(path.dirname(filePath), source);
  const engineSrcRoot = path.resolve(rootDir, ENGINE_SRC_RELATIVE);
  return isInsidePath(engineSrcRoot, resolved);
}

function collectDeepImportIssues(rootDir, filePath, content) {
  const rel = relativePath(rootDir, filePath);
  if (rel.startsWith(`${ENGINE_SRC_RELATIVE}/`)) return [];

  return extractImportSources(content)
    .filter((entry) => resolvesToEngineSource(rootDir, filePath, entry.source))
    .map((entry) =>
      issue(
        "agent-design-boundary/no-engine-src-import",
        filePath,
        content,
        entry.index,
        `Import '${entry.source}' crosses into ${ENGINE_SRC_RELATIVE}. Use @brainwav/agent-design-engine package exports instead.`,
      ),
    );
}

function collectGuidanceOwnershipIssues(rootDir, filePath, content) {
  const rel = relativePath(rootDir, filePath);
  if (!rel.startsWith(`${GUIDANCE_SRC_RELATIVE}/`)) return [];

  const issues = [];
  for (const entry of extractImportSources(content)) {
    const isProhibitedParserImport = Array.from(PROHIBITED_GUIDANCE_IMPORTS).some(
      (source) => entry.source === source || entry.source.startsWith(`${source}/`),
    );
    if (isProhibitedParserImport) {
      issues.push(
        issue(
          "agent-design-boundary/no-guidance-design-parser-import",
          filePath,
          content,
          entry.index,
          `Import '${entry.source}' belongs in ${ENGINE_SRC_RELATIVE}, not the guidance wrapper.`,
        ),
      );
    }
  }

  for (const symbol of PROHIBITED_GUIDANCE_SYMBOLS) {
    const declarationPattern = new RegExp(
      `\\b(?:function|const|let|var|class)\\s+${symbol}\\b|\\b${symbol}\\s*[:=]\\s*(?:async\\s*)?\\(?`,
      "g",
    );
    let match;
    while ((match = declarationPattern.exec(content)) !== null) {
      issues.push(
        issue(
          "agent-design-boundary/no-guidance-semantic-owner",
          filePath,
          content,
          match.index,
          `${symbol} is semantic DESIGN.md engine ownership. Delegate through @brainwav/agent-design-engine package exports.`,
        ),
      );
    }
  }

  return issues;
}

async function collectBoundaryIssues(rootDir) {
  const files = await listCandidateFiles(rootDir);
  const issues = [];

  for (const filePath of files) {
    const content = await readText(filePath);
    issues.push(...collectDeepImportIssues(rootDir, filePath, content));
    issues.push(...collectGuidanceOwnershipIssues(rootDir, filePath, content));
  }

  return issues;
}

async function listCandidateFiles(rootDir) {
  try {
    const { stdout } = await execFileAsync("git", ["ls-files", "--cached"], {
      cwd: rootDir,
    });
    const files = Array.from(new Set(stdout.split("\n").filter(Boolean)))
      .filter((filePath) => CODE_EXTENSIONS.includes(path.extname(filePath)))
      .map((filePath) => path.join(rootDir, filePath));
    const existingFiles = [];
    for (const filePath of files) {
      if (await fileExists(filePath)) existingFiles.push(filePath);
    }
    if (existingFiles.length > 0) return existingFiles;
  } catch {
    // Self-test fixtures are not git repositories, so fall back to a filesystem walk.
  }

  return await walkFiles(rootDir, { extensions: CODE_EXTENSIONS });
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function printIssues(issues) {
  for (const entry of issues) {
    console.log(`${entry.rule} ${entry.filePath}:${entry.line} ${entry.message}`);
  }
}

async function writeFixture(rootDir, relativeFilePath, content) {
  const filePath = path.join(rootDir, relativeFilePath);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content, { encoding: "utf8", flag: "w" });
}

async function runSelfTest() {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "agent-design-boundaries-"));
  try {
    await writeFixture(
      rootDir,
      "packages/cli/src/good.ts",
      'import { parseDesignContract } from "@brainwav/agent-design-engine";\n',
    );
    await writeFixture(
      rootDir,
      "packages/cli/src/bad.ts",
      'import { parseDesignContract } from "../../agent-design-engine/src/parser";\n',
    );
    await writeFixture(
      rootDir,
      "packages/design-system-guidance/src/good.ts",
      "export function parseConfig(raw: string) { return JSON.parse(raw); }\n",
    );
    await writeFixture(
      rootDir,
      "packages/design-system-guidance/src/bad.ts",
      'import matter from "gray-matter";\nexport function parseDesignContract(raw: string) { return matter(raw); }\n',
    );

    const issues = await collectBoundaryIssues(rootDir);
    const hasDeepImport = issues.some(
      (entry) => entry.rule === "agent-design-boundary/no-engine-src-import",
    );
    const hasParserImport = issues.some(
      (entry) => entry.rule === "agent-design-boundary/no-guidance-design-parser-import",
    );
    const hasSemanticOwner = issues.some(
      (entry) => entry.rule === "agent-design-boundary/no-guidance-semantic-owner",
    );

    if (!hasDeepImport || !hasParserImport || !hasSemanticOwner) {
      console.log("agent-design-boundaries: self-test failed");
      printIssues(issues);
      process.exitCode = 1;
      return;
    }

    console.log("agent-design-boundaries: self-test ok");
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
}

if (process.argv.includes("--self-test")) {
  await runSelfTest();
} else {
  const issues = await collectBoundaryIssues(ROOT);
  if (issues.length === 0) {
    console.log("agent-design-boundaries: ok");
  } else {
    console.log(`agent-design-boundaries: found ${issues.length} issue(s)`);
    printIssues(issues);
    process.exitCode = 1;
  }
}
