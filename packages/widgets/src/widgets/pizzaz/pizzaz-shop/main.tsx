import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../../styles/widget.css";

import { PizzazShop } from "./pizzaz-shop";

const root = document.getElementById("root");
if (!root) {
  throw new Error('service:"widgets/pizzaz-shop" Root element not found');
}

createRoot(root).render(
  <StrictMode>
    <PizzazShop />
  </StrictMode>,
);
