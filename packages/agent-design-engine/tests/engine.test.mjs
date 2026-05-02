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
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  for (const route of routing.routes ?? []) {
    for (const relativePath of [...(route.examples ?? []), ...(route.sourceRefs ?? [])]) {
      const filePath = String(relativePath).split("#")[0];
      const source = path.join(rootDir, filePath);
      if (!fs.existsSync(source) || !fs.statSync(source).isFile()) continue;
      const target = path.join(fixtureRoot, filePath);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(source, target);
    }
  }
  return fixtureRoot;
}

function copyRootFile(fixtureRoot, relativePath) {
  fs.mkdirSync(path.dirname(path.join(fixtureRoot, relativePath)), { recursive: true });
  fs.copyFileSync(path.join(rootDir, relativePath), path.join(fixtureRoot, relativePath));
}

function prepareFixtureRoot() {
  const fixtureRoot = proposalFixtureRoot();
  for (const relativePath of [
    ".design-system-guidance.json",
    "DESIGN.md",
    "package.json",
    "docs/design-system/PROFESSIONAL_UI_CONTRACT.md",
    "packages/tokens/src/alias-map.ts",
    "packages/tokens/src/tokens/index.dtcg.json",
    "packages/ui/src/styles/theme.css",
  ]) {
    copyRootFile(fixtureRoot, relativePath);
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

test("rejects empty routing strings at parse time", () => {
  const fixtureRoot = proposalFixtureRoot();
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  routing.routes[0].canonicalNeed = "   ";
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  assert.throws(
    () => loadAgentUiRoutingTable(fixtureRoot),
    /Agent UI route\.canonicalNeed must be a non-empty string/,
  );

  routing.routes[0].canonicalNeed = "async_collection";
  routing.routes[0].sourceRefs = ["   "];
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  assert.throws(
    () => loadAgentUiRoutingTable(fixtureRoot),
    /Agent UI route async_collection\.sourceRefs\[0\] must be a non-empty string/,
  );
});

test("rejects malformed lifecycle and coverage rows instead of defaulting metadata", () => {
  const lifecycleRoot = proposalFixtureRoot();
  const lifecycle = readFixtureJson(lifecycleRoot, "docs/design-system/COMPONENT_LIFECYCLE.json");
  const stack = lifecycle.components.find((entry) => entry.name === "Stack");
  assert.ok(stack);
  stack.routing_tier = "2";
  writeFixtureJson(lifecycleRoot, "docs/design-system/COMPONENT_LIFECYCLE.json", lifecycle);

  assert.throws(
    () => validateAgentUiRoutingTable(lifecycleRoot),
    /Component lifecycle Stack\.routing_tier must be an integer/,
  );

  const coverageRoot = proposalFixtureRoot();
  const coverage = readFixtureJson(coverageRoot, "docs/design-system/COVERAGE_MATRIX.json");
  const accordion = coverage.find((entry) => entry.name === "Accordion");
  assert.ok(accordion);
  accordion.web_used = "false";
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

test("resolves question-mark surface-pattern wildcards consistently", () => {
  const fixtureRoot = proposalFixtureRoot();
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  routing.routes.push({
    need: "question_mark_panel",
    canonicalNeed: "question_mark_panel",
    aliases: [],
    preferredComponent: {
      name: "ProductPanel",
      importPath: "packages/ui/src/components/ui/layout/ProductComposition/ProductComposition.tsx",
      packageName: "@design-studio/ui",
      coverageName: "ProductComposition",
    },
    lifecycleStatus: "canonical",
    routeMaturity: "provisional",
    surfacePatterns: ["packages/ui/src/app/settings/App?Panel/AppsPanel.tsx"],
    useWhen: ["Testing single-character surface-pattern wildcard behavior."],
    requiredStates: [],
    examples: [],
    avoid: [],
    fallbacks: [],
    validationCommands: [],
    sourceRefs: [],
  });
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  const result = resolveRouteForSurface(
    "packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx",
    fixtureRoot,
  );
  assert.equal(result.ok, true);
  assert.equal(result.route?.canonicalNeed, "question_mark_panel");
});

test("does not match question-mark surface-pattern wildcards across slashes", () => {
  const fixtureRoot = proposalFixtureRoot();
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  routing.routes = [
    {
      need: "question_mark_panel",
      canonicalNeed: "question_mark_panel",
      aliases: [],
      preferredComponent: {
        name: "ProductPanel",
        importPath:
          "packages/ui/src/components/ui/layout/ProductComposition/ProductComposition.tsx",
        packageName: "@design-studio/ui",
        coverageName: "ProductComposition",
      },
      lifecycleStatus: "canonical",
      routeMaturity: "provisional",
      surfacePatterns: ["packages/ui/src/app/settings/App?Panel/AppsPanel.tsx"],
      useWhen: ["Testing single-character surface-pattern wildcard behavior."],
      requiredStates: [],
      examples: [],
      avoid: [],
      fallbacks: [],
      validationCommands: [],
      sourceRefs: [],
    },
  ];
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  const result = resolveRouteForSurface(
    "packages/ui/src/app/settings/App/Panel/AppsPanel.tsx",
    fixtureRoot,
  );
  assert.equal(result.ok, false);
  assert.equal(result.route, null);
});

test("rejects missing surface files before matching broad route patterns", () => {
  const result = resolveRouteForSurface(
    "platforms/web/apps/web/src/pages/TemplteBrowserPage.tsx",
    rootDir,
  );
  assert.equal(result.ok, false);
  assert.equal(result.route, null);
  assert.equal(result.diagnostics[0].code, "E_DESIGN_ROUTE_MISSING");
  assert.match(result.diagnostics[0].message, /does not exist as a file/);
});

test("rejects surface symlinks that escape the repo before route matching", () => {
  const fixtureRoot = proposalFixtureRoot();
  const externalFile = path.join(os.tmpdir(), `escaped-surface-${process.pid}.tsx`);
  const symlinkPath = path.join(fixtureRoot, "platforms/web/apps/web/src/pages/EscapedPage.tsx");
  fs.writeFileSync(externalFile, "export default function EscapedPage() { return null; }\n");
  fs.mkdirSync(path.dirname(symlinkPath), { recursive: true });
  fs.symlinkSync(externalFile, symlinkPath);

  const result = resolveRouteForSurface(
    "platforms/web/apps/web/src/pages/EscapedPage.tsx",
    fixtureRoot,
  );
  assert.equal(result.ok, false);
  assert.equal(result.route, null);
  assert.equal(result.diagnostics[0].code, "E_DESIGN_ROUTE_MISSING");
  assert.match(result.diagnostics[0].message, /resolves outside the repository root/);
});

test("rejects tied surface route matches instead of choosing by sort order", () => {
  const fixtureRoot = proposalFixtureRoot();
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  routing.routes.push({
    ...routing.routes.find((route) => route.canonicalNeed === "page_shell"),
    need: "alternate page shell",
    canonicalNeed: "alternate_page_shell",
    aliases: [],
  });
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  const result = resolveRouteForSurface(
    "platforms/web/apps/web/src/pages/TemplateBrowserPage.tsx",
    fixtureRoot,
  );
  assert.equal(result.ok, false);
  assert.equal(result.route, null);
  assert.equal(result.diagnostics[0].code, "E_DESIGN_ROUTE_AMBIGUOUS");
  assert.match(result.diagnostics[0].message, /specificity/);
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

  const blankNeed = resolveRouteForNeed("   ", rootDir);
  assert.equal(blankNeed.ok, false);
  assert.equal(blankNeed.diagnostics[0].code, "E_DESIGN_ROUTE_INVALID_INPUT");

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
  assert.ok(context.validationCommands.every((command) => command.safetyClass === "read_only"));
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

test("proposal gate rejects symlink proposal refs that escape the repo", () => {
  const fixtureRoot = proposalFixtureRoot();
  const escapedProposalPath = path.join(os.tmpdir(), `escaped-proposal-${process.pid}.md`);
  fs.writeFileSync(escapedProposalPath, "status: accepted\n");
  const relativeLinkPath = "docs/design-system/proposals/escaped-proposal.md";
  fs.symlinkSync(escapedProposalPath, path.join(fixtureRoot, relativeLinkPath));

  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  const productSectionRoute = routing.routes.find(
    (route) => route.canonicalNeed === "product_section",
  );
  productSectionRoute.proposalRef = relativeLinkPath;
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

test("routing validation rejects source and example symlinks outside the repo", () => {
  const fixtureRoot = proposalFixtureRoot();
  const escapedFilePath = path.join(os.tmpdir(), `escaped-route-ref-${process.pid}.md`);
  fs.writeFileSync(escapedFilePath, "outside repo\n");
  const sourceRef = "docs/design-system/escaped-source.md";
  const example = "docs/design-system/escaped-example.md";
  fs.symlinkSync(escapedFilePath, path.join(fixtureRoot, sourceRef));
  fs.symlinkSync(escapedFilePath, path.join(fixtureRoot, example));

  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  routing.routes[0].sourceRefs = [sourceRef];
  routing.routes[0].examples = [example];
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

test("proposal gate rejects non-object waiver entries", () => {
  const fixtureRoot = proposalFixtureRoot();
  const waivers = readFixtureJson(fixtureRoot, "docs/design-system/proposals/waivers.json");
  waivers.waivers.push(42);
  writeFixtureJson(fixtureRoot, "docs/design-system/proposals/waivers.json", waivers);

  const result = validateProposalGate(fixtureRoot, { today: "2026-04-28" });
  assert.equal(result.ok, false);
  assert.ok(
    result.diagnostics.some(
      (diagnostic) =>
        diagnostic.code === "E_DESIGN_PROPOSAL_WAIVER_SCHEMA" &&
        /Proposal waiver registry waivers\[\d+\] must be a JSON object\./.test(diagnostic.message),
    ),
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

test("proposal gate reports malformed routing table shape as a diagnostic", () => {
  const fixtureRoot = proposalFixtureRoot();
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  routing.routes = "not-routes";
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  const result = validateProposalGate(fixtureRoot, { today: "2026-04-28" });
  assert.equal(result.ok, false);
  assert.ok(result.diagnostics.some((diagnostic) => diagnostic.code === "E_DESIGN_ROUTING_SCHEMA"));
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

test("proposal preview returns fresh required-field arrays", () => {
  const first = buildAbstractionProposalPreview("timeline editor", rootDir);
  first.requiredFields.push("mutated by caller");

  const second = buildAbstractionProposalPreview("timeline editor", rootDir);
  assert.equal(second.requiredFields.includes("mutated by caller"), false);
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
  assert.ok(
    payload.recommendedRoutes.every((route) =>
      route.validationCommands.every((command) => command.safetyClass === "read_only"),
    ),
  );
  assert.ok(payload.validationCommands.every((command) => command.packageScript));
  assert.ok(
    payload.recommendedRoutes.every((route) =>
      route.validationCommands.every((command) => command.packageScript),
    ),
  );
  assert.ok(payload.validationCommands.every((command) => command.expectedOutcome));
  assert.ok(payload.validationCommands.every((command) => command.timeoutClass));
  const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, "package.json"), "utf8"));
  assert.ok(
    payload.validationCommands.every((command) => packageJson.scripts[command.packageScript]),
  );
  assert.equal(payload.sourceDigests.length, 6);
  assert.equal(payload.coverageMatrixDigest.path, "docs/design-system/COVERAGE_MATRIX.json");
  assert.equal(
    payload.componentLifecycleDigest.path,
    "docs/design-system/COMPONENT_LIFECYCLE.json",
  );
  assert.equal(payload.ruleSourceDigests.length, 4);
  assert.equal(payload.designTokenContract.mode, "semantic-only");
  assert.ok(payload.designTokenContract.allowedRoles.some((role) => role.role === "text.primary"));
  assert.ok(
    payload.designTokenContract.forbiddenTokenPatterns.some((pattern) =>
      pattern.includes("foundation"),
    ),
  );
  assert.ok(payload.designTokenContract.sourceRefs.includes("packages/ui/src/styles/theme.css"));
  assert.ok(payload.designTokenContract.sourceRefs.includes("DESIGN.md"));
  assert.ok(
    payload.designTokenContract.sourceRefs.includes(
      "docs/design-system/PROFESSIONAL_UI_CONTRACT.md",
    ),
  );
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

test("build prepare payload reports missing token contract sources deterministically", async () => {
  const fixtureRoot = prepareFixtureRoot();
  fs.rmSync(path.join(fixtureRoot, "packages/ui/src/styles/theme.css"));

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_TOKEN_CONTRACT_MISSING", exitCode: 2 },
  );
});

test("build prepare payload reports ambiguous token contract sources deterministically", async () => {
  const fixtureRoot = prepareFixtureRoot();
  fs.writeFileSync(path.join(fixtureRoot, "packages/ui/src/styles/theme.css"), ":root {}\n");

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_TOKEN_CONTRACT_AMBIGUOUS", exitCode: 2 },
  );
});

test("build prepare payload rejects missing advertised semantic token roles", async () => {
  const fixtureRoot = prepareFixtureRoot();
  const themePath = path.join(fixtureRoot, "packages/ui/src/styles/theme.css");
  const theme = fs.readFileSync(themePath, "utf8");
  fs.writeFileSync(themePath, theme.replace("  --status-warning: var(--accent-orange);\n", ""));

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_TOKEN_CONTRACT_AMBIGUOUS", exitCode: 2 },
  );
});

test("build prepare payload ignores commented semantic token roles", async () => {
  const fixtureRoot = prepareFixtureRoot();
  const themePath = path.join(fixtureRoot, "packages/ui/src/styles/theme.css");
  const theme = fs.readFileSync(themePath, "utf8");
  fs.writeFileSync(
    themePath,
    theme.replace("  --card: var(--ds-bg-card);\n", "  /* --card: var(--ds-bg-card); */\n"),
  );

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_TOKEN_CONTRACT_AMBIGUOUS", exitCode: 2 },
  );
});

test("build prepare payload ignores commented alias-map authorities", async () => {
  const fixtureRoot = prepareFixtureRoot();
  const aliasMapPath = path.join(fixtureRoot, "packages/tokens/src/alias-map.ts");
  const aliasMap = fs.readFileSync(aliasMapPath, "utf8");
  fs.writeFileSync(
    aliasMapPath,
    aliasMap.replace(
      '    background: buildModeMap("background"),',
      '    // background: buildModeMap("background"),',
    ),
  );

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_TOKEN_CONTRACT_AMBIGUOUS", exitCode: 2 },
  );
});

test("build prepare payload rejects malformed DTCG token authority", async () => {
  const fixtureRoot = prepareFixtureRoot();
  fs.writeFileSync(path.join(fixtureRoot, "packages/tokens/src/tokens/index.dtcg.json"), "{\n");

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_TOKEN_CONTRACT_AMBIGUOUS", exitCode: 2 },
  );
});

test("build prepare payload rejects DTCG color categories without mode groups", async () => {
  const fixtureRoot = prepareFixtureRoot();
  const dtcg = readFixtureJson(fixtureRoot, "packages/tokens/src/tokens/index.dtcg.json");
  dtcg.color.background = {};
  writeFixtureJson(fixtureRoot, "packages/tokens/src/tokens/index.dtcg.json", dtcg);

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_TOKEN_CONTRACT_AMBIGUOUS", exitCode: 2 },
  );
});

test("build prepare payload rejects missing design source deterministically", async () => {
  const fixtureRoot = prepareFixtureRoot();
  fs.rmSync(path.join(fixtureRoot, "DESIGN.md"));

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_CONTRACT_SOURCE_MISSING", exitCode: 2 },
  );
});

test("build prepare payload rejects missing guidance source deterministically", async () => {
  const fixtureRoot = prepareFixtureRoot();
  fs.rmSync(path.join(fixtureRoot, ".design-system-guidance.json"));

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_GUIDANCE_SOURCE_MISSING", exitCode: 2 },
  );
});

test("build prepare payload reports missing design before missing guidance", async () => {
  const fixtureRoot = prepareFixtureRoot();
  fs.rmSync(path.join(fixtureRoot, "DESIGN.md"));
  fs.rmSync(path.join(fixtureRoot, ".design-system-guidance.json"));

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_CONTRACT_SOURCE_MISSING", exitCode: 2 },
  );
});

test("build prepare payload rejects guidance contract mode drift", async () => {
  const fixtureRoot = prepareFixtureRoot();
  const guidance = readFixtureJson(fixtureRoot, ".design-system-guidance.json");
  guidance.designContract.mode = "legacy";
  writeFixtureJson(fixtureRoot, ".design-system-guidance.json", guidance);

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_CONTRACT_MODE_MISMATCH", exitCode: 2 },
  );
});

test("build prepare payload rejects validation commands with missing package scripts", async () => {
  const fixtureRoot = prepareFixtureRoot();
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  const route = routing.routes.find((entry) => entry.canonicalNeed === "settings_panel");
  assert.ok(route, "missing settings_panel route fixture");
  route.validationCommands[0].packageScript = "missing:script";
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_VALIDATION_COMMAND_INVALID", exitCode: 2 },
  );
});

test("build prepare payload rejects pnpm validation command script drift", async () => {
  const fixtureRoot = prepareFixtureRoot();
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  const route = routing.routes.find((entry) => entry.canonicalNeed === "settings_panel");
  assert.ok(route, "missing settings_panel route fixture");
  route.validationCommands[0].command = "pnpm --silent run missing:script";
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_VALIDATION_COMMAND_INVALID", exitCode: 2 },
  );
});

test("build prepare payload accepts pnpm run flags before script names", async () => {
  const fixtureRoot = prepareFixtureRoot();
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  const route = routing.routes.find((entry) => entry.canonicalNeed === "settings_panel");
  assert.ok(route, "missing settings_panel route fixture");
  route.validationCommands[0].command = "pnpm run --silent agent-design:lint";
  route.validationCommands[0].packageScript = "agent-design:lint";
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  const payload = await buildPreparePayload(
    "packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx",
    fixtureRoot,
  );

  assert.equal(payload.validationCommands[0].packageScript, "agent-design:lint");
});

test("build prepare payload accepts pnpm value flags before run", async () => {
  const fixtureRoot = prepareFixtureRoot();
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  const route = routing.routes.find((entry) => entry.canonicalNeed === "settings_panel");
  assert.ok(route, "missing settings_panel route fixture");
  route.validationCommands[0].command = "pnpm --resume-from ui run agent-design:lint";
  route.validationCommands[0].packageScript = "agent-design:lint";
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  const payload = await buildPreparePayload(
    "packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx",
    fixtureRoot,
  );

  assert.equal(payload.validationCommands[0].packageScript, "agent-design:lint");
});

test("build prepare payload accepts pnpm reporter flag before run", async () => {
  const fixtureRoot = prepareFixtureRoot();
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  const route = routing.routes.find((entry) => entry.canonicalNeed === "settings_panel");
  assert.ok(route, "missing settings_panel route fixture");
  route.validationCommands[0].command = "pnpm --reporter append-only run agent-design:lint";
  route.validationCommands[0].packageScript = "agent-design:lint";
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  const payload = await buildPreparePayload(
    "packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx",
    fixtureRoot,
  );

  assert.equal(payload.validationCommands[0].packageScript, "agent-design:lint");
});

test("build prepare payload accepts pnpm run-script alias", async () => {
  const fixtureRoot = prepareFixtureRoot();
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  const route = routing.routes.find((entry) => entry.canonicalNeed === "settings_panel");
  assert.ok(route, "missing settings_panel route fixture");
  route.validationCommands[0].command = "pnpm run-script agent-design:lint";
  route.validationCommands[0].packageScript = "agent-design:lint";
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  const payload = await buildPreparePayload(
    "packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx",
    fixtureRoot,
  );

  assert.equal(payload.validationCommands[0].packageScript, "agent-design:lint");
});

test("build prepare payload rejects pnpm run commands without a script name", async () => {
  const fixtureRoot = prepareFixtureRoot();
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  const route = routing.routes.find((entry) => entry.canonicalNeed === "settings_panel");
  assert.ok(route, "missing settings_panel route fixture");
  route.validationCommands[0].command = "pnpm run";
  delete route.validationCommands[0].packageScript;
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_VALIDATION_COMMAND_INVALID", exitCode: 2 },
  );
});

