import { describe, expect, it, vi } from "vitest";

import { render, screen } from "../../../testing/utils";

import { IconPickerModal } from "./IconPickerModal";

const baseProps = {
  isOpen: true,
  onClose: vi.fn(),
  onSave: vi.fn(),
  currentIconId: "folder",
  currentColorId: "gray",
  projectName: "Test Project",
};

describe("IconPickerModal", () => {
  it("renders distinct yellow and pink color swatches", () => {
    render(<IconPickerModal {...baseProps} />);

    const yellowButton = screen.getByRole("button", { name: "Select Yellow color" });
    const pinkButton = screen.getByRole("button", { name: "Select Pink color" });

    expect(yellowButton).toHaveClass("bg-accent-yellow");
    expect(yellowButton).not.toHaveClass("bg-accent-orange");

    expect(pinkButton).toHaveClass("bg-accent-pink");
    expect(pinkButton).not.toHaveClass("bg-accent-purple");
  });

  it("uses readable close button text color classes", () => {
    render(<IconPickerModal {...baseProps} />);

    const closeButton = screen.getByRole("button", { name: "Close dialog" });
    expect(closeButton).toHaveClass("text-text-secondary");
    expect(closeButton).toHaveClass("hover:text-foreground");
  });
});
