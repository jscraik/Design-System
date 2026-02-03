import { render, screen, waitFor, fireEvent } from "../../../../testing/utils";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { ChatSidebar } from "./ChatSidebar";

describe("ChatSidebar", () => {
  const mockOnToggle = vi.fn();
  const mockOnProjectSelect = vi.fn();
  const mockOnStateChange = vi.fn();

  const defaultProjects = [
    { id: "1", label: "Project 1", icon: "code", color: "blue" },
    { id: "2", label: "Project 2", icon: "sparkles", color: "purple" },
  ];

  const defaultChatHistory = ["Chat 1", "Chat 2", "Chat 3"];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("does not render when isOpen is false", () => {
      const { container } = render(<ChatSidebar isOpen={false} onToggle={mockOnToggle} />);
      expect(container.firstChild).toBe(null);
    });

    it("renders when isOpen is true", () => {
      render(<ChatSidebar isOpen={true} onToggle={mockOnToggle} />);
      expect(screen.getByTestId("chat-sidebar")).toBeInTheDocument();
    });

    it("renders search input", () => {
      render(<ChatSidebar isOpen={true} onToggle={mockOnToggle} />);
      expect(screen.getByPlaceholderText("Search chats")).toBeInTheDocument();
    });
  });

  describe("Collapsible state", () => {
    it("renders in expanded state by default", () => {
      render(<ChatSidebar isOpen={true} onToggle={mockOnToggle} />);
      const sidebar = screen.getByTestId("chat-sidebar");
      expect(sidebar).toHaveClass("w-[260px]");
    });

    it("collapses when toggle button clicked", () => {
      render(<ChatSidebar isOpen={true} onToggle={mockOnToggle} />);
      const toggleButton = screen.getByTestId("chat-sidebar-toggle");

      fireEvent.click(toggleButton);
      const sidebar = screen.getByTestId("chat-sidebar");
      expect(sidebar).toHaveClass("w-[64px]");
    });
  });

  describe("Stateful props - Loading", () => {
    it("calls onStateChange with 'loading'", async () => {
      render(
        <ChatSidebar
          isOpen={true}
          onToggle={mockOnToggle}
          loading
          onStateChange={mockOnStateChange}
        />,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("shows loading overlay when loading", () => {
      render(<ChatSidebar isOpen={true} onToggle={mockOnToggle} loading />);
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  describe("Stateful props - Error", () => {
    it("calls onStateChange with 'error'", async () => {
      render(
        <ChatSidebar
          isOpen={true}
          onToggle={mockOnToggle}
          error="Failed to load"
          onStateChange={mockOnStateChange}
        />,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });

    it("shows error message when error", () => {
      render(<ChatSidebar isOpen={true} onToggle={mockOnToggle} error="Connection failed" />);
      expect(screen.getByText("Connection failed")).toBeInTheDocument();
    });
  });

  describe("Stateful props - Disabled", () => {
    it("calls onStateChange with 'disabled'", async () => {
      render(
        <ChatSidebar
          isOpen={true}
          onToggle={mockOnToggle}
          disabled
          onStateChange={mockOnStateChange}
        />,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("disabled");
      });
    });

    it("applies disabled styles when disabled", () => {
      render(<ChatSidebar isOpen={true} onToggle={mockOnToggle} disabled />);
      const sidebar = screen.getByTestId("chat-sidebar");
      expect(sidebar).toHaveClass("opacity-50");
    });
  });

  describe("Stateful props - Required", () => {
    it("calls onStateChange with 'default' when required", async () => {
      render(
        <ChatSidebar
          isOpen={true}
          onToggle={mockOnToggle}
          required
          onStateChange={mockOnStateChange}
        />,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("default");
      });
    });
  });

  describe("State priority", () => {
    it("prioritizes loading over error and disabled", async () => {
      render(
        <ChatSidebar
          isOpen={true}
          onToggle={mockOnToggle}
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
        <ChatSidebar
          isOpen={true}
          onToggle={mockOnToggle}
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

  describe("Navigation items", () => {
    it("renders Pulse navigation item", () => {
      render(<ChatSidebar isOpen={true} onToggle={mockOnToggle} />);
      expect(screen.getByTitle("Pulse")).toBeInTheDocument();
    });

    it("renders Images navigation item", () => {
      render(<ChatSidebar isOpen={true} onToggle={mockOnToggle} />);
      expect(screen.getByTitle("Images")).toBeInTheDocument();
    });

    it("Images item shows NEW badge", () => {
      render(<ChatSidebar isOpen={true} onToggle={mockOnToggle} />);
      expect(screen.getByText("NEW")).toBeInTheDocument();
    });
  });

  describe("Collapsible sections", () => {
    it("renders GPTs collapsible section", () => {
      render(<ChatSidebar isOpen={true} onToggle={mockOnToggle} />);
      expect(screen.getByText("GPTs")).toBeInTheDocument();
    });

    it("renders Group chats collapsible section", () => {
      render(<ChatSidebar isOpen={true} onToggle={mockOnToggle} />);
      expect(screen.getByText("Group chats")).toBeInTheDocument();
    });

    it("renders Your chats collapsible section", () => {
      render(<ChatSidebar isOpen={true} onToggle={mockOnToggle} />);
      expect(screen.getByText("Your chats")).toBeInTheDocument();
    });
  });

  describe("Search functionality", () => {
    it("filters chat history based on search query", () => {
      render(
        <ChatSidebar isOpen={true} onToggle={mockOnToggle} chatHistory={defaultChatHistory} />,
      );
      const searchInput = screen.getByPlaceholderText("Search chats");

      fireEvent.change(searchInput, { target: { value: "Chat 1" } });

      // After filtering, only Chat 1 should be visible
      expect(screen.getByText("Chat 1")).toBeInTheDocument();
    });
  });

  describe("User menu", () => {
    it("renders user menu button", () => {
      render(<ChatSidebar isOpen={true} onToggle={mockOnToggle} />);
      const userMenuButton = screen.getByTestId("chat-sidebar-user-menu");
      expect(userMenuButton).toBeInTheDocument();
    });

    it("shows user name in menu", () => {
      render(<ChatSidebar isOpen={true} onToggle={mockOnToggle} />);
      expect(screen.getByText("Jamie Scott Craik")).toBeInTheDocument();
    });

    it("shows account type", () => {
      render(<ChatSidebar isOpen={true} onToggle={mockOnToggle} />);
      expect(screen.getByText("Personal account")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has role navigation", () => {
      render(<ChatSidebar isOpen={true} onToggle={mockOnToggle} />);
      const sidebar = screen.getByTestId("chat-sidebar");
      expect(sidebar).toHaveAttribute("role", "navigation");
    });

    it("has aria-label", () => {
      render(<ChatSidebar isOpen={true} onToggle={mockOnToggle} />);
      const sidebar = screen.getByTestId("chat-sidebar");
      expect(sidebar).toHaveAttribute("aria-label", "Chat sidebar");
    });

    it("has aria-disabled when disabled", () => {
      render(<ChatSidebar isOpen={true} onToggle={mockOnToggle} disabled />);
      const sidebar = screen.getByTestId("chat-sidebar");
      expect(sidebar).toHaveAttribute("aria-disabled", "true");
    });

    it("has aria-busy when loading", () => {
      render(<ChatSidebar isOpen={true} onToggle={mockOnToggle} loading />);
      const sidebar = screen.getByTestId("chat-sidebar");
      expect(sidebar).toHaveAttribute("aria-busy", "true");
    });

    it("has aria-invalid when error", () => {
      render(<ChatSidebar isOpen={true} onToggle={mockOnToggle} error="Failed" />);
      const sidebar = screen.getByTestId("chat-sidebar");
      expect(sidebar).toHaveAttribute("aria-invalid", "true");
    });

    it("has aria-required when required", () => {
      render(<ChatSidebar isOpen={true} onToggle={mockOnToggle} required />);
      const sidebar = screen.getByTestId("chat-sidebar");
      expect(sidebar).toHaveAttribute("aria-required", "true");
    });

    it("has data-state attribute reflecting current state", () => {
      render(<ChatSidebar isOpen={true} onToggle={mockOnToggle} loading />);
      const sidebar = screen.getByTestId("chat-sidebar");
      expect(sidebar).toHaveAttribute("data-state", "loading");
    });
  });

  describe("Rail mode (collapsed)", () => {
    it("shows rail items when collapsed", () => {
      render(<ChatSidebar isOpen={true} onToggle={mockOnToggle} />);
      const toggleButton = screen.getByTestId("chat-sidebar-toggle");

      // Collapse the sidebar
      fireEvent.click(toggleButton);

      // Rail items should still be present but with different layout
      expect(screen.getByTitle("Pulse")).toBeInTheDocument();
    });
  });

  describe("Quick actions", () => {
    it("renders 'Your Year With ChatGPT' item", () => {
      render(<ChatSidebar isOpen={true} onToggle={mockOnToggle} />);
      expect(screen.getByText("Your Year With ChatGPT")).toBeInTheDocument();
    });

    it("renders 'Archived chats' item", () => {
      render(<ChatSidebar isOpen={true} onToggle={mockOnToggle} />);
      expect(screen.getByText("Archived chats")).toBeInTheDocument();
    });
  });

  describe("Custom projects", () => {
    it("renders custom projects when provided", () => {
      render(<ChatSidebar isOpen={true} onToggle={mockOnToggle} projects={defaultProjects} />);
      expect(screen.getByText("Project 1")).toBeInTheDocument();
      expect(screen.getByText("Project 2")).toBeInTheDocument();
    });
  });

  describe("Custom chat history", () => {
    it("renders custom chat history when provided", () => {
      render(
        <ChatSidebar isOpen={true} onToggle={mockOnToggle} chatHistory={defaultChatHistory} />,
      );
      expect(screen.getByText("Chat 1")).toBeInTheDocument();
      expect(screen.getByText("Chat 2")).toBeInTheDocument();
      expect(screen.getByText("Chat 3")).toBeInTheDocument();
    });
  });
});
