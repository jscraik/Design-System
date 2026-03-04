import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("alias theme cascade", () => {
  it("ensures dark theme aliases can override :root defaults", () => {
    const aliasesCss = readFileSync(resolve(process.cwd(), "src/aliases.css"), "utf8");

    const lightSelector = ':root,\n:where([data-theme="light"]) {';
    const darkSelector = ':root[data-theme="dark"],\n:where([data-theme="dark"]) {';

    expect(aliasesCss).toContain(lightSelector);
    expect(aliasesCss).toContain(darkSelector);
    expect(aliasesCss.indexOf(darkSelector)).toBeGreaterThan(aliasesCss.indexOf(lightSelector));
  });
});
