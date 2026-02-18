import type { Meta, StoryObj } from "@storybook/react-vite";
import { toast } from "sonner";

import { Button } from "../../base/Button";

import { Toaster } from "./Sonner";

const meta: Meta<typeof Toaster> = {
  title: "Components/UI/Feedback/Sonner",
  component: Toaster,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-3">
      <Button onClick={() => toast("Toast notification")}>Show toast</Button>
      <Toaster />
    </div>
  ),
};
