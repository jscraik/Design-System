import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { transform } from "@svgr/core";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import svgrConfig from "../svgr.config";

// Legacy icon modules rely on the classic React runtime in generated output.
// Provide a global React reference so runtime-rendered components work in Node.
(globalThis as typeof globalThis & { React: typeof React }).React = React;

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "../../..");
const SVG_ROOT = join(ROOT, "packages/astudio-icons/src/svg");
const REACT_ROOT = join(ROOT, "packages/astudio-icons/src/react");

const CATEGORIES = [
  "arrows",
  "interface",
  "settings",
  "chat-tools",
  "account-user",
  "platform",
  "misc",
] as const;

type Category = (typeof CATEGORIES)[number];

type ModuleSource = {
  path: string;
  category?: Category;
  infer?: boolean;
};

const MODULE_SOURCES: ModuleSource[] = [
  { path: "packages/ui/src/icons/legacy/chatgpt/arrows.tsx", category: "arrows" },
  { path: "packages/ui/src/icons/legacy/chatgpt/interface.tsx", category: "interface" },
  { path: "packages/ui/src/icons/legacy/chatgpt/settings.tsx", category: "settings" },
  { path: "packages/ui/src/icons/legacy/chatgpt/public.tsx", category: "chat-tools" },
  { path: "packages/ui/src/icons/legacy/chatgpt/account.tsx", category: "account-user" },
  { path: "packages/ui/src/icons/legacy/chatgpt/platform.tsx", category: "platform" },
  { path: "packages/ui/src/icons/legacy/chatgpt/misc.tsx", category: "misc" },
  { path: "packages/ui/src/icons/legacy/chat/HeaderIcons.tsx", category: "chat-tools" },
  { path: "packages/ui/src/icons/legacy/chat/InputIcons.tsx", category: "chat-tools" },
  { path: "packages/ui/src/icons/legacy/brand/index.tsx", category: "misc" },
  { path: "packages/ui/src/icons/chatgpt/ChatGPTIconsFixed.tsx", infer: true },
  { path: "packages/ui/src/icons/chatgpt/additional-icons.tsx", infer: true },
  { path: "packages/ui/src/icons/chatgpt/missing-icons.tsx", infer: true },
  { path: "packages/ui/src/icons/brands/index.tsx", category: "misc" },
];

const ensureDir = (path: string) => {
  mkdirSync(path, { recursive: true });
};

const toKebabCase = (value: string) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .replace(/_/g, "-")
    .toLowerCase();

const toComponentName = (value: string) => {
  return value
    .split(/[-_\s]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
};

const inferCategoryFromName = (name: string): Category => {
  const target = name.toLowerCase();

  const arrowKeywords = [
    "arrow",
    "chevron",
    "expand",
    "collapse",
    "shuffle",
    "reply",
    "undo",
    "redo",
    "rotate",
    "refresh",
  ];
  if (arrowKeywords.some((word) => target.includes(word))) {
    return "arrows";
  }

  const settingsKeywords = ["settings", "gear", "slider", "tune", "adjust", "filter"];
  if (settingsKeywords.some((word) => target.includes(word))) {
    return "settings";
  }

  const accountKeywords = [
    "user",
    "account",
    "profile",
    "person",
    "avatar",
    "member",
    "group",
    "team",
  ];
  if (accountKeywords.some((word) => target.includes(word))) {
    return "account-user";
  }

  const platformKeywords = [
    "battery",
    "wifi",
    "signal",
    "desktop",
    "monitor",
    "laptop",
    "phone",
    "mobile",
    "cloud",
    "server",
    "plug",
    "battery",
  ];
  if (platformKeywords.some((word) => target.includes(word))) {
    return "platform";
  }

  const chatKeywords = [
    "chat",
    "message",
    "prompt",
    "tool",
    "wrench",
    "hammer",
    "bot",
    "spark",
    "magic",
    "wand",
    "microphone",
    "mic",
  ];
  if (chatKeywords.some((word) => target.includes(word))) {
    return "chat-tools";
  }

  return "interface";
};

const normalizeSvg = (markup: string) => {
  const svgMatch = markup.match(/<svg[\s\S]*?<\/svg>/);
  if (!svgMatch) {
    throw new Error("SVG markup not found");
  }

  let svg = svgMatch[0];

  if (!svg.includes("xmlns=")) {
    svg = svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  svg = svg.replace(/\sclass="[^"]*"/g, "");

  const divStyleMatch = markup.match(/<div[^>]*style="([^"]*)"[^>]*>/);
  if (divStyleMatch?.[1]) {
    const styleValue = divStyleMatch[1].trim();
    if (styleValue.length > 0) {
      if (svg.includes('style="')) {
        svg = svg.replace(/style="([^"]*)"/, (_full, existing) => {
          const merged = `${existing};${styleValue}`;
          return `style="${merged}"`;
        });
      } else {
        svg = svg.replace("<svg", `<svg style="${styleValue}"`);
      }
    }
  }

  return svg;
};

type IconRecord = {
  exportName: string;
  iconName: string;
  componentName: string;
  category: Category;
  svg: string;
};

const loadModule = async (modulePath: string) => {
  const url = pathToFileURL(join(ROOT, modulePath)).href;
  return import(url);
};

