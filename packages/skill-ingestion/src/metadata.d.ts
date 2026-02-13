export type FrontmatterKey = "name" | "description";
export declare const FRONTMATTER_DELIMITER = "---";
export type ParsedMetadata = {
  name: string | null;
  description: string | null;
};
export declare function parseMetadata(markdown: string): ParsedMetadata;
export declare function stripFrontmatter(markdown: string): string;
export declare function formatTitle(input: string): string;
//# sourceMappingURL=metadata.d.ts.map
