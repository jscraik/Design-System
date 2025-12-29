import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../base/button";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-[320px]">
      <CardHeader>
        <CardTitle>Project overview</CardTitle>
        <CardDescription>Weekly performance snapshot.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Updates are posted every Monday at 9am.
      </CardContent>
    </Card>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Card className="w-[340px]">
      <CardHeader>
        <CardTitle>Design review</CardTitle>
        <CardDescription>Share feedback with the team.</CardDescription>
        <CardAction>
          <Button size="sm" variant="secondary">
            Share
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Invite collaborators to add comments.
      </CardContent>
      <CardFooter>
        <Button>Continue</Button>
      </CardFooter>
    </Card>
  ),
};
