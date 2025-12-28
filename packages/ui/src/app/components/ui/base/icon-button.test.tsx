import { describe, expect, it, vi } from "vitest";

import { expectFocused, render, screen } from "../../../../test/utils";

import { IconButton } from "./icon-button";

const TestIcon = () => <span data-testid="test-icon">🔧</span>;
const baseProps = { icon: <TestIcon />, title: "Settings" };

describe("IconButton", () => {
  describe("rendering", () => {
    it("renders with icon", () => {
      render(<IconButton {...baseProps} />);
      expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    });

    it("renders as button element", () => {
      render(<IconButton {...baseProps} />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(<IconButton {...baseProps} className="custom-class" />);
      expect(screen.getByRole("button")).toHaveClass("custom-class");
    });

    it("has type button by default", () => {
      render(<IconButton {...baseProps} />);
      expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    });
  });

  describe("title and aria-label", () => {
    it("sets title attribute", () => {
      render(<IconButton {...baseProps} />);
      expect(screen.getByRole("button")).toHaveAttribute("title", "Settings");
    });

    it("sets aria-label from title", () => {
      render(<IconButton {...baseProps} />);
      expect(screen.getByRole("button")).toHaveAccessibleName("Settings");
    });

    it("sets aria-label from ariaLabel", () => {
      render(<IconButton icon={<TestIcon />} ariaLabel="Close dialog" />);
      expect(screen.getByRole("button")).toHaveAccessibleName("Close dialog");
    });
  });

  describe("sizes", () => {
    it.each([
      ["sm", "p-1"],
      ["md", "p-1.5"],
      ["lg", "p-2"],
    ] as const)("renders %s size with correct padding", (size, expectedClass) => {
      render(<IconButton {...baseProps} size={size} />);
      expect(screen.getByRole("button")).toHaveClass(expectedClass);
    });
  });

  describe("variants", () => {
    it("renders ghost variant", () => {
      render(<IconButton {...baseProps} variant="ghost" />);
      expect(screen.getByRole("button")).toHaveClass("hover:bg-foundation-bg-light-3");
    });

    it("renders outline variant", () => {
      render(<IconButton {...baseProps} variant="outline" />);
      expect(screen.getByRole("button")).toHaveClass("border");
    });

    it("renders solid variant", () => {
      render(<IconButton {...baseProps} variant="solid" />);
      expect(screen.getByRole("button")).toHaveClass("bg-foundation-bg-light-2");
    });
  });

  describe("interactions", () => {
    it("calls onClick when clicked", async () => {
      const onClick = vi.fn();
      const { user } = render(<IconButton {...baseProps} onClick={onClick} />);

      await user.click(screen.getByRole("button"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("can be focused via keyboard", async () => {
      const { user } = render(<IconButton {...baseProps} />);
      await user.tab();
      expectFocused(screen.getByRole("button"));
    });

    it("triggers onClick on Enter key", async () => {
      const onClick = vi.fn();
      const { user } = render(<IconButton {...baseProps} onClick={onClick} />);

      await user.tab();
      await user.keyboard("{Enter}");
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("triggers onClick on Space key", async () => {
      const onClick = vi.fn();
      const { user } = render(<IconButton {...baseProps} onClick={onClick} />);

      await user.tab();
      await user.keyboard(" ");
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("disabled state", () => {
    it("renders as disabled when disabled prop is true", () => {
      render(<IconButton {...baseProps} disabled />);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("does not trigger onClick when disabled", async () => {
      const onClick = vi.fn();
      const { user } = render(<IconButton {...baseProps} disabled onClick={onClick} />);

      await user.click(screen.getByRole("button"));
      expect(onClick).not.toHaveBeenCalled();
    });

    it("has correct disabled styles", () => {
      render(<IconButton {...baseProps} disabled />);
      expect(screen.getByRole("button")).toHaveClass("opacity-50", "cursor-not-allowed");
    });
  });

  describe("active state", () => {
    it("applies active styles when active", () => {
      render(<IconButton {...baseProps} active />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("style", expect.stringContaining("background-color"));
    });

    it("uses custom activeColor", () => {
      render(<IconButton {...baseProps} active activeColor="rgb(255, 0, 0)" />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute(
        "style",
        expect.stringContaining("color-mix(in srgb, rgb(255, 0, 0) 10%, transparent)"),
      );
    });
  });

  describe("type attribute", () => {
    it("defaults to button type", () => {
      render(<IconButton {...baseProps} />);
      expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    });

    it("accepts submit type", () => {
      render(<IconButton {...baseProps} type="submit" />);
      expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    });

    it("accepts reset type", () => {
      render(<IconButton {...baseProps} type="reset" />);
      expect(screen.getByRole("button")).toHaveAttribute("type", "reset");
    });
  });

  describe("accessibility", () => {
    it("has correct button role", () => {
      render(<IconButton {...baseProps} />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("supports aria-label via title", () => {
      render(<IconButton icon={<TestIcon />} title="Close dialog" />);
      expect(screen.getByRole("button")).toHaveAccessibleName("Close dialog");
    });

    it("supports aria-disabled", () => {
      render(<IconButton {...baseProps} disabled />);
      expect(screen.getByRole("button")).toBeDisabled();
    });
  });
});
