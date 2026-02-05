import { readFile } from "node:fs/promises";

import { validateTokens } from "../src/validation/token-validator.js";

const SCHEMA_PATH = new URL("../schema/dtcg.schema.json", import.meta.url);
const SCHEMA_VERSION_PATH = new URL("../SCHEMA_VERSION", import.meta.url);
const DTCG_PATH = new URL("../src/tokens/index.dtcg.json", import.meta.url);

async function validateSchemaReference(): Promise<string[]> {
  const errors: string[] = [];
  const [schemaExists, schemaVersion, dtcgRaw] = await Promise.all([
    readFile(SCHEMA_PATH, "utf8"),
    readFile(SCHEMA_VERSION_PATH, "utf8"),
    readFile(DTCG_PATH, "utf8"),
  ]);

  if (!schemaExists.trim()) {
    errors.push("SCHEMA_FILE_MISSING: schema file is empty.");
  }

  if (!schemaVersion.trim()) {
    errors.push("SCHEMA_VERSION_MISSING: SCHEMA_VERSION file is empty.");
  }

  const dtcg = JSON.parse(dtcgRaw) as { $schema?: string };
  if (!dtcg.$schema || !dtcg.$schema.includes("schema/dtcg.schema.json")) {
    errors.push("SCHEMA_REFERENCE_INVALID: index.dtcg.json must reference the pinned schema file.");
  }

  return errors;
}

async function main(): Promise<void> {
  const schemaErrors = await validateSchemaReference();
  const { errors } = await validateTokens();

  const allErrors = [
    ...schemaErrors.map((message) => ({ code: message.split(":")[0], message, suggestion: "" })),
    ...errors,
  ];

  if (allErrors.length === 0) {
    console.log("✅ Token validation passed");
    return;
  }

  console.log("❌ Token validation failed:\n");
  for (const error of allErrors) {
    console.log(`- [${error.code}] ${error.message}`);
    if (error.suggestion) {
      console.log(`  Suggestion: ${error.suggestion}`);
    }
  }
  process.exit(1);
}

await main();
