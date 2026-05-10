import type { PreparePayload, PrepareRouteRecommendation } from "../types.js";
import { renderList, renderPrepareStatus } from "./text.js";

function renderRouteSummary(route: PrepareRouteRecommendation | undefined): string {
  if (!route) return "None";
  return `${route.canonicalNeed} -> ${route.preferredComponent.name} (${route.preferredComponent.importPath}); confidence: ${route.confidence.level}`;
}

/**
 * Render an agent-readable prepare brief from the typed prepare payload.
 */
export function renderPrepareBrief(payload: PreparePayload): string {
  const primaryRoute = payload.recommendedRoutes[0];
  const lines = [
    "Agent Design Prepare Brief",
    `Surface: ${payload.surfacePath}`,
    `Status: ${renderPrepareStatus(payload.safeForAutomaticImplementation)}`,
    `Next action: ${payload.nextAction.kind}`,
    ...(payload.stopClassification
      ? [
          `Stop category: ${payload.stopClassification.category}`,
          `Stop reason: ${payload.stopClassification.reasonCode}`,
        ]
      : []),
    `Instruction: ${payload.nextAction.instruction}`,
    "",
    "Use:",
    `- Route: ${renderRouteSummary(primaryRoute)}`,
    ...renderList(payload.requiredStates, "No required states returned.").map(
      (state) => `- Required state: ${state.slice(2)}`,
    ),
    "",
    "Token Rules:",
    ...renderList(
      payload.designTokenContract.allowedRoles
        .slice(0, 8)
        .map((role) => `${role.role}: ${role.useFor.join(", ")}`),
      "No semantic token roles returned.",
    ),
    "",
    "Examples:",
    ...renderList(
      primaryRoute?.usageGuidance.copy ?? [],
      "No route-specific example guidance returned.",
    ),
    ...renderList(payload.relevantExamples, "No relevant examples returned.").map((example) =>
      example.startsWith("- ") ? example : `- ${example}`,
    ),
    "",
    "Forbidden Patterns:",
    ...renderList(payload.forbiddenPatterns, "No forbidden patterns returned."),
    "",
    "Do Not Invent:",
    ...payload.doNotInvent.map((guidance) => `- ${guidance.thing}: ${guidance.instead}`),
    "",
    "Validate:",
    ...payload.validationCommands.map(
      (command) =>
        `- ${command.command} | expected: ${command.expectedOutcome} | if fails: ${command.ifFails}`,
    ),
  ];

  if (!payload.safeForAutomaticImplementation) {
    lines.splice(5, 0, "Stop: do not edit UI until the next action is resolved.");
    const recoveryHints =
      payload.nextAction.kind === "implement" ? [] : (payload.nextAction.recoveryHints ?? []);
    if (recoveryHints.length > 0) {
      lines.splice(
        lines.indexOf("Use:") - 1,
        0,
        "",
        "Recovery Hints:",
        ...recoveryHints.map((hint) => `- ${hint}`),
      );
    }
  }

  return `${lines.join("\n")}\n`;
}
