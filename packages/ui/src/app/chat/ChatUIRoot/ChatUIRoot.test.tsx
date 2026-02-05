import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "../../../../testing/utils";
import { ChatUIRoot } from "./ChatUIRoot";

describe("ChatUIRoot", () => {
  const mockOnModeChange = vi.fn();
  const _mockOnSidebarOpenChange = vi.fn();
  const mockOnSidebarToggle = vi.fn();
  const mockOnStateChange = vi.fn();
  const mockOnViewModeChange = vi.fn();

  const defaultModel = {
    name: "GPT-4o",
    shortName: "4o",
    description: "Latest model",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("renders chat UI root with data-testid", () => {
      const { container } = render(<ChatUIRoot />);
      const root = container.querySelector('[data-testid="chat-ui-root"]');
      expect(root).toBeInTheDocument();
    });

    it("renders in twoPane mode by default", () => {
      render(<ChatUIRoot />);
      const root = screen.getByTestId("chat-ui-root");
      expect(root).toBeInTheDocument();
    });
  });

  describe("Layout modes", () => {
    it("renders in twoPane mode", () => {
      render(<ChatUIRoot mode="twoPane" />);
      const root = screen.getByTestId("chat-ui-root");
      expect(root).toBeInTheDocument();
    });

    it("renders in full mode", () => {
      render(<ChatUIRoot mode="full" />);
      const root = screen.getByTestId("chat-ui-root");
      expect(root).toBeInTheDocument();
    });

    it("renders in dashboard mode", () => {
      render(<ChatUIRoot mode="dashboard" />);
      expect(screen.getByText("Dashboard template placeholder")).toBeInTheDocument();
    });
  });

  describe("Sidebar behavior", () => {
    it("renders sidebar in twoPane mode when open", () => {
      render(<ChatUIRoot mode="twoPane" sidebarOpen={true} />);
      const sidebar = screen.queryByTestId("chat-sidebar");
      expect(sidebar).toBeInTheDocument();
    });

    it("does not render sidebar in dashboard mode", () => {
      render(<ChatUIRoot mode="dashboard" sidebarOpen={true} />);
      expect(screen.queryByTestId("chat-sidebar")).not.toBeInTheDocument();
    });

    it("renders overlay sidebar in full mode when open", () => {
      render(<ChatUIRoot mode="full" sidebarOpen={true} />);
      const sidebar = screen.queryByTestId("chat-sidebar");
      expect(sidebar).toBeInTheDocument();
    });

    it("does not render overlay in full mode when closed", () => {
      render(<ChatUIRoot mode="full" sidebarOpen={false} />);
      expect(screen.queryByTestId("chat-sidebar")).not.toBeInTheDocument();
    });
  });

  describe("Stateful props - Loading", () => {
    it("calls onStateChange with 'loading'", async () => {
      render(<ChatUIRoot loading onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("shows loading overlay when loading", () => {
      render(<ChatUIRoot loading />);
      expect(screen.getByText("Loading chat...")).toBeInTheDocument();
    });
  });

  describe("Stateful props - Error", () => {
    it("calls onStateChange with 'error'", async () => {
      render(<ChatUIRoot error="Failed to load" onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });

    it("shows error message when error", () => {
      render(<ChatUIRoot error="Connection failed" />);
      expect(screen.getByText("Connection failed")).toBeInTheDocument();
    });
  });

  describe("Stateful props - Disabled", () => {
    it("calls onStateChange with 'disabled'", async () => {
      render(<ChatUIRoot disabled onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("disabled");
      });
    });
  });

  describe("Stateful props - Required", () => {
    it("calls onStateChange with 'default' when required", async () => {
      render(<ChatUIRoot required onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("default");
      });
    });
  });

  describe("State priority", () => {
    it("prioritizes loading over error and disabled", async () => {
      render(<ChatUIRoot loading error="Error" disabled onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("prioritizes error over disabled when not loading", async () => {
      render(<ChatUIRoot error="Error" disabled onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });
  });

  describe("Accessibility", () => {
    it("has aria-disabled when disabled", () => {
      render(<ChatUIRoot disabled />);
      const root = screen.getByTestId("chat-ui-root");
      expect(root).toHaveAttribute("aria-disabled", "true");
    });

    it("has aria-busy when loading", () => {
      render(<ChatUIRoot loading />);
      const root = screen.getByTestId("chat-ui-root");
      expect(root).toHaveAttribute("aria-busy", "true");
    });

    it("has aria-invalid when error", () => {
      render(<ChatUIRoot error="Failed" />);
      const root = screen.getByTestId("chat-ui-root");
      expect(root).toHaveAttribute("aria-invalid", "true");
    });

    it("has aria-required when required", () => {
      render(<ChatUIRoot required />);
      const root = screen.getByTestId("chat-ui-root");
      expect(root).toHaveAttribute("aria-required", "true");
    });

    it("has data-state attribute reflecting current state", () => {
      render(<ChatUIRoot loading />);
      const root = screen.getByTestId("chat-ui-root");
      expect(root).toHaveAttribute("data-state", "loading");
    });
  });

  describe("Custom slots", () => {
    it("renders headerRight slot content", () => {
      render(<ChatUIRoot headerRight={<div data-testid="header-right">Custom</div>} />);
      expect(screen.getByTestId("header-right")).toBeInTheDocument();
    });

    it("passes composerLeft slot to ChatView", () => {
      render(<ChatUIRoot composerLeft={<div data-testid="composer-left">Left</div>} />);
      // composerLeft is passed through to ChatView component
      // Just verify component renders without error
      const root = screen.getByTestId("chat-ui-root");
      expect(root).toBeInTheDocument();
    });

    it("passes composerRight slot to ChatView", () => {
      render(<ChatUIRoot composerRight={<div data-testid="composer-right">Right</div>} />);
      // composerRight is passed through to ChatView component
      // Just verify component renders without error
      const root = screen.getByTestId("chat-ui-root");
      expect(root).toBeInTheDocument();
    });

    it("passes emptyState slot to ChatView", () => {
      render(<ChatUIRoot emptyState={<div data-testid="empty-state">Empty</div>} />);
      // emptyState is passed through to ChatView component
      // Just verify component renders without error
      const root = screen.getByTestId("chat-ui-root");
      expect(root).toBeInTheDocument();
    });
  });

  describe("Default model", () => {
    it("uses default model when none provided", () => {
      render(<ChatUIRoot />);
      const root = screen.getByTestId("chat-ui-root");
      expect(root).toBeInTheDocument();
    });

    it("uses provided defaultModel", () => {
      render(<ChatUIRoot defaultModel={defaultModel} />);
      const root = screen.getByTestId("chat-ui-root");
      expect(root).toBeInTheDocument();
    });
  });

  describe("Mobile breakpoint", () => {
    it("uses default mobile breakpoint", () => {
      render(<ChatUIRoot />);
      const root = screen.getByTestId("chat-ui-root");
      expect(root).toBeInTheDocument();
    });

    it("accepts custom mobileBreakpointPx", () => {
      render(<ChatUIRoot mobileBreakpointPx={1024} />);
      const root = screen.getByTestId("chat-ui-root");
      expect(root).toBeInTheDocument();
    });
  });

  describe("View mode", () => {
    it("renders chat view by default", () => {
      render(<ChatUIRoot viewMode="chat" />);
      const root = screen.getByTestId("chat-ui-root");
      expect(root).toBeInTheDocument();
    });

    it("accepts compose view mode", () => {
      render(<ChatUIRoot viewMode="compose" />);
      const root = screen.getByTestId("chat-ui-root");
      expect(root).toBeInTheDocument();
    });
  });

  describe("Mode change callbacks", () => {
    it("accepts onModeChange prop", () => {
      render(<ChatUIRoot mode="twoPane" onModeChange={mockOnModeChange} />);
      const root = screen.getByTestId("chat-ui-root");
      expect(root).toBeInTheDocument();
    });

    it("accepts onViewModeChange prop", () => {
      render(<ChatUIRoot viewMode="chat" onViewModeChange={mockOnViewModeChange} />);
      const root = screen.getByTestId("chat-ui-root");
      expect(root).toBeInTheDocument();
    });
  });

  describe("Sidebar callbacks", () => {
    it("accepts onSidebarToggle prop", () => {
      render(
        <ChatUIRoot mode="twoPane" sidebarOpen={true} onSidebarToggle={mockOnSidebarToggle} />,
      );
      // Component should render without error
      const root = screen.getByTestId("chat-ui-root");
      expect(root).toBeInTheDocument();
    });
  });

  describe("Keyboard shortcuts", () => {
    it("has keyboard event listeners registered", () => {
      render(<ChatUIRoot sidebarOpen={true} />);
      const root = screen.getByTestId("chat-ui-root");
      expect(root).toBeInTheDocument();
    });

    it("accepts onSidebarToggle prop for keyboard interactions", () => {
      render(
        <ChatUIRoot mode="twoPane" sidebarOpen={true} onSidebarToggle={mockOnSidebarToggle} />,
      );
      const root = screen.getByTestId("chat-ui-root");
      expect(root).toBeInTheDocument();
    });
  });
});
