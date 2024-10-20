import { proxy as y } from "valtio";
import { useSnapshot as k } from "valtio";
const g = { BASE_URL: "/", DEV: !1, MODE: "production", PROD: !0, SSR: !1 }, m = /* @__PURE__ */ new WeakMap();
function w(f, u, a) {
  const o = m.get(f);
  (g ? "production" : void 0) !== "production" && !o && console.warn("Please use proxy object");
  let i;
  const l = [], n = o[2];
  let s = !1;
  const t = n((e) => {
    l.push(e), i || (i = Promise.resolve().then(() => {
      i = void 0, s && u(l.splice(0));
    }));
  });
  return s = !0, () => {
    s = !1, t();
  };
}
let d;
function h(f, u) {
  let a = !0;
  const o = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Map(), l = () => {
    a && (a = !1, o.forEach((s) => s()), o.clear(), i.forEach((s) => s()), i.clear());
  }, n = async () => {
    if (!a)
      return;
    o.forEach((t) => t()), o.clear();
    const s = /* @__PURE__ */ new Set(), r = d;
    d = o;
    try {
      const t = f((c) => {
        if (s.add(c), a && !i.has(c)) {
          const p = w(c, n, u == null ? void 0 : u.sync);
          i.set(c, p);
        }
        return c;
      }), e = t && t instanceof Promise ? await t : t;
      e && (a ? o.add(e) : l());
    } finally {
      d = r;
    }
    i.forEach((t, e) => {
      s.has(e) || (i.delete(e), t());
    });
  };
  return d && d.add(l), n(), l;
}
const E = {
  use: (f) => {
  }
};
async function b(f) {
  const { state: u, getters: a, actions: o } = f, i = await u(), n = y(i);
  if (a) {
    const s = a(n), r = /* @__PURE__ */ new Map();
    for (const t in s) {
      const e = s[t], c = h((p) => {
        const v = e(p);
        n[t] !== v && (n[t] = v);
      });
      r.set(t, c);
    }
    Object.assign(n, {
      $underive(t) {
        for (const e of t)
          r.has(e) && (r.get(e)(), r.delete(e));
      },
      $invalidate(t) {
        for (const e of t) {
          r.has(e) && (r.get(e)(), r.delete(e));
          const c = s[e], p = h((v) => {
            const S = c(v);
            n[e] !== S && (n[e] = S);
          });
          r.set(e, p);
        }
      }
    });
  }
  return o && Object.assign(n, o), n;
}
export {
  b as defineStore,
  E as tawr,
  k as useSnapshot
};
