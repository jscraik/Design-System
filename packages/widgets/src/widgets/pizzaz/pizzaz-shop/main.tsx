import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../../styles/widget.css";

import { PizzazShop } from "./pizzaz-shop";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PizzazShop />
  </StrictMode>,
);
