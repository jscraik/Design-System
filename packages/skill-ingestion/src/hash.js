import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const SKIP_SEGMENTS = new Set([".git", ".clawdhub", ".DS_Store"]);
export function computeSkillHash(rootPath) {
  const hasher = createHash("sha256");
  const files = collectFiles(rootPath);
  for (const filePath of files) {
    const relative = path.relative(rootPath, filePath);
    hasher.update(relative);
    hasher.update(Buffer.from([0]));
    const data = fs.readFileSync(filePath);
    hasher.update(data);
    hasher.update(Buffer.from([0]));
  }
  return hasher.digest("hex");
}
function collectFiles(rootPath) {
  const results = [];
  function walk(current) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      if (SKIP_SEGMENTS.has(entry.name)) continue;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile()) {
        results.push(full);
      }
    }
  }
  walk(rootPath);
  results.sort((a, b) => a.localeCompare(b));
  return results;
}
//# sourceMappingURL=hash.js.map
