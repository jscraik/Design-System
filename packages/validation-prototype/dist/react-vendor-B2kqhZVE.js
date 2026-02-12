var vt = Object.defineProperty;
var o = (S, m) => vt(S, "name", { value: m, configurable: !0 });
function Et(S) {
  return S && S.__esModule && Object.prototype.hasOwnProperty.call(S, "default") ? S.default : S;
}
o(Et, "getDefaultExportFromCjs");
var $e = { exports: {} }, Me = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var st;
function mt() {
  if (st) return Me;
  st = 1;
  var S = Symbol.for("react.transitional.element"), m = Symbol.for("react.fragment");
  function ee(te, M, P) {
    var W = null;
    if (P !== void 0 && (W = "" + P), M.key !== void 0 && (W = "" + M.key), "key" in M) {
      P = {};
      for (var z in M)
        z !== "key" && (P[z] = M[z]);
    } else P = M;
    return M = P.ref, {
      $$typeof: S,
      type: te,
      key: W,
      ref: M !== void 0 ? M : null,
      props: P
    };
  }
  return o(ee, "jsxProd"), Me.Fragment = m, Me.jsx = ee, Me.jsxs = ee, Me;
}
o(mt, "requireReactJsxRuntime_production");
var Ye = {}, ze = { exports: {} }, _ = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var at;
function gt() {
  if (at) return _;
  at = 1;
  var S = Symbol.for("react.transitional.element"), m = Symbol.for("react.portal"), ee = Symbol.for("react.fragment"), te = Symbol.for("react.strict_mode"), M = Symbol.for("react.profiler"), P = Symbol.for("react.consumer"), W = Symbol.for("react.context"), z = Symbol.for("react.forward_ref"), se = Symbol.for("react.suspense"), X = Symbol.for("react.memo"), I = Symbol.for("react.lazy"), me = Symbol.iterator;
  function Ae(n) {
    return n === null || typeof n != "object" ? null : (n = me && n[me] || n["@@iterator"], typeof n == "function" ? n : null);
  }
  o(Ae, "getIteratorFn");
  var Se = {
    isMounted: /* @__PURE__ */ o(function() {
      return !1;
    }, "isMounted"),
    enqueueForceUpdate: /* @__PURE__ */ o(function() {
    }, "enqueueForceUpdate"),
    enqueueReplaceState: /* @__PURE__ */ o(function() {
    }, "enqueueReplaceState"),
    enqueueSetState: /* @__PURE__ */ o(function() {
    }, "enqueueSetState")
  }, ge = Object.assign, D = {};
  function L(n, s, E) {
    this.props = n, this.context = s, this.refs = D, this.updater = E || Se;
  }
  o(L, "Component"), L.prototype.isReactComponent = {}, L.prototype.setState = function(n, s) {
    if (typeof n != "object" && typeof n != "function" && n != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, n, s, "setState");
  }, L.prototype.forceUpdate = function(n) {
    this.updater.enqueueForceUpdate(this, n, "forceUpdate");
  };
  function re() {
  }
  o(re, "ComponentDummy"), re.prototype = L.prototype;
  function V(n, s, E) {
    this.props = n, this.context = s, this.refs = D, this.updater = E || Se;
  }
  o(V, "PureComponent");
  var ae = V.prototype = new re();
  ae.constructor = V, ge(ae, L.prototype), ae.isPureReactComponent = !0;
  var ie = Array.isArray, A = { H: null, A: null, T: null, S: null }, J = Object.prototype.hasOwnProperty;
  function fe(n, s, E, p, h, C) {
    return E = C.ref, {
      $$typeof: S,
      type: n,
      key: s,
      ref: E !== void 0 ? E : null,
      props: C
    };
  }
  o(fe, "ReactElement");
  function he(n, s) {
    return fe(
      n.type,
      s,
      void 0,
      void 0,
      void 0,
      n.props
    );
  }
  o(he, "cloneAndReplaceKey");
  function x(n) {
    return typeof n == "object" && n !== null && n.$$typeof === S;
  }
  o(x, "isValidElement");
  function ye(n) {
    var s = { "=": "=0", ":": "=2" };
    return "$" + n.replace(/[=:]/g, function(E) {
      return s[E];
    });
  }
  o(ye, "escape");
  var ce = /\/+/g;
  function ne(n, s) {
    return typeof n == "object" && n !== null && n.key != null ? ye("" + n.key) : s.toString(36);
  }
  o(ne, "getElementKey");
  function Z() {
  }
  o(Z, "noop$1");
  function le(n) {
    switch (n.status) {
      case "fulfilled":
        return n.value;
      case "rejected":
        throw n.reason;
      default:
        switch (typeof n.status == "string" ? n.then(Z, Z) : (n.status = "pending", n.then(
          function(s) {
            n.status === "pending" && (n.status = "fulfilled", n.value = s);
          },
          function(s) {
            n.status === "pending" && (n.status = "rejected", n.reason = s);
          }
        )), n.status) {
          case "fulfilled":
            return n.value;
          case "rejected":
            throw n.reason;
        }
    }
    throw n;
  }
  o(le, "resolveThenable");
  function G(n, s, E, p, h) {
    var C = typeof n;
    (C === "undefined" || C === "boolean") && (n = null);
    var g = !1;
    if (n === null) g = !0;
    else
      switch (C) {
        case "bigint":
        case "string":
        case "number":
          g = !0;
          break;
        case "object":
          switch (n.$$typeof) {
            case S:
            case m:
              g = !0;
              break;
            case I:
              return g = n._init, G(
                g(n._payload),
                s,
                E,
                p,
                h
              );
          }
      }
    if (g)
      return h = h(n), g = p === "" ? "." + ne(n, 0) : p, ie(h) ? (E = "", g != null && (E = g.replace(ce, "$&/") + "/"), G(h, s, E, "", function(de) {
        return de;
      })) : h != null && (x(h) && (h = he(
        h,
        E + (h.key == null || n && n.key === h.key ? "" : ("" + h.key).replace(
          ce,
          "$&/"
        ) + "/") + g
      )), s.push(h)), 1;
    g = 0;
    var U = p === "" ? "." : p + ":";
    if (ie(n))
      for (var j = 0; j < n.length; j++)
        p = n[j], C = U + ne(p, j), g += G(
          p,
          s,
          E,
          C,
          h
        );
    else if (j = Ae(n), typeof j == "function")
      for (n = j.call(n), j = 0; !(p = n.next()).done; )
        p = p.value, C = U + ne(p, j++), g += G(
          p,
          s,
          E,
          C,
          h
        );
    else if (C === "object") {
      if (typeof n.then == "function")
        return G(
          le(n),
          s,
          E,
          p,
          h
        );
      throw s = String(n), Error(
        "Objects are not valid as a React child (found: " + (s === "[object Object]" ? "object with keys {" + Object.keys(n).join(", ") + "}" : s) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return g;
  }
  o(G, "mapIntoArray");
  function q(n, s, E) {
    if (n == null) return n;
    var p = [], h = 0;
    return G(n, p, "", "", function(C) {
      return s.call(E, C, h++);
    }), p;
  }
  o(q, "mapChildren");
  function oe(n) {
    if (n._status === -1) {
      var s = n._result;
      s = s(), s.then(
        function(E) {
          (n._status === 0 || n._status === -1) && (n._status = 1, n._result = E);
        },
        function(E) {
          (n._status === 0 || n._status === -1) && (n._status = 2, n._result = E);
        }
      ), n._status === -1 && (n._status = 0, n._result = s);
    }
    if (n._status === 1) return n._result.default;
    throw n._result;
  }
  o(oe, "lazyInitializer");
  var je = typeof reportError == "function" ? reportError : function(n) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var s = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof n == "object" && n !== null && typeof n.message == "string" ? String(n.message) : String(n),
        error: n
      });
      if (!window.dispatchEvent(s)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", n);
      return;
    }
    console.error(n);
  };
  function T() {
  }
  return o(T, "noop"), _.Children = {
    map: q,
    forEach: /* @__PURE__ */ o(function(n, s, E) {
      q(
        n,
        function() {
          s.apply(this, arguments);
        },
        E
      );
    }, "forEach"),
    count: /* @__PURE__ */ o(function(n) {
      var s = 0;
      return q(n, function() {
        s++;
      }), s;
    }, "count"),
    toArray: /* @__PURE__ */ o(function(n) {
      return q(n, function(s) {
        return s;
      }) || [];
    }, "toArray"),
    only: /* @__PURE__ */ o(function(n) {
      if (!x(n))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return n;
    }, "only")
  }, _.Component = L, _.Fragment = ee, _.Profiler = M, _.PureComponent = V, _.StrictMode = te, _.Suspense = se, _.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = A, _.act = function() {
    throw Error("act(...) is not supported in production builds of React.");
  }, _.cache = function(n) {
    return function() {
      return n.apply(null, arguments);
    };
  }, _.cloneElement = function(n, s, E) {
    if (n == null)
      throw Error(
        "The argument must be a React element, but you passed " + n + "."
      );
    var p = ge({}, n.props), h = n.key, C = void 0;
    if (s != null)
      for (g in s.ref !== void 0 && (C = void 0), s.key !== void 0 && (h = "" + s.key), s)
        !J.call(s, g) || g === "key" || g === "__self" || g === "__source" || g === "ref" && s.ref === void 0 || (p[g] = s[g]);
    var g = arguments.length - 2;
    if (g === 1) p.children = E;
    else if (1 < g) {
      for (var U = Array(g), j = 0; j < g; j++)
        U[j] = arguments[j + 2];
      p.children = U;
    }
    return fe(n.type, h, void 0, void 0, C, p);
  }, _.createContext = function(n) {
    return n = {
      $$typeof: W,
      _currentValue: n,
      _currentValue2: n,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, n.Provider = n, n.Consumer = {
      $$typeof: P,
      _context: n
    }, n;
  }, _.createElement = function(n, s, E) {
    var p, h = {}, C = null;
    if (s != null)
      for (p in s.key !== void 0 && (C = "" + s.key), s)
        J.call(s, p) && p !== "key" && p !== "__self" && p !== "__source" && (h[p] = s[p]);
    var g = arguments.length - 2;
    if (g === 1) h.children = E;
    else if (1 < g) {
      for (var U = Array(g), j = 0; j < g; j++)
        U[j] = arguments[j + 2];
      h.children = U;
    }
    if (n && n.defaultProps)
      for (p in g = n.defaultProps, g)
        h[p] === void 0 && (h[p] = g[p]);
    return fe(n, C, void 0, void 0, null, h);
  }, _.createRef = function() {
    return { current: null };
  }, _.forwardRef = function(n) {
    return { $$typeof: z, render: n };
  }, _.isValidElement = x, _.lazy = function(n) {
    return {
      $$typeof: I,
      _payload: { _status: -1, _result: n },
      _init: oe
    };
  }, _.memo = function(n, s) {
    return {
      $$typeof: X,
      type: n,
      compare: s === void 0 ? null : s
    };
  }, _.startTransition = function(n) {
    var s = A.T, E = {};
    A.T = E;
    try {
      var p = n(), h = A.S;
      h !== null && h(E, p), typeof p == "object" && p !== null && typeof p.then == "function" && p.then(T, je);
    } catch (C) {
      je(C);
    } finally {
      A.T = s;
    }
  }, _.unstable_useCacheRefresh = function() {
    return A.H.useCacheRefresh();
  }, _.use = function(n) {
    return A.H.use(n);
  }, _.useActionState = function(n, s, E) {
    return A.H.useActionState(n, s, E);
  }, _.useCallback = function(n, s) {
    return A.H.useCallback(n, s);
  }, _.useContext = function(n) {
    return A.H.useContext(n);
  }, _.useDebugValue = function() {
  }, _.useDeferredValue = function(n, s) {
    return A.H.useDeferredValue(n, s);
  }, _.useEffect = function(n, s) {
    return A.H.useEffect(n, s);
  }, _.useId = function() {
    return A.H.useId();
  }, _.useImperativeHandle = function(n, s, E) {
    return A.H.useImperativeHandle(n, s, E);
  }, _.useInsertionEffect = function(n, s) {
    return A.H.useInsertionEffect(n, s);
  }, _.useLayoutEffect = function(n, s) {
    return A.H.useLayoutEffect(n, s);
  }, _.useMemo = function(n, s) {
    return A.H.useMemo(n, s);
  }, _.useOptimistic = function(n, s) {
    return A.H.useOptimistic(n, s);
  }, _.useReducer = function(n, s, E) {
    return A.H.useReducer(n, s, E);
  }, _.useRef = function(n) {
    return A.H.useRef(n);
  }, _.useState = function(n) {
    return A.H.useState(n);
  }, _.useSyncExternalStore = function(n, s, E) {
    return A.H.useSyncExternalStore(
      n,
      s,
      E
    );
  }, _.useTransition = function() {
    return A.H.useTransition();
  }, _.version = "19.0.0", _;
}
o(gt, "requireReact_production");
var xe = { exports: {} };
/**
 * @license React
 * react.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
xe.exports;
var it;
function ht() {
  return it || (it = 1, (function(S, m) {
    process.env.NODE_ENV !== "production" && (function() {
      function ee(e, r) {
        Object.defineProperty(P.prototype, e, {
          get: /* @__PURE__ */ o(function() {
            console.warn(
              "%s(...) is deprecated in plain JavaScript React classes. %s",
              r[0],
              r[1]
            );
          }, "get")
        });
      }
      o(ee, "defineDeprecationWarning");
      function te(e) {
        return e === null || typeof e != "object" ? null : (e = Ne && e[Ne] || e["@@iterator"], typeof e == "function" ? e : null);
      }
      o(te, "getIteratorFn");
      function M(e, r) {
        e = (e = e.constructor) && (e.displayName || e.name) || "ReactClass";
        var u = e + "." + r;
        Pe[u] || (console.error(
          "Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.",
          r,
          e
        ), Pe[u] = !0);
      }
      o(M, "warnNoop");
      function P(e, r, u) {
        this.props = e, this.context = r, this.refs = f, this.updater = u || t;
      }
      o(P, "Component");
      function W() {
      }
      o(W, "ComponentDummy");
      function z(e, r, u) {
        this.props = e, this.context = r, this.refs = f, this.updater = u || t;
      }
      o(z, "PureComponent");
      function se(e) {
        return "" + e;
      }
      o(se, "testStringCoercion");
      function X(e) {
        try {
          se(e);
          var r = !1;
        } catch {
          r = !0;
        }
        if (r) {
          r = console;
          var u = r.error, a = typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
          return u.call(
            r,
            "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
            a
          ), se(e);
        }
      }
      o(X, "checkKeyStringCoercion");
      function I(e) {
        if (e == null) return null;
        if (typeof e == "function")
          return e.$$typeof === y ? null : e.displayName || e.name || null;
        if (typeof e == "string") return e;
        switch (e) {
          case j:
            return "Fragment";
          case U:
            return "Portal";
          case ke:
            return "Profiler";
          case de:
            return "StrictMode";
          case pe:
            return "Suspense";
          case Te:
            return "SuspenseList";
        }
        if (typeof e == "object")
          switch (typeof e.tag == "number" && console.error(
            "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
          ), e.$$typeof) {
            case we:
              return (e.displayName || "Context") + ".Provider";
            case _e:
              return (e._context.displayName || "Context") + ".Consumer";
            case be:
              var r = e.render;
              return e = e.displayName, e || (e = r.displayName || r.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
            case Re:
              return r = e.displayName || null, r !== null ? r : I(e.type) || "Memo";
            case ve:
              r = e._payload, e = e._init;
              try {
                return I(e(r));
              } catch {
              }
          }
        return null;
      }
      o(I, "getComponentNameFromType");
      function me(e) {
        return typeof e == "string" || typeof e == "function" || e === j || e === ke || e === de || e === pe || e === Te || e === Ue || typeof e == "object" && e !== null && (e.$$typeof === ve || e.$$typeof === Re || e.$$typeof === we || e.$$typeof === _e || e.$$typeof === be || e.$$typeof === Y || e.getModuleId !== void 0);
      }
      o(me, "isValidElementType");
      function Ae() {
      }
      o(Ae, "disabledLog");
      function Se() {
        if ($ === 0) {
          Ee = console.log, Q = console.info, Ce = console.warn, B = console.error, Qe = console.group, Xe = console.groupCollapsed, De = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: Ae,
            writable: !0
          };
          Object.defineProperties(console, {
            info: e,
            log: e,
            warn: e,
            error: e,
            group: e,
            groupCollapsed: e,
            groupEnd: e
          });
        }
        $++;
      }
      o(Se, "disableLogs");
      function ge() {
        if ($--, $ === 0) {
          var e = { configurable: !0, enumerable: !0, writable: !0 };
          Object.defineProperties(console, {
            log: i({}, e, { value: Ee }),
            info: i({}, e, { value: Q }),
            warn: i({}, e, { value: Ce }),
            error: i({}, e, { value: B }),
            group: i({}, e, { value: Qe }),
            groupCollapsed: i({}, e, { value: Xe }),
            groupEnd: i({}, e, { value: De })
          });
        }
        0 > $ && console.error(
          "disabledDepth fell below zero. This is a bug in React. Please file an issue."
        );
      }
      o(ge, "reenableLogs");
      function D(e) {
        if (Ie === void 0)
          try {
            throw Error();
          } catch (u) {
            var r = u.stack.trim().match(/\n( *(at )?)/);
            Ie = r && r[1] || "", Ve = -1 < u.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < u.stack.indexOf("@") ? "@unknown:0:0" : "";
          }
        return `
` + Ie + e + Ve;
      }
      o(D, "describeBuiltInComponentFrame");
      function L(e, r) {
        if (!e || Ge) return "";
        var u = Be.get(e);
        if (u !== void 0) return u;
        Ge = !0, u = Error.prepareStackTrace, Error.prepareStackTrace = void 0;
        var a = null;
        a = v.H, v.H = null, Se();
        try {
          var c = {
            DetermineComponentFrameRoot: /* @__PURE__ */ o(function() {
              try {
                if (r) {
                  var F = /* @__PURE__ */ o(function() {
                    throw Error();
                  }, "Fake");
                  if (Object.defineProperty(F.prototype, "props", {
                    set: /* @__PURE__ */ o(function() {
                      throw Error();
                    }, "set")
                  }), typeof Reflect == "object" && Reflect.construct) {
                    try {
                      Reflect.construct(F, []);
                    } catch (ue) {
                      var qe = ue;
                    }
                    Reflect.construct(e, [], F);
                  } else {
                    try {
                      F.call();
                    } catch (ue) {
                      qe = ue;
                    }
                    e.call(F.prototype);
                  }
                } else {
                  try {
                    throw Error();
                  } catch (ue) {
                    qe = ue;
                  }
                  (F = e()) && typeof F.catch == "function" && F.catch(function() {
                  });
                }
              } catch (ue) {
                if (ue && qe && typeof ue.stack == "string")
                  return [ue.stack, qe.stack];
              }
              return [null, null];
            }, "DetermineComponentFrameRoot")
          };
          c.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
          var d = Object.getOwnPropertyDescriptor(
            c.DetermineComponentFrameRoot,
            "name"
          );
          d && d.configurable && Object.defineProperty(
            c.DetermineComponentFrameRoot,
            "name",
            { value: "DetermineComponentFrameRoot" }
          );
          var l = c.DetermineComponentFrameRoot(), R = l[0], b = l[1];
          if (R && b) {
            var k = R.split(`
`), H = b.split(`
`);
            for (l = d = 0; d < k.length && !k[d].includes(
              "DetermineComponentFrameRoot"
            ); )
              d++;
            for (; l < H.length && !H[l].includes(
              "DetermineComponentFrameRoot"
            ); )
              l++;
            if (d === k.length || l === H.length)
              for (d = k.length - 1, l = H.length - 1; 1 <= d && 0 <= l && k[d] !== H[l]; )
                l--;
            for (; 1 <= d && 0 <= l; d--, l--)
              if (k[d] !== H[l]) {
                if (d !== 1 || l !== 1)
                  do
                    if (d--, l--, 0 > l || k[d] !== H[l]) {
                      var Oe = `
` + k[d].replace(
                        " at new ",
                        " at "
                      );
                      return e.displayName && Oe.includes("<anonymous>") && (Oe = Oe.replace("<anonymous>", e.displayName)), typeof e == "function" && Be.set(e, Oe), Oe;
                    }
                  while (1 <= d && 0 <= l);
                break;
              }
          }
        } finally {
          Ge = !1, v.H = a, ge(), Error.prepareStackTrace = u;
        }
        return k = (k = e ? e.displayName || e.name : "") ? D(k) : "", typeof e == "function" && Be.set(e, k), k;
      }
      o(L, "describeNativeComponentFrame");
      function re(e) {
        if (e == null) return "";
        if (typeof e == "function") {
          var r = e.prototype;
          return L(
            e,
            !(!r || !r.isReactComponent)
          );
        }
        if (typeof e == "string") return D(e);
        switch (e) {
          case pe:
            return D("Suspense");
          case Te:
            return D("SuspenseList");
        }
        if (typeof e == "object")
          switch (e.$$typeof) {
            case be:
              return e = L(e.render, !1), e;
            case Re:
              return re(e.type);
            case ve:
              r = e._payload, e = e._init;
              try {
                return re(e(r));
              } catch {
              }
          }
        return "";
      }
      o(re, "describeUnknownElementTypeFrameInDEV");
      function V() {
        var e = v.A;
        return e === null ? null : e.getOwner();
      }
      o(V, "getOwner");
      function ae(e) {
        if (K.call(e, "key")) {
          var r = Object.getOwnPropertyDescriptor(e, "key").get;
          if (r && r.isReactWarning) return !1;
        }
        return e.key !== void 0;
      }
      o(ae, "hasValidKey");
      function ie(e, r) {
        function u() {
          Je || (Je = !0, console.error(
            "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
            r
          ));
        }
        o(u, "warnAboutAccessingKey"), u.isReactWarning = !0, Object.defineProperty(e, "key", {
          get: u,
          configurable: !0
        });
      }
      o(ie, "defineKeyPropWarningGetter");
      function A() {
        var e = I(this.type);
        return Fe[e] || (Fe[e] = !0, console.error(
          "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
        )), e = this.props.ref, e !== void 0 ? e : null;
      }
      o(A, "elementRefGetterWithDeprecationWarning");
      function J(e, r, u, a, c, d) {
        return u = d.ref, e = {
          $$typeof: g,
          type: e,
          key: r,
          props: d,
          _owner: c
        }, (u !== void 0 ? u : null) !== null ? Object.defineProperty(e, "ref", {
          enumerable: !1,
          get: A
        }) : Object.defineProperty(e, "ref", { enumerable: !1, value: null }), e._store = {}, Object.defineProperty(e._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: 0
        }), Object.defineProperty(e, "_debugInfo", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: null
        }), Object.freeze && (Object.freeze(e.props), Object.freeze(e)), e;
      }
      o(J, "ReactElement");
      function fe(e, r) {
        return r = J(
          e.type,
          r,
          void 0,
          void 0,
          e._owner,
          e.props
        ), r._store.validated = e._store.validated, r;
      }
      o(fe, "cloneAndReplaceKey");
      function he(e, r) {
        if (typeof e == "object" && e && e.$$typeof !== pt) {
          if (O(e))
            for (var u = 0; u < e.length; u++) {
              var a = e[u];
              x(a) && ye(a, r);
            }
          else if (x(e))
            e._store && (e._store.validated = 1);
          else if (u = te(e), typeof u == "function" && u !== e.entries && (u = u.call(e), u !== e))
            for (; !(e = u.next()).done; )
              x(e.value) && ye(e.value, r);
        }
      }
      o(he, "validateChildKeys");
      function x(e) {
        return typeof e == "object" && e !== null && e.$$typeof === g;
      }
      o(x, "isValidElement");
      function ye(e, r) {
        if (e._store && !e._store.validated && e.key == null && (e._store.validated = 1, r = ce(r), !et[r])) {
          et[r] = !0;
          var u = "";
          e && e._owner != null && e._owner !== V() && (u = null, typeof e._owner.tag == "number" ? u = I(e._owner.type) : typeof e._owner.name == "string" && (u = e._owner.name), u = " It was passed a child from " + u + ".");
          var a = v.getCurrentStack;
          v.getCurrentStack = function() {
            var c = re(e.type);
            return a && (c += a() || ""), c;
          }, console.error(
            'Each child in a list should have a unique "key" prop.%s%s See https://react.dev/link/warning-keys for more information.',
            r,
            u
          ), v.getCurrentStack = a;
        }
      }
      o(ye, "validateExplicitKey");
      function ce(e) {
        var r = "", u = V();
        return u && (u = I(u.type)) && (r = `

Check the render method of \`` + u + "`."), r || (e = I(e)) && (r = `

Check the top-level render call using <` + e + ">."), r;
      }
      o(ce, "getCurrentComponentErrorInfo");
      function ne(e) {
        var r = { "=": "=0", ":": "=2" };
        return "$" + e.replace(/[=:]/g, function(u) {
          return r[u];
        });
      }
      o(ne, "escape");
      function Z(e, r) {
        return typeof e == "object" && e !== null && e.key != null ? (X(e.key), ne("" + e.key)) : r.toString(36);
      }
      o(Z, "getElementKey");
      function le() {
      }
      o(le, "noop$1");
      function G(e) {
        switch (e.status) {
          case "fulfilled":
            return e.value;
          case "rejected":
            throw e.reason;
          default:
            switch (typeof e.status == "string" ? e.then(le, le) : (e.status = "pending", e.then(
              function(r) {
                e.status === "pending" && (e.status = "fulfilled", e.value = r);
              },
              function(r) {
                e.status === "pending" && (e.status = "rejected", e.reason = r);
              }
            )), e.status) {
              case "fulfilled":
                return e.value;
              case "rejected":
                throw e.reason;
            }
        }
        throw e;
      }
      o(G, "resolveThenable");
      function q(e, r, u, a, c) {
        var d = typeof e;
        (d === "undefined" || d === "boolean") && (e = null);
        var l = !1;
        if (e === null) l = !0;
        else
          switch (d) {
            case "bigint":
            case "string":
            case "number":
              l = !0;
              break;
            case "object":
              switch (e.$$typeof) {
                case g:
                case U:
                  l = !0;
                  break;
                case ve:
                  return l = e._init, q(
                    l(e._payload),
                    r,
                    u,
                    a,
                    c
                  );
              }
          }
        if (l) {
          l = e, c = c(l);
          var R = a === "" ? "." + Z(l, 0) : a;
          return O(c) ? (u = "", R != null && (u = R.replace(rt, "$&/") + "/"), q(c, r, u, "", function(k) {
            return k;
          })) : c != null && (x(c) && (c.key != null && (l && l.key === c.key || X(c.key)), u = fe(
            c,
            u + (c.key == null || l && l.key === c.key ? "" : ("" + c.key).replace(
              rt,
              "$&/"
            ) + "/") + R
          ), a !== "" && l != null && x(l) && l.key == null && l._store && !l._store.validated && (u._store.validated = 2), c = u), r.push(c)), 1;
        }
        if (l = 0, R = a === "" ? "." : a + ":", O(e))
          for (var b = 0; b < e.length; b++)
            a = e[b], d = R + Z(a, b), l += q(
              a,
              r,
              u,
              d,
              c
            );
        else if (b = te(e), typeof b == "function")
          for (b === e.entries && (tt || console.warn(
            "Using Maps as children is not supported. Use an array of keyed ReactElements instead."
          ), tt = !0), e = b.call(e), b = 0; !(a = e.next()).done; )
            a = a.value, d = R + Z(a, b++), l += q(
              a,
              r,
              u,
              d,
              c
            );
        else if (d === "object") {
          if (typeof e.then == "function")
            return q(
              G(e),
              r,
              u,
              a,
              c
            );
          throw r = String(e), Error(
            "Objects are not valid as a React child (found: " + (r === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : r) + "). If you meant to render a collection of children, use an array instead."
          );
        }
        return l;
      }
      o(q, "mapIntoArray");
      function oe(e, r, u) {
        if (e == null) return e;
        var a = [], c = 0;
        return q(e, a, "", "", function(d) {
          return r.call(u, d, c++);
        }), a;
      }
      o(oe, "mapChildren");
      function je(e) {
        if (e._status === -1) {
          var r = e._result;
          r = r(), r.then(
            function(u) {
              (e._status === 0 || e._status === -1) && (e._status = 1, e._result = u);
            },
            function(u) {
              (e._status === 0 || e._status === -1) && (e._status = 2, e._result = u);
            }
          ), e._status === -1 && (e._status = 0, e._result = r);
        }
        if (e._status === 1)
          return r = e._result, r === void 0 && console.error(
            `lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`,
            r
          ), "default" in r || console.error(
            `lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`,
            r
          ), r.default;
        throw e._result;
      }
      o(je, "lazyInitializer");
      function T() {
        var e = v.H;
        return e === null && console.error(
          `Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.`
        ), e;
      }
      o(T, "resolveDispatcher");
      function n() {
      }
      o(n, "noop");
      function s(e) {
        if (He === null)
          try {
            var r = ("require" + Math.random()).slice(0, 7);
            He = (S && S[r]).call(
              S,
              "timers"
            ).setImmediate;
          } catch {
            He = /* @__PURE__ */ o(function(a) {
              ot === !1 && (ot = !0, typeof MessageChannel > "u" && console.error(
                "This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."
              ));
              var c = new MessageChannel();
              c.port1.onmessage = a, c.port2.postMessage(void 0);
            }, "enqueueTaskImpl");
          }
        return He(e);
      }
      o(s, "enqueueTask");
      function E(e) {
        return 1 < e.length && typeof AggregateError == "function" ? new AggregateError(e) : e[0];
      }
      o(E, "aggregateErrors");
      function p(e, r) {
        r !== We - 1 && console.error(
          "You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "
        ), We = r;
      }
      o(p, "popActScope");
      function h(e, r, u) {
        var a = v.actQueue;
        if (a !== null)
          if (a.length !== 0)
            try {
              C(a), s(function() {
                return h(e, r, u);
              });
              return;
            } catch (c) {
              v.thrownErrors.push(c);
            }
          else v.actQueue = null;
        0 < v.thrownErrors.length ? (a = E(v.thrownErrors), v.thrownErrors.length = 0, u(a)) : r(e);
      }
      o(h, "recursivelyFlushAsyncActWork");
      function C(e) {
        if (!Ke) {
          Ke = !0;
          var r = 0;
          try {
            for (; r < e.length; r++) {
              var u = e[r];
              do {
                v.didUsePromise = !1;
                var a = u(!1);
                if (a !== null) {
                  if (v.didUsePromise) {
                    e[r] = u, e.splice(0, r);
                    return;
                  }
                  u = a;
                } else break;
              } while (!0);
            }
            e.length = 0;
          } catch (c) {
            e.splice(0, r + 1), v.thrownErrors.push(c);
          } finally {
            Ke = !1;
          }
        }
      }
      o(C, "flushActQueue"), typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
      var g = Symbol.for("react.transitional.element"), U = Symbol.for("react.portal"), j = Symbol.for("react.fragment"), de = Symbol.for("react.strict_mode"), ke = Symbol.for("react.profiler"), _e = Symbol.for("react.consumer"), we = Symbol.for("react.context"), be = Symbol.for("react.forward_ref"), pe = Symbol.for("react.suspense"), Te = Symbol.for("react.suspense_list"), Re = Symbol.for("react.memo"), ve = Symbol.for("react.lazy"), Ue = Symbol.for("react.offscreen"), Ne = Symbol.iterator, Pe = {}, t = {
        isMounted: /* @__PURE__ */ o(function() {
          return !1;
        }, "isMounted"),
        enqueueForceUpdate: /* @__PURE__ */ o(function(e) {
          M(e, "forceUpdate");
        }, "enqueueForceUpdate"),
        enqueueReplaceState: /* @__PURE__ */ o(function(e) {
          M(e, "replaceState");
        }, "enqueueReplaceState"),
        enqueueSetState: /* @__PURE__ */ o(function(e) {
          M(e, "setState");
        }, "enqueueSetState")
      }, i = Object.assign, f = {};
      Object.freeze(f), P.prototype.isReactComponent = {}, P.prototype.setState = function(e, r) {
        if (typeof e != "object" && typeof e != "function" && e != null)
          throw Error(
            "takes an object of state variables to update or a function which returns an object of state variables."
          );
        this.updater.enqueueSetState(this, e, r, "setState");
      }, P.prototype.forceUpdate = function(e) {
        this.updater.enqueueForceUpdate(this, e, "forceUpdate");
      };
      var w = {
        isMounted: [
          "isMounted",
          "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."
        ],
        replaceState: [
          "replaceState",
          "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."
        ]
      }, N;
      for (N in w)
        w.hasOwnProperty(N) && ee(N, w[N]);
      W.prototype = P.prototype, w = z.prototype = new W(), w.constructor = z, i(w, P.prototype), w.isPureReactComponent = !0;
      var O = Array.isArray, y = Symbol.for("react.client.reference"), v = {
        H: null,
        A: null,
        T: null,
        S: null,
        actQueue: null,
        isBatchingLegacy: !1,
        didScheduleLegacyUpdate: !1,
        didUsePromise: !1,
        thrownErrors: [],
        getCurrentStack: null
      }, K = Object.prototype.hasOwnProperty, Y = Symbol.for("react.client.reference"), $ = 0, Ee, Q, Ce, B, Qe, Xe, De;
      Ae.__reactDisabledLog = !0;
      var Ie, Ve, Ge = !1, Be = new (typeof WeakMap == "function" ? WeakMap : Map)(), pt = Symbol.for("react.client.reference"), Je, Ze, Fe = {}, et = {}, tt = !1, rt = /\/+/g, nt = typeof reportError == "function" ? reportError : function(e) {
        if (typeof window == "object" && typeof window.ErrorEvent == "function") {
          var r = new window.ErrorEvent("error", {
            bubbles: !0,
            cancelable: !0,
            message: typeof e == "object" && e !== null && typeof e.message == "string" ? String(e.message) : String(e),
            error: e
          });
          if (!window.dispatchEvent(r)) return;
        } else if (typeof process == "object" && typeof process.emit == "function") {
          process.emit("uncaughtException", e);
          return;
        }
        console.error(e);
      }, ot = !1, He = null, We = 0, Le = !1, Ke = !1, ut = typeof queueMicrotask == "function" ? function(e) {
        queueMicrotask(function() {
          return queueMicrotask(e);
        });
      } : s;
      m.Children = {
        map: oe,
        forEach: /* @__PURE__ */ o(function(e, r, u) {
          oe(
            e,
            function() {
              r.apply(this, arguments);
            },
            u
          );
        }, "forEach"),
        count: /* @__PURE__ */ o(function(e) {
          var r = 0;
          return oe(e, function() {
            r++;
          }), r;
        }, "count"),
        toArray: /* @__PURE__ */ o(function(e) {
          return oe(e, function(r) {
            return r;
          }) || [];
        }, "toArray"),
        only: /* @__PURE__ */ o(function(e) {
          if (!x(e))
            throw Error(
              "React.Children.only expected to receive a single React element child."
            );
          return e;
        }, "only")
      }, m.Component = P, m.Fragment = j, m.Profiler = ke, m.PureComponent = z, m.StrictMode = de, m.Suspense = pe, m.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = v, m.act = function(e) {
        var r = v.actQueue, u = We;
        We++;
        var a = v.actQueue = r !== null ? r : [], c = !1;
        try {
          var d = e();
        } catch (b) {
          v.thrownErrors.push(b);
        }
        if (0 < v.thrownErrors.length)
          throw p(r, u), e = E(v.thrownErrors), v.thrownErrors.length = 0, e;
        if (d !== null && typeof d == "object" && typeof d.then == "function") {
          var l = d;
          return ut(function() {
            c || Le || (Le = !0, console.error(
              "You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"
            ));
          }), {
            then: /* @__PURE__ */ o(function(b, k) {
              c = !0, l.then(
                function(H) {
                  if (p(r, u), u === 0) {
                    try {
                      C(a), s(function() {
                        return h(
                          H,
                          b,
                          k
                        );
                      });
                    } catch (F) {
                      v.thrownErrors.push(F);
                    }
                    if (0 < v.thrownErrors.length) {
                      var Oe = E(
                        v.thrownErrors
                      );
                      v.thrownErrors.length = 0, k(Oe);
                    }
                  } else b(H);
                },
                function(H) {
                  p(r, u), 0 < v.thrownErrors.length && (H = E(
                    v.thrownErrors
                  ), v.thrownErrors.length = 0), k(H);
                }
              );
            }, "then")
          };
        }
        var R = d;
        if (p(r, u), u === 0 && (C(a), a.length !== 0 && ut(function() {
          c || Le || (Le = !0, console.error(
            "A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)"
          ));
        }), v.actQueue = null), 0 < v.thrownErrors.length)
          throw e = E(v.thrownErrors), v.thrownErrors.length = 0, e;
        return {
          then: /* @__PURE__ */ o(function(b, k) {
            c = !0, u === 0 ? (v.actQueue = a, s(function() {
              return h(
                R,
                b,
                k
              );
            })) : b(R);
          }, "then")
        };
      }, m.cache = function(e) {
        return function() {
          return e.apply(null, arguments);
        };
      }, m.cloneElement = function(e, r, u) {
        if (e == null)
          throw Error(
            "The argument must be a React element, but you passed " + e + "."
          );
        var a = i({}, e.props), c = e.key, d = e._owner;
        if (r != null) {
          var l;
          e: {
            if (K.call(r, "ref") && (l = Object.getOwnPropertyDescriptor(
              r,
              "ref"
            ).get) && l.isReactWarning) {
              l = !1;
              break e;
            }
            l = r.ref !== void 0;
          }
          l && (d = V()), ae(r) && (X(r.key), c = "" + r.key);
          for (R in r)
            !K.call(r, R) || R === "key" || R === "__self" || R === "__source" || R === "ref" && r.ref === void 0 || (a[R] = r[R]);
        }
        var R = arguments.length - 2;
        if (R === 1) a.children = u;
        else if (1 < R) {
          l = Array(R);
          for (var b = 0; b < R; b++)
            l[b] = arguments[b + 2];
          a.children = l;
        }
        for (a = J(e.type, c, void 0, void 0, d, a), c = 2; c < arguments.length; c++)
          he(arguments[c], a.type);
        return a;
      }, m.createContext = function(e) {
        return e = {
          $$typeof: we,
          _currentValue: e,
          _currentValue2: e,
          _threadCount: 0,
          Provider: null,
          Consumer: null
        }, e.Provider = e, e.Consumer = {
          $$typeof: _e,
          _context: e
        }, e._currentRenderer = null, e._currentRenderer2 = null, e;
      }, m.createElement = function(e, r, u) {
        if (me(e))
          for (var a = 2; a < arguments.length; a++)
            he(arguments[a], e);
        else {
          if (a = "", (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (a += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports."), e === null) var c = "null";
          else
            O(e) ? c = "array" : e !== void 0 && e.$$typeof === g ? (c = "<" + (I(e.type) || "Unknown") + " />", a = " Did you accidentally export a JSX literal instead of a component?") : c = typeof e;
          console.error(
            "React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s",
            c,
            a
          );
        }
        var d;
        if (a = {}, c = null, r != null)
          for (d in Ze || !("__self" in r) || "key" in r || (Ze = !0, console.warn(
            "Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform"
          )), ae(r) && (X(r.key), c = "" + r.key), r)
            K.call(r, d) && d !== "key" && d !== "__self" && d !== "__source" && (a[d] = r[d]);
        var l = arguments.length - 2;
        if (l === 1) a.children = u;
        else if (1 < l) {
          for (var R = Array(l), b = 0; b < l; b++)
            R[b] = arguments[b + 2];
          Object.freeze && Object.freeze(R), a.children = R;
        }
        if (e && e.defaultProps)
          for (d in l = e.defaultProps, l)
            a[d] === void 0 && (a[d] = l[d]);
        return c && ie(
          a,
          typeof e == "function" ? e.displayName || e.name || "Unknown" : e
        ), J(e, c, void 0, void 0, V(), a);
      }, m.createRef = function() {
        var e = { current: null };
        return Object.seal(e), e;
      }, m.forwardRef = function(e) {
        e != null && e.$$typeof === Re ? console.error(
          "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...))."
        ) : typeof e != "function" ? console.error(
          "forwardRef requires a render function but was given %s.",
          e === null ? "null" : typeof e
        ) : e.length !== 0 && e.length !== 2 && console.error(
          "forwardRef render functions accept exactly two parameters: props and ref. %s",
          e.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."
        ), e != null && e.defaultProps != null && console.error(
          "forwardRef render functions do not support defaultProps. Did you accidentally pass a React component?"
        );
        var r = { $$typeof: be, render: e }, u;
        return Object.defineProperty(r, "displayName", {
          enumerable: !1,
          configurable: !0,
          get: /* @__PURE__ */ o(function() {
            return u;
          }, "get"),
          set: /* @__PURE__ */ o(function(a) {
            u = a, e.name || e.displayName || (Object.defineProperty(e, "name", { value: a }), e.displayName = a);
          }, "set")
        }), r;
      }, m.isValidElement = x, m.lazy = function(e) {
        return {
          $$typeof: ve,
          _payload: { _status: -1, _result: e },
          _init: je
        };
      }, m.memo = function(e, r) {
        me(e) || console.error(
          "memo: The first argument must be a component. Instead received: %s",
          e === null ? "null" : typeof e
        ), r = {
          $$typeof: Re,
          type: e,
          compare: r === void 0 ? null : r
        };
        var u;
        return Object.defineProperty(r, "displayName", {
          enumerable: !1,
          configurable: !0,
          get: /* @__PURE__ */ o(function() {
            return u;
          }, "get"),
          set: /* @__PURE__ */ o(function(a) {
            u = a, e.name || e.displayName || (Object.defineProperty(e, "name", { value: a }), e.displayName = a);
          }, "set")
        }), r;
      }, m.startTransition = function(e) {
        var r = v.T, u = {};
        v.T = u, u._updatedFibers = /* @__PURE__ */ new Set();
        try {
          var a = e(), c = v.S;
          c !== null && c(u, a), typeof a == "object" && a !== null && typeof a.then == "function" && a.then(n, nt);
        } catch (d) {
          nt(d);
        } finally {
          r === null && u._updatedFibers && (e = u._updatedFibers.size, u._updatedFibers.clear(), 10 < e && console.warn(
            "Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."
          )), v.T = r;
        }
      }, m.unstable_useCacheRefresh = function() {
        return T().useCacheRefresh();
      }, m.use = function(e) {
        return T().use(e);
      }, m.useActionState = function(e, r, u) {
        return T().useActionState(
          e,
          r,
          u
        );
      }, m.useCallback = function(e, r) {
        return T().useCallback(e, r);
      }, m.useContext = function(e) {
        var r = T();
        return e.$$typeof === _e && console.error(
          "Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?"
        ), r.useContext(e);
      }, m.useDebugValue = function(e, r) {
        return T().useDebugValue(e, r);
      }, m.useDeferredValue = function(e, r) {
        return T().useDeferredValue(e, r);
      }, m.useEffect = function(e, r) {
        return T().useEffect(e, r);
      }, m.useId = function() {
        return T().useId();
      }, m.useImperativeHandle = function(e, r, u) {
        return T().useImperativeHandle(e, r, u);
      }, m.useInsertionEffect = function(e, r) {
        return T().useInsertionEffect(e, r);
      }, m.useLayoutEffect = function(e, r) {
        return T().useLayoutEffect(e, r);
      }, m.useMemo = function(e, r) {
        return T().useMemo(e, r);
      }, m.useOptimistic = function(e, r) {
        return T().useOptimistic(e, r);
      }, m.useReducer = function(e, r, u) {
        return T().useReducer(e, r, u);
      }, m.useRef = function(e) {
        return T().useRef(e);
      }, m.useState = function(e) {
        return T().useState(e);
      }, m.useSyncExternalStore = function(e, r, u) {
        return T().useSyncExternalStore(
          e,
          r,
          u
        );
      }, m.useTransition = function() {
        return T().useTransition();
      }, m.version = "19.0.0", typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
    })();
  })(xe, xe.exports)), xe.exports;
}
o(ht, "requireReact_development");
var ft;
function dt() {
  return ft || (ft = 1, process.env.NODE_ENV === "production" ? ze.exports = gt() : ze.exports = ht()), ze.exports;
}
o(dt, "requireReact");
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ct;
function yt() {
  return ct || (ct = 1, process.env.NODE_ENV !== "production" && (function() {
    function S(t) {
      if (t == null) return null;
      if (typeof t == "function")
        return t.$$typeof === je ? null : t.displayName || t.name || null;
      if (typeof t == "string") return t;
      switch (t) {
        case J:
          return "Fragment";
        case A:
          return "Portal";
        case he:
          return "Profiler";
        case fe:
          return "StrictMode";
        case ne:
          return "Suspense";
        case Z:
          return "SuspenseList";
      }
      if (typeof t == "object")
        switch (typeof t.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), t.$$typeof) {
          case ye:
            return (t.displayName || "Context") + ".Provider";
          case x:
            return (t._context.displayName || "Context") + ".Consumer";
          case ce:
            var i = t.render;
            return t = t.displayName, t || (t = i.displayName || i.name || "", t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef"), t;
          case le:
            return i = t.displayName || null, i !== null ? i : S(t.type) || "Memo";
          case G:
            i = t._payload, t = t._init;
            try {
              return S(t(i));
            } catch {
            }
        }
      return null;
    }
    o(S, "getComponentNameFromType");
    function m(t) {
      return "" + t;
    }
    o(m, "testStringCoercion");
    function ee(t) {
      try {
        m(t);
        var i = !1;
      } catch {
        i = !0;
      }
      if (i) {
        i = console;
        var f = i.error, w = typeof Symbol == "function" && Symbol.toStringTag && t[Symbol.toStringTag] || t.constructor.name || "Object";
        return f.call(
          i,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          w
        ), m(t);
      }
    }
    o(ee, "checkKeyStringCoercion");
    function te() {
    }
    o(te, "disabledLog");
    function M() {
      if (h === 0) {
        C = console.log, g = console.info, U = console.warn, j = console.error, de = console.group, ke = console.groupCollapsed, _e = console.groupEnd;
        var t = {
          configurable: !0,
          enumerable: !0,
          value: te,
          writable: !0
        };
        Object.defineProperties(console, {
          info: t,
          log: t,
          warn: t,
          error: t,
          group: t,
          groupCollapsed: t,
          groupEnd: t
        });
      }
      h++;
    }
    o(M, "disableLogs");
    function P() {
      if (h--, h === 0) {
        var t = { configurable: !0, enumerable: !0, writable: !0 };
        Object.defineProperties(console, {
          log: s({}, t, { value: C }),
          info: s({}, t, { value: g }),
          warn: s({}, t, { value: U }),
          error: s({}, t, { value: j }),
          group: s({}, t, { value: de }),
          groupCollapsed: s({}, t, { value: ke }),
          groupEnd: s({}, t, { value: _e })
        });
      }
      0 > h && console.error(
        "disabledDepth fell below zero. This is a bug in React. Please file an issue."
      );
    }
    o(P, "reenableLogs");
    function W(t) {
      if (we === void 0)
        try {
          throw Error();
        } catch (f) {
          var i = f.stack.trim().match(/\n( *(at )?)/);
          we = i && i[1] || "", be = -1 < f.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < f.stack.indexOf("@") ? "@unknown:0:0" : "";
        }
      return `
` + we + t + be;
    }
    o(W, "describeBuiltInComponentFrame");
    function z(t, i) {
      if (!t || pe) return "";
      var f = Te.get(t);
      if (f !== void 0) return f;
      pe = !0, f = Error.prepareStackTrace, Error.prepareStackTrace = void 0;
      var w = null;
      w = T.H, T.H = null, M();
      try {
        var N = {
          DetermineComponentFrameRoot: /* @__PURE__ */ o(function() {
            try {
              if (i) {
                var Q = /* @__PURE__ */ o(function() {
                  throw Error();
                }, "Fake");
                if (Object.defineProperty(Q.prototype, "props", {
                  set: /* @__PURE__ */ o(function() {
                    throw Error();
                  }, "set")
                }), typeof Reflect == "object" && Reflect.construct) {
                  try {
                    Reflect.construct(Q, []);
                  } catch (B) {
                    var Ce = B;
                  }
                  Reflect.construct(t, [], Q);
                } else {
                  try {
                    Q.call();
                  } catch (B) {
                    Ce = B;
                  }
                  t.call(Q.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (B) {
                  Ce = B;
                }
                (Q = t()) && typeof Q.catch == "function" && Q.catch(function() {
                });
              }
            } catch (B) {
              if (B && Ce && typeof B.stack == "string")
                return [B.stack, Ce.stack];
            }
            return [null, null];
          }, "DetermineComponentFrameRoot")
        };
        N.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
        var O = Object.getOwnPropertyDescriptor(
          N.DetermineComponentFrameRoot,
          "name"
        );
        O && O.configurable && Object.defineProperty(
          N.DetermineComponentFrameRoot,
          "name",
          { value: "DetermineComponentFrameRoot" }
        );
        var y = N.DetermineComponentFrameRoot(), v = y[0], K = y[1];
        if (v && K) {
          var Y = v.split(`
`), $ = K.split(`
`);
          for (y = O = 0; O < Y.length && !Y[O].includes(
            "DetermineComponentFrameRoot"
          ); )
            O++;
          for (; y < $.length && !$[y].includes(
            "DetermineComponentFrameRoot"
          ); )
            y++;
          if (O === Y.length || y === $.length)
            for (O = Y.length - 1, y = $.length - 1; 1 <= O && 0 <= y && Y[O] !== $[y]; )
              y--;
          for (; 1 <= O && 0 <= y; O--, y--)
            if (Y[O] !== $[y]) {
              if (O !== 1 || y !== 1)
                do
                  if (O--, y--, 0 > y || Y[O] !== $[y]) {
                    var Ee = `
` + Y[O].replace(
                      " at new ",
                      " at "
                    );
                    return t.displayName && Ee.includes("<anonymous>") && (Ee = Ee.replace("<anonymous>", t.displayName)), typeof t == "function" && Te.set(t, Ee), Ee;
                  }
                while (1 <= O && 0 <= y);
              break;
            }
        }
      } finally {
        pe = !1, T.H = w, P(), Error.prepareStackTrace = f;
      }
      return Y = (Y = t ? t.displayName || t.name : "") ? W(Y) : "", typeof t == "function" && Te.set(t, Y), Y;
    }
    o(z, "describeNativeComponentFrame");
    function se(t) {
      if (t == null) return "";
      if (typeof t == "function") {
        var i = t.prototype;
        return z(
          t,
          !(!i || !i.isReactComponent)
        );
      }
      if (typeof t == "string") return W(t);
      switch (t) {
        case ne:
          return W("Suspense");
        case Z:
          return W("SuspenseList");
      }
      if (typeof t == "object")
        switch (t.$$typeof) {
          case ce:
            return t = z(t.render, !1), t;
          case le:
            return se(t.type);
          case G:
            i = t._payload, t = t._init;
            try {
              return se(t(i));
            } catch {
            }
        }
      return "";
    }
    o(se, "describeUnknownElementTypeFrameInDEV");
    function X() {
      var t = T.A;
      return t === null ? null : t.getOwner();
    }
    o(X, "getOwner");
    function I(t) {
      if (n.call(t, "key")) {
        var i = Object.getOwnPropertyDescriptor(t, "key").get;
        if (i && i.isReactWarning) return !1;
      }
      return t.key !== void 0;
    }
    o(I, "hasValidKey");
    function me(t, i) {
      function f() {
        ve || (ve = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          i
        ));
      }
      o(f, "warnAboutAccessingKey"), f.isReactWarning = !0, Object.defineProperty(t, "key", {
        get: f,
        configurable: !0
      });
    }
    o(me, "defineKeyPropWarningGetter");
    function Ae() {
      var t = S(this.type);
      return Ue[t] || (Ue[t] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), t = this.props.ref, t !== void 0 ? t : null;
    }
    o(Ae, "elementRefGetterWithDeprecationWarning");
    function Se(t, i, f, w, N, O) {
      return f = O.ref, t = {
        $$typeof: ie,
        type: t,
        key: i,
        props: O,
        _owner: N
      }, (f !== void 0 ? f : null) !== null ? Object.defineProperty(t, "ref", {
        enumerable: !1,
        get: Ae
      }) : Object.defineProperty(t, "ref", { enumerable: !1, value: null }), t._store = {}, Object.defineProperty(t._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(t, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.freeze && (Object.freeze(t.props), Object.freeze(t)), t;
    }
    o(Se, "ReactElement");
    function ge(t, i, f, w, N, O) {
      if (typeof t == "string" || typeof t == "function" || t === J || t === he || t === fe || t === ne || t === Z || t === q || typeof t == "object" && t !== null && (t.$$typeof === G || t.$$typeof === le || t.$$typeof === ye || t.$$typeof === x || t.$$typeof === ce || t.$$typeof === E || t.getModuleId !== void 0)) {
        var y = i.children;
        if (y !== void 0)
          if (w)
            if (p(y)) {
              for (w = 0; w < y.length; w++)
                D(y[w], t);
              Object.freeze && Object.freeze(y);
            } else
              console.error(
                "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
              );
          else D(y, t);
      } else
        y = "", (t === void 0 || typeof t == "object" && t !== null && Object.keys(t).length === 0) && (y += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports."), t === null ? w = "null" : p(t) ? w = "array" : t !== void 0 && t.$$typeof === ie ? (w = "<" + (S(t.type) || "Unknown") + " />", y = " Did you accidentally export a JSX literal instead of a component?") : w = typeof t, console.error(
          "React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s",
          w,
          y
        );
      if (n.call(i, "key")) {
        y = S(t);
        var v = Object.keys(i).filter(function(Y) {
          return Y !== "key";
        });
        w = 0 < v.length ? "{key: someKey, " + v.join(": ..., ") + ": ...}" : "{key: someKey}", Ne[y + w] || (v = 0 < v.length ? "{" + v.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          w,
          y,
          v,
          y
        ), Ne[y + w] = !0);
      }
      if (y = null, f !== void 0 && (ee(f), y = "" + f), I(i) && (ee(i.key), y = "" + i.key), "key" in i) {
        f = {};
        for (var K in i)
          K !== "key" && (f[K] = i[K]);
      } else f = i;
      return y && me(
        f,
        typeof t == "function" ? t.displayName || t.name || "Unknown" : t
      ), Se(t, y, O, N, X(), f);
    }
    o(ge, "jsxDEVImpl");
    function D(t, i) {
      if (typeof t == "object" && t && t.$$typeof !== Re) {
        if (p(t))
          for (var f = 0; f < t.length; f++) {
            var w = t[f];
            L(w) && re(w, i);
          }
        else if (L(t))
          t._store && (t._store.validated = 1);
        else if (t === null || typeof t != "object" ? f = null : (f = oe && t[oe] || t["@@iterator"], f = typeof f == "function" ? f : null), typeof f == "function" && f !== t.entries && (f = f.call(t), f !== t))
          for (; !(t = f.next()).done; )
            L(t.value) && re(t.value, i);
      }
    }
    o(D, "validateChildKeys");
    function L(t) {
      return typeof t == "object" && t !== null && t.$$typeof === ie;
    }
    o(L, "isValidElement");
    function re(t, i) {
      if (t._store && !t._store.validated && t.key == null && (t._store.validated = 1, i = V(i), !Pe[i])) {
        Pe[i] = !0;
        var f = "";
        t && t._owner != null && t._owner !== X() && (f = null, typeof t._owner.tag == "number" ? f = S(t._owner.type) : typeof t._owner.name == "string" && (f = t._owner.name), f = " It was passed a child from " + f + ".");
        var w = T.getCurrentStack;
        T.getCurrentStack = function() {
          var N = se(t.type);
          return w && (N += w() || ""), N;
        }, console.error(
          'Each child in a list should have a unique "key" prop.%s%s See https://react.dev/link/warning-keys for more information.',
          i,
          f
        ), T.getCurrentStack = w;
      }
    }
    o(re, "validateExplicitKey");
    function V(t) {
      var i = "", f = X();
      return f && (f = S(f.type)) && (i = `

Check the render method of \`` + f + "`."), i || (t = S(t)) && (i = `

Check the top-level render call using <` + t + ">."), i;
    }
    o(V, "getCurrentComponentErrorInfo");
    var ae = dt(), ie = Symbol.for("react.transitional.element"), A = Symbol.for("react.portal"), J = Symbol.for("react.fragment"), fe = Symbol.for("react.strict_mode"), he = Symbol.for("react.profiler"), x = Symbol.for("react.consumer"), ye = Symbol.for("react.context"), ce = Symbol.for("react.forward_ref"), ne = Symbol.for("react.suspense"), Z = Symbol.for("react.suspense_list"), le = Symbol.for("react.memo"), G = Symbol.for("react.lazy"), q = Symbol.for("react.offscreen"), oe = Symbol.iterator, je = Symbol.for("react.client.reference"), T = ae.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, n = Object.prototype.hasOwnProperty, s = Object.assign, E = Symbol.for("react.client.reference"), p = Array.isArray, h = 0, C, g, U, j, de, ke, _e;
    te.__reactDisabledLog = !0;
    var we, be, pe = !1, Te = new (typeof WeakMap == "function" ? WeakMap : Map)(), Re = Symbol.for("react.client.reference"), ve, Ue = {}, Ne = {}, Pe = {};
    Ye.Fragment = J, Ye.jsx = function(t, i, f, w, N) {
      return ge(t, i, f, !1, w, N);
    }, Ye.jsxs = function(t, i, f, w, N) {
      return ge(t, i, f, !0, w, N);
    };
  })()), Ye;
}
o(yt, "requireReactJsxRuntime_development");
var lt;
function _t() {
  return lt || (lt = 1, process.env.NODE_ENV === "production" ? $e.exports = mt() : $e.exports = yt()), $e.exports;
}
o(_t, "requireJsxRuntime");
var Tt = _t(), wt = dt();
const Rt = /* @__PURE__ */ Et(wt);
export {
  Rt as R,
  Tt as j
};
