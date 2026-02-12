var t = Object.defineProperty;
var s = (r, o) => t(r, "name", { value: o, configurable: !0 });
import { j as e } from "./react-vendor-B2kqhZVE.js";
import { B as a, I as i, T as l, C as n } from "./components-BTQJObmP.js";
function h() {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("h1", { children: "Category Imports Test" }),
    /* @__PURE__ */ e.jsx(a, { onClick: /* @__PURE__ */ s(() => console.log("clicked"), "onClick"), children: "Click Me" }),
    /* @__PURE__ */ e.jsx(i, { placeholder: "Type here..." }),
    /* @__PURE__ */ e.jsxs(l, { children: [
      /* @__PURE__ */ e.jsx("div", { children: "Tab 1" }),
      /* @__PURE__ */ e.jsx("div", { children: "Tab 2" })
    ] }),
    /* @__PURE__ */ e.jsx(n, { placeholder: "Send a message..." })
  ] });
}
s(h, "CategoryImportsApp");
export {
  h as default
};
