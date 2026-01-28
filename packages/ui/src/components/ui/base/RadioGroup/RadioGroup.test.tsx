import { describe, expect, it, vi } from "vitest";

import { expectFocused, render, screen } from "../../../../testing/utils";

import { RadioGroup, RadioGroupItem } from "./fallback/RadioGroup";

describe("RadioGroup", () => {
  describe("rendering", () => {
    it("renders with default props", () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" />
          <RadioGroupItem value="option2" />
        </RadioGroup>,
      );
      expect(screen.getAllByRole("radio")).toHaveLength(2);
    });

    it("renders with data-slot attribute", () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" />
        </RadioGroup>,
      );
      expect(screen.getByRole("radiogroup")).toHaveAttribute("data-slot", "radio-group");
      expect(screen.getByRole("radio")).toHaveAttribute("data-slot", "radio-group-item");
    });

    it("applies custom className to group", () => {
      render(
        <RadioGroup className="custom-class">
          <RadioGroupItem value="option1" />
        </RadioGroup>,
      );
      expect(screen.getByRole("radiogroup")).toHaveClass("custom-class");
    });

    it("applies custom className to item", () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" className="item-class" />
        </RadioGroup>,
      );
      expect(screen.getByRole("radio")).toHaveClass("item-class");
    });
  });

  describe("StatefulComponentProps", () => {
    describe("loading state", () => {
      it("shows loading state when loading is true", () => {
        render(
          <RadioGroup loading aria-label="Loading radio group">
            <RadioGroupItem value="option1" />
          </RadioGroup>,
        );
        const radioGroup = screen.getByRole("radiogroup");
        expect(radioGroup).toHaveAttribute("data-state", "loading");
      });

      it("disables all items when group is loading", () => {
        render(
          <RadioGroup loading>
            <RadioGroupItem value="option1" />
            <RadioGroupItem value="option2" />
          </RadioGroup>,
        );

        screen.getAllByRole("radio").forEach((radio) => {
          expect(radio).toBeDisabled();
        });
      });

      it("calls onStateChange with loading state", () => {
        const onStateChange = vi.fn();
        render(
          <RadioGroup loading onStateChange={onStateChange} aria-label="Loading radio group">
            <RadioGroupItem value="option1" />
          </RadioGroup>,
        );
        expect(onStateChange).toHaveBeenCalledWith("loading");
      });
    });

    describe("error state", () => {
      it("applies error styles when error message is provided", () => {
        render(
          <RadioGroup error="Selection required" aria-label="Error radio group">
            <RadioGroupItem value="option1" />
          </RadioGroup>,
        );
        const radioGroup = screen.getByRole("radiogroup");
        expect(radioGroup).toHaveAttribute("data-state", "error");
        expect(radioGroup).toHaveAttribute("data-error", "true");
      });

      it("calls onStateChange with error state", () => {
        const onStateChange = vi.fn();
        render(
          <RadioGroup
            error="Error message"
            onStateChange={onStateChange}
            aria-label="Error radio group"
          >
            <RadioGroupItem value="option1" />
          </RadioGroup>,
        );
        expect(onStateChange).toHaveBeenCalledWith("error");
      });
    });

    describe("required state", () => {
      it("sets data-required attribute when required is true", () => {
        render(
          <RadioGroup required aria-label="Required radio group">
            <RadioGroupItem value="option1" />
          </RadioGroup>,
        );
        expect(screen.getByRole("radiogroup")).toHaveAttribute("data-required", "true");
      });

      it("sets native required attribute when required is true", () => {
        render(
          <RadioGroup required aria-label="Required radio group">
            <RadioGroupItem value="option1" />
          </RadioGroup>,
        );
        expect(screen.getByRole("radiogroup")).toBeRequired();
      });

      it("does not set data-required when required is false", () => {
        render(
          <RadioGroup required={false} aria-label="Optional radio group">
            <RadioGroupItem value="option1" />
          </RadioGroup>,
        );
        expect(screen.getByRole("radiogroup")).not.toHaveAttribute("data-required");
      });
    });

    describe("onStateChange callback", () => {
      it("calls onStateChange with default state when no other state is set", () => {
        const onStateChange = vi.fn();
        render(
          <RadioGroup onStateChange={onStateChange} aria-label="Test radio group">
            <RadioGroupItem value="option1" />
          </RadioGroup>,
        );
        expect(onStateChange).toHaveBeenCalledWith("default");
      });

      it("calls onStateChange with disabled state when disabled", () => {
        const onStateChange = vi.fn();
        render(
          <RadioGroup disabled onStateChange={onStateChange} aria-label="Disabled radio group">
            <RadioGroupItem value="option1" />
          </RadioGroup>,
        );
        expect(onStateChange).toHaveBeenCalledWith("disabled");
      });

      it("prioritizes loading over disabled state", () => {
        const onStateChange = vi.fn();
        render(
          <RadioGroup
            loading
            disabled
            onStateChange={onStateChange}
            aria-label="Loading disabled radio group"
          >
            <RadioGroupItem value="option1" />
          </RadioGroup>,
        );
        expect(onStateChange).toHaveBeenCalledWith("loading");
      });

      it("prioritizes error over other states", () => {
        const onStateChange = vi.fn();
        render(
          <RadioGroup
            error="Error"
            loading
            onStateChange={onStateChange}
            aria-label="Error loading radio group"
          >
            <RadioGroupItem value="option1" />
          </RadioGroup>,
        );
        expect(onStateChange).toHaveBeenCalledWith("loading");
      });
    });
  });

  describe("selection", () => {
    it("selects item when clicked", async () => {
      const onChange = vi.fn();
      const { user } = render(
        <RadioGroup onValueChange={onChange}>
          <RadioGroupItem value="option1" />
          <RadioGroupItem value="option2" />
        </RadioGroup>,
      );

      await user.click(screen.getAllByRole("radio")[0]);
      expect(onChange).toHaveBeenCalledWith("option1");
    });

    it("shows selected state with defaultValue", () => {
      render(
        <RadioGroup defaultValue="option2">
          <RadioGroupItem value="option1" />
          <RadioGroupItem value="option2" />
        </RadioGroup>,
      );

      const radios = screen.getAllByRole("radio");
      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).toBeChecked();
    });

    it("shows selected state with controlled value", () => {
      render(
        <RadioGroup value="option1">
          <RadioGroupItem value="option1" />
          <RadioGroupItem value="option2" />
        </RadioGroup>,
      );

      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toBeChecked();
      expect(radios[1]).not.toBeChecked();
    });
  });

  describe("disabled state", () => {
    it("disables all items when group is disabled", () => {
      render(
        <RadioGroup disabled>
          <RadioGroupItem value="option1" />
          <RadioGroupItem value="option2" />
        </RadioGroup>,
      );

      screen.getAllByRole("radio").forEach((radio) => {
        expect(radio).toBeDisabled();
      });
    });

    it("disables individual item", () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" disabled />
          <RadioGroupItem value="option2" />
        </RadioGroup>,
      );

      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toBeDisabled();
      expect(radios[1]).not.toBeDisabled();
    });

    it("does not trigger onChange when disabled", async () => {
      const onChange = vi.fn();
      const { user } = render(
        <RadioGroup onValueChange={onChange} disabled>
          <RadioGroupItem value="option1" />
        </RadioGroup>,
      );

      await user.click(screen.getByRole("radio"));
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("keyboard navigation", () => {
    it("can be focused via keyboard", async () => {
      const { user } = render(
        <RadioGroup>
          <RadioGroupItem value="option1" />
          <RadioGroupItem value="option2" />
        </RadioGroup>,
      );

      await user.tab();
      expectFocused(screen.getAllByRole("radio")[0]);
    });

    it("navigates between items with arrow keys", async () => {
      const { user } = render(
        <RadioGroup>
          <RadioGroupItem value="option1" />
          <RadioGroupItem value="option2" />
        </RadioGroup>,
      );

      await user.tab();
      await user.keyboard("{ArrowDown}");
      expectFocused(screen.getAllByRole("radio")[1]);
    });

    it("selects item with Space key", async () => {
      const onChange = vi.fn();
      const { user } = render(
        <RadioGroup onValueChange={onChange}>
          <RadioGroupItem value="option1" />
          <RadioGroupItem value="option2" />
        </RadioGroup>,
      );

      await user.tab();
      await user.keyboard(" ");
      expect(onChange).toHaveBeenCalledWith("option1");
    });
  });

  describe("accessibility", () => {
    it("has correct radiogroup role", () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" />
        </RadioGroup>,
      );
      expect(screen.getByRole("radiogroup")).toBeInTheDocument();
    });

    it("has correct radio role for items", () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" />
        </RadioGroup>,
      );
      expect(screen.getByRole("radio")).toBeInTheDocument();
    });

    it("supports aria-label on group", () => {
      render(
        <RadioGroup aria-label="Select option">
          <RadioGroupItem value="option1" />
        </RadioGroup>,
      );
      expect(screen.getByRole("radiogroup")).toHaveAccessibleName("Select option");
    });

    it("has visible focus indicator styles", () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" />
        </RadioGroup>,
      );
      expect(screen.getByRole("radio")).toHaveClass("focus-visible:ring-ring/50");
    });
  });

  describe("orientation", () => {
    it("supports horizontal orientation", () => {
      render(
        <RadioGroup orientation="horizontal">
          <RadioGroupItem value="option1" />
          <RadioGroupItem value="option2" />
        </RadioGroup>,
      );
      expect(screen.getByRole("radiogroup")).toHaveAttribute("aria-orientation", "horizontal");
    });

    it("supports vertical orientation", () => {
      render(
        <RadioGroup orientation="vertical">
          <RadioGroupItem value="option1" />
          <RadioGroupItem value="option2" />
        </RadioGroup>,
      );
      expect(screen.getByRole("radiogroup")).toHaveAttribute("aria-orientation", "vertical");
    });
  });
});
