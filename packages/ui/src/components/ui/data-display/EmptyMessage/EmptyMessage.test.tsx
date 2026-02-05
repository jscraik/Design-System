import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "../../../../testing/utils";
import { EmptyMessage } from "./EmptyMessage";

describe("EmptyMessage", () => {
  const mockOnStateChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("renders with title", () => {
      render(<EmptyMessage title="No results found" />);
      expect(screen.getByText("No results found")).toBeInTheDocument();
    });

    it("renders with description", () => {
      render(<EmptyMessage title="No results" description="Try adjusting your search filters" />);
      expect(screen.getByText("Try adjusting your search filters")).toBeInTheDocument();
    });

    it("renders with action", () => {
      render(<EmptyMessage title="No results" action={<button>Clear filters</button>} />);
      expect(screen.getByRole("button", { name: "Clear filters" })).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      render(<EmptyMessage title="No results" />);
      const container = screen.getByText("No results").closest('[data-slot="empty-message"]');
      expect(container).toBeInTheDocument();
    });
  });

  describe("Icons", () => {
    it("renders default icon", () => {
      render(<EmptyMessage title="No results" />);
      const icon = document.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("renders search variant icon", () => {
      render(<EmptyMessage title="No results" variant="search" />);
      const icon = document.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("renders error variant icon", () => {
      render(<EmptyMessage title="Error occurred" variant="error" />);
      const icon = document.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("renders inbox variant icon", () => {
      render(<EmptyMessage title="No items" variant="inbox" />);
      const icon = document.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("renders custom icon element", () => {
      const customIcon = <div data-testid="custom-icon">Custom</div>;
      render(<EmptyMessage title="No results" icon={customIcon} />);
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });

    it("renders custom icon component", () => {
      const CustomIcon = () => <div data-testid="icon-component">Icon</div>;
      render(<EmptyMessage title="No results" icon={CustomIcon} />);
      expect(screen.getByTestId("icon-component")).toBeInTheDocument();
    });
  });

  describe("Stateful props - Loading", () => {
    it("calls onStateChange with 'loading'", async () => {
      render(<EmptyMessage title="Loading..." loading onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("shows spinner instead of icon when loading", () => {
      render(<EmptyMessage title="Loading..." loading />);
      const spinner = document.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });

    it("displays 'Loading...' as title when loading", () => {
      render(<EmptyMessage title="No results" loading />);
      expect(screen.getByText("Loading...")).toBeInTheDocument();
      expect(screen.queryByText("No results")).not.toBeInTheDocument();
    });

    it("hides description when loading", () => {
      render(<EmptyMessage title="No results" description="Try again later" loading />);
      expect(screen.queryByText("Try again later")).not.toBeInTheDocument();
    });

    it("hides action when loading", () => {
      render(<EmptyMessage title="No results" action={<button>Retry</button>} loading />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  describe("Stateful props - Error", () => {
    it("calls onStateChange with 'error'", async () => {
      render(
        <EmptyMessage title="Failed" error="Network error" onStateChange={mockOnStateChange} />,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });

    it("displays 'Error' as title when error", () => {
      render(<EmptyMessage title="No results" error="Failed to load" />);
      expect(screen.getByText("Error")).toBeInTheDocument();
      expect(screen.queryByText("No results")).not.toBeInTheDocument();
    });

    it("displays error message", () => {
      render(<EmptyMessage title="No results" error="Failed to load" />);
      expect(screen.getByText("Failed to load")).toBeInTheDocument();
    });

    it("hides description when error", () => {
      render(<EmptyMessage title="No results" description="Try again later" error="Failed" />);
      expect(screen.queryByText("Try again later")).not.toBeInTheDocument();
    });

    it("uses error variant icon when error and no custom icon", () => {
      render(<EmptyMessage title="No results" error="Failed" />);
      // Should have warning icon from error variant
      const icon = document.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("prioritizes custom icon over error variant icon", () => {
      const customIcon = <div data-testid="custom-icon">Custom</div>;
      render(<EmptyMessage title="No results" error="Failed" icon={customIcon} />);
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });

    it("hides action when error", () => {
      render(<EmptyMessage title="No results" action={<button>Retry</button>} error="Failed" />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  describe("Stateful props - Disabled", () => {
    it("calls onStateChange with 'disabled'", async () => {
      render(<EmptyMessage title="No results" disabled onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("disabled");
      });
    });

    it("has reduced opacity when disabled", () => {
      render(<EmptyMessage title="No results" disabled />);
      const container = screen.getByText("No results").closest('[data-slot="empty-message"]');
      expect(container).toHaveClass("opacity-50");
    });

    it("hides action when disabled", () => {
      render(<EmptyMessage title="No results" action={<button>Action</button>} disabled />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  describe("Stateful props - Required", () => {
    it("calls onStateChange with 'default' when required", async () => {
      render(<EmptyMessage title="No results" required onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("default");
      });
    });
  });

  describe("State priority", () => {
    it("prioritizes loading over error and disabled", async () => {
      render(
        <EmptyMessage
          title="No results"
          loading
          error="Error"
          disabled
          onStateChange={mockOnStateChange}
        />,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("prioritizes error over disabled when not loading", async () => {
      render(
        <EmptyMessage
          title="No results"
          error="Error"
          disabled
          onStateChange={mockOnStateChange}
        />,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });
  });

  describe("Accessibility", () => {
    it("has aria-disabled when disabled", () => {
      render(<EmptyMessage title="No results" disabled />);
      const container = screen.getByText("No results").closest('[data-slot="empty-message"]');
      expect(container).toHaveAttribute("aria-disabled", "true");
    });

    it("has aria-invalid when error", () => {
      render(<EmptyMessage title="No results" error="Failed" />);
      const container = screen.getByText("Error").closest('[data-slot="empty-message"]');
      expect(container).toHaveAttribute("aria-invalid", "true");
    });

    it("has aria-busy when loading", () => {
      render(<EmptyMessage title="No results" loading />);
      const container = screen.getByText("Loading...").closest('[data-slot="empty-message"]');
      expect(container).toHaveAttribute("aria-busy", "true");
    });

    it("has aria-required when required", () => {
      render(<EmptyMessage title="No results" required />);
      const container = screen.getByText("No results").closest('[data-slot="empty-message"]');
      expect(container).toHaveAttribute("aria-required", "true");
    });

    it("has data-state attribute reflecting current state", () => {
      render(<EmptyMessage title="No results" loading />);
      const container = screen.getByText("Loading...").closest('[data-slot="empty-message"]');
      expect(container).toHaveAttribute("data-state", "loading");
    });

    it("has data-error attribute when error", () => {
      render(<EmptyMessage title="No results" error="Failed" />);
      const container = screen.getByText("Error").closest('[data-slot="empty-message"]');
      expect(container).toHaveAttribute("data-error", "true");
    });

    it("has data-required attribute when required", () => {
      render(<EmptyMessage title="No results" required />);
      const container = screen.getByText("No results").closest('[data-slot="empty-message"]');
      expect(container).toHaveAttribute("data-required", "true");
    });
  });

  describe("Variants", () => {
    it("renders default variant", () => {
      render(<EmptyMessage title="No results" variant="default" />);
      expect(screen.getByText("No results")).toBeInTheDocument();
    });

    it("renders search variant", () => {
      render(<EmptyMessage title="No results" variant="search" />);
      expect(screen.getByText("No results")).toBeInTheDocument();
    });

    it("renders error variant", () => {
      render(<EmptyMessage title="No results" variant="error" />);
      expect(screen.getByText("No results")).toBeInTheDocument();
    });

    it("renders inbox variant", () => {
      render(<EmptyMessage title="No items" variant="inbox" />);
      expect(screen.getByText("No items")).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("renders with very long title", () => {
      const longTitle = "This is a very long title that should still render correctly";
      render(<EmptyMessage title={longTitle} />);
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it("renders with empty description", () => {
      render(<EmptyMessage title="No results" description="" />);
      expect(screen.getByText("No results")).toBeInTheDocument();
    });

    it("renders without action", () => {
      render(<EmptyMessage title="No results" />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("renders with multiple actions", () => {
      render(
        <EmptyMessage
          title="No results"
          action={
            <>
              <button>Action 1</button>
              <button>Action 2</button>
            </>
          }
        />,
      );
      expect(screen.getAllByRole("button").length).toBe(2);
    });
  });
});
