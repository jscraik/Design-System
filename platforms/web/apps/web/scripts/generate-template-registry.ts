import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import Ajv from "ajv";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(currentDir, "..");
const repoRoot = path.resolve(currentDir, "../../../../..");
const templatesRoot = path.join(appRoot, "src/templates");
const generatedRoot = path.join(appRoot, "src/generated");
const schemaPath = path.join(repoRoot, "scripts/schema/template-registry.schema.json");
const jsonOutputPath = path.join(appRoot, "TEMPLATE_REGISTRY.json");
const markdownOutputPath = path.join(appRoot, "TEMPLATE_REGISTRY.md");
const tsOutputPath = path.join(generatedRoot, "template-registry.ts");

const CATEGORY_ORDER = [
  "educational",
  "templates",
  "components",
  "design-system",
  "layouts",
  "settings",
  "modals",
  "panels",
] as const;

const CATEGORY_LABELS: Record<(typeof CATEGORY_ORDER)[number], string> = {
  educational: "Educational",
  templates: "Templates",
  components: "Components",
  "design-system": "Design System",
  layouts: "Layouts",
  settings: "Settings",
  modals: "Modals",
  panels: "Panels",
};

type TemplateStatus = "alpha" | "beta" | "stable";

type TemplateMetadata = {
  id: string;
  title: string;
  description: string;
  category: (typeof CATEGORY_ORDER)[number];
  tags: string[];
  status: TemplateStatus;
  route: string;
  entry: string;
  sourcePath: string;
  modulePath: string;
};

type TemplateRegistryFile = {
  templates: Array<Omit<TemplateMetadata, "modulePath">>;
};

const normalizeTags = (tags: string[]) => {
  const normalized = tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean);
  return Array.from(new Set(normalized)).sort();
};

const toPosixPath = (value: string) => value.split(path.sep).join("/");

const ensureLeadingDot = (value: string) => {
  if (value.startsWith(".")) return value;
  return `./${value}`;
};

const parseTagValue = (raw: string) => {
  const trimmed = raw.trim();
  if (!trimmed) return [] as string[];
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const inside = trimmed.slice(1, -1).trim();
    if (!inside) return [];
    return inside.split(",").map((item) => item.trim());
  }
  return trimmed.split(",").map((item) => item.trim());
};

const parseMetadataBlocks = (content: string) => {
  const blocks = content.match(/\/\*\*[\s\S]*?@template[\s\S]*?\*\//g) ?? [];
  return blocks.map((block) => {
    const lines = block
      .replace(/^\/\*\*/, "")
      .replace(/\*\/$/, "")
      .split("\n")
      .map((line) => line.replace(/^\s*\*\s?/, "").trim())
      .filter(Boolean);

    const metadata: Record<string, string> = {};

    for (const line of lines) {
      if (line.startsWith("@template")) continue;
      const [rawKey, ...rest] = line.split(":");
      if (!rawKey || rest.length === 0) continue;
      const key = rawKey.trim();
      const value = rest.join(":").trim();
      metadata[key] = value;
    }

    return metadata;
  });
};

const walkTemplates = (dir: string): string[] => {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkTemplates(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".tsx")) {
      files.push(fullPath);
    }
  }

  return files;
};

