import { SkillPlatform, SkillReference, SkillStats, SkillSummary } from "./types.js";
type ScanResult = {
  id: string;
  name: string;
  displayName: string;
  description: string;
  folderPath: string;
  skillMarkdownPath: string;
  references: SkillReference[];
  stats: SkillStats;
};
export declare function scanSkills(
  basePath: string,
  storageKey: string,
  platform?: SkillPlatform,
): ScanResult[];
export declare function referenceFiles(dirPath: string): SkillReference[];
export declare function countEntries(dirPath: string): number;
export declare function loadMarkdown(markdownPath: string): {
  raw: string;
  content: string;
};
export declare function computePublishHash(skillFolder: string): string;
export declare function buildSkillSummary(
  scanned: ScanResult,
  platform?: SkillPlatform,
  customPath?: string,
): SkillSummary;
export {};
//# sourceMappingURL=scan.d.ts.map
