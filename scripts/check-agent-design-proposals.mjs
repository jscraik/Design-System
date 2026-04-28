import { validateProposalGate } from "../packages/agent-design-engine/dist/index.js";

const result = validateProposalGate(process.cwd());

console.log("agent-design: proposal gate");
console.log(`  waiver registry: ${result.waiverRegistryPath}`);

for (const diagnostic of result.diagnostics) {
  const label = diagnostic.severity === "error" ? "ERROR" : "WARN";
  const target = diagnostic.target ? ` ${diagnostic.target}` : "";
  console.log(`  [${label}] ${diagnostic.code}${target}: ${diagnostic.message}`);
}

if (result.ok) {
  console.log("agent-design: proposal gate ok");
} else {
  console.log("agent-design: proposal gate failed");
  process.exitCode = 1;
}
