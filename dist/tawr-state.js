import { proxy as f, useSnapshot as g } from "valtio";
import { derive as s, underive as n } from "derive-valtio";
function x(r) {
  const { state: i, getters: a, actions: p } = r, t = f(i());
  if (a) {
    const o = a(t);
    s(o, {
      proxy: t
    }), t.$underive = (e) => {
      e && e.length > 0 ? n(t, { keys: e.map(String), delete: !0 }) : n(t);
    }, t.$invalidate = (e) => {
      if (e && e.length > 0) {
        n(t, { keys: e.map(String), delete: !0 });
        const c = {};
        for (const u of e)
          c[u] = o[u];
        s(c, { proxy: t });
      } else
        n(t), s(o, { proxy: t });
    };
  }
  return p && Object.assign(t, p), t;
}
const m = (r) => g(r);
export {
  x as defineStore,
  m as useSnapshot
};
