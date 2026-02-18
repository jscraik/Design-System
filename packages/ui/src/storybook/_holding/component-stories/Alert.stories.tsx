import type { Meta, StoryObj } from "@storybook/react-vite";

import { Alert, AlertDescription, AlertTitle } from "./Alert";

const meta: Meta<typeof Alert> = {
  title: "Components/UI/Base/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  render: () => (
    <Alert className="max-w-sm">
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>This is a default alert with supporting text.</AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="max-w-sm">
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription>Your request could not be completed. Try again.</AlertDescription>
    </Alert>
  ),
};
