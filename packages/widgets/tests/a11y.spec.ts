import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const widgets = [
  { id: "auth-demo", title: "Auth Demo" },
  { id: "chat-view", title: "Chat View" },
  { id: "dashboard-widget", title: "Dashboard" },
  { id: "kitchen-sink-lite", title: "Kitchen Sink Demo" },
  { id: "pizzaz-carousel", title: "Pizzaz Carousel" },
  { id: "pizzaz-gallery", title: "Pizzaz Gallery" },
  { id: "pizzaz-markdown", title: "Pizzaz Markdown" },
  { id: "pizzaz-shop", title: "Pizzaz Shop" },
  { id: "pizzaz-table", title: "Pizzaz Table" },
  { id: "search-results", title: "Search Results" },
  { id: "shopping-cart", title: "Shopping Cart" },
  { id: "solar-system", title: "Solar System" },
];

test.describe("widget a11y", () => {
  for (const widget of widgets) {
    test(`${widget.id} passes axe checks`, async ({ page }) => {
      await page.goto(`/${widget.id}`);
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(300);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
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
          ? `${widget.title} has accessibility violations`
          : `${widget.title} has accessibility violations (soft)`,
      ).toEqual([]);
    });
  }
});
