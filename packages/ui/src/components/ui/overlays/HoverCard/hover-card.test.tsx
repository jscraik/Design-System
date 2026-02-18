import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "../../../../testing/utils";
import * as HoverCard from "./fallback/HoverCard";

describe("HoverCard", () => {
  const mockOnStateChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("renders hover card trigger with data-slot attribute", () => {
      const { container } = render(
        <HoverCard.HoverCard open={true}>
          <HoverCard.HoverCardTrigger>Hover me</HoverCard.HoverCardTrigger>
          <HoverCard.HoverCardContent>Card content</HoverCard.HoverCardContent>
        </HoverCard.HoverCard>,
      );
      const trigger = container.querySelector('[data-slot="hover-card-trigger"]');
      expect(trigger).toBeInTheDocument();
    });

    it("renders hover card content when open", () => {
      render(
        <HoverCard.HoverCard open={true}>
          <HoverCard.HoverCardTrigger>Hover me</HoverCard.HoverCardTrigger>
          <HoverCard.HoverCardContent>Hover Card Content</HoverCard.HoverCardContent>
        </HoverCard.HoverCard>,
      );
      expect(screen.getByText("Hover Card Content")).toBeInTheDocument();
    });

    it("does not render hover card content when closed", () => {
      render(
        <HoverCard.HoverCard open={false}>
          <HoverCard.HoverCardTrigger>Hover me</HoverCard.HoverCardTrigger>
          <HoverCard.HoverCardContent>Hidden Content</HoverCard.HoverCardContent>
        </HoverCard.HoverCard>,
      );
      expect(screen.queryByText("Hidden Content")).not.toBeInTheDocument();
    });

    it("renders trigger button text", () => {
      render(
        <HoverCard.HoverCard>
          <HoverCard.HoverCardTrigger>Show Card</HoverCard.HoverCardTrigger>
          <HoverCard.HoverCardContent>Content</HoverCard.HoverCardContent>
        </HoverCard.HoverCard>,
      );
      expect(screen.getByText("Show Card")).toBeInTheDocument();
    });
  });

  describe("Open/Close state transitions", () => {
    it("opens hover card when open prop is true", () => {
      const { rerender } = render(
        <HoverCard.HoverCard open={false}>
          <HoverCard.HoverCardTrigger>Hover me</HoverCard.HoverCardTrigger>
          <HoverCard.HoverCardContent>Content</HoverCard.HoverCardContent>
        </HoverCard.HoverCard>,
      );
      expect(screen.queryByText("Content")).not.toBeInTheDocument();

      rerender(
        <HoverCard.HoverCard open={true}>
          <HoverCard.HoverCardTrigger>Hover me</HoverCard.HoverCardTrigger>
          <HoverCard.HoverCardContent>Content</HoverCard.HoverCardContent>
        </HoverCard.HoverCard>,
      );
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("closes hover card when open prop changes to false", () => {
      const { rerender } = render(
        <HoverCard.HoverCard open={true}>
          <HoverCard.HoverCardTrigger>Hover me</HoverCard.HoverCardTrigger>
          <HoverCard.HoverCardContent>Content</HoverCard.HoverCardContent>
        </HoverCard.HoverCard>,
      );
      expect(screen.getByText("Content")).toBeInTheDocument();

      rerender(
        <HoverCard.HoverCard open={false}>
          <HoverCard.HoverCardTrigger>Hover me</HoverCard.HoverCardTrigger>
          <HoverCard.HoverCardContent>Content</HoverCard.HoverCardContent>
        </HoverCard.HoverCard>,
      );
      expect(screen.queryByText("Content")).not.toBeInTheDocument();
    });

    it("renders with openDelay prop", () => {
      render(
        <HoverCard.HoverCard openDelay={500} open={true}>
          <HoverCard.HoverCardTrigger>Hover me</HoverCard.HoverCardTrigger>
          <HoverCard.HoverCardContent>Delayed content</HoverCard.HoverCardContent>
        </HoverCard.HoverCard>,
      );
      expect(screen.getByText("Delayed content")).toBeInTheDocument();
    });

    it("renders with closeDelay prop", () => {
      render(
        <HoverCard.HoverCard closeDelay={300} open={true}>
          <HoverCard.HoverCardTrigger>Hover me</HoverCard.HoverCardTrigger>
          <HoverCard.HoverCardContent>Delayed close</HoverCard.HoverCardContent>
        </HoverCard.HoverCard>,
      );
      expect(screen.getByText("Delayed close")).toBeInTheDocument();
    });
  });

  describe("Stateful props - Loading", () => {
    it("calls onStateChange with 'loading'", async () => {
      render(
        <HoverCard.HoverCard loading onStateChange={mockOnStateChange}>
          <HoverCard.HoverCardTrigger>Hover me</HoverCard.HoverCardTrigger>
          <HoverCard.HoverCardContent>Content</HoverCard.HoverCardContent>
        </HoverCard.HoverCard>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });
  });

  describe("Stateful props - Error", () => {
    it("calls onStateChange with 'error'", async () => {
      render(
        <HoverCard.HoverCard error="Error message" onStateChange={mockOnStateChange}>
          <HoverCard.HoverCardTrigger>Hover me</HoverCard.HoverCardTrigger>
          <HoverCard.HoverCardContent>Content</HoverCard.HoverCardContent>
        </HoverCard.HoverCard>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });
  });

  describe("Stateful props - Disabled", () => {
    it("calls onStateChange with 'disabled'", async () => {
      render(
        <HoverCard.HoverCard disabled onStateChange={mockOnStateChange}>
          <HoverCard.HoverCardTrigger>Hover me</HoverCard.HoverCardTrigger>
          <HoverCard.HoverCardContent>Content</HoverCard.HoverCardContent>
        </HoverCard.HoverCard>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("disabled");
      });
    });
  });

  describe("Stateful props - Required", () => {
    it("calls onStateChange with 'default' when required", async () => {
      render(
        <HoverCard.HoverCard required onStateChange={mockOnStateChange}>
          <HoverCard.HoverCardTrigger>Hover me</HoverCard.HoverCardTrigger>
          <HoverCard.HoverCardContent>Content</HoverCard.HoverCardContent>
        </HoverCard.HoverCard>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("default");
      });
    });
  });

  describe("State priority", () => {
    it("prioritizes loading over error and disabled", async () => {
      render(
        <HoverCard.HoverCard loading error="Error" disabled onStateChange={mockOnStateChange}>
          <HoverCard.HoverCardTrigger>Hover me</HoverCard.HoverCardTrigger>
          <HoverCard.HoverCardContent>Content</HoverCard.HoverCardContent>
        </HoverCard.HoverCard>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("prioritizes error over disabled when not loading", async () => {
      render(
        <HoverCard.HoverCard error="Error" disabled onStateChange={mockOnStateChange}>
          <HoverCard.HoverCardTrigger>Hover me</HoverCard.HoverCardTrigger>
          <HoverCard.HoverCardContent>Content</HoverCard.HoverCardContent>
        </HoverCard.HoverCard>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });
  });

  describe("Accessibility", () => {
    it("trigger is keyboard accessible", () => {
      render(
        <HoverCard.HoverCard>
          <HoverCard.HoverCardTrigger asChild>
            <button>Profile Card</button>
          </HoverCard.HoverCardTrigger>
          <HoverCard.HoverCardContent>Profile details</HoverCard.HoverCardContent>
        </HoverCard.HoverCard>,
      );
      const trigger = screen.getByRole("button");
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveTextContent("Profile Card");
    });

    it("renders with custom className on trigger", () => {
      const { container } = render(
        <HoverCard.HoverCard open={true}>
          <HoverCard.HoverCardTrigger asChild>
            <button className="custom-trigger">Hover me</button>
          </HoverCard.HoverCardTrigger>
          <HoverCard.HoverCardContent>Content</HoverCard.HoverCardContent>
        </HoverCard.HoverCard>,
      );
      const trigger = container.querySelector(".custom-trigger");
      expect(trigger).toBeInTheDocument();
    });

    it("renders with custom content", () => {
      render(
        <HoverCard.HoverCard open={true}>
          <HoverCard.HoverCardTrigger>Trigger</HoverCard.HoverCardTrigger>
          <HoverCard.HoverCardContent>
            <div className="custom-content">
              <h2>Custom Title</h2>
              <p>Custom description</p>
            </div>
          </HoverCard.HoverCardContent>
        </HoverCard.HoverCard>,
      );
      expect(screen.getByText("Custom Title")).toBeInTheDocument();
      expect(screen.getByText("Custom description")).toBeInTheDocument();
    });
  });

  describe("Content positioning", () => {
    it("renders with default center alignment", () => {
      render(
        <HoverCard.HoverCard open={true}>
          <HoverCard.HoverCardTrigger>Hover me</HoverCard.HoverCardTrigger>
          <HoverCard.HoverCardContent>Centered content</HoverCard.HoverCardContent>
        </HoverCard.HoverCard>,
      );
      expect(screen.getByText("Centered content")).toBeInTheDocument();
    });

    it("renders with custom alignment", () => {
      render(
        <HoverCard.HoverCard open={true}>
          <HoverCard.HoverCardTrigger>Hover me</HoverCard.HoverCardTrigger>
          <HoverCard.HoverCardContent align="start">Aligned content</HoverCard.HoverCardContent>
        </HoverCard.HoverCard>,
      );
      expect(screen.getByText("Aligned content")).toBeInTheDocument();
    });

    it("renders with custom sideOffset", () => {
      render(
        <HoverCard.HoverCard open={true}>
          <HoverCard.HoverCardTrigger>Hover me</HoverCard.HoverCardTrigger>
          <HoverCard.HoverCardContent sideOffset={10}>Offset content</HoverCard.HoverCardContent>
        </HoverCard.HoverCard>,
      );
      expect(screen.getByText("Offset content")).toBeInTheDocument();
    });
  });
});
