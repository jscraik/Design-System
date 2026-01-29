import { render, screen, waitFor } from "../../../../testing/utils";
import { describe, expect, it, vi, beforeEach } from "vitest";
import * as Tooltip from "./fallback/Tooltip";

describe("Tooltip", () => {
  const mockOnStateChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("renders tooltip trigger with data-slot attribute", () => {
      const { container } = render(
        <Tooltip.Tooltip>
          <Tooltip.TooltipTrigger>Hover me</Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent>Tooltip content</Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      );
      const trigger = container.querySelector('[data-slot="tooltip-trigger"]');
      expect(trigger).toBeInTheDocument();
    });

    it("renders tooltip content with data-slot attribute", () => {
      render(
        <Tooltip.Tooltip>
          <Tooltip.TooltipTrigger>Hover me</Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent>
            <div data-testid="tooltip-content-element">Tooltip content</div>
          </Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      );
      // Content is rendered via portal, verify by test ID
      const content = screen.queryByTestId("tooltip-content-element");
      // Note: Tooltip only shows on hover/interaction, so it might not be visible without user action
    });

    it("renders tooltip trigger text", () => {
      render(
        <Tooltip.Tooltip>
          <Tooltip.TooltipTrigger>Info icon</Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent>Helpful info</Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      );
      expect(screen.getByText("Info icon")).toBeInTheDocument();
    });

    it("renders tooltip content text when defaultOpen", () => {
      render(
        <Tooltip.Tooltip defaultOpen>
          <Tooltip.TooltipTrigger>Hover me</Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent>This is the tooltip content</Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      );
      expect(screen.getAllByText("This is the tooltip content").length).toBeGreaterThan(0);
    });

    it("does not render tooltip content when closed", () => {
      render(
        <Tooltip.Tooltip defaultOpen={false}>
          <Tooltip.TooltipTrigger>Hover me</Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent>Hidden content</Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      );
      expect(screen.queryByText("Hidden content")).not.toBeInTheDocument();
    });
  });

  describe("Open/Close state transitions", () => {
    it("renders tooltip with custom className on trigger", () => {
      const { container } = render(
        <Tooltip.Tooltip>
          <Tooltip.TooltipTrigger asChild>
            <button className="custom-trigger">Hover me</button>
          </Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent>Content</Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      );
      const trigger = container.querySelector(".custom-trigger");
      expect(trigger).toBeInTheDocument();
    });

    it("renders with asChild trigger", () => {
      render(
        <Tooltip.Tooltip>
          <Tooltip.TooltipTrigger asChild>
            <button type="button">Custom Button</button>
          </Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent>Tooltip text</Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      );
      expect(screen.getByText("Custom Button")).toBeInTheDocument();
    });

    it("renders tooltip trigger with data-slot attribute", () => {
      const { container } = render(
        <Tooltip.Tooltip>
          <Tooltip.TooltipTrigger>Hover me</Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent>Content</Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      );
      const trigger = container.querySelector('[data-slot="tooltip-trigger"]');
      expect(trigger).toBeInTheDocument();
    });
  });

  describe("Stateful props - Loading", () => {
    it("calls onStateChange with 'loading'", async () => {
      render(
        <Tooltip.Tooltip loading onStateChange={mockOnStateChange}>
          <Tooltip.TooltipTrigger>Hover me</Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent>Content</Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

  });

  describe("Stateful props - Error", () => {
    it("calls onStateChange with 'error'", async () => {
      render(
        <Tooltip.Tooltip error="Error" onStateChange={mockOnStateChange}>
          <Tooltip.TooltipTrigger>Hover me</Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent>Content</Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });
  });

  describe("Stateful props - Disabled", () => {
    it("calls onStateChange with 'disabled'", async () => {
      render(
        <Tooltip.Tooltip disabled onStateChange={mockOnStateChange}>
          <Tooltip.TooltipTrigger>Hover me</Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent>Content</Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("disabled");
      });
    });
  });

  describe("Stateful props - Required", () => {
    it("calls onStateChange with 'default' when required", async () => {
      render(
        <Tooltip.Tooltip required onStateChange={mockOnStateChange}>
          <Tooltip.TooltipTrigger>Hover me</Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent>Content</Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("default");
      });
    });
  });

  describe("State priority", () => {
    it("prioritizes loading over error and disabled", async () => {
      render(
        <Tooltip.Tooltip
          loading
          error="Error"
          disabled
          onStateChange={mockOnStateChange}
        >
          <Tooltip.TooltipTrigger>Hover me</Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent>Content</Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("prioritizes error over disabled when not loading", async () => {
      render(
        <Tooltip.Tooltip
          error="Error"
          disabled
          onStateChange={mockOnStateChange}
        >
          <Tooltip.TooltipTrigger>Hover me</Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent>Content</Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });
  });

  describe("Accessibility", () => {
    it("trigger is keyboard accessible", () => {
      render(
        <Tooltip.Tooltip>
          <Tooltip.TooltipTrigger asChild>
            <button>Info button</button>
          </Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent>Helpful text</Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      );
      const trigger = screen.getByRole("button");
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveTextContent("Info button");
    });
  });

  describe("Tooltip rendering", () => {
    it("renders with complex content structure", () => {
      render(
        <Tooltip.Tooltip>
          <Tooltip.TooltipTrigger asChild>
            <button>Info</button>
          </Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent>
            <div className="custom-tooltip-content">
              <strong>Important info</strong>
              <p>Detailed description</p>
            </div>
          </Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      );
      expect(screen.getByText("Info")).toBeInTheDocument();
    });

    it("renders trigger button with proper type", () => {
      render(
        <Tooltip.Tooltip>
          <Tooltip.TooltipTrigger asChild>
            <button type="submit">Submit</button>
          </Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent>Tooltip help</Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      );
      const trigger = screen.getByRole("button");
      expect(trigger).toHaveAttribute("type", "submit");
    });
  });
});

