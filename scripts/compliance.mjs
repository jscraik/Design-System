import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const uiRoot = path.join(root, "packages/ui/src");
const allowedHexRoots = [
  path.join(root, "packages/tokens"),
  path.join(root, "packages/ui/src/storybook/docs"),
  path.join(root, "packages/ui/src/imports"),
];
const allowedLucideRoots = [path.join(root, "packages/ui/src/icons")];
const allowedRadixRoot = path.join(root, "packages/ui/src/components/ui");

const exts = new Set([".ts", ".tsx", ".css"]);
const hexRegex = /#[0-9a-fA-F]{3,8}/g;
const lucideRegex = /from\s+["']lucide-react["']/g;
const muiRegex = /from\s+["']@mui\//g;
const radixRegex = /from\s+["']@radix-ui\//g;
const MAX_FILE_LINES = 300;

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else if (exts.has(path.extname(entry.name))) {
      files.push(full);
    }
  }
  return files;
}

function isUnderAllowedHexDir(filePath) {
  return allowedHexRoots.some((allowed) => filePath.startsWith(allowed));
}

function checkFileLength(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n").length;
  if (lines > MAX_FILE_LINES) {
    return {
      type: "file-length",
      file: path.relative(root, filePath),
      detail: `${lines} lines (max: ${MAX_FILE_LINES})`,
    };
  }
  return null;
}

const warnings = [];

for (const file of walk(uiRoot)) {
  const rel = path.relative(root, file);
  const content = fs.readFileSync(file, "utf8");

  if (!isUnderAllowedHexDir(file)) {
    const hexMatches = content.match(hexRegex);
    if (hexMatches) {
      warnings.push({
        type: "hex",
        file: rel,
        detail: `${hexMatches.length} hex value(s)`,
      });
    }
  }

  if (lucideRegex.test(content)) {
    const isAllowedLucide = allowedLucideRoots.some((allowed) => file.startsWith(allowed));
    if (!isAllowedLucide) {
      warnings.push({
        type: "lucide",
        file: rel,
        detail: "lucide-react import",
      });
    }
  }

  if (muiRegex.test(content)) {
    warnings.push({
      type: "mui",
      file: rel,
      detail: "@mui import",
    });
  }

  if (radixRegex.test(content) && !file.startsWith(allowedRadixRoot)) {
    warnings.push({
      type: "radix",
      file: rel,
      detail: "@radix-ui import outside components/ui/",
    });
  }

  const fileLengthWarning = checkFileLength(file);
  if (fileLengthWarning) {
    warnings.push(fileLengthWarning);
  }
}

if (warnings.length) {
  console.warn("Compliance warnings (non-blocking):");
  for (const warning of warnings) {
    console.warn(`- [${warning.type}] ${warning.file} (${warning.detail})`);
  }
  console.warn("Set COMPLIANCE_STRICT=1 to make these warnings fail the build.");
} else {
  console.log("Compliance checks passed (no warnings).");
}

if (process.env.COMPLIANCE_STRICT === "1" && warnings.length) {
  process.exit(1);
}