test("build prepare payload rejects non-pnpm validation commands", async () => {
  const fixtureRoot = prepareFixtureRoot();
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  const route = routing.routes.find((entry) => entry.canonicalNeed === "settings_panel");
  assert.ok(route, "missing settings_panel route fixture");
  route.validationCommands[0].command = "git clean -fdx";
  delete route.validationCommands[0].packageScript;
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_VALIDATION_COMMAND_INVALID", exitCode: 2 },
  );
});

test("build prepare payload validates pnpm dir scripts against target package", async () => {
  const fixtureRoot = prepareFixtureRoot();
  copyRootFile(fixtureRoot, "packages/ui/package.json");
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  const route = routing.routes.find((entry) => entry.canonicalNeed === "settings_panel");
  assert.ok(route, "missing settings_panel route fixture");
  route.validationCommands[0].command = "pnpm -C packages/ui run type-check";
  route.validationCommands[0].packageScript = "type-check";
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  const payload = await buildPreparePayload(
    "packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx",
    fixtureRoot,
  );

  assert.equal(payload.validationCommands[0].packageScript, "type-check");
});

test("build prepare payload validates pnpm -C equals scripts against target package", async () => {
  const fixtureRoot = prepareFixtureRoot();
  copyRootFile(fixtureRoot, "packages/ui/package.json");
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  const route = routing.routes.find((entry) => entry.canonicalNeed === "settings_panel");
  assert.ok(route, "missing settings_panel route fixture");
  route.validationCommands[0].command = "pnpm -C=packages/ui run type-check";
  route.validationCommands[0].packageScript = "type-check";
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  const payload = await buildPreparePayload(
    "packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx",
    fixtureRoot,
  );

  assert.equal(payload.validationCommands[0].packageScript, "type-check");
});