const loadTemplates = (): TemplateMetadata[] => {
  const files = walkTemplates(templatesRoot);
  const templates: TemplateMetadata[] = [];

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, "utf8");
    const metadataBlocks = parseMetadataBlocks(content);

    if (metadataBlocks.length === 0) continue;

    for (const metadata of metadataBlocks) {
      const id = metadata.id?.trim();
      const title = metadata.title?.trim();
      const description = metadata.description?.trim();
      const category = metadata.category?.trim() as TemplateMetadata["category"];
      const status = metadata.status?.trim() as TemplateStatus;
      const entry = metadata.entry?.trim();

      const relativeSource = toPosixPath(path.relative(appRoot, filePath));

      const requiredKeys = ["id", "title", "description", "category", "status", "entry"];
      const missing = requiredKeys.filter((key) => !metadata[key]?.trim());
      if (missing.length > 0) {
        console.error(`Missing template metadata (${missing.join(", ")}) in ${relativeSource}.`);
        process.exit(1);
      }

      const tags = normalizeTags(parseTagValue(metadata.tags ?? ""));
      const route = metadata.route?.trim() ?? `/templates/${id}`;

      const modulePath = ensureLeadingDot(
        toPosixPath(path.relative(path.dirname(tsOutputPath), filePath)).replace(/\.tsx$/, ""),
      );

      templates.push({
        id,
        title,
        description,
        category,
        tags,
        status,
        route,
        entry,
        sourcePath: relativeSource,
        modulePath,
      } as TemplateMetadata);
    }
  }

  return templates;
};

const sortTemplates = (templates: TemplateMetadata[]) => {
  const categoryIndex = new Map(CATEGORY_ORDER.map((category, index) => [category, index]));

  return [...templates].sort((a, b) => {
    const aIndex = categoryIndex.get(a.category) ?? CATEGORY_ORDER.length;
    const bIndex = categoryIndex.get(b.category) ?? CATEGORY_ORDER.length;

    if (aIndex !== bIndex) return aIndex - bIndex;

    const titleCompare = a.title.localeCompare(b.title);
    if (titleCompare !== 0) return titleCompare;

    return a.id.localeCompare(b.id);
  });
};

const validateSchema = (templates: TemplateMetadata[]) => {
  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
  const ajv = new Ajv({ strict: true, allErrors: true });
  const validate = ajv.compile(schema);

  const payload: TemplateRegistryFile = {
    templates: templates.map(({ modulePath, ...template }) => template),
  };

  const valid = validate(payload);

  if (!valid) {
    console.error("Template registry schema validation failed:\n", validate.errors);
    process.exit(1);
  }
};

const validateUniqueness = (templates: TemplateMetadata[]) => {
  const ids = new Set<string>();
  const routes = new Set<string>();

  for (const template of templates) {
    if (ids.has(template.id)) {
      console.error(`Duplicate template id detected: ${template.id}`);
      process.exit(1);
    }
    ids.add(template.id);

    if (routes.has(template.route)) {
      console.error(`Duplicate template route detected: ${template.route}`);
      process.exit(1);
    }
    routes.add(template.route);
  }
};

const writeJson = (templates: TemplateMetadata[]) => {
  const payload: TemplateRegistryFile = {
    templates: templates.map(({ modulePath, ...template }) => template),
  };
  fs.writeFileSync(jsonOutputPath, `${JSON.stringify(payload, null, 2)}\n`);
};

const writeMarkdown = (templates: TemplateMetadata[]) => {
  const grouped = templates.reduce<Record<string, TemplateMetadata[]>>((acc, template) => {
    const key = template.category;
    acc[key] = acc[key] ?? [];
    acc[key].push(template);
    return acc;
  }, {});

  const lines: string[] = [
    "# Template Registry",
    "",
    "Generated by `scripts/generate-template-registry.ts`.",
    "",
  ];

  for (const category of CATEGORY_ORDER) {
    const items = grouped[category] ?? [];
    lines.push(`## ${CATEGORY_LABELS[category]} (${items.length})`, "");

    if (items.length === 0) {
      lines.push("- _No templates registered._", "");
      continue;
    }

    for (const template of items) {
      lines.push(
        `- **${template.title}** (\`${template.id}\`) — ${template.description}`,
        `  - Status: ${template.status}`,
        `  - Tags: ${template.tags.join(", ") || "none"}`,
        `  - Entry: ${template.entry}`,
        `  - Source: ${template.sourcePath}`,
      );
    }
    lines.push("");
  }

  fs.writeFileSync(markdownOutputPath, `${lines.join("\n")}\n`);
};

