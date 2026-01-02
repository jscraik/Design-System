import { describe, expect, it, vi } from "vitest";

import { render, screen } from "../../../../testing/utils";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select";

describe("Select", () => {
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
});
