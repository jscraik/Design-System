import "../preview.css";

import type { Preview } from "@storybook/react";
import React from "react";

import { AppsSDKUIProvider } from "@openai/apps-sdk-ui/components/AppsSDKUIProvider";
import { ensureMockOpenAI } from "@chatui/runtime";

ensureMockOpenAI();

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <AppsSDKUIProvider>
        <Story />
      </AppsSDKUIProvider>
    ),
  ],
};

export default preview;
