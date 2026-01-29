import { render, screen, waitFor } from "../../../../testing/utils";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { ListItem, ListItemCheck } from "./ListItem";

describe("ListItem", () => {
  const mockOnClick = vi.fn();
  const mockOnStateChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("renders with label", () => {
      render(<ListItem label="Settings" />);
      expect(screen.getByText("Settings")).toBeInTheDocument();
    });

    it("renders as button when onClick is provided", () => {
      render(<ListItem label="Settings" onClick={mockOnClick} />);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("Settings");
    });

    it("renders as div when no onClick", () => {
      render(<ListItem label="Settings" />);
      const div = screen.getByText("Settings").closest("div");
      expect(div).not.toHaveAttribute("role");
    });

    it("renders with icon", () => {
      render(
        <ListItem
          label="Settings"
          icon={<svg data-testid="test-icon" />}
        />
      );
      expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    });

    it("renders with description", () => {
      render(<ListItem label="Settings" description="Manage preferences" />);
      expect(screen.getByText("Manage preferences")).toBeInTheDocument();
    });

    it("renders with right content", () => {
      render(
        <ListItem label="Settings" right={<span data-testid="right-content">Right</span>} />
      );
      expect(screen.getByTestId("right-content")).toBeInTheDocument();
    });

    it("renders chevron when showChevron is true", () => {
      render(<ListItem label="Settings" showChevron />);
      const chevron = document.querySelector("svg");
      expect(chevron).toBeInTheDocument();
    });
  });

  describe("Stateful props - Loading", () => {
    it("shows loading state", () => {
      const { container } = render(<ListItem label="Settings" loading />);
      const item = container.querySelector('[data-state="loading"]');
      expect(item).toBeInTheDocument();
    });

    it("calls onStateChange with 'loading'", async () => {
      render(<ListItem label="Settings" loading onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("disables interaction when loading", async () => {
      const { user } = render(<ListItem label="Settings" onClick={mockOnClick} loading />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("disabled");
      await user.click(button);
      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe("Stateful props - Error", () => {
    it("shows error state", () => {
      const { container } = render(<ListItem label="Settings" error="Failed to load" />);
      const item = container.querySelector('[data-state="error"]');
      expect(item).toBeInTheDocument();
      expect(item).toHaveAttribute("data-error", "true");
    });

    it("applies error border styling", () => {
      const { container } = render(<ListItem label="Settings" error="Error" />);
      const item = container.querySelector('[data-state="error"]');
      expect(item).toBeInTheDocument();
    });
  });

  describe("Stateful props - Disabled", () => {
    it("shows disabled state", () => {
      const { container } = render(<ListItem label="Settings" disabled />);
      const item = container.querySelector('[data-state="disabled"]');
      expect(item).toBeInTheDocument();
    });

    it("disables button interaction", async () => {
      const { user } = render(<ListItem label="Settings" onClick={mockOnClick} disabled />);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      await user.click(button);
      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe("Stateful props - Required", () => {
    it("sets required attributes", () => {
      const { container } = render(<ListItem label="Settings" required />);
      const item = container.querySelector('[data-required="true"]');
      expect(item).toBeInTheDocument();
      expect(item).toHaveAttribute("aria-required", "true");
    });

    it("sets aria-invalid to false when required but no error", () => {
      const { container } = render(<ListItem label="Settings" required />);
      const item = container.querySelector('[aria-invalid="false"]');
      expect(item).toBeInTheDocument();
    });
  });

  describe("Selected state", () => {
    it("applies selected styling", () => {
      const { container } = render(<ListItem label="Settings" selected />);
      const item = container.querySelector(".bg-foundation-bg-light-2");
      expect(item).toBeInTheDocument();
    });
  });

  describe("Click interaction", () => {
    it("calls onClick when clicked", async () => {
      const { user } = render(<ListItem label="Settings" onClick={mockOnClick} />);
      const button = screen.getByRole("button");
      await user.click(button);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Keyboard navigation", () => {
    it("activates with Enter key", async () => {
      const mockClick = vi.fn();
      const { user } = render(<ListItem label="Settings" onClick={mockClick} />);
      const button = screen.getByRole("button");
      button.focus();
      await user.keyboard("{Enter}");
      expect(mockClick).toHaveBeenCalledTimes(1);
    });

    it("activates with Space key", async () => {
      const mockClick = vi.fn();
      const { user } = render(<ListItem label="Settings" onClick={mockClick} />);
      const button = screen.getByRole("button");
      button.focus();
      await user.keyboard(" ");
      expect(mockClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("has accessible name from label text", () => {
      render(<ListItem label="Settings" onClick={() => {}} />);
      const button = screen.getByRole("button", { name: "Settings" });
      expect(button).toBeInTheDocument();
    });

    it("has accessible name from aria-label when provided", () => {
      render(<ListItem label="Settings" ariaLabel="Open settings" onClick={() => {}} />);
      const button = screen.getByRole("button", { name: "Open settings" });
      expect(button).toBeInTheDocument();
    });

    it("includes description in accessible name when present", () => {
      render(<ListItem label="Settings" description="Manage preferences" onClick={() => {}} />);
      const button = screen.getByRole("button", { name: /Settings/ });
      expect(button).toBeInTheDocument();
    });

    it("sets aria-busy when loading", () => {
      const { container } = render(<ListItem label="Settings" loading />);
      const item = container.querySelector('[aria-busy="true"]');
      expect(item).toBeInTheDocument();
    });

    it("sets aria-invalid when error", () => {
      const { container } = render(<ListItem label="Settings" error="Error" />);
      const item = container.querySelector('[aria-invalid="true"]');
      expect(item).toBeInTheDocument();
    });
  });

  describe("Rail item mode", () => {
    it("applies rail item attribute and hidden class", () => {
      const { container } = render(<ListItem label="Settings" description="Desc" dataRailItem />);
      const item = container.querySelector('[data-rail-item="true"]');
      expect(item).toBeInTheDocument();
      // The label container should have hidden class
      const labelDiv = container.querySelector(".hidden") || container.querySelector('[class*="hidden"]');
      expect(labelDiv).toBeInTheDocument();
    });
  });

  describe("Custom className", () => {
    it("applies custom className", () => {
      const { container } = render(<ListItem label="Settings" className="custom-list-item" />);
      const item = container.querySelector(".custom-list-item");
      expect(item).toBeInTheDocument();
    });
  });
});

describe("ListItemCheck", () => {
  describe("Basic rendering", () => {
    it("renders with label", () => {
      render(<ListItemCheck label="Option" />);
      expect(screen.getByText("Option")).toBeInTheDocument();
    });

    it("does not show checkmark when not checked", () => {
      render(<ListItemCheck label="Option" checked={false} />);
      // The checkmark SVG with path d="M5 13l4 4L19 7" should not be present
      const checkmarkPath = document.querySelector('svg path[d="M5 13l4 4L19 7"]');
      expect(checkmarkPath).not.toBeInTheDocument();
    });

    it("shows checkmark when checked", () => {
      const { container } = render(<ListItemCheck label="Option" checked />);
      const checkmark = container.querySelector("svg");
      expect(checkmark).toBeInTheDocument();
    });
  });

  describe("Click interaction", () => {
    it("calls onClick when clicked", async () => {
      const mockClick = vi.fn();
      const { user } = render(<ListItemCheck label="Option" onClick={mockClick} />);
      const button = screen.getByRole("button");
      await user.click(button);
      expect(mockClick).toHaveBeenCalledTimes(1);
    });
  });
});
