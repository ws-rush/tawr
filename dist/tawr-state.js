import { jsx as h, jsxs as E, Fragment as v } from "react/jsx-runtime";
import { proxy as w, useSnapshot as A } from "valtio";
import { derive as g, underive as f } from "derive-valtio";
import { Suspense as C, Component as j, use as F } from "react";
function T(s) {
  const {
    state: e,
    getters: a,
    actions: u
  } = s, t = w(e()), d = /* @__PURE__ */ new Set();
  if (a) {
    const o = a(t);
    g(o, {
      proxy: t
    }), t.$underive = (n) => {
      n && n.length > 0 ? f(t, {
        keys: n.map(String),
        delete: !0
      }) : f(t);
    }, t.$invalidate = (n) => {
      if (n && n.length > 0) {
        f(t, {
          keys: n.map(String),
          delete: !0
        });
        const l = {};
        for (const p of n)
          l[p] = o[p];
        g(l, { proxy: t });
      } else
        f(t), g(o, { proxy: t });
    };
  }
  if (t.$onAction = (o) => (d.add(o), () => {
    d.delete(o);
  }), u) {
    const o = {};
    for (const [n, l] of Object.entries(u)) {
      const p = (...S) => {
        let m = [], b = [];
        const y = {
          name: n,
          store: t,
          args: S,
          after: (r) => {
            m.push(r);
          },
          onError: (r) => {
            b.push(r);
          }
        };
        d.forEach((r) => {
          r(y);
        });
        let c;
        try {
          return c = l.apply(t, S), c instanceof Promise ? c.then((r) => (m.forEach((i) => i(r)), r)).catch((r) => {
            throw b.forEach((i) => i(r)), r;
          }) : (m.forEach((r) => r(c)), c);
        } catch (r) {
          throw b.forEach((i) => i(r)), r;
        }
      };
      o[n] = p;
    }
    Object.defineProperty(t, "actions", {
      value: o,
      enumerable: !0,
      configurable: !0
    }), Object.assign(t, o);
  }
  return t;
}
const q = (s) => A(s);
class $ extends j {
  constructor(e) {
    super(e), this.state = { error: null };
  }
  static getDerivedStateFromError(e) {
    return { error: e };
  }
  componentDidCatch(e, a) {
    console.error("Error caught by boundary:", e, a);
  }
  render() {
    return this.state.error ? this.props.fallback(this.state.error) : this.props.children;
  }
}
function D({
  resolve: s,
  children: e
}) {
  const a = F(s);
  return /* @__PURE__ */ h(v, { children: e(a) });
}
function z({
  resolve: s,
  fallback: e = null,
  error: a = (x) => /* @__PURE__ */ E("div", { children: [
    "Error: ",
    x.message
  ] }),
  children: u
}) {
  return /* @__PURE__ */ h($, { fallback: a, children: /* @__PURE__ */ h(C, { fallback: e, children: /* @__PURE__ */ h(
    D,
    {
      resolve: s,
      children: u
    }
  ) }) });
}
export {
  z as Awaitable,
  T as defineStore,
  q as useSnapshot
};
