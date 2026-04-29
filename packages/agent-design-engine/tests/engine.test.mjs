import assert from "node:assert/strict";
import fs from "node:fs";
import { readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import {
  buildAbstractionProposalPreview,
  buildPreparePayload,
  diffDesignContracts,
  exportDesignContract,
  lintDesignContract,
  loadAgentUiRoutingTable,
  loadRuleManifest,
  parseDesignContract,
  resolveRemediationContext,
  resolveRouteForNeed,
  resolveRouteForSurface,
  serializePreparePayload,
  validateAgentUiRoutingTable,
  validateProposalGate,
} from "../dist/index.js";

const rootDir = new URL("../../..", import.meta.url).pathname;
const valid = await readFile(new URL("fixtures/valid-design.md", import.meta.url), "utf8");
const invalid = await readFile(new URL("fixtures/invalid-design.md", import.meta.url), "utf8");
const rootDesign = await readFile(new URL("../../../DESIGN.md", import.meta.url), "utf8");

function proposalFixtureRoot() {
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), "agent-design-proposals-"));
  fs.mkdirSync(path.join(fixtureRoot, "docs", "design-system", "proposals"), { recursive: true });
  for (const relativePath of [
    "docs/design-system/AGENT_UI_ROUTING.json",
    "docs/design-system/COMPONENT_LIFECYCLE.json",
    "docs/design-system/COVERAGE_MATRIX.json",
    "docs/design-system/proposals/waivers.json",
  ]) {
    fs.mkdirSync(path.dirname(path.join(fixtureRoot, relativePath)), { recursive: true });
    fs.copyFileSync(path.join(rootDir, relativePath), path.join(fixtureRoot, relativePath));
  }
  return fixtureRoot;
}

function readFixtureJson(fixtureRoot, relativePath) {
  return JSON.parse(fs.readFileSync(path.join(fixtureRoot, relativePath), "utf8"));
}

function writeFixtureJson(fixtureRoot, relativePath, value) {
  fs.writeFileSync(path.join(fixtureRoot, relativePath), `${JSON.stringify(value, null, 2)}\n`);
}

test("parses DESIGN.md frontmatter and provenance", async () => {
  const contract = await parseDesignContract(valid, { rootDir, filePath: "DESIGN.md" });
  assert.equal(contract.schemaVersion, "agent-design.v1");
  assert.equal(contract.resolvedProfile, "astudio-default@1");
  assert.equal(contract.profileSource, "design-frontmatter");
  assert.equal(contract.provenance.ruleSourceDigests.length, 4);
});

test("rejects unsupported schema versions deterministically", async () => {
  await assert.rejects(
    parseDesignContract(valid.replace("agent-design.v1", "agent-design.v2"), {
      rootDir,
    }),
    { code: "E_DESIGN_SCHEMA_INVALID" },
  );
});

test("extracts only explicit component code spans", async () => {
  const contract = await parseDesignContract(rootDesign, { rootDir, filePath: "DESIGN.md" });
  assert.deepEqual(contract.components, [
    "EmptyMessage",
    "ErrorBoundary",
    "Flex",
    "SectionHeader",
    "Spinner",
    "Stack",
  ]);
  assert.equal(contract.components.includes("Product"), false);
  assert.equal(contract.components.includes("Loading"), false);
});

test("parses headings without regex backtracking on long spacing runs", async () => {
  const hostileHeading = `${"#".repeat(6)} ${" ".repeat(50_000)}Stable title${" ".repeat(50_000)}`;
  const contract = await parseDesignContract(valid.replace("## Surface Roles", hostileHeading), {
    rootDir,
    filePath: "DESIGN.md",
  });
  const parsedHeading = contract.sections.find((section) => section.title === "Stable title");
  assert.equal(parsedHeading?.level, 6);
  assert.equal(parsedHeading?.title, "Stable title");
});

