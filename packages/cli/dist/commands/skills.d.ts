import type { Argv } from "yargs";
import type { CliArgs } from "../types.js";
import type { SkillPlatform } from "@design-studio/skill-ingestion";
export declare function skillsSearchCommand(args: {
    query: string;
    limit?: number;
    allowUnsafe?: boolean;
    argv: CliArgs;
}): Promise<void>;
export declare function skillsInstallCommand(args: {
    slug: string;
    platform: SkillPlatform;
    version?: string;
    checksum?: string;
    destination?: string;
    allowUnsafe?: boolean;
    argv: CliArgs;
}): Promise<void>;
export declare function skillsPublishCommand(args: {
    skillPath: string;
    slug?: string;
    latestVersion?: string;
    bump?: "major" | "minor" | "patch";
    changelog?: string;
    tags?: string;
    dryRun?: boolean;
    argv: CliArgs;
}): Promise<void>;
export declare function skillsCommand(yargs: Argv): Argv;
//# sourceMappingURL=skills.d.ts.map