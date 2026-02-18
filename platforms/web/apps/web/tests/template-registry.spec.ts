import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { expect, test } from "@playwright/test";

type TemplateEntry = {
  id: string;
  title: string;
  category: string;
};

type TemplateRegistryFile = {
  templates: TemplateEntry[];
};

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

const isTemplateEntry = (value: unknown): value is TemplateEntry => {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    typeof record.title === "string" &&
    typeof record.category === "string"
  );
};

const isRegistryFile = (value: unknown): value is TemplateRegistryFile => {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  if (!Array.isArray(record.templates)) return false;
  return record.templates.every(isTemplateEntry);
};

const loadRegistry = (): TemplateRegistryFile => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const registryPath = path.resolve(__dirname, "..", "TEMPLATE_REGISTRY.json");
  const raw = fs.readFileSync(registryPath, "utf8");
  const parsed: unknown = JSON.parse(raw);

  if (!isRegistryFile(parsed)) {
    throw new Error("Template registry JSON has unexpected shape.");
  }

  return parsed;
};

const sortTemplates = (templates: TemplateEntry[]) => {
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

test.describe("template registry", () => {
  test("registry output is deterministic and ordered", () => {
    const registry = loadRegistry();
    const expected = sortTemplates(registry.templates).map((template) => template.id);
    const actual = registry.templates.map((template) => template.id);

    expect(actual).toEqual(expected);
  });
});