test("lints professional UI rule groups with source references", async () => {
  const result = await lintDesignContract(invalid, { rootDir });
  assert.equal(result.ok, false);
  assert.ok(result.findings.some((finding) => finding.id === "ui.hierarchy.primary-title"));
  assert.ok(
    result.findings.every((finding) =>
      finding.sourceRef.sourcePath.startsWith("docs/design-system/"),
    ),
  );
  assert.equal(result.findings.find((finding) => finding.id === "ui.state.async-states").line, 5);
});

test("rule manifest covers all source-derived fixture contracts", async () => {
  const manifest = await loadRuleManifest();
  const sourcePaths = new Set(manifest.rules.map((rule) => rule.sourcePath));
  assert.deepEqual([...sourcePaths].sort(), [...manifest.sources].sort());
  assert.ok(manifest.rules.every((rule) => rule.fixture.endsWith(".md")));
});

test("rejects unsupported profile policies deterministically", async () => {
  const override = await parseDesignContract(valid, {
    rootDir,
    profileOverride: "astudio-default@1",
  });
  assert.equal(override.resolvedProfile, "astudio-default@1");
  assert.equal(override.profileSource, "cli-override");
  await assert.rejects(
    parseDesignContract(valid.replace("astudio-default@1", "unknown@1"), { rootDir }),
    { code: "E_DESIGN_PROFILE_UNKNOWN" },
  );
  await assert.rejects(
    parseDesignContract(valid, { rootDir, profileOverride: "astudio-default@2" }),
    { code: "E_DESIGN_PROFILE_UNSUPPORTED" },
  );
  await assert.rejects(
    parseDesignContract(valid, { rootDir, profileOverride: "astudio-default@1", ci: true }),
    { code: "E_DESIGN_PROFILE_OVERRIDE_FORBIDDEN" },
  );
});

test("exports deterministic json, dtcg, and tailwind artifacts", async () => {
  const contract = await parseDesignContract(valid, { rootDir });
  assert.equal(
    exportDesignContract(contract, "json@agent-design.v1").kind,
    "astudio.design.export.v1",
  );
  assert.deepEqual(exportDesignContract(contract, "dtcg@2025").artifact["color.accent"], {
    $type: "color",
    $value: "#123456",
  });
  assert.equal(
    exportDesignContract(contract, "tailwind@4").artifact.theme.extend.colors["color.accent"],
    "#123456",
  );
});

test("diff reports contract regressions and rule context", async () => {
  const diff = await diffDesignContracts(valid, invalid, { rootDir });
  assert.equal(diff.kind, "astudio.design.diff.v1");
  assert.equal(diff.ruleContextDelta.before.rulePackVersion, "astudio-professional-ui@1");
  assert.equal(Array.isArray(diff.changes), true);
});

test("loads authored agent UI routing table in deterministic order", () => {
  const table = loadAgentUiRoutingTable(rootDir);
  assert.equal(table.schemaVersion, "agent-ui-routing.v1");
  assert.deepEqual(
    table.routes.map((route) => route.canonicalNeed),
    [
      "async_collection",
      "destructive_confirmation",
      "page_shell",
      "product_panel",
      "product_section",
      "settings_panel",
    ],
  );
  assert.ok(
    table.routes.every((route) =>
      route.validationCommands.every((command) => command.safetyClass === "read_only"),
    ),
  );
});

test("rejects malformed routing tables instead of coercing routes", () => {
  const fixtureRoot = proposalFixtureRoot();
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  routing.routes = {};
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  assert.throws(
    () => loadAgentUiRoutingTable(fixtureRoot),
    /Agent UI routing table must define a routes array/,
  );
});

test("rejects malformed routing rows instead of coercing fields", () => {
  const fixtureRoot = proposalFixtureRoot();
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  routing.routes[0].aliases = ["async results", 42];
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  assert.throws(
    () => loadAgentUiRoutingTable(fixtureRoot),
    /Agent UI route async_collection\.aliases must be an array of strings/,
  );

  routing.routes[0].aliases = ["async results"];
  routing.routes[0].validationCommands[0].safetyClass = "shell";
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  assert.throws(
    () => loadAgentUiRoutingTable(fixtureRoot),
    /Agent UI route async_collection\.validationCommands\[0\]\.safetyClass must be one of/,
  );
});