test("build prepare payload validates compact pnpm -C scripts against target package", async () => {
  const fixtureRoot = prepareFixtureRoot();
  copyRootFile(fixtureRoot, "packages/ui/package.json");
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  const route = routing.routes.find((entry) => entry.canonicalNeed === "settings_panel");
  assert.ok(route, "missing settings_panel route fixture");
  route.validationCommands[0].command = "pnpm -Cpackages/ui run type-check";
  route.validationCommands[0].packageScript = "type-check";
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  const payload = await buildPreparePayload(
    "packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx",
    fixtureRoot,
  );

  assert.equal(payload.validationCommands[0].packageScript, "type-check");
});

test("build prepare payload normalizes absolute pnpm package dirs for read-only trust", async () => {
  const fixtureRoot = prepareFixtureRoot();
  copyRootFile(fixtureRoot, "packages/ui/package.json");
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  const route = routing.routes.find((entry) => entry.canonicalNeed === "settings_panel");
  assert.ok(route, "missing settings_panel route fixture");
  route.validationCommands[0].command = `pnpm -C ${path.join(
    fixtureRoot,
    "packages/ui",
  )} run type-check`;
  route.validationCommands[0].packageScript = "type-check";
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  const payload = await buildPreparePayload(
    "packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx",
    fixtureRoot,
  );

  assert.equal(payload.validationCommands[0].packageScript, "type-check");
});

