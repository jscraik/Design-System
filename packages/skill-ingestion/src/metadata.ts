export type FrontmatterKey = "name" | "description";

export const FRONTMATTER_DELIMITER = "---";

export type ParsedMetadata = {
  name: string | null;
  description: string | null;
};

export function parseMetadata(markdown: string): ParsedMetadata {
  const lines = markdown.split(/\r?\n/);
  let name: string | null = null;
  let description: string | null = null;

  if (lines[0]?.trim() === FRONTMATTER_DELIMITER) {
    for (let i = 1; i < lines.length; i += 1) {
      const raw = lines[i]?.trim() ?? "";
      if (raw === FRONTMATTER_DELIMITER) {
        break;
      }
      const parsed = parseFrontmatterLine(raw);
      if (parsed?.key === "name") name = parsed.value;
      if (parsed?.key === "description") description = parsed.value;
    }
  }

  if (!name || !description) {
    const fallback = parseMarkdownFallback(lines);
    name = name ?? fallback.name;
    description = description ?? fallback.description;
  }

  return { name, description };
}

export function stripFrontmatter(markdown: string): string {
  const lines = markdown.split(/\r?\n/);
  if (lines[0]?.trim() !== FRONTMATTER_DELIMITER) return markdown.trim();

  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i]?.trim() === FRONTMATTER_DELIMITER) {
      return lines.slice(i + 1).join("\n").trim();
    }
  }
  return markdown.trim();
}

export function formatTitle(input: string): string {
  return input
    .replace(/[-_]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
    .join(" ");
}

function parseFrontmatterLine(
  line: string,
): { key: FrontmatterKey; value: string } | null {
  const [rawKey, ...rest] = line.split(":");
  if (!rawKey || rest.length === 0) return null;
  const key = rawKey.trim() as FrontmatterKey;
  const value = rest.join(":").trim().replace(/^['"]|['"]$/g, "");
  if (key !== "name" && key !== "description") return null;
  return { key, value };
}

function parseMarkdownFallback(lines: string[]): ParsedMetadata {
  let title: string | null = null;
  let summary: string | null = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (!title && line.startsWith("# ")) {
      title = line.slice(2).trim();
      continue;
    }
    if (!summary && line && !line.startsWith("#")) {
      summary = line;
      if (title && summary) break;
    }
  }

  return {
    name: title,
    description: summary,
  };
}
