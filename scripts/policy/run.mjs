import path from "node:path";
import { readFileSync } from "node:fs";
import {
  extractClassNameStrings,
  extractImportSources,
  extractNamedImports,
  extractStyleBlocks,
  isPathAllowed,
  isPathIgnored,
  lineNumberAt,
  readText,
  walkFiles,
} from "./lib/scan.mjs";

const ROOT = process.cwd();

const ALLOWED_UI_SUBPATHS = new Set([
  "app",
  "base",
  "chat",
  "data-display",
  "dev",
  "experimental",
  "feedback",
  "icons",
  "modals",
  "navigation",
  "overlays",
  "settings",
  "showcase",
  "styles.css",
  "templates",
]);

const FOUNDATION_TOKEN_PREFIXES = [
  "bg-foundation-bg-",
  "bg-foundation-accent-",
  "bg-foundation-surface-",
  "text-foundation-text-",
  "text-foundation-icon-",
  "border-foundation-",
  "shadow-foundation-",
  "ring-foundation-",
];

const VALID_DARK_ONLY_TOKENS = [
  "dark:divide-white/",
  "dark:divide-black/",
  "dark:border-white/",
  "dark:border-black/",
  "dark:bg-white/",
  "dark:bg-black/",
  "dark:text-white/",
  "dark:text-black/",
  "dark:shadow-white/",
  "dark:shadow-black/",
  "dark:ring-white/",
  "dark:ring-black/",
];

const CONSOLE_METHODS = new Set([
  "log",
  "warn",
  "error",
  "info",
  "debug",
  "trace",
  "assert",
  "dir",
  "dirxml",
  "table",
  "group",
  "groupCollapsed",
  "groupEnd",
  "clear",
  "count",
  "countReset",
  "profile",
  "profileEnd",
  "time",
  "timeLog",
  "timeEnd",
  "timeStamp",
  "context",
]);

const DEFAULT_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"];
const IGNORE_PATTERNS = [
  "**/node_modules/**",
  "**/dist/**",
  "platforms/web/apps/storybook/storybook-static/**",
  "**/*.mdx",
  "scripts/new-component.mjs",
  "**/.*/**",
  "_temp/**",
  "**/_temp_import/**",
  "**/docs/examples/**",
  "**/src/**/generated/**",
  "pnpm-lock.yaml",
  "scripts/policy/**",
  "eslint.config.js",
  "prettier.config.cjs",
  "packages/ui/eslint-rules-*.js",
];

function normalize(filePath) {
  return filePath.replace(/\\/g, "/");
}

function isFoundationToken(className) {
  return FOUNDATION_TOKEN_PREFIXES.some((prefix) => className.includes(prefix));
}

function isValidDarkOnlyToken(token) {
  return VALID_DARK_ONLY_TOKENS.some((valid) => token.startsWith(valid));
}

function findUnpairedDarkTokens(classValue) {
  const tokens = classValue.split(/\s+/).filter(Boolean);
  const darkTokens = [];
  const lightTokens = new Set();

  for (const token of tokens) {
    if (token.startsWith("dark:")) {
      darkTokens.push(token);
    } else {
      lightTokens.add(token);
    }
  }

  const unpaired = [];
  for (const darkToken of darkTokens) {
    if (isValidDarkOnlyToken(darkToken)) continue;
    const rawToken = darkToken.slice("dark:".length);
    const darkProp = rawToken.split("-")[0];
    const hasLightPair = Array.from(lightTokens).some((lightToken) => {
      const lightProp = lightToken.split("-")[0];
      if (darkProp !== lightProp) return false;
      if (isFoundationToken(lightToken)) return true;
      return true;
    });
    if (!hasLightPair) unpaired.push(darkToken);
  }

  return unpaired;
}

function loadAppsSdkMap() {
  const matrixPath = path.join(ROOT, "docs/design-system/COVERAGE_MATRIX.json");
  try {
    const raw = readFileSync(matrixPath, "utf8");
    const rows = JSON.parse(raw);
    const map = new Map();
    for (const row of rows) {
      if (row.source === "upstream_reexport" && row.upstream && row.name) {
        map.set(row.upstream, row.name);
      }
    }
    return map;
  } catch (error) {
    return new Map();
  }
}

function reportIssue(issues, rule, filePath, index, message) {
  issues.push({
    rule,
    filePath,
    line: lineNumberAt(filePath.content, index),
    message,
  });
}

function matchRegexAll(content, regex) {
  const matches = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    matches.push({ match, index: match.index });
  }
  return matches;
}