test("rejects malformed lifecycle and coverage rows instead of defaulting metadata", () => {
  const lifecycleRoot = proposalFixtureRoot();
  const lifecycle = readFixtureJson(lifecycleRoot, "docs/design-system/COMPONENT_LIFECYCLE.json");
  lifecycle.components[0].routing_tier = "2";
  writeFixtureJson(lifecycleRoot, "docs/design-system/COMPONENT_LIFECYCLE.json", lifecycle);

  assert.throws(
    () => validateAgentUiRoutingTable(lifecycleRoot),
    /Component lifecycle Stack\.routing_tier must be an integer/,
  );

  const coverageRoot = proposalFixtureRoot();
  const coverage = readFixtureJson(coverageRoot, "docs/design-system/COVERAGE_MATRIX.json");
  coverage[0].web_used = "false";
  writeFixtureJson(coverageRoot, "docs/design-system/COVERAGE_MATRIX.json", coverage);

  assert.throws(
    () => validateAgentUiRoutingTable(coverageRoot),
    /Component coverage Accordion\.web_used must be a boolean/,
  );
});

test("routing table has no lifecycle, coverage, source, or example drift", () => {
  assert.deepEqual(validateAgentUiRoutingTable(rootDir), []);
});

test("resolves routes by canonical need and alias with lifecycle and coverage joins", () => {
  const canonical = resolveRouteForNeed("page_shell", rootDir);
  assert.equal(canonical.ok, true);
  assert.equal(canonical.route?.preferredComponent.name, "ProductPageShell");
  assert.equal(canonical.route?.lifecycleEntry.lifecycle, "canonical");
  assert.equal(canonical.route?.coverageEntry.name, "ProductComposition");

  const alias = resolveRouteForNeed("full page", rootDir);
  assert.equal(alias.ok, true);
  assert.equal(alias.route?.canonicalNeed, "page_shell");
  assert.equal(alias.route?.matchedAlias, "full page");
});

test("resolves routes by known surface path", () => {
  const page = resolveRouteForSurface(
    "platforms/web/apps/web/src/pages/TemplateBrowserPage.tsx",
    rootDir,
  );
  assert.equal(page.ok, true);
  assert.equal(page.route?.canonicalNeed, "page_shell");

  const settings = resolveRouteForSurface(
    "packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx",
    rootDir,
  );
  assert.equal(settings.ok, true);
  assert.equal(settings.route?.canonicalNeed, "settings_panel");
});

test("rejects surface paths that resolve outside the repo root", () => {
  const outside = resolveRouteForSurface(path.join(os.tmpdir(), "OutsidePage.tsx"), rootDir);
  assert.equal(outside.ok, false);
  assert.equal(outside.route, null);
  assert.equal(outside.diagnostics[0].code, "E_DESIGN_ROUTE_MISSING");
  assert.match(outside.diagnostics[0].message, /resolves outside the repository root/);
});

test("returns deterministic missing-route diagnostics for unknown needs and surfaces", () => {
  const missingNeed = resolveRouteForNeed("timeline editor", rootDir);
  assert.equal(missingNeed.ok, false);
  assert.equal(missingNeed.diagnostics[0].code, "E_DESIGN_PROPOSAL_REQUIRED");

  const missingSurface = resolveRouteForSurface("docs/design-system/unknown/Thing.md", rootDir);
  assert.equal(missingSurface.ok, false);
  assert.equal(missingSurface.diagnostics[0].code, "E_DESIGN_ROUTE_MISSING");
});

test("builds remediation context from route data", () => {
  const context = resolveRemediationContext("grouped panel", rootDir);
  assert.equal(context.route?.canonicalNeed, "product_panel");
  assert.ok(context.forbiddenPatterns.some((pattern) => pattern.includes("Nested cards")));
  assert.ok(
    context.replacementInstructions.some((instruction) => instruction.includes("ProductPanel")),
  );
});

