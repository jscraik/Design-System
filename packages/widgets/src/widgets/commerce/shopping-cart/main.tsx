import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../../styles/widget.css";

import { ShoppingCart } from "./shopping-cart";

const root = document.getElementById("root");
if (!root) {
  throw new Error('service:"widgets-commerce-shopping-cart" Root element "#root" not found');
}

createRoot(root).render(
  <StrictMode>
    <ShoppingCart />
  </StrictMode>,
);
