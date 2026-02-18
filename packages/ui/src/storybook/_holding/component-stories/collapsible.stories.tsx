import type { Meta, StoryObj } from "@storybook/react-vite";

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
