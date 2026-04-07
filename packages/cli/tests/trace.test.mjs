import assert from "node:assert/strict";
import test from "node:test";
import { runCli } from "./test-utils.mjs";

test("doctor --json includes trace IDs", async () => {
  const { code, stdout } = await runCli(["doctor", "--json"]);
  assert.equal(code, 0);
  const payload = JSON.parse(stdout);
  assert.ok(payload.meta.trace_id, "Should include trace_id");
  assert.ok(payload.meta.request_id, "Should include request_id");
  // Trace ID should be 32 hex characters
  assert.match(payload.meta.trace_id, /^[a-f0-9]{32}$/);
});

test("traceparent env var is propagated", async () => {
  const traceId = "4bf92f3577b34da6a3ce929d0e0e4736";
  const parentId = "00f067aa0ba902b7";
  const traceparent = `00-${traceId}-${parentId}-01`;

  const { code, stdout } = await runCli(["doctor", "--json"], {
    TRACEPARENT: traceparent,
  });
  assert.equal(code, 0);
  const payload = JSON.parse(stdout);
  assert.equal(payload.meta.trace_id, traceId);
  assert.equal(payload.meta.parent_id, parentId);
});

test("ASTUDIO_TRACE_ID env var is used", async () => {
  const traceId = "abc123def45678901234567890123456";

  const { code, stdout } = await runCli(["doctor", "--json"], {
    ASTUDIO_TRACE_ID: traceId,
  });
  assert.equal(code, 0);
  const payload = JSON.parse(stdout);
  assert.equal(payload.meta.trace_id, traceId);
});

test("error response includes trace IDs", async () => {
  const { code, stdout } = await runCli(["xyz", "--json"]);
  assert.equal(code, 2);
  const payload = JSON.parse(stdout);
  assert.ok(payload.meta.trace_id, "Should include trace_id even in errors");
  assert.ok(payload.meta.request_id, "Should include request_id even in errors");
});
