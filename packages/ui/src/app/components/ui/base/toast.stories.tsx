import type { Meta, StoryObj } from "@storybook/react";

import { Toaster } from "../feedback/toast";

import { Button } from "./button";
import { useToast } from "./toast";

const meta: Meta = {
  title: "UI/Feedback/Toast",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const ToastDemo = () => {
  const { toast } = useToast();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={() => {
            toast({
              title: "Success",
              description: "Your action was completed successfully.",
            });
          }}
        >
          Show Success Toast
        </Button>
        
        <Button
          variant="destructive"
          onClick={() => {
            toast({
              title: "Error",
              description: "Something went wrong. Please try again.",
              variant: "destructive",
            });
          }}
        >
          Show Error Toast
        </Button>
        
        <Button
          variant="outline"
          onClick={() => {
            toast({
              title: "Info",
              description: "Here's some information for you.",
            });
          }}
        >
          Show Info Toast
        </Button>
        
        <Button
          variant="secondary"
          onClick={() => {
            toast({
              title: "Warning",
              description: "Please be careful with this action.",
            });
          }}
        >
          Show Warning Toast
        </Button>
      </div>
      <Toaster />
    </div>
  );
};

export const Default: Story = {
  render: () => <ToastDemo />,
};