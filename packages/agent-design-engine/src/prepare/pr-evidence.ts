import type { PreparePayload } from "../types.js";
import { renderList } from "./text.js";

/**
 * Render PR-ready Markdown evidence from the typed prepare payload.
 */
export function renderPreparePrEvidence(payload: PreparePayload): string {
  const primaryRoute = payload.recommendedRoutes[0];
  const lines = [
    "### Agent Design Prepare Evidence",
    "",
    `- Surface: \`${payload.surfacePath}\``,
    `- Status: ${payload.safeForAutomaticImplementation ? "safe to implement" : "blocked"}`,
    `- Next action: \`${payload.nextAction.kind}\` - ${payload.nextAction.instruction}`,
    `- Next action reason code: \`${payload.nextAction.reasonCode ?? "none"}\``,
    `- Stop category: \`${payload.stopClassification?.category ?? "none"}\``,
    `- Route: ${primaryRoute ? `\`${primaryRoute.canonicalNeed}\`` : "none"}`,
    `- Route confidence: ${primaryRoute ? `\`${primaryRoute.confidence.level}\`` : "none"}`,
    "",
    "Required states:",
    ...renderList(payload.requiredStates).map((state) =>
      state.startsWith("- ") ? state : `- ${state}`,
    ),
    "",
    "Examples:",
    ...renderList(payload.relevantExamples),
    "",
    "Do not invent:",
    ...payload.doNotInvent.map((guidance) => `- ${guidance.thing}; instead ${guidance.instead}`),
    "",
    "Validation commands:",
    ...payload.validationCommands.map(
      (command) =>
        `- \`${command.command}\` - expected: ${command.expectedOutcome}; if fails: ${command.ifFails}`,
    ),
  ];

  const recoveryHints =
    payload.nextAction.kind === "implement" ? [] : (payload.nextAction.recoveryHints ?? []);
  if (recoveryHints.length > 0) {
    lines.push("", "Recovery hints:", ...recoveryHints.map((hint) => `- ${hint}`));
  }

  if (payload.openDecisions.length > 0) {
    lines.push(
      "",
      "Open decisions:",
      ...payload.openDecisions.map(
        (decision) => `- ${decision.severity}: ${decision.code} - ${decision.message}`,
      ),
    );
  }

  lines.push(
    "",
    "Source evidence:",
    ...payload.sourceDigests.map((digest) => `- \`${digest.path}\` (${digest.sha256})`),
  );

  return `${lines.join("\n")}\n`;
}
