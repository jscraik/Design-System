import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../../src/styles/widget.css";

import { AuthDemo } from "./auth-demo";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <StrictMode>
    <AuthDemo />
  </StrictMode>,
);
