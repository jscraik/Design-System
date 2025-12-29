import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState } from "react";

import { Button } from "../base/button";

import { Toast, ToastContainer } from "./toast";

const meta: Meta<typeof Toast> = {
  title: "UI/Feedback/Toast",
  component: Toast,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "success", "error", "warning", "info"],
    },
    duration: {
      control: { type: "number", min: 0, max: 10000, step: 1000 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Notification",
    description: "This is a default toast notification.",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    title: "Success!",
    description: "Your changes have been saved successfully.",
    icon: (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    title: "Error",
    description: "Something went wrong. Please try again.",
    icon: (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Warning",
    description: "Your session will expire in 5 minutes.",
    icon: (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
  },
};

export const Info: Story = {
  args: {
    variant: "info",
    title: "Information",
    description: "A new version is available. Refresh to update.",
    icon: (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
};

export const WithAction: Story = {
  args: {
    variant: "default",
    title: "Undo action",
    description: "Message deleted.",
    action: (
      <Button variant="outline" size="sm">
        Undo
      </Button>
    ),
  },
};

export const WithCloseButton: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div className="w-[400px]">
        {!open && (
          <Button onClick={() => setOpen(true)} className="mb-4">
            Show Toast
          </Button>
        )}
        <Toast
          open={open}
          onClose={() => setOpen(false)}
          title="Dismissible Toast"
          description="Click the X to close this toast."
          duration={0}
        />
      </div>
    );
  },
};

export const AutoDismiss: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div className="w-[400px]">
        {!open && (
          <Button onClick={() => setOpen(true)} className="mb-4">
            Show Toast
          </Button>
        )}
        <Toast
          open={open}
          onClose={() => setOpen(false)}
          variant="success"
          title="Auto-dismiss"
          description="This toast will disappear in 3 seconds."
          duration={3000}
        />
      </div>
    );
  },
};

export const ToastStack: Story = {
  render: () => {
    const nextId = useRef(4);
    const [toasts, setToasts] = useState([
      { id: 1, variant: "success" as const, title: "Success", description: "First toast" },
      { id: 2, variant: "info" as const, title: "Info", description: "Second toast" },
      { id: 3, variant: "warning" as const, title: "Warning", description: "Third toast" },
    ]);

    const removeToast = (id: number) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
      <div className="relative h-[400px] w-[500px]">
        <Button
          onClick={() =>
            setToasts((prev) => [
              ...prev,
              {
                id: nextId.current++,
                variant: "default" as const,
                title: "New Toast",
                description: `Toast #${prev.length + 1}`,
              },
            ])
          }
        >
          Add Toast
        </Button>
        <ToastContainer position="bottom-right">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              variant={toast.variant}
              title={toast.title}
              description={toast.description}
              onClose={() => removeToast(toast.id)}
              duration={0}
            />
          ))}
        </ToastContainer>
      </div>
    );
  },
};
