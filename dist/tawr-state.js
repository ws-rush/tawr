import { proxy as b, useSnapshot as y } from "valtio";
import { derive as h, underive as i } from "derive-valtio";
function A(p) {
  const {
    state: d,
    getters: g,
    actions: m
  } = p, t = b(d()), f = /* @__PURE__ */ new Set();
  if (g) {
    const o = g(t);
    h(o, {
      proxy: t
    }), t.$underive = (r) => {
      r && r.length > 0 ? i(t, {
        keys: r.map(String),
        delete: !0
      }) : i(t);
    }, t.$invalidate = (r) => {
      if (r && r.length > 0) {
        i(t, {
          keys: r.map(String),
          delete: !0
        });
        const a = {};
        for (const c of r)
          a[c] = o[c];
        h(a, { proxy: t });
      } else
        i(t), h(o, { proxy: t });
    };
  }
  if (t.$onAction = (o) => (f.add(o), () => {
    f.delete(o);
  }), m) {
    const o = {};
    for (const [r, a] of Object.entries(m)) {
      const c = (...S) => {
        let u = [], l = [];
        const x = {
          name: r,
          store: t,
          args: S,
          after: (e) => {
            u.push(e);
          },
          onError: (e) => {
            l.push(e);
          }
        };
        f.forEach((e) => {
          e(x);
        });
        let n;
        try {
          return n = a.apply(t, S), n instanceof Promise ? n.then((e) => (u.forEach((s) => s(e)), e)).catch((e) => {
            throw l.forEach((s) => s(e)), e;
          }) : (u.forEach((e) => e(n)), n);
        } catch (e) {
          throw l.forEach((s) => s(e)), e;
        }
      };
      o[r] = c;
    }
    Object.defineProperty(t, "actions", {
      value: o,
      enumerable: !0,
      configurable: !0
    }), Object.assign(t, o);
  }
  return t;
}
const $ = (p) => y(p);
export {
  A as defineStore,
  $ as useSnapshot
};