test("proposal gate accepts current routes through typed grandfathering waivers", () => {
  const result = validateProposalGate(rootDir, { today: "2026-04-28" });
  assert.equal(result.ok, true);
  assert.deepEqual(
    result.diagnostics.filter((diagnostic) => diagnostic.severity === "error"),
    [],
  );
});

test("proposal gate rejects enforced routes without accepted proposal or waiver", () => {
  const fixtureRoot = proposalFixtureRoot();
  const waivers = readFixtureJson(fixtureRoot, "docs/design-system/proposals/waivers.json");
  waivers.waivers = waivers.waivers.filter(
    (waiver) => waiver.id !== "grandfather-route-product-section-2026-04-28",
  );
  writeFixtureJson(fixtureRoot, "docs/design-system/proposals/waivers.json", waivers);

  const result = validateProposalGate(fixtureRoot, { today: "2026-04-28" });
  assert.equal(result.ok, false);
  assert.ok(
    result.diagnostics.some(
      (diagnostic) =>
        diagnostic.code === "E_DESIGN_PROPOSAL_REQUIRED" && diagnostic.target === "product_section",
    ),
  );
});

test("proposal gate treats directory proposal refs as missing proposals", () => {
  const fixtureRoot = proposalFixtureRoot();
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  const productSectionRoute = routing.routes.find(
    (route) => route.canonicalNeed === "product_section",
  );
  productSectionRoute.proposalRef = "docs/design-system/proposals";
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  const waivers = readFixtureJson(fixtureRoot, "docs/design-system/proposals/waivers.json");
  waivers.waivers = waivers.waivers.filter(
    (waiver) => waiver.id !== "grandfather-route-product-section-2026-04-28",
  );
  writeFixtureJson(fixtureRoot, "docs/design-system/proposals/waivers.json", waivers);

  const result = validateProposalGate(fixtureRoot, { today: "2026-04-28" });
  assert.equal(result.ok, false);
  assert.ok(
    result.diagnostics.some(
      (diagnostic) =>
        diagnostic.code === "E_DESIGN_PROPOSAL_REQUIRED" && diagnostic.target === "product_section",
    ),
  );
});

test("proposal gate rejects canonical lifecycle promotion without coverage or waiver", () => {
  const fixtureRoot = proposalFixtureRoot();
  const waivers = readFixtureJson(fixtureRoot, "docs/design-system/proposals/waivers.json");
  waivers.waivers = waivers.waivers.filter(
    (waiver) => waiver.id !== "grandfather-lifecycle-product-data-view-2026-04-28",
  );
  writeFixtureJson(fixtureRoot, "docs/design-system/proposals/waivers.json", waivers);

  const result = validateProposalGate(fixtureRoot, { today: "2026-04-28" });
  assert.equal(result.ok, false);
  assert.ok(
    result.diagnostics.some(
      (diagnostic) =>
        diagnostic.code === "E_DESIGN_LIFECYCLE_COVERAGE_MISSING" &&
        diagnostic.target === "ProductDataView",
    ),
  );
});

test("routing validation rejects route examples that do not exist", () => {
  const fixtureRoot = proposalFixtureRoot();
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  routing.routes[0].examples = ["docs/design-system/examples/missing-example.tsx"];
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  const diagnostics = validateAgentUiRoutingTable(fixtureRoot);
  assert.ok(diagnostics.some((diagnostic) => diagnostic.code === "E_DESIGN_ROUTE_EXAMPLE_MISSING"));
});

test("routing validation rejects source and example paths outside the repo", () => {
  const fixtureRoot = proposalFixtureRoot();
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  routing.routes[0].sourceRefs = ["../outside.tsx"];
  routing.routes[0].examples = ["../outside-example.tsx"];
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  const diagnostics = validateAgentUiRoutingTable(fixtureRoot);
  assert.ok(
    diagnostics.some((diagnostic) => diagnostic.code === "E_DESIGN_ROUTE_SOURCE_REF_MISSING"),
  );
  assert.ok(diagnostics.some((diagnostic) => diagnostic.code === "E_DESIGN_ROUTE_EXAMPLE_MISSING"));
});

