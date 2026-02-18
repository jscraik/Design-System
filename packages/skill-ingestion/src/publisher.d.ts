export type PublishBump = "major" | "minor" | "patch";
export type PublishOptions = {
  skillPath: string;
  slug: string;
  latestVersion?: string | null;
  bump?: PublishBump;
  changelog?: string;
  tags?: string[];
  dryRun?: boolean;
  env?: Record<string, string>;
  cwd?: string;
};
export type PublishResult = {
  version: string;
  skipped: boolean;
  command?: string[];
};
export declare function bumpVersion(current: string, bump: PublishBump): string | null;
export declare function resolveBunxPath(): string | null;
export declare function publishSkill(options: PublishOptions): Promise<PublishResult>;
//# sourceMappingURL=publisher.d.ts.map
