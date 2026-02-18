import { jsx as R, jsxs as yt, Fragment as Io } from "react/jsx-runtime";
import * as C from "react";
import { useState as nt, useRef as K, useEffect as it, createContext as wt, useContext as O, useId as Oo, useCallback as Qi, useLayoutEffect as jo, useMemo as re, useInsertionEffect as Ji, forwardRef as No, Fragment as ts, createElement as Uo, Component as $o } from "react";
import "react-dom";
function es(t) {
  var e, n, i = "";
  if (typeof t == "string" || typeof t == "number") i += t;
  else if (typeof t == "object") if (Array.isArray(t)) {
    var s = t.length;
    for (e = 0; e < s; e++) t[e] && (n = es(t[e])) && (i && (i += " "), i += n);
  } else for (n in t) t[n] && (i && (i += " "), i += n);
  return i;
}
function ns() {
  for (var t, e, n = 0, i = "", s = arguments.length; n < s; n++) (t = arguments[n]) && (e = es(t)) && (i && (i += " "), i += e);
  return i;
}
const Dn = (t) => typeof t == "boolean" ? `${t}` : t === 0 ? "0" : t, Mn = ns, St = (t, e) => (n) => {
  var i;
  if (e?.variants == null) return Mn(t, n?.class, n?.className);
  const { variants: s, defaultVariants: r } = e, o = Object.keys(s).map((u) => {
    const c = n?.[u], d = r?.[u];
    if (c === null) return null;
    const f = Dn(c) || Dn(d);
    return s[u][f];
  }), a = n && Object.entries(n).reduce((u, c) => {
    let [d, f] = c;
    return f === void 0 || (u[d] = f), u;
  }, {}), l = e == null || (i = e.compoundVariants) === null || i === void 0 ? void 0 : i.reduce((u, c) => {
    let { class: d, className: f, ...h } = c;
    return Object.entries(h).every((m) => {
      let [p, y] = m;
      return Array.isArray(y) ? y.includes({
        ...r,
        ...a
      }[p]) : {
        ...r,
        ...a
      }[p] === y;
    }) ? [
      ...u,
      d,
      f
    ] : u;
  }, []);
  return Mn(t, o, l, n?.class, n?.className);
};
function _o(t, e, { checkForDefaultPrevented: n = !0 } = {}) {
  return function(s) {
    if (t?.(s), n === !1 || !s.defaultPrevented)
      return e?.(s);
  };
}
var Ko = globalThis?.document ? C.useLayoutEffect : () => {
}, Wo = C[" useInsertionEffect ".trim().toString()] || Ko;
function Go({
  prop: t,
  defaultProp: e,
  onChange: n = () => {
  },
  caller: i
}) {
  const [s, r, o] = zo({
    defaultProp: e,
    onChange: n
  }), a = t !== void 0, l = a ? t : s;
  {
    const c = C.useRef(t !== void 0);
    C.useEffect(() => {
      const d = c.current;
      d !== a && console.warn(
        `${i} is changing from ${d ? "controlled" : "uncontrolled"} to ${a ? "controlled" : "uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
      ), c.current = a;
    }, [a, i]);
  }
  const u = C.useCallback(
    (c) => {
      if (a) {
        const d = Ho(c) ? c(t) : c;
        d !== t && o.current?.(d);
      } else
        r(c);
    },
    [a, t, r, o]
  );
  return [l, u];
}
function zo({
  defaultProp: t,
  onChange: e
}) {
  const [n, i] = C.useState(t), s = C.useRef(n), r = C.useRef(e);
  return Wo(() => {
    r.current = e;
  }, [e]), C.useEffect(() => {
    s.current !== n && (r.current?.(n), s.current = n);
  }, [n, s]), [n, i, r];
}
function Ho(t) {
  return typeof t == "function";
}
function Rn(t, e) {
  if (typeof t == "function")
    return t(e);
  t != null && (t.current = e);
}
function Yo(...t) {
  return (e) => {
    let n = !1;
    const i = t.map((s) => {
      const r = Rn(s, e);
      return !n && typeof r == "function" && (n = !0), r;
    });
    if (n)
      return () => {
        for (let s = 0; s < i.length; s++) {
          const r = i[s];
          typeof r == "function" ? r() : Rn(t[s], null);
        }
      };
  };
}
// @__NO_SIDE_EFFECTS__
function Xo(t) {
  const e = /* @__PURE__ */ qo(t), n = C.forwardRef((i, s) => {
    const { children: r, ...o } = i, a = C.Children.toArray(r), l = a.find(Qo);
    if (l) {
      const u = l.props.children, c = a.map((d) => d === l ? C.Children.count(u) > 1 ? C.Children.only(null) : C.isValidElement(u) ? u.props.children : null : d);
      return /* @__PURE__ */ R(e, { ...o, ref: s, children: C.isValidElement(u) ? C.cloneElement(u, void 0, c) : null });
    }
    return /* @__PURE__ */ R(e, { ...o, ref: s, children: r });
  });
  return n.displayName = `${t}.Slot`, n;
}
// @__NO_SIDE_EFFECTS__
function qo(t) {
  const e = C.forwardRef((n, i) => {
    const { children: s, ...r } = n;
    if (C.isValidElement(s)) {
      const o = tr(s), a = Jo(r, s.props);
      return s.type !== C.Fragment && (a.ref = i ? Yo(i, o) : o), C.cloneElement(s, a);
    }
    return C.Children.count(s) > 1 ? C.Children.only(null) : null;
  });
  return e.displayName = `${t}.SlotClone`, e;
}
var Zo = /* @__PURE__ */ Symbol("radix.slottable");
function Qo(t) {
  return C.isValidElement(t) && typeof t.type == "function" && "__radixId" in t.type && t.type.__radixId === Zo;
}
function Jo(t, e) {
  const n = { ...e };
  for (const i in e) {
    const s = t[i], r = e[i];
    /^on[A-Z]/.test(i) ? s && r ? n[i] = (...a) => {
      const l = r(...a);
      return s(...a), l;
    } : s && (n[i] = s) : i === "style" ? n[i] = { ...s, ...r } : i === "className" && (n[i] = [s, r].filter(Boolean).join(" "));
  }
  return { ...t, ...n };
}
function tr(t) {
  let e = Object.getOwnPropertyDescriptor(t.props, "ref")?.get, n = e && "isReactWarning" in e && e.isReactWarning;
  return n ? t.ref : (e = Object.getOwnPropertyDescriptor(t, "ref")?.get, n = e && "isReactWarning" in e && e.isReactWarning, n ? t.props.ref : t.props.ref || t.ref);
}
var er = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
], nr = er.reduce((t, e) => {
  const n = /* @__PURE__ */ Xo(`Primitive.${e}`), i = C.forwardRef((s, r) => {
    const { asChild: o, ...a } = s, l = o ? n : e;
    return typeof window < "u" && (window[/* @__PURE__ */ Symbol.for("radix-ui")] = !0), /* @__PURE__ */ R(l, { ...a, ref: r });
  });
  return i.displayName = `Primitive.${e}`, { ...t, [e]: i };
}, {}), is = "Toggle", ss = C.forwardRef((t, e) => {
  const { pressed: n, defaultPressed: i, onPressedChange: s, ...r } = t, [o, a] = Go({
    prop: n,
    onChange: s,
    defaultProp: i ?? !1,
    caller: is
  });
  return /* @__PURE__ */ R(
    nr.button,
    {
      type: "button",
      "aria-pressed": o,
      "data-state": o ? "on" : "off",
      "data-disabled": t.disabled ? "" : void 0,
      ...r,
      ref: e,
      onClick: _o(t.onClick, () => {
        t.disabled || a(!o);
      })
    }
  );
});
ss.displayName = is;
var ir = ss;
function Zc(t) {
  return `
    <svg style="position: absolute; width: 0; height: 0; overflow: hidden;" aria-hidden="true">
      <defs>
        <filter id="${t}">
          <feMorphology
            operator="dilate"
            radius="2"
            in="SourceGraphic"
            result="DILATED"
          />
          <feGaussianBlur
            stdDeviation="3"
            in="DILATED"
            result="BLURRED"
          />
          <feColorMatrix
            in="BLURRED"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            result="LIQUID"
          />
          <feBlend
            in="SourceGraphic"
            in2="LIQUID"
            mode="normal"
          />
        </filter>
      </defs>
    </svg>
  `;
}
function Qc(t) {
  return `
    <svg style="position: absolute; width: 0; height: 0; overflow: hidden;" aria-hidden="true">
      <defs>
        <filter id="${t}">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.01"
            numOctaves="3"
            result="NOISE"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="NOISE"
            scale="5"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  `;
}
function Jc(t) {
  return `${t}-filter-${Math.random().toString(36).substring(2, 9)}`;
}
const sr = {
  linear: "linear",
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  easeOut: "cubic-bezier(0, 0, 0.2, 1)",
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  // Custom spring-like easing
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  // Magnetic effect easing
  magnetic: "cubic-bezier(0.25, 0.46, 0.45, 0.94)"
}, td = {
  instant: 100,
  fast: 150,
  normal: 250,
  slow: 350,
  slower: 500
};
function ed(t, e) {
  return t ? 0 : e;
}
function nd(t, e, n = "easeOut") {
  return t.map((i) => `${i} ${e}ms ${sr[n]}`).join(", ");
}
function id(t, e) {
  return `
    animation: ${t} linear both;
    animation-timeline: view();
    animation-range: ${e.start * 100}% ${e.end * 100}%;
  `;
}
function ct(...t) {
  return ns(...t);
}
function sd(t = {}) {
  const { relative: e = !0, throttle: n = 16 } = t, [i, s] = nt({
    x: 0,
    y: 0,
    elementX: 0,
    elementY: 0
  }), r = K(null), o = K(0);
  return it(() => {
    const a = (l) => {
      const u = Date.now();
      if (n && u - o.current < n)
        return;
      o.current = u;
      const d = l.target.getBoundingClientRect();
      s({
        x: l.clientX,
        y: l.clientY,
        elementX: l.clientX - d.left,
        elementY: l.clientY - d.top
      });
    };
    return e && r.current ? (r.current.addEventListener("mousemove", a), () => {
      r.current?.removeEventListener("mousemove", a);
    }) : (document.addEventListener("mousemove", a), () => {
      document.removeEventListener("mousemove", a);
    });
  }, [e, n]), {
    ...i,
    elementRef: r
  };
}
function or(t = {}) {
  const { throttle: e = 16, element: n = window } = t, i = n === window, [s, r] = nt({
    scrollY: i ? window.scrollY : 0,
    scrollX: i ? window.scrollX : 0,
    scrollProgress: 0,
    direction: null
  });
  return it(() => {
    let o = i ? window.scrollY : 0, a = 0;
    const l = () => {
      const u = Date.now();
      if (e && u - a < e)
        return;
      a = u;
      const c = i ? window.scrollY : n.scrollTop, d = i ? window.scrollX : n.scrollLeft, f = c, h = i ? document.documentElement.scrollHeight - window.innerHeight : n.scrollHeight - n.clientHeight, m = h > 0 ? f / h : 0;
      r({
        scrollY: c,
        scrollX: d,
        scrollProgress: Math.min(1, Math.max(0, m)),
        direction: c > o ? "down" : c < o ? "up" : null
      }), o = c;
    };
    return n.addEventListener("scroll", l, { passive: !0 }), () => {
      n.removeEventListener("scroll", l);
    };
  }, [e, n, i]), s;
}
function At() {
  const [t, e] = nt(!1);
  return it(() => {
    const n = window.matchMedia("(prefers-reduced-motion: reduce)");
    e(n.matches);
    const i = (s) => {
      e(s.matches);
    };
    return n.addEventListener("change", i), () => {
      n.removeEventListener("change", i);
    };
  }, []), t;
}
const rr = St(
  "relative inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-foundation-bg-light-3 text-foundation-text-light-primary hover:bg-foundation-bg-light-4 data-[state=on]:bg-foundation-accent-green data-[state=on]:text-foundation-text-light-primary",
        outline: "border border-foundation-border-light bg-transparent hover:bg-foundation-bg-light-2 data-[state=on]:bg-foundation-accent-green data-[state=on]:text-foundation-text-light-primary data-[state=on]:border-transparent",
        ghost: "bg-transparent hover:bg-foundation-bg-light-2 data-[state=on]:bg-foundation-bg-light-3"
      },
      size: {
        sm: "h-8 px-3 text-xs",
        default: "h-9 px-4",
        lg: "h-11 px-6"
      },
      liquid: {
        none: "",
        subtle: "liquid-filter-active",
        full: "liquid-filter-active"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      liquid: "subtle"
    }
  }
);
function ar({
  pressed: t = !1,
  onPressedChange: e,
  variant: n = "default",
  size: i = "default",
  liquid: s = "subtle",
  disabled: r = !1,
  className: o,
  children: a,
  ariaLabel: l
}) {
  const [u] = nt(() => `liquid-filter-${Math.random().toString(36).substring(2, 9)}`), c = At(), d = s !== "none" && !c;
  return /* @__PURE__ */ yt(Io, { children: [
    d && /* @__PURE__ */ R(
      "svg",
      {
        style: { position: "absolute", width: 0, height: 0, overflow: "hidden" },
        "aria-hidden": "true",
        children: /* @__PURE__ */ R("defs", { children: /* @__PURE__ */ yt("filter", { id: u, children: [
          /* @__PURE__ */ R("feMorphology", { operator: "dilate", radius: "2", in: "SourceGraphic", result: "DILATED" }),
          /* @__PURE__ */ R("feGaussianBlur", { stdDeviation: "3", in: "DILATED", result: "BLURRED" }),
          /* @__PURE__ */ R(
            "feColorMatrix",
            {
              in: "BLURRED",
              type: "matrix",
              values: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7",
              result: "LIQUID"
            }
          ),
          /* @__PURE__ */ R("feBlend", { in: "SourceGraphic", in2: "LIQUID", mode: "normal" })
        ] }) })
      }
    ),
    /* @__PURE__ */ yt(
      ir,
      {
        pressed: t,
        onPressedChange: e,
        disabled: r,
        "aria-label": l,
        className: ct(
          rr({ variant: n, size: i, liquid: s }),
          d && "liquid-effect"
        ),
        style: d && s === "full" ? {
          filter: `url(#${u})`,
          transition: c ? "none" : void 0
        } : {
          transition: c ? "none" : void 0
        },
        children: [
          /* @__PURE__ */ R("span", { className: "relative z-10", children: a }),
          d && /* @__PURE__ */ R(
            "span",
            {
              className: ct(
                "absolute inset-0 rounded-md opacity-0 transition-opacity duration-300",
                t && "opacity-100"
              ),
              style: {
                background: "var(--foundation-accent-green)",
                animation: t && !c ? "liquid-morph 3s ease-in-out infinite" : void 0
              },
              "aria-hidden": "true"
            }
          )
        ]
      }
    )
  ] });
}
ar.displayName = "LiquidToggle";
const os = wt({});
function ze(t) {
  const e = K(null);
  return e.current === null && (e.current = t()), e.current;
}
const He = wt(null), ae = wt({
  transformPagePoint: (t) => t,
  isStatic: !1,
  reducedMotion: "never"
});
function lr(t = !0) {
  const e = O(He);
  if (e === null)
    return [!0, null];
  const { isPresent: n, onExitComplete: i, register: s } = e, r = Oo();
  it(() => {
    t && s(r);
  }, [t]);
  const o = Qi(() => t && i && i(r), [r, i, t]);
  return !n && i ? [!1, o] : [!0];
}
const Ye = typeof window < "u", Xe = Ye ? jo : it, N = /* @__NO_SIDE_EFFECTS__ */ (t) => t;
let Vt = N, tt = N;
process.env.NODE_ENV !== "production" && (Vt = (t, e) => {
  !t && typeof console < "u" && console.warn(e);
}, tt = (t, e) => {
  if (!t)
    throw new Error(e);
});
const ur = {
  useManualTiming: !1
};
function cr(t) {
  let e = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set(), i = !1, s = !1;
  const r = /* @__PURE__ */ new WeakSet();
  let o = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  };
  function a(u) {
    r.has(u) && (l.schedule(u), t()), u(o);
  }
  const l = {
    /**
     * Schedule a process to run on the next frame.
     */
    schedule: (u, c = !1, d = !1) => {
      const h = d && i ? e : n;
      return c && r.add(u), h.has(u) || h.add(u), u;
    },
    /**
     * Cancel the provided callback from running on the next frame.
     */
    cancel: (u) => {
      n.delete(u), r.delete(u);
    },
    /**
     * Execute all schedule callbacks.
     */
    process: (u) => {
      if (o = u, i) {
        s = !0;
        return;
      }
      i = !0, [e, n] = [n, e], e.forEach(a), e.clear(), i = !1, s && (s = !1, l.process(u));
    }
  };
  return l;
}
const zt = [
  "read",
  // Read
  "resolveKeyframes",
  // Write/Read/Write/Read
  "update",
  // Compute
  "preRender",
  // Compute
  "render",
  // Write
  "postRender"
  // Compute
], dr = 40;
function rs(t, e) {
  let n = !1, i = !0;
  const s = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  }, r = () => n = !0, o = zt.reduce((g, v) => (g[v] = cr(r), g), {}), { read: a, resolveKeyframes: l, update: u, preRender: c, render: d, postRender: f } = o, h = () => {
    const g = performance.now();
    n = !1, s.delta = i ? 1e3 / 60 : Math.max(Math.min(g - s.timestamp, dr), 1), s.timestamp = g, s.isProcessing = !0, a.process(s), l.process(s), u.process(s), c.process(s), d.process(s), f.process(s), s.isProcessing = !1, n && e && (i = !1, t(h));
  }, m = () => {
    n = !0, i = !0, s.isProcessing || t(h);
  };
  return { schedule: zt.reduce((g, v) => {
    const b = o[v];
    return g[v] = (S, x = !1, w = !1) => (n || m(), b.schedule(S, x, w)), g;
  }, {}), cancel: (g) => {
    for (let v = 0; v < zt.length; v++)
      o[zt[v]].cancel(g);
  }, state: s, steps: o };
}
const { schedule: A, cancel: q, state: k, steps: ye } = rs(typeof requestAnimationFrame < "u" ? requestAnimationFrame : N, !0), as = wt({ strict: !1 }), En = {
  animation: [
    "animate",
    "variants",
    "whileHover",
    "whileTap",
    "exit",
    "whileInView",
    "whileFocus",
    "whileDrag"
  ],
  exit: ["exit"],
  drag: ["drag", "dragControls"],
  focus: ["whileFocus"],
  hover: ["whileHover", "onHoverStart", "onHoverEnd"],
  tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
  pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
  inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
  layout: ["layout", "layoutId"]
}, vt = {};
for (const t in En)
  vt[t] = {
    isEnabled: (e) => En[t].some((n) => !!e[n])
  };
