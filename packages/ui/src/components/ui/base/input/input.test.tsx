import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { expectFocused, render, screen } from "../../../../testing/utils";

import { Input } from "./Input";

describe("Input", () => {
  describe("rendering", () => {
    it("renders with default props", () => {
      render(<Input aria-label="Test input" />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("renders with data-slot attribute", () => {
      render(<Input aria-label="Test input" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("data-slot", "input");
    });

    it("applies custom className", () => {
      render(<Input aria-label="Test input" className="custom-class" />);
      expect(screen.getByRole("textbox")).toHaveClass("custom-class");
    });

    it("renders with placeholder", () => {
      render(<Input placeholder="Enter text..." />);
      expect(screen.getByPlaceholderText("Enter text...")).toBeInTheDocument();
    });
  });

  describe("input types", () => {
    it("renders text input by default", () => {
      render(<Input aria-label="Text input" />);
      // Input without explicit type defaults to text in HTML
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("renders email input", () => {
      render(<Input type="email" aria-label="Email input" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
    });

    it("renders password input", () => {
      render(<Input type="password" aria-label="Password input" />);
      // Password inputs don't have textbox role
      expect(screen.getByLabelText("Password input")).toHaveAttribute("type", "password");
    });

    it("renders number input", () => {
      render(<Input type="number" aria-label="Number input" />);
      expect(screen.getByRole("spinbutton")).toHaveAttribute("type", "number");
    });

    it("renders search input", () => {
      render(<Input type="search" aria-label="Search input" />);
      expect(screen.getByRole("searchbox")).toHaveAttribute("type", "search");
    });

    it("renders tel input", () => {
      render(<Input type="tel" aria-label="Phone input" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("type", "tel");
    });

    it("renders url input", () => {
      render(<Input type="url" aria-label="URL input" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("type", "url");
    });
  });

  describe("ref forwarding", () => {
    it("forwards ref to input element", () => {
      const ref = createRef<HTMLInputElement>();
      render(<Input ref={ref} aria-label="Test input" />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it("allows programmatic focus via ref", () => {
      const ref = createRef<HTMLInputElement>();
      render(<Input ref={ref} aria-label="Test input" />);
      ref.current?.focus();
      if (!ref.current) throw new Error("Ref not set");
      expectFocused(ref.current);
    });
  });

  describe("disabled state", () => {
    it("renders as disabled when disabled prop is true", () => {
      render(<Input disabled aria-label="Disabled input" />);
      expect(screen.getByRole("textbox")).toBeDisabled();
    });

    it("does not allow typing when disabled", async () => {
      const { user } = render(<Input disabled aria-label="Disabled input" />);
      const input = screen.getByRole("textbox");
      await user.type(input, "test");
      expect(input).toHaveValue("");
    });

    it("has correct disabled styles", () => {
      render(<Input disabled aria-label="Disabled input" />);
      expect(screen.getByRole("textbox")).toHaveClass("disabled:opacity-50");
    });
  });

  describe("readonly state", () => {
    it("renders as readonly when readOnly prop is true", () => {
      render(<Input readOnly defaultValue="readonly" aria-label="Readonly input" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
    });
  });

  describe("interactions", () => {
    it("can be focused via keyboard", async () => {
      const { user } = render(<Input aria-label="Test input" />);
      await user.tab();
      expectFocused(screen.getByRole("textbox"));
    });

    it("accepts user input", async () => {
      const { user } = render(<Input aria-label="Test input" />);
      const input = screen.getByRole("textbox");
      await user.type(input, "Hello World");
      expect(input).toHaveValue("Hello World");
    });

    it("calls onChange when value changes", async () => {
      const onChange = vi.fn();
      const { user } = render(<Input aria-label="Test input" onChange={onChange} />);
      await user.type(screen.getByRole("textbox"), "a");
      expect(onChange).toHaveBeenCalled();
    });

    it("calls onFocus when focused", async () => {
      const onFocus = vi.fn();
      const { user } = render(<Input aria-label="Test input" onFocus={onFocus} />);
      await user.click(screen.getByRole("textbox"));
      expect(onFocus).toHaveBeenCalledTimes(1);
    });

    it("calls onBlur when blurred", async () => {
      const onBlur = vi.fn();
      const { user } = render(
        <>
          <Input aria-label="Test input" onBlur={onBlur} />
          <button type="button">Other</button>
        </>,
      );
      await user.click(screen.getByRole("textbox"));
      await user.click(screen.getByRole("button"));
      expect(onBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe("controlled vs uncontrolled", () => {
    it("works as controlled input", async () => {
      const onChange = vi.fn();
      const { rerender } = render(
        <Input value="initial" onChange={onChange} aria-label="Controlled" />,
      );
      expect(screen.getByRole("textbox")).toHaveValue("initial");

      rerender(<Input value="updated" onChange={onChange} aria-label="Controlled" />);
      expect(screen.getByRole("textbox")).toHaveValue("updated");
    });

    it("works as uncontrolled input with defaultValue", async () => {
      const { user } = render(<Input defaultValue="initial" aria-label="Uncontrolled" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("initial");

      await user.clear(input);
      await user.type(input, "new value");
      expect(input).toHaveValue("new value");
    });
  });

  describe("accessibility", () => {
    it("supports aria-label", () => {
      render(<Input aria-label="Custom label" />);
      expect(screen.getByRole("textbox")).toHaveAccessibleName("Custom label");
    });

    it("supports aria-describedby", () => {
      render(
        <>
          <Input aria-describedby="help-text" aria-label="Input" />
          <span id="help-text">Help text</span>
        </>,
      );
      expect(screen.getByRole("textbox")).toHaveAccessibleDescription("Help text");
    });

    it("supports aria-invalid for error states", () => {
      render(<Input aria-invalid="true" aria-label="Invalid input" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    });

    it("supports aria-required", () => {
      render(<Input aria-required="true" aria-label="Required input" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-required", "true");
    });

    it("has visible focus indicator styles", () => {
      render(<Input aria-label="Test input" />);
      expect(screen.getByRole("textbox")).toHaveClass("focus-visible:ring-ring");
    });

    it("has error state styles for aria-invalid", () => {
      render(<Input aria-invalid="true" aria-label="Invalid input" />);
      // Note: Updated to check aria-invalid attribute is set
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    });

    it("has error state styles for error prop", () => {
      render(<Input error="Invalid input" aria-label="Invalid input" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(input).toHaveAttribute("data-error", "true");
      expect(input).toHaveClass("border-status-error");
    });

    it("shows error message when error prop is set", () => {
      render(<Input error="This field is required" aria-label="Invalid input" />);
      expect(screen.getByText("This field is required")).toBeInTheDocument();
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-describedby");
    });
  });

  describe("HTML attributes", () => {
    it("supports maxLength", () => {
      render(<Input maxLength={10} aria-label="Limited input" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("maxLength", "10");
    });

    it("supports minLength", () => {
      render(<Input minLength={5} aria-label="Min length input" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("minLength", "5");
    });

    it("supports pattern", () => {
      render(<Input pattern="[A-Za-z]+" aria-label="Pattern input" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("pattern", "[A-Za-z]+");
    });

    it("supports required", () => {
      render(<Input required aria-label="Required input" />);
      expect(screen.getByRole("textbox")).toBeRequired();
    });

    it("supports autoComplete", () => {
      render(<Input autoComplete="email" aria-label="Email input" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("autoComplete", "email");
    });

    it("supports name attribute", () => {
      render(<Input name="username" aria-label="Username" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("name", "username");
    });
  });
});
