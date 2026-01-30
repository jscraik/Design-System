import { render, screen, waitFor, fireEvent } from "../../../../testing/utils";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { TagInput, type Tag } from "./TagInput";

describe("TagInput", () => {
  const mockOnTagsChange = vi.fn();
  const mockOnTagAdd = vi.fn();
  const mockOnTagRemove = vi.fn();
  const mockOnStateChange = vi.fn();

  const sampleTags: Tag[] = [
    { id: "1", label: "React" },
    { id: "2", label: "TypeScript" },
    { id: "3", label: "Testing" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("renders tag input container", () => {
      render(<TagInput tags={[]} onTagsChange={mockOnTagsChange} />);
      const container = screen.getByRole("textbox").closest('[data-slot="tag-input"]');
      expect(container).toBeInTheDocument();
    });

    it("renders existing tags", () => {
      render(<TagInput tags={sampleTags} onTagsChange={mockOnTagsChange} />);

      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("Testing")).toBeInTheDocument();
    });

    it("renders input field", () => {
      render(<TagInput tags={[]} onTagsChange={mockOnTagsChange} />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("displays placeholder when no tags", () => {
      render(
        <TagInput
          tags={[]}
          onTagsChange={mockOnTagsChange}
          placeholder="Add skills..."
        />
      );
      expect(screen.getByPlaceholderText("Add skills...")).toBeInTheDocument();
    });

    it("hides placeholder when tags exist", () => {
      render(
        <TagInput
          tags={sampleTags}
          onTagsChange={mockOnTagsChange}
          placeholder="Add skills..."
        />
      );
      expect(screen.queryByPlaceholderText("Add skills...")).not.toBeInTheDocument();
    });
  });

  describe("Adding tags", () => {
    it("adds tag when Enter pressed", () => {
      render(<TagInput tags={[]} onTagsChange={mockOnTagsChange} />);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "New Tag" } });
      fireEvent.keyDown(input, { key: "Enter" });

      expect(mockOnTagsChange).toHaveBeenCalledWith([
        { id: expect.any(String), label: "New Tag" },
      ]);
    });

    it("trims whitespace before adding tag", () => {
      render(<TagInput tags={[]} onTagsChange={mockOnTagsChange} />);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "  Spaced Tag  " } });
      fireEvent.keyDown(input, { key: "Enter" });

      expect(mockOnTagsChange).toHaveBeenCalledWith([
        { id: expect.any(String), label: "Spaced Tag" },
      ]);
    });

    it("does not add empty tag", () => {
      render(<TagInput tags={[]} onTagsChange={mockOnTagsChange} />);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "   " } });
      fireEvent.keyDown(input, { key: "Enter" });

      expect(mockOnTagsChange).not.toHaveBeenCalled();
    });

    it("calls onTagAdd callback when tag added", () => {
      render(
        <TagInput tags={[]} onTagsChange={mockOnTagsChange} onTagAdd={mockOnTagAdd} />
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "Vue" } });
      fireEvent.keyDown(input, { key: "Enter" });

      expect(mockOnTagAdd).toHaveBeenCalledWith({
        id: expect.any(String),
        label: "Vue",
      });
    });

    it("clears input after adding tag", () => {
      render(<TagInput tags={[]} onTagsChange={mockOnTagsChange} />);

      const input = screen.getByRole("textbox") as HTMLInputElement;
      fireEvent.change(input, { target: { value: "Test" } });
      fireEvent.keyDown(input, { key: "Enter" });

      expect(input.value).toBe("");
    });

    it("adds tag on blur when input has value", async () => {
      render(<TagInput tags={[]} onTagsChange={mockOnTagsChange} />);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "Blur Tag" } });
      fireEvent.blur(input);

      await waitFor(() => {
        expect(mockOnTagsChange).toHaveBeenCalledWith([
          { id: expect.any(String), label: "Blur Tag" },
        ]);
      });
    });
  });

  describe("Removing tags", () => {
    it("removes tag when X button clicked", () => {
      render(
        <TagInput tags={sampleTags} onTagsChange={mockOnTagsChange} onTagRemove={mockOnTagRemove} />
      );

      // Find the X button for the first tag
      const removeButtons = screen.getAllByLabelText(/Remove/);
      removeButtons[0].click();

      expect(mockOnTagsChange).toHaveBeenCalledWith([
        { id: "2", label: "TypeScript" },
        { id: "3", label: "Testing" },
      ]);
    });

    it("calls onTagRemove callback when tag removed", () => {
      render(
        <TagInput tags={sampleTags} onTagsChange={mockOnTagsChange} onTagRemove={mockOnTagRemove} />
      );

      const removeButtons = screen.getAllByLabelText(/Remove/);
      removeButtons[1].click();

      expect(mockOnTagRemove).toHaveBeenCalledWith({ id: "2", label: "TypeScript" });
    });

    it("removes last tag when Backspace pressed on empty input", () => {
      render(
        <TagInput tags={sampleTags} onTagsChange={mockOnTagsChange} onTagRemove={mockOnTagRemove} />
      );

      const input = screen.getByRole("textbox");
      fireEvent.keyDown(input, { key: "Backspace" });

      expect(mockOnTagsChange).toHaveBeenCalledWith([
        { id: "1", label: "React" },
        { id: "2", label: "TypeScript" },
      ]);
    });
  });

  describe("Duplicate handling", () => {
    it("prevents duplicate tags by default", () => {
      render(
        <TagInput
          tags={sampleTags}
          onTagsChange={mockOnTagsChange}
          allowDuplicates={false}
        />
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "React" } });
      fireEvent.keyDown(input, { key: "Enter" });

      expect(mockOnTagsChange).not.toHaveBeenCalled();
    });

    it("allows duplicate tags when allowDuplicates is true", () => {
      render(
        <TagInput
          tags={sampleTags}
          onTagsChange={mockOnTagsChange}
          allowDuplicates={true}
        />
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "React" } });
      fireEvent.keyDown(input, { key: "Enter" });

      expect(mockOnTagsChange).toHaveBeenCalledWith([
        ...sampleTags,
        { id: expect.any(String), label: "React" },
      ]);
    });
  });

  describe("Max tags limit", () => {
    it("respects maxTags limit", () => {
      render(
        <TagInput
          tags={sampleTags}
          onTagsChange={mockOnTagsChange}
          maxTags={3}
        />
      );

      // With 3 tags and maxTags=3, the input is hidden
      // Use queryByRole which returns null when element is not found
      const input = screen.queryByRole("textbox");
      expect(input).not.toBeInTheDocument();

      // Tags should still be visible
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("Testing")).toBeInTheDocument();
    });

    it("hides input when maxTags reached", () => {
      render(
        <TagInput
          tags={sampleTags}
          onTagsChange={mockOnTagsChange}
          maxTags={3}
        />
      );

      // When max tags reached, input should not be rendered
      // sampleTags has 3 items, maxTags is 3, so input is hidden
      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    });
  });

  describe("Stateful props - Loading", () => {
    it("calls onStateChange with 'loading'", async () => {
      render(
        <TagInput
          tags={[]}
          onTagsChange={mockOnTagsChange}
          loading
          onStateChange={mockOnStateChange}
        />
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("shows loading state when loading", () => {
      render(<TagInput tags={[]} onTagsChange={mockOnTagsChange} loading />);
      const container = screen.getByRole("textbox").closest('[data-slot="tag-input"]');
      expect(container).toHaveClass("animate-pulse");
    });
  });

  describe("Stateful props - Error", () => {
    it("calls onStateChange with 'error'", async () => {
      render(
        <TagInput
          tags={[]}
          onTagsChange={mockOnTagsChange}
          error="Invalid tags"
          onStateChange={mockOnStateChange}
        />
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });

    it("shows error ring when error", () => {
      render(<TagInput tags={[]} onTagsChange={mockOnTagsChange} error="Invalid tags" />);
      const container = screen.getByRole("textbox").closest('[data-slot="tag-input"]');
      expect(container).toHaveClass("ring-2");
    });
  });

  describe("Stateful props - Disabled", () => {
    it("calls onStateChange with 'disabled'", async () => {
      render(
        <TagInput
          tags={[]}
          onTagsChange={mockOnTagsChange}
          disabled
          onStateChange={mockOnStateChange}
        />
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("disabled");
      });
    });

    it("disables input when disabled", () => {
      render(<TagInput tags={[]} onTagsChange={mockOnTagsChange} disabled />);
      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
    });

    it("prevents adding tags when disabled", () => {
      render(<TagInput tags={[]} onTagsChange={mockOnTagsChange} disabled />);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "Test" } });
      fireEvent.keyDown(input, { key: "Enter" });

      expect(mockOnTagsChange).not.toHaveBeenCalled();
    });

    it("prevents removing tags when disabled", () => {
      render(
        <TagInput
          tags={sampleTags}
          onTagsChange={mockOnTagsChange}
          disabled
        />
      );

      const removeButtons = screen.getAllByLabelText(/Remove/);
      removeButtons[0].click();

      expect(mockOnTagsChange).not.toHaveBeenCalled();
    });
  });

  describe("Stateful props - Required", () => {
    it("calls onStateChange with 'default' when required", async () => {
      render(
        <TagInput
          tags={[]}
          onTagsChange={mockOnTagsChange}
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
        <TagInput
          tags={[]}
          onTagsChange={mockOnTagsChange}
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
        <TagInput
          tags={[]}
          onTagsChange={mockOnTagsChange}
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
      render(<TagInput tags={[]} onTagsChange={mockOnTagsChange} disabled />);
      const container = screen.getByRole("textbox").closest('[data-slot="tag-input"]');
      expect(container).toHaveAttribute("aria-disabled", "true");
    });

    it("has aria-invalid when error", () => {
      render(<TagInput tags={[]} onTagsChange={mockOnTagsChange} error="Invalid" />);
      const container = screen.getByRole("textbox").closest('[data-slot="tag-input"]');
      expect(container).toHaveAttribute("aria-invalid", "true");
    });

    it("has aria-busy when loading", () => {
      render(<TagInput tags={[]} onTagsChange={mockOnTagsChange} loading />);
      const container = screen.getByRole("textbox").closest('[data-slot="tag-input"]');
      expect(container).toHaveAttribute("aria-busy", "true");
    });

    it("has aria-required when required", () => {
      render(<TagInput tags={[]} onTagsChange={mockOnTagsChange} required />);
      const container = screen.getByRole("textbox").closest('[data-slot="tag-input"]');
      expect(container).toHaveAttribute("aria-required", "true");
    });

    it("remove buttons have accessible labels", () => {
      render(<TagInput tags={sampleTags} onTagsChange={mockOnTagsChange} />);

      const removeButtons = screen.getAllByLabelText(/Remove/);
      expect(removeButtons.length).toBe(3);
      removeButtons.forEach((button) => {
        expect(button).toHaveAttribute("aria-label");
      });
    });
  });

  describe("Variants", () => {
    it("renders default variant", () => {
      render(
        <TagInput
          tags={[]}
          onTagsChange={mockOnTagsChange}
          variant="default"
        />
      );
      const container = screen.getByRole("textbox").closest('[data-slot="tag-input"]');
      expect(container).toBeInTheDocument();
    });

    it("renders outline variant", () => {
      render(
        <TagInput
          tags={[]}
          onTagsChange={mockOnTagsChange}
          variant="outline"
        />
      );
      const container = screen.getByRole("textbox").closest('[data-slot="tag-input"]');
      expect(container).toBeInTheDocument();
    });
  });

  describe("Click to focus", () => {
    it("focuses input when container clicked", () => {
      render(<TagInput tags={[]} onTagsChange={mockOnTagsChange} />);

      const container = screen.getByRole("textbox").closest('[data-slot="tag-input"]');
      container.click();

      const input = screen.getByRole("textbox");
      // Input should be focused (verify via document.activeElement if needed)
      expect(input).toHaveFocus();
    });
  });
});
