import "../preview.css";

import type { Preview } from "@storybook/react-vite";
import React from "react";

import { HostProvider, createMockHost } from "@chatui/runtime";
import { AppsSDKUIProvider } from "@chatui/ui";

const host = createMockHost();

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
      <HostProvider host={host}>
        <AppsSDKUIProvider>
          <Story />
        </AppsSDKUIProvider>
      </HostProvider>
    ),
  ],

  tags: ["autodocs"]
};

export default preview;
