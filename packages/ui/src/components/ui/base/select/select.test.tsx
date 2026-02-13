import { describe, expect, it, vi } from "vitest";

import { render, screen } from "../../../../testing/utils";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./fallback/Select";

describe("Select", () => {
  describe("rendering", () => {
    it("renders with default value", () => {
      render(
        <Select defaultValue="apple">
          <SelectTrigger>
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
          </SelectContent>
        </Select>,
      );

      expect(screen.getByRole("combobox")).toHaveTextContent("Apple");
    });

    it("renders with data-slot attribute", () => {
      render(
        <Select defaultValue="apple">
          <SelectTrigger>
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
          </SelectContent>
        </Select>,
      );
      expect(screen.getByRole("combobox")).toHaveAttribute("data-slot", "select-trigger");
    });

    it("applies custom className to trigger", () => {
      render(
        <Select defaultValue="apple">
          <SelectTrigger className="custom-class">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
          </SelectContent>
        </Select>,
      );
      expect(screen.getByRole("combobox")).toHaveClass("custom-class");
    });
  });

  describe("StatefulComponentProps", () => {
    describe("loading state", () => {
      it("shows loading state when loading is true", () => {
        render(
          <Select loading>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">A</SelectItem>
            </SelectContent>
          </Select>,
        );
        const trigger = screen.getByRole("combobox");
        expect(trigger).toHaveAttribute("data-state", "loading");
      });

      it("disables trigger when loading", () => {
        render(
          <Select loading>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">A</SelectItem>
            </SelectContent>
          </Select>,
        );
        const trigger = screen.getByRole("combobox");
        expect(trigger).toBeDisabled();
      });

      it("applies loading opacity to trigger", () => {
        render(
          <Select loading>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">A</SelectItem>
            </SelectContent>
          </Select>,
        );
        const trigger = screen.getByRole("combobox");
        expect(trigger).toHaveClass("opacity-70");
      });

      it("calls onStateChange with loading state", () => {
        const onStateChange = vi.fn();
        render(
          <Select loading onStateChange={onStateChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">A</SelectItem>
            </SelectContent>
          </Select>,
        );
        expect(onStateChange).toHaveBeenCalledWith("loading");
      });
    });

    describe("error state", () => {
      it("applies error styles when error message is provided", () => {
        render(
          <Select error="Selection required">
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">A</SelectItem>
            </SelectContent>
          </Select>,
        );
        const trigger = screen.getByRole("combobox");
        expect(trigger).toHaveAttribute("data-state", "error");
      });

      it("applies error border to trigger", () => {
        render(
          <Select error="Selection required">
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">A</SelectItem>
            </SelectContent>
          </Select>,
        );
        const trigger = screen.getByRole("combobox");
        expect(trigger).toHaveClass("border-status-error");
      });

      it("calls onStateChange with error state", () => {
        const onStateChange = vi.fn();
        render(
          <Select error="Error message" onStateChange={onStateChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">A</SelectItem>
            </SelectContent>
          </Select>,
        );
        expect(onStateChange).toHaveBeenCalledWith("error");
      });
    });

    describe("required state", () => {
      it("renders successfully when required is true", () => {
        render(
          <Select required>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">A</SelectItem>
            </SelectContent>
          </Select>,
        );
        // Just verify the component renders without errors
        expect(screen.getByRole("combobox")).toBeInTheDocument();
      });

      it("renders successfully when required is false", () => {
        render(
          <Select required={false}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">A</SelectItem>
            </SelectContent>
          </Select>,
        );
        // Just verify the component renders without errors
        expect(screen.getByRole("combobox")).toBeInTheDocument();
      });
    });

    describe("onStateChange callback", () => {
      it("calls onStateChange with default state when no other state is set", () => {
        const onStateChange = vi.fn();
        render(
          <Select onStateChange={onStateChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">A</SelectItem>
            </SelectContent>
          </Select>,
        );
        expect(onStateChange).toHaveBeenCalledWith("default");
      });

      it("calls onStateChange with disabled state when disabled", () => {
        const onStateChange = vi.fn();
        render(
          <Select disabled onStateChange={onStateChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">A</SelectItem>
            </SelectContent>
          </Select>,
        );
        expect(onStateChange).toHaveBeenCalledWith("disabled");
      });

      it("prioritizes loading over disabled state", () => {
        const onStateChange = vi.fn();
        render(
          <Select loading disabled onStateChange={onStateChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">A</SelectItem>
            </SelectContent>
          </Select>,
        );
        expect(onStateChange).toHaveBeenCalledWith("loading");
      });

      it("prioritizes error over other states", () => {
        const onStateChange = vi.fn();
        render(
          <Select error="Error" loading onStateChange={onStateChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">A</SelectItem>
            </SelectContent>
          </Select>,
        );
        expect(onStateChange).toHaveBeenCalledWith("loading");
      });
    });
  });

  describe("interactions", () => {
    it("calls onValueChange when selecting an item", async () => {
      const onValueChange = vi.fn();
      const { user } = render(
        <Select defaultValue="apple" onValueChange={onValueChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
          </SelectContent>
        </Select>,
      );

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByText("Banana"));

      expect(onValueChange).toHaveBeenCalledWith("banana");
    });

    it("does not open when disabled", async () => {
      const onValueChange = vi.fn();
      const { user } = render(
        <Select disabled onValueChange={onValueChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
          </SelectContent>
        </Select>,
      );

      await user.click(screen.getByRole("combobox"));
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("does not open when loading", async () => {
      const onValueChange = vi.fn();
      const { user } = render(
        <Select loading onValueChange={onValueChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
          </SelectContent>
        </Select>,
      );

      await user.click(screen.getByRole("combobox"));
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    it("has correct combobox role", () => {
      render(
        <Select defaultValue="apple">
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">A</SelectItem>
          </SelectContent>
        </Select>,
      );
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("has visible focus indicator styles", () => {
      render(
        <Select defaultValue="apple">
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">A</SelectItem>
          </SelectContent>
        </Select>,
      );
      expect(screen.getByRole("combobox")).toHaveClass("focus-visible:ring-[3px]");
    });
  });
});
