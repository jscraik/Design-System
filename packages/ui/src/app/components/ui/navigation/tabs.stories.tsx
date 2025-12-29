import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "@storybook/test";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

const meta: Meta<typeof Tabs> = {
  title: "UI/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[360px]">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="usage">Usage</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="rounded-md border p-3 text-sm">
        Overview content goes here.
      </TabsContent>
      <TabsContent value="usage" className="rounded-md border p-3 text-sm">
        Usage notes and examples.
      </TabsContent>
      <TabsContent value="notes" className="rounded-md border p-3 text-sm">
        Extra notes for the component.
      </TabsContent>
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const usageTab = canvas.getByRole("tab", { name: /usage/i });
    await userEvent.click(usageTab);
    await expect(canvas.getByText("Usage notes and examples.")).toBeInTheDocument();
  },
};

export const Wide: Story = {
  render: () => (
    <Tabs defaultValue="design" className="w-[420px]">
      <TabsList className="w-full">
        <TabsTrigger value="design">Design</TabsTrigger>
        <TabsTrigger value="build">Build</TabsTrigger>
        <TabsTrigger value="ship">Ship</TabsTrigger>
      </TabsList>
      <TabsContent value="design" className="rounded-md border p-3 text-sm">
        Design details.
      </TabsContent>
      <TabsContent value="build" className="rounded-md border p-3 text-sm">
        Build instructions.
      </TabsContent>
      <TabsContent value="ship" className="rounded-md border p-3 text-sm">
        Release checklist.
      </TabsContent>
    </Tabs>
  ),
};
