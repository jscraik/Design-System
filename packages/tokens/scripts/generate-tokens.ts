#!/usr/bin/env node

import { TokenGenerator } from "../src/generator.js";

async function main() {
  try {
    const generator = new TokenGenerator();
    await generator.generate();
    process.exit(0);
  } catch (error) {
    console.error("❌ Token generation failed:", error);
    process.exit(1);
  }
}

main();
