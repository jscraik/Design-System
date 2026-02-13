import { describe, expect, it } from "vitest";

import { templatesGalleryCategories, templatesGalleryRegistry } from "./templates-gallery";

describe("templatesGalleryRegistry", () => {
  it("includes unique template IDs", () => {
    const ids = templatesGalleryRegistry.map((template) => template.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("includes valid categories", () => {
    const categoryKeys = new Set(Object.keys(templatesGalleryCategories));
    const invalid = templatesGalleryRegistry.filter(
      (template) => !categoryKeys.has(template.category),
    );

    expect(invalid).toEqual([]);
  });

  it("defines a component for every template", () => {
    const missing = templatesGalleryRegistry.filter((template) => !template.Component);
    expect(missing).toEqual([]);
  });
});