function fr(t) {
  for (const e in t)
    vt[e] = {
      ...vt[e],
      ...t[e]
    };
}
const hr = /* @__PURE__ */ new Set([
  "animate",
  "exit",
  "variants",
  "initial",
  "style",
  "values",
  "variants",
  "transition",
  "transformTemplate",
  "custom",
  "inherit",
  "onBeforeLayoutMeasure",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onDragStart",
  "onDrag",
  "onDragEnd",
  "onMeasureDragConstraints",
  "onDirectionLock",
  "onDragTransitionEnd",
  "_dragX",
  "_dragY",
  "onHoverStart",
  "onHoverEnd",
  "onViewportEnter",
  "onViewportLeave",
  "globalTapTarget",
  "ignoreStrict",
  "viewport"
]);
function Qt(t) {
  return t.startsWith("while") || t.startsWith("drag") && t !== "draggable" || t.startsWith("layout") || t.startsWith("onTap") || t.startsWith("onPan") || t.startsWith("onLayout") || hr.has(t);
}
let ls = (t) => !Qt(t);
function mr(t) {
  t && (ls = (e) => e.startsWith("on") ? !Qt(e) : t(e));
}
try {
  mr(require("@emotion/is-prop-valid").default);
} catch {
}
function pr(t, e, n) {
  const i = {};
  for (const s in t)
    s === "values" && typeof t.values == "object" || (ls(s) || n === !0 && Qt(s) || !e && !Qt(s) || // If trying to use native HTML drag events, forward drag listeners
    t.draggable && s.startsWith("onDrag")) && (i[s] = t[s]);
  return i;
}
const Ln = /* @__PURE__ */ new Set();
function le(t, e, n) {
  t || Ln.has(e) || (console.warn(e), Ln.add(e));
}
function gr(t) {
  if (typeof Proxy > "u")
    return t;
  const e = /* @__PURE__ */ new Map(), n = (...i) => (process.env.NODE_ENV !== "production" && le(!1, "motion() is deprecated. Use motion.create() instead."), t(...i));
  return new Proxy(n, {
    /**
     * Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
     * The prop name is passed through as `key` and we can use that to generate a `motion`
     * DOM component with that name.
     */
    get: (i, s) => s === "create" ? t : (e.has(s) || e.set(s, t(s)), e.get(s))
  });
}
const ue = wt({});
function jt(t) {
  return typeof t == "string" || Array.isArray(t);
}
function ce(t) {
  return t !== null && typeof t == "object" && typeof t.start == "function";
}
const qe = [
  "animate",
  "whileInView",
  "whileFocus",
  "whileHover",
  "whileTap",
  "whileDrag",
  "exit"
], Ze = ["initial", ...qe];
function de(t) {
  return ce(t.animate) || Ze.some((e) => jt(t[e]));
}
function us(t) {
  return !!(de(t) || t.variants);
}
function yr(t, e) {
  if (de(t)) {
    const { initial: n, animate: i } = t;
    return {
      initial: n === !1 || jt(n) ? n : void 0,
      animate: jt(i) ? i : void 0
    };
  }
  return t.inherit !== !1 ? e : {};
}
function vr(t) {
  const { initial: e, animate: n } = yr(t, O(ue));
  return re(() => ({ initial: e, animate: n }), [kn(e), kn(n)]);
}
function kn(t) {
  return Array.isArray(t) ? t.join(" ") : t;
}
const br = /* @__PURE__ */ Symbol.for("motionComponentSymbol");
function ft(t) {
  return t && typeof t == "object" && Object.prototype.hasOwnProperty.call(t, "current");
}
function xr(t, e, n) {
  return Qi(
    (i) => {
      i && t.onMount && t.onMount(i), e && (i ? e.mount(i) : e.unmount()), n && (typeof n == "function" ? n(i) : ft(n) && (n.current = i));
    },
    /**
     * Only pass a new ref callback to React if we've received a visual element
     * factory. Otherwise we'll be mounting/remounting every time externalRef
     * or other dependencies change.
     */
    [e]
  );
}
const Qe = (t) => t.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase(), Tr = "framerAppearId", cs = "data-" + Qe(Tr), { schedule: Je } = rs(queueMicrotask, !1), ds = wt({});
function Pr(t, e, n, i, s) {
  var r, o;
  const { visualElement: a } = O(ue), l = O(as), u = O(He), c = O(ae).reducedMotion, d = K(null);
  i = i || l.renderer, !d.current && i && (d.current = i(t, {
    visualState: e,
    parent: a,
    props: n,
    presenceContext: u,
    blockInitialAnimation: u ? u.initial === !1 : !1,
    reducedMotionConfig: c
  }));
  const f = d.current, h = O(ds);
  f && !f.projection && s && (f.type === "html" || f.type === "svg") && wr(d.current, n, s, h);
  const m = K(!1);
  Ji(() => {
    f && m.current && f.update(n, u);
  });
  const p = n[cs], y = K(!!p && !(!((r = window.MotionHandoffIsComplete) === null || r === void 0) && r.call(window, p)) && ((o = window.MotionHasOptimisedAnimation) === null || o === void 0 ? void 0 : o.call(window, p)));
  return Xe(() => {
    f && (m.current = !0, window.MotionIsMounted = !0, f.updateFeatures(), Je.render(f.render), y.current && f.animationState && f.animationState.animateChanges());
  }), it(() => {
    f && (!y.current && f.animationState && f.animationState.animateChanges(), y.current && (queueMicrotask(() => {
      var g;
      (g = window.MotionHandoffMarkAsComplete) === null || g === void 0 || g.call(window, p);
    }), y.current = !1));
  }), f;
}
function wr(t, e, n, i) {
  const { layoutId: s, layout: r, drag: o, dragConstraints: a, layoutScroll: l, layoutRoot: u } = e;
  t.projection = new n(t.latestValues, e["data-framer-portal-id"] ? void 0 : fs(t.parent)), t.projection.setOptions({
    layoutId: s,
    layout: r,
    alwaysMeasureLayout: !!o || a && ft(a),
    visualElement: t,
    /**
     * TODO: Update options in an effect. This could be tricky as it'll be too late
     * to update by the time layout animations run.
     * We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
     * ensuring it gets called if there's no potential layout animations.
     *
     */
    animationType: typeof r == "string" ? r : "both",
    initialPromotionConfig: i,
    layoutScroll: l,
    layoutRoot: u
  });
}
function fs(t) {
  if (t)
    return t.options.allowProjection !== !1 ? t.projection : fs(t.parent);
}
function Sr({ preloadedFeatures: t, createVisualElement: e, useRender: n, useVisualState: i, Component: s }) {
  var r, o;
  t && fr(t);
  function a(u, c) {
    let d;
    const f = {
      ...O(ae),
      ...u,
      layoutId: Ar(u)
    }, { isStatic: h } = f, m = vr(u), p = i(u, h);
    if (!h && Ye) {
      Vr(f, t);
      const y = Cr(f);
      d = y.MeasureLayout, m.visualElement = Pr(s, p, f, e, y.ProjectionNode);
    }
    return yt(ue.Provider, { value: m, children: [d && m.visualElement ? R(d, { visualElement: m.visualElement, ...f }) : null, n(s, u, xr(p, m.visualElement, c), p, h, m.visualElement)] });
  }
  a.displayName = `motion.${typeof s == "string" ? s : `create(${(o = (r = s.displayName) !== null && r !== void 0 ? r : s.name) !== null && o !== void 0 ? o : ""})`}`;
  const l = No(a);
  return l[br] = s, l;
}
function Ar({ layoutId: t }) {
  const e = O(os).id;
  return e && t !== void 0 ? e + "-" + t : t;
}
function Vr(t, e) {
  const n = O(as).strict;
  if (process.env.NODE_ENV !== "production" && e && n) {
    const i = "You have rendered a `motion` component within a `LazyMotion` component. This will break tree shaking. Import and render a `m` component instead.";
    t.ignoreStrict ? Vt(!1, i) : tt(!1, i);
  }
}
function Cr(t) {
  const { drag: e, layout: n } = vt;
  if (!e && !n)
    return {};
  const i = { ...e, ...n };
  return {
    MeasureLayout: e?.isEnabled(t) || n?.isEnabled(t) ? i.MeasureLayout : void 0,
    ProjectionNode: i.ProjectionNode
  };
}
const Dr = [
  "animate",
  "circle",
  "defs",
  "desc",
  "ellipse",
  "g",
  "image",
  "line",
  "filter",
  "marker",
  "mask",
  "metadata",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "switch",
  "symbol",
  "svg",
  "text",
  "tspan",
  "use",
  "view"
];
function tn(t) {
  return (
    /**
     * If it's not a string, it's a custom React component. Currently we only support
     * HTML custom React components.
     */
    typeof t != "string" || /**
     * If it contains a dash, the element is a custom HTML webcomponent.
     */
    t.includes("-") ? !1 : (
      /**
       * If it's in our list of lowercase SVG tags, it's an SVG component
       */
      !!(Dr.indexOf(t) > -1 || /**
       * If it contains a capital letter, it's an SVG component
       */
      /[A-Z]/u.test(t))
    )
  );
}
function Bn(t) {
  const e = [{}, {}];
  return t?.values.forEach((n, i) => {
    e[0][i] = n.get(), e[1][i] = n.getVelocity();
  }), e;
}
function en(t, e, n, i) {
  if (typeof e == "function") {
    const [s, r] = Bn(i);
    e = e(n !== void 0 ? n : t.custom, s, r);
  }
  if (typeof e == "string" && (e = t.variants && t.variants[e]), typeof e == "function") {
    const [s, r] = Bn(i);
    e = e(n !== void 0 ? n : t.custom, s, r);
  }
  return e;
}
const Re = (t) => Array.isArray(t), Mr = (t) => !!(t && typeof t == "object" && t.mix && t.toValue), Rr = (t) => Re(t) ? t[t.length - 1] || 0 : t, B = (t) => !!(t && t.getVelocity);
function Xt(t) {
  const e = B(t) ? t.get() : t;
  return Mr(e) ? e.toValue() : e;
}
function Er({ scrapeMotionValuesFromProps: t, createRenderState: e, onUpdate: n }, i, s, r) {
  const o = {
    latestValues: Lr(i, s, r, t),
    renderState: e()
  };
  return n && (o.onMount = (a) => n({ props: i, current: a, ...o }), o.onUpdate = (a) => n(a)), o;
}
const hs = (t) => (e, n) => {
  const i = O(ue), s = O(He), r = () => Er(t, e, i, s);
  return n ? r() : ze(r);
};
function Lr(t, e, n, i) {
  const s = {}, r = i(t, {});
  for (const f in r)
    s[f] = Xt(r[f]);
  let { initial: o, animate: a } = t;
  const l = de(t), u = us(t);
  e && u && !l && t.inherit !== !1 && (o === void 0 && (o = e.initial), a === void 0 && (a = e.animate));
  let c = n ? n.initial === !1 : !1;
  c = c || o === !1;
  const d = c ? a : o;
  if (d && typeof d != "boolean" && !ce(d)) {
    const f = Array.isArray(d) ? d : [d];
    for (let h = 0; h < f.length; h++) {
      const m = en(t, f[h]);
      if (m) {
        const { transitionEnd: p, transition: y, ...g } = m;
        for (const v in g) {
          let b = g[v];
          if (Array.isArray(b)) {
            const S = c ? b.length - 1 : 0;
            b = b[S];
          }
          b !== null && (s[v] = b);
        }
        for (const v in p)
          s[v] = p[v];
      }
    }
  }
  return s;
}
const Ct = [
  "transformPerspective",
  "x",
  "y",
  "z",
  "translateX",
  "translateY",
  "translateZ",
  "scale",
  "scaleX",
  "scaleY",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skew",
  "skewX",
  "skewY"
], dt = new Set(Ct), ms = (t) => (e) => typeof e == "string" && e.startsWith(t), ps = /* @__PURE__ */ ms("--"), kr = /* @__PURE__ */ ms("var(--"), nn = (t) => kr(t) ? Br.test(t.split("/*")[0].trim()) : !1, Br = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu, gs = (t, e) => e && typeof t == "number" ? e.transform(t) : t, Z = (t, e, n) => n > e ? e : n < t ? t : n, Dt = {
  test: (t) => typeof t == "number",
  parse: parseFloat,
  transform: (t) => t
}, Nt = {
  ...Dt,
  transform: (t) => Z(0, 1, t)
}, Ht = {
  ...Dt,
  default: 1
}, _t = (t) => ({
  test: (e) => typeof e == "string" && e.endsWith(t) && e.split(" ").length === 1,
  parse: parseFloat,
  transform: (e) => `${e}${t}`
}), J = /* @__PURE__ */ _t("deg"), G = /* @__PURE__ */ _t("%"), T = /* @__PURE__ */ _t("px"), Fr = /* @__PURE__ */ _t("vh"), Ir = /* @__PURE__ */ _t("vw"), Fn = {
  ...G,
  parse: (t) => G.parse(t) / 100,
  transform: (t) => G.transform(t * 100)
}, Or = {
  // Border props
  borderWidth: T,
  borderTopWidth: T,
  borderRightWidth: T,
  borderBottomWidth: T,
  borderLeftWidth: T,
  borderRadius: T,
  radius: T,
  borderTopLeftRadius: T,
  borderTopRightRadius: T,
  borderBottomRightRadius: T,
  borderBottomLeftRadius: T,
  // Positioning props
  width: T,
  maxWidth: T,
  height: T,
  maxHeight: T,
  top: T,
  right: T,
  bottom: T,
  left: T,
  // Spacing props
  padding: T,
  paddingTop: T,
  paddingRight: T,
  paddingBottom: T,
  paddingLeft: T,
  margin: T,
  marginTop: T,
  marginRight: T,
  marginBottom: T,
  marginLeft: T,
  // Misc
  backgroundPositionX: T,
  backgroundPositionY: T
}, jr = {
  rotate: J,
  rotateX: J,
  rotateY: J,
  rotateZ: J,
  scale: Ht,
  scaleX: Ht,
  scaleY: Ht,
  scaleZ: Ht,
  skew: J,
  skewX: J,
  skewY: J,
  distance: T,
  translateX: T,
  translateY: T,
  translateZ: T,
  x: T,
  y: T,
  z: T,
  perspective: T,
  transformPerspective: T,
  opacity: Nt,
  originX: Fn,
  originY: Fn,
  originZ: T
}, In = {
  ...Dt,
  transform: Math.round
}, sn = {
  ...Or,
  ...jr,
  zIndex: In,
  size: T,
  // SVG
  fillOpacity: Nt,
  strokeOpacity: Nt,
  numOctaves: In
}, Nr = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
}, Ur = Ct.length;
function $r(t, e, n) {
  let i = "", s = !0;
  for (let r = 0; r < Ur; r++) {
    const o = Ct[r], a = t[o];
    if (a === void 0)
      continue;
    let l = !0;
    if (typeof a == "number" ? l = a === (o.startsWith("scale") ? 1 : 0) : l = parseFloat(a) === 0, !l || n) {
      const u = gs(a, sn[o]);
      if (!l) {
        s = !1;
        const c = Nr[o] || o;
        i += `${c}(${u}) `;
      }
      n && (e[o] = u);
    }
  }
  return i = i.trim(), n ? i = n(e, s ? "" : i) : s && (i = "none"), i;
}
function on(t, e, n) {
  const { style: i, vars: s, transformOrigin: r } = t;
  let o = !1, a = !1;
  for (const l in e) {
    const u = e[l];
    if (dt.has(l)) {
      o = !0;
      continue;
    } else if (ps(l)) {
      s[l] = u;
      continue;
    } else {
      const c = gs(u, sn[l]);
      l.startsWith("origin") ? (a = !0, r[l] = c) : i[l] = c;
    }
  }
  if (e.transform || (o || n ? i.transform = $r(e, t.transform, n) : i.transform && (i.transform = "none")), a) {
    const { originX: l = "50%", originY: u = "50%", originZ: c = 0 } = r;
    i.transformOrigin = `${l} ${u} ${c}`;
  }
}
const _r = {
  offset: "stroke-dashoffset",
  array: "stroke-dasharray"
}, Kr = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function Wr(t, e, n = 1, i = 0, s = !0) {
  t.pathLength = 1;
  const r = s ? _r : Kr;
  t[r.offset] = T.transform(-i);
  const o = T.transform(e), a = T.transform(n);
  t[r.array] = `${o} ${a}`;
}
function On(t, e, n) {
  return typeof t == "string" ? t : T.transform(e + n * t);
}
function Gr(t, e, n) {
  const i = On(e, t.x, t.width), s = On(n, t.y, t.height);
  return `${i} ${s}`;
}
function rn(t, {
  attrX: e,
  attrY: n,
  attrScale: i,
  originX: s,
  originY: r,
  pathLength: o,
  pathSpacing: a = 1,
  pathOffset: l = 0,
  // This is object creation, which we try to avoid per-frame.
  ...u
}, c, d) {
  if (on(t, u, d), c) {
    t.style.viewBox && (t.attrs.viewBox = t.style.viewBox);
    return;
  }
  t.attrs = t.style, t.style = {};
  const { attrs: f, style: h, dimensions: m } = t;
  f.transform && (m && (h.transform = f.transform), delete f.transform), m && (s !== void 0 || r !== void 0 || h.transform) && (h.transformOrigin = Gr(m, s !== void 0 ? s : 0.5, r !== void 0 ? r : 0.5)), e !== void 0 && (f.x = e), n !== void 0 && (f.y = n), i !== void 0 && (f.scale = i), o !== void 0 && Wr(f, o, a, l, !1);
}
const an = () => ({
  style: {},
  transform: {},
  transformOrigin: {},
  vars: {}
}), ys = () => ({
  ...an(),
  attrs: {}
}), ln = (t) => typeof t == "string" && t.toLowerCase() === "svg";
function vs(t, { style: e, vars: n }, i, s) {
  Object.assign(t.style, e, s && s.getProjectionStyles(i));
  for (const r in n)
    t.style.setProperty(r, n[r]);
}
const bs = /* @__PURE__ */ new Set([
  "baseFrequency",
  "diffuseConstant",
  "kernelMatrix",
  "kernelUnitLength",
  "keySplines",
  "keyTimes",
  "limitingConeAngle",
  "markerHeight",
  "markerWidth",
  "numOctaves",
  "targetX",
  "targetY",
  "surfaceScale",
  "specularConstant",
  "specularExponent",
  "stdDeviation",
  "tableValues",
  "viewBox",
  "gradientTransform",
  "pathLength",
  "startOffset",
  "textLength",
  "lengthAdjust"
]);
function xs(t, e, n, i) {
  vs(t, e, void 0, i);
  for (const s in e.attrs)
    t.setAttribute(bs.has(s) ? s : Qe(s), e.attrs[s]);
}
const Jt = {};
function zr(t) {
  Object.assign(Jt, t);
}
function Ts(t, { layout: e, layoutId: n }) {
  return dt.has(t) || t.startsWith("origin") || (e || n !== void 0) && (!!Jt[t] || t === "opacity");
}
function un(t, e, n) {
  var i;
  const { style: s } = t, r = {};
  for (const o in s)
    (B(s[o]) || e.style && B(e.style[o]) || Ts(o, t) || ((i = n?.getValue(o)) === null || i === void 0 ? void 0 : i.liveStyle) !== void 0) && (r[o] = s[o]);
  return r;
}
function Ps(t, e, n) {
  const i = un(t, e, n);
  for (const s in t)
    if (B(t[s]) || B(e[s])) {
      const r = Ct.indexOf(s) !== -1 ? "attr" + s.charAt(0).toUpperCase() + s.substring(1) : s;
      i[r] = t[s];
    }
  return i;
}
function Hr(t, e) {
  try {
    e.dimensions = typeof t.getBBox == "function" ? t.getBBox() : t.getBoundingClientRect();
  } catch {
    e.dimensions = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
  }
}
const jn = ["x", "y", "width", "height", "cx", "cy", "r"], Yr = {
  useVisualState: hs({
    scrapeMotionValuesFromProps: Ps,
    createRenderState: ys,
    onUpdate: ({ props: t, prevProps: e, current: n, renderState: i, latestValues: s }) => {
      if (!n)
        return;
      let r = !!t.drag;
      if (!r) {
        for (const a in s)
          if (dt.has(a)) {
            r = !0;
            break;
          }
      }
      if (!r)
        return;
      let o = !e;
      if (e)
        for (let a = 0; a < jn.length; a++) {
          const l = jn[a];
          t[l] !== e[l] && (o = !0);
        }
      o && A.read(() => {
        Hr(n, i), A.render(() => {
          rn(i, s, ln(n.tagName), t.transformTemplate), xs(n, i);
        });
      });
    }
  })
}, Xr = {
  useVisualState: hs({
    scrapeMotionValuesFromProps: un,
    createRenderState: an
  })
};
function ws(t, e, n) {
  for (const i in e)
    !B(e[i]) && !Ts(i, n) && (t[i] = e[i]);
}
function qr({ transformTemplate: t }, e) {
  return re(() => {
    const n = an();
    return on(n, e, t), Object.assign({}, n.vars, n.style);
  }, [e]);
}
function Zr(t, e) {
  const n = t.style || {}, i = {};
  return ws(i, n, t), Object.assign(i, qr(t, e)), i;
}
function Qr(t, e) {
  const n = {}, i = Zr(t, e);
  return t.drag && t.dragListener !== !1 && (n.draggable = !1, i.userSelect = i.WebkitUserSelect = i.WebkitTouchCallout = "none", i.touchAction = t.drag === !0 ? "none" : `pan-${t.drag === "x" ? "y" : "x"}`), t.tabIndex === void 0 && (t.onTap || t.onTapStart || t.whileTap) && (n.tabIndex = 0), n.style = i, n;
}
function Jr(t, e, n, i) {
  const s = re(() => {
    const r = ys();
    return rn(r, e, ln(i), t.transformTemplate), {
      ...r.attrs,
      style: { ...r.style }
    };
  }, [e]);
  if (t.style) {
    const r = {};
    ws(r, t.style, t), s.style = { ...r, ...s.style };
  }
  return s;
}
function ta(t = !1) {
  return (n, i, s, { latestValues: r }, o) => {
    const l = (tn(n) ? Jr : Qr)(i, r, o, n), u = pr(i, typeof n == "string", t), c = n !== ts ? { ...u, ...l, ref: s } : {}, { children: d } = i, f = re(() => B(d) ? d.get() : d, [d]);
    return Uo(n, {
      ...c,
      children: f
    });
  };
}
function ea(t, e) {
  return function(i, { forwardMotionProps: s } = { forwardMotionProps: !1 }) {
    const o = {
      ...tn(i) ? Yr : Xr,
      preloadedFeatures: t,
      useRender: ta(s),
      createVisualElement: e,
      Component: i
    };
    return Sr(o);
  };
}
function Ss(t, e) {
  if (!Array.isArray(e))
    return !1;
  const n = e.length;
  if (n !== t.length)
    return !1;
  for (let i = 0; i < n; i++)
    if (e[i] !== t[i])
      return !1;
  return !0;
}
function fe(t, e, n) {
  const i = t.getProps();
  return en(i, e, n !== void 0 ? n : i.custom, t);
}
function cn(t, e) {
  return t ? t[e] || t.default || t : void 0;
}
const As = /* @__PURE__ */ new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  ...Ct
]);
let qt;
function na() {
  qt = void 0;
}
const z = {
  now: () => (qt === void 0 && z.set(k.isProcessing || ur.useManualTiming ? k.timestamp : performance.now()), qt),
  set: (t) => {
    qt = t, queueMicrotask(na);
  }
};
function dn(t, e) {
  t.indexOf(e) === -1 && t.push(e);
}
function fn(t, e) {
  const n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}
