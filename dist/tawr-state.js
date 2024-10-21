import { proxy as g } from "valtio";
import { useSnapshot as v } from "valtio";
import { derive as n, underive as r } from "derive-valtio";
function l(c) {
  const { state: f, getters: i, actions: s } = c, t = g(f());
  if (i) {
    const o = i(t);
    n(o, {
      proxy: t
    }), t.$underive = (e) => {
      e && e.length > 0 ? r(t, { keys: e.map(String), delete: !0 }) : r(t);
    }, t.$invalidate = (e) => {
      if (e && e.length > 0) {
        r(t, { keys: e.map(String), delete: !0 });
        const p = {};
        for (const a of e)
          p[a] = o[a];
        n(p, { proxy: t });
      } else
        r(t), n(o, { proxy: t });
    };
  }
  return s && Object.assign(t, s), t;
}
export {
  l as defineStore,
  v as useSnapshot
};
