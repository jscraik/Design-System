import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./Resizable";

describe("ResizablePanelGroup", () => {
  const mockOnStateChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("renders with data-slot attribute", () => {
      const { container } = render(<ResizablePanelGroup direction="horizontal" />);
      const group = container.querySelector('[data-slot="resizable-panel-group"]');
      expect(group).toBeInTheDocument();
    });

    it("renders with horizontal direction", () => {
      const { container } = render(<ResizablePanelGroup direction="horizontal" />);
      const group = container.querySelector('[data-slot="resizable-panel-group"]');
      expect(group).toBeInTheDocument();
      // Direction is handled internally by react-resizable-panels
    });

    it("renders with vertical direction", () => {
      const { container } = render(<ResizablePanelGroup direction="vertical" />);
      const group = container.querySelector('[data-slot="resizable-panel-group"]');
      expect(group).toBeInTheDocument();
      // Direction is handled internally by react-resizable-panels
    });

    it("renders with custom className", () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal" className="custom-group" />,
      );
      const group = container.querySelector(".custom-group");
      expect(group).toBeInTheDocument();
    });
  });

  describe("Stateful props - Loading", () => {
    it("shows loading state", () => {
      const { container } = render(<ResizablePanelGroup direction="horizontal" loading />);
      const group = container.querySelector('[data-state="loading"]');
      expect(group).toBeInTheDocument();
    });

    it("calls onStateChange with 'loading'", async () => {
      render(
        <ResizablePanelGroup direction="horizontal" loading onStateChange={mockOnStateChange} />,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("sets aria-busy when loading", () => {
      const { container } = render(<ResizablePanelGroup direction="horizontal" loading />);
      const group = container.querySelector('[aria-busy="true"]');
      expect(group).toBeInTheDocument();
    });
  });

  describe("Stateful props - Error", () => {
    it("shows error state", () => {
      const { container } = render(<ResizablePanelGroup direction="horizontal" error="Error" />);
      const group = container.querySelector('[data-state="error"]');
      expect(group).toBeInTheDocument();
      expect(group).toHaveAttribute("data-error", "true");
    });

    it("applies error ring styling", () => {
      const { container } = render(<ResizablePanelGroup direction="horizontal" error="Error" />);
      const group = container.querySelector('[data-state="error"]');
      expect(group).toHaveClass("ring-2");
      expect(group).toHaveClass("ring-status-error/50");
    });

    it("sets aria-invalid when error", () => {
      const { container } = render(<ResizablePanelGroup direction="horizontal" error="Error" />);
      const group = container.querySelector('[aria-invalid="true"]');
      expect(group).toBeInTheDocument();
    });
  });

  describe("Stateful props - Disabled", () => {
    it("shows disabled state", () => {
      const { container } = render(<ResizablePanelGroup direction="horizontal" disabled />);
      const group = container.querySelector('[data-state="disabled"]');
      expect(group).toBeInTheDocument();
    });

    it("applies disabled styling", () => {
      const { container } = render(<ResizablePanelGroup direction="horizontal" disabled />);
      const group = container.querySelector('[data-state="disabled"]');
      expect(group).toHaveClass("opacity-50");
      expect(group).toHaveClass("pointer-events-none");
    });

    it("sets aria-disabled when disabled", () => {
      const { container } = render(<ResizablePanelGroup direction="horizontal" disabled />);
      const group = container.querySelector('[aria-disabled="true"]');
      expect(group).toBeInTheDocument();
    });
  });

  describe("Stateful props - Required", () => {
    it("sets required data attribute", () => {
      const { container } = render(<ResizablePanelGroup direction="horizontal" required />);
      const group = container.querySelector('[data-required="true"]');
      expect(group).toBeInTheDocument();
    });

    it("sets aria-required when required", () => {
      const { container } = render(<ResizablePanelGroup direction="horizontal" required />);
      const group = container.querySelector('[aria-required="true"]');
      expect(group).toBeInTheDocument();
    });

    it("sets aria-invalid to false when required but no error", () => {
      const { container } = render(<ResizablePanelGroup direction="horizontal" required />);
      const group = container.querySelector('[aria-invalid="false"]');
      expect(group).toBeInTheDocument();
    });
  });

  describe("State priority", () => {
    it("prioritizes loading over error and disabled", async () => {
      render(
        <ResizablePanelGroup
          direction="horizontal"
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
        <ResizablePanelGroup
          direction="horizontal"
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
});

describe("ResizablePanel", () => {
  it("renders with data-slot attribute", () => {
    const { container } = render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel />
      </ResizablePanelGroup>,
    );
    const panel = container.querySelector('[data-slot="resizable-panel"]');
    expect(panel).toBeInTheDocument();
  });

  it("passes through props", () => {
    const { container } = render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50} />
      </ResizablePanelGroup>,
    );
    // Panel renders within the group
    const panel = container.querySelector('[data-slot="resizable-panel"]');
    expect(panel).toBeInTheDocument();
  });
});

describe("ResizableHandle", () => {
  it("renders with data-slot attribute within group", () => {
    const { container } = render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel />
        <ResizableHandle />
        <ResizablePanel />
      </ResizablePanelGroup>,
    );
    const handle = container.querySelector('[data-slot="resizable-handle"]');
    expect(handle).toBeInTheDocument();
  });

  it("does not show handle icon by default", () => {
    const { container } = render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel />
        <ResizableHandle />
        <ResizablePanel />
      </ResizablePanelGroup>,
    );
    const handleIcon = container.querySelector('[data-slot="resizable-handle"] > div');
    expect(handleIcon).not.toBeInTheDocument();
  });

  it("shows handle icon when withHandle is true", () => {
    const { container } = render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel />
        <ResizableHandle withHandle />
        <ResizablePanel />
      </ResizablePanelGroup>,
    );
    const handleIcon = container.querySelector('[data-slot="resizable-handle"] > div');
    expect(handleIcon).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel />
        <ResizableHandle className="custom-handle" />
        <ResizablePanel />
      </ResizablePanelGroup>,
    );
    const handle = container.querySelector(".custom-handle");
    expect(handle).toBeInTheDocument();
  });
});
