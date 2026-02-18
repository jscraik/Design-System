import { OriginMetadata, InstallDestination } from "./types.js";
export type InstallOptions = {
    slug: string;
    version?: string | null;
    source?: string;
    strictSingleSkill?: boolean;
};
export type InstallResult = {
    selectedId?: string;
    installPaths: string[];
};
export declare function installSkillFromZip(zipPath: string, destinations: InstallDestination[], options: InstallOptions): Promise<InstallResult>;
export declare function findSkillRoot(rootDir: string, strictSingleSkill: boolean): string;
export declare function writeOrigin(destination: string, origin: OriginMetadata): void;
export declare function buildOrigin(options: InstallOptions): OriginMetadata;
export declare function uniqueDestinationPath(base: string, slug: string): string;
export declare function deleteSkill(paths: string[]): void;
export declare function publishStateDirectory(): string;
export declare function loadPublishHash(slug: string): string | null;
export declare function savePublishHash(slug: string, skillPath: string): void;
//# sourceMappingURL=installer.d.ts.map