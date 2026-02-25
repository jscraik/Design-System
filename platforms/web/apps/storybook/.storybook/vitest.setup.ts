import { setProjectAnnotations } from "@storybook/react-vite";
import { beforeAll, vi } from "vitest";
import * as previewAnnotations from "./preview";

// Apply Storybook's preview annotations to all tests
const annotations = setProjectAnnotations([previewAnnotations]);

// Work around Vitest transform/runtime issue in @openai/apps-sdk-ui Icon export set
// (named export `Object` can trigger TDZ failures when transformed in Storybook tests).
vi.mock("@openai/apps-sdk-ui/components/Icon", () => ({
  Download: () => null,
  Sparkles: () => null,
}));

beforeAll(annotations.beforeAll);
