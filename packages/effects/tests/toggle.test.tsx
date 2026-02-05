import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { LiquidToggle } from "../src/components/toggle";

describe("LiquidToggle", () => {
  it("should render children", () => {
    render(
      <LiquidToggle pressed={false} onPressedChange={() => {}}>
        Toggle Me
      </LiquidToggle>,
    );
    expect(screen.getByText("Toggle Me")).toBeInTheDocument();
  });

  it("should call onPressedChange when clicked", async () => {
    const handleChange = vi.fn();
    render(
      <LiquidToggle pressed={false} onPressedChange={handleChange}>
        Toggle
      </LiquidToggle>,
    );

    const button = screen.getByRole("button", { name: /toggle/i });
    await userEvent.click(button);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it("should not call onPressedChange when disabled", async () => {
    const handleChange = vi.fn();
    render(
      <LiquidToggle pressed={false} onPressedChange={handleChange} disabled>
        Toggle
      </LiquidToggle>,
    );

    const button = screen.getByRole("button");
    await userEvent.click(button);

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("should have aria-pressed attribute", () => {
    render(
      <LiquidToggle pressed={true} onPressedChange={() => {}}>
        Pressed
      </LiquidToggle>,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("should have aria-label when provided", () => {
    render(
      <LiquidToggle pressed={false} onPressedChange={() => {}} ariaLabel="Custom Label">
        Toggle
      </LiquidToggle>,
    );
    const button = screen.getByRole("button", { name: "Custom Label" });
    expect(button).toBeInTheDocument();
  });

  it("should be keyboard accessible", async () => {
    const handleChange = vi.fn();
    function KeyboardHarness() {
      const [pressed, setPressed] = useState(false);
      return (
        <LiquidToggle
          pressed={pressed}
          onPressedChange={(next) => {
            setPressed(next);
            handleChange(next);
          }}
          ariaLabel="Test Toggle"
        >
          Toggle
        </LiquidToggle>
      );
    }

    render(<KeyboardHarness />);

    const button = screen.getByRole("button");
    button.focus();
    expect(button).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    expect(handleChange).toHaveBeenCalledWith(true);
    expect(button).toHaveAttribute("aria-pressed", "true");

    await userEvent.keyboard(" "); // Space key
    expect(handleChange).toHaveBeenCalledWith(false);
    expect(button).toHaveAttribute("aria-pressed", "false");
  });
});
