/**
 * Test App 2: Multiple Import Statements
 *
 * This simulates the per-component import pattern (the anti-pattern):
 * import { Button } from "@design-studio/ui/base/Button";
 * import { Input } from "@design-studio/ui/base/Input";
 *
 * Note: In real implementation, these would be separate files.
 * For prototype, we use multiple import statements from the same file.
 */

import { Button } from "./components";
import { Input } from "./components";
import { Tabs } from "./components";
import { ChatInput } from "./components";

export default function PerComponentImportsApp() {
  return (
    <div>
      <h1>Per-Component Imports Test</h1>
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
