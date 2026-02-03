import { render, screen, waitFor } from "../../../../testing/utils";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { Indicator, InlineIndicator } from "./Indicator";

describe("Indicator", () => {
  const mockOnStateChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("renders spinner", () => {
      render(<Indicator />);
      const spinner = document.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });

    it("has role status", () => {
      render(<Indicator />);
      const container = document.querySelector('[role="status"]');
      expect(container).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      render(<Indicator />);
      const container = document.querySelector('[data-slot="indicator"]');
      expect(container).toBeInTheDocument();
    });

    it("has default aria-label", () => {
      render(<Indicator />);
      const container = document.querySelector('[role="status"]');
      expect(container).toHaveAttribute("aria-label", "Loading");
    });
  });

  describe("Label", () => {
    it("displays label when provided", () => {
      render(<Indicator label="Loading data..." />);
      expect(screen.getByText("Loading data...")).toBeInTheDocument();
    });

    it("uses label as aria-label", () => {
      render(<Indicator label="Loading data..." />);
      const container = document.querySelector('[role="status"]');
      expect(container).toHaveAttribute("aria-label", "Loading data...");
    });

    it("does not display label by default", () => {
      render(<Indicator />);
      expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("renders default variant", () => {
      render(<Indicator />);
      const container = document.querySelector('[role="status"]');
      expect(container).toBeInTheDocument();
    });

    it("renders primary variant", () => {
      render(<Indicator variant="primary" />);
      const container = document.querySelector('[role="status"]');
      expect(container).toBeInTheDocument();
    });

    it("renders success variant", () => {
      render(<Indicator variant="success" />);
      const container = document.querySelector('[role="status"]');
      expect(container).toBeInTheDocument();
    });

    it("renders warning variant", () => {
      render(<Indicator variant="warning" />);
      const container = document.querySelector('[role="status"]');
      expect(container).toBeInTheDocument();
    });

    it("renders error variant", () => {
      render(<Indicator variant="error" />);
      const container = document.querySelector('[role="status"]');
      expect(container).toBeInTheDocument();
    });
  });

  describe("Sizes", () => {
    it("renders sm size", () => {
      render(<Indicator size="sm" />);
      const container = document.querySelector('[role="status"]');
      expect(container).toBeInTheDocument();
    });

    it("renders md size (default)", () => {
      render(<Indicator size="md" />);
      const container = document.querySelector('[role="status"]');
      expect(container).toBeInTheDocument();
    });

    it("renders lg size", () => {
      render(<Indicator size="lg" />);
      const container = document.querySelector('[role="status"]');
      expect(container).toBeInTheDocument();
    });

    it("renders xl size", () => {
      render(<Indicator size="xl" />);
      const container = document.querySelector('[role="status"]');
      expect(container).toBeInTheDocument();
    });
  });

  describe("Stateful props - Loading", () => {
    it("calls onStateChange with 'loading'", async () => {
      render(<Indicator loading onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });
  });

  describe("Stateful props - Error", () => {
    it("calls onStateChange with 'error'", async () => {
      render(<Indicator error="Failed to load" onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });

    it("displays error message instead of label", () => {
      render(<Indicator label="Loading..." error="Failed to load" />);
      expect(screen.getByText("Failed to load")).toBeInTheDocument();
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    it("uses error as aria-label", () => {
      render(<Indicator error="Failed to load" />);
      const container = document.querySelector('[role="status"]');
      expect(container).toHaveAttribute("aria-label", "Failed to load");
    });

    it("uses error variant when error is provided", () => {
      render(<Indicator error="Failed" variant="primary" />);
      const container = document.querySelector('[role="status"]');
      expect(container).toBeInTheDocument();
      // Error takes priority over variant
    });

    it("applies error text color", () => {
      render(<Indicator error="Failed" />);
      const errorText = screen.getByText("Failed");
      expect(errorText).toHaveClass("text-status-error");
    });
  });

  describe("Stateful props - Disabled", () => {
    it("calls onStateChange with 'disabled'", async () => {
      render(<Indicator disabled onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("disabled");
      });
    });

    it("has reduced opacity when disabled", () => {
      render(<Indicator disabled />);
      const container = document.querySelector('[role="status"]');
      expect(container).toHaveClass("opacity-50");
    });

    it("spinner has pulse animation when disabled", () => {
      render(<Indicator disabled />);
      const container = document.querySelector('[role="status"]');
      // Find the inner spinner element
      const spinner = container?.querySelector("span > span");
      expect(spinner).toHaveClass("animate-pulse");
    });
  });

  describe("Stateful props - Required", () => {
    it("calls onStateChange with 'default' when required", async () => {
      render(<Indicator required onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("default");
      });
    });
  });

  describe("State priority", () => {
    it("prioritizes loading over error and disabled", async () => {
      render(<Indicator loading error="Error" disabled onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("prioritizes error over disabled when not loading", async () => {
      render(<Indicator error="Error" disabled onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });
  });

  describe("Accessibility", () => {
    it("has aria-disabled when disabled", () => {
      render(<Indicator disabled />);
      const container = document.querySelector('[role="status"]');
      expect(container).toHaveAttribute("aria-disabled", "true");
    });

    it("has aria-invalid when error", () => {
      render(<Indicator error="Failed" />);
      const container = document.querySelector('[role="status"]');
      expect(container).toHaveAttribute("aria-invalid", "true");
    });

    it("has aria-busy when loading", () => {
      render(<Indicator loading />);
      const container = document.querySelector('[role="status"]');
      expect(container).toHaveAttribute("aria-busy", "true");
    });

    it("has aria-required when required", () => {
      render(<Indicator required />);
      const container = document.querySelector('[role="status"]');
      expect(container).toHaveAttribute("aria-required", "true");
    });

    it("has data-state attribute reflecting current state", () => {
      render(<Indicator loading />);
      const container = document.querySelector('[role="status"]');
      expect(container).toHaveAttribute("data-state", "loading");
    });

    it("has data-error attribute when error", () => {
      render(<Indicator error="Failed" />);
      const container = document.querySelector('[role="status"]');
      expect(container).toHaveAttribute("data-error", "true");
    });

    it("has data-required attribute when required", () => {
      render(<Indicator required />);
      const container = document.querySelector('[role="status"]');
      expect(container).toHaveAttribute("data-required", "true");
    });
  });
});

describe("InlineIndicator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("renders inline spinner", () => {
      render(<InlineIndicator />);
      const spinner = document.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });

    it("has role status", () => {
      render(<InlineIndicator />);
      const container = document.querySelector('[role="status"]');
      expect(container).toBeInTheDocument();
    });

    it("is span element", () => {
      render(<InlineIndicator />);
      const container = document.querySelector('[role="status"]');
      expect(container?.tagName).toBe("SPAN");
    });

    it("has data-slot attribute", () => {
      render(<InlineIndicator />);
      const container = document.querySelector('[data-slot="inline-indicator"]');
      expect(container).toBeInTheDocument();
    });

    it("has default aria-label", () => {
      render(<InlineIndicator />);
      const container = document.querySelector('[role="status"]');
      expect(container).toHaveAttribute("aria-label", "Loading");
    });
  });

  describe("Sizes", () => {
    it("renders sm size", () => {
      render(<InlineIndicator size="sm" />);
      const container = document.querySelector('[role="status"]');
      expect(container).toBeInTheDocument();
    });

    it("renders md size (default)", () => {
      render(<InlineIndicator size="md" />);
      const container = document.querySelector('[role="status"]');
      expect(container).toBeInTheDocument();
    });

    it("renders lg size", () => {
      render(<InlineIndicator size="lg" />);
      const container = document.querySelector('[role="status"]');
      expect(container).toBeInTheDocument();
    });

    it("renders xl size", () => {
      render(<InlineIndicator size="xl" />);
      const container = document.querySelector('[role="status"]');
      expect(container).toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("renders default variant", () => {
      render(<InlineIndicator />);
      const container = document.querySelector('[role="status"]');
      expect(container).toBeInTheDocument();
    });

    it("renders primary variant", () => {
      render(<InlineIndicator variant="primary" />);
      const container = document.querySelector('[role="status"]');
      expect(container).toBeInTheDocument();
    });

    it("renders error variant when error provided", () => {
      render(<InlineIndicator error="Failed" />);
      const container = document.querySelector('[role="status"]');
      expect(container).toBeInTheDocument();
    });
  });

  describe("Stateful props", () => {
    it("calls onStateChange with 'loading'", async () => {
      const mockOnStateChange = vi.fn();
      render(<InlineIndicator loading onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("calls onStateChange with 'error' when error", async () => {
      const mockOnStateChange = vi.fn();
      render(<InlineIndicator error="Failed" onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });

    it("has reduced opacity when disabled", () => {
      render(<InlineIndicator disabled />);
      const container = document.querySelector('[role="status"]');
      expect(container).toHaveClass("opacity-50");
    });

    it("has aria attributes for all states", () => {
      render(<InlineIndicator loading error="Failed" disabled required />);
      const container = document.querySelector('[role="status"]');
      expect(container).toHaveAttribute("aria-busy", "true");
      expect(container).toHaveAttribute("aria-invalid", "true");
      expect(container).toHaveAttribute("aria-disabled", "true");
      expect(container).toHaveAttribute("aria-required", "true");
    });
  });

  describe("Accessibility", () => {
    it("uses error as aria-label when error provided", () => {
      render(<InlineIndicator error="Failed to load" />);
      const container = document.querySelector('[role="status"]');
      expect(container).toHaveAttribute("aria-label", "Failed to load");
    });

    it("has data-state attribute", () => {
      render(<InlineIndicator loading />);
      const container = document.querySelector('[role="status"]');
      expect(container).toHaveAttribute("data-state", "loading");
    });

    it("has data-error attribute when error", () => {
      render(<InlineIndicator error="Failed" />);
      const container = document.querySelector('[role="status"]');
      expect(container).toHaveAttribute("data-error", "true");
    });

    it("has data-required attribute when required", () => {
      render(<InlineIndicator required />);
      const container = document.querySelector('[role="status"]');
      expect(container).toHaveAttribute("data-required", "true");
    });
  });
});
