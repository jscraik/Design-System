import { describe, expect, it } from "vitest";
import { bumpVersion } from "./publisher.js";

describe("bumpVersion", () => {
  it("increments patch by default", () => {
    expect(bumpVersion("1.2.3", "patch")).toBe("1.2.4");
  });

  it("increments minor and resets patch", () => {
    expect(bumpVersion("1.2.3", "minor")).toBe("1.3.0");
  });

  it("increments major and resets others", () => {
    expect(bumpVersion("1.2.3", "major")).toBe("2.0.0");
  });

  it("returns null for invalid input", () => {
    expect(bumpVersion("abc", "patch")).toBeNull();
  });
});
