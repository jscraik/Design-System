import { setProjectAnnotations } from "@storybook/react-vite";
import { beforeAll } from "vitest";
import * as previewAnnotations from "./preview";

// Apply Storybook's preview annotations to all tests
const annotations = setProjectAnnotations([previewAnnotations]);

beforeAll(annotations.beforeAll);
