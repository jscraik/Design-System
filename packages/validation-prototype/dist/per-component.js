var o = Object.defineProperty;
var s = (r, n) => o(r, "name", { value: n, configurable: !0 });
import { j as e } from "./react-vendor-B2kqhZVE.js";
import { B as t, I as i, T as l, C as a } from "./components-BTQJObmP.js";
function h() {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("h1", { children: "Per-Component Imports Test" }),
    /* @__PURE__ */ e.jsx(t, { onClick: /* @__PURE__ */ s(() => console.log("clicked"), "onClick"), children: "Click Me" }),
    /* @__PURE__ */ e.jsx(i, { placeholder: "Type here..." }),
    /* @__PURE__ */ e.jsxs(l, { children: [
      /* @__PURE__ */ e.jsx("div", { children: "Tab 1" }),
      /* @__PURE__ */ e.jsx("div", { children: "Tab 2" })
    ] }),
    /* @__PURE__ */ e.jsx(a, { placeholder: "Send a message..." })
  ] });
}
s(h, "PerComponentImportsApp");
export {
  h as default
};