const writeTypeScriptModule = (templates: TemplateMetadata[]) => {
  const imports = new Map<string, Set<string>>();

  for (const template of templates) {
    if (!imports.has(template.modulePath)) {
      imports.set(template.modulePath, new Set());
    }
    imports.get(template.modulePath)?.add(template.entry);
  }

  const importLines = Array.from(imports.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([modulePath, entries]) => {
      const names = Array.from(entries).sort().join(", ");
      return `import { ${names} } from "${modulePath}";`;
    });

  const templateLines = templates.map((template) => {
    const record = {
      id: template.id,
      title: template.title,
      description: template.description,
      category: template.category,
      tags: template.tags,
      status: template.status,
      route: template.route,
      entry: template.entry,
      sourcePath: template.sourcePath,
      Component: template.entry,
    };

    return `  ${JSON.stringify(record, null, 2)
      .replace(/"Component": "(.*?)"/, "Component: $1")
      .replace(/\n/g, "\n  ")},`;
  });

  const categoryUnion = CATEGORY_ORDER.map((category) => `"${category}"`).join(" | ");

  const content = [
    "/* eslint-disable */",
    "// THIS FILE IS AUTO-GENERATED. DO NOT EDIT BY HAND.",
    ...importLines,
    'import type { ComponentType } from "react";',
    "",
    `export type TemplateCategory = ${categoryUnion};`,
    'export type TemplateStatus = "alpha" | "beta" | "stable";',
    "",
    "export type TemplateRegistryEntry = {",
    "  id: string;",
    "  title: string;",
    "  description: string;",
    "  category: TemplateCategory;",
    "  tags: string[];",
    "  status: TemplateStatus;",
    "  route: string;",
    "  entry: string;",
    "  sourcePath: string;",
    "  Component: ComponentType;",
    "};",
    "",
    `export const templateCategoryLabels: Record<TemplateCategory, string> = ${JSON.stringify(
      CATEGORY_LABELS,
      null,
      2,
    )};`,
    "",
    "export const templateRegistry: TemplateRegistryEntry[] = [",
    ...templateLines,
    "];",
    "",
    "export const getTemplateById = (id: string) =>",
    "  templateRegistry.find((template) => template.id === id);",
    "",
    "export const getTemplatesByCategory = (category: TemplateCategory) =>",
    "  templateRegistry.filter((template) => template.category === category);",
    "",
  ];

  fs.mkdirSync(generatedRoot, { recursive: true });
  fs.writeFileSync(tsOutputPath, `${content.join("\n")}\n`);
};

const main = () => {
  const checkMode = process.argv.includes("--check");

  const templates = sortTemplates(loadTemplates());
  validateUniqueness(templates);
  validateSchema(templates);

  if (checkMode) {
    const previousJson = fs.existsSync(jsonOutputPath)
      ? fs.readFileSync(jsonOutputPath, "utf8")
      : null;
    const previousMarkdown = fs.existsSync(markdownOutputPath)
      ? fs.readFileSync(markdownOutputPath, "utf8")
      : null;
    const previousTs = fs.existsSync(tsOutputPath) ? fs.readFileSync(tsOutputPath, "utf8") : null;

    writeJson(templates);
    writeMarkdown(templates);
    writeTypeScriptModule(templates);

    const nextJson = fs.readFileSync(jsonOutputPath, "utf8");
    const nextMarkdown = fs.readFileSync(markdownOutputPath, "utf8");
    const nextTs = fs.readFileSync(tsOutputPath, "utf8");

    if (previousJson !== nextJson || previousMarkdown !== nextMarkdown || previousTs !== nextTs) {
      console.error("Template registry outputs are out of date. Run registry:generate.");
      process.exit(1);
    }

    return;
  }

  writeJson(templates);
  writeMarkdown(templates);
  writeTypeScriptModule(templates);
};

main();
