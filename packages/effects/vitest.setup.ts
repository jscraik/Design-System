import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

if (typeof globalThis.IntersectionObserver === "undefined") {
  class MockIntersectionObserver {
    constructor(private callback: IntersectionObserverCallback) {}
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }

  // @ts-expect-error - test-only polyfill
  globalThis.IntersectionObserver = MockIntersectionObserver;
}

afterEach(() => {
  cleanup();
});
