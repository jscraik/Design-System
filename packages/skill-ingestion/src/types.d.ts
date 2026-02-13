export type SkillMetadata = {
  name: string | null;
  description: string | null;
};
export type SkillReference = {
  id: string;
  name: string;
  path: string;
};
export type SkillStats = {
  references: number;
  assets: number;
  scripts: number;
  templates: number;
};
export type SkillPlatform = "codex" | "claude" | "opencode" | "copilot";
export type SkillSummary = {
  id: string;
  name: string;
  displayName: string;
  description: string;
  platform?: SkillPlatform;
  customPath?: string;
  folderPath: string;
  skillMarkdownPath: string;
  references: SkillReference[];
  stats: SkillStats;
};
export type InstallDestination = {
  rootPath: string;
  storageKey: string;
};
export type OriginMetadata = {
  slug: string;
  version: string | null;
  source: string;
  installedAt: number;
};
export type RemoteSkill = {
  id: string;
  slug: string;
  displayName: string;
  summary?: string;
  latestVersion?: string;
  updatedAt?: Date;
  downloads?: number;
  stars?: number;
};
export type RemoteSkillOwner = {
  handle?: string;
  displayName?: string;
  imageURL?: string;
};
export type DownloadedSkill = {
  zipPath: string;
  tempDir: string;
  checksum: string;
  verified: boolean;
};
export declare const skillPlatformMeta: Record<
  SkillPlatform,
  {
    storageKey: string;
    relativePath: string;
  }
>;
export declare function platformRootPath(platform: SkillPlatform, baseDir?: string): string;
export declare function platformStorageKey(platform: SkillPlatform): string;
//# sourceMappingURL=types.d.ts.map
