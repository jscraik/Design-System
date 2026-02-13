import assert from "node:assert/strict";
import test from "node:test";
import { createEnhancedChatUiServer } from "../enhanced-server.js";
import { createChatUiServer } from "../server.js";
import toolContracts from "../tool-contracts.json" with { type: "json" };

function getRegisteredTools(createServer) {
  const server = createServer();
  return server._registeredTools ?? {};
}

const serverVariants = [
  { label: "legacy", factory: createChatUiServer },
  { label: "enhanced", factory: createEnhancedChatUiServer },
];

for (const variant of serverVariants) {
  test(`tool contracts cover all registered tools (${variant.label})`, () => {
    const tools = getRegisteredTools(variant.factory);
    const registeredNames = Object.keys(tools).sort();
    const contractNames = Object.keys(toolContracts).sort();

    for (const name of contractNames) {
      assert.ok(
        registeredNames.includes(name),
        `Tool contracts mismatch (${variant.label}). Missing registered tool: ${name}`,
      );
    }

    const extraNames = registeredNames.filter((name) => !contractNames.includes(name));
    const unexpectedExtras = extraNames.filter((name) => !name.startsWith("widget_preview_"));
    assert.deepEqual(
      unexpectedExtras,
      [],
      `Unexpected extra tools (${variant.label}): ${unexpectedExtras.join(", ")}`,
    );
  });

  test(`tool contracts validate required metadata (${variant.label})`, () => {
    const tools = getRegisteredTools(variant.factory);

    for (const [name, contract] of Object.entries(toolContracts)) {
      const tool = tools[name];
      assert.ok(tool, `Missing registered tool (${variant.label}): ${name}`);

      const meta = tool._meta ?? {};
      const annotations = tool.annotations ?? {};

      assert.equal(
        annotations.readOnlyHint,
        contract.readOnlyHint,
        `${name} (${variant.label}): readOnlyHint should be ${contract.readOnlyHint}`,
      );
      assert.equal(
        meta["openai/widgetAccessible"],
        contract.widgetAccessible,
        `${name} (${variant.label}): openai/widgetAccessible should be ${contract.widgetAccessible}`,
      );
      assert.equal(
        meta["openai/visibility"],
        contract.visibility,
        `${name} (${variant.label}): openai/visibility should be ${contract.visibility}`,
      );

      assert.ok(
        Array.isArray(meta.securitySchemes) && meta.securitySchemes.length > 0,
        `${name} (${variant.label}): _meta.securitySchemes must be defined`,
      );

      const outputTemplate = meta["openai/outputTemplate"];
      assert.ok(
        typeof outputTemplate === "string",
        `${name} (${variant.label}): openai/outputTemplate missing`,
      );
      assert.ok(
        outputTemplate.includes(contract.outputTemplateIncludes),
        `${name} (${variant.label}): openai/outputTemplate should include ${contract.outputTemplateIncludes}`,
      );

      assert.ok(
        Array.isArray(contract.goldenPrompts) && contract.goldenPrompts.length > 0,
        `${name} (${variant.label}): goldenPrompts must be defined`,
      );
    }
  });

  test(`widget preview tools validate required metadata (${variant.label})`, () => {
    const tools = getRegisteredTools(variant.factory);

    for (const [name, tool] of Object.entries(tools)) {
      if (!name.startsWith("widget_preview_")) {
        continue;
      }

      const meta = tool._meta ?? {};
      const annotations = tool.annotations ?? {};
      const widgetName = name.replace("widget_preview_", "");

      assert.equal(
        annotations.readOnlyHint,
        true,
        `${name} (${variant.label}): readOnlyHint should be true`,
      );
      assert.equal(
        meta["openai/widgetAccessible"],
        false,
        `${name} (${variant.label}): openai/widgetAccessible should be false`,
      );
      assert.equal(
        meta["openai/visibility"],
        "public",
        `${name} (${variant.label}): openai/visibility should be public`,
      );

      const outputTemplate = meta["openai/outputTemplate"];
      assert.ok(
        typeof outputTemplate === "string",
        `${name} (${variant.label}): openai/outputTemplate missing`,
      );
      assert.ok(
        outputTemplate.includes(widgetName),
        `${name} (${variant.label}): openai/outputTemplate should include ${widgetName}`,
      );
    }
  });
}
