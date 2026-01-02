import { figma } from "@figma/code-connect";

import { ChatTwoPaneTemplate } from "./ChatTwoPaneTemplate";

/**
 * Figma Code Connect mapping for ChatTwoPaneTemplate
 *
 * Figma: https://www.figma.com/file/<file-key>?node-id=<node-id>
 *
 * This template maps to the "Chat (Two Pane)" component in Figma.
 */
figma.connect(ChatTwoPaneTemplate, {
  figmaNode: {
    name: "Chat Two Pane",
  },

  props: {
    sidebar: figma.string("Sidebar content"),
    main: figma.string("Main chat area"),
  },

  example: (
    <ChatTwoPaneTemplate
      sidebar={<div>Chat Sidebar</div>}
      main={<div>Chat Main</div>}
    />
  ),
});
