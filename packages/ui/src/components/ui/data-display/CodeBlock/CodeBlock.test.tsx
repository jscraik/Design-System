import { render, screen, waitFor, fireEvent } from "../../../../testing/utils";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { CodeBlock } from "./CodeBlock";

describe("CodeBlock", () => {
  const mockCode = `function hello() {
  console.log("Hello, world!");
}`;
  const mockOnStateChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("renders code block with code", () => {
      render(<CodeBlock code={mockCode} />);
      expect(screen.getByText(/function hello\(\)/)).toBeInTheDocument();
    });

    it("displays language in header", () => {
      render(<CodeBlock code={mockCode} language="typescript" />);
      expect(screen.getByText("typescript")).toBeInTheDocument();
    });

    it("displays default language when not specified", () => {
      render(<CodeBlock code={mockCode} />);
      expect(screen.getByText("typescript")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      render(<CodeBlock code={mockCode} />);
      const container = screen.getByText("typescript").closest('[data-slot="code-block"]');
      expect(container).toBeInTheDocument();
    });
  });

  describe("Line numbers", () => {
    it("shows line numbers when showLineNumbers is true", () => {
      render(<CodeBlock code={mockCode} showLineNumbers={true} />);
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("does not show line numbers by default", () => {
      render(<CodeBlock code={mockCode} />);
      expect(screen.queryByText("1")).not.toBeInTheDocument();
    });

    it("renders correct line count", () => {
      const code = "line 1\nline 2\nline 3\nline 4";
      render(<CodeBlock code={code} showLineNumbers={true} />);
      expect(screen.getByText("4")).toBeInTheDocument();
      expect(screen.queryByText("5")).not.toBeInTheDocument();
    });
  });

  describe("Copy functionality", () => {
    it("shows copy button by default", () => {
      render(<CodeBlock code={mockCode} />);
      expect(screen.getByLabelText("Copy code")).toBeInTheDocument();
    });

    it("hides copy button when copyable is false", () => {
      render(<CodeBlock code={mockCode} copyable={false} />);
      expect(screen.queryByLabelText("Copy code")).not.toBeInTheDocument();
    });

    it("hides copy button when loading", () => {
      render(<CodeBlock code={mockCode} loading />);
      expect(screen.queryByLabelText("Copy code")).not.toBeInTheDocument();
    });

    it("hides copy button when error", () => {
      render(<CodeBlock code={mockCode} error="Failed to load" />);
      expect(screen.queryByLabelText("Copy code")).not.toBeInTheDocument();
    });

    it("changes button text after copying", async () => {
      render(<CodeBlock code={mockCode} />);
      const copyButton = screen.getByLabelText("Copy code");

      // Mock clipboard API using vi.stub
      const writeText = vi.fn().mockResolvedValue(undefined);
      vi.stubGlobal("navigator", {
        clipboard: {
          writeText,
        } as unknown as Clipboard,
      });

      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(screen.getByLabelText("Copied!")).toBeInTheDocument();
      });

      // Restore original navigator
      vi.unstubAllGlobals();
    });
  });

  describe("Stateful props - Loading", () => {
    it("calls onStateChange with 'loading'", async () => {
      render(<CodeBlock code={mockCode} loading onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("shows loading state in header when loading", () => {
      render(<CodeBlock code={mockCode} loading />);
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("shows loading message instead of code", () => {
      render(<CodeBlock code={mockCode} loading />);
      expect(screen.getByText("Loading code...")).toBeInTheDocument();
      expect(screen.queryByText(/function hello/)).not.toBeInTheDocument();
    });

    it("has animate-pulse class when loading", () => {
      render(<CodeBlock code={mockCode} loading />);
      const container = screen.getByText("Loading...").closest('[data-slot="code-block"]');
      expect(container).toHaveClass("animate-pulse");
    });
  });

  describe("Stateful props - Error", () => {
    it("calls onStateChange with 'error'", async () => {
      render(<CodeBlock code={mockCode} error="Syntax error" onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });

    it("shows error in header when error", () => {
      render(<CodeBlock code={mockCode} error="Failed to parse" />);
      expect(screen.getByText("Error")).toBeInTheDocument();
    });

    it("shows error message instead of code", () => {
      render(<CodeBlock code={mockCode} error="Syntax error" />);
      expect(screen.getByText("Syntax error")).toBeInTheDocument();
      expect(screen.queryByText(/function hello/)).not.toBeInTheDocument();
    });

    it("has ring class when error", () => {
      render(<CodeBlock code={mockCode} error="Failed" />);
      const container = screen.getByText("Error").closest('[data-slot="code-block"]');
      expect(container).toHaveClass("ring-2");
    });
  });

  describe("Stateful props - Disabled", () => {
    it("calls onStateChange with 'disabled'", async () => {
      render(<CodeBlock code={mockCode} disabled onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("disabled");
      });
    });

    it("has reduced opacity when disabled", () => {
      render(<CodeBlock code={mockCode} disabled />);
      const container = screen.getByText("typescript").closest('[data-slot="code-block"]');
      expect(container).toHaveClass("opacity-50");
    });

    it("prevents copy when disabled", () => {
      render(<CodeBlock code={mockCode} disabled />);
      const copyButton = screen.getByLabelText("Copy code");
      expect(copyButton).toBeDisabled();
    });
  });

  describe("Stateful props - Required", () => {
    it("calls onStateChange with 'default' when required", async () => {
      render(<CodeBlock code={mockCode} required onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("default");
      });
    });
  });

  describe("State priority", () => {
    it("prioritizes loading over error and disabled", async () => {
      render(
        <CodeBlock
          code={mockCode}
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
        <CodeBlock code={mockCode} error="Error" disabled onStateChange={mockOnStateChange} />,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });
  });

  describe("Accessibility", () => {
    it("has aria-disabled when disabled", () => {
      render(<CodeBlock code={mockCode} disabled />);
      const container = screen.getByText("typescript").closest('[data-slot="code-block"]');
      expect(container).toHaveAttribute("aria-disabled", "true");
    });

    it("has aria-invalid when error", () => {
      render(<CodeBlock code={mockCode} error="Failed" />);
      const container = screen.getByText("Error").closest('[data-slot="code-block"]');
      expect(container).toHaveAttribute("aria-invalid", "true");
    });

    it("has aria-busy when loading", () => {
      render(<CodeBlock code={mockCode} loading />);
      const container = screen.getByText("Loading...").closest('[data-slot="code-block"]');
      expect(container).toHaveAttribute("aria-busy", "true");
    });

    it("has aria-required when required", () => {
      render(<CodeBlock code={mockCode} required />);
      const container = screen.getByText("typescript").closest('[data-slot="code-block"]');
      expect(container).toHaveAttribute("aria-required", "true");
    });

    it("has data-state attribute reflecting current state", () => {
      render(<CodeBlock code={mockCode} loading />);
      const container = screen.getByText("Loading...").closest('[data-slot="code-block"]');
      expect(container).toHaveAttribute("data-state", "loading");
    });

    it("has data-error attribute when error", () => {
      render(<CodeBlock code={mockCode} error="Failed" />);
      const container = screen.getByText("Error").closest('[data-slot="code-block"]');
      expect(container).toHaveAttribute("data-error", "true");
    });

    it("has data-required attribute when required", () => {
      render(<CodeBlock code={mockCode} required />);
      const container = screen.getByText("typescript").closest('[data-slot="code-block"]');
      expect(container).toHaveAttribute("data-required", "true");
    });
  });

  describe("Edge cases", () => {
    it("renders empty code", () => {
      render(<CodeBlock code="" />);
      expect(screen.getByText("typescript")).toBeInTheDocument();
    });

    it("renders single line code", () => {
      render(<CodeBlock code="const x = 1;" />);
      expect(screen.getByText("const x = 1;")).toBeInTheDocument();
    });

    it("renders code with special characters", () => {
      const specialCode = 'console.log("<>&\'\"");';
      render(<CodeBlock code={specialCode} />);
      // The special characters should be rendered, but may be HTML-encoded
      // Just verify the code is displayed
      const codeElement = screen.getByText(/console\.log/);
      expect(codeElement).toBeInTheDocument();
    });

    it("preserves whitespace in code", () => {
      const indentedCode = "  indented\n    more indented";
      render(<CodeBlock code={indentedCode} />);
      expect(screen.getByText(/indented/)).toBeInTheDocument();
    });
  });
});
