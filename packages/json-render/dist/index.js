import { AppsSDKButton as p, AppsSDKInput as A, Label as C, AppsSDKBadge as D, Separator as T, Card as u, CardHeader as S, CardTitle as h, CardDescription as f, CardContent as m, CardFooter as b, Alert as I, AlertTitle as F, AlertDescription as v, Tabs as y, TabsList as R, TabsTrigger as k, TabsContent as x, Select as B, SelectTrigger as G, SelectValue as H, SelectContent as K, SelectItem as L, Switch as w, AppsSDKCheckbox as P, RadioGroup as V, RadioGroupItem as j, Slider as J, Progress as $, Avatar as q, AvatarImage as z, AvatarFallback as E, Dialog as M, DialogTrigger as N, DialogContent as O, DialogHeader as Q, DialogTitle as U, DialogDescription as W, DialogFooter as X, Accordion as Y, AccordionItem as Z, AccordionTrigger as _, AccordionContent as rr } from "@design-studio/ui";
import { createRegistry as er } from "./registry.js";
import { jsx as c, Fragment as tr } from "react/jsx-runtime";
import { Fragment as ir } from "react";
const r = er();
r.register("Button", p);
r.register("Input", A);
r.register("Label", C);
r.register("Badge", D);
r.register("Separator", T);
r.register("Card", u);
r.register("CardHeader", S);
r.register("CardTitle", h);
r.register("CardDescription", f);
r.register("CardContent", m);
r.register("CardFooter", b);
r.register("Alert", I);
r.register("AlertTitle", F);
r.register("AlertDescription", v);
r.register("Tabs", y);
r.register("TabsList", R);
r.register("TabsTrigger", k);
r.register("TabsContent", x);
r.register("Select", B);
r.register("SelectTrigger", G);
r.register("SelectValue", H);
r.register("SelectContent", K);
r.register("SelectItem", L);
r.register("Switch", w);
r.register("Checkbox", P);
r.register("RadioGroup", V);
r.register("RadioGroupItem", j);
r.register("Slider", J);
r.register("Progress", $);
r.register("Avatar", q);
r.register("AvatarImage", z);
r.register("AvatarFallback", E);
r.register("Dialog", M);
r.register("DialogTrigger", N);
r.register("DialogContent", O);
r.register("DialogHeader", Q);
r.register("DialogTitle", U);
r.register("DialogDescription", W);
r.register("DialogFooter", X);
r.register("Accordion", Y);
r.register("AccordionItem", Z);
r.register("AccordionTrigger", _);
r.register("AccordionContent", rr);
r.register("div", "div");
r.register("span", "span");
r.register("p", "p");
r.register("h1", "h1");
r.register("h2", "h2");
r.register("h3", "h3");
r.register("h4", "h4");
r.register("h5", "h5");
r.register("h6", "h6");
function s(e, i = r, a) {
  const o = i.get(e.component);
  if (!o)
    return null;
  const { children: t, ...d } = e.props || {};
  let g = null;
  return e.children ? typeof e.children == "string" ? g = e.children : Array.isArray(e.children) && (g = e.children.map(
    (n, l) => s(n, i, l)
  )) : t && (typeof t == "string" ? g = t : Array.isArray(t) && (g = t.map(
    (n, l) => s(n, i, l)
  ))), /* @__PURE__ */ c(o, { ...d, children: g }, a);
}
function nr({
  schema: e,
  registry: i = r,
  fallback: a = null
}) {
  try {
    return Array.isArray(e) ? /* @__PURE__ */ c(ir, { children: e.map((o, t) => s(o, i, t)) }) : s(e, i);
  } catch {
    return /* @__PURE__ */ c(tr, { children: a });
  }
}
export {
  nr as JsonRender,
  er as createRegistry,
  r as defaultRegistry
};
