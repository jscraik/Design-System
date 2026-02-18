var n = Object.defineProperty;
var t = (i, s) => n(i, "name", { value: s, configurable: !0 });
import { j as o } from "./react-vendor-B2kqhZVE.js";
import { B as r } from "./components-BTQJObmP.js";
function c() {
  return /* @__PURE__ */ o.jsxs("div", { children: [
    /* @__PURE__ */ o.jsx("h1", { children: "Minimal Imports Test" }),
    /* @__PURE__ */ o.jsx(r, { onClick: /* @__PURE__ */ t(() => console.log("clicked"), "onClick"), children: "Just a Button" })
  ] });
}
t(c, "MinimalImportsApp");
export {
  c as default
};
