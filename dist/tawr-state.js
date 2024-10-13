import { proxy as n } from "valtio";
import { useSnapshot as y } from "valtio";
import { derive as i } from "derive-valtio";
const f = {
  use: (o) => {
  }
};
function u(o) {
  const { state: s, getters: e, actions: r } = o, t = n(s());
  return e && i(e(t), {
    proxy: t
  }), r && Object.assign(t, r), t;
}
export {
  u as defineStore,
  f as tawr,
  y as useSnapshot
};
