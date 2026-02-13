import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("template browser", () => {
  test("deep links select templates", async ({ page }) => {
    await page.goto("/templates/dashboard");
    await expect(page.getByRole("heading", { name: "ChatGPT UI Templates" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  });

  test("search filters templates", async ({ page }) => {
    await page.goto("/templates");
    const summary = page.getByText(/Showing\s+\d+\s+of\s+\d+\s+templates/i);
    const initialSummary = (await summary.textContent()) ?? "";
    const initialMatch = initialSummary.match(/Showing\s+(\d+)\s+of\s+(\d+)\s+templates/i);
    if (!initialMatch) {
      throw new Error(`Unexpected summary text: ${initialSummary}`);
    }

    const initialResults = Number(initialMatch[1]);
    const initialTotal = Number(initialMatch[2]);
    expect(initialResults).toBe(initialTotal);

    await page.getByLabel("Search templates").fill("dashboard");
    await expect(page.getByRole("button", { name: /Dashboard/i })).toBeVisible();

    const filteredSummary = (await summary.textContent()) ?? "";
    const filteredMatch = filteredSummary.match(/Showing\s+(\d+)\s+of\s+(\d+)\s+templates/i);
    if (!filteredMatch) {
      throw new Error(`Unexpected summary text after filter: ${filteredSummary}`);
    }

    const filteredResults = Number(filteredMatch[1]);
    const filteredTotal = Number(filteredMatch[2]);
    expect(filteredTotal).toBe(initialTotal);
    expect(filteredResults).toBeLessThan(initialResults);
    expect(filteredResults).toBeGreaterThan(0);

    await page.getByLabel("Clear search").click();
    await expect(page.getByRole("button", { name: /Dashboard/i })).toBeVisible();
    await expect(summary).toContainText(`Showing ${initialTotal} of ${initialTotal} templates`);
  });

  test("template browser passes axe checks", async ({ page }) => {
    await page.goto("/templates");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(300);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    const violations = results.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      description: violation.description,
      nodes: violation.nodes.length,
      targets: violation.nodes.slice(0, 3).map((node) => node.target.join(" ")),
    }));

    const strict = process.env.A11Y_STRICT === "1";
    const assertion = strict ? expect : expect.soft;

    assertion(
      violations,
      strict
        ? "Template browser has accessibility violations"
        : "Template browser has accessibility violations (soft)",
    ).toEqual([]);
  });
});
