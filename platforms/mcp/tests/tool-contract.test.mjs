import assert from "node:assert/strict";
import test from "node:test";

import toolContracts from "../tool-contracts.json" with { type: "json" };
import { createChatUiServer } from "../server.js";

function getRegisteredTools() {
  const server = createChatUiServer();
  return server._registeredTools ?? {};
}

test("tool contracts cover all registered tools", () => {
  const tools = getRegisteredTools();
  const registeredNames = Object.keys(tools).sort();
  const contractNames = Object.keys(toolContracts).sort();

  assert.deepEqual(
    registeredNames,
    contractNames,
    `Tool contracts mismatch. Registered: ${registeredNames.join(", ")}, Contracts: ${contractNames.join(", ")}`,
  );
});

test("tool contracts validate required metadata", () => {
  const tools = getRegisteredTools();

  for (const [name, contract] of Object.entries(toolContracts)) {
    const tool = tools[name];
    assert.ok(tool, `Missing registered tool: ${name}`);

    const meta = tool._meta ?? {};
    const annotations = tool.annotations ?? {};

    assert.equal(
      annotations.readOnlyHint,
      contract.readOnlyHint,
      `${name}: readOnlyHint should be ${contract.readOnlyHint}`,
    );
    assert.equal(
      meta["openai/widgetAccessible"],
      contract.widgetAccessible,
      `${name}: openai/widgetAccessible should be ${contract.widgetAccessible}`,
    );
    assert.equal(
      meta["openai/visibility"],
      contract.visibility,
      `${name}: openai/visibility should be ${contract.visibility}`,
    );

    assert.ok(
      Array.isArray(meta.securitySchemes) && meta.securitySchemes.length > 0,
      `${name}: _meta.securitySchemes must be defined`,
    );

    const outputTemplate = meta["openai/outputTemplate"];
    assert.ok(typeof outputTemplate === "string", `${name}: openai/outputTemplate missing`);
    assert.ok(
      outputTemplate.includes(contract.outputTemplateIncludes),
      `${name}: openai/outputTemplate should include ${contract.outputTemplateIncludes}`,
    );

    assert.ok(
      Array.isArray(contract.goldenPrompts) && contract.goldenPrompts.length > 0,
      `${name}: goldenPrompts must be defined`,
    );
  }
});
