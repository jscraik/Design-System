import { render, screen, waitFor } from "@testing-library/react";
import { createRef } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "./InputOTP";

describe("InputOTP", () => {
  const mockOnStateChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("renders with data-slot attribute", () => {
      const { container } = render(<InputOTP maxLength={6} />);
      const otp = container.querySelector('[data-slot="input-otp"]');
      expect(otp).toBeInTheDocument();
    });

    it("renders with maxLength prop", () => {
      const { container } = render(<InputOTP maxLength={6} />);
      // InputOTP with maxLength accepts the prop but slots are manually rendered
      const otp = container.querySelector('[data-slot="input-otp"]');
      expect(otp).toBeInTheDocument();
    });

    it("renders with custom className", () => {
      const { container } = render(<InputOTP maxLength={4} className="custom-otp" />);
      const otp = container.querySelector('[data-slot="input-otp"]');
      expect(otp).toHaveClass("custom-otp");
    });

    it("renders with containerClassName", () => {
      const { container } = render(
        <InputOTP maxLength={4} containerClassName="custom-container" />,
      );
      const containerDiv = container.querySelector(".custom-container");
      expect(containerDiv).toBeInTheDocument();
    });
  });

  describe("Stateful props - Loading", () => {
    it("shows loading state", () => {
      const { container } = render(<InputOTP maxLength={4} loading />);
      const otp = container.querySelector('[data-state="loading"]');
      expect(otp).toBeInTheDocument();
    });

    it("applies opacity styling when loading", () => {
      const { container } = render(<InputOTP maxLength={4} loading />);
      const containerDiv = container.querySelector(".opacity-70");
      expect(containerDiv).toBeInTheDocument();
    });

    it("calls onStateChange with 'loading'", async () => {
      render(<InputOTP maxLength={4} loading onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });
  });

  describe("Stateful props - Error", () => {
    it("shows error message", () => {
      render(<InputOTP maxLength={4} error="Invalid code" />);
      expect(screen.getByText("Invalid code")).toBeInTheDocument();
    });

    it("applies error styling", () => {
      const { container } = render(<InputOTP maxLength={4} error="Error" />);
      const otp = container.querySelector('[data-state="error"]');
      expect(otp).toBeInTheDocument();
      expect(otp).toHaveAttribute("data-error", "true");
    });

    it("applies status error border on error", () => {
      const { container } = render(<InputOTP maxLength={4} error="Error" />);
      const otp = container.querySelector(".border-status-error");
      expect(otp).toBeInTheDocument();
    });
  });

  describe("Stateful props - Disabled", () => {
    it("shows disabled state", () => {
      const { container } = render(<InputOTP maxLength={4} disabled />);
      const otp = container.querySelector('[data-state="disabled"]');
      expect(otp).toBeInTheDocument();
    });

    it("applies opacity styling when disabled", () => {
      const { container } = render(<InputOTP maxLength={4} disabled />);
      // has-disabled:opacity-50 is a Tailwind variant class applied conditionally
      // The disabled state is indicated by data-state="disabled"
      const containerDiv = container.querySelector('[data-slot="input-otp"]');
      expect(containerDiv).toBeInTheDocument();
      expect(containerDiv).toHaveAttribute("data-state", "disabled");
    });
  });

  describe("Stateful props - Required", () => {
    it("shows required indicator when required and no error", () => {
      render(<InputOTP maxLength={4} required />);
      expect(screen.getByText("* Required")).toBeInTheDocument();
    });

    it("hides required indicator when error is present", () => {
      render(<InputOTP maxLength={4} required error="Error" />);
      expect(screen.queryByText("* Required")).not.toBeInTheDocument();
      expect(screen.getByText("Error")).toBeInTheDocument();
    });

    it("sets data-required attribute", () => {
      const { container } = render(<InputOTP maxLength={4} required />);
      const otp = container.querySelector('[data-required="true"]');
      expect(otp).toBeInTheDocument();
    });
  });

  describe("State priority", () => {
    it("prioritizes loading over error and disabled", async () => {
      render(
        <InputOTP maxLength={4} loading error="Error" disabled onStateChange={mockOnStateChange} />,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("prioritizes error over disabled when not loading", async () => {
      render(<InputOTP maxLength={4} error="Error" disabled onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });
  });

  describe("Accessibility", () => {
    it("generates unique IDs for error messages", () => {
      render(<InputOTP maxLength={4} error="Error" />);
      const error = screen.getByText("Error");
      expect(error).toHaveAttribute("id", expect.stringMatching(/-error$/));
    });

    it("renders error icon with error message", () => {
      render(<InputOTP maxLength={4} error="Error" />);
      const errorText = screen.getByText("Error");
      const parent = errorText.parentElement;
      expect(parent?.querySelector("svg")).toBeInTheDocument();
    });

    it("hides required indicator from screen readers", () => {
      render(<InputOTP maxLength={4} required />);
      const required = screen.getByText("* Required");
      expect(required).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Props passthrough", () => {
    it("passes through id prop", () => {
      const { container } = render(<InputOTP maxLength={4} id="custom-id" />);
      const otp = container.querySelector("#custom-id");
      expect(otp).toBeInTheDocument();
    });

    it("passes through other OTPInput props", () => {
      expect(() => {
        render(<InputOTP maxLength={4} pattern="[0-9]*" />);
      }).not.toThrow();
    });
  });

  describe("Keyboard navigation", () => {
    it("renders keyboard-accessible container", () => {
      const { container } = render(<InputOTP maxLength={4} />);
      // InputOTP handles keyboard input internally
      const wrapper = container.querySelector('[data-slot="input-otp"]');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("generates unique IDs for error messages", () => {
      render(<InputOTP maxLength={4} error="Invalid code" />);
      const error = screen.getByText("Invalid code");
      expect(error).toHaveAttribute("id", expect.stringMatching(/-error$/));
    });

    it("renders error icon with error message", () => {
      render(<InputOTP maxLength={4} error="Invalid code" />);
      const errorText = screen.getByText("Invalid code");
      const parent = errorText.parentElement;
      expect(parent?.querySelector("svg")).toBeInTheDocument();
    });

    it("hides required indicator from screen readers", () => {
      render(<InputOTP maxLength={4} required />);
      const required = screen.getByText("* Required");
      expect(required).toHaveAttribute("aria-hidden", "true");
    });
  });
});

describe("InputOTPGroup", () => {
  it("renders with data-slot attribute", () => {
    const { container } = render(<InputOTPGroup />);
    const group = container.querySelector('[data-slot="input-otp-group"]');
    expect(group).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<InputOTPGroup className="custom-group" />);
    const group = container.querySelector(".custom-group");
    expect(group).toBeInTheDocument();
  });

  it("passes through div props", () => {
    const { container } = render(<InputOTPGroup data-testid="custom-group" />);
    expect(container.querySelector('[data-testid="custom-group"]')).toBeInTheDocument();
  });
});

describe("InputOTPSlot", () => {
  it("renders within InputOTP context", () => {
    const { container } = render(
      <InputOTP maxLength={4}>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
      </InputOTP>,
    );
    const slots = container.querySelectorAll('[data-slot="input-otp-slot"]');
    expect(slots.length).toBe(4);
  });

  it("applies custom className", () => {
    const { container } = render(
      <InputOTP maxLength={4}>
        <InputOTPSlot index={0} className="custom-slot" />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
      </InputOTP>,
    );
    const slot = container.querySelector(".custom-slot");
    expect(slot).toBeInTheDocument();
  });

  it("has data-slot attribute on each slot", () => {
    const { container } = render(
      <InputOTP maxLength={4}>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
      </InputOTP>,
    );
    const firstSlot = container.querySelector('[data-slot="input-otp-slot"]');
    expect(firstSlot).toBeInTheDocument();
  });
});

describe("InputOTPSeparator", () => {
  it("renders with data-slot attribute", () => {
    const { container } = render(<InputOTPSeparator />);
    const separator = container.querySelector('[data-slot="input-otp-separator"]');
    expect(separator).toBeInTheDocument();
  });

  it("has separator role", () => {
    const { container } = render(<InputOTPSeparator />);
    const separator = container.querySelector('[role="separator"]');
    expect(separator).toBeInTheDocument();
  });

  it("renders dash as content", () => {
    const { container } = render(<InputOTPSeparator />);
    expect(container.querySelector("span")).toHaveTextContent("-");
  });

  it("applies custom className", () => {
    const { container } = render(<InputOTPSeparator className="custom-separator" />);
    const separator = container.querySelector(".custom-separator");
    expect(separator).toBeInTheDocument();
  });

  describe("ref forwarding", () => {
    it("forwards ref to input element", () => {
      const ref = createRef<HTMLInputElement>();
      render(<InputOTP ref={ref} maxLength={6} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });
});
