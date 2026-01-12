import { afterEach, describe, expect, it, vi } from "vitest";
import { createHash } from "node:crypto";
import { RemoteSkillClient } from "./remoteClient.js";

const originalFetch = globalThis.fetch;

describe("RemoteSkillClient", () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("rejects when strictIntegrity enabled without checksum", async () => {
    const client = new RemoteSkillClient({ baseURL: "https://example.test", strictIntegrity: true });
    mockFetchOnce(Buffer.from("zip"));
    await expect(client.download("demo")).rejects.toThrow(/Checksum is required/);
  });

  it("verifies checksum when provided", async () => {
    const client = new RemoteSkillClient({ baseURL: "https://example.test" });
    const payload = Buffer.from("demo-zip");
    const checksum = cryptoChecksum(payload);
    mockFetchOnce(payload);
    const result = await client.download("demo", { expectedChecksum: checksum });
    expect(result.verified).toBe(true);
  });

  it("fails on checksum mismatch", async () => {
    const client = new RemoteSkillClient({ baseURL: "https://example.test" });
    mockFetchOnce(Buffer.from("different"));
    await expect(
      client.download("demo", { expectedChecksum: "deadbeef" }),
    ).rejects.toThrow(/checksum/i);
  });
});

function mockFetchOnce(body: Buffer) {
  const response = new Response(new Uint8Array(body), {
    status: 200,
    headers: { "content-type": "application/zip" },
  });
  const fetchMock = vi.fn().mockResolvedValue(response);
  globalThis.fetch = fetchMock;
}

const cryptoChecksum = (data: Buffer): string =>
  createHash("sha256").update(data).digest("hex");
