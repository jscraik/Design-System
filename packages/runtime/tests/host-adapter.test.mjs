import { afterEach, describe, it } from "node:test";
import assert from "node:assert/strict";

import { createHostAdapter, createMockHost, createStandaloneHost } from "../dist/index.js";

const originalWindow = globalThis.window;

afterEach(() => {
  if (originalWindow === undefined) {
    delete globalThis.window;
  } else {
    globalThis.window = originalWindow;
  }
});

describe("Host adapter contracts", () => {
  it("creates a mock host when requested", () => {
    const host = createHostAdapter({ mode: "mock" });
    assert.equal(host.mode, "standalone");
    assert.equal(typeof host.callTool, "function");
    assert.equal(typeof host.sendMessage, "function");
  });

  it("creates a standalone host when apiBase is provided", () => {
    const host = createStandaloneHost("https://example.com");
    assert.equal(host.mode, "standalone");
    assert.equal(typeof host.callTool, "function");
  });

  it("throws when standalone mode is missing apiBase", () => {
    assert.throws(() => createHostAdapter({ mode: "standalone" }), /apiBase/);
  });

  it("creates an embedded host when window.openai is available", () => {
    globalThis.window = {
      openai: {
        callTool: async () => ({ ok: true }),
      },
    };

    const host = createHostAdapter();
    assert.equal(host.mode, "embedded");
    assert.equal(typeof host.callTool, "function");
  });

  it("mock host exposes expected methods", () => {
    const host = createMockHost();
    assert.equal(typeof host.requestDisplayMode, "function");
    assert.equal(typeof host.requestModal, "function");
    assert.equal(typeof host.openExternal, "function");
  });
});
