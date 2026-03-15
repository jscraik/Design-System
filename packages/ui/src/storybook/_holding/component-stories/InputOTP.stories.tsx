import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "@storybook/test";
import * as React from "react";

import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "./InputOTP";

const meta: Meta<typeof InputOTP> = {
  title: "Components/UI/Base/Input OTP",
  component: InputOTP,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof InputOTP>;

// ─── Display stories ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState("");

    return (
      <InputOTP maxLength={6} value={value} onChange={setValue}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    );
  },
};

// ─── Interaction tests ────────────────────────────────────────────────────────

export const TypeOTP: Story = {
  render: () => {
    const [value, setValue] = React.useState("");

    return (
      <div className="space-y-4 text-center">
        <InputOTP maxLength={6} value={value} onChange={setValue}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <div data-testid="otp-value" className="text-sm">Value: {value}</div>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.step("Input rendered", () => {
      // The actual input is visually hidden but focusable
      expect(canvas.getByTestId("otp-value")).toHaveTextContent("Value:");
    });

    await userEvent.step("Type 6 digits", async () => {
      // InputOTP usually renders a hidden input for capturing keystrokes
      // We tab to focus it and then type
      await userEvent.tab();
      await userEvent.keyboard("123456");
    });

    await userEvent.step("Value is captured", () => {
      expect(canvas.getByTestId("otp-value")).toHaveTextContent("Value: 123456");
    });
  },
};