test("routing validation rejects directory refs for sources and examples", () => {
  const fixtureRoot = proposalFixtureRoot();
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  routing.routes[0].sourceRefs = ["docs/design-system/proposals"];
  routing.routes[0].examples = ["docs/design-system/proposals"];
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  const diagnostics = validateAgentUiRoutingTable(fixtureRoot);
  assert.ok(
    diagnostics.some((diagnostic) => diagnostic.code === "E_DESIGN_ROUTE_SOURCE_REF_MISSING"),
  );
  assert.ok(diagnostics.some((diagnostic) => diagnostic.code === "E_DESIGN_ROUTE_EXAMPLE_MISSING"));
});

test("proposal gate rejects free-form grandfathering without typed waiver fields", () => {
  const fixtureRoot = proposalFixtureRoot();
  const waivers = readFixtureJson(fixtureRoot, "docs/design-system/proposals/waivers.json");
  delete waivers.waivers[0].owner;
  writeFixtureJson(fixtureRoot, "docs/design-system/proposals/waivers.json", waivers);

  const result = validateProposalGate(fixtureRoot, { today: "2026-04-28" });
  assert.equal(result.ok, false);
  assert.ok(
    result.diagnostics.some((diagnostic) => diagnostic.code === "E_DESIGN_PROPOSAL_WAIVER_SCHEMA"),
  );
});

test("proposal gate requires waiver issue linkage and cleanup milestones", () => {
  const fixtureRoot = proposalFixtureRoot();
  const waivers = readFixtureJson(fixtureRoot, "docs/design-system/proposals/waivers.json");
  delete waivers.waivers[0].ticket;
  delete waivers.waivers[0].issue;
  delete waivers.waivers[0].issueUrl;
  delete waivers.waivers[0].adrRef;
  delete waivers.waivers[0].cleanupMilestone;
  writeFixtureJson(fixtureRoot, "docs/design-system/proposals/waivers.json", waivers);

  const result = validateProposalGate(fixtureRoot, { today: "2026-04-28" });
  assert.equal(result.ok, false);
  assert.ok(
    result.diagnostics.some((diagnostic) => diagnostic.code === "E_DESIGN_PROPOSAL_WAIVER_SCHEMA"),
  );
});

test("proposal gate rejects malformed waiver registry shape", () => {
  const fixtureRoot = proposalFixtureRoot();
  const waivers = readFixtureJson(fixtureRoot, "docs/design-system/proposals/waivers.json");
  delete waivers.waivers;
  writeFixtureJson(fixtureRoot, "docs/design-system/proposals/waivers.json", waivers);

  const result = validateProposalGate(fixtureRoot, { today: "2026-04-28" });
  assert.equal(result.ok, false);
  assert.ok(
    result.diagnostics.some((diagnostic) => diagnostic.code === "E_DESIGN_PROPOSAL_WAIVER_SCHEMA"),
  );
});

test("proposal gate reports malformed waiver registry JSON as a diagnostic", () => {
  const fixtureRoot = proposalFixtureRoot();
  fs.writeFileSync(
    path.join(fixtureRoot, "docs/design-system/proposals/waivers.json"),
    "{ invalid json",
  );

  const result = validateProposalGate(fixtureRoot, { today: "2026-04-28" });
  assert.equal(result.ok, false);
  assert.ok(
    result.diagnostics.some((diagnostic) => diagnostic.code === "E_DESIGN_PROPOSAL_WAIVER_SCHEMA"),
  );
});

test("proposal gate rejects malformed lifecycle rows", () => {
  const fixtureRoot = proposalFixtureRoot();
  const lifecycle = readFixtureJson(fixtureRoot, "docs/design-system/COMPONENT_LIFECYCLE.json");
  lifecycle.components[0].lifecycle = "canoncal";
  lifecycle.components[0].routing_tier = "2";
  writeFixtureJson(fixtureRoot, "docs/design-system/COMPONENT_LIFECYCLE.json", lifecycle);

  const result = validateProposalGate(fixtureRoot, { today: "2026-04-28" });
  assert.equal(result.ok, false);
  assert.ok(
    result.diagnostics.some((diagnostic) => diagnostic.code === "E_DESIGN_LIFECYCLE_SCHEMA"),
  );
});

