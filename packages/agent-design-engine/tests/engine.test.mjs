import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  diffDesignContracts,
  exportDesignContract,
  lintDesignContract,
  loadAgentUiRoutingTable,
  loadRuleManifest,
  parseDesignContract,
  resolveRemediationContext,
  resolveRouteForNeed,
  resolveRouteForSurface,
  validateAgentUiRoutingTable,
} from "../dist/index.js";

const rootDir = new URL("../../..", import.meta.url).pathname;
const valid = await readFile(new URL("fixtures/valid-design.md", import.meta.url), "utf8");
const invalid = await readFile(new URL("fixtures/invalid-design.md", import.meta.url), "utf8");
const rootDesign = await readFile(new URL("../../../DESIGN.md", import.meta.url), "utf8");

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
  const page = resolveRouteForSurface("platforms/web/apps/web/src/pages/TemplateBrowserPage.tsx", rootDir);
  assert.equal(page.ok, true);
  assert.equal(page.route?.canonicalNeed, "page_shell");

  const settings = resolveRouteForSurface("packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx", rootDir);
  assert.equal(settings.ok, true);
  assert.equal(settings.route?.canonicalNeed, "settings_panel");
});

test("returns deterministic missing-route diagnostics for unknown needs and surfaces", () => {
  const missingNeed = resolveRouteForNeed("timeline editor", rootDir);
  assert.equal(missingNeed.ok, false);
  assert.equal(missingNeed.diagnostics[0].code, "E_DESIGN_ROUTE_MISSING");

  const missingSurface = resolveRouteForSurface("packages/ui/src/components/unknown/Thing.tsx", rootDir);
  assert.equal(missingSurface.ok, false);
  assert.equal(missingSurface.diagnostics[0].code, "E_DESIGN_ROUTE_MISSING");
});

test("builds remediation context from route data", () => {
  const context = resolveRemediationContext("grouped panel", rootDir);
  assert.equal(context.route?.canonicalNeed, "product_panel");
  assert.ok(context.forbiddenPatterns.some((pattern) => pattern.includes("Nested cards")));
  assert.ok(context.replacementInstructions.some((instruction) => instruction.includes("ProductPanel")));
});
