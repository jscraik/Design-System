import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { expectFocused, render, screen } from "../../../../testing/utils";

import { Textarea } from "./textarea";

describe("Textarea", () => {
  describe("rendering", () => {
    it("renders with default props", () => {
      render(<Textarea />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("renders with data-slot attribute", () => {
      render(<Textarea />);
      expect(screen.getByRole("textbox")).toHaveAttribute("data-slot", "textarea");
    });

    it("applies custom className", () => {
      render(<Textarea className="custom-class" />);
      expect(screen.getByRole("textbox")).toHaveClass("custom-class");
    });

    it("renders with placeholder", () => {
      render(<Textarea placeholder="Enter your message" />);
      expect(screen.getByPlaceholderText("Enter your message")).toBeInTheDocument();
    });
  });

  describe("ref forwarding", () => {
    it("forwards ref to textarea element", () => {
      const ref = createRef<HTMLTextAreaElement>();
      render(<Textarea ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    });
  });

  describe("value handling", () => {
    it("renders with defaultValue", () => {
      render(<Textarea defaultValue="Initial text" />);
      expect(screen.getByRole("textbox")).toHaveValue("Initial text");
    });

    it("renders with controlled value", () => {
      render(<Textarea value="Controlled text" onChange={() => {}} />);
      expect(screen.getByRole("textbox")).toHaveValue("Controlled text");
    });

    it("calls onChange when value changes", async () => {
      const onChange = vi.fn();
      const { user } = render(<Textarea onChange={onChange} />);

      await user.type(screen.getByRole("textbox"), "Hello");
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe("disabled state", () => {
    it("renders as disabled when disabled prop is true", () => {
      render(<Textarea disabled />);
      expect(screen.getByRole("textbox")).toBeDisabled();
    });

    it("does not allow input when disabled", async () => {
      const onChange = vi.fn();
      const { user } = render(<Textarea disabled onChange={onChange} />);

      await user.type(screen.getByRole("textbox"), "Hello");
      expect(onChange).not.toHaveBeenCalled();
    });

    it("has correct disabled styles", () => {
      render(<Textarea disabled />);
      expect(screen.getByRole("textbox")).toHaveClass("disabled:cursor-not-allowed");
    });
  });

  describe("readonly state", () => {
    it("renders as readonly when readOnly prop is true", () => {
      render(<Textarea readOnly defaultValue="Read only text" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
    });
  });

  describe("interactions", () => {
    it("can be focused via keyboard", async () => {
      const { user } = render(<Textarea />);
      await user.tab();
      expectFocused(screen.getByRole("textbox"));
    });

    it("accepts multiline input", async () => {
      const { user } = render(<Textarea />);
      const textarea = screen.getByRole("textbox");

      await user.type(textarea, "Line 1{enter}Line 2");
      expect(textarea).toHaveValue("Line 1\nLine 2");
    });
  });

  describe("accessibility", () => {
    it("has correct textbox role", () => {
      render(<Textarea />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("supports aria-label", () => {
      render(<Textarea aria-label="Message input" />);
      expect(screen.getByRole("textbox")).toHaveAccessibleName("Message input");
    });

    it("supports aria-describedby", () => {
      render(
        <>
          <Textarea aria-describedby="help-text" />
          <span id="help-text">Enter your message here</span>
        </>,
      );
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-describedby", "help-text");
    });

    it("supports aria-invalid", () => {
      render(<Textarea aria-invalid="true" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    });

    it("has visible focus indicator styles", () => {
      render(<Textarea />);
      expect(screen.getByRole("textbox")).toHaveClass("focus-visible:ring-ring/50");
    });
  });

  describe("rows", () => {
    it("supports rows attribute", () => {
      render(<Textarea rows={5} />);
      expect(screen.getByRole("textbox")).toHaveAttribute("rows", "5");
    });
  });

  describe("maxLength", () => {
    it("supports maxLength attribute", () => {
      render(<Textarea maxLength={100} />);
      expect(screen.getByRole("textbox")).toHaveAttribute("maxLength", "100");
    });
  });

  describe("styling", () => {
    it("has resize-none class", () => {
      render(<Textarea />);
      expect(screen.getByRole("textbox")).toHaveClass("resize-none");
    });

    it("has minimum height", () => {
      render(<Textarea />);
      expect(screen.getByRole("textbox")).toHaveClass("min-h-16");
    });
  });

  describe("error state", () => {
    it("shows error message when error prop is provided", () => {
      render(<Textarea error="This field is required" />);
      expect(screen.getByText("This field is required")).toBeInTheDocument();
    });

    it("sets aria-invalid when error is present", () => {
      render(<Textarea error="Invalid input" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    });

    it("applies error styling classes", () => {
      render(<Textarea error="Invalid input" />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("data-error", "true");
      expect(textarea).toHaveAttribute("data-state", "error");
    });

    it("links error message via aria-describedby", () => {
      render(<Textarea id="test-textarea" error="Error message" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-describedby");
    });
  });

  describe("loading state", () => {
    it("applies loading styling", () => {
      render(<Textarea loading />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("data-state", "loading");
      expect(textarea).toHaveClass("opacity-70", "cursor-wait");
    });

    it("disables textarea when loading", () => {
      render(<Textarea loading />);
      expect(screen.getByRole("textbox")).toBeDisabled();
    });
  });

  describe("required state", () => {
    it("shows required indicator asterisk", () => {
      render(<Textarea required />);
      const asterisk = screen.getByText("*");
      expect(asterisk).toBeInTheDocument();
      expect(asterisk).toHaveClass("text-status-error");
    });

    it("sets aria-required attribute", () => {
      render(<Textarea required />);
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-required", "true");
    });

    it("does not show asterisk when disabled", () => {
      render(<Textarea required disabled />);
      expect(screen.queryByText("*")).not.toBeInTheDocument();
    });

    it("does not show asterisk when loading", () => {
      render(<Textarea required loading />);
      expect(screen.queryByText("*")).not.toBeInTheDocument();
    });
  });

  describe("onStateChange callback", () => {
    it("calls onStateChange with initial state", () => {
      const onStateChange = vi.fn();
      render(<Textarea onStateChange={onStateChange} />);
      expect(onStateChange).toHaveBeenCalledWith("default");
    });

    it("calls onStateChange when error changes", () => {
      const onStateChange = vi.fn();
      const { rerender } = render(<Textarea onStateChange={onStateChange} />);
      rerender(<Textarea error="Error" onStateChange={onStateChange} />);
      expect(onStateChange).toHaveBeenLastCalledWith("error");
    });

    it("calls onStateChange when loading changes", () => {
      const onStateChange = vi.fn();
      const { rerender } = render(<Textarea onStateChange={onStateChange} />);
      rerender(<Textarea loading onStateChange={onStateChange} />);
      expect(onStateChange).toHaveBeenLastCalledWith("loading");
    });

    it("prioritizes loading over error state", () => {
      const onStateChange = vi.fn();
      render(<Textarea error="Error" loading onStateChange={onStateChange} />);
      expect(onStateChange).toHaveBeenLastCalledWith("loading");
    });

    it("prioritizes error over disabled state", () => {
      const onStateChange = vi.fn();
      render(<Textarea error="Error" disabled onStateChange={onStateChange} />);
      expect(onStateChange).toHaveBeenLastCalledWith("error");
    });
  });
});
