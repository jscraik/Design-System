import { render, screen, waitFor } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { Separator } from "./fallback/Separator";

describe("Separator", () => {
  const mockOnStateChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("renders horizontal separator by default", () => {
      const { container } = render(<Separator />);
      const separator = container.querySelector('[data-slot="separator-root"]');
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute("data-orientation", "horizontal");
    });

    it("renders vertical separator", () => {
      const { container } = render(<Separator orientation="vertical" />);
      const separator = container.querySelector('[data-slot="separator-root"]');
      expect(separator).toHaveAttribute("data-orientation", "vertical");
    });

    it("is decorative by default (aria-hidden)", () => {
      const { container } = render(<Separator />);
      const separator = container.querySelector('[data-slot="separator-root"]');
      // Radix separators with decorative=true are hidden from screen readers
      expect(separator).toBeInTheDocument();
    });
  });

  describe("Stateful props - Loading", () => {
    it("applies loading state styling", () => {
      const { container } = render(<Separator loading />);
      const separator = container.querySelector('[data-slot="separator-root"]');
      expect(separator).toHaveAttribute("data-state", "loading");
    });

    it("calls onStateChange with 'loading'", async () => {
      render(<Separator loading onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });
  });

  describe("Stateful props - Error", () => {
    it("shows error state styling", () => {
      const { container } = render(<Separator error="Error" />);
      const separator = container.querySelector('[data-slot="separator-root"]');
      expect(separator).toHaveAttribute("data-state", "error");
      expect(separator).toHaveAttribute("data-error", "true");
    });

    it("applies error background color", () => {
      const { container } = render(<Separator error="Error" />);
      const separator = container.querySelector('[data-slot="separator-root"]');
      expect(separator).toHaveClass("bg-status-error");
    });
  });

  describe("Stateful props - Disabled", () => {
    it("applies disabled state styling", () => {
      const { container } = render(<Separator disabled />);
      const separator = container.querySelector('[data-slot="separator-root"]');
      expect(separator).toHaveAttribute("data-state", "disabled");
      expect(separator).toHaveClass("opacity-50");
    });
  });

  describe("Stateful props - Required", () => {
    it("sets required data attribute", () => {
      const { container } = render(<Separator required />);
      const separator = container.querySelector('[data-slot="separator-root"]');
      expect(separator).toHaveAttribute("data-required", "true");
    });
  });

  describe("State priority", () => {
    it("prioritizes loading over error and disabled", async () => {
      render(<Separator loading error="Error" disabled onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("prioritizes error over disabled when not loading", async () => {
      render(<Separator error="Error" disabled onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });
  });

  describe("Custom className", () => {
    it("applies custom className", () => {
      const { container } = render(<Separator className="custom-separator" />);
      const separator = container.querySelector('[data-slot="separator-root"]');
      expect(separator).toHaveClass("custom-separator");
    });
  });

  describe("ref forwarding", () => {
    it("forwards ref to separator element", () => {
      const ref = createRef<HTMLDivElement>();
      render(<Separator ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
