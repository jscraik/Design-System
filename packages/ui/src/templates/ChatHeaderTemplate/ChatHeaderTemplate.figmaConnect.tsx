import { figma } from "@figma/code-connect";

import { ChatHeaderTemplate } from "./ChatHeaderTemplate";

/**
 * Figma Code Connect mapping for ChatHeaderTemplate
 *
 * Figma: https://www.figma.com/file/<file-key>?node-id=<node-id>
 *
 * This template maps to the "Chat Header" component in Figma.
 */
figma.connect(ChatHeaderTemplate, {
  figmaNode: {
    name: "Chat Header",
  },

  props: {
    title: figma.string("Chat title"),
    subtitle: figma.string("Optional subtitle"),
    actions: figma.children("Action buttons"),
  },

  example: (
    <ChatHeaderTemplate
      title="ChatGPT"
      subtitle="Model: GPT-4"
      actions={<div>Actions</div>}
    />
  ),
});
