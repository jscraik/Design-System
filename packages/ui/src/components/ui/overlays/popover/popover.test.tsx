import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "../../../../testing/utils";
import * as Popover from "./fallback/Popover";

describe("Popover", () => {
  const mockOnStateChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("renders popover trigger with data-slot attribute", () => {
      const { container } = render(
        <Popover.Popover open={true}>
          <Popover.PopoverTrigger>Trigger</Popover.PopoverTrigger>
          <Popover.PopoverContent>Content</Popover.PopoverContent>
        </Popover.Popover>,
      );
      const trigger = container.querySelector('[data-slot="popover-trigger"]');
      expect(trigger).toBeInTheDocument();
    });

    it("renders popover content when open", () => {
      render(
        <Popover.Popover open={true}>
          <Popover.PopoverTrigger>Trigger</Popover.PopoverTrigger>
          <Popover.PopoverContent>Popover Content</Popover.PopoverContent>
        </Popover.Popover>,
      );
      expect(screen.getByText("Popover Content")).toBeInTheDocument();
    });

    it("does not render popover content when closed", () => {
      render(
        <Popover.Popover open={false}>
          <Popover.PopoverTrigger>Trigger</Popover.PopoverTrigger>
          <Popover.PopoverContent>Popover Content</Popover.PopoverContent>
        </Popover.Popover>,
      );
      expect(screen.queryByText("Popover Content")).not.toBeInTheDocument();
    });

    it("renders trigger button text", () => {
      render(
        <Popover.Popover>
          <Popover.PopoverTrigger>Open Menu</Popover.PopoverTrigger>
          <Popover.PopoverContent>Content</Popover.PopoverContent>
        </Popover.Popover>,
      );
      expect(screen.getByText("Open Menu")).toBeInTheDocument();
    });
  });

  describe("Open/Close state transitions", () => {
    it("opens popover when open prop is true", () => {
      const { rerender } = render(
        <Popover.Popover open={false}>
          <Popover.PopoverTrigger>Trigger</Popover.PopoverTrigger>
          <Popover.PopoverContent>Content</Popover.PopoverContent>
        </Popover.Popover>,
      );
      expect(screen.queryByText("Content")).not.toBeInTheDocument();

      rerender(
        <Popover.Popover open={true}>
          <Popover.PopoverTrigger>Trigger</Popover.PopoverTrigger>
          <Popover.PopoverContent>Content</Popover.PopoverContent>
        </Popover.Popover>,
      );
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("closes popover when open prop changes to false", () => {
      const { rerender } = render(
        <Popover.Popover open={true}>
          <Popover.PopoverTrigger>Trigger</Popover.PopoverTrigger>
          <Popover.PopoverContent>Content</Popover.PopoverContent>
        </Popover.Popover>,
      );
      expect(screen.getByText("Content")).toBeInTheDocument();

      rerender(
        <Popover.Popover open={false}>
          <Popover.PopoverTrigger>Trigger</Popover.PopoverTrigger>
          <Popover.PopoverContent>Content</Popover.PopoverContent>
        </Popover.Popover>,
      );
      expect(screen.queryByText("Content")).not.toBeInTheDocument();
    });

    it("toggles open state on trigger click", async () => {
      const { user } = render(
        <Popover.Popover>
          <Popover.PopoverTrigger>Toggle</Popover.PopoverTrigger>
          <Popover.PopoverContent>Content</Popover.PopoverContent>
        </Popover.Popover>,
      );
      const trigger = screen.getByText("Toggle");

      // Initial state - closed
      expect(screen.queryByText("Content")).not.toBeInTheDocument();

      // Click to open
      await user.click(trigger);
      await waitFor(() => {
        expect(screen.getByText("Content")).toBeInTheDocument();
      });
    });
  });

  describe("Stateful props - Loading", () => {
    it("calls onStateChange with 'loading'", async () => {
      render(
        <Popover.Popover loading onStateChange={mockOnStateChange}>
          <Popover.PopoverTrigger>Trigger</Popover.PopoverTrigger>
          <Popover.PopoverContent>Content</Popover.PopoverContent>
        </Popover.Popover>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });
  });

  describe("Stateful props - Error", () => {
    it("calls onStateChange with 'error'", async () => {
      render(
        <Popover.Popover error="Error" onStateChange={mockOnStateChange}>
          <Popover.PopoverTrigger>Trigger</Popover.PopoverTrigger>
          <Popover.PopoverContent>Content</Popover.PopoverContent>
        </Popover.Popover>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });
  });

  describe("Stateful props - Disabled", () => {
    it("calls onStateChange with 'disabled'", async () => {
      render(
        <Popover.Popover disabled onStateChange={mockOnStateChange}>
          <Popover.PopoverTrigger>Trigger</Popover.PopoverTrigger>
          <Popover.PopoverContent>Content</Popover.PopoverContent>
        </Popover.Popover>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("disabled");
      });
    });
  });

  describe("Stateful props - Required", () => {
    it("calls onStateChange with 'required'", async () => {
      render(
        <Popover.Popover required onStateChange={mockOnStateChange}>
          <Popover.PopoverTrigger>Trigger</Popover.PopoverTrigger>
          <Popover.PopoverContent>Content</Popover.PopoverContent>
        </Popover.Popover>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("default");
      });
    });
  });

  describe("State priority", () => {
    it("prioritizes loading over error and disabled", async () => {
      render(
        <Popover.Popover loading error="Error" disabled onStateChange={mockOnStateChange}>
          <Popover.PopoverTrigger>Trigger</Popover.PopoverTrigger>
          <Popover.PopoverContent>Content</Popover.PopoverContent>
        </Popover.Popover>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("prioritizes error over disabled when not loading", async () => {
      render(
        <Popover.Popover error="Error" disabled onStateChange={mockOnStateChange}>
          <Popover.PopoverTrigger>Trigger</Popover.PopoverTrigger>
          <Popover.PopoverContent>Content</Popover.PopoverContent>
        </Popover.Popover>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });
  });

  describe("Accessibility", () => {
    it("trigger is keyboard accessible", () => {
      render(
        <Popover.Popover>
          <Popover.PopoverTrigger>Open Popover</Popover.PopoverTrigger>
          <Popover.PopoverContent>Content</Popover.PopoverContent>
        </Popover.Popover>,
      );
      const trigger = screen.getByText("Open Popover");
      expect(trigger).toHaveAttribute("type", "button");
    });

    it("content is rendered in portal", () => {
      render(
        <Popover.Popover open={true}>
          <Popover.PopoverTrigger>Trigger</Popover.PopoverTrigger>
          <Popover.PopoverContent>
            <div data-testid="popover-content-test">Content</div>
          </Popover.PopoverContent>
        </Popover.Popover>,
      );
      const content = screen.getByTestId("popover-content-test");
      expect(content).toBeInTheDocument();
    });
  });

  describe("Portal rendering", () => {
    it("renders content in portal", () => {
      render(
        <Popover.Popover open={true}>
          <Popover.PopoverTrigger>Trigger</Popover.PopoverTrigger>
          <Popover.PopoverContent>
            <div data-testid="popover-portal-content">Portal Content</div>
          </Popover.PopoverContent>
        </Popover.Popover>,
      );
      // Radix renders in a portal, which may be outside the container
      const content = screen.getByText("Portal Content");
      expect(content).toBeInTheDocument();
    });
  });

  describe("Custom styling", () => {
    it("applies custom className to trigger", () => {
      const { container } = render(
        <Popover.Popover open={true}>
          <Popover.PopoverTrigger asChild>
            <button className="custom-trigger">Trigger</button>
          </Popover.PopoverTrigger>
          <Popover.PopoverContent>Content</Popover.PopoverContent>
        </Popover.Popover>,
      );
      const trigger = container.querySelector(".custom-trigger");
      expect(trigger).toBeInTheDocument();
    });

    it("renders with custom content", () => {
      render(
        <Popover.Popover open={true}>
          <Popover.PopoverTrigger>Trigger</Popover.PopoverTrigger>
          <Popover.PopoverContent>
            <div className="custom-content">
              <h2>Custom Title</h2>
              <p>Custom description</p>
            </div>
          </Popover.PopoverContent>
        </Popover.Popover>,
      );
      expect(screen.getByText("Custom Title")).toBeInTheDocument();
      expect(screen.getByText("Custom description")).toBeInTheDocument();
    });
  });
});
