/**
 * Test App 3: Minimal Imports (Best Case)
 *
 * This simulates the absolute minimum - only what's needed.
 */

import { Button } from "./components";

export default function MinimalImportsApp() {
  return (
    <div>
      <h1>Minimal Imports Test</h1>
      <Button onClick={() => console.log("clicked")}>Just a Button</Button>
    </div>
  );
}
