import { proxy as a } from "valtio";
import { useSnapshot as S } from "valtio";
import { derive as i } from "derive-valtio";
const u = {
  use: (o) => {
  }
};
async function x(o) {
  const { state: n, getters: e, actions: r } = o, s = await n(), t = a(s);
  return e && i(e(t), {
    proxy: t
  }), r && Object.assign(t, r), t;
}
export {
  x as defineStore,
  u as tawr,
  S as useSnapshot
};
