import { useRef as Bt, useState as Rt, useEffect as Vt, Suspense as Gt, Component as Ut, use as Jt } from "react";
import { jsx as V, jsxs as Qt, Fragment as qt } from "react/jsx-runtime";
/**
* @vue/shared v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function Xt(t) {
  const e = /* @__PURE__ */ Object.create(null);
  for (const r of t.split(",")) e[r] = 1;
  return (r) => r in e;
}
const Zt = process.env.NODE_ENV !== "production" ? Object.freeze({}) : {};
process.env.NODE_ENV !== "production" && Object.freeze([]);
const kt = () => {
}, ot = Object.assign, te = Object.prototype.hasOwnProperty, ct = (t, e) => te.call(t, e), D = Array.isArray, P = (t) => et(t) === "[object Map]", ee = (t) => et(t) === "[object Set]", Ot = (t) => typeof t == "function", re = (t) => typeof t == "string", F = (t) => typeof t == "symbol", Y = (t) => t !== null && typeof t == "object", ne = Object.prototype.toString, et = (t) => ne.call(t), At = (t) => et(t).slice(8, -1), se = (t) => et(t) === "[object Object]", vt = (t) => re(t) && t !== "NaN" && t[0] !== "-" && "" + parseInt(t, 10) === t, ie = (t) => {
  const e = /* @__PURE__ */ Object.create(null);
  return (r) => e[r] || (e[r] = t(r));
}, oe = ie((t) => t.charAt(0).toUpperCase() + t.slice(1)), A = (t, e) => !Object.is(t, e);
/**
* @vue/reactivity v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function y(t, ...e) {
  console.warn(`[Vue warn] ${t}`, ...e);
}
let p;
const nt = /* @__PURE__ */ new WeakSet();
class at {
  constructor(e) {
    this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0;
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, nt.has(this) && (nt.delete(this), this.trigger()));
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
    this.flags |= 2, Dt(this), Mt(this);
    const e = p, r = b;
    p = this, b = !0;
    try {
      return this.fn();
    } finally {
      process.env.NODE_ENV !== "production" && p !== this && y(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), jt(this), p = e, b = r, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let e = this.deps; e; e = e.nextDep)
        bt(e);
      this.deps = this.depsTail = void 0, Dt(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? nt.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
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
let It = 0, H, C;
function ce(t, e = !1) {
  if (t.flags |= 8, e) {
    t.next = C, C = t;
    return;
  }
  t.next = H, H = t;
}
function _t() {
  It++;
}
function gt() {
  if (--It > 0)
    return;
  if (C) {
    let e = C;
    for (C = void 0; e; ) {
      const r = e.next;
      e.next = void 0, e.flags &= -9, e = r;
    }
  }
  let t;
  for (; H; ) {
    let e = H;
    for (H = void 0; e; ) {
      const r = e.next;
      if (e.next = void 0, e.flags &= -9, e.flags & 1)
        try {
          e.trigger();
        } catch (s) {
          t || (t = s);
        }
      e = r;
    }
  }
  if (t) throw t;
}
function Mt(t) {
  for (let e = t.deps; e; e = e.nextDep)
    e.version = -1, e.prevActiveLink = e.dep.activeLink, e.dep.activeLink = e;
}
function jt(t) {
  let e, r = t.depsTail, s = r;
  for (; s; ) {
    const n = s.prevDep;
    s.version === -1 ? (s === r && (r = n), bt(s), fe(s)) : e = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = n;
  }
  t.deps = e, t.depsTail = r;
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
  const r = p, s = b;
  p = t, b = !0;
  try {
    Mt(t);
    const n = t.fn(t._value);
    (e.version === 0 || A(n, t._value)) && (t._value = n, e.version++);
  } catch (n) {
    throw e.version++, n;
  } finally {
    p = r, b = s, jt(t), t.flags &= -3;
  }
}
function bt(t, e = !1) {
  const { dep: r, prevSub: s, nextSub: n } = t;
  if (s && (s.nextSub = n, t.prevSub = void 0), n && (n.prevSub = s, t.nextSub = void 0), process.env.NODE_ENV !== "production" && r.subsHead === t && (r.subsHead = n), r.subs === t && (r.subs = s, !s && r.computed)) {
    r.computed.flags &= -5;
    for (let i = r.computed.deps; i; i = i.nextDep)
      bt(i, !0);
  }
  !e && !--r.sc && r.map && r.map.delete(r.key);
}
function fe(t) {
  const { prevDep: e, nextDep: r } = t;
  e && (e.nextDep = r, t.prevDep = void 0), r && (r.prevDep = e, t.nextDep = void 0);
}
function ut(t, e) {
  t.effect instanceof at && (t = t.effect.fn);
  const r = new at(t);
  try {
    r.run();
  } catch (n) {
    throw r.stop(), n;
  }
  const s = r.run.bind(r);
  return s.effect = r, s;
}
function mt(t) {
  t.effect.stop();
}
let b = !0;
const Pt = [];
function Kt() {
  Pt.push(b), b = !1;
}
function Lt() {
  const t = Pt.pop();
  b = t === void 0 ? !0 : t;
}
function Dt(t) {
  const { cleanup: e } = t;
  if (t.cleanup = void 0, e) {
    const r = p;
    p = void 0;
    try {
      e();
    } finally {
      p = r;
    }
  }
}
let k = 0;
class ue {
  constructor(e, r) {
    this.sub = e, this.dep = r, this.version = r.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class le {
  constructor(e) {
    this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, process.env.NODE_ENV !== "production" && (this.subsHead = void 0);
  }
  track(e) {
    if (!p || !b || p === this.computed)
      return;
    let r = this.activeLink;
    if (r === void 0 || r.sub !== p)
      r = this.activeLink = new ue(p, this), p.deps ? (r.prevDep = p.depsTail, p.depsTail.nextDep = r, p.depsTail = r) : p.deps = p.depsTail = r, $t(r);
    else if (r.version === -1 && (r.version = this.version, r.nextDep)) {
      const s = r.nextDep;
      s.prevDep = r.prevDep, r.prevDep && (r.prevDep.nextDep = s), r.prevDep = p.depsTail, r.nextDep = void 0, p.depsTail.nextDep = r, p.depsTail = r, p.deps === r && (p.deps = s);
    }
    return process.env.NODE_ENV !== "production" && p.onTrack && p.onTrack(
      ot(
        {
          effect: p
        },
        e
      )
    ), r;
  }
  trigger(e) {
    this.version++, k++, this.notify(e);
  }
  notify(e) {
    _t();
    try {
      if (process.env.NODE_ENV !== "production")
        for (let r = this.subsHead; r; r = r.nextSub)
          r.sub.onTrigger && !(r.sub.flags & 8) && r.sub.onTrigger(
            ot(
              {
                effect: r.sub
              },
              e
            )
          );
      for (let r = this.subs; r; r = r.prevSub)
        r.sub.notify() && r.sub.dep.notify();
    } finally {
      gt();
    }
  }
}
function $t(t) {
  if (t.dep.sc++, t.sub.flags & 4) {
    const e = t.dep.computed;
    if (e && !t.dep.subs) {
      e.flags |= 20;
      for (let s = e.deps; s; s = s.nextDep)
        $t(s);
    }
    const r = t.dep.subs;
    r !== t && (t.prevSub = r, r && (r.nextSub = t)), process.env.NODE_ENV !== "production" && t.dep.subsHead === void 0 && (t.dep.subsHead = t), t.dep.subs = t;
  }
}
const lt = /* @__PURE__ */ new WeakMap(), I = Symbol(
  process.env.NODE_ENV !== "production" ? "Object iterate" : ""
), pt = Symbol(
  process.env.NODE_ENV !== "production" ? "Map keys iterate" : ""
), z = Symbol(
  process.env.NODE_ENV !== "production" ? "Array iterate" : ""
);
function _(t, e, r) {
  if (b && p) {
    let s = lt.get(t);
    s || lt.set(t, s = /* @__PURE__ */ new Map());
    let n = s.get(r);
    n || (s.set(r, n = new le()), n.map = s, n.key = r), process.env.NODE_ENV !== "production" ? n.track({
      target: t,
      type: e,
      key: r
    }) : n.track();
  }
}
function O(t, e, r, s, n, i) {
  const o = lt.get(t);
  if (!o) {
    k++;
    return;
  }
  const c = (a) => {
    a && (process.env.NODE_ENV !== "production" ? a.trigger({
      target: t,
      type: e,
      key: r,
      newValue: s,
      oldValue: n,
      oldTarget: i
    }) : a.trigger());
  };
  if (_t(), e === "clear")
    o.forEach(c);
  else {
    const a = D(t), u = a && vt(r);
    if (a && r === "length") {
      const v = Number(s);
      o.forEach((f, h) => {
        (h === "length" || h === z || !F(h) && h >= v) && c(f);
      });
    } else
      switch ((r !== void 0 || o.has(void 0)) && c(o.get(r)), u && c(o.get(z)), e) {
        case "add":
          a ? u && c(o.get("length")) : (c(o.get(I)), P(t) && c(o.get(pt)));
          break;
        case "delete":
          a || (c(o.get(I)), P(t) && c(o.get(pt)));
          break;
        case "set":
          P(t) && c(o.get(I));
          break;
      }
  }
  gt();
}
function j(t) {
  const e = d(t);
  return e === t ? e : (_(e, "iterate", z), E(t) ? e : e.map(g));
}
function wt(t) {
  return _(t = d(t), "iterate", z), t;
}
const pe = {
  __proto__: null,
  [Symbol.iterator]() {
    return st(this, Symbol.iterator, g);
  },
  concat(...t) {
    return j(this).concat(
      ...t.map((e) => D(e) ? j(e) : e)
    );
  },
  entries() {
    return st(this, "entries", (t) => (t[1] = g(t[1]), t));
  },
  every(t, e) {
    return S(this, "every", t, e, void 0, arguments);
  },
  filter(t, e) {
    return S(this, "filter", t, e, (r) => r.map(g), arguments);
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
    return j(this).join(t);
  },
  // keys() iterator only reads `length`, no optimisation required
  lastIndexOf(...t) {
    return it(this, "lastIndexOf", t);
  },
  map(t, e) {
    return S(this, "map", t, e, void 0, arguments);
  },
  pop() {
    return W(this, "pop");
  },
  push(...t) {
    return W(this, "push", t);
  },
  reduce(t, ...e) {
    return xt(this, "reduce", t, e);
  },
  reduceRight(t, ...e) {
    return xt(this, "reduceRight", t, e);
  },
  shift() {
    return W(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(t, e) {
    return S(this, "some", t, e, void 0, arguments);
  },
  splice(...t) {
    return W(this, "splice", t);
  },
  toReversed() {
    return j(this).toReversed();
  },
  toSorted(t) {
    return j(this).toSorted(t);
  },
  toSpliced(...t) {
    return j(this).toSpliced(...t);
  },
  unshift(...t) {
    return W(this, "unshift", t);
  },
  values() {
    return st(this, "values", g);
  }
};
function st(t, e, r) {
  const s = wt(t), n = s[e]();
  return s !== t && !E(t) && (n._next = n.next, n.next = () => {
    const i = n._next();
    return i.value && (i.value = r(i.value)), i;
  }), n;
}
const de = Array.prototype;
function S(t, e, r, s, n, i) {
  const o = wt(t), c = o !== t && !E(t), a = o[e];
  if (a !== de[e]) {
    const f = a.apply(t, i);
    return c ? g(f) : f;
  }
  let u = r;
  o !== t && (c ? u = function(f, h) {
    return r.call(this, g(f), h, t);
  } : r.length > 2 && (u = function(f, h) {
    return r.call(this, f, h, t);
  }));
  const v = a.call(o, u, s);
  return c && n ? n(v) : v;
}
function xt(t, e, r, s) {
  const n = wt(t);
  let i = r;
  return n !== t && (E(t) ? r.length > 3 && (i = function(o, c, a) {
    return r.call(this, o, c, a, t);
  }) : i = function(o, c, a) {
    return r.call(this, o, g(c), a, t);
  }), n[e](i, ...s);
}
function it(t, e, r) {
  const s = d(t);
  _(s, "iterate", z);
  const n = s[e](...r);
  return (n === -1 || n === !1) && Te(r[0]) ? (r[0] = d(r[0]), s[e](...r)) : n;
}
function W(t, e, r = []) {
  Kt(), _t();
  const s = d(t)[e].apply(t, r);
  return gt(), Lt(), s;
}
const he = /* @__PURE__ */ Xt("__proto__,__v_isRef,__isVue"), Wt = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((t) => t !== "arguments" && t !== "caller").map((t) => Symbol[t]).filter(F)
);
function ve(t) {
  F(t) || (t = String(t));
  const e = d(this);
  return _(e, "has", t), e.hasOwnProperty(t);
}
class Ht {
  constructor(e = !1, r = !1) {
    this._isReadonly = e, this._isShallow = r;
  }
  get(e, r, s) {
    if (r === "__v_skip") return e.__v_skip;
    const n = this._isReadonly, i = this._isShallow;
    if (r === "__v_isReactive")
      return !n;
    if (r === "__v_isReadonly")
      return n;
    if (r === "__v_isShallow")
      return i;
    if (r === "__v_raw")
      return s === (n ? i ? xe : Ft : i ? De : zt).get(e) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(e) === Object.getPrototypeOf(s) ? e : void 0;
    const o = D(e);
    if (!n) {
      let a;
      if (o && (a = pe[r]))
        return a;
      if (r === "hasOwnProperty")
        return ve;
    }
    const c = Reflect.get(
      e,
      r,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      x(e) ? e : s
    );
    return (F(r) ? Wt.has(r) : he(r)) || (n || _(e, "get", r), i) ? c : x(c) ? o && vt(r) ? c : c.value : Y(c) ? n ? St(c) : Et(c) : c;
  }
}
class _e extends Ht {
  constructor(e = !1) {
    super(!1, e);
  }
  set(e, r, s, n) {
    let i = e[r];
    if (!this._isShallow) {
      const a = K(i);
      if (!E(s) && !K(s) && (i = d(i), s = d(s)), !D(e) && x(i) && !x(s))
        return a ? !1 : (i.value = s, !0);
    }
    const o = D(e) && vt(r) ? Number(r) < e.length : ct(e, r), c = Reflect.set(
      e,
      r,
      s,
      x(e) ? e : n
    );
    return e === d(n) && (o ? A(s, i) && O(e, "set", r, s, i) : O(e, "add", r, s)), c;
  }
  deleteProperty(e, r) {
    const s = ct(e, r), n = e[r], i = Reflect.deleteProperty(e, r);
    return i && s && O(e, "delete", r, void 0, n), i;
  }
  has(e, r) {
    const s = Reflect.has(e, r);
    return (!F(r) || !Wt.has(r)) && _(e, "has", r), s;
  }
  ownKeys(e) {
    return _(
      e,
      "iterate",
      D(e) ? "length" : I
    ), Reflect.ownKeys(e);
  }
}
class ge extends Ht {
  constructor(e = !1) {
    super(!0, e);
  }
  set(e, r) {
    return process.env.NODE_ENV !== "production" && y(
      `Set operation on key "${String(r)}" failed: target is readonly.`,
      e
    ), !0;
  }
  deleteProperty(e, r) {
    return process.env.NODE_ENV !== "production" && y(
      `Delete operation on key "${String(r)}" failed: target is readonly.`,
      e
    ), !0;
  }
}
const be = /* @__PURE__ */ new _e(), we = /* @__PURE__ */ new ge(), dt = (t) => t, Q = (t) => Reflect.getPrototypeOf(t);
function Ee(t, e, r) {
  return function(...s) {
    const n = this.__v_raw, i = d(n), o = P(i), c = t === "entries" || t === Symbol.iterator && o, a = t === "keys" && o, u = n[t](...s), v = r ? dt : e ? ht : g;
    return !e && _(
      i,
      "iterate",
      a ? pt : I
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
      const r = e[0] ? `on key "${e[0]}" ` : "";
      y(
        `${oe(t)} operation ${r}failed: target is readonly.`,
        d(this)
      );
    }
    return t === "delete" ? !1 : t === "clear" ? void 0 : this;
  };
}
function Se(t, e) {
  const r = {
    get(n) {
      const i = this.__v_raw, o = d(i), c = d(n);
      t || (A(n, c) && _(o, "get", n), _(o, "get", c));
      const { has: a } = Q(o), u = e ? dt : t ? ht : g;
      if (a.call(o, n))
        return u(i.get(n));
      if (a.call(o, c))
        return u(i.get(c));
      i !== o && i.get(n);
    },
    get size() {
      const n = this.__v_raw;
      return !t && _(d(n), "iterate", I), Reflect.get(n, "size", n);
    },
    has(n) {
      const i = this.__v_raw, o = d(i), c = d(n);
      return t || (A(n, c) && _(o, "has", n), _(o, "has", c)), n === c ? i.has(n) : i.has(n) || i.has(c);
    },
    forEach(n, i) {
      const o = this, c = o.__v_raw, a = d(c), u = e ? dt : t ? ht : g;
      return !t && _(a, "iterate", I), c.forEach((v, f) => n.call(i, u(v), u(f), o));
    }
  };
  return ot(
    r,
    t ? {
      add: q("add"),
      set: q("set"),
      delete: q("delete"),
      clear: q("clear")
    } : {
      add(n) {
        !e && !E(n) && !K(n) && (n = d(n));
        const i = d(this);
        return Q(i).has.call(i, n) || (i.add(n), O(i, "add", n, n)), this;
      },
      set(n, i) {
        !e && !E(i) && !K(i) && (i = d(i));
        const o = d(this), { has: c, get: a } = Q(o);
        let u = c.call(o, n);
        u ? process.env.NODE_ENV !== "production" && yt(o, c, n) : (n = d(n), u = c.call(o, n));
        const v = a.call(o, n);
        return o.set(n, i), u ? A(i, v) && O(o, "set", n, i, v) : O(o, "add", n, i), this;
      },
      delete(n) {
        const i = d(this), { has: o, get: c } = Q(i);
        let a = o.call(i, n);
        a ? process.env.NODE_ENV !== "production" && yt(i, o, n) : (n = d(n), a = o.call(i, n));
        const u = c ? c.call(i, n) : void 0, v = i.delete(n);
        return a && O(i, "delete", n, void 0, u), v;
      },
      clear() {
        const n = d(this), i = n.size !== 0, o = process.env.NODE_ENV !== "production" ? P(n) ? new Map(n) : new Set(n) : void 0, c = n.clear();
        return i && O(
          n,
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
  ].forEach((n) => {
    r[n] = Ee(n, t, e);
  }), r;
}
function Ct(t, e) {
  const r = Se(t, e);
  return (s, n, i) => n === "__v_isReactive" ? !t : n === "__v_isReadonly" ? t : n === "__v_raw" ? s : Reflect.get(
    ct(r, n) && n in s ? r : s,
    n,
    i
  );
}
const Oe = {
  get: /* @__PURE__ */ Ct(!1, !1)
}, me = {
  get: /* @__PURE__ */ Ct(!0, !1)
};
function yt(t, e, r) {
  const s = d(r);
  if (s !== r && e.call(t, s)) {
    const n = At(t);
    y(
      `Reactive ${n} contains both the raw and reactive versions of the same object${n === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const zt = /* @__PURE__ */ new WeakMap(), De = /* @__PURE__ */ new WeakMap(), Ft = /* @__PURE__ */ new WeakMap(), xe = /* @__PURE__ */ new WeakMap();
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
  return t.__v_skip || !Object.isExtensible(t) ? 0 : ye(At(t));
}
function Et(t) {
  return K(t) ? t : Yt(
    t,
    !1,
    be,
    Oe,
    zt
  );
}
function St(t) {
  return Yt(
    t,
    !0,
    we,
    me,
    Ft
  );
}
function Yt(t, e, r, s, n) {
  if (!Y(t))
    return process.env.NODE_ENV !== "production" && y(
      `value cannot be made ${e ? "readonly" : "reactive"}: ${String(
        t
      )}`
    ), t;
  if (t.__v_raw && !(e && t.__v_isReactive))
    return t;
  const i = n.get(t);
  if (i)
    return i;
  const o = Ne(t);
  if (o === 0)
    return t;
  const c = new Proxy(
    t,
    o === 2 ? s : r
  );
  return n.set(t, c), c;
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
const g = (t) => Y(t) ? Et(t) : t, ht = (t) => Y(t) ? St(t) : t;
function x(t) {
  return t ? t.__v_isRef === !0 : !1;
}
const X = {}, tt = /* @__PURE__ */ new WeakMap();
let R;
function Re(t, e = !1, r = R) {
  if (r) {
    let s = tt.get(r);
    s || tt.set(r, s = []), s.push(t);
  } else process.env.NODE_ENV !== "production" && !e && y(
    "onWatcherCleanup() was called when there was no active watcher to associate with."
  );
}
function Ve(t, e, r = Zt) {
  const { immediate: s, deep: n, once: i, scheduler: o, augmentJob: c, call: a } = r, u = (l) => {
    (r.onWarn || y)(
      "Invalid watch source: ",
      l,
      "A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types."
    );
  }, v = (l) => n ? l : E(l) || n === !1 || n === 0 ? m(l, 1) : m(l);
  let f, h, L, B, G = !1, U = !1;
  if (x(t) ? (h = () => t.value, G = E(t)) : Z(t) ? (h = () => v(t), G = !0) : D(t) ? (U = !0, G = t.some((l) => Z(l) || E(l)), h = () => t.map((l) => {
    if (x(l))
      return l.value;
    if (Z(l))
      return v(l);
    if (Ot(l))
      return a ? a(l, 2) : l();
    process.env.NODE_ENV !== "production" && u(l);
  })) : Ot(t) ? e ? h = a ? () => a(t, 2) : t : h = () => {
    if (L) {
      Kt();
      try {
        L();
      } finally {
        Lt();
      }
    }
    const l = R;
    R = f;
    try {
      return a ? a(t, 3, [B]) : t(B);
    } finally {
      R = l;
    }
  } : (h = kt, process.env.NODE_ENV !== "production" && u(t)), e && n) {
    const l = h, w = n === !0 ? 1 / 0 : n;
    h = () => m(l(), w);
  }
  const M = () => {
    f.stop();
  };
  if (i && e) {
    const l = e;
    e = (...w) => {
      l(...w), M();
    };
  }
  let N = U ? new Array(t.length).fill(X) : X;
  const $ = (l) => {
    if (!(!(f.flags & 1) || !f.dirty && !l))
      if (e) {
        const w = f.run();
        if (n || G || (U ? w.some((rt, J) => A(rt, N[J])) : A(w, N))) {
          L && L();
          const rt = R;
          R = f;
          try {
            const J = [
              w,
              // pass undefined as the old value when it's changed for the first time
              N === X ? void 0 : U && N[0] === X ? [] : N,
              B
            ];
            a ? a(e, 3, J) : (
              // @ts-expect-error
              e(...J)
            ), N = w;
          } finally {
            R = rt;
          }
        }
      } else
        f.run();
  };
  return c && c($), f = new at(h), f.scheduler = o ? () => o($, !1) : $, B = (l) => Re(l, !1, f), L = f.onStop = () => {
    const l = tt.get(f);
    if (l) {
      if (a)
        a(l, 4);
      else
        for (const w of l) w();
      tt.delete(f);
    }
  }, process.env.NODE_ENV !== "production" && (f.onTrack = r.onTrack, f.onTrigger = r.onTrigger), e ? s ? $(!0) : N = f.run() : o ? o($.bind(null, !0), !0) : f.run(), M.pause = f.pause.bind(f), M.resume = f.resume.bind(f), M.stop = M, M;
}
function m(t, e = 1 / 0, r) {
  if (e <= 0 || !Y(t) || t.__v_skip || (r = r || /* @__PURE__ */ new Set(), r.has(t)))
    return t;
  if (r.add(t), e--, x(t))
    m(t.value, e, r);
  else if (D(t))
    for (let s = 0; s < t.length; s++)
      m(t[s], e, r);
  else if (ee(t) || P(t))
    t.forEach((s) => {
      m(s, e, r);
    });
  else if (se(t)) {
    for (const s in t)
      m(t[s], e, r);
    for (const s of Object.getOwnPropertySymbols(t))
      Object.prototype.propertyIsEnumerable.call(t, s) && m(t[s], e, r);
  }
  return t;
}
function Ae(t) {
  const e = St(t), r = Bt(/* @__PURE__ */ new Set()), [, s] = Rt(0);
  function n(o, c = "") {
    return new Proxy(o, {
      get(a, u) {
        return typeof u != "string" ? a[u] : typeof a[u] == "object" && a[u] !== null ? n(a[u], `${c}${u}.`) : (r.current.add(`${c}${u}`), typeof a[u] == "function" ? a[u].bind(o) : a[u]);
      }
    });
  }
  const i = n(e);
  return Vt(() => {
    const o = Ve(
      () => Array.from(r.current).map(
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
  var n;
  const e = ((n = t.state) == null ? void 0 : n.call(t)) ?? {}, r = Et(e), s = {
    ...t.actions,
    $underive(i) {
      i.forEach((o) => {
        T.get(o) && mt(T.get(o)), T.delete(o);
      });
    },
    $invalidate(i) {
      i.forEach((o) => {
        T.get(o) && mt(T.get(o));
        const c = ut(() => {
          var a;
          r[o] = (a = t.getters) == null ? void 0 : a[o](r);
        });
        T.set(o, c);
      });
    }
  };
  for (const i in s)
    r[i] = s[i].bind(r);
  if (t.getters)
    for (const i in t.getters) {
      const o = ut(() => {
        var c;
        r[i] = (c = t.getters) == null ? void 0 : c[i](r);
      });
      T.set(i, o);
    }
  return [() => Ae(r), r];
}
class Nt extends Ut {
  constructor(e) {
    super(e), this.state = { error: null };
  }
  static getDerivedStateFromError(e) {
    return { error: e };
  }
  componentDidCatch(e, r) {
    console.error("Error caught by boundary:", e, r);
  }
  render() {
    return this.state.error ? this.props.fallback(this.state.error) : this.props.children;
  }
}
function Tt({
  resolve: t,
  children: e
}) {
  const r = t instanceof Promise ? Jt(t) : t;
  return /* @__PURE__ */ V(qt, { children: e(r) });
}
function Pe({
  resolve: t,
  fallback: e = null,
  error: r = (n) => /* @__PURE__ */ Qt("div", { children: [
    "Error: ",
    n.message
  ] }),
  children: s
}) {
  return e ? /* @__PURE__ */ V(Nt, { fallback: r, children: /* @__PURE__ */ V(Gt, { fallback: e, children: /* @__PURE__ */ V(Tt, { resolve: t, children: s }) }) }) : /* @__PURE__ */ V(Nt, { fallback: r, children: /* @__PURE__ */ V(Tt, { resolve: t, children: s }) });
}
const Ke = (t) => (e) => {
  const [, r] = Rt(0);
  return Vt(() => {
    const s = ut(() => {
      t(), r((n) => n + 1);
    });
    return () => {
      s();
    };
  }, []), /* @__PURE__ */ V(t, { ...e });
};
export {
  Pe as Awaitable,
  Ke as _observer,
  je as defineStore,
  Ae as useSnapshot
};
