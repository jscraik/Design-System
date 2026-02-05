import fs from "node:fs";
import path from "node:path";
import { computeSkillHash } from "./hash.js";
import { formatTitle, parseMetadata, stripFrontmatter } from "./metadata.js";
export function scanSkills(basePath, storageKey, _platform) {
  if (!fs.existsSync(basePath)) return [];
  const entries = fs.readdirSync(basePath, { withFileTypes: true });
  const skills = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const skillDir = path.join(basePath, entry.name);
    const skillMd = path.join(skillDir, "SKILL.md");
    if (!fs.existsSync(skillMd)) continue;
    const markdown = fs.readFileSync(skillMd, "utf8");
    const metadata = parseMetadata(markdown);
    const references = referenceFiles(path.join(skillDir, "references"));
    const stats = {
      references: references.length,
      assets: countEntries(path.join(skillDir, "assets")),
      scripts: countEntries(path.join(skillDir, "scripts")),
      templates: countEntries(path.join(skillDir, "templates")),
    };
    skills.push({
      id: `${storageKey}-${entry.name}`,
      name: entry.name,
      displayName: formatTitle(metadata.name ?? entry.name),
      description: metadata.description ?? "No description available.",
      folderPath: skillDir,
      skillMarkdownPath: skillMd,
      references,
      stats,
    });
  }
  return skills.sort((a, b) =>
    a.displayName.localeCompare(b.displayName, undefined, { sensitivity: "base" }),
  );
}
export function referenceFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const refs = entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".md"))
    .map((entry) => {
      const filePath = path.join(dirPath, entry.name);
      const name = formatTitle(path.basename(entry.name, path.extname(entry.name)));
      return {
        id: filePath,
        name,
        path: filePath,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
  return refs;
}
export function countEntries(dirPath) {
  if (!fs.existsSync(dirPath)) return 0;
  return fs.readdirSync(dirPath, { withFileTypes: true }).filter((e) => !e.name.startsWith("."))
    .length;
}
export function loadMarkdown(markdownPath) {
  const raw = fs.readFileSync(markdownPath, "utf8");
  return { raw, content: stripFrontmatter(raw) };
}
export function computePublishHash(skillFolder) {
  return computeSkillHash(skillFolder);
}
export function buildSkillSummary(scanned, platform, customPath) {
  return {
    ...scanned,
    platform,
    customPath,
  };
}
//# sourceMappingURL=scan.js.map
