import { figma } from "@figma/code-connect";

import { ChatFullWidthTemplate } from "./ChatFullWidthTemplate";

/**
 * Figma Code Connect mapping for ChatFullWidthTemplate
 *
 * Figma: https://www.figma.com/file/<file-key>?node-id=<node-id>
 *
 * This template maps to the "Chat (Full Width)" component in Figma.
 */
figma.connect(ChatFullWidthTemplate, {
  // Component name in Figma (update with actual Figma component name)
  figmaNode: {
    // Replace with actual Figma component name when linked
    // Example: "Chat / Full Width"
    name: "Chat Full Width",
  },

  // Map Figma variants/slots to React props
  props: {
    header: figma.string("Header content"),
    body: figma.string("Body content"),
    footer: figma.string("Footer content"),
  },

  // Example for the Figma plugin
  example: (
    <ChatFullWidthTemplate
      header={<div>Chat Header</div>}
      body={<div>Chat Messages</div>}
      footer={<div>Chat Input</div>}
    />
  ),
});
