import { readFileSync } from "fs";
import { readFile, readdir, stat, writeFile } from "fs/promises";
import { join, resolve, relative, dirname } from "path";

type MatrixSource = "upstream_reexport" | "upstream_wrapper" | "radix_fallback" | "local_primitive";

type MatrixRow = {
  name: string;
  source: MatrixSource;
  upstream: string | null;
  fallback: string | null;
  why_missing_upstream: string | null;
  migration_trigger: string | null;
  a11y_contract_ref: string | null;
  status: string;
};

type NamedExport = {
  local: string;
  upstream: string;
};

const ROOT = process.cwd();
const UI_INDEX = join(ROOT, "packages/ui/src/index.ts");
const COMPONENTS_INDEX = join(ROOT, "packages/ui/src/components/ui/index.ts");
const WIDGETS_DIR = join(ROOT, "packages/widgets");
const FALLBACK_ROOT = join(ROOT, "packages/ui/src/components");

const OUTPUT_JSON = join(ROOT, "docs/design-system/COVERAGE_MATRIX.json");
const OUTPUT_MD = join(ROOT, "docs/design-system/COVERAGE_MATRIX.md");
const UI_PACKAGE_JSON = join(ROOT, "packages/ui/package.json");

const args = new Set(process.argv.slice(2));
const checkOnly = args.has("--check");

