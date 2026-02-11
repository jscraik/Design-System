import { readdirSync } from "fs";
import { join } from "path";
import { describe, expect, it } from "vitest";
const SRC_ROOT = new URL("..", import.meta.url).pathname;
const SVG_ROOT = join(SRC_ROOT, "svg");
const listSvgFiles = (category) => {
    const dir = join(SVG_ROOT, category);
    return readdirSync(dir)
        .filter((entry) => entry.endsWith(".svg"))
        .map((entry) => ({ category, name: entry }));
};
describe("Icon category completeness", () => {
    it("ensures each icon is in exactly one category", () => {
        const categories = readdirSync(SVG_ROOT).filter((entry) => !entry.startsWith("."));
        const entries = categories.flatMap((category) => listSvgFiles(category));
        const seen = new Map();
        for (const entry of entries) {
            const existing = seen.get(entry.name) ?? [];
            existing.push(entry.category);
            seen.set(entry.name, existing);
        }
        const duplicates = [...seen.entries()].filter(([, cats]) => cats.length !== 1);
        expect(duplicates).toEqual([]);
    });
});
