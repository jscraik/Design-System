#!/usr/bin/env node
import http from "node:http";

/**
 * Simple MCP JSON-RPC test CLI
 * Usage: node scripts/test-mcp-cli.mjs <method> [params-json]
 *
 * Examples:
 *   node scripts/test-mcp-cli.mjs tools/list
 *   node scripts/test-mcp-cli.mjs tools/call '{"name":"example_widget","arguments":{}}'
 *   node scripts/test-mcp-cli.mjs resources/list
 */

const SERVER_URL = process.env.MCP_TEST_URL || "http://127.0.0.1:8787";
const MCP_ENDPOINT = "/mcp";

async function jsonRpcRequest(method, params = {}) {
  const url = new URL(MCP_ENDPOINT, SERVER_URL);

  const payload = JSON.stringify({
    jsonrpc: "2.0",
    method,
    params,
    id: Date.now(),
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

    req.on("error", (err) => {
      reject(
        new Error(
          `Connection failed: ${err.message}\nMake sure the MCP server is running on ${SERVER_URL}`,
        ),
      );
    });

    req.write(payload);
    req.end();
  });
}

function printHelp() {
  console.log(`
MCP JSON-RPC Test CLI

Usage: node scripts/test-mcp-cli.mjs <method> [params-json]

Environment:
  MCP_TEST_URL    Server URL (default: http://127.0.0.1:8787)

Methods:
  tools/list              List all available tools
  tools/call              Call a tool (requires params)
  resources/list          List all resources
  resources/read          Read a resource (requires params)
  prompts/list            List all prompts
  prompts/get             Get a prompt (requires params)

Examples:
  # List all tools
  node scripts/test-mcp-cli.mjs tools/list

  # Call a widget tool
  node scripts/test-mcp-cli.mjs tools/call '{"name":"example_widget","arguments":{}}'

  # List resources
  node scripts/test-mcp-cli.mjs resources/list

  # Read a resource
  node scripts/test-mcp-cli.mjs resources/read '{"uri":"widget://example"}'

  # Use custom server URL
  MCP_TEST_URL=http://localhost:8797 node scripts/test-mcp-cli.mjs tools/list
`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    printHelp();
    process.exit(0);
  }

  const method = args[0];
  let params = {};

  if (args[1]) {
    try {
      params = JSON.parse(args[1]);
    } catch (err) {
      console.error("Error: Invalid JSON params");
      console.error(err.message);
      process.exit(1);
    }
  }

  console.log(`Testing MCP server at: ${SERVER_URL}${MCP_ENDPOINT}`);
  console.log(`Method: ${method}`);
  console.log(`Params: ${JSON.stringify(params, null, 2)}\n`);

  try {
    const response = await jsonRpcRequest(method, params);

    if (response.error) {
      console.error("❌ Error response:");
      console.error(JSON.stringify(response.error, null, 2));
      process.exit(1);
    }

    console.log("✅ Success:");
    console.log(JSON.stringify(response.result, null, 2));
    process.exit(0);
  } catch (err) {
    console.error("❌ Request failed:");
    console.error(err.message);
    process.exit(1);
  }
}

main();
