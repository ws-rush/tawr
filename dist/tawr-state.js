import { proxy as n } from "valtio";
import { useSnapshot as u } from "valtio";
import { derive as i } from "derive-valtio";
function f(r) {
  const { state: s, getters: o, actions: e } = r, t = n(s());
  return o && i(o(t), {
    proxy: t
  }), e && Object.assign(t, e), t;
}
export {
  f as defineStore,
  u as useSnapshot
};
