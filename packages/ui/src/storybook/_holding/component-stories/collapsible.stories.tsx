import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "@storybook/test";

import { Button } from "../Button";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./fallback/Collapsible";

const meta: Meta<typeof Collapsible> = {
  title: "Components/UI/Base/Collapsible",
  component: Collapsible,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Collapsible>;

// ─── Display stories ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <Collapsible defaultOpen>
      <div className="flex w-[320px] items-center justify-between rounded-md border px-3 py-2">
        <div className="text-sm font-medium">Project details</div>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm">
            Toggle
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="mt-2 rounded-md border p-3 text-sm">
        Hidden content lives here.
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const ClosedByDefault: Story = {
  render: () => (
    <Collapsible>
      <div className="flex w-[320px] items-center justify-between rounded-md border px-3 py-2">
        <div className="text-sm font-medium">Advanced settings</div>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm">Show</Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="mt-2 rounded-md border p-3 text-sm">
        Advanced content revealed.
      </CollapsibleContent>
    </Collapsible>
  ),
};

// ─── Interaction tests ────────────────────────────────────────────────────────

export const ExpandAndCollapse: Story = {
  render: () => (
    <Collapsible>
      <div className="flex w-[320px] items-center justify-between rounded-md border px-3 py-2">
        <div className="text-sm font-medium">Details</div>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm">Toggle</Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="mt-2 rounded-md border p-3 text-sm">
        Secret content.
      </CollapsibleContent>
    </Collapsible>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.step("Content is hidden initially", () => {
      expect(canvas.queryByText("Secret content.")).not.toBeVisible();
    });

    await userEvent.step("Click Toggle to expand", async () => {
      await userEvent.click(canvas.getByRole("button", { name: /toggle/i }));
    });

    await userEvent.step("Content is now visible", async () => {
      expect(await canvas.findByText("Secret content.")).toBeVisible();
    });

    await userEvent.step("Click Toggle again to collapse", async () => {
      await userEvent.click(canvas.getByRole("button", { name: /toggle/i }));
    });

    await userEvent.step("Content is hidden again", () => {
      expect(canvas.queryByText("Secret content.")).not.toBeVisible();
    });
  },
};
