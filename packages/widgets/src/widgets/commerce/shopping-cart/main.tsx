import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../../styles/widget.css";

import { ShoppingCart } from "./shopping-cart";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ShoppingCart />
  </StrictMode>,
);
