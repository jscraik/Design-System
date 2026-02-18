import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { MagneticButton } from "../src/components/button";

describe("MagneticButton", () => {
  it("should render children", () => {
    render(<MagneticButton>Click Me</MagneticButton>);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("should call onClick when clicked", async () => {
    const handleClick = vi.fn();
    render(<MagneticButton onClick={handleClick}>Click Me</MagneticButton>);

    const button = screen.getByRole("button");
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should not call onClick when disabled", async () => {
    const handleClick = vi.fn();
    render(
      <MagneticButton onClick={handleClick} disabled>
        Disabled
      </MagneticButton>,
    );

    const button = screen.getByRole("button");
    await userEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should have aria-label when provided", () => {
    render(<MagneticButton ariaLabel="Custom Label">Button</MagneticButton>);
    const button = screen.getByRole("button", { name: "Custom Label" });
    expect(button).toBeInTheDocument();
  });

  it("should be keyboard accessible", async () => {
    const handleClick = vi.fn();
    render(
      <MagneticButton onClick={handleClick} ariaLabel="Test Button">
        Button
      </MagneticButton>,
    );

    const button = screen.getByRole("button");
    button.focus();
    expect(button).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should have correct variant classes", () => {
    const { rerender } = render(<MagneticButton variant="outline">Outline</MagneticButton>);
    let button = screen.getByRole("button");
    expect(button).toHaveClass("border");

    rerender(<MagneticButton variant="ghost">Ghost</MagneticButton>);
    button = screen.getByRole("button");
    expect(button).toHaveClass("hover:bg-foundation-bg-light-2");
  });
});
