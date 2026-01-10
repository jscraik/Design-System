import { expect, test } from "@playwright/test";

const routes = [
  { path: "/templates", heading: "ChatGPT UI Templates" },
  { path: "/templates/compose", heading: "ChatGPT UI Templates" },
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

  test("navigates from chat shell to templates via link", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Templates" }).click();
    await expect(page).toHaveURL(/\/templates/);
    await expect(page.getByRole("heading", { name: "ChatGPT UI Templates" })).toBeVisible();
  });

  test("navigates back to widget gallery from templates", async ({ page }) => {
    await page.goto("/templates");
    await page.getByRole("button", { name: "Widget Gallery" }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("deep links to template by query param and path", async ({ page }) => {
    await page.goto("/templates?id=template-shell");
    await expect(page.getByRole("heading", { name: "Template Shell" })).toBeVisible();

    await page.goto("/templates/template-shell");
    await expect(page.getByRole("heading", { name: "Template Shell" })).toBeVisible();
  });
});
