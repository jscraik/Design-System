import { createRoot } from "react-dom/client";

import "../styles/widget.css";
import "./kitchen-sink-lite.css";

import KitchenSinkLite from "./kitchen-sink-lite";

const root = document.getElementById("kitchen-sink-lite-root");

if (root) {
  createRoot(root).render(<KitchenSinkLite />);
}
