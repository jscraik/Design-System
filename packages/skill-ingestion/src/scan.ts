import fs from "node:fs";
import path from "node:path";
import { computeSkillHash } from "./hash.js";
import { formatTitle, parseMetadata, stripFrontmatter } from "./metadata.js";
import type { SkillPlatform, SkillReference, SkillStats, SkillSummary } from "./types.js";

// ─── SECURITY HELPERS ─────────────────────────────────────────────────────────

/** Ensures `candidate` is strictly inside `base` — prevents path traversal via symlinks or `..` segments. */
function isWithinBase(base: string, candidate: string): boolean {
  const resolvedBase = path.resolve(base);
  const resolvedCandidate = path.resolve(candidate);
  return (
    resolvedCandidate === resolvedBase ||
    resolvedCandidate.startsWith(resolvedBase + path.sep)
  );
}

/** Validates a storage key is safe to embed in IDs (no path separators or shell metacharacters). */
const SAFE_KEY_RE = /^[\w][\w.:/-]{0,127}$/;
function validateStorageKey(key: string): string {
  if (!SAFE_KEY_RE.test(key)) {
    throw new Error(`Security: storageKey "${key}" contains invalid characters.`);
  }
  return key;
}

type ScanResult = {
  id: string;
  name: string;
  displayName: string;
  description: string;
  folderPath: string;
  skillMarkdownPath: string;
  references: SkillReference[];
  stats: SkillStats;
};

export function scanSkills(
  basePath: string,
  storageKey: string,
  _platform?: SkillPlatform,
): ScanResult[] {
  if (!fs.existsSync(basePath)) return [];

  // Resolve once so all child path comparisons use the same canonical base
  const resolvedBase = path.resolve(basePath);
  const safeKey = validateStorageKey(storageKey);

  const entries = fs.readdirSync(resolvedBase, { withFileTypes: true });
  const skills: ScanResult[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const skillDir = path.join(resolvedBase, entry.name);

    // Guard: skillDir must still be within the resolved base (prevents symlink escape)
    if (!isWithinBase(resolvedBase, skillDir)) continue;

    const skillMd = path.join(skillDir, "SKILL.md");
    if (!fs.existsSync(skillMd)) continue;

    const markdown = fs.readFileSync(skillMd, "utf8");
    const metadata = parseMetadata(markdown);
    const references = referenceFiles(path.join(skillDir, "references"), resolvedBase);
    const stats: SkillStats = {
      references: references.length,
      assets: countEntries(path.join(skillDir, "assets")),
      scripts: countEntries(path.join(skillDir, "scripts")),
      templates: countEntries(path.join(skillDir, "templates")),
    };

    skills.push({
      id: `${safeKey}-${entry.name}`,
      name: entry.name,
      displayName: formatTitle(metadata.name ?? entry.name),
      description: metadata.description ?? "No description available.",
      folderPath: skillDir,
      skillMarkdownPath: skillMd,
      references,
      stats,
    });
  }

  return skills.sort((a: ScanResult, b: ScanResult) =>
    a.displayName.localeCompare(b.displayName, undefined, { sensitivity: "base" }),
  );
}

export function referenceFiles(dirPath: string, allowedBase?: string): SkillReference[] {
  if (!fs.existsSync(dirPath)) return [];

  // If a base is provided, ensure dirPath is still within it
  if (allowedBase && !isWithinBase(allowedBase, dirPath)) return [];

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  const refs = entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".md"))
    .map((entry) => {
      const filePath = path.join(dirPath, entry.name);
      // Guard each individual ref file path too
      if (allowedBase && !isWithinBase(allowedBase, filePath)) return null;
      const name = formatTitle(path.basename(entry.name, path.extname(entry.name)));
      return {
        id: filePath,
        name,
        path: filePath,
      };
    })
    .filter((ref): ref is SkillReference => ref !== null)
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

  return refs;
}

export function countEntries(dirPath: string): number {
  if (!fs.existsSync(dirPath)) return 0;
  return fs.readdirSync(dirPath, { withFileTypes: true }).filter((e) => !e.name.startsWith("."))
    .length;
}

export function loadMarkdown(markdownPath: string): { raw: string; content: string } {
  const raw = fs.readFileSync(markdownPath, "utf8");
  return { raw, content: stripFrontmatter(raw) };
}

export function computePublishHash(skillFolder: string): string {
  return computeSkillHash(skillFolder);
}

export function buildSkillSummary(
  scanned: ScanResult,
  platform?: SkillPlatform,
  customPath?: string,
): SkillSummary {
  return {
    ...scanned,
    platform,
    customPath,
  };
}
