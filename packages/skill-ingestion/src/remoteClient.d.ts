import { DownloadedSkill, RemoteSkill, RemoteSkillOwner } from "./types.js";
export type RemoteSkillClientOptions = {
  baseURL?: string;
  strictIntegrity?: boolean;
};
export type DownloadOptions = {
  version?: string;
  tag?: string;
  expectedChecksum?: string;
  strictIntegrity?: boolean;
  signal?: AbortSignal;
};
export declare class RemoteSkillClient {
  private readonly baseURL;
  private readonly strictIntegrity;
  private readonly cache;
  constructor(options?: RemoteSkillClientOptions);
  fetchLatest(limit?: number, signal?: AbortSignal): Promise<RemoteSkill[]>;
  search(query: string, limit?: number, signal?: AbortSignal): Promise<RemoteSkill[]>;
  fetchDetail(slug: string, signal?: AbortSignal): Promise<RemoteSkillOwner | null>;
  fetchLatestVersion(slug: string, signal?: AbortSignal): Promise<string | null>;
  download(slug: string, options?: DownloadOptions): Promise<DownloadedSkill>;
  private jsonFetch;
}
//# sourceMappingURL=remoteClient.d.ts.map