test("build prepare payload validates post-run pnpm dir scripts against target package", async () => {
  const fixtureRoot = prepareFixtureRoot();
  copyRootFile(fixtureRoot, "packages/ui/package.json");
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  const route = routing.routes.find((entry) => entry.canonicalNeed === "settings_panel");
  assert.ok(route, "missing settings_panel route fixture");
  route.validationCommands[0].command = "pnpm run -C packages/ui type-check";
  route.validationCommands[0].packageScript = "type-check";
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  const payload = await buildPreparePayload(
    "packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx",
    fixtureRoot,
  );

  assert.equal(payload.validationCommands[0].packageScript, "type-check");
});

test("build prepare payload rejects pnpm recursive run aliases", async () => {
  for (const alias of ["recursive", "multi", "m", "-r", "--recursive"]) {
    const fixtureRoot = prepareFixtureRoot();
    const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
    const route = routing.routes.find((entry) => entry.canonicalNeed === "settings_panel");
    assert.ok(route, "missing settings_panel route fixture");
    route.validationCommands[0].command = `pnpm ${alias} run agent-design:lint`;
    route.validationCommands[0].packageScript = "agent-design:lint";
    writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

    await assert.rejects(
      () =>
        buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
      { code: "E_DESIGN_VALIDATION_COMMAND_INVALID", exitCode: 2 },
    );
  }
});

