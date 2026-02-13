import { figma } from "@figma/code-connect";

import { ChatInputTemplate } from "./ChatInputTemplate";

/**
 * Figma Code Connect mapping for ChatInputTemplate
 *
 * Figma: https://www.figma.com/file/<file-key>?node-id=<node-id>
 *
 * This template maps to the "Chat Input" component in Figma.
 */
figma.connect(ChatInputTemplate, {
  figmaNode: {
    name: "Chat Input",
  },

  props: {
    placeholder: figma.string("Input placeholder text"),
    disabled: figma.boolean("Disabled state"),
    attachmentsEnabled: figma.boolean("Show attachment button"),
  },

  example: (
    <ChatInputTemplate
      placeholder="Message ChatGPT..."
      disabled={false}
      attachmentsEnabled={true}
    />
  ),
});
