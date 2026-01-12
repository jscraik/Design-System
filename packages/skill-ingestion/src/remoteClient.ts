import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
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

export class RemoteSkillClient {
  private readonly baseURL: string;
  private readonly strictIntegrity: boolean;
  private readonly cache = new Map<string, Response>();

  constructor(options?: RemoteSkillClientOptions) {
    this.baseURL = options?.baseURL ?? "https://clawdhub.com";
    this.strictIntegrity = options?.strictIntegrity ?? false;
  }

  async fetchLatest(limit = 50, signal?: AbortSignal): Promise<RemoteSkill[]> {
    const url = new URL("/api/v1/skills", this.baseURL);
    url.searchParams.set("limit", String(limit));
    const data = await this.jsonFetch<{
      items: Array<{
        slug: string;
        displayName: string;
        summary?: string;
        updatedAt: number;
        latestVersion?: { version: string };
        stats?: { downloads?: number; stars?: number };
      }>;
    }>(url, signal);

    return data.items.map((item) => ({
      id: item.slug,
      slug: item.slug,
      displayName: item.displayName,
      summary: item.summary,
      latestVersion: item.latestVersion?.version,
      updatedAt: new Date(item.updatedAt / 1000),
      downloads: item.stats?.downloads,
      stars: item.stats?.stars,
    }));
  }

  async search(query: string, limit = 50, signal?: AbortSignal): Promise<RemoteSkill[]> {
    const url = new URL("/api/v1/search", this.baseURL);
    url.searchParams.set("q", query);
    url.searchParams.set("limit", String(limit));
    const data = await this.jsonFetch<{
      results: Array<{
        slug?: string;
        displayName?: string;
        summary?: string;
        version?: string;
        updatedAt?: number;
      }>;
    }>(url, signal);

    return data.results
      .filter((r) => r.slug && r.displayName)
      .map((r) => ({
        id: r.slug!,
        slug: r.slug!,
        displayName: r.displayName!,
        summary: r.summary,
        latestVersion: r.version,
        updatedAt: r.updatedAt ? new Date(r.updatedAt / 1000) : undefined,
      }));
  }

  async fetchDetail(slug: string, signal?: AbortSignal): Promise<RemoteSkillOwner | null> {
    const url = new URL("/api/skill", this.baseURL);
    url.searchParams.set("slug", slug);
    const data = await this.jsonFetch<{ owner?: { handle?: string; displayName?: string; image?: string } }>(
      url,
      signal,
    );
    if (!data.owner) return null;
    return {
      handle: data.owner.handle,
      displayName: data.owner.displayName,
      imageURL: data.owner.image,
    };
  }

  async fetchLatestVersion(slug: string, signal?: AbortSignal): Promise<string | null> {
    const url = new URL(`/api/v1/skills/${slug}`, this.baseURL);
    const data = await this.jsonFetch<{ latestVersion?: { version: string } }>(url, signal);
    return data.latestVersion?.version ?? null;
  }

  async download(
    slug: string,
    options?: DownloadOptions,
  ): Promise<DownloadedSkill> {
    const url = new URL("/api/v1/download", this.baseURL);
    url.searchParams.set("slug", slug);
    if (options?.version) {
      url.searchParams.set("version", options.version);
    } else {
      url.searchParams.set("tag", options?.tag ?? "latest");
    }

    const response = await fetch(url, { signal: options?.signal });
    validateResponse(response);

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "skill-download-"));
    const zipPath = path.join(tempDir, `${slug}.zip`);
    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(zipPath, buffer);

    const checksum = sha256(buffer);
    const strict = options?.strictIntegrity ?? this.strictIntegrity;

    if (strict && !options?.expectedChecksum) {
      throw new Error("Checksum is required when strictIntegrity is enabled.");
    }
    if (options?.expectedChecksum && !checksumEquals(checksum, options.expectedChecksum)) {
      throw new Error("Downloaded file checksum does not match expected value.");
    }

    return {
      zipPath,
      tempDir,
      checksum,
      verified: Boolean(options?.expectedChecksum),
    };
  }

  private async jsonFetch<T>(url: URL, signal?: AbortSignal): Promise<T> {
    const key = url.toString();
    const cached = this.cache.get(key);
    if (cached) {
      return (await cached.json()) as T;
    }

    const response = await fetch(url, { signal });
    validateResponse(response);
    const clone = response.clone();
    this.cache.set(key, clone);
    return (await response.json()) as T;
  }
}

function validateResponse(response: Response) {
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }
}

function sha256(data: Buffer): string {
  return createHash("sha256").update(data).digest("hex");
}

function checksumEquals(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase();
}