test("proposal gate rejects malformed coverage matrix shape", () => {
  const fixtureRoot = proposalFixtureRoot();
  writeFixtureJson(fixtureRoot, "docs/design-system/COVERAGE_MATRIX.json", {
    entries: [],
  });

  const result = validateProposalGate(fixtureRoot, { today: "2026-04-28" });
  assert.equal(result.ok, false);
  assert.ok(
    result.diagnostics.some((diagnostic) => diagnostic.code === "E_DESIGN_COVERAGE_SCHEMA"),
  );
});

test("proposal gate rejects duplicate active waivers", () => {
  const fixtureRoot = proposalFixtureRoot();
  const waivers = readFixtureJson(fixtureRoot, "docs/design-system/proposals/waivers.json");
  waivers.waivers.push({
    ...waivers.waivers[0],
    id: "duplicate-grandfather-route-2026-04-28",
  });
  writeFixtureJson(fixtureRoot, "docs/design-system/proposals/waivers.json", waivers);

  const result = validateProposalGate(fixtureRoot, { today: "2026-04-28" });
  assert.equal(result.ok, false);
  assert.ok(
    result.diagnostics.some(
      (diagnostic) => diagnostic.code === "E_DESIGN_PROPOSAL_WAIVER_DUPLICATE",
    ),
  );
});

test("proposal gate requires explicit valid dates from callers", () => {
  const fixtureRoot = proposalFixtureRoot();

  const missingDate = validateProposalGate(fixtureRoot);
  assert.equal(missingDate.ok, false);
  assert.ok(
    missingDate.diagnostics.some(
      (diagnostic) =>
        diagnostic.message ===
        "Proposal gate requires an explicit valid today value in YYYY-MM-DD format.",
    ),
  );

  const impossibleDate = validateProposalGate(fixtureRoot, { today: "2026-02-31" });
  assert.equal(impossibleDate.ok, false);
  assert.ok(
    impossibleDate.diagnostics.some(
      (diagnostic) =>
        diagnostic.message ===
        "Proposal gate requires an explicit valid today value in YYYY-MM-DD format.",
    ),
  );
});

test("proposal gate audits near-expiry waivers and fails expired waivers", () => {
  const fixtureRoot = proposalFixtureRoot();
  const waivers = readFixtureJson(fixtureRoot, "docs/design-system/proposals/waivers.json");
  waivers.waivers[0].expiresAt = "2026-05-05";
  waivers.waivers[1].expiresAt = "2026-04-27";
  writeFixtureJson(fixtureRoot, "docs/design-system/proposals/waivers.json", waivers);

  const result = validateProposalGate(fixtureRoot, { today: "2026-04-28" });
  assert.equal(result.ok, false);
  assert.ok(
    result.diagnostics.some(
      (diagnostic) => diagnostic.code === "W_DESIGN_PROPOSAL_WAIVER_NEAR_EXPIRY",
    ),
  );
  assert.ok(
    result.diagnostics.some((diagnostic) => diagnostic.code === "E_DESIGN_PROPOSAL_WAIVER_EXPIRED"),
  );
});

test("proposal preview marks unknown needs as proposal-required without writing files", () => {
  const preview = buildAbstractionProposalPreview("timeline editor", rootDir);
  assert.equal(preview.kind, "astudio.design.proposeAbstraction.v1");
  assert.equal(preview.proposalRequired, true);
  assert.equal(preview.previewOnly, true);
  assert.equal(preview.readOnly, true);
  assert.ok(preview.requiredFields.includes("coverage impact"));
  assert.equal(preview.remediation.route, null);
});

