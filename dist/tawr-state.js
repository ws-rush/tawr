import { jsx as m, jsxs as v, Fragment as w } from "react/jsx-runtime";
import { proxy as A, useSnapshot as C } from "valtio";
import { derive as S, underive as d } from "derive-valtio";
import { Suspense as D, Component as b, use as k } from "react";
function I(c) {
  const {
    state: n,
    getters: s,
    actions: i
  } = c, t = A(n()), u = /* @__PURE__ */ new Set();
  if (s) {
    const a = s(t);
    S(a, {
      proxy: t
    }), t.$underive = (o) => {
      o && o.length > 0 ? d(t, {
        keys: o.map(String),
        delete: !0
      }) : d(t);
    }, t.$invalidate = (o) => {
      if (o && o.length > 0) {
        d(t, {
          keys: o.map(String),
          delete: !0
        });
        const p = {};
        for (const h of o)
          p[h] = a[h];
        S(p, { proxy: t });
      } else
        d(t), S(a, { proxy: t });
    };
  }
  if (t.$onAction = (a) => (u.add(a), () => {
    u.delete(a);
  }), i) {
    const a = {};
    for (const [o, p] of Object.entries(i)) {
      const h = (...x) => {
        let y = [], g = [];
        const E = {
          name: o,
          store: t,
          args: x,
          after: (e) => {
            y.push(e);
          },
          onError: (e) => {
            g.push(e);
          }
        };
        u.forEach((e) => {
          e(E);
        });
        let f;
        try {
          return f = p.apply(t, x), f instanceof Promise ? f.then((e) => (y.forEach((l) => l(e)), e)).catch((e) => {
            throw g.forEach((l) => l(e)), e;
          }) : (y.forEach((e) => e(f)), f);
        } catch (e) {
          throw g.forEach((l) => l(e)), e;
        }
      };
      a[o] = h;
    }
    Object.defineProperty(t, "actions", {
      value: a,
      enumerable: !0,
      configurable: !0
    });
  }
  return t;
}
const L = (c) => {
  const n = C(c), s = (r) => r && typeof r == "object" && "toISOString" in r && "getTime" in r, i = (r) => {
    if (!r || typeof r != "object") return r;
    if (s(r))
      return new Date(r.valueOf());
    if (Array.isArray(r))
      return r.map(i);
    const t = { ...r };
    for (const u in t)
      t[u] = i(t[u]);
    return t;
  };
  return i(n);
};
class F extends b {
  constructor(n) {
    super(n), this.state = { error: null };
  }
  static getDerivedStateFromError(n) {
    return { error: n };
  }
  componentDidCatch(n, s) {
    console.error("Error caught by boundary:", n, s);
  }
  render() {
    return this.state.error ? this.props.fallback(this.state.error) : this.props.children;
  }
}
function O({
  resolve: c,
  children: n
}) {
  const s = k(c);
  return /* @__PURE__ */ m(w, { children: n(s) });
}
function q({
  resolve: c,
  fallback: n = null,
  error: s = (r) => /* @__PURE__ */ v("div", { children: [
    "Error: ",
    r.message
  ] }),
  children: i
}) {
  return /* @__PURE__ */ m(F, { fallback: s, children: /* @__PURE__ */ m(D, { fallback: n, children: /* @__PURE__ */ m(
    O,
    {
      resolve: c,
      children: i
    }
  ) }) });
}
export {
  q as Awaitable,
  I as defineStore,
  L as useSnapshot
};