test("build prepare payload rejects pnpm run scripts with trailing arguments", async () => {
  const fixtureRoot = prepareFixtureRoot();
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  const route = routing.routes.find((entry) => entry.canonicalNeed === "settings_panel");
  assert.ok(route, "missing settings_panel route fixture");
  route.validationCommands[0].command = "pnpm run agent-design:lint -- --fix";
  route.validationCommands[0].packageScript = "agent-design:lint";
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_VALIDATION_COMMAND_INVALID", exitCode: 2 },
  );
});

test("build prepare payload parses quoted pnpm package dirs", async () => {
  const fixtureRoot = prepareFixtureRoot();
  copyRootFile(fixtureRoot, "packages/ui/package.json");
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  const route = routing.routes.find((entry) => entry.canonicalNeed === "settings_panel");
  assert.ok(route, "missing settings_panel route fixture");
  route.validationCommands[0].command = 'pnpm --dir "./packages/ui" run type-check';
  route.validationCommands[0].packageScript = "type-check";
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  const payload = await buildPreparePayload(
    "packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx",
    fixtureRoot,
  );

  assert.equal(payload.validationCommands[0].packageScript, "type-check");
});

test("build prepare payload normalizes fallback validation lazily", async () => {
  const fixtureRoot = prepareFixtureRoot();
  copyRootFile(fixtureRoot, "packages/ui/package.json");
  const packageJson = readFixtureJson(fixtureRoot, "package.json");
  delete packageJson.scripts["agent-design:lint"];
  writeFixtureJson(fixtureRoot, "package.json", packageJson);
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  const route = routing.routes.find((entry) => entry.canonicalNeed === "settings_panel");
  assert.ok(route, "missing settings_panel route fixture");
  route.validationCommands[0].command = "pnpm -C packages/ui run type-check";
  route.validationCommands[0].packageScript = "type-check";
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  const payload = await buildPreparePayload(
    "packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx",
    fixtureRoot,
  );

  assert.equal(payload.validationCommands[0].packageScript, "type-check");
});

