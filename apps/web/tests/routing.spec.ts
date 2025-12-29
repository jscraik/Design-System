import { expect, test } from "@playwright/test";

const routes = [
  { path: "/settings", heading: "Settings" },
  { path: "/profile", heading: "Profile" },
  { path: "/about", heading: "About ChatUI" },
];

test.describe("apps/web routing", () => {
  for (const route of routes) {
    test(`renders ${route.path}`, async ({ page }) => {
      await page.goto(route.path);
      await expect(page.getByRole("heading", { name: route.heading })).toBeVisible();
    });
  }

  test("renders chat shell", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => {
      pageErrors.push(error.stack ?? error.message);
    });

    await page.goto("/");
    expect(pageErrors, `Page errors:\\n${pageErrors.join("\\n")}`).toEqual([]);
    await expect(page.getByTestId("chat-ui-root")).toBeVisible();
  });

  test("renders widget harness gallery", async ({ page }) => {
    await page.goto("/harness");
    await expect(page.getByRole("heading", { name: "Widget Gallery" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Dashboard Widget" })).toBeVisible();

    await page.getByRole("button", { name: /Search Results/i }).click();
    await expect(page.getByRole("heading", { name: "Search Results" })).toBeVisible();
  });
});