const collectIcons = async () => {
  const seen = new Set<string>();
  const records: IconRecord[] = [];

  for (const source of MODULE_SOURCES) {
    const moduleExports = await loadModule(source.path);
    const exportNames = Object.keys(moduleExports);

    for (const exportName of exportNames) {
      const exported = moduleExports[exportName as keyof typeof moduleExports];
      if (typeof exported !== "function") {
        continue;
      }

      const rawName = exportName.startsWith("Icon") ? exportName.slice(4) : exportName;
      if (!rawName) {
        continue;
      }

      const iconName = toKebabCase(rawName);
      if (seen.has(iconName)) {
        continue;
      }

      const category = source.category ?? (source.infer ? inferCategoryFromName(iconName) : "misc");

      const element = React.createElement(exported, {});
      const markup = renderToStaticMarkup(element);
      const svg = normalizeSvg(markup);
      const componentName = toComponentName(iconName);

      records.push({ exportName, iconName, componentName, category, svg });
      seen.add(iconName);
    }
  }

  return records;
};

const writeSvgFiles = (records: IconRecord[]) => {
  for (const record of records) {
    const dir = join(SVG_ROOT, record.category);
    ensureDir(dir);
    writeFileSync(join(dir, `${record.iconName}.svg`), `${record.svg}\n`);
  }
};

const writeReactComponents = async (records: IconRecord[]) => {
  for (const record of records) {
    const svgPath = join(SVG_ROOT, record.category, `${record.iconName}.svg`);
    const svgCode = readFileSync(svgPath, "utf8");
    const componentCode = await transform(
      svgCode,
      {
        ...svgrConfig,
        icon: false,
        typescript: true,
      },
      { componentName: record.componentName, filePath: svgPath },
    );

    const outDir = join(REACT_ROOT, record.category);
    ensureDir(outDir);
    writeFileSync(join(outDir, `${record.componentName}.tsx`), componentCode);
  }
};

const writeCategoryIndexes = (records: IconRecord[]) => {
  const grouped = new Map<Category, IconRecord[]>();
  for (const category of CATEGORIES) {
    grouped.set(category, []);
  }
  for (const record of records) {
    grouped.get(record.category)?.push(record);
  }

  for (const category of CATEGORIES) {
    const entries = grouped.get(category) ?? [];
    entries.sort((a, b) => a.componentName.localeCompare(b.componentName));

    const dir = join(REACT_ROOT, category);
    ensureDir(dir);
    const indexPath = join(dir, "index.ts");
    const lines = entries.map(
      (record) => `export { default as ${record.componentName} } from "./${record.componentName}";`,
    );
    writeFileSync(indexPath, `${lines.join("\n")}\n`);
  }
};

const writeRegistry = (records: IconRecord[]) => {
  const lines: string[] = [];
  const sorted = [...records].sort((a, b) => a.iconName.localeCompare(b.iconName));

  for (const record of sorted) {
    lines.push(
      `import ${record.componentName} from "./react/${record.category}/${record.componentName}";`,
    );
  }

  lines.push("\nexport const iconRegistry = {");
  for (const record of sorted) {
    lines.push(`  "${record.iconName}": ${record.componentName},`);
  }
  lines.push("} as const;\n");

  writeFileSync(join(ROOT, "packages/astudio-icons/src/registry.ts"), `${lines.join("\n")}\n`);
};

const writeTypes = (records: IconRecord[]) => {
  const iconNames = [...records].map((record) => `  | "${record.iconName}"`).sort();
  const categories = CATEGORIES.map((category) => `  | "${category}"`).join("\n");

  const content = `export type IconName =\n${iconNames.join("\n")};\n\nexport type IconCategory =\n${categories};\n\nexport const ICON_CATEGORIES = ${JSON.stringify(CATEGORIES, null, 2)} as const;\n`;
  writeFileSync(join(ROOT, "packages/astudio-icons/src/types.ts"), `${content}\n`);
};

const writeCategoryBarrels = () => {
  for (const category of CATEGORIES) {
    const target = join(ROOT, `packages/astudio-icons/src/${category}.ts`);
    writeFileSync(target, `export * from "./react/${category}";\n`);
  }
};

const writeIndex = () => {
  const content = `export { Icon } from "./Icon";\nexport type { IconProps } from "./Icon";\n\nexport type { IconName, IconCategory } from "./types";\nexport { ICON_CATEGORIES } from "./types";\n\nexport * as ArrowIcons from "./arrows";\nexport * as InterfaceIcons from "./interface";\nexport * as SettingsIcons from "./settings";\nexport * as ChatToolsIcons from "./chat-tools";\nexport * as AccountUserIcons from "./account-user";\nexport * as PlatformIcons from "./platform";\nexport * as MiscIcons from "./misc";\n\nexport { Download, Sparkles } from "@openai/apps-sdk-ui/components/Icon";\n`;
  writeFileSync(join(ROOT, "packages/astudio-icons/src/index.ts"), content);
};

const main = async () => {
  rmSync(SVG_ROOT, { recursive: true, force: true });
  rmSync(REACT_ROOT, { recursive: true, force: true });
  ensureDir(SVG_ROOT);
  ensureDir(REACT_ROOT);

  const records = await collectIcons();
  records.sort((a, b) => a.iconName.localeCompare(b.iconName));

  writeSvgFiles(records);
  await writeReactComponents(records);
  writeCategoryIndexes(records);
  writeRegistry(records);
  writeTypes(records);
  writeCategoryBarrels();
  writeIndex();

  console.log(`Generated ${records.length} icons.`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
