#!/usr/bin/env node

/**
 * Property-Based Tests for Template Preview Resilience
 *
 * Tests Property 7: Preview Resilience
 * Validates: Requirement 12.1
 */

import fc from "fast-check";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { vi } from "vitest";

vi.mock("@design-studio/ui", () => ({
  AppsSDKButton: ({ children }) => React.createElement("button", null, children),
}));

const { TemplateHost } = await import("../src/components/template-browser/TemplateHost.tsx");

const safeTextArb = fc
  .stringOf(fc.constantFrom(..."abcdefghijklmnopqrstuvwxyz0123456789 -_".split("")), {
    minLength: 1,
    maxLength: 40,
  })
  .filter((value) => value.trim().length > 0);

describe("Template Preview Resilience Property", () => {
  test("Property 7: TemplateHost renders a resilient fallback on error", () => {
    fc.assert(
      fc.property(safeTextArb, safeTextArb, (templateId, message) => {
        const instance = new TemplateHost({ templateId, children: null });
        instance.state = { error: new Error(message), info: null, copied: false };

        const element = instance.render();
        expect(React.isValidElement(element)).toBe(true);

        const markup = renderToStaticMarkup(element);
        expect(markup).toContain(message);
        expect(markup).toContain(templateId);
      }),
      { numRuns: 25, timeout: 5000 },
    );
  });

  test("Property 7: TemplateHost renders children when no error", () => {
    const templateId = "template-ok";
    const child = React.createElement("div", { "data-testid": "ok" }, "OK");
    const instance = new TemplateHost({ templateId, children: child });
    instance.state = { error: null, info: null, copied: false };

    const element = instance.render();
    const markup = renderToStaticMarkup(element);
    expect(markup).toContain("OK");
  });

  test("Property 7: getDerivedStateFromError stores the error", () => {
    fc.assert(
      fc.property(safeTextArb, (message) => {
        const error = new Error(message);
        const state = TemplateHost.getDerivedStateFromError(error);
        expect(state).toEqual({ error, info: null, copied: false });
      }),
      { numRuns: 15, timeout: 3000 },
    );
  });
});