async function checkPolicies() {
  const files = await walkFiles(ROOT, { extensions: DEFAULT_EXTENSIONS });
  const issues = [];
  const appsSdkMap = loadAppsSdkMap();

  for (const filePath of files) {
    const normalized = normalize(filePath);
    const relativePath = normalize(path.relative(ROOT, normalized));
    if (isPathIgnored(relativePath, IGNORE_PATTERNS)) continue;
    const content = await readText(filePath);
    const fileContext = { path: normalized, content };

    const importSources = extractImportSources(content);
    const namedImports = extractNamedImports(content);

    // apps-sdk-first
    if (!isPathAllowed(normalized, [
      "**/packages/ui/src/components/**",
      "**/packages/ui/src/templates/**",
      "**/packages/ui/src/design-system/**",
      "**/packages/ui/src/storybook/**",
      "**/packages/ui/src/app/**",
    ])) {
      for (const entry of namedImports) {
        if (!entry.source.startsWith("@astudio/ui")) continue;
        for (const name of entry.names) {
          const preferred = appsSdkMap.get(name);
          if (preferred && preferred !== name) {
            reportIssue(
              issues,
              "apps-sdk-first",
              fileContext,
              entry.index,
              `Use Apps SDK UI re-export '${preferred}' instead of '${name}'.`
            );
          }
        }
      }
    }

    // no-raw-tokens
    if (
      normalized.includes("/packages/ui/src/components/") &&
      !/\\.stories\\./.test(normalized) &&
      !/\\.test\\./.test(normalized) &&
      !/\/dev\//.test(normalized)
    ) {
      const blocks = extractStyleBlocks(content);
      const hexRegex = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\\b/;
      const pxRegex = /\\b\\d+(?:\\.\\d+)?px\\b/;
      const tokenRegex = /var\(--foundation-/;
      for (const block of blocks) {
        if (tokenRegex.test(block.value)) continue;
        if (hexRegex.test(block.value)) {
          reportIssue(
            issues,
            "no-raw-tokens",
            fileContext,
            block.index,
            "Raw hex color detected in inline style. Use tokens."
          );
        }
        if (pxRegex.test(block.value)) {
          reportIssue(
            issues,
            "no-raw-tokens",
            fileContext,
            block.index,
            "Raw px value detected in inline style. Use tokens."
          );
        }
      }
    }

    // no-lucide-direct-imports
    if (!isPathAllowed(normalized, [
      "**/node_modules/**",
      "**/_temp/**",
      "**/_temp_import/**",
      "**/packages/widgets/**",
    ])) {
      for (const entry of importSources) {
        if (entry.source === "lucide-react" || entry.source.startsWith("lucide-react/")) {
          reportIssue(
            issues,
            "no-lucide-direct-imports",
            fileContext,
            entry.index,
            "Direct lucide-react import is not allowed."
          );
        }
      }
    }

    // no-window-openai-direct-access
    if (!isPathAllowed(normalized, [
      "**/node_modules/**",
      "**/*.test.*",
      "**/*.spec.*",
      "**/packages/runtime/**",
      "**/packages/widgets/**",
      "**/platforms/mcp/**",
    ])) {
      const matches = matchRegexAll(content, /\bwindow\.openai\b/g);
      for (const match of matches) {
        reportIssue(
          issues,
          "no-window-openai-direct-access",
          fileContext,
          match.index,
          "Direct window.openai access is not allowed."
        );
      }
    }

    // no-deprecated-imports + no-restricted-imports (_temp)
    for (const entry of importSources) {
      if (
        entry.source.includes("_temp") ||
        entry.source.includes("_temp_import") ||
        entry.source === "@astudio/ui/dev" ||
        entry.source.startsWith("@astudio/ui/dev/")
      ) {
        reportIssue(
          issues,
          "no-deprecated-imports",
          fileContext,
          entry.index,
          `Deprecated import '${entry.source}' is not allowed.`
        );
      }
    }

    // radix-fallback-only
    const hasRadixWaiver =
      /@astudio-waiver\s+radix-fallback:\s*.+\(expires\s+\d{4}-\d{2}-\d{2}\)/i.test(
        content
      );
    if (!normalized.includes("/fallback/") && !hasRadixWaiver) {
      for (const entry of importSources) {
        if (entry.source.startsWith("@radix-ui/")) {
          reportIssue(
            issues,
            "radix-fallback-only",
            fileContext,
            entry.index,
            "Radix primitives are only allowed under fallback paths."
          );
        }
      }
    }

    // ui-subpath-imports
    for (const entry of importSources) {
      if (!entry.source.startsWith("@astudio/ui/")) continue;
      const subpath = entry.source.slice("@astudio/ui/".length);
      if (subpath.includes("/")) {
        reportIssue(
          issues,
          "ui-subpath-imports",
          fileContext,
          entry.index,
          `Deep import '${entry.source}' is not allowed.`
        );
        continue;
      }
      if (!ALLOWED_UI_SUBPATHS.has(subpath)) {
        reportIssue(
          issues,
          "ui-subpath-imports",
          fileContext,
          entry.index,
          `Invalid @astudio/ui subpath '${subpath}'.`
        );
      }
    }

    // no-dark-only-tokens
    const classNames = extractClassNameStrings(content);
    for (const classEntry of classNames) {
      if (classEntry.value.includes("${")) continue;
      const unpaired = findUnpairedDarkTokens(classEntry.value);
      for (const token of unpaired) {
        reportIssue(
          issues,
          "no-dark-only-tokens",
          fileContext,
          classEntry.index,
          `Dark-only token '${token}' detected without light pairing.`
        );
      }
    }

    // no-console-in-production
    if (!isPathAllowed(normalized, [
      "**/*.test.*",
      "**/*.spec.*",
      "**/packages/runtime/**",
      "**/packages/widgets/**",
      "**/platforms/mcp/**",
      "**/*.config.*",
      "**/vite.config.*",
      "**/tailwind.preset.*",
    ])) {
      for (const method of CONSOLE_METHODS) {
        const regex = new RegExp(`\\\\bconsole\\\\.${method}\\\\b`, "g");
        for (const match of matchRegexAll(content, regex)) {
          reportIssue(
            issues,
            "no-console-in-production",
            fileContext,
            match.index,
            `Unexpected console.${method}() usage.`
          );
        }
      }
    }
  }

  return issues;
}

function printIssues(issues) {
  if (!issues.length) {
    console.log("policy: ok");
    return;
  }

  console.log(`policy: ${issues.length} issue(s) found`);
  for (const issue of issues) {
    console.log(
      `${issue.rule} ${issue.filePath.path}:${issue.line} ${issue.message}`
    );
  }
  process.exitCode = 1;
}

const issues = await checkPolicies();
printIssues(issues);
