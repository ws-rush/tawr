import { useRef as Ft, useState as Yt, useEffect as Bt, Suspense as Gt, Component as Jt, use as Ut } from "react";
import { jsx as j, jsxs as Qt, Fragment as qt } from "react/jsx-runtime";
/**
* @vue/shared v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function Xt(t) {
  const e = /* @__PURE__ */ Object.create(null);
  for (const n of t.split(",")) e[n] = 1;
  return (n) => n in e;
}
const Zt = process.env.NODE_ENV !== "production" ? Object.freeze({}) : {};
process.env.NODE_ENV !== "production" && Object.freeze([]);
const kt = () => {
}, ot = Object.assign, te = Object.prototype.hasOwnProperty, ct = (t, e) => te.call(t, e), D = Array.isArray, P = (t) => et(t) === "[object Map]", ee = (t) => et(t) === "[object Set]", St = (t) => typeof t == "function", ne = (t) => typeof t == "string", F = (t) => typeof t == "symbol", Y = (t) => t !== null && typeof t == "object", re = Object.prototype.toString, et = (t) => re.call(t), Rt = (t) => et(t).slice(8, -1), se = (t) => et(t) === "[object Object]", ht = (t) => ne(t) && t !== "NaN" && t[0] !== "-" && "" + parseInt(t, 10) === t, ie = (t) => {
  const e = /* @__PURE__ */ Object.create(null);
  return (n) => e[n] || (e[n] = t(n));
}, oe = ie((t) => t.charAt(0).toUpperCase() + t.slice(1)), V = (t, e) => !Object.is(t, e);
/**
* @vue/reactivity v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function y(t, ...e) {
  console.warn(`[Vue warn] ${t}`, ...e);
}
let p;
const rt = /* @__PURE__ */ new WeakSet();
class at {
  constructor(e) {
    this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0;
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, rt.has(this) && (rt.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || ce(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Dt(this), At(this);
    const e = p, n = b;
    p = this, b = !0;
    try {
      return this.fn();
    } finally {
      process.env.NODE_ENV !== "production" && p !== this && y(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), It(this), p = e, b = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let e = this.deps; e; e = e.nextDep)
        gt(e);
      this.deps = this.depsTail = void 0, Dt(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? rt.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    ft(this) && this.run();
  }
  get dirty() {
    return ft(this);
  }
}
let Vt = 0, H, C;
function ce(t, e = !1) {
  if (t.flags |= 8, e) {
    t.next = C, C = t;
    return;
  }
  t.next = H, H = t;
}
function vt() {
  Vt++;
}
function _t() {
  if (--Vt > 0)
    return;
  if (C) {
    let e = C;
    for (C = void 0; e; ) {
      const n = e.next;
      e.next = void 0, e.flags &= -9, e = n;
    }
  }
  let t;
  for (; H; ) {
    let e = H;
    for (H = void 0; e; ) {
      const n = e.next;
      if (e.next = void 0, e.flags &= -9, e.flags & 1)
        try {
          e.trigger();
        } catch (s) {
          t || (t = s);
        }
      e = n;
    }
  }
  if (t) throw t;
}
function At(t) {
  for (let e = t.deps; e; e = e.nextDep)
    e.version = -1, e.prevActiveLink = e.dep.activeLink, e.dep.activeLink = e;
}
function It(t) {
  let e, n = t.depsTail, s = n;
  for (; s; ) {
    const r = s.prevDep;
    s.version === -1 ? (s === n && (n = r), gt(s), fe(s)) : e = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = r;
  }
  t.deps = e, t.depsTail = n;
}
function ft(t) {
  for (let e = t.deps; e; e = e.nextDep)
    if (e.dep.version !== e.version || e.dep.computed && (ae(e.dep.computed) || e.dep.version !== e.version))
      return !0;
  return !!t._dirty;
}
function ae(t) {
  if (t.flags & 4 && !(t.flags & 16) || (t.flags &= -17, t.globalVersion === k))
    return;
  t.globalVersion = k;
  const e = t.dep;
  if (t.flags |= 2, e.version > 0 && !t.isSSR && t.deps && !ft(t)) {
    t.flags &= -3;
    return;
  }
  const n = p, s = b;
  p = t, b = !0;
  try {
    At(t);
    const r = t.fn(t._value);
    (e.version === 0 || V(r, t._value)) && (t._value = r, e.version++);
  } catch (r) {
    throw e.version++, r;
  } finally {
    p = n, b = s, It(t), t.flags &= -3;
  }
}
function gt(t, e = !1) {
  const { dep: n, prevSub: s, nextSub: r } = t;
  if (s && (s.nextSub = r, t.prevSub = void 0), r && (r.prevSub = s, t.nextSub = void 0), process.env.NODE_ENV !== "production" && n.subsHead === t && (n.subsHead = r), n.subs === t && (n.subs = s, !s && n.computed)) {
    n.computed.flags &= -5;
    for (let i = n.computed.deps; i; i = i.nextDep)
      gt(i, !0);
  }
  !e && !--n.sc && n.map && n.map.delete(n.key);
}
function fe(t) {
  const { prevDep: e, nextDep: n } = t;
  e && (e.nextDep = n, t.prevDep = void 0), n && (n.prevDep = e, t.nextDep = void 0);
}
function Ot(t, e) {
  t.effect instanceof at && (t = t.effect.fn);
  const n = new at(t);
  try {
    n.run();
  } catch (r) {
    throw n.stop(), r;
  }
  const s = n.run.bind(n);
  return s.effect = n, s;
}
function mt(t) {
  t.effect.stop();
}
let b = !0;
const Mt = [];
function jt() {
  Mt.push(b), b = !1;
}
function Pt() {
  const t = Mt.pop();
  b = t === void 0 ? !0 : t;
}
function Dt(t) {
  const { cleanup: e } = t;
  if (t.cleanup = void 0, e) {
    const n = p;
    p = void 0;
    try {
      e();
    } finally {
      p = n;
    }
  }
}
let k = 0;
class ue {
  constructor(e, n) {
    this.sub = e, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class le {
  constructor(e) {
    this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, process.env.NODE_ENV !== "production" && (this.subsHead = void 0);
  }
  track(e) {
    if (!p || !b || p === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== p)
      n = this.activeLink = new ue(p, this), p.deps ? (n.prevDep = p.depsTail, p.depsTail.nextDep = n, p.depsTail = n) : p.deps = p.depsTail = n, Kt(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const s = n.nextDep;
      s.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = s), n.prevDep = p.depsTail, n.nextDep = void 0, p.depsTail.nextDep = n, p.depsTail = n, p.deps === n && (p.deps = s);
    }
    return process.env.NODE_ENV !== "production" && p.onTrack && p.onTrack(
      ot(
        {
          effect: p
        },
        e
      )
    ), n;
  }
  trigger(e) {
    this.version++, k++, this.notify(e);
  }
  notify(e) {
    vt();
    try {
      if (process.env.NODE_ENV !== "production")
        for (let n = this.subsHead; n; n = n.nextSub)
          n.sub.onTrigger && !(n.sub.flags & 8) && n.sub.onTrigger(
            ot(
              {
                effect: n.sub
              },
              e
            )
          );
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      _t();
    }
  }
}
function Kt(t) {
  if (t.dep.sc++, t.sub.flags & 4) {
    const e = t.dep.computed;
    if (e && !t.dep.subs) {
      e.flags |= 20;
      for (let s = e.deps; s; s = s.nextDep)
        Kt(s);
    }
    const n = t.dep.subs;
    n !== t && (t.prevSub = n, n && (n.nextSub = t)), process.env.NODE_ENV !== "production" && t.dep.subsHead === void 0 && (t.dep.subsHead = t), t.dep.subs = t;
  }
}
const ut = /* @__PURE__ */ new WeakMap(), A = Symbol(
  process.env.NODE_ENV !== "production" ? "Object iterate" : ""
), lt = Symbol(
  process.env.NODE_ENV !== "production" ? "Map keys iterate" : ""
), z = Symbol(
  process.env.NODE_ENV !== "production" ? "Array iterate" : ""
);
function _(t, e, n) {
  if (b && p) {
    let s = ut.get(t);
    s || ut.set(t, s = /* @__PURE__ */ new Map());
    let r = s.get(n);
    r || (s.set(n, r = new le()), r.map = s, r.key = n), process.env.NODE_ENV !== "production" ? r.track({
      target: t,
      type: e,
      key: n
    }) : r.track();
  }
}
function O(t, e, n, s, r, i) {
  const o = ut.get(t);
  if (!o) {
    k++;
    return;
  }
  const c = (a) => {
    a && (process.env.NODE_ENV !== "production" ? a.trigger({
      target: t,
      type: e,
      key: n,
      newValue: s,
      oldValue: r,
      oldTarget: i
    }) : a.trigger());
  };
  if (vt(), e === "clear")
    o.forEach(c);
  else {
    const a = D(t), u = a && ht(n);
    if (a && n === "length") {
      const v = Number(s);
      o.forEach((f, h) => {
        (h === "length" || h === z || !F(h) && h >= v) && c(f);
      });
    } else
      switch ((n !== void 0 || o.has(void 0)) && c(o.get(n)), u && c(o.get(z)), e) {
        case "add":
          a ? u && c(o.get("length")) : (c(o.get(A)), P(t) && c(o.get(lt)));
          break;
        case "delete":
          a || (c(o.get(A)), P(t) && c(o.get(lt)));
          break;
        case "set":
          P(t) && c(o.get(A));
          break;
      }
  }
  _t();
}
function M(t) {
  const e = d(t);
  return e === t ? e : (_(e, "iterate", z), E(t) ? e : e.map(g));
}
function bt(t) {
  return _(t = d(t), "iterate", z), t;
}
const pe = {
  __proto__: null,
  [Symbol.iterator]() {
    return st(this, Symbol.iterator, g);
  },
  concat(...t) {
    return M(this).concat(
      ...t.map((e) => D(e) ? M(e) : e)
    );
  },
  entries() {
    return st(this, "entries", (t) => (t[1] = g(t[1]), t));
  },
  every(t, e) {
    return S(this, "every", t, e, void 0, arguments);
  },
  filter(t, e) {
    return S(this, "filter", t, e, (n) => n.map(g), arguments);
  },
  find(t, e) {
    return S(this, "find", t, e, g, arguments);
  },
  findIndex(t, e) {
    return S(this, "findIndex", t, e, void 0, arguments);
  },
  findLast(t, e) {
    return S(this, "findLast", t, e, g, arguments);
  },
  findLastIndex(t, e) {
    return S(this, "findLastIndex", t, e, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(t, e) {
    return S(this, "forEach", t, e, void 0, arguments);
  },
  includes(...t) {
    return it(this, "includes", t);
  },
  indexOf(...t) {
    return it(this, "indexOf", t);
  },
  join(t) {
    return M(this).join(t);
  },
  // keys() iterator only reads `length`, no optimisation required
  lastIndexOf(...t) {
    return it(this, "lastIndexOf", t);
  },
  map(t, e) {
    return S(this, "map", t, e, void 0, arguments);
  },
  pop() {
    return $(this, "pop");
  },
  push(...t) {
    return $(this, "push", t);
  },
  reduce(t, ...e) {
    return xt(this, "reduce", t, e);
  },
  reduceRight(t, ...e) {
    return xt(this, "reduceRight", t, e);
  },
  shift() {
    return $(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(t, e) {
    return S(this, "some", t, e, void 0, arguments);
  },
  splice(...t) {
    return $(this, "splice", t);
  },
  toReversed() {
    return M(this).toReversed();
  },
  toSorted(t) {
    return M(this).toSorted(t);
  },
  toSpliced(...t) {
    return M(this).toSpliced(...t);
  },
  unshift(...t) {
    return $(this, "unshift", t);
  },
  values() {
    return st(this, "values", g);
  }
};
function st(t, e, n) {
  const s = bt(t), r = s[e]();
  return s !== t && !E(t) && (r._next = r.next, r.next = () => {
    const i = r._next();
    return i.value && (i.value = n(i.value)), i;
  }), r;
}
const de = Array.prototype;
function S(t, e, n, s, r, i) {
  const o = bt(t), c = o !== t && !E(t), a = o[e];
  if (a !== de[e]) {
    const f = a.apply(t, i);
    return c ? g(f) : f;
  }
  let u = n;
  o !== t && (c ? u = function(f, h) {
    return n.call(this, g(f), h, t);
  } : n.length > 2 && (u = function(f, h) {
    return n.call(this, f, h, t);
  }));
  const v = a.call(o, u, s);
  return c && r ? r(v) : v;
}
function xt(t, e, n, s) {
  const r = bt(t);
  let i = n;
  return r !== t && (E(t) ? n.length > 3 && (i = function(o, c, a) {
    return n.call(this, o, c, a, t);
  }) : i = function(o, c, a) {
    return n.call(this, o, g(c), a, t);
  }), r[e](i, ...s);
}
function it(t, e, n) {
  const s = d(t);
  _(s, "iterate", z);
  const r = s[e](...n);
  return (r === -1 || r === !1) && Te(n[0]) ? (n[0] = d(n[0]), s[e](...n)) : r;
}
function $(t, e, n = []) {
  jt(), vt();
  const s = d(t)[e].apply(t, n);
  return _t(), Pt(), s;
}
const he = /* @__PURE__ */ Xt("__proto__,__v_isRef,__isVue"), Lt = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((t) => t !== "arguments" && t !== "caller").map((t) => Symbol[t]).filter(F)
);
function ve(t) {
  F(t) || (t = String(t));
  const e = d(this);
  return _(e, "has", t), e.hasOwnProperty(t);
}
class Wt {
  constructor(e = !1, n = !1) {
    this._isReadonly = e, this._isShallow = n;
  }
  get(e, n, s) {
    if (n === "__v_skip") return e.__v_skip;
    const r = this._isReadonly, i = this._isShallow;
    if (n === "__v_isReactive")
      return !r;
    if (n === "__v_isReadonly")
      return r;
    if (n === "__v_isShallow")
      return i;
    if (n === "__v_raw")
      return s === (r ? i ? xe : Ct : i ? De : Ht).get(e) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(e) === Object.getPrototypeOf(s) ? e : void 0;
    const o = D(e);
    if (!r) {
      let a;
      if (o && (a = pe[n]))
        return a;
      if (n === "hasOwnProperty")
        return ve;
    }
    const c = Reflect.get(
      e,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      x(e) ? e : s
    );
    return (F(n) ? Lt.has(n) : he(n)) || (r || _(e, "get", n), i) ? c : x(c) ? o && ht(n) ? c : c.value : Y(c) ? r ? Et(c) : wt(c) : c;
  }
}
class _e extends Wt {
  constructor(e = !1) {
    super(!1, e);
  }
  set(e, n, s, r) {
    let i = e[n];
    if (!this._isShallow) {
      const a = K(i);
      if (!E(s) && !K(s) && (i = d(i), s = d(s)), !D(e) && x(i) && !x(s))
        return a ? !1 : (i.value = s, !0);
    }
    const o = D(e) && ht(n) ? Number(n) < e.length : ct(e, n), c = Reflect.set(
      e,
      n,
      s,
      x(e) ? e : r
    );
    return e === d(r) && (o ? V(s, i) && O(e, "set", n, s, i) : O(e, "add", n, s)), c;
  }
  deleteProperty(e, n) {
    const s = ct(e, n), r = e[n], i = Reflect.deleteProperty(e, n);
    return i && s && O(e, "delete", n, void 0, r), i;
  }
  has(e, n) {
    const s = Reflect.has(e, n);
    return (!F(n) || !Lt.has(n)) && _(e, "has", n), s;
  }
  ownKeys(e) {
    return _(
      e,
      "iterate",
      D(e) ? "length" : A
    ), Reflect.ownKeys(e);
  }
}
class ge extends Wt {
  constructor(e = !1) {
    super(!0, e);
  }
  set(e, n) {
    return process.env.NODE_ENV !== "production" && y(
      `Set operation on key "${String(n)}" failed: target is readonly.`,
      e
    ), !0;
  }
  deleteProperty(e, n) {
    return process.env.NODE_ENV !== "production" && y(
      `Delete operation on key "${String(n)}" failed: target is readonly.`,
      e
    ), !0;
  }
}
const be = /* @__PURE__ */ new _e(), we = /* @__PURE__ */ new ge(), pt = (t) => t, Q = (t) => Reflect.getPrototypeOf(t);
function Ee(t, e, n) {
  return function(...s) {
    const r = this.__v_raw, i = d(r), o = P(i), c = t === "entries" || t === Symbol.iterator && o, a = t === "keys" && o, u = r[t](...s), v = n ? pt : e ? dt : g;
    return !e && _(
      i,
      "iterate",
      a ? lt : A
    ), {
      // iterator protocol
      next() {
        const { value: f, done: h } = u.next();
        return h ? { value: f, done: h } : {
          value: c ? [v(f[0]), v(f[1])] : v(f),
          done: h
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function q(t) {
  return function(...e) {
    if (process.env.NODE_ENV !== "production") {
      const n = e[0] ? `on key "${e[0]}" ` : "";
      y(
        `${oe(t)} operation ${n}failed: target is readonly.`,
        d(this)
      );
    }
    return t === "delete" ? !1 : t === "clear" ? void 0 : this;
  };
}
function Se(t, e) {
  const n = {
    get(r) {
      const i = this.__v_raw, o = d(i), c = d(r);
      t || (V(r, c) && _(o, "get", r), _(o, "get", c));
      const { has: a } = Q(o), u = e ? pt : t ? dt : g;
      if (a.call(o, r))
        return u(i.get(r));
      if (a.call(o, c))
        return u(i.get(c));
      i !== o && i.get(r);
    },
    get size() {
      const r = this.__v_raw;
      return !t && _(d(r), "iterate", A), Reflect.get(r, "size", r);
    },
    has(r) {
      const i = this.__v_raw, o = d(i), c = d(r);
      return t || (V(r, c) && _(o, "has", r), _(o, "has", c)), r === c ? i.has(r) : i.has(r) || i.has(c);
    },
    forEach(r, i) {
      const o = this, c = o.__v_raw, a = d(c), u = e ? pt : t ? dt : g;
      return !t && _(a, "iterate", A), c.forEach((v, f) => r.call(i, u(v), u(f), o));
    }
  };
  return ot(
    n,
    t ? {
      add: q("add"),
      set: q("set"),
      delete: q("delete"),
      clear: q("clear")
    } : {
      add(r) {
        !e && !E(r) && !K(r) && (r = d(r));
        const i = d(this);
        return Q(i).has.call(i, r) || (i.add(r), O(i, "add", r, r)), this;
      },
      set(r, i) {
        !e && !E(i) && !K(i) && (i = d(i));
        const o = d(this), { has: c, get: a } = Q(o);
        let u = c.call(o, r);
        u ? process.env.NODE_ENV !== "production" && yt(o, c, r) : (r = d(r), u = c.call(o, r));
        const v = a.call(o, r);
        return o.set(r, i), u ? V(i, v) && O(o, "set", r, i, v) : O(o, "add", r, i), this;
      },
      delete(r) {
        const i = d(this), { has: o, get: c } = Q(i);
        let a = o.call(i, r);
        a ? process.env.NODE_ENV !== "production" && yt(i, o, r) : (r = d(r), a = o.call(i, r));
        const u = c ? c.call(i, r) : void 0, v = i.delete(r);
        return a && O(i, "delete", r, void 0, u), v;
      },
      clear() {
        const r = d(this), i = r.size !== 0, o = process.env.NODE_ENV !== "production" ? P(r) ? new Map(r) : new Set(r) : void 0, c = r.clear();
        return i && O(
          r,
          "clear",
          void 0,
          void 0,
          o
        ), c;
      }
    }
  ), [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ].forEach((r) => {
    n[r] = Ee(r, t, e);
  }), n;
}
function $t(t, e) {
  const n = Se(t, e);
  return (s, r, i) => r === "__v_isReactive" ? !t : r === "__v_isReadonly" ? t : r === "__v_raw" ? s : Reflect.get(
    ct(n, r) && r in s ? n : s,
    r,
    i
  );
}
const Oe = {
  get: /* @__PURE__ */ $t(!1, !1)
}, me = {
  get: /* @__PURE__ */ $t(!0, !1)
};
function yt(t, e, n) {
  const s = d(n);
  if (s !== n && e.call(t, s)) {
    const r = Rt(t);
    y(
      `Reactive ${r} contains both the raw and reactive versions of the same object${r === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const Ht = /* @__PURE__ */ new WeakMap(), De = /* @__PURE__ */ new WeakMap(), Ct = /* @__PURE__ */ new WeakMap(), xe = /* @__PURE__ */ new WeakMap();
function ye(t) {
  switch (t) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function Ne(t) {
  return t.__v_skip || !Object.isExtensible(t) ? 0 : ye(Rt(t));
}
function wt(t) {
  return K(t) ? t : zt(
    t,
    !1,
    be,
    Oe,
    Ht
  );
}
function Et(t) {
  return zt(
    t,
    !0,
    we,
    me,
    Ct
  );
}
function zt(t, e, n, s, r) {
  if (!Y(t))
    return process.env.NODE_ENV !== "production" && y(
      `value cannot be made ${e ? "readonly" : "reactive"}: ${String(
        t
      )}`
    ), t;
  if (t.__v_raw && !(e && t.__v_isReactive))
    return t;
  const i = r.get(t);
  if (i)
    return i;
  const o = Ne(t);
  if (o === 0)
    return t;
  const c = new Proxy(
    t,
    o === 2 ? s : n
  );
  return r.set(t, c), c;
}
function Z(t) {
  return K(t) ? Z(t.__v_raw) : !!(t && t.__v_isReactive);
}
function K(t) {
  return !!(t && t.__v_isReadonly);
}
function E(t) {
  return !!(t && t.__v_isShallow);
}
function Te(t) {
  return t ? !!t.__v_raw : !1;
}
function d(t) {
  const e = t && t.__v_raw;
  return e ? d(e) : t;
}
const g = (t) => Y(t) ? wt(t) : t, dt = (t) => Y(t) ? Et(t) : t;
function x(t) {
  return t ? t.__v_isRef === !0 : !1;
}
const X = {}, tt = /* @__PURE__ */ new WeakMap();
let R;
function Re(t, e = !1, n = R) {
  if (n) {
    let s = tt.get(n);
    s || tt.set(n, s = []), s.push(t);
  } else process.env.NODE_ENV !== "production" && !e && y(
    "onWatcherCleanup() was called when there was no active watcher to associate with."
  );
}
function Ve(t, e, n = Zt) {
  const { immediate: s, deep: r, once: i, scheduler: o, augmentJob: c, call: a } = n, u = (l) => {
    (n.onWarn || y)(
      "Invalid watch source: ",
      l,
      "A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types."
    );
  }, v = (l) => r ? l : E(l) || r === !1 || r === 0 ? m(l, 1) : m(l);
  let f, h, L, B, G = !1, J = !1;
  if (x(t) ? (h = () => t.value, G = E(t)) : Z(t) ? (h = () => v(t), G = !0) : D(t) ? (J = !0, G = t.some((l) => Z(l) || E(l)), h = () => t.map((l) => {
    if (x(l))
      return l.value;
    if (Z(l))
      return v(l);
    if (St(l))
      return a ? a(l, 2) : l();
    process.env.NODE_ENV !== "production" && u(l);
  })) : St(t) ? e ? h = a ? () => a(t, 2) : t : h = () => {
    if (L) {
      jt();
      try {
        L();
      } finally {
        Pt();
      }
    }
    const l = R;
    R = f;
    try {
      return a ? a(t, 3, [B]) : t(B);
    } finally {
      R = l;
    }
  } : (h = kt, process.env.NODE_ENV !== "production" && u(t)), e && r) {
    const l = h, w = r === !0 ? 1 / 0 : r;
    h = () => m(l(), w);
  }
  const I = () => {
    f.stop();
  };
  if (i && e) {
    const l = e;
    e = (...w) => {
      l(...w), I();
    };
  }
  let N = J ? new Array(t.length).fill(X) : X;
  const W = (l) => {
    if (!(!(f.flags & 1) || !f.dirty && !l))
      if (e) {
        const w = f.run();
        if (r || G || (J ? w.some((nt, U) => V(nt, N[U])) : V(w, N))) {
          L && L();
          const nt = R;
          R = f;
          try {
            const U = [
              w,
              // pass undefined as the old value when it's changed for the first time
              N === X ? void 0 : J && N[0] === X ? [] : N,
              B
            ];
            a ? a(e, 3, U) : (
              // @ts-expect-error
              e(...U)
            ), N = w;
          } finally {
            R = nt;
          }
        }
      } else
        f.run();
  };
  return c && c(W), f = new at(h), f.scheduler = o ? () => o(W, !1) : W, B = (l) => Re(l, !1, f), L = f.onStop = () => {
    const l = tt.get(f);
    if (l) {
      if (a)
        a(l, 4);
      else
        for (const w of l) w();
      tt.delete(f);
    }
  }, process.env.NODE_ENV !== "production" && (f.onTrack = n.onTrack, f.onTrigger = n.onTrigger), e ? s ? W(!0) : N = f.run() : o ? o(W.bind(null, !0), !0) : f.run(), I.pause = f.pause.bind(f), I.resume = f.resume.bind(f), I.stop = I, I;
}
function m(t, e = 1 / 0, n) {
  if (e <= 0 || !Y(t) || t.__v_skip || (n = n || /* @__PURE__ */ new Set(), n.has(t)))
    return t;
  if (n.add(t), e--, x(t))
    m(t.value, e, n);
  else if (D(t))
    for (let s = 0; s < t.length; s++)
      m(t[s], e, n);
  else if (ee(t) || P(t))
    t.forEach((s) => {
      m(s, e, n);
    });
  else if (se(t)) {
    for (const s in t)
      m(t[s], e, n);
    for (const s of Object.getOwnPropertySymbols(t))
      Object.prototype.propertyIsEnumerable.call(t, s) && m(t[s], e, n);
  }
  return t;
}
function Ae(t) {
  const e = Et(t), n = Ft(/* @__PURE__ */ new Set()), [, s] = Yt(0);
  function r(o, c = "") {
    return new Proxy(o, {
      get(a, u) {
        return typeof u != "string" ? a[u] : typeof a[u] == "object" && a[u] !== null ? r(a[u], `${c}${u}.`) : (n.current.add(`${c}${u}`), typeof a[u] == "function" ? a[u].bind(o) : a[u]);
      }
    });
  }
  const i = r(e);
  return Bt(() => {
    const o = Ve(
      () => Array.from(n.current).map(
        (c) => c.split(".").reduce((a, u) => a == null ? void 0 : a[u], e)
      ),
      () => {
        s((c) => c + 1);
      }
    );
    return () => o();
  }, []), i;
}
const T = /* @__PURE__ */ new Map();
function je(t) {
  var r;
  const e = ((r = t.state) == null ? void 0 : r.call(t)) ?? {}, n = wt(e), s = {
    ...t.actions,
    $underive(i) {
      i.forEach((o) => {
        T.get(o) && mt(T.get(o)), T.delete(o);
      });
    },
    $invalidate(i) {
      i.forEach((o) => {
        T.get(o) && mt(T.get(o));
        const c = Ot(() => {
          var a;
          n[o] = (a = t.getters) == null ? void 0 : a[o](n);
        });
        T.set(o, c);
      });
    }
  };
  for (const i in s)
    n[i] = s[i].bind(n);
  if (t.getters)
    for (const i in t.getters) {
      const o = Ot(() => {
        var c;
        n[i] = (c = t.getters) == null ? void 0 : c[i](n);
      });
      T.set(i, o);
    }
  return [() => Ae(n), n];
}
class Nt extends Jt {
  constructor(e) {
    super(e), this.state = { error: null };
  }
  static getDerivedStateFromError(e) {
    return { error: e };
  }
  componentDidCatch(e, n) {
    console.error("Error caught by boundary:", e, n);
  }
  render() {
    return this.state.error ? this.props.fallback(this.state.error) : this.props.children;
  }
}
function Tt({
  resolve: t,
  children: e
}) {
  const n = t instanceof Promise ? Ut(t) : t;
  return /* @__PURE__ */ j(qt, { children: e(n) });
}
function Pe({
  resolve: t,
  fallback: e = null,
  error: n = (r) => /* @__PURE__ */ Qt("div", { children: [
    "Error: ",
    r.message
  ] }),
  children: s
}) {
  return e ? /* @__PURE__ */ j(Nt, { fallback: n, children: /* @__PURE__ */ j(Gt, { fallback: e, children: /* @__PURE__ */ j(Tt, { resolve: t, children: s }) }) }) : /* @__PURE__ */ j(Nt, { fallback: n, children: /* @__PURE__ */ j(Tt, { resolve: t, children: s }) });
}
export {
  Pe as Awaitable,
  je as defineStore,
  Ae as useSnapshot
};
