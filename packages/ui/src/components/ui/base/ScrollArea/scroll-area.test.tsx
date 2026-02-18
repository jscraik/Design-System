import { render, screen, waitFor } from "@testing-library/react";
import { createRef } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ScrollArea } from "./fallback/ScrollArea";

describe("ScrollArea", () => {
  const mockOnStateChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("renders with data-slot attribute", () => {
      const { container } = render(<ScrollArea>Content</ScrollArea>);
      const scrollArea = container.querySelector('[data-slot="scroll-area"]');
      expect(scrollArea).toBeInTheDocument();
    });

    it("renders children content", () => {
      render(<ScrollArea>Test Content</ScrollArea>);
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("renders viewport", () => {
      const { container } = render(<ScrollArea>Content</ScrollArea>);
      const viewport = container.querySelector('[data-slot="scroll-area-viewport"]');
      expect(viewport).toBeInTheDocument();
    });

    it("renders with custom className", () => {
      const { container } = render(<ScrollArea className="custom-scroll">Content</ScrollArea>);
      const scrollArea = container.querySelector(".custom-scroll");
      expect(scrollArea).toBeInTheDocument();
    });
  });

  describe("Stateful props - Loading", () => {
    it("shows loading state", () => {
      const { container } = render(<ScrollArea loading>Content</ScrollArea>);
      const scrollArea = container.querySelector('[data-state="loading"]');
      expect(scrollArea).toBeInTheDocument();
    });

    it("calls onStateChange with 'loading'", async () => {
      render(
        <ScrollArea loading onStateChange={mockOnStateChange}>
          Content
        </ScrollArea>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("sets aria-busy when loading", () => {
      const { container } = render(<ScrollArea loading>Content</ScrollArea>);
      const scrollArea = container.querySelector('[aria-busy="true"]');
      expect(scrollArea).toBeInTheDocument();
    });
  });

  describe("Stateful props - Error", () => {
    it("shows error state", () => {
      const { container } = render(<ScrollArea error="Error">Content</ScrollArea>);
      const scrollArea = container.querySelector('[data-state="error"]');
      expect(scrollArea).toBeInTheDocument();
      expect(scrollArea).toHaveAttribute("data-error", "true");
    });

    it("applies error ring styling", () => {
      const { container } = render(<ScrollArea error="Error">Content</ScrollArea>);
      const scrollArea = container.querySelector('[data-state="error"]');
      expect(scrollArea).toHaveClass("ring-2");
      expect(scrollArea).toHaveClass("ring-status-error/50");
    });

    it("sets aria-invalid when error", () => {
      const { container } = render(<ScrollArea error="Error">Content</ScrollArea>);
      const scrollArea = container.querySelector('[aria-invalid="true"]');
      expect(scrollArea).toBeInTheDocument();
    });
  });

  describe("Stateful props - Disabled", () => {
    it("shows disabled state", () => {
      const { container } = render(<ScrollArea disabled>Content</ScrollArea>);
      const scrollArea = container.querySelector('[data-state="disabled"]');
      expect(scrollArea).toBeInTheDocument();
    });

    it("applies disabled styling", () => {
      const { container } = render(<ScrollArea disabled>Content</ScrollArea>);
      const scrollArea = container.querySelector('[data-state="disabled"]');
      expect(scrollArea).toHaveClass("opacity-50");
      expect(scrollArea).toHaveClass("pointer-events-none");
    });

    it("sets aria-disabled when disabled", () => {
      const { container } = render(<ScrollArea disabled>Content</ScrollArea>);
      const scrollArea = container.querySelector('[aria-disabled="true"]');
      expect(scrollArea).toBeInTheDocument();
    });
  });

  describe("Stateful props - Required", () => {
    it("sets required data attribute", () => {
      const { container } = render(<ScrollArea required>Content</ScrollArea>);
      const scrollArea = container.querySelector('[data-required="true"]');
      expect(scrollArea).toBeInTheDocument();
    });

    it("sets aria-required when required", () => {
      const { container } = render(<ScrollArea required>Content</ScrollArea>);
      const scrollArea = container.querySelector('[aria-required="true"]');
      expect(scrollArea).toBeInTheDocument();
    });

    it("sets aria-invalid to false when required but no error", () => {
      const { container } = render(<ScrollArea required>Content</ScrollArea>);
      const scrollArea = container.querySelector('[aria-invalid="false"]');
      expect(scrollArea).toBeInTheDocument();
    });
  });

  describe("State priority", () => {
    it("prioritizes loading over error and disabled", async () => {
      render(
        <ScrollArea loading error="Error" disabled onStateChange={mockOnStateChange}>
          Content
        </ScrollArea>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("prioritizes error over disabled when not loading", async () => {
      render(
        <ScrollArea error="Error" disabled onStateChange={mockOnStateChange}>
          Content
        </ScrollArea>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });
  });

  describe("Accessibility", () => {
    it("viewport has focus-visible ring classes", () => {
      const { container } = render(<ScrollArea>Content</ScrollArea>);
      const viewport = container.querySelector('[data-slot="scroll-area-viewport"]');
      expect(viewport).toHaveClass("focus-visible:ring-[3px]");
    });
  });
});

describe("ScrollBar", () => {
  it("renders with default structure", () => {
    const { container } = render(<ScrollArea>Content</ScrollArea>);
    // The ScrollBar is rendered internally with its structure
    const scrollArea = container.querySelector('[data-slot="scroll-area"]');
    expect(scrollArea).toBeInTheDocument();
    expect(scrollArea?.children.length).toBeGreaterThan(0); // Has children (viewport, scrollbar, corner)
  });
});

describe("ref forwarding", () => {
  it("forwards ref to scroll area element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<ScrollArea ref={ref}>Content</ScrollArea>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
