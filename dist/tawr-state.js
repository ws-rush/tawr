import { jsx as h, jsxs as E, Fragment as v } from "react/jsx-runtime";
import { proxy as w, useSnapshot as A } from "valtio";
import { derive as g, underive as f } from "derive-valtio";
import { Suspense as C, Component as j, use as F } from "react";
function T(s) {
  const {
    state: e,
    getters: a,
    actions: u
  } = s, r = w(e()), d = /* @__PURE__ */ new Set();
  if (a) {
    const n = a(r);
    g(n, {
      proxy: r
    }), r.$underive = (o) => {
      o && o.length > 0 ? f(r, {
        keys: o.map(String),
        delete: !0
      }) : f(r);
    }, r.$invalidate = (o) => {
      if (o && o.length > 0) {
        f(r, {
          keys: o.map(String),
          delete: !0
        });
        const l = {};
        for (const p of o)
          l[p] = n[p];
        g(l, { proxy: r });
      } else
        f(r), g(n, { proxy: r });
    };
  }
  if (r.$onAction = (n) => (d.add(n), () => {
    d.delete(n);
  }), u) {
    const n = {};
    for (const [o, l] of Object.entries(u)) {
      const p = (...S) => {
        let m = [], b = [];
        const y = {
          name: o,
          store: r,
          args: S,
          after: (t) => {
            m.push(t);
          },
          onError: (t) => {
            b.push(t);
          }
        };
        d.forEach((t) => {
          t(y);
        });
        let c;
        try {
          return c = l.apply(r, S), c instanceof Promise ? c.then((t) => (m.forEach((i) => i(t)), t)).catch((t) => {
            throw b.forEach((i) => i(t)), t;
          }) : (m.forEach((t) => t(c)), c);
        } catch (t) {
          throw b.forEach((i) => i(t)), t;
        }
      };
      n[o] = p;
    }
    Object.defineProperty(r, "actions", {
      value: n,
      enumerable: !0,
      configurable: !0
    });
  }
  return r;
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
