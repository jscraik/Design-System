import { createRoot } from "react-dom/client";

import "../styles/widget.css";

import App from "./solar-system";

const root = document.getElementById("solar-system-root");

if (root) {
  createRoot(root).render(<App />);
}
