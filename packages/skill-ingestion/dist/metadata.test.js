import { describe, expect, it } from "vitest";
import { formatTitle, parseMetadata, stripFrontmatter } from "./metadata.js";
describe("metadata parsing", () => {
    it("parses frontmatter name and description", () => {
        const input = `---
name: sample-skill
description: This is a test skill.
---
# Heading
Body text
`;
        const parsed = parseMetadata(input);
        expect(parsed.name).toBe("sample-skill");
        expect(parsed.description).toBe("This is a test skill.");
    });
    it("falls back to first heading and paragraph", () => {
        const input = `# My Title
First paragraph line.

Second line.`;
        const parsed = parseMetadata(input);
        expect(parsed.name).toBe("My Title");
        expect(parsed.description).toBe("First paragraph line.");
    });
    it("strips frontmatter", () => {
        const input = `---
name: foo
---
Content line
`;
        expect(stripFrontmatter(input)).toBe("Content line");
    });
    it("formats titles", () => {
        expect(formatTitle("my-skill_name")).toBe("My Skill Name");
    });
});
