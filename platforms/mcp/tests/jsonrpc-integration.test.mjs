import assert from "node:assert/strict";
import http from "node:http";
import test from "node:test";

/**
 * JSON-RPC 2.0 integration tests for the MCP server
 * These tests verify the server responds correctly to JSON-RPC calls
 * without relying on the broken MCP Inspector CLI.
 */

const SERVER_URL = process.env.MCP_TEST_URL || "http://127.0.0.1:8787";
const MCP_ENDPOINT = "/mcp";

/**
 * Make a JSON-RPC request to the MCP server
 */
async function jsonRpcRequest(method, params = {}, id = 1) {
  const url = new URL(MCP_ENDPOINT, SERVER_URL);

  const payload = JSON.stringify({
    jsonrpc: "2.0",
    method,
    params,
    id,
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        "MCP-Protocol-Version": "2024-11-05",
        "Content-Length": Buffer.byteLength(payload),
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const response = JSON.parse(data);
          resolve(response);
        } catch {
          reject(new Error(`Invalid JSON response: ${data}`));
        }
      });
    });

    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

/**
 * Start the MCP server for testing
 */
async function startTestServer() {
  const { spawn } = await import("node:child_process");
  const serverProcess = spawn("node", ["enhanced-server.js"], {
    cwd: new URL("..", import.meta.url).pathname,
    env: { ...process.env, PORT: "8787", MCP_BIND_HOST: "127.0.0.1" },
    stdio: "ignore",
  });

  // Wait for server to be ready
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return serverProcess;
}

test("MCP Server JSON-RPC Integration Tests", async (t) => {
  let serverProcess;

  // Only start server if not already running
  if (!process.env.MCP_TEST_URL) {
    t.before(async () => {
      serverProcess = await startTestServer();
    });

    t.after(() => {
      if (serverProcess) {
        serverProcess.kill();
      }
    });
  }

  await t.test("tools/list returns valid tool list", async () => {
    const response = await jsonRpcRequest("tools/list");

    assert.ok(response, "Response should exist");
    assert.equal(response.jsonrpc, "2.0", "Should be JSON-RPC 2.0");
    assert.ok(!response.error, "Should not have error");
    assert.ok(response.result, "Should have result");
    assert.ok(Array.isArray(response.result.tools), "Result should contain tools array");
    assert.ok(response.result.tools.length > 0, "Should have at least one tool");

    // Verify tool structure
    const firstTool = response.result.tools[0];
    assert.ok(firstTool.name, "Tool should have name");
    assert.ok(firstTool.description, "Tool should have description");
    assert.ok(firstTool.inputSchema, "Tool should have inputSchema");

    // Verify JSON Schema 2020-12 is emitted
    for (const tool of response.result.tools) {
      if (tool.inputSchema) {
        assert.equal(
          tool.inputSchema.$schema,
          "https://json-schema.org/draft/2020-12/schema",
          `${tool.name}: inputSchema should be JSON Schema 2020-12`,
        );
      }

      if (tool.outputSchema) {
        assert.equal(
          tool.outputSchema.$schema,
          "https://json-schema.org/draft/2020-12/schema",
          `${tool.name}: outputSchema should be JSON Schema 2020-12`,
        );
      }
    }
  });

  await t.test("tools/call executes a widget tool", async () => {
    // First get the list of tools
    const listResponse = await jsonRpcRequest("tools/list");
    const tools = listResponse.result.tools;

    // Find a widget tool (should have 'widget' in the name or description)
    const widgetTool = tools.find(
      (tool) => tool.name.includes("widget") || tool.description.toLowerCase().includes("widget"),
    );

    if (!widgetTool) {
      console.log("No widget tools found, skipping tools/call test");
      return;
    }

    // Call the tool with minimal valid params
    const callResponse = await jsonRpcRequest("tools/call", {
      name: widgetTool.name,
      arguments: {}, // Most widgets should work with empty args
    });

    assert.ok(callResponse, "Call response should exist");
    assert.ok(!callResponse.error, `Should not have error: ${JSON.stringify(callResponse.error)}`);
    assert.ok(callResponse.result, "Should have result");
  });

  await t.test("resources/list returns widget resources", async () => {
    const response = await jsonRpcRequest("resources/list");

    assert.ok(response, "Response should exist");
    assert.equal(response.jsonrpc, "2.0", "Should be JSON-RPC 2.0");
    assert.ok(!response.error, "Should not have error");
    assert.ok(response.result, "Should have result");
    assert.ok(Array.isArray(response.result.resources), "Result should contain resources array");

    // Verify resource structure if resources exist
    if (response.result.resources.length > 0) {
      const firstResource = response.result.resources[0];
      assert.ok(firstResource.uri, "Resource should have uri");
      assert.ok(firstResource.name, "Resource should have name");
    }
  });

  await t.test("invalid method returns error", async () => {
    const response = await jsonRpcRequest("invalid/method");

    assert.ok(response.error, "Should have error");
    assert.equal(response.error.code, -32601, "Should be method not found error");
  });

  await t.test("malformed request returns error", async () => {
    const url = new URL(MCP_ENDPOINT, SERVER_URL);

    return new Promise((resolve) => {
      const req = http.request(
        {
          hostname: url.hostname,
          port: url.port,
          path: url.pathname,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json, text/event-stream",
            "MCP-Protocol-Version": "2024-11-05",
          },
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            const response = JSON.parse(data);
            assert.ok(response.error, "Should have error for malformed request");
            resolve();
          });
        },
      );

      req.write("not valid json");
      req.end();
    });
  });
});