class hn {
  constructor() {
    this.subscriptions = [];
  }
  add(e) {
    return dn(this.subscriptions, e), () => fn(this.subscriptions, e);
  }
  notify(e, n, i) {
    const s = this.subscriptions.length;
    if (s)
      if (s === 1)
        this.subscriptions[0](e, n, i);
      else
        for (let r = 0; r < s; r++) {
          const o = this.subscriptions[r];
          o && o(e, n, i);
        }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
function Vs(t, e) {
  return e ? t * (1e3 / e) : 0;
}
const Nn = 30, ia = (t) => !isNaN(parseFloat(t)), kt = {
  current: void 0
};
class sa {
  /**
   * @param init - The initiating value
   * @param config - Optional configuration options
   *
   * -  `transformer`: A function to transform incoming values with.
   *
   * @internal
   */
  constructor(e, n = {}) {
    this.version = "11.18.2", this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (i, s = !0) => {
      const r = z.now();
      this.updatedAt !== r && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(i), this.current !== this.prev && this.events.change && this.events.change.notify(this.current), s && this.events.renderRequest && this.events.renderRequest.notify(this.current);
    }, this.hasAnimated = !1, this.setCurrent(e), this.owner = n.owner;
  }
  setCurrent(e) {
    this.current = e, this.updatedAt = z.now(), this.canTrackVelocity === null && e !== void 0 && (this.canTrackVelocity = ia(this.current));
  }
  setPrevFrameValue(e = this.current) {
    this.prevFrameValue = e, this.prevUpdatedAt = this.updatedAt;
  }
  /**
   * Adds a function that will be notified when the `MotionValue` is updated.
   *
   * It returns a function that, when called, will cancel the subscription.
   *
   * When calling `onChange` inside a React component, it should be wrapped with the
   * `useEffect` hook. As it returns an unsubscribe function, this should be returned
   * from the `useEffect` function to ensure you don't add duplicate subscribers..
   *
   * ```jsx
   * export const MyComponent = () => {
   *   const x = useMotionValue(0)
   *   const y = useMotionValue(0)
   *   const opacity = useMotionValue(1)
   *
   *   useEffect(() => {
   *     function updateOpacity() {
   *       const maxXY = Math.max(x.get(), y.get())
   *       const newOpacity = transform(maxXY, [0, 100], [1, 0])
   *       opacity.set(newOpacity)
   *     }
   *
   *     const unsubscribeX = x.on("change", updateOpacity)
   *     const unsubscribeY = y.on("change", updateOpacity)
   *
   *     return () => {
   *       unsubscribeX()
   *       unsubscribeY()
   *     }
   *   }, [])
   *
   *   return <motion.div style={{ x }} />
   * }
   * ```
   *
   * @param subscriber - A function that receives the latest value.
   * @returns A function that, when called, will cancel this subscription.
   *
   * @deprecated
   */
  onChange(e) {
    return process.env.NODE_ENV !== "production" && le(!1, 'value.onChange(callback) is deprecated. Switch to value.on("change", callback).'), this.on("change", e);
  }
  on(e, n) {
    this.events[e] || (this.events[e] = new hn());
    const i = this.events[e].add(n);
    return e === "change" ? () => {
      i(), A.read(() => {
        this.events.change.getSize() || this.stop();
      });
    } : i;
  }
  clearListeners() {
    for (const e in this.events)
      this.events[e].clear();
  }
  /**
   * Attaches a passive effect to the `MotionValue`.
   *
   * @internal
   */
  attach(e, n) {
    this.passiveEffect = e, this.stopPassiveEffect = n;
  }
  /**
   * Sets the state of the `MotionValue`.
   *
   * @remarks
   *
   * ```jsx
   * const x = useMotionValue(0)
   * x.set(10)
   * ```
   *
   * @param latest - Latest value to set.
   * @param render - Whether to notify render subscribers. Defaults to `true`
   *
   * @public
   */
  set(e, n = !0) {
    !n || !this.passiveEffect ? this.updateAndNotify(e, n) : this.passiveEffect(e, this.updateAndNotify);
  }
  setWithVelocity(e, n, i) {
    this.set(n), this.prev = void 0, this.prevFrameValue = e, this.prevUpdatedAt = this.updatedAt - i;
  }
  /**
   * Set the state of the `MotionValue`, stopping any active animations,
   * effects, and resets velocity to `0`.
   */
  jump(e, n = !0) {
    this.updateAndNotify(e), this.prev = e, this.prevUpdatedAt = this.prevFrameValue = void 0, n && this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
  /**
   * Returns the latest state of `MotionValue`
   *
   * @returns - The latest state of `MotionValue`
   *
   * @public
   */
  get() {
    return kt.current && kt.current.push(this), this.current;
  }
  /**
   * @public
   */
  getPrevious() {
    return this.prev;
  }
  /**
   * Returns the latest velocity of `MotionValue`
   *
   * @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
   *
   * @public
   */
  getVelocity() {
    const e = z.now();
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || e - this.updatedAt > Nn)
      return 0;
    const n = Math.min(this.updatedAt - this.prevUpdatedAt, Nn);
    return Vs(parseFloat(this.current) - parseFloat(this.prevFrameValue), n);
  }
  /**
   * Registers a new animation to control this `MotionValue`. Only one
   * animation can drive a `MotionValue` at one time.
   *
   * ```jsx
   * value.start()
   * ```
   *
   * @param animation - A function that starts the provided animation
   *
   * @internal
   */
  start(e) {
    return this.stop(), new Promise((n) => {
      this.hasAnimated = !0, this.animation = e(n), this.events.animationStart && this.events.animationStart.notify();
    }).then(() => {
      this.events.animationComplete && this.events.animationComplete.notify(), this.clearAnimation();
    });
  }
  /**
   * Stop the currently active animation.
   *
   * @public
   */
  stop() {
    this.animation && (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()), this.clearAnimation();
  }
  /**
   * Returns `true` if this value is currently animating.
   *
   * @public
   */
  isAnimating() {
    return !!this.animation;
  }
  clearAnimation() {
    delete this.animation;
  }
  /**
   * Destroy and clean up subscribers to this `MotionValue`.
   *
   * The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
   * handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
   * created a `MotionValue` via the `motionValue` function.
   *
   * @public
   */
  destroy() {
    this.clearListeners(), this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
}
function bt(t, e) {
  return new sa(t, e);
}
function oa(t, e, n) {
  t.hasValue(e) ? t.getValue(e).set(n) : t.addValue(e, bt(n));
}
function ra(t, e) {
  const n = fe(t, e);
  let { transitionEnd: i = {}, transition: s = {}, ...r } = n || {};
  r = { ...r, ...i };
  for (const o in r) {
    const a = Rr(r[o]);
    oa(t, o, a);
  }
}
function aa(t) {
  return !!(B(t) && t.add);
}
function Ee(t, e) {
  const n = t.getValue("willChange");
  if (aa(n))
    return n.add(e);
}
function Cs(t) {
  return t.props[cs];
}
// @__NO_SIDE_EFFECTS__
function mn(t) {
  let e;
  return () => (e === void 0 && (e = t()), e);
}
const la = /* @__PURE__ */ mn(() => window.ScrollTimeline !== void 0);
class ua {
  constructor(e) {
    this.stop = () => this.runAll("stop"), this.animations = e.filter(Boolean);
  }
  get finished() {
    return Promise.all(this.animations.map((e) => "finished" in e ? e.finished : e));
  }
  /**
   * TODO: Filter out cancelled or stopped animations before returning
   */
  getAll(e) {
    return this.animations[0][e];
  }
  setAll(e, n) {
    for (let i = 0; i < this.animations.length; i++)
      this.animations[i][e] = n;
  }
  attachTimeline(e, n) {
    const i = this.animations.map((s) => {
      if (la() && s.attachTimeline)
        return s.attachTimeline(e);
      if (typeof n == "function")
        return n(s);
    });
    return () => {
      i.forEach((s, r) => {
        s && s(), this.animations[r].stop();
      });
    };
  }
  get time() {
    return this.getAll("time");
  }
  set time(e) {
    this.setAll("time", e);
  }
  get speed() {
    return this.getAll("speed");
  }
  set speed(e) {
    this.setAll("speed", e);
  }
  get startTime() {
    return this.getAll("startTime");
  }
  get duration() {
    let e = 0;
    for (let n = 0; n < this.animations.length; n++)
      e = Math.max(e, this.animations[n].duration);
    return e;
  }
  runAll(e) {
    this.animations.forEach((n) => n[e]());
  }
  flatten() {
    this.runAll("flatten");
  }
  play() {
    this.runAll("play");
  }
  pause() {
    this.runAll("pause");
  }
  cancel() {
    this.runAll("cancel");
  }
  complete() {
    this.runAll("complete");
  }
}
class ca extends ua {
  then(e, n) {
    return Promise.all(this.animations).then(e).catch(n);
  }
}
const H = /* @__NO_SIDE_EFFECTS__ */ (t) => t * 1e3, X = /* @__NO_SIDE_EFFECTS__ */ (t) => t / 1e3;
function pn(t) {
  return typeof t == "function";
}
function Un(t, e) {
  t.timeline = e, t.onfinish = null;
}
const gn = (t) => Array.isArray(t) && typeof t[0] == "number", da = {
  linearEasing: void 0
};
function fa(t, e) {
  const n = /* @__PURE__ */ mn(t);
  return () => {
    var i;
    return (i = da[e]) !== null && i !== void 0 ? i : n();
  };
}
const te = /* @__PURE__ */ fa(() => {
  try {
    document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
  } catch {
    return !1;
  }
  return !0;
}, "linearEasing"), xt = /* @__NO_SIDE_EFFECTS__ */ (t, e, n) => {
  const i = e - t;
  return i === 0 ? 1 : (n - t) / i;
}, Ds = (t, e, n = 10) => {
  let i = "";
  const s = Math.max(Math.round(e / n), 2);
  for (let r = 0; r < s; r++)
    i += t(/* @__PURE__ */ xt(0, s - 1, r)) + ", ";
  return `linear(${i.substring(0, i.length - 2)})`;
};
function Ms(t) {
  return !!(typeof t == "function" && te() || !t || typeof t == "string" && (t in Le || te()) || gn(t) || Array.isArray(t) && t.every(Ms));
}
const Rt = ([t, e, n, i]) => `cubic-bezier(${t}, ${e}, ${n}, ${i})`, Le = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  circIn: /* @__PURE__ */ Rt([0, 0.65, 0.55, 1]),
  circOut: /* @__PURE__ */ Rt([0.55, 0, 1, 0.45]),
  backIn: /* @__PURE__ */ Rt([0.31, 0.01, 0.66, -0.59]),
  backOut: /* @__PURE__ */ Rt([0.33, 1.53, 0.69, 0.99])
};
function Rs(t, e) {
  if (t)
    return typeof t == "function" && te() ? Ds(t, e) : gn(t) ? Rt(t) : Array.isArray(t) ? t.map((n) => Rs(n, e) || Le.easeOut) : Le[t];
}
const Es = (t, e, n) => (((1 - 3 * n + 3 * e) * t + (3 * n - 6 * e)) * t + 3 * e) * t, ha = 1e-7, ma = 12;
function pa(t, e, n, i, s) {
  let r, o, a = 0;
  do
    o = e + (n - e) / 2, r = Es(o, i, s) - t, r > 0 ? n = o : e = o;
  while (Math.abs(r) > ha && ++a < ma);
  return o;
}
function Kt(t, e, n, i) {
  if (t === e && n === i)
    return N;
  const s = (r) => pa(r, 0, 1, t, n);
  return (r) => r === 0 || r === 1 ? r : Es(s(r), e, i);
}
const Ls = (t) => (e) => e <= 0.5 ? t(2 * e) / 2 : (2 - t(2 * (1 - e))) / 2, ks = (t) => (e) => 1 - t(1 - e), Bs = /* @__PURE__ */ Kt(0.33, 1.53, 0.69, 0.99), yn = /* @__PURE__ */ ks(Bs), Fs = /* @__PURE__ */ Ls(yn), Is = (t) => (t *= 2) < 1 ? 0.5 * yn(t) : 0.5 * (2 - Math.pow(2, -10 * (t - 1))), vn = (t) => 1 - Math.sin(Math.acos(t)), Os = ks(vn), js = Ls(vn), Ns = (t) => /^0[^.\s]+$/u.test(t);
function ga(t) {
  return typeof t == "number" ? t === 0 : t !== null ? t === "none" || t === "0" || Ns(t) : !0;
}
const Bt = (t) => Math.round(t * 1e5) / 1e5, bn = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function ya(t) {
  return t == null;
}
const va = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, xn = (t, e) => (n) => !!(typeof n == "string" && va.test(n) && n.startsWith(t) || e && !ya(n) && Object.prototype.hasOwnProperty.call(n, e)), Us = (t, e, n) => (i) => {
  if (typeof i != "string")
    return i;
  const [s, r, o, a] = i.match(bn);
  return {
    [t]: parseFloat(s),
    [e]: parseFloat(r),
    [n]: parseFloat(o),
    alpha: a !== void 0 ? parseFloat(a) : 1
  };
}, ba = (t) => Z(0, 255, t), ve = {
  ...Dt,
  transform: (t) => Math.round(ba(t))
}, lt = {
  test: /* @__PURE__ */ xn("rgb", "red"),
  parse: /* @__PURE__ */ Us("red", "green", "blue"),
  transform: ({ red: t, green: e, blue: n, alpha: i = 1 }) => "rgba(" + ve.transform(t) + ", " + ve.transform(e) + ", " + ve.transform(n) + ", " + Bt(Nt.transform(i)) + ")"
};
function xa(t) {
  let e = "", n = "", i = "", s = "";
  return t.length > 5 ? (e = t.substring(1, 3), n = t.substring(3, 5), i = t.substring(5, 7), s = t.substring(7, 9)) : (e = t.substring(1, 2), n = t.substring(2, 3), i = t.substring(3, 4), s = t.substring(4, 5), e += e, n += n, i += i, s += s), {
    red: parseInt(e, 16),
    green: parseInt(n, 16),
    blue: parseInt(i, 16),
    alpha: s ? parseInt(s, 16) / 255 : 1
  };
}
const ke = {
  test: /* @__PURE__ */ xn("#"),
  parse: xa,
  transform: lt.transform
}, ht = {
  test: /* @__PURE__ */ xn("hsl", "hue"),
  parse: /* @__PURE__ */ Us("hue", "saturation", "lightness"),
  transform: ({ hue: t, saturation: e, lightness: n, alpha: i = 1 }) => "hsla(" + Math.round(t) + ", " + G.transform(Bt(e)) + ", " + G.transform(Bt(n)) + ", " + Bt(Nt.transform(i)) + ")"
}, I = {
  test: (t) => lt.test(t) || ke.test(t) || ht.test(t),
  parse: (t) => lt.test(t) ? lt.parse(t) : ht.test(t) ? ht.parse(t) : ke.parse(t),
  transform: (t) => typeof t == "string" ? t : t.hasOwnProperty("red") ? lt.transform(t) : ht.transform(t)
}, Ta = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function Pa(t) {
  var e, n;
  return isNaN(t) && typeof t == "string" && (((e = t.match(bn)) === null || e === void 0 ? void 0 : e.length) || 0) + (((n = t.match(Ta)) === null || n === void 0 ? void 0 : n.length) || 0) > 0;
}
const $s = "number", _s = "color", wa = "var", Sa = "var(", $n = "${}", Aa = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function Ut(t) {
  const e = t.toString(), n = [], i = {
    color: [],
    number: [],
    var: []
  }, s = [];
  let r = 0;
  const a = e.replace(Aa, (l) => (I.test(l) ? (i.color.push(r), s.push(_s), n.push(I.parse(l))) : l.startsWith(Sa) ? (i.var.push(r), s.push(wa), n.push(l)) : (i.number.push(r), s.push($s), n.push(parseFloat(l))), ++r, $n)).split($n);
  return { values: n, split: a, indexes: i, types: s };
}
function Ks(t) {
  return Ut(t).values;
}
function Ws(t) {
  const { split: e, types: n } = Ut(t), i = e.length;
  return (s) => {
    let r = "";
    for (let o = 0; o < i; o++)
      if (r += e[o], s[o] !== void 0) {
        const a = n[o];
        a === $s ? r += Bt(s[o]) : a === _s ? r += I.transform(s[o]) : r += s[o];
      }
    return r;
  };
}
const Va = (t) => typeof t == "number" ? 0 : t;
function Ca(t) {
  const e = Ks(t);
  return Ws(t)(e.map(Va));
}
const et = {
  test: Pa,
  parse: Ks,
  createTransformer: Ws,
  getAnimatableNone: Ca
}, Da = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function Ma(t) {
  const [e, n] = t.slice(0, -1).split("(");
  if (e === "drop-shadow")
    return t;
  const [i] = n.match(bn) || [];
  if (!i)
    return t;
  const s = n.replace(i, "");
  let r = Da.has(e) ? 1 : 0;
  return i !== n && (r *= 100), e + "(" + r + s + ")";
}
const Ra = /\b([a-z-]*)\(.*?\)/gu, Be = {
  ...et,
  getAnimatableNone: (t) => {
    const e = t.match(Ra);
    return e ? e.map(Ma).join(" ") : t;
  }
}, Ea = {
  ...sn,
  // Color props
  color: I,
  backgroundColor: I,
  outlineColor: I,
  fill: I,
  stroke: I,
  // Border props
  borderColor: I,
  borderTopColor: I,
  borderRightColor: I,
  borderBottomColor: I,
  borderLeftColor: I,
  filter: Be,
  WebkitFilter: Be
}, Tn = (t) => Ea[t];
function Gs(t, e) {
  let n = Tn(t);
  return n !== Be && (n = et), n.getAnimatableNone ? n.getAnimatableNone(e) : void 0;
}
const La = /* @__PURE__ */ new Set(["auto", "none", "0"]);
function ka(t, e, n) {
  let i = 0, s;
  for (; i < t.length && !s; ) {
    const r = t[i];
    typeof r == "string" && !La.has(r) && Ut(r).values.length && (s = t[i]), i++;
  }
  if (s && n)
    for (const r of e)
      t[r] = Gs(n, s);
}
const _n = (t) => t === Dt || t === T, Kn = (t, e) => parseFloat(t.split(", ")[e]), Wn = (t, e) => (n, { transform: i }) => {
  if (i === "none" || !i)
    return 0;
  const s = i.match(/^matrix3d\((.+)\)$/u);
  if (s)
    return Kn(s[1], e);
  {
    const r = i.match(/^matrix\((.+)\)$/u);
    return r ? Kn(r[1], t) : 0;
  }
}, Ba = /* @__PURE__ */ new Set(["x", "y", "z"]), Fa = Ct.filter((t) => !Ba.has(t));
function Ia(t) {
  const e = [];
  return Fa.forEach((n) => {
    const i = t.getValue(n);
    i !== void 0 && (e.push([n, i.get()]), i.set(n.startsWith("scale") ? 1 : 0));
  }), e;
}
const Tt = {
  // Dimensions
  width: ({ x: t }, { paddingLeft: e = "0", paddingRight: n = "0" }) => t.max - t.min - parseFloat(e) - parseFloat(n),
  height: ({ y: t }, { paddingTop: e = "0", paddingBottom: n = "0" }) => t.max - t.min - parseFloat(e) - parseFloat(n),
  top: (t, { top: e }) => parseFloat(e),
  left: (t, { left: e }) => parseFloat(e),
  bottom: ({ y: t }, { top: e }) => parseFloat(e) + (t.max - t.min),
  right: ({ x: t }, { left: e }) => parseFloat(e) + (t.max - t.min),
  // Transform
  x: Wn(4, 13),
  y: Wn(5, 14)
};
Tt.translateX = Tt.x;
Tt.translateY = Tt.y;
const ut = /* @__PURE__ */ new Set();
let Fe = !1, Ie = !1;
function zs() {
  if (Ie) {
    const t = Array.from(ut).filter((i) => i.needsMeasurement), e = new Set(t.map((i) => i.element)), n = /* @__PURE__ */ new Map();
    e.forEach((i) => {
      const s = Ia(i);
      s.length && (n.set(i, s), i.render());
    }), t.forEach((i) => i.measureInitialState()), e.forEach((i) => {
      i.render();
      const s = n.get(i);
      s && s.forEach(([r, o]) => {
        var a;
        (a = i.getValue(r)) === null || a === void 0 || a.set(o);
      });
    }), t.forEach((i) => i.measureEndState()), t.forEach((i) => {
      i.suspendedScrollY !== void 0 && window.scrollTo(0, i.suspendedScrollY);
    });
  }
  Ie = !1, Fe = !1, ut.forEach((t) => t.complete()), ut.clear();
}
function Hs() {
  ut.forEach((t) => {
    t.readKeyframes(), t.needsMeasurement && (Ie = !0);
  });
}
function Oa() {
  Hs(), zs();
}
class Pn {
  constructor(e, n, i, s, r, o = !1) {
    this.isComplete = !1, this.isAsync = !1, this.needsMeasurement = !1, this.isScheduled = !1, this.unresolvedKeyframes = [...e], this.onComplete = n, this.name = i, this.motionValue = s, this.element = r, this.isAsync = o;
  }
  scheduleResolve() {
    this.isScheduled = !0, this.isAsync ? (ut.add(this), Fe || (Fe = !0, A.read(Hs), A.resolveKeyframes(zs))) : (this.readKeyframes(), this.complete());
  }
  readKeyframes() {
    const { unresolvedKeyframes: e, name: n, element: i, motionValue: s } = this;
    for (let r = 0; r < e.length; r++)
      if (e[r] === null)
        if (r === 0) {
          const o = s?.get(), a = e[e.length - 1];
          if (o !== void 0)
            e[0] = o;
          else if (i && n) {
            const l = i.readValue(n, a);
            l != null && (e[0] = l);
          }
          e[0] === void 0 && (e[0] = a), s && o === void 0 && s.set(e[0]);
        } else
          e[r] = e[r - 1];
  }
  setFinalKeyframe() {
  }
  measureInitialState() {
  }
  renderEndStyles() {
  }
  measureEndState() {
  }
  complete() {
    this.isComplete = !0, this.onComplete(this.unresolvedKeyframes, this.finalKeyframe), ut.delete(this);
  }
  cancel() {
    this.isComplete || (this.isScheduled = !1, ut.delete(this));
  }
  resume() {
    this.isComplete || this.scheduleResolve();
  }
}
const Ys = (t) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(t), ja = (
  // eslint-disable-next-line redos-detector/no-unsafe-regex -- false positive, as it can match a lot of words
  /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
);
function Na(t) {
  const e = ja.exec(t);
  if (!e)
    return [,];
  const [, n, i, s] = e;
  return [`--${n ?? i}`, s];
}
const Ua = 4;
function Xs(t, e, n = 1) {
  tt(n <= Ua, `Max CSS variable fallback depth detected in property "${t}". This may indicate a circular fallback dependency.`);
  const [i, s] = Na(t);
  if (!i)
    return;
  const r = window.getComputedStyle(e).getPropertyValue(i);
  if (r) {
    const o = r.trim();
    return Ys(o) ? parseFloat(o) : o;
  }
  return nn(s) ? Xs(s, e, n + 1) : s;
}
const qs = (t) => (e) => e.test(t), $a = {
  test: (t) => t === "auto",
  parse: (t) => t
}, Zs = [Dt, T, G, J, Ir, Fr, $a], Gn = (t) => Zs.find(qs(t));
class Qs extends Pn {
  constructor(e, n, i, s, r) {
    super(e, n, i, s, r, !0);
  }
  readKeyframes() {
    const { unresolvedKeyframes: e, element: n, name: i } = this;
    if (!n || !n.current)
      return;
    super.readKeyframes();
    for (let l = 0; l < e.length; l++) {
      let u = e[l];
      if (typeof u == "string" && (u = u.trim(), nn(u))) {
        const c = Xs(u, n.current);
        c !== void 0 && (e[l] = c), l === e.length - 1 && (this.finalKeyframe = u);
      }
    }
    if (this.resolveNoneKeyframes(), !As.has(i) || e.length !== 2)
      return;
    const [s, r] = e, o = Gn(s), a = Gn(r);
    if (o !== a)
      if (_n(o) && _n(a))
        for (let l = 0; l < e.length; l++) {
          const u = e[l];
          typeof u == "string" && (e[l] = parseFloat(u));
        }
      else
        this.needsMeasurement = !0;
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: e, name: n } = this, i = [];
    for (let s = 0; s < e.length; s++)
      ga(e[s]) && i.push(s);
    i.length && ka(e, i, n);
  }
  measureInitialState() {
    const { element: e, unresolvedKeyframes: n, name: i } = this;
    if (!e || !e.current)
      return;
    i === "height" && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = Tt[i](e.measureViewportBox(), window.getComputedStyle(e.current)), n[0] = this.measuredOrigin;
    const s = n[n.length - 1];
    s !== void 0 && e.getValue(i, s).jump(s, !1);
  }
  measureEndState() {
    var e;
    const { element: n, name: i, unresolvedKeyframes: s } = this;
    if (!n || !n.current)
      return;
    const r = n.getValue(i);
    r && r.jump(this.measuredOrigin, !1);
    const o = s.length - 1, a = s[o];
    s[o] = Tt[i](n.measureViewportBox(), window.getComputedStyle(n.current)), a !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = a), !((e = this.removedTransforms) === null || e === void 0) && e.length && this.removedTransforms.forEach(([l, u]) => {
      n.getValue(l).set(u);
    }), this.resolveNoneKeyframes();
  }
}
const zn = (t, e) => e === "zIndex" ? !1 : !!(typeof t == "number" || Array.isArray(t) || typeof t == "string" && // It's animatable if we have a string
(et.test(t) || t === "0") && // And it contains numbers and/or colors
!t.startsWith("url("));
function _a(t) {
  const e = t[0];
  if (t.length === 1)
    return !0;
  for (let n = 0; n < t.length; n++)
    if (t[n] !== e)
      return !0;
}
function Ka(t, e, n, i) {
  const s = t[0];
  if (s === null)
    return !1;
  if (e === "display" || e === "visibility")
    return !0;
  const r = t[t.length - 1], o = zn(s, e), a = zn(r, e);
  return Vt(o === a, `You are trying to animate ${e} from "${s}" to "${r}". ${s} is not an animatable value - to enable this animation set ${s} to a value animatable to ${r} via the \`style\` property.`), !o || !a ? !1 : _a(t) || (n === "spring" || pn(n)) && i;
}
const Wa = (t) => t !== null;
function he(t, { repeat: e, repeatType: n = "loop" }, i) {
  const s = t.filter(Wa), r = e && n !== "loop" && e % 2 === 1 ? 0 : s.length - 1;
  return !r || i === void 0 ? s[r] : i;
}
const Ga = 40;
class Js {
  constructor({ autoplay: e = !0, delay: n = 0, type: i = "keyframes", repeat: s = 0, repeatDelay: r = 0, repeatType: o = "loop", ...a }) {
    this.isStopped = !1, this.hasAttemptedResolve = !1, this.createdAt = z.now(), this.options = {
      autoplay: e,
      delay: n,
      type: i,
      repeat: s,
      repeatDelay: r,
      repeatType: o,
      ...a
    }, this.updateFinishedPromise();
  }
  /**
   * This method uses the createdAt and resolvedAt to calculate the
   * animation startTime. *Ideally*, we would use the createdAt time as t=0
   * as the following frame would then be the first frame of the animation in
   * progress, which would feel snappier.
   *
   * However, if there's a delay (main thread work) between the creation of
   * the animation and the first commited frame, we prefer to use resolvedAt
   * to avoid a sudden jump into the animation.
   */
  calcStartTime() {
    return this.resolvedAt ? this.resolvedAt - this.createdAt > Ga ? this.resolvedAt : this.createdAt : this.createdAt;
  }
  /**
   * A getter for resolved data. If keyframes are not yet resolved, accessing
   * this.resolved will synchronously flush all pending keyframe resolvers.
   * This is a deoptimisation, but at its worst still batches read/writes.
   */
  get resolved() {
    return !this._resolved && !this.hasAttemptedResolve && Oa(), this._resolved;
  }
  /**
   * A method to be called when the keyframes resolver completes. This method
   * will check if its possible to run the animation and, if not, skip it.
   * Otherwise, it will call initPlayback on the implementing class.
   */
  onKeyframesResolved(e, n) {
    this.resolvedAt = z.now(), this.hasAttemptedResolve = !0;
    const { name: i, type: s, velocity: r, delay: o, onComplete: a, onUpdate: l, isGenerator: u } = this.options;
    if (!u && !Ka(e, i, s, r))
      if (o)
        this.options.duration = 0;
      else {
        l && l(he(e, this.options, n)), a && a(), this.resolveFinishedPromise();
        return;
      }
    const c = this.initPlayback(e, n);
    c !== !1 && (this._resolved = {
      keyframes: e,
      finalKeyframe: n,
      ...c
    }, this.onPostResolved());
  }
  onPostResolved() {
  }
  /**
   * Allows the returned animation to be awaited or promise-chained. Currently
   * resolves when the animation finishes at all but in a future update could/should
   * reject if its cancels.
   */
  then(e, n) {
    return this.currentFinishedPromise.then(e, n);
  }
  flatten() {
    this.options.type = "keyframes", this.options.ease = "linear";
  }
  updateFinishedPromise() {
    this.currentFinishedPromise = new Promise((e) => {
      this.resolveFinishedPromise = e;
    });
  }
}
const Oe = 2e4;
function to(t) {
  let e = 0;
  const n = 50;
  let i = t.next(e);
  for (; !i.done && e < Oe; )
    e += n, i = t.next(e);
  return e >= Oe ? 1 / 0 : e;
}
const M = (t, e, n) => t + (e - t) * n;
function be(t, e, n) {
  return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? t + (e - t) * 6 * n : n < 1 / 2 ? e : n < 2 / 3 ? t + (e - t) * (2 / 3 - n) * 6 : t;
}
function za({ hue: t, saturation: e, lightness: n, alpha: i }) {
  t /= 360, e /= 100, n /= 100;
  let s = 0, r = 0, o = 0;
  if (!e)
    s = r = o = n;
  else {
    const a = n < 0.5 ? n * (1 + e) : n + e - n * e, l = 2 * n - a;
    s = be(l, a, t + 1 / 3), r = be(l, a, t), o = be(l, a, t - 1 / 3);
  }
  return {
    red: Math.round(s * 255),
    green: Math.round(r * 255),
    blue: Math.round(o * 255),
    alpha: i
  };
}
function ee(t, e) {
  return (n) => n > 0 ? e : t;
}
const xe = (t, e, n) => {
  const i = t * t, s = n * (e * e - i) + i;
  return s < 0 ? 0 : Math.sqrt(s);
}, Ha = [ke, lt, ht], Ya = (t) => Ha.find((e) => e.test(t));
function Hn(t) {
  const e = Ya(t);
  if (Vt(!!e, `'${t}' is not an animatable color. Use the equivalent color code instead.`), !e)
    return !1;
  let n = e.parse(t);
  return e === ht && (n = za(n)), n;
}
const Yn = (t, e) => {
  const n = Hn(t), i = Hn(e);
  if (!n || !i)
    return ee(t, e);
  const s = { ...n };
  return (r) => (s.red = xe(n.red, i.red, r), s.green = xe(n.green, i.green, r), s.blue = xe(n.blue, i.blue, r), s.alpha = M(n.alpha, i.alpha, r), lt.transform(s));
}, Xa = (t, e) => (n) => e(t(n)), Wt = (...t) => t.reduce(Xa), je = /* @__PURE__ */ new Set(["none", "hidden"]);
function qa(t, e) {
  return je.has(t) ? (n) => n <= 0 ? t : e : (n) => n >= 1 ? e : t;
}
function Za(t, e) {
  return (n) => M(t, e, n);
}
function wn(t) {
  return typeof t == "number" ? Za : typeof t == "string" ? nn(t) ? ee : I.test(t) ? Yn : tl : Array.isArray(t) ? eo : typeof t == "object" ? I.test(t) ? Yn : Qa : ee;
}
function eo(t, e) {
  const n = [...t], i = n.length, s = t.map((r, o) => wn(r)(r, e[o]));
  return (r) => {
    for (let o = 0; o < i; o++)
      n[o] = s[o](r);
    return n;
  };
}
function Qa(t, e) {
  const n = { ...t, ...e }, i = {};
  for (const s in n)
    t[s] !== void 0 && e[s] !== void 0 && (i[s] = wn(t[s])(t[s], e[s]));
  return (s) => {
    for (const r in i)
      n[r] = i[r](s);
    return n;
  };
}
function Ja(t, e) {
  var n;
  const i = [], s = { color: 0, var: 0, number: 0 };
  for (let r = 0; r < e.values.length; r++) {
    const o = e.types[r], a = t.indexes[o][s[o]], l = (n = t.values[a]) !== null && n !== void 0 ? n : 0;
    i[r] = l, s[o]++;
  }
  return i;
}
const tl = (t, e) => {
  const n = et.createTransformer(e), i = Ut(t), s = Ut(e);
  return i.indexes.var.length === s.indexes.var.length && i.indexes.color.length === s.indexes.color.length && i.indexes.number.length >= s.indexes.number.length ? je.has(t) && !s.values.length || je.has(e) && !i.values.length ? qa(t, e) : Wt(eo(Ja(i, s), s.values), n) : (Vt(!0, `Complex values '${t}' and '${e}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`), ee(t, e));
};
function no(t, e, n) {
  return typeof t == "number" && typeof e == "number" && typeof n == "number" ? M(t, e, n) : wn(t)(t, e);
}
const el = 5;
function io(t, e, n) {
  const i = Math.max(e - el, 0);
  return Vs(n - t(i), e - i);
}
const D = {
  // Default spring physics
  stiffness: 100,
  damping: 10,
  mass: 1,
  velocity: 0,
  // Default duration/bounce-based options
  duration: 800,
  // in ms
  bounce: 0.3,
  visualDuration: 0.3,
  // in seconds
  // Rest thresholds
  restSpeed: {
    granular: 0.01,
    default: 2
  },
  restDelta: {
    granular: 5e-3,
    default: 0.5
  },
  // Limits
  minDuration: 0.01,
  // in seconds
  maxDuration: 10,
  // in seconds
  minDamping: 0.05,
  maxDamping: 1
}, Te = 1e-3;
function nl({ duration: t = D.duration, bounce: e = D.bounce, velocity: n = D.velocity, mass: i = D.mass }) {
  let s, r;
  Vt(t <= /* @__PURE__ */ H(D.maxDuration), "Spring duration must be 10 seconds or less");
  let o = 1 - e;
  o = Z(D.minDamping, D.maxDamping, o), t = Z(D.minDuration, D.maxDuration, /* @__PURE__ */ X(t)), o < 1 ? (s = (u) => {
    const c = u * o, d = c * t, f = c - n, h = Ne(u, o), m = Math.exp(-d);
    return Te - f / h * m;
  }, r = (u) => {
    const d = u * o * t, f = d * n + n, h = Math.pow(o, 2) * Math.pow(u, 2) * t, m = Math.exp(-d), p = Ne(Math.pow(u, 2), o);
    return (-s(u) + Te > 0 ? -1 : 1) * ((f - h) * m) / p;
  }) : (s = (u) => {
    const c = Math.exp(-u * t), d = (u - n) * t + 1;
    return -Te + c * d;
  }, r = (u) => {
    const c = Math.exp(-u * t), d = (n - u) * (t * t);
    return c * d;
  });
  const a = 5 / t, l = sl(s, r, a);
  if (t = /* @__PURE__ */ H(t), isNaN(l))
    return {
      stiffness: D.stiffness,
      damping: D.damping,
      duration: t
    };
  {
    const u = Math.pow(l, 2) * i;
    return {
      stiffness: u,
      damping: o * 2 * Math.sqrt(i * u),
      duration: t
    };
  }
}
const il = 12;
function sl(t, e, n) {
  let i = n;
  for (let s = 1; s < il; s++)
    i = i - t(i) / e(i);
  return i;
}
function Ne(t, e) {
  return t * Math.sqrt(1 - e * e);
}
const ol = ["duration", "bounce"], rl = ["stiffness", "damping", "mass"];
function Xn(t, e) {
  return e.some((n) => t[n] !== void 0);
}
function al(t) {
  let e = {
    velocity: D.velocity,
    stiffness: D.stiffness,
    damping: D.damping,
    mass: D.mass,
    isResolvedFromDuration: !1,
    ...t
  };
  if (!Xn(t, rl) && Xn(t, ol))
    if (t.visualDuration) {
      const n = t.visualDuration, i = 2 * Math.PI / (n * 1.2), s = i * i, r = 2 * Z(0.05, 1, 1 - (t.bounce || 0)) * Math.sqrt(s);
      e = {
        ...e,
        mass: D.mass,
        stiffness: s,
        damping: r
      };
    } else {
      const n = nl(t);
      e = {
        ...e,
        ...n,
        mass: D.mass
      }, e.isResolvedFromDuration = !0;
    }
  return e;
}
function so(t = D.visualDuration, e = D.bounce) {
  const n = typeof t != "object" ? {
    visualDuration: t,
    keyframes: [0, 1],
    bounce: e
  } : t;
  let { restSpeed: i, restDelta: s } = n;
  const r = n.keyframes[0], o = n.keyframes[n.keyframes.length - 1], a = { done: !1, value: r }, { stiffness: l, damping: u, mass: c, duration: d, velocity: f, isResolvedFromDuration: h } = al({
    ...n,
    velocity: -/* @__PURE__ */ X(n.velocity || 0)
  }), m = f || 0, p = u / (2 * Math.sqrt(l * c)), y = o - r, g = /* @__PURE__ */ X(Math.sqrt(l / c)), v = Math.abs(y) < 5;
  i || (i = v ? D.restSpeed.granular : D.restSpeed.default), s || (s = v ? D.restDelta.granular : D.restDelta.default);
  let b;
  if (p < 1) {
    const x = Ne(g, p);
    b = (w) => {
      const V = Math.exp(-p * g * w);
      return o - V * ((m + p * g * y) / x * Math.sin(x * w) + y * Math.cos(x * w));
    };
  } else if (p === 1)
    b = (x) => o - Math.exp(-g * x) * (y + (m + g * y) * x);
  else {
    const x = g * Math.sqrt(p * p - 1);
    b = (w) => {
      const V = Math.exp(-p * g * w), P = Math.min(x * w, 300);
      return o - V * ((m + p * g * y) * Math.sinh(P) + x * y * Math.cosh(P)) / x;
    };
  }
  const S = {
    calculatedDuration: h && d || null,
    next: (x) => {
      const w = b(x);
      if (h)
        a.done = x >= d;
      else {
        let V = 0;
        p < 1 && (V = x === 0 ? /* @__PURE__ */ H(m) : io(b, x, w));
        const P = Math.abs(V) <= i, L = Math.abs(o - w) <= s;
        a.done = P && L;
      }
      return a.value = a.done ? o : w, a;
    },
    toString: () => {
      const x = Math.min(to(S), Oe), w = Ds((V) => S.next(x * V).value, x, 30);
      return x + "ms " + w;
    }
  };
  return S;
}
function qn({ keyframes: t, velocity: e = 0, power: n = 0.8, timeConstant: i = 325, bounceDamping: s = 10, bounceStiffness: r = 500, modifyTarget: o, min: a, max: l, restDelta: u = 0.5, restSpeed: c }) {
  const d = t[0], f = {
    done: !1,
    value: d
  }, h = (P) => a !== void 0 && P < a || l !== void 0 && P > l, m = (P) => a === void 0 ? l : l === void 0 || Math.abs(a - P) < Math.abs(l - P) ? a : l;
  let p = n * e;
  const y = d + p, g = o === void 0 ? y : o(y);
  g !== y && (p = g - d);
  const v = (P) => -p * Math.exp(-P / i), b = (P) => g + v(P), S = (P) => {
    const L = v(P), F = b(P);
    f.done = Math.abs(L) <= u, f.value = f.done ? g : F;
  };
  let x, w;
  const V = (P) => {
    h(f.value) && (x = P, w = so({
      keyframes: [f.value, m(f.value)],
      velocity: io(b, P, f.value),
      // TODO: This should be passing * 1000
      damping: s,
      stiffness: r,
      restDelta: u,
      restSpeed: c
    }));
  };
  return V(0), {
    calculatedDuration: null,
    next: (P) => {
      let L = !1;
      return !w && x === void 0 && (L = !0, S(P), V(P)), x !== void 0 && P >= x ? w.next(P - x) : (!L && S(P), f);
    }
  };
}
const ll = /* @__PURE__ */ Kt(0.42, 0, 1, 1), ul = /* @__PURE__ */ Kt(0, 0, 0.58, 1), oo = /* @__PURE__ */ Kt(0.42, 0, 0.58, 1), cl = (t) => Array.isArray(t) && typeof t[0] != "number", Zn = {
  linear: N,
  easeIn: ll,
  easeInOut: oo,
  easeOut: ul,
  circIn: vn,
  circInOut: js,
  circOut: Os,
  backIn: yn,
  backInOut: Fs,
  backOut: Bs,
  anticipate: Is
}, Qn = (t) => {
  if (gn(t)) {
    tt(t.length === 4, "Cubic bezier arrays must contain four numerical values.");
    const [e, n, i, s] = t;
    return Kt(e, n, i, s);
  } else if (typeof t == "string")
    return tt(Zn[t] !== void 0, `Invalid easing type '${t}'`), Zn[t];
  return t;
};
function dl(t, e, n) {
  const i = [], s = n || no, r = t.length - 1;
  for (let o = 0; o < r; o++) {
    let a = s(t[o], t[o + 1]);
    if (e) {
      const l = Array.isArray(e) ? e[o] || N : e;
      a = Wt(l, a);
    }
    i.push(a);
  }
  return i;
}
function ro(t, e, { clamp: n = !0, ease: i, mixer: s } = {}) {
  const r = t.length;
  if (tt(r === e.length, "Both input and output ranges must be the same length"), r === 1)
    return () => e[0];
  if (r === 2 && e[0] === e[1])
    return () => e[1];
  const o = t[0] === t[1];
  t[0] > t[r - 1] && (t = [...t].reverse(), e = [...e].reverse());
  const a = dl(e, i, s), l = a.length, u = (c) => {
    if (o && c < t[0])
      return e[0];
    let d = 0;
    if (l > 1)
      for (; d < t.length - 2 && !(c < t[d + 1]); d++)
        ;
    const f = /* @__PURE__ */ xt(t[d], t[d + 1], c);
    return a[d](f);
  };
  return n ? (c) => u(Z(t[0], t[r - 1], c)) : u;
}
function fl(t, e) {
  const n = t[t.length - 1];
  for (let i = 1; i <= e; i++) {
    const s = /* @__PURE__ */ xt(0, e, i);
    t.push(M(n, 1, s));
  }
}
function hl(t) {
  const e = [0];
  return fl(e, t.length - 1), e;
}
function ml(t, e) {
  return t.map((n) => n * e);
}
function pl(t, e) {
  return t.map(() => e || oo).splice(0, t.length - 1);
}
function ne({ duration: t = 300, keyframes: e, times: n, ease: i = "easeInOut" }) {
  const s = cl(i) ? i.map(Qn) : Qn(i), r = {
    done: !1,
    value: e[0]
  }, o = ml(
    // Only use the provided offsets if they're the correct length
    // TODO Maybe we should warn here if there's a length mismatch
    n && n.length === e.length ? n : hl(e),
    t
  ), a = ro(o, e, {
    ease: Array.isArray(s) ? s : pl(e, s)
  });
  return {
    calculatedDuration: t,
    next: (l) => (r.value = a(l), r.done = l >= t, r)
  };
}
const gl = (t) => {
  const e = ({ timestamp: n }) => t(n);
  return {
    start: () => A.update(e, !0),
    stop: () => q(e),
    /**
     * If we're processing this frame we can use the
     * framelocked timestamp to keep things in sync.
     */
    now: () => k.isProcessing ? k.timestamp : z.now()
  };
}, yl = {
  decay: qn,
  inertia: qn,
  tween: ne,
  keyframes: ne,
  spring: so
}, vl = (t) => t / 100;
class me extends Js {
  constructor(e) {
    super(e), this.holdTime = null, this.cancelTime = null, this.currentTime = 0, this.playbackSpeed = 1, this.pendingPlayState = "running", this.startTime = null, this.state = "idle", this.stop = () => {
      if (this.resolver.cancel(), this.isStopped = !0, this.state === "idle")
        return;
      this.teardown();
      const { onStop: l } = this.options;
      l && l();
    };
    const { name: n, motionValue: i, element: s, keyframes: r } = this.options, o = s?.KeyframeResolver || Pn, a = (l, u) => this.onKeyframesResolved(l, u);
    this.resolver = new o(r, a, n, i, s), this.resolver.scheduleResolve();
  }
  flatten() {
    super.flatten(), this._resolved && Object.assign(this._resolved, this.initPlayback(this._resolved.keyframes));
  }
  initPlayback(e) {
    const { type: n = "keyframes", repeat: i = 0, repeatDelay: s = 0, repeatType: r, velocity: o = 0 } = this.options, a = pn(n) ? n : yl[n] || ne;
    let l, u;
    a !== ne && typeof e[0] != "number" && (process.env.NODE_ENV !== "production" && tt(e.length === 2, `Only two keyframes currently supported with spring and inertia animations. Trying to animate ${e}`), l = Wt(vl, no(e[0], e[1])), e = [0, 100]);
    const c = a({ ...this.options, keyframes: e });
    r === "mirror" && (u = a({
      ...this.options,
      keyframes: [...e].reverse(),
      velocity: -o
    })), c.calculatedDuration === null && (c.calculatedDuration = to(c));
    const { calculatedDuration: d } = c, f = d + s, h = f * (i + 1) - s;
    return {
      generator: c,
      mirroredGenerator: u,
      mapPercentToKeyframes: l,
      calculatedDuration: d,
      resolvedDuration: f,
      totalDuration: h
    };
  }
  onPostResolved() {
    const { autoplay: e = !0 } = this.options;
    this.play(), this.pendingPlayState === "paused" || !e ? this.pause() : this.state = this.pendingPlayState;
  }
  tick(e, n = !1) {
    const { resolved: i } = this;
    if (!i) {
      const { keyframes: P } = this.options;
      return { done: !0, value: P[P.length - 1] };
    }
    const { finalKeyframe: s, generator: r, mirroredGenerator: o, mapPercentToKeyframes: a, keyframes: l, calculatedDuration: u, totalDuration: c, resolvedDuration: d } = i;
    if (this.startTime === null)
      return r.next(0);
    const { delay: f, repeat: h, repeatType: m, repeatDelay: p, onUpdate: y } = this.options;
    this.speed > 0 ? this.startTime = Math.min(this.startTime, e) : this.speed < 0 && (this.startTime = Math.min(e - c / this.speed, this.startTime)), n ? this.currentTime = e : this.holdTime !== null ? this.currentTime = this.holdTime : this.currentTime = Math.round(e - this.startTime) * this.speed;
    const g = this.currentTime - f * (this.speed >= 0 ? 1 : -1), v = this.speed >= 0 ? g < 0 : g > c;
    this.currentTime = Math.max(g, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = c);
    let b = this.currentTime, S = r;
    if (h) {
      const P = Math.min(this.currentTime, c) / d;
      let L = Math.floor(P), F = P % 1;
      !F && P >= 1 && (F = 1), F === 1 && L--, L = Math.min(L, h + 1), L % 2 && (m === "reverse" ? (F = 1 - F, p && (F -= p / d)) : m === "mirror" && (S = o)), b = Z(0, 1, F) * d;
    }
    const x = v ? { done: !1, value: l[0] } : S.next(b);
    a && (x.value = a(x.value));
    let { done: w } = x;
    !v && u !== null && (w = this.speed >= 0 ? this.currentTime >= c : this.currentTime <= 0);
    const V = this.holdTime === null && (this.state === "finished" || this.state === "running" && w);
    return V && s !== void 0 && (x.value = he(l, this.options, s)), y && y(x.value), V && this.finish(), x;
  }
  get duration() {
    const { resolved: e } = this;
    return e ? /* @__PURE__ */ X(e.calculatedDuration) : 0;
  }
  get time() {
    return /* @__PURE__ */ X(this.currentTime);
  }
  set time(e) {
    e = /* @__PURE__ */ H(e), this.currentTime = e, this.holdTime !== null || this.speed === 0 ? this.holdTime = e : this.driver && (this.startTime = this.driver.now() - e / this.speed);
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(e) {
    const n = this.playbackSpeed !== e;
    this.playbackSpeed = e, n && (this.time = /* @__PURE__ */ X(this.currentTime));
  }
  play() {
    if (this.resolver.isScheduled || this.resolver.resume(), !this._resolved) {
      this.pendingPlayState = "running";
      return;
    }
    if (this.isStopped)
      return;
    const { driver: e = gl, onPlay: n, startTime: i } = this.options;
    this.driver || (this.driver = e((r) => this.tick(r))), n && n();
    const s = this.driver.now();
    this.holdTime !== null ? this.startTime = s - this.holdTime : this.startTime ? this.state === "finished" && (this.startTime = s) : this.startTime = i ?? this.calcStartTime(), this.state === "finished" && this.updateFinishedPromise(), this.cancelTime = this.startTime, this.holdTime = null, this.state = "running", this.driver.start();
  }
  pause() {
    var e;
    if (!this._resolved) {
      this.pendingPlayState = "paused";
      return;
    }
    this.state = "paused", this.holdTime = (e = this.currentTime) !== null && e !== void 0 ? e : 0;
  }
  complete() {
    this.state !== "running" && this.play(), this.pendingPlayState = this.state = "finished", this.holdTime = null;
  }
  finish() {
    this.teardown(), this.state = "finished";
    const { onComplete: e } = this.options;
    e && e();
  }
  cancel() {
    this.cancelTime !== null && this.tick(this.cancelTime), this.teardown(), this.updateFinishedPromise();
  }
  teardown() {
    this.state = "idle", this.stopDriver(), this.resolveFinishedPromise(), this.updateFinishedPromise(), this.startTime = this.cancelTime = null, this.resolver.cancel();
  }
  stopDriver() {
    this.driver && (this.driver.stop(), this.driver = void 0);
  }
  sample(e) {
    return this.startTime = 0, this.tick(e, !0);
  }
}
function bl(t) {
  return new me(t);
}
const xl = /* @__PURE__ */ new Set([
  "opacity",
  "clipPath",
  "filter",
  "transform"
  // TODO: Can be accelerated but currently disabled until https://issues.chromium.org/issues/41491098 is resolved
  // or until we implement support for linear() easing.
  // "background-color"
]);
function Tl(t, e, n, { delay: i = 0, duration: s = 300, repeat: r = 0, repeatType: o = "loop", ease: a = "easeInOut", times: l } = {}) {
  const u = { [e]: n };
  l && (u.offset = l);
  const c = Rs(a, s);
  return Array.isArray(c) && (u.easing = c), t.animate(u, {
    delay: i,
    duration: s,
    easing: Array.isArray(c) ? "linear" : c,
    fill: "both",
    iterations: r + 1,
    direction: o === "reverse" ? "alternate" : "normal"
  });
}
const Pl = /* @__PURE__ */ mn(() => Object.hasOwnProperty.call(Element.prototype, "animate")), ie = 10, wl = 2e4;
function Sl(t) {
  return pn(t.type) || t.type === "spring" || !Ms(t.ease);
}
function Al(t, e) {
  const n = new me({
    ...e,
    keyframes: t,
    repeat: 0,
    delay: 0,
    isGenerator: !0
  });
  let i = { done: !1, value: t[0] };
  const s = [];
  let r = 0;
  for (; !i.done && r < wl; )
    i = n.sample(r), s.push(i.value), r += ie;
  return {
    times: void 0,
    keyframes: s,
    duration: r - ie,
    ease: "linear"
  };
}
const ao = {
  anticipate: Is,
  backInOut: Fs,
  circInOut: js
};
function Vl(t) {
  return t in ao;
}
class Jn extends Js {
  constructor(e) {
    super(e);
    const { name: n, motionValue: i, element: s, keyframes: r } = this.options;
    this.resolver = new Qs(r, (o, a) => this.onKeyframesResolved(o, a), n, i, s), this.resolver.scheduleResolve();
  }
  initPlayback(e, n) {
    let { duration: i = 300, times: s, ease: r, type: o, motionValue: a, name: l, startTime: u } = this.options;
    if (!a.owner || !a.owner.current)
      return !1;
    if (typeof r == "string" && te() && Vl(r) && (r = ao[r]), Sl(this.options)) {
      const { onComplete: d, onUpdate: f, motionValue: h, element: m, ...p } = this.options, y = Al(e, p);
      e = y.keyframes, e.length === 1 && (e[1] = e[0]), i = y.duration, s = y.times, r = y.ease, o = "keyframes";
    }
    const c = Tl(a.owner.current, l, e, { ...this.options, duration: i, times: s, ease: r });
    return c.startTime = u ?? this.calcStartTime(), this.pendingTimeline ? (Un(c, this.pendingTimeline), this.pendingTimeline = void 0) : c.onfinish = () => {
      const { onComplete: d } = this.options;
      a.set(he(e, this.options, n)), d && d(), this.cancel(), this.resolveFinishedPromise();
    }, {
      animation: c,
      duration: i,
      times: s,
      type: o,
      ease: r,
      keyframes: e
    };
  }
  get duration() {
    const { resolved: e } = this;
    if (!e)
      return 0;
    const { duration: n } = e;
    return /* @__PURE__ */ X(n);
  }
  get time() {
    const { resolved: e } = this;
    if (!e)
      return 0;
    const { animation: n } = e;
    return /* @__PURE__ */ X(n.currentTime || 0);
  }
  set time(e) {
    const { resolved: n } = this;
    if (!n)
      return;
    const { animation: i } = n;
    i.currentTime = /* @__PURE__ */ H(e);
  }
  get speed() {
    const { resolved: e } = this;
    if (!e)
      return 1;
    const { animation: n } = e;
    return n.playbackRate;
  }
  set speed(e) {
    const { resolved: n } = this;
    if (!n)
      return;
    const { animation: i } = n;
    i.playbackRate = e;
  }
  get state() {
    const { resolved: e } = this;
    if (!e)
      return "idle";
    const { animation: n } = e;
    return n.playState;
  }
  get startTime() {
    const { resolved: e } = this;
    if (!e)
      return null;
    const { animation: n } = e;
    return n.startTime;
  }
  /**
   * Replace the default DocumentTimeline with another AnimationTimeline.
   * Currently used for scroll animations.
   */
  attachTimeline(e) {
    if (!this._resolved)
      this.pendingTimeline = e;
    else {
      const { resolved: n } = this;
      if (!n)
        return N;
      const { animation: i } = n;
      Un(i, e);
    }
    return N;
  }
  play() {
    if (this.isStopped)
      return;
    const { resolved: e } = this;
    if (!e)
      return;
    const { animation: n } = e;
    n.playState === "finished" && this.updateFinishedPromise(), n.play();
  }
  pause() {
    const { resolved: e } = this;
    if (!e)
      return;
    const { animation: n } = e;
    n.pause();
  }
  stop() {
    if (this.resolver.cancel(), this.isStopped = !0, this.state === "idle")
      return;
    this.resolveFinishedPromise(), this.updateFinishedPromise();
    const { resolved: e } = this;
    if (!e)
      return;
    const { animation: n, keyframes: i, duration: s, type: r, ease: o, times: a } = e;
    if (n.playState === "idle" || n.playState === "finished")
      return;
    if (this.time) {
      const { motionValue: u, onUpdate: c, onComplete: d, element: f, ...h } = this.options, m = new me({
        ...h,
        keyframes: i,
        duration: s,
        type: r,
        ease: o,
        times: a,
        isGenerator: !0
      }), p = /* @__PURE__ */ H(this.time);
      u.setWithVelocity(m.sample(p - ie).value, m.sample(p).value, ie);
    }
    const { onStop: l } = this.options;
    l && l(), this.cancel();
  }
  complete() {
    const { resolved: e } = this;
    e && e.animation.finish();
  }
  cancel() {
    const { resolved: e } = this;
    e && e.animation.cancel();
  }
  static supports(e) {
    const { motionValue: n, name: i, repeatDelay: s, repeatType: r, damping: o, type: a } = e;
    if (!n || !n.owner || !(n.owner.current instanceof HTMLElement))
      return !1;
    const { onUpdate: l, transformTemplate: u } = n.owner.getProps();
    return Pl() && i && xl.has(i) && /**
     * If we're outputting values to onUpdate then we can't use WAAPI as there's
     * no way to read the value from WAAPI every frame.
     */
    !l && !u && !s && r !== "mirror" && o !== 0 && a !== "inertia";
  }
}
const Cl = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  restSpeed: 10
}, Dl = (t) => ({
  type: "spring",
  stiffness: 550,
  damping: t === 0 ? 2 * Math.sqrt(550) : 30,
  restSpeed: 10
}), Ml = {
  type: "keyframes",
  duration: 0.8
}, Rl = {
  type: "keyframes",
  ease: [0.25, 0.1, 0.35, 1],
  duration: 0.3
}, El = (t, { keyframes: e }) => e.length > 2 ? Ml : dt.has(t) ? t.startsWith("scale") ? Dl(e[1]) : Cl : Rl;
function Ll({ when: t, delay: e, delayChildren: n, staggerChildren: i, staggerDirection: s, repeat: r, repeatType: o, repeatDelay: a, from: l, elapsed: u, ...c }) {
  return !!Object.keys(c).length;
}
const Sn = (t, e, n, i = {}, s, r) => (o) => {
  const a = cn(i, t) || {}, l = a.delay || i.delay || 0;
  let { elapsed: u = 0 } = i;
  u = u - /* @__PURE__ */ H(l);
  let c = {
    keyframes: Array.isArray(n) ? n : [null, n],
    ease: "easeOut",
    velocity: e.getVelocity(),
    ...a,
    delay: -u,
    onUpdate: (f) => {
      e.set(f), a.onUpdate && a.onUpdate(f);
    },
    onComplete: () => {
      o(), a.onComplete && a.onComplete();
    },
    name: t,
    motionValue: e,
    element: r ? void 0 : s
  };
  Ll(a) || (c = {
    ...c,
    ...El(t, c)
  }), c.duration && (c.duration = /* @__PURE__ */ H(c.duration)), c.repeatDelay && (c.repeatDelay = /* @__PURE__ */ H(c.repeatDelay)), c.from !== void 0 && (c.keyframes[0] = c.from);
  let d = !1;
  if ((c.type === !1 || c.duration === 0 && !c.repeatDelay) && (c.duration = 0, c.delay === 0 && (d = !0)), d && !r && e.get() !== void 0) {
    const f = he(c.keyframes, a);
    if (f !== void 0)
      return A.update(() => {
        c.onUpdate(f), c.onComplete();
      }), new ca([]);
  }
  return !r && Jn.supports(c) ? new Jn(c) : new me(c);
};
function kl({ protectedKeys: t, needsAnimating: e }, n) {
  const i = t.hasOwnProperty(n) && e[n] !== !0;
  return e[n] = !1, i;
}
function lo(t, e, { delay: n = 0, transitionOverride: i, type: s } = {}) {
  var r;
  let { transition: o = t.getDefaultTransition(), transitionEnd: a, ...l } = e;
  i && (o = i);
  const u = [], c = s && t.animationState && t.animationState.getState()[s];
  for (const d in l) {
    const f = t.getValue(d, (r = t.latestValues[d]) !== null && r !== void 0 ? r : null), h = l[d];
    if (h === void 0 || c && kl(c, d))
      continue;
    const m = {
      delay: n,
      ...cn(o || {}, d)
    };
    let p = !1;
    if (window.MotionHandoffAnimation) {
      const g = Cs(t);
      if (g) {
        const v = window.MotionHandoffAnimation(g, d, A);
        v !== null && (m.startTime = v, p = !0);
      }
    }
    Ee(t, d), f.start(Sn(d, f, h, t.shouldReduceMotion && As.has(d) ? { type: !1 } : m, t, p));
    const y = f.animation;
    y && u.push(y);
  }
  return a && Promise.all(u).then(() => {
    A.update(() => {
      a && ra(t, a);
    });
  }), u;
}
function Ue(t, e, n = {}) {
  var i;
  const s = fe(t, e, n.type === "exit" ? (i = t.presenceContext) === null || i === void 0 ? void 0 : i.custom : void 0);
  let { transition: r = t.getDefaultTransition() || {} } = s || {};
  n.transitionOverride && (r = n.transitionOverride);
  const o = s ? () => Promise.all(lo(t, s, n)) : () => Promise.resolve(), a = t.variantChildren && t.variantChildren.size ? (u = 0) => {
    const { delayChildren: c = 0, staggerChildren: d, staggerDirection: f } = r;
    return Bl(t, e, c + u, d, f, n);
  } : () => Promise.resolve(), { when: l } = r;
  if (l) {
    const [u, c] = l === "beforeChildren" ? [o, a] : [a, o];
    return u().then(() => c());
  } else
    return Promise.all([o(), a(n.delay)]);
}
function Bl(t, e, n = 0, i = 0, s = 1, r) {
  const o = [], a = (t.variantChildren.size - 1) * i, l = s === 1 ? (u = 0) => u * i : (u = 0) => a - u * i;
  return Array.from(t.variantChildren).sort(Fl).forEach((u, c) => {
    u.notify("AnimationStart", e), o.push(Ue(u, e, {
      ...r,
      delay: n + l(c)
    }).then(() => u.notify("AnimationComplete", e)));
  }), Promise.all(o);
}
function Fl(t, e) {
  return t.sortNodePosition(e);
}
function Il(t, e, n = {}) {
  t.notify("AnimationStart", e);
  let i;
  if (Array.isArray(e)) {
    const s = e.map((r) => Ue(t, r, n));
    i = Promise.all(s);
  } else if (typeof e == "string")
    i = Ue(t, e, n);
  else {
    const s = typeof e == "function" ? fe(t, e, n.custom) : e;
    i = Promise.all(lo(t, s, n));
  }
  return i.then(() => {
    t.notify("AnimationComplete", e);
  });
}
const Ol = Ze.length;
function uo(t) {
  if (!t)
    return;
  if (!t.isControllingVariants) {
    const n = t.parent ? uo(t.parent) || {} : {};
    return t.props.initial !== void 0 && (n.initial = t.props.initial), n;
  }
  const e = {};
  for (let n = 0; n < Ol; n++) {
    const i = Ze[n], s = t.props[i];
    (jt(s) || s === !1) && (e[i] = s);
  }
  return e;
}
const jl = [...qe].reverse(), Nl = qe.length;
function Ul(t) {
  return (e) => Promise.all(e.map(({ animation: n, options: i }) => Il(t, n, i)));
}
function $l(t) {
  let e = Ul(t), n = ti(), i = !0;
  const s = (l) => (u, c) => {
    var d;
    const f = fe(t, c, l === "exit" ? (d = t.presenceContext) === null || d === void 0 ? void 0 : d.custom : void 0);
    if (f) {
      const { transition: h, transitionEnd: m, ...p } = f;
      u = { ...u, ...p, ...m };
    }
    return u;
  };
  function r(l) {
    e = l(t);
  }
  function o(l) {
    const { props: u } = t, c = uo(t.parent) || {}, d = [], f = /* @__PURE__ */ new Set();
    let h = {}, m = 1 / 0;
    for (let y = 0; y < Nl; y++) {
      const g = jl[y], v = n[g], b = u[g] !== void 0 ? u[g] : c[g], S = jt(b), x = g === l ? v.isActive : null;
      x === !1 && (m = y);
      let w = b === c[g] && b !== u[g] && S;
      if (w && i && t.manuallyAnimateOnMount && (w = !1), v.protectedKeys = { ...h }, // If it isn't active and hasn't *just* been set as inactive
      !v.isActive && x === null || // If we didn't and don't have any defined prop for this animation type
      !b && !v.prevProp || // Or if the prop doesn't define an animation
      ce(b) || typeof b == "boolean")
        continue;
      const V = _l(v.prevProp, b);
      let P = V || // If we're making this variant active, we want to always make it active
      g === l && v.isActive && !w && S || // If we removed a higher-priority variant (i is in reverse order)
      y > m && S, L = !1;
      const F = Array.isArray(b) ? b : [b];
      let Q = F.reduce(s(g), {});
      x === !1 && (Q = {});
      const { prevResolvedValues: Vn = {} } = v, Fo = {
        ...Vn,
        ...Q
      }, Cn = (j) => {
        P = !0, f.has(j) && (L = !0, f.delete(j)), v.needsAnimating[j] = !0;
        const Y = t.getValue(j);
        Y && (Y.liveStyle = !1);
      };
      for (const j in Fo) {
        const Y = Q[j], pe = Vn[j];
        if (h.hasOwnProperty(j))
          continue;
        let ge = !1;
        Re(Y) && Re(pe) ? ge = !Ss(Y, pe) : ge = Y !== pe, ge ? Y != null ? Cn(j) : f.add(j) : Y !== void 0 && f.has(j) ? Cn(j) : v.protectedKeys[j] = !0;
      }
      v.prevProp = b, v.prevResolvedValues = Q, v.isActive && (h = { ...h, ...Q }), i && t.blockInitialAnimation && (P = !1), P && (!(w && V) || L) && d.push(...F.map((j) => ({
        animation: j,
        options: { type: g }
      })));
    }
    if (f.size) {
      const y = {};
      f.forEach((g) => {
        const v = t.getBaseTarget(g), b = t.getValue(g);
        b && (b.liveStyle = !0), y[g] = v ?? null;
      }), d.push({ animation: y });
    }
    let p = !!d.length;
    return i && (u.initial === !1 || u.initial === u.animate) && !t.manuallyAnimateOnMount && (p = !1), i = !1, p ? e(d) : Promise.resolve();
  }
  function a(l, u) {
    var c;
    if (n[l].isActive === u)
      return Promise.resolve();
    (c = t.variantChildren) === null || c === void 0 || c.forEach((f) => {
      var h;
      return (h = f.animationState) === null || h === void 0 ? void 0 : h.setActive(l, u);
    }), n[l].isActive = u;
    const d = o(l);
    for (const f in n)
      n[f].protectedKeys = {};
    return d;
  }
  return {
    animateChanges: o,
    setActive: a,
    setAnimateFunction: r,
    getState: () => n,
    reset: () => {
      n = ti(), i = !0;
    }
  };
}
function _l(t, e) {
  return typeof e == "string" ? e !== t : Array.isArray(e) ? !Ss(e, t) : !1;
}
function ot(t = !1) {
  return {
    isActive: t,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {}
  };
}
function ti() {
  return {
    animate: ot(!0),
    whileInView: ot(),
    whileHover: ot(),
    whileTap: ot(),
    whileDrag: ot(),
    whileFocus: ot(),
    exit: ot()
  };
}
class st {
  constructor(e) {
    this.isMounted = !1, this.node = e;
  }
  update() {
  }
}
class Kl extends st {
  /**
   * We dynamically generate the AnimationState manager as it contains a reference
   * to the underlying animation library. We only want to load that if we load this,
   * so people can optionally code split it out using the `m` component.
   */
  constructor(e) {
    super(e), e.animationState || (e.animationState = $l(e));
  }
  updateAnimationControlsSubscription() {
    const { animate: e } = this.node.getProps();
    ce(e) && (this.unmountControls = e.subscribe(this.node));
  }
  /**
   * Subscribe any provided AnimationControls to the component's VisualElement
   */
  mount() {
    this.updateAnimationControlsSubscription();
  }
  update() {
    const { animate: e } = this.node.getProps(), { animate: n } = this.node.prevProps || {};
    e !== n && this.updateAnimationControlsSubscription();
  }
  unmount() {
    var e;
    this.node.animationState.reset(), (e = this.unmountControls) === null || e === void 0 || e.call(this);
  }
}
let Wl = 0;
class Gl extends st {
  constructor() {
    super(...arguments), this.id = Wl++;
  }
  update() {
    if (!this.node.presenceContext)
      return;
    const { isPresent: e, onExitComplete: n } = this.node.presenceContext, { isPresent: i } = this.node.prevPresenceContext || {};
    if (!this.node.animationState || e === i)
      return;
    const s = this.node.animationState.setActive("exit", !e);
    n && !e && s.then(() => n(this.id));
  }
  mount() {
    const { register: e } = this.node.presenceContext || {};
    e && (this.unmount = e(this.id));
  }
  unmount() {
  }
}
const zl = {
  animation: {
    Feature: Kl
  },
  exit: {
    Feature: Gl
  }
}, W = {
  x: !1,
  y: !1
};
function co() {
  return W.x || W.y;
}
function Hl(t) {
  return t === "x" || t === "y" ? W[t] ? null : (W[t] = !0, () => {
    W[t] = !1;
  }) : W.x || W.y ? null : (W.x = W.y = !0, () => {
    W.x = W.y = !1;
  });
}
const An = (t) => t.pointerType === "mouse" ? typeof t.button != "number" || t.button <= 0 : t.isPrimary !== !1;
function $t(t, e, n, i = { passive: !0 }) {
  return t.addEventListener(e, n, i), () => t.removeEventListener(e, n);
}
function Gt(t) {
  return {
    point: {
      x: t.pageX,
      y: t.pageY
    }
  };
}
const Yl = (t) => (e) => An(e) && t(e, Gt(e));
function Ft(t, e, n, i) {
  return $t(t, e, Yl(n), i);
}
const ei = (t, e) => Math.abs(t - e);
function Xl(t, e) {
  const n = ei(t.x, e.x), i = ei(t.y, e.y);
  return Math.sqrt(n ** 2 + i ** 2);
}
class fo {
  constructor(e, n, { transformPagePoint: i, contextWindow: s, dragSnapToOrigin: r = !1 } = {}) {
    if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.updatePoint = () => {
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const d = we(this.lastMoveEventInfo, this.history), f = this.startEvent !== null, h = Xl(d.offset, { x: 0, y: 0 }) >= 3;
      if (!f && !h)
        return;
      const { point: m } = d, { timestamp: p } = k;
      this.history.push({ ...m, timestamp: p });
      const { onStart: y, onMove: g } = this.handlers;
      f || (y && y(this.lastMoveEvent, d), this.startEvent = this.lastMoveEvent), g && g(this.lastMoveEvent, d);
    }, this.handlePointerMove = (d, f) => {
      this.lastMoveEvent = d, this.lastMoveEventInfo = Pe(f, this.transformPagePoint), A.update(this.updatePoint, !0);
    }, this.handlePointerUp = (d, f) => {
      this.end();
      const { onEnd: h, onSessionEnd: m, resumeAnimation: p } = this.handlers;
      if (this.dragSnapToOrigin && p && p(), !(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const y = we(d.type === "pointercancel" ? this.lastMoveEventInfo : Pe(f, this.transformPagePoint), this.history);
      this.startEvent && h && h(d, y), m && m(d, y);
    }, !An(e))
      return;
    this.dragSnapToOrigin = r, this.handlers = n, this.transformPagePoint = i, this.contextWindow = s || window;
    const o = Gt(e), a = Pe(o, this.transformPagePoint), { point: l } = a, { timestamp: u } = k;
    this.history = [{ ...l, timestamp: u }];
    const { onSessionStart: c } = n;
    c && c(e, we(a, this.history)), this.removeListeners = Wt(Ft(this.contextWindow, "pointermove", this.handlePointerMove), Ft(this.contextWindow, "pointerup", this.handlePointerUp), Ft(this.contextWindow, "pointercancel", this.handlePointerUp));
  }
  updateHandlers(e) {
    this.handlers = e;
  }
  end() {
    this.removeListeners && this.removeListeners(), q(this.updatePoint);
  }
}
function Pe(t, e) {
  return e ? { point: e(t.point) } : t;
}
function ni(t, e) {
  return { x: t.x - e.x, y: t.y - e.y };
}
function we({ point: t }, e) {
  return {
    point: t,
    delta: ni(t, ho(e)),
    offset: ni(t, ql(e)),
    velocity: Zl(e, 0.1)
  };
}
function ql(t) {
  return t[0];
}
function ho(t) {
  return t[t.length - 1];
}
function Zl(t, e) {
  if (t.length < 2)
    return { x: 0, y: 0 };
  let n = t.length - 1, i = null;
  const s = ho(t);
  for (; n >= 0 && (i = t[n], !(s.timestamp - i.timestamp > /* @__PURE__ */ H(e))); )
    n--;
  if (!i)
    return { x: 0, y: 0 };
  const r = /* @__PURE__ */ X(s.timestamp - i.timestamp);
  if (r === 0)
    return { x: 0, y: 0 };
  const o = {
    x: (s.x - i.x) / r,
    y: (s.y - i.y) / r
  };
  return o.x === 1 / 0 && (o.x = 0), o.y === 1 / 0 && (o.y = 0), o;
}
const mo = 1e-4, Ql = 1 - mo, Jl = 1 + mo, po = 0.01, tu = 0 - po, eu = 0 + po;
function U(t) {
  return t.max - t.min;
}
function nu(t, e, n) {
  return Math.abs(t - e) <= n;
}
function ii(t, e, n, i = 0.5) {
  t.origin = i, t.originPoint = M(e.min, e.max, t.origin), t.scale = U(n) / U(e), t.translate = M(n.min, n.max, t.origin) - t.originPoint, (t.scale >= Ql && t.scale <= Jl || isNaN(t.scale)) && (t.scale = 1), (t.translate >= tu && t.translate <= eu || isNaN(t.translate)) && (t.translate = 0);
}
function It(t, e, n, i) {
  ii(t.x, e.x, n.x, i ? i.originX : void 0), ii(t.y, e.y, n.y, i ? i.originY : void 0);
}
function si(t, e, n) {
  t.min = n.min + e.min, t.max = t.min + U(e);
}
function iu(t, e, n) {
  si(t.x, e.x, n.x), si(t.y, e.y, n.y);
}
function oi(t, e, n) {
  t.min = e.min - n.min, t.max = t.min + U(e);
}
function Ot(t, e, n) {
  oi(t.x, e.x, n.x), oi(t.y, e.y, n.y);
}
function su(t, { min: e, max: n }, i) {
  return e !== void 0 && t < e ? t = i ? M(e, t, i.min) : Math.max(t, e) : n !== void 0 && t > n && (t = i ? M(n, t, i.max) : Math.min(t, n)), t;
}
function ri(t, e, n) {
  return {
    min: e !== void 0 ? t.min + e : void 0,
    max: n !== void 0 ? t.max + n - (t.max - t.min) : void 0
  };
}
function ou(t, { top: e, left: n, bottom: i, right: s }) {
  return {
    x: ri(t.x, n, s),
    y: ri(t.y, e, i)
  };
}
function ai(t, e) {
  let n = e.min - t.min, i = e.max - t.max;
  return e.max - e.min < t.max - t.min && ([n, i] = [i, n]), { min: n, max: i };
}
function ru(t, e) {
  return {
    x: ai(t.x, e.x),
    y: ai(t.y, e.y)
  };
}
function au(t, e) {
  let n = 0.5;
  const i = U(t), s = U(e);
  return s > i ? n = /* @__PURE__ */ xt(e.min, e.max - i, t.min) : i > s && (n = /* @__PURE__ */ xt(t.min, t.max - s, e.min)), Z(0, 1, n);
}
function lu(t, e) {
  const n = {};
  return e.min !== void 0 && (n.min = e.min - t.min), e.max !== void 0 && (n.max = e.max - t.min), n;
}
const $e = 0.35;
function uu(t = $e) {
  return t === !1 ? t = 0 : t === !0 && (t = $e), {
    x: li(t, "left", "right"),
    y: li(t, "top", "bottom")
  };
}
function li(t, e, n) {
  return {
    min: ui(t, e),
    max: ui(t, n)
  };
}
function ui(t, e) {
  return typeof t == "number" ? t : t[e] || 0;
}
const ci = () => ({
  translate: 0,
  scale: 1,
  origin: 0,
  originPoint: 0
}), mt = () => ({
  x: ci(),
  y: ci()
}), di = () => ({ min: 0, max: 0 }), E = () => ({
  x: di(),
  y: di()
});
function _(t) {
  return [t("x"), t("y")];
}
function go({ top: t, left: e, right: n, bottom: i }) {
  return {
    x: { min: e, max: n },
    y: { min: t, max: i }
  };
}
function cu({ x: t, y: e }) {
  return { top: e.min, right: t.max, bottom: e.max, left: t.min };
}
function du(t, e) {
  if (!e)
    return t;
  const n = e({ x: t.left, y: t.top }), i = e({ x: t.right, y: t.bottom });
  return {
    top: n.y,
    left: n.x,
    bottom: i.y,
    right: i.x
  };
}
function Se(t) {
  return t === void 0 || t === 1;
}
function _e({ scale: t, scaleX: e, scaleY: n }) {
  return !Se(t) || !Se(e) || !Se(n);
}
function rt(t) {
  return _e(t) || yo(t) || t.z || t.rotate || t.rotateX || t.rotateY || t.skewX || t.skewY;
}
function yo(t) {
  return fi(t.x) || fi(t.y);
}
function fi(t) {
  return t && t !== "0%";
}
function se(t, e, n) {
  const i = t - n, s = e * i;
  return n + s;
}
function hi(t, e, n, i, s) {
  return s !== void 0 && (t = se(t, s, i)), se(t, n, i) + e;
}
function Ke(t, e = 0, n = 1, i, s) {
  t.min = hi(t.min, e, n, i, s), t.max = hi(t.max, e, n, i, s);
}
function vo(t, { x: e, y: n }) {
  Ke(t.x, e.translate, e.scale, e.originPoint), Ke(t.y, n.translate, n.scale, n.originPoint);
}
const mi = 0.999999999999, pi = 1.0000000000001;
function fu(t, e, n, i = !1) {
  const s = n.length;
  if (!s)
    return;
  e.x = e.y = 1;
  let r, o;
  for (let a = 0; a < s; a++) {
    r = n[a], o = r.projectionDelta;
    const { visualElement: l } = r.options;
    l && l.props.style && l.props.style.display === "contents" || (i && r.options.layoutScroll && r.scroll && r !== r.root && gt(t, {
      x: -r.scroll.offset.x,
      y: -r.scroll.offset.y
    }), o && (e.x *= o.x.scale, e.y *= o.y.scale, vo(t, o)), i && rt(r.latestValues) && gt(t, r.latestValues));
  }
  e.x < pi && e.x > mi && (e.x = 1), e.y < pi && e.y > mi && (e.y = 1);
}
function pt(t, e) {
  t.min = t.min + e, t.max = t.max + e;
}
function gi(t, e, n, i, s = 0.5) {
  const r = M(t.min, t.max, s);
  Ke(t, e, n, r, i);
}
function gt(t, e) {
  gi(t.x, e.x, e.scaleX, e.scale, e.originX), gi(t.y, e.y, e.scaleY, e.scale, e.originY);
}
function bo(t, e) {
  return go(du(t.getBoundingClientRect(), e));
}
function hu(t, e, n) {
  const i = bo(t, n), { scroll: s } = e;
  return s && (pt(i.x, s.offset.x), pt(i.y, s.offset.y)), i;
}
const xo = ({ current: t }) => t ? t.ownerDocument.defaultView : null, mu = /* @__PURE__ */ new WeakMap();
class pu {
  constructor(e) {
    this.openDragLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = { x: 0, y: 0 }, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = E(), this.visualElement = e;
  }
  start(e, { snapToCursor: n = !1 } = {}) {
    const { presenceContext: i } = this.visualElement;
    if (i && i.isPresent === !1)
      return;
    const s = (c) => {
      const { dragSnapToOrigin: d } = this.getProps();
      d ? this.pauseAnimation() : this.stopAnimation(), n && this.snapToCursor(Gt(c).point);
    }, r = (c, d) => {
      const { drag: f, dragPropagation: h, onDragStart: m } = this.getProps();
      if (f && !h && (this.openDragLock && this.openDragLock(), this.openDragLock = Hl(f), !this.openDragLock))
        return;
      this.isDragging = !0, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0, this.visualElement.projection.target = void 0), _((y) => {
        let g = this.getAxisMotionValue(y).get() || 0;
        if (G.test(g)) {
          const { projection: v } = this.visualElement;
          if (v && v.layout) {
            const b = v.layout.layoutBox[y];
            b && (g = U(b) * (parseFloat(g) / 100));
          }
        }
        this.originPoint[y] = g;
      }), m && A.postRender(() => m(c, d)), Ee(this.visualElement, "transform");
      const { animationState: p } = this.visualElement;
      p && p.setActive("whileDrag", !0);
    }, o = (c, d) => {
      const { dragPropagation: f, dragDirectionLock: h, onDirectionLock: m, onDrag: p } = this.getProps();
      if (!f && !this.openDragLock)
        return;
      const { offset: y } = d;
      if (h && this.currentDirection === null) {
        this.currentDirection = gu(y), this.currentDirection !== null && m && m(this.currentDirection);
        return;
      }
      this.updateAxis("x", d.point, y), this.updateAxis("y", d.point, y), this.visualElement.render(), p && p(c, d);
    }, a = (c, d) => this.stop(c, d), l = () => _((c) => {
      var d;
      return this.getAnimationState(c) === "paused" && ((d = this.getAxisMotionValue(c).animation) === null || d === void 0 ? void 0 : d.play());
    }), { dragSnapToOrigin: u } = this.getProps();
    this.panSession = new fo(e, {
      onSessionStart: s,
      onStart: r,
      onMove: o,
      onSessionEnd: a,
      resumeAnimation: l
    }, {
      transformPagePoint: this.visualElement.getTransformPagePoint(),
      dragSnapToOrigin: u,
      contextWindow: xo(this.visualElement)
    });
  }
  stop(e, n) {
    const i = this.isDragging;
    if (this.cancel(), !i)
      return;
    const { velocity: s } = n;
    this.startAnimation(s);
    const { onDragEnd: r } = this.getProps();
    r && A.postRender(() => r(e, n));
  }
  cancel() {
    this.isDragging = !1;
    const { projection: e, animationState: n } = this.visualElement;
    e && (e.isAnimationBlocked = !1), this.panSession && this.panSession.end(), this.panSession = void 0;
    const { dragPropagation: i } = this.getProps();
    !i && this.openDragLock && (this.openDragLock(), this.openDragLock = null), n && n.setActive("whileDrag", !1);
  }
  updateAxis(e, n, i) {
    const { drag: s } = this.getProps();
    if (!i || !Yt(e, s, this.currentDirection))
      return;
    const r = this.getAxisMotionValue(e);
    let o = this.originPoint[e] + i[e];
    this.constraints && this.constraints[e] && (o = su(o, this.constraints[e], this.elastic[e])), r.set(o);
  }
  resolveConstraints() {
    var e;
    const { dragConstraints: n, dragElastic: i } = this.getProps(), s = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : (e = this.visualElement.projection) === null || e === void 0 ? void 0 : e.layout, r = this.constraints;
    n && ft(n) ? this.constraints || (this.constraints = this.resolveRefConstraints()) : n && s ? this.constraints = ou(s.layoutBox, n) : this.constraints = !1, this.elastic = uu(i), r !== this.constraints && s && this.constraints && !this.hasMutatedConstraints && _((o) => {
      this.constraints !== !1 && this.getAxisMotionValue(o) && (this.constraints[o] = lu(s.layoutBox[o], this.constraints[o]));
    });
  }
  resolveRefConstraints() {
    const { dragConstraints: e, onMeasureDragConstraints: n } = this.getProps();
    if (!e || !ft(e))
      return !1;
    const i = e.current;
    tt(i !== null, "If `dragConstraints` is set as a React ref, that ref must be passed to another component's `ref` prop.");
    const { projection: s } = this.visualElement;
    if (!s || !s.layout)
      return !1;
    const r = hu(i, s.root, this.visualElement.getTransformPagePoint());
    let o = ru(s.layout.layoutBox, r);
    if (n) {
      const a = n(cu(o));
      this.hasMutatedConstraints = !!a, a && (o = go(a));
    }
    return o;
  }
  startAnimation(e) {
    const { drag: n, dragMomentum: i, dragElastic: s, dragTransition: r, dragSnapToOrigin: o, onDragTransitionEnd: a } = this.getProps(), l = this.constraints || {}, u = _((c) => {
      if (!Yt(c, n, this.currentDirection))
        return;
      let d = l && l[c] || {};
      o && (d = { min: 0, max: 0 });
      const f = s ? 200 : 1e6, h = s ? 40 : 1e7, m = {
        type: "inertia",
        velocity: i ? e[c] : 0,
        bounceStiffness: f,
        bounceDamping: h,
        timeConstant: 750,
        restDelta: 1,
        restSpeed: 10,
        ...r,
        ...d
      };
      return this.startAxisValueAnimation(c, m);
    });
    return Promise.all(u).then(a);
  }
  startAxisValueAnimation(e, n) {
    const i = this.getAxisMotionValue(e);
    return Ee(this.visualElement, e), i.start(Sn(e, i, 0, n, this.visualElement, !1));
  }
  stopAnimation() {
    _((e) => this.getAxisMotionValue(e).stop());
  }
  pauseAnimation() {
    _((e) => {
      var n;
      return (n = this.getAxisMotionValue(e).animation) === null || n === void 0 ? void 0 : n.pause();
    });
  }
  getAnimationState(e) {
    var n;
    return (n = this.getAxisMotionValue(e).animation) === null || n === void 0 ? void 0 : n.state;
  }
  /**
   * Drag works differently depending on which props are provided.
   *
   * - If _dragX and _dragY are provided, we output the gesture delta directly to those motion values.
   * - Otherwise, we apply the delta to the x/y motion values.
   */
  getAxisMotionValue(e) {
    const n = `_drag${e.toUpperCase()}`, i = this.visualElement.getProps(), s = i[n];
    return s || this.visualElement.getValue(e, (i.initial ? i.initial[e] : void 0) || 0);
  }
  snapToCursor(e) {
    _((n) => {
      const { drag: i } = this.getProps();
      if (!Yt(n, i, this.currentDirection))
        return;
      const { projection: s } = this.visualElement, r = this.getAxisMotionValue(n);
      if (s && s.layout) {
        const { min: o, max: a } = s.layout.layoutBox[n];
        r.set(e[n] - M(o, a, 0.5));
      }
    });
  }
  /**
   * When the viewport resizes we want to check if the measured constraints
   * have changed and, if so, reposition the element within those new constraints
   * relative to where it was before the resize.
   */
  scalePositionWithinConstraints() {
    if (!this.visualElement.current)
      return;
    const { drag: e, dragConstraints: n } = this.getProps(), { projection: i } = this.visualElement;
    if (!ft(n) || !i || !this.constraints)
      return;
    this.stopAnimation();
    const s = { x: 0, y: 0 };
    _((o) => {
      const a = this.getAxisMotionValue(o);
      if (a && this.constraints !== !1) {
        const l = a.get();
        s[o] = au({ min: l, max: l }, this.constraints[o]);
      }
    });
    const { transformTemplate: r } = this.visualElement.getProps();
    this.visualElement.current.style.transform = r ? r({}, "") : "none", i.root && i.root.updateScroll(), i.updateLayout(), this.resolveConstraints(), _((o) => {
      if (!Yt(o, e, null))
        return;
      const a = this.getAxisMotionValue(o), { min: l, max: u } = this.constraints[o];
      a.set(M(l, u, s[o]));
    });
  }
  addListeners() {
    if (!this.visualElement.current)
      return;
    mu.set(this.visualElement, this);
    const e = this.visualElement.current, n = Ft(e, "pointerdown", (l) => {
      const { drag: u, dragListener: c = !0 } = this.getProps();
      u && c && this.start(l);
    }), i = () => {
      const { dragConstraints: l } = this.getProps();
      ft(l) && l.current && (this.constraints = this.resolveRefConstraints());
    }, { projection: s } = this.visualElement, r = s.addEventListener("measure", i);
    s && !s.layout && (s.root && s.root.updateScroll(), s.updateLayout()), A.read(i);
    const o = $t(window, "resize", () => this.scalePositionWithinConstraints()), a = s.addEventListener("didUpdate", (({ delta: l, hasLayoutChanged: u }) => {
      this.isDragging && u && (_((c) => {
        const d = this.getAxisMotionValue(c);
        d && (this.originPoint[c] += l[c].translate, d.set(d.get() + l[c].translate));
      }), this.visualElement.render());
    }));
    return () => {
      o(), n(), r(), a && a();
    };
  }
  getProps() {
    const e = this.visualElement.getProps(), { drag: n = !1, dragDirectionLock: i = !1, dragPropagation: s = !1, dragConstraints: r = !1, dragElastic: o = $e, dragMomentum: a = !0 } = e;
    return {
      ...e,
      drag: n,
      dragDirectionLock: i,
      dragPropagation: s,
      dragConstraints: r,
      dragElastic: o,
      dragMomentum: a
    };
  }
}
function Yt(t, e, n) {
  return (e === !0 || e === t) && (n === null || n === t);
}
function gu(t, e = 10) {
  let n = null;
  return Math.abs(t.y) > e ? n = "y" : Math.abs(t.x) > e && (n = "x"), n;
}
class yu extends st {
  constructor(e) {
    super(e), this.removeGroupControls = N, this.removeListeners = N, this.controls = new pu(e);
  }
  mount() {
    const { dragControls: e } = this.node.getProps();
    e && (this.removeGroupControls = e.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || N;
  }
  unmount() {
    this.removeGroupControls(), this.removeListeners();
  }
}
const yi = (t) => (e, n) => {
  t && A.postRender(() => t(e, n));
};
class vu extends st {
  constructor() {
    super(...arguments), this.removePointerDownListener = N;
  }
  onPointerDown(e) {
    this.session = new fo(e, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: xo(this.node)
    });
  }
  createPanHandlers() {
    const { onPanSessionStart: e, onPanStart: n, onPan: i, onPanEnd: s } = this.node.getProps();
    return {
      onSessionStart: yi(e),
      onStart: yi(n),
      onMove: i,
      onEnd: (r, o) => {
        delete this.session, s && A.postRender(() => s(r, o));
      }
    };
  }
  mount() {
    this.removePointerDownListener = Ft(this.node.current, "pointerdown", (e) => this.onPointerDown(e));
  }
  update() {
    this.session && this.session.updateHandlers(this.createPanHandlers());
  }
  unmount() {
    this.removePointerDownListener(), this.session && this.session.end();
  }
}
const Zt = {
  /**
   * Global flag as to whether the tree has animated since the last time
   * we resized the window
   */
  hasAnimatedSinceResize: !0,
  /**
   * We set this to true once, on the first update. Any nodes added to the tree beyond that
   * update will be given a `data-projection-id` attribute.
   */
  hasEverUpdated: !1
};
function vi(t, e) {
  return e.max === e.min ? 0 : t / (e.max - e.min) * 100;
}
const Mt = {
  correct: (t, e) => {
    if (!e.target)
      return t;
    if (typeof t == "string")
      if (T.test(t))
        t = parseFloat(t);
      else
        return t;
    const n = vi(t, e.target.x), i = vi(t, e.target.y);
    return `${n}% ${i}%`;
  }
}, bu = {
  correct: (t, { treeScale: e, projectionDelta: n }) => {
    const i = t, s = et.parse(t);
    if (s.length > 5)
      return i;
    const r = et.createTransformer(t), o = typeof s[0] != "number" ? 1 : 0, a = n.x.scale * e.x, l = n.y.scale * e.y;
    s[0 + o] /= a, s[1 + o] /= l;
    const u = M(a, l, 0.5);
    return typeof s[2 + o] == "number" && (s[2 + o] /= u), typeof s[3 + o] == "number" && (s[3 + o] /= u), r(s);
  }
};
class xu extends $o {
  /**
   * This only mounts projection nodes for components that
   * need measuring, we might want to do it for all components
   * in order to incorporate transforms
   */
  componentDidMount() {
    const { visualElement: e, layoutGroup: n, switchLayoutGroup: i, layoutId: s } = this.props, { projection: r } = e;
    zr(Tu), r && (n.group && n.group.add(r), i && i.register && s && i.register(r), r.root.didUpdate(), r.addEventListener("animationComplete", () => {
      this.safeToRemove();
    }), r.setOptions({
      ...r.options,
      onExitComplete: () => this.safeToRemove()
    })), Zt.hasEverUpdated = !0;
  }
  getSnapshotBeforeUpdate(e) {
    const { layoutDependency: n, visualElement: i, drag: s, isPresent: r } = this.props, o = i.projection;
    return o && (o.isPresent = r, s || e.layoutDependency !== n || n === void 0 ? o.willUpdate() : this.safeToRemove(), e.isPresent !== r && (r ? o.promote() : o.relegate() || A.postRender(() => {
      const a = o.getStack();
      (!a || !a.members.length) && this.safeToRemove();
    }))), null;
  }
  componentDidUpdate() {
    const { projection: e } = this.props.visualElement;
    e && (e.root.didUpdate(), Je.postRender(() => {
      !e.currentAnimation && e.isLead() && this.safeToRemove();
    }));
  }
  componentWillUnmount() {
    const { visualElement: e, layoutGroup: n, switchLayoutGroup: i } = this.props, { projection: s } = e;
    s && (s.scheduleCheckAfterUnmount(), n && n.group && n.group.remove(s), i && i.deregister && i.deregister(s));
  }
  safeToRemove() {
    const { safeToRemove: e } = this.props;
    e && e();
  }
  render() {
    return null;
  }
}
function To(t) {
  const [e, n] = lr(), i = O(os);
  return R(xu, { ...t, layoutGroup: i, switchLayoutGroup: O(ds), isPresent: e, safeToRemove: n });
}
const Tu = {
  borderRadius: {
    ...Mt,
    applyTo: [
      "borderTopLeftRadius",
      "borderTopRightRadius",
      "borderBottomLeftRadius",
      "borderBottomRightRadius"
    ]
  },
  borderTopLeftRadius: Mt,
  borderTopRightRadius: Mt,
  borderBottomLeftRadius: Mt,
  borderBottomRightRadius: Mt,
  boxShadow: bu
};
function Pu(t, e, n) {
  const i = B(t) ? t : bt(t);
  return i.start(Sn("", i, e, n)), i.animation;
}
function wu(t) {
  return t instanceof SVGElement && t.tagName !== "svg";
}
const Su = (t, e) => t.depth - e.depth;
class Au {
  constructor() {
    this.children = [], this.isDirty = !1;
  }
  add(e) {
    dn(this.children, e), this.isDirty = !0;
  }
  remove(e) {
    fn(this.children, e), this.isDirty = !0;
  }
  forEach(e) {
    this.isDirty && this.children.sort(Su), this.isDirty = !1, this.children.forEach(e);
  }
}
function Vu(t, e) {
  const n = z.now(), i = ({ timestamp: s }) => {
    const r = s - n;
    r >= e && (q(i), t(r - e));
  };
  return A.read(i, !0), () => q(i);
}
const Po = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"], Cu = Po.length, bi = (t) => typeof t == "string" ? parseFloat(t) : t, xi = (t) => typeof t == "number" || T.test(t);
function Du(t, e, n, i, s, r) {
  s ? (t.opacity = M(
    0,
    // TODO Reinstate this if only child
    n.opacity !== void 0 ? n.opacity : 1,
    Mu(i)
  ), t.opacityExit = M(e.opacity !== void 0 ? e.opacity : 1, 0, Ru(i))) : r && (t.opacity = M(e.opacity !== void 0 ? e.opacity : 1, n.opacity !== void 0 ? n.opacity : 1, i));
  for (let o = 0; o < Cu; o++) {
    const a = `border${Po[o]}Radius`;
    let l = Ti(e, a), u = Ti(n, a);
    if (l === void 0 && u === void 0)
      continue;
    l || (l = 0), u || (u = 0), l === 0 || u === 0 || xi(l) === xi(u) ? (t[a] = Math.max(M(bi(l), bi(u), i), 0), (G.test(u) || G.test(l)) && (t[a] += "%")) : t[a] = u;
  }
  (e.rotate || n.rotate) && (t.rotate = M(e.rotate || 0, n.rotate || 0, i));
}
function Ti(t, e) {
  return t[e] !== void 0 ? t[e] : t.borderRadius;
}
const Mu = /* @__PURE__ */ wo(0, 0.5, Os), Ru = /* @__PURE__ */ wo(0.5, 0.95, N);
function wo(t, e, n) {
  return (i) => i < t ? 0 : i > e ? 1 : n(/* @__PURE__ */ xt(t, e, i));
}
function Pi(t, e) {
  t.min = e.min, t.max = e.max;
}
function $(t, e) {
  Pi(t.x, e.x), Pi(t.y, e.y);
}
function wi(t, e) {
  t.translate = e.translate, t.scale = e.scale, t.originPoint = e.originPoint, t.origin = e.origin;
}
function Si(t, e, n, i, s) {
  return t -= e, t = se(t, 1 / n, i), s !== void 0 && (t = se(t, 1 / s, i)), t;
}
function Eu(t, e = 0, n = 1, i = 0.5, s, r = t, o = t) {
  if (G.test(e) && (e = parseFloat(e), e = M(o.min, o.max, e / 100) - o.min), typeof e != "number")
    return;
  let a = M(r.min, r.max, i);
  t === r && (a -= e), t.min = Si(t.min, e, n, a, s), t.max = Si(t.max, e, n, a, s);
}
function Ai(t, e, [n, i, s], r, o) {
  Eu(t, e[n], e[i], e[s], e.scale, r, o);
}
const Lu = ["x", "scaleX", "originX"], ku = ["y", "scaleY", "originY"];
function Vi(t, e, n, i) {
  Ai(t.x, e, Lu, n ? n.x : void 0, i ? i.x : void 0), Ai(t.y, e, ku, n ? n.y : void 0, i ? i.y : void 0);
}
function Ci(t) {
  return t.translate === 0 && t.scale === 1;
}
function So(t) {
  return Ci(t.x) && Ci(t.y);
}
function Di(t, e) {
  return t.min === e.min && t.max === e.max;
}
function Bu(t, e) {
  return Di(t.x, e.x) && Di(t.y, e.y);
}
function Mi(t, e) {
  return Math.round(t.min) === Math.round(e.min) && Math.round(t.max) === Math.round(e.max);
}
function Ao(t, e) {
  return Mi(t.x, e.x) && Mi(t.y, e.y);
}
function Ri(t) {
  return U(t.x) / U(t.y);
}
function Ei(t, e) {
  return t.translate === e.translate && t.scale === e.scale && t.originPoint === e.originPoint;
}
class Fu {
  constructor() {
    this.members = [];
  }
  add(e) {
    dn(this.members, e), e.scheduleRender();
  }
  remove(e) {
    if (fn(this.members, e), e === this.prevLead && (this.prevLead = void 0), e === this.lead) {
      const n = this.members[this.members.length - 1];
      n && this.promote(n);
    }
  }
  relegate(e) {
    const n = this.members.findIndex((s) => e === s);
    if (n === 0)
      return !1;
    let i;
    for (let s = n; s >= 0; s--) {
      const r = this.members[s];
      if (r.isPresent !== !1) {
        i = r;
        break;
      }
    }
    return i ? (this.promote(i), !0) : !1;
  }
  promote(e, n) {
    const i = this.lead;
    if (e !== i && (this.prevLead = i, this.lead = e, e.show(), i)) {
      i.instance && i.scheduleRender(), e.scheduleRender(), e.resumeFrom = i, n && (e.resumeFrom.preserveOpacity = !0), i.snapshot && (e.snapshot = i.snapshot, e.snapshot.latestValues = i.animationValues || i.latestValues), e.root && e.root.isUpdating && (e.isLayoutDirty = !0);
      const { crossfade: s } = e.options;
      s === !1 && i.hide();
    }
  }
  exitAnimationComplete() {
    this.members.forEach((e) => {
      const { options: n, resumingFrom: i } = e;
      n.onExitComplete && n.onExitComplete(), i && i.options.onExitComplete && i.options.onExitComplete();
    });
  }
  scheduleRender() {
    this.members.forEach((e) => {
      e.instance && e.scheduleRender(!1);
    });
  }
  /**
   * Clear any leads that have been removed this render to prevent them from being
   * used in future animations and to prevent memory leaks
   */
  removeLeadSnapshot() {
    this.lead && this.lead.snapshot && (this.lead.snapshot = void 0);
  }
}
function Iu(t, e, n) {
  let i = "";
  const s = t.x.translate / e.x, r = t.y.translate / e.y, o = n?.z || 0;
  if ((s || r || o) && (i = `translate3d(${s}px, ${r}px, ${o}px) `), (e.x !== 1 || e.y !== 1) && (i += `scale(${1 / e.x}, ${1 / e.y}) `), n) {
    const { transformPerspective: u, rotate: c, rotateX: d, rotateY: f, skewX: h, skewY: m } = n;
    u && (i = `perspective(${u}px) ${i}`), c && (i += `rotate(${c}deg) `), d && (i += `rotateX(${d}deg) `), f && (i += `rotateY(${f}deg) `), h && (i += `skewX(${h}deg) `), m && (i += `skewY(${m}deg) `);
  }
  const a = t.x.scale * e.x, l = t.y.scale * e.y;
  return (a !== 1 || l !== 1) && (i += `scale(${a}, ${l})`), i || "none";
}
const at = {
  type: "projectionFrame",
  totalNodes: 0,
  resolvedTargetDeltas: 0,
  recalculatedProjection: 0
}, Et = typeof window < "u" && window.MotionDebug !== void 0, Ae = ["", "X", "Y", "Z"], Ou = { visibility: "hidden" }, Li = 1e3;
let ju = 0;
function Ve(t, e, n, i) {
  const { latestValues: s } = e;
  s[t] && (n[t] = s[t], e.setStaticValue(t, 0), i && (i[t] = 0));
}
function Vo(t) {
  if (t.hasCheckedOptimisedAppear = !0, t.root === t)
    return;
  const { visualElement: e } = t.options;
  if (!e)
    return;
  const n = Cs(e);
  if (window.MotionHasOptimisedAnimation(n, "transform")) {
    const { layout: s, layoutId: r } = t.options;
    window.MotionCancelOptimisedAnimation(n, "transform", A, !(s || r));
  }
  const { parent: i } = t;
  i && !i.hasCheckedOptimisedAppear && Vo(i);
}
function Co({ attachResizeListener: t, defaultParent: e, measureScroll: n, checkIsScrollRoot: i, resetTransform: s }) {
  return class {
    constructor(o = {}, a = e?.()) {
      this.id = ju++, this.animationId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.hasCheckedOptimisedAppear = !1, this.treeScale = { x: 1, y: 1 }, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = !1, this.updateScheduled = !1, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
        this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots());
      }, this.updateProjection = () => {
        this.projectionUpdateScheduled = !1, Et && (at.totalNodes = at.resolvedTargetDeltas = at.recalculatedProjection = 0), this.nodes.forEach($u), this.nodes.forEach(zu), this.nodes.forEach(Hu), this.nodes.forEach(_u), Et && window.MotionDebug.record(at);
      }, this.resolvedRelativeTargetAt = 0, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = o, this.root = a ? a.root || a : this, this.path = a ? [...a.path, a] : [], this.parent = a, this.depth = a ? a.depth + 1 : 0;
      for (let l = 0; l < this.path.length; l++)
        this.path[l].shouldResetTransform = !0;
      this.root === this && (this.nodes = new Au());
    }
    addEventListener(o, a) {
      return this.eventHandlers.has(o) || this.eventHandlers.set(o, new hn()), this.eventHandlers.get(o).add(a);
    }
    notifyListeners(o, ...a) {
      const l = this.eventHandlers.get(o);
      l && l.notify(...a);
    }
    hasListeners(o) {
      return this.eventHandlers.has(o);
    }
    /**
     * Lifecycles
     */
    mount(o, a = this.root.hasTreeAnimated) {
      if (this.instance)
        return;
      this.isSVG = wu(o), this.instance = o;
      const { layoutId: l, layout: u, visualElement: c } = this.options;
      if (c && !c.current && c.mount(o), this.root.nodes.add(this), this.parent && this.parent.children.add(this), a && (u || l) && (this.isLayoutDirty = !0), t) {
        let d;
        const f = () => this.root.updateBlockedByResize = !1;
        t(o, () => {
          this.root.updateBlockedByResize = !0, d && d(), d = Vu(f, 250), Zt.hasAnimatedSinceResize && (Zt.hasAnimatedSinceResize = !1, this.nodes.forEach(Bi));
        });
      }
      l && this.root.registerSharedNode(l, this), this.options.animate !== !1 && c && (l || u) && this.addEventListener("didUpdate", ({ delta: d, hasLayoutChanged: f, hasRelativeTargetChanged: h, layout: m }) => {
        if (this.isTreeAnimationBlocked()) {
          this.target = void 0, this.relativeTarget = void 0;
          return;
        }
        const p = this.options.transition || c.getDefaultTransition() || Qu, { onLayoutAnimationStart: y, onLayoutAnimationComplete: g } = c.getProps(), v = !this.targetLayout || !Ao(this.targetLayout, m) || h, b = !f && h;
        if (this.options.layoutRoot || this.resumeFrom && this.resumeFrom.instance || b || f && (v || !this.currentAnimation)) {
          this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0), this.setAnimationOrigin(d, b);
          const S = {
            ...cn(p, "layout"),
            onPlay: y,
            onComplete: g
          };
          (c.shouldReduceMotion || this.options.layoutRoot) && (S.delay = 0, S.type = !1), this.startAnimation(S);
        } else
          f || Bi(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
        this.targetLayout = m;
      });
    }
    unmount() {
      this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
      const o = this.getStack();
      o && o.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, q(this.updateProjection);
    }
    // only on the root
    blockUpdate() {
      this.updateManuallyBlocked = !0;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = !1;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || !1;
    }
    // Note: currently only running on root node
    startUpdate() {
      this.isUpdateBlocked() || (this.isUpdating = !0, this.nodes && this.nodes.forEach(Yu), this.animationId++);
    }
    getTransformTemplate() {
      const { visualElement: o } = this.options;
      return o && o.getProps().transformTemplate;
    }
    willUpdate(o = !0) {
      if (this.root.hasTreeAnimated = !0, this.root.isUpdateBlocked()) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && Vo(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty)
        return;
      this.isLayoutDirty = !0;
      for (let c = 0; c < this.path.length; c++) {
        const d = this.path[c];
        d.shouldResetTransform = !0, d.updateScroll("snapshot"), d.options.layoutRoot && d.willUpdate(!1);
      }
      const { layoutId: a, layout: l } = this.options;
      if (a === void 0 && !l)
        return;
      const u = this.getTransformTemplate();
      this.prevTransformTemplateValue = u ? u(this.latestValues, "") : void 0, this.updateSnapshot(), o && this.notifyListeners("willUpdate");
    }
    update() {
      if (this.updateScheduled = !1, this.isUpdateBlocked()) {
        this.unblockUpdate(), this.clearAllSnapshots(), this.nodes.forEach(ki);
        return;
      }
      this.isUpdating || this.nodes.forEach(Wu), this.isUpdating = !1, this.nodes.forEach(Gu), this.nodes.forEach(Nu), this.nodes.forEach(Uu), this.clearAllSnapshots();
      const a = z.now();
      k.delta = Z(0, 1e3 / 60, a - k.timestamp), k.timestamp = a, k.isProcessing = !0, ye.update.process(k), ye.preRender.process(k), ye.render.process(k), k.isProcessing = !1;
    }
    didUpdate() {
      this.updateScheduled || (this.updateScheduled = !0, Je.read(this.scheduleUpdate));
    }
    clearAllSnapshots() {
      this.nodes.forEach(Ku), this.sharedNodes.forEach(Xu);
    }
    scheduleUpdateProjection() {
      this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0, A.preRender(this.updateProjection, !1, !0));
    }
    scheduleCheckAfterUnmount() {
      A.postRender(() => {
        this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
      });
    }
    /**
     * Update measurements
     */
    updateSnapshot() {
      this.snapshot || !this.instance || (this.snapshot = this.measure());
    }
    updateLayout() {
      if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty))
        return;
      if (this.resumeFrom && !this.resumeFrom.instance)
        for (let l = 0; l < this.path.length; l++)
          this.path[l].updateScroll();
      const o = this.layout;
      this.layout = this.measure(!1), this.layoutCorrected = E(), this.isLayoutDirty = !1, this.projectionDelta = void 0, this.notifyListeners("measure", this.layout.layoutBox);
      const { visualElement: a } = this.options;
      a && a.notify("LayoutMeasure", this.layout.layoutBox, o ? o.layoutBox : void 0);
    }
    updateScroll(o = "measure") {
      let a = !!(this.options.layoutScroll && this.instance);
      if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === o && (a = !1), a) {
        const l = i(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase: o,
          isRoot: l,
          offset: n(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : l
        };
      }
    }
    resetTransform() {
      if (!s)
        return;
      const o = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout, a = this.projectionDelta && !So(this.projectionDelta), l = this.getTransformTemplate(), u = l ? l(this.latestValues, "") : void 0, c = u !== this.prevTransformTemplateValue;
      o && (a || rt(this.latestValues) || c) && (s(this.instance, u), this.shouldResetTransform = !1, this.scheduleRender());
    }
    measure(o = !0) {
      const a = this.measurePageBox();
      let l = this.removeElementScroll(a);
      return o && (l = this.removeTransform(l)), Ju(l), {
        animationId: this.root.animationId,
        measuredBox: a,
        layoutBox: l,
        latestValues: {},
        source: this.id
      };
    }
    measurePageBox() {
      var o;
      const { visualElement: a } = this.options;
      if (!a)
        return E();
      const l = a.measureViewportBox();
      if (!(((o = this.scroll) === null || o === void 0 ? void 0 : o.wasRoot) || this.path.some(tc))) {
        const { scroll: c } = this.root;
        c && (pt(l.x, c.offset.x), pt(l.y, c.offset.y));
      }
      return l;
    }
    removeElementScroll(o) {
      var a;
      const l = E();
      if ($(l, o), !((a = this.scroll) === null || a === void 0) && a.wasRoot)
        return l;
      for (let u = 0; u < this.path.length; u++) {
        const c = this.path[u], { scroll: d, options: f } = c;
        c !== this.root && d && f.layoutScroll && (d.wasRoot && $(l, o), pt(l.x, d.offset.x), pt(l.y, d.offset.y));
      }
      return l;
    }
    applyTransform(o, a = !1) {
      const l = E();
      $(l, o);
      for (let u = 0; u < this.path.length; u++) {
        const c = this.path[u];
        !a && c.options.layoutScroll && c.scroll && c !== c.root && gt(l, {
          x: -c.scroll.offset.x,
          y: -c.scroll.offset.y
        }), rt(c.latestValues) && gt(l, c.latestValues);
      }
      return rt(this.latestValues) && gt(l, this.latestValues), l;
    }
    removeTransform(o) {
      const a = E();
      $(a, o);
      for (let l = 0; l < this.path.length; l++) {
        const u = this.path[l];
        if (!u.instance || !rt(u.latestValues))
          continue;
        _e(u.latestValues) && u.updateSnapshot();
        const c = E(), d = u.measurePageBox();
        $(c, d), Vi(a, u.latestValues, u.snapshot ? u.snapshot.layoutBox : void 0, c);
      }
      return rt(this.latestValues) && Vi(a, this.latestValues), a;
    }
    setTargetDelta(o) {
      this.targetDelta = o, this.root.scheduleUpdateProjection(), this.isProjectionDirty = !0;
    }
    setOptions(o) {
      this.options = {
        ...this.options,
        ...o,
        crossfade: o.crossfade !== void 0 ? o.crossfade : !0
      };
    }
    clearMeasurements() {
      this.scroll = void 0, this.layout = void 0, this.snapshot = void 0, this.prevTransformTemplateValue = void 0, this.targetDelta = void 0, this.target = void 0, this.isLayoutDirty = !1;
    }
    forceRelativeParentToResolveTarget() {
      this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== k.timestamp && this.relativeParent.resolveTargetDelta(!0);
    }
    resolveTargetDelta(o = !1) {
      var a;
      const l = this.getLead();
      this.isProjectionDirty || (this.isProjectionDirty = l.isProjectionDirty), this.isTransformDirty || (this.isTransformDirty = l.isTransformDirty), this.isSharedProjectionDirty || (this.isSharedProjectionDirty = l.isSharedProjectionDirty);
      const u = !!this.resumingFrom || this !== l;
      if (!(o || u && this.isSharedProjectionDirty || this.isProjectionDirty || !((a = this.parent) === null || a === void 0) && a.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize))
        return;
      const { layout: d, layoutId: f } = this.options;
      if (!(!this.layout || !(d || f))) {
        if (this.resolvedRelativeTargetAt = k.timestamp, !this.targetDelta && !this.relativeTarget) {
          const h = this.getClosestProjectingParent();
          h && h.layout && this.animationProgress !== 1 ? (this.relativeParent = h, this.forceRelativeParentToResolveTarget(), this.relativeTarget = E(), this.relativeTargetOrigin = E(), Ot(this.relativeTargetOrigin, this.layout.layoutBox, h.layout.layoutBox), $(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
        }
        if (!(!this.relativeTarget && !this.targetDelta)) {
          if (this.target || (this.target = E(), this.targetWithTransforms = E()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), iu(this.target, this.relativeTarget, this.relativeParent.target)) : this.targetDelta ? (this.resumingFrom ? this.target = this.applyTransform(this.layout.layoutBox) : $(this.target, this.layout.layoutBox), vo(this.target, this.targetDelta)) : $(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget) {
            this.attemptToResolveRelativeTarget = !1;
            const h = this.getClosestProjectingParent();
            h && !!h.resumingFrom == !!this.resumingFrom && !h.options.layoutScroll && h.target && this.animationProgress !== 1 ? (this.relativeParent = h, this.forceRelativeParentToResolveTarget(), this.relativeTarget = E(), this.relativeTargetOrigin = E(), Ot(this.relativeTargetOrigin, this.target, h.target), $(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
          }
          Et && at.resolvedTargetDeltas++;
        }
      }
    }
    getClosestProjectingParent() {
      if (!(!this.parent || _e(this.parent.latestValues) || yo(this.parent.latestValues)))
        return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
    }
    isProjecting() {
      return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
    }
    calcProjection() {
      var o;
      const a = this.getLead(), l = !!this.resumingFrom || this !== a;
      let u = !0;
      if ((this.isProjectionDirty || !((o = this.parent) === null || o === void 0) && o.isProjectionDirty) && (u = !1), l && (this.isSharedProjectionDirty || this.isTransformDirty) && (u = !1), this.resolvedRelativeTargetAt === k.timestamp && (u = !1), u)
        return;
      const { layout: c, layoutId: d } = this.options;
      if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(c || d))
        return;
      $(this.layoutCorrected, this.layout.layoutBox);
      const f = this.treeScale.x, h = this.treeScale.y;
      fu(this.layoutCorrected, this.treeScale, this.path, l), a.layout && !a.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (a.target = a.layout.layoutBox, a.targetWithTransforms = E());
      const { target: m } = a;
      if (!m) {
        this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
        return;
      }
      !this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (wi(this.prevProjectionDelta.x, this.projectionDelta.x), wi(this.prevProjectionDelta.y, this.projectionDelta.y)), It(this.projectionDelta, this.layoutCorrected, m, this.latestValues), (this.treeScale.x !== f || this.treeScale.y !== h || !Ei(this.projectionDelta.x, this.prevProjectionDelta.x) || !Ei(this.projectionDelta.y, this.prevProjectionDelta.y)) && (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", m)), Et && at.recalculatedProjection++;
    }
    hide() {
      this.isVisible = !1;
    }
    show() {
      this.isVisible = !0;
    }
    scheduleRender(o = !0) {
      var a;
      if ((a = this.options.visualElement) === null || a === void 0 || a.scheduleRender(), o) {
        const l = this.getStack();
        l && l.scheduleRender();
      }
      this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
    }
    createProjectionDeltas() {
      this.prevProjectionDelta = mt(), this.projectionDelta = mt(), this.projectionDeltaWithTransform = mt();
    }
    setAnimationOrigin(o, a = !1) {
      const l = this.snapshot, u = l ? l.latestValues : {}, c = { ...this.latestValues }, d = mt();
      (!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !a;
      const f = E(), h = l ? l.source : void 0, m = this.layout ? this.layout.source : void 0, p = h !== m, y = this.getStack(), g = !y || y.members.length <= 1, v = !!(p && !g && this.options.crossfade === !0 && !this.path.some(Zu));
      this.animationProgress = 0;
      let b;
      this.mixTargetDelta = (S) => {
        const x = S / 1e3;
        Fi(d.x, o.x, x), Fi(d.y, o.y, x), this.setTargetDelta(d), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (Ot(f, this.layout.layoutBox, this.relativeParent.layout.layoutBox), qu(this.relativeTarget, this.relativeTargetOrigin, f, x), b && Bu(this.relativeTarget, b) && (this.isProjectionDirty = !1), b || (b = E()), $(b, this.relativeTarget)), p && (this.animationValues = c, Du(c, u, this.latestValues, x, v, g)), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = x;
      }, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
    }
    startAnimation(o) {
      this.notifyListeners("animationStart"), this.currentAnimation && this.currentAnimation.stop(), this.resumingFrom && this.resumingFrom.currentAnimation && this.resumingFrom.currentAnimation.stop(), this.pendingAnimation && (q(this.pendingAnimation), this.pendingAnimation = void 0), this.pendingAnimation = A.update(() => {
        Zt.hasAnimatedSinceResize = !0, this.currentAnimation = Pu(0, Li, {
          ...o,
          onUpdate: (a) => {
            this.mixTargetDelta(a), o.onUpdate && o.onUpdate(a);
          },
          onComplete: () => {
            o.onComplete && o.onComplete(), this.completeAnimation();
          }
        }), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0;
      });
    }
    completeAnimation() {
      this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
      const o = this.getStack();
      o && o.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = void 0, this.notifyListeners("animationComplete");
    }
    finishAnimation() {
      this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(Li), this.currentAnimation.stop()), this.completeAnimation();
    }
    applyTransformsToTarget() {
      const o = this.getLead();
      let { targetWithTransforms: a, target: l, layout: u, latestValues: c } = o;
      if (!(!a || !l || !u)) {
        if (this !== o && this.layout && u && Do(this.options.animationType, this.layout.layoutBox, u.layoutBox)) {
          l = this.target || E();
          const d = U(this.layout.layoutBox.x);
          l.x.min = o.target.x.min, l.x.max = l.x.min + d;
          const f = U(this.layout.layoutBox.y);
          l.y.min = o.target.y.min, l.y.max = l.y.min + f;
        }
        $(a, l), gt(a, c), It(this.projectionDeltaWithTransform, this.layoutCorrected, a, c);
      }
    }
    registerSharedNode(o, a) {
      this.sharedNodes.has(o) || this.sharedNodes.set(o, new Fu()), this.sharedNodes.get(o).add(a);
      const u = a.options.initialPromotionConfig;
      a.promote({
        transition: u ? u.transition : void 0,
        preserveFollowOpacity: u && u.shouldPreserveFollowOpacity ? u.shouldPreserveFollowOpacity(a) : void 0
      });
    }
    isLead() {
      const o = this.getStack();
      return o ? o.lead === this : !0;
    }
    getLead() {
      var o;
      const { layoutId: a } = this.options;
      return a ? ((o = this.getStack()) === null || o === void 0 ? void 0 : o.lead) || this : this;
    }
    getPrevLead() {
      var o;
      const { layoutId: a } = this.options;
      return a ? (o = this.getStack()) === null || o === void 0 ? void 0 : o.prevLead : void 0;
    }
    getStack() {
      const { layoutId: o } = this.options;
      if (o)
        return this.root.sharedNodes.get(o);
    }
    promote({ needsReset: o, transition: a, preserveFollowOpacity: l } = {}) {
      const u = this.getStack();
      u && u.promote(this, l), o && (this.projectionDelta = void 0, this.needsReset = !0), a && this.setOptions({ transition: a });
    }
    relegate() {
      const o = this.getStack();
      return o ? o.relegate(this) : !1;
    }
    resetSkewAndRotation() {
      const { visualElement: o } = this.options;
      if (!o)
        return;
      let a = !1;
      const { latestValues: l } = o;
      if ((l.z || l.rotate || l.rotateX || l.rotateY || l.rotateZ || l.skewX || l.skewY) && (a = !0), !a)
        return;
      const u = {};
      l.z && Ve("z", o, u, this.animationValues);
      for (let c = 0; c < Ae.length; c++)
        Ve(`rotate${Ae[c]}`, o, u, this.animationValues), Ve(`skew${Ae[c]}`, o, u, this.animationValues);
      o.render();
      for (const c in u)
        o.setStaticValue(c, u[c]), this.animationValues && (this.animationValues[c] = u[c]);
      o.scheduleRender();
    }
    getProjectionStyles(o) {
      var a, l;
      if (!this.instance || this.isSVG)
        return;
      if (!this.isVisible)
        return Ou;
      const u = {
        visibility: ""
      }, c = this.getTransformTemplate();
      if (this.needsReset)
        return this.needsReset = !1, u.opacity = "", u.pointerEvents = Xt(o?.pointerEvents) || "", u.transform = c ? c(this.latestValues, "") : "none", u;
      const d = this.getLead();
      if (!this.projectionDelta || !this.layout || !d.target) {
        const p = {};
        return this.options.layoutId && (p.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1, p.pointerEvents = Xt(o?.pointerEvents) || ""), this.hasProjected && !rt(this.latestValues) && (p.transform = c ? c({}, "") : "none", this.hasProjected = !1), p;
      }
      const f = d.animationValues || d.latestValues;
      this.applyTransformsToTarget(), u.transform = Iu(this.projectionDeltaWithTransform, this.treeScale, f), c && (u.transform = c(f, u.transform));
      const { x: h, y: m } = this.projectionDelta;
      u.transformOrigin = `${h.origin * 100}% ${m.origin * 100}% 0`, d.animationValues ? u.opacity = d === this ? (l = (a = f.opacity) !== null && a !== void 0 ? a : this.latestValues.opacity) !== null && l !== void 0 ? l : 1 : this.preserveOpacity ? this.latestValues.opacity : f.opacityExit : u.opacity = d === this ? f.opacity !== void 0 ? f.opacity : "" : f.opacityExit !== void 0 ? f.opacityExit : 0;
      for (const p in Jt) {
        if (f[p] === void 0)
          continue;
        const { correct: y, applyTo: g } = Jt[p], v = u.transform === "none" ? f[p] : y(f[p], d);
        if (g) {
          const b = g.length;
          for (let S = 0; S < b; S++)
            u[g[S]] = v;
        } else
          u[p] = v;
      }
      return this.options.layoutId && (u.pointerEvents = d === this ? Xt(o?.pointerEvents) || "" : "none"), u;
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    // Only run on root
    resetTree() {
      this.root.nodes.forEach((o) => {
        var a;
        return (a = o.currentAnimation) === null || a === void 0 ? void 0 : a.stop();
      }), this.root.nodes.forEach(ki), this.root.sharedNodes.clear();
    }
  };
}
function Nu(t) {
  t.updateLayout();
}
function Uu(t) {
  var e;
  const n = ((e = t.resumeFrom) === null || e === void 0 ? void 0 : e.snapshot) || t.snapshot;
  if (t.isLead() && t.layout && n && t.hasListeners("didUpdate")) {
    const { layoutBox: i, measuredBox: s } = t.layout, { animationType: r } = t.options, o = n.source !== t.layout.source;
    r === "size" ? _((d) => {
      const f = o ? n.measuredBox[d] : n.layoutBox[d], h = U(f);
      f.min = i[d].min, f.max = f.min + h;
    }) : Do(r, n.layoutBox, i) && _((d) => {
      const f = o ? n.measuredBox[d] : n.layoutBox[d], h = U(i[d]);
      f.max = f.min + h, t.relativeTarget && !t.currentAnimation && (t.isProjectionDirty = !0, t.relativeTarget[d].max = t.relativeTarget[d].min + h);
    });
    const a = mt();
    It(a, i, n.layoutBox);
    const l = mt();
    o ? It(l, t.applyTransform(s, !0), n.measuredBox) : It(l, i, n.layoutBox);
    const u = !So(a);
    let c = !1;
    if (!t.resumeFrom) {
      const d = t.getClosestProjectingParent();
      if (d && !d.resumeFrom) {
        const { snapshot: f, layout: h } = d;
        if (f && h) {
          const m = E();
          Ot(m, n.layoutBox, f.layoutBox);
          const p = E();
          Ot(p, i, h.layoutBox), Ao(m, p) || (c = !0), d.options.layoutRoot && (t.relativeTarget = p, t.relativeTargetOrigin = m, t.relativeParent = d);
        }
      }
    }
    t.notifyListeners("didUpdate", {
      layout: i,
      snapshot: n,
      delta: l,
      layoutDelta: a,
      hasLayoutChanged: u,
      hasRelativeTargetChanged: c
    });
  } else if (t.isLead()) {
    const { onExitComplete: i } = t.options;
    i && i();
  }
  t.options.transition = void 0;
}
function $u(t) {
  Et && at.totalNodes++, t.parent && (t.isProjecting() || (t.isProjectionDirty = t.parent.isProjectionDirty), t.isSharedProjectionDirty || (t.isSharedProjectionDirty = !!(t.isProjectionDirty || t.parent.isProjectionDirty || t.parent.isSharedProjectionDirty)), t.isTransformDirty || (t.isTransformDirty = t.parent.isTransformDirty));
}
function _u(t) {
  t.isProjectionDirty = t.isSharedProjectionDirty = t.isTransformDirty = !1;
}
function Ku(t) {
  t.clearSnapshot();
}
function ki(t) {
  t.clearMeasurements();
}
function Wu(t) {
  t.isLayoutDirty = !1;
}
function Gu(t) {
  const { visualElement: e } = t.options;
  e && e.getProps().onBeforeLayoutMeasure && e.notify("BeforeLayoutMeasure"), t.resetTransform();
}
function Bi(t) {
  t.finishAnimation(), t.targetDelta = t.relativeTarget = t.target = void 0, t.isProjectionDirty = !0;
}
function zu(t) {
  t.resolveTargetDelta();
}
function Hu(t) {
  t.calcProjection();
}
function Yu(t) {
  t.resetSkewAndRotation();
}
function Xu(t) {
  t.removeLeadSnapshot();
}
function Fi(t, e, n) {
  t.translate = M(e.translate, 0, n), t.scale = M(e.scale, 1, n), t.origin = e.origin, t.originPoint = e.originPoint;
}
function Ii(t, e, n, i) {
  t.min = M(e.min, n.min, i), t.max = M(e.max, n.max, i);
}
function qu(t, e, n, i) {
  Ii(t.x, e.x, n.x, i), Ii(t.y, e.y, n.y, i);
}
function Zu(t) {
  return t.animationValues && t.animationValues.opacityExit !== void 0;
}
const Qu = {
  duration: 0.45,
  ease: [0.4, 0, 0.1, 1]
}, Oi = (t) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(t), ji = Oi("applewebkit/") && !Oi("chrome/") ? Math.round : N;
function Ni(t) {
  t.min = ji(t.min), t.max = ji(t.max);
}
function Ju(t) {
  Ni(t.x), Ni(t.y);
}
function Do(t, e, n) {
  return t === "position" || t === "preserve-aspect" && !nu(Ri(e), Ri(n), 0.2);
}
function tc(t) {
  var e;
  return t !== t.root && ((e = t.scroll) === null || e === void 0 ? void 0 : e.wasRoot);
}
const ec = Co({
  attachResizeListener: (t, e) => $t(t, "resize", e),
  measureScroll: () => ({
    x: document.documentElement.scrollLeft || document.body.scrollLeft,
    y: document.documentElement.scrollTop || document.body.scrollTop
  }),
  checkIsScrollRoot: () => !0
}), Ce = {
  current: void 0
}, Mo = Co({
  measureScroll: (t) => ({
    x: t.scrollLeft,
    y: t.scrollTop
  }),
  defaultParent: () => {
    if (!Ce.current) {
      const t = new ec({});
      t.mount(window), t.setOptions({ layoutScroll: !0 }), Ce.current = t;
    }
    return Ce.current;
  },
  resetTransform: (t, e) => {
    t.style.transform = e !== void 0 ? e : "none";
  },
  checkIsScrollRoot: (t) => window.getComputedStyle(t).position === "fixed"
}), nc = {
  pan: {
    Feature: vu
  },
  drag: {
    Feature: yu,
    ProjectionNode: Mo,
    MeasureLayout: To
  }
};
function ic(t, e, n) {
  var i;
  if (t instanceof Element)
    return [t];
  if (typeof t == "string") {
    let s = document;
    const r = (i = void 0) !== null && i !== void 0 ? i : s.querySelectorAll(t);
    return r ? Array.from(r) : [];
  }
  return Array.from(t);
}
function Ro(t, e) {
  const n = ic(t), i = new AbortController(), s = {
    passive: !0,
    ...e,
    signal: i.signal
  };
  return [n, s, () => i.abort()];
}
function Ui(t) {
  return (e) => {
    e.pointerType === "touch" || co() || t(e);
  };
}
function sc(t, e, n = {}) {
  const [i, s, r] = Ro(t, n), o = Ui((a) => {
    const { target: l } = a, u = e(a);
    if (typeof u != "function" || !l)
      return;
    const c = Ui((d) => {
      u(d), l.removeEventListener("pointerleave", c);
    });
    l.addEventListener("pointerleave", c, s);
  });
  return i.forEach((a) => {
    a.addEventListener("pointerenter", o, s);
  }), r;
}
function $i(t, e, n) {
  const { props: i } = t;
  t.animationState && i.whileHover && t.animationState.setActive("whileHover", n === "Start");
  const s = "onHover" + n, r = i[s];
  r && A.postRender(() => r(e, Gt(e)));
}
class oc extends st {
  mount() {
    const { current: e } = this.node;
    e && (this.unmount = sc(e, (n) => ($i(this.node, n, "Start"), (i) => $i(this.node, i, "End"))));
  }
  unmount() {
  }
}
class rc extends st {
  constructor() {
    super(...arguments), this.isActive = !1;
  }
  onFocus() {
    let e = !1;
    try {
      e = this.node.current.matches(":focus-visible");
    } catch {
      e = !0;
    }
    !e || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !0), this.isActive = !0);
  }
  onBlur() {
    !this.isActive || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !1), this.isActive = !1);
  }
  mount() {
    this.unmount = Wt($t(this.node.current, "focus", () => this.onFocus()), $t(this.node.current, "blur", () => this.onBlur()));
  }
  unmount() {
  }
}
const Eo = (t, e) => e ? t === e ? !0 : Eo(t, e.parentElement) : !1, ac = /* @__PURE__ */ new Set([
  "BUTTON",
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "A"
]);
function lc(t) {
  return ac.has(t.tagName) || t.tabIndex !== -1;
}
const Lt = /* @__PURE__ */ new WeakSet();
function _i(t) {
  return (e) => {
    e.key === "Enter" && t(e);
  };
}
function De(t, e) {
  t.dispatchEvent(new PointerEvent("pointer" + e, { isPrimary: !0, bubbles: !0 }));
}
const uc = (t, e) => {
  const n = t.currentTarget;
  if (!n)
    return;
  const i = _i(() => {
    if (Lt.has(n))
      return;
    De(n, "down");
    const s = _i(() => {
      De(n, "up");
    }), r = () => De(n, "cancel");
    n.addEventListener("keyup", s, e), n.addEventListener("blur", r, e);
  });
  n.addEventListener("keydown", i, e), n.addEventListener("blur", () => n.removeEventListener("keydown", i), e);
};
function Ki(t) {
  return An(t) && !co();
}
function cc(t, e, n = {}) {
  const [i, s, r] = Ro(t, n), o = (a) => {
    const l = a.currentTarget;
    if (!Ki(a) || Lt.has(l))
      return;
    Lt.add(l);
    const u = e(a), c = (h, m) => {
      window.removeEventListener("pointerup", d), window.removeEventListener("pointercancel", f), !(!Ki(h) || !Lt.has(l)) && (Lt.delete(l), typeof u == "function" && u(h, { success: m }));
    }, d = (h) => {
      c(h, n.useGlobalTarget || Eo(l, h.target));
    }, f = (h) => {
      c(h, !1);
    };
    window.addEventListener("pointerup", d, s), window.addEventListener("pointercancel", f, s);
  };
  return i.forEach((a) => {
    !lc(a) && a.getAttribute("tabindex") === null && (a.tabIndex = 0), (n.useGlobalTarget ? window : a).addEventListener("pointerdown", o, s), a.addEventListener("focus", (u) => uc(u, s), s);
  }), r;
}
function Wi(t, e, n) {
  const { props: i } = t;
  t.animationState && i.whileTap && t.animationState.setActive("whileTap", n === "Start");
  const s = "onTap" + (n === "End" ? "" : n), r = i[s];
  r && A.postRender(() => r(e, Gt(e)));
}
class dc extends st {
  mount() {
    const { current: e } = this.node;
    e && (this.unmount = cc(e, (n) => (Wi(this.node, n, "Start"), (i, { success: s }) => Wi(this.node, i, s ? "End" : "Cancel")), { useGlobalTarget: this.node.props.globalTapTarget }));
  }
  unmount() {
  }
}
const We = /* @__PURE__ */ new WeakMap(), Me = /* @__PURE__ */ new WeakMap(), fc = (t) => {
  const e = We.get(t.target);
  e && e(t);
}, hc = (t) => {
  t.forEach(fc);
};
function mc({ root: t, ...e }) {
  const n = t || document;
  Me.has(n) || Me.set(n, {});
  const i = Me.get(n), s = JSON.stringify(e);
  return i[s] || (i[s] = new IntersectionObserver(hc, { root: t, ...e })), i[s];
}
function pc(t, e, n) {
  const i = mc(e);
  return We.set(t, n), i.observe(t), () => {
    We.delete(t), i.unobserve(t);
  };
}
const gc = {
  some: 0,
  all: 1
};
class yc extends st {
  constructor() {
    super(...arguments), this.hasEnteredView = !1, this.isInView = !1;
  }
  startObserver() {
    this.unmount();
    const { viewport: e = {} } = this.node.getProps(), { root: n, margin: i, amount: s = "some", once: r } = e, o = {
      root: n ? n.current : void 0,
      rootMargin: i,
      threshold: typeof s == "number" ? s : gc[s]
    }, a = (l) => {
      const { isIntersecting: u } = l;
      if (this.isInView === u || (this.isInView = u, r && !u && this.hasEnteredView))
        return;
      u && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", u);
      const { onViewportEnter: c, onViewportLeave: d } = this.node.getProps(), f = u ? c : d;
      f && f(l);
    };
    return pc(this.node.current, o, a);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver > "u")
      return;
    const { props: e, prevProps: n } = this.node;
    ["amount", "margin", "root"].some(vc(e, n)) && this.startObserver();
  }
  unmount() {
  }
}
function vc({ viewport: t = {} }, { viewport: e = {} } = {}) {
  return (n) => t[n] !== e[n];
}
const bc = {
  inView: {
    Feature: yc
  },
  tap: {
    Feature: dc
  },
  focus: {
    Feature: rc
  },
  hover: {
    Feature: oc
  }
}, xc = {
  layout: {
    ProjectionNode: Mo,
    MeasureLayout: To
  }
}, Ge = { current: null }, Lo = { current: !1 };
function Tc() {
  if (Lo.current = !0, !!Ye)
    if (window.matchMedia) {
      const t = window.matchMedia("(prefers-reduced-motion)"), e = () => Ge.current = t.matches;
      t.addListener(e), e();
    } else
      Ge.current = !1;
}
const Pc = [...Zs, I, et], wc = (t) => Pc.find(qs(t)), Gi = /* @__PURE__ */ new WeakMap();
function Sc(t, e, n) {
  for (const i in e) {
    const s = e[i], r = n[i];
    if (B(s))
      t.addValue(i, s), process.env.NODE_ENV === "development" && le(s.version === "11.18.2", `Attempting to mix Motion versions ${s.version} with 11.18.2 may not work as expected.`);
    else if (B(r))
      t.addValue(i, bt(s, { owner: t }));
    else if (r !== s)
      if (t.hasValue(i)) {
        const o = t.getValue(i);
        o.liveStyle === !0 ? o.jump(s) : o.hasAnimated || o.set(s);
      } else {
        const o = t.getStaticValue(i);
        t.addValue(i, bt(o !== void 0 ? o : s, { owner: t }));
      }
  }
  for (const i in n)
    e[i] === void 0 && t.removeValue(i);
  return e;
}
const zi = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete"
];
class Ac {
  /**
   * This method takes React props and returns found MotionValues. For example, HTML
   * MotionValues will be found within the style prop, whereas for Three.js within attribute arrays.
   *
   * This isn't an abstract method as it needs calling in the constructor, but it is
   * intended to be one.
   */
  scrapeMotionValuesFromProps(e, n, i) {
    return {};
  }
  constructor({ parent: e, props: n, presenceContext: i, reducedMotionConfig: s, blockInitialAnimation: r, visualState: o }, a = {}) {
    this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = Pn, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
      this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
    }, this.renderScheduledAt = 0, this.scheduleRender = () => {
      const h = z.now();
      this.renderScheduledAt < h && (this.renderScheduledAt = h, A.render(this.render, !1, !0));
    };
    const { latestValues: l, renderState: u, onUpdate: c } = o;
    this.onUpdate = c, this.latestValues = l, this.baseTarget = { ...l }, this.initialValues = n.initial ? { ...l } : {}, this.renderState = u, this.parent = e, this.props = n, this.presenceContext = i, this.depth = e ? e.depth + 1 : 0, this.reducedMotionConfig = s, this.options = a, this.blockInitialAnimation = !!r, this.isControllingVariants = de(n), this.isVariantNode = us(n), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(e && e.current);
    const { willChange: d, ...f } = this.scrapeMotionValuesFromProps(n, {}, this);
    for (const h in f) {
      const m = f[h];
      l[h] !== void 0 && B(m) && m.set(l[h], !1);
    }
  }
  mount(e) {
    this.current = e, Gi.set(e, this), this.projection && !this.projection.instance && this.projection.mount(e), this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)), this.values.forEach((n, i) => this.bindToMotionValue(i, n)), Lo.current || Tc(), this.shouldReduceMotion = this.reducedMotionConfig === "never" ? !1 : this.reducedMotionConfig === "always" ? !0 : Ge.current, process.env.NODE_ENV !== "production" && le(this.shouldReduceMotion !== !0, "You have Reduced Motion enabled on your device. Animations may not appear as expected."), this.parent && this.parent.children.add(this), this.update(this.props, this.presenceContext);
  }
  unmount() {
    Gi.delete(this.current), this.projection && this.projection.unmount(), q(this.notifyUpdate), q(this.render), this.valueSubscriptions.forEach((e) => e()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), this.parent && this.parent.children.delete(this);
    for (const e in this.events)
      this.events[e].clear();
    for (const e in this.features) {
      const n = this.features[e];
      n && (n.unmount(), n.isMounted = !1);
    }
    this.current = null;
  }
  bindToMotionValue(e, n) {
    this.valueSubscriptions.has(e) && this.valueSubscriptions.get(e)();
    const i = dt.has(e), s = n.on("change", (a) => {
      this.latestValues[e] = a, this.props.onUpdate && A.preRender(this.notifyUpdate), i && this.projection && (this.projection.isTransformDirty = !0);
    }), r = n.on("renderRequest", this.scheduleRender);
    let o;
    window.MotionCheckAppearSync && (o = window.MotionCheckAppearSync(this, e, n)), this.valueSubscriptions.set(e, () => {
      s(), r(), o && o(), n.owner && n.stop();
    });
  }
  sortNodePosition(e) {
    return !this.current || !this.sortInstanceNodePosition || this.type !== e.type ? 0 : this.sortInstanceNodePosition(this.current, e.current);
  }
  updateFeatures() {
    let e = "animation";
    for (e in vt) {
      const n = vt[e];
      if (!n)
        continue;
      const { isEnabled: i, Feature: s } = n;
      if (!this.features[e] && s && i(this.props) && (this.features[e] = new s(this)), this.features[e]) {
        const r = this.features[e];
        r.isMounted ? r.update() : (r.mount(), r.isMounted = !0);
      }
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.props);
  }
  /**
   * Measure the current viewport box with or without transforms.
   * Only measures axis-aligned boxes, rotate and skew must be manually
   * removed with a re-render to work.
   */
  measureViewportBox() {
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : E();
  }
  getStaticValue(e) {
    return this.latestValues[e];
  }
  setStaticValue(e, n) {
    this.latestValues[e] = n;
  }
  /**
   * Update the provided props. Ensure any newly-added motion values are
   * added to our map, old ones removed, and listeners updated.
   */
  update(e, n) {
    (e.transformTemplate || this.props.transformTemplate) && this.scheduleRender(), this.prevProps = this.props, this.props = e, this.prevPresenceContext = this.presenceContext, this.presenceContext = n;
    for (let i = 0; i < zi.length; i++) {
      const s = zi[i];
      this.propEventSubscriptions[s] && (this.propEventSubscriptions[s](), delete this.propEventSubscriptions[s]);
      const r = "on" + s, o = e[r];
      o && (this.propEventSubscriptions[s] = this.on(s, o));
    }
    this.prevMotionValues = Sc(this, this.scrapeMotionValuesFromProps(e, this.prevProps, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue(), this.onUpdate && this.onUpdate(this);
  }
  getProps() {
    return this.props;
  }
  /**
   * Returns the variant definition with a given name.
   */
  getVariant(e) {
    return this.props.variants ? this.props.variants[e] : void 0;
  }
  /**
   * Returns the defined default transition on this component.
   */
  getDefaultTransition() {
    return this.props.transition;
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint;
  }
  getClosestVariantNode() {
    return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
  }
  /**
   * Add a child visual element to our set of children.
   */
  addVariantChild(e) {
    const n = this.getClosestVariantNode();
    if (n)
      return n.variantChildren && n.variantChildren.add(e), () => n.variantChildren.delete(e);
  }
  /**
   * Add a motion value and bind it to this visual element.
   */
  addValue(e, n) {
    const i = this.values.get(e);
    n !== i && (i && this.removeValue(e), this.bindToMotionValue(e, n), this.values.set(e, n), this.latestValues[e] = n.get());
  }
  /**
   * Remove a motion value and unbind any active subscriptions.
   */
  removeValue(e) {
    this.values.delete(e);
    const n = this.valueSubscriptions.get(e);
    n && (n(), this.valueSubscriptions.delete(e)), delete this.latestValues[e], this.removeValueFromRenderState(e, this.renderState);
  }
  /**
   * Check whether we have a motion value for this key
   */
  hasValue(e) {
    return this.values.has(e);
  }
  getValue(e, n) {
    if (this.props.values && this.props.values[e])
      return this.props.values[e];
    let i = this.values.get(e);
    return i === void 0 && n !== void 0 && (i = bt(n === null ? void 0 : n, { owner: this }), this.addValue(e, i)), i;
  }
  /**
   * If we're trying to animate to a previously unencountered value,
   * we need to check for it in our state and as a last resort read it
   * directly from the instance (which might have performance implications).
   */
  readValue(e, n) {
    var i;
    let s = this.latestValues[e] !== void 0 || !this.current ? this.latestValues[e] : (i = this.getBaseTargetFromProps(this.props, e)) !== null && i !== void 0 ? i : this.readValueFromInstance(this.current, e, this.options);
    return s != null && (typeof s == "string" && (Ys(s) || Ns(s)) ? s = parseFloat(s) : !wc(s) && et.test(n) && (s = Gs(e, n)), this.setBaseTarget(e, B(s) ? s.get() : s)), B(s) ? s.get() : s;
  }
  /**
   * Set the base target to later animate back to. This is currently
   * only hydrated on creation and when we first read a value.
   */
  setBaseTarget(e, n) {
    this.baseTarget[e] = n;
  }
  /**
   * Find the base target for a value thats been removed from all animation
   * props.
   */
  getBaseTarget(e) {
    var n;
    const { initial: i } = this.props;
    let s;
    if (typeof i == "string" || typeof i == "object") {
      const o = en(this.props, i, (n = this.presenceContext) === null || n === void 0 ? void 0 : n.custom);
      o && (s = o[e]);
    }
    if (i && s !== void 0)
      return s;
    const r = this.getBaseTargetFromProps(this.props, e);
    return r !== void 0 && !B(r) ? r : this.initialValues[e] !== void 0 && s === void 0 ? void 0 : this.baseTarget[e];
  }
  on(e, n) {
    return this.events[e] || (this.events[e] = new hn()), this.events[e].add(n);
  }
  notify(e, ...n) {
    this.events[e] && this.events[e].notify(...n);
  }
}
class ko extends Ac {
  constructor() {
    super(...arguments), this.KeyframeResolver = Qs;
  }
  sortInstanceNodePosition(e, n) {
    return e.compareDocumentPosition(n) & 2 ? 1 : -1;
  }
  getBaseTargetFromProps(e, n) {
    return e.style ? e.style[n] : void 0;
  }
  removeValueFromRenderState(e, { vars: n, style: i }) {
    delete n[e], delete i[e];
  }
  handleChildMotionValue() {
    this.childSubscription && (this.childSubscription(), delete this.childSubscription);
    const { children: e } = this.props;
    B(e) && (this.childSubscription = e.on("change", (n) => {
      this.current && (this.current.textContent = `${n}`);
    }));
  }
}
function Vc(t) {
  return window.getComputedStyle(t);
}
class Cc extends ko {
  constructor() {
    super(...arguments), this.type = "html", this.renderInstance = vs;
  }
  readValueFromInstance(e, n) {
    if (dt.has(n)) {
      const i = Tn(n);
      return i && i.default || 0;
    } else {
      const i = Vc(e), s = (ps(n) ? i.getPropertyValue(n) : i[n]) || 0;
      return typeof s == "string" ? s.trim() : s;
    }
  }
  measureInstanceViewportBox(e, { transformPagePoint: n }) {
    return bo(e, n);
  }
  build(e, n, i) {
    on(e, n, i.transformTemplate);
  }
  scrapeMotionValuesFromProps(e, n, i) {
    return un(e, n, i);
  }
}
class Dc extends ko {
  constructor() {
    super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = E;
  }
  getBaseTargetFromProps(e, n) {
    return e[n];
  }
  readValueFromInstance(e, n) {
    if (dt.has(n)) {
      const i = Tn(n);
      return i && i.default || 0;
    }
    return n = bs.has(n) ? n : Qe(n), e.getAttribute(n);
  }
  scrapeMotionValuesFromProps(e, n, i) {
    return Ps(e, n, i);
  }
  build(e, n, i) {
    rn(e, n, this.isSVGTag, i.transformTemplate);
  }
  renderInstance(e, n, i, s) {
    xs(e, n, i, s);
  }
  mount(e) {
    this.isSVGTag = ln(e.tagName), super.mount(e);
  }
}
const Mc = (t, e) => tn(t) ? new Dc(e) : new Cc(e, {
  allowProjection: t !== ts
}), Rc = /* @__PURE__ */ ea({
  ...zl,
  ...bc,
  ...nc,
  ...xc
}, Mc), oe = /* @__PURE__ */ gr(Rc);
function Pt(t) {
  const e = ze(() => bt(t)), { isStatic: n } = O(ae);
  if (n) {
    const [, i] = nt(t);
    it(() => e.on("change", i), []);
  }
  return e;
}
function Bo(t, e) {
  const n = Pt(e()), i = () => n.set(e());
  return i(), Xe(() => {
    const s = () => A.preRender(i, !1, !0), r = t.map((o) => o.on("change", s));
    return () => {
      r.forEach((o) => o()), q(i);
    };
  }), n;
}
function Hi(t) {
  return typeof t == "number" ? t : parseFloat(t);
}
function Yi(t, e = {}) {
  const { isStatic: n } = O(ae), i = K(null), s = Pt(B(t) ? Hi(t.get()) : t), r = K(s.get()), o = K(() => {
  }), a = () => {
    const u = i.current;
    u && u.time === 0 && u.sample(k.delta), l(), i.current = bl({
      keyframes: [s.get(), r.current],
      velocity: s.getVelocity(),
      type: "spring",
      restDelta: 1e-3,
      restSpeed: 0.01,
      ...e,
      onUpdate: o.current
    });
  }, l = () => {
    i.current && i.current.stop();
  };
  return Ji(() => s.attach((u, c) => n ? c(u) : (r.current = u, o.current = c, A.update(a), s.get()), l), [JSON.stringify(e)]), Xe(() => {
    if (B(t))
      return t.on("change", (u) => s.set(Hi(u)));
  }, [s]), s;
}
const Ec = (t) => t && typeof t == "object" && t.mix, Lc = (t) => Ec(t) ? t.mix : void 0;
function kc(...t) {
  const e = !Array.isArray(t[0]), n = e ? 0 : -1, i = t[0 + n], s = t[1 + n], r = t[2 + n], o = t[3 + n], a = ro(s, r, {
    mixer: Lc(r[0]),
    ...o
  });
  return e ? a(i) : a;
}
function Bc(t) {
  kt.current = [], t();
  const e = Bo(kt.current, t);
  return kt.current = void 0, e;
}
function Xi(t, e, n, i) {
  if (typeof t == "function")
    return Bc(t);
  const s = typeof e == "function" ? e : kc(e, n, i);
  return Array.isArray(t) ? qi(t, s) : qi([t], ([r]) => s(r));
}
function qi(t, e) {
  const n = ze(() => []);
  return Bo(t, () => {
    n.length = 0;
    const i = t.length;
    for (let s = 0; s < i; s++)
      n[s] = t[s].get();
    return e(n);
  });
}
const Fc = St(
  "relative inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-foundation-accent-green text-white hover:bg-foundation-accent-green/90 shadow-sm",
        outline: "border border-foundation-border-light bg-transparent hover:bg-foundation-bg-light-2",
        ghost: "hover:bg-foundation-bg-light-2",
        link: "text-foundation-accent-green underline-offset-4 hover:underline"
      },
      size: {
        sm: "h-8 px-3 text-xs",
        default: "h-9 px-4",
        lg: "h-11 px-6"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Ic({
  children: t,
  variant: e = "default",
  size: n = "default",
  magneticStrength: i = 0.3,
  stiffness: s = 300,
  damping: r = 20,
  disableMagnetic: o = !1,
  disabled: a = !1,
  className: l,
  ariaLabel: u,
  onClick: c
}) {
  const d = K(null), f = At(), h = Pt(0), m = Pt(0), p = Yi(h, { stiffness: s, damping: r }), y = Yi(m, { stiffness: s, damping: r }), [g, v] = nt(!1), b = (x) => {
    if (o || f || !d.current) return;
    const w = d.current.getBoundingClientRect(), V = w.left + w.width / 2, P = w.top + w.height / 2, L = x.clientX - V, F = x.clientY - P;
    h.set(L * i), m.set(F * i);
  }, S = () => {
    v(!1), h.set(0), m.set(0);
  };
  return /* @__PURE__ */ yt(
    oe.button,
    {
      ref: d,
      type: "button",
      disabled: a,
      "aria-label": u,
      onClick: c,
      onMouseMove: b,
      onMouseEnter: () => v(!0),
      onMouseLeave: S,
      style: {
        x: f || o ? 0 : p,
        y: f || o ? 0 : y
      },
      whileTap: { scale: f ? 1 : 0.97 },
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      },
      className: ct(Fc({ variant: e, size: n }), "cursor-pointer", l),
      children: [
        t,
        !f && !o && g && /* @__PURE__ */ R(
          oe.span,
          {
            className: "absolute inset-0 rounded-md bg-current opacity-0",
            initial: { opacity: 0 },
            animate: { opacity: 0.1 },
            exit: { opacity: 0 },
            transition: { duration: 0.2 },
            "aria-hidden": "true"
          }
        )
      ]
    }
  );
}
Ic.displayName = "MagneticButton";
const Oc = St("relative rounded-xl border backdrop-blur-sm overflow-hidden", {
  variants: {
    variant: {
      default: "border-foundation-border-light bg-white/10 dark:bg-black/10",
      gradient: "border-transparent",
      glass: "border-white/20 bg-white/5 dark:bg-black/5"
    },
    size: {
      sm: "p-4",
      default: "p-6",
      lg: "p-8"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
}), jc = {
  neon: {
    color1: "#ff0080",
    color2: "#7928ca",
    color3: "#ff0080",
    color4: "#7928ca"
  },
  ocean: {
    color1: "#00b4d8",
    color2: "#0077b6",
    color3: "#00b4d8",
    color4: "#023e8a"
  },
  sunset: {
    color1: "#ff6b6b",
    color2: "#feca57",
    color3: "#ff9ff3",
    color4: "#54a0ff"
  },
  aurora: {
    color1: "#00f260",
    color2: "#0575e6",
    color3: "#00f260",
    color4: "#0575e6"
  }
};
function Nc({
  children: t,
  variant: e = "default",
  size: n = "default",
  colors: i = "neon",
  customColors: s,
  tiltIntensity: r = 0.15,
  hoverScale: o = 1.02,
  disableTilt: a = !1,
  disableShimmer: l = !1,
  className: u,
  onClick: c
}) {
  const d = K(null), f = At(), [h, m] = nt(!1), p = Pt(0), y = Pt(0), g = Xi(y, [-0.5, 0.5], [10, -10]), v = Xi(p, [-0.5, 0.5], [-10, 10]), b = (w) => {
    if (a || f || !d.current) return;
    const V = d.current.getBoundingClientRect(), P = V.left + V.width / 2, L = V.top + V.height / 2, F = (w.clientX - P) / V.width, Q = (w.clientY - L) / V.height;
    p.set(F), y.set(Q);
  }, S = () => {
    m(!1), p.set(0), y.set(0);
  }, x = s || jc[i];
  return /* @__PURE__ */ yt(
    oe.div,
    {
      ref: d,
      className: ct(
        Oc({ variant: e, size: n }),
        c && "cursor-pointer effects-component-interactive",
        u
      ),
      onClick: c,
      onMouseMove: b,
      onMouseEnter: () => m(!0),
      onMouseLeave: S,
      style: {
        rotateX: a || f ? 0 : g,
        rotateY: a || f ? 0 : v,
        transformStyle: "preserve-3d"
      },
      whileHover: f ? void 0 : {
        scale: o,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      },
      animate: h && !l && !f ? {
        backgroundPosition: ["-200% center", "200% center"]
      } : {},
      transition: h && !l && !f ? {
        backgroundPosition: {
          duration: 3,
          repeat: 1 / 0,
          ease: "linear"
        }
      } : {
        type: "spring",
        stiffness: 300,
        damping: 20
      },
      children: [
        !l && !f && /* @__PURE__ */ R(
          "div",
          {
            className: "absolute inset-0 pointer-events-none mix-blend-overlay opacity-50",
            style: {
              background: `linear-gradient(
              135deg,
              ${x.color1} 0%,
              ${x.color2} 25%,
              ${x.color3} 50%,
              ${x.color4} 75%,
              ${x.color1} 100%
            )`,
              backgroundSize: "200% auto"
            },
            "aria-hidden": "true"
          }
        ),
        e === "glass" && !f && /* @__PURE__ */ R(
          "div",
          {
            className: "absolute inset-0 pointer-events-none opacity-20",
            style: {
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
            },
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ R("div", { className: "relative z-10", style: { transform: "translateZ(20px)" }, children: t }),
        h && !f && /* @__PURE__ */ R(
          oe.div,
          {
            className: "absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/20 to-transparent",
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.3 },
            "aria-hidden": "true"
          }
        )
      ]
    }
  );
}
Nc.displayName = "HoloCard";
const Uc = St("inline-block", {
  variants: {
    intensity: {
      subtle: "glow-layer-1",
      medium: "glow-layer-2",
      intense: "glow-layer-3"
    },
    animate: {
      none: "",
      pulse: "animate-glow-pulse",
      breathe: "animate-glow-breathe"
    }
  },
  defaultVariants: {
    intensity: "medium",
    animate: "none"
  }
});
function $c({
  children: t,
  color: e = "var(--foundation-accent-green)",
  intensity: n = "medium",
  animate: i = "none",
  className: s
}) {
  const o = At() ? "none" : i;
  return /* @__PURE__ */ R(
    "span",
    {
      className: ct(Uc({ intensity: n, animate: o }), s),
      style: {
        "--glow-color": e
      },
      children: t
    }
  );
}
$c.displayName = "GlowText";
const _c = St("inline-block bg-clip-text text-transparent", {
  variants: {
    direction: {
      horizontal: "bg-gradient-to-r",
      vertical: "bg-gradient-to-b",
      diagonal: "bg-gradient-to-br",
      radial: "bg-gradient-radial"
    },
    animate: {
      none: "",
      flow: "animate-gradient-flow",
      shimmer: "animate-gradient-shimmer"
    }
  },
  defaultVariants: {
    direction: "horizontal",
    animate: "none"
  }
}), Zi = {
  sunset: ["#ff6b6b", "#feca57", "#ff9ff3"],
  ocean: ["#00b4d8", "#0077b6", "#023e8a"],
  forest: ["#00f260", "#0575e6", "#00c6ff"],
  aurora: ["#a8ff78", "#78ffd6", "#00c6ff"],
  fire: ["#ff416c", "#ff4b2b", "#ff9068"],
  cyber: ["#00f260", "#0575e6", "#8e44ad"]
};
function Kc({
  children: t,
  direction: e = "horizontal",
  animate: n = "none",
  preset: i,
  colors: s,
  className: r
}) {
  const a = At() ? "none" : n, l = s || (i ? Zi[i] : Zi.sunset), u = e === "radial" ? `radial-gradient(circle, ${l.join(", ")})` : `linear-gradient(${e === "horizontal" ? "to right" : e === "vertical" ? "to bottom" : "135deg"}, ${l.join(", ")})`;
  return /* @__PURE__ */ R(
    "span",
    {
      className: ct(_c({ direction: e, animate: a }), r),
      style: {
        backgroundImage: u,
        backgroundSize: a === "none" ? "100% auto" : "200% auto"
      },
      children: t
    }
  );
}
Kc.displayName = "GradientText";
const Wc = St("transition-all duration-500 ease-out", {
  variants: {
    direction: {
      up: "data-[state=revealed]:translate-y-0 data-[state=hidden]:translate-y-8",
      down: "data-[state=revealed]:translate-y-0 data-[state=hidden]:-translate-y-8",
      left: "data-[state=revealed]:translate-x-0 data-[state=hidden]:translate-x-8",
      right: "data-[state=revealed]:translate-x-0 data-[state=hidden]:-translate-x-8"
    },
    fade: {
      none: "",
      subtle: "data-[state=revealed]:opacity-100 data-[state=hidden]:opacity-40",
      full: "data-[state=revealed]:opacity-100 data-[state=hidden]:opacity-0"
    }
  },
  defaultVariants: {
    direction: "up",
    fade: "subtle"
  }
});
function Gc({
  children: t,
  direction: e = "up",
  fade: n = "subtle",
  triggerAt: i = 0.5,
  sticky: s = !1,
  className: r
}) {
  const o = K(null), a = At(), { scrollProgress: l } = or({ throttle: 50 }), [u, c] = nt(!1);
  it(() => {
    if (!o.current) return;
    const f = new IntersectionObserver(
      ([h]) => {
        const m = h.intersectionRatio, p = 1 - i;
        c(m >= p);
      },
      {
        threshold: Array.from({ length: 101 }, (h, m) => m / 100),
        // 0, 0.01, 0.02... 1.00
        rootMargin: "0px"
      }
    );
    return f.observe(o.current), () => {
      f.disconnect();
    };
  }, [i]);
  const d = a ? !0 : u;
  return /* @__PURE__ */ R(
    "div",
    {
      ref: o,
      className: ct(Wc({ direction: e, fade: n }), s && "sticky top-4", r),
      "data-state": d ? "revealed" : "hidden",
      style: a ? { transition: "none" } : {
        transitionDuration: "500ms",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)"
      },
      children: t
    }
  );
}
Gc.displayName = "StickyReveal";
export {
  $c as GlowText,
  Kc as GradientText,
  Nc as HoloCard,
  ar as LiquidToggle,
  Ic as MagneticButton,
  Gc as StickyReveal,
  id as buildScrollAnimation,
  nd as buildTransition,
  ct as cn,
  td as durations,
  sr as easings,
  Jc as generateFilterId,
  Qc as generateHoloFilter,
  Zc as generateLiquidFilter,
  ed as getReducedMotionDuration,
  Zi as gradientPresets,
  jc as holoColors,
  sd as useMousePosition,
  At as useReducedMotion,
  or as useScrollPosition
};