function normalizePath(p: string): string {
  return p.replace(/\\/g, "/");
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function resolveModulePath(baseFile: string, specifier: string): Promise<string | null> {
  if (!specifier.startsWith(".")) {
    return null;
  }

  const baseDir = dirname(baseFile);
  const candidate = resolve(baseDir, specifier);

  const extensions = [".ts", ".tsx"];
  for (const ext of extensions) {
    const filePath = `${candidate}${ext}`;
    if (await fileExists(filePath)) {
      return filePath;
    }
  }

  if (await fileExists(candidate)) {
    const stats = await stat(candidate);
    if (stats.isDirectory()) {
      for (const ext of extensions) {
        const indexPath = join(candidate, `index${ext}`);
        if (await fileExists(indexPath)) {
          return indexPath;
        }
      }
    }
  }

  return null;
}

async function readText(path: string): Promise<string> {
  return readFile(path, "utf8");
}

async function collectExportPaths(entryFile: string, visited = new Set<string>()): Promise<string[]> {
  const resolved = resolve(entryFile);
  if (visited.has(resolved)) return [];
  visited.add(resolved);

  const content = await readText(resolved);
  const exportPaths: string[] = [];

  const exportAll = /export\s+\*\s+from\s+["'](.+?)["'];/g;
  const exportNamed = /export\s+\{[^}]*\}\s+from\s+["'](.+?)["'];/g;

  for (const regex of [exportAll, exportNamed]) {
    let match: RegExpExecArray | null = null;
    while ((match = regex.exec(content))) {
      exportPaths.push(match[1]);
    }
  }

  const resolvedPaths: string[] = [];
  for (const specifier of exportPaths) {
    const next = await resolveModulePath(resolved, specifier);
    if (next) {
      resolvedPaths.push(next);
      const nested = await collectExportPaths(next, visited);
      resolvedPaths.push(...nested);
    }
  }

  return resolvedPaths;
}

async function collectComponentNames(): Promise<Set<string>> {
  const componentFiles = await collectExportPaths(COMPONENTS_INDEX);
  const names = new Set<string>();

  for (const filePath of componentFiles) {
    const normalized = normalizePath(filePath);
    if (!normalized.includes("/packages/ui/src/components/")) continue;
    const parts = normalized.split("/");
    const last = parts[parts.length - 1] ?? "";
    if (!last.endsWith(".ts") && !last.endsWith(".tsx")) continue;
    if (last === "index.ts" || last === "index.tsx") {
      const parent = parts[parts.length - 2];
      if (parent) {
        names.add(parent);
      }
    } else {
      const base = last.replace(/\.tsx?$/, "");
      if (base) {
        names.add(base);
      }
    }
  }

  return names;
}

async function collectAppsSdkExports(): Promise<NamedExport[]> {
  const content = await readText(UI_INDEX);
  const exportNamed = /export\s+\{([\s\S]*?)\}\s+from\s+["']\.\/integrations\/apps-sdk["'];/g;
  const exports: NamedExport[] = [];
  let match: RegExpExecArray | null = null;

  while ((match = exportNamed.exec(content))) {
    const body = match[1] ?? "";
    const parts = body.split(",");
    for (const raw of parts) {
      const trimmed = raw.trim();
      if (!trimmed) continue;
      const [upstream, local] = trimmed.split(/\s+as\s+/i).map((v) => v.trim());
      if (!upstream) continue;
      exports.push({
        upstream,
        local: local ?? upstream,
      });
    }
  }

  return exports.sort((a, b) => a.local.localeCompare(b.local));
}

async function walkFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

type FallbackMetadata = {
  why_missing_upstream: string | null;
  migration_trigger: string | null;
  a11y_contract_ref: string | null;
};

function parseFallbackMetadata(content: string): FallbackMetadata {
  const fields = {
    why_missing_upstream: null,
    migration_trigger: null,
    a11y_contract_ref: null,
  } as FallbackMetadata;

  for (const key of Object.keys(fields) as Array<keyof FallbackMetadata>) {
    const regex = new RegExp(`${key}\\s*:\\s*(.+)`);
    const match = content.match(regex);
    if (match && match[1]) {
      fields[key] = match[1].trim();
    }
  }

  return fields;
}

async function collectFallbackComponents(): Promise<Map<string, FallbackMetadata>> {
  const files = await walkFiles(FALLBACK_ROOT);
  const fallback = new Map<string, FallbackMetadata>();

  for (const filePath of files) {
    const normalized = normalizePath(filePath);
    if (!normalized.includes("/fallback/")) continue;
    if (!normalized.endsWith(".tsx") && !normalized.endsWith(".ts")) continue;

    const fileName = normalized.split("/").pop() ?? "";
    const componentName = fileName.replace(/\.tsx?$/, "");
    if (!componentName) continue;

    const content = await readText(filePath);
    fallback.set(componentName, parseFallbackMetadata(content));
  }

  return fallback;
}

async function collectWidgetUsage(): Promise<Map<string, string[]>> {
  const files = await walkFiles(WIDGETS_DIR);
  const usage = new Map<string, string[]>();
  const importRegex = /import\s+\{([^}]+)\}\s+from\s+["']@astudio\/ui[^"']*["'];/g;

  for (const filePath of files) {
    if (!filePath.endsWith(".ts") && !filePath.endsWith(".tsx")) continue;
    const content = await readText(filePath);
    let match: RegExpExecArray | null = null;
    while ((match = importRegex.exec(content))) {
      const body = match[1] ?? "";
      const parts = body.split(",");
      for (const raw of parts) {
        const trimmed = raw.trim();
        if (!trimmed) continue;
        const name = trimmed.split(/\s+as\s+/i)[0]?.trim();
        if (!name) continue;
        const list = usage.get(name) ?? [];
        const relPath = normalizePath(relative(ROOT, filePath));
        if (!list.includes(relPath)) {
          list.push(relPath);
        }
        usage.set(name, list);
      }
    }
  }

  return usage;
}

function readAppsSdkVersion(): string | null {
  try {
    const raw = readFileSync(UI_PACKAGE_JSON, "utf8");
    const parsed = JSON.parse(raw);
    return parsed?.dependencies?.["@openai/apps-sdk-ui"] ?? null;
  } catch {
    return null;
  }
}

function formatCell(value: string | null): string {
  return value && value.trim().length > 0 ? value : "-";
}

function buildMarkdown(rows: MatrixRow[]): string {
  const appsSdkVersion = readAppsSdkVersion();
  const lines = [
    "# Component Coverage Matrix",
    "",
    "Generated by scripts/generate-coverage-matrix.ts. Do not edit by hand.",
    appsSdkVersion ? `Upstream version: @openai/apps-sdk-ui ${appsSdkVersion}` : null,
    "",
    "| Component | Source | Upstream | Fallback | Why missing upstream | Migration trigger | A11y contract | Status |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |",
  ].filter(Boolean);

  for (const row of rows) {
    lines.push(
      `| ${row.name} | ${row.source} | ${formatCell(row.upstream)} | ${formatCell(
        row.fallback,
      )} | ${formatCell(row.why_missing_upstream)} | ${formatCell(
        row.migration_trigger,
      )} | ${formatCell(row.a11y_contract_ref)} | ${row.status} |`,
    );
  }

  return `${lines.join("\n")}\n`;
}

async function readIfExists(path: string): Promise<string | null> {
  try {
    return await readText(path);
  } catch {
    return null;
  }
}

async function main(): Promise<void> {
  const componentNames = await collectComponentNames();
  const appsSdkExports = await collectAppsSdkExports();
  const fallbackComponents = await collectFallbackComponents();
  const widgetUsage = await collectWidgetUsage();

  const rows: MatrixRow[] = [];

  for (const appExport of appsSdkExports) {
    const usedInWidgets = widgetUsage.get(appExport.local)?.length;
    rows.push({
      name: appExport.local,
      source: "upstream_reexport",
      upstream: appExport.upstream,
      fallback: null,
      why_missing_upstream: null,
      migration_trigger: null,
      a11y_contract_ref: null,
      status: usedInWidgets ? "widget_used" : "active",
    });
  }

  for (const name of componentNames) {
    if (appsSdkExports.some((entry) => entry.local === name)) {
      continue;
    }

    const fallback = fallbackComponents.get(name) ?? null;
    const usedInWidgets = widgetUsage.get(name)?.length;
    const hasMissingMetadata =
      fallback &&
      (!fallback.why_missing_upstream || !fallback.migration_trigger || !fallback.a11y_contract_ref);

    rows.push({
      name,
      source: fallback ? "radix_fallback" : "local_primitive",
      upstream: null,
      fallback: fallback ? "radix" : null,
      why_missing_upstream: fallback?.why_missing_upstream ?? null,
      migration_trigger: fallback?.migration_trigger ?? null,
      a11y_contract_ref: fallback?.a11y_contract_ref ?? null,
      status: hasMissingMetadata ? "missing_metadata" : usedInWidgets ? "widget_used" : "active",
    });
  }

  rows.sort((a, b) => a.name.localeCompare(b.name));

  const jsonOutput = `${JSON.stringify(rows, null, 2)}\n`;
  const mdOutput = buildMarkdown(rows);

  if (checkOnly) {
    const existingJson = await readIfExists(OUTPUT_JSON);
    const existingMd = await readIfExists(OUTPUT_MD);

    if (existingJson === null || existingMd === null) {
      console.error("Coverage matrix outputs are missing. Run with --write to generate them.");
      process.exit(1);
    }

    if (existingJson !== jsonOutput || existingMd !== mdOutput) {
      console.error("Coverage matrix outputs are out of date. Run pnpm ds:matrix:generate.");
      process.exit(1);
    }

    console.log("Coverage matrix is up to date.");
    return;
  }

  await writeFile(OUTPUT_JSON, jsonOutput, "utf8");
  await writeFile(OUTPUT_MD, mdOutput, "utf8");
  console.log(`Coverage matrix written to ${normalizePath(relative(ROOT, OUTPUT_JSON))}`);
  console.log(`Coverage matrix written to ${normalizePath(relative(ROOT, OUTPUT_MD))}`);
}

await main();
