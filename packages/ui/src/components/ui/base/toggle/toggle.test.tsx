import { describe, expect, it, vi } from "vitest";

import { expectFocused, render, screen } from "../../../../testing/utils";

import { Toggle, ToggleRow } from "./toggle";

describe("Toggle", () => {
  describe("rendering", () => {
    it("renders with default props", () => {
      render(<Toggle />);
      expect(screen.getByRole("switch")).toBeInTheDocument();
    });

    it("renders unchecked by default", () => {
      render(<Toggle />);
      expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
    });

    it("renders checked when checked prop is true", () => {
      render(<Toggle checked />);
      expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
    });

    it("applies custom className", () => {
      render(<Toggle className="custom-class" />);
      expect(screen.getByRole("switch")).toHaveClass("custom-class");
    });
  });

  describe("sizes", () => {
    it.each([
      ["sm", "w-8"],
      ["md", "w-11"],
      ["lg", "w-14"],
    ] as const)("renders %s size with correct width", (size, expectedClass) => {
      render(<Toggle size={size} />);
      expect(screen.getByRole("switch")).toHaveClass(expectedClass);
    });
  });

  describe("interactions", () => {
    it("calls onChange when clicked", async () => {
      const onChange = vi.fn();
      const { user } = render(<Toggle onChange={onChange} />);

      await user.click(screen.getByRole("switch"));
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it("toggles from checked to unchecked", async () => {
      const onChange = vi.fn();
      const { user } = render(<Toggle checked onChange={onChange} />);

      await user.click(screen.getByRole("switch"));
      expect(onChange).toHaveBeenCalledWith(false);
    });

    it("can be focused via keyboard", async () => {
      const { user } = render(<Toggle />);
      await user.tab();
      expectFocused(screen.getByRole("switch"));
    });
  });

  describe("disabled state", () => {
    it("renders as disabled when disabled prop is true", () => {
      render(<Toggle disabled />);
      expect(screen.getByRole("switch")).toBeDisabled();
    });

    it("does not trigger onChange when disabled", async () => {
      const onChange = vi.fn();
      const { user } = render(<Toggle disabled onChange={onChange} />);

      await user.click(screen.getByRole("switch"));
      expect(onChange).not.toHaveBeenCalled();
    });

    it("has correct disabled styles", () => {
      render(<Toggle disabled />);
      expect(screen.getByRole("switch")).toHaveClass("opacity-50", "cursor-not-allowed");
    });
  });

  describe("accessibility", () => {
    it("has correct switch role", () => {
      render(<Toggle />);
      expect(screen.getByRole("switch")).toBeInTheDocument();
    });

    it("has correct aria-checked attribute", () => {
      const { rerender } = render(<Toggle checked={false} />);
      expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");

      rerender(<Toggle checked={true} />);
      expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
    });

    it("is a button element", () => {
      render(<Toggle />);
      expect(screen.getByRole("switch").tagName).toBe("BUTTON");
    });

    it("has type button to prevent form submission", () => {
      render(<Toggle />);
      expect(screen.getByRole("switch")).toHaveAttribute("type", "button");
    });
  });

  describe("custom activeColor", () => {
    it("applies custom active color when checked", () => {
      render(<Toggle checked activeColor="rgb(255, 0, 0)" />);
      const toggle = screen.getByRole("switch");
      expect(toggle).toHaveAttribute("style", expect.stringContaining("background-color"));
    });
  });
});

describe("ToggleRow", () => {
  describe("rendering", () => {
    it("renders with label", () => {
      render(<ToggleRow label="Enable feature" />);
      expect(screen.getByText("Enable feature")).toBeInTheDocument();
      expect(screen.getByRole("switch")).toBeInTheDocument();
    });

    it("renders with description", () => {
      render(<ToggleRow label="Enable feature" description="Turn this on to enable" />);
      expect(screen.getByText("Turn this on to enable")).toBeInTheDocument();
    });

    it("renders with icon", () => {
      render(<ToggleRow label="Enable feature" icon={<span data-testid="icon">🔧</span>} />);
      expect(screen.getByTestId("icon")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(<ToggleRow label="Test" className="custom-class" />);
      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("interactions", () => {
    it("calls onChange when toggle is clicked", async () => {
      const onChange = vi.fn();
      const { user } = render(<ToggleRow label="Test" onChange={onChange} />);

      await user.click(screen.getByRole("switch"));
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it("reflects checked state", () => {
      render(<ToggleRow label="Test" checked />);
      expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
    });
  });
});
