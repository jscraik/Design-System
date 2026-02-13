/**
 * Test App 1: Category Imports
 *
 * This simulates the recommended DesignStudio import pattern:
 * import { Button, Input, Tabs } from "@design-studio/ui";
 */

import { Button, ChatInput, Input, Tabs } from "./components";

export default function CategoryImportsApp() {
  return (
    <div>
      <h1>Category Imports Test</h1>
      <Button onClick={() => console.log("clicked")}>Click Me</Button>
      <Input placeholder="Type here..." />
      <Tabs>
        <div>Tab 1</div>
        <div>Tab 2</div>
      </Tabs>
      <ChatInput placeholder="Send a message..." />
    </div>
  );
}