test("build prepare payload accepts pnpm run scripts named like pnpm commands", async () => {
  const fixtureRoot = prepareFixtureRoot();
  const packageJson = readFixtureJson(fixtureRoot, "package.json");
  packageJson.scripts.list = "node --version";
  writeFixtureJson(fixtureRoot, "package.json", packageJson);
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  const route = routing.routes.find((entry) => entry.canonicalNeed === "settings_panel");
  assert.ok(route, "missing settings_panel route fixture");
  route.validationCommands[0].command = "pnpm run list";
  route.validationCommands[0].packageScript = "list";
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  const payload = await buildPreparePayload(
    "packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx",
    fixtureRoot,
  );

  assert.equal(payload.validationCommands[0].packageScript, "list");
});

test("build prepare payload rejects package scripts outside the read-only allowlist", async () => {
  const fixtureRoot = prepareFixtureRoot();
  const packageJson = readFixtureJson(fixtureRoot, "package.json");
  packageJson.scripts["unsafe:write"] = "node --version";
  writeFixtureJson(fixtureRoot, "package.json", packageJson);
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  const route = routing.routes.find((entry) => entry.canonicalNeed === "settings_panel");
  assert.ok(route, "missing settings_panel route fixture");
  route.validationCommands[0].command = "pnpm run unsafe:write";
  route.validationCommands[0].packageScript = "unsafe:write";
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_VALIDATION_COMMAND_INVALID", exitCode: 2 },
  );
});

test("build prepare payload binds read-only script trust to the package directory", async () => {
  const fixtureRoot = prepareFixtureRoot();
  fs.mkdirSync(path.join(fixtureRoot, "packages/spoof"), { recursive: true });
  fs.writeFileSync(
    path.join(fixtureRoot, "packages/spoof/package.json"),
    JSON.stringify({ scripts: { "docs:lint": "node --version" } }),
  );
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  const route = routing.routes.find((entry) => entry.canonicalNeed === "settings_panel");
  assert.ok(route, "missing settings_panel route fixture");
  route.validationCommands[0].command = "pnpm -C packages/spoof run docs:lint";
  route.validationCommands[0].packageScript = "docs:lint";
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_VALIDATION_COMMAND_INVALID", exitCode: 2 },
  );
});

test("build prepare payload rejects pnpm dir package symlinks that escape the repo", async () => {
  const fixtureRoot = prepareFixtureRoot();
  const externalPackageDir = fs.mkdtempSync(path.join(os.tmpdir(), "agent-design-package-"));
  fs.writeFileSync(
    path.join(externalPackageDir, "package.json"),
    JSON.stringify({ scripts: { "type-check": "node --version" } }),
  );
  fs.mkdirSync(path.join(fixtureRoot, "packages"), { recursive: true });
  fs.symlinkSync(externalPackageDir, path.join(fixtureRoot, "packages/ui-link"), "dir");
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  const route = routing.routes.find((entry) => entry.canonicalNeed === "settings_panel");
  assert.ok(route, "missing settings_panel route fixture");
  route.validationCommands[0].command = "pnpm -C packages/ui-link run type-check";
  route.validationCommands[0].packageScript = "type-check";
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_VALIDATION_COMMAND_INVALID", exitCode: 2 },
  );
});

