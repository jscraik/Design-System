import { render, screen, waitFor } from "../../../../testing/utils";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { ChatShell } from "./ChatShell";

describe("ChatShell", () => {
  const mockOnStateChange = vi.fn();
  const mockSlots = {
    sidebar: <div data-testid="sidebar">Sidebar</div>,
    header: <div data-testid="header">Header</div>,
    messages: <div data-testid="messages">Messages</div>,
    composer: <div data-testid="composer">Composer</div>,
    contextPanel: <div data-testid="context-panel">Context Panel</div>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("renders chat shell with data-testid", () => {
      const { container } = render(<ChatShell slots={mockSlots} />);
      const shell = container.querySelector('[data-testid="chat-shell"]');
      expect(shell).toBeInTheDocument();
    });

    it("renders all slot regions", () => {
      render(<ChatShell slots={mockSlots} />);
      expect(screen.getByTestId("sidebar")).toBeInTheDocument();
      expect(screen.getByTestId("header")).toBeInTheDocument();
      expect(screen.getByTestId("messages")).toBeInTheDocument();
      expect(screen.getByTestId("composer")).toBeInTheDocument();
      expect(screen.getByTestId("context-panel")).toBeInTheDocument();
    });

    it("renders with custom className", () => {
      const { container } = render(
        <ChatShell slots={mockSlots} className="custom-class" />
      );
      const shell = container.querySelector('[data-testid="chat-shell"]');
      expect(shell).toHaveClass("custom-class");
    });

    it("renders with custom contentClassName", () => {
      const { container } = render(
        <ChatShell slots={mockSlots} contentClassName="custom-content" />
      );
      const content = container.querySelector(".custom-content");
      expect(content).toBeInTheDocument();
    });
  });

  describe("Slot rendering", () => {
    it("renders partial slots correctly", () => {
      const partialSlots = {
        header: <div data-testid="header">Header</div>,
        messages: <div data-testid="messages">Messages</div>,
      };
      render(<ChatShell slots={partialSlots} />);
      expect(screen.getByTestId("header")).toBeInTheDocument();
      expect(screen.getByTestId("messages")).toBeInTheDocument();
      expect(screen.queryByTestId("sidebar")).not.toBeInTheDocument();
      expect(screen.queryByTestId("composer")).not.toBeInTheDocument();
    });
  });

  describe("Stateful props - Loading", () => {
    it("calls onStateChange with 'loading'", async () => {
      render(
        <ChatShell slots={mockSlots} loading onStateChange={mockOnStateChange} />
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("shows loading overlay when loading", () => {
      render(<ChatShell slots={mockSlots} loading />);
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("applies loading styles to shell", () => {
      const { container } = render(<ChatShell slots={mockSlots} loading />);
      const shell = container.querySelector('[data-testid="chat-shell"]');
      expect(shell).toHaveClass("animate-pulse");
    });
  });

  describe("Stateful props - Error", () => {
    it("calls onStateChange with 'error'", async () => {
      render(
        <ChatShell
          slots={mockSlots}
          error="Failed to load"
          onStateChange={mockOnStateChange}
        />
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });

    it("shows error message when error", () => {
      render(<ChatShell slots={mockSlots} error="Connection failed" />);
      expect(screen.getByText("Connection failed")).toBeInTheDocument();
    });

    it("applies error styles to shell", () => {
      const { container } = render(
        <ChatShell slots={mockSlots} error="Error" />
      );
      const shell = container.querySelector('[data-testid="chat-shell"]');
      expect(shell).toHaveClass("ring-2");
    });
  });

  describe("Stateful props - Disabled", () => {
    it("calls onStateChange with 'disabled'", async () => {
      render(
        <ChatShell
          slots={mockSlots}
          disabled
          onStateChange={mockOnStateChange}
        />
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("disabled");
      });
    });

    it("applies disabled styles to shell", () => {
      const { container } = render(<ChatShell slots={mockSlots} disabled />);
      const shell = container.querySelector('[data-testid="chat-shell"]');
      expect(shell).toHaveClass("opacity-50");
    });
  });

  describe("Stateful props - Required", () => {
    it("calls onStateChange with 'default' when required", async () => {
      render(
        <ChatShell
          slots={mockSlots}
          required
          onStateChange={mockOnStateChange}
        />
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("default");
      });
    });
  });

  describe("State priority", () => {
    it("prioritizes loading over error and disabled", async () => {
      render(
        <ChatShell
          slots={mockSlots}
          loading
          error="Error"
          disabled
          onStateChange={mockOnStateChange}
        />
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("prioritizes error over disabled when not loading", async () => {
      render(
        <ChatShell
          slots={mockSlots}
          error="Error"
          disabled
          onStateChange={mockOnStateChange}
        />
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });
  });

  describe("Accessibility", () => {
    it("has aria-disabled when disabled", () => {
      const { container } = render(<ChatShell slots={mockSlots} disabled />);
      const shell = container.querySelector('[data-testid="chat-shell"]');
      expect(shell).toHaveAttribute("aria-disabled", "true");
    });

    it("has aria-busy when loading", () => {
      const { container } = render(<ChatShell slots={mockSlots} loading />);
      const shell = container.querySelector('[data-testid="chat-shell"]');
      expect(shell).toHaveAttribute("aria-busy", "true");
    });

    it("has aria-invalid when error", () => {
      const { container } = render(
        <ChatShell slots={mockSlots} error="Failed" />
      );
      const shell = container.querySelector('[data-testid="chat-shell"]');
      expect(shell).toHaveAttribute("aria-invalid", "true");
    });

    it("has aria-required when required", () => {
      const { container } = render(<ChatShell slots={mockSlots} required />);
      const shell = container.querySelector('[data-testid="chat-shell"]');
      expect(shell).toHaveAttribute("aria-required", "true");
    });

    it("has data-state attribute reflecting current state", () => {
      const { container } = render(<ChatShell slots={mockSlots} loading />);
      const shell = container.querySelector('[data-testid="chat-shell"]');
      expect(shell).toHaveAttribute("data-state", "loading");
    });
  });

  describe("Layout structure", () => {
    it("arranges slots in correct layout order", () => {
      const { container } = render(<ChatShell slots={mockSlots} />);
      const shell = container.querySelector('[data-testid="chat-shell"]');
      const children = shell?.children;
      // First child should be sidebar
      expect(children?.[0]).toHaveAttribute("data-testid", "sidebar");
    });
  });

  describe("Loading and error overlay behavior", () => {
    it("does not show error when loading", () => {
      render(
        <ChatShell slots={mockSlots} loading error="Error message" />
      );
      expect(screen.getByText("Loading...")).toBeInTheDocument();
      expect(screen.queryByText("Error message")).not.toBeInTheDocument();
    });

    it("shows error when not loading", () => {
      render(<ChatShell slots={mockSlots} error="Error message" />);
      expect(screen.getByText("Error message")).toBeInTheDocument();
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
  });
});
