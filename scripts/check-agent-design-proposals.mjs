import { validateProposalGate } from "../packages/agent-design-engine/dist/index.js";

const today = process.env.AGENT_DESIGN_PROPOSAL_TODAY ?? new Date().toISOString().slice(0, 10);

console.log("agent-design: proposal gate");

try {
  const result = validateProposalGate(process.cwd(), { today });

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
} catch (error) {
  console.log("agent-design: proposal gate failed");
  const message = error instanceof Error ? error.message : String(error);
  console.log(`  [ERROR] E_DESIGN_PROPOSAL_GATE_EXCEPTION: ${message}`);
  if (error instanceof Error && error.stack) {
    console.log(error.stack);
  }
  process.exitCode = 1;
}