test("build prepare payload rejects package.json symlinks that escape the repo", async () => {
  const fixtureRoot = prepareFixtureRoot();
  const externalPackageDir = fs.mkdtempSync(path.join(os.tmpdir(), "agent-design-package-json-"));
  const externalPackageJson = path.join(externalPackageDir, "package.json");
  fs.writeFileSync(
    externalPackageJson,
    JSON.stringify({ scripts: { "type-check": "node --version" } }),
  );
  fs.mkdirSync(path.join(fixtureRoot, "packages/ui-link"), { recursive: true });
  fs.symlinkSync(externalPackageJson, path.join(fixtureRoot, "packages/ui-link/package.json"));
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  const route = routing.routes.find((entry) => entry.canonicalNeed === "settings_panel");
  assert.ok(route, "missing settings_panel route fixture");
  route.validationCommands[0].command = "pnpm -C packages/ui-link run type-check";
  route.validationCommands[0].packageScript = "type-check";
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_VALIDATION_COMMAND_INVALID", exitCode: 2 },
  );
});

test("build prepare payload rejects filtered pnpm run validation commands", async () => {
  const fixtureRoot = prepareFixtureRoot();
  copyRootFile(fixtureRoot, "packages/ui/package.json");
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  const route = routing.routes.find((entry) => entry.canonicalNeed === "settings_panel");
  assert.ok(route, "missing settings_panel route fixture");
  route.validationCommands[0].command = "pnpm --filter ./packages/ui run type-check";
  route.validationCommands[0].packageScript = "type-check";
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_VALIDATION_COMMAND_INVALID", exitCode: 2 },
  );
});

test("build prepare payload rejects filter-omit pnpm run validation commands", async () => {
  const fixtureRoot = prepareFixtureRoot();
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  const route = routing.routes.find((entry) => entry.canonicalNeed === "settings_panel");
  assert.ok(route, "missing settings_panel route fixture");
  route.validationCommands[0].command =
    "pnpm --filter-omit-pkg-dep ./packages/ui run agent-design:lint";
  route.validationCommands[0].packageScript = "agent-design:lint";
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_VALIDATION_COMMAND_INVALID", exitCode: 2 },
  );
});

test("build prepare payload rejects pnpm subcommands as validation scripts", async () => {
  const fixtureRoot = prepareFixtureRoot();
  const packageJson = readFixtureJson(fixtureRoot, "package.json");
  packageJson.scripts.export = "node --version";
  writeFixtureJson(fixtureRoot, "package.json", packageJson);
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  const route = routing.routes.find((entry) => entry.canonicalNeed === "settings_panel");
  assert.ok(route, "missing settings_panel route fixture");
  route.validationCommands[0].command = "pnpm export";
  route.validationCommands[0].packageScript = "export";
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_VALIDATION_COMMAND_INVALID", exitCode: 2 },
  );
});

test("build prepare payload rejects missing pnpm dir target package scripts", async () => {
  const fixtureRoot = prepareFixtureRoot();
  copyRootFile(fixtureRoot, "packages/ui/package.json");
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  const route = routing.routes.find((entry) => entry.canonicalNeed === "settings_panel");
  assert.ok(route, "missing settings_panel route fixture");
  route.validationCommands[0].command = "pnpm -C packages/ui run missing:script";
  route.validationCommands[0].packageScript = "missing:script";
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_VALIDATION_COMMAND_INVALID", exitCode: 2 },
  );
});

test("build prepare payload rejects pnpm dir commands without a script name", async () => {
  const fixtureRoot = prepareFixtureRoot();
  copyRootFile(fixtureRoot, "packages/ui/package.json");
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  const route = routing.routes.find((entry) => entry.canonicalNeed === "settings_panel");
  assert.ok(route, "missing settings_panel route fixture");
  route.validationCommands[0].command = "pnpm -C packages/ui";
  delete route.validationCommands[0].packageScript;
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_VALIDATION_COMMAND_INVALID", exitCode: 2 },
  );
});

test("build prepare payload rejects routes with no read-only validation commands", async () => {
  const fixtureRoot = prepareFixtureRoot();
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  const route = routing.routes.find((entry) => entry.canonicalNeed === "settings_panel");
  assert.ok(route, "missing settings_panel route fixture");
  route.validationCommands = route.validationCommands.map((command) => ({
    ...command,
    safetyClass: "mutating",
  }));
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_VALIDATION_COMMAND_INVALID", exitCode: 2 },
  );
});

test("build prepare payload reports invalid package metadata deterministically", async () => {
  const fixtureRoot = prepareFixtureRoot();
  fs.writeFileSync(path.join(fixtureRoot, "package.json"), "{\n");

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_PACKAGE_JSON", exitCode: 2 },
  );
});

test("build prepare payload rejects non-string package scripts deterministically", async () => {
  const fixtureRoot = prepareFixtureRoot();
  const packageJson = readFixtureJson(fixtureRoot, "package.json");
  packageJson.scripts["agent-design:lint"] = false;
  writeFixtureJson(fixtureRoot, "package.json", packageJson);

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_PACKAGE_JSON", exitCode: 2 },
  );
});

