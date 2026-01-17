import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
export class RemoteSkillClient {
  baseURL;
  strictIntegrity;
  cache = new Map();
  constructor(options) {
    this.baseURL = options?.baseURL ?? "https://clawdhub.com";
    this.strictIntegrity = options?.strictIntegrity ?? false;
  }
  async fetchLatest(limit = 50, signal) {
    const url = new URL("/api/v1/skills", this.baseURL);
    url.searchParams.set("limit", String(limit));
    const data = await this.jsonFetch(url, signal);
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
  async search(query, limit = 50, signal) {
    const url = new URL("/api/v1/search", this.baseURL);
    url.searchParams.set("q", query);
    url.searchParams.set("limit", String(limit));
    const data = await this.jsonFetch(url, signal);
    return data.results
      .filter((r) => r.slug && r.displayName)
      .map((r) => ({
        id: r.slug,
        slug: r.slug,
        displayName: r.displayName,
        summary: r.summary,
        latestVersion: r.version,
        updatedAt: r.updatedAt ? new Date(r.updatedAt / 1000) : undefined,
      }));
  }
  async fetchDetail(slug, signal) {
    const url = new URL("/api/skill", this.baseURL);
    url.searchParams.set("slug", slug);
    const data = await this.jsonFetch(url, signal);
    if (!data.owner) return null;
    return {
      handle: data.owner.handle,
      displayName: data.owner.displayName,
      imageURL: data.owner.image,
    };
  }
  async fetchLatestVersion(slug, signal) {
    const url = new URL(`/api/v1/skills/${slug}`, this.baseURL);
    const data = await this.jsonFetch(url, signal);
    return data.latestVersion?.version ?? null;
  }
  async download(slug, options) {
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
  async jsonFetch(url, signal) {
    const key = url.toString();
    const cached = this.cache.get(key);
    if (cached) {
      return await cached.json();
    }
    const response = await fetch(url, { signal });
    validateResponse(response);
    const clone = response.clone();
    this.cache.set(key, clone);
    return await response.json();
  }
}
function validateResponse(response) {
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }
}
function sha256(data) {
  return createHash("sha256").update(data).digest("hex");
}
function checksumEquals(a, b) {
  return a.toLowerCase() === b.toLowerCase();
}
//# sourceMappingURL=remoteClient.js.map
