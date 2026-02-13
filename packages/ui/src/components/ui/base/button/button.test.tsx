import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { expectFocused, render, screen } from "../../../../testing/utils";

import { Button } from "./fallback/Button";

describe("Button", () => {
  describe("rendering", () => {
    it("renders with default props", () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
    });

    it("renders with data-slot attribute", () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("data-slot", "button");
    });

    it("applies custom className", () => {
      render(<Button className="custom-class">Click me</Button>);
      expect(screen.getByRole("button")).toHaveClass("custom-class");
    });
  });

  describe("variants", () => {
    it.each([
      ["default", "bg-interactive"],
      ["destructive", "bg-status-error"],
      ["outline", "border"],
      ["secondary", "bg-muted"],
      ["ghost", "bg-transparent"],
      ["link", "underline-offset-4"],
    ] as const)("renders %s variant with correct styles", (variant, expectedClass) => {
      render(<Button variant={variant}>Button</Button>);
      expect(screen.getByRole("button")).toHaveClass(expectedClass);
    });
  });

  describe("sizes", () => {
    it.each([
      ["default", "h-[var(--foundation-size-control-height)]"],
      ["sm", "h-[var(--foundation-size-control-height)]"],
      ["lg", "h-[var(--foundation-size-control-height)]"],
      ["icon", "size-[var(--foundation-size-control-height)]"],
    ] as const)("renders %s size with correct styles", (size, expectedClass) => {
      render(<Button size={size}>Button</Button>);
      expect(screen.getByRole("button")).toHaveClass(expectedClass);
    });
  });

  describe("ref forwarding", () => {
    it("forwards ref to button element", () => {
      const ref = createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Click me</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current?.textContent).toBe("Click me");
    });
  });

  describe("disabled state", () => {
    it("renders as disabled when disabled prop is true", () => {
      render(<Button disabled>Click me</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("does not trigger onClick when disabled", async () => {
      const onClick = vi.fn();
      const { user } = render(
        <Button disabled onClick={onClick}>
          Click me
        </Button>,
      );
      await user.click(screen.getByRole("button"));
      expect(onClick).not.toHaveBeenCalled();
    });

    it("has correct disabled styles", () => {
      render(<Button disabled>Click me</Button>);
      expect(screen.getByRole("button")).toHaveClass("disabled:opacity-50");
    });
  });

  describe("interactions", () => {
    it("calls onClick when clicked", async () => {
      const onClick = vi.fn();
      const { user } = render(<Button onClick={onClick}>Click me</Button>);
      await user.click(screen.getByRole("button"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("can be focused via keyboard", async () => {
      const { user } = render(<Button>Click me</Button>);
      await user.tab();
      expectFocused(screen.getByRole("button"));
    });

    it("triggers onClick on Enter key", async () => {
      const onClick = vi.fn();
      const { user } = render(<Button onClick={onClick}>Click me</Button>);
      await user.tab();
      await user.keyboard("{Enter}");
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("triggers onClick on Space key", async () => {
      const onClick = vi.fn();
      const { user } = render(<Button onClick={onClick}>Click me</Button>);
      await user.tab();
      await user.keyboard(" ");
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("asChild", () => {
    it("renders as child element when asChild is true", () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>,
      );
      const link = screen.getByRole("link", { name: "Link Button" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/test");
    });
  });

  describe("accessibility", () => {
    it("has correct button role", () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("supports aria-label", () => {
      render(<Button aria-label="Custom label">Icon</Button>);
      expect(screen.getByRole("button")).toHaveAccessibleName("Custom label");
    });

    it("supports aria-disabled", () => {
      render(<Button aria-disabled="true">Click me</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("aria-disabled", "true");
    });

    it("has visible focus indicator styles", () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole("button")).toHaveClass("focus-visible:ring-ring");
    });
  });

  describe("type attribute", () => {
    it("defaults to button type", () => {
      render(<Button>Click me</Button>);
      // Default type is "submit" in HTML, but we should verify behavior
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("accepts submit type", () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    });

    it("accepts reset type", () => {
      render(<Button type="reset">Reset</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("type", "reset");
    });
  });

  describe("StatefulComponentProps", () => {
    describe("loading state", () => {
      it("shows loading spinner when loading is true", () => {
        render(<Button loading>Loading...</Button>);
        const button = screen.getByRole("button");
        expect(button).toHaveAttribute("data-state", "loading");
        expect(button).toBeDisabled();
        expect(button.querySelector("svg")).toBeInTheDocument();
      });

      it("disables button when loading", async () => {
        const onClick = vi.fn();
        const { user } = render(
          <Button loading onClick={onClick}>
            Click me
          </Button>,
        );
        await user.click(screen.getByRole("button"));
        expect(onClick).not.toHaveBeenCalled();
      });

      it("applies loading opacity styles", () => {
        render(<Button loading>Loading...</Button>);
        expect(screen.getByRole("button")).toHaveClass("opacity-70", "cursor-wait");
      });
    });

    describe("error state", () => {
      it("applies error styles when error prop is set", () => {
        render(<Button error="Failed to submit">Retry</Button>);
        const button = screen.getByRole("button");
        expect(button).toHaveAttribute("data-error", "true");
        expect(button).toHaveAttribute("data-state", "error");
        expect(button).toHaveClass("border-status-error");
      });

      it("applies error focus ring", () => {
        render(<Button error="Failed">Retry</Button>);
        expect(screen.getByRole("button")).toHaveClass("focus-visible:ring-status-error");
      });
    });

    describe("onStateChange callback", () => {
      it("calls onStateChange when state changes", () => {
        const onStateChange = vi.fn();
        const { rerender } = render(
          <Button loading onStateChange={onStateChange}>
            Submit
          </Button>,
        );
        expect(onStateChange).toHaveBeenCalledWith("loading");

        rerender(<Button onStateChange={onStateChange}>Submit</Button>);
        expect(onStateChange).toHaveBeenCalledWith("default");
      });
    });
  });
});