test("builds prepare payload for protected product page surfaces", async () => {
  const payload = await buildPreparePayload(
    "platforms/web/apps/web/src/pages/TemplateBrowserPage.tsx",
    rootDir,
  );
  assert.equal(payload.kind, "astudio.design.prepare.v1");
  assert.equal(payload.ok, true);
  assert.equal(payload.safeForAutomaticImplementation, true);
  assert.equal(payload.designContractMode, "design-md");
  assert.equal(payload.surfaceScope, "protected");
  assert.equal(payload.surfaceKind, "page_shell");
  assert.equal(payload.recommendedRoutes[0].canonicalNeed, "page_shell");
  assert.ok(payload.forbiddenPatterns.some((pattern) => pattern.includes("h-screen")));
  assert.ok(
    payload.relevantExamples.includes("platforms/web/apps/web/src/pages/TemplateBrowserPage.tsx"),
  );
  assert.ok(payload.validationCommands.every((command) => command.safetyClass === "read_only"));
  assert.equal(payload.sourceDigests.length, 6);
  assert.equal(payload.coverageMatrixDigest.path, "docs/design-system/COVERAGE_MATRIX.json");
  assert.equal(
    payload.componentLifecycleDigest.path,
    "docs/design-system/COMPONENT_LIFECYCLE.json",
  );
  assert.equal(payload.ruleSourceDigests.length, 4);
  assert.equal("timing" in payload, false);
});

test("build prepare payload honors aborted signals", async () => {
  const controller = new AbortController();
  controller.abort();

  await assert.rejects(
    () =>
      buildPreparePayload(
        "platforms/web/apps/web/src/pages/TemplateBrowserPage.tsx",
        rootDir,
        controller.signal,
      ),
    { name: "AbortError" },
  );
});

test("builds prepare payload for settings panel surfaces", async () => {
  const payload = await buildPreparePayload(
    "packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx",
    rootDir,
  );
  assert.equal(payload.ok, true);
  assert.equal(payload.surfaceScope, "protected");
  assert.equal(payload.surfaceKind, "settings_panel");
  assert.deepEqual(payload.requiredStates, ["empty", "error", "loading", "ready"]);
  assert.ok(
    payload.relevantExamples.includes("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx"),
  );
});

test("builds prepare payload for async composition surfaces from routing metadata", async () => {
  const payload = await buildPreparePayload(
    "packages/ui/src/components/ui/layout/ProductComposition/ProductComposition.tsx",
    rootDir,
  );
  assert.equal(payload.ok, true);
  assert.equal(payload.surfaceScope, "warn");
  assert.equal(payload.surfaceKind, "async_collection");
  assert.equal(payload.recommendedRoutes[0].canonicalNeed, "async_collection");
});

test("builds prepare diagnostics for warn, exempt, and unknown surfaces", async () => {
  const warn = await buildPreparePayload(
    "packages/ui/src/storybook/_holding/component-stories/AlertDialog.stories.tsx",
    rootDir,
  );
  assert.equal(warn.surfaceScope, "warn");
  assert.equal(warn.ok, true);
  assert.equal(warn.surfaceKind, "destructive_confirmation");

  const exempt = await buildPreparePayload("docs/design-system/AGENT_UI_ROUTING.md", rootDir);
  assert.equal(exempt.surfaceScope, "exempt");
  assert.equal(exempt.ok, false);
  assert.equal(exempt.safeForAutomaticImplementation, false);

  const unknown = await buildPreparePayload("packages/example/UnknownSurface.tsx", rootDir);
  assert.equal(unknown.surfaceScope, "unknown");
  assert.equal(unknown.ok, false);
  assert.ok(
    unknown.openDecisions.some((decision) => decision.code === "E_DESIGN_SURFACE_SCOPE_UNKNOWN"),
  );
});

test("serializes prepare payload with sorted keys and trailing newline", async () => {
  const payload = await buildPreparePayload(
    "platforms/web/apps/web/src/pages/TemplateBrowserPage.tsx",
    rootDir,
  );
  const serialized = serializePreparePayload(payload);
  assert.equal(serialized.endsWith("\n"), true);
  assert.equal(serialized.includes('"timing"'), false);
  assert.match(serialized.split("\n")[1], /"componentLifecycleDigest"/);
});
