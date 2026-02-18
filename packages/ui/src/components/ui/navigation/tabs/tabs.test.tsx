import { describe, expect, it } from "vitest";

import { render, screen } from "../../../../testing/utils";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./fallback/Tabs";

describe("Tabs", () => {
  it("renders with data-slot attributes", () => {
    render(
      <Tabs defaultValue="tab-1">
        <TabsList>
          <TabsTrigger value="tab-1">Tab One</TabsTrigger>
          <TabsTrigger value="tab-2">Tab Two</TabsTrigger>
        </TabsList>
        <TabsContent value="tab-1">Content One</TabsContent>
        <TabsContent value="tab-2">Content Two</TabsContent>
      </Tabs>,
    );

    expect(screen.getByRole("tablist")).toHaveAttribute("data-slot", "tabs-list");
    expect(screen.getByRole("tab", { name: "Tab One" })).toHaveAttribute(
      "data-slot",
      "tabs-trigger",
    );
  });

  it("switches content when a new tab is selected", async () => {
    const { user } = render(
      <Tabs defaultValue="tab-1">
        <TabsList>
          <TabsTrigger value="tab-1">Tab One</TabsTrigger>
          <TabsTrigger value="tab-2">Tab Two</TabsTrigger>
        </TabsList>
        <TabsContent value="tab-1">Content One</TabsContent>
        <TabsContent value="tab-2">Content Two</TabsContent>
      </Tabs>,
    );

    expect(screen.getByText("Content One")).toBeVisible();
    await user.click(screen.getByRole("tab", { name: "Tab Two" }));
    expect(screen.getByText("Content Two")).toBeVisible();
  });
});