test("build prepare payload rejects non-object package scripts deterministically", async () => {
  const fixtureRoot = prepareFixtureRoot();
  const packageJson = readFixtureJson(fixtureRoot, "package.json");
  packageJson.scripts = ["agent-design:lint"];
  writeFixtureJson(fixtureRoot, "package.json", packageJson);

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_PACKAGE_JSON", exitCode: 2 },
  );
});

test("build prepare payload rejects empty package scripts deterministically", async () => {
  const fixtureRoot = prepareFixtureRoot();
  const packageJson = readFixtureJson(fixtureRoot, "package.json");
  packageJson.scripts["agent-design:lint"] = "";
  writeFixtureJson(fixtureRoot, "package.json", packageJson);

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_PACKAGE_JSON", exitCode: 2 },
  );
});

test("build prepare payload reports invalid guidance JSON deterministically", async () => {
  const fixtureRoot = prepareFixtureRoot();
  fs.writeFileSync(path.join(fixtureRoot, ".design-system-guidance.json"), "{\n");

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_GUIDANCE_JSON", exitCode: 2 },
  );
});

test("build prepare payload reports invalid guidance schema deterministically", async () => {
  const fixtureRoot = prepareFixtureRoot();
  writeFixtureJson(fixtureRoot, ".design-system-guidance.json", { scopes: [] });

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_GUIDANCE_SCHEMA", exitCode: 2 },
  );
});

test("build prepare payload reports invalid routing schema deterministically", async () => {
  const fixtureRoot = prepareFixtureRoot();
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", {
    schemaVersion: "agent-ui-routing.v2",
    routes: [],
  });

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_ROUTING_SCHEMA", exitCode: 2 },
  );
});

test("build prepare payload reports invalid lifecycle schema deterministically", async () => {
  const fixtureRoot = prepareFixtureRoot();
  writeFixtureJson(fixtureRoot, "docs/design-system/COMPONENT_LIFECYCLE.json", {
    components: "bad",
  });

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_LIFECYCLE_SCHEMA", exitCode: 2 },
  );
});

test("build prepare payload reports invalid coverage schema deterministically", async () => {
  const fixtureRoot = prepareFixtureRoot();
  writeFixtureJson(fixtureRoot, "docs/design-system/COVERAGE_MATRIX.json", {
    components: [],
  });

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_COVERAGE_SCHEMA", exitCode: 2 },
  );
});

test("build prepare payload reports missing source digests deterministically", async () => {
  const fixtureRoot = prepareFixtureRoot();
  fs.rmSync(path.join(fixtureRoot, "docs/design-system/PROFESSIONAL_UI_CONTRACT.md"));

  await assert.rejects(
    () => buildPreparePayload("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", fixtureRoot),
    { code: "E_DESIGN_SOURCE_DIGEST_MISSING", exitCode: 2 },
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

test("build prepare payload fails closed when route examples are missing", async () => {
  const fixtureRoot = prepareFixtureRoot();
  copyRootFile(
    fixtureRoot,
    "packages/ui/src/components/ui/layout/ProductComposition/ProductComposition.tsx",
  );
  const routing = readFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json");
  routing.routes[0].examples = ["docs/design-system/examples/missing-example.tsx"];
  writeFixtureJson(fixtureRoot, "docs/design-system/AGENT_UI_ROUTING.json", routing);

  const payload = await buildPreparePayload(
    "packages/ui/src/components/ui/layout/ProductComposition/ProductComposition.tsx",
    fixtureRoot,
  );
  assert.equal(payload.ok, false);
  assert.equal(payload.safeForAutomaticImplementation, false);
  assert.deepEqual(
    payload.openDecisions.find((decision) => decision.code === "E_DESIGN_ROUTE_EXAMPLE_MISSING"),
    {
      code: "E_DESIGN_ROUTE_EXAMPLE_MISSING",
      message:
        "Route async_collection references missing example docs/design-system/examples/missing-example.tsx.",
      severity: "error",
      nextAction: "stop",
    },
  );
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
  assert.ok(exempt.validationCommands.length > 0);

  const unknown = await buildPreparePayload("packages/example/UnknownSurface.tsx", rootDir);
  assert.equal(unknown.surfaceScope, "unknown");
  assert.equal(unknown.ok, false);
  assert.ok(unknown.validationCommands.length > 0);
  assert.ok(
    unknown.openDecisions.some((decision) => decision.code === "E_DESIGN_SURFACE_SCOPE_UNKNOWN"),
  );
  assert.ok(
    unknown.openDecisions.some(
      (decision) =>
        decision.code === "E_DESIGN_SURFACE_SCOPE_UNKNOWN" &&
        decision.severity === "error" &&
        decision.nextAction === "escalate",
    ),
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

  const secondPayload = await buildPreparePayload(
    "platforms/web/apps/web/src/pages/TemplateBrowserPage.tsx",
    rootDir,
  );
  assert.equal(serializePreparePayload(secondPayload), serialized);
});
